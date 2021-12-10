// *******************************************
// ****** HIGH CHAIR
// *******************************************

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
d3.csv('data/circles_table.csv', d3.autoType).then(createCircles);

function createCircles(data) {

    var circles = highchair.selectAll("circle")
        .data(data)
    .enter().append("svg:circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 10)
        .on("mouseover", function(d) {
            var curRow = d3.select(this).data()[0].id;
            d3.select(curRow).style("background-color", "#228B22"); //math id here add new data id-name
            d3.select(curRow).style("font-weight", "bold");
            tooltip.text(d3.select(this).data()[0].location);
            return tooltip.style("visibility", "visible");
        })
        .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
        .on("mouseout", function(d) {
            var curRow = d3.select(this).data()[0].id;
            console.log(curRow);
            var backgroundColor = "#ffffff";
            if (curRow === "#row-frame" || curRow === "#row-restraint" || curRow === "#row-tray") {
                backgroundColor = "#dddddd";
            } 
            d3.select(curRow).style("background-color", backgroundColor);
            d3.select(curRow).style("font-weight", "500");
            return tooltip.style("visibility", "hidden");
        });
}

// table sorting


// *******************************************
// ****** AGE HISTOGRAM *********************
// *******************************************

var newLeftMargin = margin.left + 30;
var newTopMargin = margin.top + 25;

// Add SVG 
var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("id", 'age-histogram')
    .attr("width", width + margin.left + margin.right + 200)
    .attr("height", height + margin.top + margin.bottom + 50)
    .style('background-color', 'whitesmoke')  
    .append("g")
        .attr("transform", "translate(" + newLeftMargin + "," + newTopMargin+ ")");

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
            d3.select('#productCategory').text(selectedCategory.replace(/ *\([^d)]*\) */g, "")); 
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
            .range([0, width + 200]);

        // define the color scale 
        color = d3.scaleOrdinal(d3.schemePaired).domain(d3.range(d => d.length));

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
                .attr("transform", `translate(${(width + 200)/2}, ${height + 35 + 25/2})`)
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

// ***************************************
// ******** TOP TEN **********************
// ***************************************

// some constants for the page 
var userInputWidth = 1000; 
var userInputHeight = 140;  
var userInputPadding = 20;  

var selected_age = undefined;
// Create the Gender Selector 
d3.csv('data/gender_selector.csv', function(d) {
    return {gender: d.gender}
    }).then(updateGenderSelector)

function updateGenderSelector(data){

    // Populate the Gender Selector with the data 
    d3.select('#genderDropdown')
        .selectAll('myOptions')
        .data(data)
        .enter()
        .append('option')
        .text(d => d.gender)
        .attr('value', d => d.gender)

    // Define behavior for the output from Gender Selector 
    d3.select('#genderDropdown').on('change',function(d){
        var selected = d3.select(this).property('value');
        d3.select('#selectedGender').text(selected);
    })
}

// Create the age selector 
d3.csv('data/age_selector.csv', function(d) {
    return {age: d.age}
}).then(createAgeSelector);

function createAgeSelector(age_data){

    // Populate the Age Selector with the data 
    d3.select('#ageDropdown')
        .selectAll('myOptions')
        .data(age_data)
        .enter()
        .append('option')
        .text(d => d.age)
        .attr('value', d => d.age)

    // Define behavior for the output from Age Selector 
    d3.select('#ageDropdown').on('change',function(d){
        selected_age = d3.select(this).property('value');
        d3.selectAll('.selectedAge').text(selected_age);
    })
}

// Draw the Top 10 Bar Graph 
var topTenWidth = 1000; 
var topTenHeight = 300; 
var topTenBarHeight = topTenHeight / 10; 
var plotMargin = 50; 

// Create a container for the graph 
function createTopTenContainer() {

    const outerWidth = topTenWidth + plotMargin*2;      
    const outerHeight = topTenHeight + plotMargin*2;    
    
    var topTenContainer = d3.select('#topTenContainer')
        .append('svg')
        .attr('width', outerWidth)
        .attr('height', outerHeight)
        .style('background-color', 'whitesmoke')  
    
    topTenContainer.append('g')
        // Translate g element by plotMargin, plotMargin to place inner plotting region.
        .attr('transform', `translate(${plotMargin},${plotMargin})`) 
        .attr('id', 'topTenPlot');   //Give the plot container an id so we can access it later.
    
    return topTenContainer;
}

var topTenContainer = createTopTenContainer();
var topTenPlot = topTenContainer.select('#topTenPlot');

// Create the graph 
d3.csv('data/injury_table.csv', d3.autoType).then(createTopTenGraph)

function createTopTenGraph(data){

    // Create the State Selector 
    d3.csv('data/state_selector.csv', function(d) {
        return {state: d.state}
        }).then(updateStateSelector)

    function updateStateSelector(data){

        // Populate the State Selector with the data 
        d3.select('#stateDropdown')
            .selectAll('myOptions')
            .data(data)
            .enter()
            .append('option')
            .text(d => d.state)
            .attr('value', d => d.state)

        // Define behavior for the output from State Selector 
        d3.select('#stateDropdown').on('change',function(d){
            var selected = d3.select(this).property('value');
            d3.select('#selectedState').text(selected);
            updateGraph(selected_age)
        })
    }

    function updateGraph(age){

        filteredData = data.filter(d => d['VICTIM 1 AGE YEARS'] === Number(age));

        // sanity check using these intermediate values 
        dummyData = d3.group(filteredData, d => d['category']);
        dummyData = d3.map(dummyData, function(key, value) { return {key: key[0], value: key[1].length} })        
        dummyData.sort(function(a, b){
            return d3.descending(a.value, b.value);
        })
        topTenData = dummyData.slice(0, 10);
        topOneData = topTenData.slice(0, 1);

        d3.selectAll('.topOneProduct').text(topOneData[0].key.replace(/ *\([^d)]*\) */g, ""));
       
        // define the x scale here
        const xscale = d3.scaleLinear() // a function that converts values in data to pixels on the screen 
            .domain([0, d3.max(topTenData, d => d.value)]) // [0, maximum value in data]
            .range([0, topTenWidth/2]) // [0, maximum value on screen] 

        // define the x-axis scale here
        const xaxis_scale = d3.scaleLinear() // a function that converts values in data to pixels on the screen 
        .domain([0, d3.max(topTenData, d => d.value)*2]) // [0, maximum value in data]
        .range([0, topTenWidth]) // [0, maximum value on screen] 

        // define the y scale here
        const yscale = d3.scaleBand()
            .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
            .range([0, topTenHeight]);

        // define the color scale 
        color = d3.scaleOrdinal(d3.schemePaired).domain([0, 10]);

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
                .attr('transform', `translate(0,${topTenHeight})`)   
                .attr('id', 'x_axis')
                .call(d3.axisBottom(xaxis_scale));                               

            const yAxis = plotContainer.append('g')    
                .attr('id', 'y_axis')               
                .call(d3.axisLeft(yscale));                               

            const xAxisLabel = plotContainer.append("text")
                .attr('id', 'x_axis_label')
                .attr("transform", `translate(${topTenWidth/2}, ${topTenHeight + 35})`)
                .style("text-anchor", "middle")
                .text("Number of Injuries");

            const yAxisLabel = plotContainer.append("text")
                .attr('id', 'y_axis_label')
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - plotMargin)
                .attr("x", 0 - (topTenHeight / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Consumer Product Ranking"); 
        }

        // draw the graph axies 
        drawAxes(topTenPlot);

        // draw the bars for the bar graph 
        topTenPlot.selectAll('rect')
            .data(topTenData)
            .join('rect')
                .attr('x', 0)
                .attr('y', (d, i) => i*topTenBarHeight)       
                .attr('width', d => xscale(d.value))
                .attr('height', topTenBarHeight)  
                .style('fill', function(d, i){return color(i)})
                .style('stroke', 'white')

        var text_padding = 10; 

        // draw the text lbaels for the bar graph 
        topTenPlot.selectAll('.bar_labels')
            .data(topTenData)
            .join('text')
                .attr('class', 'bar_labels')
                .attr('alignment-baseline', 'middle')
                .attr('x', d => xscale(d.value) + text_padding)
                .attr('y', (d, i) => i*topTenBarHeight + topTenBarHeight/2)
                .attr('fill', 'black')
                .text(d => d.key.replace(/ *\([^d)]*\) */g, "")); 

        // show the injury descriptions 
        function showInjuryDescriptions() {

            // get the top most dangerous product and the selected age 
            topOneProduct = topOneData[0].key; 
            ageFilter = d3.select('#ageDropdown').property('value'); 

            // filter data for just incident descriptions matching the above parameters
            filteredData = data.filter(d => d['category'] === topOneProduct);
            filteredData = filteredData.filter(d => d['VICTIM 1 AGE YEARS'] === Number(ageFilter));
            filteredData = filteredData.map(d => d['INCIDENT DESCRIPTION'])

            // display a random description as text
            randomDescription = filteredData[Math.floor(Math.random()*filteredData.length)];
            d3.select('#injuryDescriptionText').text(randomDescription);

            // Define behavior for the refresh button 
            d3.select('#refreshButton').on('click',function(d){
                updateInjuryDescriptions(filteredData);
        }) 
        }

        function updateInjuryDescriptions(data){
            randomDescription = data[Math.floor(Math.random()*data.length)];
            d3.select('#injuryDescriptionText').text(randomDescription);
        }

        showInjuryDescriptions();

    }
}
