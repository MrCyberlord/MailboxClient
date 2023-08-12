import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../redux-store/authSlice";
import Button from "react-bootstrap/Button";

export default function Logout() {
  const dispatch = useDispatch();

  const history = useHistory();

  const logoutHandler = () => {
    dispatch(authActions.logout());
    history.replace("/");
  };

  return (
    <Button style={{ marginRight: "1rem" }} onClick={logoutHandler}>
      Logout
    </Button>
  );
}
