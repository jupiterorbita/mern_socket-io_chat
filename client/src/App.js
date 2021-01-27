import './App.css';
import {useState, useEffect} from 'react';
import io from 'socket.io-client';

function App() {
  const [socket] = useState(()=> io(':1337'));

  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [room, setRoom] = useState('');
  const [dataArrObj_from_server, setDataArrObj_from_server] = useState([])
  // client message:
  const [newMessage, setNewMessage] = useState("")

  const connectToRoom = () => {
    setLoggedIn(true)
    socket.emit('join_room', {room, userName})
  }

  // get all data upon login!
  useEffect ( ()=> {
    // gimme all data server
    socket.emit("CLIENT -> server - gimme data!", {"can_i_has_data": true});
    // wating for server to give us back data for all messages
    socket.on('server says - heres your data', all_ze_messages => {
      console.log('\n we got from server all_ze_messages \n', all_ze_messages)
      // set all messages to be displayed upon arrival!
      setDataArrObj_from_server(all_ze_messages)
    })
    
  }, [])

  socket.on("receive_message", dataArr => {
    console.log('SERVER >>> dataArr = ', dataArr)
    setDataArrObj_from_server([...dataArrObj_from_server, dataArr])
  });
    // useEffect ( () => {
    //     return () => socket.disconnect(true);
    //   })
    // }, [])


  const formHandler = async (e) =>{
    e.preventDefault()
    if (newMessage === "" || newMessage.length < 1) return;
    let messageContent = {
      room,
      content: {
        userName,
        newMessage
      }}
    await socket.emit("event-from-client", messageContent);
    // return () => socket.disconnect(true);
  }

  return (
    <div className="App">
    {
      !loggedIn ? (
        <div className="logIn">
            <div className="inputs">
              <input type="text" placeholder="you name " onChange={e=> setUserName(e.target.value)} />
              <input type="text" placeholder="secret room? " onChange={e=> setRoom(e.target.value)} />
            </div>
                <button onClick={connectToRoom}>Enter Chat</button>
          </div>
       ) : (
        <div className="chatContainer"> 
          <div className="msg-line">
          {
            dataArrObj_from_server.map((msg, i) => {
            return <p key={i}>{msg.userName} said: {msg.message} - {msg.dateSent.h}:{msg.dateSent.m}:{msg.dateSent.s}</p>
            })
          }
          </div>
          <div className="time-line"></div>
          <form onSubmit={formHandler}>
            <input onChange={e => {setNewMessage(e.target.value)} }type="text" />
            <input type="submit" value="send 📩" />
          </form>
          {JSON.stringify(dataArrObj_from_server)}
        </div>
      )
    }
    </div>
  );
}

export default App;
