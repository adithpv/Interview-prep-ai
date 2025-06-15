import { useContext, type ReactNode } from "react";
import { UserContext } from "../../context/userContext";
import Navbar from "../Navbar";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useContext(UserContext);
  return (
    <div>
      <Navbar />
      {user && <div>{children}</div>}
    </div>
  );
};

export default DashboardLayout;
