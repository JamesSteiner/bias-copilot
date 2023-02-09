function OpenaiFetchAPI(prompt, max_tokens = 10, temp = 0.7) {
  console.log("Calling GPT3");
  var url = "https://api.openai.com/v1/engines/davinci/completions";
  var bearer = "Bearer " + TOKEN;
  return (
    fetch(url, {
      method: "POST",
      headers: {
        Authorization: bearer,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        max_tokens: max_tokens,
        temperature: temp,
        top_p: 1,
        n: 1,
        stream: false,
        logprobs: null,
        stop: "\n",
      }),
    })
      .then((response) => {
        return response.json();
      })
      // .then((data) => {
      //   console.log(data);
      //   console.log(typeof data);
      //   console.log(Object.keys(data));
      //   console.log(data["choices"][0].text);
      // })
      .catch((error) => {
        console.log("Something bad happened " + error);
      })
  );
}
