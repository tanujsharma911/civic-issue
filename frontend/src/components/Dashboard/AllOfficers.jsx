import { useState, useEffect } from 'react'

import reportService from "../../supabase/table";

function AllOfficers({ city = '', state = '' }) {
    const [allOfficers, setAllOfficers] = useState([]);
    const [filteredOfficers, setFilteredOfficers] = useState([]);
    const [filters, setFilters] = useState({
        city: false,
        state: false,
    });

    useEffect(() => {
        fetchOfficers();
    }, []);

    useEffect(() => {
        let updatedOfficers = [...allOfficers];

        if (filters.state) {
            updatedOfficers = updatedOfficers.filter(officer => officer.state.toLowerCase() === state.toLowerCase());
        }
        if (filters.city) {
            updatedOfficers = updatedOfficers.filter(officer => officer.city.toLowerCase() === city.toLowerCase());
        }

        setFilteredOfficers(updatedOfficers);
    }, [allOfficers, filters, city, state]);

    const handleFilterChange = (event) => {
        const { name, checked } = event.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: checked,
        }));
    };

    const fetchOfficers = async () => {
        const res = await reportService.getAllOfficers();

        if (res.status === 'success') {
            setAllOfficers(res.data);
        } else {
            console.log('Error fetching officers: ' + res.msg);
        }
    }

    return (
        <div className="p-4 min-h-screen border-l-2 border-gray-200 dark:border-gray-700">
            <h1 className="text-4xl dark:text-white">Ward Members List</h1>
            <p className='mt-2 text-gray-600'>Monitor and manage ward members</p>

            <div className=" border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-4 mt-10 flex flex-col lg:w-full">
                <div className="overflow-scroll ">
                    <div className='flex items-center gap-4'>
                        {state && <div className="flex items-center mb-4">
                            <input
                                id={state.replace(/\s+/g, "")}
                                type="checkbox"
                                value={state}
                                name="state"
                                className="hidden peer"
                                checked={filters.state}
                                onChange={handleFilterChange}
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
                                className="hidden peer"
                                checked={filters.city}
                                onChange={handleFilterChange}
                            />
                            <label htmlFor={city.replace(/\s+/g, "")} className="relative text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer rounded-md px-3 py-1 bg-gray-200 dark:bg-gray-700 peer-checked:bg-blue-600 peer-checked:text-white transition-colors duration-200 ease-in-out flex items-center">
                                {city}
                            </label>
                        </div>}
                    </div>

                    <div>
                        <div className="overflow-scroll">
                            <table className="divide-y divide-gray-200 dark:divide-neutral-700">

                                {/* Table Header */}
                                <thead>
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">ID</th>
                                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Name</th>
                                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Phone</th>
                                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">City</th>
                                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">State</th>
                                        <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Status</th>
                                        {/* <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Action</th> */}
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">


                                    {filteredOfficers && filteredOfficers.map(officer => (
                                        <tr key={officer.id} className="hover:bg-gray-100 dark:hover:bg-neutral-700">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">{officer.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{officer.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{officer.phone}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{officer.city}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{officer.state}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{officer.workDoneStatus}</td>
                                            {/* <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                                                <button type="button" className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:text-blue-400">Delete</button>
                                            </td> */}
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AllOfficers