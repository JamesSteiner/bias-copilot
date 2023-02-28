# Eval Data

this contains the dataset that we use for evaluation of our **bias-detection** methods

2 sources of data

1. real code
2. AI-generated code

## GPT prompts for generating data

While writing python code in the domain of machine learning, developers may subconsciously or purposely write code that would result in bias (such as gender, age, race or socio-economic status or other things) in the final model. Give me some an example of such python jupyter notebook code blocks, the code blocks should be realistic as in it could appear in any real codebase for research or product development in the industry. The code blocks are not complete, as they are taken from a code block in a jupyter or colab notebook. Each code block should be at least 10 lines long.

Code block:

---

## Observations of Prompt

Prompt Chosen:

```
Code: ...

Tell me whether the above python code about machine learning has any potential of introducing algorithmic bias. Give an yes or no answer, then explain your reasoning.
```

observation

- the word 'potential' results in much lower chance of false negatives, but higher chance of false positives
- GPT3 seems to be pretty familiar with the definition of "algorithmic bias", and it performs better compared to the prompt where the definition of algorithic bias is given.

---
