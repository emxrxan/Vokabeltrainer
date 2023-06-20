"use-strict";

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
    option_input.setAttribute("form", "eingabeformular-test");
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
            opt.addEventListener("click",(klick)=>{
                opt.querySelector("input").checked = true;
                document.querySelector(".select-container > .option").classList.remove("option-anzeigen");
                document.querySelector(".select-container > #auswahl").innerHTML = `${klick.target.innerText}<span id="drop-select">&#9660;</span>`;
            });
        });
    });
}

//holt alle Einträge von localstorage und speichert diese in die Karpitelliste
const wiederherstellen = function(){
    let liste = JSON.parse(localStorage.getItem("Vokabellist"));

    if(liste !== null){
        liste.forEach((element) =>{
            form_select_hinzufügen(`${element.karpitel}`);
        });
    }
}