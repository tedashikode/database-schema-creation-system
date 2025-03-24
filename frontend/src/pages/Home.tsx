import React, { useState, useRef, useEffect } from "react";
import UpArrowSVG from "../assets/UpArrowSVG";
// Define Message interface
interface Message {
  role: "user" | "assistant";
  content: string;
}

// API base URL
const apiUrl = import.meta.env.VITE_API_URL;

// ChatBox component (same as before, except adjusted width)
const ChatBox = ({
  onSendMessage,
}: {
  onSendMessage: (message: string) => void;
}) => {
  const [prompt, setPrompt] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() !== "") {
      onSendMessage(prompt);
      setPrompt(""); // Clear input after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"; // Reset textarea height
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // Check if Enter key is pressed without Shift key
      e.preventDefault(); // Prevent new line in textarea
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  return (
    <div className="absolute bottom-32 flex w-1/2 justify-between items-center border-solid border-1 border-gray-300 shadow-sm rounded-3xl p-3 gap-4 ">
      <form
        onSubmit={handleSubmit}
        className="flex w-full  outline outline-green-400"
      >
        <div className="flex w-full">
          <label htmlFor="prompt"></label>
          <textarea
            ref={textareaRef}
            className="flex w-full resize-none border-0 bg-transparent px-0 py-2 focus:outline-none focus:ring-0"
            placeholder="Ask anything"
            id="prompt"
            name="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown} // Attach handleKeyDown to textarea
            onInput={() => {
              if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
              }
            }}
          />
        </div>
      </form>
      <button type="submit" className="bg-zinc-950 border rounded-full p-2">
        <UpArrowSVG />
      </button>
    </div>
  );
};

// MessageBubble component (same as before)
const MessageBubble = ({ message }: { message: Message }) => {
  const isUserMessage = message.role === "user";
  const bubbleStyle = isUserMessage
    ? "bg-gray-200 text-black self-end" // Grey background for user messages
    : "bg-white text-black self-start"; // White background for AI responses

  return (
    <div className={`rounded-xl p-3 my-2 max-w-2/3 ${bubbleStyle}`}>
      {message.content}
    </div>
  );
};

// ChatDisplay component (same as before)
const ChatDisplay = ({ messages }: { messages: Message[] }) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const visibleMessages = messages.slice(-2); // Get the last two messages

  useEffect(() => {
    // Scroll to the bottom of the chat container when new messages are added
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className="flex flex-col items-center mt-8 outline outline-green-600"
      ref={chatContainerRef}
      style={{
        overflowY: "hidden", // Hide vertical overflow
        height: "200px", // Fixed height
        maxWidth: "calc(2/3 * 50%)", // Adjusted width: 2/3 of ChatBox width
      }}
    >
      {visibleMessages.map((message, index) => (
        <MessageBubble key={index} message={message} />
      ))}
    </div>
  );
};

// SQLTableDisplay component
const SQLTableDisplay = ({ schemaData }: { schemaData: any }) => {
  return (
    <div className="absolute top-8 flex flex-col max-h-56 max-w-2/3 items-center p-4 border border-gray-300 rounded-lg">
      <h2>Database Schema</h2>
      {schemaData ? (
        <pre>{JSON.stringify(schemaData, null, 2)}</pre>
      ) : (
        <p>No schema data available</p>
      )}
    </div>
  );
};

// Main Home component with adjustments to layout
const Home = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [schemaData, setSchemaData] = useState<any>(null); // State for schema data

  const sendMessageToBackend = async (message: string) => {
    try {
      const userMessage: Message = { role: "user", content: message };
      const newMessages = [...messages, userMessage];

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.question) {
        // AI responded with a question
        const assistantMessage: Message = {
          role: "assistant",
          content: data.question,
        };
        setMessages([...newMessages, assistantMessage]);
      } else if (data.projectId) {
        // AI responded with a projectId, fetch schema
        console.log("Project ID:", data.projectId);
        fetchSchemaData(data.projectId); // Fetch schema and update state
      } else if (data.error) {
        setError(data.error);
      } else {
        setError("Unknown error from API.");
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
      setError(error.message);
    }
  };

  const fetchSchemaData = async (projectId: string) => {
    try {
      const response = await fetch(`${apiUrl}/${projectId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setSchemaData(data.schemaData); // Update schema data state
    } catch (error: any) {
      console.error("Error fetching schema data:", error);
      setError(error.message);
    }
  };

  return (
    <main className="relative flex w-dvw h-dvh items-center justify-center flex-col">
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      <SQLTableDisplay schemaData={schemaData} />{" "}
      {/* SQL Table Display above chat */}
      <ChatDisplay messages={messages} />
      <ChatBox onSendMessage={sendMessageToBackend} />
    </main>
  );
};

export default Home;
