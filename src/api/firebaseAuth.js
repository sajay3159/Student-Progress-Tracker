import firebaseConfig from "../firebaseConfig";

const API_KEY = firebaseConfig.apiKey;

//Login
export const loginUser = async (email, password) => {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data?.error?.message || "Authentication failed";
    throw new Error(errorMessage);
  }

  return data;
};

// Forget password
export const sendPasswordResetEmail = async (email) => {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requestType: "PASSWORD_RESET",
        email,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data?.error?.message || "Failed to send reset email.";
    throw new Error(errorMessage);
  }

  return data;
};

// Signup
export const signupUser = async (email, password) => {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data?.error?.message || "Signup failed";
    throw new Error(errorMessage);
  }

  return data;
};
