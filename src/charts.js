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
            "color": "#00FF00",
            "data": "6906"
        }, {
            "label": "Total INC Count per Class",
            "color": "#FF0000",
            "data": "106"
        }]
    }, {
        "label": "SPE 100",
        "data": [{
            "label": "Total Count of the Class",
            "color": "#00FF00",
            "data": "7427"
        }, {
            "label": "Total INC Count per Class",
            "color": "#FF0000",
            "data": "88"
        }]
    }, {
        "label": "CIS 100",
        "data": [{
            "label": "Total Count of the Class",
            "color": "#00FF00",
            "data": "1241"
        }, {
            "label": "Total INC Count per Class",
            "color": "#FF0000",
            "data": "76"
        }]
    }, {
        "label": "ACC 122",
        "data": [{
            "label": "Total Count of the Class",
            "color": "#00FF00",
            "data": "1665"
        }, {
            "label": "Total INC Count per Class",
            "color": "#FF0000",
            "data": "45"
        }]
    }, {
        "label": "ENG 101",
        "data": [{
            "label": "Total Count of the Class",
            "color": "#00FF00",
            "data": "7619"
        }, {
            "label": "Total INC Count per Class",
            "color": "#FF0000",
            "data": "36"
        }]
    }, {
        "label": "CRT 100",
        "data": [{
            "label": "Total Count of the Class",
            "color": "#00FF00",
            "data": "1379"
        }, {
            "label": "Total INC Count per Class",
            "color": "#FF0000",
            "data": "33"
        }]
    }, {
        "label": "BUS 104",
        "data": [{
            "label": "Total Count of the Class",
            "color": "#00FF00",
            "data": "2183"
        }, {
            "label": "Total INC Count per Class",
            "color": "#FF0000",
            "data": "28"
        }]
    }, {
        "label": "SOC 100",
        "data": [{
            "label": "Total Count of the Class",
            "color": "#00FF00",
            "data": "3020"
        }, {
            "label": "Total INC Count per Class",
            "color": "#FF0000",
            "data": "27"
        }]
    }, {
        "label": "MAT 206.5",
        "data": [{
            "label": "Total Count of the Class",
            "color": "#00FF00",
            "data": "2276"
        }, {
            "label": "Total INC Count per Class",
            "color": "#FF0000",
            "data": "27"
        }]
    }, {
        "label": "MAT 150",
        "data": [{
            "label": "Total Count of the Class",
            "color": "#00FF00",
            "data": "3506"
        }, {
            "label": "Total INC Count per Class",
            "color": "#FF0000",
            "data": "25"
        }]
    }]`);
    make_histogram(div, 100, 500, histogram_data);
}
main();
