import {
  useEffect,
  useState,
} from "react";

import "../../styles/MessagingPage.css";

export default function CompanyMessagingPage() {

  const [conversations,
  setConversations] =
    useState([]);

  const [selectedConversation,
  setSelectedConversation] =
    useState(null);

  const [messages,
  setMessages] =
    useState([]);

  const [input,
  setInput] =
    useState("");

  const senderId =
    localStorage.getItem(
      "user_id"
    );

  // =====================================
  // FETCH CONVERSATIONS
  // =====================================

  useEffect(() => {

    fetchConversations();

  }, []);

  const fetchConversations =
    async () => {

    try {

      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await fetch(

          "http://127.0.0.1:8000/api/company_conversations/",

          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      setConversations(data);

    } catch (error) {

      console.error(error);
    }
  };

  // =====================================
  // LOAD MESSAGES
  // =====================================

  useEffect(() => {

    if (!selectedConversation)
      return;

    fetchMessages();

    const socket =
      new WebSocket(

        `ws://127.0.0.1:8000/ws/chat/${selectedConversation.id}/`
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

    window.companySocket =
      socket;

    return () =>
      socket.close();

  }, [selectedConversation]);

  // =====================================
  // FETCH MESSAGE HISTORY
  // =====================================

  const fetchMessages =
    async () => {

    try {

      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await fetch(

          `http://127.0.0.1:8000/api/messages/${selectedConversation.id}/`,

          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      setMessages(data);

    } catch (error) {

      console.error(error);
    }
  };

  // =====================================
  // SEND MESSAGE
  // =====================================

  const sendMessage = () => {

    if (!input.trim())
      return;

    window.companySocket.send(

      JSON.stringify({

        message: input,

        sender_id: senderId,
      })
    );

    setInput("");
  };

  return (

    <div className="chat-page" style={{ height: "calc(100vh - 48px)" }}>

      {/* SIDEBAR */}
      <div className="chat-sidebar">

        <h2>
          Student Messages
        </h2>

        {
          conversations.map(
            (conversation) => (

              <div
                key={conversation.id}

                className={`chat-user ${
                  selectedConversation?.id ===
                  conversation.id

                    ? "active"

                    : ""
                }`}

                onClick={async () => {
                  setSelectedConversation(conversation);
                  
                  // Update local unread count
                  setConversations(prev => prev.map(c => 
                    c.id === conversation.id ? {...c, unread_count: 0} : c
                  ));
            
                  // Mark messages as read
                  try {
                    const token = localStorage.getItem("token");
                    await fetch(`http://127.0.0.1:8000/api/mark-read/${conversation.id}/`, {
                      method: "POST",
                      headers: { Authorization: `Bearer ${token}` }
                    });
                  } catch (error) {
                    console.error(error);
                  }
                }}
              >

                {/* <div className="chat-avatar">

                  {
                    conversation.student_name
                      ?.charAt(0)
                  }

                </div> */}

                <div>

                  <h4>

                    {
                      conversation.student_name
                    }

                  </h4>

                  {/* <p>

                    {
                      conversation.job_title
                    }

                  </p> */}

                </div>
                
                {conversation.unread_count > 0 && (
                  <span className="unread-badge">
                    {conversation.unread_count}
                  </span>
                )}

              </div>
            )
          )
        }

      </div>

      {/* CHAT WINDOW */}
      <div className="chat-window">

        {
          selectedConversation ? (

            <>

              {/* HEADER */}
              <div className="chat-header">

                <h3>

                  {
                    selectedConversation.student_name
                  }

                </h3>

              </div>

              {/* MESSAGES */}
              <div className="chat-messages">

                {
                  messages.map(
                    (msg, index) => (

                      <div
                        key={index}

                        className={`message-bubble ${
                          Number(
                            msg.sender_id
                          ) === Number(senderId)

                            ? "sent"

                            : "received"
                        }`}
                      >

                        {msg.message}

                      </div>
                    )
                  )
                }

              </div>

              {/* INPUT */}
              <div className="chat-input-box">

                <input
                  type="text"

                  placeholder="Type message..."

                  value={input}

                  onChange={(e) =>
                    setInput(
                      e.target.value
                    )
                  }
                />

                <button
                  onClick={sendMessage}
                >

                  Send

                </button>

              </div>

            </>

          ) : (

            <div className="empty-chat">

              Select a student conversation

            </div>
          )
        }

      </div>

    </div>
  );
}