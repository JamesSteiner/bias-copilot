# Bias Metrics
## Setup for Microsoft Fairlearn

The first step is to install ```raiwidgets``` module. This is required for the Fairlearn dashboard. 
Currently, ```raiwidgets``` is only compatible with python version 3.7, 3.8 or 3.9.

### Windows
First run ```pip install raiwidgets --user``` 

#### Error correction
• If pip “failed to uninstall llvmlite”: go to the ~/Lib/site-packages, delete the file similar to “llvmlite-0.38.0-py3.9.egg-info”. 

• If pip “failed to install llvmlite”: make sure you are in Python 3.9. 

• Download .whl files of llvmlite into ~/Lib/site-packages from https://www.lfd.uci.edu/~gohlke/pythonlibs/#llvmlite 

• If the extended buttons don’t show up, try to restart the kernel, shutdown the notebook and reopen it.

### MacOS - Intel
First run ```brew install libomp ```.

If there are any problems with this installation, I would recommend uninstalling and then reinstalling homebrew.

Then run ```pip install raiwidgets```. 
Please make sure to restart the jupyter kernel after installing.

The Fairlearn dashboard uses localhost:5000. If there is an issue when loading in the browser, turn off airplay sharing via Settings.

### MacOS - M1
Currently, there does not seem to be support for the ```raiwidgets``` module due to problems with installation.


## Setup for Dataset evaluation
You need to make sure that your device is using the latest version of ```matplotlib```.

Run ```pip show matplotlib``` to find out the version of ```matplotlib``` you are currently running.

Run ```pip install matplotlib -U``` to upgrade the version of ```matplotlib```.
