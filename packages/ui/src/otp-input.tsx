import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from "react";
import React, { createRef, useEffect, useState } from "react";

type InputEvent = ChangeEvent<HTMLInputElement> | ClipboardEvent;

const OtpInput: React.FC<{
  code: string | undefined | null;
  onClick: (v: string) => void;
}> = ({ code, onClick }) => {
  const numInputs = 10;
  const initialState = Array(numInputs).fill("");
  const [otpValues, setOtpValues] = useState<string[]>(initialState);
  useEffect(() => {
    if (code) {
      let pasteArray = code.split("");

      if (pasteArray.length > numInputs) {
        pasteArray = pasteArray.slice(0, numInputs);
      }
      setOtpValues((prevOtpValues) => {
        const otpArray = [...prevOtpValues];
        pasteArray.forEach((element, i) => {
          otpArray[i] = element;
        });
        return otpArray;
      });
    }
  }, [code]);
  const inputsRef = Array(numInputs)
    .fill(null)
    .map(() => createRef<HTMLInputElement>());

  const handleOtpChange = (event: InputEvent, index: number) => {
    event.preventDefault();
    if ("clipboardData" in event) {
      const paste = event.clipboardData.getData("text");
      let pasteArray = paste.split("");

      if (pasteArray.length > numInputs) {
        pasteArray = pasteArray.slice(0, numInputs);
      }

      setOtpValues((prevOtpValues) => {
        const otpArray = [...prevOtpValues];
        pasteArray.forEach((element, i) => {
          otpArray[index + i] = element;
        });
        return otpArray;
      });
    } else if (event.target.validity.valid) {
      setOtpValues((prevOtpValues) => {
        const otpArray = [...prevOtpValues];
        otpArray[index] = event.target.value;
        return otpArray;
      });

      if (inputsRef[index + 1]) {
        // We're sure that the sibling exists and it is a HTMLElement because the layout of the component
        inputsRef[index + 1]?.current?.focus();
      }
    }
  };

  const handleKeyUp = (
    event: KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (event.key === "Backspace" && index > 0) {
      inputsRef[index - 1]?.current?.focus();
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <form className="flex justify-between">
          {otpValues.map((value, index) => (
            <input
              readOnly={Boolean(code)}
              key={index}
              ref={inputsRef[index]}
              className="otp-input m-1 w-10 rounded-xl p-1 text-center text-lg"
              type="text"
              inputMode="numeric"
              pattern="[0-9a-zA-Z]*"
              value={value}
              onChange={(e) => handleOtpChange(e, index)}
              onPaste={(e) => handleOtpChange(e, index)}
              onKeyDown={(e) => handleKeyUp(e, index)}
            />
          ))}
        </form>
      </div>
      <div className="flex justify-center">
        <button
          className={`rounded px-4 py-2 text-lg font-bold ${otpValues.includes("") || Boolean(code) ? "bg-gray-400" : "bg-blue-500"}`}
          disabled={otpValues.includes("") || Boolean(code)}
          onClick={() => {
            onClick(otpValues.join(""));
          }}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default OtpInput;
