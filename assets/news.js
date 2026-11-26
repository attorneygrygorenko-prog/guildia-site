// Стрічка новин: читає data/news.json, який оновлює Telegram-бот гільдії.
(function () {
  const lists = document.querySelectorAll('[data-news]');
  if (!lists.length) return;

  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  // Дозволяємо лише <b> та <i> з тексту поста — решту екрануємо.
  const safe = html => esc(html)
    .replace(/&lt;(\/?)(b|i)&gt;/g, '<$1$2>')
    .replace(/&lt;a href=&quot;(https?:\/\/[^&"\s]+)&quot;&gt;(.*?)&lt;\/a&gt;/g, '<a href="$1" target="_blank" rel="noopener">$2</a>')
    .replace(/\n{2,}/g, '</p><p>').replace(/\n/g, '<br>');
  const fmt = iso => {
    const d = new Date(iso);
    return isNaN(d) ? '' : d.toLocaleDateString('uk-UA', {day: 'numeric', month: 'long', year: 'numeric'}) +
      ', ' + d.toLocaleTimeString('uk-UA', {hour: '2-digit', minute: '2-digit'});
  };
  const host = u => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return ''; } };

  const shareBar = (url, text) => {
    const u = encodeURIComponent(url || location.href), t = encodeURIComponent((text || '').slice(0, 200));
    return `<div class="share"><span>Поділитися:</span>
      <a href="https://t.me/share/url?url=${u}&text=${t}" target="_blank" rel="noopener">Telegram</a>
      <a href="https://www.facebook.com/sharer/sharer.php?u=${u}" target="_blank" rel="noopener">Facebook</a>
      <a href="viber://forward?text=${t}%20${u}">Viber</a>
      <a href="#" onclick="navigator.clipboard&&navigator.clipboard.writeText(decodeURIComponent('${u}'));this.textContent='Скопійовано ✓';return false">Копіювати</a></div>`;
  };
  function card(n) {
    return `<article class="news-card${n.local ? ' is-local' : ''}">
      <div class="news-meta"><time>${esc(fmt(n.date))}</time>${n.press ? '<span class="news-badge" style="background:var(--gold);color:var(--navy-2)">Заява гільдії</span>' : (n.local ? '<span class="news-badge">Одеса</span>' : '')}</div>
      <div class="news-body"><p>${safe(n.html)}</p></div>
      <div class="news-links">
        ${n.source ? `<a href="${esc(n.source)}" target="_blank" rel="noopener">Джерело: ${esc(host(n.source))}</a>` : ''}
        ${n.tg ? `<a href="${esc(n.tg)}" target="_blank" rel="noopener">Обговорити в Telegram →</a>` : ''}
      </div>
      ${shareBar(n.tg || location.href, (n.html||'').replace(/<[^>]+>/g,''))}
    </article>`;
  }

  fetch('data/news.json?t=' + Date.now())
    .then(r => r.ok ? r.json() : [])
    .catch(() => [])
    .then(items => {
      lists.forEach(el => {
        const limit = +el.dataset.limit || items.length;
        const render = filter => {
          const shown = items.filter(n => filter !== 'local' || n.local).slice(0, limit);
          el.innerHTML = shown.length ? shown.map(card).join('')
            : '<p class="news-empty">Новини з’являться тут найближчим часом — бот гільдії публікує їх щогодини. Поки що читайте нас у <a href="https://t.me/yurist_na_antidepresantah" target="_blank" rel="noopener">Telegram</a>.</p>';
        };
        render('all');
        const tabs = document.querySelector(el.dataset.tabs || '#none');
        if (tabs) tabs.addEventListener('click', e => {
          const b = e.target.closest('button[data-filter]');
          if (!b) return;
          tabs.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
          render(b.dataset.filter);
        });
      });
    });
})();
