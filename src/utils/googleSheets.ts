// src/utils/googleSheets.ts

import axios from 'axios';

// Paste the Web app URL you got from Google Apps Script here
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxUWGo3VbNXehrfILcS1c4dhfl5AEeJL2qYUW5MLBAN2ZwyItd-xXzqzicfDbdpmdnaYg/exec';

interface LogDataPayload {
  schoolName: string;
  selectedClass: string;
  selectedSection: string;
  selectedSchool: string;
}

export const logToGoogleSheets = async (data: LogDataPayload) => {
  try {
    const payload = {
      ...data,
      userAgent: navigator.userAgent,
      ip: 'Client-side'
    };

    // KEY FIX: We send the data as a string with a 'text/plain' header
    // This avoids the CORS preflight check that causes the Network Error.
    const response = await axios.post(
      GOOGLE_SCRIPT_URL,
      JSON.stringify(payload), // Send the data as a stringified JSON
      {
        headers: {
          'Content-Type': 'text/plain',
        },
      }
    );

    if (response.data.status !== 'success') {
      throw new Error(response.data.message || 'The script returned an error');
    }

    console.log('Successfully logged to Google Sheets:', response.data);
    return response.data;

  } catch (error) {
    // This is where your current error is being caught
    console.error('Failed to log to Google Sheets:', error);
    throw error;
  }
};