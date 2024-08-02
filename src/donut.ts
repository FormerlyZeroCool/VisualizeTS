export interface DataRecord {
    label:string;
    color:string;
    data:number[];
}
interface NormalizedRecord {
    label:string;
    color:string;
    data:number;
}
function normalize_records(records:DataRecord[]): NormalizedRecord[]
{
    const normalized:NormalizedRecord[] = [];
    let sum:number = 0;
    //aggregate
    for(let i = 0; i < records.length; i++)
    {
        const record:DataRecord = records[i];
        const normal:NormalizedRecord = {color: record.color, label: record.label, data: 0};
        normalized.push(normal);
        for(let j = 0; j < record.data.length; j++)
        {
            normal.data += record.data[j];
            sum += record.data[j];
        }
    }
    //normalize
    for(let i = 0; i < normalized.length; i++)
    {
        const normal:NormalizedRecord = normalized[i];
        normal.data /= sum;
    }
    return normalized;
}
function setup_text(ctx:CanvasRenderingContext2D, width:number, height:number):void
{
    ctx.fillStyle = "#000000";
    // Adding shadow to the text
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 4;
}
export function render_donut(canvas:HTMLCanvasElement, data:DataRecord[]):void
{
    let maybectx:CanvasRenderingContext2D | null = canvas.getContext("2d");
    if(!maybectx)
    {
        console.log("error could not find canvas to render to!!!");
        return;
    }
    const ctx:CanvasRenderingContext2D = maybectx;
    const width:number = canvas.width;
    const height:number = canvas.height;
    const x:number = width / 2;
    const y:number = height / 2;
    const radius:number = Math.min(height, width) / 3;
    const vw = (vw:number) => width / 100 * vw;
    ctx.lineWidth = vw(6);
    setup_text(ctx, width, height);
    const normalized:NormalizedRecord[] = normalize_records(data);
    let start = Math.PI;
    for(let i = 0; i < normalized.length; i++)
    {
        const normal:NormalizedRecord = normalized[i];
        ctx.beginPath();
        ctx.strokeStyle = normal.color;
        const delta:number = normal.data * 2 * Math.PI;
        ctx.arc(x, y, radius, start, start + delta);
        ctx.stroke();
        start += delta;
    }
}
export function make_donut(container: HTMLDivElement, width: number, height: number, data: DataRecord[]): void {
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
    const font_size = width / 100 * 3.5;
    data.forEach(record => {
        const keyItem = document.createElement('div');
        keyItem.style.display = 'flex';
        keyItem.style.alignItems = 'center';

        const colorBox = document.createElement('div');
        colorBox.style.width = `${font_size * 1.5}px`;
        colorBox.style.height = `${font_size * 1.5}px`;
        colorBox.style.backgroundColor = record.color;
        colorBox.style.marginRight = '10px';
        colorBox.style.border = '1px solid #000'; // Add black border

        const label = document.createElement('span');
        label.textContent = record.label;
        label.style.fontSize = `${font_size}px`; 

        keyItem.appendChild(colorBox);
        keyItem.appendChild(label);
        keyDiv.appendChild(keyItem);
    });

    // Create a container div to hold the canvas and key
    const containerDiv = document.createElement('div');
    containerDiv.style.display = 'flex';

    // Append canvas and key to the container div
    containerDiv.appendChild(keyDiv);
    containerDiv.appendChild(canvas);

    // Append the container div to the provided div
    container.appendChild(containerDiv);

    // Render the donut chart
    render_donut(canvas, data);
}
