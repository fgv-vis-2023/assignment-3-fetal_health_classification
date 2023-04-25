function main() {
    // Import csv data
    var fetal_health = d3.csv("../dataset/fetal_health.csv", d3.autoType);

    // Array with the name of the columns from the csv file
    var columns = ["baseline value", "accelerations",
    "fetal_movement", "uterine_contractions",
    "light_decelerations", "severe_decelerations",
    "prolongued_decelerations",
    "abnormal_short_term_variability",
    "mean_value_of_short_term_variability",
    "percentage_of_time_with_abnormal_long_term_variability",
    "mean_value_of_long_term_variability", "histogram_width",
    "histogram_min", "histogram_max",
    "histogram_number_of_peaks", "histogram_number_of_zeroes",
    "histogram_mode", "histogram_mean", "histogram_median",
    "histogram_variance", "histogram_tendency", "fetal_health"];

    // add the options to the button
    d3.select("#x-select")
      .selectAll('myOptions')
     	.data(columns)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button

    // add the options to the button
    d3.select("#y-select")
      .selectAll('myOptions')
     	.data(columns)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button

    const margin = { top: 20, right: 20, bottom: 60, left: 60 };
    const width = 400 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create the SVG element
    const svg = d3.select('#chart')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

    /// Load the data from the CSV file
    fetal_health.then(data => {

    // Scale the data to fit within the plot
    const xScale = d3.scaleLinear()
      .domain([d3.min(data, d => +d.baseline_value), d3.max(data, d => +d.baseline_value)])
      .range([0, width]);
  
    const yScale = d3.scaleLinear()
      .domain([d3.min(data, d => +d.baseline_value), d3.max(data, d => +d.baseline_value)])
      .range([height, 0]);
  
    // Create the x-axis and y-axis
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
  
    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);
  
    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);
  
    // Create a barchart with the sum of the count of each category
    const circles = svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', function (d) { return xScale(d.baseline_value)})
        .attr('cy', function (d) { return yScale(d.baseline_value)})
        .attr('r', 2)
        .attr('fill', 'steelblue')
        // Change color between categories in fetal_health
        .attr('fill', function(d) {
            if (d.fetal_health == 1) {
                return 'red';
            } else if (d.fetal_health == 2) {
                return 'green';
            } else {
                return 'blue';
            }
        });
    
    // Update the plot
    function updatePlotX() {
        // Get the selected x variable from the dropdown
        xVar = d3.select("#x-select").property("value");
        
        // Update the x scale domain
        xScale.domain([d3.min(data, d => +d[xVar]), d3.max(data, d => +d[xVar])]).range([0, width]);
    
        // Update the x axis
        svg.select(".x.axis")
        .transition()
        .duration(1000)
        .call(xAxis);
    
        // Update the circles with the new x values
        circles.transition()
        .duration(1000)
        .attr('cx', function (d) { return xScale(d[xVar])});
    
    }
    
    // Listen for changes in the dropdown
    d3.select("#x-select").on("change", updatePlotX);

    // Update the plot y
    function updatePlotY() {
        // Get the selected y variable from the dropdown
        yVar = d3.select("#y-select").property("value");
    
        // Update the y scale domain
        yScale.domain([d3.min(data, d => +d[yVar]), d3.max(data, d => +d[yVar])]).range([height, 0]);
    
        // Update the y axis
        svg.select(".y.axis")
        .transition()
        .duration(1000)
        .call(yAxis);
    
        // Update the circles with the new y values
        circles.transition()
        .duration(1000)
        .attr('cy', function (d) { return yScale(d[yVar])});
    
    }
    
    // Listen for changes in the dropdown
    d3.select("#y-select").on("change", updatePlotY);
    
    });
}