/*
	Webpage for
	- create new flights
	- change status of flights
	- add airplane in the system
	- add airport in the system
	- grant new permissions
	- add booking agents
*/


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

// pills
import { 
	ManageFlightsPill, 
	ManageAirplanesPill, 
	ManageAirportsPill, 
	ManageStaffsPill, 
	ManageAgentsPill,
} from "/pills/airline_staff/manage/manage.js";

import styles from "/styles/jss/nextjs-material-kit/pages/components.js";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles(styles);

styles.sections = {
  padding: "100px 0 0 0",
	minHeight: "100vh",
};


function StaffDashboard() {
  const router = useRouter();
  const { user } = useContext(authContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    isLogin().then((data) => {
      if (!data) {
        router.push("/login");
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
							tabButton: "Flights",
							tabContent: (
								<ManageFlightsPill />
							)
						},
						{
							tabButton: "Airplanes",
							tabContent: (
								<ManageAirplanesPill />
							)
						},
						{
							tabButton: "Airports",
							tabContent: (
								<ManageAirportsPill />
							)
						},
						{
							tabButton: "Staffs",
							tabContent: (
								<ManageStaffsPill />
							)
						},
						{
							tabButton: "Agents",
							tabContent: (
								<ManageAgentsPill />
							)
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
					<Typography variant="h3" >
						Staff Dashboard
					</Typography>
          <StaffDashboard />
        </div>
      </div>
      <ATRSFooter />
    </div>
  );
}
