

export interface DataRecord {
    label:string;
    color:string;
    data:number;
}
export interface GroupedRecord {
    label:string;
    data:DataRecord[];
};
export interface LabelsConfig {
    y_precision:number; y_intervals:number; fontSize:number;
};
export interface RangeConfig {
    y_min:number;
    y_max:number;
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

function normalize_records(records:GroupedRecord[], range:RangeConfig): NormalizedGroupRecord[]
{
    const normalized:NormalizedGroupRecord[] =
        records.map<NormalizedGroupRecord>(
            (grouped_record) => { 
                return { ...grouped_record, 
                    data: grouped_record.data.map<NormalizedRecord>((record) =>
                        {return{ ...record, normal: 0}}
                    )}
            });
    //normalize
    for(let i = 0; i < normalized.length; i++)
    {
        const normal:NormalizedGroupRecord = normalized[i];
        for (let j = 0; j < normal.data.length; j++)
        {
            const rec:NormalizedRecord = normal.data[j];
            if (rec.data > range.y_min)
                rec.normal = (rec.data - range.y_min) / (range.y_max - range.y_min);
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
function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, 
                            width: number, height: number, radius: number): void 
{
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

function fillRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, 
    width: number, height: number, radius: number): void 
{
    drawRoundedRect(ctx, x, y, width, height, radius);
    ctx.fill();
}

function strokeRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, 
    width: number, height: number, radius: number): void 
{
    drawRoundedRect(ctx, x, y, width, height, radius);
    ctx.stroke();
}
function render_text_at_angle(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, angle: number): void
{
    ctx.save();
  
    ctx.translate(x, y);
    ctx.rotate(angle * Math.PI / 180); 

    ctx.fillText(text, 0, 0);
    ctx.strokeText(text, 0, 0);

    ctx.restore();
  }
const text_color = "rgba(0, 0, 0, 0.75)";
interface RenderStruct {
    color:string;
    render_fun:() => void;
};
//take parameter for 
//font size, # of y labels/intervals, ymin, ymax,
//on x labels ensure labels don't interfere with one another
export function render_histogram(canvas:HTMLCanvasElement, data:GroupedRecord[], fontSize:number, y_intervals:number, range:RangeConfig, heightOffset:number, percent:number, render_text:boolean, last_percent:number = -1):boolean
{
    let maybectx:CanvasRenderingContext2D | null = canvas.getContext("2d");
    if(!maybectx)
    {
        console.log("error could not find canvas to render to!!!");
        return false;
    }
    const ctx:CanvasRenderingContext2D = maybectx;
    //heightOffset = fontSize;
    ctx.font = `${fontSize}px Arial`;
    const width:number = canvas.width;
    const height:number = canvas.height - heightOffset;
    setup_text(ctx, width, height);
    const normalized:NormalizedGroupRecord[] = normalize_records(data, range);
    const groupSpacing = width / data.length;
    const groupWidth = groupSpacing / 1.5;
    const last_percent_is_invalid = percent >= 1 || last_percent > percent || last_percent < 0 || last_percent > 1;
    let last_label_end = -1;
    if (last_percent_is_invalid)
    {
        if (render_text)
            ctx.clearRect(0, 0, width, canvas.height);
        else
            ctx.clearRect(0, 0, width, height - heightOffset);
    }
    //ctx.imageSmoothingEnabled = false;
    if (last_percent_is_invalid)
    {
        //render lines across screen
        ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
        for (let i = 1; i < y_intervals; i++)
        {
            ctx.fillRect(0, i * height / y_intervals, width, 1);
        }
    }
    //render bars, and labels
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    const render_data:RenderStruct[] = [];
    for (let i = 0; i < normalized.length; i++) {
        const normals: NormalizedGroupRecord = normalized[i];
        const groupX = (i + 0.5) * groupSpacing - groupWidth / 2;
        const barWidth = groupWidth / (normalized[0].data.length);

        for (let j = 0; j < normals.data.length; j++) {
            const rec: NormalizedRecord = normals.data[j];
            const o_barHeight = rec.normal * height;
            const barHeight = o_barHeight * percent;
            const x = groupX + j * barWidth;
            const y = height - barHeight;
            if (barHeight < 0)
                continue;
            if (percent < 1 && !last_percent_is_invalid)
            {
                render_data.push({color: rec.color, render_fun: () => {
                    const altered_height = (percent - last_percent) * o_barHeight;
                    //const yi = y//Math.ceil(y);
                    ctx.fillRect(x, y, barWidth, altered_height);
                    //ctx.strokeRect(x, yi, barWidth, altered_height);
                    //console.log(percent - last_percent, y, altered_height);
                }});
            }
            else
            {
                render_data.push({color: rec.color, render_fun: () => {
                    fillRoundedRect(ctx, x, y, barWidth, barHeight, barWidth / 16);
                    strokeRoundedRect(ctx, x, y, barWidth, barHeight, barWidth / 16);
                }});
            }
        }
        // Add group label
        const text_x = groupX + groupWidth / 2 - fontSize / 2;
        if (render_text && text_x > last_label_end)
        {
            render_data.push({color: text_color, render_fun: () => {
                render_text_at_angle(ctx, normals.label, text_x, canvas.height - heightOffset, 90);
            }});
            last_label_end = text_x + fontSize + 3;
        }
    }
    let current_color = ""
    render_data.sort((a, b) => {
        return a.color < b.color ? -1 : (b.color < a.color ? 1 : 0);
    })
    ctx.imageSmoothingEnabled = false;
    render_data.forEach((rec) => {
        if (current_color != rec.color)
        {
            current_color = rec.color;
            ctx.fillStyle = rec.color;
        }
        rec.render_fun();
    });
    ctx.strokeRect(0, 0, width, height);
    return true;
}

function createYAxisLabels(range:RangeConfig, height: number, precision:number, intervals:number, font:string, fontSize:number, heightOffset:number): HTMLDivElement {
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
        label.innerText = (range.y_min + ((range.y_max - range.y_min) / intervals * i)).toFixed(precision);
        yAxisDiv.appendChild(label);
    }
    return yAxisDiv;
}


export function make_histogram(container: HTMLDivElement, width: number, height: number, data: GroupedRecord[], 
        auto_resize:boolean = true,
        labels_config:LabelsConfig = {y_precision: -1, y_intervals: 10, fontSize: -1},
        range:RangeConfig = {y_min: Infinity, y_max: Infinity}
        ): boolean 
{
    const window_width = window.innerWidth;
    const window_height = window.innerHeight;
    const ratio_w = () => window.innerWidth / window_width;
    const ratio_h = () => window.innerHeight / window_height;
    const maxDataValue = Math.max(...data.flatMap(group => group.data.map(record => record.data)));

    const original_width = width;
    const original_height = height;
    const original_fontSize = ((labels_config.fontSize) < 0 ? Math.max(8, width / 80) : labels_config.fontSize);

    labels_config.fontSize = original_fontSize;
    let first_render = true;
    if (Math.abs(range.y_min) === Infinity)
        range.y_min = 0;
    if (Math.abs(range.y_max) === Infinity)
        range.y_max = maxDataValue;

    if (range.y_min > range.y_max)
        return false;


    if (labels_config.y_precision < 0)
        labels_config.y_precision = Math.max(0, 2 - Math.floor(Math.log10(range.y_max - range.y_min)));

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext("2d")!;
    const max_label_char_count = () => {
        let max = -Infinity
        data.forEach((cur:GroupedRecord) => max = max < ctx.measureText(cur.label).width ? ctx.measureText(cur.label).width : max);
        return max;
    };
    const render = ():boolean => {
        container.innerHTML = '';
        width = original_width * ratio_w();
        height = original_height * ratio_h();
        labels_config.fontSize = Math.max(8, original_fontSize * ratio_w());

        ctx.font = `${labels_config.fontSize}px Arial`;
        const heightOffset = max_label_char_count() + labels_config.fontSize / 3;

        // Create the y-axis labels
        const yAxisDiv = createYAxisLabels(range, height,
            labels_config.y_precision, labels_config.y_intervals,
            ctx.font, labels_config.fontSize, heightOffset);

        // Create the key div
        const keyDiv = document.createElement('div');
        keyDiv.style.display = 'flex';
        keyDiv.style.flexDirection = 'column';
        keyDiv.style.marginLeft = '20px';
        keyDiv.style.fontSize = `${labels_config.fontSize}`;
        keyDiv.style.color = text_color;

        // Populate the key with labels and colors
        const labels = new Set<string>();
        labels.add('');
        let max_text_width = -Infinity;
        const color_box_width = 5;
        const color_box_margin_right = 10;
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
                colorBox.style.width = `${color_box_width}vh`;
                colorBox.style.height = '4vh';
                colorBox.style.backgroundColor = record.color;
                colorBox.style.marginRight = `${color_box_margin_right}px`;
                colorBox.style.borderRadius = '5px';
                colorBox.style.border = "2px solid rgba(0, 0, 0, 0.3)";
                

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

        containerDiv.appendChild(yAxisDiv);
        containerDiv.appendChild(canvas);
        containerDiv.appendChild(keyDiv);

        // Append the container div to the provided div
        container.appendChild(containerDiv);
        const keyDivCalcedWidth = window.innerWidth * color_box_width / 100 + max_text_width + color_box_margin_right;
        keyDiv.style.width = `${keyDivCalcedWidth}px`;
        
        canvas.width = Math.max(10, width - yAxisDiv.clientWidth - keyDivCalcedWidth);
        canvas.height = height;

        const draw = (percent:number, render_text:boolean, last_percent:number = -1):boolean => 
            render_histogram(canvas, data, labels_config.fontSize, labels_config.y_intervals, range, heightOffset, percent, render_text, last_percent);

        if (first_render)
        {
            first_render = false;
            const total_time = 300;
            const start_time = Date.now();
            const frame_time = 8;

            let last_percent = 0;
            let last_whole_percent = 0;
            draw(last_percent, true);
            const animate = () => {
                let percent = (Date.now() - start_time) / total_time;
                if (percent >= 1)
                {
                    percent = 1;
                    draw(percent, true);
                    return;
                }
                draw(percent, false, last_percent);
                last_percent = percent;
                requestAnimationFrame(animate);
            } 
            requestAnimationFrame(animate);
            return true;
        }
        return draw(1, false);
    };
    if (auto_resize)
        window.addEventListener('resize', render);
    return render();
}