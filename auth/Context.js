import React, { useEffect } from "react";
import Cookies from 'js-cookie';

/* 
	create a state for the user login status. The format is
	{
		"logintype": null | "customer" | "booking agent" | "staff"
		"username": null | "username"
	}
*/
export const authContext  = React.createContext({
	logintype: null,
	username: null,
	username_display: null,
	setUser: () => {}
});

export function AuthProvider({children}) {
	const [user, setUser] = React.useState({
		logintype: null,
		username: null,
		username_display: null
	});

	useEffect(() => {
		setUser({
			logintype: Cookies.get("logintype") ? Cookies.get("logintype") : null,
			username: Cookies.get("username") ? Cookies.get("username") : null,
			username_display: Cookies.get("username_display") ? Cookies.get("username_display") : null
		});
		console.log("use cookie to initialize user at webpage ");
	}, []);

	const updateUser = (newUser) => {
		// Note that these are not the actual session cookies used by the server
		// 		It's just a way to store user login status at the client side
		if (newUser == null) {
			setUser({
				logintype: null,
				username: null,
				username_display: null
			});
			Cookies.remove("logintype");
			Cookies.remove("username");
			Cookies.remove("username_display");
			console.log("cookie removed");
		}
		else {
			setUser(newUser);
			Cookies.set("logintype", newUser.logintype);
			Cookies.set("username", newUser.username);
			Cookies.set("username_display", newUser.username_display);
			console.log("cookie set, new user: ", newUser);
		}
		setUser(newUser);
	}

	return (
		<authContext.Provider value={{user, updateUser}}>
			{children}
		</authContext.Provider>
	);
}

// export function AuthProvider({children}) {
// 	const [user, setUser] = React.useState({
// 		logintype: null,
// 		username: null,
// 		username_display: null
// 	});

// 	const updateUser = (newUser) => {
// 		setUser(newUser);
// 	}

// 	return (
// 		<authContext.Provider value={{user, updateUser}}>
// 			{children}
// 		</authContext.Provider>
// 	);
// }