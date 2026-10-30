import { ArrowRightSquareIcon, ArrowUpRight, Clock, LucideLayersPlus } from "lucide-react";
import Navbar from "../../components/Navbar";
import type { Route } from "./+types/home";
import Button from "../../components/ui/Button";
import Upload from "../../components/Upload";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="home">
      {/* Navigation Bar */}
      <Navbar />

      {/* Hero section */}
      <section className="hero">
        <div className="announce">
          <div className="dot">
            <div className="pulse"></div>
          </div>
          <p>Introducing Sketch-Builder</p>
        </div>

        <h1>Build Your Dream floor with Sketchy</h1>
        <p className="subtitle">
          Sketchy is an AI-powered design environment that makes it easy to
          visualize, render and ship architectural projects faster than ever
          before.
        </p>

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

            <Upload onComplete={(base64Data) => console.log("Upload Complete", base64Data)} />
          </div>
        </div>
      </section>

      <section className="projects">
        <div className="section-inner">
          <div className="section-head">
            <div className="copy">
              <h2>Projects</h2>
              <p>
                Your latest work and shared community projects, all in one
                place.
              </p>
            </div>
          </div>

          <div className="projects-grid">
            <div className="project-card group">
              <div className="preview">
                <img
                  src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&ixid=M3w5MTMyMXwwfDF8c2VhcmNofDJ8fGZsb29yJTIwcGxhbnxlbnwwfHx8fDE2OTQ1NjYxNzR8MA&auto=format&fit=crop&w=800&q=60"
                  alt="Project"
                />
                <div className="badge">
                  <span>Community</span>
                </div>
              </div>

              <div className="card-body">
                <div>
                  <h3>Project Main</h3>

                  <div className="meta">
                    <Clock size={12} />
                    <span>{new Date("2023-10-01").toLocaleDateString()}</span>
                    <span>By Community</span>
                  </div>
                </div>

                <div className="arrow">
                  <ArrowUpRight size={12} />
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
