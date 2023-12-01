import React from "react";


/* 
	create a state for the user login status. The format is
	{
		"logintype": null | "customer" | "booking-agent" | "airline-staff"
		"username": null | "username"
	}
*/
export const authContext  = React.createContext({
	logintype: null,
	username: null,
	setUser: () => {}
});

export function AuthProvider({children}) {
	const [user, setUser] = React.useState({
		logintype: null,
		username: null
	});

	return (
		<authContext.Provider value={{user, setUser}}>
			{children}
		</authContext.Provider>
	);
}