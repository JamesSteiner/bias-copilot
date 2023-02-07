//import {OpenaiFetchAPI} from "./gpt3-api/fetch";

define([
    'base/js/namespace',
    'base/js/events'
], function (Jupyter, events) {

    let TOKEN = "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"

    function OpenaiFetchAPI() {
        console.log("Calling GPT3");
        var url = "https://api.openai.com/v1/engines/davinci/completions";
        var bearer = "Bearer " + TOKEN;
        fetch(url, {
            method: "POST",
            headers: {
                Authorization: bearer,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: "Once upon a time",
                max_tokens: 5,
                temperature: 1,
                top_p: 1,
                n: 1,
                stream: false,
                logprobs: null,
                stop: "\n",
            }),
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data);
                console.log(typeof data);
                console.log(Object.keys(data));
                console.log(data["choices"][0].text);
            })
            .catch((error) => {
                console.log("Something bad happened " + error);
            });
    }

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

        OpenaiFetchAPI();


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