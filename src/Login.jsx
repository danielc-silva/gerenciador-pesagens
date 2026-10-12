import { useState } from "react";
import { useNavigate } from "react-router";

const Login = () => {
    const [usuario, setUsuario] = useState("");
    const navigate = useNavigate();
    const isAuth = !!localStorage.getItem("usuario");

    return (
        <>
            {
                !isAuth ? (
                    <>
                    Digite seu nome de usuario: 
                    <input onChange={e => setUsuario(e.target.value)} value={usuario}/>
                    <button onClick={()=>{
                        localStorage.setItem("usuario", usuario);
                        navigate('/privado');
                    }}>Login</button>
                    </>
                ): 
                (
                    <> 
                        <button onClick={()=> {
                            localStorage.removeItem("usuario");
                            navigate('/');
                        }}>Logout</button>
                    </>
                )
            }
        </>
    )
}

export default Login;