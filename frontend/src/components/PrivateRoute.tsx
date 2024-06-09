import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function PrivateRoute() {
  interface RootState {
    users: {
      currentUser: {
        profileString: string;
        email: string;
        username: string;
      };
    };
  }
  const { currentUser } = useSelector((state: RootState) => state.users);
  return currentUser ? <Outlet /> : <Navigate to="/login" />;
}
