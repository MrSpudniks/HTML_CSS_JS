// init
let neuron_amount = [3, 2];




    



// neuron generation
function generate_neurons() {
    let cloneIt = 1;

    for (let neuron = 1; neuron < neuron_amount[layer]; neuron++) {
        new_neuron = document.createElement("div");
        new_neuron.id = cloneIt;
        cloneIt++;
        new_neuron.classList.add('grid');
        document.getElementById(`L${layer}`).appendChild(new_neuron);
        new_neuron.setAttribute("temp", 50);
        new_neuron.setAttribute("heatCap", 5);
        
    };
};