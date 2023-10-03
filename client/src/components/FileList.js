import React, { useEffect, useState } from "react";
import axios from "axios";
import baseUrl from "../config/baseUrl";
import { LinkItUrl } from "react-linkify-it";
import { useAuth0 } from "@auth0/auth0-react";

const FileList = () => {
  const [allfiles, setAllfiles] = useState([]);
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();

  const getAllFiles = async () => {
    const token = await getAccessTokenSilently();
    const { data } = await axios.get(baseUrl + `/file`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    setAllfiles(data.files);
  };

  useEffect(() => {
    getAllFiles();
  }, []);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Document Name</th>
            <th>Document URL</th>
          </tr>
        </thead>
        <tbody>
          {allfiles.map((file) => {
            return (
              <tr key={file._id} style={{ borderBottom: "0.5px black solid" }}>
                <td>{file.fileName}</td>
                <td>
                  <LinkItUrl>{file.fileUrl}</LinkItUrl>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FileList;
