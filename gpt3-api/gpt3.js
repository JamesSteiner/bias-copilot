async function openAiFunction(prompt, temperature, maxTokens) {
  var output = "";
  const got = require("got");
  const url = "https://api.openai.com/v1/completions";
  const params = {
    prompt: prompt,
    model: "text-davinci-003",
    max_tokens: maxTokens,
    temperature: temperature,
    frequency_penalty: 0,
  };
  const headers = {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  };

  try {
    const response = await got
      .post(url, { json: params, headers: headers })
      .json();
    output = response.choices[0].text;
  } catch (err) {
    console.log(err);
  }
  return output;
}

module.exports = { openAiFunction };
