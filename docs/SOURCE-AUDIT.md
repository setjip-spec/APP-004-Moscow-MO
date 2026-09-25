# APP-004 — Source Intake Audit
**Дата:** 25.09.2026  
**Статус:** VERIFIED CANON / BACKEND UNBLOCKED

## Проверенные канонические файлы

### TECH
Оригинал:
https://docs.google.com/spreadsheets/d/1dsJuQXZwUydYsldqMRuKg9WDsKJld7Un/edit?usp=drivesdk&ouid=109539816355164720249&rtpof=true&sd=true

Проверенный размер: **550 669 байт**.

Фактически подтверждено:
- 45 листов;
- последний лист: `45 — App Readiness Gate`;
- модули 41–44 присутствуют;
- 188 QA;
- 187 PASS;
- 0 PENDING;
- 0 FAIL;
- 1 SOAK;
- единственный SOAK: `QA-014 Research → Visit`;
- 80 APP requirements;
- последний APP: `APP-086`.

App Readiness Gate явно фиксирует:
- QA-014 блокирует финальный live-release, но **не блокирует schema/backend**;
- Supabase schema / transactions / LIVE backend / search parity можно начинать сейчас.

### USER
Оригинал:
https://docs.google.com/spreadsheets/d/11X4zMi3VgrG2ZgU9W_so0ZxacSUWjbA2/edit?usp=drivesdk&ouid=109539816355164720249&rtpof=true&sd=true

Проверенный размер: **243 732 байта**.

Фактически подтверждено:
- 13 листов;
- присутствуют новые листы:
  - `Обязательства / оплаты`
  - `Совместные расходы`
  - `Долги людям`
- `История` расширена до AL;
- `Бухгалтерия` расширена до W;
- поздние financial/social overlays присутствуют.

## Ключевые поздние модули TECH

- `41 — Commitments Cash State`
- `42 — Deposits Partial Payments`
- `43 — Shared Expenses`
- `44 — Payables to People`
- `45 — App Readiness Gate`

## Решение

Эта USER + TECH пара является текущим каноном APP-004.

Backend-разработка разблокирована.

Core Supabase schema v1 уже применена 25.09.2026:
- user-scoped RLS;
- Places / Experiences / Research / Events Series+Occurrences / Visits;
- evidence attribution;
- Deals;
- versioned Budget;
- append-only Accounting Transactions;
- Commitments + partial payments/deposits;
- Shared Expenses + Receivables;
- Payables to People;
- Settings + Media.

Следующий шаг: импорт канонических данных и transactional RPC parity.

QA-014 остаётся реальным SOAK перед финальным релизом и не блокирует текущую разработку.
