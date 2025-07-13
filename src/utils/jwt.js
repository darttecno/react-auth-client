export const decodeToken = (token) => {
  try {
    // The payload is the second part of the token
    const payloadBase64 = token.split('.')[1];
    // Decode from Base64Url
    const decodedPayload = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
    const parsedPayload = JSON.parse(decodedPayload);
    // Return the user ID, checking for common property names, prioritizing userId
    return parsedPayload.userId || parsedPayload.id || parsedPayload.sub || null;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};
