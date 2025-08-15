// import React from 'react';

// /**
//  * Renders the input and output consoles as resizable panels.
//  */
// const OutputAndInputPanel = ({ input, setInput}) => (
//   <div className="flex-grow flex flex-col relative">
//     {/* Input Console */}
//     <div className="bg-gray-900 text-white p-4 font-mono overflow-auto shadow-inner" style={{ height: '50%' }}>
//       <h3 className="font-bold mb-2">Input</h3>
//       <textarea
//         className="w-full h-full p-2 bg-gray-800 text-white font-mono rounded-md resize-none focus:outline-none"
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         placeholder="Enter input here..."
//          style={{height:'700px'}}
//       />
//     </div>
//   </div>
// );

// export default OutputAndInputPanel;



// frontend/src/components/OutputAndInputPanel.js
import React from 'react';

const OutputAndInputPanel = ({ input, setInput }) => (
  // This main container is now a flex column that fills its parent's height
  <div className="flex flex-col h-full bg-gray-800 text-white font-mono">
    {/* Panel Header */}
    <h3 className="font-semibold p-3 border-b border-gray-700 text-gray-300">
      Input
    </h3>

    {/* The textarea now grows to fill all remaining space */}
    <textarea
      className="w-full flex-grow p-3 bg-transparent text-white font-mono resize-none focus:outline-none"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Enter input for your code here..."
    />
  </div>
);

export default OutputAndInputPanel;
