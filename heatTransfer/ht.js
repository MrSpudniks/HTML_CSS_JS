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
let cycleMs = 5;
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
let speed = 1.0;
let viewW = window.innerWidth;
let viewH = window.innerHeight;
grid.style.height = `${Math.min(viewH, viewW)}px`;
grid.style.width = `${Math.min(viewH, viewW)}px`;
grid.style.fontSize = `${Math.min(viewH, viewW)/50}px`;
let mouseDown = false;
let viewModeIndex = 0;
let viewMode = "temp"
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

    if (selectedElement == "setSpeed") {

        speed = parseFloat(document.getElementById("setSpeed").getAttribute("speed"));
        document.getElementById(selectedElement).setAttribute("speed", Math.round(Math.max(Math.min(speed + (scrollLength / 10), 5), 0.1) * 10) / 10);
        document.getElementById("setSpeed").firstChild.innerHTML = `${speed}x`;

    } else if (!(selectedElement == null)) {
         if (viewMode == "temp" | viewMode == "color") {
            temp = parseInt(document.getElementById(selectedElement).getAttribute("temp"));
            document.getElementById(selectedElement).setAttribute("temp", Math.max(Math.min(temp + scrollLength, 100), 0));
            if (selectedElement == "setTemp") {
                selectedTemp = temp;
                document.getElementById("setTemp").firstChild.innerHTML = selectedTemp;
            };
         } else if (viewMode == "heatCap") {
            temp = parseInt(document.getElementById(selectedElement).getAttribute("heatCap"));
            document.getElementById(selectedElement).setAttribute("heatCap", Math.max(Math.min(temp + scrollLength, 10), 1));
            if (selectedElement == "setTemp") {
                selectedTemp = temp;
                document.getElementById("setTemp").firstChild.innerHTML = selectedTemp;
            };
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
    newCell.setAttribute("heatCap", 5);
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
            if (viewMode == "temp" | viewMode == "color") {
                document.getElementById(id).setAttribute("temp", selectedTemp);
            } else if (viewMode == "heatCap") {
                document.getElementById(id).setAttribute("heatCap", selectedTemp);
            };
            
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
        tempSum = tempSum + ((document.getElementById(`${i - maxX}`).getAttribute("temp") - temp) * KA / D / (1000/cycleMs) * speed) / (document.getElementById(i).getAttribute("heatCap") / 5);
    };

    if (i <= (cells - maxX)) {
        tempSum = tempSum + ((document.getElementById(`${i + maxX}`).getAttribute("temp") - temp) * KA / D / (1000/cycleMs) * speed) / (document.getElementById(i).getAttribute("heatCap") / 5);
    };

    if ((i % maxX) != 1) {
        tempSum = tempSum + ((document.getElementById(`${i - 1}`).getAttribute("temp") - temp) * KA / D / (1000/cycleMs) * speed) / (document.getElementById(i).getAttribute("heatCap") / 5);
    };

    if ((i % maxX) != 0) {
        tempSum = tempSum + ((document.getElementById(`${i + 1}`).getAttribute("temp") - temp) * KA / D / (1000/cycleMs) * speed) / (document.getElementById(i).getAttribute("heatCap") / 5);
    };

    if (omni) {
        if (i > maxX & (i % maxX) != 1) {
            tempSum = tempSum + ((document.getElementById(`${i - maxX - 1}`).getAttribute("temp") - temp) * KA / D / (1000/cycleMs) * speed / 1.41421356237) / (document.getElementById(i).getAttribute("heatCap") / 5);
        };
    
        if (i <= (cells - maxX) & (i % maxX) != 1) {
            tempSum = tempSum + ((document.getElementById(`${i + maxX - 1}`).getAttribute("temp") - temp) * KA / D / (1000/cycleMs) * speed / 1.41421356237) / (document.getElementById(i).getAttribute("heatCap") / 5);
        };
        
        if (i > maxX & (i % maxX) != 0) {
            tempSum = tempSum + ((document.getElementById(`${i - maxX + 1}`).getAttribute("temp") - temp) * KA / D / (1000/cycleMs) * speed / 1.41421356237) / (document.getElementById(i).getAttribute("heatCap") / 5);
        };
    
        if (i <= (cells - maxX) & (i % maxX) != 0) {
            tempSum = tempSum + ((document.getElementById(`${i + maxX + 1}`).getAttribute("temp") - temp) * KA / D / (1000/cycleMs) * speed / 1.41421356237) / (document.getElementById(i).getAttribute("heatCap") / 5);
        };
        
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
    let g = Math.max(48, Math.max(r, b) / 3)

    if (viewMode == "temp" | viewMode == "color") {

        if (element.hasAttribute("source")) {
            element.style.borderColor = "#202020";
        } else {
            element.style.borderColor = `rgb(${r}, ${g}, ${b})`;
        };

        document.getElementById(`${i}p`).style.color = `rgb(${r}, ${g}, ${b})`;
        document.getElementById(`${i}p`).innerHTML = Math.round(temp);
    } else if (viewMode == "heatCap") {
        temp = element.getAttribute("heatCap");
        let g = temp * 12.8 + 63

        element.style.borderColor = `rgb(0, ${g}, 0)`;
        document.getElementById(`${i}p`).style.color = `rgb(0, ${g}, 0)`;
        document.getElementById(`${i}p`).innerHTML = Math.round(temp);

    };


    if (viewMode == "color") {
        document.getElementById(i).style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    } else {
        document.getElementById(i).style.backgroundColor = `#303030`;
    };
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
    if (viewMode == "temp") {

        for (let i = 1; i < (cells + 1); i++) {
            document.getElementById(i).setAttribute("temp", selectedTemp);
        };


    } else if (viewMode == "heatCap") {

        for (let i = 1; i < (cells + 1); i++) {
            document.getElementById(i).setAttribute("heatCap", selectedTemp);
        };
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
        if (viewMode == "temp" | viewMode == "color") {
            document.getElementById(id).setAttribute("temp", selectedTemp);
        } else if (viewMode == "heatCap") {
            document.getElementById(id).setAttribute("heatCap", selectedTemp);
        };
    } else if (clickMode == "source") {
        if (document.getElementById(id).hasAttribute("source")) {
            document.getElementById(id).removeAttribute("source");
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
    viewModeIndex = (viewModeIndex + 1) % 3;

    switch (viewModeIndex) {
        case 0:
            viewMode = "temp";
            break;
        
        case 1:
            viewMode = "heatCap";
            setTemp();
            selectedTemp = Math.max(1, Math.min(10, selectedTemp));
            document.getElementById("setTemp").firstChild.innerHTML = selectedTemp;
            document.getElementById("setTemp").setAttribute("heatCap", selectedTemp);
            document.getElementById("setTemp").setAttribute("temp", selectedTemp);
            break;
        
        case 2:
            viewMode = "color";
            break;
    };
};

function setTemp() {
    clickMode = "setTemp";
    document.getElementById("setTemp").style.backgroundColor = "#383838";
    document.getElementById("setTemp").style.borderColor = "#484848";
    document.getElementById("source").style.backgroundColor = "#404040";
    document.getElementById("source").style.borderColor = "#505050";
};

function source() {
    if (viewMode != "heatCap") {
        clickMode = "source";
        document.getElementById("source").style.backgroundColor = "#383838";
        document.getElementById("source").style.borderColor = "#484848";
        document.getElementById("setTemp").style.backgroundColor = "#404040";
        document.getElementById("setTemp").style.borderColor = "#505050";
    };
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