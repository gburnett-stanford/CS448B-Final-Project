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
