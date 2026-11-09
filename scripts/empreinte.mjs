#!/usr/bin/env node
/* Calcule l'empreinte numérique (SHA-256) d'un ou plusieurs documents.
   Usage : npm run empreinte -- "chemin/vers/ACD complet.pdf" [autre-fichier …]
   Copiez ensuite l'empreinte dans data/biens.ts, champ `empreinte` du document.
   IMPORTANT : utilisez EXACTEMENT le fichier que vous enverrez au client
   (même un nouvel enregistrement ou une compression change l'empreinte). */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";

const fichiers = process.argv.slice(2);
if (!fichiers.length) {
  console.log('Usage : npm run empreinte -- "chemin/vers/document.pdf"');
  process.exit(1);
}
let erreur = false;
for (const f of fichiers) {
  try {
    const e = createHash("sha256").update(readFileSync(f)).digest("hex");
    console.log(`\n${path.basename(f)}\n  empreinte: "${e}",`);
  } catch {
    console.error(`\n${f} : fichier introuvable.`);
    erreur = true;
  }
}
process.exit(erreur ? 1 : 0);
