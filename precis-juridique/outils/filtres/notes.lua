-- notes.lua — filtre Pandoc de la collection « Précis de formation juridique approfondie »
--
-- 1. Transforme chaque note de bas de page Pandoc (Note) en <span class="fn">,
--    placé à l'endroit de l'appel : WeasyPrint la fait « flotter » en bas de page
--    grâce à la propriété CSS `float: footnote`.
-- 2. Ajoute aux tableaux une classe permettant un style homogène.

function Note(el)
  local inlines = pandoc.utils.blocks_to_inlines(el.content, { pandoc.Space() })
  return pandoc.Span(inlines, { class = "fn" })
end

function Table(el)
  el.classes:insert("tableau")
  return el
end
