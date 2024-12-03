import React, { useState, useEffect } from 'react';
import { Button, TextField } from '@mui/material';
import axios from 'axios';

const HWSets = ({ hwName, projectId }) => {
    const [quantity, setQuantity] = useState(0);
    const [availability, setAvailability] = useState(null);

    const getHwSetKey = (name) => {
        const setNumber = name.split(' ').pop(); // Get the number from "Hardware Set X"
        return `HWset${setNumber}`;
    };

    useEffect(() => {
        fetchAvailability();
    }, [projectId]);

    const fetchAvailability = async () => {
        try {
            console.log('Fetching availability for project:', projectId);  // Debug log
            const response = await axios.get(`http://localhost:5000/get_hardware_availability?projectId=${projectId}`);
            console.log('Response data:', response.data);  // Debug log

            const hwSetKey = getHwSetKey(hwName);
            console.log('Looking for hardware set:', hwSetKey);  // Debug log

            const hwSet = response.data.hwSets[hwSetKey];
            console.log('Found hardware set:', hwSet);  // Debug log

            if (hwSet && hwSet.availability !== undefined) {
                setAvailability(hwSet.availability);
            } else {
                console.error('Hardware set or availability not found in response');
                setAvailability(0);
            }
        } catch (error) {
            console.error('Error fetching hardware availability:', error);
            setAvailability(0);
        }
    };

    const handleCheckIn = async () => {
        try {
            const response = await axios.post('http://localhost:5000/check_in', {
                projectId,
                hwSetName: getHwSetKey(hwName),
                qty: parseInt(quantity)
            });
            if (response.status === 200) {
                alert(`${quantity} units checked in.`);
                setAvailability(response.data.availability); // Update with new availability
            }
        } catch (error) {
            console.error('Check-in error:', error);
            alert('Failed to check in hardware.');
        }
    };

    const handleCheckOut = async () => {
        try {
            const response = await axios.post('http://localhost:5000/check_out', {
                projectId,
                hwSetName: getHwSetKey(hwName),
                qty: parseInt(quantity)
            });
            if (response.status === 200) {
                alert(`${quantity} units checked out.`);
                setAvailability(response.data.availability); // Update with new availability
            }
        } catch (error) {
            console.error('Check-out error:', error);
            alert('Failed to check out hardware.');
        }
    };


    return (
        <div style={{ marginTop: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h4 style={{ margin: 0 }}>{hwName}</h4>
                <span style={{ color: '#666' }}>
                    (Available: {availability !== null ? availability : 'Loading...'})
                </span>
            </div>
            <div style={{ marginTop: '10px' }}>
                <TextField
                    label="Quantity"
                    type="number"
                    variant="outlined"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    size="small"
                    style={{ marginRight: '10px', width: '80px' }}
                />
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleCheckOut}
                    style={{ marginRight: '5px', borderColor: 'black', color: 'black' }}
                >
                    Check Out
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleCheckIn}
                    style={{ borderColor: 'black', color: 'black' }}
                >
                    Check In
                </Button>
            </div>
        </div>
    );
};

export default HWSets;