// some constants for the page 
var userInputWidth = 1000; 
var userInputHeight = 140;  
var userInputPadding = 20;  

// create a container for the user input 
var userInput = d3.select('div#userInput')
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

d3.csv('selector_data/age_selector.csv', function(d) {
    return {age: d.age}
    }).then(drawAgeSelector)

function drawAgeSelector(data){
    d3.select('.ageSelector')
    .selectAll('myOptions')
    .data(data)
    .enter()
    .append('option')
    .text(d => d.age)
    .attr(d => d.age); 
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
