
/*
  This page is for airline staff to view their profile.
  - View My Info
  - View My Flights
  - view all booking agents
  - view frequent customers
  - view reports
    total amount of ticket sold within a time range, and a monthly bar chart
  - view pie chart for revenue earned from direct sale (customer) and indirect sale (agent)
  - view top destination
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
  InfoPill, 
  FlightsPill, 
  AgentsPill,
  FreqCustomersPill,
  ReportsPill,
  SalesPill,
  TopDestinationsPill,
} from "/pills/airline_staff/profile/profile.js";

import styles from "/styles/jss/nextjs-material-kit/pages/components.js";

const useStyles = makeStyles(styles);

styles.sections = {
  padding: "100px 0 0 0",
	minHeight: "100vh",
};


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
              tabContent: <InfoPill />
            },
            {
              tabButton: "View Flights",
              tabContent: <FlightsPill />
            },
            {
              tabButton: "View Booking Agents",
              tabContent: <AgentsPill />
            },
            {
              tabButton: "View Frequent Customers",
              tabContent: <FreqCustomersPill />
            },
            {
              tabButton: "View Reports",
              tabContent: <ReportsPill />
            },
            {
              tabButton: "View Sales",
              tabContent: <SalesPill />
            },
            {
              tabButton: "View Top Destinations",
              tabContent: <TopDestinationsPill />
            }
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
