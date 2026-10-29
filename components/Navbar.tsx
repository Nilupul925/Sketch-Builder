import { Box } from "lucide-react";
import Button from "./ui/Button";
import { useOutletContext } from "react-router";

//Navbar function build using "rafce"
const Navbar = () => {
  const { isSignedIn, userName, signOut, signIn } =
    useOutletContext<AuthContext>();

  const handleAuthClick = async () => {
    if (isSignedIn) {
      try {
        await signOut();
      } catch (e) {
        console.error(`Puter signing out failed:", ${e}`);
      }
    }

    try {
      await signIn();
    } catch (e) {
      console.error(`Puter signing in failed:", ${e}`);
    }
    
  };

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

        {/* User actions */}
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
