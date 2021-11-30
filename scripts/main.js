// some constants for the page 
var userInputWidth = 1000; 
var userInputHeight = 140;  
var userInputPadding = 20;  

// create a container for the user input 
var userInput = d3.select('#userPrompt')
    .append('svg')
    .attr('width', userInputWidth)
    .attr('height', userInputHeight);

// give the user input container a background fill 
var userInputBackground = userInput.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', userInputWidth)
    .attr('height', userInputHeight)
    .attr('fill', 'steelblue'); 

// create group for the Age Selector 
var ageSelector = userInput.append('g');
var ageSelectorWidth = 200; 
var ageSelectorHeight = 50;

ageSelector.append('rect')
    .attr('x', userInputPadding)
    .attr('y', userInputHeight - userInputPadding - ageSelectorHeight)
    .attr('width', ageSelectorWidth)
    .attr('height', ageSelectorHeight)
    .attr('fill', 'black');

ageSelector.append('text')
    .attr('x', userInputPadding + ageSelectorWidth/2)
    .attr('y', userInputPadding * 2)
    .attr('fill', 'black')
    .style("text-anchor", "middle")
    .text('How old are you?'); 

// create group for the Gender Selector 
var genderSelector = userInput.append('g'); 
var genderSelectorWidth = 200; 
var genderSelectorHeight = 50;

genderSelector.append('rect')
    .attr('x', userInputWidth/2 - genderSelectorWidth/2)
    .attr('y', userInputHeight - userInputPadding - genderSelectorHeight)
    .attr('width', genderSelectorWidth)
    .attr('height', genderSelectorHeight)
    .attr('fill', 'black'); 

genderSelector.append('text')
    .attr('x', userInputWidth/2)
    .attr('y', userInputPadding * 2)
    .attr('fill', 'black')
    .style("text-anchor", "middle")
    .text('What is your gender?'); 

// Create the Gender Selector 
d3.csv('data/gender_selector.csv', function(d) {
    return {gender: d.gender}
    }).then(updateGenderSelector)

function updateGenderSelector(data){

    // Populate the Gender Selector with the data 
    d3.select('#userInput')
        .append('select')
        .attr('id', 'genderDropdown')
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

// create group for the State Selector 
var stateSelector = userInput.append('g'); 
var stateSelectorWidth = 200; 
var stateSelectorHeight = 50;

stateSelector.append('rect')
    .attr('x', userInputWidth - stateSelectorWidth - userInputPadding)
    .attr('y', userInputHeight - userInputPadding - stateSelectorHeight)
    .attr('width', stateSelectorWidth)
    .attr('height', stateSelectorHeight)
    .attr('fill', 'black'); 

stateSelector.append('text')
    .attr('x', userInputWidth - userInputPadding - stateSelectorWidth/2)
    .attr('y', userInputPadding * 2)
    .attr('fill', 'black')
    .style("text-anchor", "middle")
    .text('Which state do you live in?'); 

// Create the State Selector 
d3.csv('data/state_selector.csv', function(d) {
    return {state: d.state}
    }).then(updateStateSelector)

function updateStateSelector(data){

    // Populate the State Selector with the data 
    d3.select('#userInput')
        .append('select')
        .attr('id', 'stateDropdown')
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
    })
}

// Draw the Top 10 Bar Graph 
var topTenWidth = 1000; 
var topTenHeight = 300; 
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
d3.csv('data/dataset.csv', d3.autoType).then(createTopTenGraph)

function createTopTenGraph(data){

    // Create the age selector 
    d3.csv('data/age_selector.csv', function(d) {
        return {age: d.age}
        }).then(createAgeSelector)

    function createAgeSelector(age_data){

        // Populate the Age Selector with the data 
        d3.select('#userInput')
            .append('select')
            .attr('id', 'ageDropdown')
            .selectAll('myOptions')
            .data(age_data)
            .enter()
            .append('option')
            .text(d => d.age)
            .attr('value', d => d.age)

        // Define behavior for the output from Age Selector 
        d3.select('#ageDropdown').on('change',function(d){
            selected_age = d3.select(this).property('value');
            d3.select('#selectedAge').text(selected_age);
            updateGraph(selected_age)
        })

    function updateGraph(age){

        filteredData = data.filter(d => d['VICTIM 1 AGE YEARS'] === Number(age));

        // sanity check using these intermediate values 
        dummyData = d3.group(filteredData, d => d['PRODUCT 1']);
        dummyData = d3.map(dummyData, function(key, value) { return {key: key[0], value: key[1].length} })        
        dummyData.sort(function(a, b){
            return d3.descending(a.value, b.value);
        })
        topTenData = dummyData.slice(0, 10);
        console.log(topTenData)
       
        // define the x scale here
        const xscale = d3.scaleBand()
            .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
            .range([0, topTenWidth]);

        // define the y scale here
        const yscale = d3.scaleLinear() // a function that converts values in data to pixels on the screen 
            .domain([0, d3.max(topTenData, d => d.value)]) // [0, maximum value in data]
            .range([0, topTenHeight]) // [0, maximum value on screen] 

        // define a separate scale for the y axis (the range is flipped)
        const yaxis_scale = d3.scaleLinear() // a function that converts values in data to pixels on the screen 
        .domain([0, d3.max(topTenData, d => d.value)]) // [0, maximum value in data]
        .range([topTenHeight, 0]) // [0, maximum value on screen] 

        // define a separate scale for the x axis (scale starts at 1, not 0)
        const xaxis_scale = d3.scaleBand()
            .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
            .range([0, topTenWidth]);

        // define the color scale 
        color = d3.scaleOrdinal(d3.schemePastel1).domain([0, 10]);

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
                .transition()
                .duration(1000)     
                .call(d3.axisLeft(yaxis_scale));                               

            const xAxisLabel = plotContainer.append("text")
                .attr('id', 'x_axis_label')
                .attr("transform", `translate(${topTenWidth/2}, ${topTenHeight + 35})`)
                .style("text-anchor", "middle")
                .text("Consumer Products");

            const yAxisLabel = plotContainer.append("text")
                .attr('id', 'y_axis_label')
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - plotMargin)
                .attr("x", 0 - (topTenHeight / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Number of Injuries"); 
        }

        drawAxes(topTenPlot);

        // draw the bar graph 
        topTenPlot.selectAll('rect')
            .data(topTenData)
            .join('rect')
                .transition()
                .duration(1000)
                .attr('x', function(d, i){return xscale(i)})
                .attr('y', d => topTenHeight-yscale(d.value))       
                .attr('width', d => xscale.bandwidth())
                .attr('height', d => yscale(d.value))  
                .style('fill', function(d, i){return color(i)})
                .style('stroke', 'white');

    }
    }   
}