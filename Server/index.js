const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticate = require("./middleware/authenticate");
const authenticateAdmin = require("./middleware/authenticateAdmin");
const express = require("express");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});

dotenv.config({ path: "./.env" });

//database connection
require("./db/conn");

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const Member = require("./model/memberSchema");
const Group = require("./model/groupSchema");
const Message = require("./model/messageSchema");

app.get("/", (req, res) => {
  res.send("Hello world");
});

// Async-await approach
//register route
app.post("/register", async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return res.status(422).json({ error: "Please fill all the entries" });
  }

  try {
    const memberExists = await Member.findOne({ email: email });

    if (memberExists) {
      return res.status(422).json({ error: "Email already exists" });
    } else if (password !== confirmPassword) {
      return res.status(422).json({ error: "Passwords do not match" });
    }

    const role = "2";

    const member = new Member({
      email,
      password,
      confirmPassword,
      role,
    });

    await member.save();
    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    console.log(err);
  }
});

//login route
app.post("/signin", async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please fill in all the details" });
    }

    const memberLogin = await Member.findOne({ email: email });

    if (memberLogin) {
      const isMatch = await bcrypt.compare(password, memberLogin.password);

      token = await memberLogin.generateAuthToken();

      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000), //expires within 30 days
        httpOnly: true,
      });

      if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      defaultuser = memberLogin;

      if (memberLogin.role === "2") {
        // User role (role 2)
        res.json({
          message: "User sign-in successful",
          role: "user",
          email: email,
        });
      } else if (memberLogin.role === "1") {
        // Admin role (role 1)
        res.json({
          message: "Admin sign-in successful",
          role: "admin",
          email: email,
        });
      } else {
        // Invalid role
        res.status(400).json({ error: "Invalid role" });
      }
    } else {
      res.status(400).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("User Logout");
});

app.post("/create-chat-room", async (req, res) => {
  const { name } = req.body;
  try {
    const newGroup = new Group({ name });
    await newGroup.save();
    res.status(201).json({ message: "Group created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating group", error });
  }
});

app.get("/get-chat-rooms", async (req, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ message: "Error fetching groups", error });
  }
});

app.get("/get-joined-groups", async (req, res) => {
  try {
    const { email } = req.query;
    const user = await Member.findOne({ email }).populate("joinedGroups");
    res.json({ joinedGroups: user.joinedGroups.map((group) => group._id) });
  } catch (error) {
    res.status(500).json({ error: "Error fetching joined groups" });
  }
});

app.post("/join-group", async (req, res) => {
  try {
    const { email, groupId } = req.body;
    const user = await Member.findOne({ email });
    if (!user.joinedGroups.includes(groupId)) {
      user.joinedGroups.push(groupId);
    }
    await user.save();
    res.json({ joinedGroups: user.joinedGroups });
  } catch (error) {
    res.status(500).json({ error: "Error joining group" });
  }
});

app.post("/leave-group", async (req, res) => {
  try {
    const { email, groupId } = req.body;
    const user = await Member.findOne({ email });
    user.joinedGroups = user.joinedGroups.filter(
      (id) => id.toString() !== groupId
    );
    await user.save();

    const group = await Group.findById(groupId);
    group.members = group.members.filter(
      (memberId) => memberId.toString() !== user._id.toString()
    );
    await group.save();

    res.json({ joinedGroups: user.joinedGroups });
  } catch (error) {
    res.status(500).json({ error: "Error leaving group" });
  }
});

app.delete("/delete-group/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Group.findByIdAndDelete(id);
    await Message.deleteMany({ groupId: id });
    res.json({ message: "Group deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting group" });
  }
});

io.on("connection", (socket) => {
  // console.log("New client connected");

  socket.on("joinGroup", async (groupId) => {
    // console.log(`Client joined group ${groupId}`);
    socket.join(groupId);

    // Fetch existing messages
    const messages = await Message.find({ groupId }).sort({ timestamp: 1 });
    socket.emit("loadMessages", messages);
  });

  socket.on("sendMessage", async (data) => {
    const { groupId, email, message } = data;
    const timestamp = new Date();

    const newMessage = new Message({
      groupId,
      email,
      message,
      timestamp,
    });

    await newMessage.save();

    io.to(groupId).emit("newMessage", {
      email,
      message,
      timestamp,
    });
  });

  socket.on("disconnect", () => {
    // console.log("Client disconnected");
  });
});
