# API Key
to use the GPT3 API, we need a GPT3 API Key

we can get it by
- after we log in to our account on its website
- click profile pic and select `View API Keys`
- generate one if there is none

then we create a `.env` file in the current directory
and put `OPENAI_API_KEY="YOUR_KEY"` into it 

in the js script, we use `process.env.OPEN_API_KEY` to access it

we don't put the `.env` file on github because it would leak our API key

# Usage

now, it is just a simple test showing we can indeed use the API

use `node main.js` to run the test, it should output something like "This is indeed a test!"