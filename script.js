// Create a container div for the chart
d3.select("body")
    .append("div")
    .attr("class", "chart-container");

// Dimensions and margins
const margin = { top: 60, right: 100, bottom: 50, left: 200 }; // Increased left and right margins
const width = 1000 - margin.left - margin.right;  // Increased total width
const height = 500 - margin.top - margin.bottom;

// SVG Container
const svg = d3
    .select(".chart-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Headline and subheadline
d3.select(".chart-container")
    .insert("h1", "svg")
    .text("Top 10 Reasons for 311 Calls in Boston (2023)");
d3.select(".chart-container")
    .insert("h2", "svg")
    .text("Analyzing citizen concerns to understand community priorities");

d3.csv("boston_311_2023_by_reason.csv").then((data) => {
    // Convert count to number and sort by count
    data.forEach(d => {
        d.Count = +d.Count;
    });
    
    // Sort and get top 10
    const sortedData = data
        .sort((a, b) => b.Count - a.Count)
        .slice(0, 10);

    // Scales
    const x = d3.scaleLinear()
        .domain([0, d3.max(sortedData, d => d.Count)])
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(sortedData.map(d => d.reason))
        .range([0, height])
        .padding(0.1);

    // Axes
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(5))
        .selectAll("text")
        .attr("font-size", "12px");

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .attr("font-size", "12px");

    // Bars
    svg.selectAll(".bar")
        .data(sortedData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", d => y(d.reason))
        .attr("x", 0)
        .attr("width", d => x(d.Count))
        .attr("height", y.bandwidth());

    // Add data labels
    svg.selectAll(".label")
        .data(sortedData)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", d => x(d.Count) + 5)
        .attr("y", d => y(d.reason) + y.bandwidth() / 2)
        .attr("dy", ".35em")
        .attr("font-size", "12px")
        .text(d => d.Count);

    // Footer
    d3.select(".chart-container")
        .append("div")
        .attr("class", "chart-footer")
        .html(
            "Data Source: Boston 311 Service Requests, 2023. <br> Visualization by ChatGPT."
        );
});