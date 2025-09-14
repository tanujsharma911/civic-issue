import { useState } from 'react'
import { Map, UserCheck, Check } from 'lucide-react';

import reportService from '../../supabase/table';

function RecentComplaints({ reports, engineers = [], assign = false, city = '', pending = true }) {

    const [openModel, setOpenModel] = useState(false);
    const pendingReports = reports.filter(report => report.status === 'Pending');
    const [showPendingReports, setShowPendingReports] = useState(false);

    const availableEngineers = engineers.filter(engineer =>
        (engineer.assign_id === null || engineer.assign_id === "") &&
        engineer.city.toLowerCase() === city.toLowerCase()
    );

    const [selectedEngineer, setSelectedEngineer] = useState({
        name: availableEngineers[0]?.name,
        id: availableEngineers[0]?.id,
        phone: availableEngineers[0]?.phone,
        reportId: null
    });

    const handleOnChange = (e) => {
        setSelectedEngineer(prev => ({ ...prev, id: e.target.value, name: e.target.options[e.target.selectedIndex].text, phone: e.target.options[e.target.selectedIndex].getAttribute('name') }))

    }

    const handleOpenModal = (reportId) => {
        setSelectedEngineer({
            name: availableEngineers[0]?.name,
            id: availableEngineers[0]?.id,
            phone: availableEngineers[0]?.phone,
            reportId: null
        })
        setSelectedEngineer(prev => ({ ...prev, reportId }));
        setOpenModel(true);
    }

    const handleAssign = async () => {
        const updatedEngineer = {
            name: selectedEngineer.name || engineers[0]?.name,
            id: selectedEngineer.id || engineers[0]?.id,
            phone: selectedEngineer.phone || engineers[0]?.phone,
            reportId: selectedEngineer.reportId
        }
        setSelectedEngineer(updatedEngineer);

        // Updating the report table
        const response = await reportService.assignOfficerToReport(updatedEngineer.reportId, updatedEngineer.id, updatedEngineer.name, updatedEngineer.phone);

        if (response.status === 'error') {
            alert("Error assigning officer: " + response.msg.message);
            return;
        }

        // Updating the officer table
        const assignResponse = await reportService.assignOfficerToTable(updatedEngineer.id, updatedEngineer.reportId);

        if (assignResponse.status === 'error') {
            alert("Error assigning officer to table: " + assignResponse.msg.message);
            return;
        }

        setOpenModel(false);
    }

    return (
        <>
            <div className='mt-10 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-4'>
                <div className='flex justify-between items-center mb-2'>
                    <h2 className="text-xl mb-5 dark:text-white">Recent Complains</h2>

                    <div className='flex items-center gap-4'>
                        {/* {state && <div className="flex items-center mb-4">
                            <input
                                id={state.replace(/\s+/g, "")}
                                type="checkbox"
                                value={state}
                                name="state"
                                checked={selectedEngineer.state === state}
                                onChange={handleCheckBoxChange}
                                className="hidden peer"
                            />
                            <label htmlFor={state.replace(/\s+/g, "")} className="relative text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer rounded-md px-3 py-1 bg-gray-200 dark:bg-gray-700 peer-checked:bg-blue-600 peer-checked:text-white transition-colors duration-200 ease-in-out flex items-center">
                                {state}
                            </label>
                        </div>}
                        {city && <div className="flex items-center mb-4">
                            <input
                                id={city.replace(/\s+/g, "")}
                                type="checkbox"
                                value={city}
                                name="city"
                                checked={selectedEngineer.city === city}
                                onChange={handleCheckBoxChange}
                                className="hidden peer"
                            />
                            <label htmlFor={city.replace(/\s+/g, "")} className="relative text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer rounded-md px-3 py-1 bg-gray-200 dark:bg-gray-700 peer-checked:bg-blue-600 peer-checked:text-white transition-colors duration-200 ease-in-out flex items-center">
                                {city}
                            </label>
                        </div>} */}
                        {pending && <div className="flex items-center mb-4">
                            <input
                                id="pending"
                                type="checkbox"
                                value="Pending"
                                name="pending"
                                onChange={(e) => { console.log(e.target.name, e.target.checked); setShowPendingReports(e.target.checked) }}
                                className="hidden peer"
                            />
                            <label htmlFor="pending" className="relative text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer rounded-md px-3 py-1 bg-gray-200 dark:bg-gray-700 peer-checked:bg-blue-600 peer-checked:text-white transition-colors duration-200 ease-in-out flex items-center">
                                Pending
                            </label>
                        </div>}
                    </div>

                </div>
                <div className="flex flex-col w-[70vw] lg:w-full">
                    <div className="overflow-scroll ">
                        <div>
                            <div className="overflow-scroll">
                                <table className="w-full divide-y divide-gray-200 dark:divide-neutral-700">

                                    {/* Head */}
                                    <thead>
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">ID</th>
                                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Description</th>
                                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">City, State</th>
                                            <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Status</th>
                                            <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Assignee</th>
                                            <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Complain Date</th>
                                            <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Open In Map</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">


                                        {(reports && !showPendingReports) && reports.map((report, idx) => (
                                            <tr key={report.id || idx}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">{report.id}</td>
                                                <td className="px-6 py-4 max-w-60 overflow-scroll whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{report.description}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{report.city}, {report.state}</td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-end text-sm font-medium ${report.status === 'Pending' ? 'text-red-700' : report.status === 'In Progress' ? 'text-yellow-700' : 'text-green-700'}`}><span className={`px-2 py-1 rounded-full ${report.status === 'Pending' ? 'bg-red-50' : report.status === 'In Progress' ? 'bg-yellow-50' : 'bg-green-50'}`}>{report.status}</span></td>
                                                {report.assignedToName && <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">{report.assignedToName}</td>}
                                                {(!report.assignedToName && assign) && <td className="flex justify-end py-4 whitespace-nowrap text-end text-sm font-medium"><button onClick={() => handleOpenModal(report.id)} className='bg-sky-100 flex items-center gap-2 rounded-xl hover:bg-sky-200 cursor-pointer py-2 px-3 text-sky-700'><UserCheck size={14} />Assign</button></td>}
                                                {(!report.assignedToName && !assign) && <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium"> -</td>}
                                                <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">{new Date(report.created_at).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                                                    <button onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${report?.lat},${report?.lng}`, '_blank')} type="button" className="cursor-pointer inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:text-blue-400"><Map size={18} className="mr-1" />Open In Map</button>
                                                </td>
                                            </tr>
                                        ))}

                                        {showPendingReports && pendingReports.map((report, idx) => (
                                            <tr key={report.id || idx}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">{report.id}</td>
                                                <td className="px-6 py-4 max-w-60 overflow-scroll whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{report.description}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{report.city}, {report.state}</td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-end text-sm font-medium ${report.status === 'Pending' ? 'text-red-700' : report.status === 'In Progress' ? 'text-yellow-700' : 'text-green-700'}`}><span className={`px-2 py-1 rounded-full ${report.status === 'Pending' ? 'bg-red-50' : report.status === 'In Progress' ? 'bg-yellow-50' : 'bg-green-50'}`}>{report.status}</span></td>
                                                {report.assignedToName && <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">{report.assignedToName}</td>}
                                                {(!report.assignedToName && assign) && <td className="flex justify-end py-4 whitespace-nowrap text-end text-sm font-medium"><button onClick={() => handleOpenModal(report.id)} className='bg-sky-100 flex items-center gap-2 rounded-xl hover:bg-sky-200 cursor-pointer py-2 px-3 text-sky-700'><UserCheck size={14} />Assign</button></td>}
                                                {(!report.assignedToName && !assign) && <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium"> -</td>}
                                                <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">{new Date(report.created_at).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                                                    <button onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${report?.lat},${report?.lng}`, '_blank')} type="button" className="cursor-pointer inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:text-blue-400"><Map size={18} className="mr-1" />Open In Map</button>
                                                </td>
                                            </tr>
                                        ))}


                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>


                <div id="hs-basic-modal" className={`bg-gray-950/20 ${openModel ? 'hs-overlay-open:opacity-100 hs-overlay-open:duration-500' : 'hidden'} size-full fixed top-0 start-0 z-80 overflow-x-hidden transition-all overflow-y-auto pointer-events-none`} role="dialog" tabIndex="-1" aria-labelledby="hs-basic-modal-label">
                    <div className="sm:max-w-lg sm:w-full m-3 sm:mx-auto">
                        <div className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70">
                            <div className="flex justify-between items-center py-3 px-4 border-b border-gray-200 dark:border-neutral-700">
                                <h3 id="hs-basic-modal-label" className="font-bold text-gray-800 dark:text-white">
                                    Assign Field Engineer
                                </h3>
                            </div>
                            <div className="p-4">
                                <p className="mt-1 text-gray-800 dark:text-neutral-400">
                                    Select the field engineer you want to assign this complaint to.
                                </p>
                                <select
                                    value={selectedEngineer.id || ''}
                                    onChange={(e) => handleOnChange(e)}
                                    className="mt-4 py-3 px-2 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                >
                                    {availableEngineers.map((engineer) => (
                                        <option key={engineer.id} value={engineer.id} name={engineer.phone}>{engineer.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t border-gray-200 dark:border-neutral-700">
                                <button onClick={() => setOpenModel(false)} type="button" className="py-2 px-3 cursor-pointer inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" data-hs-overlay="#hs-basic-modal">
                                    Close
                                </button>
                                <button onClick={handleAssign} type="button" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                                    Assign
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default RecentComplaints