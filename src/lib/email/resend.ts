import { donationReceiptHtml } from './templates/donation-receipt';

interface ReceiptParams {
  donorName: string;
  donorEmail: string;
  orgName: string;
  amount: number;
  date: string;
  ein?: string;
}

export async function sendDonationReceipt(params: ReceiptParams) {
  const apiKey = process.env.RESEND_API_KEY;
  const html = donationReceiptHtml(params);

  if (!apiKey) {
    console.log('[Email] RESEND_API_KEY not set — logging instead of sending');
    console.log(`[Email] To: ${params.donorEmail}`);
    console.log(`[Email] Subject: Thank you for your gift to ${params.orgName}`);
    return;
  }

  const { Resend } = await import('resend');
  const resend = new Resend(apiKey);

  await resend.emails.send({
    from: 'Perpetual <receipts@perpetualoutcomes.com>',
    to: params.donorEmail,
    subject: `Thank you for your gift to ${params.orgName}`,
    html,
  });
}
