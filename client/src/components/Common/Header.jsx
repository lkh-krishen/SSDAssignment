import React from 'react'
import styles from '../../styles/Header.module.css'
import { useAuth0 } from '@auth0/auth0-react'

function Header() {
    const { logout, isAuthenticated, user } = useAuth0();

    return (
        <div className={styles.headerDiv}>
            <div className={styles.headerTitleDiv}>
                Messenger
            </div>
            <div className={styles.headerLogoutDiv}>
                {isAuthenticated && user
                    ? <button
                        className={styles.headerLogoutBtn}
                        onClick={logout}>Logout</button>
                    : ""}
            </div>
        </div>
    )
}

export default Header