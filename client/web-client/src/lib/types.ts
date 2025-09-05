export interface Task {
  _id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "pending" | "completed";
  dueDate: Date;
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
}
