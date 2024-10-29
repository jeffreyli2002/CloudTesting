import React from 'react';
import ProjectNames from './ProjectNames';

const Projects = () => {
    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            <h1>Projects</h1>
            <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                <ProjectNames projectName="Project Name 1" isJoined={false} />
                <ProjectNames projectName="Project Name 2" isJoined={true} />
                <ProjectNames projectName="Project Name 3" isJoined={false} />
            </div>
        </div>
    );
};

export default Projects;
