import { useEffect, useState } from "react";
import "../../styles/MessagingPage.css";

export default function MessagingPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  
  const senderId = localStorage.getItem("user_id");

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://127.0.0.1:8000/api/student_conversations/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectInternship = async (internship) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/create-conversation/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          internship_id: internship.internship_id,
        }),
      });

      const data = await response.json();
      
      // Update the selected conversation state to include the real conversation_id
      setSelectedConversation({
        ...internship,
        id: data.conversation_id
      });
      
      // Update local unread count
      setConversations(prev => prev.map(c => 
        c.internship_id === internship.internship_id ? {...c, unread_count: 0} : c
      ));

      // Mark messages as read
      await fetch(`http://127.0.0.1:8000/api/mark-read/${data.conversation_id}/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/messages/${conversationId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!selectedConversation || !selectedConversation.id) return;

    fetchMessages(selectedConversation.id);

    const socket = new WebSocket(
      `ws://127.0.0.1:8000/ws/chat/${selectedConversation.id}/`
    );

    socket.onmessage = function (event) {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    window.chatSocket = socket;

    return () => socket.close();
  }, [selectedConversation]);

  const sendMessage = () => {
    if (!input.trim() || !window.chatSocket) return;

    window.chatSocket.send(
      JSON.stringify({
        message: input,
        sender_id: senderId,
      })
    );

    setInput("");
  };

  return (
    <div className="chat-page">
      {/* SIDEBAR */}
      <div className="chat-sidebar">
        <h2>Messages</h2>
        {conversations.map((conv) => (
          <div
            key={conv.internship_id}
            className={`chat-user ${
              selectedConversation?.internship_id === conv.internship_id ? "active" : ""
            }`}
            onClick={() => handleSelectInternship(conv)}
          >
            {/* <div className="chat-avatar">
              {conv.company_name?.charAt(0).toUpperCase()}
            </div> */}
            <div>
              <h4>{conv.company_name}</h4>
              <p>{conv.job_title}</p>
            </div>
            {conv.unread_count > 0 && (
              <span className="unread-badge">
                {conv.unread_count}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* CHAT WINDOW */}
      <div className="chat-window">
        {selectedConversation ? (
          <>
            <div className="chat-header">
              <h3>{selectedConversation.company_name} Chat</h3>
            </div>

            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message-bubble ${
                    Number(msg.sender_id) === Number(senderId)
                      ? "sent"
                      : "received"
                  }`}
                >
                  {msg.message}
                </div>
              ))}
            </div>

            <div className="chat-input-box">
              <input
                type="text"
                placeholder="Type message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div className="empty-chat">Select a company to message</div>
        )}
      </div>
    </div>
  );
}