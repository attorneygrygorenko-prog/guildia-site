// Маскот гільдії — Мартин Гільдієвич, мартин-правозахисник.
// Плавна покадрова анімація (requestAnimationFrame): ходьба по кривій з перевальцем, політ дугою зі змахами,
// м'яка посадка, плавний розворот, «дихання» в спокої, тінь на землі, чаячі справи на зупинках.
(function () {
  try { if (sessionStorage.getItem('mascot-off') === '1') return; } catch (e) {}
  const APPEAL = 'https://t.me/yurist_na_antidepresantah_bot?start=zvernennya';
  const PHRASES = [
    'Шо, знову порушують ваші права? Таки подайте звернення!',
    'Я вас умоляю, запит на публічну інформацію — це не страшно. Це красиво.',
    'Чиновник мовчить п’ять днів? Ой, не смішіть мої лапки — пишемо скаргу.',
    'Це дві великі різниці: «вибачте» і «відповідь у строк, передбачений законом».',
    'Не робіть мені вагітну голову — клацніть на мене, і гільдія візьме в роботу.',
    'Бачу декларацію — питаю: звідки статки? Таки цікаво!',
    'Мартин Гільдієвич на зв’язку. Корупцію чую за три квартали від Привозу.',
    'Шоб я так жив, як деякі депутати відповідають на звернення. Тобто ніяк.',
    'Тихо, ша! Я сканую реєстри.',
    'Ой вей, шо робиться! Ще один тендер без конкурсу.',
    'Відповідь у строк — от це цимес. А відписка — халоймес.',
    'Шо за гармидер у тій приймальні? Таки-да, пишемо скаргу.',
    'Таки-да, я мартин. Але юридично підкований.',
  ];
  const ACTS = [
    { name: 'peck', ms: 1800, say: 'Клюю крихти справедливості. Поки що крихти.', fx: 'crumbs' },
    { name: 'preen', ms: 2400, say: 'Чищу пір’я. Репутація — як пір’я: раз забруднив — і вже не полетиш.', fx: 'feather' },
    { name: 'scream', ms: 1600, say: 'КЬЯ-КЬЯ-КЬЯ! Ой вей, строки відповіді на запит минули!' },
    { name: 'stomp', ms: 2000, say: 'Тупцюю, як мартин на пляжі: виманюю корупціонерів з-під землі. Ну і гармидер там!' },
    { name: 'hop', ms: 1500, say: 'Стрибаю від радості: орган відповів у строк. Оце цимес!' },
    { name: 'look', ms: 2600, say: 'Шо тут у нас? Хто тут без декларації?' },
    { name: 'hop', ms: 1500, say: 'Хто сказав, шо чебурек був ваш? Таки вже мій.', fx: 'cheburek' },
  ];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ───── розмітка й стилі ─────
  const css = document.createElement('style');
  css.textContent = `
  .mt{position:fixed;left:0;top:0;z-index:60;width:var(--ms,140px);height:var(--mh,140px);cursor:pointer;will-change:transform;touch-action:manipulation}
  .mt-shadow{position:absolute;left:18%;right:18%;bottom:-4px;height:12px;border-radius:50%;
    background:radial-gradient(closest-side,rgba(11,29,63,.32),rgba(11,29,63,0));will-change:transform,opacity}
  .mt-flip,.mt-motion,.mt-pose{position:absolute;inset:0;transform-origin:50% 92%;will-change:transform}
  .mt img{width:100%;height:100%;object-fit:contain;display:block;user-select:none;-webkit-user-drag:none;
    filter:drop-shadow(0 6px 8px rgba(11,29,63,.18))}
  .mt-pose.peck{animation:mt-peck 1.8s cubic-bezier(.45,0,.55,1)}
  .mt-pose.preen{animation:mt-preen 2.4s cubic-bezier(.45,0,.55,1)}
  .mt-pose.scream{animation:mt-scream 1.6s cubic-bezier(.45,0,.55,1)}
  .mt-pose.stomp{animation:mt-stomp 2s linear}
  .mt-pose.hop{animation:mt-hop 1.5s cubic-bezier(.45,0,.55,1)}
  @keyframes mt-peck{0%,100%{transform:rotate(0)}12%,42%,72%{transform:rotate(20deg) translateY(5px)}27%,57%,87%{transform:rotate(3deg)}}
  @keyframes mt-preen{0%,100%{transform:rotate(0)}18%{transform:rotate(-11deg)}34%{transform:rotate(-7deg) translateX(-2px)}52%{transform:rotate(-12deg)}74%{transform:rotate(-5deg)}}
  @keyframes mt-scream{0%,100%{transform:rotate(0) scale(1)}18%{transform:rotate(-10deg) scale(1.03)}30%,54%,78%{transform:rotate(-14deg) translateY(-2px) scale(1.04)}42%,66%{transform:rotate(-9deg) scale(1.02)}}
  @keyframes mt-stomp{0%,20%,40%,60%,80%,100%{transform:translateY(0) rotate(-2.5deg)}10%,30%,50%,70%,90%{transform:translateY(-3px) rotate(2.5deg)}}
  @keyframes mt-hop{0%,100%{transform:translateY(0) scale(1,1)}10%{transform:translateY(0) scale(1.06,.92)}30%{transform:translateY(-34px) scale(.96,1.05)}50%{transform:translateY(0) scale(1.07,.92)}60%{transform:translateY(0) scale(1.05,.94)}75%{transform:translateY(-22px) scale(.97,1.04)}92%{transform:translateY(0) scale(1.05,.95)}}
  .mt-say{position:absolute;bottom:100%;margin-bottom:10px;left:50%;width:236px;max-width:70vw;pointer-events:none;
    background:#fff;color:#14213D;font:600 13.5px/1.45 Manrope,system-ui,sans-serif;padding:11px 14px;border-radius:16px;
    box-shadow:0 14px 34px rgba(19,44,92,.24);opacity:0;transform:translate(var(--bx,-50%),8px) scale(.85);
    transition:opacity .35s ease,transform .45s cubic-bezier(.2,1.4,.4,1)}
  .mt-say::after{content:"";position:absolute;top:100%;left:var(--tail,50%);margin-left:-8px;border:8px solid transparent;border-top-color:#fff}
  .mt-say b{display:block;color:#9E1F33;font-size:11px;letter-spacing:.08em;text-transform:uppercase;margin-bottom:3px}
  .mt.talk .mt-say{opacity:1;transform:translate(var(--bx,-50%),0) scale(1)}
  .mt-x{position:absolute;top:-4px;right:-6px;width:24px;height:24px;border-radius:50%;border:0;background:#132C5C;color:#fff;
    font:700 14px/24px system-ui;cursor:pointer;opacity:0;transition:opacity .2s;z-index:2}
  .mt:hover .mt-x,.mt:focus-within .mt-x{opacity:1}
  .mt-prop{position:fixed;left:0;top:0;z-index:61;font-size:24px;pointer-events:none;will-change:transform,opacity}
  @media (max-width:760px){.mt{--ms:100px;--mh:100px}.mt-say{font-size:12.5px;width:200px}}`;
  document.head.appendChild(css);

  const el = document.createElement('div');
  el.className = 'mt';
  el.setAttribute('role', 'button');
  el.setAttribute('tabindex', '0');
  el.setAttribute('aria-label', 'Мартин Гільдієвич, маскот гільдії: подати звернення');
  el.innerHTML = `<div class="mt-say"><b>Мартин Гільдієвич</b><span></span></div>
    <button class="mt-x" aria-label="Сховати маскота">×</button>
    <div class="mt-shadow"></div>
    <div class="mt-flip"><div class="mt-motion"><div class="mt-pose">
      <img src="assets/mascot-idle.png" alt="Мартин Гільдієвич — маскот Південної правозахисної гільдії"></div></div></div>`;
  document.body.appendChild(el);
  const $ = (s) => el.querySelector(s);
  const IDLE = 'assets/mascot-idle.png', WALK = 'assets/mascot-walk.webp', PARTY = 'assets/mascot-celebrate.webp';
  new Image().src = WALK;                                   // попереднє завантаження циклу кроку
  let partyReady = false;
  setTimeout(() => { const im = new Image(); im.onload = () => (partyReady = true); im.src = PARTY; }, 30000);   // святкова сцена — у фоні
  let sprite = 'idle';
  const setSprite = (kind, force) => {                      // справжні сцени з відео: крок, свято
    if (kind === sprite || (sprite === 'party' && !force)) return;
    sprite = kind;
    el.querySelector('img').src = kind === 'walk' ? WALK : kind === 'party' ? PARTY + '?t=' + Date.now() : IDLE;
  };
  function celebrate() {                                    // молоток, конфеті, окуляри — анфас, ~10 с
    st.acting = true; st.face = 1;
    setSprite('party', true);
    say('Оце цимес! Ще одна перемога гільдії. Таки-да! 😎', 7000);
    setTimeout(() => { setSprite('idle', true); st.acting = false; }, 10000);
    return 10000;
  }
  const flipEl = $('.mt-flip'), motionEl = $('.mt-motion'), poseEl = $('.mt-pose'), shadowEl = $('.mt-shadow'), sayEl = $('.mt-say');

  // ───── стан ─────
  const st = {
    x: 0, y: 0, mode: 'idle',           // idle | walk | fly | land
    from: null, ctrl: null, to: null, t0: 0, dur: 1,
    face: 1, faceShown: 1,              // напрямок погляду (1 — праворуч) і його анімоване значення
    landT0: 0, nextAt: 0, acting: false,
    anticT0: 0, settleT0: -1e9, talkT0: -1e9, mouseX: null, pending: null,
  };
  const ease = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;   // easeInOutCubic
  const bez = (a, c, b, t) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * c + t * t * b;
  const rect = () => el.getBoundingClientRect();
  const area = () => {
    const r = rect(), W = innerWidth, H = innerHeight, m = W < 760;
    return { x0: 10, x1: W - r.width - 10, y0: m ? H * 0.55 : 96, y1: H - r.height - 10 };
  };

  function say(text, ms = 5200) {
    sayEl.querySelector('span').textContent = text;
    const r = rect(), half = Math.min(118, innerWidth * 0.35);
    const center = r.left + r.width / 2;
    let shift = 0;
    if (center + half > innerWidth - 8) shift = innerWidth - 8 - (center + half);
    if (center - half < 8) shift = 8 - (center - half);
    sayEl.style.setProperty('--bx', `calc(-50% + ${shift}px)`);
    sayEl.style.setProperty('--tail', `calc(50% - ${shift}px)`);
    el.classList.add('talk');
    st.talkT0 = performance.now();
    clearTimeout(say.t);
    say.t = setTimeout(() => el.classList.remove('talk'), ms);
  }

  function prop(emoji, x0, y0, x1, y1, ms = 1300, fade = true) {
    const p = document.createElement('div');
    p.className = 'mt-prop'; p.textContent = emoji;
    document.body.appendChild(p);
    const start = performance.now(), rot = Math.random() * 140 - 70;
    (function step(now) {
      const k = Math.min(1, (now - start) / ms), e = ease(k);
      const x = x0 + (x1 - x0) * e, y = y0 + (y1 - y0) * e - Math.sin(k * Math.PI) * 30;
      p.style.transform = `translate(${x}px,${y}px) rotate(${rot * e}deg)`;
      p.style.opacity = fade ? String(1 - k * k) : '1';
      if (k < 1) requestAnimationFrame(step); else p.remove();
    })(start);
  }

  function activity() {
    if (partyReady && Math.random() < 0.14) return celebrate();
    const a = ACTS[Math.floor(Math.random() * ACTS.length)];
    const r = rect();
    st.acting = true;
    if (a.name === 'look') {
      setTimeout(() => (st.face = -st.face), 300);
      setTimeout(() => (st.face = -st.face), 1100);
      setTimeout(() => (st.face = -st.face), 1800);
    } else {
      poseEl.className = 'mt-pose ' + a.name;
    }
    if (a.fx === 'crumbs') for (let i = 0; i < 5; i++)
      setTimeout(() => prop('•', r.left + r.width * (0.3 + i * 0.05), r.bottom - 10, r.left + r.width * (0.2 + i * 0.09), r.bottom - 34, 700), 200 + i * 260);
    if (a.fx === 'feather') prop('🪶', r.left + r.width * 0.62, r.top + r.height * 0.45, r.left + r.width * 0.9, r.bottom + 40, 2200);
    if (a.fx === 'cheburek') prop('🥟', -40, r.top - 90, r.left + r.width * 0.25, r.top + r.height * 0.35, 1100, false);
    if (Math.random() < 0.65) say(a.say);
    setTimeout(() => { poseEl.className = 'mt-pose'; st.acting = false; }, a.ms);
    return a.ms;
  }

  function startTrip(now) {
    const b = area();
    const tx = b.x0 + Math.random() * (b.x1 - b.x0), ty = b.y0 + Math.random() * (b.y1 - b.y0);
    const dx = tx - st.x, dy = ty - st.y, dist = Math.hypot(dx, dy);
    if (dist < 60) { st.nextAt = now + 1500; return; }
    const fly = dist > 480 || Math.abs(dy) > 240;
    st.mode = fly ? 'fly' : 'walk';
    st.from = { x: st.x, y: st.y }; st.to = { x: tx, y: ty };
    const mx = (st.x + tx) / 2, my = (st.y + ty) / 2;
    st.ctrl = fly ? { x: mx, y: Math.min(st.y, ty) - Math.min(260, dist * 0.45) }        // дуга вгору
                  : { x: mx + (Math.random() - 0.5) * dist * 0.35, y: my + (Math.random() - 0.5) * 60 };
    st.dur = fly ? Math.min(5200, 1600 + dist * 3.2) : Math.min(14000, 1200 + dist * 11);   // темп під довжину кроку з відео
    if (Math.abs(dx) > 8) st.face = dx > 0 ? 1 : -1;
    st.pending = st.mode;                    // спершу — замах (антиципація), потім рух
    st.mode = 'antic'; st.anticT0 = now;
  }

  function arrive(now) {
    if (st.mode === 'walk') st.settleT0 = now;   // інерція корпусу після зупинки
    st.mode = st.mode === 'fly' ? 'land' : 'idle';
    st.landT0 = now;
    let wait = 700;
    if (Math.random() < 0.78) wait += activity();
    else say(PHRASES[Math.floor(Math.random() * PHRASES.length)]);
    if (Math.random() < 0.4) setTimeout(() => { if (st.mode === 'idle' && !st.acting) activity(); }, wait + 2200);
    st.nextAt = now + wait + 4500 + Math.random() * 5000;
  }

  // ───── головний цикл ─────
  let last = performance.now();
  function frame(now) {
    const dt = Math.min(64, now - last); last = now;
    const time = now / 1000;
    let lift = 0, rot = 0, sx = 1, sy = 1, bobY = 0;

    if (st.mode === 'antic') {                                     // замах: відхил назад і присід
      const k = Math.min(1, (now - st.anticT0) / 320), s1 = Math.sin(k * Math.PI);
      rot = -6 * s1 * st.face; sy = 1 - 0.06 * s1; sx = 1 + 0.035 * s1;
      if (k >= 1) { st.mode = st.pending; st.t0 = now; }
    } else if (st.mode === 'walk' || st.mode === 'fly') {
      const k = Math.min(1, (now - st.t0) / st.dur), e = ease(k);
      st.x = bez(st.from.x, st.ctrl.x, st.to.x, e);
      st.y = bez(st.from.y, st.ctrl.y, st.to.y, e);
      const speed = Math.min(1, Math.sin(k * Math.PI) * 1.6);    // розгін → крейсерський темп → гальмування
      if (st.mode === 'walk') {
        setSprite('walk');                                        // ноги й корпус рухає сам цикл з відео
        rot = 1.5 * speed * st.face;                              // ледь помітний нахил у бік руху
      } else {
        setSprite('idle');
        const ph = time * 12;
        lift = speed * 26;
        sy = 1 + Math.sin(ph) * 0.03 * speed;                     // змахи
        sx = 1 - Math.sin(ph) * 0.018 * speed;
        rot = 9 * speed * st.face + Math.sin(ph * 0.5) * 2 * speed;   // «супергеройський» нахил у польоті
      }
      if (k >= 1) { arrive(now); setSprite('idle'); }
    } else {
      if (st.mode !== 'antic') setSprite('idle');
      if (st.mode === 'land') {                                    // м'яка посадка: присід і пружинка
        const k = Math.min(1, (now - st.landT0) / 560);
        const s1 = Math.sin(k * Math.PI) * (1 - k * 0.4);
        sy = 1 - 0.1 * s1; sx = 1 + 0.07 * s1;
        if (k >= 1) st.mode = 'idle';
      } else {
        sy = 1 + Math.sin(time * 2.1) * 0.012;                     // дихання
        bobY = 0;
        rot = Math.sin(time * 0.7) * 1.4;                          // переносить вагу
        // стежить поглядом за курсором, як жива людина
        if (st.mouseX !== null && !st.acting) {
          const cx = st.x + rect().width / 2;
          if (Math.abs(st.mouseX - cx) > 80) st.face = st.mouseX > cx ? 1 : -1;
        }
      }
      const ks = (now - st.settleT0) / 700;                        // інерція після ходьби: проскок і пружинне вирівнювання
      if (ks < 1) rot += 7 * st.face * Math.exp(-ks * 4) * Math.cos(ks * 9);
      if (!reduce && !st.acting && st.mode === 'idle' && now > st.nextAt) startTrip(now);
    }
    const kt = (now - st.talkT0) / 2600;                           // киває, коли говорить
    if (kt < 1 && st.mode !== 'fly') rot += Math.sin(kt * 26) * 2.2 * (1 - kt);

    // плавний розворот (стиснення через вузький профіль замість миттєвого віддзеркалення)
    if (sprite === 'party') st.face = 1;
    st.faceShown += (st.face - st.faceShown) * Math.min(1, dt / 90);
    const fs = Math.abs(st.faceShown) < 0.08 ? 0.08 * Math.sign(st.faceShown || 1) : st.faceShown;

    el.style.transform = `translate3d(${st.x.toFixed(1)}px,${(st.y - lift).toFixed(1)}px,0)`;
    flipEl.style.transform = `scaleX(${fs.toFixed(3)})`;
    motionEl.style.transform = `translateY(${bobY.toFixed(2)}px) rotate(${rot.toFixed(2)}deg) scale(${sx.toFixed(3)},${sy.toFixed(3)})`;
    shadowEl.style.transform = `translateY(${lift.toFixed(1)}px) scale(${(1 - lift / 70).toFixed(3)})`;
    shadowEl.style.opacity = String(1 - lift / 45);
    requestAnimationFrame(frame);
  }

  // ───── старт ─────
  const b0 = area();
  st.x = b0.x1; st.y = b0.y1; st.face = st.faceShown = -1;   // з'являється в правому куті, дивиться на сторінку
  st.nextAt = performance.now() + 7000;
  requestAnimationFrame(frame);
  setTimeout(() => say('Добрий день! Я Мартин Гільдієвич. Як шо порушили права — клацайте на мене.'), 1400);

  el.addEventListener('click', (e) => {
    if (e.target.closest('.mt-x')) {
      e.stopPropagation();
      el.remove();
      try { sessionStorage.setItem('mascot-off', '1'); } catch (er) {}
      return;
    }
    window.open(APPEAL, '_blank', 'noopener');
  });
  addEventListener('mousemove', (e) => { st.mouseX = e.clientX; }, { passive: true });
  el.addEventListener('keydown', (e) => { if (e.key === 'Enter') window.open(APPEAL, '_blank', 'noopener'); });
  el.addEventListener('mouseenter', () => { if (!el.classList.contains('talk')) say(PHRASES[Math.floor(Math.random() * PHRASES.length)], 4200); });
  addEventListener('resize', () => {
    const b = area();
    st.x = Math.min(Math.max(st.x, b.x0), b.x1); st.y = Math.min(Math.max(st.y, b.y0), b.y1);
    if (st.mode === 'walk' || st.mode === 'fly') { st.mode = 'idle'; st.nextAt = performance.now() + 800; }
  });
})();
