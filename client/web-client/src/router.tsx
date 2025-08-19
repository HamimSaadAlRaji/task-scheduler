import { createBrowserRouter } from "react-router";
import App from "@/App";
import TaskPage from "@/pages/tasks-page";
import HomePage from "@/pages/home-page";
import CalendarPage from "@/pages/calendar-page";

export const appRouter = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "/tasks",
                element: <TaskPage />,
            },
            {
                path: "/calendar",
                element: <CalendarPage />,
            },
        ],
    },
]);
