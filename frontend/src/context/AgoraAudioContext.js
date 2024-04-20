import { createContext } from "react"

export const agoraVoiceChatRoom = createContext({
    leaveRoom : (rtcClient,audioTracks) => {}
})

export const agoraVoiceChatRoomProvider = agoraVoiceChatRoom.Provider