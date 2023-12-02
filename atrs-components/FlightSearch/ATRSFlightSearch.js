import React, { useState } from 'react';
import {
  Container, Card, CardContent, Typography, Grid, Button, TextField, InputLabel
} from '@material-ui/core';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

import CustomInput from '/components/CustomInput/CustomInput.js';

import { validateFields } from '/utils/utils';

// Utility function to render input fields
const renderSearchField = (fieldConfig, handleInputChange) => {
  const renderInputBasedOnType = () => {
    switch (fieldConfig.inputType) {
      case 'datetime':
        return (
					<div>
					<Typography variant="caption">{fieldConfig.label}</Typography>
          <Datetime
            onChange={momentObj => handleInputChange({ target: { name: fieldConfig.name, value: momentObj } })}
            inputProps={{ placeholder: fieldConfig.label }}
          />
					</div>
        );
      // Add cases for 'doubleSlider' and other types if needed
      default:
        return (
          <TextField
            fullWidth
            name={fieldConfig.name}
            label={fieldConfig.label}
            onChange={handleInputChange}
            variant="outlined"
            margin="normal"
            type={fieldConfig.type || 'text'}
            required={fieldConfig.required || false}
          />
        );
    }
  };

  return (
    <Grid item xs={12} sm={6} md={3} key={fieldConfig.name}>
      {renderInputBasedOnType()}
    </Grid>
  );
};

// FlightCard component
const FlightSummaryCard = ({ flight }) => (
  <Grid item xs={12} sm={12} md={12}>
    <Card>
      <CardContent>
        <Typography variant="h5">{flight.airline_name}</Typography>
        {/* Add other flight details here */}
        <Typography variant="body2">Flight Number: {flight.flight_num}</Typography>
        <Typography variant="body2">Departure City: {flight.dept_city}</Typography>
        <Typography variant="body2">Arrival City: {flight.arr_city}</Typography>
        {/* Add more details as needed */}
      </CardContent>
    </Card>
  </Grid>
);

const FlightFullCard = ({ flight }) => (
	<Grid item xs={12} sm={12} md={12}>
		<Card>
			<CardContent>
				<Typography variant="h5">{flight.airline_name}</Typography>
				{/* use map to show full details of a flight */}
				{Object.entries(flight).map(([key, value]) => (
					<Typography variant="body2" key={key}>
						{key}: {value}
					</Typography>
				))}
			</CardContent>
		</Card>
	</Grid>
);

const convertToFieldType = (name, value, fieldsConfig) => {
	const field = fieldsConfig.find(f => f.name === name);
	if (value === '') {
		return null;
	}
	if (!field) {
		return value;
	}
	switch (field.type) {
		case 'number':
			return value !== '' ? Number(value) : null;
		case 'date':
			return value.format ? value.format('YYYY-MM-DD') : null;
		case 'time':
			return value.format ? value.format('HH:mm:ss') : null;
		case 'datetime':
			return value.format ? value.format('YYYY-MM-DD HH:mm:ss') : null;
		default:
			return value;		// Default case, return the value as-is		
	}
};

// search by flight_num and airline_name to locate a specific flight
export const ATRSFlightCheck = () => {
  const [searchParams, setSearchParams] = useState({});
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  const fieldsConfig = [
    { name: 'flight_num', label: 'Flight Number', type: 'number', required: true },
    { name: 'airline_name', label: 'Airline Name', required: true },
    // Add more fields here as per your search_handler
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = convertToFieldType(name, value, fieldsConfig);

    setSearchParams({
      ...searchParams,
      [name]: updatedValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
		// 1. validate fields
		console.log(`searchParams: ${JSON.stringify(searchParams)}`)
		console.log("1. validate fields")
		const { flag, message } = validateFields(fieldsConfig, searchParams);
		if (!flag) {
			alert(message);
			return;
		}

		// 2. send post request to backend
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/public/flight/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      });

			// 3. get response and set flights
      const data = await response.json();

      if (response.ok) {
        setFlights(data.flights);
      } else {
        alert(`Error: ${data.status} - ${data.message}`);
      }
    } catch (error) {
      alert('Error fetching flights: ' + error.message);
    } finally {
      setLoading(false);
    }

  };

	return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {fieldsConfig.map(field => 
            renderSearchField(field, handleInputChange)
          )}
          <Grid item xs={12}>
            <Button type="submit" color="primary" variant="contained">
              Search Flights
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Flight cards rendering */}
      <Grid container spacing={2}>
        {flights.map(flight => (
          <FlightFullCard key={flight.flight_num} flight={flight} />
        ))}
      </Grid>
    </Container>
  );

};

export const ATRSFlightSearch = () => {
  const [searchParams, setSearchParams] = useState({});
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  const fieldsConfig = [
    { name: 'departure_time', label: 'Departure Time', type: 'datetime', inputType: 'datetime' },
    { name: 'arrival_time', label: 'Arrival Time', type: 'datetime', inputType: 'datetime' },
    { name: 'airline_name', label: 'Airline Name' },
    { name: 'status', label: 'Status' },
    { name: 'dept_airport_name', label: 'Departure Airport' },
    { name: 'dept_city', label: 'Departure City' },
    { name: 'arr_airport_name', label: 'Arrival Airport' },
    { name: 'arr_city', label: 'Arrival City' },
    { name: 'price', label: 'Price', type: 'number' },
    // Add more fields as required
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = convertToFieldType(name, value, fieldsConfig);
    setSearchParams({
      ...searchParams,
      [name]: updatedValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

		// 1. validate fields
		console.log(`searchParams: ${JSON.stringify(searchParams)}`);
		console.log("1. validate fields");
		const { flag, message } = validateFields(fieldsConfig, searchParams);
		if (!flag) {
			alert(message);
			return;
		}

    try {
			console.log(searchParams)
      const response = await fetch('http://localhost:5000/api/public/flight/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      });

      const data = await response.json();

      if (response.ok) {
        setFlights(data.flights);
      } else {
        alert(`Error: ${data.status} - ${data.message}`);
      }
    } catch (error) {
      alert('Error fetching flights: ' + error.message);
    } finally {
      setLoading(false);
    }

  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {fieldsConfig.map(field => 
            renderSearchField(field, handleInputChange)
          )}
          <Grid item xs={12}>
            <Button type="submit" color="primary" variant="contained">
              Search Flights
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Flight cards rendering */}
      <Grid container spacing={2}>
        {flights.map(flight => (
          <FlightSummaryCard key={flight.flight_num} flight={flight} />
        ))}
      </Grid>
    </Container>
  );
};