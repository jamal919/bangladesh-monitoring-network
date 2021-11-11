import React, { useEffect, useRef } from "react";
import Dygraph from "dygraphs";
import "dygraphs/dist/dygraph.min.css";

// From https://dygraphs.com/tests/plotters.html

// Darken a color
function darkenColor(colorStr) {
  // Defined in dygraph-utils.js
  var color = Dygraph.toRGB_(colorStr);
  color.r = Math.floor((255 + color.r) / 2);
  color.g = Math.floor((255 + color.g) / 2);
  color.b = Math.floor((255 + color.b) / 2);
  return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
}

// This function draws bars for a single series. See
// multiColumnBarPlotter below for a plotter which can draw multi-series
// bar charts.
function barChartPlotter(e) {
  var ctx = e.drawingContext;
  var points = e.points;
  var y_bottom = e.dygraph.toDomYCoord(0);

  ctx.fillStyle = darkenColor(e.color);

  // Find the minimum separation between x-values.
  // This determines the bar width.
  var min_sep = Infinity;
  for (var i = 1; i < points.length; i++) {
    var sep = points[i].canvasx - points[i - 1].canvasx;
    if (sep < min_sep) min_sep = sep;
  }
  var bar_width = Math.floor((2.0 / 3) * min_sep);

  // Do the actual plotting.
  for (i = 0; i < points.length; i++) {
    var p = points[i];
    var center_x = p.canvasx;

    ctx.fillRect(
      center_x - bar_width / 2,
      p.canvasy,
      bar_width,
      y_bottom - p.canvasy
    );
    ctx.strokeRect(
      center_x - bar_width / 2,
      p.canvasy,
      bar_width,
      y_bottom - p.canvasy
    );
  }
}

// Multiple column bar chart
function barChartPlotterMulti(e) {
  // We need to handle all the series simultaneously.
  if (e.seriesIndex !== 0) return;

  var g = e.dygraph;
  var ctx = e.drawingContext;
  var sets = e.allSeriesPoints;
  var y_bottom = e.dygraph.toDomYCoord(0);

  // Find the minimum separation between x-values.
  // This determines the bar width.
  var min_sep = Infinity;
  for (var j = 0; j < sets.length; j++) {
    var points = sets[j];
    for (var i = 1; i < points.length; i++) {
      var sep = points[i].canvasx - points[i - 1].canvasx;
      if (sep < min_sep) min_sep = sep;
    }
  }
  var bar_width = Math.floor((2.0 / 3) * min_sep);

  var fillColors = [];
  var strokeColors = g.getColors();
  for (i = 0; i < strokeColors.length; i++) {
    fillColors.push(darkenColor(strokeColors[i]));
  }

  for (j = 0; j < sets.length; j++) {
    ctx.fillStyle = fillColors[j];
    ctx.strokeStyle = strokeColors[j];
    for (i = 0; i < sets[j].length; i++) {
      var p = sets[j][i];
      var center_x = p.canvasx;
      var x_left = center_x - (bar_width / 2) * (1 - j / (sets.length - 1));

      ctx.fillRect(
        x_left,
        p.canvasy,
        bar_width / sets.length,
        y_bottom - p.canvasy
      );

      ctx.strokeRect(
        x_left,
        p.canvasy,
        bar_width / sets.length,
        y_bottom - p.canvasy
      );
    }
  }
}

function DyGraph(props) {
  const graphRef = useRef();

  useEffect(() => {
    new Dygraph(
      graphRef.current,
      props.url,
      {
        title: props.title,
        titleHeight: 28,
        ylabel: "Percent",
        xlabel: "Year",
        gridLineWidth: "0.1",
        width: 700,
        height: 300,
        valueRange: [0, 101],
        legend: "always",
        plotter: barChartPlotter,
      }
    );
  });

  return <div ref={graphRef}></div>;
}

export default DyGraph;
