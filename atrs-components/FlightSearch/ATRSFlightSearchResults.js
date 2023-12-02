import React from 'react';


export default function ATRSFlightSearchResults(props) {
	const { searchResults } = props;

	return (
		<div>
			{searchResults.map((result, index) => (
				<div key={index}>
					{result.origin} to {result.destination} on {result.departureDate}
				</div>
			))}
		</div>
	);
}