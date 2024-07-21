const storedUser = localStorage.getItem("user");
export const initialState = storedUser
  ? JSON.parse(storedUser)
  : { role: 0, email: "" };

export const reducer = (state, action) => {
  switch (action.type) {
    case "MEMBER":
      const memberState = {
        role: action.payload.role,
        email: action.payload.email,
      };
      localStorage.setItem("user", JSON.stringify(memberState));
      return memberState;

    case "ADMIN":
      const adminState = {
        role: action.payload.role,
        email: action.payload.email,
      };
      localStorage.setItem("user", JSON.stringify(adminState));
      return adminState;

    default:
      return state;
  }
};
