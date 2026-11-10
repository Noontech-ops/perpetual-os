'use client';

import Link from 'next/link';

interface PaymentConfirmationProps {
  orgName: string;
  amount: number;
  method: string;
  email?: string;
  onGiveAgain: () => void;
}

const methodLabels: Record<string, string> = {
  card: 'Credit/Debit Card',
  ach: 'Bank Transfer (ACH)',
  daf: 'Donor-Advised Fund',
  stock: 'Stock Transfer',
  crypto: 'Cryptocurrency',
  qcd: 'Qualified Charitable Distribution',
};

export default function PaymentConfirmation({ orgName, amount, method, email, onGiveAgain }: PaymentConfirmationProps) {
  return (
    <div className="text-center space-y-4 py-2">
      <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-900">Thank you!</h3>
        <p className="text-sm text-slate-600 mt-1">
          Your gift of <span className="font-semibold">${amount.toFixed(2)}</span> to{' '}
          <span className="font-semibold">{orgName}</span> has been{' '}
          {method === 'ach' ? 'initiated' : 'processed'}.
        </p>
      </div>

      <div className="bg-slate-50 rounded-lg p-3 text-sm space-y-1.5">
        <div className="flex justify-between">
          <span className="text-slate-500">Amount</span>
          <span className="font-medium text-slate-900">${amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Method</span>
          <span className="font-medium text-slate-900">{methodLabels[method] || method}</span>
        </div>
        {email && (
          <div className="flex justify-between">
            <span className="text-slate-500">Receipt</span>
            <span className="text-slate-600 text-xs">{email}</span>
          </div>
        )}
      </div>

      <div className="space-y-2 pt-2">
        <Link
          href="/outcomes/portfolio"
          className="block w-full py-2.5 rounded-xl font-medium text-sm bg-emerald-600 text-white hover:bg-emerald-700 transition-colors text-center"
        >
          View Your Portfolio
        </Link>
        <button
          onClick={onGiveAgain}
          className="w-full py-2.5 rounded-xl font-medium text-sm border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Give Again
        </button>
      </div>
    </div>
  );
}
