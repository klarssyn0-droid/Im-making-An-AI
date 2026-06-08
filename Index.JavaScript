function handleCredentialResponse(response) {
  console.log("Google ID Token:", response.credential);
  
  // Send to backend for verification (recommended)
  fetch('/verify-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: response.credential })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      document.getElementById('user-info').style.display = 'block';
      document.getElementById('user-name').textContent = data.user.name;
      document.getElementById('user-pic').src = data.user.picture;
      
      // Pass user data to the rest of the app (Claude/Gemini can hook into this)
      window.currentUser = data.user;
      console.log("✅ Google Sign-In successful - AI brain ready");
    }
  })
  .catch(err => console.error("Auth error:", err));
}

function signOut() {
  google.accounts.id.revoke(window.currentUser?.email, done => {
    document.getElementById('user-info').style.display = 'none';
    console.log("Signed out");
  });
}

// Auto-initialize
window.onload = () => {
  console.log("Grok's Google Sign-In initialized");
};
const express = require('express');
const { OAuth2Client } = require('google-auth-library');

const app = express();
const client = new OAuth2Client('YOUR_GOOGLE_CLIENT_ID');

app.use(express.json());

app.post('/verify-token', async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: 'YOUR_GOOGLE_CLIENT_ID'
    });
    const payload = ticket.getPayload();
    
    res.json({
      success: true,
      user: {
        name: payload.name,
        email: payload.email,
        picture: payload.picture
      }
    });
  } catch (e) {
    res.status(401).json({ success: false });
  }
});

app.listen(3000, () => console.log("Server running - Google auth ready"));
