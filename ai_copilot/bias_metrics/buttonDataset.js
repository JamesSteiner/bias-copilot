  async function insert_dataset_bias_cell() {
    var code =
      '"""\n' +
      "Evaluate a dataset's fairness\n" +
      "\n" +
      "Discrimination metric: dependence rate of y_true label on sensitive features\n" +
      "    Fomula: the difference between lowest & highest P(y|d) for each sensitive feature,\n" +
      "        where y is the advantageous (favorable) label(s), d takes sensitive feature values.\n" +
      "        Difference is computed based on a distance function.\n" +
      "\n" +
      "Parameters:\n" +
      "    dataset (numpy.ndarray (structured), dict, or pandas.DataFrame): the dataset\n" +
      "    sensitive_attr_names (list[str]): the list of names of sensitive features in the dataset\n" +
      "    y_true (numpy.ndarray, or list[]): the array of true labels corresponding to each input data\n" +
      "    y_advantage_labels (list[], or a value): the value(s) for advantageous (favorable) label(s)\n" +
      "    distance_fun (function(float, float) -> float): customise the distance function for metric calculation,\n" +
      "        default as J(x,y) = abs(x/y - 1)\n" +
      "See also:\n" +
      "    Optimized Data Pre-Processing for Discrimination Prevention (Calmon et al., 2017)\n" +
      '"""\n' +
      "from jupyter_contrib_nbextensions.nbextensions.ai_copilot.bias_metrics.testBiasDataset import test_bias_dataset\n" +
      'test_bias_dataset(dataset="""replace this with your dataset""",\n' +
      '         sensitive_attr_names="""replace this with the name list of sensitive features""",\n' +
      '         y_true="""replace this with your true label array""",\n' +
      '         y_advantage_labels="""replace this with advantageous label values""",\n' +
      '         distance_fun=lambda x, y: abs(x / y - 1))';

    Jupyter.notebook.insert_cell_below("code").set_text(code);
    Jupyter.notebook.select_next();
  }

  let metricsButton = function () {
    var action = {
      icon: "fa-table",
      help: "Insert a cell for dataset discrimination evaluation",
      handler: insert_dataset_bias_cell,
    };
    Jupyter.toolbar.add_buttons_group([
      Jupyter.actions.register(action, "dataset-bias-cell", "Metrics"),
    ]);
  };