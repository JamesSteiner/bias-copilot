define([
    'base/js/namespace',
    'base/js/events'
], function (Jupyter, events) {

    function get_selected_codes() {
        let cells = Jupyter.notebook.get_selected_cells();
        let codes = [];
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].cell_type === 'code') {
                codes.push(cells[i].get_text());
            }
        }
        return codes;
    }

    let check_cell = function () {

        let codes = get_selected_codes();

        let bias_count = 0;
        for (let i = 0; i < codes.length; i++) {
            bias_count += (codes[i].match(/bias/g) || []).length;
        }
        let content = "#  Bias count: " + bias_count;


        Jupyter.notebook.insert_cell_below('code').set_text(content);
        Jupyter.notebook.select_next();
        Jupyter.notebook.execute_cell();
        Jupyter.notebook.select_prev();
    };
    let defaultCellButton = function () {
        Jupyter.toolbar.add_buttons_group([
            Jupyter.keyboard_manager.actions.register({
                'help': 'Check current cell',
                'icon': 'fa-play-circle',
                'handler': check_cell
            }, 'check-cell', 'Check cell')
        ])
    }

    // Run on start
    function load_ipython_extension() {
        // Add a default cell if there are no cells
        /*if (Jupyter.notebook.get_cells().length === 1) {
            check_cell();
        }*/
        defaultCellButton();
    }

    return {
        load_ipython_extension: load_ipython_extension
    };
});