import React, { useEffect, useState } from "react";
import { Canvas } from "../../components/Whiteboard/Canvas.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faMessage,
  faUpload,
  faArrowRightFromBracket,
  faMicrophoneSlash,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";
import { Chat } from "../../components/ChatBar/Chat.jsx";
import User from "../../components/UserBar/User.jsx";
import Usernav from "../../components/UserNavidationBar/Usernav.jsx";
import { useNavigate } from "react-router-dom";
import { downloadCanvasAsImage } from "../../components/Whiteboard/Canvas.jsx";
import UpperNavBar from "../../components/UpperNavBar/UpperNavBar.jsx";

function RoomPage({
  user,
  socket,
  users,
  audioTracks,
  rtcClient,
  mikeMuted,
  setMikeMuted,
  leaveRoom,
}) {
  const [tool, setTool] = useState("pencil");
  const [chooseColor, setChooseColor] = useState("#ffffff");
  const [showUser, setShowUser] = useState(false);
  const [isMessage, setIsMessage] = useState(false);
  const [filled, setFilled] = useState(false);
  const [elements, setElements] = useState([]);
  const [brushWidth, setBrushWidth] = useState(1);
  const [roughness, setRoughness] = useState(1);
  const [history, setHistory] = useState([]);
  const [selectedFile, setSelectedFile] = useState([]);
  const [fillType, setFillType] = useState("none");

  const canvasRef = useRef(null);
  const ctx = useRef(null);
  const navigate = useNavigate();

  const clearCanvas = () => {
    ctx.current = canvasRef.current.getContext("2d");
    ctx.current.clearRect(0, 0, window.innerWidth, window.innerHeight);
    setElements([]);
  };

  // console.log(mikeMuted);

  const redo = () => {
    setElements((prevElements) => [
      ...prevElements,
      history[history.length - 1],
    ]);
    setHistory((prevHistory) => prevHistory.slice(0, prevHistory.length - 1));
  };

  const undo = () => {
    setHistory((prev) => [...prev, elements[elements.length - 1]]);
    setElements((prev) => prev.slice(0, prev.length - 1));
  };

  const handleDisConnect = () => {
    navigate("/");
    socket.disconnect(user);
    leaveRoom();
  };

  const handelfiles = (e) => {
    const file = e.target.files[0];
    console.log(file);
    console.log(URL.createObjectURL(file));
    setSelectedFile((prev) => [...prev, file]);
  };

  return (
    <div className="bg-[#00203FFF]">
      <div className="w-full flex justify-center bottom-6 absolute">
        <nav className="bg-[#ADEFD1FF] rounded-xl p-3 w-fit h-fit flex z-[2]">
          <div className="mx-3">
            <FontAwesomeIcon
              icon={faUser}
              onClick={() => setShowUser(!showUser)}
              size="2x"
              className="relative"
            />
            <div className="absolute ml-7 bg-slate-600 px-2 rounded-[100%] top-0">
              {users.length}
            </div>
          </div>
          <div className="message ml-7 mr-3">
            <FontAwesomeIcon
              icon={faArrowRightFromBracket}
              size="2x"
              onClick={handleDisConnect}
              color="red"
            />
          </div>
          <div
            className={`${
              mikeMuted ? "bg-red-600  rounded-full" : ""
            } bg-[{}] message ml-7 mr-3 `}
          >
            <FontAwesomeIcon
              icon={faMicrophoneSlash}
              size="lg"
              onClick={() => setMikeMuted(!mikeMuted)}
              className="p-2"
            />
          </div>
          <div className="message ml-7 mr-3">
            <FontAwesomeIcon
              icon={faMessage}
              size="2x"
              onClick={() => setIsMessage(!isMessage)}
            />
          </div>
          <div className="clearcanvasm mx-3">
            <input
              type="button"
              value="Clear Canvas"
              onClick={clearCanvas}
              className="p-2 bg-[linear-gradient(145deg,_#B94800,_#F36000)] rounded-lg [box-shadow:inset_9.91px_9.91px_15px_#C34C00,_inset_-9.91px_-9.91px_15px_#E95C00]"
            />
          </div>
        </nav>
      </div>
      {user?.presenter && (
        <UpperNavBar
          brushWidth={brushWidth}
          setBrushWidth={setBrushWidth}
          roughness={roughness}
          setRoughness={setRoughness}
          downloadCanvasAsImage={downloadCanvasAsImage}
          fillType={fillType}
          setFillType={setFillType}
        />
      )}
      {user?.presenter && (
        <Usernav
          tool={tool}
          setTool={setTool}
          chooseColor={chooseColor}
          setChooseColor={setChooseColor}
          clearCanvas={clearCanvas}
          redo={redo}
          undo={undo}
          elements={elements}
          history={history}
          mikeMuted={mikeMuted}
          setMikeMuted={setMikeMuted}
        />
      )}
      <div className="w-full h-screen">
        <Canvas
          color={chooseColor}
          tool={tool}
          user={user}
          socket={socket}
          canvasRef={canvasRef}
          elements={elements}
          setElements={setElements}
          brushWidth={brushWidth}
          roughness={roughness}
          selectedFile={selectedFile}
          filled={filled}
          fillType={fillType}
        />
      </div>

      {showUser ? (
        <div className="visible absolute right-2 top-0">
          <User
            users={users}
            user={user}
            showUser={showUser}
            setShowUser={setShowUser}
          />
        </div>
      ): (
        <div className="invisible absolute right-2 top-0">
          <User
            users={users}
            user={user}
            showUser={showUser}
            setShowUser={setShowUser}
          />
        </div>
      )}
      {!isMessage ? (
        <div className="absolute right-2 hidden top-0 [transition:width_0.5s]">
          <Chat
            isMessage={isMessage}
            setIsMessage={setIsMessage}
            socket={socket}
          />
        </div>
      ) : (
        <div className="absolute right-2 top-0 [transition:width_0.5s]">
          <Chat
            isMessage={isMessage}
            setIsMessage={setIsMessage}
            socket={socket}
          />
        </div>
      )}
    </div>
  );
}

export default RoomPage;
