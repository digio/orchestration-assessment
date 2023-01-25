var fetch = require('node-fetch');

async function requestCrmProfileCreation(userName) {
  try {
    // const url = `http://express-app-host:4000/crm?name=${userName}`;
    const url = `http://localhost:4000/crm?name=${userName}`;
    const params = {
      method: 'get'
    };
    console.log('Calling', url, params);
    const response = await fetch(url, params);
    const data = await response.json();
    console.log('CRM profile response body', data);
    return data;
  } catch (err) {
    console.log('Error received when executing activity requestCrmProfileCreation', err);
  }
}

async function updateCrmProfile(userName, email, credit) {
  try {
    const body = {
      name: userName,
      email,
      credit
    }
    // const url = 'http://express-app-host:4000/crm';
    const url = 'http://localhost:4000/crm';
    const params = {
      method: 'put',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    };
    console.log('Calling', url, params);
    const response = await fetch(url, params);
    const data = await response.json();
    console.log('CRM profile response body', data);
    return data;
  } catch (err) {
    console.log('Error received when executing activity updateCrmProfile', err);
  }
}


module.exports = { requestCrmProfileCreation, updateCrmProfile };
