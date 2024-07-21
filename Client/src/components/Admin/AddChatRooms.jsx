import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";
import "./AddChatRooms.css";
const AddChatRooms = () => {
  const { state } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (state.role !== 1) {
      navigate("/");
    }
  }, [navigate, state.role]);

  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/create-chat-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (response.status === 201 || !data) {
        setName("");
        alert("Chat Room created Successfully!");
      } else {
        alert("Error creating group");
      }
    } catch (error) {
      alert("Error creating group");
    }
  };

  return (
    <div className="AddRoom">
      <div className="Container">
        <div>
          <h1>Create Chat Room</h1>
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="AddroomForm">
              <label>Group Name: </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <button className="room-btn" type="submit">
                Create Group
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddChatRooms;
