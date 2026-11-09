import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { biens, type Bien, type DocumentFoncier } from "@/data/biens";

/** Une ligne du registre public des empreintes (lu par l'outil de vérification). */
export type EntreeRegistre = {
  empreinte: string;
  reference: string;
  slug: string;
  bien: string;
  document: string;
  version: "apercu" | "complet";
  exemple: boolean;
};

const HEX64 = /^[0-9a-f]{64}$/;

/** Empreinte SHA-256 d'un fichier de public/, calculée au moment de la construction du site. */
export function empreinteFichierPublic(src: string): string {
  const fichier = path.join(process.cwd(), "public", decodeURIComponent(src.replace(/^\//, "")));
  try {
    return createHash("sha256").update(readFileSync(fichier)).digest("hex");
  } catch {
    throw new Error(
      `Dossier foncier : le fichier « ${src} » est introuvable. Déposez-le dans public${src} ou corrigez le chemin dans data/biens.ts.`,
    );
  }
}

function verifierEmpreinte(doc: DocumentFoncier, b: Bien) {
  const e = doc.empreinte?.trim().toLowerCase();
  if (!e) return undefined;
  if (!HEX64.test(e)) {
    throw new Error(
      `Dossier foncier « ${b.slug} », document « ${doc.nom} » : l'empreinte doit faire 64 caractères (0-9, a-f). Utilisez « npm run empreinte -- fichier.pdf ».`,
    );
  }
  return e;
}

export function biensAvecDossier() {
  return biens.filter((b): b is Bien & { dossier: NonNullable<Bien["dossier"]> } => !!b.dossier);
}

/** Registre complet : empreintes des extraits publiés + empreintes des copies complètes envoyées aux clients. */
export function registre(): EntreeRegistre[] {
  const refs = new Set<string>();
  const lignes: EntreeRegistre[] = [];
  for (const b of biensAvecDossier()) {
    const ref = b.dossier.reference.trim();
    if (refs.has(ref.toUpperCase())) throw new Error(`Dossier foncier : la référence « ${ref} » est utilisée deux fois.`);
    refs.add(ref.toUpperCase());
    for (const d of b.dossier.documents) {
      const base = { reference: ref, slug: b.slug, bien: b.titre, document: d.nom, exemple: !!b.exemple };
      if (d.apercu) lignes.push({ ...base, empreinte: empreinteFichierPublic(d.apercu), version: "apercu" });
      const e = verifierEmpreinte(d, b);
      if (e) lignes.push({ ...base, empreinte: e, version: "complet" });
    }
  }
  return lignes;
}
