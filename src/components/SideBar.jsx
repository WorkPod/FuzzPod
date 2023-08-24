import React from "react";
import { Disclosure, Menu } from "@headlessui/react";

const SideBar = ({ apiKey, onFuzz, handleApiKeyChange }) => {
  return (
    <div className="h-screen flex flex-col items-center justify-start py-24 w-48 bg-[#2d2d2d] fixed left-0 z-40 border-r-4 border-[#343434]">
      <span>OpenAI API key:</span>
      <input
        className="bg-[#3d3d3d] text-gray-200 overflow-hidden text-xs rounded p-1 my-4"
        id="api-key"
        value={apiKey}
        onChange={handleApiKeyChange}
        placeholder="OpenAI API key..."
        type="password"
      />
      <button
        className="bg-[#1d1d1d] hover:bg-[#1d1d1d]/60 text-white rounded py-1 px-2 font-semibold w-4/5"
        type="button"
        onClick={() => onFuzz()}
      >
        fuzz
      </button>
      <div className="py-2 w-full text-start flex flex-col whitespace-break-spaces center items-center">
        <span className="mt-16">Coming Soon:</span>{" "}
        <button
          className="opacity-75 bg-[#1d1d1d] hover:bg-[#1d1d1d]/60 text-white rounded py-1 px-2 font-semibold my-4 w-4/5"
          type="button"
          disabled
          // onClick={() => createFuzz()}
        >
          Github Import
        </button>
        <Menu>
          <Menu.Button className="bg-[#1d1d1d] w-5/6 rounded-md flex justify-start gap-2 font-semibold px-2 py-1">
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

              <g transform="matrix(0.83 0 0 0.83 12 12)" fill="#dddddd">
                <path
                  transform=" translate(-13, -13.77)"
                  d="M 13 15.40625 L 21.765625 6.820313 C 22.15625 6.4375 22.78125 6.441406 23.171875 6.828125 L 24.707031 8.363281 C 25.097656 8.757813 25.097656 9.390625 24.703125 9.78125 L 13.707031 20.707031 C 13.511719 20.902344 13.257813 21 13 21 C 12.742188 21 12.488281 20.902344 12.292969 20.707031 L 1.296875 9.78125 C 0.902344 9.390625 0.902344 8.757813 1.292969 8.363281 L 2.828125 6.828125 C 3.21875 6.441406 3.84375 6.4375 4.234375 6.820313 Z"
                  stroke-linecap="round"
                />
              </g>
            </svg>
            <div>Test type</div>
          </Menu.Button>
          <Menu.Items className="w-full">
            <Menu.Item disabled>
              <span className="opacity-75 flex flex-col whitespace-break-spaces center items-center bg-[#1d1d1d] w-4/5 rounded-md justify-around mx-auto mt-1 px-2 py-1">
                Hardhat
              </span>
            </Menu.Item>
            <Menu.Item disabled>
              <span className="opacity-75 flex flex-col whitespace-break-spaces center items-center bg-[#1d1d1d] w-4/5 rounded-md justify-around mx-auto mt-1 px-2 py-1">
                Foundry
              </span>
            </Menu.Item>
            <Menu.Item disabled>
              <span className="opacity-75 flex flex-col whitespace-break-spaces center items-center bg-[#1d1d1d] w-4/5 rounded-md justify-around mx-auto mt-1 px-2 py-1">
                Echidna
              </span>
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
      {/* {response ? response.data.choices[0].message.content : ""} */}
    </div>
  );
};

export default SideBar;
