"use-strict";

dropdown();
form_open();
selection_auswahl();

//erzeugt ein neues Karptiellisten-Objekt
let karpitel = new Liste();
wiederherstellen(karpitel.liste);
karpitel.karpitel_holen();
