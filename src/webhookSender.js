import React, { useState, useEffect } from "react";
import axios from "axios";

const WebhookApp = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queue, setQueue] = useState([]);

  const webhookUrl =
    "https://webhook.site/da2b574f-7a6f-4046-8665-934dbf7e2b7d";

  // Function to handle sending requests
  const sendRequest = async () => {
    try {
      await axios.post(webhookUrl, { message: "Hello, Webhook!" });
      console.log("Request sent successfully");
    } catch (error) {
      console.log("Failed to send request", error);
    }
  };

  // Function to buffer requests if offline
  const bufferRequest = () => {
    const newQueue = [...queue, { message: "Hello, Webhook!" }];
    setQueue(newQueue);
    console.log("Request buffered", newQueue);
  };

  // Function to handle "Hit Me" button click
  const handleClick = () => {
    if (isOnline) {
      sendRequest();
    } else {
      bufferRequest();
    }
  };

  // Function to send all buffered requests
  const sendBufferedRequests = async () => {
    while (queue.length > 0) {
      try {
        console.log("req", queue);
        await axios.post(webhookUrl, JSON.stringify(queue));
        setQueue([]);
        console.log("Buffered request sent successfully");
      } catch (error) {
        console.log("Failed to send buffered request", error);
        break;
      }
    }
  };

  // Effect to monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      sendBufferedRequests();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [queue]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Webhook App</h1>
      <button
        onClick={handleClick}
        style={{ padding: "10px 20px", fontSize: "16px" }}
      >
        Hit Me
      </button>
      <p>Status: {isOnline ? "Online" : "Offline"}</p>
    </div>
  );
};

export default WebhookApp;
