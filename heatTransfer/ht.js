let x = 1;
let y = 1;
let maxX = 10;
let cells = 100;
let timeSinceLastScroll = 1;
let timeAtLastScroll = 1;
let currentTime = 0;
let scrollLength = 1;
let clones = [];

document.addEventListener("onwheel" in document ? "wheel" : "mousewheel", function(e) {
    e.wheel = (e.deltaY ? -e.deltaY : e.wheelDelta/40) / 100;

    time = new Date();
    currentTime = time.getTime();
    timeSinceLastScroll = currentTime - timeAtLastScroll;
    timeAtLastScroll = currentTime;
    scrollLength = Math.round(e.wheel * Math.max(1, 100 / timeSinceLastScroll));
});

class cell {
    constructor(X, Y) {
        this.X = X;
        this.Y = Y;
        this.temp = 50;
    };

    transfer() {

    };
};

for (let i = 1; i < (cells + 1); i++) {
    newthing = document.createElement("div");
    x = i % 10;
    y = Math.floor(i / 10);
    clones.push(newthing);
    newthing.classList.add('grid');
    // document.getElementById("grid").appendChild(newthing);
    newthing = new cell(x, y);
};

setInterval(update, 50);

function update() {
    // clones.forEach( (item)=> item.transfer() );
};