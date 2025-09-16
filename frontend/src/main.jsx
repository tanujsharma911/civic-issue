import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router'
import store from './store/store.js'
import { Provider } from 'react-redux'

import App from './App.jsx'

// Local imports ------------------------
import Home from './pages/Home.jsx'
import Rankings from './pages/Ranking/StateRanking.jsx'
import CityRanking from './pages/Ranking/CityRanking.jsx'
import WardRanking from './pages/Ranking/WardRanking.jsx'
import Account from './pages/Account.jsx'
import AuthLayout from './components/AuthLayout.jsx'
import Report from './pages/Report.jsx'
import Reports from './pages/Reports/Reports.jsx'
import CityReports from './pages/Reports/CityReports.jsx'
import WardReports from './pages/Reports/WardReports.jsx'

// User Imports
import Login from './pages/User/Login.jsx'
import Signup from './pages/User/Signup.jsx'
import CreateReport from './pages/User/CreateReport.jsx'
import Feedback from './pages/User/Feedback.jsx'

// Officer / Field Engineer Imports
import OfficerLogin from './pages/Officer/OfficerLogin.jsx'
import OfficerSignup from './pages/Officer/OfficerSignup.jsx'

// Authority Imports
import Dashboard from './pages/Authority/Dashboard.jsx'
import AuthorityLogin from './pages/Authority/Login.jsx'
import AuthoritySignup from './pages/Authority/Signup.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <AuthLayout authenticationRequired={false}>
            <Home />
          </AuthLayout>
        )
      },
      {
        path: "/rankings",
        element: (
          <AuthLayout authenticationRequired={false}>
            <Rankings />
          </AuthLayout>
        )
      },
      {
        path: "/rankings/:state",
        element: (
          <AuthLayout authenticationRequired={false}>
            <CityRanking />
          </AuthLayout>
        )
      },
      {
        path: "/rankings/:state/:city",
        element: (
          <AuthLayout authenticationRequired={false}>
            <WardRanking />
          </AuthLayout>
        )
      },
      {
        path: "/login",
        element: (
          <AuthLayout authenticationRequired={false}>
            <Login />
          </AuthLayout>
        )
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authenticationRequired={false}>
            <Signup />
          </AuthLayout>
        )
      },
      {
        path: "/officer/login",
        element: (
          <AuthLayout authenticationRequired={false}>
            <OfficerLogin />
          </AuthLayout>
        )
      },
      {
        path: "/officer/signup",
        element: (
          <AuthLayout authenticationRequired={false}>
            <OfficerSignup />
          </AuthLayout>
        )
      },
      {
        path: "/authority/login",
        element: (
          <AuthLayout authenticationRequired={false}>
            <AuthorityLogin />
          </AuthLayout>
        )
      },
      {
        path: "/authority/signup",
        element: (
          <AuthLayout authenticationRequired={false}>
            <AuthoritySignup />
          </AuthLayout>
        )
      },
      {
        path: "/dashboard/:slug",
        element: (
          <AuthLayout authenticationRequired={true}>
            <Dashboard />
          </AuthLayout>
        )
      },
      {
        path: "/account",
        element: (
          <AuthLayout authenticationRequired={true}>
            <Account />
          </AuthLayout>
        )
      },
      {
        path: "/create-report",
        element: (
          <AuthLayout authenticationRequired={true}>
            <CreateReport />
          </AuthLayout>
        )
      },
      {
        path: "/feedback/:slug",
        element: (
          <AuthLayout authenticationRequired={true}>
            <Feedback />
          </AuthLayout>
        )
      },
      {
        path: "/report/:slug",
        element: <Report />,
      },
      {
        path: "/reports/:slug/",
        element: <Reports />,
      },
      {
        path: "/reports/:slug/:city",
        element: <CityReports />,
      },
      {
        path: "/reports/:slug/:city/:ward",
        element: <WardReports />,
      },
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
