import React, { useEffect, useState } from "react";
import styles from "../styles/Message.module.css";
import { BsBookmark, BsFillBookmarkFill } from "react-icons/bs";
import { useAuth0 } from "@auth0/auth0-react";
import jwt_decode from "jwt-decode";
import axios from "axios";
import baseUrl from "../config/baseUrl";

function Message({ message, isSaved, msgId }) {
  const [messageSaved, setMessageSaved] = useState(false);
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  
  useEffect(() => {
    setMessageSaved(isSaved);
  }, [isSaved]);

  const saveMessage = async () => {
    const token = await getAccessTokenSilently();
    const headers = {
      Authorization: "Bearer " + token,
    };
    if (!messageSaved) {
      axios
        .patch(baseUrl + `/messages/save/${msgId}`,
          { "userEmail": user.email },
          {
            headers: headers,
          })
        .then((response) => {
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios
        .patch(baseUrl + `/messages/unsave/${msgId}`,
          { "userEmail": user.email },
          {
            headers: headers,
          })
        .then((response) => {
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div className={styles.messageDiv}>
      <div className={styles.messageDivIconRow}>
        <button
          className={styles.messageDivIconBtn}
          onClick={async (e) => {
            e.preventDefault();
            await saveMessage();
            setMessageSaved(!messageSaved);
          }}
        >
          {messageSaved ? <BsFillBookmarkFill /> : <BsBookmark />}
        </button>
      </div>
      <div className={styles.messageDivMessageRow}>{message}</div>
    </div>
  );
}

export default Message;
