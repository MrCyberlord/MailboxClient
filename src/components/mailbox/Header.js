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
      <h1 style={{ color: "#8b228b" }}>QuickMailer</h1>
      <span style={{ fontSize: "1.2rem" }}>Logged in as: {email}</span>
    </div>
  );
};

export default Header;
