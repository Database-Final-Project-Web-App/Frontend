import React, { useState } from 'react';
import {
  Container, Card, CardContent, Typography, Grid, Button, TextField
} from '@material-ui/core';

// Utility function to render input fields
const renderSearchField = (fieldConfig, handleInputChange) => (
  <Grid item xs={12} sm={6} md={3} key={fieldConfig.name}>
    <TextField
      fullWidth
      name={fieldConfig.name}
      label={fieldConfig.label}
      onChange={handleInputChange}
      variant="outlined"
      margin="normal"
      type={fieldConfig.type || "text"} // Default type is text
    />
  </Grid>
);



const ATRSFlightSearch = () => {
  const [searchParams, setSearchParams] = useState({});
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  const fieldsConfig = [
    { name: 'flight_num', label: 'Flight Number', type: 'number' },
    { name: 'airline_name', label: 'Airline Name' },
    // Add more fields here as per your search_handler
  ];

  const convertToFieldType = (name, value) => {
    const field = fieldsConfig.find(f => f.name === name);
    if (field && field.type === 'number') {
      return Number(value);
    }
    return value; // Default case, return the value as-is
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = convertToFieldType(name, value);

    setSearchParams({
      ...searchParams,
      [name]: updatedValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
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

      {/* Flight cards rendering... */}
    </Container>
  );
};

export default ATRSFlightSearch;
