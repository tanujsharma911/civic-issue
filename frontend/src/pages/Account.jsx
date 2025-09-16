import { useNavigate } from "react-router";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import auth from "../supabase/auth"
import { logout } from '../store/authSlice'
import reportService from "../supabase/table"

function Account() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(state => state.auth.userData);

  const [reports, setReports] = useState([]);
  const [completedReports, setCompletedReports] = useState([]);
  const [inProgressReports, setInProgressReports] = useState([]);

  const handleLogout = async () => {
    const res = await auth.signOut();

    if (res.status === 'success') {
      toast.success('Logged out successfully');
      dispatch(logout());
      navigate('/');
    }
  }

  useEffect(() => {
    if (!user) return;
    const fetchReports = async () => {

      // user created reports
      if (user.user_metadata.role === 'user') {
        const res = await reportService.getReportsByUserIdName(user.id, user.user_metadata.display_name);
        console.log(res.data, "user id", user.id, "user name", user.user_metadata.display_name);
        setReports(res.data);
      }

      // officer assigned reports
      else if (user.user_metadata.role === 'officer') {

        // getting officer id from table officers
        const officerRes = await reportService.getOfficerByAuthId(user.id);

        if (officerRes.status === 'error') {
          console.log('Error fetching officer: ' + officerRes.msg);
          return;
        }
        const officerId = officerRes.data.id.toString();

        // fetching reports assigned to officer
        const res = await reportService.getReportsByAssignedTo(officerId);

        // filtering reports based on officer id
        setReports(res.data.filter(report => report.assignedToId === officerId))

        setInProgressReports(res.data.filter(report => report.status === 'In Progress' && report.assignedToId === officerId))

        setCompletedReports(res.data.filter(report => report.status === 'Completed' && report.assignedToId === officerId))
      }

    };
    fetchReports();
  }, []);

  return (
    <div>
      <div className="shrink-0 group flex flex-wrap gap-2 justify-between items-center border border-gray-200 rounded-2xl p-4">
        <div className="flex items-center">
          <span className="inline-block size-15.5 bg-gray-100 rounded-full overflow-hidden">
            <svg className="size-full text-gray-300" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.62854" y="0.359985" width="15" height="15" rx="7.5" fill="white"></rect>
              <path d="M8.12421 7.20374C9.21151 7.20374 10.093 6.32229 10.093 5.23499C10.093 4.14767 9.21151 3.26624 8.12421 3.26624C7.0369 3.26624 6.15546 4.14767 6.15546 5.23499C6.15546 6.32229 7.0369 7.20374 8.12421 7.20374Z" fill="currentColor"></path>
              <path d="M11.818 10.5975C10.2992 12.6412 7.42106 13.0631 5.37731 11.5537C5.01171 11.2818 4.69296 10.9631 4.42107 10.5975C4.28982 10.4006 4.27107 10.1475 4.37419 9.94123L4.51482 9.65059C4.84296 8.95684 5.53671 8.51624 6.30546 8.51624H9.95231C10.7023 8.51624 11.3867 8.94749 11.7242 9.62249L11.8742 9.93184C11.968 10.1475 11.9586 10.4006 11.818 10.5975Z" fill="currentColor"></path>
            </svg>
          </span>

          <div className="ms-3">
            <h3 className="font-semibold text-gray-800 dark:text-white">
              {user?.user_metadata?.display_name || user?.user_metadata?.city + ', ' + user?.user_metadata?.state || 'Unknown'}
              <span className="text-sm my-auto ml-1 font-light bg-gray-200 py-1 px-2 rounded-full">{user?.user_metadata?.role === 'user' ? 'Citizen' : user?.user_metadata?.role === 'officer' ? 'Ward Member' : 'Municipal Officer'}</span>
              {user?.user_metadata?.role === 'officer' && <span className="text-sm my-auto ml-1 font-light bg-gray-200 py-1 px-2 rounded-full">Ward No. {user?.user_metadata?.lgd_ward_code}</span>}
            </h3>
            <p className="text-sm font-medium text-gray-400 dark:text-neutral-500">{user?.user_metadata?.email}</p>
            <p className="text-sm font-medium text-gray-400 dark:text-neutral-500">{user?.phone && '+' + user?.phone}</p>
          </div>
        </div>
        <div className="h-full flex items-center">
          <button onClick={() => handleLogout()} type="button" className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 hover:text-blue-600 focus:outline-hidden focus:border-blue-600 focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-blue-500 dark:hover:border-blue-600 dark:focus:text-blue-500 dark:focus:border-blue-600">
            Logout
          </button>
        </div>
      </div>

      {user?.user_metadata?.role === 'user' && <div className='p-4 mt-5 border border-gray-200 dark:border-gray-700 rounded-2xl' >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-foreground">Reports Insights</h3>
        </div>

        <div className="grid grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl">{reports?.length}</div>
            <div className="text-sm text-muted-foreground">Total Complaints</div>
          </div>
          <div className="text-center">
            <div className="text-2xl text-green-600">{reports?.filter(report => report.status === 'Completed').length}</div>
            <div className="text-sm text-muted-foreground">Resolved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl text-yellow-500">{reports?.filter(report => report.status === 'In Progress').length}</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl text-red-600">{reports?.filter(report => report.status === 'Pending').length}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl text-foreground">{reports?.filter(report => report.status === 'Completed').length + reports?.filter(report => report.status === 'In Progress').length + reports?.filter(report => report.status === 'Pending').length > 0 ? Math.round((reports?.filter(report => report.status === 'Completed').length / (reports?.filter(report => report.status === 'Completed').length + reports?.filter(report => report.status === 'In Progress').length + reports?.filter(report => report.status === 'Pending').length)) * 100) : 0}%</div>
            <div className="text-sm text-muted-foreground">Resolved Rate</div>
          </div>
        </div>
      </div>}

      {user?.user_metadata?.role === 'officer' && <div className='p-4 mt-5 border border-gray-200 dark:border-gray-700 rounded-2xl' >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-foreground">Reports Insights</h3>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl">{reports?.length}</div>
            <div className="text-sm text-muted-foreground">Total Assigned Complaints</div>
          </div>
          <div className="text-center">
            <div className="text-2xl text-green-600">{reports?.filter(report => report.status === 'Completed').length}</div>
            <div className="text-sm text-muted-foreground">Resolved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl text-yellow-500">{reports?.filter(report => report.status === 'In Progress').length}</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl text-foreground">{reports?.filter(report => report.status === 'Completed').length + reports?.filter(report => report.status === 'In Progress').length > 0 ? Math.round((reports?.filter(report => report.status === 'Completed').length / (reports?.filter(report => report.status === 'Completed').length + reports?.filter(report => report.status === 'In Progress').length)) * 100) : 0}%</div>
            <div className="text-sm text-muted-foreground">Resolved Rate</div>
          </div>
        </div>
      </div>}

      {/* Your Reports */}
      {user?.user_metadata?.role === 'user' && <h1 className="mt-10 mb-4 text-3xl dark:text-white">Your Reports</h1>}
      <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {user?.user_metadata?.role === 'user' && reports.map((report) => (
          <li key={report.id} className='h-full'>
            <div className="flex flex-col h-full bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
              <div className="aspect-[4/3] w-full h-full bg-gray-200 rounded-t-lg overflow-hidden">
                <img src={report.image} className="aspect-[4/3] w-full h-full object-cover" alt="Description" />
              </div>
              <div className="p-4 md:p-5">
                <p className="text-lg font-bold text-gray-800 dark:text-white">
                  {report.description.length > 30 ? report.description.slice(0, 30) + "..." : report.description}
                </p>
                <p>Created at {new Date(report.created_at).toLocaleString()}</p>

                <div className='flex justify-between items-center'>
                  <button className="mt-2 py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" onClick={() => navigate(`/report/${report.id}`)}>
                    View
                  </button>

                  <div className="mt-4 scale-75">
                    {report?.status === 'Pending' && <div className="inline-flex bg-red-100 py-1 px-3 rounded-full items-center">
                      <span className="size-2 inline-block bg-red-500 rounded-full me-2"></span>
                      <span className="text-gray-600 dark:text-neutral-400">Pending</span>
                    </div>}
                    {report?.status === 'In Progress' && <div className="inline-flex bg-yellow-100 py-1 px-3 rounded-full items-center">
                      <span className="size-2 inline-block bg-yellow-500 rounded-full me-2"></span>
                      <span className="text-gray-600 dark:text-neutral-400">In Progress</span>
                    </div>}
                    {report?.status === 'Completed' && <div className="inline-flex  bg-green-100 py-1 px-3 rounded-full items-center">
                      <span className="size-2 inline-block bg-green-500 rounded-full me-2"></span>
                      <span className="text-gray-600 dark:text-neutral-400">Completed</span>
                    </div>}

                  </div>
                </div>

              </div>
            </div>
          </li>
        ))}
      </ul>
      {(user?.user_metadata?.role === 'user' && reports.length === 0) && <p className="mb-10 text-gray-500 dark:text-neutral-400">No reports found.</p>}

      {/* Your Pending Reports */}
      {user?.user_metadata?.role === 'officer' && <h1 className="mt-10 mb-4 text-3xl dark:text-white">Your Pending Reports</h1>}
      <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {inProgressReports.map((report) => (
          <li key={report.id} className='h-full'>
            <div className="flex flex-col h-full bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
              <div className="aspect-[4/3] w-full h-full bg-gray-200 rounded-t-lg overflow-hidden">
                <img src={report.image} className="aspect-[4/3] w-full h-full object-cover" alt="Description" />
              </div>
              <div className="p-4 md:p-5">
                <p className="text-lg font-bold text-gray-800 dark:text-white">
                  {report.description.length > 30 ? report.description.slice(0, 30) + "..." : report.description}
                </p>
                <p>Created at {new Date(report.created_at).toLocaleString()}</p>

                <div className='flex justify-between items-center'>
                  <button className="mt-2 py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" onClick={() => navigate(`/report/${report.id}`)}>
                    View
                  </button>

                  <div className="mt-4 scale-75">
                    {report?.status === 'Pending' && <div className="inline-flex bg-red-100 py-1 px-3 rounded-full items-center">
                      <span className="size-2 inline-block bg-red-500 rounded-full me-2"></span>
                      <span className="text-gray-600 dark:text-neutral-400">Pending</span>
                    </div>}
                    {report?.status === 'In Progress' && <div className="inline-flex bg-yellow-100 py-1 px-3 rounded-full items-center">
                      <span className="size-2 inline-block bg-yellow-500 rounded-full me-2"></span>
                      <span className="text-gray-600 dark:text-neutral-400">In Progress</span>
                    </div>}
                    {report?.status === 'Completed' && <div className="inline-flex  bg-green-100 py-1 px-3 rounded-full items-center">
                      <span className="size-2 inline-block bg-green-500 rounded-full me-2"></span>
                      <span className="text-gray-600 dark:text-neutral-400">Completed</span>
                    </div>}

                  </div>
                </div>

              </div>
            </div>
          </li>
        ))}
      </ul>
      {(user?.user_metadata?.role === 'officer' && inProgressReports.length === 0) && <p className="mb-10 text-gray-500 dark:text-neutral-400">No ongoing reports found.</p>}

      {/* Your Completed Reports */}
      {user?.user_metadata?.role === 'officer' && <h1 className="mt-10 mb-4 text-3xl dark:text-white">Your Completed Reports</h1>}
      <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {completedReports.map((report) => (
          <li key={report.id} className='h-full'>
            <div className="flex flex-col h-full bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
              <div className="aspect-[4/3] w-full h-full bg-gray-200 rounded-t-lg overflow-hidden">
                <img src={report.image} className="aspect-[4/3] w-full h-full object-cover" alt="Description" />
              </div>
              <div className="p-4 md:p-5">
                <p className="text-lg font-bold text-gray-800 dark:text-white">
                  {report.description.length > 30 ? report.description.slice(0, 30) + "..." : report.description}
                </p>
                <p>Created at {new Date(report.created_at).toLocaleString()}</p>

                <div className='flex justify-between items-center'>
                  <button className="mt-2 py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" onClick={() => navigate(`/report/${report.id}`)}>
                    View
                  </button>

                  <div className="mt-4 scale-75">
                    {report?.status === 'Pending' && <div className="inline-flex bg-red-100 py-1 px-3 rounded-full items-center">
                      <span className="size-2 inline-block bg-red-500 rounded-full me-2"></span>
                      <span className="text-gray-600 dark:text-neutral-400">Pending</span>
                    </div>}
                    {report?.status === 'In Progress' && <div className="inline-flex bg-yellow-100 py-1 px-3 rounded-full items-center">
                      <span className="size-2 inline-block bg-yellow-500 rounded-full me-2"></span>
                      <span className="text-gray-600 dark:text-neutral-400">In Progress</span>
                    </div>}
                    {report?.status === 'Completed' && <div className="inline-flex  bg-green-100 py-1 px-3 rounded-full items-center">
                      <span className="size-2 inline-block bg-green-500 rounded-full me-2"></span>
                      <span className="text-gray-600 dark:text-neutral-400">Completed</span>
                    </div>}

                  </div>
                </div>

              </div>
            </div>
          </li>
        ))}
      </ul>

      {(user?.user_metadata?.role === 'officer' && completedReports.length === 0) && <p className="mb-10  text-gray-500 dark:text-neutral-400">No completed reports found.</p>}
    </div>
  )
}

export default Account