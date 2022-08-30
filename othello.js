/* jshint esversion: 6 */

function othello() {
    "use strict";
    const leeg = 0;
    const zwart = 1;
    const wit = 2;
    const aantalRijen = 8;
    const aantalKolommen = 8;
    const grootte = 60;
    //const lijnKleur = "silver";
    const eersteKleur = "green";
    const tweedeKleur = "darkgoldenrod";

    let aantalStenen = 1;
    let aantalWitte = 0;
    let aantalZwarte = 0;
    let aantalWitteZetten = 0;
    var richting = [];
    var juisteRichting = []; 
    let teVervangenStenen = [];
    let aantalJuisteRichtingen = 0;
    var legePosities = [];
    var juisteZetten = [];
    let aantalGetelde = 0;
    var lijstJuistePositiesMetAantalTeVeranderen = [];
    let computerAanZet = false;
    let eendimensPositie = 0;
    let aantal = 0;
    let aantalTeVervangenStenen = 0;
    let positie = 0;

    function CreateArrayRichting(myLength) {
        richting = new Array(myLength);
        var cols, rows;
        for (rows = 0; rows < myLength; rows++) {
            richting[rows] = new Array(2);
        }
    }

    CreateArrayRichting(8); // elke rij in deze arry geeft een richting 0 in rij en 1 in kolom.
    richting[0][0] = -1; // noord
    richting[0][1] = 0;
    richting[1][0] = -1; // noordoost
    richting[1][1] = 1;
    richting[2][0] = 0; // oost
    richting[2][1] = 1;
    richting[3][0] = 1; // zuidoost
    richting[3][1] = 1;
    richting[4][0] = 1; // zuid
    richting[4][1] = 0;
    richting[5][0] = 1; // zuidwest
    richting[5][1] = -1;
    richting[6][0] = 0; // west
    richting[6][1] = -1;
    richting[7][0] = -1; // noordwest
    richting[7][1] = -1;

    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    let stenen = getStenen();
    canvas.addEventListener("click", geefCoordinates, false);

    initialiseer();
    tekenBord();
    updateStand();
    
    function tekenBord() {
        for (let rij = 0; rij < aantalRijen; rij++) {
            for (let kol = 0; kol < aantalKolommen; kol++) {
                tekenVak(rij, kol);
                tekenSteen(rij,kol);
            }
        }
    } 

    function tekenVak(rij, kol) {
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.fillStyle = isEven(rij+kol) ? eersteKleur : tweedeKleur;
        ctx.rect(kol * grootte, rij * grootte, grootte, grootte);
        ctx.stroke();
        ctx.fill();
    }

    function tekenSteen(rij,kol){
        let steen = stenen[rij][kol];
        if (steen === leeg) return;
        let offset = grootte/2;
        ctx.beginPath();
        ctx.fillStyle = steen === zwart ? "black" : "white";
        ctx.arc(kol* grootte+ offset, rij* grootte+ offset, 20, 0, Math.PI * 2);
        ctx.fill();
    }


    function updateStand(){
        // telt aantal stenen en het aantal witte en zwarte en geeft deze weer.
        aantalWitte = 0;
        aantalZwarte = 0;
        aantalGetelde = 0;
        legePosities.length = 0;
        let teller = 0;
        for (let rij = 0; rij < aantalRijen; rij++) {
            for (let kol = 0; kol < aantalKolommen; kol++) {
                if (stenen[rij][kol] == wit){
                    aantalWitte++;
                    aantalGetelde++;
                }else{
                    if (stenen[rij][kol] == zwart){
                        aantalZwarte++;
                        aantalGetelde++;
                    }else{ //zet een lege positie in array 'legePosities'
                        legePosities.push(aantalGetelde);
                        aantalGetelde++;
                        teller++;
                    }
                }
            }
        }
        document.getElementById("aantalWit").innerText = "wit: " + aantalWitte;
        document.getElementById("aantalZwart").innerText = "zwart: " + aantalZwarte;
        // if ((aantalWitte + aantalZwarte) == 64){
        
    }

    function isEven(number){
        return number % 2 === 0;
    }
    
    function getStenen() {
        let result = [];
        for (let rij = 0; rij < aantalRijen; rij++) {
            result.push([]);
            for (let kol = 0; kol < aantalKolommen; kol++) {
                result[rij].push(leeg);
            }
        }
        return result;
    }

    function initialiseer(){
        let rij = aantalRijen/2-1;
        let kol = aantalKolommen/2-1;
        stenen[rij][kol] = wit;
        stenen[rij][kol + 1] = zwart;
        stenen[rij + 1][kol] = zwart;
        stenen[rij + 1][kol + 1] = wit;
    }
    
    function geefCoordinates(event){
        if (computerAanZet){return;} // enkel luisteren naar een click als computer niet aan zet is.
        let x = event.pageX-canvas.offsetLeft;
        let y = event.pageY-canvas.offsetTop;
        let rij = Math.floor(y / grootte);
        let kol = Math.floor(x / grootte);
        let kleur= isEven(aantalStenen) ? wit : zwart;
        if (isGeldigeZet(rij,kol)){
            doeZet(rij,kol,kleur);
            computerAanZet = true;
            setTimeout(function(){computerDoetZet()}, 850);
        }
    }

    function computerDoetZet(){
        //alert("pauze");
        aantalWitteZetten++;
        let kleur= isEven(aantalStenen) ? wit : zwart;  
        juisteZetten.length = 0; 
        for (let i = 0;i < legePosities.length;i++){ //ga alle lege posities na....
            let positie = legePosities[i];
            let rij = Math.floor(positie / 8);
            let kol = (positie % 8); // .... en zet alle JUISTE ZETTEN in array 'juisteZetten'
            if (raaktAanSteen(rij,kol)){
                if (juisteRichting.length >= 0){
                    juisteZetten.push(positie);
                }
            }
        }
        let hoogste = 0;
        aantal = 0;
        for (let teller = 0; teller < juisteZetten.length; teller++){
            //let hoeveelste = Math.floor(Math.random() * (juisteZetten.length - 1));
            let positie = juisteZetten[teller];
            let rij = Math.floor(positie / 8);
            let kol = (positie % 8);
            raaktAanSteen(rij,kol); // ga VOOR ELKE JUISTE ZET na hoeveel er zouden vervangen worden....
            controleerStenen(rij,kol,kleur); // en hou dat aantal bij in de array 'lijstJuistePositiesMetAantalTeVeranderen' in functie controleerStenen
            aantal++; 
        }
        let besteRangschikking = 0;
        let hoogsteAantal = 0;
        for (let teller=0; teller < juisteZetten.length; teller++){// bepaal de positie waarbij de meeste stenen worden omgedraaid
            if (lijstJuistePositiesMetAantalTeVeranderen[teller][1] > hoogsteAantal){
                hoogsteAantal= lijstJuistePositiesMetAantalTeVeranderen[teller][1];
                besteRangschikking = teller;
            }
        }// neem de BESTE positie en vervang de nodige stenen!!!! Hier zit de 'intelligentie' van mijn robot:-)
        positie = lijstJuistePositiesMetAantalTeVeranderen[besteRangschikking][0];
        let rij = Math.floor(positie / 8);
        let kol = (positie % 8);
        computerAanZet = false;
        raaktAanSteen(rij,kol); // op deze 'beste' positie kijken we dan weer de stenen die moeten vervangen worden
        console.log("computer doet zet");
        doeZet(rij,kol,kleur);

        if (aantalWitteZetten == 30){
            setTimeout(WeHaveAWinner(),8000);
        
        }
    }

    function WeHaveAWinner(){
        if (aantalWitte > aantalZwarte){
            // alert("WIT WINT!")
            setTimeout(function(){ alert("Wit Wint"); }, 1000);
        }else{
            if (aantalZwarte > aantalWitte){
                setTimeout(function(){ alert("Zwart Wint"); }, 1000);
            }else{
                setTimeout(function(){ alert("Gelijkspel"); }, 1000);
            }
        }
        initialiseer();
        tekenBord();
        updateStand();
    }

    function doeZet(rij,kol,kleur){
        stenen[rij][kol] = kleur;
        tekenSteen(rij,kol);
        aantalStenen++;
        controleerStenen(rij,kol,kleur);
        updateStand();
        console.log(aantalWitte + aantalZwarte);
    }

    function isGeldigeZet(rij, kol){
        if (isInBord(rij,kol) && isLeeg(rij,kol) && raaktAanSteen(rij,kol)){
            return true;
        }
    }

    function isInBord(rij,kol) {
        if (rij <aantalRijen && kol<aantalKolommen){
            return true;
        }
    }

    function isLeeg(rij,kol){
        if (stenen[rij][kol] == 0 ){
            return true;
        }
    }

    function raaktAanSteen(rij,kol){
        let aantal = 0;
        // deze functie checkt of er een aanpalende steen is EN in welke richtingen
        // juisteRichting zal een array geven met de nummers 0-7 van de richtingen waarin een 
        // aanpalende steen is gevonden. bv. 0,2,3 indien er een steen is in noord, oost, en zuidoost.
        juisteRichting.length = 0;
        aantalJuisteRichtingen = 0;
        for (let i = 0; i < 8; i++){
            let plusRij = richting[i][0];
            let plusKolom = richting[i][1];
            if (rij+plusRij >= 0 && kol+plusKolom >= 0 && rij+plusRij < 8 && kol+plusKolom < 8){
                if (stenen[rij+plusRij][kol+plusKolom] != 0){
                    juisteRichting.push(i);
                    aantalJuisteRichtingen+=1;
                }
            }
        } 
        if (juisteRichting.length > 0) return true;      
    }

    function controleerStenen(rij,kol,kleur){
        let rijCache = rij;
        let kolCache = kol;
        let notKleur = 0 ;
        kleur == 1 ? notKleur = 2: notKleur = 1;
        for (let i = 0; i < aantalJuisteRichtingen; i++){ //overloop elke juiste richting
            if (teVervangenStenen.length!=0)
            teVervangenStenen = [];
            rij = rijCache;
            kol = kolCache;
            let plusRij = richting[juisteRichting[i]][0];
            let plusKolom = richting[juisteRichting[i]][1];
            let j = 0;
            let randBereikt = false;
            // in de while do overloop de stenen in de juiste richtingen....
            while (randBereikt == false && stenen[rij+plusRij][kol+plusKolom] == notKleur && stenen[rij+plusRij][kol+plusKolom] != 0){
                //vul de array op met posities van ev. te vervangen stenen.
                teVervangenStenen.push(0); // breid de array uit.
                teVervangenStenen[j] = new Array(2); 
                teVervangenStenen[j][0] = rij+plusRij;
                teVervangenStenen[j][1] = kol+plusKolom;
                rij+= plusRij;
                kol+= plusKolom;
                j++;  
                if (rij + plusRij > 7 || rij + plusRij < 0){
                    randBereikt = true;
                }
            } // ....als de laatste steen terug van de juiste kleur is (en niet 0), gaan we vervangen.
            if (randBereikt == false && stenen[rij+plusRij][kol+plusKolom] == kleur && stenen[rij+plusRij][kol+plusKolom] !=0 && teVervangenStenen.length >0){
                if (computerAanZet) {
                    aantalTeVervangenStenen += teVervangenStenen.length;
                }else{
                    vervangStenen(kleur);
                }
            }    
        }
        if (computerAanZet){
            eendimensPositie = rijCache * 8 + kolCache; // de positie in één getal om geen 3 dimensionele array te moeten creeren:-)
            lijstJuistePositiesMetAantalTeVeranderen[aantal] = new Array(2);
            lijstJuistePositiesMetAantalTeVeranderen[aantal][0] = eendimensPositie;
            lijstJuistePositiesMetAantalTeVeranderen[aantal][1] = aantalTeVervangenStenen;
            // Geeft de array met op positie [x][0] de positie van een goede zet
            // en op positie [x]1] het aantal stenen dat zou vervangen worden.
            aantalTeVervangenStenen = 0;
        }
    }

    function vervangStenen(kleur){
        for (let i = 0;i < teVervangenStenen.length;i++){
            let rijTV = teVervangenStenen[i][0];
            let kolomTV = teVervangenStenen[i][1];
            stenen[rijTV][kolomTV] = kleur; // vervang in de array 'stenen' de veranderde kleuren op de juiste posities,
            setTimeout(function(){tekenSteen(rijTV, kolomTV)}, 550); // en teken deze, dus één voor één.
        }
    }
}