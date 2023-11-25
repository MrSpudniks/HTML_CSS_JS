// debug
let logCycleMs = false;
let logSelectedElement = false;
let logTemp = false;

// init
let sim = false;
let grid = document.getElementById("grid");
let x = 1;
let y = 1;
let maxX = 10;
let cells = maxX**2;
let KA = 1;
let D = 1;
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
let viewW = window.innerWidth;
let viewH = window.innerHeight;
grid.style.height = `${Math.min(viewH, viewW)}px`;
grid.style.width = `${Math.min(viewH, viewW)}px`;
grid.style.fontSize = `${Math.min(viewH, viewW)/50}px`;



// grid size fix
window.addEventListener("resize", () => {
    viewW = window.innerWidth;
    viewH = window.innerHeight;
    grid.style.height = `${Math.min(viewH, viewW)}px`;
    grid.style.width = `${Math.min(viewH, viewW)}px`;
    grid.style.fontSize = `${Math.min(viewH, viewW)/50}px`;
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
    };

    if (logTemp) {
        console.log(temp, scrollLength)
    }
});



// for loop to generate cells
for (let i = 1; i < (cells + 1); i++) {
    newCell = document.createElement("div");
    x = i % 10;
    y = Math.floor(i / 10);
    newCell.id = cloneIt;
    cloneIt++;
    newCell.classList.add('grid');
    grid.appendChild(newCell);
    newCell.setAttribute("onmouseover", "setElement(id)");
    newCell.setAttribute("onmouseout", "resetElement()");
    newCell.setAttribute("temp", 50);
    newP = document.createElement("p");
    newP.id = `${cloneIt - 1}p`;
    newP.innerHTML = "50";
    newCell.appendChild(newP);
    
};



// select element to be altered
function setElement(id) {
    selectedElement = id;

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
            setTransfer(i);
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


function setTransfer(i) {
    element = document.getElementById(i);
    element.setAttribute("temp", parseFloat(element.getAttribute("temp")) + parseFloat(element.getAttribute("calcTemp")))
};


function setColor(i) {
    element = document.getElementById(i);
    temp = element.getAttribute("temp");
    let r = Math.round(temp * 2.56);
    let b = 256 - r;
    element.style.borderColor = `rgb(${r}, 32, ${b})`;
    document.getElementById(`${i}p`).style.color = `rgb(${r}, 32, ${b})`;
    document.getElementById(`${i}p`).innerHTML = Math.round(temp)
};








setInterval(cycle, cycleMs);