import { ArrowRightSquareIcon, LucideLayersPlus } from "lucide-react";
import Navbar from "../../components/Navbar";
import type { Route } from "./+types/home";
import Button from "../../components/ui/Button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="home">
      <Navbar />
      <section className="hero">

        <div className="announce">
          <div className="dot">
            <div className="pulse"></div>
          </div>
          <p>Introducing Sketch-Builder</p>
        </div>

        <h1>Build Your Dream floor with Sketchy</h1>
        <p className="subtitle">Sketchy is an AI-powered design environment that makes it easy to visualize, render and ship architectural projects faster than ever before.</p>

        <div className="actions">
          <a href="#upload" className="cta">
            Start Building <ArrowRightSquareIcon className="icon" />
          </a>
          <Button variant="outline" size="lg" className="Demo">
            Watch Demo
          </Button>
        </div>

        <div id="upload" className="upload-shell">
          <div className="grid-overlay" />

          <div className="upload-card">
            <div className="upload-head">
              <div className="upload-icon">
                <LucideLayersPlus className="icon" />
              </div>

              <h3>Upload Your floor plan</h3>
              <p>Supports JPG, PNG formats up to 10MB</p>
            </div>

            <p>Upload images</p>
          </div>
        </div>
      </section>
    </div>
  );
}
