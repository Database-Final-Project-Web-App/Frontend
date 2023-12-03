import React, { useEffect, useContext, useState } from "react";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


import { makeStyles } from "@material-ui/core/styles";

import Datetime from "react-datetime";
import { InputLabel, Input } from "@material-ui/core";

import { useRouter } from "next/router";
import NavPills from "/components/NavPills/NavPills.js";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import Card from "/components/Card/Card.js";
import CardHeader from '/components/Card/CardHeader.js';
import CardBody from "/components/Card/CardBody.js";
import CardFooter from "/components/Card/CardFooter.js";
import Button from "/components/CustomButtons/Button.js";

import ATRSHeader from "/atrs-components/Header/ATRSHeader.js";
import ATRSFooter from "/atrs-components/Footer/ATRSFooter.js";
import { ATRSFlightSearch } from "/atrs-components/FlightSearch/ATRSFlightSearch.js";
import { authContext } from "/auth/Context.js";
import { isLogin, fetchUserProfileDetail, validateFields } from "/utils/utils";
import styles from "/styles/jss/nextjs-material-kit/pages/components.js";


const useStyles = makeStyles(styles);

styles.sections = {
  padding: "100px 0 0 0",
	minHeight: "100vh",
};

function InfoPill({ info }) {
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
		displayDetail();
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
									<p key={index}>{key}: {profile.item[key]}</p>
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
	return (
		<ATRSFlightSearch
			submitTo='http://localhost:5000/api/booking-agent/flight/my'
      searchFor='tickets'
			customFieldsConfig={[
				{ name: "customer_email", type: "string", label: "Customer Email", },
        { name: 'departure_time', label: 'Departure Date', type: 'date', inputType: 'date' },
        { name: 'arrival_time', label: 'Arrival Date', type: 'date', inputType: 'date' },
			]}
		/>
	)
}

function CommissionsPill() {
  const [commissionData, setcommissionData] = useState(null);
  const default_start_date = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().slice(0, 10);
	const default_end_date = new Date().toISOString().slice(0, 10);
	const [startDate, setStartDate] = useState(default_start_date)
	const [endDate, setEndDate] = useState(default_end_date)


	 const fetchcommissionData = async () => {
    const response = await fetch(`http://localhost:5000/api/booking-agent/misc/commission?start_date=${startDate}&end_date=${endDate}`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await response.json();
    if (response.ok) {
      setcommissionData(data);
    } else {
      console.error('Failed to fetch commission data:', data.message);
    }
  };

  useEffect(() => {
    fetchcommissionData();
  }, [startDate, endDate]);

  const handleStartDateChange = (e) => {
    setStartDate(e._d.toISOString().slice(0, 10));
  };

  const handleEndDateChange = (e) => {
    setEndDate(e._d.toISOString().slice(0, 10));
  };


  if (!commissionData) {
    return <div>Loading...</div>;
  }

  return (
    <div>		
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
					<Button color="primary" onClick={fetchcommissionData}>Submit</Button>
				</GridItem>			
			</GridContainer>	
      <h3>Total Commission: ${commissionData.commission}</h3>
      <h4>Average Commission per Ticket: ${commissionData.avg_commission}</h4>
      <h4>Total Tickets Sold: {commissionData.num_tickets}</h4>
    </div>
  );
}

function TopCustomerPill() {
  const [topCustomers, setTopCustomers] = useState(null);
	const default_start_date = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().slice(0, 10);
	const default_end_date = new Date().toISOString().slice(0, 10);
	const [start_date, setStartDate] = useState(default_start_date)
	const [end_date, setEndDate] = useState(default_end_date)
  const [limit, setLimit] = useState(5);

  const fieldsConfig = [
    { name: 'start_date', type: 'date', label: 'Start Date' },
    { name: 'end_date', type: 'date', label: 'End Date' },
    { name: 'limit', type: 'number', label: 'Limit', },
  ]

  const fetchTopCustomers = async () => {
    // 1. validate input
    const fields = { "start_date": start_date, "end_date": end_date, "limit": limit }
    const { flag, message } = validateFields(fieldsConfig, fields);
    if (!flag) {
      alert(message);
      return;
    }

    // 2. fetch data
    const response = await fetch(`http://localhost:5000/api/booking-agent/misc/top-customer?start_date=${start_date}&end_date=${end_date}&limit=${limit}`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await response.json();
    if (response.ok) {
      setTopCustomers(data);
    } else {
      console.error('Failed to fetch top customers:', data.message);
    }
  };

  useEffect(() => {
    fetchTopCustomers();
  }, [start_date, end_date, limit]);

  const handleStartDateChange = (e) => {
    setStartDate(e._d.toISOString().slice(0, 10));
  };

  const handleEndDateChange = (e) => {
    setEndDate(e._d.toISOString().slice(0, 10));
  };

  const handleLimitChange = (e) => {
    setLimit(e.target.value);
  };

  if (!topCustomers) {
    return <div>Loading...</div>;
  }

  const getChartData = (data, key, label) => {
    console.log(`Pie chart data: ${JSON.stringify(data)}, key: ${key}, label: ${label}`);
    return {
      labels: data.map(item => item.customer_email),
      datasets: [
        {
          label: label,
          data: data.map(item => item[key]),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div>
        <GridContainer>
        {/* Start Date Selector */}
        <GridItem xs={12} sm={12} md={4}>
          <InputLabel>Start Date</InputLabel>
          <Datetime
            inputProps={{ placeholder: "Start Date" }}
            timeFormat={false}
            onChange={handleStartDateChange}
            initialValue={start_date}
            dateFormat={"YYYY-MM-DD"}
          />
        </GridItem>
        {/* End Date Selector */}
        <GridItem xs={12} sm={12} md={4}>
          <InputLabel>End Date</InputLabel>
          <Datetime
            inputProps={{ placeholder: "End Date" }}
            timeFormat={false}
            onChange={handleEndDateChange}
            initialValue={end_date}
            dateFormat={"YYYY-MM-DD"}
          />
        </GridItem>
        {/* Limit Selector */}
        {/* <GridItem xs={12} sm={12} md={2}>
          <InputLabel>Top</InputLabel>
          <Input 
            type="number" 
            value={limit} 
            onChange={handleLimitChange} 
            step='1'
            />
        </GridItem> */}
        {/* Submit Button */}
        <GridItem xs={12} sm={12} md={2}>
          <Button color="primary" onClick={fetchTopCustomers}>Submit</Button>
        </GridItem>
      </GridContainer>
      <h3>Top {limit} Customers by Tickets Purchased</h3>
      <Bar data={getChartData(topCustomers.top_tickets_customer, 'num_tickets', 'Number of Tickets')} />
      
      <h3>Top {limit} Customers by Commission Generated</h3>
      <Bar data={getChartData(topCustomers.top_commission_customer, 'commission', 'Commission Amount')} />
    </div>
  );
}

function UserProfile() {
  const router = useRouter();
  const { user } = useContext(authContext);
  const [profile, setProfile] = useState(null);

  const displayDetail = async () => {
    const data = await fetchUserProfileDetail();
    if (data) {
      setProfile({ item: data });
    } else {
      setProfile({ item: [] });
    }
  }

  useEffect(() => {
    isLogin().then((data) => {
      if (!data) {
        router.push("/login");
      } 
    });
  }, []);

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <NavPills
          color="rose"
          tabs={[
            {
              tabButton: "View My Info",
              tabContent: <InfoPill info={profile} />
            },
            {
              tabButton: "View Flights",
              tabContent: <FlightsPill />
            },
            {
              tabButton: "View Top Customer",
              tabContent: <TopCustomerPill />
            },
						{
							tabButton: "View My Commissions",
							tabContent: <CommissionsPill />
						}, 
          ]}
          horizontal={{
            tabsGrid: { xs: 2, sm: 2, md: 3 },
            contentGrid: { xs: 12, sm: 8, md: 9 }
          }}
        />
      </GridItem>
    </GridContainer>
  );
}

export default function ProfilePage(props) {
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
