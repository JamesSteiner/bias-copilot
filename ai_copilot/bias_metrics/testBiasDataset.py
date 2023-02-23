from typing import List, Union, Dict
import numpy as np
import pandas as pd


# Discrimination control: check if P(Y=advantage | D=d1) = P(Y=advantage | D=d2),
# measure the difference by a distance function
# Output: for each sensitive attribute, output conditional probability for every of its value,
# and the max distance

def test_bias_dataset(dataset: Union[Union[np.ndarray, Dict[str, List]], pd.DataFrame],
                      sensitive_attr_names: List[str],
                      y_true: Union[List, np.ndarray],
                      y_advantage_labels: Union[List, object],
                      distance_fun=lambda x, y: abs(x / y - 1)):
    y_advantage = np.isin(y_true, y_advantage_labels)
    sensitive_attrs = pd.DataFrame(dataset)[sensitive_attr_names]
    discriminatory_set = {col: np.unique(sensitive_attrs[col]) for col in sensitive_attrs.columns}

    print("Discrimination metric for each sensitive feature (0 for fair, 1 for unfair), \n"
          + "& Frequency of having advantageous (favorable) label(s) for each sensitive feature value:")

    for sensitive_attr_name in sensitive_attr_names:
        discriminatory_values = discriminatory_set[sensitive_attr_name]
        yd_cnts = {d: np.count_nonzero(y_advantage[sensitive_attrs[sensitive_attr_name] == d])
                   for d in discriminatory_values}
        d_cnts = {d: np.count_nonzero(sensitive_attrs[sensitive_attr_name] == d)
                  for d in discriminatory_values}
        cond_prob = {d: yd_cnts[d] / d_cnts[d] for d in discriminatory_values}
        distance = distance_fun(min(cond_prob.values()), max(cond_prob.values()))

        res = pd.DataFrame(cond_prob, index=[sensitive_attr_name])
        res.insert(0, "Discrimination Metric", distance)
        print(res)
