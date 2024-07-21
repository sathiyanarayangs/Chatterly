import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";

const Logout = () => {
  const { dispatch } = useContext(UserContext);

  const navigate = useNavigate();
  //promises
  useEffect(() => {
    fetch("https://chatterly-server.vercel.app/logout", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      // credentials: "include"
    })
      .then((res) => {
        dispatch({ type: "USER", payload: { role: 0, email: "" } });
        dispatch({ type: "ADMIN", payload: { role: 0, email: "" } });
        navigate("/signin", { replace: true });

        if (res.status !== 200) {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

  return (
    <div className="text-center display-6 mt-5" style={{ minHeight: "100vh" }}>
      Logging Out
    </div>
  );
};

export default Logout;
