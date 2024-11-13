import React, { useState, useEffect } from 'react';
import ProjectNames from './ProjectNames'; // Assuming this component exists
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Projects = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetchUserProjects();
    }, []);

    const fetchUserProjects = async () => {
        const userId = sessionStorage.getItem('userId'); // Assume the user is logged in and has a userId in session

        if (!userId) {
            alert('User not logged in');
            return;
        }

        try {
            const response = await axios.get(`http://localhost:5000/get_user_projects?userId=${userId}`);
            console.log('Fetched User Projects:', response.data);
            
            if (response.status === 200 && response.data.joiningPJ) {
                const fetchedProjects = response.data.joiningPJ.map((projectName) => ({
                    name: projectName,
                    isJoined: true,
                }));
                setProjects(fetchedProjects);
            } else {
                setProjects([]); // Set to an empty array if there's no project data
            }
        } catch (error) {
            console.error('Error fetching user projects:', error);
            setProjects([]); // Set to empty if there's an error fetching projects
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('userId'); // Clear userId from session storage on logout
        navigate('/'); // Redirect to home page or login page
    };

    const addProject = () => {
        const newProject = { name: `Project Name ${projects.length + 1}`, isJoined: false };
        setProjects([...projects, newProject]);
        console.log("Added project:", newProject);
        console.log("Updated projects list:", projects);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', position: 'relative', minHeight: '100vh' }}>
            <h1>Projects</h1>
            <div
                style={{
                    border: '1px solid #ddd',
                    padding: '20px',
                    borderRadius: '8px',
                    backgroundColor: '#f9f9f9',
                    maxHeight: '500px', // Increase this value to make the scrollable area bigger
                    overflowY: 'auto',   // Enable vertical scrolling
                }}
            >
                {projects.map((project, index) => (
                    <ProjectNames key={index} projectName={project.name} isJoined={project.isJoined} />
                ))}
            </div>
            <Button
                variant="contained"
                onClick={addProject}
                style={{ marginTop: '20px', width: '100%' }}
                color="primary"
            >
                Add Project
            </Button>
            <Button
                variant="contained"
                style={{
                    backgroundColor: 'red',
                    color: '#fff',
                    position: 'absolute',
                    bottom: '20px',
                    right: '20px',
                }}
                onClick={handleLogout}
            >
                Logout
            </Button>
        </div>
    );
};

export default Projects;
