// debug
let logCycleMs = false;
let logSelectedElement = false;
let logTemp = false;



// init
let sim = false;
let grid = document.getElementById("grid");
const maxX = 15;
const cells = maxX**2;
const KA = 1;
const D = 1;
let cycleMs = 50;
let omni = false;
let timeSinceLastScroll = 1;
let timeAtLastScroll = 1;
let currentTime = 0;
let lastCycle = 0;
let scrollLength = 1;
let cloneIt = 1;
let hex = ["1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"]
let selectedElement = NaN;
let selectedTemp = 50;
let viewW = window.innerWidth;
let viewH = window.innerHeight;
grid.style.height = `${Math.min(viewH, viewW)}px`;
grid.style.width = `${Math.min(viewH, viewW)}px`;
grid.style.fontSize = `${Math.min(viewH, viewW)/50}px`;
let mouseDown = false;
let viewMode = 0;
let clickMode = "setTemp"
document.getElementById("setTemp").style.backgroundColor = "#383838";
document.getElementById("setTemp").style.borderColor = "#484848";



// grid size fix
window.addEventListener("resize", () => {
    viewW = window.innerWidth;
    viewH = window.innerHeight;
    grid.style.height = `${Math.min(viewH, viewW - 210)}px`;
    grid.style.width = `${Math.min(viewH, viewW - 210)}px`;
    grid.style.fontSize = `${Math.min(viewH, viewW - 210)/50}px`;
});



// scroll wheel value output
document.addEventListener("onwheel" in document ? "wheel" : "mousewheel", function(e) {
    e.wheel = (e.deltaY ? -e.deltaY : e.wheelDelta/40) / 100;

    time = new Date();
    currentTime = time.getTime();
    timeSinceLastScroll = currentTime - timeAtLastScroll;
    timeAtLastScroll = currentTime;
    scrollLength = Math.round(e.wheel * Math.max(1, 100 / timeSinceLastScroll));

    if (!(selectedElement == null)) {
        temp = parseInt(document.getElementById(selectedElement).getAttribute("temp"));
        document.getElementById(selectedElement).setAttribute("temp", Math.max(Math.min(temp + scrollLength, 100), 0));
        if (selectedElement == "setTemp") {
            selectedTemp = temp;
            document.getElementById("setTemp").firstChild.innerHTML = selectedTemp;
        };
    };

    if (logTemp) {
        console.log(temp, scrollLength);
    };
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
    newCell.setAttribute("temp", 50);
    newP = document.createElement("p");
    newP.id = `${cloneIt - 1}p`;
    newP.innerHTML = "50";
    newCell.appendChild(newP);
    
};



// select element to be altered
function setElement(id) {
    selectedElement = id;

    if (mouseDown) {
        if (clickMode == "setTemp") {
            document.getElementById(id).setAttribute("temp", selectedTemp);
        };
    };

    if (logSelectedElement) {
        console.log(selectedElement);
    };
};

function resetElement() {
    selectedElement = null;

    if (logSelectedElement) {
        console.log(selectedElement);
    };
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



// calculation of temperature change
function calcTransfer(i) {
    i = parseInt(i)
    let tempSum = 0;
    element = document.getElementById(i);
    temp = element.getAttribute("temp");

    if (i > maxX) {
        tempSum = tempSum + ((document.getElementById(`${i - maxX}`).getAttribute("temp") - temp) * KA / D / (1000/cycleMs))
    };

    if (i <= (cells - maxX)) {
        tempSum = tempSum + ((document.getElementById(`${i + maxX}`).getAttribute("temp") - temp) * KA / D / (1000/cycleMs))
    };

    if ((i % maxX) != 1) {
        tempSum = tempSum + ((document.getElementById(`${i - 1}`).getAttribute("temp") - temp) * KA / D / (1000/cycleMs))
    };

    if (!(i % maxX) == 0) {
        tempSum = tempSum + ((document.getElementById(`${i + 1}`).getAttribute("temp") - temp) * KA / D / (1000/cycleMs))
    };

    element.setAttribute("calcTemp", tempSum)
};



// set all cells temperature based on calculations
function setTransfer(i) {
    element = document.getElementById(i);
    element.setAttribute("temp", parseFloat(element.getAttribute("temp")) + parseFloat(element.getAttribute("calcTemp")))
};



// set decorative colors of all cells and 
function setColor(i) {
    element = document.getElementById(i);
    temp = element.getAttribute("temp");
    let r = Math.round((temp * 1.546354488838) ** 1.1);
    let b = Math.round(((100 - temp) * 1.546354488838) ** 1.1);

    if (element.hasAttribute("source")) {
        element.style.borderColor = "#202020";
    } else {
        element.style.borderColor = `rgb(${r}, 64, ${b})`;
    };

    document.getElementById(`${i}p`).style.color = `rgb(${r}, 64, ${b})`;
    document.getElementById(`${i}p`).innerHTML = Math.round(temp);

    if (viewMode == 1) {
        document.getElementById(i).style.backgroundColor = `rgb(${r}, 64, ${b})`;
    } else {
        document.getElementById(i).style.backgroundColor = `#303030`;
    }
};



// start / stop simulation with Space key
document.addEventListener('keydown', (event) => {
    if (event.key = "space") {
        if (sim) {
            sim = false;
            document.getElementById("pause").firstChild.innerHTML = "play"
        } else {
            sim = true;
            document.getElementById("pause").firstChild.innerHTML = "stop"
        };
    };


  }, false);



// control panel
function set() {
    for (let i = 1; i < (cells + 1); i++) {
        document.getElementById(i).setAttribute("temp", selectedTemp);
    };
};

function pause() {
    if (sim) {
        sim = false;
        document.getElementById("pause").firstChild.innerHTML = "Play"
    } else {
        sim = true;
        document.getElementById("pause").firstChild.innerHTML = "Stop"
    };
};

function clickSet(id) {
    if (clickMode == "setTemp") {
        document.getElementById(id).setAttribute("temp", selectedTemp);
    } else if (clickMode == "source") {
        if (document.getElementById(id).hasAttribute("source")) {
            document.getElementById(id).removeAttribute("source")
        } else {
            document.getElementById(id).setAttribute("source", true);
        };
    };
};

document.body.onmousedown = function() { 
    mouseDown = true;
};
  document.body.onmouseup = function() {
    mouseDown = false;
};

function view() {
    viewMode = (viewMode + 1) % 2;
};

function setTemp() {
    clickMode = "setTemp";
    document.getElementById("setTemp").style.backgroundColor = "#383838";
    document.getElementById("setTemp").style.borderColor = "#484848";
    document.getElementById("source").style.backgroundColor = "#404040";
    document.getElementById("source").style.borderColor = "#505050";
};

function source() {
    clickMode = "source";
    document.getElementById("source").style.backgroundColor = "#383838"
    document.getElementById("source").style.borderColor = "#484848"
    document.getElementById("setTemp").style.backgroundColor = "#404040"
    document.getElementById("setTemp").style.borderColor = "#505050"
};


setInterval(cycle, cycleMs);