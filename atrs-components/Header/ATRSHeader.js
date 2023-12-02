
import Header from "/components/Header/Header.js";
import ATRSHeaderLinks from "/atrs-components/Header/ATRSHeaderLInks.js";
import { Typography, Icon } from "@material-ui/core";

export default function ATRSHeader(props) {
	const { ...rest } = props;
	return (
		<Header
			brand = {
				<div style={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
					<img src="/img/favicon-32x32.png" alt="logo"  />
					<Typography variant="h6">
						FlyFinder
					</Typography>
				</div> 
			}
			// brand = "FlyFinder"
			rightLinks={
				<ATRSHeaderLinks />
			}
			fixed
			color="primary"
			{...rest}
    />
	)
}