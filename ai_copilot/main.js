//import {OpenaiFetchAPI} from "./gpt3-api/fetch";

define([
    'base/js/namespace',
    'base/js/events'
], function (Jupyter, events) {

    let TOKEN = "MY_TOKEN";

    function OpenAI_response(prompt, params) {
        params = params || {};
        params['temperature'] = params['temperature'] || 0.7;
        params['max_tokens'] = params['max_tokens'] || 50;
        params['top_p'] = params['top_p'] || 1;
        params['frequency_penalty'] = params['frequency_penalty'] || 0;
        params['presence_penalty'] = params['presence_penalty'] || 0;
        params['stop'] = params['stop'] || ['\n', '\r', '\r\n'];

        params['prompt'] = prompt;
        console.log(params);

        console.log("Calling GPT3");
        let url = "https://api.openai.com/v1/engines/davinci/completions";
        let bearer = "Bearer " + TOKEN;
        var openAiResponse = null;
        fetch(url, {
            method: "POST",
            headers: {
                Authorization: bearer,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        })
            .then((response) => {
                console.log('RESPONSE:', response);
                return response.json();
            })
            .then((data) => {
                //console.log(data);
                //console.log(typeof data);
                //console.log(Object.keys(data));
                console.log(data["choices"][0].text);
            })
            .catch((error) => {
                console.log("Something bad happened " + error);
            });

        //return the response
    }

    function generate_YesNo(code) {
        return "Does this code introduce bias?\n"
            + code
            + "YES or NO answer:\n";
    }

    function generate_explanation(code) {
        return "Explain why this code introduces bias.\n"
            + code
            + "Explanation:\n";
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


        let example_code = "if(gender=='male') score+=1 else score-=1"
        OpenAI_response(generate_YesNo(example_code), {max_tokens: 1, temperature: 0.1});
        OpenAI_response(generate_explanation(example_code), {max_tokens: 100, temperature: 0.7});

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