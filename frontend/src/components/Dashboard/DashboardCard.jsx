import React from 'react'

function DashboardCard({ title, icon, number, color }) {
    return (
        <div className={`justify-between h-full rounded-2xl ${color ? `bg-${color}-50` : 'bg-gray-100'} text-gray-800 dark:text-neutral-200`}>
            <div className='p-4 flex items-center justify-between'>
                <h2 className='font-semibold'>{title}</h2>
                <span className={`ml-3 rounded-2xl p-3 ${color ? `bg-${color}-100` : 'bg-white'}`}>{icon}</span>
            </div>
            <div className='mb-4'>
                <h1 className={`text-3xl font-bold px-4 text-${color}-700`}>{number || 0}</h1>
            </div>
        </div>
    )
}

export default DashboardCard