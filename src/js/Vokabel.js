"use-strict";

class Vokabel{
    constructor(liste){
        this._liste = liste;
    }
    
    /**
     * 
     * @param {EingabeWort} daten 
     * fügt das Wort in das Karpitel hinzu
     */
    _neue_vokabel = function(daten){ 
        this._liste.push({
            de: ((daten.target.elements.DE.value).toLowerCase()).trim(),
            eng: ((daten.target.elements.ENG.value).toLowerCase()).trim(),
        });

        this._vokabel_sort();
    }

    //erstellt alle Vokabrl für das jweilige Karpitel
    _tr_html_generieren(element){
        let tr = document.createElement("tr");
        tr.setAttribute("data-timestramp", `${this._timestamp}`)

        let td_DE = document.createElement("td");
        td_DE.insertAdjacentText("afterbegin",`${element.de}`);
        tr.appendChild(td_DE);

        let td_ENG = document.createElement("td");
        td_ENG.insertAdjacentText("afterbegin",`${element.eng}`);
        tr.appendChild(td_ENG);

        let spans = document.createElement("td");
        tr.appendChild(spans);

        let edit = document.createElement("span");
        edit.setAttribute("class", "material-symbols-outlined");
        edit.insertAdjacentText("afterbegin", "edit");
        spans.appendChild(edit);
        

        let delete_forever = document.createElement("span");
        delete_forever.setAttribute("class", "material-symbols-outlined");
        delete_forever.insertAdjacentText("afterbegin", "delete_forever");
        spans.appendChild(delete_forever);

        return tr
    }

    //erstellt die Tabelle mit allen Vokabeln aus einem Karpitel
    _anzeigen = function(karpitel, map){
        let all_table = document.querySelectorAll("#table");
        let actual_table = all_table.item(all_table.length - 1);
        let einfügen = actual_table.querySelector("tbody > tr:last-child");

        if(actual_table.querySelector("caption > h4").innerHTML == `${karpitel}`){
            this._liste.forEach(element => {
                let tr = this._tr_html_generieren(element);
                einfügen.insertAdjacentElement("beforebegin", tr);
                this._vokabel_action(tr, map);
            });
        }
    }

    //Sortiert die Liste von KLEIN:A nach GROß:Z
    _vokabel_sort = function(){
        this._liste.sort((wort_a, wort_b)=>{
            if(wort_a.de > wort_b.de){
                return 1;
            } else if(wort_a.de < wort_b.de){
                return -1;
            } else {
                return 0;
            }
        })
    }

    /**
     * 
     * @param {Wort aus einem Karpitel} tr_tag 
     * Löscht ein Wort-tr-Tag aus der Tabelle und aus der Karpitelliste
     */
    _delete_tr = function(tr_tag){
        const de = tr_tag.querySelector("td:nth-child(1)").innerHTML;
        const eng = tr_tag.querySelector("td:nth-child(2)").innerHTML;

        for(let i = 0; i < this._liste.length; i++){
            if(this._liste[i].de === de || this._liste[i].eng === eng){
                this._liste.splice(i,1);
            }
        }
    }

    //löscht ein Karpitel aus der Liste, falls ein Karpitel keine Vorkabln hat
    _delete_class = function(map){
        for(let maps of map){
            if(maps[1]._liste.length == 0){
                form_select_entfernen(maps[0]);
                map.delete(maps[0]);
                karpitel_anzeigen(map);
            }
        }
    }

    /**
     * 
     * @param {tr-Reihe aus dem HTML <tabel>-Tag} tr_tag 
     * @param {EingabeKariptelliste} map 
     * löcht eine Vokabel aus der Karpitelliste
     */
    _delete_vokabel = function(tr_tag, map){
        this._delete_tr(tr_tag);
        tr_tag.remove();
        this._delete_class(map);
        speichern(map);
    }

    //ermöglicht die bearbeitung einer Vokabel aud der Tabelle
    _edit_tag = function(tr_tag){
        let de = tr_tag.querySelector("td:nth-child(1)");
        let eng = tr_tag.querySelector("td:nth-child(2)");

        for(let i = 0; i < this._liste.length; i++){
            if(this._liste[i].de === de.innerHTML && this._liste[i].eng === eng.innerHTML){
                de.innerHTML = `<input type="text" value="${this._liste[i].de}">`;
                eng.innerHTML = `<input type="text" value="${this._liste[i].eng}">`;
                this._liste.splice(i,1);
            }
        }
    }

    //speichert die neue Bearbeitung in die Liste
    _speicher_edit = function(tr_tag){
        
        let inhalt_de = tr_tag.querySelector("td:nth-child(1) > input").value;
        let inhalt_eng = tr_tag.querySelector("td:nth-child(2) > input").value;

        this._liste.push({
            de: ((inhalt_de).toLowerCase()).trim(),
            eng: ((inhalt_eng).toLowerCase()).trim(),
        });
        this._vokabel_sort();
    }

    //führt die jewilige Aktion aus für ein Karpitel(Beabieten oder löschen oder speichern)
    _vokabel_action = function(tr_tag, map){
        const tr = tr_tag.querySelectorAll("td:last-child span");
        tr.forEach((element)=>{
            element.addEventListener("click",()=>{
                if(element.innerHTML === "delete_forever"){
                    this._delete_vokabel(tr_tag, map);
                } else if (element.innerHTML === "edit"){
                    tr[0].innerHTML = "done";
                    tr[1].style.display = "none";
                    this._edit_tag(tr_tag);
                } else if (element.innerHTML === "done"){
                    tr[0].innerHTML = "edit";
                    tr[1].style.display = "inline-block";
                    this._speicher_edit(tr_tag);
                    speichern(map);
                    karpitel_anzeigen(map);
                }
            });
        })
    }
    
}