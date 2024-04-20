import React, { useState, useEffect } from "react";

export const Chat = ({ isMessage, setIsMessage, socket }) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const handelChat = (e) => {
    e.preventDefault();

    const date = new Date()
    const hour = date.getHours().toString()
    const minut = date.getMinutes().toString()

    const time = hour + ':' + minut


    if (message.trim() !== "") {
      setChat((prev) => [...prev, { message, name: "You", time:time }])
      socket.emit("message", { message, time });
      setMessage("")
    }
  };

  useEffect(() => {
    socket.on("messageResponse", (data) => {
      setChat((prev) => [...prev, data]);
    });
  }, []);

  return (
    <div className="h-screen w-72 items-center [transition:width_0.5s] bg-blue-950 z-[1]">
      <button
        onClick={() => setIsMessage(!isMessage)}
        className="h-fit w-full p-2 bg-slate-300  rounded-md mb-3"
      >
        Leave
      </button>
      <div className="text-wrap h-[80%] border-solid border border-white">
        {
          chat.map((msg,index) => (
            <div key={index*999} className="text-center text-white flex justify-between border border-solid border-white ">
              <div className="p-2">{msg.name} :</div>
              <div className="p-2">{msg.message}</div>
              <div className="p-2">{msg.time}</div>
            </div>
          ))
        }
      </div>
      <div className="w-[95%] flex pt-3 mx-auto">
        <form onSubmit={handelChat} className="flex w-full">
          <input
            type="text"
            placeholder="Enter text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-[75%] bg-transparent border-solid border h-12 mr-4 rounded-md"
          />
          <button type="submit" className="bg-blue-500 w-[20%] rounded-md">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
