import { TextSearch, ClipboardClock, ListChecks, UserCog } from 'lucide-react';
import { useEffect, useState } from 'react';

import DashboardCard from './DashboardCard';
import RecentComplaints from './RecentComplaints';
import reportService from '../../supabase/table';

function DashboardOverview({ reports, city, state }) {
    const [engineers, setEngineers] = useState([]);

    const resolvedRate = (((reports.filter((item) => item.status === 'Completed').length / reports.length) * 100) || 0).toFixed(2)

    useEffect(() => {
        // Fetch all engineers data
        const fetchEngineers = async () => {
            try {
                const response = await reportService.getAllOfficers();
                setEngineers(response.data || []);
            } catch (error) {
                console.error('Error fetching engineers:', error);
            }
        };

        fetchEngineers();
    }, []);

    return (
        <>
            <div className="w-full">

                <div className="p-4 min-h-screen border-l-2 border-gray-200 dark:border-gray-700">
                    <h1 className="text-4xl dark:text-white">Dashboard Overview</h1>
                    <p className='mt-2 text-gray-600'>Monitor and manage citizen complaints across the city</p>
                    <div className='grid grid-cols-2 lg:grid-cols-4 mt-10 gap-4 mb-4'>
                        <DashboardCard title="Total Complaints" icon={<TextSearch />} number={reports.length} />
                        <DashboardCard title="Pending Complaints" color={resolvedRate > 70 ? 'green' : (resolvedRate > 40) ? 'yellow' : 'red'} icon={<ClipboardClock />} number={reports.filter((item) => item.status === 'Pending').length} />
                        <DashboardCard title="Resolved Complaints" color={resolvedRate > 70 ? 'green' : (resolvedRate > 40) ? 'yellow' : 'red'} icon={<ListChecks />} number={reports.filter((item) => item.status === 'Completed').length} />
                        <DashboardCard title="Resolution Rates" color={resolvedRate > 70 ? 'green' : (resolvedRate > 40) ? 'yellow' : 'red'} icon={<UserCog />} number={resolvedRate + '%'} />
                    </div>

                    <RecentComplaints reports={reports} engineers={engineers} assign city={city} state={state} />
                </div>
            </div>
        </>
    )
}

export default DashboardOverview