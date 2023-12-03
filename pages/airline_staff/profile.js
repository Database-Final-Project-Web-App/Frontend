import React, { useEffect, useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import NavPills from "/components/NavPills/NavPills.js";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import Card from "/components/Card/Card.js";
import CardHeader from '/components/Card/CardHeader.js';
import CardBody from "/components/Card/CardBody.js";
import CardFooter from "/components/Card/CardFooter.js";
import Button from "/components/CustomButtons/Button.js";

import ATRSHeader from "/atrs-components/Header/ATRSHeader.js";
import ATRSFooter from "/atrs-components/Footer/ATRSFooter.js";
import { authContext } from "/auth/Context.js";
import { isLogin, fetchUserProfileDetail } from "/utils/utils";
import styles from "/styles/jss/nextjs-material-kit/pages/components.js";

const useStyles = makeStyles(styles);

styles.sections = {
  padding: "100px 0 0 0",
	minHeight: "100vh",
};

function InfoPill({ info }) {
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

function FlightsPill() {
  // FlightsPill content here
}

function ClientsPill() {
  // ClientsPill content here
}


function UserProfile() {
  const router = useRouter();
  const { user } = useContext(authContext);
  const [profile, setProfile] = useState(null);

  const displayDetail = async () => {
    const data = await fetchUserProfileDetail();
    if (data) {
      setProfile({ item: data });
    } else {
      setProfile({ item: [] });
    }
  }

  useEffect(() => {
    isLogin().then((data) => {
      if (!data) {
        router.push("/login");
      } else {
        displayDetail();
      }
    });
  }, []);

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <NavPills
          color="rose"
          tabs={[
            {
              tabButton: "View My Info",
              tabContent: <InfoPill info={profile} />
            },
            {
              tabButton: "View Flights",
              tabContent: <FlightsPill />
            },
            {
              tabButton: "View Clients",
              tabContent: <ClientsPill />
            },
          ]}
          horizontal={{
            tabsGrid: { xs: 2, sm: 2, md: 3 },
            contentGrid: { xs: 12, sm: 8, md: 9 }
          }}
        />
      </GridItem>
    </GridContainer>
  );
}

export default function ProfilePage(props) {
  const classes = useStyles();
  const { ...rest } = props;

  return (
    <div className={classes.main}>
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
