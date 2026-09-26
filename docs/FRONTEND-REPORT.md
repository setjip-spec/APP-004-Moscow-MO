# APP-004 — FRONTEND REPORT v0.4

**Дата:** 26.09.2026  
**Статус:** FRONTEND BETA / INTEGRATION QA PASSED  
**Backend:** v0.3 transactional parity  
**Runtime:** GitHub Pages + Supabase MINI-APPS-CLOUD

## Источники истины

### Backend
Backend и финансовая логика формируются только из:
1. канонического TECH workbook;
2. канонического USER workbook;
3. APP-004 ТЗ.

Не добавляются синтетические пользовательские расходы, обязательства, долги или состояния.

### Frontend
Визуальным source of truth являются шесть approved PNG из Google Drive `03_UI_REFERENCE/APPROVED`:
1. Desktop Dashboard;
2. Search / Results;
3. Desktop History;
4. Universal Detail Card;
5. Mobile Dashboard;
6. Desktop Settings.

Frontend обязан повторять их композицию, сетку, плотность и визуальный язык. `APP-004-VISUAL-TZ.md` дополняет поведение и детали, которых не видно на статичных изображениях.

## Реализованный runtime

GitHub Pages SPA:
- `index.html`
- `styles.css`
- `app.js`
- `assets/fallback.svg`

Без отдельного build framework. Supabase JS загружается как pinned ESM dependency.

### Auth / security
- Supabase Auth;
- email/password;
- magic-link;
- frontend использует только publishable key;
- service-role и database secrets отсутствуют;
- все пользовательские данные защищены RLS;
- anon visibility = 0;
- unrelated authenticated user visibility = 0.

### Dashboard
- единый глобальный поиск;
- источники Favorite / Research / Events;
- quick filters;
- Favorite;
- увеличенный Research;
- Events LIVE;
- monthly budget;
- weather today: утро / день / вечер / ночь;
- weather 7 days;
- desktop layout по approved Dashboard;
- mobile layout по approved Mobile Dashboard.

### Search / Results
- контекстный экран, не постоянная top-nav вкладка;
- Favorite / Research / Events;
- двухколоночная filter panel как в approved PNG;
- плотная табличная выдача;
- search text;
- source filters;
- Москва / МО;
- Один / Вместе;
- День / Вечер;
- Улица / Помещение;
- district;
- experience class/subtype;
- max price;
- max travel time;
- max total time;
- main state;
- numeric emotion thresholds;
- canonical atmosphere fields;
- discount-only;
- ticket availability;
- sorting.

Canonical gaps are shown honestly:
- Architecture filter is disabled because current canon has no filled architecture tag/score.
- “Можно купить на месте” is disabled because current canon has no confirmed rows matching that state.
- Events do not inherit atmosphere attributes by inference.

### History
- search;
- year;
- Alone / Together;
- Day / Evening;
- main state;
- rating threshold;
- Repeat?;
- month grouping;
- expandable Visit;
- factual expense block.

Canonical limitation:
- imported 21 legacy Visits currently have `visit_total = NULL`;
- therefore the Visit-cost filter is disabled instead of inventing values.

### Universal Detail
- hero/gallery;
- source/rating/title/context;
- tags;
- actions only when canonical URL exists;
- emotions;
- atmosphere;
- why go / downside;
- route;
- quick summary;
- visit history;
- repeat verdict.

### Settings
- Budget;
- Search defaults;
- Location / road;
- Weather;
- Interface;
- Account / My Data / Support / About;
- versioned budget update through RPC;
- no redundant budget version if amount did not change;
- effective month cannot silently become historical;
- RLS-safe user data export;
- reset of interface defaults.

### Weather
Open-Meteo public endpoints, no frontend secret:
- configured city geocoding;
- hourly data for four periods;
- seven-day forecast;
- `show_weather`;
- `show_week_forecast`.

## Media

Supabase Storage bucket:
- `app004-media`;
- public web-readable asset bucket;
- JPEG / PNG / WEBP / AVIF;
- 8 MB file limit.

Google Drive remains master/recovery library.

Current canonical content folders:
- favorites — empty;
- research — empty;
- events — empty;
- fallback — empty.

Therefore production cards currently use the neutral local fallback. No synthetic photos were added.

## Integration QA

Verified:
- frontend tables exist;
- Settings fields used by frontend exist;
- budget RPC signatures exist;
- authenticated owner can read/write expected entities;
- anon sees 0 APP-004 user rows;
- unrelated authenticated UUID sees 0 APP-004 user rows;
- rollback QA leaves 0 synthetic residue;
- production financial tables remain empty until real user actions;
- JavaScript validation workflow passes;
- native GitHub Pages deployment passes.

Latest audited data state:
- Favorite active: 10;
- Research active: 154;
- Event Occurrences SHOW: 33;
- Visits: 21;
- Visits with factual `visit_total`: 0;
- Media rows: 0;
- QA residue: 0.

## What remains before release

1. Add real content images to Drive `04_CONTENT_IMAGES` and mirror them to `app004-media`.
2. Authenticated visual acceptance check against the six approved PNGs on the live Pages runtime.
3. Fix any pixel/layout differences found during that visual pass.
4. Run end-to-end user-flow QA in browser:
   - login;
   - Dashboard → Search → Detail;
   - History;
   - Settings;
   - budget version save;
   - real Research → Visit workflow when a real Visit occurs.
5. QA-014 Research → Visit remains the final real-life SOAK before release.

## Live runtime

https://setjip-spec.github.io/APP-004-Moscow-MO/
