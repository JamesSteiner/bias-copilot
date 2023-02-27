import tkinter
import numpy as np
import pandas as pd
import math
import matplotlib
import matplotlib.pyplot as plt
matplotlib.use('TkAgg')
from typing import List, Union, Dict

def test_bias_dataset(dataset: Union[Union[np.ndarray, Dict[str, List]], pd.DataFrame],
                      sensitive_attr_names: List[str],
                      y_true: Union[List, np.ndarray],
                    y_advantage_labels: Union[object, List]):
    sensitive_features = pd.DataFrame(dataset)[sensitive_attr_names]
    distance_arr = []
    
    b = math.ceil(len(sensitive_attr_names)/2)
    plt.subplots(constrained_layout=True, figsize = (10,10))
    plt.suptitle('Conditional Probability based on true values')
    
    for i, sensitive_attr_name in enumerate(sensitive_attr_names):
        ax = plt.subplot(b, 2, i+1)
        current_sensitive_feature = sensitive_features[sensitive_attr_name]
        subcategories = np.unique(current_sensitive_feature)
        x_axis = []
        y_axis = []
        for subcategory in subcategories:
            prob_y_d = y_true[current_sensitive_feature == subcategory]
            advantage = np.count_nonzero(np.isin(prob_y_d, y_advantage_labels))
            
            d = np.count_nonzero(current_sensitive_feature== subcategory)
            cond_prob = advantage / d
            
            x_axis.append(subcategory)
            y_axis.append(cond_prob)
            
        min_cond_prob = min(y_axis)
        max_cond_prob = max(y_axis)
        distance_arr.append(abs((min_cond_prob /max_cond_prob) -1))
        
        ax.bar(x_axis, y_axis)
        ax.set(xlabel=str(sensitive_attr_name), ylabel='Conditional Probability')
        plt.setp(ax.get_xticklabels(), rotation=30, horizontalalignment='right', fontsize='x-small')
    plt.show()

    plt.bar(sensitive_attr_names, distance_arr)
    plt.title('Distance between sensitive features')
    plt.xlabel('Sensitive feature names')
    plt.xticks(rotation=30)
    plt.ylabel('Distance')
    plt.tight_layout()
    plt.show()
