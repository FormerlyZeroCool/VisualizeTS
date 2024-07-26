var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
;
export function sign(val) {
    return val < 0 ? -1 : 1;
}
function min(a, b) {
    return a < b ? a : b;
}
function max(a, b) {
    return a > b ? a : b;
}
export function clamp(num, min_val, max_val) {
    return min(max(num, min_val), max_val);
}
export function round_with_precision(value, precision) {
    if (Math.abs(value) < Math.pow(2, -35))
        return 0;
    const mult = Math.pow(10, Math.ceil(precision - Math.log10(Math.abs(value))));
    const rounded = Math.round(value * mult) / mult;
    return rounded;
}
export function normalize(vec) {
    const mag = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
    return [vec[0] / mag, vec[1] / mag];
}
export function scalarDotProduct(a, b) {
    return a[0] * b[0] + a[1] * b[1];
}
export function get_angle(deltaX, deltaY, unit_vectorX = 1, unit_vectorY = 0) {
    const a = normalize([deltaX, deltaY]);
    const b = [unit_vectorX, unit_vectorY];
    const dotProduct = scalarDotProduct(a, b);
    return Math.acos(dotProduct) * (deltaY < 0 ? -1 : 1);
}
export function threeByThreeMat(a, b) {
    return [a[0] * b[0] + a[1] * b[3] + a[2] * b[6],
        a[0] * b[1] + a[1] * b[4] + a[2] * b[7],
        a[0] * b[2] + a[1] * b[5] + a[2] * b[8],
        a[3] * b[0] + a[4] * b[3] + a[5] * b[6],
        a[3] * b[1] + a[4] * b[4] + a[5] * b[7],
        a[3] * b[2] + a[4] * b[5] + a[5] * b[8],
        a[6] * b[0] + a[7] * b[3] + a[8] * b[6],
        a[6] * b[1] + a[7] * b[4] + a[8] * b[7],
        a[6] * b[2] + a[7] * b[5] + a[8] * b[8]];
}
export function matByVec(mat, vec) {
    return [mat[0] * vec[0] + mat[1] * vec[1] + mat[2] * vec[2],
        mat[3] * vec[0] + mat[4] * vec[1] + mat[5] * vec[2],
        mat[6] * vec[0] + mat[7] * vec[1] + mat[8] * vec[2]];
}
function left(index) {
    return 2 * index + 1;
}
function right(index) {
    return 2 * (index + 1);
}
function parent(index) {
    return (index - 1) >> 1;
}
export class PriorityQueue {
    constructor(comparator) {
        this.data = [];
        this.comparator = comparator;
    }
    bubble_up(end) {
        while (end > 0 && this.comparator(this.data[end], this.data[parent(end)]) < 0) {
            const temp = this.data[parent(end)];
            this.data[parent(end)] = this.data[end];
            this.data[end] = temp;
            end = parent(end);
        }
    }
    size() {
        return this.data.length;
    }
    bubble_down() {
        let index = 0;
        while (left(index) < this.size() && right(index) < this.size() &&
            (this.comparator(this.data[left(index)], this.data[index]) < 0 ||
                this.comparator(this.data[right(index)], this.data[index]) < 0)) {
            const lesser_child = this.comparator(this.data[left(index)], this.data[right(index)]) < 0 ? left(index) : right(index);
            const temp = this.data[lesser_child];
            this.data[lesser_child] = this.data[index];
            this.data[index] = temp;
            index = lesser_child;
        }
        if (left(index) < this.size() && this.comparator(this.data[left(index)], this.data[index]) < 0) {
            const lesser_child = left(index);
            const temp = this.data[lesser_child];
            this.data[lesser_child] = this.data[index];
            this.data[index] = temp;
            index = lesser_child;
        }
    }
    push(element) {
        this.data.push(element);
        this.bubble_up(this.data.length - 1);
    }
    pop() {
        if (this.size() > 0) {
            const value = this.data[0];
            const last = this.data.pop();
            if (this.size()) {
                this.data[0] = last;
                this.bubble_down();
            }
            return value;
        }
        return null;
    }
    clear() {
        this.data.length = 0;
    }
}
;
export class Queue {
    constructor() {
        this.data = [];
        this.data.length = 64;
        this.start = 0;
        this.end = 0;
        this.length = 0;
    }
    push(val) {
        if (this.length === this.data.length) {
            const newData = [];
            newData.length = this.data.length * 2;
            for (let i = 0; i < this.data.length; i++) {
                newData[i] = this.data[(i + this.start) % this.data.length];
            }
            this.start = 0;
            this.end = this.data.length;
            this.data = newData;
            this.data[this.end++] = val;
            this.length++;
        }
        else {
            this.data[this.end++] = val;
            this.end %= this.data.length;
            this.length++;
        }
    }
    push_front(val) {
        const queue = new Queue();
        queue.push(val);
        for (let i = 0; this.length; i++) {
            queue.push(this.pop());
        }
        this.data = queue.data;
        this.start = queue.start;
        this.end = queue.end;
        this.length = queue.length;
    }
    pop() {
        if (this.length) {
            const val = this.data[this.start];
            this.start++;
            this.start %= this.data.length;
            this.length--;
            return val;
        }
        throw new Error("No more values in the queue");
    }
    get(index) {
        if (index < this.length) {
            return this.data[(index + this.start) % (this.data.length)];
        }
        throw new Error(`Could not get value at index ${index}`);
    }
    set(index, obj) {
        if (index < this.length) {
            this.data[(index + this.start) % (this.data.length)] = obj;
            return;
        }
        throw new Error(`Could not set value at index ${index}`);
    }
    clear() {
        this.length = 0;
        this.start = 0;
        this.end = this.start;
    }
    indexOf(item, start = 0) {
        if (start < this.length)
            for (let i = start; i < this.length; i++) {
                if (this.get(i) === item) {
                    return i;
                }
            }
        return -1;
    }
}
;
export class FixedSizeQueue {
    constructor(size) {
        this.data = [];
        this.data.length = size;
        this.start = 0;
        this.end = 0;
        this.length = 0;
    }
    push(val) {
        if (this.length === this.data.length) {
            this.start++;
            this.data[this.end++] = val;
            this.start %= this.data.length - 1;
            this.end %= this.data.length - 1;
        }
        else {
            this.data[this.end++] = val;
            this.end %= this.data.length - 1;
            this.length++;
        }
    }
    pop() {
        if (this.length) {
            const val = this.data[this.start];
            this.start++;
            this.start %= this.data.length - 1;
            this.length--;
            return val;
        }
        throw new Error("No more values in the queue");
    }
    get(index) {
        if (index < this.length) {
            return this.data[(index + this.start) % (this.data.length - 1)];
        }
        throw new Error(`Could not get value at index ${index}`);
    }
    set(index, obj) {
        if (index < this.length) {
            this.data[(index + this.start) % (this.data.length - 1)] = obj;
        }
        throw new Error(`Could not set value at index ${index}`);
    }
}
;
export class RollingStack {
    constructor(size = 75) {
        this.data = [];
        this.start = 0;
        this.end = 0;
        this.reserve = size;
        this.size = 0;
        for (let i = 0; i < size; i++)
            this.data.push();
    }
    empty() {
        this.start = 0;
        this.end = 0;
        this.size = 0;
    }
    length() {
        return this.size;
    }
    pop() {
        if (this.size) {
            this.size--;
            this.end--;
            if (this.end < 0)
                this.end = this.reserve - 1;
            return this.data[this.end];
        }
        return null;
    }
    push(val) {
        if (this.size >= this.reserve) {
            this.start++;
            this.start %= this.reserve;
            this.size--;
        }
        this.size++;
        this.data[this.end++] = val;
        this.end %= this.reserve;
    }
    set(index, obj) {
        this.data[(this.start + index) % this.reserve] = obj;
    }
    get(index) {
        return this.data[(this.start + index) % this.reserve];
    }
}
;
class NativeArrayView {
    constructor(size) {
        this.length = 0;
    }
}
export class DynamicFloat64Array {
    constructor(size = 4096) {
        this.data = new Float64Array(size);
        this.length = 0;
    }
    get(index) {
        return this.data[index];
    }
    push(value) {
        if (this.data.length <= this.length) {
            const temp = new Float64Array(this.data.length * 2);
            for (let i = 0; i < this.data.length; i++) {
                temp[i] = this.data[i];
            }
            this.data = temp;
        }
        this.data[this.length++] = value;
    }
    reserve(minimum) {
        if (this.data.length < minimum) {
            this.data = new Float64Array(minimum);
        }
    }
    trimmed() {
        const data = new DynamicFloat64Array(this.length);
        for (let i = 0; i < data.length; i++)
            data.data[i] = this.data[i];
        return data;
    }
}
;
export function toInt32Array(data) {
    const newData = new Int32Array(data.length);
    for (let i = 0; i < data.length; i++) {
        newData[i] = data[i];
    }
    return newData;
}
export function fetchImage(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const img = new Image();
        img.src = URL.createObjectURL(yield (yield fetch(url)).blob());
        return img;
    });
}
export function logBinaryToServer(data, path) {
    return __awaiter(this, void 0, void 0, function* () {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", path, false);
        xhr.send(data);
    });
}
export function logToServer(data, path) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const json = yield res.json();
        return json;
    });
}
export function readFromServer(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield fetch(path, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        return yield data.json();
    });
}
export function saveBlob(blob, fileName) {
    const a = document.createElement("a");
    if (blob) {
        a.href = window.URL.createObjectURL(blob);
        a.download = fileName;
        a.click();
    }
}
export const max_32_bit_signed = Math.pow(2, 31);
export let rand_state = 34;
export function srand(seed) {
    rand_state = seed;
}
export function random() {
    rand_state *= 1997;
    rand_state ^= rand_state << 5;
    rand_state ^= rand_state >> 18;
    rand_state *= 1997;
    rand_state ^= rand_state << 7;
    rand_state = Math.abs(rand_state);
    return (rand_state) * 1 / max_32_bit_signed;
}
export function findLeastUsedDoubleWord(buffer) {
    const useCount = new Map();
    for (let i = 0; i < buffer.length; i++) {
        if (useCount.get(buffer[i]))
            useCount.set(buffer[i], (useCount.get(buffer[i]) !== undefined ? useCount.get(buffer[i]) : 0) + 1);
        else
            useCount.set(buffer[i], 1);
    }
    let minValue = useCount.values().next().value;
    let minUsedKey = useCount.keys().next().value;
    for (const [key, value] of useCount.entries()) {
        if (value < minValue) {
            minUsedKey = key;
            minValue = value;
        }
    }
    let random = Math.floor(Math.random() * 1000000000);
    for (let i = 0; i < 1000; i++) {
        if (!useCount.get(random))
            break;
        const newRandom = Math.floor(random * Math.random() * (1 + 10 * (i % 2)));
        if (useCount.get(newRandom) < useCount.get(random))
            random = newRandom;
    }
    if (!useCount.get(random) || useCount.get(random) < useCount.get(minUsedKey))
        return random;
    else
        return minUsedKey;
}
export function rleEncode(buffer) {
    const flag = findLeastUsedDoubleWord(buffer);
    const data = [];
    data.push(flag);
    for (let i = 0; i < buffer.length;) {
        const value = buffer[i];
        let currentCount = 1;
        while (buffer[i + currentCount] === value)
            currentCount++;
        if (currentCount > 2 || value === flag) {
            data.push(flag);
            data.push(value);
            data.push(currentCount);
            i += currentCount;
        }
        else {
            data.push(value);
            i++;
        }
    }
    return toInt32Array(data);
}
export function rleDecode(encodedBuffer) {
    const data = [];
    const flag = encodedBuffer[0];
    for (let i = 1; i < encodedBuffer.length;) {
        if (encodedBuffer[i] !== flag)
            data.push(encodedBuffer[i]);
        else {
            const value = encodedBuffer[++i];
            const count = encodedBuffer[++i];
            for (let j = 0; j < count; j++)
                data.push(value);
        }
        i++;
    }
    return toInt32Array(data);
}
export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
export function changeFavicon(src) {
    let link = document.createElement('link'), oldLink = document.getElementById('dynamic-favicon');
    link.id = 'dynamic-favicon';
    link.rel = 'shortcut icon';
    link.href = src;
    if (oldLink) {
        document.head.removeChild(oldLink);
    }
    document.head.appendChild(link);
}
;
export class ProcessPool {
    constructor(poolSize, main, library_code = [], modules = [], return_buffer_keys) {
        this.workers = [];
        this.worker_promises = [];
        this.worker_free_list = [];
        this.processes_enqueued_or_running = 0;
        this.last_enqueued_id = 0;
        this.modules = modules;
        const stringified_code = modules.map((pm) => {
            return `import {${pm.fields.join(',')}} from '${pm.path}'\n`;
        }).concat(library_code.map(foo => `const ${foo.name} = ${foo.toString()}`).concat(["\nconst main = ", main.toString(), ";\n", `self.onmessage = (event) => {const data = main(event.data.data); postMessage({process_id:event.data.process_id, data:data}${return_buffer_keys ? ", [" + return_buffer_keys.map(return_buffer_key => `data.${return_buffer_key}`).join() + "]" : ""}); }`]));
        console.log(stringified_code.join(''));
        this.code_url = window.URL.createObjectURL(new Blob(stringified_code, {
            type: "text/javascript"
        }));
        for (let i = 0; i < poolSize; i++) {
            this.worker_free_list.push(i);
            this.workers.push(this.createWorker());
        }
        this.worker_promises.length = poolSize;
    }
    createWorker() {
        const worker = new Worker(this.code_url, { type: 'module' });
        return worker;
    }
    call_parallel(data_1) {
        return __awaiter(this, arguments, void 0, function* (data, transfer = []) {
            this.processes_enqueued_or_running++;
            return yield this._call_parallel(data, transfer);
        });
    }
    _call_parallel(data_1) {
        return __awaiter(this, arguments, void 0, function* (data, transfer = []) {
            let process_id = this.worker_free_list.pop();
            while (process_id === undefined) {
                process_id = this.last_enqueued_id++;
                this.last_enqueued_id %= this.workers.length;
                yield this.worker_promises[process_id];
                const index_of_process_in_free_list = this.worker_free_list.indexOf(process_id);
                if (index_of_process_in_free_list === -1) {
                    if (this.worker_free_list.length)
                        return this.call_parallel(data);
                    process_id = undefined;
                }
                else
                    this.worker_free_list.splice(index_of_process_in_free_list, 1);
            }
            const executor = (resolve) => {
                worker.onmessage = (event) => {
                    this.worker_free_list.push(event.data.process_id);
                    this.processes_enqueued_or_running--;
                    //console.log("thread id:", event.data.process_id);
                    resolve(event.data.data);
                };
            };
            const worker = this.workers[process_id];
            //return promise that will resolve to worker result
            const promise = new Promise(executor);
            this.worker_promises[process_id] = promise;
            worker.postMessage({
                data: data,
                process_id: process_id
            }, transfer);
            return promise;
        });
    }
    batch_call_parallel(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const input_queue = new Queue();
            for (let i = 0; i < data.length; i++) {
                const rec = data[i];
                input_queue.push(this.call_parallel(rec));
            }
            const promise = new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                const final_result = [];
                while (input_queue.length) {
                    const result = yield input_queue.pop();
                    final_result.push(result);
                }
                resolve(final_result);
            }));
            return promise;
        });
    }
}
;
export class ProcessPoolUnordered {
    constructor(poolSize, main, library_code = [], modules = [], return_buffer_key) {
        this.pool = new ProcessPool(poolSize, main, library_code, modules, return_buffer_key);
        this.input_queue = new Queue();
    }
    processing() {
        return this.input_queue.length > 0;
    }
    add_job(data) {
        this.input_queue.push(data);
    }
    process_jobs(apply) {
        return __awaiter(this, void 0, void 0, function* () {
            while (this.input_queue.length) {
                let last_thread_id = this.pool.workers.findIndex((worker, index) => {
                    return this.pool.worker_free_list.indexOf(index) === -1;
                });
                while (this.pool.processes_enqueued_or_running < this.pool.workers.length && this.input_queue.length) {
                    const apply_and_exec_next = (result) => {
                        apply(result);
                        if (this.input_queue.length) {
                            this.pool.call_parallel(this.input_queue.pop()).then(apply_and_exec_next);
                        }
                    };
                    this.pool.call_parallel(this.input_queue.pop()).then(apply_and_exec_next);
                }
                if (last_thread_id != -1)
                    yield this.pool.worker_promises[last_thread_id];
            }
        });
    }
}
;
export function blendAlphaCopy(color0, color) {
    const alphant = color0.alphaNormal();
    const alphanc = color.alphaNormal();
    const a = (1 - alphanc);
    const a0 = (alphanc + alphant * a);
    const a1 = 1 / a0;
    color0.color = (((alphanc * color.red() + alphant * color0.red() * a) * a1)) |
        (((alphanc * color.green() + alphant * color0.green() * a) * a1) << 8) |
        (((alphanc * color.blue() + alphant * color0.blue() * a) * a1) << 16) |
        ((a0 * 255) << 24);
    /*this.setRed  ((alphanc*color.red() +   alphant*this.red() * a ) *a1);
    this.setBlue ((alphanc*color.blue() +  alphant*this.blue() * a) *a1);
    this.setGreen((alphanc*color.green() + alphant*this.green() * a)*a1);
    this.setAlpha(a0*255);*/
}
export class RGB {
    constructor(r = 0, g = 0, b = 0, a = 0) {
        this.color = 0;
        this.color = a << 24 | b << 16 | g << 8 | r;
    }
    blendAlphaCopy(color) {
        blendAlphaCopy(this, color);
    }
    toHSL() {
        const normRed = this.red() / 255;
        const normGreen = this.green() / 255;
        const normBlue = this.blue() / 255;
        const cMax = Math.max(normBlue, normGreen, normRed);
        const cMin = Math.min(normBlue, normGreen, normRed);
        const delta = cMax - cMin;
        let hue = 0;
        if (delta !== 0) {
            if (cMax === normRed) {
                hue = 60 * ((normGreen - normBlue) / delta % 6);
            }
            else if (cMax === normGreen) {
                hue = 60 * ((normBlue - normRed) / delta + 2);
            }
            else {
                hue = 60 * ((normRed - normGreen) / delta + 4);
            }
        }
        const lightness = (cMax + cMin) / 2;
        const saturation = delta / (1 - Math.abs(2 * lightness - 1));
        return [hue, saturation, lightness];
    }
    setByHSL(hue, saturation, lightness) {
        const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
        const x = c * (1 - Math.abs(hue / 60 % 2 - 1));
        const m = lightness - c / 2;
        if (hue < 60) {
            this.setRed((c + m) * 255);
            this.setGreen((x + m) * 255);
            this.setBlue(0);
        }
        else if (hue < 120) {
            this.setRed((x + m) * 255);
            this.setGreen((c + m) * 255);
            this.setBlue(m * 255);
        }
        else if (hue < 180) {
            this.setRed(m * 255);
            this.setGreen((c + m) * 255);
            this.setBlue((x + m) * 255);
        }
        else if (hue < 240) {
            this.setRed(0);
            this.setGreen((x + m) * 255);
            this.setBlue((c + m) * 255);
        }
        else if (hue < 300) {
            this.setRed((x + m) * 255);
            this.setGreen(m * 255);
            this.setBlue((c + m) * 255);
        }
        else {
            this.setRed((c + m) * 255);
            this.setGreen(m * 255);
            this.setBlue((x + m) * 255);
        }
        this.setAlpha(255);
    }
    compare(color) {
        return color && this.color === color.color;
    }
    copy(color) {
        this.color = color.color;
    }
    toInt() {
        return this.color;
    }
    toRGBA() {
        return [this.red(), this.green(), this.blue(), this.alpha()];
    }
    alpha() {
        return (this.color >> 24) & ((1 << 8) - 1);
    }
    blue() {
        return (this.color >> 16) & ((1 << 8) - 1);
    }
    green() {
        return (this.color >> 8) & ((1 << 8) - 1);
    }
    red() {
        return (this.color) & ((1 << 8) - 1);
    }
    alphaNormal() {
        return Math.round((((this.color >> 24) & ((1 << 8) - 1)) / 255) * 100) / 100;
    }
    setAlpha(red) {
        this.color &= (1 << 24) - 1;
        this.color |= red << 24;
    }
    setBlue(green) {
        this.color &= ((1 << 16) - 1) | (((1 << 8) - 1) << 24);
        this.color |= green << 16;
    }
    setGreen(blue) {
        this.color &= ((1 << 8) - 1) | (((1 << 16) - 1) << 16);
        this.color |= blue << 8;
    }
    setRed(alpha) {
        this.color &= (((1 << 24) - 1) << 8);
        this.color |= alpha;
    }
    loadString(color) {
        try {
            let r;
            let g;
            let b;
            let a;
            if (color.substring(0, 4).toLowerCase() !== "rgba") {
                if (color[0] !== "#")
                    throw new Error("Exception malformed color: " + color);
                r = parseInt(color.substring(1, 3), 16);
                g = parseInt(color.substring(3, 5), 16);
                b = parseInt(color.substring(5, 7), 16);
                a = parseFloat(color.substring(7, 9)) * 255;
            }
            else {
                const vals = color.split(",");
                vals[0] = vals[0].split("(")[1];
                vals[3] = vals[3].split(")")[0];
                r = parseInt(vals[0], 10);
                g = parseInt(vals[1], 10);
                b = parseInt(vals[2], 10);
                a = parseFloat(vals[3]) * 255;
            }
            let invalid = 0;
            if (!isNaN(r) && r >= 0) {
                if (r > 255) {
                    this.setRed(255);
                    invalid = 2;
                }
                else
                    this.setRed(r);
            }
            else
                invalid = +(r > 0);
            if (!isNaN(g) && g >= 0) {
                if (g > 255) {
                    this.setGreen(255);
                    invalid = 2;
                }
                else
                    this.setGreen(g);
            }
            else
                invalid = +(g > 0);
            if (!isNaN(b) && b >= 0) {
                if (b > 255) {
                    this.setBlue(255);
                    invalid = 2;
                }
                else
                    this.setBlue(b);
            }
            else
                invalid = +(b > 0);
            if (!isNaN(a) && a >= 0) {
                if (a > 255) {
                    this.setAlpha(255);
                    invalid = 2;
                }
                else
                    this.setAlpha(a);
            }
            else
                invalid = +(a > 0);
            if (color[color.length - 1] !== ")")
                invalid = 1;
            let openingPresent = false;
            for (let i = 0; !openingPresent && i < color.length; i++) {
                openingPresent = color[i] === "(";
            }
            if (!openingPresent)
                invalid = 1;
            return invalid;
        }
        catch (error) {
            console.log(error);
            return 0;
        }
    }
    htmlRBGA() {
        return `rgba(${this.red()}, ${this.green()}, ${this.blue()}, ${this.alphaNormal()})`;
    }
    htmlRBG() {
        const red = this.red() < 16 ? `0${this.red().toString(16)}` : this.red().toString(16);
        const green = this.green() < 16 ? `0${this.green().toString(16)}` : this.green().toString(16);
        const blue = this.blue() < 16 ? `0${this.blue().toString(16)}` : this.blue().toString(16);
        return `#${red}${green}${blue}`;
    }
}
;
export class Pair {
    constructor(first, second) {
        this.first = first;
        this.second = second;
    }
}
;
export class Sprite {
    constructor(pixels, width, height, fillBackground = false) {
        this.fillBackground = fillBackground;
        this.imageData = null;
        this.pixels = new Uint8ClampedArray(0);
        this.image = document.createElement("canvas");
        this.ctx = this.image.getContext("2d", { desynchronized: true });
        this.width = width;
        this.height = height;
        if (width * height > 0)
            this.copy(pixels, width, height);
    }
    copyCanvas(canvas) {
        this.width = canvas.width;
        this.height = canvas.height;
        this.image.width = this.width;
        this.image.height = this.height;
        this.ctx = this.image.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.drawImage(canvas, 0, 0);
        this.imageData = this.ctx.getImageData(0, 0, this.width, this.height);
        this.pixels = this.imageData.data;
    }
    flipHorizontally() {
        let left = new RGB(0, 0, 0, 0);
        let right = new RGB(0, 0, 0, 0);
        for (let y = 0; y < this.height; y++) {
            const yOffset = y * this.width;
            for (let x = 0; x < this.width << 1; x++) {
                left.color = this.pixels[x + yOffset];
                right.color = this.pixels[yOffset + (this.width - 1) - x];
                if (left && right) {
                    const temp = left.color;
                    left.copy(right);
                    right.color = temp;
                }
            }
        }
        this.refreshImage();
    }
    copyImage(image) {
        this.width = image.width;
        this.height = image.height;
        this.image.width = this.width;
        this.image.height = this.height;
        this.ctx = this.image.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.drawImage(image, 0, 0);
        this.imageData = this.ctx.getImageData(0, 0, this.width, this.height);
        this.pixels = this.imageData.data;
    }
    createImageData() {
        const canvas = this.image;
        if (canvas.width !== this.width || canvas.height !== this.height) {
            canvas.width = this.width;
            canvas.height = this.height;
        }
        this.ctx = canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        return this.ctx.createImageData(this.width, this.height);
    }
    copy(pixels, width, height) {
        this.width = width;
        this.height = height;
        if (width !== 0 && height !== 0) {
            if (!this.pixels || this.pixels.length !== pixels.length || this.pixels.length > 0) {
                this.imageData = this.createImageData();
                this.pixels = this.imageData.data;
            }
            const view = new Int32Array(this.pixels.buffer);
            for (let i = 0; i < pixels.length; i++) {
                view[i] = pixels[i].color;
            }
            if (pixels.length)
                this.refreshImage();
        }
    }
    putPixels(ctx) {
        if (this.imageData)
            ctx.putImageData(this.imageData, 0, 0);
    }
    fillRect(color, x, y, width, height, view = new Int32Array(this.pixels.buffer)) {
        for (let yi = y; yi < y + height; yi++) {
            const yiIndex = (yi * this.width);
            const rowLimit = x + width + yiIndex;
            for (let xi = x + yiIndex; xi < rowLimit; xi++) {
                view[xi] = color.color;
            }
        }
    }
    fillRectAlphaBlend(source, color, x, y, width, height, view = new Int32Array(this.pixels.buffer)) {
        for (let yi = y; yi < y + height; yi++) {
            for (let xi = x; xi < x + width; xi++) {
                let index = (xi) + (yi * this.width);
                source.color = view[index];
                source.blendAlphaCopy(color);
                view[index] = source.color;
            }
        }
    }
    copyToBuffer(buf, width, height, view = new Int32Array(this.pixels.buffer)) {
        if (width * height !== buf.length) {
            console.log("error invalid dimensions supplied");
            return;
        }
        for (let y = 0; y < this.height && y < height; y++) {
            for (let x = 0; x < this.width && x < width; x++) {
                const i = (x + y * width);
                const vi = x + y * this.width;
                buf[i].color = view[vi];
            }
        }
    }
    binaryFileSize() {
        return 3 + this.width * this.height;
    }
    saveToUint32Buffer(buf, index, view = new Int32Array(this.pixels.buffer)) {
        buf[index++] = this.binaryFileSize();
        buf[index++] = 3;
        buf[index] |= this.height << 16;
        buf[index++] |= this.width;
        for (let i = 0; i < view.length; i++) {
            buf[index] = view[i];
            index++;
        }
        return index;
    }
    refreshImage() {
        const canvas = this.image;
        if (canvas.width !== this.width || canvas.height !== this.height) {
            canvas.width = this.width;
            canvas.height = this.height;
            this.ctx = canvas.getContext("2d");
        }
        this.putPixels(this.ctx);
    }
    copySprite(sprite) {
        this.width = sprite.width;
        this.height = sprite.height;
        this.imageData = this.createImageData();
        this.pixels = this.imageData.data;
        for (let i = 0; i < this.pixels.length;) {
            this.pixels[i] = sprite.pixels[i++];
            this.pixels[i] = sprite.pixels[i++];
            this.pixels[i] = sprite.pixels[i++];
            this.pixels[i] = sprite.pixels[i++];
        }
    }
    copySpriteBlendAlpha(sprite) {
        if (this.pixels.length !== sprite.pixels.length) {
            this.imageData = this.createImageData();
            this.pixels = this.imageData.data;
        }
        this.width = sprite.width;
        this.height = sprite.height;
        const o = new RGB(0, 0, 0, 0);
        const t = new RGB(0, 0, 0, 0);
        for (let i = 0; i < this.pixels.length; i += 4) {
            o.setRed(sprite.pixels[i]);
            o.setGreen(sprite.pixels[i + 1]);
            o.setBlue(sprite.pixels[i + 2]);
            o.setAlpha(sprite.pixels[i + 3]);
            t.setRed(this.pixels[i]);
            t.setGreen(this.pixels[i + 1]);
            t.setBlue(this.pixels[i + 2]);
            t.setAlpha(this.pixels[i + 3]);
            t.blendAlphaCopy(o);
            this.pixels[i] = t.red();
            this.pixels[i + 1] = t.green();
            this.pixels[i + 2] = t.blue();
            this.pixels[i + 3] = t.alpha();
        }
    }
    draw(ctx, x, y, width, height) {
        if (this.pixels) {
            if (this.fillBackground) {
                ctx.clearRect(x, y, width, height);
            }
            ctx.drawImage(this.image, x, y, width, height);
        }
    }
}
;
