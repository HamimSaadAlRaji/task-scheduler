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

