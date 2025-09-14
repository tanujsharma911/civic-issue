import { useState, useEffect } from 'react'

import reportService from "../supabase/table"

function CityRanking() {
    const [reports, setReports] = useState([]);


    const cityData = Object.values(
        reports.reduce((acc, report) => {
            const city = report.city;
            if (!acc[city]) {
                acc[city] = { name: city, resolved: 0, pending: 0, inProgress: 0 };
            }

            switch (report.status) {
                case 'Completed':
                    acc[city].resolved += 1;
                    break;
                case 'Pending':
                    acc[city].pending += 1;
                    break;
                case 'In Progress':
                    acc[city].inProgress += 1;
                    break;
                default:
                    break;
            }

            return acc;
        }, {})
    );

    useEffect(() => {
        const fetchReports = async () => {
            const res = await reportService.getAllReports();

            if (res.status === 'success') {
                setReports(res.data);
            } else {
                console.log('Error fetching reports: ' + res.msg);
            }
        };
        console.log(cityData);

        fetchReports();
    }, []);

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

    const rankedCities = cityData
        .map(city => ({
            ...city,
            score: calculateScore(city.resolved, city.pending, city.inProgress)
        }))
        .sort((a, b) => b.score - a.score)
        .map((city, index) => ({
            ...city,
            rank: index + 1
        }));

    return (
        <div>
            <h1 className="text-4xl dark:text-white">City Ranking</h1>
            <p className='mt-2 mb-10 text-gray-700'>Cities ranked by complaint resolution performance. Scores are calculated based on resolved, in-progress, and pending complaints.</p>

            <div className="space-y-4">
                {rankedCities.map((city) => (
                    <div className='p-4 border border-gray-200 dark:border-gray-700 rounded-2xl' key={city.name}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 bg-gray-100 rounded-2xl border border-gray-300 dark:border-gray-600`}>
                                    #{city.rank}
                                </span>
                                <h3 className="text-foreground">{city.name}</h3>
                            </div>
                            <div className={`text-right`}>
                                <div className="text-2xl">{city.score}</div>
                                <div className="text-sm text-muted-foreground">Score</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl text-green-600">{city.resolved}</div>
                                <div className="text-sm text-muted-foreground">Resolved</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl text-blue-600">{city.inProgress}</div>
                                <div className="text-sm text-muted-foreground">In Progress</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl text-red-600">{city.pending}</div>
                                <div className="text-sm text-muted-foreground">Pending</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl text-foreground">{city.resolved + city.pending + city.inProgress > 0 ? Math.round((city.resolved / (city.resolved + city.pending + city.inProgress)) * 100) : 0}%</div>
                                <div className="text-sm text-muted-foreground">Resolved Rate</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CityRanking