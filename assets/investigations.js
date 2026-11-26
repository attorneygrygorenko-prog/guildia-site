// Розслідування гільдії (OSINT-досьє): data/investigations.json — оновлює бот після погодження головою.
(function () {
  const el = document.querySelector('[data-investigations]');
  if (!el) return;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const fmt = iso => { const d = new Date(iso); return isNaN(d) ? '' : d.toLocaleDateString('uk-UA', {day:'numeric', month:'long', year:'numeric'}); };
  const host = u => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return u; } };
  const body = (text, sources) => esc(text)
    .replace(/\[F(\d+)\]/g, (m, n) => sources[n - 1] ? `<a class="ref" href="${esc(sources[n - 1])}" target="_blank" rel="noopener">[${n}]</a>` : m)
    .replace(/^(📌|❓|⚖️)\s*([^\n]+)/gm, '<h4>$1 $2</h4>')
    .replace(/\n/g, '<br>');
  fetch('data/investigations.json?t=' + Date.now()).then(r => r.ok ? r.json() : []).catch(() => []).then(items => {
    el.innerHTML = items.length ? items.map(x => `
      <article class="inv">
        <div class="news-meta"><time>${esc(fmt(x.date))}</time><span class="news-badge" style="background:var(--navy)">Розслідування</span></div>
        <h3>${esc(x.title)}</h3>
        <div class="inv-body">${body(x.text, x.sources || [])}</div>
        <details class="inv-src"><summary>Джерела (${(x.sources || []).length})</summary>
          <ol>${(x.sources || []).map(u => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(host(u))}</a></li>`).join('')}</ol></details>
        ${x.tg ? `<div class="news-links"><a href="${esc(x.tg)}" target="_blank" rel="noopener">Обговорити в Telegram →</a></div>` : ''}
      </article>`).join('')
      : '<p class="news-empty">Перші розслідування гільдії з’являться тут найближчим часом.</p>';
  });
})();
