// «Пан Мовчун»: органи, що не відповіли гільдії в строк (data/movchun.json, оновлює бот).
(function () {
  const items = document.querySelector('[data-mv-items]');
  if (!items) return;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const d = s => s.split('-').reverse().join('.');
  const days = n => n + ' ' + (n % 10 === 1 && n % 100 !== 11 ? 'день' : [2,3,4].includes(n % 10) && ![12,13,14].includes(n % 100) ? 'дні' : 'днів');
  fetch('data/movchun.json?t=' + Date.now()).then(r => r.ok ? r.json() : null).catch(() => null).then(data => {
    const list = (data && data.items) || [], rank = (data && data.rank) || [];
    document.querySelector('[data-mv-total]').innerHTML = list.length
      ? `<b>${list.length}</b><span>документів гільдії зараз без відповіді понад строк</span>`
      : `<b>0</b><span>Поки всі органи відповідають у строк. Мартин стежить.</span>`;
    const max = Math.max(1, ...rank.map(r => r.count));
    document.querySelector('[data-mv-rank]').innerHTML = rank.slice(0, 10).map((r, i) => `
      <div class="mv-row"><span class="mv-place">${i + 1}</span><div class="mv-bar-wrap"><div class="mv-name">${esc(r.authority)}</div>
      <div class="mv-bar" style="width:${Math.max(8, r.count / max * 100)}%"></div></div>
      <div class="mv-count"><b>${r.count}</b><small>макс. ${days(r.days)}</small></div></div>`).join('')
      || '<p class="news-empty">Рейтинг порожній — і це найкраща новина.</p>';
    items.innerHTML = list.map(x => `<tr><td>ППЗГ-${x.id}</td><td>${esc(x.authority)}</td>
      <td><small>${esc(x.kind)}</small><br>${esc(x.subject)}</td><td>${d(x.sent)}</td>
      <td class="mv-late">${days(x.days)}</td></tr>`).join('')
      || '<tr><td colspan="5" class="news-empty">Прострочених відповідей немає.</td></tr>';
  });
})();
