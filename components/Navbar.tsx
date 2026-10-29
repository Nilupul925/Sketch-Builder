import { Box } from "lucide-react"

//Navbar function build using "rafce"
const Navbar = () => {

    const handleAuthClick = async () => {};

  return (
    <header className="navbar">
      <div className="inner">
        <div className="left">
          <div className="brand">

            <Box className="logo" />

            <span className="name">
                Sketchy
            </span>
          </div>
          <ul className="links">
            <a href="#">Product</a>
            <a href="#">Pricing</a>
            <a href="#">Community</a>
            <a href="#">Enterprise</a>
          </ul>
        </div>
        
        <div className="actions">
          <div className="greeting">Welcome, Guest!</div>
          <button onClick={handleAuthClick} className="login">Login</button>
          
          <a href="#upload" className="cta">Get Started</a>
        </div>
      </div>
    </header>
  )
}

export default Navbar