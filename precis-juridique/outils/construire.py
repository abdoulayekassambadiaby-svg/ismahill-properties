#!/usr/bin/env python3
"""Chaîne de fabrication de la collection « Précis de formation juridique approfondie ».

Usage :
    python3 outils/construire.py sources/tome-01          # construit un volume
    python3 outils/construire.py --tous                    # construit tous les volumes

Chaque volume est décrit par un fichier `volume.json` placé dans son dossier de sources.
Les chapitres sont rédigés en Markdown (syntaxe Pandoc) ; Pandoc produit le HTML,
puis WeasyPrint compose le PDF (couverture, sommaire paginé, notes de bas de page,
titres courants, signets).
"""
from __future__ import annotations

import html
import json
import re
import subprocess
import sys
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent
OUTILS = RACINE / "outils"
FILTRE = OUTILS / "filtres" / "notes.lua"
STYLE = OUTILS / "style.css"
SORTIE = RACINE / "pdf"

# --------------------------------------------------------------------------
# Conversion Markdown -> HTML
# --------------------------------------------------------------------------

def pandoc(markdown: str) -> str:
    """Convertit un texte Markdown (Pandoc) en fragment HTML5."""
    res = subprocess.run(
        [
            "pandoc",
            "-f", "markdown+smart+fenced_divs+bracketed_spans+pipe_tables+inline_notes+raw_html+implicit_figures",
            "-t", "html5",
            "--wrap=none",
            "--columns=200",
            "--lua-filter", str(FILTRE),
        ],
        input=markdown, capture_output=True, text=True, check=False,
    )
    if res.returncode != 0:
        sys.exit(f"Erreur Pandoc :\n{res.stderr}")
    if res.stderr.strip():
        print(res.stderr, file=sys.stderr)
    return res.stdout


# --------------------------------------------------------------------------
# Typographie française (espaces insécables), appliquée aux seuls nœuds texte
# --------------------------------------------------------------------------
NNBSP = " "  # espace fine insécable
NBSP = " "   # espace insécable

def _typo_texte(t: str) -> str:
    t = re.sub(r"[  ]+([;!?])", NNBSP + r"\1", t)
    t = re.sub(r"[  ]+:", NBSP + ":", t)
    t = re.sub(r"«[  ]*", "«" + NNBSP, t)
    t = re.sub(r"[  ]*»", NNBSP + "»", t)
    t = re.sub(r"\b(n°|nos?|art\.|al\.|p\.|pp\.|t\.|vol\.|fasc\.|ch\.|chap\.|§|ss\.|spéc\.|coll\.|éd\.)[ ]+(?=[\w\d])", lambda m: m.group(1) + NBSP, t)
    t = re.sub(r"(\d)[ ](%|F CFA|FCFA|francs|ans|jours|mois|heures)", r"\1" + NBSP + r"\2", t)
    t = re.sub(r"\b(M\.|Mme|Mlle|Me|MM\.)[ ]+", lambda m: m.group(1) + NBSP, t)
    return t


def typographie(fragment: str) -> str:
    morceaux = re.split(r"(<[^>]+>)", fragment)
    sortie = []
    ignore = 0
    for m in morceaux:
        if m.startswith("<"):
            nom = re.match(r"</?\s*([a-zA-Z0-9]+)", m)
            if nom and nom.group(1).lower() in ("svg", "style", "script", "code", "pre"):
                ignore += -1 if m.startswith("</") else (0 if m.endswith("/>") else 1)
            sortie.append(m)
        else:
            sortie.append(m if ignore > 0 else _typo_texte(m))
    return "".join(sortie)


# --------------------------------------------------------------------------
# Sommaire / table des matières
# --------------------------------------------------------------------------
TITRE_RE = re.compile(r"<h([1-4])([^>]*)>(.*?)</h\1>", re.S)
ATTR_RE = re.compile(r'([\w-]+)="([^"]*)"')


def _texte(fragment: str) -> str:
    fragment = re.sub(r'<span class="fn">.*?</span>', "", fragment, flags=re.S)
    return html.unescape(re.sub(r"<[^>]+>", "", fragment)).strip()


def titres(corps: str):
    for m in TITRE_RE.finditer(corps):
        niveau = int(m.group(1))
        attrs = dict(ATTR_RE.findall(m.group(2)))
        classes = attrs.get("class", "").split()
        if "nontoc" in classes or "id" not in attrs:
            continue
        yield niveau, attrs, classes, _texte(m.group(3))


def table(corps: str, profondeur: int) -> str:
    lignes = []
    for niveau, attrs, classes, texte in titres(corps):
        if niveau > profondeur:
            continue
        ident = attrs["id"]
        num = attrs.get("data-num", "")
        if niveau == 1 and "partie" in classes:
            lignes.append(f'<div class="toc-entree toc-partie"><a href="#{ident}">{html.escape(num)} — {html.escape(texte)}</a></div>')
        elif niveau == 1 and "chapitre" in classes:
            lignes.append(f'<div class="toc-entree toc-chapitre"><a href="#{ident}"><span class="toc-num">{html.escape(num)}</span>{html.escape(texte)}</a></div>')
        elif niveau == 1:
            lignes.append(f'<div class="toc-entree toc-simple"><a href="#{ident}">{html.escape(texte)}</a></div>')
        elif niveau == 2:
            lignes.append(f'<div class="toc-entree toc-h2"><a href="#{ident}">{html.escape(texte)}</a></div>')
        elif niveau == 3:
            lignes.append(f'<div class="toc-entree toc-h3"><a href="#{ident}">{html.escape(texte)}</a></div>')
    return "\n".join(lignes)


# --------------------------------------------------------------------------
# Couverture (SVG décoratif) et pages liminaires
# --------------------------------------------------------------------------

def couverture(meta: dict) -> str:
    c = meta["couleurs"]
    fond, fond2, orc = c["fond"], c.get("fond2", c["fond"]), c.get("or", "#d9bd6a")
    # Balance de la justice stylisée + filets ; bandeau orange-blanc-vert discret.
    svg = f"""
<svg class="cv-fond" viewBox="0 0 170 240" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
  <defs>
    <linearGradient id="gfond" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="{fond}"/>
      <stop offset="1" stop-color="{fond2}"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="170" height="240" fill="url(#gfond)"/>
  <rect x="0" y="0" width="170" height="2.2" fill="#f77f00"/>
  <rect x="0" y="2.2" width="170" height="0.9" fill="#ffffff"/>
  <rect x="0" y="3.1" width="170" height="2.2" fill="#009e60"/>
  <rect x="10" y="12" width="150" height="216" fill="none" stroke="{orc}" stroke-width="0.35" opacity="0.55"/>
  <rect x="11.6" y="13.6" width="146.8" height="212.8" fill="none" stroke="{orc}" stroke-width="0.15" opacity="0.45"/>
  <line x1="16" y1="84" x2="60" y2="84" stroke="{orc}" stroke-width="0.5"/>
  <g transform="translate(128,182)" stroke="{orc}" fill="none" stroke-width="0.55" opacity="0.9">
    <circle cx="0" cy="-27" r="1.6"/>
    <line x1="0" y1="-25.4" x2="0" y2="16"/>
    <line x1="-22" y1="-20" x2="22" y2="-20"/>
    <path d="M -22 -20 L -30 0 M -22 -20 L -14 0"/>
    <path d="M 22 -20 L 14 0 M 22 -20 L 30 0"/>
    <path d="M -31 0 Q -22 9 -13 0 Z"/>
    <path d="M 13 0 Q 22 9 31 0 Z"/>
    <path d="M -9 16 L 9 16 L 12 20 L -12 20 Z"/>
  </g>
  <g stroke="{orc}" stroke-width="0.18" opacity="0.28" fill="none">
    {''.join(f'<circle cx="128" cy="160" r="{r}"/>' for r in range(40, 140, 7))}
  </g>
</svg>"""
    tome = html.escape(meta.get("tome", ""))
    sous_titre = html.escape(meta.get("sous_titre", ""))
    return f"""
<section class="couverture" style="--or-cv:{orc}">
  {svg}
  <div class="cv-bloc cv-collection">{html.escape(meta['collection'])}</div>
  <div class="cv-bloc cv-sous">{html.escape(meta['sous_collection'])}</div>
  <div class="cv-bloc cv-tome">{tome}</div>
  <div class="cv-bloc cv-titre">{html.escape(meta['titre'])}
     <div class="cv-soustitre" style="margin-top:6mm">{sous_titre}</div>
  </div>
  <div class="cv-bloc cv-pied">{html.escape(meta['edition'])}</div>
</section>"""


def page_titre(meta: dict) -> str:
    return f"""
<section class="page-titre">
  <div class="pt-collection">{html.escape(meta['collection'])}</div>
  <div class="pt-sous">{html.escape(meta['sous_collection'])}</div>
  <div class="pt-tome">{html.escape(meta.get('tome', ''))}</div>
  <div class="pt-titre">{html.escape(meta['titre'])}</div>
  <div class="pt-soustitre">{html.escape(meta.get('sous_titre', ''))}</div>
  <div class="pt-filet"></div>
  <div class="pt-mention">{meta.get('mention_titre', '')}</div>
  <div class="pt-edition">{html.escape(meta['edition'])}</div>
</section>"""


def quatrieme(meta: dict, contenu_html: str) -> str:
    c = meta["couleurs"]
    fond, orc = c["fond"], c.get("or", "#d9bd6a")
    return f"""
<section class="quatrieme" style="--or-cv:{orc}">
  <svg class="cv-fond" viewBox="0 0 170 240" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="position:absolute;left:0;top:0;width:170mm;height:240mm">
    <rect x="0" y="0" width="170" height="240" fill="{fond}"/>
    <rect x="10" y="12" width="150" height="216" fill="none" stroke="{orc}" stroke-width="0.35" opacity="0.55"/>
    <rect x="0" y="234.7" width="170" height="2.2" fill="#f77f00"/>
    <rect x="0" y="236.9" width="170" height="0.9" fill="#ffffff"/>
    <rect x="0" y="237.8" width="170" height="2.2" fill="#009e60"/>
  </svg>
  <div class="q-texte">{contenu_html}</div>
</section>"""


# --------------------------------------------------------------------------
# Assemblage
# --------------------------------------------------------------------------

def lire(dossier: Path, nom: str) -> str:
    return (dossier / nom).read_text(encoding="utf-8")


def construire(dossier: Path) -> Path:
    from weasyprint import HTML  # import tardif : accélère --aide

    meta = json.loads(lire(dossier, "volume.json"))
    corps_md = "\n\n".join(lire(dossier, f) for f in meta["fichiers"])
    corps = typographie(pandoc(corps_md))

    # Chaque titre de niveau 1 porte le titre courant du volume (pages paires)
    # et un titre court (pages impaires), sauf s'il en définit un lui-même.
    titre_courant = html.escape(meta["titre_courant"], quote=True)

    def _h1(m: re.Match) -> str:
        attrs, contenu = m.group(1), m.group(2)
        if "data-volume" not in attrs:
            attrs += f' data-volume="{titre_courant}"'
        if "data-court" not in attrs:
            num = dict(ATTR_RE.findall(attrs)).get("data-num", "")
            court = (num + " — " if num else "") + _texte(contenu)
            attrs += f' data-court="{html.escape(court, quote=True)}"'
        return f"<h1{attrs}>{contenu}</h1>"

    corps = re.sub(r"<h1([^>]*)>(.*?)</h1>", _h1, corps, flags=re.S)

    liminaires = "".join(typographie(pandoc(lire(dossier, f))) for f in meta.get("liminaires", []))
    verso = typographie(pandoc(lire(dossier, meta["verso"]))) if meta.get("verso") else ""
    q4 = typographie(pandoc(lire(dossier, meta["quatrieme"]))) if meta.get("quatrieme") else ""

    sommaire = table(corps, meta.get("profondeur_sommaire", 2))
    tdm = table(corps, meta.get("profondeur_tdm", 3))
    c = meta["couleurs"]

    doc = f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>{html.escape(meta['collection'])} — {html.escape(meta.get('tome', ''))} — {html.escape(meta['titre'])}</title>
<meta name="author" content="{html.escape(meta.get('auteur_meta', ''))}">
<meta name="description" content="{html.escape(meta.get('sous_titre', ''))}">
<meta name="dcterms.created" content="{meta.get('date_iso', '')}">
<style>:root {{ --accent: {c.get('accent', c['fond'])}; --fond-couverture: {c['fond']}; }}</style>
</head>
<body>
{couverture(meta)}
{page_titre(meta)}
<section class="verso">{verso}</section>
<section class="sommaire"><h1 class="nontoc liminaire-titre">Sommaire</h1>
{sommaire}
</section>
{liminaires}
{corps}
<section class="tdm"><h1 class="nontoc liminaire-titre">Table des matières</h1>
{tdm}
</section>
{quatrieme(meta, q4) if q4 else ''}
</body>
</html>"""

    (dossier / "_build").mkdir(exist_ok=True)
    (dossier / "_build" / "volume.html").write_text(doc, encoding="utf-8")
    SORTIE.mkdir(exist_ok=True)
    cible = SORTIE / meta["fichier_pdf"]
    HTML(string=doc, base_url=str(OUTILS) + "/").write_pdf(
        cible, stylesheets=[str(STYLE)], pdf_variant=None,
        uncompressed_pdf=False, optimize_images=True,
    )
    print(f"PDF produit : {cible.relative_to(RACINE)}")
    return cible


def main(argv: list[str]) -> None:
    if not argv or argv[0] in ("-h", "--aide"):
        print(__doc__)
        return
    if argv[0] == "--tous":
        dossiers = sorted(p.parent for p in (RACINE / "sources").glob("*/volume.json"))
    else:
        dossiers = [Path(a).resolve() for a in argv]
    for d in dossiers:
        construire(d)


if __name__ == "__main__":
    main(sys.argv[1:])
