'use client';

import { useState, useEffect } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getStripeClient } from '@/lib/stripe/client';
import type { Stripe } from '@stripe/stripe-js';

interface CheckoutFormProps {
  orgId: string;
  orgName: string;
  amount: number;
  paymentMethod: 'card' | 'ach';
  donorEmail?: string;
  onSuccess: (paymentIntentId: string) => void;
  onCancel: () => void;
}

const cardStyle = {
  base: {
    fontSize: '15px',
    color: '#1e293b',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    '::placeholder': { color: '#94a3b8' },
  },
  invalid: { color: '#dc2626' },
};

function CardForm({ orgId, orgName, amount, donorEmail, onSuccess, onCancel }: Omit<CheckoutFormProps, 'paymentMethod'>) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [email, setEmail] = useState(donorEmail || '');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError('');

    try {
      const res = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, method: 'card', orgId, organizationName: orgName, email }),
      });
      const data = await res.json();

      if (!res.ok || !data.clientSecret) {
        setError(data.error || 'Could not start payment');
        setProcessing(false);
        return;
      }

      const card = elements.getElement(CardElement);
      if (!card) { setProcessing(false); return; }

      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card, billing_details: { email } },
      });

      if (confirmError) {
        setError(confirmError.message || 'Payment failed');
        setProcessing(false);
      } else if (paymentIntent?.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      } else {
        setError('Payment was not completed. Please try again.');
        setProcessing(false);
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setProcessing(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-slate-600 mb-1.5">Email for receipt</label>
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>
      <div>
        <label className="block text-sm text-slate-600 mb-1.5">Card details</label>
        <div className="px-3 py-3 border border-slate-200 rounded-lg bg-white">
          <CardElement options={{ style: cardStyle, hidePostalCode: true }} />
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={processing || !stripe}
        className="w-full py-3 rounded-xl font-medium text-base bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-70 transition-colors"
      >
        {processing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </button>
      <button type="button" onClick={onCancel} className="w-full text-sm text-slate-500 hover:text-slate-700">
        Cancel
      </button>
    </form>
  );
}

function AchForm({ orgId, orgName, amount, donorEmail, onSuccess, onCancel }: Omit<CheckoutFormProps, 'paymentMethod'>) {
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [email, setEmail] = useState(donorEmail || '');
  const [name, setName] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProcessing(true);
    setError('');

    try {
      const res = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, method: 'ach', orgId, organizationName: orgName, email }),
      });
      const data = await res.json();

      if (!res.ok || !data.clientSecret) {
        setError(data.error || 'Could not start payment');
        setProcessing(false);
        return;
      }

      const stripe = await getStripeClient();
      if (!stripe) { setError('Stripe not available'); setProcessing(false); return; }

      const { error: collectError, paymentIntent } = await stripe.collectBankAccountForPayment({
        clientSecret: data.clientSecret,
        params: {
          payment_method_type: 'us_bank_account',
          payment_method_data: { billing_details: { name, email } },
        },
        expand: ['payment_method'],
      });

      if (collectError) {
        setError(collectError.message || 'Bank connection failed');
        setProcessing(false);
      } else if (paymentIntent?.status === 'requires_confirmation') {
        const { error: confirmError, paymentIntent: confirmed } = await stripe.confirmUsBankAccountPayment(data.clientSecret);
        if (confirmError) {
          setError(confirmError.message || 'Bank payment failed');
          setProcessing(false);
        } else if (confirmed?.status === 'succeeded' || confirmed?.status === 'processing') {
          onSuccess(confirmed.id);
        } else {
          setError('Payment requires additional verification. Check your email.');
          setProcessing(false);
        }
      } else if (paymentIntent?.status === 'succeeded' || paymentIntent?.status === 'processing') {
        onSuccess(paymentIntent.id);
      } else {
        setError('Payment was not completed. Please try again.');
        setProcessing(false);
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setProcessing(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-slate-600 mb-1.5">Account holder name</label>
        <input
          type="text"
          required
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Jane Smith"
          className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>
      <div>
        <label className="block text-sm text-slate-600 mb-1.5">Email for receipt</label>
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>
      <p className="text-xs text-slate-500">
        By clicking Pay, you authorize Perpetual to debit your bank account. ACH transfers typically take 3-5 business days.
      </p>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={processing}
        className="w-full py-3 rounded-xl font-medium text-base bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-70 transition-colors"
      >
        {processing ? 'Processing...' : `Pay $${amount.toFixed(2)} via ACH`}
      </button>
      <button type="button" onClick={onCancel} className="w-full text-sm text-slate-500 hover:text-slate-700">
        Cancel
      </button>
    </form>
  );
}

export default function CheckoutForm(props: CheckoutFormProps) {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [stripeError, setStripeError] = useState(false);

  useEffect(() => {
    getStripeClient().then(s => {
      if (s) setStripe(s);
      else setStripeError(true);
    });
  }, []);

  if (stripeError) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
          Payments are not configured yet. Please contact the organization directly.
        </p>
        <button onClick={props.onCancel} className="w-full text-sm text-slate-500 hover:text-slate-700">
          Back
        </button>
      </div>
    );
  }

  if (!stripe) {
    return <div className="py-8 text-center text-sm text-slate-400">Loading payment form...</div>;
  }

  if (props.paymentMethod === 'ach') {
    return <AchForm {...props} />;
  }

  return (
    <Elements stripe={stripe} options={{ appearance: { theme: 'stripe' } }}>
      <CardForm {...props} />
    </Elements>
  );
}
