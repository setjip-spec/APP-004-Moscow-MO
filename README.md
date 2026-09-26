# APP-004 — Москва и МО

Пользовательское приложение выбора досуга в Москве и Московской области.

## Статус
**FRONTEND BETA / INTEGRATION QA PASSED.**

## Целевая архитектура
- GitHub `main` — канонический код и документация.
- GitHub Pages — будущий пользовательский runtime.
- Supabase MINI-APPS-CLOUD — будущая реляционная БД и Auth.
- Google BACKUP SAFE — независимое восстановление.
- Excel-прототип — источник бизнес-логики и parity/QA до завершения миграции.

## Пользовательская концепция
Главная должна объединить:
- Куда сходить — Favorite / проверенные Experience;
- Исследовать — Research;
- События LIVE — ближайшие 14 дней;
- единый поиск по всем трём источникам;
- компактный месячный бюджет.

История Visits остаётся отдельной страницей.

## Канонический источник

Source mismatch устранён 25.09.2026. Fresh canonical USER/TECH pair подтверждена и импортирована.

- Backend строится только из канонических таблиц USER/TECH + APP-004 ТЗ.
- UI/Frontend строится по утверждённым PNG из `03_UI_REFERENCE/APPROVED`; изображения являются визуальным эталоном, а Visual TZ дополняет поведение и невидимые на картинках детали.
- QA-014 Research → Visit остаётся только release SOAK и не блокирует разработку.

См.:
- `docs/APP-004-VISUAL-TZ.md`
- `docs/SOURCE-AUDIT.md`
- `docs/BACKEND-REPORT.md`
- `docs/LINKS.md`

## Backend foundation

On 2026-09-25 the fresh canonical USER/TECH pair was verified:
- TECH: 45 sheets, 188 QA / 187 PASS / 1 SOAK, APP through APP-086.
- USER: late commitments/shared/payables sheets present.
- QA-014 is release soak only; schema/backend is allowed to proceed.

Core relational Supabase schema v1 has been applied with RLS.

See:
- `docs/SOURCE-AUDIT.md`
- `docs/DATA-MODEL.md`


## Backend parity v0.3

Transactional RPC layer, monthly budget engine, commitments/payments/deposits, refunds/corrections, Research → Visit, shared reimbursements and payables/repayments are implemented and rollback-tested.

Security/performance hardening completed for APP-004:
- SECURITY INVOKER RPCs;
- optimized authenticated RLS;
- ownership checks;
- FK indexes;
- append-only accounting;
- immutable closed budget months.

Next: runtime media/weather/events, then frontend matching the six approved UI PNG references.

See `docs/BACKEND-REPORT.md`.


## Frontend beta v0.4

Frontend SPA реализован и подключён к реальному Supabase runtime.

Визуальный контракт:
- frontend повторяет шесть approved PNG из `03_UI_REFERENCE/APPROVED`;
- Dashboard / Search / History / Detail / Mobile Dashboard / Settings имеют отдельную реализацию;
- Visual TZ дополняет невидимые на PNG поведенческие детали.

Функционально подключены:
- Auth + RLS;
- Favorite / Research / Events / Visits;
- canonical Search filters;
- History filters;
- budget Settings через transactional RPC;
- Open-Meteo weather;
- RLS-safe data export;
- media fallback.

Ограничения канона не маскируются:
- `04_CONTENT_IMAGES` пока пуст;
- 21 imported legacy Visits пока не имеют `visit_total`;
- неподтверждённые Search-фильтры отключены.

См. `docs/FRONTEND-REPORT.md`.

Live runtime:
https://setjip-spec.github.io/APP-004-Moscow-MO/
