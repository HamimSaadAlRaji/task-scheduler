import { createContext, useState, type ReactNode } from "react";

export type AuthContextType = {
    isAuth: boolean;
    setIsAuth: (isAuth: boolean) => void;
    user: any;
    setUser: (user: any) => void;
};

export const AuthContext = createContext<AuthContextType>({
    isAuth: false,
    setIsAuth: () => {},
    user: null,
    setUser: () => {},
});

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuth, setIsAuth] = useState(() => {
        const storedValue = localStorage.getItem("isAuth");
        return storedValue === "true";
    });
    const [user, setUser] = useState(() => {
        const storedValue = localStorage.getItem("user");
        return storedValue ? JSON.parse(storedValue) : null;
    });

    return (
        <AuthContext.Provider value={{ isAuth, setIsAuth, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}
