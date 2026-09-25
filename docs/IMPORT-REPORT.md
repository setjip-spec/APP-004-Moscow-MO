# APP-004 — Canonical Data Import Report
**Дата:** 25.09.2026  
**Статус:** CORE CANONICAL DATA IMPORTED

## Источник
Свежая каноническая пара:
- TECH: 45 листов, 188 QA / 187 PASS / 1 SOAK, APP до APP-086.
- USER: 13 листов, включая late financial/social overlays.

## Импортировано в Supabase
- Sources: **25**
- Places: **149**
- Routes: **12**
- Experiences: **21**
- Favorite editable projection: **10**
- Research: **166**
- Research evaluations / Stage6+PASS2: **166**
- Event Series: **37**
- Event Occurrences: **40**
- Visits / History: **21**
- Production Deals: **1**

## Что намеренно НЕ создано
Не создавались синтетические пользовательские финансовые строки.

В каноническом USER на момент импорта нет реальных заполненных строк:
- Commitments / payments;
- Shared expenses;
- Receivables;
- Payables to people;
- user accounting transactions.

Поэтому соответствующие APP-004 таблицы остаются пустыми до реального пользовательского действия.

Это соответствует правилу evidence integrity: не придумывать расходы, долги, возвраты и обязательства.

## Favorite ownership
Ручные Favorite-поля вынесены в отдельный слой `app004_favorite_projection`.

Это сохраняет правило:
- Favorite price editable by user;
- LIVE / Deal price не перезаписывает Favorite price;
- Deal layer хранится отдельно.

## Search / emotions
Импортированы числовые эмоциональные и атмосферные шкалы из TECH.

Они доступны для:
- сортировки;
- фильтрации;
- будущего query translation из запросов вроде «вода + вечер», «тишина + зелень».

## Event model
Series и Occurrence импортированы отдельно.
Прошедшее Event не создаёт Visit автоматически.

## History
Импортированы реальные исторические Visits, включая записи с неизвестной точной датой.
Поэтому `visit_date` допускает NULL для legacy evidence.

## Следующий этап
1. transactional RPC layer;
2. monthly budget recalculation/snapshot functions;
3. commitments/deposits;
4. refunds/corrections;
5. shared reimbursements;
6. payables/repayments;
7. frontend implementation against approved visual-kit.

QA-014 остаётся release SOAK и не блокирует разработку.
