import React from "react";

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