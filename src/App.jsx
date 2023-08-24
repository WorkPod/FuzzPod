import { useState, useEffect } from "react";
import "./App.css";
import "./TT Octosquares Trial Compressed Regular.ttf";
import { Configuration, OpenAIApi } from "openai";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  a11yDark,
  vs,
  vs2015,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import MonacoEditor from "react-monaco-editor";
import "./userWorker";
import copy from "copy-to-clipboard";
import { Disclosure, Menu } from "@headlessui/react";
import SideBar from "./components/SideBar";

function App() {
  const [response, setResponse] = useState({
    data: {
      choices: [
        {
          message: {
            content: `
                        List of invariants:
            1. The owner of the contract must be a payable address.
            2. The constructor of the contract must be payable.
            3. The balance of the contract should be automatically updated when Ether is deposited.
            4. The "deposit" function should be callable along with some Ether.
            5. The "notPayable" function should not be callable with Ether.
            6. The "withdraw" function should send all Ether stored in the contract to the owner.
            7. The "transfer" function should send a specified amount of Ether from the contract to a specified address.
                      `,
          },
        },
      ],
    },
  });

  const [textValue, setTextValue] = useState(`// SPDX-License-Identifier: MIT
  pragma solidity ^0.8.20;
  
  contract Payable {
      // Payable address can receive Ether
      address payable public owner;
  
      // Payable constructor can receive Ether
      constructor() payable {
          owner = payable(msg.sender);
      }
  
      // Function to deposit Ether into this contract.
      // Call this function along with some Ether.
      // The balance of this contract will be automatically updated.
      function deposit() public payable {}
  
      // Call this function along with some Ether.
      // The function will throw an error since this function is not payable.
      function notPayable() public {}
  
      // Function to withdraw all Ether from this contract.
      function withdraw() public {
          // get the amount of Ether stored in this contract
          uint amount = address(this).balance;
  
          // send all Ether to owner
          // Owner can receive Ether since the address of owner is payable
          (bool success, ) = owner.call{value: amount}("");
          require(success, "Failed to send Ether");
      }
  
      // Function to transfer Ether from this contract to address from input
      function transfer(address payable _to, uint _amount) public {
          // Note that "to" is declared as payable
          (bool success, ) = _to.call{value: _amount}("");
          require(success, "Failed to send Ether");
      }
  }  
  `);
  const [apiKey, setApiKey] = useState("");
  const [listItems, setListItems] = useState([]);

  const convertToListItems = () => {
    const lines = response.data.choices[0].message.content.split("\n");
    const points = lines
      .map((line) => line.trim())
      .filter((line) => /^\d+\.\s/.test(line))
      .map((point) => point.replace(/^\d+\.\s/, "").trim())
      .map((item, i) => {
        return { invariant: item, code: "" };
      });

    console.log(points);
    setListItems(points);
  };

  useEffect(async () => {
    if (!response.data.choices[0].message.content) return;
    await convertToListItems();
  }, []);

  const createFuzz = async () => {
    const configuration = new Configuration({
      apiKey: apiKey,
    });
    const openai = new OpenAIApi(configuration);
    const chat_completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0.0,
      messages: [
        {
          role: "system",
          content: `Extract a list of invariants from the following text. An invariant is a statement that describes a property or condition that should hold true throughout the execution of a program.`,
        },
        {
          role: "user",
          content: textValue,
        },
      ],
    });
    console.log(chat_completion);
    setResponse(chat_completion);
    await convertToListItems();
  };

  const requestTestSnippet = async (index) => {
    const configuration = new Configuration({
      apiKey: apiKey,
    });
    const openai = new OpenAIApi(configuration);
    const code_examples = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0.0,
      messages: [
        {
          role: "system",
          content: `Create a Hardhat fuzz test for the invariant provided by the user. The invariant states that specific conditions must be upheld in the contract.

            Write a Hardhat fuzz test that simulates various scenarios to validate these invariants. Your test should include cases that cover different situations and edge cases to ensure the contract behavior aligns with the stated invariants.
            
            Your test case should be written in Solidity using Hardhat's testing framework. Ensure that you properly set up the contract and simulate relevant actions, such as deposits, transfers, and withdrawals.
            
            Respond with Hardhat Fuzz Test:
            `,
        },
        {
          role: "user",
          content: listItems[index].invariant,
        },
      ],
    });

    let codeReply = code_examples.data.choices[0].message.content;
    const startMarker = "```solidity";
    const endMarker = "```";
    const startIndex = codeReply.indexOf(startMarker);
    const restOfString = codeReply.substring(startIndex + startMarker.length);
    const endIndex =
      restOfString.indexOf(endMarker) + startIndex + startMarker.length;
    const textBeforeCode = codeReply.substring(0, startIndex).trim();
    const codeBlock = codeReply
      .substring(startIndex + startMarker.length, endIndex)
      .trim();
    const textAfterCode = codeReply
      .substring(endIndex + endMarker.length)
      .trim();
    // console.log(startIndex);
    // console.log(endIndex);
    // console.log(textBeforeCode);
    // console.log(codeBlock);
    // console.log(textAfterCode);
    let tempChangedInvariants = [...listItems];
    tempChangedInvariants[index].intro = textBeforeCode;
    tempChangedInvariants[index].code = codeBlock;
    tempChangedInvariants[index].outro = textAfterCode;
    setListItems([...tempChangedInvariants]);
  };

  const copySnippet = async (snippet) => {
    console.log(snippet);
    await copy(snippet, {
      debug: true,
      message: "Press #{key} to copy",
    });
  };

  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
  };

  const onCodeChange = async (newValue, e) => {
    console.log("onChange", newValue, e);
    setTextValue(newValue);
  };

  const options = {
    renderSideBySide: false,
    automaticLayout: true,
    minimap: {
      enabled: false,
    },
    fontFamily: "monospace",
  };

  return (
    <div className="w-screen bg-[#151414] text-gray-200">
      <SideBar
        apiKey={apiKey}
        onFuzz={createFuzz}
        handleApiKeyChange={handleApiKeyChange}
      />
      <div className="flex flex-row gap-y-40 overflow-hidden justify-start items-end self-end text-gray-200 ml-48 ">
        <div className="w-full h-screen flex flex-row">
          <div className="w-1/2 h-screen">
            {/* <div className="w-full h-10 bg-red-600"></div> */}
            <MonacoEditor
              language="sol"
              original="..."
              value={textValue}
              options={options}
              theme="vs-dark"
              onChange={onCodeChange}
            />
          </div>
          <div className="w-1/2 bg-[#1d1d1d] overflow-y-scroll border-l-4 border-[#343434]">
            <div className=" w-full self-start text-sm px-4">
              <p className="text-lg mb-8 mt-2">Potential invariants:</p>
              <ul className="">
                {listItems.map((item, index) => (
                  <li
                    className="bg-[#2d2d2d] my-4 flex flex-col items-center rounded-md py-1 px-2"
                    key={index}
                  >
                    <Disclosure>
                      <Disclosure.Button className="py-2 w-full text-start font-semibold">
                        <div className="flex w-full gap-2 cursor-pointer items-center">
                          <button className="w-6 h-full">
                            <svg
                              id="Expand_Arrow_24"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                              className="cursor-pointer "
                            >
                              <rect
                                width="24"
                                height="24"
                                stroke="none"
                                fill="#dddddd"
                                opacity="0"
                              />

                              <g
                                transform="matrix(0.83 0 0 0.83 12 12)"
                                fill="#dddddd"
                              >
                                <path
                                  transform=" translate(-13, -13.77)"
                                  d="M 13 15.40625 L 21.765625 6.820313 C 22.15625 6.4375 22.78125 6.441406 23.171875 6.828125 L 24.707031 8.363281 C 25.097656 8.757813 25.097656 9.390625 24.703125 9.78125 L 13.707031 20.707031 C 13.511719 20.902344 13.257813 21 13 21 C 12.742188 21 12.488281 20.902344 12.292969 20.707031 L 1.296875 9.78125 C 0.902344 9.390625 0.902344 8.757813 1.292969 8.363281 L 2.828125 6.828125 C 3.21875 6.441406 3.84375 6.4375 4.234375 6.820313 Z"
                                  stroke-linecap="round"
                                />
                              </g>
                            </svg>
                          </button>
                          {item.invariant}
                        </div>
                      </Disclosure.Button>
                      <Disclosure.Panel className="w-full h-full text-gray-200 flex flex-col gap-4 px-4 py-2">
                        <button
                          className="bg-[#1d1d1d] hover:bg-[#1d1d1d]/60 text-white rounded py-1 px-2 font-semibold ml-3"
                          type="button"
                          onClick={() => requestTestSnippet(parseInt(index))}
                        >
                          Generate Tests
                        </button>
                        {item.intro != "" && item.intro ? (
                          <>{item.intro}</>
                        ) : (
                          ""
                        )}
                        {item.code != "" ? (
                          <div className="w-full h-full relative text-gray-200 py-2 px-4 bg-[#1d1d1d] rounded-md">
                            <svg
                              id="Copy_24"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                              className="absolute right-2 top-2 text-gray-200 cursor-pointer "
                              onClick={() => copySnippet(item.code)}
                            >
                              <rect
                                width="24"
                                height="24"
                                stroke="none"
                                fill="#dddddd"
                                opacity="0"
                              />

                              <g transform="matrix(1 0 0 1 12 12)">
                                <path
                                  fill="#dddddd"
                                  transform=" translate(-12, -12)"
                                  d="M 4 2 C 2.895 2 2 2.895 2 4 L 2 18 L 4 18 L 4 4 L 18 4 L 18 2 L 4 2 z M 8 6 C 6.895 6 6 6.895 6 8 L 6 20 C 6 21.105 6.895 22 8 22 L 20 22 C 21.105 22 22 21.105 22 20 L 22 8 C 22 6.895 21.105 6 20 6 L 8 6 z M 8 8 L 20 8 L 20 20 L 8 20 L 8 8 z"
                                  stroke-linecap="round"
                                />
                              </g>
                            </svg>

                            <SyntaxHighlighter
                              title="Copy"
                              language="solidity"
                              style={vs2015}
                              className="bg-[#2d2d2d] text-sm cursor-pointer"
                              wrapLines={true}
                              wrapLongLines={true}
                              // onClick={copySnippet("a")}
                              onClick={() => copySnippet(item.code)}
                            >
                              {item.code}
                            </SyntaxHighlighter>
                          </div>
                        ) : (
                          ""
                        )}
                        {item.outro != "" && item.outro ? (
                          <>{item.outro}</>
                        ) : (
                          ""
                        )}
                      </Disclosure.Panel>
                    </Disclosure>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
