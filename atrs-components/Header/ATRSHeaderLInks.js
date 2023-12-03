/*
	The <Navbar /> component that
	- is shared by all pages
	- dynamically change content based on user login status
*/

import React from "react";
import Cookies from 'js-cookie';
import { useRouter } from "next/router";

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

export function ATRSHeaderLeftLinks() {
  const classes = useStyles();
  const { user } = React.useContext(authContext);

  return (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <Link href="/search">
          <a className={classes.navLink}>
            Search
          </a>
        </Link>
      </ListItem>
    </List>
  );
}


function LogoutButton() {

  const classes = useStyles();
  const { user, updateUser } = React.useContext(authContext);
  const [ routed, setRouted ] = React.useState(false);

  const router = useRouter();

  async function handleLogout() {
    // clear the copy of user info on client side
    //    otherwise, it could be invalid after logout
    await fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    }).catch((error) => {
      alert(error);
      return null;
    });

    updateUser(null);

    if (!routed) {
      router.push('/');
      setRouted(true);
    }
  }
  return (
    <Button
      href="#pablo"
      className={classes.navLink}
      onClick={handleLogout}
      color="transparent"
    >
      Logout
    </Button>
    
  )
}

export function ATRSHeaderRightLinks() {
	const classes = useStyles();
	const { user } = React.useContext(authContext);

	return (
		<List className={classes.list}>
      <ListItem className={classes.listItem}>
        <Link href={user && user.username ? `/${user.logintype}/profile` : "/login"}>
          <a className={classes.navLink}>
            {user && user.username ? user.username_display : "Login/Register"}
          </a>
        </Link>
      </ListItem>
      { user && user.username
        ?
        <ListItem className={classes.listItem}>
          <LogoutButton />
        </ListItem>
        : 
        null
      }
    </List>
	);
}	