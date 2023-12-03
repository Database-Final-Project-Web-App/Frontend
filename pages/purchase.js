/*
	Purchase ticket with input from
	- url parameter: flight_num, airline_name
	- client-side cookie: logintype, token
	- additional user input on the page
		This is only needed for booking agent to specify customer_email
*/

import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { authContext } from "/auth/Context.js";
import { isLogin } from '../utils/utils';
import { InputLabel, Input } from '@material-ui/core';



export default function Purchase() {
	const router = useRouter();
	const { user } = React.useContext(authContext);
	// if (!user) {
	// 	alert("Please login first");
	// 	router.push("/login");
	// }
	// if (user.logintype !== "customer" && user.logintype !== "booking_agent") {
	// 	alert("Only customer and booking_agent can purchase ticket");
	// 	router.push("/");
	// }

	const { flight_num, airline_name } = router.query;
	const { customer_email, setCustomerEmail } = React.useState('');

	const handleSubmit = async (e) => {
		// debugger;
		e.preventDefault();
		// assemble data
		if ( parseInt(flight_num) === NaN || !airline_name ) {
			alert("flight_num or airline_name is invalid");
			return;
		}

		const data = {
			flight_num: parseInt(flight_num),
			airline_name: airline_name,
			customer_email: user.logintype === "booking_agent" ? customer_email : null,
		}
		
		// send POST request with json object and cookie to localhost:5000/api/{logintype}/purchase
		try {
			const url = {
				"customer": "http://localhost:5000/api/customer/ticket/purchase",
				"booking_agent": "http://localhost:5000/api/booking-agent/ticket/purchase",
			}[user.logintype]
			const response = await fetch(url, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});
			if (!response.ok) {
				// get response json data, and display error message
				const jresponse = await response.json();
				alert(jresponse.error);
				return;
			}
			const jresponse = await response.json();
			alert("Purchase success");
			router.push("/");
		}
		catch (e) {
			alert(e);
			return;
		}
	};

	const handleCustomerEmailChange = (e) => {
		setCustomerEmail(e.target.value);
	}

	return (
		<div>
			<h1>Purchase</h1>
			<p>flight_num: {flight_num}</p>
			<p>airline_name: {airline_name}</p>
			<form onSubmit={handleSubmit}>
				{
					user.logintype === "booking_agent"
					?
					<div>
						<InputLabel>Customer Email</InputLabel>
						<Input
							type="text"
							value={customer_email}
							onChange={handleCustomerEmailChange}
						/>
					</div>
					:
					null
				}
				<input type="submit" value="Submit" />
			</form>
		</div>
	)
}
