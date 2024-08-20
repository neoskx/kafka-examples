import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const eventSource = new EventSource("http://localhost:3010/sse");

    eventSource.onmessage = function (event) {
      setMessages([...messages, event.data]);
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">Messages</header>
      <ul>
        {messages.map((message) => (
          <li>{message}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
