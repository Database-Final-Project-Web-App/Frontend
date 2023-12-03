import React, { useEffect, useState } from 'react';
import {
  Container, Card, CardContent, Typography, Grid, Button, TextField, InputLabel, Divider
} from '@material-ui/core';
import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useRouter } from 'next/router';
import CustomInput from '/components/CustomInput/CustomInput.js';

import { validateFields } from '/utils/utils';


// Utility function to render input fields
const renderSearchField = (fieldConfig, handleInputChange) => {
  if (fieldConfig.norender) {
    return null;
  }
  const renderInputBasedOnType = () => {
    switch (fieldConfig.inputType) {
      case 'date':
      case 'time':
      case 'datetime':
        return (
					<div>
					<Typography variant="caption">{fieldConfig.label}</Typography>
          <Datetime
            onChange={momentObj => handleInputChange({ target: { name: fieldConfig.name, value: momentObj } })}
            inputProps={{ placeholder: fieldConfig.label, readOnly: true }}
            dateFormat={
              fieldConfig.type === 'date' || fieldConfig.inputType === 'datetime'
              ? 'YYYY-MM-DD'
              : false
            }
            timeFormat={
              fieldConfig.type === 'time' || fieldConfig.inputType === 'datetime'
              ? 'HH:mm:ss'
              : false
            }
            key={fieldConfig.name}
            defaultValue={fieldConfig.defaultValue || ''}
          />
					</div>
        );
      case 'slider':
        return (
          <div>
          <Typography variant="caption">{fieldConfig.label}</Typography>
          <CustomInput
            labelText={fieldConfig.label}
            id={fieldConfig.name}
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: 'range',
              min: fieldConfig.min || 0,
              max: fieldConfig.max || 100,
              step: fieldConfig.step || 1,
              defaultValue: fieldConfig.defaultValue || 0,
              name: fieldConfig.name,
              onChange: handleInputChange
            }}
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
            key={fieldConfig.name}
            required={fieldConfig.required || false}
            defaultValue={fieldConfig.defaultValue || ''}
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

// FlightAccordion component

const FlightAccordionCard = ({ flight }) => {
  const router = useRouter();

  const handleButtonClick = () => {
    // Redirect to a parametrized URL to buy ticket
    router.push(`/purchase?flight_num=${flight.flight_num}&airline_name=${flight.airline_name}`);
  };

  return (
    <Grid item xs={12} sm={12} md={12}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h6">
            {flight.airline_name}, Flight #{flight.flight_num}
            {flight.ticket_id ? `, Ticket #${flight.ticket_id}` : ""}
          </Typography>
          <Grid item xs={12}>
              <Typography variant="body2">
                {flight.dept_airport_name} -> {flight.arr_airport_name}
              </Typography>
              <Typography variant="body2">
                {flight.departure_time} -> {flight.arrival_time}
              </Typography>
              <Typography variant="body2">
                Status: {flight.status}
              </Typography>
            </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container>
            {Object.entries(flight).map(([key, value]) => (
              <Grid item xs={12} key={key}>
                <Typography variant="body2">
                  {key}: {value}
                </Typography>
              </Grid>
            ))}
            <Grid item xs={12}>
              {
                typeof flight.ticket_id === 'undefined' || flight.ticket_id === null
                ? <Button color='primary' onClick={handleButtonClick}>Buy Ticket</Button>
                : null
              }
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
};

export default FlightAccordionCard;



// // FlightCard component
// const FlightSummaryCard = ({ flight }) => (
//   <Grid item xs={12} sm={12} md={12}>
//     <Card>
//       <CardContent>
//         <Typography variant="h5">{flight.airline_name}{", Flight #"}{flight.flight_num}{
//           flight.ticket_id ? (", Ticket #"+flight.ticket_id) : ""
//         }</Typography>
//         {/* Add other flight details here */}
//         <Typography variant="body2">{flight.dept_airport_name}{" -> "}{flight.arr_airport_name}</Typography>
//         <Typography variant="body2">{flight.departure_time}{" -> "}{flight.arrival_time}</Typography>
//         <Typography variant="body2">Status: {flight.status}</Typography>
//         <Divider omponent="li" variant='middle' />
//         {/* use map to show full details of a flight */}
// 				{Object.entries(flight).map(([key, value]) => (
// 					<Typography variant="body2" key={key}>
// 						{key}: {value}
// 					</Typography>
// 				))}
//       </CardContent>
//     </Card>
//   </Grid>
// );

// const FlightFullCard = ({ flight }) => (
// 	<Grid item xs={12} sm={12} md={12}>
// 		<Card>
// 			<CardContent>
//         <Typography variant="h5">{flight.airline_name}{", Flight #"}{flight.flight_num}{
//           flight.ticket_id ? (", Ticket #"+flight.ticket_id) : ""
//         }</Typography>
// 				{/* use map to show full details of a flight */}
// 				{Object.entries(flight).map(([key, value]) => (
// 					<Typography variant="body2" key={key}>
// 						{key}: {value}
// 					</Typography>
// 				))}
// 			</CardContent>
// 		</Card>
// 	</Grid>
// );

const convertToFieldType = (name, value, fieldsConfig) => {
	const field = fieldsConfig.find(f => f.name === name);
  const defaultValue = field.defaultValue ? field.defaultValue : null;
	if (value === '') {
		return null;
	}
	if (!field) {
		return null;
	}
	switch (field.type) {
		case 'number':
			return value !== '' ? Number(value) : defaultValue;
    case 'integer':
      return value !== '' ? parseInt(value) : defaultValue;
		case 'date':
			return value.format ? value.format('YYYY-MM-DD') : defaultValue;
		case 'time':
			return value.format ? value.format('HH:mm:ss') : defaultValue;
		case 'datetime':
			return value.format ? value.format('YYYY-MM-DD HH:mm:ss') : defaultValue;
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

  // set searchParams to default values
  useEffect(() => {
    const defaultSearchParams = {};
    for (const field of fieldsConfig) {
      defaultSearchParams[field.name] = field.defaultValue ? field.defaultValue : null;
    }
    setSearchParams(defaultSearchParams);
  }, []);


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
    console.log("2. send post request to backend")
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/public/flight/search', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      });

			// 3. get response, data postprecess, and set flights
      const data = await response.json();
      // reformat departure_time and arrival_time to ignore seconds
      data.flights = data.flights.map(flight => {
        flight.departure_time = flight.departure_time.slice(0, -7) + ' GMT';
        flight.arrival_time = flight.arrival_time.slice(0, -7) + ' GMT';
        return flight;
      });

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
          // <FlightFullCard key={flight.flight_num} flight={flight} />
          <FlightAccordionCard key={
            flight.ticket_id
            ? flight.ticket_id
            : `${flight.airline_name}-${flight.flight_num}`
          } flight={flight} />
        ))}
      </Grid>
    </Container>
  );

};

export function ATRSFlightSearch(props) {
  const [searchParams, setSearchParams] = useState({});
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  const fieldsConfig = [
    // { name: 'departure_time', label: 'Departure Time', type: 'datetime', inputType: 'datetime' },
    // { name: 'arrival_time', label: 'Arrival Time', type: 'datetime', inputType: 'datetime' },
    { name: 'departure_date', label: 'Departure Date', type: 'date', inputType: 'date' },
    { name: 'arrival_date', label: 'Arrival Date', type: 'date', inputType: 'date' },
    { name: 'airline_name', label: 'Airline Name' },
    { name: 'status', label: 'Status', defaultValue: 'UpComing' },
    { name: 'dept_airport_name', label: 'Departure Airport' },
    { name: 'dept_city', label: 'Departure City' },
    { name: 'arr_airport_name', label: 'Arrival Airport' },
    { name: 'arr_city', label: 'Arrival City' },
    { name: 'price', label: 'Price', type: 'number', norender: true},
    // Add more fields as required
  ];

  if (props.customFieldsConfig) {
    fieldsConfig.push(...props.customFieldsConfig);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = convertToFieldType(name, value, fieldsConfig);
    setSearchParams({
      ...searchParams,
      [name]: updatedValue
    });
  };

  const submitData = async (searchParams) => {
    setLoading(true);

		// 1. validate fields
		console.log(`searchParams: ${JSON.stringify(searchParams)}`);
		console.log("1. validate fields");
		const { flag, message } = validateFields(fieldsConfig, searchParams);
		if (!flag) {
			alert(message);
			return;
		}

    // // 1.5 DIY part of searchParams
    // // add a field departure_time to searchParams. This should spans the entire departure_date
    // console.log("1.5 DIY part of searchParams")
    // if (searchParams.departure_date) {
    //   // need to explicilty convert to moment object b/c departure_date is just a string
    //   const startOfDay = Datetime.moment(searchParams.departure_date, 'YYYY-MM-DD', true).startOf('day');
    //   const endOfDay = Datetime.moment(searchParams.departure_date, 'YYYY-MM-DD', true).endOf('day');
    //   searchParams.departure_date = [startOfDay.format('YYYY-MM-DD HH:mm:ss'), endOfDay.format('YYYY-MM-DD HH:mm:ss')];
    // }
    // if (searchParams.arrival_date) {
    //   const startOfDay = Datetime.moment(searchParams.arrival_date, 'YYYY-MM-DD', true).startOf('day');
    //   const endOfDay = Datetime.moment(searchParams.arrival_date, 'YYYY-MM-DD', true).endOf('day');
    //   searchParams.arrival_date = [startOfDay.format('YYYY-MM-DD HH:mm:ss'), endOfDay.format('YYYY-MM-DD HH:mm:ss')];
    // }

		console.log(searchParams)

    // 2. send post request to backend
    console.log("2. send post request to backend");
    try {
			console.log(searchParams)
      const response = await fetch(props.submitTo ? props.submitTo : 'http://localhost:5000/api/public/flight/search', {
        method: 'POST',
        credentials: 'include',
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
  }

  // const handleSubmit = async (e) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    submitData(searchParams);
  };

  // set searchParams to default values and fetch default flights
  useEffect(() => {
    const defaultSearchParams = {};
    for (const field of fieldsConfig) {
      defaultSearchParams[field.name] = field.defaultValue ? field.defaultValue : null;
    }
    setSearchParams(defaultSearchParams);
    // in useeffect, state searchParams is not updated yet, so we need to pass in defaultSearchParams
    submitData(defaultSearchParams);
  }, []);

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
          // keyed by ticket_id
          // <FlightSummaryCard key={
          //   flight.ticket_id
          //   ? flight.ticket_id
          //   : `${flight.airline_name}-${flight.flight_num}`
          // } flight={flight} />
          <FlightAccordionCard key={
            flight.ticket_id
            ? flight.ticket_id
            : `${flight.airline_name}-${flight.flight_num}`
          } flight={flight} />
        ))}
      </Grid>
    </Container>
  );
};