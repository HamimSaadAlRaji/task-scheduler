import { createBrowserRouter } from "react-router";
import App from "@/App";
import TasksPage from "@/pages/tasks-page";
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
                element: <TasksPage />,
            },
            {
                path: "/calendar",
                element: <CalendarPage />,
            },
        ],
    },
]);
