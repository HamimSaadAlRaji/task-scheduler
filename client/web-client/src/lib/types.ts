export interface Task {
    _id: string;
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    status: "todo" | "in-progress" | "completed";
    dueDate: Date;
}
