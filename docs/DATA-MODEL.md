# APP-004 — DATA MODEL v1

**Status:** CORE SCHEMA APPLIED  
**Date:** 2026-09-25  
**Supabase project:** MINI-APPS-CLOUD  
**Source of truth:** fresh canonical USER/TECH pair verified on 2026-09-25.

## Canon verification

Fresh TECH:
- 45 sheets, through `45 — App Readiness Gate`;
- 188 QA: 187 PASS, 0 PENDING, 0 FAIL, 1 SOAK;
- only remaining SOAK: QA-014 Research → Visit;
- 80 APP requirements through APP-086;
- App Readiness Gate explicitly allows schema/backend work before QA-014 completes.

Fresh USER:
- 13 sheets;
- includes `Обязательства / оплаты`, `Совместные расходы`, `Долги людям`;
- `История` extends through AL;
- `Бухгалтерия` extends through W.

## Core relational tables

### User/runtime
- `app004_settings`
- `app004_media`

### Discovery / place model
- `app004_sectors`
- `app004_sources`
- `app004_places`
- `app004_routes`
- `app004_experiences`
- `app004_research`
- `app004_research_evaluations`
- `app004_evidence`

### LIVE events / deals
- `app004_event_series`
- `app004_event_occurrences`
- `app004_deals`

Series and Occurrence are separate entities. Occurrence rows are the dated user-facing event layer.

### History
- `app004_visits`

A Visit is created only after real attendance confirmation. A passed Event never creates a Visit automatically.

### Budget / cash-flow
- `app004_budget_versions`
- `app004_budget_months`
- `app004_accounting_transactions`

Budget versions are effective-month based. Closed months are snapshots. Signed append-only transactions preserve correction/refund history.

### Commitments / partial payments
- `app004_commitments`
- `app004_commitment_components`

Supported commitment states:
`RESERVED`, `PAYMENT_DUE`, `PARTIALLY_PAID`, `PAID`, `REFUND_PENDING`, `REFUNDED`, `CANCELLED_UNPAID`, `CANCELLED_WITH_LOSS`.

Prepayment toward price and refundable security deposit are separate semantic component types.

### Shared expenses / receivables
- `app004_shared_expenses`
- `app004_shared_receivables`

Cash actually paid by the user is separated from personal lifecycle cost and expected reimbursement.

### Payables to people
- `app004_payables`

Money paid by another person for the user creates a liability, not an immediate user cash expense. Actual spend is posted when repayment occurs.

## Search / emotion / atmosphere

Experiences and Research keep the eight emotional scales as sortable numeric fields:
- pleasure;
- relief;
- joy;
- flow;
- satisfaction;
- calm;
- meaning;
- vitality.

Atmospheric signals are represented by dedicated scores plus `atmosphere_tags`, allowing:
- numeric sorting where a score exists;
- multi-filtering and search by tags such as water, greenery, silence, space, evening lights, music, fountains, architecture.

GIN indexes are enabled for atmosphere tags and trigram indexes for place/research/event names.

## RLS

Every APP-004 table is protected by Row Level Security. The standard policy is:
`auth.uid() = user_id`.

The frontend receives only the Supabase publishable key. No service-role or database secret is allowed in GitHub Pages.

## Media rule

Google Drive remains the master/recovery library for manually collected images and approved UI references.

For production web rendering, `app004_media` supports:
- `drive_file_id` — master/recovery reference;
- `storage_path` — runtime Supabase Storage path;
- `external_url` — approved public source when used;
- `source_url` — provenance.

Private Drive links must not be used directly as anonymous GitHub Pages image URLs. Production images should be mirrored into a web-readable runtime layer while Drive remains the master copy.

## Next backend steps

1. Import canonical dictionaries, sectors, sources, places, routes and experiences.
2. Import Research + Stage6/PASS2 evaluation state.
3. Import LIVE Series/Occurrences and Deal state.
4. Import Visits/history and current budget snapshots.
5. Add transactional RPCs for:
   - Research → Visit;
   - accounting posting;
   - refunds/corrections;
   - commitments/partial payments;
   - shared reimbursements;
   - payables/repayments.
6. Build frontend against the approved visual kit.
7. QA-014 is performed as the later real-life soak before final release, not as a pre-code blocker.
