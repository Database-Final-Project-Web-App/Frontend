import React from "react";

import { makeStyles } from "@material-ui/core/styles";

import Button from "/components/CustomButtons/Button.js";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";

import styles from "/styles/jss/atrs/common.js"

import { authContext } from "../../auth/Context";
import * as CONSTANTS from "../../utils/constants"


styles.sections = {
	padding: "70px 0 0 0",
}

const useStyles = makeStyles(styles);

export default function SectionTest() {

	const classes = useStyles();

	const { user, setUser } = React.useContext(authContext);

	return (
		<div className={classes.sections}>
			<div className={classes.container}>
				<div className={classes.title}>
					<h2>Testing</h2>
				</div>
				<div id="buttons">
					<h3>Buttons</h3>
				</div>
				{/* for each value in CONSTANT.LOGINTYPE, create a button */}
				<GridContainer justify="center">
						<GridItem xs={12} sm={12} md={8}>
							{CONSTANTS.LOGINTYPE.map((logintype) => (
									<Button color="primary" onClick={() => setUser({logintype: logintype, username: logintype})}>
										{logintype ? logintype : "null"}
									</Button>
							))}
						</GridItem>
				</GridContainer>
			</div>
		</div>		
	)
}