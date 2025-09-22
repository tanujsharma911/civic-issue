import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { CalendarFold, Clock, MapPin, User } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import reportService from "../../supabase/table"

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function SetViewOnClick({ animateRef }) {
    const map = useMapEvent('click', (e) => {
        map.setView(e.latlng, map.getZoom(), {
            animate: animateRef.current || false,
        })
    })

    return null
}

function WardReports() {
    const navigate = useNavigate();
    const { slug, city, ward } = useParams();
    const [allWardReports, setAllWardReports] = useState([]);
    const [locations, setLocations] = useState([]);

    function transformIssues(issues) {
        const newLocations = issues.map(issue => ({
            lat: issue.lat,
            lng: issue.lng,
            description: issue.description,
            image: issue.image,
            createdByName: issue.createdByName,
            created_at: issue.created_at,
            id: issue.id
        }));
        setLocations(newLocations);
    }


    useEffect(() => {

        reportService.getReportsByStateCity(slug, city).then((res) => {
            if (res.status === 'success') {
                const wardFilteredReports = res.data.filter(report => report.lgd_ward_code === ward);
                setAllWardReports(wardFilteredReports);
                transformIssues(wardFilteredReports);
                // console.log(wardFilteredReports);
                // console.log('Reports fetched successfully', JSON.stringify(wardFilteredReports));
            } else {
                console.log('Error fetching reports: ' + res.msg);
            }
        });
    }, [slug, city, ward]);

    return (
        <div>
            <h1 className="text-4xl mb-4 dark:text-white">All Reports of Ward No. {ward}, {city}, {slug} </h1>

            <div className=''>
                {locations && <MapContainer center={[24.5854, 73.7125]} zoom={12} className="leaflet-container">
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://osm.org/">OpenStreetMap</a> contributors'
                    />
                    {locations.map((loc, i) => (
                        <Marker key={i} position={[loc.lat, loc.lng]}>
                            <Popup className='max-w-sm'>
                                <p className='text-base'>{loc.description} </p>
                                <p className='flex'><User size={18} className="mr-1 " /> {loc.createdByName}</p>
                                <p className='flex'><CalendarFold size={18} className="mr-1" /> {new Date(loc.created_at).toLocaleDateString()}</p>
                                <button className='bg-sky-600 px-2 py-1 text-white rounded-2xl' onClick={() => navigate(`/report/${loc.id}`)}>Open</button>
                            </Popup>
                        </Marker>
                    ))}
                    <SetViewOnClick animateRef={true} />
                </MapContainer>}

                <ul className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {allWardReports.map((report) => (
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
                                        <Link className="mt-2 py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" to={`/report/${report.id}`}>
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

            </div>
        </div>
    )
}

export default WardReports