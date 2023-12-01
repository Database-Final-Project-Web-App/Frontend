/*
	The <Navbar /> component that
	- is shared by all pages
	- dynamically change content based on user login status
*/

import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Search from "@material-ui/icons/Search";
import Email from "@material-ui/icons/Email";
import Face from "@material-ui/icons/Face";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Explore from "@material-ui/icons/Explore";
// core components
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import Header from "/components/Header/Header.js";
import CustomInput from "/components/CustomInput/CustomInput.js";
import CustomDropdown from "/components/CustomDropdown/CustomDropdown.js";
import Button from "/components/CustomButtons/Button.js";

import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/navbarsStyle.js";

const useStyles = makeStyles(styles);

export default function ATRSNavbar() {
	const classes = useStyles();
	/* 
		create a state for the user login status. The format is
		{
			"logintype": null | "customer" | "booking-agent" | "airline-staff"
			"username": null | "username"
		}
	*/
	const [user, setUser] = React.useState({
		logintype: null,
		username: null
	});

	return (
		<div></div>
	);
}	