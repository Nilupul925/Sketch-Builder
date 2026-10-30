import {
  ArrowRightSquareIcon,
  ArrowUpRight,
  Clock,
  LucideLayersPlus,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import type { Route } from "./+types/home";
import Button from "../../components/ui/Button";
import Upload from "../../components/Upload";
import { useNavigate } from "react-router";
import { useState } from "react";
import { createProject } from "../../lib/puter.action";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<DesignItem[]>([]);

  const handleUploadComplete = async (base64Data: string) => {
    const newId = Date.now().toString(); // Generate a unique ID for the uploaded sketch
    const name = `Residence ${newId}`; // Generate a name for the uploaded sketch

    const newItem = {
      id: newId,
      name,
      sourceImage: base64Data,
      renderedImage: undefined,
      timestamp: Date.now(),
    };

    const saved = await createProject({ item: newItem, visibility: "private" });

    if (!saved) {
      console.error("Failed to save project");
      return false;
    }

    setProjects((prev) => [newItem, ...prev]); // Update the projects state with the new item
    // Navigate to the visualizer page with the uploaded sketch ID
    navigate(`/visualizer/${newId}`, {
      state: {
        initialImage: saved.sourceImage,
        renderedImage: saved.renderedImage || null,
        name,
      },
    });
    return true;
  };

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
              <p>Supports JPG, PNG formats up to 50MB</p>
            </div>

            <Upload onComplete={handleUploadComplete} />
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
            {projects.map(
              ({ id, name, renderedImage, sourceImage, timestamp }) => (
                <div className="project-card group">
                  <div className="preview">
                    <img
                      src={renderedImage || sourceImage}
                    />
                    <div className="badge">
                      <span>Community</span>
                    </div>
                  </div>

                  <div className="card-body">
                    <div>
                      <h3>{name}</h3>

                      <div className="meta">
                        <Clock size={12} />
                        <span>
                          {new Date( timestamp ).toLocaleDateString()}
                        </span>
                        <span>By Community</span>
                      </div>
                    </div>

                    <div className="arrow">
                      <ArrowUpRight size={12} />
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
