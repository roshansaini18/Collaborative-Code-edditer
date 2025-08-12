// frontend/src/components/ChatSidebar.js
import React, { useEffect, useRef, useState } from "react";
import { UserOutlined, SmileOutlined, SendOutlined, CloseOutlined } from "@ant-design/icons";
import {
    Flex,
    Avatar,
    Button,
    Input,
    Space,
    Card,
    Typography,
    Popover,
} from "antd";

const { Text } = Typography;

const ChatSidebar = ({
    users = [],
    messages = [],
    width = 400,
    chatInput,
    setChatInput,
    onSendMessage = () => {},
    onClose, // Add an onClose prop to handle closing the sidebar
}) => {
    const chatMessagesRef = useRef(null);
    const [emojiOpen, setEmojiOpen] = useState(false);
    const [showChat, setShowChat] = useState(true);

    const storedUser = localStorage.getItem("user");
    const userData = storedUser ? JSON.parse(storedUser) : {};
    const currentUserName = userData.userName || "Anonymous";

    // Auto-scroll to the bottom of the message list whenever new messages arrive
    useEffect(() => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    }, [messages]);

    // Handle responsive chat visibility based on window width
    useEffect(() => {
        const handleResize = () => {
            setShowChat(window.innerWidth >= 1100);
        };
        handleResize(); // Set initial state
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleSendMessage = () => {
        // Use optional chaining and trim to safely handle the input
        if (!chatInput?.trim()) return;
        
        const newUserMessage = {
            userName: currentUserName,
            text: chatInput,
            timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };
        onSendMessage(newUserMessage);
        setChatInput(""); // Clear the input field after sending
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
            <div
                key={index}
                className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}
            >
                <div
                    className={`flex ${isCurrentUser ? "flex-row-reverse" : "flex-row"} items-start max-w-[80%]`}
                >
                    <Avatar
                        icon={<UserOutlined />}
                        style={{
                            background: isCurrentUser ? "#1890ff" : "#87d068",
                            marginLeft: isCurrentUser ? "8px" : "0",
                            marginRight: isCurrentUser ? "0" : "8px",
                        }}
                        size="small"
                    />
                    <div
                        className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}
                    >
                        <Text style={{ fontSize: "12px", marginBottom: "4px", color: "#888" }}>
                            {isCurrentUser ? "You" : msg.userName}
                        </Text>
                        <Card
                            size="small"
                            style={{
                                background: isCurrentUser ? "#e6f7ff" : "#f5f5f5",
                                color: "#000",
                                border: "1px solid #d9d9d9",
                                borderRadius: isCurrentUser
                                    ? "12px 12px 4px 12px"
                                    : "12px 12px 12px 4px",
                                maxWidth: "100%",
                            }}
                            bodyStyle={{ padding: "8px 12px" }}
                        >
                            <Text style={{ color: "#000" }}>{msg.text}</Text>
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
        <div
            className="flex flex-col"
            style={{
                width: `${width}px`,
                backgroundColor: "#ffffff",
                borderRight: "1px solid #e0e0e0",
                color: "#000",
                height: "100%",
                fontFamily: "sans-serif",
            }}
        >
            {/* Header with Close Button */}
            <Flex
                justify="space-between"
                align="center"
                style={{
                    padding: "16px",
                    borderBottom: "1px solid #e0e0e0",
                    background: "#fafafa",
                }}
            >
                <Text strong style={{ color: "#000" }}>Chat</Text>
                <Button 
                    icon={<CloseOutlined />} 
                    type="text" 
                    onClick={onClose} 
                />
            </Flex>

            {/* Users Section */}
            <div
                style={{
                    padding: "16px",
                    borderBottom: "1px solid #e0e0e0",
                    background: "#fafafa",
                }}
            >
                <Text strong style={{ color: "#000", marginBottom: "12px", display: "block" }}>
                    Users ({users.length})
                </Text>
                <div className="flex flex-wrap gap-2">
                    {users.map((user, i) => (
                        <Card
                            key={i}
                            size="small"
                            style={{
                                borderRadius: "16px",
                                background: "#fff",
                                border: "1px solid #e0e0e0",
                                color: "#000",
                            }}
                            bodyStyle={{ padding: "4px 12px" }}
                        >
                            <Space size={4}>
                                <Avatar size={16} icon={<UserOutlined />} style={{ background: "#1890ff" }} />
                                <Text style={{ fontSize: "12px" }}>
                                    {user.userName === currentUserName ? "You" : user.userName}
                                </Text>
                            </Space>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Chat section */}
            {showChat && (
                <div className="flex-1 flex flex-col">
                    {/* Messages Area */}
                    <div
                        ref={chatMessagesRef}
                        className="flex-1 p-4 overflow-y-auto"
                        style={{ maxHeight: "calc(100vh - 300px)" }}
                    >
                        {messages.map((msg, index) => renderMessage(msg, index))}
                    </div>

                    {/* Input Area */}
                    <div
                        style={{
                            padding: "16px", // Adjusted padding for better spacing
                            borderTop: "1px solid #e0e0e0",
                            backgroundColor: "#fafafa",
                        }}
                    >
                        <Flex gap="small">
                            <Popover
                                content={
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", maxWidth: "200px" }}>
                                        {emojiList.map((emoji, idx) => (
                                            <span
                                                key={idx}
                                                onClick={() => handleEmojiClick(emoji)}
                                                style={{ cursor: "pointer", fontSize: "20px" }}
                                            >
                                                {emoji}
                                            </span>
                                        ))}
                                    </div>
                                }
                                trigger="click"
                                open={emojiOpen}
                                onOpenChange={setEmojiOpen}
                            >
                                <Button
                                    icon={<SmileOutlined />}
                                    style={{
                                        color: "#fff",
                                        background: "#1890ff",
                                        border: "none",
                                    }}
                                />
                            </Popover>

                            <Input
                                placeholder="Type a message..."
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                style={{
                                    flex: 1,
                                    background: "#ffffff",
                                    border: "1px solid #d9d9d9",
                                    color: "#000",
                                }}
                            />

                            <Button
                                icon={<SendOutlined />}
                                onClick={handleSendMessage}
                                disabled={!chatInput?.trim()} // Use optional chaining for disabled prop
                                size="middle"
                                style={{
                                    backgroundColor: "#ff4d4f",
                                    border: "none",
                                    color: "white",
                                }}
                            />
                        </Flex>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatSidebar;
