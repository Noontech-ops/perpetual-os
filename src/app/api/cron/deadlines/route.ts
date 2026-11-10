import { NextRequest, NextResponse } from 'next/server';
import * as mock from '@/lib/mock-data';
import { deadlineReminderHtml, deadlineReminderSubject } from '@/lib/email/deadline-reminder';
import type { DeadlineReminderData } from '@/lib/email/deadline-reminder';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const reminderWindows = [3, 7, 14];
    const org = mock.organization;
    const grants = mock.grants;

    const upcoming: DeadlineReminderData[] = [];

    for (const grant of grants) {
      for (const deadline of grant.deadlines) {
        if (deadline.completed) continue;
        const deadlineDate = new Date(deadline.date);
        const diffMs = deadlineDate.getTime() - now.getTime();
        const daysUntil = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        if (daysUntil > 0 && reminderWindows.includes(daysUntil)) {
          upcoming.push({ orgName: org.name, grant, deadline, daysUntil });
        }
      }
    }

    if (upcoming.length === 0) {
      return NextResponse.json({ sent: 0, message: 'No deadlines due at reminder windows' });
    }

    const resendKey = process.env.RESEND_API_KEY;
    const notifyEmail = process.env.DEADLINE_NOTIFY_EMAIL ?? org.email;

    if (!resendKey) {
      const previews = upcoming.map(d => ({
        subject: deadlineReminderSubject(d),
        to: notifyEmail,
        daysUntil: d.daysUntil,
        grant: d.grant.name,
        deadline: d.deadline.description,
      }));
      console.log('[cron/deadlines] RESEND_API_KEY not set. Would send:', JSON.stringify(previews, null, 2));
      return NextResponse.json({ sent: 0, wouldSend: previews.length, previews });
    }

    const { Resend } = await import('resend');
    const resend = new Resend(resendKey);
    const results = [];

    for (const data of upcoming) {
      const { error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? 'Perpetual OS <notifications@perpetualos.com>',
        to: notifyEmail,
        subject: deadlineReminderSubject(data),
        html: deadlineReminderHtml(data),
      });
      results.push({
        grant: data.grant.name,
        deadline: data.deadline.description,
        daysUntil: data.daysUntil,
        sent: !error,
        error: error?.message,
      });
    }

    return NextResponse.json({ sent: results.filter(r => r.sent).length, results });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Cron job failed';
    console.error('[cron/deadlines]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
