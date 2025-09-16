import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router'

import reportService from "../../supabase/table"

function WardRanking() {
    const [wardReports, setWardReports] = useState([]);
    const { state, city } = useParams();


    const wardData = Object.values(
        wardReports.reduce((acc, report) => {
            const ward = report.lgd_ward_code;
            if (!acc[ward]) {
                acc[ward] = { name: ward, resolved: 0, pending: 0, inProgress: 0 };
            }

            switch (report.status) {
                case 'Completed':
                    acc[ward].resolved += 1;
                    break;
                case 'Pending':
                    acc[ward].pending += 1;
                    break;
                case 'In Progress':
                    acc[ward].inProgress += 1;
                    break;
                default:
                    break;
            }

            return acc;
        }, {})
    );

    useEffect(() => {
        const fetchReports = async () => {
            const res = await reportService.getReportsByStateCity(state, city);
            if (res.status === 'success') {
                setWardReports(res.data);
            } else {
                console.log('Error fetching reports: ' + res.msg);
            }
        };

        fetchReports();
    }, [state, city]);


    function calculateScore(resolved, pending, inProgress) {
        const total = resolved + pending + inProgress;
        if (total === 0) return 0;

        // Score calculation: prioritize resolution rate and penalize pending complaints
        const resolutionRate = (resolved / total) * 100;
        const pendingPenalty = (pending / total) * 20; // Pending complaints are worse than in-progress
        const inProgressPenalty = (inProgress / total) * 10;

        const score = Math.max(0, Math.round(resolutionRate - pendingPenalty - inProgressPenalty));
        return Math.min(100, score);
    }

    const rankedWard = wardData
        .map(ward => ({
            ...ward,
            score: calculateScore(ward.resolved, ward.pending, ward.inProgress)
        }))
        .sort((a, b) => b.score - a.score)
        .map((lgd_ward_code, index) => ({
            ...lgd_ward_code,
            rank: index + 1
        }));

    return (
        <div>
            <h1 className="text-4xl dark:text-white">Ward Ranking of {city}, {state}</h1>
            <p className='mt-2 mb-10 text-gray-700'>Ward ranked by complaint resolution performance. Scores are calculated based on resolved, in-progress, and pending complaints.</p>

            <div className=" flex flex-col gap-4">
                {rankedWard.map((ward) => (
                    <div className='' key={ward.name}>
                        <div className='p-4 border border-gray-200 dark:border-gray-700 rounded-2xl' >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 bg-gray-100 rounded-2xl border border-gray-300 dark:border-gray-600`}>
                                        #{ward.rank}
                                    </span>
                                    <h3 className="text-foreground">Ward No. {ward.name}</h3>
                                </div>
                                <div className={`text-right`}>
                                    <div className="text-2xl">{ward.score}</div>
                                    <div className="text-sm text-muted-foreground">Score</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl text-green-600">{ward.resolved}</div>
                                    <div className="text-sm text-muted-foreground">Resolved</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl text-blue-600">{ward.inProgress}</div>
                                    <div className="text-sm text-muted-foreground">In Progress</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl text-red-600">{ward.pending}</div>
                                    <div className="text-sm text-muted-foreground">Pending</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl text-foreground">{ward.resolved + ward.pending + ward.inProgress > 0 ? Math.round((ward.resolved / (ward.resolved + ward.pending + ward.inProgress)) * 100) : 0}%</div>
                                    <div className="text-sm text-muted-foreground">Resolved Rate</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default WardRanking