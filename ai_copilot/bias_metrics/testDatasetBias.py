import numpy as np
import pandas as pd
import math
import matplotlib.pyplot as plt
from typing import List, Union, Dict


def test_bias_dataset(dataset: Union[Union[np.ndarray, Dict[str, List]], pd.DataFrame],
                      sensitive_attr_names: List[str],
                      y_true: Union[List, np.ndarray],
                      y_advantage_labels: Union[object, List]):
    """
    Bug:
    Sometimes axes' sizes don't fit the figure.
    Repeatedly run the evaluation block don't show the figures.
    Solution: use "%matplotlib inline" instead of "%matplotlib notebook" (but disallow interactive graphs)
    TODO: make the graph more colorful
    TODO: (*optional) adjust column number based on feature number
    TODO: (*not sure if needed) use subplot2grid to join the distance graph with cond_prob, occupying an entire row
    """

    sensitive_features = pd.DataFrame(dataset)[sensitive_attr_names]
    y_true = np.array(y_true)
    distance_arr = []

    col_num = 2
    row_num = math.ceil(len(sensitive_attr_names) / col_num)
    fig1, axes = plt.subplots(nrows=row_num, ncols=col_num, layout='constrained',
                              sharey='row', squeeze=False)
    fig1.set_figwidth(9)
    for i in range(col_num - len(sensitive_attr_names) % col_num):
        fig1.delaxes(axes[row_num - 1][col_num - i - 1])
    plt.suptitle('Conditional Probability P(Y_true=advantageous | Sensitive_attr=x)')

    for i, sensitive_attr_name in enumerate(sensitive_attr_names):
        ax = axes[i // col_num][i % col_num]
        current_sensitive_feature = sensitive_features[sensitive_attr_name]
        subcategories = np.unique(current_sensitive_feature)
        x_axis = []
        y_axis = []
        for subcategory in subcategories:
            prob_y_d = y_true[current_sensitive_feature == subcategory]
            advantage = np.count_nonzero(np.isin(prob_y_d, y_advantage_labels))

            d = np.count_nonzero(current_sensitive_feature == subcategory)
            cond_prob = advantage / d

            x_axis.append(subcategory)
            y_axis.append(cond_prob)

        min_cond_prob = min(y_axis)
        max_cond_prob = max(y_axis)
        distance_arr.append(abs((min_cond_prob / max_cond_prob) - 1))

        bar = ax.bar(x_axis, y_axis)
        ax.bar_label(bar, fmt="%.3f", padding=3, fontsize='small')
        ax.set_ylim(0, 1)
        ax.set_xlabel(str(sensitive_attr_name))
        if i % col_num == 0:
            ax.set_ylabel('Conditional Probability')
        plt.setp(ax.get_xticklabels(), rotation=30, fontsize='x-small')

    fig2, ax = plt.subplots(1, 1, layout='constrained')
    bar = ax.bar(sensitive_attr_names, distance_arr)
    ax.bar_label(bar, fmt="%.3f", padding=3)
    ax.set_ylim(0, 1)
    ax.set_title('Difference between conditional probabilities across sensitive attributes')
    ax.set_xlabel('Sensitive feature names')
    plt.setp(ax.get_xticklabels(), rotation=30)
    ax.set_ylabel('Distance')
