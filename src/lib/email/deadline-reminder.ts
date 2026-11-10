import type { Grant, GrantDeadline } from '@/lib/types';

export interface DeadlineReminderData {
  orgName: string;
  grant: Grant;
  deadline: GrantDeadline;
  daysUntil: number;
}

export function deadlineReminderHtml({ orgName, grant, deadline, daysUntil }: DeadlineReminderData): string {
  const urgency = daysUntil <= 3 ? '#dc2626' : daysUntil <= 7 ? '#d97706' : '#2563eb';
  const urgencyLabel = daysUntil <= 3 ? 'Urgent' : daysUntil <= 7 ? 'Soon' : 'Upcoming';

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:32px 16px">
    <div style="background:#fff;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden">
      <div style="background:${urgency};padding:16px 24px;color:#fff">
        <span style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em">${urgencyLabel} — ${daysUntil} day${daysUntil === 1 ? '' : 's'} remaining</span>
      </div>
      <div style="padding:24px">
        <h1 style="margin:0 0 4px;font-size:20px;color:#0f172a">${deadline.description}</h1>
        <p style="margin:0 0 20px;font-size:14px;color:#64748b">${grant.funderName} · ${grant.name}</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr>
            <td style="padding:8px 0;color:#64748b;width:120px">Deadline</td>
            <td style="padding:8px 0;color:#0f172a;font-weight:600">${new Date(deadline.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b">Type</td>
            <td style="padding:8px 0;color:#0f172a">${deadline.type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b">Amount</td>
            <td style="padding:8px 0;color:#0f172a">${grant.amountAwarded ? `$${grant.amountAwarded.toLocaleString()}` : `$${grant.amountRequested.toLocaleString()} (requested)`}</td>
          </tr>
        </table>
        ${grant.requirements.length > 0 ? `
        <div style="margin-top:16px;padding-top:16px;border-top:1px solid #e2e8f0">
          <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.05em">Requirements</p>
          <ul style="margin:0;padding-left:20px;font-size:14px;color:#334155">
            ${grant.requirements.map(r => `<li style="margin-bottom:4px">${r}</li>`).join('')}
          </ul>
        </div>` : ''}
      </div>
      <div style="padding:16px 24px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center">
        <p style="margin:0;font-size:12px;color:#94a3b8">${orgName} · Perpetual OS</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export function deadlineReminderSubject({ grant, deadline, daysUntil }: DeadlineReminderData): string {
  const prefix = daysUntil <= 3 ? '🔴' : daysUntil <= 7 ? '🟡' : '🔵';
  return `${prefix} ${deadline.description} — ${daysUntil} day${daysUntil === 1 ? '' : 's'} left (${grant.funderName})`;
}
