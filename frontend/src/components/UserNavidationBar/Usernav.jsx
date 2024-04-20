import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare, faCircle } from "@fortawesome/free-regular-svg-icons";
import {
  faPencil,
  faSlash,
  faRotateBackward,
  faRotateForward,
  faArrowRightLong,
  faUpDownLeftRight,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";

function Usernav({ tool, setTool, chooseColor, setChooseColor,undo, redo, elements, history, mikeMuted, setMikeMuted}) {

  const labelStyle = {
    backgroundColor: chooseColor,
    display: 'inline-block',
  }

  return (
    <nav className="absolute flex flex-col items-center bg-[#F4DF4EFF] w-fit h-fit mt-5 ml-5 rounded-3xl">
        <div className="p-3">
          <input
            id="inputColor"
            type="color"
            name="inputColor"
            value={chooseColor}
            onChange={(e) => setChooseColor(e.target.value)}
            className="rounded-[100%] w-6 h-6 "
            style={{display: "none"}}
          />
          <label style={labelStyle} htmlFor="inputColor" className=" w-6 h-6 rounded-xl">
             
          </label>

        </div>
        <div
          className={` ${tool === "pencil" ? "bg-[#00B1D2FF] rounded-lg" : ""} p-3  h-full `}
        >
          <FontAwesomeIcon
            icon={faPencil}
            size="lg"
            onClick={() => setTool("pencil")}
          />
        </div>
        <div
          className={` ${tool === "rect" ? "bg-[#00B1D2FF] rounded-lg" : ""} p-3 h-full `}
        >
          <FontAwesomeIcon
            icon={faSquare}
            size="lg"
            onClick={() => setTool("rect")}
          />
        </div>
        <div
          className={` ${tool === "line" ? "bg-[#00B1D2FF] rounded-lg" : ""} p-3 h-full `}
        >
          <FontAwesomeIcon
            icon={faSlash}
            size="lg"
            onClick={() => setTool("line")}
          />
        </div>
        <div
          className={` ${tool === "oval" ? "bg-[#00B1D2FF] rounded-lg" : ""} p-3 h-full `}
        >
          <FontAwesomeIcon
            icon={faCircle}
            size="lg"
            onClick={() => setTool("oval")}
          />
        </div>
        <div
          className={` ${tool === "arrow" ? "bg-[#00B1D2FF] rounded-lg" : ""} p-3 h-full `}
        >
          <FontAwesomeIcon
            icon={faArrowRightLong}
            size="lg"
            onClick={() => setTool("arrow")}
          />
        </div>
        <div
          className={` ${tool === "move" ? "bg-[#00B1D2FF] rounded-lg" : ""} p-3 h-full `}
        >
          <FontAwesomeIcon
            icon={faUpDownLeftRight}
            size="lg"
            onClick={() => setTool("move")}
          />
        </div>
        <button
          type="button"
          className=" w-fit p-3"
          disabled={elements.length === 0}
          onClick={undo}
        >
          <FontAwesomeIcon icon={faRotateBackward} />
        </button>
        <button
          type="button"
          className="w-fit p-3"
          disabled={history.length < 1}
          onClick={redo}
        >
          <FontAwesomeIcon icon={faRotateForward} />
        </button>
    </nav>
  );
}

export default Usernav;
