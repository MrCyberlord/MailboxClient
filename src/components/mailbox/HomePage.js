import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import AuthForm from "../Auth/AuthForm";
import ComposeEmail from "./ComposeEmail";
import MailDeets from "./MailDeets";
import Header from "./Header";
import Logout from "../Auth/Logout";
import Inbox from "./Inbox";

import styles from "./HomePage.module.css";
import { useSelector } from "react-redux";

export default function HomePage() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  return (
    <BrowserRouter>
      <Header />
      <div className={styles.mainLayout}>
        {isLoggedIn && (
          <div className={styles.sidebar}>
            <Link to="/compose" className={styles.navLink}>
              Compose
            </Link>
            <Link to="/inbox/received" className={styles.navLink}>
              Received
            </Link>
            <Link to="/inbox/sent" className={styles.navLink}>
              Sent
            </Link>
            <Logout />
          </div>
        )}

        <div className={styles.content}>
          <Routes>
            <Route path="/" element={<AuthForm />} />
            <Route path="/inbox/:tab" element={<Inbox />} />
            <Route path="/mail/:mailId" element={<MailDeets />} />
            <Route path="/compose" element={<ComposeEmail />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
