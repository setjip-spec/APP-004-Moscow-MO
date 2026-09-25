# APP-004 — Москва и МО — ТЗ
## DRAFT v0.0 — source intake / UI agreement

**Статус:** ТЗ В РАБОТЕ  
**Дата:** 25.09.2026  
**DATA MODE target:** Supabase MINI-APPS-CLOUD, реляционная модель  
**Runtime target:** GitHub Pages

## Источники и приоритет

До устранения source mismatch использовать приоритет:

1. актуальный TECH workbook;
2. актуальный USER workbook;
3. техническая карта;
4. профиль восприятия;
5. общий регламент.

В текущем intake обнаружено расхождение: handoff описывает TECH с 188 QA и `45 — App Readiness Gate`, а приложенный TECH содержит 145 QA и листы только до `40 — Refunds Corrections`. См. `docs/SOURCE-AUDIT.md`.

До разрешения расхождения нельзя фиксировать финальную Supabase schema и backend parity как завершённые.

## Архитектурные инварианты

- Favorite — пользовательская редактируемая текущая проекция.
- LIVE/Deal цены не перезаписывают ручную Favorite-цену.
- Events LIVE — системная read-only проекция.
- Series и Occurrence — разные сущности.
- Прошедшее Event не создаёт Visit автоматически.
- Research становится Favorite только после реального положительного Visit.
- Негатив локализуется на минимально обоснованном уровне: place/provider/config/mechanism.
- History / evidence не уничтожается новыми фактами.
- Visit хранит отдельно activity/event, public transport, taxi, road total, visit total.
- Blank = неизвестно; 0 = подтверждённо отсутствовал расход.
- Posting по VisitID/TxID идемпотентен.
- Monthly budget версионируется по effective month и не переписывает закрытые месяцы.
- Carryover переносит знак полностью, включая отрицательные значения.
- Refund/correction — отдельная signed append-only транзакция.
- Reserved/payment due — обязательство, не расход.
- Paid — реальный cash flow.
- Supabase должен использовать нормальные сущности, FK/constraints/transactions, а не один JSON blob как основную модель.

## Пользовательский UI

До production UI сначала согласуется `docs/APP-004-VISUAL-TZ.md`.

Главная целевая модель:
- Куда сходить (Favorites / verified Experiences);
- Исследовать (Research);
- Events LIVE на 14 дней;
- единый поиск;
- бюджет месяца.

History — отдельный экран.

## Следующий технический шаг

1. Получить TECH snapshot, который соответствует handoff 188 QA / App Readiness Gate, либо получить явное решение, что текущий TECH стал новым каноном.
2. После этого составить entity map / enums / FK / unique constraints / indexes / transactional RPC.
3. Сверить каждую сущность с APP requirements и QA matrix.
4. Только затем применять Supabase migrations.
