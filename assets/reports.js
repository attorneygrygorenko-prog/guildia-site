// Щомісячні звіти громадського контролю: data/reports.json (оновлює бот після погодження головою).
(function () {
  const el = document.querySelector('[data-reports]');
  if (!el) return;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const safe = h => esc(h).replace(/&lt;(\/?)(b|i)&gt;/g, '<$1$2>').replace(/\n{2,}/g, '</p><p>').replace(/\n/g, '<br>');
  fetch('data/reports.json?t=' + Date.now()).then(r => r.ok ? r.json() : []).catch(() => []).then(items => {
    el.innerHTML = items.length ? items.map(r => `
      <article class="report">
        <div class="report-head"><span class="news-badge" style="background:var(--navy)">${esc(r.period)}</span></div>
        <div class="report-stats">${Object.entries(r.stats || {}).map(([k, v]) =>
          `<div><b>${esc(v)}</b><span>${esc(k)}</span></div>`).join('')}</div>
        <div class="news-body"><p>${safe(r.html)}</p></div>
        ${r.tg ? `<div class="news-links"><a href="${esc(r.tg)}" target="_blank" rel="noopener">Звіт у Telegram →</a></div>` : ''}
      </article>`).join('')
      : '<p class="news-empty">Перший щомісячний звіт громадського контролю з’явиться тут на початку наступного місяця.</p>';
  });
})();
