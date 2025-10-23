import LoginField from "./LoginField"

function LoginSection({ inputs }) {
  return (
    <div className="w-full h-full">
        <h2 className="w-full h-1/12 text-center text-2xl font-bold my-4">Login</h2>
        <form className="flex w-full flex-col gap-4 p-4">
            {inputs.map((input, index) => (
                <LoginField key={index} {...input} />
            ))}
        </form>
    </div>
  )
}

export default LoginSection