  async function insert_model_bias_cell() {
    var code =
      '"""\n' +
      "View model(s)'s performance and fairness in the Fairness Dashboard\n" +
      "\n" +
      "Fairness metrics (see in the dashboard):\n" +
      "    Demographic Parity: measures whether predictions are independent of sensitive features\n" +
      "    Equalized Odds: measures whether the model performs equally well for different groups\n" +
      "\n" +
      "Parameters:\n" +
      "    dataset (numpy.ndarray (structured), dict, or pandas.DataFrame): the dataset of the model(s)'s input\n" +
      "    sensitive_attr_names (list[str]): the list of names of sensitive features in the dataset\n" +
      "    y_true (numpy.ndarray, or list[]): the array of true labels corresponding to each input data\n" +
      "    y_pred (numpy.ndarray, list[], or dict {str : list[]}): the prediction array of model(s)\n" +
      "        Single model: single array of predicitons\n" +
      "        Multiple models: a dictionary of format {model name : model's predictions}\n" +
      "\n" +
      "See also:\n" +
      "    Fairness metrics: https://fairlearn.org/main/user_guide/assessment/common_fairness_metrics.html\n" +
      "    FairnessDashboard documentation: https://fairlearn.org/v0.6.2/api_reference/fairlearn.widget.html\n" +
      '"""\n' +
      "from jupyter_contrib_nbextensions.nbextensions.ai_copilot.bias_metrics.testBiasModel import test_bias_model\n" +
      'test_bias_model(dataset="""replace this with your input dataset""",\n' +
      '         sensitive_attr_names="""replace this with the name list of sensitive features""",\n' +
      '         y_true="""replace this with your true label array""",\n' +
      '         y_pred="""replace this with your predictions from the model(s)""")';

    Jupyter.notebook.insert_cell_below("code").set_text(code);
    Jupyter.notebook.select_next();
  }

  let metricsButton = function () {
    var action = {
      icon: "fa-bar-chart-o",
      //            description: 'Eval Model'
      help: "Insert a cell for model bias evaluation",
      handler: insert_model_bias_cell,
    };
    Jupyter.toolbar.add_buttons_group([
      Jupyter.actions.register(action, "model-bias-cell", "Metrics"),
    ]);
  };