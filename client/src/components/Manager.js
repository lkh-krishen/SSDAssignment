import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import jwt_decode from "jwt-decode";
import styles from "../styles/Manager.module.css";
import Message from "./Message";
import axios from "axios";
import baseUrl from "../config/baseUrl";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import storage from "../config/firebase";
import { Button } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import FileList from "./FileList";

function Manager() {
  const [isManager, setIsManager] = useState(false);
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const [messages, setMessages] = useState([]);
  //const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    async function getUserScopes() {
      const token = await getAccessTokenSilently();
      const user = jwt_decode(token);
      return user.permissions;
    }

    if (isAuthenticated) {
      getUserScopes().then((scopes) => {
        if (scopes.includes("upload:files")) {
          setIsManager(true);
          getMessages();
        }
      });
    }
  }, [getAccessTokenSilently, isAuthenticated]);

  const getMessages = async () => {
    const token = await getAccessTokenSilently();
    const response = await axios.get(baseUrl + "/messages/", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    setMessages(response.data.messages);
  };

  const isMessageSavedByUser = (message) => {
    let messageSavedByUser = false;
    message.savedBy.forEach((savedByUser) => {
      if (savedByUser === user.email) {
        messageSavedByUser = true;
      }
    });
    return messageSavedByUser;
  };

  const addFileInfo = async (fName, fUrl) => {
    const token = await getAccessTokenSilently();
    const postData = {
      fileName: fName,
      fileUrl: fUrl,
    };

    try {
      const res = await axios.post(baseUrl + `/file/add`, postData, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

    } catch (err) {

    }
  };

  const fileHandler = (e) => {
    setProgress(0);
    setFile(e.target.files[0]);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (file.length === 0) {
      alert("Please select a file !");
    } else {
      setLoading(true);
      const storageRef = ref(storage, `/files/${file.type}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const prog = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(prog);
        },
        (err) => {
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            addFileInfo(file.name, url);
            alert("Uploaded");
            setLoading(false);
          });
        }
      );
    }
  };

  const sendMessage = async () => {
    const token = await getAccessTokenSilently();
    const data = {
      messageContent: inputMessage,
    };
    await axios.post(baseUrl + "/managers/send", data, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    setInputMessage("");
    await getMessages();
  };

  function sanitizeHTML(html) {
    // Use a library like DOMPurify to sanitize the HTML
    const DOMPurify = require('dompurify');
    return DOMPurify.sanitize(html);
  }

  const ButtonStyle = { margin: "10px 10px" };
  return (
    <div className={styles.container}>
      {isManager ? (
        <>
          <div
            style={{
              width: "100%",
              paddingLeft: "10px",
              paddingTop: "10px",
              fontSize: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            Welcome {user.nickname}
          </div>
          <div className={styles.uploadDiv}>
            {/* <div className={styles.fileNameRow}>
              <span className={styles.uploadDivText}>File Name</span>
              <input
                type="text"
                onChange={(e) => setFileName(e.target.value)}
                className={styles.fileNameInput}
              ></input>
            </div> */}
            <div className={styles.fileSelectRow}>
              <span className={styles.uploadDivText}>Select file</span>
              <input
                type="file"
                onChange={fileHandler}
                className={styles.fileSelectRow}
              ></input>
            </div>
            <Button
              loading={loading}
              onClick={(e) => handleUpload(e)}
              color="green"
              appearance="primary"
              style={ButtonStyle}
            >
              Upload File
            </Button>
            <FileList />
          </div>
          <div className={styles.messagesDiv}>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <input
                style={{ flex: "4" }}
                type="text"
                placeholder="Only input letters and spaces, any other character will be removed."
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const sanitizedInput = inputValue.replace(/[^a-zA-Z\s]/g, "");
                  setInputMessage(sanitizedInput);
                }}
              />
              <button style={{ flex: "1" }} onClick={sendMessage}>
                Send
              </button>
            </div>
            {messages.map((message) => {
              const isSaved = isMessageSavedByUser(message);
              return (
                <Message
                  key={message._id}
                  style={{ width: "100% !important" }}
                  message={sanitizeHTML(message.messageContent)}
                  isSaved={isSaved}
                  msgId={message._id}
                />
              );
            })}
          </div>
        </>
      ) : (
        <div>You are not authorized to view this content</div>
      )}
    </div>
  );
}

export default Manager;
