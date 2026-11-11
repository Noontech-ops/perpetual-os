import { NextRequest, NextResponse } from 'next/server';
import { getAnthropicClient } from '@/lib/agents/client';
import { getAgentPrompt } from '@/lib/agents/prompts';
import * as mock from '@/lib/mock-data';

const VALID_TYPES = ['grants', 'donor_relations', 'finance', 'compliance', 'marketing', 'board'];

export async function POST(request: NextRequest) {
  try {
    const { agentType, messages } = await request.json();

    if (!agentType || !VALID_TYPES.includes(agentType)) {
      return NextResponse.json({ error: 'Invalid agent type' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
    }

    const anthropic = getAnthropicClient();
    const systemPrompt = getAgentPrompt(agentType);

    const orgContext = `
Organization: ${mock.organization.name}
Mission: ${mock.organization.mission}
Annual Budget: $${mock.organization.financials.annualBudget.toLocaleString()}
Total Revenue: $${mock.organization.financials.totalRevenue.toLocaleString()}
Total Expenses: $${mock.organization.financials.totalExpenses.toLocaleString()}
Net Assets: $${mock.organization.financials.netAssets.toLocaleString()}
Cash on Hand: $${mock.organization.financials.cashOnHand.toLocaleString()}
Months of Runway: ${mock.organization.financials.monthsOfRunway}

Programs: ${mock.programs.map(p => `${p.name} (Budget: $${p.annualBudget.toLocaleString()}, Clients: ${p.clientsServed})`).join('; ')}

Active Grants: ${mock.grants.filter(g => g.status === 'active' || g.status === 'awarded').map(g => `${g.funderName}: $${g.amountAwarded?.toLocaleString() ?? g.amountRequested.toLocaleString()}`).join('; ')}

Dashboard Stats: Revenue $${mock.dashboardStats.totalRevenue.toLocaleString()}, Expenses $${mock.dashboardStats.totalExpenses.toLocaleString()}, Donors ${mock.dashboardStats.totalDonors}, Active Grants ${mock.dashboardStats.activeGrants}
`.trim();

    const apiMessages = (messages || []).map((m: { role: string; content: string }) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          const stream = anthropic.messages.stream({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 2048,
            system: `${systemPrompt}\n\n--- Organization Context ---\n${orgContext}`,
            messages: apiMessages,
          });

          stream.on('text', (text) => {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
            );
          });

          stream.on('end', () => {
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          });

          stream.on('error', (err) => {
            const msg = err instanceof Error ? err.message : 'Stream error';
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`)
            );
            controller.close();
          });
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to start stream';
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
