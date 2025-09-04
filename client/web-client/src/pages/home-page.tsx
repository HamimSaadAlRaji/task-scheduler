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
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Home Page</h1>
            <p>Welcome to the home page!</p>
        </div>
    );
}
