import { createBrowserRouter } from "react-router";
import Dashboard from "@/components/dashboard";
import TasksPage from "@/pages/tasks-page";
import HomePage from "@/pages/home-page";
import CalendarPage from "@/pages/calendar-page";
import EventsPage from "@/pages/events-page";
import LoginPage from "@/pages/login-page";
import SignUpPage from "@/pages/signup-page";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
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
        path: "/events",
        element: <EventsPage />,
      },
      {
        path: "/calendar",
        element: <CalendarPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
]);
