import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../App";
import "./Chat.css";

function Chat({ socket, group, leaveGroup }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const { state } = useContext(UserContext);

  useEffect(() => {
    socket.on("loadMessages", (loadedMessages) => {
      setMessages(loadedMessages);
    });

    socket.on("newMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("loadMessages");
      socket.off("newMessage");
    };
  }, [socket]);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("sendMessage", {
      groupId: group._id,
      email: state.email,
      message,
    });
    setMessage("");
  };

  return (
    <div>
      <div className="header">
        <div className="group-name">
          <h2>{group.name}</h2>
        </div>
        <div>
          <button className="leave-btn" onClick={leaveGroup}>
            Leave
          </button>
        </div>
      </div>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="each-message">
            <div className="email-time">
              {msg.email} [{new Date(msg.timestamp).toLocaleString()}]:{" "}
            </div>
            <div className="message-p">
              <p>{msg.message}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="sendMessage">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="input-message"
          placeholder="Type your message here..."
        />
        <button onClick={sendMessage} className="send-btn">
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
