import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

// Define the LoginComponent as a functional component
const LoginComponent = () => {
    // Use the useNavigate hook from react-router-dom for navigation
    const navigate = useNavigate(); 
    
    // Initialize state for login credentials (username and password)
    const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' });

    // Handle changes in the input fields
    const handleLoginChange = (e) => {
        // Destructure name and value from the event target (input field)
        const { name, value } = e.target;
        // Update the state with the new value
        setLoginCredentials(prev => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleLoginSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        console.log('Login Attempted:', loginCredentials);
    
        // Send POST request to the backend to attempt login
        fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: loginCredentials.username,
                password: loginCredentials.password
            })
        })
        .then(response => response.json().then(data => ({ status: response.status, body: data })))
        .then(res => {
            if (res.status === 200) {
                // If login is successful, store userId in session storage
                sessionStorage.setItem('userId', loginCredentials.username);
                console.log(res.body.message);
                // Navigate to the projects page
                navigate('/projects');
            } else {
                // If login fails, alert the user with the error message
                alert(res.body.message);
            }
        })
        .catch(error => {
            // Handle any errors that occur during the login process
            console.error('Error during login:', error);
            alert('An error occurred during login.');
        });
    };
    
    // Handle Create Account button click to navigate to the new user page
    const handleCreateAccountClick = () => {
        navigate('/new-user'); 
    };

    // Render the login form
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            textAlign: 'center',
            padding: '20px',
        }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px' }}>Login</h1>

            <div style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                width: '100%',
                maxWidth: '400px',
                marginBottom: '20px',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Sign In</h2>
                <form onSubmit={handleLoginSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={loginCredentials.username}
                            onChange={handleLoginChange}
                            style={{ width: '95%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={loginCredentials.password}
                            onChange={handleLoginChange}
                            style={{ width: '95%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>
                    <button type="submit" style={{
                        padding: '10px 20px',
                        borderRadius: '4px',
                        border: 'none',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        cursor: 'pointer',
                        marginRight: '10px'
                    }}>
                        Login
                    </button>
                    <button type="button" onClick={handleCreateAccountClick} style={{
                        padding: '10px 20px',
                        borderRadius: '4px',
                        border: '1px solid #007bff',
                        backgroundColor: '#fff',
                        color: '#007bff',
                        cursor: 'pointer' 
                    }}>
                        Create Account
                    </button>
                </form>
            </div>
        </div>
    );
};

// Export the LoginComponent so it can be imported and used in other parts of the application
export default LoginComponent;
