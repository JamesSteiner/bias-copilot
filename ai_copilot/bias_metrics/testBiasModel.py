from typing import List, Union, Dict
import numpy as np
import pandas as pd


def test_bias_model(dataset: Union[Union[np.ndarray, Dict[str, List]], pd.DataFrame],
                    sensitive_attr_names: List[str],
                    y_true: Union[List, np.ndarray],
                    y_pred: Union[Union[List, np.ndarray], Dict[str, List]]):
    data = pd.DataFrame(dataset)
    sensitive_attrs = data[sensitive_attr_names]
    print('Click on the link below to open the dashboard:')

    from raiwidgets import FairnessDashboard
    FairnessDashboard(sensitive_features=sensitive_attrs,
                      y_true=y_true,
                      y_pred=y_pred)