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

styles.section = {
	padding: '140px 0 70px 0',
}

styles.datetimeField = {
	paddingTop: '27px',
	marginBottom: '17px',
}

const useStyles = makeStyles(styles);


function RegisterForm({ logintype, additionalFields, onSubmit }) {

	const classes = useStyles();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fields, setFields] = useState(additionalFields.reduce((acc, field) => {
    acc[field] = '';
    return acc;
  }, {}));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ username, password, logintype, ...fields });
  };

  const handleFieldChange = (fieldName) => (e) => {
    setFields(prevFields => ({ ...prevFields, [fieldName]: e.target.value }));
  };

  return (
    <form onSubmit={handleSubmit}>
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
			<Datetime
				inputProps={{ placeholder: "Date of Birth" }}
				onChange={handleFieldChange('date_of_birth')}
				className={classes.datetimeField}
				timeFormat={false}
			/>
      {additionalFields.map(field => (
        <CustomInput
          key={field}
          labelText={field.charAt(0).toUpperCase() + field.slice(1)}
          id={field}
          formControlProps={{
            fullWidth: true
          }}
          inputProps={{
            type: "text",
            onChange: handleFieldChange(field)
          }}
        />
      ))}
      <Button color="primary" type="submit">Register</Button>
    </form>
  );
}

function CustomerRegisterPill() {
  const additionalFields = ['name', 'building_number', 'street', 'city', 'state', 'phone_number', 'passport_number', 'passport_expiration', 'passport_country', 'date_of_birth'];

  const handleSubmit = (data) => {
    console.log('Customer Register Data:', data);
    // Implement POST request to backend here
  };

  return (
    <RegisterForm logintype="customer" additionalFields={additionalFields} onSubmit={handleSubmit} />
  );
}

function AgentRegisterPill() {
  const additionalFields = ['booking_agent_id', 'airline_name'];

  const handleSubmit = (data) => {
    console.log('Agent Register Data:', data);
    // Implement POST request to backend here
  };

  return (
    <RegisterForm logintype="booking_agent" additionalFields={additionalFields} onSubmit={handleSubmit} />
  );
}

function StaffRegisterPill() {
  const additionalFields = ['first_name', 'last_name', 'date_of_birth', 'permission', 'airline_name'];

  const handleSubmit = (data) => {
    console.log('Staff Register Data:', data);
    // Implement POST request to backend here
  };

  return (
    <RegisterForm logintype="airline_staff" additionalFields={additionalFields} onSubmit={handleSubmit} />
  );
}

function RegisterTab() {
	return (
	<div>
		<Typography variant="h4">Register as a...</Typography>
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

function LoginForm() {

	const classes = useStyles();

	const [username, setUsername] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [logintype, setLogintype] = React.useState('');

	const { user, updateUser } = React.useContext(authContext);
	const router = useRouter();

	const handleSubmit = async (event) => {
		event.preventDefault();
		console.log("LoginForm handleSubmit");
		console.log(`Data: ${username}, ${password}, ${logintype}`);
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
		}
		console.log(data);

		// route to index
		router.push("/");
	};

	return (
		<div>
		<div className="container">
			<GridContainer justify="center">
				<GridItem xs={12} sm={12} md={12}>
				<form className={classes.form} onSubmit={handleSubmit}>
					<input
						type="text"
						name="username"
						placeholder="username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
					{/* <CustomInput
					id="username"
					labelText="username"
					formControlProps={{
						fullWidth: true
					}}
					onChange={(e) => {
						setUsername(e.target.value);
						console.log("username: ", e.target.value);
					}}
					/> */}

					<input
						type="password"
						name="password"
						placeholder="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					{/* <CustomInput
						id="password"
						labelText="password"
						inputProps={{
							type: "password",
						}}
						formControlProps={{
							fullWidth: true
						}}
						onChange={(e) => {
							setPassword(e.target.value);
							console.log("password: ", e.target.value);
						}}
					/> */}
				<input
					type="text"
					name="logintype"
					placeholder="logintype"
					value={logintype}
					onChange={(e) => setLogintype(e.target.value)}
				/>
				<input type="submit" value="Submit" />
					{/* <CustomInput
						id="logintype"
						labelText="logintype"
						formControlProps={{
							fullWidth: true
						}}
						onChange={(e) => {
							console.log("logintype: ", e.target.value);
							setLogintype(e.target.value);
							console.log("logintype: ", e.target.value);
						}}
					/>
					<Box textAlign="center"> 
						<Button
							color="primary"
							type="submit"
							variant="contained"
						>
							Submit
						</Button>
						</Box> */}
					</form>
				</GridItem>	
			</GridContainer>
		</div>


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

		// route to index
		router.push("/");
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
			<Typography variant="h4">Login as a...</Typography>
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
