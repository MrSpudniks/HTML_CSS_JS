
let cloneId = 1;

class cell {
    constructor() {
        
    }
}

function add() {
    newthing = document.createElement("div");
    newthing.id = cloneId;
    newthing.classList.add('grid');
    cloneId++;
    document.getElementById("grid").appendChild(newthing);
}

setInterval (update, 50);

function update() {
    // rtthrthrrw
}
