# APP-004 — Source Intake Audit
**Дата:** 25.09.2026  
**Статус:** FRESH CANON IDENTIFIED / WAITING FOR FRESH USER + TECH FILES

## Итог контрольной проверки

Внешняя контрольная проверка подтвердила, что текущие Drive-файлы USER + TECH являются внутренне согласованной, но устаревшей парой.

### Текущие Drive-файлы

USER:
- старая согласованная версия;
- отсутствуют более поздние листы:
  - Обязательства / оплаты
  - Совместные расходы
  - Долги людям
- История заканчивается на AB вместо AL;
- Бухгалтерия заканчивается на N вместо W.

TECH:
- 40 листов;
- последний модуль: `40 — Refunds Corrections`;
- отсутствуют модули:
  - `41 — Commitments Cash State`
  - `42 — Deposits Partial Payments`
  - `43 — Shared Expenses`
  - `44 — Payables to People`
  - `45 — App Readiness Gate`
- `27 — App-only Requirements`: 54 требований, до APP-060;
- `26 — QA Regression`: 145 QA:
  - 142 PASS
  - 2 PENDING
  - 0 FAIL
  - 1 SOAK

PENDING:
- QA-013
- QA-015

SOAK:
- QA-014 Research → Visit

## Более свежий канон

Контрольная проверка подтвердила существование более свежей пары:
- `Stage7 PAYABLES + APP READINESS USER`
- `Stage7 PAYABLES + APP READINESS TECH`

В свежем TECH:
- QA-013 и QA-015 уже закрыты PASS;
- QA-014 остаётся единственным SOAK;
- присутствуют модули 41–45;
- APP requirements доходят до APP-086;
- APP requirements всего: 80;
- финальный `45 — App Readiness Gate` разрешает начинать Supabase schema/backend до завершения QA-014.

Отсутствующие в старом Drive TECH требования:
- APP-061–066 — commitment/payment state machine, committed free cash, refunds, payment-month accounting;
- APP-067–072 — partial payments, prepayment, deposits, forfeiture;
- APP-073–079 — shared expenses, receivables, reimbursements, gift/waiver;
- APP-080–086 — payables to people, repayments, partial settlement, forgiveness, forecast/overlay.

## Вывод

Текущую Drive-пару **НЕ использовать** для проектирования финальной Supabase schema.

Следующий шаг:
1. получить свежие `Stage7 PAYABLES + APP READINESS USER/TECH`;
2. заменить ими source-intake APP-004;
3. обновить Google BACKUP SAFE snapshot;
4. пересобрать entity map / enums / FK / constraints / transactions;
5. после этого можно начинать Supabase/backend;
6. QA-014 остаётся live SOAK и не блокирует начало backend-разработки.
