// // frontend/src/components/ChatSidebar.js
// import React, { useEffect, useRef, useState } from "react";
// import { UserOutlined, SmileOutlined, SendOutlined, CloseOutlined } from "@ant-design/icons";
// import {
//     Flex,
//     Avatar,
//     Button,
//     Input,
//     Space,
//     Card,
//     Typography,
//     Popover,
// } from "antd";

// const { Text } = Typography;

// const ChatSidebar = ({
//     users = [],
//     messages = [],
//     width = 400,
//     chatInput,
//     setChatInput,
//     onSendMessage = () => {},
//     onClose,
// }) => {
//     const chatMessagesRef = useRef(null);
//     const [emojiOpen, setEmojiOpen] = useState(false);

//     const storedUser = localStorage.getItem("user");
//     const userData = storedUser ? JSON.parse(storedUser) : {};
//     const currentUserName = userData.userName || "Anonymous";

//     useEffect(() => {
//         if (chatMessagesRef.current) {
//             chatMessagesRef.current.scrollTop =
//                 chatMessagesRef.current.scrollHeight;
//         }
//     }, [messages]);

//     const handleSendMessage = () => {
//         if (!chatInput?.trim()) return;
//         const newUserMessage = {
//             userName: currentUserName,
//             text: chatInput,
//             timestamp: new Date().toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//             }),
//         };
//         onSendMessage(newUserMessage);
//         setChatInput("");
//     };

//     const handleKeyPress = (e) => {
//         if (e.key === "Enter" && !e.shiftKey) {
//             e.preventDefault();
//             handleSendMessage();
//         }
//     };

//     const emojiList = ["😀", "😂", "😍", "👍", "🔥", "🎉", "❤️", "😎"];
//     const handleEmojiClick = (emoji) => {
//         setChatInput((prev) => prev + emoji);
//         setEmojiOpen(false);
//     };

//     const renderMessage = (msg, index) => {
//         const isCurrentUser = msg.userName === currentUserName;
//         return (
//             <div
//                 key={index}
//                 className={`flex ${
//                     isCurrentUser ? "justify-end" : "justify-start"
//                 } mb-4`}
//             >
//                 <div
//                     className={`flex ${
//                         isCurrentUser ? "flex-row-reverse" : "flex-row"
//                     } items-start max-w-[80%]`}
//                 >
//                     <Avatar
//                         icon={<UserOutlined />}
//                         style={{
//                             background: isCurrentUser ? "#1890ff" : "#87d068",
//                             marginLeft: isCurrentUser ? "8px" : "0",
//                             marginRight: isCurrentUser ? "0" : "8px",
//                         }}
//                         size="small"
//                     />
//                     <div
//                         className={`flex flex-col ${
//                             isCurrentUser ? "items-end" : "items-start"
//                         }`}
//                     >
//                         <Text style={{ fontSize: "12px", marginBottom: "4px", color: "#888" }}>
//                             {isCurrentUser ? "You" : msg.userName}
//                         </Text>
//                        <Card
//                             size="small"
//                             style={{
//                                 background: isCurrentUser ? "#e6f7ff" : "#f5f5f5",
//                                 color: "#000",
//                                 border: "1px solid #d9d9d9",
//                                 borderRadius: isCurrentUser
//                                     ? "12px 12px 4px 12px"
//                                     : "12px 12px 12px 4px",
//                                 maxWidth: "80%",
//                             }}
//                             styles={{ body: { padding: "8px 12px" } }}
//                         >
//                             <Text style={{ color: "#000" }}>{msg.text}</Text>
//                         </Card>
//                         <Text style={{ fontSize: "10px", marginTop: "2px", color: "#aaa" }}>
//                             {msg.timestamp}
//                         </Text>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     return (
//         <div
//             className="flex flex-col"
//             style={{
//                 width: `${width}px`,
//                 backgroundColor: "#ffffff",
//                 borderRight: "1px solid #e0e0e0",
//                 color: "#000",
//                 height: "100vh",
//                 maxHeight: "70vh",
//                 fontFamily: "sans-serif",
//             }}
//         >
//             <Flex
//                 justify="space-between"
//                 align="center"
//                 style={{
//                     padding: "16px",
//                     borderBottom: "1px solid #e0e0e0",
//                     background: "#fafafa",
//                 }}
//             >
//                 <Text strong style={{ color: "#000" }}>Chat</Text>
//                 <Button 
//                     icon={<CloseOutlined />} 
//                     type="text" 
//                     onClick={onClose}
//                 />
//             </Flex>
            
//             {/* The main chat content is now always rendered */}
//             <div className="flex-1 flex flex-col">
//                 <div
//                     style={{
//                         padding: "16px",
//                         borderBottom: "1px solid #e0e0e0",
//                         background: "#fafafa",
//                     }}
//                 >
//                 </div>

//                 {/* Messages Area */}
//                 <div
//                     ref={chatMessagesRef}
//                     className="flex-1 p-4 overflow-y-auto"
//                     style={{ maxHeight: "calc(70vh - 120px)" }} 
//                 >
//                     {messages.map((msg, index) => renderMessage(msg, index))}
//                 </div>

//                 {/* Input Area */}
//                 <div
//                     style={{
//                         padding: "32px",
//                         borderTop: "1px solid #e0e0e0",
//                         backgroundColor: "#fafafa",
//                     }}
//                 >
//                     <Flex gap="small">
//                         <Popover
//                             content={
//                                 <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
//                                     {emojiList.map((emoji, idx) => (
//                                         <span
//                                             key={idx}
//                                             onClick={() => handleEmojiClick(emoji)}
//                                             style={{ cursor: "pointer", fontSize: "20px" }}
//                                         >
//                                             {emoji}
//                                         </span>
//                                     ))}
//                                 </div>
//                             }
//                             trigger="click"
//                             open={emojiOpen}
//                             onOpenChange={setEmojiOpen}
//                         >
//                             <Button
//                                 icon={<SmileOutlined />}
//                                 style={{
//                                     color: "#fff",
//                                     background: "#1890ff",
//                                     border: "none",
//                                 }}
//                             />
//                         </Popover>

//                         <Input
//                             placeholder="Type a message..."
//                             value={chatInput}
//                             onChange={(e) => setChatInput(e.target.value)}
//                             onKeyPress={handleKeyPress}
//                             style={{
//                                 flex: 1,
//                                 background: "#ffffff",
//                                 border: "1px solid #d9d9d9",
//                                 color: "#000",
//                             }}
//                         />

//                         <Button
//                             icon={<SendOutlined />}
//                             onClick={handleSendMessage}
//                             disabled={!chatInput?.trim()}
//                             size="middle"
//                             style={{
//                                 backgroundColor: "#ff4d4f",
//                                 border: "none",
//                                 color: "white",
//                             }}
//                         >
//                             Send
//                         </Button>
//                     </Flex>
//                 </div>
//             </div>
//         </div>
//     );
// };



import React, { useEffect, useRef, useState } from "react";
import { UserOutlined, SmileOutlined, SendOutlined } from "@ant-design/icons";
import { Flex, Avatar, Button, Input, Card, Typography, Popover } from "antd";

const { Text } = Typography;

const ChatSidebar = ({
    users = [],
    messages = [],
    chatInput,
    setChatInput,
    onSendMessage = () => {},
}) => {
    const chatMessagesRef = useRef(null);
    const [emojiOpen, setEmojiOpen] = useState(false);

    const storedUser = localStorage.getItem("user");
    const userData = storedUser ? JSON.parse(storedUser) : {};
    const currentUserName = userData.userName || "Anonymous";

    useEffect(() => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (!chatInput?.trim()) return;
        const newUserMessage = {
            userName: currentUserName,
            text: chatInput,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        onSendMessage(newUserMessage);
        setChatInput("");
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const emojiList = ["😀", "😂", "😍", "👍", "🔥", "🎉", "❤️", "😎"];
    const handleEmojiClick = (emoji) => {
        setChatInput((prev) => prev + emoji);
        setEmojiOpen(false);
    };

    const renderMessage = (msg, index) => {
        const isCurrentUser = msg.userName === currentUserName;
        return (
            <div key={index} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}>
                <div className={`flex ${isCurrentUser ? "flex-row-reverse" : "flex-row"} items-start max-w-[80%]`}>
                    <Avatar
                        icon={<UserOutlined />}
                        style={{
                            background: isCurrentUser ? "#1890ff" : "#87d068",
                            marginLeft: isCurrentUser ? "8px" : "0",
                            marginRight: isCurrentUser ? "0" : "8px",
                        }}
                        size="small"
                    />
                    <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}>
                        <Text style={{ fontSize: "12px", marginBottom: "4px", color: "#888" }}>
                            {isCurrentUser ? "You" : msg.userName}
                        </Text>
                        <Card
                            size="small"
                            style={{
                                background: isCurrentUser ? "#e6f7ff" : "#f5f5f5",
                                border: "1px solid #d9d9d9",
                                borderRadius: isCurrentUser ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
                            }}
                        >
                            <Text>{msg.text}</Text>
                        </Card>
                        <Text style={{ fontSize: "10px", marginTop: "2px", color: "#aaa" }}>
                            {msg.timestamp}
                        </Text>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-white text-black">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-300 bg-gray-100">
                <Text strong>Chat</Text>
            </div>

            {/* Messages */}
            <div ref={chatMessagesRef} className="flex-1 overflow-y-auto p-4">
                {messages.map((msg, index) => renderMessage(msg, index))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-300 bg-gray-100">
                <Flex gap="small">
                    <Popover
                        content={
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                                {emojiList.map((emoji, idx) => (
                                    <span key={idx} onClick={() => handleEmojiClick(emoji)} style={{ cursor: "pointer", fontSize: "20px" }}>
                                        {emoji}
                                    </span>
                                ))}
                            </div>
                        }
                        trigger="click"
                        open={emojiOpen}
                        onOpenChange={setEmojiOpen}
                    >
                        <Button icon={<SmileOutlined />} style={{ background: "#1890ff", color: "#fff", border: "none" }} />
                    </Popover>

                    <Input
                        placeholder="Type a message..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />

                    <Button
                        icon={<SendOutlined />}
                        onClick={handleSendMessage}
                        disabled={!chatInput?.trim()}
                        style={{ background: "#ff4d4f", color: "white", border: "none" }}
                    >
                        Send
                    </Button>
                </Flex>
            </div>
        </div>
    );
};

export default ChatSidebar;


// export default ChatSidebar;
