import "./App.css";
import logo_img from "./static/sm_logo.png";
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

function App() {
  const [socket] = useState(() => io(":1337"));

  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userNameErr, setUserNameErr] = useState("");
  const [room, setRoom] = useState("");

  const [usersConnected, setUsersConnected] = useState([]);
  const [roomConnected, setRoomConnected] = useState("");

  // const [emoji, setEmoji] = useState('🦄');
  const [dataArrObj_from_server, setDataArrObj_from_server] = useState([
    {
      userName: "",
      emoji: "🌴",
      message: "WELCOME TO THE JUNGLE!",
      dateSent: "zzz",
    },
  ]);
  // client message:
  const [newMessage, setNewMessage] = useState("");

  // Join Room
  const loginHandler = (e) => {
    e.preventDefault();
    if (!userName || userName.trim() === "" || userName.trim().length < 4 || userName.trim().length > 10 || userName === "") {
      return;
    } else {
      setLoggedIn(true);
      setRoom(selectedRoom);
      socket.emit("join_room", { room: selectedRoom, userName });
    }
  };

  useEffect(() => {
    // get all data upon login!
    socket.on("server says - heres your data", (all_ze_messages) => {
      // set all messages to be displayed upon arrival!
      setDataArrObj_from_server((prevData) => {
        return [...prevData, all_ze_messages];
      });
      // setDataArrObj_from_server([...all_ze_messages]);
    });
    // announcement that someone joined!
    socket.on("message_from_server", (serverAnnouncement) => {
      setDataArrObj_from_server((prevData) => {
        console.log(prevData);
        return [
          ...prevData,
          {
            userName: "SERVER",
            emoji: "🌴",
            message: serverAnnouncement.message,
            dateSent: serverAnnouncement.dateSent,
          },
        ];
      });
    });
    // get room and users connected from server
    socket.on("roomUsers", ({ room, users }) => {
      console.log("we are in room:", room);
      console.log(`users connected to ${room} = `, users);
      setRoomConnected(room);
      setUsersConnected(users);
    });
    // get users disconnected from server
    socket.on("disconnected_user", ({ user, dateSent }) => {
      console.log(`user: ${user} disconnected`);
      // setDataArrObj_from_server((prevStateData) => {
      //   return [...prevStateData, dataArr];
      // });
      setDataArrObj_from_server((prevStateData) => {
        return [
          ...prevStateData,
          {
            client_id: "",
            dateSent,
            emoji: "❌",
            message: `>> ${user} chased the sunset...`,
            userName: "SERVER",
          },
        ];
      });
    });
    // update chat from other ppl
    socket.on("receive_message", (dataArr) => {
      setDataArrObj_from_server((prevStateData) => {
        return [...prevStateData, dataArr];
      });
    });
  }, []);

  const formHandler = (e) => {
    e.preventDefault();
    if (newMessage === "" || newMessage.length < 1) {
      document.querySelector("input").focus();
      return;
    }
    let messageContent = {
      room,
      content: {
        userName,
        newMessage,
      },
    };
    socket.emit("event-from-client", messageContent);
    setNewMessage("");
    document.querySelector("input").focus();
    // return () => socket.disconnect(true);
  };

  const onChangeName = (e) => {
    if (e.target.value === "") {
      setUserNameErr("");
    } else if (e.target.value.trim().length < 4 || e.target.value.trim().length > 10) {
      setUserNameErr("You name: 4 to 10 characters!");
    } else setUserNameErr("");
    setUserName(e.target.value);
  };

  const rooms = ["Mufasa", "Baloo", "Mowgli"];
  const [selectedRoom, setSelectedRoom] = useState(rooms[0]);

  // scroll to bottom
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [dataArrObj_from_server]);

  return (
    <div className="App">
      {!loggedIn ? (
        <div>
          <img src={logo_img} className="main_logo" alt="animal chat" width="300" height="150" />
          <div className="logIn">
            <form onSubmit={loginHandler}>
              {userNameErr ? (
                <p className="err" style={{ color: "white" }}>
                  {userNameErr}
                </p>
              ) : (
                ""
              )}
              <div className="inputs">
                <input className="username" autoFocus type="text" placeholder="name?" onChange={onChangeName} value={userName} />

                <span> room: </span>
                <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
                  {rooms.map((room, i) => (
                    <option key={i} value={room}>
                      {room}
                    </option>
                  ))}
                </select>
              </div>
              <input type="submit" value="Enter Chat" className="button" />
            </form>
          </div>
        </div>
      ) : (
        <div>
          <img src={logo_img} className="main_logo" alt="animal chat" width="300" height="150" />
          <p className="room">room: {roomConnected}</p>
          <div>
            <div className="users">users</div>
            <div className="wrapper">
              {/* <div className="logo"> </div> */}
              {/* <p>users: {JSON.stringify(usersConnected)}</p> */}
              <div className="chatContainer" id="scroll_down">
                {dataArrObj_from_server.map((msg, i) => {
                  return (
                    <div key={i} className="wrapper-id">
                      <div className="message_bubble" id={msg.userName === userName ? "You" : "Other"}>
                        <div className="name">{msg.userName}</div>
                        <div className="left">
                          <div className="emoji">{msg.emoji}</div>
                        </div>

                        <div className="right">
                          <div className="actual_text_message" style={msg.userName === "SERVER" ? { color: "red", fontWeight: "bold" } : {}}>
                            {msg.message}
                          </div>

                          <div className="time">{msg.dateSent}</div>
                        </div>
                      </div>
                      <div ref={messagesEndRef} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* FORM --------------------- */}
          <div className="form">
            <form onSubmit={formHandler}>
              <input
                className="da_input"
                autoFocus
                onChange={(e) => {
                  setNewMessage(e.target.value);
                }}
                value={newMessage}
                type="text"
              />
              <input className="send_button" type="submit" value="send 📡" />
            </form>
          </div>
        </div>
      )}
      {/* {JSON.stringify(dataArrObj_from_server)} */}
    </div>
  );
}

export default App;
