// constant dimensions of visualization 1
const margin = {top: 10, right: 30, bottom: 45, left: 65};
const width = 860 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Add SVG 
var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Read the CSV data table
const injuryData = d3.csv('data/injury_table.csv', function(d) {
    return {
        date : d3.timeParse("%Y-%m")(d.incidentYear + '-' + d.incidentMonth),
        year: d.incidentYear,
        value : d.incidentMonth,
        category: d.product1
    }
}).then(createChart1);

// Creates Chart 1
function createChart1(injuryData) {

    // Create a map where the key is the injury category and the
    // value is the count of injuries in that category
    var filteredData1 = injuryData.filter(function(d) { return d.category !== ''; });
    var filteredData = filteredData1.filter(function(d) { return d.year >= 2010; });

    var categoryGroup = d3.group(filteredData, d => d.category);
    console.log(categoryGroup);

    var categoryMap = d3.map(categoryGroup, function(key) {
        return {key: key[0], value: key[1].length, dates: key[1]} 
    })

    //sorted by num injuries       
    categoryMap.sort(function(a, b){
        return d3.descending(a.value, b.value);
    })

    // sorted alphabetically
    var categoryMapAlphabetical = categoryMap;
    categoryMapAlphabetical.sort(function(a, b){
        return d3.ascending(a.key, b.key);
    })

    topTenData = categoryMap.slice(0, 10);
    topOneData = topTenData.slice(0, 1);
    
    // Add category selector on chart 1
    d3.select("#selectButton")
    .selectAll('myOptions')
        .data(categoryMapAlphabetical)
    .enter()
        .append('option')
    .text(function(d) { 
        if (d.key != null) {
            // remove the code included in date i.e. '(1409)'
            return d.key.replace(/ *\([^d)]*\) */g, "");
        }
    }) // text shown in drop down
    .attr("value", function(d) { return d.key.replace(/ *\([^d)]*\) */g, ""); })

    // Selector must display current category with values on axis (updates)


    // X axis
    var xAxis = d3.scaleTime()
        .domain(d3.extent(filteredData, function(d) { return d.date; }))
        .range( [0, width] );
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xAxis));

    // Y axis
    var yAxis = d3.scaleLinear()
        .domain([0, d3.max(categoryMapAlphabetical, function(d) { 
            return +d.value; 
        })])
        .range( [height, 0] );
    svg.append("g")
        .call(d3.axisLeft(yAxis));    
    
    console.log(categoryMapAlphabetical);
    // Add the circle data points (order matters w line)
    svg.selectAll("myCircles")
        .data(categoryMapAlphabetical)
        .enter()
        .append("circle")
        .attr("fill", "red")
        .attr("stroke", "none")
        .attr("cx", function(d) { 
            for (let i = 0; i < +d.value; i++) {
                return xAxis(d.dates[i].date); // check this maybe 
            }
            //console.log(d.dates[0].date); 
        })
        .attr("cy", function(d) { return yAxis(+d.value); })
        .attr("r", 2.5)

    // Add the line 
    svg.append("path")
        .datum(categoryMapAlphabetical)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) {
                for (let i = 0; i < +d.value; i++) {
                    return xAxis(+d.dates[i].date); 
                }
            })
            .y(function(d) { return yAxis(+d.value); })
        )
}

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