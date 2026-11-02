"""Tests hors ligne : données SYNTHÉTIQUES, uniquement pour valider les calculs."""
import datetime as dt
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import bilan  # noqa: E402
import paris  # noqa: E402
from nbaparis import cotes, donnees, equipes, modele  # noqa: E402

D = dt.date(2026, 11, 2)


def ratings_fictifs():
    r = {s: {"ortg": 114.0, "drtg": 114.0, "net": 0.0, "pace": 99.0, "mj": 7} for s in equipes.EQUIPES}
    r["BOS"] = {"ortg": 120.0, "drtg": 110.0, "net": 10.0, "pace": 97.0, "mj": 7}
    r["ORL"] = {"ortg": 112.0, "drtg": 112.0, "net": 0.0, "pace": 98.0, "mj": 7}
    return r


def journal_fictif():
    l = []
    def g(date, dom, ext, pd_, pe):
        gid = f"{date}{dom}"
        l.append(dict(game_id=gid, date=date, equipe=dom, adv=ext, domicile=True, pts=pd_, pts_adv=pe, victoire=pd_ > pe))
        l.append(dict(game_id=gid, date=date, equipe=ext, adv=dom, domicile=False, pts=pe, pts_adv=pd_, victoire=pe > pd_))
    g(dt.date(2026, 10, 28), "BOS", "ORL", 110, 100)
    g(dt.date(2026, 10, 31), "LAL", "BOS", 105, 112)
    g(dt.date(2026, 11, 1), "MIA", "BOS", 101, 99)
    g(dt.date(2026, 10, 30), "ORL", "NYK", 108, 104)
    return donnees._journal(l, D)


class TestEquipes(unittest.TestCase):
    def test_sigles(self):
        self.assertEqual(equipes.sigle("GS"), "GSW")
        self.assertEqual(equipes.sigle("LA Clippers"), "LAC")
        self.assertEqual(equipes.trouver_equipes("Celtics @ Orlando Magic"), ["BOS", "ORL"])
        self.assertEqual(equipes.trouver_equipes("PHI - 76ers"), ["PHI"])
        self.assertEqual(equipes.saison_nba(D), "2026-27")
        self.assertEqual(donnees.nom_joueur("Jackson Jr., Jaren"), donnees.nom_joueur("Jaren Jackson Jr."))


class TestModele(unittest.TestCase):
    def test_contexte_fatigue(self):
        c = modele.contexte(journal_fictif(), "BOS", D, "ORL")
        self.assertEqual(c.bilan, (2, 1))
        self.assertTrue(c.b2b)
        self.assertEqual(c.matchs_5j, 3)
        self.assertAlmostEqual(c.km_voyage, 329, delta=15)  # dernier match à Miami -> Orlando
        m, raisons = modele.malus_fatigue(c)
        self.assertIn("back-to-back", raisons)

    def test_projection_symetrique(self):
        r = {"ortg": 114, "drtg": 114, "pace": 100, "net": 0}
        p = modele.projeter(r, r, {"ortg": 114, "pace": 100}, 0, 0, 0, 0)
        self.assertAlmostEqual(p.ecart, 2.5)
        self.assertAlmostEqual(p.total, 228)
        self.assertGreater(p.proba_dom, 0.5)

    def test_donnees_manquantes(self):
        p = modele.projeter(None, {"ortg": 1}, None, 0, 0, 0, 0)
        self.assertFalse(p.disponible)

    def test_penalite(self):
        imp = {"x y": {"on": 10, "off": -2, "mj": 7, "min_total": 245}}
        pen, _ = modele.penalite_absences([{"joueur": "X Y", "cle": "x y", "statut": "OUT"}], imp, 7)
        self.assertGreater(pen, 0)
        self.assertLessEqual(pen, 6)
        pen, _ = modele.penalite_absences([{"joueur": "X Y", "cle": "x y", "statut": "OUT"}], None, 7)
        self.assertIsNone(pen)


class TestCotes(unittest.TestCase):
    def test_marge_et_value(self):
        with tempfile.TemporaryDirectory() as t:
            f = Path(t) / "c.csv"
            f.write_text("match;marche;selection;cote\nCeltics @ Magic;vainqueur;Celtics;1,90\n"
                         "Celtics @ Magic;vainqueur;Magic;1,90\nCeltics @ Magic;total;Over 220.5;1.9\n",
                         encoding="utf-8")
            sels, err = cotes.lire(f)
        self.assertEqual(len(sels), 3)
        m = donnees.Match("1", D, "ORL", "BOS")
        proj = modele.Projection(ecart=-6.0, total=215.0, proba_dom=modele.phi(-0.5), pts_dom=104.5, pts_ext=110.5)
        cotes.analyser(sels, [m], {("ORL", "BOS"): proj})
        bos = sels[0]
        self.assertAlmostEqual(bos.p_sans_marge, 0.5)
        self.assertTrue(bos.marge_retiree)
        self.assertTrue(bos.value)          # ~69 % vs 50 %
        self.assertFalse(sels[1].value)
        self.assertFalse(sels[2].marge_retiree)


class TestBilan(unittest.TestCase):
    def test_roi(self):
        with tempfile.TemporaryDirectory() as t:
            f = Path(t) / "h.csv"
            f.write_text("date,match,marche,selection,cote,mise,resultat\n"
                         "2026-11-02,A @ B,vainqueur,A,2.0,100,gagne\n"
                         "2026-11-02,C @ D,total,Over 220,1.9,100,perdu\n"
                         "2026-11-03,E @ F,total,Under 210,1.9,100,en_attente\n", encoding="utf-8")
            stats, attente, err, _ = bilan.calculer(f)
        self.assertEqual(stats["TOTAL"]["profit"], 0.0)
        self.assertEqual(stats["vainqueur"]["g"], 1)
        self.assertEqual(attente, 1)


class TestBoutEnBout(unittest.TestCase):
    """Pipeline complet avec des sources réseau simulées."""

    def test_rapport(self):
        matchs = [donnees.Match("1", D, "ORL", "BOS", dt.datetime(2026, 11, 2, 23, 0, tzinfo=dt.timezone.utc), "Orlando")]
        r = ratings_fictifs()
        with mock.patch.object(donnees, "programme_nba_api", return_value=matchs), \
             mock.patch.object(donnees, "journal_nba_api", return_value=journal_fictif()), \
             mock.patch.object(donnees, "ratings_nba_api", side_effect=lambda d, s, n: r), \
             mock.patch.object(donnees, "impacts_on_off", return_value={}), \
             mock.patch("nbaparis.blessures.rapport_officiel", side_effect=RuntimeError("hors ligne")), \
             mock.patch("nbaparis.blessures.rapport_espn", return_value={"ORL": [
                 {"joueur": "Joueur Fictif", "cle": "joueur fictif", "statut": "QUESTIONABLE", "detail": "", "source": "ESPN"}]}), \
             tempfile.TemporaryDirectory() as t:
            c = Path(t) / "cotes.csv"
            c.write_text("match,marche,selection,cote\nBOS @ ORL,vainqueur,BOS,1.90\nBOS @ ORL,vainqueur,ORL,1.90\n")
            paris.main(["2026-11-02", "--cotes", str(c), "--sortie", t])
            texte = (Path(t) / "paris_2026-11-02.md").read_text()
        self.assertIn("## Récapitulatif", texte)
        self.assertIn("⚠️ Joueur Fictif (Incertain)", texte)
        self.assertIn("VALUE", texte)
        self.assertIn("23:00 GMT (18:00 ET)", texte)
        self.assertIn("Rapport officiel NBA des blessures indisponible", texte)
        print("\n----- RAPPORT DE TEST (données fictives) -----\n" + texte)

    def test_sans_reseau(self):
        boom = mock.Mock(side_effect=ConnectionError("bloqué"))
        with mock.patch.object(donnees, "programme_nba_api", boom), \
             mock.patch.object(donnees, "programme_espn", boom), \
             mock.patch.object(donnees, "programme_bref", boom), \
             mock.patch.object(donnees, "_appel", boom), \
             tempfile.TemporaryDirectory() as t:
            paris.main(["2026-11-02", "--cotes", str(Path(t) / "x.csv"), "--sortie", t])
            texte = (Path(t) / "paris_2026-11-02.md").read_text()
        self.assertIn("Aucun match NBA trouvé", texte)


if __name__ == "__main__":
    unittest.main()
