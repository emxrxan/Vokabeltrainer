"use strict";

//zeigt die Links aus der Navigationsleiste an
const dropdown = function(){
    let drop = document.querySelector("#navigation .material-symbols-outlined");

    drop.addEventListener("click", ()=>{
        document.querySelector("#navigation .dropdown").classList.toggle("nav-anzeigen");
        if(drop.innerHTML === "menu"){
            drop.innerHTML = "close";
        } else{
            drop.innerHTML = "menu";
        }
    });
}

//öffnet das Neue-Wort Formular
const form_open = function(){
    document.querySelector(".button").addEventListener("click", ()=>{
            document.querySelector(".neues-wort").style.display = "block";
    });
}

/**
 * 
 * @param {Ein Eingabe-Karpitel} karpitel 
 * fügt alle gespeicherten Karpitel in das Formular, wo dann ein Karpitel ausgewählt werden kann,
 * um ein Wort in das ausgewählte Karpitel hinzuzufürgen
 */
const form_select_hinzufügen = function(karpitel){
    let option_containor = document.querySelector(".select-container > .option");

    let option_li = document.createElement("li");
    option_li.innerHTML = `${karpitel}`;

    let option_input = document.createElement("input");
    option_input.setAttribute("type", "radio");
    option_input.setAttribute("name", "karpitelliste");
    option_input.setAttribute("form", "eingabeformular-eingabe");
    option_input.setAttribute("hidden", "hidden");
    option_input.setAttribute("value", `${karpitel}`);
    option_li.insertAdjacentElement("beforeend", option_input);
    
    option_containor.insertAdjacentElement("beforeend", option_li);
}

//zeigt alle auswählbaren Karpitel im Formular
const selection_auswahl = function(){
        
    let option;

    document.querySelector(".select-container > #auswahl").addEventListener("click",()=>{
        document.querySelector(".select-container > .option").classList.toggle("option-anzeigen");
        option = document.querySelectorAll(".select-container > .option > li");
        option.forEach((opt) =>{
            opt.querySelector("input").checked = false;
            opt.addEventListener("click",(klick)=>{
                opt.querySelector("input").checked = true;
                document.querySelector(".select-container > .option").classList.remove("option-anzeigen");
                document.querySelector(".select-container > #auswahl").innerHTML = `${klick.target.innerText}<span id="drop-select">&#9660;</span>`;
            });
        });
    });
}

//entfernt ein Karptiel aus dem Formular-Auswahlliste
const form_select_entfernen = function(karpitel){
    document.querySelectorAll(".select-container > .option > li").forEach((element)=>{
        if(element.innerText === karpitel){
            element.remove();
        }
    });
}

/**
 * 
 * @param {EingabeKarptiel} karpitel 
 * erzeugt alle Karpitel als HTML-Tag und fügt es ein
 */
const html_generieren = function(karpitel){

    let html_tabelle = 
    `
    <table id="table">
        <caption>
            <h4>${karpitel}</h4>
        </caption>

        <tbody>

            <tr>
                <th>DEUTSCH</th>
                <th>ENGLISCH</th>
                <th></th>
            </tr>

            <tr>
                <td colspan="3" id="ende-table"></td>
            </tr>

        </tbody>

    </table>
    `;
    
    document.querySelector(".container-mitte > #button-action").insertAdjacentHTML("beforebegin", html_tabelle);
}

/**
 * 
 * @param {EingabeKarptiel-Liste} list 
 * zeigt alle Karptiel an
 */
const karpitel_anzeigen = function(list){

    document.querySelectorAll("#table").forEach(table => table.remove());

    for(let element of list){
        html_generieren(element[0]);
        element[1]._anzeigen(element[0], list);
    }
}

//Speichert alle Einträge im localstorage
const speichern = function(eintrag){
    localStorage.removeItem("Vokabellist");

    let vokabellist = [];
    for(let map of eintrag){
        vokabellist.push({karpitel: `${map[0]}`, vokabel: map[1]});
    }

    localStorage.setItem("Vokabellist", JSON.stringify(vokabellist));
}

//holt alle Einträge von localstorage und speichert diese in die Karpitelliste
const wiederherstellen = function(map){

    let liste = JSON.parse(localStorage.getItem("Vokabellist"));
    if(liste !== null){
        liste.forEach((element) =>{
            map.set(element.karpitel, new Vokabel(element.vokabel._liste));
            form_select_hinzufügen(`${element.karpitel}`);
        });
        karpitel_anzeigen(map);
    }
}