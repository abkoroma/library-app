export const auth0Config = {
    issuer: "dev-r43yoqgwki23kejs.us.auth0.com",
    clientId: "pwIWD3TGasefoeADIt6Y94F0aYnqNweM",
    audience: "http://localhost:8000",
    redirectUri: window.location.origin+"/callback",
    scope: "openid profile email",
    disableHttpsCheck: true,
    useClassicEngine: true,
}

