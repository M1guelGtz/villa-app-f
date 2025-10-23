import { useState } from "react";

export function useLoginViewModel() {
    // Aquí puedes agregar la lógica del ViewModel
    const [inputs, setInputs] = useState(
        [{label: "Username / email", placeholder: "Enter your username or email", type: "text"},
        {label: "Password", placeholder: "Enter your password", type: "password"}]
    );
    return {inputs};
}