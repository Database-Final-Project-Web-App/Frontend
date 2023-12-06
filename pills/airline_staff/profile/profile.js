import React from 'react'
import { useEffect, useContext, useState } from 'react'
import { useRouter } from 'next/router'

import { authContext } from "/auth/Context.js";
import { isLogin, fetchUserProfileDetail } from '/utils/utils';

import { 
	Container, Typography, TextField, InputLabel, FormControl, Input, Divider,
	CardContainer, CardContent, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Card from "/components/Card/Card.js";
import CardHeader from '/components/Card/CardHeader.js';
import CardBody from "/components/Card/CardBody.js";
import CardFooter from "/components/Card/CardFooter.js";
import Button from "/components/CustomButtons/Button.js";

import { ATRSFlightSearch, ATRSCustomersOfFlight } from '/atrs-components/FlightSearch/ATRSFlightSearch.js';


import styles from "/styles/jss/nextjs-material-kit/pages/components.js";

import { Bar, Pie } from 'react-chartjs-2';
import { 
	Chart as ChartJS, 
	CategoryScale, LinearScale, 
	BarElement, 
	ArcElement,
	Title, Tooltip, Legend } from 'chart.js';


ChartJS.register(
	CategoryScale, LinearScale, 
	BarElement, 
	ArcElement,
	Title, Tooltip, Legend);


const useStyles = makeStyles(styles);



export function InfoPill() {
	const router = useRouter();
  const { user } = useContext(authContext);
  const [profile, setProfile] = useState(null);
	
	const displayDetail = async () => {
		const data = await fetchUserProfileDetail();
		if (data) {
			setProfile({ item: data });
		}
		else {
			setProfile({ item: [] });
		}
	}

	useEffect(() => {
		// check if user is logged in
		isLogin()
		.then((data) => {
			// debugger;
			console.log(`isLogin: ${data}`)
			if (!data) {
				router.push("/login");
			}
			else {
				displayDetail();
			}
		});
	}
	, []);

  return (
		<div className="container">
			<Card>
				<CardHeader>
					<h1>{user ? user.username_display: ""}</h1>
				</CardHeader>
				<CardBody>
					<p>logintype: {user ? user.logintype: ""}</p>
					<p>username: {user ? user.username : ""}</p>
					{
						profile && profile.item ? (
							<div>
								{Object.keys(profile.item).map((key, index) => (
									<div>
									<p key={index}>{key}: {profile.item[key]}</p>
									</div>
								))}
							</div>
						) : (
							<div>
							</div>
						)
					}
				</CardBody>
				<CardFooter>
				</CardFooter>
			</Card>
		</div>
  );
}

export function FlightsPill() {
	// - View My Flights
	
	return (
		<div>
			
			<Typography variant="h4" gutterBottom>
				Search Flights
			</Typography>
			<ATRSFlightSearch 
				submitTo='http://localhost:5000/api/airline-staff/flight/my'
				searchFor='tickets'
				buyTicket={false}
				customFieldsConfig={[
					{ name: 'departure_time_start', label: 'Start Date', type: 'date', inputType: 'date' ,
						// start today, end today + 30 days
						defaultValue: new Date().toISOString().slice(0, 10),
					},
					{ name: 'departure_time_end', label: 'End Date', type: 'date', inputType: 'date', 
						defaultValue: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
					},
				]}
			/>
		</div>
	)
}

export function CustomersPill() {
	const [ flight, setFlight ] = useState(null);
	const [ customers, setCustomers ] = useState(null);
	
	const [searchParams, setSearchParams] = useState({});
  const [loading, setLoading] = useState(false);

  const fieldsConfig = [
    { name: 'flight_num', label: 'Flight Number', type: 'number', required: true },
    { name: 'airline_name', label: 'Airline Name', required: true },
    // Add more fields here as per your search_handler
  ];

	return (
		<div>
			<Typography variant="h4" gutterBottom>
				View Customers of A Flight
			</Typography>

			<ATRSCustomersOfFlight flight={flight} />
		</div>
	);
}

export function AgentsPill() {
	// - View all booking agents
	// GET localhost:5000/api/airline-staff/booking-agent/all?limit={limit}

	const [ limit, setLimit ] = useState(5);
	const [ agents, setAgents ] = useState(null);

	const fetchAgents = async () => {
		try{
			const res = await fetch(
				`http://localhost:5000/api/airline-staff/booking-agent/all?limit=${limit}`, {
				method: 'GET',
				credentials: 'include' 
			});
			const data = await res.json();
			if (!res.ok) {
				throw Error(data.message ? data.message : data.error);
			}
			// debugger;
			setAgents(data);
		}
		catch(err) {
			alert(err)
		}	
	}

	useEffect(() => {
		fetchAgents();
	}, []);

	const handleLimitChange = (e) => {
		setLimit(e.target.value);
	}

	const handleLimitSubmit = (e) => {
		e.preventDefault();
		fetchAgents();
	}

	return (
		<div>
			<Typography variant="h4" gutterBottom>
				View All Booking Agents
			</Typography>

			<form onSubmit={handleLimitSubmit}>
				<TextField
					label="Limit"
					type="number"
					value={limit}
					onChange={handleLimitChange}
				/>
				<Button type="submit" color="primary">Submit</Button>
			</form>

			{
				agents ? (
					<div>
						{/* 
						agents = {
							f"Top {limit} booking agent based on the number of tickets for last month": ((agent_1_email, num), (agent_2_email, num)),
							f"Top {limit} booking agent based on the number of tickets for last year": top_tickets_year_result,
							f"Top {limit} booking agent based on the commission received for last year": top_commission_year_result
						}
						*/}
						{
							Object.keys(agents).map((key, index) => (
								<div key={index}>
									<Typography variant="h5">{key}</Typography>
									{
										agents[key].map((agent, index) => (
											// <div key={index}>
											// 	<p>{agent[0]}: {agent[1]}</p>
											// </div>
											<div>
                <Card>
                  <CardContent>
                    <Typography variant="body2" component="p">
                      <p>Email: {agent[0]}</p>
                      <p>Value: {agent[1]}</p>
                    </Typography>
                  </CardContent>
                </Card>
                <Divider />
                </div>
										))
									}
								</div>
							))
						}
					</div>
				) : (
					<div>
						<p>No agents found</p>
					</div>
				)
			}
		</div>
	);

}

export function FreqCustomersPill() {
	// view frequent customers
	// GET localhost:5000/api/airline-staff/misc/frequent-customers?limit={limit}
	const [ limit, setLimit ] = useState(5);
	const [ results, setResults ] = useState(null);

	const fetchCustomers = async () => {
		try{
			const res = await fetch(
				`http://localhost:5000/api/airline-staff/misc/frequent-customer?limit=${limit}`, {
				method: 'GET',
				credentials: 'include' 
			});
			const data = await res.json();
			if (!res.ok) {
				throw Error(data.message ? data.message : data.error);
			}
			setResults(data);
		}
		catch(err) {
			alert(err)
		}	
	}

	useEffect(() => {
		fetchCustomers();
	}, []);

	const handleLimitChange = (e) => {
		setLimit(e.target.value);
	}

	const handleLimitSubmit = (e) => {
		e.preventDefault();
		fetchCustomers();
	}

return (
        <div>
            <Typography variant="h4" gutterBottom>
                View Frequent Customers
            </Typography>

            <form onSubmit={handleLimitSubmit}>
                <TextField
                    label="Limit"
                    type="number"
                    value={limit}
                    onChange={handleLimitChange}
                />
                <Button type="submit" color="primary">Submit</Button>
            </form>

            {results && results.top_frequent_customers && results.flights && (
                results.top_frequent_customers.map(([email, numTickets]) => (
                    <Accordion key={email}>
                        <AccordionSummary>
                            <Typography>{email} - Tickets: {numTickets}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List>
                                {results.flights[email].map((flight, index) => (
                                    <ListItem key={index}>
                                        <ListItemText
                                            primary={`Flight Number: ${flight.flight_num}, Airline: ${flight.airline_name}`}
                                            secondary={`Departure: ${flight.dept_airport_name} -> Arrival: ${flight.arr_airport_name}, Status: ${flight.status}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                ))
            )}

        </div>
    );
}

export function ReportsPill() {
	// view reports
	// GET localhost:5000/api/airline-staff/misc/report?start_date={start_date}&end_date={end_date}
	// by default, start from one year ago to today
	// sample result
	// {'start_date': '2022-12-03', 'end_date': '2023-12-03', 'total_report': {'Total amount': 1371.0, 'Number of tickets sold': 4.0}, 'monthly_report': {'2023-12': {'number of tickets': 4.0, 'Total amount': 1371.0}}}
	const [ startDate, setStartDate ] = useState(new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
	const [ endDate, setEndDate ] = useState(new Date().toISOString().slice(0, 10));
	const [ results, setResults ] = useState(null);

	const fetchReport = async () => {
		try{
			const res = await fetch(
				`http://localhost:5000/api/airline-staff/misc/report?start_date=${startDate}&end_date=${endDate}`, {
				method: 'GET',
				credentials: 'include' 
			});
			const data = await res.json();
			if (!res.ok) {
				throw Error(data.message ? data.message : data.error);
			}
			// debugger;
			setResults(data);
		}
		catch(err) {
			alert(err)
		}	
	}

	useEffect(() => {
		fetchReport();
	}, []);

	const handleStartDateChange = (e) => {
		setStartDate(e.target.value);
	}

	const handleEndDateChange = (e) => {
		setEndDate(e.target.value);
	}

	const handleLimitSubmit = (e) => {
		e.preventDefault();
		fetchReport();
	}

	let barChartData = {
			labels: [],
			datasets: [
					{
							label: 'Number of Tickets',
							data: [],
							backgroundColor: 'rgba(54, 162, 235, 0.2)',
							borderColor: 'rgba(54, 162, 235, 1)',
							borderWidth: 1
					},
					// {
					// 		label: 'Total Amount',
					// 		data: [],
					// 		backgroundColor: 'rgba(255, 99, 132, 0.2)',
					// 		borderColor: 'rgba(255, 99, 132, 1)',
					// 		borderWidth: 1
					// }
			]
	};

	if (results && results.monthly_report) {
			barChartData.labels = Object.keys(results.monthly_report);
			barChartData.datasets[0].data = barChartData.labels.map(label => results.monthly_report[label]['number of tickets']);
			// barChartData.datasets[1].data = barChartData.labels.map(label => results.monthly_report[label]['Total amount']);
	}


	return (
		<div>
			<Typography variant="h4" gutterBottom>
				View Reports
			</Typography>

			<form onSubmit={handleLimitSubmit}>
				<TextField
					label="Start Date"
					type="date"
					value={startDate}
					onChange={handleStartDateChange}
				/>
				<TextField
					label="End Date"
					type="date"
					value={endDate}
					onChange={handleEndDateChange}
				/>
				<Button type="submit" color="primary">Submit</Button>
			</form>

			{
				results ? (
					<div>
						<p>Start Date: {results.start_date}</p>
						<p>End Date: {results.end_date}</p>
						<p>Total amount: {results.total_report['Total amount']}</p>
						<p>Number of tickets sold: {results.total_report['Number of tickets sold']}</p>
					</div>
				) : (
					<div>
						<p>No report found</p>
					</div>
				)
			}
			<div>
					<Bar data={barChartData} options={{
							scales: {
									y: {
											beginAtZero: true
									}
							},
							responsive: false
					}} />
			</div>

		</div>
	);
}

export function SalesPill() {
	/* view sales (pie chart of direct & indirect sales)
	// GET localhost:5000/api/airline-staff/misc/revenue-comparison
	//  total amount of revenue earned from direct
	// 	sales (when customer bought tickets without using a booking agent) and total amount of revenue earned from
  // 	indirect sales (when customer bought tickets using booking agents) in the last month and last year.
	// sample result:
	//
		result = {
		"last_month": {
			"custoner": direct_month,
			"booking_agent": booking_month
		},
		"last_year": {
			"customer": direct_year,
			"booking_agent": booking_year
		},
	} 
	*/
	const [ results, setResults ] = useState(null);

	const fetchSales = async () => {
		try{
			const res = await fetch(
				`http://localhost:5000/api/airline-staff/misc/revenue-comparison`, {
				method: 'GET',
				credentials: 'include' 
			});
			const data = await res.json();
			if (!res.ok) {
				throw Error(data.message ? data.message : data.error);
			}
			// debugger;
			setResults(data);
		}
		catch(err) {
			alert(err)
		}	
	}

	useEffect(() => {
		fetchSales();
	}, []);

    let pieChartDataLastMonth = {
        labels: ['Direct Sales', 'Indirect Sales'],
        datasets: [
            {
                label: 'Last Month Revenue',
                data: [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1
            }
        ]
    };

    let pieChartDataLastYear = {
        labels: ['Direct Sales', 'Indirect Sales'],
        datasets: [
            {
                label: 'Last Year Revenue',
                data: [],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }
        ]
    };

    if (results) {
        pieChartDataLastMonth.datasets[0].data = [results.last_month.customer, results.last_month.booking_agent];
        pieChartDataLastYear.datasets[0].data = [results.last_year.customer, results.last_year.booking_agent];
    }

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                View Sales
            </Typography>

            {results ? (
                <div>
                    <div>
                        <p>Last Month</p>
                        <Pie data={pieChartDataLastMonth} 
														options={{
																responsive: false
														}}
												/>
                    </div>
                    <div>
                        <p>Last Year</p>
                        <Pie data={pieChartDataLastYear} 
														options={{
																responsive: false
														}}
												/>
                    </div>
                </div>
            ) : (
                <div>
                    <p>No sales found</p>
                </div>
            )}
        </div>
    );
}

export function TopDestinationsPill() {
	/* view top destinations
	// GET localhost:5000/api/airline-staff/misc/top-destination?limit={limit}
	// sample result
	result = {
		"top_month_destination": top_month_tickets,
		"top_year_destination": top_year_tickets
	}
	*/

	const [ limit, setLimit ] = useState(5);
	const [ results, setResults ] = useState(null);

	const fetchDestinations = async () => {
		try{
			const res = await fetch(
				`http://localhost:5000/api/airline-staff/misc/top-destination?limit=${limit}`, {
				method: 'GET',
				credentials: 'include' 
			});
			const data = await res.json();
			if (!res.ok) {
				throw Error(data.message ? data.message : data.error);
			}
			// debugger;
			setResults(data);
		}
		catch(err) {
			alert(err)
		}	
	}

	useEffect(() => {
		fetchDestinations();
	}, []);

	const handleLimitChange = (e) => {
		setLimit(e.target.value);
	}

	const handleLimitSubmit = (e) => {
		e.preventDefault();
		fetchDestinations();
	}

	return (
		<div>
			<Typography variant="h4" gutterBottom>
				View Top Destinations
			</Typography>

			{/* <form onSubmit={handleLimitSubmit}>
				<TextField
					label="Limit"
					type="number"
					value={limit}
					onChange={handleLimitChange}
				/>
				<Button type="submit" color="primary">Submit</Button>
			</form> */}

			{
				results ? (
					<div>
						{
							Object.keys(results).map((key, index) => (
								<div key={index}>
									<Typography variant="h5">{key}</Typography>
									{
										results[key].map((destination, index) => (
											// <div key={index}>
											// 	<p>{destination[0]}: {destination[1]}</p>
											// </div>
											<Card key={index}>
												<CardContent>
													<Typography variant="body2" component="p">
														<p>Destination: {destination[0]}</p>
														<p>#Tickets: {destination[1]}</p>
													</Typography>
												</CardContent>
											</Card>
										))
									}
								</div>
							))
						}
					</div>
				) : (
					<div>
						<p>No destinations found</p>
					</div>
				)
			}
		</div>
	);
}
