"use strict"

var heatmap = {};

heatmap.update = function(recorder) {
    if (recorder.events.senders.length == 0) return

    var source = d3.merge(app.data.links.filter(function(link) {
        return link.target == recorder.node.id
    }).map(function(link) {
        return app.data.nodes[link.source].ids
    }))

    var times = recorder.events['times'];
    var senders = recorder.events['senders'].filter(function(d, i) {
        return times[i] > (app.data.kernel.time - 100)
    })
    recorder.events['senders'] = senders
    recorder.events['times'] = times.filter(function(d, i) {
        return times[i] > (app.data.kernel.time - 100)
    })

    var h1 = d3.histogram()
        .domain(d3.extent(source))
        .thresholds(source)(senders);
    var h1 = h1.map(function(d) {
        return d.length * 1
    })
    $('#clip').empty()
    var sourceId = app.data.links.find(function(x) {
        return x.target == recorder.node.id
    }).source

    heatmap.chart.xScale.domain([0, app.data.nodes[sourceId].nrow])
    heatmap.chart.yScale.domain([0, app.data.nodes[sourceId].ncol])
    heatmap.chart.colorScale.domain([0, 5])
    heatmap.chart.update({
        i: d3.range(0, h1.length),
        x: d3.range(0, app.data.nodes[sourceId].ncol),
        y: d3.range(0, app.data.nodes[sourceId].nrow),
        c: h1,
    });

    $('#simulation-add').attr('disabled', false)
    $('#simulation-resume').attr('disabled', false)
}

heatmap.init = function(idx) {

    // $('#chart').empty()
    var height = parseInt($('#dataChart').data('height')) / app.simulation.recorders.length
    heatmap.chart = require(__dirname + '/core/heatmap-chart');
    heatmap.chart.init('#dataChart', {
        y: height * idx,
        height: height,
    });
    app.chart.xAxis(heatmap.chart);
    app.chart.yAxis(heatmap.chart);
    app.chart.xLabel(heatmap.chart, 'Neuron Row ID');
    app.chart.yLabel(heatmap.chart, 'Neuron Col ID');
}

module.exports = heatmap;