
const CELLS = 10000;
const GRID = document.getElementById("gridContainer");



window.addEventListener("resize", () => {
    viewW = window.innerWidth;
    viewH = window.innerHeight;
    GRID.style.height = `${Math.min(viewH, viewW - 210)}px`;
    GRID.style.width = `${Math.min(viewH, viewW - 210)}px`;
    GRID.style.fontSize = `${Math.min(viewH, viewW - 210)/50}px`;
});


for (let i = 1; i < (CELLS + 1); i++) {
    newCell = document.createElement("div");
    newCell.id = i;
    newCell.classList.add('gridContainer');
    GRID.appendChild(newCell);
};