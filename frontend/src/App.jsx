import { Form, Route, Router, RouterProvider, createBrowserRouter, createRoutesFromElements, json } from "react-router-dom"
import Forms from "./components/Forms/Forms.jsx"
import RoomPage from "./page/RoomPage/RoomPage.jsx"
import { useRef, useState } from "react"
import io from "socket.io-client"
import { useEffect } from "react"
import AgoraRTC from "agora-rtc-sdk-ng"
import { APPID } from "../appid.js"

const server = "http://localhost:5000"
const socket = io(server,{
  transports : ["websocket"],
  "forceNew" : true,
  reconnectionAttempts : "Infinity",
  timeout : 10000,
})

function App() {

  const uuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace (/[xy]/g, (c) => {
      let r = Math.floor(Math.random() * 16);
      let v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const userData = useRef()

  const [mikeMuted, setMikeMuted] = useState(true)

  const token = null;
  const rtcUid = uuid()
  const appid = APPID
  let roomID
  let audioTracks = {
    localAudioTrack: null,
    remoteAudioTracks: {}
  }
  

  let rtcClient 

  let initRtc = async () => {

    rtcClient = AgoraRTC.createClient({mode:'rtc', codec:'vp8'})

    rtcClient.on("user-published", handleUserPublished)

    await rtcClient.join(appid,roomID,token,rtcUid)

    audioTracks.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack()
    audioTracks.localAudioTrack.setMuted(mikeMuted)
    rtcClient.publish(audioTracks.localAudioTrack)

  }

  let handleUserPublished = async (user, mediaType) => {
    await  rtcClient.subscribe(user, mediaType);
  
    if (mediaType == "audio"){
      audioTracks.remoteAudioTracks[user.uid] = [user.audioTrack]
      user.audioTrack.play();
    }
  }

  let leaveRoom = async () => {
    audioTracks.localAudioTrack.stop()
    audioTracks.localAudioTrack.close()
    rtcClient.unpublish()
    rtcClient.leave()
  }
  
  useEffect(() => {
    socket.on("userIsJoined", (data) => {
      if(data.success){
        console.log("userIsJoined");
        localStorage.setItem( `${data.users[0].roomID}`, JSON.stringify(data.users) );
        setUsers(data.users)
        roomID = data.users[0].roomID
        initRtc()
      }else{
        console.error("error");
      }
    })

    socket.on("joinedUser",(data) => {
      setUsers(data)
    })

    socket.on("userJoinedMessage",(data) => {
      // console.log(data);
    })

    socket.on("userLeftMessage", (data) => {
      console.log(data,"userLeftMessage");
      const userData = localStorage.getItem(`${data.roomID}`)
      let usersData = JSON.parse(userData)
      usersData = usersData.filter((item) => item.socketID !== data.socketID )
      localStorage.setItem(`${data.roomID}` , JSON.stringify(usersData))
      setUsers(usersData)
      leaveRoom
    })
  }, [])

 

  localStorage.setItem('userData',JSON.stringify(userData.current));


  const Router = createBrowserRouter(

    createRoutesFromElements(
      <>
      <Route  path="/" element={<Forms user={user} uuid={uuid} setUser={setUser} socket={socket} userData={userData} />}/>
      <Route path="/:roomId" element={<RoomPage user={user} socket={socket} users={users} audioTracks={audioTracks} rtcClient={rtcClient} mikeMuted={mikeMuted} setMikeMuted={setMikeMuted} leaveRoom={leaveRoom}/>}/>
      </>
    )
  )
  
  return (
    <>
    <RouterProvider router={Router}/>
    </>
  )
}

export default App