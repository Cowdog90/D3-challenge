// @TODO: YOUR CODE HERE!
//function makeAdvChart() {

    let svgWidth = 960;
    let svgHeight = 500;
    
    let margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left:100
    };

// Set margins for visualization
    let width = svgWidth - margin.left - margin.right;
    let height = svgHeight - margin.top - margin.bottom;


// Create SVG and add attributes to it
    let svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

let basicChart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


    // Initial Params.
    var chosenXAxis = "poverty";
    var chosenYAxis = "healthcare";


        // Function used for updating x-scale variable upon click on axis label.
        function xScale(paperData, chosenXAxis) {
            // Create Scales.
            var xLinearScale = d3.scaleLinear()
                .domain([d3.min(paperData, d => d[chosenXAxis]) * .8,
                     d3.max(paperData, d => d[chosenXAxis]) * 1.2
                ])
                .range([0, width]);

            return xLinearScale;

        }

        // Function used for updating y-scale variable upon click on axis label.
        function yScale(paperData, chosenYAxis) {
            // Create Scales.
            var yLinearScale = d3.scaleLinear()
                .domain([d3.min(paperData, d => d[chosenYAxis]) * .8,
                    d3.max(paperData, d => d[chosenYAxis]) * 1.2
                ])
                .range([height, 0]);
    
            return yLinearScale;
        }
        // Function used for updating xAxis var upon click on axis label.
        function renderXAxes(newXScale, xAxis) {
            var bottomAxis = d3.axisBottom(newXScale);
    
            xAxis.transition()
                .duration(1000)
                .call(bottomAxis);
    
            return xAxis;
        }
    
        // Function used for updating yAxis var upon click on axis label.
        function renderYAxes(newYScale, yAxis) {
            var leftAxis = d3.axisLeft(newYScale);
    
            yAxis.transition()
                .duration(1000)
                .call(leftAxis);
    
            return yAxis;
        }
        // Function used for updating circles group with a transition to new circles.
        function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

            circlesGroup.transition()
                .duration(1000)
                .attr("cx", d => newXScale(d[chosenXAxis]))
                .attr("cy", d => newYScale(d[chosenYAxis]));
    
            return circlesGroup;
        }
    
        // Function used for updating text in circles group with a transition to new text.
        function renderText(circletextGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
            circletextGroup.transition()
                .duration(1000)
                .attr("x", d => newXScale(d[chosenXAxis]))
                .attr("y", d => newYScale(d[chosenYAxis]));
            
            return circletextGroup;
        }


        //Import Data from data.csv file
        d3.csv("assets/data/data.csv")
            .then(function(riskData){

        //interate through data.csv file and use unary operator to make integers where needed
        riskData.forEach(function(data) {
            data.age = +data.age;
            data.smokes = +data.smokes;
            data.healthcare = +data.healthcare;
            data.poverty = +data.poverty;
            data.abbr = data.abbr;
            data.income = +data.income;
        });

        //Create scales 
        let xLinearScale = d3.scaleLinear()
            .domain([8.5, d3.max(riskData, d => d.poverty)])
            .range([0, width]);

        let yLinearScale = d3.scaleLinear()
            .domain([3.5, d3.max(riskData, d => d.healthcare)])
            .range([height, 0]);

        //Create x and y axis
        let xAxis = d3.axisBottom(xLinearScale);
        let yAxis = d3.axisLeft(yLinearScale);

        //Append x and y axis basicChart
        basicChart.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);

        basicChart.append("g")
            .call(yAxis);

        //Create Circles
        let circlesGroup = basicChart.selectAll("circle")
            .data(riskData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.poverty))
            .attr("cy", d => yLinearScale(d.healthcare))
            .attr("r", 10)
            .attr("fill", "yellow")
            .attr("opacity", ".6")
            .attr("stroke-width", "1")
            .attr("stroke", "black");

        basicChart.select("g")
            .selectAll("circle")
            .data(riskData)
            .enter()
            .append("text")
            .text(d => d.abbr)
            .attr("x", d => xLinearScale(d.poverty))
            .attr("y", d => yLinearScale(d.healthcare))
            .attr("dy",-395)
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("fill", "black");

        console.log(riskData);

//Labels for the plot
    // basicChart.append("text")
    //     .attr("transform", "rotate(-90)")
    //     .attr("y", 0 - 50)
    //     .attr("x", 0 -250)
    //     .attr("dy", "1em")
    //     .attr("class", "axisText")
    //     .text("Lacks Healthcare (%)");
  
    // basicChart.append("text")
    //     .attr("transform", `translate(${width / 2.5}, ${height + margin.top + 25})`)
    //     .attr("class", "axisText")
    //     .text("In Poverty (%)");
  
    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener.
        .classed("active", true)
        .text("In Poverty (%)");

    var ageLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener.
        .classed("inactive", true)
        .text("Age (Median)");

    var incomeLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener.
        .classed("inactive", true)
        .text("Household Income (Median)");

    var healthcareLabel = labelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", (margin.left) * 2.5)
        .attr("y", 0 - (height - 60))
        .attr("value", "healthcare") // value to grab for event listener.
        .classed("active", true)
        .text("Lacks Healthcare (%)");

    var smokeLabel = labelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", (margin.left) * 2.5)
        .attr("y", 0 - (height - 40))
        .attr("value", "smokes") // value to grab for event listener.
        .classed("inactive", true)
        .text("Smokes (%)");

    var obesityLabel = labelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", (margin.left) * 2.5)
        .attr("y", 0 - (height - 20))
        .attr("value", "obesity") // value to grab for event listener.
        .classed("inactive", true)
        .text("Obesity (%)");

        // X Axis labels event listener.
        labelsGroup.selectAll("text")
            .on("click", function() {
                // Get value of selection.
                var value = d3.select(this).attr("value");

                if (true) {
                    if (value === "poverty" || value === "age" || value === "income") {

                        // Replaces chosenXAxis with value.
                        chosenXAxis = value;

                        // console.log(chosenXAxis)

                        // Update x scale for new data.
                        xLinearScale = xScale(paperData, chosenXAxis);

                        // Updates x axis with transition.
                        xAxis = renderXAxes(xLinearScale, xAxis);

                        // Changes classes to change bold text.
                        if (chosenXAxis === "poverty") {
                            povertyLabel
                                .classed("active", true)
                                .classed("inactive", false);

                            ageLabel
                                .classed("active", false)
                                .classed("inactive", true);
                            
                            incomeLabel
                                .classed("active", false)
                                .classed("inactive", true);
                        }
                        else if (chosenXAxis === "age"){
                            povertyLabel
                                .classed("active", false)
                                .classed("inactive", true);

                            ageLabel
                                .classed("active", true)
                                .classed("inactive", false);

                            incomeLabel
                                .classed("active", false)
                                .classed("inactive", true);
                        }
                        else {
                            povertyLabel
                                .classed("active", false)
                                .classed("inactive", true);

                            ageLabel
                                .classed("active", false)
                                .classed("inactive", true)

                            incomeLabel
                                .classed("active", true)
                                .classed("inactive", false);
                        }
                    
                    } else {

                        chosenYAxis = value;

                        // Update y scale for new data.
                        yLinearScale = yScale(paperData, chosenYAxis);

                        // Updates y axis with transition.
                        yAxis = renderYAxes(yLinearScale, yAxis);

                        // Changes classes to change bold text.
                        if (chosenYAxis === "healthcare") {
                            healthcareLabel
                                .classed("active", true)
                                .classed("inactive", false);

                            smokeLabel
                                .classed("active", false)
                                .classed("inactive", true);

                            obesityLabel
                                .classed("active", false)
                                .classed("inactive", true);
                        }
                        else if (chosenYAxis === "smokes"){
                            healthcareLabel
                                .classed("active", false)
                                .classed("inactive", true);

                            smokeLabel
                                .classed("active", true)
                                .classed("inactive", false);

                            obesityLabel
                                .classed("active", false)
                                .classed("inactive", true);
                        }
                        else {
                            healthcareLabel
                                .classed("active", false)
                                .classed("inactive", true);

                            smokeLabel
                                .classed("active", false)
                                .classed("inactive", true);

                            obesityLabel
                                .classed("active", true)
                                .classed("inactive", false);
                        }
                    
                    }

                    // Update circles with new x values.
                    circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

                    // Update tool tips with new info.
                    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                    // Update circles text with new values.
                    circletextGroup = renderText(circletextGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

  
                };
  });
  
  //makeAdvChart()