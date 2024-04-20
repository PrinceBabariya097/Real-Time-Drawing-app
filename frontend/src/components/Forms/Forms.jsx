import React from "react";
import JoinRoomForm from "./JoinRoomForm/JoinRoomForm";
import CreateRoomForm from "./CreateRoomForm/CreateRoomForm";
// import agoraVoiceChatRoomProvider  from "../../context/AgoraAudioContext";

const Forms = ({uuid,setUser,socket,user,userData}) => {

  return (
    // <agoraVoiceChatRoomProvider value={leaveRoom}>
    <form className="h-screen w-full flex justify-center items-center bg-[#28334AFF]">
      <div>
        <CreateRoomForm uuid = {uuid} setUser={setUser} socket={socket} userData={userData}/>
      </div>
      <div>
        <JoinRoomForm user={user} uuid = {uuid} setUser={setUser} socket={socket} userData={userData}/>
      </div>

    </form>
    // </agoraVoiceChatRoomProvider>
  );
};

export default Forms;
