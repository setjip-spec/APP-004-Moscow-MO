# APP-004 — BACKEND PARITY REPORT v0.3

**Дата:** 25.09.2026  
**Статус:** TRANSACTIONAL BACKEND PARITY COMPLETE  
**Supabase:** MINI-APPS-CLOUD  
**Основа backend:** канонические USER/TECH таблицы + APP-004 ТЗ. Никакая бизнес-логика не добавлялась вне этих источников.

## Канон

Backend реализован по свежей канонической паре:
- TECH: 45 листов, 188 QA = 187 PASS + 1 SOAK, APP-001…APP-086;
- USER: 13 листов, включая «Обязательства / оплаты», «Совместные расходы», «Долги людям»;
- QA-014 Research → Visit остаётся единственным real-life SOAK и не блокирует разработку.

Canonical data import уже выполнен:
- 25 Sources;
- 149 Places;
- 12 Routes;
- 21 Experiences;
- 10 Favorite editable projections;
- 166 Research;
- 166 Research evaluations;
- 37 Event Series;
- 40 Event Occurrences;
- 21 Visits;
- 1 production Deal.

## Transactional RPC layer

Реализованы и применены:

### Ledger / budget
- `app004_post_transaction`
- `app004_set_budget_version`
- `app004_recalculate_budget_month`
- `app004_refresh_budget_from`
- `app004_close_budget_month`
- `app004_post_adjustment`

Контракты:
- signed append-only ledger;
- idempotency by stable key;
- posting in actual cash month;
- closed month immutable;
- corrections/refunds post as new transactions;
- negative spend/carry preserved;
- budget versions are append-only by effective month.

### Visit / Research
- `app004_post_visit_accounting`
- `app004_research_to_visit`

Контракты:
- no Visit without explicit attendance;
- Research → Visit only on confirmed real Visit;
- Visit keeps full factual cost;
- prior linked prepayments are reconciled;
- ledger posts only the unposted delta;
- posted Visit delta is frozen.

### Commitments / payments / deposits
- `app004_create_commitment`
- `app004_record_commitment_payment`
- `app004_record_security_deposit`
- `app004_mark_commitment_refund_pending`
- `app004_record_commitment_refund`
- `app004_record_deposit_forfeiture`
- `app004_cancel_commitment`

Контракты:
- RESERVED/PAYMENT_DUE are planning obligations, not cash spend;
- partial payments reserve only remaining service due;
- service prepayment and refundable security deposit are semantically separate;
- promised refund changes forecast only;
- actual refund changes ledger only when received;
- forfeited deposit reduces expected refund and remains lifecycle cost;
- unpaid cancellation creates no fake transaction.

### Shared expenses / receivables
- `app004_create_shared_expense`
- `app004_add_shared_receivable`
- `app004_record_reimbursement`
- `app004_waive_receivable`

Контракты:
- full user cash payment is separate from agreed personal share;
- each person receivable is independent;
- reimbursement posts in actual receipt month;
- waiver/gift creates no cash transaction;
- overpayment is capped to receivable and excess is separated.

### Payables to people
- `app004_create_payable`
- `app004_record_payable_repayment`
- `app004_forgive_payable`

Контракты:
- another person paying for user creates liability, not immediate user spend;
- repayment posts only when user actually pays;
- partial repayment preserves outstanding;
- forgiveness creates no cash transaction;
- overpayment is capped to debt and excess is separated.

### Visit overlays
- `app004_visit_shared_overlay`
- `app004_visit_payable_overlay`

They expose social settlement state without rewriting factual Visit expense components.

## QA

Executed rollback regression against the late financial requirements represented by APP-050…086 / QA-162…202.

Verified:
- reservation vs actual balance;
- partial/final installments;
- idempotent payment retry;
- prepaid Visit reconciliation;
- security deposit separation;
- refund pending vs actual refund;
- partial deposit forfeiture;
- shared payment / partial reimbursement / waiver;
- shared overpayment guard;
- payable planning / partial repayment / forgiveness;
- payable overpayment guard;
- Visit social overlays;
- no synthetic production residue.

All synthetic test operations were run inside transactions and rolled back.

Post-test production financial counts remained zero:
- AccountingTransactions = 0
- Commitments = 0
- SharedExpenses = 0
- SharedReceivables = 0
- Payables = 0
- BudgetVersions = 0
- BudgetMonths = 0

This is expected because canonical USER contains schemas for these areas but no real filled user financial rows.

## Security / performance hardening

Applied:
- APP-004 RPCs use SECURITY INVOKER;
- ownership checks on referenced APP-004 entities;
- authenticated-only optimized RLS with `(select auth.uid()) = user_id`;
- fixed function `search_path`;
- covering indexes for APP-004 foreign keys;
- accounting transactions remain append-only;
- closed budget months remain immutable.

After hardening, APP-004 no longer appears in Supabase advisor warnings for:
- auth RLS initplan;
- unindexed foreign keys;
- mutable search_path.

Remaining project-level warnings are outside APP-004 scope:
- old APP-003 SECURITY DEFINER functions;
- pg_trgm installed in public;
- leaked-password protection disabled in Auth.

## Frontend contract

Frontend source of truth is NOT a new interpretation.

It must reproduce the six approved PNG references in Google Drive:
1. Desktop Dashboard
2. Search / Results
3. History
4. Universal Detail Card
5. Mobile Dashboard
6. Settings

The approved images define visual composition/geometry.  
`APP-004-VISUAL-TZ.md` defines behavior and details not visible in the PNGs.

## Next stage

1. runtime media layer / content images;
2. weather and event runtime integration;
3. frontend shell and pages matching the approved PNG references;
4. connect frontend to Supabase;
5. parity/integration QA;
6. QA-014 real-life Research → Visit SOAK before final release.
