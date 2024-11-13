import React, { useState, useEffect } from 'react';
import ProjectNames from './ProjectNames';
import { Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Projects = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectId, setNewProjectId] = useState('');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://localhost:5000/get_project_info');
            if (response.status === 200 && response.data.projects) {
                setProjects(response.data.projects);
            } else {
                setProjects([]); // Set to an empty array if there's no project data
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
            setProjects([]); // Set to empty if there's an error fetching projects
        }
    };

    const addProject = async () => {
        if (newProjectName.trim() === '' || newProjectId.trim() === '') {
            alert('Please enter both a project name and project ID.');
            return;
        }

        // Retrieve the user ID from session storage
        const userId = sessionStorage.getItem('userId');

        if (!userId) {
            alert('User not logged in');
            return;
        }

        try {
            // Step 1: Create the project in the projects database
            const projectResponse = await axios.post('http://localhost:5000/create_project', {
                userId: userId,
                projectName: newProjectName,
                projectId: newProjectId,
            });

            if (projectResponse.status === 200) {
                alert('Project created successfully.');

                // Step 2: Update the user's project access in the users database
                const userResponse = await axios.post('http://localhost:5000/join', {
                    userId: userId,
                    projectId: newProjectId,
                    
                });

                if (userResponse.status === 200) {
                    alert('User access updated successfully.');
                    setNewProjectName('');
                    setNewProjectId('');
                    fetchProjects(); // Refresh project list on page
                } else {
                    alert(userResponse.data.message);
                }
            }
        } catch (error) {
            console.error('Error adding project:', error);
            alert('Failed to create project or update user access. Please try again.');
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('userId'); // Clear userId from session storage on logout
        navigate('/');
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
                    maxHeight: '300px',
                    overflowY: 'auto',
                }}
            >
                {projects.length > 0 ? (
                    projects.map((project) => (
                        <ProjectNames key={project.projectId} projectName={project.projectName} isJoined={false} />
                    ))
                ) : (
                    <p>No projects available.</p>
                )}
            </div>

            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <TextField
                    label="New Project Name"
                    variant="outlined"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="New Project ID"
                    variant="outlined"
                    value={newProjectId}
                    onChange={(e) => setNewProjectId(e.target.value)}
                    fullWidth
                />
                <Button variant="contained" onClick={addProject} color="primary">
                    Add Project
                </Button>
            </div>

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
