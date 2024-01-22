
const CELLS = 10000;





window.addEventListener("resize", () => {
    viewW = window.innerWidth;
    viewH = window.innerHeight;
    grid.style.height = `${Math.min(viewH, viewW - 210)}px`;
    grid.style.width = `${Math.min(viewH, viewW - 210)}px`;
    grid.style.fontSize = `${Math.min(viewH, viewW - 210)/50}px`;
});


for (let i = 1; i < (cells + 1); i++) {
    newCell = document.createElement("div");
    newCell.id = cloneIt;
    cloneIt++;
    newCell.classList.add('gridContainer');
    document.getElementById("gridContainer").appendChild(newCell);
};