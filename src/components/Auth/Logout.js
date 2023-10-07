import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../redux-store/authSlice";
import styles from "./Logout.module.css";

export default function Logout() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(authActions.logout());
    navigate("/");
  };

  return (
    <span className={styles.logoutButton} onClick={logoutHandler}>
      Logout
    </span>
  );
}
