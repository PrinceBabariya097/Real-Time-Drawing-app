import React from 'react'
import './user.css'

function User({ users, user, showUser, setShowUser }) {
  return (
    <div className="h-screen w-72 items-center [transition:width_0.5s] bg-blue-950 z-[1]">
      <button
        onClick={() => setShowUser(!showUser)}
        className="h-fit w-full p-2 bg-slate-300  rounded-md mb-3"
      >
        Leave
      </button>
      {users.map((usr, index) => (
        <div key={index * 999} className="text-white mt-1 text-center my-1">
          {usr.name}
          {user && user.userID === usr.userID && " (You)"}
        </div>
      ))}

      <div id='video-Player' className='h-[200px] w-[200px] z-[2] '>
        {/* <video src={user.video} autoPlay loop muted></video> */}
      </div>
    </div>
  )
}

export default User