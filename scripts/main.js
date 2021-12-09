/*var width = 400, height = 400;

var data = [10, 15, 20, 25, 30];
var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var xscale = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .range([0, width - 100]);

var yscale = d3.scaleLinear()
        .domain([0, d3.max(data)])
        .range([width - 100 , 0]);

var x_axis = d3.axisBottom()
        .scale(xscale);

var y_axis = d3.axisLeft()
        .scale(yscale);

    svg.append("g")
       .attr("transform", "translate(50, 10)")
       .call(y_axis);

var xAxisTranslate = height/2 + 110;

svg.append("g")
    .attr("transform", "translate(50, " + xAxisTranslate  +")")
    .call(x_axis)

// X-Axis Label
svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width/2 + 20)
    .attr("y", height - 45)
    .text("Year");

// Y-Axis Label
svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 0)
    .attr("x", - 85)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Number of Injuries");*/


// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 45, left: 65};
var width = 860 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv('data/injury_table.csv',

    // Need to sum incidents for year / for year + month
    function(d){
        return { date : d3.timeParse("%Y-%m")(d.incidentYear + '-' + d.incidentMonth), value : d.incidentMonth }
    },

    // Now I can use this dataset:
    function(data) {

        console.log(data);
        var dataArr = Object.keys(data);
        console.log(dataArr);
        var categories = d3.group(data, d => d['PRODUCT 1']);
        console.log(categories);
        // List of groups (here I have one group per column)
        var allGroup = d3.map(data, function(d){return(d.name)}).keys()

        // add the options to the button
        d3.select("#selectButton")
        .selectAll('myOptions')
            .data(allGroup)
        .enter()
            .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; }) // corresponding value returned by the button

        // Add X axis --> it is a date format
        var x = d3.scaleTime()
            .domain(d3.extent(data, function(d) { return d.date; }))
            .range([ 0, width ]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));


        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) { return +d.value; })])
            .range([ height, 0 ]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Add the circle data points (order matters w line)
        svg.selectAll("myCircles")
            .data(data)
            .enter()
            .append("circle")
            .attr("fill", "red")
            .attr("stroke", "none")
            .attr("cx", function(d) { return x(d.date) })
            .attr("cy", function(d) { return y(d.value) })
            .attr("r", 2.5)

        // Add the line
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function(d) { return x(d.date) })
                .y(function(d) { return y(d.value) })
            )
        
        
    })

// X-Axis Label
svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width/2 + 20)
    .attr("y", height + 45)
    .text("Year");

// Y-Axis Label
svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", -65)
    .attr("x", - 90)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Number of Injuries");