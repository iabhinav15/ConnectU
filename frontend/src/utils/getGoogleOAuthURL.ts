export const getGoogleOAuthURL = () => {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';

  const queryString = new URLSearchParams({
    redirect_uri: import.meta.env.VITE_googleOAuthRedirectURL as string,
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID as string,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  });
  const queryParams = queryString.toString();
  return `${rootUrl}?${queryParams}`;
}
