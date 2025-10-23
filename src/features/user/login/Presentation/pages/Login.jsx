import { useState } from "react";
import { Link } from "react-router-dom";
import LoginSection from "../components/LoginSection";
import { useLoginViewModel } from "../viewModels/LoginViewModel";

function Login() {
    const { inputs } = useLoginViewModel();
    const [Input, setInput] = useState({})
  return (
        <div className="w-full h-full flex gap-5  justify-evenly p-10">
            <div  className="pl-10 login-section p-2 box-border" > <Link to="/" className="test"> Regresar</Link> </div>
            <div className="max-w-[400px] w-1/3 min-w-[280px] border ">
                <LoginSection inputs={inputs} />
            </div>
            <div className="login-section ">

            </div>
        </div>
    )
}

export default Login