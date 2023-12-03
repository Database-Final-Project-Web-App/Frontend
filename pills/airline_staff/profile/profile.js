import React from 'react'
import { useEffect, useContext, useState } from 'react'
import { useRouter } from 'next/router'

import { authContext } from "/auth/Context.js";
import { isLogin, fetchUserProfileDetail } from '/utils/utils';

import { Container, Typography, TextField, Button, InputLabel, FormControl, Input } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Card from "/components/Card/Card.js";
import CardHeader from '/components/Card/CardHeader.js';
import CardBody from "/components/Card/CardBody.js";
import CardFooter from "/components/Card/CardFooter.js";

import styles from "/styles/jss/nextjs-material-kit/pages/components.js";

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

export function FlightsPill() {
	// - View My Flights
}

export function AgentsPill() {
	// - View all booking agents
}

export function FreqCustomersPill() {
	// view frequent customers
}

export function ReportsPill() {
	// view reports
}

export function SalesPill() {
	// view sales (pie chart of direct & indirect sales)
}

export function TopDestinationsPill() {
	// view top destinations
}
