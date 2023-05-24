// create 2 data_set
const data1 = [
    {group: "A", value: 4},
    {group: "B", value: 16},
    {group: "C", value: 8}
 ];
 
 const data2 = [
    {group: "A", value: 7},
    {group: "B", value: 1},
    {group: "C", value: 20},
    {group: "D", value: 10}
 ];

 /*
 {
   A: count,
   B: count}
 */
 // set the dimensions and margins of the graph
 const margin = {top: 30, right: 30, bottom: 70, left: 60},
     width = 460 - margin.left - margin.right,
     height = 400 - margin.top - margin.bottom;
 
 // append the svg object to the body of the page
 const svg = d3.select("#my_dataviz")
   .append("svg")
     .attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom)
   .append("g")
     .attr("transform", `translate(${margin.left},${margin.top})`);
 
 // Initialize the X axis
 const x = d3.scaleBand()
   .range([ 0, width ])
   .padding(0.2);
 const xAxis = svg.append("g")
   .attr("transform", `translate(0,${height})`)
 
 // Initialize the Y axis
 const y = d3.scaleLinear()
   .range([ height, 0]);
 const yAxis = svg.append("g")
   .attr("class", "myYaxis")
 
const options = d3.selectAll('input[name="option"]');
options.on('change', function() {
    const selectedOption = d3.select(this).property('value');
    console.log('Option changed:', selectedOption);
    updateOption(selectedOption)
});

function objToArray(histogram_data) {
  histogram_array = []
  for (key in histogram_data) {
    histogram_array.push({group: key, value: histogram_data[key]})
  }
  return histogram_array
}

function buildHistogramData (features, category) {
  histogram_data = {}

  for (let i  = 0; i < features.length; i++) {
    feature = features[i]
    year = feature["properties"]["year"]
    month = feature["properties"]["month"]
    week = feature["properties"]["week"]
    day = feature["properties"]["day"]

    text = ""

    if (category == "year") {
      text = year.toString()
    } else if (category == "month") {
      text = month + " " + year.toString()
    } else if (category == "week") {
      text = "Week " + week + " " + year.toString()
    } else if (category == "day") {
      text = month + " " + day + " " + year.toString()
    }

    if (!(text in histogram_data)) {
      histogram_data[text] = 0;
    }

    histogram_data[text] = histogram_data[text] + 1
  }

  return histogram_data
}

async function updateOption(selectedOption) {
    const res = await fetch('data/stanford_crime.geojson')
    data = await res.json();
    features = data["features"]
    console.log(features)

    // histogram_data = {}

    hisogram_data = buildHistogramData(features, selectedOption)

    // turn histogram data into preffered format
    updateHistogram(objToArray(histogram_data))
}

 // A function that create / update the plot for a given variable:
function updateHistogram(data) {
   // Update the X axis
   x.domain(data.map(d => d.group))
   xAxis.call(d3.axisBottom(x))
 
   // Update the Y axis
   y.domain([0, d3.max(data, d => d.value) ]);
   yAxis.transition().duration(1000).call(d3.axisLeft(y));
 
   // Create the u variable
   var u = svg.selectAll("rect")
     .data(data)
     .join("rect") // Add a new rect for each new elements
     .transition()
     .duration(1000)
       .attr("x", d => x(d.group))
       .attr("y", d => y(d.value))
       .attr("width", x.bandwidth())
       .attr("height", d => height - y(d.value))
       .attr("fill", "#69b3a2")
 }
 
 // Initialize the plot with the first dataset
 updateOption("year")