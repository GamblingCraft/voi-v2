# ВОЙ — версия 2

Работайте только в этой папке, если пользователь не просит изменить соседний проект отдельно.
Сохраняйте текущий дизайн и весь пользовательский функционал, данные каталога и существующие маршруты. Не придумывайте коммерческие факты.

Переход страниц: текущая страница уходит влево, следующая появляется снизу. Анимации должны иметь корректную очистку и учитывать reduced motion. Для UI используйте стили ВОЙ, TT Norms Expanded и общие стеклянные поверхности.

Используйте Server Components для статичного контента; браузерное состояние, DOM, анимацию и WebGL изолируйте в Client Components/hooks. Документация установленного Next.js находится в `node_modules/next/dist/docs/`.

Перед завершением рефакторинга запускайте typecheck, lint и сборку; проверяйте затронутые маршруты и мобильный вид. `README.md` описывает структуру, `DESIGN.md` — текущие визуальные требования.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
