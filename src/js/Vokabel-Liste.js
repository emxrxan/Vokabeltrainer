"use-strict";

class Liste{
    constructor(){
        this.liste = new Map();
    }
    
    /**
     * 
     * @param {Submit-Button} daten 
     * schließt das Formular
     */
    _form_close = function(daten){
        if(daten.submitter.innerHTML === "Hinzufügen" || daten.submitter.innerHTML === "Abbrechen"){
            document.querySelector(".neues-wort").style.display = "none";
            document.querySelector(".select-container > #auswahl").innerHTML = `<p>Wähle Karpitel:</p><span id="drop-select">&#9660;</span>`;
        }
    }

    /**
     * 
     * @param {EngabeKarpitel} daten 
     * fügt ein nuees Eingabekarpitel in die Liste ein
     */
    _neue_map_erstellen(daten){
        if(!this.liste.has(daten.target.elements.karpitel_input.value)){
            this.liste.set(`${daten.target.elements.karpitel_input.value}`,new Vokabel([]));
            form_select_hinzufügen(daten.target.elements.karpitel_input.value);
            this.liste.get(daten.target.elements.karpitel_input.value)._neue_vokabel(daten);
        }
    }

    /**
     * 
     * @param {EngabeKarpitel} daten 
     * Überprüft ob das Karpitel bereits existiert und fügt es in die liste hinzu
     */
    _neues_karpitel = function(daten){
        if(daten.submitter.innerHTML === "Abbrechen"){
            this._form_close(daten);
        }else if(daten.target.elements.karpitel_input.value === "" && daten.target.elements.karpitelliste.value === ""){
            alert("Bitte ein Karpitel auswählen oder ein neues Krapitel hinzufügen!");
        }else if(daten.target.elements.karpitel_input.value !== "" && daten.target.elements.karpitelliste.value !== ""){
            alert("Bitte ein Karpitel auswählen oder ein neues Krapitel hinzufügen!");
        }else if(this.liste.has(`${daten.target.elements.karpitelliste.value}`)){
            this.liste.get(daten.target.elements.karpitelliste.value)._neue_vokabel(daten);
            speichern(this.liste);
        }else if(daten.submitter.innerHTML === "Hinzufügen"){
            this._neue_map_erstellen(daten);
            speichern(this.liste);
        }
    }

    //Holt die EngabeKarpitel aus dem Formular
    karpitel_holen = function(){
        document.querySelector(".neues-wort > #eingabeformular-eingabe").addEventListener("submit", (daten) =>{
            daten.preventDefault();
            this._neues_karpitel(daten);
            this._form_close(daten);
            daten.target.reset();
            karpitel_anzeigen(this.liste);

        });
    }
}