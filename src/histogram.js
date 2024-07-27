;
function normalize_records(records) {
    const normalized = [];
    let max = -Infinity;
    //Calc max/inital generation of records
    for (let i = 0; i < records.length; i++) {
        const record = records[i];
        const normal = { label: record.label, data: [] };
        normalized.push(normal);
        for (let j = 0; j < record.data.length; j++) {
            const data = record.data[j];
            if (max < data.data)
                max = data.data;
            normal.data.push({ ...data, normal: 0 });
        }
    }
    //normalize
    for (let i = 0; i < normalized.length; i++) {
        const normal = normalized[i];
        for (let j = 0; j < normal.data.length; j++) {
            const rec = normal.data[j];
            rec.normal = rec.data / max;
        }
    }
    return normalized;
}
function setup_text(ctx, width, height) {
    ctx.fillStyle = "#000000";
    // Adding shadow to the text
    ctx.shadowColor = "rgba(255,255,255, 0.5)";
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 4;
}
function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}
function fillRoundedRect(ctx, x, y, width, height, radius) {
    drawRoundedRect(ctx, x, y, width, height, radius);
    ctx.fill();
}
function strokeRoundedRect(ctx, x, y, width, height, radius) {
    drawRoundedRect(ctx, x, y, width, height, radius);
    ctx.stroke();
}
let heightOffset = 20;
const text_color = "rgba(0, 0, 0, 0.75)";
//take parameter for 
//font size, # of y labels/intervals, ymin, ymax,
//on x labels ensure labels don't interfere with one another
export function render_histogram(canvas, data, fontSize, y_intervals, percent) {
    let maybectx = canvas.getContext("2d");
    if (!maybectx) {
        console.log("error could not find canvas to render to!!!");
        return;
    }
    const max_label_char_count = () => {
        let max = -Infinity;
        data.forEach((cur) => max = max < cur.label.length ? cur.label.length : max);
        return max;
    };
    const ctx = maybectx;
    heightOffset = fontSize;
    ctx.font = `${fontSize}px Arial`;
    const width = canvas.width;
    const height = canvas.height - heightOffset;
    setup_text(ctx, width, height);
    const normalized = normalize_records(data);
    const groupSpacing = width / data.length;
    const groupWidth = groupSpacing / 1.5;
    const get_max_text_width = (data) => {
    };
    let last_label_end = -1;
    ctx.clearRect(0, 0, width, canvas.height);
    //render lines across screen
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    for (let i = 1; i < y_intervals; i++) {
        ctx.fillRect(0, i * height / y_intervals, width, 1);
    }
    //render bars, and labels
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    for (let i = 0; i < normalized.length; i++) {
        const normals = normalized[i];
        const groupX = (i + 0.5) * groupSpacing - groupWidth / 2;
        const barWidth = groupWidth / (normalized[0].data.length);
        for (let j = 0; j < normals.data.length; j++) {
            const rec = normals.data[j];
            const barHeight = rec.normal * height;
            const x = groupX + j * barWidth;
            const y = height - barHeight;
            ctx.fillStyle = rec.color;
            const delta = barHeight * (1 - percent);
            fillRoundedRect(ctx, x, y + delta, barWidth, barHeight - delta, 3);
            strokeRoundedRect(ctx, x, y + delta, barWidth, barHeight - delta, 3);
        }
        // Add group label
        if (last_label_end < groupX) {
            ctx.fillStyle = text_color;
            ctx.fillText(normals.label, groupX, canvas.height - 3);
            ctx.strokeText(normals.label, groupX, canvas.height - 3);
            last_label_end = groupX + ctx.measureText(normals.label).width + 3;
        }
    }
    ctx.strokeRect(0, 0, width, height);
}
function createYAxisLabels(maxValue, height, precision, intervals, font, fontSize) {
    const yAxisDiv = document.createElement('div');
    yAxisDiv.style.display = 'flex';
    yAxisDiv.style.flexDirection = 'column';
    yAxisDiv.style.justifyContent = 'space-between';
    yAxisDiv.style.height = `${height - Math.ceil(heightOffset)}px`;
    yAxisDiv.style.marginRight = `${fontSize / 2}px`;
    yAxisDiv.style.font = font;
    yAxisDiv.style.fontSize = `${fontSize}px`;
    yAxisDiv.style.color = text_color;
    for (let i = intervals; i >= 0; i--) {
        const label = document.createElement('div');
        label.innerText = ((maxValue / intervals) * i).toFixed(precision);
        yAxisDiv.appendChild(label);
    }
    return yAxisDiv;
}
;
export function make_histogram(container, width, height, data, labels_config = { y_precision: -1, y_intervals: 10, fontSize: Math.max(8, width / 80) }, auto_resize = true) {
    const window_width = window.innerWidth;
    const window_height = window.innerHeight;
    const original_width = width;
    const original_height = height;
    let first_render = true;
    const render = () => {
        const ratio_w = () => window.innerWidth / window_width;
        const ratio_h = () => window.innerHeight / window_height;
        container.innerHTML = '';
        width = original_width * ratio_w();
        height = original_height * ratio_h();
        labels_config.fontSize = Math.max(8, width / 40);
        // Create the canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext("2d");
        ctx.font = `${labels_config.fontSize}px Arial`;
        // Create the y-axis labels
        const maxDataValue = Math.max(...data.flatMap(group => group.data.map(record => record.data)));
        if (labels_config.y_precision < 0)
            labels_config.y_precision = Math.max(0, 2 - Math.floor(Math.log10(maxDataValue)));
        const yAxisDiv = createYAxisLabels(maxDataValue, height, labels_config.y_precision, labels_config.y_intervals, ctx.font, labels_config.fontSize);
        // Create the key div
        const keyDiv = document.createElement('div');
        keyDiv.style.display = 'flex';
        keyDiv.style.flexDirection = 'column';
        keyDiv.style.marginLeft = '20px';
        keyDiv.style.fontSize = `${labels_config.fontSize}`;
        keyDiv.style.color = text_color;
        // Populate the key with labels and colors
        const labels = new Set();
        labels.add('');
        let max_text_width = -Infinity;
        const color_box_width = 5;
        const color_box_margin_right = 10;
        data.forEach(group => {
            group.data.forEach(record => {
                if (labels.has(record.label))
                    return;
                labels.add(record.label);
                const keyItem = document.createElement('div');
                keyItem.style.display = 'flex';
                keyItem.style.alignItems = 'center';
                keyItem.style.marginBottom = '5px';
                const colorBox = document.createElement('div');
                colorBox.style.width = `${color_box_width}vw`;
                colorBox.style.height = '4vh';
                colorBox.style.backgroundColor = record.color;
                colorBox.style.marginRight = `${color_box_margin_right}px`;
                const label = document.createElement('span');
                const text_width = ctx.measureText(record.label).width;
                if (max_text_width < text_width)
                    max_text_width = text_width;
                label.innerText = `${record.label}`;
                keyItem.appendChild(colorBox);
                keyItem.appendChild(label);
                keyDiv.appendChild(keyItem);
            });
        });
        // Create a container div to hold the y-axis, canvas, and key
        const containerDiv = document.createElement('div');
        containerDiv.style.display = 'flex';
        // Append y-axis, canvas, and key to the container div
        containerDiv.appendChild(yAxisDiv);
        containerDiv.appendChild(canvas);
        containerDiv.appendChild(keyDiv);
        // Append the container div to the provided div
        container.appendChild(containerDiv);
        keyDiv.style.width = `${window.innerWidth * color_box_width / 100 + max_text_width + color_box_margin_right}px`;
        //container.appendChild(xAxisDiv);
        canvas.width = Math.max(10, width - yAxisDiv.clientWidth - keyDiv.clientWidth);
        canvas.height = height;
        containerDiv.style.border = "thick ridge rgba(0, 0, 0, 0.25)";
        const draw = (percent) => render_histogram(canvas, data, labels_config.fontSize, labels_config.y_intervals, percent);
        // Render the histogram
        if (first_render) {
            first_render = false;
            const total_time = 300;
            const start_time = Date.now();
            const frame_time = 12;
            const intervalId = setInterval(() => {
                let percent = (Date.now() - start_time) / total_time;
                if (percent >= 1) {
                    percent = 1;
                    clearInterval(intervalId);
                }
                draw(percent);
            }, frame_time);
            return;
        }
        draw(1);
    };
    window.addEventListener("load", render);
    if (auto_resize)
        window.addEventListener('resize', render);
}
