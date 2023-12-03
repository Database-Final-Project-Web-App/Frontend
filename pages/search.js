import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import ATRSHeader from "/atrs-components/Header/ATRSHeader";
import ATRSFooter from "/atrs-components/Footer/ATRSFooter";

import styles from '/styles/jss/nextjs-material-kit/pages/components.js';
import { Typography } from '@material-ui/core';
import { ATRSFlightCheck, ATRSFlightSearch } from '/atrs-components/FlightSearch/ATRSFlightSearch';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';

styles.section = {
	padding: '140px 0 70px 0',
}

styles.vpad = {
	padding: '40px 0 0 0',
}

const useStyles = makeStyles(styles);

export default function Search(props) {
	const classes = useStyles();
	const { ...rest } = props;

	return (
    <div>
      <ATRSHeader {...rest} />
      <div className={classes.main}>
        <div className={classes.container}>
          <div className={classes.section}>
						{/* TODO: Use Date Range Picker instad of Date Picker */}
						{/* <DateRangePicker
							ranges={[
								{
									startDate: new Date(),
									endDate: new Date(),
									key: 'selection'
								}
							]}
							onChange={(item) => console.log(item)}
						/> */}
						<Typography variant="h3" align="left">Check Flight Info</Typography>
						<div className={classes.vpad} />
						<ATRSFlightCheck />
						<div className={classes.vpad} />
						<Typography variant="h3" align="left">Search Flights</Typography>
						<div className={classes.vpad} />
						<ATRSFlightSearch
							submitTo='http://localhost:5000/api/public/flight/search'
							searchFor='flights'
							customFieldsConfig={[
								{ name: 'departure_time', label: 'Departure Date', type: 'date', inputType: 'date' },
    						{ name: 'arrival_time', label: 'Arrival Date', type: 'date', inputType: 'date' },
							]}
						/>

          </div>
        </div>
      </div>
      <ATRSFooter />
    </div>
	);
}