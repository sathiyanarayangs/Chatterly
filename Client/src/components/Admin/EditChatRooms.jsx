import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";
import "./EditChatRooms.css";

function EditChatRooms() {
  const { state } = useContext(UserContext);
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (state.role !== 1) {
      navigate("/");
    }
  }, [navigate, state.role]);

  useEffect(() => {
    fetch("http://localhost:5000/get-chat-rooms")
      .then((response) => response.json())
      .then((data) => {
        setGroups(data);
      })
      .catch((error) => {
        console.error("Error fetching groups:", error);
      });
  }, []);

  const deleteGroup = (groupId) => {
    fetch(`http://localhost:5000/delete-group/${groupId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        setGroups(groups.filter((group) => group._id !== groupId));
      })
      .catch((error) => {
        console.error("Error deleting group:", error);
      });
  };

  return (
    <div className="EditChatRooms">
      <div>
        <div>
          <h2>Delete Chat Rooms</h2>
        </div>
        <div className="groups-list">
          {groups.map((group) => (
            <div key={group._id} className="group-item">
              <div className="group-name-edit">
                <span>{group.name}</span>
              </div>
              <div>
                <button
                  className="delete-btn"
                  onClick={() => deleteGroup(group._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EditChatRooms;
