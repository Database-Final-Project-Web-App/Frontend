/*
	The <Navbar /> component that
	- is shared by all pages
	- dynamically change content based on user login status
*/

import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { List, ListItem, Typography } from "@material-ui/core";

import Link from "next/link";

import Button from "/components/CustomButtons/Button.js";

import { authContext } from "/auth/Context";

// import commonStyle from "/styles/jss/atrs/commonStyle.js";
import headerLinksStyle from "/styles/jss/nextjs-material-kit/components/headerLinksStyle.js";

// overwwrite commonStyle with headerLinksStyle (if key duplicates, headerLinksStyle will be used)
const styles = headerLinksStyle;

const useStyles = makeStyles(styles);

export default function ATRSHeaderLinks() {
	const classes = useStyles();
	const { user } = React.useContext(authContext);

	return (
		<List className={classes.list}>
      <ListItem className={classes.listItem}>
        {/* display username */}
        {/* <Button
          href={user.username ? "/profile" : "/login"}
          className={classes.navLink}
          onClick={(e) => e.preventDefault()}
          color="transparent"
        >
          {user.username ? user.username : "Login/Register"}
        </Button> */}
        <Link href={user.username ? "/profile" : "/login"}>
          <a className={classes.navLink}>
            {user.username ? user.username : "Login/Register"}
          </a>
        </Link>
      </ListItem>
      { user.username ?
      <ListItem className={classes.listItem}>
        {/* display logout button */}
        <Button
          href="#pablo"
          className={classes.navLink}
          onClick={(e) => e.preventDefault()}
          color="transparent"
        >
          Logout
        </Button>
      </ListItem>
      : null
      }
    </List>
	);
}	