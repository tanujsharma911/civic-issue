import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { CalendarFold, Clock, MapPin } from 'lucide-react';

import reportService from "../supabase/table"

function Home() {
  // const user = useSelector((state) => state.auth.user);
  const [reports, setReports] = useState([]);
  const [allState, setAllState] = useState([]);

  // const fetchAllStateAndCity = async () => {
  //   const res = await fetch('https://gist.githubusercontent.com/anubhavshrimal/4aeb195a743d0cdd1c3806c9c222ed45/raw/181a34db4fcb8b37533b7c8b9c489b6c01573158/Indian_Cities_In_States_JSON')
  //   const data = await res.json();
  //   console.log(data);
  // }
  // fetchAllStateAndCity()


  useEffect(() => {
    const extractUniqueStates = (data) => {
      // A Set automatically stores only unique values.
      // We map over the data to get an array of all states,
      // and the Set constructor handles the rest.
      const stateSet = new Set(data.map(complaint => complaint.state));

      // Convert the Set back into an array before returning.
      // console.log("in func", Array.from(stateSet));
      return Array.from(stateSet);
    };


    const fetchReports = async () => {
      const res = await reportService.getAllReports();

      if (res.status === 'success') {
        setReports(res.data);
        // console.log(JSON.stringify(res.data));
        const temp = extractUniqueStates(res.data);
        setAllState(temp);
        // console.log(temp);
      } else {
        console.log('Error fetching reports: ' + res.msg);
      }

    };


    fetchReports();
  }, []);



  return (
    <div>
      {allState.length > 0 && <h1 className="text-4xl mb-4 dark:text-white">All States</h1>}
      <ul className='flex flex-wrap gap-4 mb-8'>
        {allState.map((state, index) => (
          <li key={index} className=''>
            <Link to={`reports/${state}`} className="flex flex-col p-3 bg-white border border-gray-200  hover:scale-[1.02] overflow-clip transition-all duration-200 hover:border-gray-400 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
              {state}
            </Link>
          </li>
        ))}
      </ul>

      <h1 className="text-4xl mb-4 dark:text-white">All Reports</h1>
      <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {reports.map((report) => (
          <li key={report.id} className='h-full hover:scale-[1.02] overflow-clip transition-all duration-200'>
            <div className="flex flex-col h-full bg-white border border-gray-200 hover:border-gray-400 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
              <div className="aspect-[4/3] w-full h-full bg-gray-200 rounded-t-lg overflow-hidden">
                <img src={report.image} className="aspect-[4/3] w-full h-full object-cover" alt="Description" />
              </div>
              <div className="p-4 md:p-5">
                <p className="text-lg font-bold text-gray-800 dark:text-white">
                  {report.description.length > 30 ? report.description.slice(0, 30) + "..." : report.description}
                </p>
                <p className='my-3 text-gray-600 flex gap-2 items-center'> <CalendarFold size={18} /> {new Date(report.created_at).toLocaleDateString()}</p>
                <p className='my-3 text-gray-600 flex gap-2 items-center'> <Clock size={18} /> {new Date(report.created_at).toLocaleTimeString()}</p>
                <p className='my-3 text-gray-600 flex gap-2 items-center'> <MapPin size={18} /> {report.city}, {report.state}</p>

                <div className='flex justify-between items-center'>
                  <Link className="mt-2 py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" to={`report/${report.id}`}>
                    View
                  </Link>

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
      {reports.length === 0 && <p className='w-full text-gray-500 dark:text-white'>No reports found.</p>}
    </div>
  )
}

export default Home