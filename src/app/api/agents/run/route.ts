import { NextResponse } from 'next/server';
import { getAuthenticatedClient, getOrgId } from '@/lib/supabase/api-utils';
import { getAnthropicClient } from '@/lib/agents/client';
import { getAgentPrompt } from '@/lib/agents/prompts';
import { agentTools } from '@/lib/agents/tools';
import type { AgentType } from '@/lib/types';
import * as mock from '@/lib/mock-data';

export async function POST(request: Request) {
  try {
    const auth = await getAuthenticatedClient();
    const body = await request.json();
    const { agentType, task } = body as { agentType: AgentType; task: string };

    if (!agentType || !task) {
      return NextResponse.json({ error: 'agentType and task are required' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === 'proxy-injected') {
      return NextResponse.json({
        response: `## ${agentType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} Agent Analysis\n\nBased on Bay Area Literacy Coalition's data:\n- Annual Budget: $${mock.organization.financials.annualBudget.toLocaleString()}\n- Revenue: $${mock.organization.financials.totalRevenue.toLocaleString()}\n- ${mock.programs.length} active programs serving ${mock.programs.reduce((s, p) => s + p.clientsServed, 0).toLocaleString()} clients\n\n*This is a demo response. Connect your Anthropic API key for live AI analysis.*`,
        actions: [],
        stopReason: 'end_turn',
      });
    }

    let orgContext = '';
    if (!('error' in auth)) {
      const orgId = await getOrgId(auth.supabase, auth.user.id);
      if (orgId) {
        const { data: org } = await auth.supabase.from('organizations').select('*').eq('id', orgId).single();
        if (org) orgContext = `Organization: ${JSON.stringify(org)}`;
      }
    }

    if (!orgContext) {
      orgContext = `Organization: ${JSON.stringify(mock.organization)}
Programs: ${JSON.stringify(mock.programs)}
Grants: ${JSON.stringify(mock.grants)}
Dashboard Stats: ${JSON.stringify(mock.dashboardStats)}`;
    }

    const systemPrompt = `${getAgentPrompt(agentType)}

Current organization context:
${orgContext}`;

    const anthropic = getAnthropicClient();

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      tools: agentTools,
      messages: [{ role: 'user', content: task }],
    });

    const actions: Array<{ action: string; description: string; evidence: string; estimated_value?: number }> = [];
    let textContent = '';

    for (const block of response.content) {
      if (block.type === 'text') {
        textContent += block.text;
      } else if (block.type === 'tool_use' && block.name === 'create_action') {
        actions.push(block.input as { action: string; description: string; evidence: string; estimated_value?: number });
      }
    }

    if (!('error' in auth) && actions.length > 0) {
      const orgId = await getOrgId(auth.supabase, auth.user.id);
      if (orgId) {
        const { data: config } = await auth.supabase
          .from('agent_configs')
          .select('approval_threshold')
          .eq('organization_id', orgId)
          .eq('type', agentType)
          .single();

        const threshold = config?.approval_threshold ?? 0;

        for (const action of actions) {
          const status = (action.estimated_value ?? 0) <= threshold ? 'auto_approved' : 'pending';
          await auth.supabase.from('agent_actions').insert({
            organization_id: orgId,
            agent_type: agentType,
            action: action.action,
            description: action.description,
            status,
            evidence: action.evidence,
          });
        }
      }
    }

    return NextResponse.json({
      response: textContent,
      actions,
      stopReason: response.stop_reason,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Agent request failed';
    const status = message.includes('401') || message.includes('authentication') ? 401
      : message.includes('429') || message.includes('rate') ? 429
      : message.includes('credit') || message.includes('billing') ? 402
      : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
