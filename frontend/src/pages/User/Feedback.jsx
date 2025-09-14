import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import reportService from "../../supabase/table";

export default function App() {
    const navigate = useNavigate();
    const { slug } = useParams();
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const getAllReportsNow = async () => {
        const allReports = await reportService.getAllReports();
        console.log(allReports);
    }
    getAllReportsNow()

    const feedbackOptions = [
        { id: 'sad', emoji: '😢', label: 'Sad' },
        { id: 'neutral', emoji: '😐', label: 'Neutral' },
        { id: 'happy', emoji: '😊', label: 'Happy' }
    ];

    const handleFeedbackSelect = (feedbackId) => {
        setSelectedFeedback(feedbackId);
        console.log('Selected feedback:', feedbackId)
    };

    const handleSubmit = async () => {
        if (selectedFeedback) {
            console.log('Feedback submitted:', selectedFeedback);
            const response = await reportService.userFeedback(slug, selectedFeedback);

            if (response.status === 'success') {
                setIsSubmitted(true);
            } else {
                console.log('Error submitting feedback: ' + response.msg);
            }
        }
    };

    if (isSubmitted) {
        return (
            <div className="flex items-center justify-center bg-background p-4">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="space-y-4">
                        <div className="text-6xl">🎉</div>
                        <h2 className="text-primary">Thank you for your feedback!</h2>
                        <p className="text-muted-foreground">
                            Your opinion helps us improve our service.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center bg-background p-4">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="space-y-2">
                    <h1 className="text-4xl dark:text-white">How was your experience?</h1>
                    <p className="text-gray-600">
                        Please share your feedback by selecting one of the options below
                    </p>
                </div>

                <div className="flex justify-center gap-6">
                    {feedbackOptions.map((option) => (
                        <button className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-gray-200 transition-all duration-200 hover:border-gray-400 hover:shadow-2xl hover:scale-105 ${selectedFeedback === option.id ? 'border-gray-600 bg-primary/5 shadow-lg' : 'border-border hover:border-primary/50'}`}
                            key={option.id}
                            onClick={() => handleFeedbackSelect(option.id)}>
                            <div className="text-6xl">{option.emoji}</div>
                            <span className={`${selectedFeedback === option.id ? 'text-primary' : 'text-muted-foreground'}`}>
                                {option.label}
                            </span>
                        </button>
                    ))}
                </div>

                {selectedFeedback && (
                    <div className="space-y-4">
                        <div className="p-4 bg-accent rounded-lg">
                            <p className="text-accent-foreground">
                                You selected: <span className="capitalize">{selectedFeedback}</span>
                            </p>
                        </div>

                        <button onClick={handleSubmit} type="button" className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                            Send Feedback
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}