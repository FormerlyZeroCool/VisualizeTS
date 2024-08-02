import { make_histogram } from "./histogram.js";
//sample main rendering a donut chart to an html canvas with an id screen
async function main() {
    let maybe_div = document.getElementById('chart');
    if (!maybe_div) {
        console.log("error could not find div to render to!!!");
        return;
    }
    const div = maybe_div;
    let donut_data = [
        {
            "label": "Incomplete",
            "color": "#FF0000",
            "data": [7, 11, 25]
        },
        {
            "label": "Submitted",
            "color": "#00FF00",
            "data": [3, 9, 6]
        },
        {
            "label": "Graded",
            "color": "#0000FF",
            "data": [12, 15, 21]
        }
    ];
    //make_donut(div, 500, 500, donut_data);
    const histogram_data = JSON.parse(`[{
        "label": "ENG 201",
        "data": [{
            "label": "Total Count of the Class",
            "color": "rgba(0,0,0,0.25)",
            "data": 49
        }, {
            "label": "Total INC Count per Class",
            "color": "#FF0000",
            "data": 106
        }]
    }, {
        "label": "SPE 100",
        "data": [{
            "label": "Total Count of the Class",
            "color": "#00FF00",
            "data": 74
        }, {
            "label": "Total INC Count per Class",
            "color": "#FF0000",
            "data": 88
        }]
    }, {
        "label": "CIS 100",
        "data": [{
            "label": "Total Count of the Class",
            "color": "#00FF00",
            "data": 41
        }, {
            "label": "Total INC Count per Class",
            "color": "#FF0000",
            "data": 76
        }]
    }, {
        "label": "ACC 122",
        "data": [{
            "label": "Total Count of the Class",
            "color": "#00FF00",
            "data": 65
        }, {
            "label": "Total INC Count per Class",
            "color": "#FF0000",
            "data": 45
        }]
    }, {
        "label": "ENG 101",
        "data": [{
            "label": "Total Count of the Class",
            "color": "#00FF00",
            "data": 76
        }, {
            "label": "Total INC Count per Class",
            "color": "#FF0000",
            "data": 36
        }]
    }, {
        "label": "CRT 100",
        "data": [{
            "label": "Total Count of the Class",
            "color": "#00FF00",
            "data": 13
        }, {
            "label": "Total INC Count per Class",
            "color": "#FF0000",
            "data": 33
        }]
    }, {
        "label": "BUS 104",
        "data": [{
            "label": "Total Count of the Class",
            "color": "#00FF00",
            "data": 21
        }, {
            "label": "Total INC Count per Class",
            "color": "#FF0000",
            "data": 28
        }]
    }, {
        "label": "SOC 100",
        "data": [{
            "label": "Total Count of the Class",
            "color": "#00FF00",
            "data": 32
        }, {
            "label": "Total INC Count per Class",
            "color": "#FF0000",
            "data": 27
        }]
    }, {
        "label": "MAT 206.5",
        "data": [{
            "label": "Total Count of the Class",
            "color": "#00FF00",
            "data": 22
        }, {
            "label": "Total INC Count per Class",
            "color": "#FF0000",
            "data": 27
        }]
    }, {
        "label": "MAT 150",
        "data": [{
            "label": "Total Count of the Class",
            "color": "#00FF00",
            "data": 35
        }, {
            "label": "Total INC Count per Class",
            "color": "#FF0000",
            "data": 25
        }]
    }]`);
    for (let i = 0; i < 10; i++)
        histogram_data.push(histogram_data[i]);
    histogram_data.splice(2, 19);
    const histogram_data1 = [{ "label": "", "data": [{ "label": "Correct answers over time", "color": "#000080", "data": 100 }] }, { "label": "", "data": [{ "label": "Correct answers over time", "color": "#000080", "data": 100 }] }, { "label": "", "data": [{ "label": "Correct answers over time", "color": "#000080", "data": 100 }] }, { "label": "", "data": [{ "label": "Correct answers over time", "color": "#000080", "data": 100 }] }, { "label": "", "data": [{ "label": "Correct answers over time", "color": "#000080", "data": 100 }] }, { "label": "", "data": [{ "label": "Correct answers over time", "color": "#000080", "data": 100 }] }, { "label": "", "data": [{ "label": "Correct answers over time", "color": "#000080", "data": 100 }] }, { "label": "", "data": [{ "label": "Correct answers over time", "color": "#000080", "data": 100 }] }];
    make_histogram(div, window.innerWidth, window.innerHeight * 0.95, histogram_data, true, { y_precision: -1, y_intervals: 11, fontSize: -1 }, { y_min: 0, y_max: 110 });
}
main();
