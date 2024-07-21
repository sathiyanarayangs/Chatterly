import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../App";
import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faRightToBracket,
  faUserPlus,
  faPlus,
  faEraser,
} from "@fortawesome/free-solid-svg-icons";
import { faRocketchat } from "@fortawesome/free-brands-svg-icons";

const Navbar = () => {
  const { state } = useContext(UserContext);

  return (
    <div className="navbar">
      <nav className="navbar-container">
        <NavLink className="navbar-title" to="/">
          CHATTERLY
        </NavLink>
        <div>
          <ul className="navbar-nav">
            {state.role === 1 && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/AddChatRooms">
                    Add Rooms
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-icon" to="/AddChatRooms">
                    <FontAwesomeIcon icon={faPlus} />
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/EditChatRooms">
                    Delete Rooms
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-icon" to="/EditChatRooms">
                    <FontAwesomeIcon icon={faEraser} />
                  </NavLink>
                </li>
              </>
            )}
            {state.role === 0 ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/signin">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-icon" to="/signin">
                    <FontAwesomeIcon icon={faRightToBracket} />
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/signup">
                    Register
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-icon" to="/signup">
                    <FontAwesomeIcon icon={faUserPlus} />
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/ChatRooms">
                    Chat Rooms
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-icon" to="/ChatRooms">
                    <FontAwesomeIcon icon={faRocketchat} />
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/logout">
                    Log Out
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-icon" to="/logout">
                    <FontAwesomeIcon icon={faRightFromBracket} />
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
