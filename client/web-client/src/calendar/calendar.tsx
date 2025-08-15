interface Event {
    id: string;
    title: string;
    description: string;
    date: Date;
    time: string;
    duration: number;
    type: 'meeting' | 'focus' | 'break' | 'personal';
    location?: string;
    attendees?: string[];
    aiSuggested?: boolean;
}

const Calendar = () => {
    return (
        <>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Calendar & Scheduling</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage your schedule and optimize your time
                    </p>
                </div>
            </div>
        </>
    )
}

export default Calendar