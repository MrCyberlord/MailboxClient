import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { mailActions } from "../redux-store/mailSlice";

import { useNavigate, useParams } from "react-router-dom";

import styles from "./Inbox.module.css";

import axios from "axios";

const Inbox = () => {
  const { tab } = useParams(); // Using tab from the URL parameters
  const email = useSelector((state) => state.auth.email);
  const receivedMails = useSelector((state) => state.mail.receivedMails);
  const sentMails = useSelector((state) => state.mail.sentMails);

  const [readCount, setReadCount] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch received emails and dispatch to store
    axios
      .get(
        `https://mailboxclient-783b4-default-rtdb.firebaseio.com/${email.replace(
          /[.@]/g,
          ""
        )}/receivedMails.json`
      )
      .then((response) => {
        const receivedMails = [];

        for (const key in response.data) {
          const mail = {
            id: key,
            ...response.data[key],
          };
          receivedMails.push(mail);
        }
        dispatch(mailActions.addReceivedMail(receivedMails));
        const readMails = receivedMails.filter((mail) => mail.isRead);
        setReadCount(readMails.length); //
      })
      .catch((error) => console.log(error));

    // Fetch sent emails and dispatch to store
    axios
      .get(
        `https://mailboxclient-783b4-default-rtdb.firebaseio.com/${email.replace(
          /[.@]/g,
          ""
        )}/sentMails.json`
      )
      .then((response) => {
        const sentMails = [];
        for (const key in response.data) {
          const mail = {
            id: key,
            ...response.data[key],
          };
          sentMails.push(mail);
        }
        dispatch(mailActions.addSentMail(sentMails));
      })
      .catch((error) => console.log(error));
  }, [dispatch, email]);

  const handleMailClick = (mailId) => {
    const receivedMail = receivedMails.find((mail) => mail.id === mailId);

    if (receivedMail) {
      axios
        .put(
          `https://mailboxclient-783b4-default-rtdb.firebaseio.com/${email.replace(
            /[.@]/g,
            ""
          )}/receivedMails/${mailId}/isRead.json`,
          true // Set isRead to true
        )
        .then((response) => {
          dispatch(mailActions.markMailasRead(mailId));
          // Increment readCount by 1
          setReadCount((prevReadCount) => prevReadCount + 1);
        })
        .catch((error) => console.log(error));
      navigate(`/mail/${mailId}`, {
        state: {
          from: receivedMail.from,
          subject: receivedMail.subject,
          body: receivedMail.body,
          type: "received",
        },
      });
    } else {
      const sentMail = sentMails.find((mail) => mail.id === mailId);
      navigate(`/mail/${mailId}`, {
        state: {
          to: sentMail.to,
          subject: sentMail.subject,
          body: sentMail.body,
          type: "sent",
        },
      });
    }
  };
  const handleDeleteClick = (event, mailId) => {
    event.stopPropagation();
    const receivedMail = receivedMails.find((mail) => mail.id === mailId);
    const sentMail = sentMails.find((mail) => mail.id === mailId);
    if (receivedMail) {
      axios
        .delete(
          `https://mailboxclient-783b4-default-rtdb.firebaseio.com/${email.replace(
            /[.@]/g,
            ""
          )}/receivedMails/${mailId}.json`
        )
        .then((response) => {
          dispatch(mailActions.deleteReceivedMail(mailId));
        })
        .then((error) => console.log(error));
    }
    if (sentMail) {
      axios
        .delete(
          `https://mailboxclient-783b4-default-rtdb.firebaseio.com/${email.replace(
            /[.@]/g,
            ""
          )}/sentMails/${mailId}.json`
        )
        .then((response) => {
          dispatch(mailActions.deleteSentMail(mailId));
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div className={styles.tabs}>
      {tab === "received" && (
        <div className={styles.tabContent}>
          <div className={styles.mailHeader}>
            <h4>Received Mails</h4>
            <div>
              <span className={styles.badgeSecondary}>Read: {readCount}</span>
              <span className={styles.badgeInfo}>
                Unread: {receivedMails.length - readCount}
              </span>
            </div>
          </div>
          {receivedMails.length === 0 ? (
            <p>No new Mails</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>From</th>
                  <th>Subject</th>
                  <th>Body</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {receivedMails.map((mail) => (
                  <tr key={mail.id} onClick={() => handleMailClick(mail.id)}>
                    <td>
                      <span
                        className={
                          mail.isRead ? styles.badgeRead : styles.badgeUnread
                        }
                      >
                        {mail.isRead ? "Read" : "Unread"}
                      </span>
                    </td>
                    <td>{mail.from}</td>
                    <td>{mail.subject}</td>
                    <td>{mail.body}</td>
                    <td>
                      <button
                        className={styles.deleteButton}
                        onClick={(event) => handleDeleteClick(event, mail.id)}
                      >
                        Delete Mail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === "sent" && (
        <div className={styles.tabContent}>
          <h4>Sent Mails</h4>
          {sentMails.length === 0 ? (
            <p>No New Mails</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>To</th>
                  <th>Subject</th>
                  <th>Body</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sentMails.map((mail) => (
                  <tr key={mail.id} onClick={() => handleMailClick(mail.id)}>
                    <td>{mail.to}</td>
                    <td>{mail.subject}</td>
                    <td>{mail.body}</td>
                    <td>
                      <button
                        className={styles.deleteButton}
                        onClick={(event) => handleDeleteClick(event, mail.id)}
                      >
                        Delete Mail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Inbox;
