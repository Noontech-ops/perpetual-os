import type Anthropic from '@anthropic-ai/sdk';

export const agentTools: Anthropic.Messages.Tool[] = [
  {
    name: 'create_action',
    description: 'Create a new agent action that requires human review or is auto-approved based on the threshold.',
    input_schema: {
      type: 'object' as const,
      properties: {
        action: {
          type: 'string',
          description: 'Short action identifier (e.g., "proposal_draft", "lapsed_donor_alert", "cash_forecast")',
        },
        description: {
          type: 'string',
          description: 'Human-readable description of what the agent did or recommends',
        },
        evidence: {
          type: 'string',
          description: 'Supporting data and reasoning for this action',
        },
        estimated_value: {
          type: 'number',
          description: 'Estimated dollar value of this action (used for approval threshold)',
        },
      },
      required: ['action', 'description', 'evidence'],
    },
  },
  {
    name: 'search_constituents',
    description: 'Search the organization\'s constituents by type, tags, or engagement score range.',
    input_schema: {
      type: 'object' as const,
      properties: {
        type: {
          type: 'string',
          enum: ['donor', 'funder', 'client', 'volunteer', 'board', 'staff'],
        },
        min_engagement: { type: 'number' },
        max_engagement: { type: 'number' },
        tag: { type: 'string' },
      },
    },
  },
  {
    name: 'get_financial_summary',
    description: 'Get the organization\'s current financial summary including revenue, expenses, cash, and runway.',
    input_schema: {
      type: 'object' as const,
      properties: {},
    },
  },
];
