// constant dimensions of visualization 1
const margin = {top: 10, right: 30, bottom: 45, left: 65};
const width = 1060 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Add SVG 
var highchair = d3.select("#highchair")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// High Chair Image
var imgs = highchair.selectAll("image").data([0]);
    imgs.enter()
    .append("svg:image")
    .attr("xlink:href", "images/high-chair.jpeg")
    .attr("x", "100")
    .attr("y", "60")

// Tooltip
var tooltip = d3.select("body")
    .append("div")
    .attr("id", 'tooltip')
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .text("a simple tooltip");

// Read the CSV data table and extract circles data
d3.csv('data/circles_table.csv', d3.autoType).then(createCircles)

function createCircles(data) {

    var circles = highchair.selectAll("circle")
        .data(data)
    .enter().append("svg:circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 10)
        .on("mouseover", function(d) {
            tooltip.text(d3.select(this).data()[0].location);
            return tooltip.style("visibility", "visible");
        })
        .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
        .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
}

// *******************************************
// ****** AGE HISTOGRAM
// *******************************************

// Add SVG 
var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style('background-color', 'whitesmoke')  
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
            // .attr("value", function(d) { return d.key.replace(/ *\([^d)]*\) */g, ""); })
        
        // Define behavior for the output from Category Dropdown 
        d3.select('#categoryDropdown').on('change',function(d){
            var selectedCategory = d3.select(this).property('value');
            d3.select('#productCategory').text(selectedCategory); 
            updateGraph(selectedCategory);
        })
    }

    createCategoryDropdown(data); 
    
    // update the graph based on the selection 
    function updateGraph(category) {

        // filter the data 
        filteredData = data.filter(d => d['category'] == category);
        dummyData = d3.group(filteredData, d => d['VICTIM 1 AGE YEARS']);
        dummyData = d3.map(dummyData, function(key, value) { return {key: key[0], value: key[1].length} })   
        dummyData = dummyData.filter(d => d.key != null);

        // report most affected age 
        mostToLeastAffected = dummyData.sort(function(a, b){
            return d3.descending(a.value, b.value);
        })
        topOneAge = mostToLeastAffected.slice(0, 1);
        d3.select('#topOneAge').text(topOneAge[0].key); 
        
        // sort in ascending age, for plotting 
        dummyData = dummyData.sort(function(a, b){
            return d3.ascending(a.key, b.key);
        })

        console.log(dummyData) 

        // define the y scale here
        const yscale = d3.scaleLinear() 
            .domain([0, d3.max(dummyData, d => d.value)+1]) 
            .range([0, height]) 

        // define the y scale here
        const yaxis_scale = d3.scaleLinear() 
            .domain([0, d3.max(dummyData, d => d.value)+1]) 
            .range([height, 0]) 

        // define the x scale here
        const xscale = d3.scaleBand()
            .domain(d3.range(0, d3.max(dummyData, d => d.key)+1))
            .range([0, width]);

        // define the color scale 
        color = d3.scaleOrdinal(d3.schemePastel1).domain(d3.range(d => d.length));

        function clearAxes(plotContainer){
            plotContainer.select('#x_axis').remove();
            plotContainer.select('#x_axis_label').remove();
            plotContainer.select('#y_axis').remove();
            plotContainer.select('#y_axis_label').remove();
        }

        // create the axes 
        function drawAxes(plotContainer) {

            // first clear anything on the axes
            clearAxes(plotContainer); 

            const xAxis = plotContainer.append('g')                      
                .attr('transform', `translate(0,${height})`)   
                .attr('id', 'x_axis')
                .call(d3.axisBottom(xscale));                               

            const yAxis = plotContainer.append('g')    
                .attr('id', 'y_axis')               
                .call(d3.axisLeft(yaxis_scale));                               

            const xAxisLabel = plotContainer.append("text")
                .attr('id', 'x_axis_label')
                .attr("transform", `translate(${width/2}, ${height + 35})`)
                .style("text-anchor", "middle")
                .text("Age");

            const yAxisLabel = plotContainer.append("text")
                .attr('id', 'y_axis_label')
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x", 0 - (height/2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Number of Injuries"); 
        }

        // draw the graph axes 
        drawAxes(svg);

        // draw the bars for the bar graph 
        svg.selectAll('rect')
            .data(dummyData)
            .join('rect')
                .attr('x', d => xscale(d.key))
                .attr('y', d => height-yscale(d.value))       
                .attr('width', xscale.bandwidth())
                .attr('height', d => yscale(d.value))  
                .style('fill', function(d, i){return color(i)})
    }
}