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

    // Script to post token to the CMS window
    const content = `
      <!DOCTYPE html>
      <html>
      <head><title>Authorizing...</title></head>
      <body>
        <script>
          (function() {
            function receiveMessage(e) {
              console.log("Receive message %o", e);
              window.opener.postMessage(
                'authorization:${provider}:success:{"token":"${token}","provider":"${provider}"}',
                e.origin
              );
              window.removeEventListener("message", receiveMessage, false);
            }
            window.addEventListener("message", receiveMessage, false);
            window.opener.postMessage("authorizing:${provider}", "*");
          })();
        </script>
        <p>Authorization successful! You can close this window if it doesn't close automatically.</p>
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
