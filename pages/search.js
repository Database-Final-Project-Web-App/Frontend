import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import ATRSHeader from "/atrs-components/Header/ATRSHeader";
import ATRSFooter from "/atrs-components/Footer/ATRSFooter";
import ATRSFlightSearch from "/atrs-components/FlightSearch/ATRSFlightSearch";

import styles from '/styles/jss/nextjs-material-kit/pages/components.js';

styles.section = {
	padding: '140px 0 70px 0',
}

const useStyles = makeStyles(styles);

export default function Search(props) {
	const classes = useStyles();
	const { ...rest } = props;

	return (
    <div>
      <ATRSHeader {...rest} />
      <div className={classes.main}>
        <div className={classes.container}>
          <div className={classes.section}>
						<ATRSFlightSearch />
          </div>
        </div>
      </div>
      <ATRSFooter />
    </div>
	);
}