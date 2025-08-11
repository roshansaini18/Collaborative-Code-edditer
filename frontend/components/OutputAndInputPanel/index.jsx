import React from 'react';

/**
 * Renders the input and output consoles as resizable panels.
 */
const OutputAndInputPanel = ({ input, setInput}) => (
  <div className="flex-grow flex flex-col relative">
    {/* Input Console */}
    <div className="bg-gray-900 text-white p-4 font-mono overflow-auto shadow-inner" style={{ height: '50%' }}>
      <h3 className="font-bold mb-2">Input</h3>
      <textarea
        className="w-full h-full p-2 bg-gray-800 text-white font-mono rounded-md resize-none focus:outline-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter input here..."
         style={{height:'700px'}}
      />
    </div>
  </div>
);

export default OutputAndInputPanel;
