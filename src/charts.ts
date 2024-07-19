import { make_donut } from "./donut.js";
import { make_histogram, render_histogram, GroupedRecord } from "./histogram.js";
//sample main rendering a donut chart to an html canvas with an id screen
async function main()
{
    let maybe_div:HTMLDivElement | null = document.getElementById('chart') as HTMLDivElement | null;
    if(!maybe_div)
    {
        console.log("error could not find div to render to!!!");
        return;
    }
    const div:HTMLDivElement = maybe_div;
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
    const histogram_data: GroupedRecord[] = [
        {
            label: "CSC101",
            data: [
                { label: "Total Class", color: "#FF0000", data: 10 },
                { label: "Percent Incomplete", color: "#FFFF00", data: 10 },
                { label: "Passed", color: "#00FF00", data: 20 }
            ]
        },
        {
            label: "CSC102",
            data: [
                { label: "Total Class", color: "#FF0000", data: 25 },
            ]
        },
        {
            label: "CSC103",
            data: [
                { label: "Total Class", color: "#FF0000", data: 40 },
                { label: "Percent Incomplete", color: "#FFFF00", data: 15 },
                { label: "Passed", color: "#00FF00", data: 25 }
            ]
        }
    ];
    make_histogram(div, 500, 500, histogram_data);
}
main();