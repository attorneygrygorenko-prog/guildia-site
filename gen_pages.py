#!/usr/bin/env python3
"""Генерує окрему сторінку для кожної новини й розслідування (для пошуку Google) + sitemap.xml і robots.txt.
Запускається ботом перед кожною публікацією сайту: python3 gen_pages.py"""
import re
import json
import html
import hashlib
from datetime import datetime
from pathlib import Path

import build   # перебудовує статичні сторінки й дає render(), page_hero(), SITE_URL

ROOT = Path(__file__).parent
DATA = ROOT / "data"
NEWS_DIR, INV_DIR = "novyny", "rozsliduvannia"
SAFE = re.compile(r"&lt;(/?)(b|i)&gt;")


def load(name):
    try:
        return json.loads((DATA / name).read_text(encoding="utf-8"))
    except Exception:
        return []


def title_of(h):
    m = re.search(r"<b>(.*?)</b>", h or "", re.S)
    t = re.sub(r"<[^>]+>", "", m.group(1) if m else (h or "")).strip()
    return (t or "Новина гільдії")[:140]


def safe_html(h):
    t = SAFE.sub(r"<\1\2>", html.escape(h or ""))
    t = re.sub(r"&lt;a href=&quot;(https?://[^&\"\s]+)&quot;&gt;(.*?)&lt;/a&gt;", r'<a href="\1" target="_blank" rel="noopener">\2</a>', t)
    return "<p>" + t.replace("\n\n", "</p><p>").replace("\n", "<br>") + "</p>"


def slug(item):
    return hashlib.sha1((item.get("date", "") + item.get("html", "") + item.get("title", "")).encode()).hexdigest()[:10]


def ld(kind, title, date, url, desc):
    return ('<script type="application/ld+json">' + json.dumps({
        "@context": "https://schema.org", "@type": kind, "headline": title[:110], "datePublished": date,
        "dateModified": date, "inLanguage": "uk", "description": desc[:200], "mainEntityOfPage": url,
        "publisher": {"@type": "NGO", "name": "ГО «Південна правозахисна гільдія»",
                      "logo": {"@type": "ImageObject", "url": build.SITE_URL + "assets/emblem.png"}},
        "author": {"@type": "Organization", "name": "ГО «Південна правозахисна гільдія»"}}, ensure_ascii=False) + "</script>")


def article(file, crumb, eyebrow, title, date, body, links, kind):
    plain = re.sub(r"<[^>]+>", " ", body)
    desc = re.sub(r"\s+", " ", plain).strip()[:180].replace('"', "'")
    url = build.SITE_URL + file
    day = date[:10]
    page = (build.page_hero(crumb, eyebrow, html.escape(title), f"Опубліковано {day}")
            + f'<section><div class="wrap" style="max-width:820px"><article class="news-card" style="padding:clamp(22px,4vw,40px)">'
              f'<div class="news-body">{body}</div><div class="news-links">{links}</div></article>'
              f'<p style="margin-top:28px"><a class="btn btn-gold" href="https://t.me/yurist_na_antidepresantah_bot?start=zvernennya" '
              f'target="_blank" rel="noopener">📨 Подати звернення до гільдії</a></p></div></section>')
    build.render(file, title, desc, page, ld(kind, title, date, url, desc), og_type="article")


def main():
    urls = [(build.SITE_URL + ("" if f == "index.html" else f), None) for f, _ in build.NAV] + [(build.SITE_URL + "privatnist.html", None)]
    news = load("news.json")
    for n in news:
        n["url"] = f"{NEWS_DIR}/{slug(n)}.html"
        links = (f'<a href="{html.escape(n["source"])}" target="_blank" rel="noopener">Джерело</a>' if n.get("source") else "") + \
                (f' <a href="{html.escape(n["tg"])}" target="_blank" rel="noopener">Обговорити в Telegram →</a>' if n.get("tg") else "")
        article(n["url"], f'<a href="novyny.html">Новини</a>', "Новини гільдії", title_of(n.get("html")), n.get("date", ""),
                safe_html(re.sub(r"^\W{0,6}<b>.*?</b>\s*", "", n.get("html") or "", count=1, flags=re.S)), links, "NewsArticle")
        urls.append((build.SITE_URL + n["url"], n.get("date", "")[:10]))
    (DATA / "news.json").write_text(json.dumps(news, ensure_ascii=False, indent=1), encoding="utf-8")
    for x in load("investigations.json"):
        f = f"{INV_DIR}/{slug(x)}.html"
        srcs = x.get("sources") or []
        body = html.escape(x.get("text", ""))
        body = re.sub(r"\[F(\d+)\]", lambda m: f'<a href="{html.escape(srcs[int(m.group(1)) - 1])}" target="_blank" rel="noopener">[{m.group(1)}]</a>'
                      if 0 < int(m.group(1)) <= len(srcs) else m.group(0), body)
        body = "<p>" + body.replace("\n", "<br>") + "</p><h4>Джерела</h4><ol>" + "".join(
            f'<li><a href="{html.escape(u)}" target="_blank" rel="noopener">{html.escape(u)}</a></li>' for u in srcs) + "</ol>"
        links = f'<a href="{html.escape(x["tg"])}" target="_blank" rel="noopener">Обговорити в Telegram →</a>' if x.get("tg") else ""
        article(f, '<a href="zvity.html">Розслідування</a>', "Розслідування", x.get("title", "Розслідування"), x.get("date", ""), body, links, "Article")
        urls.append((build.SITE_URL + f, x.get("date", "")[:10]))
    sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u, d in urls:
        sm.append(f"<url><loc>{html.escape(u)}</loc>" + (f"<lastmod>{d}</lastmod>" if d else "") + "</url>")
    sm.append("</urlset>")
    (ROOT / "sitemap.xml").write_text("\n".join(sm), encoding="utf-8")
    (ROOT / "robots.txt").write_text(f"User-agent: *\nAllow: /\nSitemap: {build.SITE_URL}sitemap.xml\n", encoding="utf-8")
    print(f"✓ сторінок новин: {len(news)}, розслідувань: {len(load('investigations.json'))}, у sitemap: {len(urls)}")


if __name__ == "__main__":
    main()
