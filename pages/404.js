// import React, { Component } from "react";
// import Router from "next/router";



// export default class _error extends Component {
//   // create a webpage that has a link back to the home page
//   render() {
//     return (
//       <div>
//         <h1>404 - Page Not Found</h1>
//         <p>
//           <a href="/">Go back home</a>
//         </p>
//       </div>
//     );
//   }
// }

import React from 'react';
import Link from 'next/link';
import { Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    textAlign: 'center',
    backgroundColor: theme.palette.background.default,
  },
  link: {
    marginTop: theme.spacing(2),
    color: theme.palette.primary.main,
    textDecoration: 'none',
  },
}));

export default function Custom404() {
  const classes = useStyles();

  return (
    <Container className={classes.root}>
      <Typography variant="h1">404 - Page Not Found</Typography>
      <Link href="/">
        <a className={classes.link}>Go back home</a>
      </Link>
    </Container>
  );
}