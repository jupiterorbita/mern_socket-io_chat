import './App.css';
import {useState, useEffect} from 'react';
import io from 'socket.io-client';

function App() {
  // create a place to hold socket var
  const [socket] = useState(()=> io(':1337'));
  const [messages, setMessages] = useState([]);
  const [timestamp, setTimestamp] = useState({
      h: 1,
      m: 2,
      s: 3,
    }
  );
  const [dataArrObj_from_server, setDataArrObj_from_server] = useState([])

  // client message:
  const [newMessage, setNewMessage] = useState("")

  useEffect( ()=> {
    // client listens for a socket response from server
    socket.on("server-sends-data-to-all-clients", dataArr => {
      console.log('SERVER >>> dataArr = ', dataArr)
      // save timestamp to state
      // setTimestamp({
      //   h: data.time.h,
      //   m: data.time.m,
      //   s: data.time.s
      // })

      setDataArrObj_from_server(dataArr)

      setMessages(prevMessage => {
        // console.log(data.socket_id, 'said:', data.message)
        // console.log('at', data.dateSent.h, data.dateSent.m, data.dateSent.s)
        // return [data.message, ...prevMessage]
      })

      // console.log('data received by user:', data.socket_id)



      return () => socket.disconnect(true);
    })





    // if a new user connects:
    socket.on("server-sends-new-user-event", new_user => {
      console.log('a new user has joined!', new_user.user_id)
    })



  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect( ()=> {
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const formHandler = (e) =>{
    e.preventDefault()
    if (newMessage === "" || newMessage.length < 1) {
      return
    }
    socket.emit("event-from-client", {"message": newMessage});
    return () => socket.disconnect(true);

  }

  return (
    <div className="App">

 

      <div className="msg-line">{dataArrObj_from_server.map((msg, i) => {
        if (msg.client_id ) {

        }
        return <p key={i}>{msg.client_id} said: {msg.message} - {msg.dateSent.h}:{msg.dateSent.m}:{msg.dateSent.s}</p>
      })}</div>
      {/* <div className="msg-line">{messages.map((msg, i) => {
        return <p key={i}>{msg} {timestamp.s} </p>
      })}</div> */}



      <div className="time-line"></div>


      <form onSubmit={formHandler}>
        <input onChange={e => {setNewMessage(e.target.value)} }type="text" />
        <input type="submit" value="send 📩" />
      </form>

      <p>{JSON.stringify(dataArrObj_from_server)}</p>
    </div>
  );
}

export default App;
