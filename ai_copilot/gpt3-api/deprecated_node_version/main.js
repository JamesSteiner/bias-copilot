const openAiFunction = require("./gpt3.js").openAiFunction;
require("dotenv").config();

const prompt = `Say this is a test:\n`;
(async () => {
  const output = await openAiFunction(prompt, 0.7, 250);
  console.log(output);
})();
