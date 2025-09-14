import { useNavigate, useParams, Link } from "react-router";
import { useEffect, useState } from "react";
import { User, Calendar, MapPin, Map, Phone, BadgeAlert } from 'lucide-react';
import { useSelector } from "react-redux";

import reportService from "../supabase/table"
import storageService from "../supabase/storage";

function Report() {
    const navigate = useNavigate();
    const ai_or_not_api_key = import.meta.env.VITE_AIORNOT_API_KEY;
    const user = useSelector(state => state.auth.userData);
    const { slug } = useParams();

    const [data, setData] = useState(null);
    const [date, setDate] = useState(null);

    const [workDoneLoading, setWorkDoneLoading] = useState(false);
    const [workDoneFile, setWorkDoneFile] = useState(null);
    const [issue, setIssue] = useState('');

    const [workDoneBtnText, setWorkDoneBtnText] = useState('Work Done');

    const [modalOpen, setModalOpen] = useState(false);  // work done model pop up
    const [issueModalOpen, setIssueModalOpen] = useState(false);  // issue model pop up

    useEffect(() => {
        const fetchReport = async () => {
            const res = await reportService.getReportById(slug);

            if (res.status === 'success') {
                setData(res.data);
                // console.log("data: ", res.data);
                // console.log("user: ", user);
                setDate(new Date(res.data.created_at).toLocaleDateString());
            } else {
                console.log('Error fetching report: ' + res.msg);
                navigate('/');
            }
        };

        fetchReport();
    }, []);

    const handleMap = () => {
        const lat = data?.lat;
        const lon = data?.lng;
        const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
        window.open(url, '_blank');
    }

    const handleWorkDoneModelOpen = async () => {
        setModalOpen(true);

    }

    const handleDelete = async (reportId) => {

        const res = await reportService.deleteReport(reportId);

        if (res.status === 'success') {
            navigate('/');
        } else {
            console.log('Error deleting report: ' + res.msg);
        }
    };

    const handleWorkDone = async () => {
        console.log('user id: ', user.id)
        setWorkDoneBtnText('Uploading...');
        setWorkDoneLoading(true);

        // No file selected
        if (!workDoneFile) {
            console.error('No file selected');
            setWorkDoneLoading(false);
            return;
        }

        // Check image is ai generated or not
        setWorkDoneBtnText('Analyzing Image...');

        const formData = new FormData();
        formData.append("image", workDoneFile);

        try {
            const response = await fetch("https://api.aiornot.com/v2/image/sync", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${ai_or_not_api_key}`,
                },
                body: formData,
            });

            if (!response.ok) {
                setWorkDoneLoading(false);
                throw new Error(`Failed: ${response.status} ${await response.text()}`);
            }

            const responseData = await response.json();

            if (responseData.report.ai_generated.verdict === "ai") {
                alert("⚠️ The image is detected as AI-generated. Please upload a human-captured image.");
                setWorkDoneBtnText('Send');
                return;

            } else if (responseData.report.ai_generated.verdict === "human") {
                setWorkDoneBtnText('Uploading Image...');

            } else {
                alert("⚠️ Unable to determine if the image is AI-generated.");
                setWorkDoneBtnText('Send');
                return;
            }
            setWorkDoneLoading(false);
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong. Check the console.");
            setWorkDoneLoading(false);
            setWorkDoneBtnText('Send');
            return;
        }

        // Upload image to Supabase Storage
        const uploadRes = await storageService.uploadImage(workDoneFile);

        if (uploadRes.status === 'success') {
            const imageUrl = uploadRes.data.path;

            // Get public URL of the uploaded image
            const publicImageUrl = storageService.getImageUrl(imageUrl).data;

            // Update report with the public URL
            const updateRes = await reportService.updateReport(data.id, { status: 'Completed', done_url: publicImageUrl });

            if (updateRes.status === 'success') {
                // Fetch officer id by auth id
                const userId = await reportService.getOfficerByAuthId(user.id)
                console.log('user id data: ', userId.data.id)

                // Updating officers table to Not Assigned
                const updateOfficer = await reportService.officerWorkDoneUpdate(userId.data.id);

                if (updateOfficer.status === 'success') {

                    navigate('/');
                }
                else {
                    alert('Error updating officer status: ' + updateOfficer.msg);
                }
            } else {
                console.log('Error updating report: ' + updateRes.msg);
            }
        } else {
            console.log('Error uploading image: ' + uploadRes.msg);
        }

        setWorkDoneLoading(false);
        setWorkDoneBtnText('Work Done');
    }

    const handleIssue = async () => {
        console.log('issue', issue);
        if (issue.length < 3) return;


        const updateRes = await reportService.updateReport(data.id, { status: 'Pending', issueText: issue });

        if (updateRes.status === 'success') {
            navigate('/');
        } else {
            console.log('Error updating report: ' + updateRes.msg);
        }
    }

    return (
        <div>
            <div className="flex gap-4 mb-4 items-center">
                <h1 className="text-4xl dark:text-white">Report</h1>
                <span className="text-base bg-gray-100 py-1 px-2 rounded-full border border-gray-200"># {data?.id}</span>
            </div>
            <div className="flex flex-wrap justify-between items-center mb-4 text-gray-500 dark:text-neutral-400">
                <p className="flex items-center"><User size={18} className="mr-1" /> {data?.createdByName}</p>
                <p className="flex items-center"><MapPin size={18} className="mr-1" /> {data?.city}, {data?.state}</p>
                <button onClick={() => handleMap()} className="flex items-center cursor-pointer"><Map size={18} className="mr-1" /> Open in Map</button>
                <p className="flex items-center"><Calendar size={18} className="mr-1" /> {date}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6 lg:p-8 dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
                <img src={data?.image} className="w-full h-full mx-auto md:w-60 lg:w-80 object-contain rounded-lg max-w-screen-md max-h-screen" alt="description" />
            </div>
            <div className="mt-4">
                {data?.status === 'Pending' && <div className="inline-flex bg-red-100 py-1 px-3 rounded-full items-center">
                    <span className="size-2 inline-block bg-red-500 rounded-full me-2"></span>
                    <span className="text-gray-600 dark:text-neutral-400">Pending</span>
                </div>}
                {data?.status === 'In Progress' && <div className="inline-flex bg-yellow-100 py-1 px-3 rounded-full items-center">
                    <span className="size-2 inline-block bg-yellow-500 rounded-full me-2"></span>
                    <span className="text-gray-600 dark:text-neutral-400">In Progress</span>
                </div>}
                {data?.status === 'Completed' && <div className="inline-flex  bg-green-100 py-1 px-3 rounded-full items-center">
                    <span className="size-2 inline-block bg-green-500 rounded-full me-2"></span>
                    <span className="text-gray-600 dark:text-neutral-400">Completed</span>
                </div>}

            </div>
            <h3 className="text-2xl mt-4 dark:text-white">Description</h3>
            <p className="my-4 dark:text-white">{data?.description}</p>

            {/* Delete btn */}
            {(user?.id === data?.createdById && data?.status !== 'Completed') && < div className="flex gap-4">
                <button type="button" onClick={() => handleDelete(data.id)} className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-red-100 text-red-800 hover:bg-red-200 focus:outline-hidden focus:bg-red-200 disabled:opacity-50 disabled:pointer-events-none dark:text-red-500 dark:bg-red-800/30 dark:hover:bg-red-800/20 dark:focus:bg-red-800/20">
                    Delete
                </button>
            </div >}

            {/* Feedback btn */}
            {(user?.id === data?.createdById && data?.status === 'Completed' && !data?.user_feedback) && < div className="flex gap-4">
                <Link className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-sky-100 text-sky-800 hover:bg-sky-200 focus:outline-hidden focus:bg-sky-200 disabled:opacity-50 disabled:pointer-events-none dark:text-sky-500 dark:bg-sky-800/30 dark:hover:bg-sky-800/20 dark:focus:bg-sky-800/20" to={`/feedback/${data.id}`}>Give Feedback</Link>
            </div >}

            {/* Assigned To / Work Done By */}
            {data?.assignedToId && < div className="flex gap-4">
                <div className="shrink-0 mt-10 bg-gray-50 border border-gray-200 rounded-xl p-4 w-full group block">
                    {(data?.status === 'In Progress' || data?.status === 'Pending') && <p className="text-md mb-2 dark:text-white">Assigned To</p>}
                    {data?.status === 'Completed' && <div className=" mb-2 flex items-center">
                        <span className="size-2 inline-block bg-green-500 rounded-full me-2"></span>
                        <p className="text-md dark:text-white">Work Done By</p>
                    </div>}



                    <hr className="text-gray-300 mb-2" />
                    <div className="flex items-center justify-between">

                        <div className="flex items-center">
                            <span className="inline-block size-15.5 bg-gray-100 rounded-full overflow-hidden">
                                <svg className="size-full text-gray-300" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="0.62854" y="0.359985" width="15" height="15" rx="7.5" fill="white"></rect>
                                    <path d="M8.12421 7.20374C9.21151 7.20374 10.093 6.32229 10.093 5.23499C10.093 4.14767 9.21151 3.26624 8.12421 3.26624C7.0369 3.26624 6.15546 4.14767 6.15546 5.23499C6.15546 6.32229 7.0369 7.20374 8.12421 7.20374Z" fill="currentColor"></path>
                                    <path d="M11.818 10.5975C10.2992 12.6412 7.42106 13.0631 5.37731 11.5537C5.01171 11.2818 4.69296 10.9631 4.42107 10.5975C4.28982 10.4006 4.27107 10.1475 4.37419 9.94123L4.51482 9.65059C4.84296 8.95684 5.53671 8.51624 6.30546 8.51624H9.95231C10.7023 8.51624 11.3867 8.94749 11.7242 9.62249L11.8742 9.93184C11.968 10.1475 11.9586 10.4006 11.818 10.5975Z" fill="currentColor"></path>
                                </svg>
                            </span>
                            <div className="ms-3 flex flex-col items-center">
                                <h2 className="font-semibold text-lg text-gray-800 dark:text-white">{data?.assignedToName}</h2>
                                <p className="flex mt-1 items-center text-sm font-medium text-gray-400 dark:text-neutral-500"><Phone size={16} className="mr-1" />{data?.assignedToPhone.slice(0, 10)}</p>
                            </div>
                        </div>

                        {(data?.status === 'In Progress' && user?.phone === '91' + data?.assignedToPhone) && <div className="flex gap-2">
                            <button onClick={() => setIssueModalOpen(true)} type="button" className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-red-500 text-red-500 hover:border-red-400 hover:text-red-400 focus:outline-hidden focus:border-red-400 focus:text-red-400 disabled:opacity-50 disabled:pointer-events-none">
                                Remark
                            </button>
                            <div>
                                <button onClick={() => handleWorkDoneModelOpen()} type="button" className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                                    Work Done
                                </button>
                            </div>
                        </div>}

                        {/* Work done Model pop up */}
                        <div id="hs-basic-modal" className={`bg-gray-700/50 hs-overlay hs-overlay-open:opacity-100 hs-overlay-open:duration-500 size-full fixed top-0 start-0 z-80 ${modalOpen ? '' : 'hidden'} overflow-x-hidden transition-all overflow-y-auto pointer-events-none`} role="dialog" tabIndex="0" aria-labelledby="hs-basic-modal-label">
                            <div className="sm:max-w-lg sm:w-full m-3 sm:mx-auto">
                                <div className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70">
                                    <div className="flex justify-between items-center py-3 px-4 border-b border-gray-200 dark:border-neutral-700">
                                        <h3 id="hs-basic-modal-label" className="font-bold text-gray-800 dark:text-white">
                                            Work Done Report
                                        </h3>
                                    </div>
                                    <div className="p-4 overflow-y-auto">
                                        <div className="max-w-sm">
                                            <p className="text-sm mb-2 text-gray-700">The problem has been solved. Upload the work done image below</p>
                                            <label className="block z-20">
                                                <span className="sr-only">Upload Image</span>
                                                <input type="file" className="block w-full text-sm text-gray-500 file:me-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:disabled:opacity-50 file:disabled:pointer-events-none dark:text-neutral-500 dark:file:bg-blue-500 dark:hover:file:bg-blue-400" onChange={(e) => {
                                                    setWorkDoneFile(e.target.files[0])
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                }} />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t border-gray-200 dark:border-neutral-700">
                                        <button onClick={() => { setModalOpen(false) }} type="button" className={`py-2 px-3 inline-flex items-center ${workDoneLoading ? 'opacity-50 cursor-not-allowed' : ''} gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700`} data-hs-overlay="#hs-basic-modal" disabled={workDoneLoading}>
                                            Close
                                        </button>
                                        <button onClick={() => handleWorkDone()} type="button" className={`py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none ${workDoneLoading ? 'cursor-not-allowed' : ''}`} disabled={workDoneLoading}>
                                            {workDoneBtnText}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Issuse Model pop up */}
                        <div id="hs-basic-modal" className={`hs-overlay hs-overlay-open:opacity-100 hs-overlay-open:duration-500 size-full fixed top-0 start-0 z-80 ${issueModalOpen ? '' : 'hidden'} overflow-x-hidden transition-all overflow-y-auto pointer-events-none`} role="dialog" tabIndex="-1" aria-labelledby="hs-basic-modal-label">
                            <div className="sm:max-w-lg sm:w-full m-3 sm:mx-auto">
                                <div className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70">
                                    <div className="flex justify-between items-center py-3 px-4 border-b border-gray-200 dark:border-neutral-700">
                                        <h3 id="hs-basic-modal-label" className="font-bold text-gray-800 dark:text-white">
                                            Having Issue
                                        </h3>
                                    </div>
                                    <div className="p-4 overflow-y-auto">
                                        <div className="w-full">
                                            <p className="text-sm mb-2 text-gray-700">Having issue while solving it</p>
                                            <label className="">
                                                <span className="sr-only">Upload Image</span>
                                                <div className="w-full space-y-3">
                                                    <textarea className="py-2 px-3 sm:py-3 sm:px-4 block w-full border border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" rows="3" placeholder="Briefly describe why it can't solved" onChange={(e) => setIssue(e.target.value)}></textarea>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t border-gray-200 dark:border-neutral-700">
                                        <button onClick={() => { setIssueModalOpen(false) }} type="button" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" data-hs-overlay="#hs-basic-modal">
                                            Close
                                        </button>
                                        <button onClick={() => handleIssue()} type="button" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                                            Send
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    {(data?.issueText && data?.status === 'Pending') && <div className="flex mt-5 gap-5 ml-2">
                        <BadgeAlert size={45} color="red" />
                        <div>
                            <h4 className="text-xl dark:text-white">Officer Issue</h4>
                            <p className="mb-4 dark:text-white">{data?.issueText}</p>
                        </div>
                    </div>}

                    {data?.done_url && <div className="bg-white w-fit mt-5 border border-gray-200 rounded-2xl p-2 md:p-2 lg:p-3 dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
                        <img src={data?.done_url} className="w-full h-full md:w-60 lg:w-80 object-contain rounded-lg max-w-screen-md max-h-screen" alt="description" />
                    </div>}

                </div>
            </div >}

        </div>
    )
}

export default Report

