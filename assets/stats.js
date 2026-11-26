// Лічильник громадського контролю: data/stats.json (оновлює бот гільдії).
(function () {
  const el = document.querySelector('[data-stats]');
  if (!el) return;
  const labels = [['appeals', 'звернень громадян прийнято'], ['requests', 'запитів до органів влади'],
                  ['complaints', 'скарг до наглядових органів'], ['deputies', 'звернень до депутатів'],
                  ['investigations', 'розслідувань опубліковано'], ['news', 'правових новин за останній час']];
  fetch('data/stats.json?t=' + Date.now()).then(r => r.ok ? r.json() : null).catch(() => null).then(s => {
    if (!s) { el.closest('section').style.display = 'none'; return; }
    el.innerHTML = labels.map(([k, t]) => `<div class="stat"><b>${s[k] || 0}</b><span>${t}</span></div>`).join('');
  });
})();
