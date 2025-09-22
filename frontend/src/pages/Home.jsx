import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { CalendarFold, Clock, MapPin } from 'lucide-react';

import reportService from "../supabase/table"
import ReportCard from '../components/ui/ReportCard';

function Home() {
  const [reports, setReports] = useState([]);
  const [allState, setAllState] = useState([]);


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
          <ReportCard key={report.id} report={report} />
        ))}

      </ul>
      {reports.length === 0 && <p className='w-full text-gray-500 dark:text-white'>No reports found.</p>}
    </div>
  )
}

export default Home