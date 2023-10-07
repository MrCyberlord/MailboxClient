import { useState } from "react";
import { useSelector } from "react-redux";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styles from "./ComposeEmail.module.css";

const ComposeEmail = () => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const { email } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    const content = convertToRaw(editorState.getCurrentContent());
    const body = JSON.stringify(content.blocks[0].text);

    // Send a post request to store the email in the Realtime Firebase DB
    axios
      .post(
        `https://mailboxclient-783b4-default-rtdb.firebaseio.com/${email.replace(
          /[.@]/g,
          ""
        )}/sentMails.json`,
        {
          to,
          subject,
          body,
        }
      )
      .catch((err) => console.log(err));
    axios
      .post(
        `https://mailboxclient-783b4-default-rtdb.firebaseio.com/${to.replace(
          /[.@]/g,
          ""
        )}/receivedMails.json`,
        {
          from: email,
          subject,
          body,
        }
      )
      .catch((err) => console.log(err));

    setTo("");
    setSubject("");
    setEditorState(EditorState.createEmpty());
    toast.success("Your Email was sent");
  };

  return (
    <div className={styles.container}>
      <ToastContainer />
      <div className={styles.header}>
        <h2>Compose Email</h2>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="to">To:</label>
          <input
            type="email"
            id="to"
            placeholder="Enter email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="subject" className={styles.topMargin}>
            Subject:
          </label>
          <input
            type="text"
            id="subject"
            placeholder="Enter subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <div className={styles.row}>
            <div className={styles.col}>
              <label htmlFor="body" className={styles.topMargin}>
                Body:
              </label>
            </div>
            <div className={`${styles.col} ${styles.fullWidth}`}>
              <Editor
                editorState={editorState}
                onEditorStateChange={(state) => setEditorState(state)}
                wrapperStyle={{
                  minHeight: "300px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                }}
                toolbar={{
                  options: [
                    "inline",
                    "blockType",
                    "fontSize",
                    "fontFamily",
                    "list",
                    "textAlign",
                    "colorPicker",
                    "link",
                    "embedded",
                  ],
                  inline: {
                    options: [
                      "bold",
                      "italic",
                      "underline",
                      "strikethrough",
                      "monospace",
                      "superscript",
                      "subscript",
                    ],
                  },
                  blockType: {
                    options: [
                      "Normal",
                      "H1",
                      "H2",
                      "H3",
                      "H4",
                      "H5",
                      "H6",
                      "Blockquote",
                      "Code",
                    ],
                  },
                  textAlign: {
                    options: ["left", "center", "right", "justify"],
                  },
                  link: {
                    defaultTargetOption: "_blank",
                    showOpenOptionOnHover: true,
                  },
                }}
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className={`${styles.button} ${styles.topMargin}`}
        >
          Send
        </button>
      </form>
    </div>
  );
};
export default ComposeEmail;
