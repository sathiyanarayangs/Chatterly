import React, { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import Chat from "./Chat";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import "./ChatRooms.css";

function ChatRooms() {
  const socket = io("https://chatterly-server.vercel.app/");
  const { state } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (state.role === 0) {
      navigate("/");
    }
  }, [navigate, state.role]);

  const [groups, setGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [joinedGroups, setJoinedGroups] = useState([]);

  useEffect(() => {
    fetch("https://chatterly-server.vercel.app/get-chat-rooms")
      .then((response) => response.json())
      .then((data) => {
        setGroups(data);
      })
      .catch((error) => {
        console.error("Error fetching groups:", error);
      });
  }, []);

  useEffect(() => {
    if (state.email) {
      fetch(
        `https://chatterly-server.vercel.app/get-joined-groups?email=${state.email}`
      )
        .then((response) => response.json())
        .then((data) => {
          setJoinedGroups(data.joinedGroups);
        })
        .catch((error) => {
          console.error("Error fetching joined groups:", error);
        });
    }
  }, [state.email]);

  useEffect(() => {
    if (currentGroup) {
      socket.emit("joinGroup", currentGroup._id);
    }

    return () => {
      if (currentGroup) {
        socket.emit("leaveGroup", currentGroup._id);
      }
    };
  }, [socket, currentGroup]);

  const joinGroup = (group) => {
    setCurrentGroup(group);
    fetch("https://chatterly-server.vercel.app/join-group", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: state.email, groupId: group._id }),
    })
      .then((response) => response.json())
      .then((data) => {
        setJoinedGroups(data.joinedGroups);
      })
      .catch((error) => {
        console.error("Error joining group:", error);
      });
  };

  const leaveGroup = () => {
    if (currentGroup) {
      fetch("https://chatterly-server.vercel.app/leave-group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: state.email, groupId: currentGroup._id }),
      })
        .then((response) => response.json())
        .then((data) => {
          setJoinedGroups(data.joinedGroups);
          setCurrentGroup(null);
        })
        .catch((error) => {
          console.error("Error leaving group:", error);
        });
    }
  };

  return (
    <div className="ChatRoom">
      <div className="Left">
        <div>
          <div className="chat-room-title">
            <h2>Chat Rooms</h2>
          </div>
          <div>
            {groups.map((group) => (
              <div>
                {joinedGroups.includes(group._id) ? (
                  <div
                    key={group._id}
                    className="Each-Group"
                    onClick={() => setCurrentGroup(group)}
                  >
                    <div className="group-name-chat">
                      <span>{group.name}</span>
                    </div>
                  </div>
                ) : (
                  <div key={group._id} className="Each-Group">
                    <div className="group-name-chat">
                      <span>{group.name}</span>
                    </div>
                    <div>
                      <button
                        className="join-btn"
                        onClick={() => joinGroup(group)}
                      >
                        Join
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="Right">
        {currentGroup ? (
          <Chat socket={socket} group={currentGroup} leaveGroup={leaveGroup} />
        ) : (
          <div className="auto-display">
            <h1>Please select a room to start your conversation.</h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatRooms;
