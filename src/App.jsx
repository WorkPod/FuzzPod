import { useState, useEffect } from "react";
import "./App.css";
import "./TT Octosquares Trial Compressed Regular.ttf";
import { Configuration, OpenAIApi } from "openai";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { highlight, languages } from "highlight.js";
import CodeEditor from "@uiw/react-textarea-code-editor";

function App() {
  const [response, setResponse] = useState(null);
  const [textValue, setTextValue] = useState("");
  const [apiKey, setApiKey] = useState(
    "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"
  );

  useEffect(() => {}, []);

  const createFuzz = async () => {
    const configuration = new Configuration({
      apiKey: apiKey,
    });
    const openai = new OpenAIApi(configuration);
    const chat_completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You will be provided with a piece of Solidity and your goal is to analyze it, then create a set of invariants for fuzz testing this code. Reply only with list of invariants without any other text.",
        },
        {
          role: "user",
          content: textValue,
        },
      ],
    });
    console.log(chat_completion);
    setResponse(chat_completion);

    // const code_examples = await openai.createChatCompletion({
    //   model: "gpt-3.5-turbo",
    //   messages: [
    //     {
    //       role: "system",
    //       content:
    //         "You will be provided with a piece of Solidity and your goal is to analyze it, then create a set of invariants for fuzz testing this code. Reply only with list of invariants without any other text.",
    //     },
    //     {
    //       role: "user",
    //       content: textValue,
    //     },
    //   ],
    // });
  };

  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
  };

  return (
    <div className="min-h-screen bg-[#151414] text-gray-800 w-full overflow-hidden">
      {/* <div className="w-full flex-shrink-0 pl-16 h-16 bg-gray-100 flex text-center justify-start items-center">
        <img
          src="/vector logos-09.svg"
          alt=""
          srcset=""
          className="w-24 h-24"
        />
      </div> */}
      <div className="flex flex-col gap-y-40 w-full overflow-hidden justify-between items-end relative right-0 self-end text-gray-200">
        <div className="h-screen flex flex-col items-center justify-center w-1/5 bg-[#1d1d1d] fixed left-0 z-40 border-r-4 border-[#343434]">
          <span>OpenAI API key:</span>
          <input
            className="bg-[#3d3d3d] text-gray-200 overflow-hidden text-xs rounded p-1 my-4"
            type="text"
            id="api-key"
            value={apiKey}
            onChange={handleApiKeyChange}
            placeholder="Enter your OpenAI API key..."
          />
          <button
            className="bg-gray-800 text-white rounded py-1 px-2"
            type="button"
            onClick={() => createFuzz()}
          >
            fuzz
          </button>
          {/* {response ? response.data.choices[0].message.content : ""} */}
        </div>
        <div className="h-min-xl min-h-screen h-full w-4/5 relative right-0 top-0 self-end flex flex-col bg-[#2d2d2d] gap-4">
          <div className="w-full flex flex-row">
            <CodeEditor
              className="h-full h-min-screen min-h-screen w-1/2 relative right-0 self-end mb-48 border-r-4 border-[#343434]"
              value={textValue}
              language="solidity"
              placeholder="Paste your Solidity code here..."
              onChange={(evn) => setTextValue(evn.target.value)}
              padding={15}
              style={{
                fontSize: 12,
                backgroundColor: "#2d2d2d",
                fontFamily:
                  "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
              }}
            />
            <div className="h-full h-min-screen min-h-screen w-1/2 relative right-0 self-end mb-48 bg-[#2d2d2d] text-sm px-4">
              <p className="text-lg mb-8 mt-2">Analysis:</p>
              <SyntaxHighlighter
                language="solidity"
                style={a11yDark}
                className="bg-[#2d2d2d] text-sm"
              >
                {/* {textValue} */}
                {response
                  ? response.data.choices[0].message.content
                  : "Waiting for user to provide   Solidity code..."}
              </SyntaxHighlighter>
            </div>
          </div>
          <div className="right-0 w-5/6 h-48 overflow-auto bg-[#1d1d1d] fixed bottom-0 z-30 px-16 py-2 text-gray-400 text-xs border-t-4 border-[#343434] break-all ">
            {response
              ? response.data.choices[0].message.content
              : "Waiting for user to provide   Solidity code..."}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
