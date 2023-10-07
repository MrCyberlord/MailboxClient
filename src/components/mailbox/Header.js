import { useSelector } from "react-redux";

const Header = () => {
  const { email } = useSelector((state) => state.auth);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "1rem",
      }}
    >
      <h2>QuickMailer</h2>
      <span>Logged in as: {email}</span>
    </div>
  );
};

export default Header;
