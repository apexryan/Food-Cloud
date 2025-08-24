import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Controls } from "./Controls/Controls.jsx";
import styles from "./Chat.module.css";
import { Loader } from "./Loader/Loader.jsx";

// Load API key securely
const API_KEY = "AIzaSyBZaqKBTZTUds0ptmk1R41mjS36PRIDIAU";
const googleai = new GoogleGenerativeAI(API_KEY);
const gemini = googleai.getGenerativeModel({ model: "gemini-2.0-flash" });

const Chatboat = () => {
  const [messages, setMessages] = useState([]);
  const [chat, setChat] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize chat on component mount
  useEffect(() => {
    const initChat = async () => {
      try {
        const newChat = gemini.startChat({ history: [] });
        setChat(newChat);

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
      if (!chat) {
        addMessage({
          content: "Chat service unavailable. Please try again later.",
          role: "model",
        });
        return;
      }

      const result = await chat.sendMessage(content);
      const response = await result.response;
      const text = response.text();

      addMessage({ content: text, role: "model" });
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

export default Chatboat;
