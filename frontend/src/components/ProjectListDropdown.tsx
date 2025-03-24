/* prettier-ignore */
import { useState, useEffect } from 'react';

const ProjectListDropdown = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    // Fetch projects from API
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects'); // Replace with the actual API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setProjects(data);
      } catch (error: any) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 flex justify-center item-center w-full bg-white shadow-md z-40 border">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Projects</h2>
        <ul>
          {projects.map((project) => (
            <li key={project.id} className="py-2">
              <a href={`/project/${project.id}`}>{project.name}</a>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <a href="/" onClick={onClose} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block">
            + New Project
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectListDropdown;
