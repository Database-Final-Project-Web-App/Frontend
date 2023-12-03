import React, { useEffect, useContext, useState } from "react";
import Datetime from "react-datetime";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons

import { useRouter } from "next/router";

import styles from "/styles/jss/nextjs-material-kit/pages/components.js";
import Card from "/components/Card/Card.js";
import CardHeader from '/components/Card/CardHeader.js'
import CardBody from "/components/Card/CardBody.js";
import CardFooter from "/components/Card/CardFooter.js";
import Button from "/components/CustomButtons/Button.js";
import Footer from "/components/Footer/Footer.js";
import NavPills from "/components/NavPills/NavPills.js";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";

import ATRSHeader from "/atrs-components/Header/ATRSHeader.js";
import ATRSFooter from "/atrs-components/Footer/ATRSFooter.js";
import { ATRSFlightSearch } from "/atrs-components/FlightSearch/ATRSFlightSearch";

import { authContext } from "/auth/Context.js";
import { isLogin, fetchUserProfileDetail, validateFields } from "/utils/utils";
import Cookies from "js-cookie";
import { Grid, InputLabel } from "@material-ui/core";

const useStyles = makeStyles(styles);

styles.sections = {
  padding: "100px 0 0 0",
	minHeight: "100vh",
}

styles.vpad = {
  padding: "40px 0 0 0",
}

function InfoPill({ info }) {
  const router = useRouter();
  const { user } = useContext(authContext);

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
						info && info.item ? (
							<div>
								{Object.keys(info.item).map((key, index) => (
									<p key={index}>{key}: {info.item[key]}</p>
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

function FlightsPill() {
	// add customField to search by date range
	return (
		<ATRSFlightSearch
			submitTo='http://localhost:5000/api/customer/flight/my'
			customFieldsConfig={[]}
		/>
	)
}

function SpendingPill() {
  const [spendingData, setSpendingData] = useState(null);
	const [isChartRendered, setIsChartRendered] = useState(false);
	// end_date = today, start_date = a year ago
	const default_start_date = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().slice(0, 10);
	const default_end_date = new Date().toISOString().slice(0, 10);
	const [start_date, setStartDate] = useState(default_start_date)
	const [end_date, setEndDate] = useState(default_end_date)

	const fieldsConfig = [
		{ name: 'start_date', label: 'Start Date', type: 'date',},
		{ name: 'end_date', label: 'End Date', type: 'date'},
	]

  const fetchSpendingData = async () => {

		// validate fields
		const fields = { "start_date": start_date, "end_date": end_date };
		const { flag, message } = validateFields(fieldsConfig, fields);
		if (!flag) {
			alert(message);
			return;
		}

    // Implement fetch logic here
    const response = await fetch(`http://localhost:5000/api/customer/misc/spending?start_date=${start_date}&end_date=${end_date}`, {
      method: 'GET',
      credentials: 'include',
    })
		.catch((error) => {
			console.error('Error:', error);
		});
    const data = await response.json();
    if (response.ok) {
			// debugger;
      setSpendingData(data);
    } else {
      console.error('Failed to fetch spending data:', data.message);
    }
  };

  useEffect(() => {
    fetchSpendingData();
  }, [start_date, end_date]);

  if (!spendingData) {
    return <div>Loading...</div>;
  }

	const handleStartDateChange = (e) => {
		setStartDate(e._d.toISOString().slice(0, 10));
	}

	const handleEndDateChange = (e) => {
		setEndDate(e._d.toISOString().slice(0, 10));
	}

	const getChartData = () => {
		const labels = Object.keys(spendingData.monthly_spending);
		const data = Object.values(spendingData.monthly_spending);

		return {
			labels,
			datasets: [
				{
					label: 'Monthly Spending',
					data: data,
					backgroundColor: 'rgba(0, 123, 255, 0.5)',
					borderColor: 'rgba(0, 123, 255, 1)',
					borderWidth: 1,
				},
			],
		};
	};

  return (
    <div>
			{/* use react-datetime to specify start and end date */}
			<GridContainer>
				<GridItem xs={12} sm={12} md={4}>
					<InputLabel>Start Date</InputLabel>
					<Datetime
						inputProps={{ placeholder: "Start Date", readOnly: true }}
						timeFormat={false}
						onChange={handleStartDateChange}
						initialValue={default_start_date}
						dateFormat={"YYYY-MM-DD"}

					></Datetime>
				</GridItem>
				<GridItem xs={12} sm={12} md={4}>
					<InputLabel>End Date</InputLabel>
					<Datetime
						inputProps={{ placeholder: "End Date", readOnly: true }}
						timeFormat={false}
						onChange={handleEndDateChange}
						initialValue={default_end_date}
						dateFormat={"YYYY-MM-DD"}
					></Datetime>
				</GridItem>
				<GridItem xs={12} sm={12} md={3}>
					<Button color="primary" onClick={fetchSpendingData}>Submit</Button>
				</GridItem>			
			</GridContainer>

			
      <h3>Total Spending: ${spendingData.total_spending}</h3>
      <h4>Monthly Spending:</h4>
				<Bar data={getChartData()} options={{ responsive: false, maintainAspectRatio: false }} />
				{Object.entries(spendingData.monthly_spending).map(([month, spending], index) => (
					<p key={index}>{month}: ${spending}</p>
				))}
    </div>
  );
}

function UserProfile() {
  const router = useRouter();
  const { user } = useContext(authContext);
  const [info, setInfo] = useState(null);
	
	const displayDetail = async () => {
		const data = await fetchUserProfileDetail();
		if (data) {
			setInfo({ item: data });
		}
		else {
			setInfo({ item: [] });
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
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <NavPills
          color="rose"
          tabs={[
            {
              tabButton: "View My Info",
              tabContent: (
                // Content for viewing profile
								<InfoPill info={info}/>
              ),
            },
            {
              tabButton: "View My Flight",
              tabContent: (
								<FlightsPill />
              ),
            },
            {
              tabButton: "Track My Spending",
              tabContent: (
								<SpendingPill />
              ),
            },
          ]}
					horizontal={{
						tabsGrid: { xs: 2, sm: 2, md: 3 },
						contentGrid: { xs: 12, sm: 8, md: 9 }
					}}
        />
      </GridItem>
      <GridItem xs={12} sm={12} md={9}>
        {/* Content based on selected pill */}
      </GridItem>
    </GridContainer>
  );
}


export default function ProfilePage(props) {
  const router = useRouter();
  const classes = useStyles();

  const { ...rest } = props;

  return (
    <div className={classes.main}>
			<ATRSHeader {...rest} />
      <div className={classes.sections}>
        <div className={classes.container}>
          <UserProfile />
        </div>
      </div>
      <ATRSFooter />
    </div>
  );
}
