import { useParams, useNavigate, useLocation } from 'react-router';
import { useSelector } from "react-redux";
import { useEffect, useState } from 'react';
import { LayoutDashboard, TextSearch, ClipboardClock, UserCog, Map } from 'lucide-react';

// local imports
import reportService from "../../supabase/table";

import DashboardOverview from '../../components/Dashboard/DashboardOverview';
import AllComplains from '../../components/Dashboard/AllComplains';
import PendingComplains from '../../components/Dashboard/PendingComplains';
import AllOfficers from '../../components/Dashboard/AllOfficers';


function Dashboard() {
    const navigate = useNavigate();

    // Account data
    const user = useSelector(state => state.auth.userData);

    // Get state from params
    const { slug } = useParams();

    // Get city from query params
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const city = queryParams.get("city");

    const [active, setActive] = useState('dashboard');
    const [reports, setReports] = useState([]);

    // Side bar data
    const sideBarList = [
        {
            name: "Dashboard",
            icon: <LayoutDashboard />
        },
        {
            name: "All Complaints",
            icon: <TextSearch />
        },
        {
            name: "Pending",
            icon: <ClipboardClock />
        },
        {
            name: "All Field Engineers",
            icon: <UserCog />
        }
    ]

    useEffect(() => {
        if (city.length < 3) {
            alert("Incorrect city");
            navigate('/');
        }
        if (!user) {
            alert("Only logged-in users can access the dashboard.");
            navigate('/');
        }
        if (user?.user_metadata?.role !== 'authority') {
            alert("Only supervisors can access this dashboard.");
            navigate('/');
        }

        const fetchReports = async () => {
            const res = await reportService.getAllReports();

            if (res.status === 'success') {
                setReports(res.data);

            } else {
                console.log('Error fetching reports: ' + res.msg);
            }
        };

        fetchReports();
    }, [slug, user, navigate, city, active]);

    return (
        <div className='max-w-screen'>

            <aside id="default-sidebar" className="w-[20vw] min-h-screen float-left" aria-label="Sidebar">
                <div className="h-full px-3 py-4 dark:bg-gray-800">
                    <ul className="space-y-2 font-medium">

                        {sideBarList.map((list) =>
                        (<li key={list.name} className=''>
                            <button onClick={() => setActive(list.name.toLocaleLowerCase().replace(/\s+/g, ""))} className="flex w-full cursor-pointer items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                {list.icon}
                                <span className="ml-3">{list.name}</span>
                            </button>
                        </li>))}

                    </ul>
                </div>
            </aside>

            <div className='w-[80vw] float-right'>
                {active === 'dashboard' && <DashboardOverview reports={reports} city={city} state={slug} />}
                {active === 'allcomplaints' && <AllComplains reports={reports} city={city} state={slug} />}
                {active === 'pending' && <PendingComplains reports={reports} city={city} state={slug} />}
                {active === 'allfieldengineers' && <AllOfficers city={city} state={slug} />}
            </div>

        </div>
    )
}

export default Dashboard