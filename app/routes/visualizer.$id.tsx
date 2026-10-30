import type { Route } from "./+types/visualizer.$id";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Visualizer | Sketchy" },
    { name: "description", content: "AI-generated 3D architectural visualization" },
  ];
}

const visualizerId = ({ params }: Route.ComponentProps) => {
  return (
    <div className="visualizer-route loading">
      <p>Loading sketch {params.id}...</p>
    </div>
  );
};

export default visualizerId;
