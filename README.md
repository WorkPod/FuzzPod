# FuzzPod

AI-automated generation of invariants for smart contracts fuzz testing

Currently hosted at [this page](https://fuzzpod.vercel.app).

# Setup

- run `npm i` to install dependencies
- run `npm run dev` to run on localhost

# Usage

Web app includes example test data that is loaded in the start.

- input OpenAI API key in the webapp to be able to use their LLM(you're going to be billed based on your usage)
- Paste Solidity code into and click on thefuzz button to generate potential invariants
- Explore invariants and generate tests by expanding individual elements
- Paste generated tests in your IDE

# Limitations

- Currently the web app generates just one kind of tests
- The option to import files from Github / export files is not yet implemented
- The API won't process files over limit of tokens depending on specific LLM that is used(you can read more about it in the OpenAI docs)
