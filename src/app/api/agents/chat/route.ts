import { NextResponse } from 'next/server';
import { getAnthropicClient } from '@/lib/agents/client';
import { getAgentPrompt } from '@/lib/agents/prompts';
import type { AgentType } from '@/lib/types';
import * as mock from '@/lib/mock-data';

export async function POST(request: Request) {
  const body = await request.json();
  const { agentType, messages } = body as {
    agentType: AgentType;
    messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  };

  if (!agentType || !messages?.length) {
    return NextResponse.json({ error: 'agentType and messages are required' }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Anthropic API key not configured' }, { status: 503 });
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
}
