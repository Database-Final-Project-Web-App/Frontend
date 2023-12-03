import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import Datetime from 'react-datetime';
import { makeStyles } from '@material-ui/core/styles';
import GridContainer from '/components/Grid/GridContainer.js';
import GridItem from '/components/Grid/GridItem.js';
import Card from '/components/Card/Card.js';
import CardHeader from '/components/Card/CardHeader.js';
import CardBody from '/components/Card/CardBody.js';
import CustomInput from '/components/CustomInput/CustomInput.js';
import Button from '/components/CustomButtons/Button.js';
import { authContext } from '/auth/Context.js';
import { Typography } from '@material-ui/core';
import NavPills from '/components/NavPills/NavPills.js';
import CustomTabs from '/components/CustomTabs/CustomTabs.js';
import ATRSHeader from '../atrs-components/Header/ATRSHeader';
import ATRSFooter from '../atrs-components/Footer/ATRSFooter';
import styles from '/styles/jss/nextjs-material-kit/pages/components.js';
import { renderInputField, validateFields } from '/utils/utils.js';
import { Flag } from '@material-ui/icons';

styles.section = {
	padding: '140px 0 70px 0',
}

const useStyles = makeStyles(styles);

function RegisterPill({ logintype, fieldsConfig, onSubmit }) {
  const [formData, setFormData] = useState(fieldsConfig.reduce((acc, field) => {
    acc[field.name] = '';
    return acc;
  }, {}));
  const classes = useStyles();


  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, logintype });
  };

  return (
    <form onSubmit={handleSubmit}>
      {fieldsConfig.map(field => renderInputField(field, setFormData))}
      <Button color="primary" type="submit">Register</Button>
    </form>
  );
}

async function handleRegisterSubmit(data, fieldsConfig, logintype, router) {

	// 1. validate data (if required but not filled, alert user)
	// 2. POST with json data to backend at localhost:5000/api/auth/register
	// 3. on return, 
	// 		1. if success, alert user and redirect to index page
	// 		2. if fail, alert user
	// check if required fields are empty

	// 1. validate data, and alert user the first error
	const { flag, message } = validateFields(fieldsConfig, data);
	if (!flag) {
		alert(message);
		return null;
	}

	// 2. POST with json data to backend at localhost:5000/api/auth/register
	let register_data = {
			username: data.username,
			password: data.password,
			logintype: logintype,
	}
	switch (logintype) {
		case "customer":
			register_data = {
				...register_data,
				name: data.name,
				building_number: data.building_number,
				street: data.street,
				city: data.city,
				state: data.state,
				phone_number: data.phone_number,
				passport_number: data.passport_number,
				passport_expiration: data.passport_expiration,
				passport_country: data.passport_country,
				date_of_birth: data.date_of_birth
			};
			break;
		case "booking_agent":
			register_data = {
				...register_data,
				airline_name: data.airline_name
			};
			break;
		case "airline_staff":
			register_data = {
				...register_data,
				first_name: data.first_name,
				last_name: data.last_name,
				date_of_birth: data.date_of_birth,
				airline_name: data.airline_name
			};
			break;
		default: 
			alert("Invalid logintype");
			return null;
	}	
	console.log(register_data);
	const response = await fetch('http://localhost:5000/api/auth/register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include',
		body: JSON.stringify( register_data )
	}).catch((error) => {
		alert(error);
		return null;
	});


	// debugger;
	// 3. on return,
	// 		1. if success, alert user and redirect to index page
	// 		2. if fail, alert user
	if (!response) {
		return null;
	}
	const responseData = await response.json()
	if (responseData.status == "success") {
		alert(responseData.message);
		router.push("/");
	}
	else {
		alert(responseData.message);
	}
};

function CustomerRegisterPill() {

  const fieldsConfig = [
    { name: 'username', label: 'Email', required: true },
    { name: 'password', label: 'Password', type: 'password', required: true },
    { name: 'name', label: 'Name', required: true },
    { name: 'building_number', label: 'Building Number' },
    { name: 'street', label: 'Street' },
    { name: 'city', label: 'City' },
    { name: 'state', label: 'State' },
    { name: 'phone_number', label: 'Phone Number', required: true },
    { name: 'passport_number', label: 'Passport Number', required: true },
    { name: 'passport_expiration', label: 'Passport Expiration', type: 'date', required: true },
    { name: 'passport_country', label: 'Passport Country', required: true },
    { name: 'date_of_birth', label: 'Date of Birth', type: 'date', required: true }
  ];

	const router = useRouter();

	const handleSubmit = (data) => {
		console.log('Customer Register Data before handleSubmit:', data);
		handleRegisterSubmit(data, fieldsConfig, "customer", router);
	}

  return (
    <RegisterPill logintype="customer" fieldsConfig={fieldsConfig} onSubmit={handleSubmit} />
  );
}

function AgentRegisterPill() {
  const fieldsConfig = [
    { name: 'username', label: 'Username', required: true },
    { name: 'password', label: 'Password', type: 'password', required: true },
    // { name: 'booking_agent_id', label: 'Booking Agent ID' },
    { name: 'airline_name', label: 'Airline Name', required: true }
  ];

	const router = useRouter();

  const handleSubmit = (data) => {
    console.log('Agent Register Data:', data);
    handleRegisterSubmit(data, fieldsConfig, "booking_agent", router);
  };

  return (
    <RegisterPill logintype="booking agent" fieldsConfig={fieldsConfig} onSubmit={handleSubmit} />
  );
}

function StaffRegisterPill() {
  const fieldsConfig = [
    { name: 'username', label: 'Username' },
    { name: 'password', label: 'Password', type: 'password' },
    { name: 'first_name', label: 'First Name' },
    { name: 'last_name', label: 'Last Name' },
    { name: 'date_of_birth', label: 'Date of Birth', type: 'date' },
    { name: 'airline_name', label: 'Airline Name' }
  ];

	const router = useRouter();

  const handleSubmit = (data) => {
    console.log('Staff Register Data:', data);
		handleRegisterSubmit(data, fieldsConfig, "airline_staff", router);
    // Implement POST request to backend here
  };

  return (
    <RegisterPill logintype="staff" fieldsConfig={fieldsConfig} onSubmit={handleSubmit} />
  );
}


function RegisterTab() {
	return (
	<div>
		<Typography variant="h4">Register as...</Typography>
		<NavPills 
			color="rose"
			tabs={[
				{
					tabButton: "Customer",
					tabContent: (<CustomerRegisterPill />)
				},
				{
					tabButton: "Booking Agent",
					tabContent: (<AgentRegisterPill />)
				},
				{
					tabButton: "Airline Staff",
					tabContent: (<StaffRegisterPill />)
				}
			]}
		/>
	</div>
	);
}


function LoginPill({ logintype }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { updateUser } = useContext(authContext);

	const handleSubmit = async (event) => {
		console.log("LoginPill handleSubmit");
		console.log(`Data: ${username}, ${password}, ${logintype}`);
		event.preventDefault();

		const response = await fetch('http://localhost:5000/api/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify({
				username: username,
				password: password,
				logintype: logintype
			})
		}).catch((error) => {
			alert(error);
			return null;
		});

		const data = await response.json()

		if (data.status == "success") {
			updateUser({
				logintype: logintype,
				username: username,
				username_display: data.username_display
			});
		}
		else {
			alert(data.message);
			return null;
		}
		console.log(data);

		// route to user profile
		router.push(`/${logintype}/profile`);
		// router.replace("/");
	};

  return (
		<div>
      <CustomInput
        labelText="Username"
        id="username"
        formControlProps={{
          fullWidth: true
        }}
        inputProps={{
          type: "text",
          onChange: (e) => setUsername(e.target.value)
        }}
      />
      <CustomInput
        labelText="Password"
        id="password"
        formControlProps={{
          fullWidth: true
        }}
        inputProps={{
          type: "password",
          onChange: (e) => setPassword(e.target.value)
        }}
      />
      <Button color="primary" onClick={handleSubmit}>
			Login
			</Button>
		</div>
  );
}

function CustomerLoginPill() {
  return <LoginPill logintype="customer" />;
}

function AgentLoginPill() {
  return <LoginPill logintype="booking_agent" />;
}

function StaffLoginPill() {
  return <LoginPill logintype="airline_staff" />;
}

function LoginTab() {
	return (
		<div>
			<Typography variant="h4">Login as...</Typography>
			<NavPills 
				color="rose"
				tabs={[
					{
						tabButton: "Customer",
						tabContent: (<CustomerLoginPill />)
					},
					{
						tabButton: "Booking Agent",
						tabContent: (<AgentLoginPill />)
					},
					{
						tabButton: "Airline Staff",
						tabContent: (<StaffLoginPill />)
					}
				]}
			/>
		</div>
	)
}


function LoginOrRegisterTabs() {

  return (
    <GridContainer justify="center">
      <GridItem xs={12} sm={12} md={12} lg={10}>
        <CustomTabs
          headerColor="primary"
          tabs={[
            {
              tabName: "Login",
              // Add LoginTab component here if exists
							tabContent: (<LoginTab />)
            }, 
            {
              tabName: "Register",
              tabContent: (<RegisterTab />)
            },
          ]}
        />
      </GridItem>
    </GridContainer>
  );
}

export default function LoginPage(props) {
  const classes = useStyles();
  const { ...rest } = props;

  return (
    <div>
      <ATRSHeader {...rest} />
      <div className={classes.main}>
        <div className={classes.container}>
          <div className={classes.section}>
						{/* <LoginForm /> */}
            <LoginOrRegisterTabs />
          </div>
        </div>
      </div>
      <ATRSFooter />
    </div>
  );
}
