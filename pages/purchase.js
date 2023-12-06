/*
	Purchase ticket with input from
	- url parameter: flight_num, airline_name
	- client-side cookie: logintype, token
	- additional user input on the page
		This is only needed for booking agent to specify customer_email
*/

import React, { useEffect, useContext, useState } from 'react'
import { makeStyles } from "@material-ui/core/styles";

import { useRouter } from 'next/router'
import { authContext } from "/auth/Context.js";
import { isLogin } from '../utils/utils';
import { Container, Typography, TextField, Button, InputLabel, FormControl, Input } from '@material-ui/core';

import CustomInput from "/components/CustomInput/CustomInput.js";

import ATRSHeader from "/atrs-components/Header/ATRSHeader.js";
import ATRSFooter from "/atrs-components/Footer/ATRSFooter.js";

import styles from "/styles/jss/nextjs-material-kit/pages/components.js";


const useStyles = makeStyles(styles);

styles.sections = {
  padding: "100px 0 0 0",
	minHeight: "100vh",
};


function PurchaseForm() {
    const router = useRouter();
    const { user } = useContext(authContext);
    const { flight_num, airline_name } = router.query;
    const [customer_email, setCustomerEmail] = useState('');

		useEffect(() => {
				if (!user || !user.logintype) {
						alert("You must login as either customer or booking agent to purchase ticket")
						router.push("/login");
				}
				else if (user.logintype !== "customer" && user.logintype !== "booking_agent") {
						alert("Only customer and booking agent can purchase ticket");
						router.back();
				}
		}, []);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isNaN(parseInt(flight_num)) || !airline_name) {
            alert("flight_num or airline_name is invalid");
            return;
        }

        const data = {
            flight_num: parseInt(flight_num),
            airline_name: airline_name,
            customer_email: user.logintype === "booking_agent" ? customer_email : null,
        };

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

    return (
        <Container>
            <Typography variant="h4">Purchase</Typography>
            <Typography>Flight Number: {flight_num}</Typography>
            <Typography>Airline Name: {airline_name}</Typography>
            <form onSubmit={handleSubmit}>
                {
								// buy ticket for customer, open only to booking_agent
								user && user.logintype === "booking_agent" && (
									<FormControl fullWidth margin="normal">
										<CustomInput
											labelText="Customer Email"
											id="customer-email"
											fullWidth 
											value={customer_email}
											inputProps={{
												onChange: (e) => setCustomerEmail(e.target.value)
											}}
										/>
									</FormControl>
								)
                }
                <Button type="submit" color="primary" variant="contained">
                    Submit
                </Button>
            </form>
        </Container>
    );
}

export default function Purchase(props) {
		const router = useRouter();
		const { user } = useContext(authContext);

		const classes = useStyles(styles);
		const { ...rest } = props

		useEffect(() => {
				if (!user || !user.logintype) {
						router.push("/login");
				}
		}, [user]);

		return (
    <div className={classes.main}>
      <ATRSHeader {...rest} />
      <div className={classes.sections}>
        <div className={classes.container}>
					<PurchaseForm />
        </div>
      </div>
      <ATRSFooter />
    </div>
		);
}