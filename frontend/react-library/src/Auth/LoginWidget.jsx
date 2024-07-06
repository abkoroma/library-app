import { Navigate } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import Spinner from "../layouts/utils/Spinner";
import OktaSignInWidget from "./OktaSigninWidget";


export default function LoginWidget({ config }) {
    const { oktaAuth, authState } = useOktaAuth();

    const onSuccess = (tokens) => {
        oktaAuth.handleLoginRedirect(tokens);
    };

    const onError = (err) => {
        console.log('Sign in error', err);
    }

    if (!authState) {
        return (
            <Spinner />
        );
    }

    return (
        authState.isAuthenticated ? (
            <Navigate to = "/" replace = { true } />
        ) : 
        (
            <OktaSignInWidget config={config} onSuccess={onSuccess} onError={onError} />
        )
    );
}