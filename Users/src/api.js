export const API_URL = 'http://localhost:3001'


export function TOKEN_POST(body) {
  
  return {
    url: API_URL + '/tokens',
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  };
}

export function TOKEN_VALIDATE_POST(token) {
  return {
    url: API_URL + '/tokens/validate',
    options: {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    },
  };
}


export function USER_GET(token) {
  return {
    url: API_URL + '/users',
    options: {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    },
  };
}

export function USER_POST(body, token) {
  return {
    url: API_URL + '/users',
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(body),
    },
  };
}

export function USER_PUT(body, token) {
  return {
    url: API_URL + '/users',
    options: {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(body),
    },
  };
}