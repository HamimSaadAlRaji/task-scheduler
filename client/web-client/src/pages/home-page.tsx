import { useEffect, useState, useContext } from "react";
import { axiosInstance } from "@/lib/utils";
import { AuthContext } from "@/components/auth-context";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";

export default function HomePage() {

    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        async function fetchStats() {
            if (!user?._id) return;
            const resp = await axiosInstance.get(`/users/${user._id}/stats`);
            setStats(resp.data);
        }
        fetchStats();
    }, [user]);

    function downloadPDF() {
        if (!stats) return;
        const doc = new jsPDF();
        doc.text("User Statistics (Last 30 Days)", 10, 10);
        doc.text(`Total Tasks: ${stats.totalTasks}`, 10, 20);
        doc.text(`Completed Tasks: ${stats.completedTasks}`, 10, 30);
        doc.text(`Pending Tasks: ${stats.pendingTasks}`, 10, 40);
        doc.text(`Overdue Tasks: ${stats.overdueTasks}`, 10, 50);
        doc.text(`Tasks by Priority:`, 10, 60);
        doc.text(`  High: ${stats.tasksByPriority.high}`, 15, 70);
        doc.text(`  Medium: ${stats.tasksByPriority.medium}`, 15, 80);
        doc.text(`  Low: ${stats.tasksByPriority.low}`, 15, 90);
        doc.text(`Total Events: ${stats.totalEvents}`, 10, 100);
        doc.text(`Events in Last 30 Days: ${stats.eventsLast30Days}`, 10, 110);
        doc.save("user-stats.pdf");
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Home Page</h1>
            <p>Welcome to the home page!</p>
            {console.log(stats)}
            {stats && (
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-2">Your Statistics</h2>
                    <ul>
                        <li>Total Tasks: {stats.totalTasks}</li>
                        <li>Completed Tasks: {stats.completedTasks}</li>
                        <li>Pending Tasks: {stats.pendingTasks}</li>
                        <li>Overdue Tasks: {stats.overdueTasks}</li>
                        <li>
                            Tasks by Priority:
                            <ul className="ml-4">
                                <li>High: {stats.tasksByPriority.high}</li>
                                <li>Medium: {stats.tasksByPriority.medium}</li>
                                <li>Low: {stats.tasksByPriority.low}</li>
                            </ul>
                        </li>
                        <li>Total Events: {stats.totalEvents}</li>
                        <li>Events in Last 30 Days: {stats.eventsLast30Days}</li>
                    </ul>
                    <Button className="mt-4" onClick={downloadPDF}>
                        Download PDF (Last 30 Days)
                    </Button>
                </div>
            )}
        </div>
    );
}
