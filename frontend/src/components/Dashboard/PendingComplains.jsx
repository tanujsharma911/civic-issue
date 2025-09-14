import React from 'react'

import RecentComplaints from './RecentComplaints'

function PendingComplains({ reports, city, state }) {
    const pendingReports = reports.filter(report => report.status === 'Pending');
    return (
        <div className="p-4 min-h-screen border-l-2 border-gray-200 dark:border-gray-700">
            <h1 className="text-4xl dark:text-white">Pending Complains</h1>
            <p className='mt-2 text-gray-600'>Monitor and manage citizen pending complaints across the city</p>
            <RecentComplaints reports={pendingReports} city={city} state={state} />
        </div>
    )
}

export default PendingComplains