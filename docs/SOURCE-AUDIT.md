# APP-004 — Source Intake Audit
**Дата:** 25.09.2026  
**Статус:** BLOCKED FOR BACKEND IMPLEMENTATION / UI-SPEC MAY CONTINUE

## Получено
1. `Москва и МО — ОТКРЫВАТЬ СЮДА.xlsx`
2. `Москва и МО — маршруты и активности.xlsx`

## Фактическое состояние приложенных файлов

### USER workbook
Листы: Главная, Исследования, События LIVE, Музыка рядом, Любимые, Маршруты, История, Памятка, Скидки / Price Watch, Бухгалтерия.

USER уже содержит пользовательские проекции Favorite / Research / Events LIVE / History / budget.

### TECH workbook
Обнаружено 40 листов. Последние модули:
- 36 — LIVE Aging Engine
- 37 — Deal Price Watch
- 38 — Deal Priority Alerts
- 39 — Visit Accounting
- 40 — Refunds Corrections

Листа `45 — App Readiness Gate` в приложенном TECH нет.

`27 — App-only Requirements`: 54 APP-требования, до APP-060 с пропусками в нумерации.

`26 — QA Regression`:
- 145 QA-записей;
- 142 PASS;
- 2 PENDING;
- 1 SOAK.

## Расхождение с handoff
В handoff было указано:
- 188 QA;
- 187 PASS;
- 0 PENDING;
- 1 SOAK;
- модули 28–44;
- `45 — App Readiness Gate`.

Это не совпадает с фактически приложенным TECH workbook.

## Решение
Можно продолжать сейчас:
- visual/UI spec;
- информационную архитектуру;
- GitHub scaffold.

До уточнения источника нельзя считать утверждёнными:
- финальную Supabase schema;
- migrations / transactional functions;
- backend parity;
- финальный APP/QA mapping.

Нужен TECH workbook с 188 QA + App Readiness Gate либо явное подтверждение, что текущий приложенный TECH теперь является новым каноном.
