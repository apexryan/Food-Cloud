import React, { useState, useEffect } from "react";
import { Controls } from "./Controls/Controls.jsx";
import styles from "./Chat.module.css";
import { Loader } from "./Loader/Loader.jsx";
import apiService from "../../services/apiService";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(
    () => `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  );

  // Initialize chat on component mount
  useEffect(() => {
    const initChat = async () => {
      try {
        // Add welcome message
        addMessage({
          content:
            "Hello! I'm your AI Food Assistant. I can help you with food-related questions, recipes, nutrition advice, and more. How can I assist you today?",
          role: "model",
        });
      } catch (error) {
        console.error("Error initializing chat:", error);
        addMessage({
          content:
            "Sorry, I'm having trouble connecting right now. Please try again later.",
          role: "model",
        });
      }
    };
    initChat();
  }, []);

  function addMessage(message) {
    setMessages((prevMessages) => [...prevMessages, message]);
  }

  async function handleContentSend(content) {
    addMessage({ content, role: "user" });
    setIsLoading(true);

    try {
      const data = await apiService.sendChatMessage(content, sessionId);
      const reply = data?.reply || "(No response)";
      addMessage({ content: reply, role: "model" });
    } catch (error) {
      console.error("Error sending message:", error);
      addMessage({
        content: "Sorry, I encountered an error. Please try again.",
        role: "model",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesContainer}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${styles.message} ${
              message.role === "user" ? styles.userMessage : styles.botMessage
            }`}
          >
            <div className={styles.messageContent}>{message.content}</div>
          </div>
        ))}
        {isLoading && <Loader />}
      </div>
      <Controls onSendMessage={handleContentSend} />
    </div>
  );
};

export default Chatbot;
