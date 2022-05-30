function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    console.log("sampleNames");
    console.log(sampleNames);

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);

}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var desiredSample = data.metadata.filter(bioDiv => bioDiv.id == sample)[0]
    //  5. Create a variable that holds the first sample in the array.
    var patientId = samples.filter(bioDiv => bioDiv.id == sample)[0]

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = patientId.otu_ids
    var otu_labels = patientId.otu_labels
    var sample_values = patientId.sample_values

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse()

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sample_values.slice(0, 10).reverse(),
      y: yticks,
      text: otu_labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h',
      marker: {
        color: 'rgb(242, 113, 102)'
      },
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Microbial Species in Belly Buttons",
      xaxis: { title: "Bacteria Sample Values" },
      yaxis: { title: "OTU IDs" }
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar-plot", barData, barLayout);

    // Bar and Bubble charts

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values,
        colorsclae: "Earth"
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Belly Button Biodiversity",
      xaxis: {title : "OTU IDs"},
      yaxis: {title : "Sample Values"}
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble-plot", bubbleData, bubbleLayout);

// 4. Create the trace for the gauge chart.
        // Create variable for washing frequency
        var washFreq = desiredSample.wfreq
var gaugeData = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: washFreq,
    title: { text: "Washing Frequency" },
    type: "indicator",
    mode: "gauge+number",
    gauge: {
      bar: {color: 'white'},
      axis: { range: [null, 10] },
      steps: [
          { range: [0, 2], color: 'rgb(20, 50, 160)' },
          { range: [2, 4], color: 'rgb(90, 50, 160)' },
          { range: [4, 6], color: 'rgb(166, 77, 104)' },
          { range: [6, 8], color: 'rgb(242, 113, 102)' },
          { range: [8, 10], color: 'rgb(242, 90, 70)' },
      ],
  }
  }];

// 5. Create the layout for the gauge chart.
var gaugeLayout = [{
  width: 500,
  height: 400,
  margin: { t: 25, r: 25, l: 25, b: 25 },
  }];

// 6. Use Plotly to plot the gauge data and layout.
Plotly.newPlot("gauge-plot", gaugeData, gaugeLayout);
});
}