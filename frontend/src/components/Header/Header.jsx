
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, Link } from "react-router"

function Header() {
  const authStatus = useSelector(state => state.auth.status);
  const userRole = useSelector(state => state.auth?.userData?.user_metadata?.role);

  const authorityData = useSelector(state => state.auth.userData);
  const authorityStatus = authorityData?.user_metadata?.role === 'authority' ? true : false;

  const [userDropdownOpen, setUserDropdownOpen] = useState('hidden');
  const [officerDropdownOpen, setOfficerDropdownOpen] = useState('hidden');
  const [authorityDropdownOpen, setAuthorityDropdownOpen] = useState('hidden');

  const [navbarOpen, setNavbarOpen] = useState(false);

  const links = [
    {
      name: 'Home',
      to: '/',
      active: true
    },
    {
      name: 'State Rankings',
      to: '/rankings',
      active: true
    },
    {
      name: 'Account',
      to: '/account',
      active: authStatus
    },
    {
      name: 'Dashboard',
      to: `/dashboard/${authorityData?.user_metadata?.state?.toLowerCase()}?city=${authorityData?.user_metadata?.city?.toLowerCase()}`,
      active: authorityStatus
    },
    {
      name: 'Create Reports',
      to: '/create-report',
      active: authStatus && userRole === 'user'
    },
  ];

  return (
    <header className="flex flex-wrap border-b border-gray-200 sm:justify-start sm:flex-nowrap w-full bg-white text-sm py-3">
      <nav className="bg-white w-full border-gray-200 dark:bg-gray-900 dark:border-gray-700">
        <div className="max-w-screen-xl px-10 flex flex-wrap items-center justify-between mx-auto p-4">
          <span className="flex items-center space-x-3 rtl:space-x-reverse">
            <NavLink className="flex-none font-semibold text-xl text-black focus:outline-hidden focus:opacity-80 " to="/" aria-label="Brand">SIH 2025</NavLink>
          </span>

          <button data-collapse-toggle="navbar-dropdown" onClick={() => setNavbarOpen(!navbarOpen)} type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-dropdown" aria-expanded="false">
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>

          <div className={`${navbarOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`} id="navbar-dropdown">
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">


              {links.map((link) =>
                link.active ? (
                  <li key={link.name} className='ml-3' >
                    <NavLink className={({ isActive }) => `hover:bg-gray-50 hover:scale-105 rounded-2xl cursor-pointer transition-all px-3 py-2 font-medium ${isActive ? 'text-blue-500 ' : 'text-gray-900 dark:text-gray-400 '} transition-all duration-100 ease-in-out hover:scale-105 focus:outline-hidden focus:opacity-80`} to={link.to} aria-current="page">{link.name}</NavLink>
                  </li>
                ) : null)}

              {/* City Authority */}
              {!authStatus && <li className=''>
                <button id="dropdownNavbarLink" onClick={() => setAuthorityDropdownOpen(authorityDropdownOpen === 'hidden' ? 'absolute' : 'hidden')} data-dropdown-toggle="dropdownNavbar" className="flex cursor-pointer items-center justify-between w-full py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent">Municipal Authority<svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg></button>
                <div id="dropdownNavbar" className={`z-10 ${authorityDropdownOpen} font-normal bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600`}>
                  <ul className="py-2 text-sm text-gray-700 dark:text-gray-400" aria-labelledby="dropdownLargeButton">
                    <li>
                      <Link to="/authority/login" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Login</Link>
                    </li>
                    <li>
                      <Link to="/authority/signup" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sign Up</Link>
                    </li>
                  </ul>
                </div>
              </li>}

              {/* Field Engineer */}
              {!authStatus && <li className=''>
                <button id="dropdownNavbarLink" onClick={() => setOfficerDropdownOpen(officerDropdownOpen === 'hidden' ? 'absolute' : 'hidden')} data-dropdown-toggle="dropdownNavbar" className="flex cursor-pointer items-center justify-between w-full py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent">Ward Member<svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg></button>
                <div id="dropdownNavbar" className={`z-10 ${officerDropdownOpen} font-normal bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600`}>
                  <ul className="py-2 text-sm text-gray-700 dark:text-gray-400" aria-labelledby="dropdownLargeButton">
                    <li>
                      <Link to="/officer/login" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Login</Link>
                    </li>
                    <li>
                      <Link to="/officer/signup" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sign Up</Link>
                    </li>
                  </ul>
                </div>
              </li>}

              {/* User */}
              {!authStatus &&
                <li className=''>
                  <button id="dropdownNavbarLink" onClick={() => setUserDropdownOpen(userDropdownOpen === 'hidden' ? 'absolute' : 'hidden')} data-dropdown-toggle="dropdownNavbar" className="flex cursor-pointer items-center justify-between w-full py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent">Citizen <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                  </svg></button>
                  <div id="dropdownNavbar" className={`z-10 ${userDropdownOpen} font-normal bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600`}>
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-400" aria-labelledby="dropdownLargeButton">
                      <li>
                        <Link to="/login" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Login</Link>
                      </li>
                      <li>
                        <Link to="/signup" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sign Up</Link>
                      </li>
                    </ul>
                  </div>
                </li>}


            </ul>
          </div>
        </div>
      </nav>

    </header>
  )
}

export default Header