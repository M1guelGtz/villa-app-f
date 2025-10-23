import { Link } from "react-router-dom"

function LandingPage() {
  return (
    <div>
        <Link to="/login" >LOGIN </Link>
        <Link to="/register" >REGISTER </Link>
    </div>
  )
}

export default LandingPage