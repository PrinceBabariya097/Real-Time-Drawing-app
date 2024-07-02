import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

const JoinRoomForm = ({uuid,socket,setUser,userData}) => {

  const [roomID,setRoomID] = useState("")
  const [name, setName] = useState("")

  const navigate = useNavigate()
  
  const handelJoinRoom = (e) => {
    e.preventDefault()

    const  roomData = {
      name,
      roomID,
      userID : uuid(),
      host: false,
      presenter: false
    }

      setUser(roomData)
    navigate(`/${roomID}`)
    socket.emit("userJoined",roomData)
    userData.current = roomData
  }

  useEffect(() => {
    socket.on("userLeftEvent",async () => {
      audioTracks.localAudioTracks.stop()
      audioTracks.localAudioTracks.leave()

      rtcClient.unpublish()
      rtcClient.leave()
      console.log("left");
      navigate('/')
    })
  },[])
  
  return (
    <div className=" h-80 w-96 px-4 flex flex-col justify-around mx-4 bg-[#F4DF4EFF] rounded-xl">
      <div className="text-center text-2xl">
          <h1>Join Room</h1>
        </div>
        <div>
          <input
            type="text"
            placeholder="  Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            name="name"
            id="name"
            className="rounded-lg w-full h-10"
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="  Enter Room ID"
            name="roomId"
            id="roomId"
            value={roomID}
            onChange={(e) => setRoomID(e.target.value)}
            className="rounded-lg w-full h-10"
            required
          />
        </div>
        <button
          type="submit"
          onClick={handelJoinRoom}
          className="p-4 mb-2 cursor-pointer text-center bg-[#00A4CCFF] rounded-xl"
        >
          Join Room
        </button>
    </div>
  )
}

export default JoinRoomForm