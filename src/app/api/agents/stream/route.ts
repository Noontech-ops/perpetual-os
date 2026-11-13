import { NextRequest, NextResponse } from 'next/server';
import { getAnthropicClient } from '@/lib/agents/client';
import { getAgentPrompt } from '@/lib/agents/prompts';
import * as mock from '@/lib/mock-data';

const VALID_TYPES = ['grants', 'donor_relations', 'finance', 'compliance', 'marketing', 'board'];

function getDemoResponse(agentType: string, userMessage: string): string {
  const lower = userMessage.toLowerCase();

  const responses: Record<string, string> = {
    grants: `Based on Bay Area Literacy Coalition's profile, here's my analysis:

## Grant Opportunities

**1. Silicon Valley Community Foundation — Education Equity Fund**
- Amount: $75,000–$150,000
- Deadline: February 15, 2027
- Fit score: **92%** — strong alignment with your Adult Literacy and Youth Reading programs
- Action: Draft LOI by January 20

**2. William & Flora Hewlett Foundation — Bay Area Impact**
- Amount: $100,000–$250,000
- Deadline: Rolling (next review March 1)
- Fit score: **87%** — matches community education focus
- Action: Request pre-application call with Program Officer

**3. Walter & Elise Haas Fund — Education Initiative**
- Amount: $50,000–$100,000
- Deadline: April 1, 2027
- Fit score: **84%** — Oakland-focused, literacy alignment

## Current Pipeline Status
- **Active grants**: $${mock.grants.filter(g => g.status === 'active' || g.status === 'awarded').reduce((s, g) => s + (g.amountAwarded ?? g.amountRequested), 0).toLocaleString()} across ${mock.grants.filter(g => g.status === 'active' || g.status === 'awarded').length} grants
- **SF Foundation renewal** ($75K) — due for Year 3 proposal in 90 days. 87% of outcomes met, strong position for renewal.
- **Hellman Foundation** mid-year report due in 21 days — all data captured, ready to generate.

## Recommended Actions
1. Begin SVCF LOI draft — I can generate this from your program data
2. Schedule call with Hewlett Foundation program officer
3. Finalize Hellman mid-year report (auto-generated draft ready for review)

Want me to draft any of these proposals?`,

    donor_relations: `Here's your donor engagement analysis for Bay Area Literacy Coalition:

## Donor Segments Overview

| Segment | Count | Total Giving | Avg Gift | Engagement |
|---------|-------|-------------|----------|------------|
| Major ($10K+) | 2 | $72,500 | $8,750 | 92 avg |
| Mid-Level ($1K–$10K) | 3 | $40,600 | $3,383 | 81 avg |
| Grassroots (<$1K) | 2 | $4,100 | $175 | 76 avg |

## Priority Actions

**1. Stewardship — Sarah Chen** (Score: 92)
- VP Engineering at Salesforce · $47,500 lifetime · Last gift: $10,000 (Sep 2026)
- *Action*: Send personalized impact report showing 342 adults served through her contributions
- *Upgrade potential*: High — Salesforce matching program could double her next gift

**2. Re-engagement — Robert Nakamura / Hellman Foundation** (Score: 70)
- Last gift: $25,000 (Jul 2025) — over 16 months ago
- *Action*: Schedule in-person site visit to showcase Youth Reading results
- *Risk*: Engagement score dropped 15 points. Needs personal outreach from ED.

**3. Upgrade Cultivation — Michael Torres** (Score: 78)
- Monthly donor: $100/mo for 36 months ($3,600 lifetime)
- *Action*: Invite to annual gala with upgrade ask to $150/mo
- *Signal*: Consistent giving pattern, volunteer alumni — ready for mid-level upgrade

## Year-End Campaign
- **Target**: $85,000 from individual donors
- **Strategy**: Segmented email series launching December 1
- 3 touchpoints: impact story → match challenge → deadline urgency

Shall I draft the stewardship email for Sarah Chen?`,

    finance: `## Financial Overview — Bay Area Literacy Coalition

### Cash Position
| Metric | Amount |
|--------|--------|
| Cash on Hand | **$${mock.organization.financials.cashOnHand.toLocaleString()}** |
| Monthly Burn Rate | ~$${Math.round(mock.organization.financials.totalExpenses / 12).toLocaleString()} |
| Runway | **${mock.organization.financials.monthsOfRunway} months** |
| Net Assets | $${mock.organization.financials.netAssets.toLocaleString()} |

### Revenue vs Expenses (YTD)
- **Revenue**: $${mock.organization.financials.totalRevenue.toLocaleString()} (91% of $${mock.organization.financials.annualBudget.toLocaleString()} budget)
- **Expenses**: $${mock.organization.financials.totalExpenses.toLocaleString()} (85% of budget)
- **Surplus**: $${(mock.organization.financials.totalRevenue - mock.organization.financials.totalExpenses).toLocaleString()}

### Fund Tracking
- **Unrestricted**: $127,400 (65% of cash)
- **Temporarily Restricted**: $67,600 (35% — grant funds with spending restrictions)

### Flags
1. **Runway alert**: At ${mock.organization.financials.monthsOfRunway} months, you're below the 6-month best practice. Recommend building to $350K unrestricted reserve.
2. **Budget variance**: Program expenses tracking 4.2% under budget — positive but verify no delayed spending.
3. **Grant burn rate**: SF Foundation grant at 72% spent with 4 months remaining — on track.

### Forecast (Next 3 Months)
| Month | Projected Cash | Net Change |
|-------|---------------|------------|
| Dec 2026 | $210,000 | +$15,000 (year-end giving) |
| Jan 2027 | $168,000 | -$42,000 (Q1 expenses) |
| Feb 2027 | $152,000 | -$16,000 |

Want me to generate a detailed cash flow forecast or board-ready financial summary?`,

    compliance: `## Compliance Dashboard — Bay Area Literacy Coalition

### Upcoming Deadlines

| Deadline | Due Date | Status | Priority |
|----------|----------|--------|----------|
| Form 990 Filing | May 15, 2027 | **On track** | High |
| CA RRF-1 (Annual Registration) | Nov 15, 2026 | **Due in 2 days** | Critical |
| Hellman Foundation Mid-Year Report | Dec 5, 2026 | **Draft ready** | High |
| SF Foundation Year 2 Report | Jan 31, 2027 | Data collection in progress | Medium |
| Charitable Solicitation Renewal | Mar 1, 2027 | Not started | Medium |

### Immediate Action Required
1. **CA RRF-1 due Nov 15** — Registry of Charitable Trusts annual renewal. Filing fee: $25. Requires current financial statements and list of officers. *I can pre-fill the form from your data.*

### Form 990 Readiness (FY 2026)
- [x] Financial statements reconciled
- [x] Board meeting minutes on file (4/4 meetings)
- [x] Compensation data for key employees current
- [ ] Schedule B (donor list) — needs final year-end data
- [ ] Functional expense allocation — awaiting December close

### Grant Covenant Compliance
- **SF Foundation**: All reporting requirements met. 87% of outcome targets achieved (minimum: 70%). ✅
- **Hellman Foundation**: Mid-year report due Dec 5. All data captured. Spending within approved budget categories. ✅
- **SVCF**: New grant — covenant review needed before accepting funds.

### Donor Acknowledgments
- **30-day rule**: All gifts over $250 acknowledged within 30 days ✅
- **Quid pro quo disclosures**: Gala tickets properly disclosed ✅
- **Year-end statements**: Batch mailing scheduled for January 15

### Policy Review
- Conflict of Interest Policy: Current (reviewed Oct 2026) ✅
- Document Retention Policy: Current ✅
- Whistleblower Policy: Current ✅

Need me to generate the RRF-1 filing or prepare the Hellman report?`,

    marketing: `## Marketing & Communications Plan — Bay Area Literacy Coalition

### Content from Impact Data

Your strongest stories based on outcome metrics:

**1. "342 Adults, 342 Stories"** — Adult Literacy Impact
- 342 adults served this year, 89% improved reading by 2+ grade levels
- *Format*: Video testimonial series (3 short clips) + email campaign
- *Audience*: Major donors, foundations, corporate partners

**2. "The Youth Reading Revolution"** — Youth Program
- 567 students in after-school tutoring, 91% showed measurable improvement
- *Format*: Infographic + social media carousel
- *Audience*: Parents, community members, education-focused funders

**3. "From ABCs to GEDs"** — Digital Access Program
- 128 learners in digital literacy, 73% completed certification
- *Format*: Long-form blog post + LinkedIn article
- *Audience*: Tech companies (Salesforce, Google matching), workforce funders

### Year-End Campaign Plan (Dec 1–31)

| Week | Theme | Channel | Target |
|------|-------|---------|--------|
| Week 1 | Impact reveal — 2026 by the numbers | Email + Social | Awareness |
| Week 2 | Match challenge — "$25K by Dec 15" | Email + SMS | Mid-level donors |
| Week 3 | Gratitude stories — volunteer + learner spotlights | Social + Blog | Community |
| Week 4 | Last chance — tax-deductible giving deadline | Email blast | All segments |

**Projected raise**: $65,000–$85,000 (based on peer benchmarks and your donor base)

### Social Media Calendar
- **3x/week** posting cadence (Tu/Th/Sa)
- Mix: 40% impact stories, 30% behind-the-scenes, 20% calls to action, 10% partner spotlights
- Hashtags: #BayAreaLiteracy #ReadToThrive #LiteracyMatters

### Quick Win
Draft a Giving Tuesday email (Dec 3) with this subject line: *"342 adults can now read to their children. You made that happen."*

Want me to draft the year-end email series or the Giving Tuesday campaign?`,

    board: `## Board Meeting Preparation — Bay Area Literacy Coalition

### Executive Summary for Next Board Meeting

**Organization Health Scorecard**

| Dimension | Status | Trend |
|-----------|--------|-------|
| Financial | **Stable** — 3.4 mo runway, $45K surplus YTD | → Flat |
| Programs | **Strong** — 87% outcome score across 3 programs | ↑ Up 4.5% |
| Fundraising | **On Track** — $743K of $820K budget raised (91%) | ↑ Up 12% |
| Compliance | **Attention** — CA RRF-1 due Nov 15, 990 on schedule | → |
| Governance | **Current** — All policies reviewed, 4/4 meetings held | ✅ |

### Key Decisions Needed

1. **FY2027 Budget Approval**
   - Proposed budget: $920,000 (+12% over FY2026)
   - Key change: New Digital Equity program ($85,000)
   - Staff: 1 new Program Coordinator position ($62,000 + benefits)
   - *Finance Committee recommends approval*

2. **Board Recruitment**
   - Current: 6 members (target: 9)
   - Gaps: Finance/accounting expertise, major donor capacity
   - *Governance Committee has 2 candidates for interview*

3. **Strategic Plan Update**
   - Year 2 of 3-year plan: 78% of milestones on track
   - Behind on: Geographic expansion to South Bay (deferred to Year 3)
   - Ahead on: Digital programming adoption

### Financial Summary (Board-Ready)
- **Revenue**: $743,000 (91% of budget)
- **Expenses**: $698,000 (85% of budget)
- **Net**: +$45,000 surplus
- **Cash**: $195,000 (3.4 months runway)
- **Restricted**: $67,600 in grant funds

### Suggested Agenda
1. Call to order & approval of minutes (5 min)
2. ED report & program highlights (15 min)
3. Financial review — Q3 close (10 min)
4. FY2027 budget discussion & vote (20 min)
5. Board recruitment update (10 min)
6. Strategic plan Year 2 check-in (15 min)
7. Executive session (if needed)

Want me to generate the full board packet or draft the meeting minutes template?`,
  };

  if (lower.includes('proposal') || lower.includes('draft') || lower.includes('loi')) {
    return responses.grants.replace('Want me to draft any of these proposals?',
      'I\'ll start drafting the LOI now. Here\'s the outline:\n\n1. Organization overview and mission alignment\n2. Program description and target outcomes\n3. Budget narrative and sustainability plan\n4. Evaluation methodology\n\nI\'ll have a full draft ready for your review shortly.');
  }

  return responses[agentType] ?? responses.grants;
}

export async function POST(request: NextRequest) {
  try {
    const { agentType, messages } = await request.json();

    if (!agentType || !VALID_TYPES.includes(agentType)) {
      return NextResponse.json({ error: 'Invalid agent type' }, { status: 400 });
    }

    const encoder = new TextEncoder();
    const lastUserMsg = [...(messages || [])].reverse().find((m: { role: string }) => m.role === 'user')?.content ?? '';

    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'proxy-injected') {
      const demoText = getDemoResponse(agentType, lastUserMsg);
      const words = demoText.split(/(\s+)/);

      const readable = new ReadableStream({
        async start(controller) {
          let i = 0;
          const chunkSize = 3;
          while (i < words.length) {
            const chunk = words.slice(i, i + chunkSize).join('');
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`));
            i += chunkSize;
            await new Promise(r => setTimeout(r, 15 + Math.random() * 35));
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        },
      });

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    }

    const anthropic = getAnthropicClient();
    const systemPrompt = getAgentPrompt(agentType);

    const orgContext = `
Organization: ${mock.organization.name}
Mission: ${mock.organization.mission}
Annual Budget: $${mock.organization.financials.annualBudget.toLocaleString()}
Annual Revenue: $${mock.organization.financials.totalRevenue.toLocaleString()}
Annual Expenses: $${mock.organization.financials.totalExpenses.toLocaleString()}
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
