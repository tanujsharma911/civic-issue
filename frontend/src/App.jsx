import { useDispatch } from "react-redux"
import { Outlet, useLocation } from "react-router";
import { useEffect, useState } from "react";

import Header from "./components/Header/Header";
import auth from "./supabase/auth";
import { login, logout } from "./store/authSlice";

function App() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const outletName = pathSegments[0] || "home";

  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // console.log(outletName);

  useEffect(() => {
    auth.getSession()
      .then((userData) => {
        if (userData) {
          const user = userData.user;
          dispatch(login(user));
        }
        else {
          dispatch(logout());
        }
      })
      .finally(() => setLoading(false));
  }, [dispatch])

  return loading ? <div className="flex justify-center items-center h-screen">Loading...</div> : (
    <div className="">
      <Header />

      <div className={`${outletName === 'dashboard' ? '' : 'my-30 px-5 md:px-10 lg:max-w-4xl mx-auto'}`}>
        <Outlet />
      </div>
    </div>
  )
}

export default App
