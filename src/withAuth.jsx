import { Navigate } from "react-router";

const withAuth = (Component) => {
    const AuthRoute = () => {
        const isAuth = !!localStorage.getItem("usuario");
        if (isAuth){
            return <Component/>
        } else {
            return <Navigate to="/login"/>
        }
    }
    return AuthRoute;
}

export default withAuth;