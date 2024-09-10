document.getElementById('submitButton').addEventListener('click', async () => {
    const tagInput = document.getElementById('tagInput').value;
    const tags = tagInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  
    if (tags.length === 0) {
      alert('Please enter some tags.');
      return;
    }
  
    try {
      // Get OAuth token
      const token = await getAuthToken();
  
      // Define the API endpoint and request payload
      const spreadsheetId = 'YOUR_SPREADSHEET_ID';
      const range = 'Sheet1!A:A'; // Adjust as necessary
      const valueRange = {
        range: range,
        majorDimension: 'ROWS',
        values: tags.map(tag => [tag])
      };
  
      const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=RAW`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(valueRange)
      });
  
      const result = await response.json();
      console.log('Tags added:', result);
      alert('Tags added to spreadsheet successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add tags to spreadsheet.');
    }
  });
  
  async function getAuthToken() {
    return new Promise((resolve, reject) => {
      chrome.identity.getAuthToken({ interactive: true }, function(token) {
        if (chrome.runtime.lastError || !token) {
          reject(chrome.runtime.lastError || new Error('No token obtained'));
        } else {
          resolve(token);
        }
      });
    });
  }
  