# donut.js

## Summary
This script provides functionality to create and render a donut chart on an HTML div element. It includes functions to normalize data, set up text styles, render the donut chart, and integrate the chart into a provided container with a key displaying the data labels and colors.

## Usage / Data Expected
To use this script, call the `make_donut` function with a container element, the desired width and height of the chart, and the data to be displayed.

Example of expected data format:
```json
[
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
]
```

## User Access Role Stipulations
There are no specific user access role stipulations for this script. It can be used by any user with access to the HTML container element where the chart is to be rendered.

## Functionality

1. **Data Retrieval/Displayed:**
    - The data for the donut chart should be provided as an array of objects, where each object represents a category with a label, color, and an array of data points.

2. **Display:**
    - The `make_donut` function is responsible for creating and displaying the canvas and key elements within a specified container.
    - The `render_donut` function uses the canvas context to draw the donut chart based on the normalized data.
    - The `setup_text` function sets up text styling for the canvas context.
    - The `normalize_records` function aggregates and normalizes the data to prepare it for rendering.

## File Structure and Dependencies
- **normalize_records(records):** Normalizes the data by aggregating the total and dividing each category's total by the aggregate sum.
- **setup_text(ctx, width, height):** Configures the text styling for the canvas context.
- **render_donut(canvas, data):** Renders the donut chart on the provided canvas element using the normalized data.
- **make_donut(container, width, height, data):** Creates the canvas and key elements, integrates them into the provided container, and calls `render_donut` to draw the chart.
- **main():** (Sample usage) Entry point of the script, sets up the data, retrieves the target HTML element, and calls `make_donut` to render the chart.

Dependencies:
- HTML document with a container element having the ID `chart`.
- A modern browser that supports HTML5 Canvas and JavaScript ES6.

### Sample Usage
The following sample code demonstrates how to use the script to render a donut chart:
```javascript
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let maybe_div = document.getElementById('chart');
        if (!maybe_div) {
            console.log("error could not find div to render to!!!");
            return;
        }
        const div = maybe_div;
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
        make_donut(div, 500, 500, data);
    });
}
main();
```