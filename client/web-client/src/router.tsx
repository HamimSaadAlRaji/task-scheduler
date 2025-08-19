import { createBrowserRouter } from "react-router";
import App from "@/App";
import TaskPage from "@/pages/tasks-page";

export const appRouter = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <h1>Dashboard</h1>,
            },
            {
                path: "/tasks",
                element: <TaskPage />,
            },
        ],
    },
]);
