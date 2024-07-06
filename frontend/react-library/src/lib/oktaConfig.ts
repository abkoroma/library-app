export const oktaConfig = {
    issuer: `https://dev-84268192.okta.com/oauth2/default`,
    clientId: `0oabg43hmef6oBDxe5d7`,
    redirectUri: 'https://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true,
    useClassicEngine: true,
}

