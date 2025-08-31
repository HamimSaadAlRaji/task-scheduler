import { RouterProvider } from "react-router";
import { appRouter } from "./router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={appRouter} />
        </QueryClientProvider>
    );
}

export default App;
