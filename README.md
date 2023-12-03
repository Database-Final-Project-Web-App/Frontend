# Database Final Project - Frontend

This is a fork from [NextJS Material Kit](https://github.com/creativetimofficial/nextjs-material-kit) by [Creative Tim](https://www.creative-tim.com/). This file documents the design of the frontend for the database final project. This project is powered by 

* [NextJS](https://nextjs.org/)

* [React](https://reactjs.org/)

* [Material UI](https://material-ui.com/)

## Routes

The following table lists the routes that are implemented in the frontend.

| Route | Description | Files |
| --- | --- | --- |
| `/` | Home page | `pages/index.js` |
| `/login` | Login / Register page | `pages/login.js` |
| `/purchase` | Purchase page | `pages/purchase.js` |
| `/search` | Public search page | `pages/search.js` |
| `/customer/profile` | Customer profile page | `pages/customer/profile.js` |
| `/booking_agent/profile` | Booking agent profile page | `pages/booking_agent/profile.js` |
| `/airline_staff/profile` | Airline staff profile page | `pages/airline_staff/profile.js` |
| `/airline_staff/manage` | Airline staff manage page | `pages/airline_staff/manage.js` |



## File Structure

We only list in details the files that are different from the original template. For the rest of the files, please refer to the original template.

```

atrs-components/		# reusable components
├── FlightSearch/
│   ├── ATRSFlightSearch.js: reusable component for search & check flight or ticket
├── Header/
│   ├── ATRSHeader.js: reusable component for header
|   ├── ATRSHeaderLinks.js: Navigation links on the header
├── Footer/
    ├── ATRSFooter.js: reusable component for footer

pages/			      	# pages
├── _app.js: main app component
├── index.js: home page
├── login.js: login page. Users can login or register as customer / booking agent / airline staff
├── purchase.js: purchase based on login type.
├── search.js: public search page. used to search for flights with filters, or check flight status using unique identifier `(flight number, airline_name)`
├── customer/
│   ├── profile.js: customer profile page. Implements all customer-specific use casescustomer profile page
├── booking-agent/
│   ├── profile.js: booking agent profile page. Implements all booking agent-specific use cases
├── airline-staff/
│   ├── profile.js: airline staff profile page. Implements all airline staff-specific use cases that do not require updating the database
│   ├── manage.js: airline staff manage page. Implements all airline staff-specific use cases that require updating the database
├── 404.js: 404 page. Contains a link that redirects to the home page

pills/							# modularized components that constitute the pages
├── airline_staff/	# we only do this for airline staff since it's the most complicated page
│   ├── manage/
│   │   ├── manage.js: modular components for airline staff manage page
│   ├── profile/
│   │   ├── profile.js: modular components for profile staff manage page

```





## Webpage Spec

This section documents the webpages that are implemented in the frontend, and their corresponding routes and functionalities.


### Home Page

### Login / Register Page

### Customer Profile Page

### Booking Agent Profile Page

### Airline Staff Profile Page