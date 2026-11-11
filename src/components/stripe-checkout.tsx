"use client";

import { useState, useEffect } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { getStripeClient } from "@/lib/stripe/client";
import type { Stripe } from "@stripe/stripe-js";

interface CheckoutFormProps {
  amount: number;
  method: string;
  organizationId: string;
  organizationName: string;
  onSuccess: () => void;
  onError: (msg: string) => void;
  onCancel: () => void;
}

function CheckoutForm({ amount, onSuccess, onError }: Pick<CheckoutFormProps, "amount" | "onSuccess" | "onError">) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: "if_required",
    });

    if (error) {
      onError(error.message ?? "Payment failed");
      setProcessing(false);
    } else {
      onSuccess();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full py-3 rounded-xl font-medium text-base bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-70"
      >
        {processing ? "Processing..." : `Pay $${amount}`}
      </button>
    </form>
  );
}

export function StripeCheckout({
  amount,
  method,
  organizationId,
  organizationName,
  onSuccess,
  onError,
  onCancel,
}: CheckoutFormProps) {
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [fee, setFee] = useState(0);
  const [loading, setLoading] = useState(true);
  const [demo, setDemo] = useState(false);

  useEffect(() => {
    getStripeClient().then(setStripeInstance);
  }, []);

  useEffect(() => {
    async function createIntent() {
      setLoading(true);
      try {
        const res = await fetch("/api/payments/create-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount,
            method,
            organizationName,
            designation: "Unrestricted",
          }),
        });
        if (!res.ok) {
          const data = await res.json();
          onError(data.error || "Failed to create payment");
          return;
        }
        const data = await res.json();
        if (data.demo) {
          setDemo(true);
          setFee(data.fee);
        } else {
          setClientSecret(data.clientSecret);
          setFee(data.fee);
        }
      } catch {
        onError("Network error creating payment");
      }
      setLoading(false);
    }
    if (amount > 0) createIntent();
  }, [amount, method, organizationName, organizationId, onError]);

  if (demo) {
    return (
      <div className="space-y-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-emerald-800">Checkout Ready</p>
          <p className="text-xs text-emerald-600">
            ${amount.toFixed(2)} to {organizationName}
          </p>
          <p className="text-xs text-slate-500">Fee: ${fee.toFixed(2)} &middot; Net: ${(amount - fee).toFixed(2)}</p>
        </div>
        <button
          onClick={onSuccess}
          className="w-full py-3 rounded-xl font-medium text-base bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
        >
          Confirm ${amount.toFixed(2)} Donation
        </button>
        <button
          onClick={onCancel}
          className="w-full text-sm text-slate-500 hover:text-slate-700 py-2"
        >
          Cancel
        </button>
      </div>
    );
  }

  if (!stripeInstance || !clientSecret) {
    return (
      <div className="space-y-4">
        <div className="h-40 bg-slate-50 rounded-lg animate-pulse" />
        {loading && <p className="text-sm text-slate-500 text-center">Setting up payment...</p>}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>Processing fee</span>
        <span>${fee.toFixed(2)}</span>
      </div>
      <Elements stripe={stripeInstance} options={{ clientSecret, appearance: { theme: "stripe" } }}>
        <CheckoutForm amount={amount} onSuccess={onSuccess} onError={onError} />
      </Elements>
      <button
        onClick={onCancel}
        className="w-full text-sm text-slate-500 hover:text-slate-700 py-2"
      >
        Cancel
      </button>
    </div>
  );
}
