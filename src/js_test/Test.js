"use-strict";

class Test{
    constructor(){
        this._true_answere = 0;
        this._false_answere = 0;
        this._frage_balken = 10;
        this._frage_nr = 1
    }

    /**
     * 
     * @param {AuswhalKarpitel} daten 
     * holt das ausgewählte Karpitel aus dem Formular
     */
    _hole_vokabel = function(daten){

        let item = JSON.parse(localStorage.getItem("Vokabellist"));

        if(item !== null){
            item.forEach(element =>{
                if (element.karpitel === `${daten.target.elements.karpitelliste.value}`){
                    this._auswahl_close(daten, element.vokabel._liste);
                }
            });
        }

        if(daten.submitter.innerHTML === "Teste Dich" && daten.target.elements.karpitelliste.value === ""){
            alert("Bitte ein Karpitel auswählen oder ein neues Krapitel hinzufügen!");
        }
    }

    /**
     * 
     * @param {Button aus dem Formular} daten 
     * @param {Eine Karpitelliste} vokabel 
     */
    _auswahl_close(daten,vokabel){
        if(daten.submitter.innerHTML === "Teste Dich"){
            if(vokabel.length < 5){
                alert("Bitte fügen Sie diesen Karpitel mindestens 5 Vokabel hinzu!");
            } else {
                document.querySelector(".auswahl").style.display = "none";
                this._play(vokabel);
            }
        }
    }

    //zeigt die deustche Vokabel an, bei der die Englische Vokabel geuscht wird
    _erzeuge_input_de = function(de){
        const wort = 
        `
        <label for="DE" title="DE-Vokabel">DEUTSCH</label>
        <input type="text" id="DE" form="eingabeformular-test-run" name="DE" title="DE-Vokabel" value="${de}" disabled></input>
        `;

        return wort;
    }

    //Erzeugt eine neue Vokabel
    _input_erzeugen = function(vokabel, random_number){

        document.querySelector(".frage-anwort > #eingabeformular-test-run .eingabe-zeile:nth-child(1)").remove();

        let de = vokabel[random_number].de;
        const input_de = this._erzeuge_input_de(de);

        let container = document.createElement("div");
        container.setAttribute("class", "eingabe-zeile");
        container.innerHTML = input_de;

        document.querySelector(".frage-anwort > #eingabeformular-test-run").insertAdjacentElement("afterbegin", container);
    }

    //aktuallisiert Anzahl an Richtigen und Falschen Wörtern
    _aktuallisiere_fehleranzahl = function(){
        const anzeigen = document.querySelectorAll("#test-container > #ergebnis > .ergebnis-innencontainer");
            anzeigen[0].innerHTML =
            `
            <span class="material-symbols-outlined true">done</span>
            <span>${this._true_answere} Wörter </span>
            `;

            anzeigen[1].innerHTML = 
            `
            <span class="material-symbols-outlined false">close</span>
            <span>${this._false_answere} Wörter </span>
            `;
    }

    //Überprüft ob das Eingabe Wort Richtig oder Falsche war
    _überprüfe_wort = function(daten, vokabel){
        const eingabe = daten.target.elements.ENG.value

        for(let i = 0; i < vokabel.length; i++){
            if(vokabel[i].de === daten.target.elements.DE.value){
                if (eingabe !== vokabel[i].eng){
                    this._false_answere += 1;
                    document.querySelector(".frage-anwort > #eingabeformular-test-run .eingabe-zeile:nth-child(2) > input").style.border = "3px solid #9a382b";
                } else {
                    this._true_answere += 1;
                    document.querySelector(".frage-anwort > #eingabeformular-test-run .eingabe-zeile:nth-child(2) > input").style.border = "3px solid #2b9a61";                }
                break;
            }
        }
        
    }

    /**
     * 
     * @param {AnzeigeBalken wie viele Wörter man bearbeitet hat} frage_balken 
     * Zeigt das RANDOM Wort aus dem Karpitel an
     */
    _next_word = function(frage_balken){
        this._frage_nr += 1;
        document.querySelectorAll("#abfolge-frage .start").forEach(element =>{element.innerText = this._frage_nr});
        document.querySelector(".frage-anwort > #eingabeformular-test-run .eingabe-zeile:nth-child(2) > input").style.border = "none";
        document.querySelector(".frage-anwort > #eingabeformular-test-run .eingabe-zeile:nth-child(2) > input").style.borderBottom = "3px solid #1E90FF";
        this._frage_balken += 10;
        frage_balken.style.width = `${this._frage_balken}%`;
    }
    
    /**
     * 
     * @param {EingabeDaten} daten 
     * @param {Karpitelliste} vokabel 
     * @param {AnzeigeBalken wie viele Wörter man bearbeitet hat} frage_balken 
     */
    _überprüfe = function(daten,vokabel, frage_balken){
        const random_number = parseInt(Math.random() * vokabel.length);

        if(this._frage_balken === 100 && daten.submitter.innerHTML === "Überprüfe"){
            let button = document.getElementsByClassName("form-button");
            button[0].hidden = true;
            this._überprüfe_wort(daten, vokabel);
            this._aktuallisiere_fehleranzahl();
        } else if(daten.submitter.innerHTML === "Überprüfe"){
            this._überprüfe_wort(daten, vokabel);
            this._aktuallisiere_fehleranzahl();
            daten.submitter.innerHTML = "Weiter";
        } else if (daten.submitter.innerHTML === "Weiter"){
            this._input_erzeugen(vokabel, random_number);
            this._next_word(frage_balken);
            daten.submitter.innerHTML = "Überprüfe";
            daten.target.reset();
        }
    }

    //Beendet den Test und setzt alles zurück auf Amfang
    _beenden = function(daten, frage_balken){
        if(daten.submitter.innerHTML === "Beenden"){
            
            document.querySelector(".frage-anwort > #eingabeformular-test-run .eingabe-zeile:nth-child(2) > input").style.border = "none";
            document.querySelector(".frage-anwort > #eingabeformular-test-run .eingabe-zeile:nth-child(2) > input").style.borderBottom = "3px solid #1E90FF";

            this._frage_nr = 1;
            this._frage_balken = 10;
            frage_balken.style.width = `1%`;
            document.querySelectorAll("#abfolge-frage .start").forEach(element =>{element.innerText = this._frage_nr});

            this._false_answere = 0;
            this._true_answere = 0;
            this._aktuallisiere_fehleranzahl();

            document.querySelector(".frage-anwort > form").remove();
            document.querySelector(".auswahl").style.display = "block";
        }
    }

    //Erzeugt das Formular zum Testen von Vokabeln
    _form_erzeugen = function(){
        let form = 
        `
        <form id="eingabeformular-test-run" action="#" methode="get">
        
            <div class="eingabe-zeile">
                <label for="DE" title="DE-Vokabel">DEUTSCH</label>
                <input type="text" id="DE" form="eingabeformular-test-run" name="DE" title="DE-Vokabel" value="" disabled></input>
            </div>
        
            <div class="eingabe-zeile">
                <label for="ENG" title="ENG-Vokabel">ENGLISCH</label>
                <input type="text" id="ENG" form="eingabeformular-test-run" name="ENG" title="ENG-Vokabel" placeholder="Eingabe"></input>
            </div>
        
            <div class="eingabe-zeile button-container">
                <button class="form-button" type="submit" form="eingabeformular-test-run">Überprüfe</button>
            </div>
        
            <div class="eingabe-zeile button-container">
                <button class="form-button" type="submit" form="eingabeformular-test-run">Beenden</button>
            </div>
        </form>
        `;

        document.querySelector(".frage-anwort").insertAdjacentHTML("afterbegin", form);
    }

    _play = function(vokabel){
        this._form_erzeugen();
        let frage_balken = document.querySelector("#test-container #abfolge-frage > #abfolge-balken > div");

        this._input_erzeugen(vokabel, parseInt(Math.random() * vokabel.length));
        document.querySelector(".frage-anwort > #eingabeformular-test-run").addEventListener("submit", (daten) =>{
            daten.preventDefault();
            this._überprüfe(daten,vokabel, frage_balken);
            this._beenden(daten, frage_balken);
        });
    }

    _run = function(){
        document.querySelector(".auswahl > #eingabeformular-test").addEventListener("submit", (daten)=>{
            daten.preventDefault();
            this._hole_vokabel(daten);
        });
    }

}