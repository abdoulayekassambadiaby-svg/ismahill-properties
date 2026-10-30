"use client";

import { useState, type FormEvent } from "react";
import { communes, services, typesDeBien } from "@/data/site";
import { waLink } from "@/lib/utils";
import { IconWhatsApp } from "./Icons";

type Champs = {
  nom: string;
  telephone: string;
  type: string;
  commune: string;
  service: string;
  message: string;
};

const vide: Champs = { nom: "", telephone: "", type: "", commune: "", service: "", message: "" };

/** Formulaire propriétaire : ouvre WhatsApp avec un message pré-rempli (aucun serveur nécessaire). */
export default function OwnerForm() {
  const [f, setF] = useState<Champs>(vide);
  const [erreurs, setErreurs] = useState<Partial<Record<keyof Champs, string>>>({});

  const set = (k: keyof Champs) => (e: { target: { value: string } }) =>
    setF((prev) => ({ ...prev, [k]: e.target.value }));

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const err: typeof erreurs = {};
    if (f.nom.trim().length < 2) err.nom = "Merci d'indiquer votre nom.";
    if (f.telephone.replace(/\D/g, "").length < 8) err.telephone = "Merci d'indiquer un numéro valide.";
    if (!f.type) err.type = "Merci de choisir le type de bien.";
    if (!f.commune.trim()) err.commune = "Merci d'indiquer la commune.";
    if (!f.service) err.service = "Merci de choisir un service.";
    setErreurs(err);
    if (Object.keys(err).length) {
      document.getElementById(`proprio-${Object.keys(err)[0]}`)?.focus();
      return;
    }

    const lignes = [
      "Bonjour ISMAHILL PROPERTIES,",
      "Je souhaite vous confier mon bien.",
      "",
      `• Nom : ${f.nom.trim()}`,
      `• Téléphone : ${f.telephone.trim()}`,
      `• Type de bien : ${f.type}`,
      `• Commune : ${f.commune.trim()}`,
      `• Service souhaité : ${f.service}`,
    ];
    if (f.message.trim()) lignes.push("", `Message : ${f.message.trim()}`);
    const url = waLink(lignes.join("\n"));
    const w = window.open(url, "_blank", "noopener,noreferrer");
    if (!w) window.location.href = url;
  }

  const label = "mb-1.5 block font-titre text-sm font-semibold text-marine";
  const msg = (k: keyof Champs) =>
    erreurs[k] ? (
      <p id={`proprio-${k}-err`} className="mt-1.5 text-sm text-rose">{erreurs[k]}</p>
    ) : null;
  const aria = (k: keyof Champs) => ({
    id: `proprio-${k}`,
    "aria-invalid": !!erreurs[k] || undefined,
    "aria-describedby": erreurs[k] ? `proprio-${k}-err` : undefined,
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor="proprio-nom" className={label}>Nom et prénom *</label>
        <input {...aria("nom")} className="field" autoComplete="name" value={f.nom} onChange={set("nom")} />
        {msg("nom")}
      </div>
      <div>
        <label htmlFor="proprio-telephone" className={label}>Téléphone / WhatsApp *</label>
        <input {...aria("telephone")} className="field" type="tel" inputMode="tel" autoComplete="tel" placeholder="07 00 00 00 00" value={f.telephone} onChange={set("telephone")} />
        {msg("telephone")}
      </div>
      <div>
        <label htmlFor="proprio-type" className={label}>Type de bien *</label>
        <select {...aria("type")} className="field" value={f.type} onChange={set("type")}>
          <option value="" disabled>Choisir…</option>
          {typesDeBien.map((t) => <option key={t}>{t}</option>)}
        </select>
        {msg("type")}
      </div>
      <div>
        <label htmlFor="proprio-commune" className={label}>Commune *</label>
        <input {...aria("commune")} className="field" list="liste-communes" placeholder="Ex. Bingerville" value={f.commune} onChange={set("commune")} />
        <datalist id="liste-communes">
          {communes.map((c) => <option key={c} value={c} />)}
        </datalist>
        {msg("commune")}
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="proprio-service" className={label}>Service souhaité *</label>
        <select {...aria("service")} className="field" value={f.service} onChange={set("service")}>
          <option value="" disabled>Choisir…</option>
          {services.map((s) => <option key={s.id}>{s.titre}</option>)}
        </select>
        {msg("service")}
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="proprio-message" className={label}>Message <span className="font-normal text-encre/50">(facultatif)</span></label>
        <textarea id="proprio-message" className="field min-h-32 resize-y" rows={4} placeholder="Décrivez votre bien : nombre de pièces, loyer ou prix souhaité, disponibilité…" value={f.message} onChange={set("message")} />
      </div>
      <div className="sm:col-span-2">
        <button type="submit" className="btn btn-whatsapp w-full sm:w-auto">
          <IconWhatsApp className="h-5 w-5" /> Envoyer via WhatsApp
        </button>
        <p className="mt-3 text-sm text-encre/55">
          WhatsApp s'ouvre avec votre message pré-rempli : il ne vous reste qu'à appuyer sur « Envoyer ».
        </p>
      </div>
    </form>
  );
}
