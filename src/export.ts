import { STATUS_LABEL, type Status, type Zayavka } from './types'

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// Экранируем текст, чтобы безопасно вставить его в HTML.
function esc(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Цвета статусов для «таблетки» в PDF.
const STATUS_STYLE: Record<Status, { bg: string; fg: string; dot: string }> = {
  in_progress: { bg: '#ecfdf5', fg: '#047857', dot: '#10b981' },
  suspended: { bg: '#fffbeb', fg: '#b45309', dot: '#f59e0b' },
  not_started: { bg: '#f1f5f9', fg: '#64748b', dot: '#94a3b8' },
}

function statusPill(status: Status): string {
  const s = STATUS_STYLE[status]
  return `<span class="pill" style="background:${s.bg};color:${s.fg}">
      <span class="dot" style="background:${s.dot}"></span>${esc(STATUS_LABEL[status])}
    </span>`
}

function buildHtml(items: Zayavka[]): string {
  const now = new Date()
  const generated = formatDate(now.toISOString())
  const total = items.length
  const inProgress = items.filter((z) => z.status === 'in_progress').length
  const suspended = items.filter((z) => z.status === 'suspended').length
  const notStarted = items.filter((z) => z.status === 'not_started').length

  const rows = items
    .map(
      (z, i) => `
      <tr>
        <td class="num">${i + 1}</td>
        <td><span class="branch">${esc(z.branch)}</span></td>
        <td class="nowrap"><b>№ ${esc(z.number)}</b></td>
        <td class="comment">${z.comment ? esc(z.comment) : '<span class="muted">— без описания —</span>'}</td>
        <td>${statusPill(z.status)}</td>
        <td class="nowrap date">${esc(formatDate(z.createdAt))}</td>
      </tr>`,
    )
    .join('')

  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8" />
<title>Заявки СОЭ — ${esc(generated)}</title>
<style>
  * { box-sizing: border-box; }
  html, body {
    margin: 0;
    padding: 0;
    font-family: "Segoe UI", system-ui, -apple-system, Roboto, Arial, sans-serif;
    color: #0f172a;
    background: #fff;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .page { padding: 32px 36px; }

  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding-bottom: 18px;
    border-bottom: 3px solid #0f172a;
  }
  .head .title { font-size: 22px; font-weight: 800; letter-spacing: -0.3px; }
  .head .subtitle { font-size: 12px; color: #64748b; margin-top: 4px; }
  .head .meta { text-align: right; font-size: 12px; color: #64748b; line-height: 1.5; }
  .head .meta b { color: #0f172a; }

  .summary { display: flex; gap: 12px; margin: 22px 0; }
  .card {
    flex: 1;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 12px 16px;
    background: #f8fafc;
  }
  .card .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; }
  .card .value { font-size: 26px; font-weight: 800; margin-top: 2px; }
  .card.green { background: #ecfdf5; border-color: #a7f3d0; }
  .card.green .value { color: #047857; }
  .card.amber { background: #fffbeb; border-color: #fde68a; }
  .card.amber .value { color: #b45309; }
  .card.slate .value { color: #475569; }

  table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
  thead th {
    text-align: left;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    color: #fff;
    background: #1e293b;
    padding: 9px 10px;
  }
  thead th:first-child { border-top-left-radius: 8px; }
  thead th:last-child { border-top-right-radius: 8px; }
  tbody td {
    padding: 10px;
    border-bottom: 1px solid #e2e8f0;
    vertical-align: top;
  }
  tbody tr:nth-child(even) { background: #f8fafc; }
  .num { color: #94a3b8; width: 26px; }
  .nowrap { white-space: nowrap; }
  .date { color: #64748b; }
  .muted { color: #94a3b8; font-style: italic; }
  .comment { width: 42%; line-height: 1.5; word-break: break-word; }
  .branch {
    display: inline-block;
    background: #eff6ff;
    color: #1d4ed8;
    font-weight: 600;
    border-radius: 6px;
    padding: 3px 8px;
    font-size: 11.5px;
  }
  .pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border-radius: 999px;
    padding: 3px 10px;
    font-size: 11.5px;
    font-weight: 600;
    white-space: nowrap;
  }
  .pill .dot { width: 7px; height: 7px; border-radius: 999px; display: inline-block; }

  .empty {
    margin-top: 40px;
    text-align: center;
    color: #94a3b8;
    border: 1px dashed #cbd5e1;
    border-radius: 12px;
    padding: 48px;
  }
  .foot { margin-top: 24px; font-size: 11px; color: #94a3b8; text-align: center; }

  @page { size: A4 landscape; margin: 14mm; }
  @media print {
    .page { padding: 0; }
    thead { display: table-header-group; }
    tr { break-inside: avoid; }
  }
</style>
</head>
<body>
  <div class="page">
    <div class="head">
      <div>
        <div class="title">Контроль заявок Дежурного СОЭ</div>
        <div class="subtitle">Реестр активных (оставшихся) заявок</div>
      </div>
      <div class="meta">
        Сформировано:<br /><b>${esc(generated)}</b>
      </div>
    </div>

    <div class="summary">
      <div class="card"><div class="label">Всего заявок</div><div class="value">${total}</div></div>
      <div class="card green"><div class="label">Ведутся работы</div><div class="value">${inProgress}</div></div>
      <div class="card amber"><div class="label">Приостановлены</div><div class="value">${suspended}</div></div>
      <div class="card slate"><div class="label">Не начато</div><div class="value">${notStarted}</div></div>
    </div>

    ${
      total === 0
        ? '<div class="empty">Активных заявок нет.</div>'
        : `<table>
      <thead>
        <tr>
          <th>#</th>
          <th>Филиал</th>
          <th>Номер</th>
          <th>Комментарий</th>
          <th>Статус</th>
          <th>Добавлено</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`
    }

    <div class="foot">Контроль заявок Дежурного СОЭ · документ сформирован автоматически</div>
  </div>
</body>
</html>`
}

// Экспорт активных заявок в PDF.
// Открывает оформленную страницу и вызывает печать — в диалоге печати
// нужно выбрать «Сохранить как PDF».
// Возвращает true, если окно печати удалось открыть (контент уже сформирован).
export function exportToPdf(items: Zayavka[]): boolean {
  const html = buildHtml(items)

  const win = window.open('', '_blank')
  if (!win) {
    alert('Не удалось открыть окно печати. Разрешите всплывающие окна для этого сайта.')
    return false
  }

  win.document.open()
  win.document.write(html)
  win.document.close()

  const triggerPrint = () => {
    win.focus()
    win.print()
  }

  if (win.document.readyState === 'complete') {
    setTimeout(triggerPrint, 300)
  } else {
    win.onload = () => setTimeout(triggerPrint, 300)
  }

  return true
}
