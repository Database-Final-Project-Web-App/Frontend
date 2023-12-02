import React, { useState } from 'react';
import Cookies from 'js-cookie';

import { makeStyles } from "@material-ui/core/styles";
import { Box } from '@material-ui/core';

import Button from "/components/CustomButtons/Button.js";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import CustomInput from "/components/CustomInput/CustomInput.js";
import Card from "/components/Card/Card.js";
import CardHeader from '/components/Card/CardHeader.js'
import CardBody from "/components/Card/CardBody.js";
import CardFooter from "/components/Card/CardFooter.js";


import styles from "/styles/jss/atrs/commonStyle.js"

import { authContext } from "../../auth/Context";
import * as CONSTANTS from "../../utils/constants"
import { ContactsOutlined } from '@material-ui/icons';


styles.sections = {
	padding: "70px 0 0 0",
}

const useStyles = makeStyles(styles);

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


export default function SectionTest() {

	const classes = useStyles();

	const { user, updateUser } = React.useContext(authContext);

	return (
		<div className={classes.sections}>
			<div className={classes.container}>
				<div className={classes.title}>
					<h2>Testing</h2>
				</div>	
				<CookieChecker />
			</div>
		</div>		
	)
}