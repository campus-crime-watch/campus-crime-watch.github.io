var myData = 
"date	New York	San Francisco	Austin\n\
2011-10-01	63.4	62.7	72.2\n\
2011-10-02	58.0	59.9	67.7\n\
2011-10-03	53.3	59.1	69.4\n\
2011-10-04	55.7	58.8	68.0\n\
2011-10-05	64.2	58.7	72.4\n\
2011-10-06	58.8	57.0	77.0\n\
2011-10-07	57.9	56.7	82.3\n\
2011-10-08	61.8	56.8	78.9\n\
2011-10-09	69.3	56.7	68.8\n\
2011-10-10	71.2	60.1	68.7\n\
2011-10-11	68.7	61.1	70.3\n\
2011-10-12	61.8	61.5	75.3\n\
2011-10-13	63.0	64.3	76.6\n\
2011-10-14	66.9	67.1	66.6\n\
2011-10-15	61.7	64.6	68.0\n\
2011-10-16	61.8	61.6	70.6\n\
2011-10-17	62.8	61.1	71.1\n\
2011-10-18	60.8	59.2	70.0\n\
2011-10-19	62.1	58.9	61.6\n\
2011-10-20	65.1	57.2	57.4\n\
2011-10-21	55.6	56.4	64.3\n\
2011-10-22	54.4	60.7	72.4\n";

var margininfo = {
    top: 20,
    right: 80,
    bottom: 30,
    left: 50
    }
var widthinfo = 600 - margininfo.left - margininfo.right;
var heightinfo = 500 - margininfo.top - margininfo.bottom;

var parseDate = d3.timeParse("%Y%m%d");

var xinfo = d3.scaleTime()
    .range([0, widthinfo]);

var yinfo = d3.scaleLinear()
    .range([heightinfo, 0]);

var color = d3.scaleOrdinal(d3.schemeCategory10);

var xAxis = d3.axisBottom(xinfo)

var yAxis = d3.axisLeft(yinfo)

var line = d3.line()
    .x(function(d) {
    return xinfo(d.date);
    })
    .y(function(d) {
    return yinfo(d.temperature);
    });

var svg = d3.select("#multiline").append("svg")
    .attr("width", widthinfo + margininfo.left + margininfo.right)
    .attr("height", heightinfo + margininfo.top + margininfo.bottom)
    .append("g")
    .attr("transform", "translate(" + margininfo.left + "," + margininfo.top + ")");

var data = d3.tsvParse(myData);
console.log("data", data)

color.domain(Object.keys(data[0]).filter(function(key) {
    return key !== "date";
}));

data.forEach(function(d) {
    d.date = Date.parse(d.date);
});

var cities = color.domain().map(function(name) {
    return {
    name: name,
    values: data.map(function(d) {
        return {
        date: d.date,
        temperature: +d[name]
        };
    })
    };
});

xinfo.domain(d3.extent(data, function(d) {
    return d.date;
}));

yinfo.domain([
    d3.min(cities, function(c) {
    return d3.min(c.values, function(v) {
        return v.temperature;
    });
    }),
    d3.max(cities, function(c) {
    return d3.max(c.values, function(v) {
        return v.temperature;
    });
    })
]);

var legend = svg.selectAll('g')
    .data(cities)
    .enter()
    .append('g')
    .attr('class', 'legend');

legend.append('rect')
    .attr('x', widthinfo - 50)
    .attr('y', function(d, i) {
    return i * 20;
    })
    .attr('width', 10)
    .attr('height', 10)
    .style('fill', function(d) {
    return color(d.name);
    });

legend.append('text')
    .attr('x', widthinfo - 35)
    .attr('y', function(d, i) {
    return (i * 20) + 9;
    })
    .text(function(d) {
    return d.name;
    });

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + heightinfo + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Temperature (ºF)");

var city = svg.selectAll(".city")
    .data(cities)
    .enter().append("g")
    .attr("class", "city");

// array
city.append("path")
    .attr("class", "line")
    .attr("d", function(d) {
        return line(d.values);
    })
    .style("stroke", function(d) {
    return color(d.name);
    })
    .style("fill","none");

city.append("text")
    .datum(function(d) {
    return {
        name: d.name,
        value: d.values[d.values.length - 1]
    };
    })
    .attr("transform", function(d) {
    return "translate(" + xinfo(d.value.date) + "," + yinfo(d.value.temperature) + ")";
    })
    .attr("x", 3)
    .attr("dy", ".35em")
    .text(function(d) {
    return d.name;
    });

var mouseG = svg.append("g")
    .attr("class", "mouse-over-effects");

mouseG.append("path") // this is the black vertical line to follow mouse
    .attr("class", "mouse-line")
    .style("stroke", "black")
    .style("stroke-width", "1px")
    .style("opacity", "0");
    
var lines = document.getElementsByClassName('line');

var mousePerLine = mouseG.selectAll('.mouse-per-line')
    .data(cities)
    .enter()
    .append("g")
    .attr("class", "mouse-per-line");

mousePerLine.append("circle")
    .attr("r", 7)
    .style("stroke", function(d) {
    return color(d.name);
    })
    .style("fill", "none")
    .style("stroke-width", "1px")
    .style("opacity", "0");

mousePerLine.append("text")
    .attr("transform", "translate(10,3)");

mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
    .attr('width', widthinfo) // can't catch mouse events on a g element
    .attr('height', heightinfo)
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .on('mouseout', function() { // on mouse out hide line, circles and text
    d3.select(".mouse-line")
        .style("opacity", "0");
    d3.selectAll(".mouse-per-line circle")
        .style("opacity", "0");
    d3.selectAll(".mouse-per-line text")
        .style("opacity", "0");
    })
    .on('mouseover', function() { // on mouse in show line, circles and text
    d3.select(".mouse-line")
        .style("opacity", "1");
    d3.selectAll(".mouse-per-line circle")
        .style("opacity", "1");
    d3.selectAll(".mouse-per-line text")
        .style("opacity", "1");
    })
    .on('mousemove', function() { // mouse moving over canvas
    var mouse = d3.pointer(event);
    d3.select(".mouse-line")
        .attr("d", function() {
        var d = "M" + mouse[0] + "," + heightinfo;
        d += " " + mouse[0] + "," + 0;
        return d;
        });

    d3.selectAll(".mouse-per-line")
        .attr("transform", function(d, i) {
        var xDate = xinfo.invert(mouse[0]),
            bisect = d3.bisector(function(d) { return d.date; }).right;
            idx = bisect(d.values, xDate);
        
        var beginning = 0,
            end = lines[i].getTotalLength(),
            target = null;

        while (true){
            target = Math.floor((beginning + end) / 2);
            pos = lines[i].getPointAtLength(target);
            if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                break;
            }
            if (pos.x > mouse[0])      end = target;
            else if (pos.x < mouse[0]) beginning = target;
            else break; //position found
        }
        
        d3.select(this).select('text')
            .text(yinfo.invert(pos.y).toFixed(2));
            
        return "translate(" + mouse[0] + "," + pos.y +")";
        });
    });
    