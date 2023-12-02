import React from "react";
import classNames from "classnames";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";

// @material-ui/icons
import People from "@material-ui/icons/People";
import FaceIcon from '@material-ui/icons/Face';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import BuildIcon from '@material-ui/icons/Build';

// import SupportAgentIcon from '@material-ui/icons/SupportAgent';
// import EngineeringIcon from '@material-ui/icons/Engineering';

import { useRouter } from "next/router";

// core components
import Header from "/components/Header/Header.js";
import HeaderLinks from "/components/Header/HeaderLinks.js";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import Button from "/components/CustomButtons/Button.js";
import Card from "/components/Card/Card.js";
import CardBody from "/components/Card/CardBody.js";
import CardHeader from "/components/Card/CardHeader.js";
import CardFooter from "/components/Card/CardFooter.js";
import CustomInput from "/components/CustomInput/CustomInput.js";
import NavPills from "/components/NavPills/NavPills.js";
import CustomTabs from "/components/CustomTabs/CustomTabs.js";

import ATRSHeader from "../atrs-components/Header/ATRSHeader";
import ATRSFooter from "../atrs-components/Footer/ATRSFooter";


import { authContext } from "/auth/Context.js";

import styles from "/styles/jss/nextjs-material-kit/pages/components.js";
import { Grid, Typography } from "@material-ui/core";

const useStyles = makeStyles(styles);

styles.section = {
	padding: "140px 0 70px 0",
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

function LoginFormStyled() {
	function handleSubmit() {
		alert("submit");
	}
	return (
		<div>
			<GridContainer justify="center">
				<GridItem xs={12} sm={12} md={4}>
					<Card>
						<CardHeader color="primary">
							<h4>Login</h4>
							<p>Enter your username and password</p>
						</CardHeader>
						<CardBody>
							<CustomInput
								labelText="Username"
								id="username"
								formControlProps={{
									fullWidth: true
								}}
								inputProps={{
									type: "text",
									endAdornment: (
										<InputAdornment position="end">
											<People />
										</InputAdornment>
									)
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
									endAdornment: (
										<InputAdornment position="end">
											<Icon>
												lock_outline
											</Icon>
										</InputAdornment>
									)
								}}
							/>
							<Button 
								color="primary"
								variant="contained"
								onClick={handleSubmit}
							>Submit</Button>
						</CardBody>
						{/* <CardFooter>
							<Button color="primary">Login</Button>
						</CardFooter> */}
					</Card>
				</GridItem>
			</GridContainer>
			</div>
	);
}


function CustomerLoginPill() {
	return (
		<div>Customer Login</div>
	)
}

function AgentLoginPill() {
	return (
		<div>Agent Login</div>
	)
}

function StaffLoginPill() {
	return (
		<div>Staff Login</div>
	)
}

function CustomerRegisterPill() {
	return (
		<div>Customer Register</div>
	)
}

function AgentRegisterPill() {
	return (
		<div>Agent Register</div>
	)
}

function StaffRegisterPill() {
	return (
		<div>Staff Register</div>
	)
}

function LoginTab() {
	return (
		<div>
		<Typography variant="h4">Log in as a...</Typography>
			<NavPills 
				color="rose"
				tabs={[
					{
						tabButton: "Customer",
						tabIcon: FaceIcon,
						tabContent: (<CustomerLoginPill />)
					},
					{
						tabButton: "Booking Agent",
						tabIcon: SupervisedUserCircleIcon,
						tabContent: (<AgentLoginPill />)
					},
					{
						tabButton: "Airline Staff",
						tabIcon: BuildIcon,
						tabContent: (<StaffLoginPill />)
					}
				]}
			/>
		</div>
	)
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
						tabIcon: FaceIcon,
						tabContent: (<CustomerRegisterPill />)
					},
					{
						tabButton: "Booking Agent",
						tabIcon: SupervisedUserCircleIcon,
						tabContent: (<AgentRegisterPill />)
					},
					{
						tabButton: "Airline Staff",
						tabIcon: BuildIcon,
						tabContent: (<StaffRegisterPill />)
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
			<div 
				className={classNames(classes.main)}>
				<div className={classes.container}>
					<div className={classes.section}>
					 <LoginOrRegisterTabs />
					</div>
				</div>
			</div>
			<ATRSFooter />
		</div>
	);
}
