export default async function handler(req, res) {
  const { code } = req.query;
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;

  if (!code) {
    return res.status(400).send('Error: Missing GitHub authorization code.');
  }

  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(400).send(`GitHub OAuth Error: ${data.error_description || data.error}`);
    }

    const token = data.access_token;
    const provider = 'github';

    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Authorizing...</title>
      </head>
      <body>
        <p style="font-family: sans-serif; text-align: center; margin-top: 20vh;">
          Authorizing Mr. Fixon Admin...
        </p>
        <script>
          (function() {
            const tokenMsg = 'authorization:${provider}:success:{"token":"${token}","provider":"${provider}"}';
            
            function sendToken() {
              if (window.opener) {
                window.opener.postMessage(tokenMsg, '*');
                window.opener.postMessage({ token: "${token}", provider: "${provider}" }, '*');
              }
            }

            function receiveMessage(e) {
              sendToken();
              window.removeEventListener("message", receiveMessage, false);
              setTimeout(function() { window.close(); }, 300);
            }

            window.addEventListener("message", receiveMessage, false);

            if (window.opener) {
              window.opener.postMessage("authorizing:${provider}", "*");
              // Send token immediately as well
              sendToken();
              setTimeout(function() {
                sendToken();
                setTimeout(function() { window.close(); }, 500);
              }, 500);
            }
          })();
        </script>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(content);
  } catch (error) {
    console.error('OAuth Callback Error:', error);
    return res.status(500).send('Internal Server Error during OAuth authentication.');
  }
}
