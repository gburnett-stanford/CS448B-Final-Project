// constant dimensions of visualization 1
const margin = {top: 10, right: 30, bottom: 45, left: 65};
const width = 1060 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Add SVG 
var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Read the CSV data table and extract injury data
d3.csv('data/injury_table.csv', d3.autoType).then(createChart1)

// Creates Chart 1
function createChart1(data) {

    function createCategoryDropdown(data){

        // Create a map where the key is the injury category and the
        // value is the count of injuries in that category
        var filteredData = data.filter(function(d) { return d.category !== '' && d.incidentYear >= 2015; });
        var categoryGroup = d3.group(filteredData, d => d.category, d => d.year);

        var categoryMap = d3.map(categoryGroup, function(key) {
            return {key: key[0], years: key[1]} 
        })

        // sorted by num injuries       
        categoryMap.sort(function(a, b){
            return d3.descending(a.value, b.value);
        })

        // sorted alphabetically
        var categoryMapAlphabetical = categoryMap;
        categoryMapAlphabetical.sort(function(a, b){
            return d3.ascending(a.key, b.key);
        })

        // Create the product category selector 
        d3.select("#selectButton")
            .attr('id', 'categoryDropdown')
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
            .attr("value", d => d.key)
        
        // Define behavior for the output from Category Dropdown 
        d3.select('#categoryDropdown').on('change',function(d){
            var selectedCategory = d3.select(this).property('value');
            d3.select('#productCategory').text(selectedCategory.replace(/ *\([^d)]*\) */g, "")); 
            updateGraph(selectedCategory);
        })
    }

    createCategoryDropdown(data); 
    
    // update the graph based on the selection 
    function updateGraph(category) {

        filteredData = data.filter(d => d['category'] == category);

        dummyData = d3.group(filteredData, d => d['VICTIM 1 AGE YEARS']);
        
        dummyData = d3.map(dummyData, function(key, value) { return {key: key[0], value: key[1].length} })   
        dummyData = dummyData.filter(d => d.key != null);

        dummyData.sort(function(a, b){
            return d3.descending(a.value, b.value);
        })

        topOneAge = dummyData.slice(0, 1);
        d3.select('#topOneAge').text(topOneAge[0].key);   

        console.log(dummyData) 

    }

}

//     // X axis
//     var xAxis = d3.scaleTime()
//         .domain(d3.extent(filteredData, d => d.year))
//         .range( [0, width] );

//     svg.append("g")
//         .attr("transform", "translate(0," + height + ")")
//         .call(d3.axisBottom(xAxis));

//     /* NEED TO NARROW DOWN BY CATEGORY FIRST, GET SELECTEDCAT DOWN IN DATA) */
//     // Y axis
//     var yAxis = d3.scaleLinear()
//         .domain([0, d3.max(categoryMapAlphabetical, function(d) { 
//             let yearIn = d3.timeParse("%Y")(2018);
//             // console.log(d.years);
    
//             d.years.forEach(function(data) {
//                 //console.log(data);
//                 return data.length;
//             })
//         })])
//         .range( [height, 0] );
//     svg.append("g")
//         .call(d3.axisLeft(yAxis));    

//     // structure
//     // category -> each occurrence on date graphed
    
//     // Add the circle data points (order matters w line)
//     var curCategoryDates = categoryMapAlphabetical[0].dates;
//     // console.log('Cur:', curCategoryDates);

//     svg.selectAll("myCircles")
//         .data(categoryMapAlphabetical)
//         .enter()
//         .append("circle")
//         .attr("fill", "red")
//         .attr("stroke", "none")
//         .attr("cx", function(d) { 
//             for (let i = 0; i < +d.value; i++) {
//                 return xAxis(+d.dates[i].year); // check this maybe 
//             }
//             //console.log(d.dates[0].date); // need to sum incidents per year not total, that would be for one year
//         })
//         .attr("cy", d => yAxis(+d.value))
//         .attr("r", 2.5)

//     // Add the line 
//     svg.append("path")
//         .datum(categoryMapAlphabetical)
//         .attr("fill", "none")
//         .attr("stroke", "steelblue")
//         .attr("stroke-width", 1.5)
//         .attr("d", d3.line()
//             .x(function(d) {
//                 for (let i = 0; i < +d.value; i++) {
//                     return xAxis(+d.dates[i].year); 
//                 }
//             })
//             .y(function(d) { return yAxis(+d.value); })
//         )
// }



// // X-Axis Label
// svg.append("text")
//     .attr("class", "x label")
//     .attr("text-anchor", "end")
//     .attr("x", width/2 + 20)
//     .attr("y", height + 45)
//     .text("Year");

// // Y-Axis Label
// svg.append("text")
//     .attr("class", "y label")
//     .attr("text-anchor", "end")
//     .attr("y", -65)
//     .attr("x", - 140)
//     .attr("dy", ".75em")
//     .attr("transform", "rotate(-90)")
//     .text("Number of Injuries");