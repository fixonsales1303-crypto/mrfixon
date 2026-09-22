export default async function handler(req, res) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const host = req.headers.host;
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const redirectUri = `${protocol}://${host}/api/callback`;

  const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo,user&redirect_uri=${encodeURIComponent(redirectUri)}`;
  res.redirect(302, url);
}
