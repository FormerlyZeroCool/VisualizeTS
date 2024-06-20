"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function normalize_records(records) {
    const normalized = [];
    let sum = 0;
    //aggregate
    for (let i = 0; i < records.length; i++) {
        const record = records[i];
        const normal = { color: record.color, label: record.label, data: 0 };
        normalized.push(normal);
        for (let j = 0; j < record.data.length; j++) {
            normal.data += record.data[j];
            sum += record.data[j];
        }
    }
    //normalize
    for (let i = 0; i < normalized.length; i++) {
        const normal = normalized[i];
        normal.data /= sum;
    }
    return normalized;
}
function setup_text(ctx, width, height) {
    ctx.fillStyle = "#000000";
    // Adding shadow to the text
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 4;
}
function render_donut(canvas, data) {
    let maybectx = canvas.getContext("2d");
    if (!maybectx) {
        console.log("error could not find canvas to render to!!!");
        return;
    }
    const ctx = maybectx;
    const width = canvas.width;
    const height = canvas.height;
    const x = width / 2;
    const y = height / 2;
    const radius = Math.min(height, width) / 3;
    ctx.lineWidth = (width - (x + radius));
    setup_text(ctx, width, height);
    const normalized = normalize_records(data);
    let start = Math.PI;
    for (let i = 0; i < normalized.length; i++) {
        const normal = normalized[i];
        ctx.beginPath();
        ctx.strokeStyle = normal.color;
        const delta = normal.data * 2 * Math.PI;
        ctx.arc(x, y, radius, start, start + delta);
        ctx.stroke();
        start += delta;
    }
}
function make_donut(container, width, height, data) {
    container.innerHTML = '';
    // Create the canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    // Create the key div
    const keyDiv = document.createElement('div');
    keyDiv.style.display = 'flex';
    keyDiv.style.flexDirection = 'column';
    keyDiv.style.marginLeft = '20px';
    // Populate the key with labels and colors
    data.forEach(record => {
        const keyItem = document.createElement('div');
        keyItem.style.display = 'flex';
        keyItem.style.alignItems = 'center';
        const colorBox = document.createElement('div');
        colorBox.style.width = `${width / 10}px`;
        colorBox.style.height = `${width / 10}px`;
        colorBox.style.backgroundColor = record.color;
        colorBox.style.marginRight = '10px';
        colorBox.style.border = '1px solid #000'; // Add black border
        const label = document.createElement('span');
        label.textContent = record.label;
        label.style.fontSize = `${width / 15}px`;
        keyItem.appendChild(colorBox);
        keyItem.appendChild(label);
        keyDiv.appendChild(keyItem);
    });
    // Create a container div to hold the canvas and key
    const containerDiv = document.createElement('div');
    keyDiv.style.display = "none";
    const show_key = (event) => {
        keyDiv.style.display = "block";
    };
    const hide_key = (event) => {
        keyDiv.style.display = "none";
    };
    containerDiv.style.display = 'flex';
    // Append canvas and key to the container div
    containerDiv.appendChild(keyDiv);
    containerDiv.appendChild(canvas);
    // Append the container div to the provided div
    container.appendChild(containerDiv);
    containerDiv.addEventListener("mouseover", show_key);
    containerDiv.addEventListener("mouseout", hide_key);
    // Render the donut chart
    render_donut(canvas, data);
    return canvas;
}
//sample main rendering a donut chart to an html canvas with an id screen
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let data = [
            {
                "label": "Incomplete",
                "color": "#FF0000",
                "data": [7, 11, 25]
            },
            {
                "label": "Submitted",
                "color": "#00FFFF",
                "data": [3, 9, 6]
            },
            {
                "label": "Graded",
                "color": "#00FF00",
                "data": [12, 15, 21]
            }
        ];
        const canvas = make_donut(document.getElementById('chart'), 500, 500, data);
        const ctx = canvas.getContext("2d");
        const drawLoop = () => __awaiter(this, void 0, void 0, function* () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            render_donut(canvas, data);
            requestAnimationFrame(drawLoop);
        });
        drawLoop();
        //while(true){drawLoop(); await sleep(10);}
    });
}
main();
