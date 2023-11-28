// debug
let logCycleMs = false;
let logSelectedElement = false;
let logpressure = false;



// init
let grid = document.getElementById("grid");
const maxX = 15;
const cells = maxX**2;
const KA = 1;
const D = 1;
let cycleMs = 5;
let omni = true;
let lastCycle = 0;
let cloneIt = 1;
let speed = 1.0;
let viewW = window.innerWidth;
let viewH = window.innerHeight;
grid.style.height = `${Math.min(viewH, viewW)}px`;
grid.style.width = `${Math.min(viewH, viewW)}px`;
grid.style.fontSize = `${Math.min(viewH, viewW)/50}px`;



// grid size fix
window.addEventListener("resize", () => {
    viewW = window.innerWidth;
    viewH = window.innerHeight;
    grid.style.height = `${Math.min(viewH, viewW - 210)}px`;
    grid.style.width = `${Math.min(viewH, viewW - 210)}px`;
    grid.style.fontSize = `${Math.min(viewH, viewW - 210)/50}px`;
});



// for loop to generate cells
for (let i = 1; i < (cells + 1); i++) {
    newCell = document.createElement("div");
    newCell.id = cloneIt;
    cloneIt++;
    newCell.classList.add('grid');
    grid.appendChild(newCell);
    newCell.setAttribute("onmouseover", "setElement(id)");
    newCell.setAttribute("onmouseout", "resetElement()");
    newCell.setAttribute("onmousedown", "clickSet(id)");
    newCell.setAttribute("pressure", 50);
    newCell.setAttribute("heatCap", 5);
    
};



// heat transfer cycle\
function cycle() {
    time = new Date()
    
    if (sim) {
        for (let i = 1; i < (cells + 1); i++) {
                calcTransfer(i);
        };

        for (let i = 1; i < (cells + 1); i++) {
            if (!document.getElementById(i).hasAttribute("source")) {
                setTransfer(i);
            };
        };
    };

    for (let i = 1; i < (cells + 1); i++) {
        setColor(i);
    };

    if (logCycleMs) {
        console.log(`cycle complete, ${time.getTime() - lastCycle}ms`);
    };
    lastCycle = time.getTime();
};



// calculation of pressureerature change
function calcTransfer(i) {
    i = parseInt(i)
    let pressureSum = 0;
    element = document.getElementById(i);
    pressure = element.getAttribute("pressure");

    if (i > maxX) {
        pressureSum = pressureSum + ((document.getElementById(`${i - maxX}`).getAttribute("pressure") - pressure) * KA / D / (1000/cycleMs) * speed) / (document.getElementById(i).getAttribute("heatCap") / 5);
    };

    if (i <= (cells - maxX)) {
        pressureSum = pressureSum + ((document.getElementById(`${i + maxX}`).getAttribute("pressure") - pressure) * KA / D / (1000/cycleMs) * speed) / (document.getElementById(i).getAttribute("heatCap") / 5);
    };

    if ((i % maxX) != 1) {
        pressureSum = pressureSum + ((document.getElementById(`${i - 1}`).getAttribute("pressure") - pressure) * KA / D / (1000/cycleMs) * speed) / (document.getElementById(i).getAttribute("heatCap") / 5);
    };

    if ((i % maxX) != 0) {
        pressureSum = pressureSum + ((document.getElementById(`${i + 1}`).getAttribute("pressure") - pressure) * KA / D / (1000/cycleMs) * speed) / (document.getElementById(i).getAttribute("heatCap") / 5);
    };

    if (omni) {
        if (i > maxX & (i % maxX) != 1) {
            pressureSum = pressureSum + ((document.getElementById(`${i - maxX - 1}`).getAttribute("pressure") - pressure) * KA / D / (1000/cycleMs) * speed / 1.41421356237) / (document.getElementById(i).getAttribute("heatCap") / 5);
        };
    
        if (i <= (cells - maxX) & (i % maxX) != 1) {
            pressureSum = pressureSum + ((document.getElementById(`${i + maxX - 1}`).getAttribute("pressure") - pressure) * KA / D / (1000/cycleMs) * speed / 1.41421356237) / (document.getElementById(i).getAttribute("heatCap") / 5);
        };
        
        if (i > maxX & (i % maxX) != 0) {
            pressureSum = pressureSum + ((document.getElementById(`${i - maxX + 1}`).getAttribute("pressure") - pressure) * KA / D / (1000/cycleMs) * speed / 1.41421356237) / (document.getElementById(i).getAttribute("heatCap") / 5);
        };
    
        if (i <= (cells - maxX) & (i % maxX) != 0) {
            pressureSum = pressureSum + ((document.getElementById(`${i + maxX + 1}`).getAttribute("pressure") - pressure) * KA / D / (1000/cycleMs) * speed / 1.41421356237) / (document.getElementById(i).getAttribute("heatCap") / 5);
        };
        
    };

    element.setAttribute("calcpressure", pressureSum)
};



// set all cells pressureerature based on calculations
function setTransfer(i) {
    element = document.getElementById(i);
    element.setAttribute("pressure", parseFloat(element.getAttribute("pressure")) + parseFloat(element.getAttribute("calcpressure")))
};



// set decorative colors of all cells and 
function setColor(i) {
    element = document.getElementById(i);

    pressure = element.getAttribute("pressure");
    let r = Math.round((pressure * 1.546354488838) ** 1.1);
    let b = Math.round(((100 - pressure) * 1.546354488838) ** 1.1);
    let g = Math.max(48, Math.max(r, b) / 3)

    element.style.borderColor = `rgb(${r}, ${g}, ${b})`;
    document.getElementById(i).style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
};



function setOmni() {
    if (omni) {
        omni = false;
        document.getElementById("omni").style.backgroundColor = "#404040";
        document.getElementById("omni").style.borderColor = "#505050";

    } else {
        omni = true;
        document.getElementById("omni").style.backgroundColor = "#383838";
        document.getElementById("omni").style.borderColor = "#484848";

    };
};





setInterval(cycle, cycleMs);