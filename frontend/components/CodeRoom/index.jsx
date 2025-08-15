// // import React, { useState, useEffect, useRef } from 'react';
// // import { io } from 'socket.io-client';
// // import * as Y from 'yjs';
// // import { MonacoBinding } from 'y-monaco';
// // import { WebsocketProvider } from 'y-websocket';
// // import { ToastContainer, toast } from 'react-toastify';
// // import "react-toastify/dist/ReactToastify.css";
// // import Header from '../Header';
// // import ChatSidebar from '../ChatSlidebar';
// // import CodeEditorPanel from '../CodeEditorPanel';
// // import OutputAndInputPanel from '../OutputAndInputPanel';
// // import {Splitter} from 'antd';

// // const CodeRoom = ({ user, roomId, onLeave, onLogout }) => {
// //     const [users, setUsers] = useState([]);
// //     const [messages, setMessages] = useState([]);
// //     const [chatInput, setChatInput] = useState('');
// //     const [language, setLanguage] = useState('javascript');
// //     const [theme, setTheme] = useState('vs-dark');
// //     const [output, setOutput] = useState('');
// //     const [input, setInput] = useState('');
// //     const [isRunning, setIsRunning] = useState(false);
// //     const [isSidebarOpen, setIsSidebarOpen] = useState(false);

// //     const [sidebarWidth, setSidebarWidth] = useState(window.innerWidth / 4);
// //     const [editorHeight, setEditorHeight] = useState(500);
// //     const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
// //     const [isChatOpen, setIsChatOpen] = useState(false);
    
// //     const isDraggingSidebar = useRef(false);
// //     const isDraggingEditor = useRef(false);
// //     const dragStartX = useRef(0);
// //     const dragStartY = useRef(0);
// //     const initialSidebarWidth = useRef(0);
// //     const initialEditorHeight = useRef(0);

// //     const socketRef = useRef(null);
// //     const editorRef = useRef(null);
// //     const monacoRef = useRef(null);
// //     const ydocRef = useRef(new Y.Doc());
// //     const providerRef = useRef(null);
// //     const bindingRef = useRef(null);
// //     const pendingInitialCode = useRef(null);

// //      //for mobile size
// //     useEffect(() => {
// //   const handleResize = () => {
// //     setIsMobile(window.innerWidth < 768);
// //   };
// //   window.addEventListener('resize', handleResize);
// //   return () => window.removeEventListener('resize', handleResize);
// // }, []);

// //     // Get current user from localStorage
// //     const currentUser = (() => {
// //         try {
// //             const storedUser = localStorage.getItem('user');
// //             const userData = storedUser ? JSON.parse(storedUser) : {};
// //             const name = userData.userName || 'Anonymous';
// //             const avatar = userData.avatar || userData.photoURL || null;
// //             return { userName: name, avatar };
// //         } catch (e) {
// //             return { userName: 'Anonymous' };
// //         }
// //     })();

// //     useEffect(() => {
// //         const socketUrl = import.meta.env.VITE_REACT_APP_SOCKET_URL || 'http://localhost:3001';
// //         socketRef.current = io(socketUrl, {
// //             transports: ['websocket', 'polling'],
// //             autoConnect: true,
// //         });
// //         const socket = socketRef.current;

// //         socket.on('connect', () => {
// //             if (currentUser?.userName && roomId) {
// //                 socket.emit('join-room', { roomId, user: currentUser });
// //             }
// //         });

// //         socket.on('initial-code', ({ code }) => {
// //             if (editorRef.current) {
// //                 try { editorRef.current.setValue(code || ''); }
// //                 catch (_) { pendingInitialCode.current = code || ''; }
// //             } else {
// //                 pendingInitialCode.current = code || '';
// //             }
// //         });

// //         socket.on('initial-messages', (msgs) => setMessages(msgs || []));
// //         socket.on('initial-users', (usrs) => setUsers(usrs || []));
// //         socket.on('update-users', (usrs) => setUsers(usrs || []));

// //         socket.on('receive-message', (message) => {
// //             setMessages((prev) => [...prev, message]);
// //         });

// //         if (currentUser?.userName && roomId) {
// //             const ywsUrl = import.meta.env.VITE_REACT_APP_YWS_URL || 'ws://localhost:3001/yws';
// //             providerRef.current = new WebsocketProvider(
// //                 ywsUrl,
// //                 roomId,
// //                 ydocRef.current,
// //                 { connect: true }
// //             );
// //         }

// //         return () => {
// //             if (socketRef.current) {
// //                 socketRef.current.emit('leave-room', { roomId, user: currentUser });
// //                 socketRef.current.disconnect();
// //             }
// //             providerRef.current?.destroy();
// //             ydocRef.current?.destroy();
// //             bindingRef.current = null;
// //         };
// //     }, [roomId]);

// //     const handleEditorDidMount = (editor, monaco) => {
// //         editorRef.current = editor;
// //         monacoRef.current = monaco;

// //         const yText = ydocRef.current.getText('monaco');

// //         if (!bindingRef.current && providerRef.current) {
// //             const model = editor.getModel();
// //             bindingRef.current = new MonacoBinding(
// //                 yText,
// //                 model,
// //                 new Set([editor]),
// //                 providerRef.current.awareness
// //             );
// //         }

// //         if (pendingInitialCode.current) {
// //             editor.setValue(pendingInitialCode.current);
// //             pendingInitialCode.current = null;
// //         }
// //     };

// //     const handleSendMessage = () => {
// //         if (chatInput.trim() && socketRef.current && currentUser?.userName && roomId) {
// //             const messageData = {
// //                 userName: currentUser.userName,
// //                 text: chatInput,
// //                 timestamp: new Date().toISOString(),
// //             };
// //             socketRef.current.emit('send-message', { roomId, message: messageData });
// //             setChatInput('');
// //         }
// //     };

// //     const handleSidebarResizeStart = (e) => {
// //         isDraggingSidebar.current = true;
// //         dragStartX.current = e.clientX;
// //         initialSidebarWidth.current = sidebarWidth;
// //         document.body.style.userSelect = 'none';
// //         document.body.style.cursor = 'col-resize';
// //     };

// //     const handleEditorResizeStart = (e) => {
// //         isDraggingEditor.current = true;
// //         dragStartY.current = e.clientY;
// //         initialEditorHeight.current = editorHeight;
// //         document.body.style.userSelect = 'none';
// //         document.body.style.cursor = 'row-resize';
// //     };

// //     useEffect(() => {
// //         const handleMouseMove = (e) => {
// //             if (isDraggingSidebar.current) {
// //                 const deltaX = e.clientX - dragStartX.current;
// //                 let newSidebarWidth = initialSidebarWidth.current + deltaX;
// //                 const minWidth = 200;
// //                 const maxWidth = window.innerWidth * 0.75;
// //                 if (newSidebarWidth < minWidth) newSidebarWidth = minWidth;
// //                 if (newSidebarWidth > maxWidth) newSidebarWidth = maxWidth;
// //                 setSidebarWidth(newSidebarWidth);
// //             } else if (isDraggingEditor.current) {
// //                 const deltaY = e.clientY - dragStartY.current;
// //                 let newEditorHeight = initialEditorHeight.current + deltaY;
// //                 const minH = 100;
// //                 const maxH = window.innerHeight - 164;
// //                 if (newEditorHeight < minH) newEditorHeight = minH;
// //                 if (newEditorHeight > maxH) newEditorHeight = maxH;
// //                 setEditorHeight(newEditorHeight);
// //             }
// //         };

// //         const handleMouseUp = () => {
// //             isDraggingSidebar.current = false;
// //             isDraggingEditor.current = false;
// //             document.body.style.userSelect = 'auto';
// //             document.body.style.cursor = 'auto';
// //         };

// //         document.addEventListener('mousemove', handleMouseMove);
// //         document.addEventListener('mouseup', handleMouseUp);

// //         return () => {
// //             document.removeEventListener('mousemove', handleMouseMove);
// //             document.removeEventListener('mouseup', handleMouseUp);
// //         };
// //     }, []);

// //     // --- CODE RUNNER LOGIC ---
// //     const handleRunCode = async () => {
// //         const code = editorRef.current.getValue();
// //         if (!code) {
// //             toast.error('Code cannot be empty!');
// //             return;
// //         }

// //         setIsRunning(true);
// //         setOutput('');
// //         try {
// //             // Updated endpoint to use the environment variable
// //             const apiUrl = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3001';
// //             const response = await fetch(`${apiUrl}/api/run-code`, {
// //                 method: 'POST',
// //                 headers: { 'Content-Type': 'application/json' },
// //                 body: JSON.stringify({
// //                     code: code,
// //                     language: language,
// //                     input: input,
// //                 }),
// //             });

// //             const result = await response.json();

// //             if (response.ok) {
// //                 if (result.stderr) {
// //                     setOutput(`Execution Error:\n${result.stderr}`);
// //                 } else if (result.compile_output) {
// //                     setOutput(`Compilation Error:\n${result.compile_output}`);
// //                 } else if (result.stdout) {
// //                     setOutput(result.stdout);
// //                 } else {
// //                     setOutput('No output received.');
// //                 }
// //             } else {
// //                 setOutput(`Error: ${result.error || 'An unknown error occurred.'}`);
// //             }
// //         } catch (error) {
// //             console.error('Code execution failed:', error);
// //             setOutput('Failed to connect to the code runner backend.');
// //         } finally {
// //             setIsRunning(false);
// //         }
// //     };
// //     // ----------------------------

// //     // --- SAVE LOGIC ---
// //     const handleSaveCode = async () => {
// //         const code = editorRef.current.getValue();
// //         if (!code) {
// //             toast.error('Code cannot be empty!');
// //             return;
// //         }

// //         try {
// //             // Updated endpoint to use the environment variable
// //             const apiUrl = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3001';
// //             const response = await fetch(`${apiUrl}/api/save-code/${roomId}`, {
// //                 method: 'PUT',
// //                 headers: {
// //                     'Content-Type': 'application/json',
// //                 },
// //                 body: JSON.stringify({ code: code }),
// //             });

// //             if (response.ok) {
// //                 toast.success('Code saved successfully!');
// //             } else {
// //                 const errorData = await response.json();
// //                 toast.error(`Failed to save code: ${errorData.message}`);
// //             }
// //         } catch (error) {
// //             console.error('Save code failed:', error);
// //             toast.error('Failed to connect to the backend server.');
// //         }
// //     };
// //     // ----------------------------

// //     return (
// //         <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
// //             <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
// //             <Header
// //                 roomId={roomId}
// //                 userProfile={currentUser}
// //                 userCount={users.length}
// //                 onLeave={onLeave}
// //                 onLogout={onLogout}
// //                 handleCopyId={() => {
// //                     navigator.clipboard.writeText(roomId);
// //                     toast.success('Room ID copied 📋');
// //                 }}
// //                 toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
// //                 toggleChat={() => setIsChatOpen(!isChatOpen)}
// //             />
// //                     <Splitter style={{ height: '90%', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }} layout={isMobile ? 'vertical' : 'horizontal'}>
// //     <Splitter.Panel collapsible>
// //             <CodeEditorPanel
// //                     language={language}
// //                     setLanguage={setLanguage}
// //                     theme={theme}
// //                     setTheme={setTheme}
// //                     isRunning={isRunning}
// //                     handleRunCode={handleRunCode}
// //                     handleSaveCode={handleSaveCode}
// //                     handleEditorDidMount={handleEditorDidMount}
// //                     handleEditorChange={() => { }}
// //                     editorHeight={editorHeight}
// //                     onMouseDownEditor={handleEditorResizeStart}
// //                     style={{ flex: '1 1 auto', minWidth: 0 }}
// //                 >
// //                 </CodeEditorPanel>
// //     </Splitter.Panel>
// //     <Splitter.Panel>
// //       <Splitter layout="vertical">
// //         <Splitter.Panel>
// //         <OutputAndInputPanel input={input} setInput={setInput} />
// //         </Splitter.Panel>
// //         <Splitter.Panel>
// //            <div className="bg-gray-900 text-white p-4 font-mono overflow-auto rounded-b-lg shadow-inner" style={{ height: '100%' }}>
// //             <div>Output:</div>
// //       <pre>{output}</pre>
// //     </div>
// //         </Splitter.Panel>
// //       </Splitter>
// //     </Splitter.Panel>
// //   </Splitter>

// //     {isChatOpen && (
// // <div className="absolute right-30 top-16 h-60 w-80 bg-gray-800 transition-transform duration-300 transform translate-x-0">    <ChatSidebar
// //        users={users}
// //                     messages={messages}
// //                     chatInput={chatInput}
// //                     setChatInput={setChatInput}
// //                     onSendMessage={handleSendMessage} // Correct prop name
// //                     width={sidebarWidth}
// //                     isSidebarOpen={isSidebarOpen}
// //                     setIsSidebarOpen={setIsSidebarOpen}
// //                     style={{ flexShrink: 0 }}
// //                  onClose={() => setIsChatOpen(false)}
// //     />
// //   </div>
// // )}
// //         </div>
// //     );
// // };

// // export default CodeRoom;


// import React, { useState, useEffect, useRef } from 'react';
// import { io } from 'socket.io-client';
// import * as Y from 'yjs';
// import { MonacoBinding } from 'y-monaco';
// import { WebsocketProvider } from 'y-websocket';
// import { ToastContainer, toast } from 'react-toastify';
// import "react-toastify/dist/ReactToastify.css";
// import Header from '../Header';
// import ChatSidebar from '../ChatSlidebar';
// import CodeEditorPanel from '../CodeEditorPanel';
// import OutputAndInputPanel from '../OutputAndInputPanel';
// import { Splitter } from 'antd';

// const CodeRoom = ({ user, roomId, onLeave, onLogout }) => {
//     const [users, setUsers] = useState([]);
//     const [messages, setMessages] = useState([]);
//     const [chatInput, setChatInput] = useState('');
//     const [language, setLanguage] = useState('javascript');
//     const [theme, setTheme] = useState('vs-dark');
//     const [output, setOutput] = useState('');
//     const [input, setInput] = useState('');
//     const [isRunning, setIsRunning] = useState(false);

//     const [editorHeight, setEditorHeight] = useState(500);
//     const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

//     const isDraggingEditor = useRef(false);
//     const dragStartY = useRef(0);
//     const initialEditorHeight = useRef(0);

//     const socketRef = useRef(null);
//     const editorRef = useRef(null);
//     const monacoRef = useRef(null);
//     const ydocRef = useRef(new Y.Doc());
//     const providerRef = useRef(null);
//     const bindingRef = useRef(null);
//     const pendingInitialCode = useRef(null);

//     // Handle window resize
//     useEffect(() => {
//         const handleResize = () => setIsMobile(window.innerWidth < 768);
//         window.addEventListener('resize', handleResize);
//         return () => window.removeEventListener('resize', handleResize);
//     }, []);

//     // Current user
//     const currentUser = (() => {
//         try {
//             const storedUser = localStorage.getItem('user');
//             const userData = storedUser ? JSON.parse(storedUser) : {};
//             return {
//                 userName: userData.userName || 'Anonymous',
//                 avatar: userData.avatar || userData.photoURL || null
//             };
//         } catch {
//             return { userName: 'Anonymous' };
//         }
//     })();

//     // Socket + Yjs setup
//     useEffect(() => {
//         const socketUrl = import.meta.env.VITE_REACT_APP_SOCKET_URL || 'http://localhost:3001';
//         socketRef.current = io(socketUrl, { transports: ['websocket', 'polling'], autoConnect: true });
//         const socket = socketRef.current;

//         socket.on('connect', () => {
//             if (currentUser?.userName && roomId) {
//                 socket.emit('join-room', { roomId, user: currentUser });
//             }
//         });

//         socket.on('initial-code', ({ code }) => {
//             if (editorRef.current) {
//                 try { editorRef.current.setValue(code || ''); }
//                 catch (_) { pendingInitialCode.current = code || ''; }
//             } else {
//                 pendingInitialCode.current = code || '';
//             }
//         });

//         socket.on('initial-messages', (msgs) => setMessages(msgs || []));
//         socket.on('initial-users', (usrs) => setUsers(usrs || []));
//         socket.on('update-users', (usrs) => setUsers(usrs || []));
//         socket.on('receive-message', (message) => setMessages((prev) => [...prev, message]));

//         if (currentUser?.userName && roomId) {
//             const ywsUrl = import.meta.env.VITE_REACT_APP_YWS_URL || 'ws://localhost:3001/yws';
//             providerRef.current = new WebsocketProvider(ywsUrl, roomId, ydocRef.current, { connect: true });
//         }

//         return () => {
//             if (socketRef.current) {
//                 socketRef.current.emit('leave-room', { roomId, user: currentUser });
//                 socketRef.current.disconnect();
//             }
//             providerRef.current?.destroy();
//             ydocRef.current?.destroy();
//             bindingRef.current = null;
//         };
//     }, [roomId]);

//     // Monaco editor setup
//     const handleEditorDidMount = (editor, monaco) => {
//         editorRef.current = editor;
//         monacoRef.current = monaco;

//         const yText = ydocRef.current.getText('monaco');
//         if (!bindingRef.current && providerRef.current) {
//             const model = editor.getModel();
//             bindingRef.current = new MonacoBinding(yText, model, new Set([editor]), providerRef.current.awareness);
//         }

//         if (pendingInitialCode.current) {
//             editor.setValue(pendingInitialCode.current);
//             pendingInitialCode.current = null;
//         }
//     };

//     // Send chat message
//     const handleSendMessage = () => {
//         if (chatInput.trim() && socketRef.current && currentUser?.userName && roomId) {
//             const messageData = {
//                 userName: currentUser.userName,
//                 text: chatInput,
//                 timestamp: new Date().toISOString(),
//             };
//             socketRef.current.emit('send-message', { roomId, message: messageData });
//             setChatInput('');
//         }
//     };

//     // Resize editor height
//     const handleEditorResizeStart = (e) => {
//         isDraggingEditor.current = true;
//         dragStartY.current = e.clientY;
//         initialEditorHeight.current = editorHeight;
//         document.body.style.userSelect = 'none';
//         document.body.style.cursor = 'row-resize';
//     };

//     useEffect(() => {
//         const handleMouseMove = (e) => {
//             if (isDraggingEditor.current) {
//                 const deltaY = e.clientY - dragStartY.current;
//                 let newEditorHeight = initialEditorHeight.current + deltaY;
//                 newEditorHeight = Math.max(100, Math.min(newEditorHeight, window.innerHeight - 164));
//                 setEditorHeight(newEditorHeight);
//             }
//         };
//         const handleMouseUp = () => {
//             isDraggingEditor.current = false;
//             document.body.style.userSelect = 'auto';
//             document.body.style.cursor = 'auto';
//         };
//         document.addEventListener('mousemove', handleMouseMove);
//         document.addEventListener('mouseup', handleMouseUp);
//         return () => {
//             document.removeEventListener('mousemove', handleMouseMove);
//             document.removeEventListener('mouseup', handleMouseUp);
//         };
//     }, []);

//     // Run code
//     const handleRunCode = async () => {
//         const code = editorRef.current.getValue();
//         if (!code) return toast.error('Code cannot be empty!');

//         setIsRunning(true);
//         setOutput('');
//         try {
//             const apiUrl = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3001';
//             const response = await fetch(`${apiUrl}/api/run-code`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ code, language, input }),
//             });
//             const result = await response.json();

//             if (response.ok) {
//                 if (result.stderr) setOutput(`Execution Error:\n${result.stderr}`);
//                 else if (result.compile_output) setOutput(`Compilation Error:\n${result.compile_output}`);
//                 else setOutput(result.stdout || 'No output received.');
//             } else {
//                 setOutput(`Error: ${result.error || 'Unknown error'}`);
//             }
//         } catch {
//             setOutput('Failed to connect to the backend.');
//         } finally {
//             setIsRunning(false);
//         }
//     };

//     // Save code
//     const handleSaveCode = async () => {
//         const code = editorRef.current.getValue();
//         if (!code) return toast.error('Code cannot be empty!');
//         try {
//             const apiUrl = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3001';
//             const response = await fetch(`${apiUrl}/api/save-code/${roomId}`, {
//                 method: 'PUT',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ code }),
//             });
//             if (response.ok) toast.success('Code saved!');
//             else toast.error('Failed to save code');
//         } catch {
//             toast.error('Failed to connect to the backend.');
//         }
//     };

//     return (
//         <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
//             <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
//             <Header
//                 roomId={roomId}
//                 userProfile={currentUser}
//                 userCount={users.length}
//                 onLeave={onLeave}
//                 onLogout={onLogout}
//                 handleCopyId={() => {
//                     navigator.clipboard.writeText(roomId);
//                     toast.success('Room ID copied 📋');
//                 }}
//             />
//             <Splitter style={{ height: '90%' }} layout={isMobile ? 'vertical' : 'horizontal'}>
//                 <Splitter.Panel>
//                     <CodeEditorPanel
//                         language={language}
//                         setLanguage={setLanguage}
//                         theme={theme}
//                         setTheme={setTheme}
//                         isRunning={isRunning}
//                         handleRunCode={handleRunCode}
//                         handleSaveCode={handleSaveCode}
//                         handleEditorDidMount={handleEditorDidMount}
//                         editorHeight={editorHeight}
//                         onMouseDownEditor={handleEditorResizeStart}
//                     />
//                 </Splitter.Panel>
//                 <Splitter.Panel>
//                     <Splitter layout="vertical">
//                         <Splitter.Panel>
//                             <OutputAndInputPanel input={input} setInput={setInput} />
//                         </Splitter.Panel>
//                         <Splitter.Panel>
//                             <div className="bg-gray-900 text-white p-4 font-mono overflow-auto rounded-b-lg shadow-inner h-full">
//                                 <div>Output:</div>
//                                 <pre>{output}</pre>
//                             </div>
//                         </Splitter.Panel>
//                     </Splitter>
//                 </Splitter.Panel>
//                 <Splitter.Panel>
//                     <ChatSidebar
//                         users={users}
//                         messages={messages}
//                         chatInput={chatInput}
//                         setChatInput={setChatInput}
//                         onSendMessage={handleSendMessage}
//                     />
//                 </Splitter.Panel>
//             </Splitter>
//         </div>
//     );
// };

// export default CodeRoom;


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
import { Code, MessageCircle, Terminal } from 'lucide-react'; // Using icons for clarity

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
    const [isMobile, setIsMobile] = useState(window.innerWidth < 968);
    
    // NEW STATE: To manage the active view on mobile
    const [activeView, setActiveView] = useState('editor');

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

    // Run code (no changes)
    const handleRunCode = async () => {
        const code = editorRef.current.getValue();
        if (!code) return toast.error('Code cannot be empty!');
        
        // On mobile, switch to the I/O view automatically after running code
        if (isMobile) {
            setActiveView('io');
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

    // Renders the mobile-specific layout with bottom navigation
    const renderMobileLayout = () => (
        <div className="flex flex-col h-full">
            <div className="flex-grow overflow-auto">
                {activeView === 'editor' && (
                    <CodeEditorPanel
                        language={language}
                        setLanguage={setLanguage}
                        theme={theme}
                        setTheme={setTheme}
                        isRunning={isRunning}
                        handleRunCode={handleRunCode}
                        handleSaveCode={handleSaveCode}
                        handleEditorDidMount={handleEditorDidMount}
                        editorHeight="100%" // Take full available height
                    />
                )}
                {activeView === 'io' && (
                    <div className="flex flex-col h-full">
                       <div className="flex-1">
                         <OutputAndInputPanel input={input} setInput={setInput} />
                       </div>
                       <div className="flex-1 bg-gray-900 text-white p-4 font-mono overflow-auto rounded-b-lg shadow-inner">
                            <div>Output:</div>
                            <pre className="whitespace-pre-wrap">{output}</pre>
                       </div>
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
            {/* Bottom Navigation Bar */}
            <div className="flex justify-around items-center bg-gray-800 p-2 border-t border-gray-700">
                <button onClick={() => setActiveView('editor')} className={`p-2 rounded-lg flex flex-col items-center ${activeView === 'editor' ? 'text-blue-400' : 'text-gray-400'}`}>
                    <Code size={24} />
                    <span className="text-xs mt-1">Editor</span>
                </button>
                <button onClick={() => setActiveView('io')} className={`p-2 rounded-lg flex flex-col items-center ${activeView === 'io' ? 'text-blue-400' : 'text-gray-400'}`}>
                    <Terminal size={24} />
                    <span className="text-xs mt-1">I/O</span>
                </button>
                <button onClick={() => setActiveView('chat')} className={`p-2 rounded-lg flex flex-col items-center ${activeView === 'chat' ? 'text-blue-400' : 'text-gray-400'}`}>
                    <MessageCircle size={24} />
                    <span className="text-xs mt-1">Chat</span>
                </button>
            </div>
        </div>
    );
    
    // Renders the original desktop layout with splitters
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
                    onMouseDownEditor={handleEditorResizeStart} // Resizing is only for desktop
                />
            </Splitter.Panel>
            <Splitter.Panel minSize={20} defaultSize={25}>
                <Splitter layout="vertical">
                    <Splitter.Panel defaultSize={50}>
                        <OutputAndInputPanel input={input} setInput={setInput} output={output} />
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
            {/* Main layout conditional rendering */}
            <main className="flex-grow overflow-hidden">
                {isMobile ? renderMobileLayout() : renderDesktopLayout()}
            </main>
        </div>
    );
};

export default CodeRoom;

