

export interface DataRecord {
    label:string;
    color:string;
    data:number;
}
export interface GroupedRecord {
    label:string;
    data:DataRecord[];
};
interface NormalizedRecord {
    label:string;
    color:string;
    data:number;
    normal:number;//between 0, and 1
}
interface NormalizedGroupRecord {
    label:string;
    data:NormalizedRecord[];
}

function normalize_records(records:GroupedRecord[]): NormalizedGroupRecord[]
{
    const normalized:NormalizedGroupRecord[] = [];
    let max:number = 0;
    //Calc max/inital generation of records
    for(let i = 0; i < records.length; i++)
    {
        const record:GroupedRecord = records[i];
        const normal:NormalizedGroupRecord = {label: record.label, data: []};
        normalized.push(normal);
        for(let j = 0; j < record.data.length; j++)
        {
            const data:DataRecord = record.data[j];
            if (max < data.data)
                max = data.data;
            console.log(data)
            normal.data.push({...data, normal: 0});
        }
    }
    //normalize
    for(let i = 0; i < normalized.length; i++)
    {
        const normal:NormalizedGroupRecord = normalized[i];
        for (let j = 0; j < normal.data.length; j++)
        {
            const rec:NormalizedRecord = normal.data[j];
            console.log(rec);
            rec.normal = rec.data / max;
        }
    }
    return normalized;
}
function setup_text(ctx:CanvasRenderingContext2D, width:number, height:number):void
{
    ctx.fillStyle = "#000000";
    // Adding shadow to the text
    ctx.shadowColor = "rgba(255,255,255, 0.5)";
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 4;
}
let heightOffset = 20;
//draw translucent lines across by labels
//take parameter for 
//font size, # of y labels/intervals, ymin, ymax,
//on x labels ensure labels don't interfere with one another
export function render_histogram(canvas:HTMLCanvasElement, data:GroupedRecord[], fontSize:number):void
{
    let maybectx:CanvasRenderingContext2D | null = canvas.getContext("2d");
    if(!maybectx)
    {
        console.log("error could not find canvas to render to!!!");
        return;
    }
    const ctx:CanvasRenderingContext2D = maybectx;
    heightOffset = fontSize;
    ctx.font = `${fontSize}px Arial`;
    const width:number = canvas.width;
    const height:number = canvas.height - heightOffset;
    setup_text(ctx, width, height);
    const normalized:NormalizedGroupRecord[] = normalize_records(data);
    const groupSpacing = width / data.length;
    const groupWidth = groupSpacing / 2;
    let last_label_end = -1;

    for (let i = 0; i < normalized.length; i++) {
        const normals: NormalizedGroupRecord = normalized[i];
        const groupX = (i + 0.5) * groupSpacing - groupWidth / 2;
        const barWidth = groupWidth / (normalized[0].data.length);

        for (let j = 0; j < normals.data.length; j++) {
            const rec: NormalizedRecord = normals.data[j];
            const barHeight = rec.normal * height;
            const x = groupX + j * barWidth;
            const y = height - barHeight;

            ctx.fillStyle = rec.color;
            ctx.fillRect(x, y, barWidth, barHeight);
            ctx.strokeRect(x, y, barWidth, barHeight);
        }
        // Add group label
        ctx.fillStyle = "#000";
        if (last_label_end < groupX)
        {
            ctx.fillText(normals.label, groupX, canvas.height - 3);
            last_label_end = groupX + ctx.measureText(normals.label).width + 3;
        }
    }
    ctx.strokeRect(0, 0, width, height);
}

function createYAxisLabels(maxValue: number, height: number, precision:number, intervals:number, font:string, fontSize:number): HTMLDivElement {
    const yAxisDiv = document.createElement('div');
    yAxisDiv.style.display = 'flex';
    yAxisDiv.style.flexDirection = 'column';
    yAxisDiv.style.justifyContent = 'space-between';
    yAxisDiv.style.height = `${height - heightOffset}px`;
    yAxisDiv.style.marginRight = `${fontSize / 2}px`;
    yAxisDiv.style.font = font;
    yAxisDiv.style.fontSize = `${fontSize}px`;
    for (let i = intervals; i >= 0; i--) {
        const label = document.createElement('div');
        label.innerText = ((maxValue / intervals) * i).toFixed(precision);
        yAxisDiv.appendChild(label);
    }
    return yAxisDiv;
}

export interface LabelsConfig {
    y_precision:number; y_intervals:number; fontSize:number;
};

export function make_histogram(container: HTMLDivElement, width: number, height: number, data: GroupedRecord[], 
        labels_config:LabelsConfig = {y_precision: -1, y_intervals: 10, fontSize: Math.max(8, width / 30) }): void {
    container.innerHTML = '';

    // Create the canvas
    const canvas = document.createElement('canvas');

    // Create the y-axis labels
    const maxDataValue = Math.max(...data.flatMap(group => group.data.map(record => record.data)));
    if (labels_config.y_precision < 0)
        labels_config.y_precision = Math.max(0, 2 - Math.floor(Math.log10(maxDataValue)));
    const yAxisDiv = createYAxisLabels(maxDataValue, height, labels_config.y_precision, labels_config.y_intervals, canvas.getContext("2d")!.font, labels_config.fontSize);

    // Create the x-axis labels
    //const xAxisDiv = createXAxisLabels(data, width);

    // Create the key div
    const keyDiv = document.createElement('div');
    keyDiv.style.display = 'flex';
    keyDiv.style.flexDirection = 'column';
    keyDiv.style.marginLeft = '20px';
    keyDiv.style.fontSize = `${labels_config.fontSize}`;

    // Populate the key with labels and colors
    const labels = new Set<string>();
    labels.add('');
    data.forEach(group => {
        group.data.forEach(record => {
            if(labels.has(record.label))
                return;
            labels.add(record.label);
            const keyItem = document.createElement('div');
            keyItem.style.display = 'flex';
            keyItem.style.alignItems = 'center';
            keyItem.style.marginBottom = '5px';

            const colorBox = document.createElement('div');
            colorBox.style.width = '20px';
            colorBox.style.height = '20px';
            colorBox.style.backgroundColor = record.color;
            colorBox.style.marginRight = '10px';

            const label = document.createElement('span');
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
    //container.appendChild(xAxisDiv);
    canvas.width = Math.max(10, width - yAxisDiv.clientWidth - keyDiv.clientWidth);
    canvas.height = height;

    // Render the histogram
    render_histogram(canvas, data, labels_config.fontSize);
}