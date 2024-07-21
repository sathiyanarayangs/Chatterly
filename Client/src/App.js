import React, { createContext, useReducer } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Logout from "./components/Logout";
import ChatRooms from "./components/ChatRooms";
import AddChatRooms from "./components/Admin/AddChatRooms";
import EditChatRooms from "./components/Admin/EditChatRooms";
import { initialState, reducer } from "./reducer/UseReducer";

export const UserContext = createContext();

const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/ChatRooms" element={<ChatRooms />} />
      <Route path="/AddChatRooms" element={<AddChatRooms />} />
      <Route path="/EditChatRooms" element={<EditChatRooms />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <Router>
        <div>
          <Navbar />
          <Routing />
        </div>
      </Router>
    </UserContext.Provider>
  );
};

export default App;
