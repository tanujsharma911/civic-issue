import { useDispatch } from "react-redux"
import { Outlet, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { Toaster } from 'sonner';

import Header from "./components/Header/Header";
import auth from "./supabase/auth";
import { login, logout } from "./store/authSlice";
import SplitText from "./components/ui/SplitText";

function App() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const outletName = pathSegments[0] || "home";
  const [hide, setHide] = useState(false);

  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // console.log(outletName);

  const handleAnimationComplete = () => {

    setTimeout(() => {
      setHide(true);
    }, 1000);
  };

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

      <div className={`${hide ? 'hidden' : 'absolute'}  top-0 left-0 w-full h-full flex items-center justify-center bg-white pointer-events-none select-none z-50`}>
        <SplitText
          text="Civic Issue Reporting App"
          className="text-4xl font-semibold text-center"
          delay={50}
          duration={1}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
          onLetterAnimationComplete={handleAnimationComplete}
        />
      </div>

      <Header />

      <div className={`${outletName === 'dashboard' ? '' : 'my-30 px-5 md:px-10 lg:max-w-4xl mx-auto'}`}>
        <Outlet />
      </div>

      <Toaster richColors />
    </div>
  )
}

export default App
