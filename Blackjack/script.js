var dcards = document.getElementById("dcards");
var ycards = document.getElementById("ycards");
var log = document.getElementById("winlose");
var hiddenLog = document.getElementById("dtotallog");
var totalLog = document.getElementById("ytotallog");
var buttons = document.getElementById("menu");
var startbet = document.getElementById("placebet");
var funds = document.getElementById("regret");
var cTotal = 52;
var isLost = false;
var jin, output, jout, dtotal, ytotal, drow, yrow, hitOut, hold, time, x, i, ifWon, alreadyhit, insured;
var count = [4,4,4,4,4,4,4,4,4,4,4,4,4];
var money = 1000;

function draw() {
    x = Math.floor(Math.random()*cTotal);
    for(time = 0; x >= 0; time ++) {
        x -= count[time];
    }
    count[time-1] --;
    cTotal --;
    return time;
}

function toNum(x) {
    if(x == "J" || x == "Q" || x == "K") {
        return 10;
    } else if(x == "A") {
        return 1;
    } else {
        return x;
    }
}

function toFace(x) {
    if(x == 11) {
        return "J";
    } else if(x == 12) {
        return "Q";
    } else if(x == 13) {
        return "K";
    } else if(x == 1) {
        return "A";
    } else {
        return x;
    }
}

function start() {
    bet = parseInt(startbet.value);
    if(bet > money) {
        alert("Insufficient funds")
    } else if(bet < 1) {
        alert("Gambling isn't free")
    } else if(isNaN(bet)) {
        alert("Your bet must be an integer above 0")
    } else {
        money -= bet;
        funds.innerHTML = "Money: "+money;
        alreadyhit = false;
        buttons.innerHTML = "<button onclick='hit();'>Hit</button> <button onclick='stand();'>Stand</button> <button onclick='double();'>Double Down</button> <button onclick='insure();'>Insurance</button> <button onclick='giveup();'>Surrender</button>";
        log.innerHTML = "";
        count = [4,4,4,4,4,4,4,4,4,4,4,4,4];
        output = [];
        cTotal = 52;
        for(i = 0; i <= 3; i ++) {
            x = draw();
            output.push(toFace(x));
        }
        dcards.innerHTML = "<table class='tableCenter font'><tr id='drow'><td>"+output[1]+"</td><td>///</td></tr></table>";
        ycards.innerHTML = "<table class='tableCenter font'><tr id='yrow'><td>"+output[0]+"</td><td>"+output[2]+"</td></tr></table>";

        dtotal = 0;
        ytotal = 0;

        //Calculating total of starting hands
        dtotal += toNum(output[1])+toNum(output[3]);
        ytotal += toNum(output[0])+toNum(output[2]);

        //Calculating potential total if there is an ace
        if(output[1] == "A" || output[3] == "A") {
            potentd = dtotal+10;
        } else {
            potentd = dtotal;
        }
        if(output[0] == "A" || output[2] == "A") {
            potenty = ytotal+10;
        } else {
            potenty = ytotal;
        }

        drow = document.getElementById("drow");
        yrow = document.getElementById("yrow");
        hitOut,hold;

        if(potenty == ytotal) {
            totalLog.innerHTML = "Your total: "+ytotal;
        } else {
            totalLog.innerHTML = "Your total: "+potenty+" or "+ytotal;
        }

        hiddenLog.innerHTML = "Dealer's total: "+toNum(output[1]);

        alreadyhit = false;
        insured = false;
    }
}

function hit() {
    alreadyhit = true;
    ifWon = true;
    if(potenty == 21) {
        alert("You already have 21 points");
        ifWon = false;
    } else if(potenty >= 22) {
        alert("Do you not comprehend that you have lost?");
    } else {
        hold = draw();
        hitOut = toFace(hold);
        hold = toNum(hitOut);
        if(hold == 1) {
            if(potenty+11 <= 21) {
                potenty += 11;
            } else {
                potenty += 1;
            }
            ytotal += 1;
        } else {
            if(potenty != ytotal) {
                if(potenty+hold >= 22) {
                    potenty += hold-10;
                } else {
                    potenty += hold;
                }
            } else {
                potenty += hold;
            }
            ytotal += hold;
        }
        yrow.innerHTML += "<td>"+hitOut+"</td>";
        if(potenty == ytotal) {
            totalLog.innerHTML = "Your total: "+ytotal;
        } else {
            totalLog.innerHTML = "Your total: "+potenty+" or "+ytotal;
        }
        if(ytotal >= 22) {
            ifWon = false;
            bust();
        }
    }
}

function lost() {
    log.innerHTML += "You lost!";
    buttons.innerHTML = "<button onclick='start()'>Restart</button>";
    if(potentd != dtotal) {
        hiddenLog.innerHTML = "Dealer's total: "+potentd+" or "+dtotal;
    } else {
        hiddenLog.innerHTML = "Dealer's total: "+dtotal;
    }
}

function win() {
    log.innerHTML += "You won!";
    buttons.innerHTML = "<button onclick='start()'>Restart</button>";
    if(potentd != dtotal) {
        hiddenLog.innerHTML = "Dealer's total: "+potentd+" or "+dtotal;
    } else {
        hiddenLog.innerHTML = "Dealer's total: "+dtotal;
    }
    money += bet*2;
    funds.innerHTML = "Money: "+money;
}

function push() {
    log.innerHTML += "It's a push!";
    buttons.innerHTML = "<button onclick='start()'>Restart</button>";
    if(potentd != dtotal) {
        hiddenLog.innerHTML = "Dealer's total: "+potentd+" or "+dtotal;
    } else {
        hiddenLog.innerHTML = "Dealer's total: "+dtotal;
    }
    money += bet;
    funds.innerHTML = "Money: "+money;
}

function bust() {
    log.innerHTML = "Bust! ";
    dcards.innerHTML = "<table class='tableCenter font'><tr id='drow'><td>"+output[1]+"</td><td>"+output[3]+"</td></tr></table>";
    lost();
}

function stand() {
    ifWon = true;
    dcards.innerHTML = "<table class='tableCenter font'><tr id='drow'><td>"+output[1]+"</td><td>"+output[3]+"</td></tr></table>";
    drow = document.getElementById("drow");
    while(potentd <= 17) {
        if(potentd != dtotal || potentd <= 16) {
            hold = draw();
            standOut = toFace(hold);
            hold = toNum(standOut);
            if(hold == 1) {
                if(potentd+11 <= 21) {
                    potentd += 11;
                } else {
                    potentd += 1;
                }
                dtotal += 1;
            } else {
                if(potentd != dtotal) {
                    if(potentd+hold >= 22) {
                        potentd += hold-10;
                    } else {
                        potentd += hold;
                    }
                } else {
                    potentd += hold;
                }
                dtotal += hold;
            }
        }
        drow.innerHTML += "<td>"+standOut+"</td>";
    }
    if(potentd <= 21) {
        if(potentd > potenty) {
            lost();
        } else if(potentd == potenty){
            push();
        } else {
            win();
        }
    } else {
        win();
    }
}

function double() {
    if(alreadyhit == true) {
        alert("You have already hit");
    } else if(money < bet) {
        alert("You do not have enough money to double your bet");
    } else {
        money -= bet;
        bet += bet;
        funds.innerHTML = "Money: "+money;
        hit();
        if(ifWon == true) {
            stand();
        }
    }
}

function insure() {
    insured = true;
    if(output[1] != "A") {
        alert("The dealer's first card is not an ace");
    } else {
        if(toNum(output[3]) != 10) {
            alert("Insurance bet lost!");
            money -= Math.round(bet/2);
        } else {
            alert("Insurance bet won!");
            money += bet;
        }
        funds.innerHTML = "Money: "+money;
    }
}

function giveup() {
    if(alreadyhit == true) {
        alert("You have already hit");
    } else {
        money += Math.round(bet/2)
        dcards.innerHTML = "<table class='tableCenter font'><tr id='drow'><td>"+output[1]+"</td><td>"+output[3]+"</td></tr></table>";
        lost();
    }
}

function forLoop() {
    for(var i = 0; i < 5; i++) {
        console.log(i);
    }
}