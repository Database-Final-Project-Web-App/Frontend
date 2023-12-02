import React, { useState } from 'react';
import Cookies from 'js-cookie';

import { makeStyles } from "@material-ui/core/styles";
import { Box } from '@material-ui/core';

import Button from "/components/CustomButtons/Button.js";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import CustomInput from "/components/CustomInput/CustomInput.js";

import styles from "/styles/jss/atrs/commonStyle.js"

import { authContext } from "../../auth/Context";
import * as CONSTANTS from "../../utils/constants"


styles.sections = {
	padding: "70px 0 0 0",
}

const useStyles = makeStyles(styles);

function LoginForm() {

	const classes = useStyles();

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [logintype, setLogintype] = useState('');

	const { user, updateUser } = React.useContext(authContext);

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
	};

	return (
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
  );
}

function CookieChecker() {
	return (
		<Button
			href="#pablo"
			target="_blank"
			color="primary"
			onClick={
				(e) => {
					e.preventDefault();
					console.log("Cookies.get(\"logintype\")", Cookies.get("logintype"));
					console.log("Cookies.get(\"username\")", Cookies.get("username"));
					console.log("Cookies.get(\"username_display\")", Cookies.get("username_display"));
					console.log("Cookies.get(\"session\")", Cookies.get("session"));
				}
			}
		>
			Cookie Checker
		</Button>
	)
}

// onclick button, fetch and display user profile detail
async function fetchSetUserProfileDetail() {
	// sent GET request at localhost:5000/api/customer/whoami
	// to get user profile. Fetch should timeout after 1 second
	const response = await fetch('http://localhost:5000/api/public/whoami', {
		method: 'GET',
		credentials: 'include',
	}).catch((error) => {
		alert(error);
		return null;
	});

	// if fetch timeout, alert error
	if (response == null) {
		alert("timeout");
		return;
	}

	const data = await response.json()
	.catch((error) => {
		alert(error);
		return null;
	});

	console.log(data);

}


function UserProfile() {
	const { user } = React.useContext(authContext);
	
	return (
		<div>
			<h1>user profile</h1>
			<p>logintype: {user ? user.logintype: ""}</p>
			<p>username: {user ? user.username : ""}</p>
			<p>username_display: {user ? user.username_display : ""}</p>
			<Button
				color="info"
				onClick={fetchSetUserProfileDetail}
			>
				detail?
			</Button>
		</div>
	)

}

export default function SectionTest() {

	const classes = useStyles();

	const { user, updateUser } = React.useContext(authContext);

	return (
		<div className={classes.sections}>
			<div className={classes.container}>
				<div className={classes.title}>
					<h2>Testing</h2>
				</div>	
				<LoginForm />
				<CookieChecker />
				<UserProfile />
			</div>
		</div>		
	)
}