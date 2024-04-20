import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APPID } from "../../../../appid";
import AgoraRTC from "agora-rtc-sdk-ng";

const CreateRoomForm = ({ uuid,socket,setUser,userData }) => {
  const [name, setName] = useState("");
  const [roomID, setRoomID] = useState(uuid());

  const navigate = useNavigate()

  const handelCreateRoom = (e) => {
    e.preventDefault();
    const  roomData = {
      name,
      roomID, 
      userID : uuid(),
      host: true,
      presenter: true
    }

      setUser(roomData)
      navigate(`/${roomID}`)
      console.log(roomData);
      socket.emit("userJoined",roomData)
      userData.current = roomData
  }

  const token = null;
  const rtcUid = uuid()
  const appid = APPID
  let audioTracks = {
    localAudioTracks: null,
    remoteAudioTracks: {}
  }

  let rtcClient 
  let initRtc = async (roomID) => {
    rtcClient = AgoraRTC.createClient({mode:'rtc', codec:'vp8'})

    await rtcClient.join(appid, roomID, token, rtcUid)

    audioTracks.localAudioTracks = await AgoraRTC.createMicrophoneAudioTrack()
    rtcClient.publish(audioTracks.localAudioTracks)
  }

  useEffect(() => {
    socket.on("userLeftEvent", () => {
      audioTracks.localAudioTracks.stop()
       audioTracks.localAudioTracks.leave()

      rtcClient.unpublish()
       rtcClient.leave()

      navigate("/")

      console.log("userLeft");
    })
  },[])

  const handleCopy = () => {
    navigator.clipboard.writeText(roomID)
  }

  return (
    <div>
      <div className=" h-80 w-96 px-4 flex flex-col justify-around  mx-4  bg-[#F4DF4EFF] rounded-xl">
        <div className="text-center text-2xl">
          <h1>Generate Room</h1>
        </div>
        <div>
          <input
            type="text"
            placeholder="  Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            name="name"
            id="name"
            className="rounded-lg w-full h-10 "
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Generate your room id"
            value={roomID}
            name="roomId"
            id="roomId"
            className="rounded-lg h-10  "
            readOnly
          />
          <input
            type="button"
            value="Generate"
            onClick={() => setRoomID(uuid())}
            className="p-2 mx-1 hover:bg-blue-600 rounded-lg"
          />
          <button
          id="copy"
          className="p-2 hover:bg-blue-600 rounded-lg"
          onClick={handleCopy}
          >
          Copy  
          </button>
        </div>
        <button
          type="submit"
          onClick={handelCreateRoom}
          className="p-4 mb-2 cursor-pointer text-center bg-[#00A4CCFF] rounded-xl"
        >
          Create Room
        </button>
      </div>
    </div>
  );
};

export default CreateRoomForm;
