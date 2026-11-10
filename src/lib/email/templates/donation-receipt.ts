interface ReceiptData {
  donorName: string;
  donorEmail: string;
  orgName: string;
  amount: number;
  date: string;
  ein?: string;
}

export function donationReceiptHtml(data: ReceiptData): string {
  const formattedAmount = data.amount.toLocaleString('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 2,
  });

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:system-ui,-apple-system,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">

<tr><td style="background:#4f46e5;padding:32px 40px;text-align:center;">
  <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:600;">Thank you for your gift</h1>
</td></tr>

<tr><td style="padding:32px 40px;">
  <p style="margin:0 0 20px;color:#334155;font-size:15px;line-height:1.6;">
    Dear ${escapeHtml(data.donorName)},
  </p>
  <p style="margin:0 0 24px;color:#334155;font-size:15px;line-height:1.6;">
    Thank you for your generous contribution to <strong>${escapeHtml(data.orgName)}</strong>.
    Your support makes a meaningful difference.
  </p>

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:8px;margin:0 0 24px;">
  <tr><td style="padding:20px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="color:#64748b;font-size:13px;padding:6px 0;">Organization</td>
        <td style="color:#1e293b;font-size:13px;font-weight:600;text-align:right;padding:6px 0;">${escapeHtml(data.orgName)}</td>
      </tr>
      ${data.ein ? `<tr>
        <td style="color:#64748b;font-size:13px;padding:6px 0;">EIN</td>
        <td style="color:#1e293b;font-size:13px;font-weight:600;text-align:right;padding:6px 0;">${escapeHtml(data.ein)}</td>
      </tr>` : ''}
      <tr>
        <td style="color:#64748b;font-size:13px;padding:6px 0;">Amount</td>
        <td style="color:#1e293b;font-size:18px;font-weight:700;text-align:right;padding:6px 0;">${formattedAmount}</td>
      </tr>
      <tr>
        <td style="color:#64748b;font-size:13px;padding:6px 0;">Date</td>
        <td style="color:#1e293b;font-size:13px;font-weight:600;text-align:right;padding:6px 0;">${escapeHtml(data.date)}</td>
      </tr>
    </table>
  </td></tr>
  </table>

  <p style="margin:0 0 24px;color:#64748b;font-size:12px;line-height:1.6;border-top:1px solid #e2e8f0;padding-top:16px;">
    This letter serves as your official acknowledgment for tax purposes.
    No goods or services were provided in exchange for this contribution.
    Please retain this email for your records.
  </p>

  <table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="center">
    <a href="https://perpetual-os-inoon.vercel.app/outcomes/portfolio"
      style="display:inline-block;background:#4f46e5;color:#ffffff;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none;">
      Track Your Impact
    </a>
  </td></tr>
  </table>
</td></tr>

<tr><td style="padding:24px 40px;border-top:1px solid #e2e8f0;text-align:center;">
  <p style="margin:0;color:#94a3b8;font-size:12px;">
    Perpetual Outcomes &middot; Impact-first giving
  </p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
