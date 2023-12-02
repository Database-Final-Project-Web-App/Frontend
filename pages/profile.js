import React, { useEffect, useContext, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons

import { useRouter } from "next/router";

import styles from "/styles/jss/nextjs-material-kit/pages/profilePage.js";
import Card from "/components/Card/Card.js";
import CardHeader from '/components/Card/CardHeader.js'
import CardBody from "/components/Card/CardBody.js";
import CardFooter from "/components/Card/CardFooter.js";
import Button from "/components/CustomButtons/Button.js";
import Footer from "/components/Footer/Footer.js";

import ATRSHeader from "/atrs-components/Header/ATRSHeader.js";
import ATRSFooter from "/atrs-components/Footer/ATRSFooter.js";

import { authContext } from "/auth/Context.js";
import { isLogin } from "/utils/utils";
import Cookies from "js-cookie";

const useStyles = makeStyles(styles);

styles.sections = {
  padding: "70px 0 0 0",
}

// onclick button, fetch and display user profile detail
async function fetchUserProfileDetail() {
	// sent GET request at localhost:5000/api/customer/whoami
	// to get user profile. Fetch should timeout after 1 second
	const response = await fetch('http://localhost:5000/api/public/whoami', {
		method: 'GET',
		credentials: 'include',
	})
	.catch((error) => {
		alert(error);
		return null;
	});

	const jresponse = await response.json()
	if (!response.ok) {
		alert(`response not ok: ${jresponse.message}`);
		return null;
	}
	
	const data = jresponse.data;
	console.log(data);
	return data
}


function UserProfile() {
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
					<p>username_display: {user ? user.username_display : ""}</p>
					{/* <Button
						color="info"
						// onClick={() => setProfile("aaa")}
						onClick={displayDetail}
					>
						detail?
					</Button> */}
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
					Footer here
				</CardFooter>
			</Card>
		</div>
  );
}


export default function ProfilePage(props) {
  const router = useRouter();
  const classes = useStyles();

  const { ...rest } = props;

  return (
    <div>
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
