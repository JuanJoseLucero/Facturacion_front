let token = null;

export function setAuthToken(newToken) {
  token = newToken;
}

export async function getAuthToken() {
  return token;
}
