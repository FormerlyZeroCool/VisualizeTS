interface DataRecord {
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
function render_donut(canvas:HTMLCanvasElement, data:DataRecord[]):void
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
    ctx.lineWidth = (width - (x + radius));
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
        const mid_point:number = start + delta / 2;
        const text_x = x + radius * Math.cos(mid_point);
        const text_y = y + radius * Math.sin(mid_point);
        const text_width = ctx.measureText(normal.label).width;
        if (width - text_x < text_width)
        {
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
async function main()
{
    const canvas:HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("screen");
    let maybectx:CanvasRenderingContext2D | null = canvas.getContext("2d");
    if(!maybectx)
    {
        console.log("error could not find canvas to render to!!!");
        return;
    }
    const ctx:CanvasRenderingContext2D = maybectx;
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
    const drawLoop = async () => 
        {
            render_donut(canvas, data);
            
            requestAnimationFrame(drawLoop);
        }
    drawLoop();
    //while(true){drawLoop(); await sleep(10);}
}
main();