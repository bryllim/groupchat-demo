import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, onSnapshot, addDoc} from 'firebase/firestore';

function App() {

  const [username, setUsername] = useState("No username set");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(()=>{
    fetchData();
  }, []);

  const fetchData = () => {

    onSnapshot(collection(db, "messages"), fetchedMessages => {
      const fetchedData = [];
      fetchedMessages.forEach(doc => {
        fetchedData.push(doc.data());
      })

     setMessages(fetchedData);
    });

  }

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  }

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  }

  const sendMessage = async () => {
    if(message === "" || username === ""){
      alert(`Username or message cannot be empty!`);
    }else{
      await addDoc(collection(db, 'messages'), {
        name: username,
        message: message
      });
    }
  }


  return (
    <main className="container-fluid bg-dark text-white p-5">
      <div className="container">
        <h1 className="fw-bold">💬 WD63 Chat</h1>
        <div className="row">
          <div className="col-8">
            <input
              type="text"
              className="form-control my-3"
              placeholder="Enter your name..."
              onChange={handleUsernameChange}
            />
          </div>
        </div>

        {/* Chat Area */}
        <div className="container py-3 border rounded">

          {messages.slice(0).reverse().map((message) => (
              <div className="row">
              <div className="col-md-12">
                <small>{(message.name === username) ? "You": message.name}</small>
                <div className={`alert ${(message.name === username) ? "bg-primary": "bg-secondary"}`}>{message.message}</div>
              </div>
            </div>
          ))}

          <hr />
          <div className="row">
            <div className="col-10">
              <input type="text" className="form-control" placeholder="Write your message..." onChange={handleMessageChange}/>
            </div>
            <div className="col-2">
              <button className="btn btn-success" onClick={sendMessage}>⏎</button>
            </div>
          </div>

        </div>
        
      </div>
    </main>
  );
}

export default App;
