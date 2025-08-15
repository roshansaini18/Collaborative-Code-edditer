import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import * as Y from 'yjs';
import { MonacoBinding } from 'y-monaco';
import { WebsocketProvider } from 'y-websocket';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Header from '../Header';
import ChatSidebar from '../ChatSlidebar';
import CodeEditorPanel from '../CodeEditorPanel';
import OutputAndInputPanel from '../OutputAndInputPanel';
import { Splitter } from 'antd';
import { Code, MessageCircle, Terminal } from 'lucide-react'; // Icons for navigation

const CodeRoom = ({ user, roomId, onLeave, onLogout }) => {
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [theme, setTheme] = useState('vs-dark');
    const [output, setOutput] = useState('');
    const [input, setInput] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    const [editorHeight, setEditorHeight] = useState(500);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    
    // Default mobile view is now 'code'
    const [activeView, setActiveView] = useState('code');

    const isDraggingEditor = useRef(false);
    const dragStartY = useRef(0);
    const initialEditorHeight = useRef(0);

    const socketRef = useRef(null);
    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    const ydocRef = useRef(new Y.Doc());
    const providerRef = useRef(null);
    const bindingRef = useRef(null);
    const pendingInitialCode = useRef(null);

    // (No changes to useEffect hooks, currentUser, handleEditorDidMount, handleSendMessage, or resize logic)

    // ... (Keep all existing useEffects and handlers here without any changes) ...
     // Handle window resize
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Current user (no changes)
    const currentUser = (() => {
        try {
            const storedUser = localStorage.getItem('user');
            const userData = storedUser ? JSON.parse(storedUser) : {};
            return {
                userName: userData.userName || 'Anonymous',
                avatar: userData.avatar || userData.photoURL || null
            };
        } catch {
            return { userName: 'Anonymous' };
        }
    })();

    // Socket + Yjs setup (no changes)
    useEffect(() => {
        const socketUrl = import.meta.env.VITE_REACT_APP_SOCKET_URL || 'http://localhost:3001';
        socketRef.current = io(socketUrl, { transports: ['websocket', 'polling'], autoConnect: true });
        const socket = socketRef.current;

        socket.on('connect', () => {
            if (currentUser?.userName && roomId) {
                socket.emit('join-room', { roomId, user: currentUser });
            }
        });

        socket.on('initial-code', ({ code }) => {
            if (editorRef.current) {
                try { editorRef.current.setValue(code || ''); }
                catch (_) { pendingInitialCode.current = code || ''; }
            } else {
                pendingInitialCode.current = code || '';
            }
        });

        socket.on('initial-messages', (msgs) => setMessages(msgs || []));
        socket.on('initial-users', (usrs) => setUsers(usrs || []));
        socket.on('update-users', (usrs) => setUsers(usrs || []));
        socket.on('receive-message', (message) => setMessages((prev) => [...prev, message]));

        if (currentUser?.userName && roomId) {
            const ywsUrl = import.meta.env.VITE_REACT_APP_YWS_URL || 'ws://localhost:3001/yws';
            providerRef.current = new WebsocketProvider(ywsUrl, roomId, ydocRef.current, { connect: true });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.emit('leave-room', { roomId, user: currentUser });
                socketRef.current.disconnect();
            }
            providerRef.current?.destroy();
            ydocRef.current?.destroy();
            bindingRef.current = null;
        };
    }, [roomId]);

    // Monaco editor setup (no changes)
    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;
        const yText = ydocRef.current.getText('monaco');
        if (!bindingRef.current && providerRef.current) {
            const model = editor.getModel();
            bindingRef.current = new MonacoBinding(yText, model, new Set([editor]), providerRef.current.awareness);
        }
        if (pendingInitialCode.current) {
            editor.setValue(pendingInitialCode.current);
            pendingInitialCode.current = null;
        }
    };

    // Send chat message (no changes)
    const handleSendMessage = () => {
        if (chatInput.trim() && socketRef.current && currentUser?.userName && roomId) {
            const messageData = {
                userName: currentUser.userName,
                text: chatInput,
                timestamp: new Date().toISOString(),
            };
            socketRef.current.emit('send-message', { roomId, message: messageData });
            setChatInput('');
        }
    };

    // Resize editor height (no changes)
    const handleEditorResizeStart = (e) => {
        isDraggingEditor.current = true;
        dragStartY.current = e.clientY;
        initialEditorHeight.current = editorHeight;
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'row-resize';
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDraggingEditor.current) {
                const deltaY = e.clientY - dragStartY.current;
                let newEditorHeight = initialEditorHeight.current + deltaY;
                newEditorHeight = Math.max(100, Math.min(newEditorHeight, window.innerHeight - 164));
                setEditorHeight(newEditorHeight);
            }
        };
        const handleMouseUp = () => {
            isDraggingEditor.current = false;
            document.body.style.userSelect = 'auto';
            document.body.style.cursor = 'auto';
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);


    // Run code -> MODIFIED FOR MOBILE
    const handleRunCode = async () => {
        const code = editorRef.current.getValue();
        if (!code) return toast.error('Code cannot be empty!');
        
        // On mobile, switch to the OUTPUT view automatically after running code
        if (isMobile) {
            setActiveView('output');
        }

        setIsRunning(true);
        setOutput('');
        try {
            const apiUrl = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/api/run-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, language, input }),
            });
            const result = await response.json();
            if (response.ok) {
                if (result.stderr) setOutput(`Execution Error:\n${result.stderr}`);
                else if (result.compile_output) setOutput(`Compilation Error:\n${result.compile_output}`);
                else setOutput(result.stdout || 'No output received.');
            } else {
                setOutput(`Error: ${result.error || 'Unknown error'}`);
            }
        } catch {
            setOutput('Failed to connect to the backend.');
        } finally {
            setIsRunning(false);
        }
    };

    // Save code (no changes)
    const handleSaveCode = async () => {
        const code = editorRef.current.getValue();
        if (!code) return toast.error('Code cannot be empty!');
        try {
            const apiUrl = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/api/save-code/${roomId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
            });
            if (response.ok) toast.success('Code saved!');
            else toast.error('Failed to save code');
        } catch {
            toast.error('Failed to connect to the backend.');
        }
    };

    // Renders the mobile-specific layout -> COMPLETELY REWRITTEN
    const renderMobileLayout = () => (
        <div className="flex flex-col h-full">
            <div className="flex-grow overflow-auto">
                {activeView === 'code' && (
                    <Splitter layout="vertical" style={{ height: '100%' }}>
                        <Splitter.Panel defaultSize={65} minSize={20}>
                            <CodeEditorPanel
                                language={language}
                                setLanguage={setLanguage}
                                theme={theme}
                                setTheme={setTheme}
                                isRunning={isRunning}
                                handleRunCode={handleRunCode}
                                handleSaveCode={handleSaveCode}
                                handleEditorDidMount={handleEditorDidMount}
                                editorHeight="100%"
                            />
                        </Splitter.Panel>
                        <Splitter.Panel defaultSize={35} minSize={15}>
                            <OutputAndInputPanel
                                input={input}
                                setInput={setInput}
                            />
                        </Splitter.Panel>
                    </Splitter>
                )}

                {activeView === 'output' && (
                    <div className="flex flex-col h-full bg-gray-800 text-white font-mono">
                        <h3 className="font-semibold p-3 border-b border-gray-700 text-gray-300">
                            Output
                        </h3>
                        <pre className="p-3 whitespace-pre-wrap flex-grow overflow-auto">{output}</pre>
                    </div>
                )}
                
                {activeView === 'chat' && (
                    <ChatSidebar
                        users={users}
                        messages={messages}
                        chatInput={chatInput}
                        setChatInput={setChatInput}
                        onSendMessage={handleSendMessage}
                    />
                )}
            </div>
            
            {/* Updated Bottom Navigation Bar */}
            <div className="flex justify-around items-center bg-gray-800 p-2 border-t border-gray-700">
                <button onClick={() => setActiveView('code')} className={`p-2 rounded-lg flex flex-col items-center w-20 ${activeView === 'code' ? 'text-blue-400' : 'text-gray-400'}`}>
                    <Code size={24} />
                    <span className="text-xs mt-1">Code</span>
                </button>
                <button onClick={() => setActiveView('output')} className={`p-2 rounded-lg flex flex-col items-center w-20 ${activeView === 'output' ? 'text-blue-400' : 'text-gray-400'}`}>
                    <Terminal size={24} />
                    <span className="text-xs mt-1">Output</span>
                </button>
                <button onClick={() => setActiveView('chat')} className={`p-2 rounded-lg flex flex-col items-center w-20 ${activeView === 'chat' ? 'text-blue-400' : 'text-gray-400'}`}>
                    <MessageCircle size={24} />
                    <span className="text-xs mt-1">Chat</span>
                </button>
            </div>
        </div>
    );
    
    // Renders the original desktop layout (no changes)
    const renderDesktopLayout = () => (
        <Splitter style={{ height: '100%' }} layout="horizontal">
            <Splitter.Panel minSize={30} defaultSize={50}>
                <CodeEditorPanel
                    language={language}
                    setLanguage={setLanguage}
                    theme={theme}
                    setTheme={setTheme}
                    isRunning={isRunning}
                    handleRunCode={handleRunCode}
                    handleSaveCode={handleSaveCode}
                    handleEditorDidMount={handleEditorDidMount}
                    editorHeight={editorHeight}
                    onMouseDownEditor={handleEditorResizeStart}
                />
            </Splitter.Panel>
            <Splitter.Panel minSize={20} defaultSize={25}>
                <Splitter layout="vertical">
                    <Splitter.Panel defaultSize={50}>
                        <OutputAndInputPanel input={input} setInput={setInput} />
                    </Splitter.Panel>
                     <Splitter.Panel defaultSize={50}>
                        <div className="bg-gray-900 text-white p-4 font-mono overflow-auto rounded-b-lg shadow-inner h-full">
                            <div>Output:</div>
                            <pre className="whitespace-pre-wrap">{output}</pre>
                        </div>
                    </Splitter.Panel>
                </Splitter>
            </Splitter.Panel>
            <Splitter.Panel minSize={20} defaultSize={25}>
                <ChatSidebar
                    users={users}
                    messages={messages}
                    chatInput={chatInput}
                    setChatInput={setChatInput}
                    onSendMessage={handleSendMessage}
                />
            </Splitter.Panel>
        </Splitter>
    );

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
            <Header
                roomId={roomId}
                userProfile={currentUser}
                userCount={users.length}
                onLeave={onLeave}
                onLogout={onLogout}
                handleCopyId={() => {
                    navigator.clipboard.writeText(roomId);
                    toast.success('Room ID copied 📋');
                }}
            />
            <main className="flex-grow overflow-hidden">
                {isMobile ? renderMobileLayout() : renderDesktopLayout()}
            </main>
        </div>
    );
};

export default CodeRoom;
