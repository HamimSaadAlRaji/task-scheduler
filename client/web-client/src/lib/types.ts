export interface Task {
  _id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "pending" | "completed";
  dueDate: Date;
  createdBy: {
    _id: string;
    username: string;
  };
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  createdBy: {
    _id: string;
    username: string;
  };
  tasks: Task[];
  location?: string;
  attendees?: string[];
  meetingLink?: string;
  notificationSent?: boolean;
  type?: "meeting" | "focus" | "break" | "personal";
}
