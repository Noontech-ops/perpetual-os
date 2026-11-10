-- Add stripe_payment_intent_id to giving_transactions for webhook reconciliation
alter table giving_transactions add column if not exists stripe_payment_intent_id text;
create index if not exists idx_giving_transactions_stripe on giving_transactions(stripe_payment_intent_id);
