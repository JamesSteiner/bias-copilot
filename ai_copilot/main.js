//import {OpenaiFetchAPI} from "./gpt3-api/fetch";

define([
    'base/js/namespace',
    'base/js/events'
], function (Jupyter, events) {

    let TOKEN = "Insert key";
    let COMMON_MISTAKES = 'from IPython.display import display, Javascript' 
    + '\ndisplay (Javascript ("""require('
    + '["base/js/dialog"],'
    + '    function(dialog) {'
    + '        dialog.modal({'
    + '            title: "Common falacies",'
    + '            body: "1. Ensure that you consider all groups within a population eg. for gender do not just do male and female groupings'
    + '                   2. Check whether the dataset you are using has inherent biases in it eg. if you use COMPAS racial bias is very likely'
    + '                   3. Remove protected attributes during pre-processing if possible eg. houshold income, race, age and demographic'
    + '                   4. Attempt to prevent overfitting your model eg. impose a limit of 5 on the number of passes you do on the dataset'
    + '                   5. Evaluate your model against some common bias metrics eg. demographic parity and equalised odds",'
    + '            buttons: {'
    + '                "Continue": {}'
    + '            }'
    + '        });'
    + '    }'
    + ');"""))'

    async function OpenAI_response(prompt, params) {
        params = params || {};
        params['max_tokens'] = params['max_tokens'] || 50;
        params['temperature'] = params['temperature'] || 0.5;
        params['presence_penalty'] = params['presence_penalty'] || 0;
        params['frequency_penalty'] = params['frequency_penalty'] || 0;
        params['best_of'] = params['best_of'] || 1;
        params['n'] = params['n'] || 1;
        //params['stop'] = params['stop'] || ['\n', '\r', '\r\n'];

        params['model'] = params['model'] || "text-davinci-003";
        params['prompt'] = prompt;
        console.log(params);

        console.log("Calling GPT3");
        let url = "https://api.openai.com/v1/completions";
        let bearer = "Bearer " + TOKEN;
        var openAiResponse = null;
        return fetch(url, {
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
                console.log('data', data);
                console.log('type', typeof data);
                console.log('keys', Object.keys(data));
                console.log('text', data["choices"][0].text);
                openAiResponse = data["choices"][0].text;
                return data["choices"][0].text;
            })
            .catch((error) => {
                console.log("Something bad happened " + error);
            });

        //console.log("GPT3 response: " + openAiResponse);
        //return openAiResponse;
    }

    function generate_YesNo(code) {
        /*return "Does this code introduce bias?\n"
            + code + "\n"
            + "YES or NO answer:\n";*/
        return code + "\n"
            + "Does this code introduce bias (continue with 'YES' or 'NO')?\n"
    }

    function generate_explanation(code) {
        return code + "\n"
            + "Explain (in 10-15 words) why this code introduces bias!\n";
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

    async function check_cell() {

        let codes = get_selected_codes();
        let content = "";

        /*let bias_count = 0;
        for (let i = 0; i < codes.length; i++) {
            bias_count += (codes[i].match(/bias/g) || []).length;
        }
        content = "#  Bias count: " + bias_count;*/

        let example_code = "";
        for (let i = 0; i < codes.length; i++) {
            example_code += codes[i] + "\n";
        }
        let openai_response_yesno = await OpenAI_response(generate_YesNo(example_code), {max_tokens: 20});
        console.log("GPT3 response: " + openai_response_yesno);
        content += "Does the code introduce bias?\n"
        content += openai_response_yesno;
        console.log(openai_response_yesno == "Yes" | openai_response_yesno == "YES" 
                    | openai_response_yesno == "\nYes" | openai_response_yesno == "\nYES")
        if (openai_response_yesno == "Yes" | openai_response_yesno == "YES"
                    | openai_response_yesno == "\nYes" | openai_response_yesno == "\nYES"){
            let openai_response_explain = await OpenAI_response(generate_explanation(example_code), {max_tokens: 100});
            console.log("GPT3 response: " + openai_response_explain);
            content += "\n\n";
            content += "Explanation:\n"
            content += openai_response_explain;
        }

        Jupyter.notebook.insert_cell_below('markdown').set_text(content);
        Jupyter.notebook.select_next();
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

    async function info_button() {
        Jupyter.notebook.insert_cell_below('code').set_text(COMMON_MISTAKES);
        Jupyter.notebook.select_next();
        Jupyter.notebook.execute_cell();
        Jupyter.notebook.cut_cell();
    }
    let infoButton = function () {
        Jupyter.toolbar.add_buttons_group([
            Jupyter.keyboard_manager.actions.register({
                'help': 'Common falacies',
                'icon': 'fa-info-circle',
                'handler': info_button
            }, 'check-cell', 'Info')
        ])
    }

    function insert_model_bias_cell(){
        var code = '"""\n'
            + 'View model(s)\'s performance and fairness in the Fairness Dashboard\n'
            + '\n'
            + 'Fairness metrics (see in the dashboard):\n'
            + '    Demographic Parity: measures whether predictions are independent of sensitive features\n'
            + '    Equalized Odds: measures whether the model performs equally well for different groups\n'
            + '\n'
            + 'Parameters:\n'
            + '    dataset (numpy.ndarray (structured), dict, or pandas.DataFrame): the dataset of the model(s)\'s input\n'
            + '    sensitive_attr_names (list[str]): the list of names of sensitive features in the dataset\n'
            + '    y_true (numpy.ndarray, or list[]): the array of true labels corresponding to each input data\n'
            + '    y_pred (numpy.ndarray, list[], or dict {str : list[]}): the prediction array of model(s)\n'
            + '        Single model: single array of predicitons\n'
            + '        Multiple models: a dictionary of format {model name : model\'s predictions}\n'
            +'\n'
            +'See also:\n'
            + '    Fairness metrics: https://fairlearn.org/main/user_guide/assessment/common_fairness_metrics.html\n'
            + '    FairnessDashboard documentation: https://fairlearn.org/v0.6.2/api_reference/fairlearn.widget.html\n'
            +'"""\n'
            +'\n'
            + 'from raiwidgets import FairnessDashboard\n'
            + 'testBias(dataset="""replace this with your input dataset""",\n'
            + '         sensitive_attr_names="""replace this with the name list of sensitive features""",\n'
            + '         y_true="""replace this with your true label array""",\n'
            + '         y_pred="""replace this with your predictions from the model(s)""")\n';

        Jupyter.notebook.insert_cell_below('code').set_text(code)
    }
    let metricsButton = function(){
        var action = {
            icon: 'bar-chart-o',
            description: 'Eval Model'
            help    : 'Insert a cell for model bias evaluation',
            handler : insert_model_bias_cell
        };
        Jupyter.toolbar.add_buttons_group([Jupyter.actions.register(action, 'model-bias-cell', 'Metrics')])
    }

    // Run on start
    function load_ipython_extension() {
        // Add a default cell if there are no cells
        /*if (Jupyter.notebook.get_cells().length === 1) {
            check_cell();
        }*/
        defaultCellButton();
        infoButton();
        metricsButton();
    }

    return {
        load_ipython_extension: load_ipython_extension
    };
});