import React from 'react'
import { useEffect, useContext, useState } from 'react'
import { useRouter } from 'next/router'

import { authContext } from "/auth/Context.js";
import { isLogin, fetchUserProfileDetail } from '/utils/utils';

import { Container, Typography, TextField, InputLabel, FormControl, Input } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Card from "/components/Card/Card.js";
import CardHeader from '/components/Card/CardHeader.js';
import CardBody from "/components/Card/CardBody.js";
import CardFooter from "/components/Card/CardFooter.js";

import styles from "/styles/jss/nextjs-material-kit/pages/components.js";

import { MenuItem, Select } from '@material-ui/core';


import Button from "/components/CustomButtons/Button.js";

const useStyles = makeStyles(styles);

function AddFlightPill() {
    const [departureTime, setDepartureTime] = useState('');
    const [arrivalTime, setArrivalTime] = useState('');
    const [price, setPrice] = useState('');
    const [status, setStatus] = useState('');
    const [airplaneId, setAirplaneId] = useState('');
    const [arrivalAirportName, setArrivalAirportName] = useState('');
    const [departureAirportName, setDepartureAirportName] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
				if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
					alert('Price must be non-negative float number');
					return;
				}
				if (isNaN(parseInt(airplaneId)) || parseInt(airplaneId) < 0) {
					alert('Airplane ID must be non-negative integer');
					return;
				}
				// debugger;
        const flightData = {
            departure_time: `${departureTime.split('T')[0]} ${departureTime.split('T')[1]}`,
            arrival_time: `${arrivalTime.split('T')[0]} ${arrivalTime.split('T')[1]}`,
            price: parseFloat(price),
            status: status,
            airplane_id: parseInt(airplaneId),
            arr_airport_name: arrivalAirportName,
            dept_airport_name: departureAirportName,
        };

        try {
            const response = await fetch('http://localhost:5000/api/airline-staff/flight/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
								credentials: 'include',
                body: JSON.stringify(flightData),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to create flight');
            }
            alert('Flight created successfully');
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Add Flight
            </Typography>

            <form onSubmit={handleSubmit}>
                {/* TextFields for each flight attribute */}
                <TextField
                    label="Departure Time"
                    type="datetime-local"
                    value={departureTime}
                    onChange={e => setDepartureTime(e.target.value)}
                    required
                />
                <TextField
                    label="Arrival Time"
                    type="datetime-local"
                    value={arrivalTime}
                    onChange={e => setArrivalTime(e.target.value)}
                    required
                />
                <TextField
                    label="Price"
                    type="number"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
										// set minimum to 0, step to 0.01	
										InputProps={{ inputProps: { min: 0, step: 0.01 } }}

                    required
                />
                <TextField
                    label="Status"
                    type="text"
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    required
                />
                <TextField
                    label="Airplane ID"
                    type="number"
                    value={airplaneId}
                    onChange={e => setAirplaneId(e.target.value)}
                    required
                />
                <TextField
                    label="Arrival Airport Name"
                    type="text"
                    value={arrivalAirportName}
                    onChange={e => setArrivalAirportName(e.target.value)}
                    required
                />
                <TextField
                    label="Departure Airport Name"
                    type="text"
                    value={departureAirportName}
                    onChange={e => setDepartureAirportName(e.target.value)}
                    required
                />
                <Button type="submit" color="primary">
                    Submit
                </Button>
            </form>
        </div>
    );
}


export function ChangeFlightStatusPill() {
    const [flightNum, setFlightNum] = useState('');
    const [status, setStatus] = useState('');

    const statuses = ['Upcoming', 'Inprogress', 'Delayed'];

    const handleSubmit = async (event) => {
        event.preventDefault();

				if (isNaN(parseInt(flightNum)) || parseInt(flightNum) < 0) {
					alert('Flight number must be non-negative integer');
					return;
				}

        const flightData = {
            flight_num: parseInt(flightNum),
            status: status,
        };

        try {
            const response = await fetch('http://localhost:5000/api/airline-staff/flight/change-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
								credentials: 'include',
                body: JSON.stringify(flightData),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to change flight status');
            }
            alert('Flight status changed successfully');
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Change Flight Status
            </Typography>

            <form onSubmit={handleSubmit}>
                <TextField
                    label="Flight Number"
                    type="number"
                    value={flightNum}
                    onChange={e => setFlightNum(e.target.value)}
										InputProps={{ inputProps: { min: 0, step: 1 } }}
                    required
                />
                <FormControl fullWidth>
                    <InputLabel id="status-select-label">Status</InputLabel>
                    <Select
                        labelId="status-select-label"
                        value={status}
                        label="Status"
                        onChange={e => setStatus(e.target.value)}
                        required
                    >
                        {statuses.map((status, index) => (
                            <MenuItem key={index} value={status}>{status}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button type="submit" color="primary">
                    Submit
                </Button>
            </form>
        </div>
    );
}


export function AddAirplanePill() {
    const [seatNum, setSeatNum] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const airplaneData = {
            seat_num: parseInt(seatNum, 10) // Parsing seat number as an integer
        };

        try {
            const response = await fetch('http://localhost:5000/api/airline-staff/airplane/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Including credentials for session handling
                body: JSON.stringify(airplaneData),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to add airplane');
            }
            alert('Airplane added successfully');
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Add Airplane
            </Typography>

            <form onSubmit={handleSubmit}>
                <TextField
                    label="Number of Seats"
                    type="number"
                    value={seatNum}
                    onChange={e => setSeatNum(e.target.value)}
                    required
                />
                <Button type="submit" color="primary">
                    Submit
                </Button>
            </form>
        </div>
    );
}

export function AddAirportPill() {
    const [airportName, setAirportName] = useState('');
    const [city, setCity] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const airportData = {
            name: airportName,
            city: city
        };

        try {
            const response = await fetch('http://localhost:5000/api/airline-staff/airport/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Including credentials for session handling
                body: JSON.stringify(airportData),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to add airport');
            }
            alert('Airport added successfully');
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Add Airport
            </Typography>

            <form onSubmit={handleSubmit}>
                <TextField
                    label="Airport Name"
                    type="text"
                    value={airportName}
                    onChange={e => setAirportName(e.target.value)}
                    required
                />
                <TextField
                    label="City"
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    required
                />
                <Button type="submit" color="primary">
                    Submit
                </Button>
            </form>
        </div>
    );
}

export function GrantPermissionPill() {
    const [staffUsername, setStaffUsername] = useState('');
    const [permission, setPermission] = useState('');

    const permissions = ['ADMIN', 'OPERATOR'];

    const handleSubmit = async (event) => {
        event.preventDefault();

        const permissionData = {
            airline_staff_username: staffUsername,
            permission: permission
        };

        try {
            const response = await fetch('http://localhost:5000/api/airline-staff/misc/grant-permission', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Including credentials for session handling
                body: JSON.stringify(permissionData),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to grant permission');
            }
            alert('Permission granted successfully');
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Grant Permission
            </Typography>

            <form onSubmit={handleSubmit}>
                <TextField
                    label="Staff Username"
                    type="text"
                    value={staffUsername}
                    onChange={e => setStaffUsername(e.target.value)}
                    required
                />
                <FormControl fullWidth>
                    <InputLabel id="permission-select-label">Permission</InputLabel>
                    <Select
                        labelId="permission-select-label"
                        value={permission}
                        label="Permission"
                        onChange={e => setPermission(e.target.value)}
                        required
                    >
                        {permissions.map((perm, index) => (
                            <MenuItem key={index} value={perm}>{perm}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button type="submit" color="primary">
                    Submit
                </Button>
            </form>
        </div>
    );
}

export function AddBookingAgentPill() {
    const [bookingAgentEmail, setBookingAgentEmail] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const bookingAgentData = {
            booking_agent_email: bookingAgentEmail
        };

        try {
            const response = await fetch('http://localhost:5000/api/airline-staff/booking-agent/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Including credentials for session handling
                body: JSON.stringify(bookingAgentData),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to add booking agent');
            }
            alert('Booking agent added successfully');
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Add Booking Agent
            </Typography>

            <form onSubmit={handleSubmit}>
                <TextField
                    label="Booking Agent Email"
                    type="email"
                    value={bookingAgentEmail}
                    onChange={e => setBookingAgentEmail(e.target.value)}
                    required
                />
                <Button type="submit" color="primary">
                    Submit
                </Button>
            </form>
        </div>
    );
}


export function ManageFlightsPill() {
	/*
		- create new flights
		- change status of flights
	*/

	return (
		<div>
			<AddFlightPill />
			<ChangeFlightStatusPill />
		</div>
	);

}

export function ManageAirplanesPill() {
	/*
		- add airplane in the system
	*/
	return (
		<div>
			<AddAirplanePill />
		</div>
	);
}

export function ManageAirportsPill() {
	/*
		- add airport in the system
	*/
    return (
        <div>
            <AddAirportPill />
        </div>
    );
}

export function ManageStaffsPill() {
	/*
		- grant new permissions to airline staffs
	*/
    return (
        <div>
            <GrantPermissionPill />
        </div>
    );
}

export function ManageAgentsPill() {
	/*
		- add booking agents
	*/
    return (
        <div>
            <AddBookingAgentPill />
        </div>
    );
}