
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

// Define the NewUserFormatted component as a functional component
const NewUserFormatted = () => {
    // Use the useNavigate hook from react-router-dom for navigation
    const navigate = useNavigate(); 
    
    // Initialize state for username and password input values
    const [inputValueUser, setInputValueUser] = useState('');
    const [inputValuePass, setInputValuePass] = useState('');

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        // Send POST request to the backend to create a new user
        fetch('http://localhost:5000/add_user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: inputValueUser,
                password: inputValuePass
            })
        })
        .then(response => response.json().then(data => ({ status: response.status, body: data })))
        .then(res => {
            if (res.status === 200) {
                // If account creation is successful
                alert(res.body.message);
                navigate('/'); // Navigate to the home page
            } else {
                // If account creation fails
                alert(res.body.message);
            }
        })
        .catch(error => {
            // Handle any errors that occur during the account creation process
            console.error('Error during account creation:', error);
            alert('An error occurred during account creation.');
        });
    };

    // Handle changes in the username input field
    const handleChangeUser = (e) => {
        setInputValueUser(e.target.value);
    };

    // Handle changes in the password input field
    const handleChangePass = (e) => {
        setInputValuePass(e.target.value);
    };

    // Navigate to the sign-in page
    const signInPage = () => {
        navigate('/'); 
    };

    // Render the sign-up form
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
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px' }}>New User</h1>

            <div style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                width: '100%',
                maxWidth: '400px',
                marginBottom: '20px',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px'}}>
                        Username:
                        <input
                            type="text"
                            value={inputValueUser}
                            name="username"
                            onChange={handleChangeUser}
                            style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>
                    <div style = {{marginBottom: '15px'}}>
                        Password:
                        <input
                            type="password"
                            value={inputValuePass}
                            name="password"
                            onChange={handleChangePass}
                            style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>
                    <div style={{ padding: '10px' }}>
                        <input
                            type="submit"
                            value="Submit"
                            style={{
                                padding: '10px 20px',
                                borderRadius: '4px',
                                border: 'none',
                                backgroundColor: '#007bff',
                                color: '#fff',
                                cursor: 'pointer',
                            }}
                        />
                    </div>
                </form>
                <div style={{ marginTop: '40px', fontSize: '.75rem' }}>
                    Have an account? <span onClick={signInPage} style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline'}}>Sign in</span>
                </div>
            </div>
        </div>
    )
}

// Export the NewUserFormatted component so it can be used in other parts of the application
export default NewUserFormatted;

