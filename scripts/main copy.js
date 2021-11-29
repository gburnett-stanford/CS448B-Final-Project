// some constants for the page 
var userInputWidth = 1000; 
var userInputHeight = 140;  
var userInputPadding = 20;  

// create a container for the user input 
var userInput = d3.select('div#userPrompt')
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

// Create the Age Selector 
d3.csv('data/age_selector.csv', function(d) {
    return {age: d.age}
    }).then(updateAgeSelector)

function updateAgeSelector(data){

    // Populate the Age Selector with the data 
    d3.select('#userInput')
        .append('select')
        .attr('id', 'ageDropdown')
        .selectAll('myOptions')
        .data(data)
        .enter()
        .append('option')
        .text(d => d.age)
        .attr('value', d => d.age)

    // Define behavior for the output from Age Selector 
    d3.select('#ageDropdown').on('change',function(d){
        var selected = d3.select(this).property('value');
        d3.select('#selectedAge').text(selected);
        updateTopTenGraph();
    })
}

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
var topTenHeight = 200; 

// Create a container for the graph 
var topTenContainer = d3.select('div#topTenBarGraph')
    .append('svg')
    .attr('width', topTenWidth)
    .attr('height', topTenHeight);

// Create the graph 
d3.csv('data/dataset.csv', d3.autoType).then(updateTopTenGraph)

function updateTopTenGraph(data){

    // get values from the user input 
    var age = d3.select('#ageDropdown').property('value');
    var gender = d3.select('#genderDropdown').property('value');
    var state = d3.select('#stateDropdown').property('value');

    console.log(age);
    console.log(gender)
    console.log(state)

    // filteredData = data
    //     .filter(d => d['VICTIM 1 AGE YEARS'] === age)

    // console.log(filteredData)
}

// function updateTopTenGraph(data){

//     console.log('data')
//     console.log(data)

//     console.log('data.columns')
//     console.log(data.columns)

//     // get the selected age 
//     var age = d3.select('#ageDropdown').property('value')

//     // conditional for what to do when age is 'Make A Selection'

//     console.log('age')
//     console.log(age)

//     // filter the data 
    // filteredData = data
    //     .filter(d => d['VICTIM 1 AGE YEARS'] === age)
    
//     console.log('filtered data')
//     console.log(filteredData)

//     // plot once with default values 

//     // then create update script based on selection 

// }

//     // Populate the State Selector with the data 
//     d3.select('#userInput')
//         .append('select')
//         .attr('id', 'stateDropdown')
//         .selectAll('myOptions')
//         .data(data)
//         .enter()
//         .append('option')
//         .text(d => d.state)
//         .attr('value', d => d.state)

//     // Define behavior for the output from State Selector 
//     d3.select('#stateDropdown').on('change',function(d){
//         var selected = d3.select(this).property('value');
//         d3.select('#selectedState').text(selected);
//     })
// }

// // Redefine the x scale here.
// const xscale = d3.scaleBand()
// .domain([0, 10])
// .range([0, topTenWidth]);

// // Redefine the y scale here.
// const yscale = d3.scaleLinear() // a function that converts values in data to pixels on the screen 
// .domain([0, d3.max(topTenData, d => d.value)]) // [0, maximum value in data]
// .range([0, topTenHeight]) // 0, maximum value on screen] 