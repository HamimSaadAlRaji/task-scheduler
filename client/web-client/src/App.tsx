import { RouterProvider } from "react-router";
import { appRouter } from "./router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "@/components/auth-context";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <RouterProvider router={appRouter} />
                <Toaster richColors />
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default App;
