import { NextResponse } from 'next/server';
import { getAnthropicClient } from '@/lib/agents/client';
import { getAgentPrompt } from '@/lib/agents/prompts';
import type { AgentType } from '@/lib/types';
import * as mock from '@/lib/mock-data';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { agentType, messages } = body as {
      agentType: AgentType;
      messages: Array<{ role: 'user' | 'assistant'; content: string }>;
    };

    if (!agentType || !messages?.length) {
      return NextResponse.json({ error: 'agentType and messages are required' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === 'proxy-injected') {
      const demoResponses: Record<string, string> = {
        grants: 'Based on your current pipeline of ' + mock.grants.filter(g => g.status === 'active' || g.status === 'awarded').length + ' active grants, I recommend focusing on the SF Foundation renewal ($75K) due in 90 days. Your 87% outcome achievement rate positions you well. I can draft the renewal proposal.',
        donor_relations: 'Your donor base includes ' + mock.constituents.filter(c => c.type === 'donor').length + ' donors. Top priority: stewardship outreach to Sarah Chen ($47.5K lifetime, score 92). I also flagged Michael Torres for an upgrade ask — 36 consecutive monthly gifts.',
        finance: `Cash position: $${mock.organization.financials.cashOnHand.toLocaleString()} with ${mock.organization.financials.monthsOfRunway} months runway. Revenue ($${mock.organization.financials.totalRevenue.toLocaleString()}) is tracking 91% of budget. Recommend building unrestricted reserves to 6 months.`,
        compliance: 'Form 990 is on track for May 2027 filing. Immediate priority: CA RRF-1 annual registration. All donor acknowledgments are current — 30-day rule met for all gifts over $250.',
        marketing: 'Year-end campaign opportunity: your 342 adult learners and 567 youth served are compelling impact numbers. I recommend a 4-week email series starting December 1 with projected raise of $65K–$85K.',
        board: `Board packet summary: Revenue $${mock.organization.financials.totalRevenue.toLocaleString()} (91% of budget), 87% outcome score, 3.4 months runway. Key decision needed: FY2027 budget approval including new Digital Equity program.`,
      };
      return NextResponse.json({ response: demoResponses[agentType] ?? demoResponses.grants });
    }

    const orgContext = `Organization: ${JSON.stringify(mock.organization)}
Programs: ${JSON.stringify(mock.programs)}
Grants: ${JSON.stringify(mock.grants)}
Dashboard Stats: ${JSON.stringify(mock.dashboardStats)}
Recent Agent Actions: ${JSON.stringify(mock.agentActions.slice(0, 5))}`;

    const systemPrompt = `${getAgentPrompt(agentType)}

Current organization context:
${orgContext}

You are in a conversational mode. Respond helpfully to the user's questions about their nonprofit.`;

    const anthropic = getAnthropicClient();

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      messages,
    });

    const text = response.content
      .filter(b => b.type === 'text')
      .map(b => {
        if (b.type === 'text') return b.text;
        return '';
      })
      .join('');

    return NextResponse.json({ response: text });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Chat request failed';
    const status = message.includes('401') || message.includes('authentication') ? 401
      : message.includes('429') || message.includes('rate') ? 429
      : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
