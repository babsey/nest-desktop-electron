"use strict"

var nodeController = {};

nodeController.npop = (node) => {
    if (node.element_type == 'recorder') return
    var nodeDefaults = app.config.nest('node');
    var nodeElem = $('#nodes').find('.node[data-id=' + node.id + '] .content');

    var options = nodeDefaults.npop;
    options.value = node.n || 1;
    app.slider.create_dataSlider('#nodes .node[data-id=' + node.id + '] .nodeSlider', options.id, options)
        .on('slideStop', (d) => {
            app.data.nodes[node.id].n = d.value
            // app.graph.init()
            app.simulation.simulate.init()
            // app.simulation.reload()
        })

    nodeElem.find('input.nVal')
        .addClass('disableOnRunning')
        .on('change', function() {
            var value = $(this).val();
            var schema = $(this).data('schema');
            var valid = app.validation.validate(value, schema)
            $(this).parents('.form-group').toggleClass('has-success', valid.error == null)
            $(this).parents('.form-group').toggleClass('has-error', valid.error != null)
            $(this).parents('.form-group').find('.help-block').html(valid.error)
            if (valid.error != null) return
            node.n = valid.value;
            app.slider.view_dataSlider()
            app.slider.update_dataSlider(node, 'n', node.n, node.n)
            $('#chart svg').empty()
            // app.graph.init()
            app.simulation.simulate.init()
            // app.simulation.reload()
        })

    nodeElem.find('.eraser').on('click', function() {
            node.n = 1;
            app.slider.update_dataSlider(node, 'n', node.n, node.n)
            // app.graph.init()
            app.simulation.simulate.init()
            // app.simulation.reload()
        })
}

module.exports = nodeController;
