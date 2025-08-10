// This file handles the logic for sending code to the Judge0 API.
const axios = require('axios');

// Map language names to Judge0 language IDs
const languageMap = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
  html: 47,
  css: 45,
};

const runCode = async (req, res) => {
  // Destructure input from the request body
  const { code, language, input = "" } = req.body;

  // Validate required fields
  if (!code || !language) {
    return res.status(400).json({ message: 'Code and language are required.' });
  }

  const language_id = languageMap[language.toLowerCase()];
  if (!language_id) {
    return res.status(400).json({ message: 'Unsupported language.' });
  }

  // CRITICAL: Check if the API key is available
  const rapidApiKey = process.env.RAPIDAPI_KEY;
  if (!rapidApiKey) {
    console.error('RapidAPI key not found. Please set the RAPIDAPI_KEY environment variable.');
    return res.status(500).json({ message: 'Server configuration error: RAPIDAPI_KEY is not set.' });
  }

  try {
    // Step 1: Submit code for execution with time limits
    const submissionResponse = await axios.post(
      'https://judge0-ce.p.rapidapi.com/submissions',
      {
        source_code: code,
        language_id,
        stdin: input, // Pass the input to the stdin field
        cpu_time_limit: 2,     // Max CPU time in seconds
        wall_time_limit: 5,    // Max total runtime in seconds
      },
      {
        params: { base64_encoded: 'false', fields: '*' },
        headers: {
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          'X-RapidAPI-Key': rapidApiKey, // Use the variable
          'Content-Type': 'application/json',
        },
      }
    );

    const token = submissionResponse.data.token;

    // Step 2: Poll for result with a timeout
    let result = null;
    const maxAttempts = 10; // Increased polling attempts for reliability
    let attempt = 0;

    // Polling loop
    while (attempt < maxAttempts) {
      const resultResponse = await axios.get(
        `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
        {
          params: { base64_encoded: 'false', fields: '*' },
          headers: {
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            'X-RapidAPI-Key': rapidApiKey,
          },
        }
      );

      result = resultResponse.data;

      // Status ID 3 means "Accepted" (finished)
      if (result.status.id >= 3) break;

      // Wait 1 second before the next poll
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempt++;
    }

    // If still not done after max attempts, return timeout message
    if (result.status.id < 3) {
      return res.status(504).json({ message: 'Execution timed out.' });
    }

    // Send the final result back to the client
    res.json({
      stdout: result.stdout || '',
      stderr: result.stderr || '',
      compile_output: result.compile_output || '',
      message: result.message || '',
      status: result.status.description,
    });

  } catch (error) {
    console.error('Error running code:', error.response?.data || error.message);
    // Return a more descriptive error message to the client
    res.status(500).json({
      message: 'Failed to run code due to a server error.',
      error: error.response?.data || error.message,
    });
  }
};

module.exports = { runCode };
