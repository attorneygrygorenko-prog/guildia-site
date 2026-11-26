// Маскот гільдії — мартин-правозахисник Мартин Гільдієвич. Подорожує екраном, говорить, веде до звернення.
(function () {
  try { if (sessionStorage.getItem('mascot-off') === '1') return; } catch (e) {}
  const APPEAL = 'https://t.me/yurist_na_antidepresantah_bot?start=zvernennya';
  const PHRASES = [
    'Шо, знову порушують ваші права? Таки подайте звернення!',
    'Я вас умоляю, запит на публічну інформацію — це не страшно. Це красиво.',
    'Чиновник мовчить п’ять днів? Ой, не смішіть мої лапки — пишемо скаргу.',
    'Це дві великі різниці: «вибачте» і «відповідь у строк, передбачений законом».',
    'Не робіть мені вагітну голову — натисніть сюди, і гільдія візьме в роботу.',
    'Бачу декларацію — питаю: звідки статки? Таки цікаво!',
    'Суд закритий для камер? А ми його — для свавілля.',
    'Мартин Гільдієвич на зв’язку. Корупцію чую за три квартали від Привозу.',
    'Шоб я так жив, як деякі депутати відповідають на звернення. Тобто ніяк.',
    'Тихо, ша! Я сканую реєстри.',
    'Ой вей, шо робиться! Ще один тендер без конкурсу.',
    'Відповідь у строк — от це цимес. А відписка — халоймес.',
    'Шо за гармидер у тій приймальні? Таки-да, пишемо скаргу.',
    'Таки-да, я мартин. Але юридично підкований.',
    'Обіцянки без документів — це халоймес, а не відповідь.',
  ];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const css = document.createElement('style');
  css.textContent = `
  .mascot{position:fixed;left:0;top:0;z-index:60;width:var(--ms,130px);cursor:pointer;will-change:transform;
    transition:transform var(--dur,4s) cubic-bezier(.45,.05,.35,1);filter:drop-shadow(0 10px 14px rgba(11,29,63,.25))}
  .mascot .body{transform-origin:50% 90%;transition:transform .35s}
  .mascot.flip .body{transform:scaleX(-1)}
  .mascot img{width:100%;display:block;user-select:none;-webkit-user-drag:none}
  .mascot.walk .wob{animation:waddle .42s ease-in-out infinite alternate}
  .mascot.fly .wob{animation:flap .5s ease-in-out infinite alternate}
  .mascot.idle .wob{animation:bob 2.4s ease-in-out infinite}
  .mascot .wob{transform-origin:50% 95%}
  @keyframes waddle{from{transform:rotate(-5deg) translateY(0)}to{transform:rotate(5deg) translateY(-4px)}}
  @keyframes flap{from{transform:translateY(-6px) rotate(-3deg) scale(1.02)}to{transform:translateY(-18px) rotate(3deg) scale(.98)}}
  @keyframes bob{0%,100%{transform:translateY(0) rotate(0)}30%{transform:translateY(-3px) rotate(-2deg)}60%{transform:translateY(0) rotate(2.5deg)}}
  .mascot.act-peck .wob{animation:peck 1.6s ease-in-out}
  .mascot.act-preen .wob{animation:preen 2.2s ease-in-out}
  .mascot.act-scream .wob{animation:scream 1.4s ease-in-out}
  .mascot.act-stomp .wob{animation:stomp .18s linear 10}
  .mascot.act-hop .wob{animation:hop .9s cubic-bezier(.3,1.5,.6,1) 2}
  .mascot.act-look .body{animation:look 2.4s steps(1) 1}
  @keyframes peck{0%,100%{transform:rotate(0)}15%,45%,75%{transform:rotate(24deg) translateY(6px)}30%,60%,90%{transform:rotate(4deg)}}
  @keyframes preen{0%,100%{transform:rotate(0)}20%{transform:rotate(-14deg)}35%{transform:rotate(-10deg) translateX(-3px)}50%{transform:rotate(-16deg)}70%{transform:rotate(-8deg)}}
  @keyframes scream{0%,100%{transform:rotate(0)}20%{transform:rotate(-12deg) scale(1.04)}30%,50%,70%{transform:rotate(-16deg) translateY(-3px)}40%,60%{transform:rotate(-10deg)}}
  @keyframes stomp{0%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-3px) rotate(3deg)}100%{transform:translateY(0) rotate(-3deg)}}
  @keyframes hop{0%,100%{transform:translateY(0)}50%{transform:translateY(-38px) rotate(-4deg)}}
  @keyframes look{0%{transform:scaleX(1)}25%{transform:scaleX(-1)}50%{transform:scaleX(1)}75%{transform:scaleX(-1)}100%{transform:scaleX(1)}}
  .mprop{position:fixed;z-index:61;font-size:26px;pointer-events:none;transition:transform 1.4s cubic-bezier(.3,.7,.4,1),opacity 1.4s}
  .mascot .say{position:absolute;bottom:92%;left:50%;transform:translateX(-50%) scale(.6);opacity:0;pointer-events:none;
    width:230px;background:#fff;color:#14213D;font:600 13.5px/1.4 Manrope,system-ui,sans-serif;padding:11px 14px;border-radius:16px;
    box-shadow:0 12px 30px rgba(19,44,92,.22);transition:.3s cubic-bezier(.3,1.6,.6,1);text-align:left}
  .mascot .say::after{content:"";position:absolute;top:100%;left:50%;margin-left:-8px;border:8px solid transparent;border-top-color:#fff}
  .mascot .say b{display:block;color:#9E1F33;font-size:11px;letter-spacing:.08em;text-transform:uppercase;margin-bottom:3px}
  .mascot.talk .say{opacity:1;transform:translateX(-50%) scale(1)}
  .mascot.edge-r .say{left:auto;right:0;transform:scale(.6)} .mascot.edge-r.talk .say{transform:scale(1)}
  .mascot.edge-r .say::after{left:auto;right:28px}
  .mascot.edge-l .say{left:0;transform:scale(.6)} .mascot.edge-l.talk .say{transform:scale(1)}
  .mascot.edge-l .say::after{left:28px}
  .mascot .x{position:absolute;top:-6px;right:-4px;width:22px;height:22px;border-radius:50%;border:0;background:#132C5C;color:#fff;
    font:700 13px/22px system-ui;cursor:pointer;opacity:0;transition:.2s}
  .mascot:hover .x{opacity:1}
  @media (max-width:760px){.mascot{--ms:92px}.mascot .say{width:190px;font-size:12.5px}}`;
  document.head.appendChild(css);

  const el = document.createElement('div');
  el.className = 'mascot idle';
  el.setAttribute('role', 'button');
  el.setAttribute('aria-label', 'Маскот гільдії Мартин Гільдієвич: подати звернення');
  el.innerHTML = `<div class="say"><b>Мартин Гільдієвич</b><span></span></div>
    <button class="x" aria-label="Сховати маскота">×</button>
    <div class="body"><div class="wob"><img src="assets/mascot.png" alt="Мартин Гільдієвич — маскот Південної правозахисної гільдії"></div></div>`;
  document.body.appendChild(el);

  let x = 0, y = 0, timer;
  const size = () => el.getBoundingClientRect();
  const bounds = () => {
    const r = size(), W = innerWidth, H = innerHeight, mobile = W < 760;
    return { minX: 8, maxX: W - r.width - 8, minY: mobile ? H * 0.55 : 90, maxY: H - r.height - 8 };
  };
  const place = (nx, ny, dur) => {
    el.style.setProperty('--dur', dur + 's');
    el.classList.toggle('flip', nx < x);       // дивиться в бік руху
    x = nx; y = ny;
    el.style.transform = `translate(${x}px, ${y}px)`;
    const w = size().width;
    el.classList.toggle('edge-r', x + w / 2 + 125 > innerWidth);
    el.classList.toggle('edge-l', x + w / 2 - 125 < 0);
  };
  const say = (t) => {
    el.querySelector('.say span').textContent = t;
    el.classList.add('talk');
    setTimeout(() => el.classList.remove('talk'), 5200);
  };

  const prop = (emoji, fromX, fromY, toX, toY, fade = true) => {
    const p = document.createElement('div');
    p.className = 'mprop'; p.textContent = emoji;
    p.style.transform = `translate(${fromX}px, ${fromY}px)`;
    document.body.appendChild(p);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      p.style.transform = `translate(${toX}px, ${toY}px) rotate(${Math.random() * 120 - 60}deg)`;
      if (fade) p.style.opacity = '0';
    }));
    setTimeout(() => p.remove(), 1600);
  };
  const ACTS = [
    { cls: 'act-peck', ms: 1700, say: 'Клюю крихти справедливості. Поки що крихти.',
      fx: (r) => { for (let i = 0; i < 4; i++) prop('·', r.left + r.width * 0.25 + i * 8, r.bottom - 14, r.left + r.width * 0.2 + i * 14, r.bottom - 40 - i * 6); } },
    { cls: 'act-preen', ms: 2300, say: 'Чищу пір’я. Репутація — вона як пір’я: раз забруднив — і вже не полетиш.',
      fx: (r) => prop('🪶', r.left + r.width * 0.6, r.top + r.height * 0.4, r.left + r.width * 0.75, r.bottom + 30) },
    { cls: 'act-scream', ms: 1500, say: 'КЬЯ-КЬЯ-КЬЯ! Ой вей, строки відповіді на запит минули!' },
    { cls: 'act-stomp', ms: 1900, say: 'Тупцюю, як мартин на пляжі: виманюю корупціонерів з-під землі. Ну і гармидер там!' },
    { cls: 'act-hop', ms: 1900, say: 'Стрибаю від радості: орган відповів у строк. Оце цимес!' },
    { cls: 'act-look', ms: 2500, say: 'Шо тут у нас? Хто тут без декларації?' },
    { cls: 'act-hop', ms: 1900, say: 'Хто сказав, шо чебурек був ваш? Таки вже мій.',
      fx: (r) => prop('🥟', -40, r.top - 80, r.left + r.width * 0.15, r.top + r.height * 0.35, false) },
  ];
  function activity() {
    const a = ACTS[Math.floor(Math.random() * ACTS.length)];
    const r = size();
    el.classList.add(a.cls);
    if (a.fx) a.fx(r);
    if (Math.random() < 0.6) say(a.say);
    setTimeout(() => el.classList.remove(a.cls), a.ms);
    return a.ms;
  }

  function journey() {
    const b = bounds();
    const nx = b.minX + Math.random() * (b.maxX - b.minX);
    const ny = b.minY + Math.random() * (b.maxY - b.minY);
    const dist = Math.hypot(nx - x, ny - y);
    const flying = dist > 520 || Math.abs(ny - y) > 260;      // далеко — перелітає
    const dur = Math.min(9, Math.max(2.5, dist / (flying ? 260 : 120)));
    el.classList.remove('idle', 'walk', 'fly');
    el.classList.add(flying ? 'fly' : 'walk');
    place(nx, ny, dur);
    timer = setTimeout(() => {
      el.classList.remove('walk', 'fly');
      el.classList.add('idle');
      // на зупинці — чаячі справи, іноді — фраза про права
      let t = 600;
      if (Math.random() < 0.75) t += activity();
      else say(PHRASES[Math.floor(Math.random() * PHRASES.length)]);
      if (Math.random() < 0.45) setTimeout(() => activity(), t + 2500);
      timer = setTimeout(journey, t + 5000 + Math.random() * 5000);
    }, dur * 1000);
  }

  // старт: з правого нижнього кута
  const b0 = bounds();
  x = b0.maxX; y = b0.maxY;
  el.style.transition = 'none';
  el.style.transform = `translate(${x}px, ${y}px)`;
  requestAnimationFrame(() => { el.style.transition = ''; });
  el.classList.add('edge-r');   // старт у правому куті — хмарка вліво
  setTimeout(() => say('Добрий день! Я Мартин Гільдієвич. Як шо порушили права — клацайте на мене.'), 1500);
  if (!reduce) timer = setTimeout(journey, 7000);

  el.addEventListener('click', (e) => {
    if (e.target.closest('.x')) {
      e.stopPropagation();
      clearTimeout(timer);
      el.remove();
      try { sessionStorage.setItem('mascot-off', '1'); } catch (er) {}
      return;
    }
    window.open(APPEAL, '_blank', 'noopener');
  });
  el.addEventListener('mouseenter', () => say(PHRASES[Math.floor(Math.random() * PHRASES.length)]));
  addEventListener('resize', () => { const b = bounds(); place(Math.min(x, b.maxX), Math.min(Math.max(y, b.minY), b.maxY), 0.6); });
})();
