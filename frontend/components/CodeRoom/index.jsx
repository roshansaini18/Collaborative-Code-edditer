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

const CodeRoom = ({ user, roomId, onLeave, onLogout }) => {
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [theme, setTheme] = useState('vs-dark');
    const [output, setOutput] = useState('');
    const [input, setInput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [sidebarWidth, setSidebarWidth] = useState(window.innerWidth / 4);
    const [editorHeight, setEditorHeight] = useState(500);

    const isDraggingSidebar = useRef(false);
    const isDraggingEditor = useRef(false);
    const dragStartX = useRef(0);
    const dragStartY = useRef(0);
    const initialSidebarWidth = useRef(0);
    const initialEditorHeight = useRef(0);

    const socketRef = useRef(null);
    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    const ydocRef = useRef(new Y.Doc());
    const providerRef = useRef(null);
    const bindingRef = useRef(null);
    const pendingInitialCode = useRef(null);

    // Get current user from localStorage
    const currentUser = (() => {
        try {
            const storedUser = localStorage.getItem('user');
            const userData = storedUser ? JSON.parse(storedUser) : {};
            const name = userData.userName || 'Anonymous';
            const avatar = userData.avatar || userData.photoURL || null;
            return { userName: name, avatar };
        } catch (e) {
            return { userName: 'Anonymous' };
        }
    })();

    useEffect(() => {
        const socketUrl = import.meta.env.VITE_REACT_APP_SOCKET_URL || 'http://localhost:3001';
        socketRef.current = io(socketUrl, {
            transports: ['websocket', 'polling'],
            autoConnect: true,
        });
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

        socket.on('receive-message', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        if (currentUser?.userName && roomId) {
            const ywsUrl = import.meta.env.VITE_REACT_APP_YWS_URL || 'ws://localhost:3001/yws';
            providerRef.current = new WebsocketProvider(
                ywsUrl,
                roomId,
                ydocRef.current,
                { connect: true }
            );
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

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;

        const yText = ydocRef.current.getText('monaco');

        if (!bindingRef.current && providerRef.current) {
            const model = editor.getModel();
            bindingRef.current = new MonacoBinding(
                yText,
                model,
                new Set([editor]),
                providerRef.current.awareness
            );
        }

        if (pendingInitialCode.current) {
            editor.setValue(pendingInitialCode.current);
            pendingInitialCode.current = null;
        }
    };

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

    const handleSidebarResizeStart = (e) => {
        isDraggingSidebar.current = true;
        dragStartX.current = e.clientX;
        initialSidebarWidth.current = sidebarWidth;
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'col-resize';
    };

    const handleEditorResizeStart = (e) => {
        isDraggingEditor.current = true;
        dragStartY.current = e.clientY;
        initialEditorHeight.current = editorHeight;
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'row-resize';
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDraggingSidebar.current) {
                const deltaX = e.clientX - dragStartX.current;
                let newSidebarWidth = initialSidebarWidth.current + deltaX;
                const minWidth = 200;
                const maxWidth = window.innerWidth * 0.75;
                if (newSidebarWidth < minWidth) newSidebarWidth = minWidth;
                if (newSidebarWidth > maxWidth) newSidebarWidth = maxWidth;
                setSidebarWidth(newSidebarWidth);
            } else if (isDraggingEditor.current) {
                const deltaY = e.clientY - dragStartY.current;
                let newEditorHeight = initialEditorHeight.current + deltaY;
                const minH = 100;
                const maxH = window.innerHeight - 164;
                if (newEditorHeight < minH) newEditorHeight = minH;
                if (newEditorHeight > maxH) newEditorHeight = maxH;
                setEditorHeight(newEditorHeight);
            }
        };

        const handleMouseUp = () => {
            isDraggingSidebar.current = false;
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

    // --- CODE RUNNER LOGIC ---
    const handleRunCode = async () => {
        const code = editorRef.current.getValue();
        if (!code) {
            toast.error('Code cannot be empty!');
            return;
        }

        setIsRunning(true);
        setOutput('');
        try {
            // Updated endpoint to use the environment variable
            const apiUrl = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/api/run-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: code,
                    language: language,
                    input: input,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                if (result.stderr) {
                    setOutput(`Execution Error:\n${result.stderr}`);
                } else if (result.compile_output) {
                    setOutput(`Compilation Error:\n${result.compile_output}`);
                } else if (result.stdout) {
                    setOutput(result.stdout);
                } else {
                    setOutput('No output received.');
                }
            } else {
                setOutput(`Error: ${result.error || 'An unknown error occurred.'}`);
            }
        } catch (error) {
            console.error('Code execution failed:', error);
            setOutput('Failed to connect to the code runner backend.');
        } finally {
            setIsRunning(false);
        }
    };
    // ----------------------------

    // --- SAVE LOGIC ---
    const handleSaveCode = async () => {
        const code = editorRef.current.getValue();
        if (!code) {
            toast.error('Code cannot be empty!');
            return;
        }

        try {
            // Updated endpoint to use the environment variable
            const apiUrl = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/api/save-code/${roomId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: code }),
            });

            if (response.ok) {
                toast.success('Code saved successfully!');
            } else {
                const errorData = await response.json();
                toast.error(`Failed to save code: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Save code failed:', error);
            toast.error('Failed to connect to the backend server.');
        }
    };
    // ----------------------------

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
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />
            <main className="flex-grow flex flex-col lg:flex-row overflow-hidden min-w-0">
                <ChatSidebar
                    users={users}
                    messages={messages}
                    chatInput={chatInput}
                    setChatInput={setChatInput}
                    onSendMessage={handleSendMessage} // Correct prop name
                    width={sidebarWidth}
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    style={{ flexShrink: 0 }}
                />

                {/* Sidebar resizer */}
                <div
                    className="hidden lg:block w-2 h-full cursor-col-resize bg-gray-700 hover:bg-gray-500"
                    onMouseDown={handleSidebarResizeStart}
                />

                <CodeEditorPanel
                    language={language}
                    setLanguage={setLanguage}
                    theme={theme}
                    setTheme={setTheme}
                    isRunning={isRunning}
                    handleRunCode={handleRunCode}
                    handleSaveCode={handleSaveCode}
                    handleEditorDidMount={handleEditorDidMount}
                    handleEditorChange={() => { }}
                    editorHeight={editorHeight}
                    onMouseDownEditor={handleEditorResizeStart}
                    style={{ flex: '1 1 auto', minWidth: 0 }}
                >
                    <OutputAndInputPanel input={input} setInput={setInput}/>
                    <div className="bg-gray-900 text-white p-4 font-mono overflow-auto rounded-b-lg shadow-inner" style={{ height: '50%' }}>
                 <pre>{output}</pre>
                </div>
                </CodeEditorPanel>
            </main>
        </div>
    );
};

export default CodeRoom;
