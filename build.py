#!/usr/bin/env python3
"""Збирає сторінки сайту з шаблону (шапка/підвал) і фрагментів у pages/.
Запуск: python3 build.py   — перезаписує *.html у корені сайту."""
from pathlib import Path

ROOT = Path(__file__).parent
P = lambda name: (ROOT / "pages" / f"_{name}.html").read_text(encoding="utf-8")
SITE_URL = "https://guildia.od.ua/"
TG_CHANNEL = "https://t.me/yurist_na_antidepresantah"

NAV = [("index.html", "Головна"), ("pro-nas.html", "Про нас"), ("diialnist.html", "Діяльність"), ("novyny.html", "Новини"), ("zvity.html", "Розслідування"),
       ("holova.html", "Голова"), ("dopomoha.html", "Допомога"), ("kontakty.html", "Контакти")]

JSONLD = """<script type="application/ld+json">
{"@context":"https://schema.org","@type":"NGO","name":"ГО «Південна правозахисна гільдія»",
 "alternateName":"Південна правозахисна гільдія","foundingDate":"2015-10-27","areaServed":"Південь України",
 "email":"guildia.odessa@gmail.com","url":"%s","logo":"%sassets/emblem.svg",
 "address":{"@type":"PostalAddress","streetAddress":"вул. Бугаївська, 21, офіс 701","addressLocality":"Одеса","postalCode":"65007","addressCountry":"UA"},
 "founder":{"@type":"Person","name":"Юрій Григоренко","jobTitle":"Голова організації, адвокат","url":"%sholova.html"},
 "sameAs":["%s"]}
</script>""" % (SITE_URL, SITE_URL, SITE_URL, TG_CHANNEL)

PERSON_LD = """<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Person","name":"Юрій Григоренко","jobTitle":"Адвокат, голова ГО «Південна правозахисна гільдія»",
 "worksFor":{"@type":"NGO","name":"ГО «Південна правозахисна гільдія»"},"memberOf":{"@type":"Organization","name":"Національна асоціація адвокатів України"},
 "award":["Нагрудний знак «Захисник адвокатури України» (2022)","Почесна відзнака НААУ (2019)","Кращий молодий адвокат України (2017)"],
 "url":"%sholova.html"}
</script>""" % SITE_URL


def page_hero(crumb, eyebrow, title, lead):
    return f"""<section class="page-hero"><div class="wrap">
  <div class="crumbs"><a href="index.html">Головна</a> / {crumb}</div>
  <span class="eyebrow">{eyebrow}</span>
  <h1>{title}</h1>
  <p class="lead">{lead}</p>
</div></section>
"""


def render(file, title, desc, body, extra_head=""):
    active = ' class="active" aria-current="page"'
    nav = "\n      ".join(
        f'<a href="{href}"{active if href == file else ""}>{label}</a>' for href, label in NAV)
    full_title = title if file == "index.html" else f"{title} — Південна правозахисна гільдія"
    html = f"""<!doctype html>
<html lang="uk">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{full_title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#132C5C">
<link rel="icon" href="assets/emblem.svg" type="image/svg+xml">
<link rel="canonical" href="{SITE_URL}{'' if file == 'index.html' else file}">
<meta property="og:type" content="website">
<meta property="og:locale" content="uk_UA">
<meta property="og:site_name" content="Південна правозахисна гільдія">
<meta property="og:title" content="{full_title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{SITE_URL}assets/logo-full.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Unbounded:wght@500;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/style.css">
{extra_head}
</head>
<body>
<header>
  <div class="wrap nav">
    <a class="brand" href="index.html">
      <img src="assets/emblem.svg" alt="">
      <span><b>Південна</b><small>правозахисна гільдія</small></span>
    </a>
    <button class="burger" aria-label="Меню" aria-expanded="false">☰</button>
    <nav class="menu">
      {nav}
      <a class="btn btn-gold" href="kontakty.html#join">Долучитися</a>
    </nav>
  </div>
</header>
<main>
{body}</main>
<footer>
  <div class="wrap foot">
    <a class="brand" href="index.html"><img src="assets/emblem.svg" alt="" style="width:30px"><span><b>Південна</b><small>правозахисна гільдія</small></span></a>
    <span>ГО «Південна правозахисна гільдія» · запис у Реєстрі № 1449660 від 29.10.2015 · <a href="{TG_CHANNEL}" target="_blank" rel="noopener">Telegram</a> · © <span id="y">2026</span></span>
  </div>
</footer>
<script src="assets/main.js"></script>
<script src="assets/news.js"></script>
<script src="assets/reports.js"></script>
<script src="assets/investigations.js"></script>
</body>
</html>
"""
    (ROOT / file).write_text(html, encoding="utf-8")
    print("✓", file)


import re as _re
DOCS = _re.sub(r'<div class="contact-list reveal">.*?</div>\n', '', P("contacts"), count=1, flags=_re.S) \
    .replace('Контакти та документи', 'Документи').replace('Відкриті для звернень', 'Статутні документи')
hero = P("hero").replace('href="#help"', 'href="dopomoha.html"')
directions_home = P("directions").replace("</div>\n  </div>\n</section>",
    '</div>\n    <div class="center"><a class="btn btn-gold" href="diialnist.html">Уся діяльність гільдії →</a></div>\n  </div>\n</section>', 1)

render("index.html", "Південна правозахисна гільдія — громадська організація, Одеса",
       "ГО «Південна правозахисна гільдія» — правозахисники Півдня України, які з 2015 року захищають права людини, контролюють відкритість судів і домагаються прозорості влади.",
       hero + P("home-about") + P("home-news") + directions_home + P("home-leader") + P("help") + P("join"), JSONLD)

render("pro-nas.html", "Про нас",
       "Місія, цінності, партнери та статутні документи ГО «Південна правозахисна гільдія».",
       page_hero("Про нас", "Про гільдію", "Об’єднання правозахисників, які не мовчать",
                 "З 2015 року ми працюємо на Півдні України заради правової держави, відкритого правосуддя та захисту людини.")
       + P("mission") + P("founders") + P("partners") + DOCS)

render("diialnist.html", "Діяльність",
       "Напрями діяльності та проєкти гільдії: СУД[о]СКОП, «Відкритий суд», моніторинг пенітенціарних установ, доступ до публічної інформації.",
       page_hero("Діяльність", "Що ми робимо", "Напрями та проєкти",
                 "Громадський контроль судів, правова допомога, моніторинг місць несвободи, прозорість влади й правова освіта.")
       + P("directions") + P("projects"))

render("novyny.html", "Новини",
       "Правові новини Одеси та Півдня України від ГО «Південна правозахисна гільдія»: суди, права людини, рішення влади.",
       page_hero("Новини", "Новини гільдії", "Правові новини Одеси та Півдня",
                 "Головні рішення судів, дії влади й порушення прав людини — з поясненням, що це означає для вас. Оновлюється щогодини.")
       + P("news"))

render("zvity.html", "Розслідування та звіти",
       "Щомісячні звіти ГО «Південна правозахисна гільдія»: запити на публічну інформацію, виявлені порушення, скарги. Нульова толерантність до корупції.",
       page_hero("Звіти", "Громадський контроль", "Нульова толерантність до корупції",
                 "Ми не просто читаємо новини — ми ставимо владі питання, вимагаємо документи й домагаємося відповідальності. Кожного місяця звітуємо публічно.")
       + P("reports"))

render("holova.html", "Юрій Григоренко — голова гільдії",
       "Юрій Григоренко — адвокат, засновник і голова ГО «Південна правозахисна гільдія», заступник голови комітету НААУ, кращий молодий адвокат України 2017 року.",
       page_hero("Голова", "Голова організації", "Юрій Григоренко",
                 "Адвокат, засновник гільдії, представник адвокатури України на міжнародному рівні.")
       + P("leader").replace("<h2>Юрій Григоренко</h2>", "<h2>Досвід і позиція</h2>") + P("timeline"), PERSON_LD)

render("dopomoha.html", "Правова допомога",
       "Як отримати правову допомогу від ГО «Південна правозахисна гільдія»: звернення, Telegram-бот, відповіді на часті питання.",
       page_hero("Допомога", "Правова допомога", "Ми поруч, коли система не чує",
                 "Опишіть ситуацію — юристи гільдії підкажуть, що робити далі. Суспільно важливі справи беремо на системний супровід.")
       + P("help").replace('style="padding-top:0"', '') + P("faq"))

render("kontakty.html", "Контакти",
       "Контакти ГО «Південна правозахисна гільдія»: Одеса, вул. Бугаївська, 21, офіс 701; guildia.odessa@gmail.com.",
       page_hero("Контакти", "Контакти", "Відкриті для звернень і співпраці",
                 "Пишіть, приходьте, долучайтеся — до моніторингу судів, правової освіти чи партнерських проєктів.")
       + P("contacts").replace('Контакти та документи', 'Як з нами зв’язатися').replace('Відкриті для звернень', 'Контакти') + P("join"))
