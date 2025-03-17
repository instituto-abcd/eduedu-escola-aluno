import React from "react";
import { BackspaceIcon } from "~/assets/icons/Backspace";
import { useCurrentBreakpoint } from "~/hooks/useCurrentBreakpoint";

interface VirtualKeyboardProps {
  handleVirtualInput: (key: string) => void;
  handleVirtualBackspace: () => void;
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  handleVirtualInput,
  handleVirtualBackspace,
}) => {
  const breakpoint = useCurrentBreakpoint();
  const [isTouching, setIsTouching] = React.useState(false);
  const [lastTouchedKey, setLastTouchedKey] = React.useState<string | null>(
    null
  );

  const BUTTON_WIDTH = 50;
  const BUTTON_MOBILE = 40;

  const keys =
    breakpoint !== "MOBILE"
      ? [
          ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
          ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
          ["Z", "X", "C", "V", "B", "N", "M", "Backspace"],
        ]
      : [
          ["Q", "W", "E", "R", "T", "Y"],
          ["U", "I", "O", "P", "A", "S"],
          ["D", "F", "G", "H", "J", "K"],
          ["L", "Z", "X", "C", "V", "B"],
          ["N", "M", "Backspace"],
        ];
  const handleTouch = (key: string | null, isPressed: boolean) => {
    setIsTouching(isPressed);
    setLastTouchedKey(isPressed ? key : null);
  };

  return (
    <div className="flex flex-col items-center p-2.5 select-none">
      {keys.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex justify-center mb-1"
        >
          {row.map((key, keyIndex) => {
            const isBackspace = key === "Backspace";
            const isActive = isTouching && lastTouchedKey === key;

            return isBackspace ? (
              <button
                key={keyIndex}
                className={`px-4 py-2 m-2 flex justify-center items-center bg-gray-100 rounded-2xl cursor-pointer text-base border transition-all duration-200
                        ${
                          isActive
                            ? "shadow-[0px_2px_0px_0px_rgba(0,0,0,0.3)] translate-y-[6px] bg-gray-200"
                            : "shadow-[0px_8px_0px_0px_rgba(0,0,0,0.3)]"
                        }`}
                style={{
                  width:
                    breakpoint === "MOBILE"
                      ? BUTTON_MOBILE * 5.2
                      : BUTTON_WIDTH,
                  height:
                    breakpoint === "MOBILE" ? BUTTON_MOBILE : BUTTON_WIDTH,
                }}
                onTouchStart={() => handleTouch(key, true)}
                onTouchEnd={() => handleTouch(null, false)}
                onMouseDown={() => handleTouch(key, true)}
                onMouseUp={() => handleTouch(null, false)}
                onMouseLeave={() => handleTouch(null, false)}
                onClick={handleVirtualBackspace}
              >
                <BackspaceIcon className="w-6 h-6" />
              </button>
            ) : (
              <button
                key={keyIndex}
                className={`px-4 py-2 m-2 flex justify-center items-center bg-gray-100 rounded-2xl cursor-pointer text-base border transition-all duration-200
                        ${
                          isActive
                            ? "shadow-[0px_2px_0px_0px_rgba(0,0,0,0.3)] translate-y-[6px] bg-gray-200"
                            : "shadow-[0px_8px_0px_0px_rgba(0,0,0,0.3)]"
                        }`}
                style={{
                  width: breakpoint === "MOBILE" ? BUTTON_MOBILE : BUTTON_WIDTH,
                  height:
                    breakpoint === "MOBILE" ? BUTTON_MOBILE : BUTTON_WIDTH,
                }}
                onTouchStart={() => handleTouch(key, true)}
                onTouchEnd={() => handleTouch(null, false)}
                onMouseDown={() => handleTouch(key, true)}
                onMouseUp={() => handleTouch(null, false)}
                onMouseLeave={() => handleTouch(null, false)}
                onClick={() => handleVirtualInput(key)}
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export { VirtualKeyboard };
