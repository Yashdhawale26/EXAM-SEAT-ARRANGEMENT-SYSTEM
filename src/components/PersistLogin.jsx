import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useRefreshToken from "../hooks/useRefreshToken";
import { ThreeCircles } from "react-loader-spinner";

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                if (!auth?.accessToken) {
                    await refresh();
                }
            } catch (err) {
                console.error(err);
                setError("Failed to refresh token");
            } finally {
                setIsLoading(false);
            }
        };

        verifyRefreshToken();
    }, [auth?.accessToken, refresh]); // Ensure auth?.accessToken is included

    useEffect(() => {
        console.log(`isLoading: ${isLoading}`);
        console.log(`aT: ${JSON.stringify(auth?.accessToken)}`);
    }, [auth?.accessToken, isLoading]);

    return (
        <>
            {isLoading ? (
                <div className="h-screen flex items-center justify-center">
                    <ThreeCircles height="65" width="65" color="#23ca85" />
                </div>
            ) : error ? (
                <div className="h-screen flex items-center justify-center">
                    <p className="text-red-500">{error}</p>
                </div>
            ) : (
                <Outlet />
            )}
        </>
    );
};

export default PersistLogin;
