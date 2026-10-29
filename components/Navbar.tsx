import { Box } from "lucide-react";
import Button from "./ui/Button";

//Navbar function build using "rafce"
const Navbar = () => {
  const isSignedIn = false;
  const userName = "Guest";
  const handleAuthClick = async () => {};

  return (
    <header className="navbar">
      <div className="inner">
        <div className="left">
          <div className="brand">
            <Box className="logo" />

            <span className="name">Sketchy</span>
          </div>
          <ul className="links">
            <a href="#">Product</a>
            <a href="#">Pricing</a>
            <a href="#">Community</a>
            <a href="#">Enterprise</a>
          </ul>
        </div>

        <div className="actions">
          {isSignedIn ? (
            <>
              <span className="greeting">
                {userName ? `Welcome, ${userName}!` : "Signed in"}
              </span>

              <Button size="sm" onClick={handleAuthClick} className="btn">
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="ghost" onClick={handleAuthClick}>
                log in
              </Button>

              <a href="#upload" className="cta">
                Get Started
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
