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

  useEffect ( () => {
    socket.on("receive_message", dataArr => {
      console.log('SERVER >>> dataArr = ', dataArr)
      setDataArrObj_from_server(prevStateData => {
        return [...prevStateData, dataArr]
      })
      //scroll to the bottom of "#myDiv"
        const myDiv = document.getElementById("scroll_down");
        // console.log('myDiv', myDiv);
        myDiv.scrollIntoView(false);
    });
    // return () => socket.disconnect(true);
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
    


  const formHandler = async (e) =>{
    e.preventDefault()
    if (newMessage === "" || newMessage.length < 1) {
      document.querySelector("input").focus();
      return;
    };
    let messageContent = {
      room,
      content: {
        userName,
        newMessage
      }}
    await socket.emit("event-from-client", messageContent);
    setNewMessage('');
    document.querySelector("input").focus();
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
        <div className="wrapper">
         <div className="logo"> </div>
          <img src="./static/sm_logo.png" alt="animal chat" width="500" height="600"/>
          <div className="chatContainer" id="scroll_down"> 
          {
            dataArrObj_from_server.map((msg, i) => {
            return (

              <div key={i} className="wrapper-id" >
                <div className="message_bubble" id={msg.userName === userName ? "You" : "Other"} >

                  <div className="name"> 
                    {msg.userName} 
                  </div>
                <div className="left">
                  <div className="emoji"> 
                  🐸
                  </div>
                  
                </div>

                <div className="right"> 
                  <div className="actual_text_message"> 
                    {msg.message}
                  </div>
                  
                  <div className="time"> 
                    {msg.dateSent.h}:{msg.dateSent.m}:{msg.dateSent.s}
                  </div>
                </div>
                </div>
              </div>
            )
            })
          }
          </div>

          {/* FORM --------------------- */}
          <div className="form">
            <form onSubmit={formHandler}>
              <input className='da_input' autoFocus onChange={e => {setNewMessage(e.target.value)} } value={newMessage} type="text" />
              <input className="send_button" type="submit" value="send 📡" />
            </form>
          </div>
          {/* {JSON.stringify(dataArrObj_from_server)} */}
        </div>
      )
    }
    </div>
  );
}

export default App;
