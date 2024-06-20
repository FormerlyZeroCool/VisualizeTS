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
    ctx.font = `${width / 10}px Helvetica`;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);
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
        const mid_point = start + delta / 2;
        const text_x = x + radius * Math.cos(mid_point);
        const text_y = y + radius * Math.sin(mid_point);
        const text_width = ctx.measureText(normal.label).width;
        if (width - text_x < text_width) {
            ctx.textAlign = "center";
            ctx.fillText(normal.label, text_x, text_y, width - text_x + text_width / 2.8);
            ctx.textAlign = "start";
        }
        else
            ctx.fillText(normal.label, text_x, text_y, width - text_x);
        start += delta;
    }
}
//sample main rendering a donut chart to an html canvas with an id screen
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const canvas = document.getElementById("screen");
        let maybectx = canvas.getContext("2d");
        if (!maybectx) {
            console.log("error could not find canvas to render to!!!");
            return;
        }
        const ctx = maybectx;
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
        const drawLoop = () => __awaiter(this, void 0, void 0, function* () {
            render_donut(canvas, data);
            requestAnimationFrame(drawLoop);
        });
        drawLoop();
        //while(true){drawLoop(); await sleep(10);}
    });
}
main();
