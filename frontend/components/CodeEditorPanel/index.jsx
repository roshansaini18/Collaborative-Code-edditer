// frontend/src/components/CodeEditorPanel.js
import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditorPanel = ({
  language,
  setLanguage,
  theme,
  setTheme,
  isRunning,
  handleRunCode,
  handleSaveCode,
  handleEditorDidMount,
  handleEditorChange,
  editorHeight,
  editorWidth,
  onMouseDownEditor,
  children
}) => (
  <section className="flex-grow flex flex-col relative" style={{ width: editorWidth }}>
    <div className="p-4 bg-gray-900 text-white flex justify-between items-center flex-wrap gap-2">
      <h2 className="text-lg font-mono">Code Editor</h2>
      <div className="flex gap-2">
        <button
          onClick={handleSaveCode}
          className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 transition-colors shadow"
        >
          Save
        </button>
        <button
          onClick={handleRunCode}
          disabled={isRunning}
          className={`px-4 py-2 text-white font-semibold rounded-md transition-colors shadow ${isRunning ? 'opacity-50 cursor-not-allowed bg-green-700' : 'bg-green-500 hover:bg-green-600'}`}
        >
          {isRunning ? 'Running...' : 'Run'}
        </button>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="p-2 bg-gray-800 text-white rounded-md shadow cursor-pointer"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
        </select>
        <button
          onClick={() => setTheme(theme === 'vs-dark' ? 'light' : 'vs-dark')}
          className="px-3 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors shadow"
        >
          {theme === 'vs-dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </div>
    
    <div className="flex-grow flex flex-col relative">
      <div style={{ height: editorHeight }} className="relative flex-shrink-0">
        <Editor
          height="100%"
          language={language}
          theme={theme}
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
          options={{
            automaticLayout: true,
            minimap: { enabled: false }
          }}
        />
      </div>
      <div
        className="w-full h-2 cursor-row-resize bg-gray-700 hover:bg-gray-500 transition-colors"
        onMouseDown={onMouseDownEditor}
      />
      <div className="flex-grow overflow-auto">
        {children}
      </div>
    </div>
  </section>
);

export default CodeEditorPanel;

// frontend/src/components/CodeEditorPanel.js
// import React from 'react';
// import Editor from '@monaco-editor/react';

// const CodeEditorPanel = ({
//   language,
//   setLanguage,
//   theme,
//   setTheme,
//   isRunning,
//   handleRunCode,
//   handleSaveCode,
//   handleEditorDidMount,
//   handleEditorChange,
//   editorHeight,
//   editorWidth,
//   onMouseDownEditor,
//   children
// }) => (
//   <section className="flex-grow flex flex-col relative" style={{ width: editorWidth }}>
//     <div className="p-4 bg-gray-900 text-white flex justify-between items-center flex-wrap gap-2">
//       <h2 className="text-lg font-mono">Code Editor</h2>
//       <div className="flex gap-2">
//         <button
//           onClick={handleSaveCode}
//           className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 transition-colors shadow"
//         >
//           Save
//         </button>
//         <button
//           onClick={handleRunCode}
//           disabled={isRunning}
//           className={`px-4 py-2 text-white font-semibold rounded-md transition-colors shadow ${isRunning ? 'opacity-50 cursor-not-allowed bg-green-700' : 'bg-green-500 hover:bg-green-600'}`}
//         >
//           {isRunning ? 'Running...' : 'Run'}
//         </button>
//         <select
//           value={language}
//           onChange={(e) => setLanguage(e.target.value)}
//           className="p-2 bg-gray-800 text-white rounded-md shadow cursor-pointer"
//         >
//           <option value="javascript">JavaScript</option>
//           <option value="python">Python</option>
//           <option value="java">Java</option>
//           <option value="cpp">C++</option>
//           <option value="html">HTML</option>
//           <option value="css">CSS</option>
//         </select>
//         <button
//           onClick={() => setTheme(theme === 'vs-dark' ? 'light' : 'vs-dark')}
//           className="px-3 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors shadow"
//         >
//           {theme === 'vs-dark' ? 'Light Mode' : 'Dark Mode'}
//         </button>
//       </div>
//     </div>
    
//     <div className="flex-grow flex flex-col relative">
//       <div style={{ height: editorHeight }} className="relative flex-shrink-0">
//         <Editor
//           height="100%"
//           language={language}
//           theme={theme}
//           onMount={handleEditorDidMount}
//           onChange={handleEditorChange}
//           options={{
//             automaticLayout: true,
//             minimap: { enabled: false }
//           }}
//         />
//       </div>
//       <div
//         className="w-full h-2 cursor-row-resize bg-gray-700 hover:bg-gray-500 transition-colors"
//         onMouseDown={onMouseDownEditor}
//       />
//       <div className="flex-grow overflow-auto">
//         {children}
//       </div>
//     </div>
//   </section>
// );

// export default CodeEditorPanel;