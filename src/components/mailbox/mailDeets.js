import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./MailDeets.module.css";

export default function MailDeets() {
  const location = useLocation();
  const navigate = useNavigate();
  const { to, from, subject, body, type } = location.state;

  const handleBackClick = () => {
    if (type === "received") {
      navigate("/inbox/received");
    } else if (type === "sent") {
      navigate("/inbox/sent");
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={handleBackClick}>
        Back
      </button>
      <div className={styles.mailContent}>
        {type === "received" && <p>From: {from}</p>}
        {type === "sent" && <p>To: {to}</p>}
        <p className={styles.subject}>Subject: {subject}</p>
        <p className={styles.body}>{body}</p>
      </div>
    </div>
  );
}
