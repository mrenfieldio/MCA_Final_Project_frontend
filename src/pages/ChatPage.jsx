import { useEffect, useState } from "react";

export default function ChatPage() {

  const [messages, setMessages] =
    useState([]);

  const [input, setInput] =
    useState("");

  const conversationId = 1;

  const senderId = 5;

  useEffect(() => {

    const socket =
      new WebSocket(

        `ws://127.0.0.1:8000/ws/chat/${conversationId}/`
      );

    socket.onmessage =
      function(event) {

        const data =
          JSON.parse(event.data);

        setMessages(prev => [

          ...prev,

          data
        ]);
      };

    window.socket = socket;

    return () => socket.close();

  }, []);

  const sendMessage = () => {

    window.socket.send(

      JSON.stringify({

        message: input,

        sender_id: senderId,
      })
    );

    setInput("");
  };

  return (

    <div>

      <div>

        {
          messages.map((msg, index) => (

            <p key={index}>

              {msg.message}

            </p>
          ))
        }

      </div>

      <input

        value={input}

        onChange={(e) =>
          setInput(e.target.value)
        }
      />

      <button
        onClick={sendMessage}
      >

        Send

      </button>

    </div>
  );
}