import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

export default function Protected({ children, authenticationRequired = true }) {
    const navigate = useNavigate();
    const [loader, setLoader] = useState(true);
    const authStatus = useSelector(state => state.auth.status);

    useEffect(() => {
        if (authStatus === null) return; // wait for authStatus to be determined

        if (authenticationRequired === true && authStatus === false) {
            navigate("/login")
            setLoader(false);
            return;
        }

        setLoader(false);
    }, [authStatus, navigate, authenticationRequired]);

    return loader ? <h1>Loading</h1> : <>{children}</>;
}
