import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid
} from '@material-ui/core';

const ATRSFlightSearch = () => {
  const [searchParams, setSearchParams] = useState({});
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
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
        {/* Add input fields for each search parameter */}
        {/* Example: */}
        <TextField name="flight_num" label="Flight Number" onChange={handleInputChange} />
        {/* Repeat for other parameters */}
        <Button type="submit" color="primary" variant="contained">Search Flights</Button>
      </form>

      {loading ? <p>Loading...</p> : (
        <Grid container spacing={2}>
          {flights.map(flight => (
            <Grid item key={flight.flight_num} xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5">{flight.airline_name}</Typography>
                  {/* Display other flight details */}
                  <Typography variant="body2">Departure: {flight.dept_city}</Typography>
                  <Typography variant="body2">Arrival: {flight.arr_city}</Typography>
                  {/* Add link to detailed flight page */}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ATRSFlightSearch;
