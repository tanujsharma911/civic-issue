import React from 'react'

import RecentComplaints from '../../components/Dashboard/RecentComplaints';

function AllComplains({ reports, city, state }) {
    return (
        <div className='p-4 border-l-2 border-gray-200 dark:border-gray-700 w-full'>
            <h1 className="text-4xl dark:text-white">All Complaints</h1>
            <p className='mt-2 text-gray-600'>Monitor and manage all citizen complaints across the city</p>
            <RecentComplaints reports={reports} city={city} state={state} />
        </div>
    )
}

export default AllComplains