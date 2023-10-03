import React, { useEffect } from 'react'
import styles from '../../styles/Login.module.css'
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom'
import jwt_decode from 'jwt-decode'

function Login() {
    const navigate = useNavigate();
    const { loginWithRedirect,
        logout,
        isAuthenticated,
        getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        async function getUserScopes() {
            const token = await getAccessTokenSilently();
            const user = jwt_decode(token);
            return user.permissions;
        }

        if (isAuthenticated) {
            getUserScopes()
                .then((scopes) => {
                    if (scopes.includes('upload:files')) {
                        navigate('/manager')
                    } else {
                        navigate('/worker')
                    }
                })
        }

    })

    return (

        <div className={styles.loginBody}>
            <div className={styles.loginMainDiv}>
                <div className={styles.loginMainDivTitle}>
                    Welcome to SSD-Secure
                </div>
                <div className={styles.loginMainDivInputs}>
                    Login to continue
                </div>
                {isAuthenticated
                    ? <button onClick={logout}>Logout</button>
                    : <button onClick={loginWithRedirect}>Login</button>}

            </div>
        </div>

    )
}

export default Login