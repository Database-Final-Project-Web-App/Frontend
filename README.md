# Database Final Project - Frontend

This is a fork from [NextJS Material Kit](https://github.com/creativetimofficial/nextjs-material-kit) by [Creative Tim](https://www.creative-tim.com/). This file documents the design of the frontend for the database final project. In particular, it covers the following topics:

- what webpages are there, and how are they linked together?

- what does each webpage do?

- What is the template (e.g. dashboard, home page, etc) of each webpage

- What are the components used in each webpage?

## Webpage Spec

What webpages are there, and how are they linked together?

* Home Page

  Linked to
  * login / register page
  * logged in user profile page
     * customer profile page
     * booking agent profile page
     * airline staff profile page

   Search result links to
     * flight page

* Flight Page

   Information about an individual flight

   Linked to
   * login / register page if not logged in
   * customer purchase page if logged in as customer
   * booking agent purchase page if logged in as booking agent

* Customer Purchase Page

* Booking Agent Purchase Page

* Login / Register Page

* Customer Profile Page

* Booking Agent Profile Page

* Airline Staff Profile Page

* 404 Page
  Links to 
  * home page

## Webpage Detail

What does each webpage do? What is the template (e.g. dashboard, home page, etc) of each webpage

* Home Page

   * Template: detailed search page

   * Functionality
     * Search for flights based on 
       * source city
       * source airport name
       * destination city
       * destination airport name
       * departure datetime
       * price
       * status
       
       Give a list of search result that displays
       * airport name
       * departure datetime
       * departure airport name
       * arrival datetime
       * arrival airport name
       * time to destination
       * price
       * status 
         Here, we display all upcoming and delayed flights chronologically, and collapse flights that are in progress.

    * A purchase button
      * if not logged in, display login / register button
      * if logged in as customer, display purchase button (link to customer purchase page)

    * Check flight status using
      * flight number
      * airport name

* Navbar
   * Template: navbar

   * Functionality
     * Display the name of the website
     * Auth
       * If no logged in user, display login / register button
       * If logged in as customer, display 
         * user (customer / booking agent) profile button (link to user profile)
         * logout button


* Flight Page

   * Template: info page

   * Functionality
     * Display flight info
       * flight number
       * departure date
       * departure time
       * arrival date
       * arrival time
       * airline name
       * total flight time
       * price
       * number of tickets left
      * Purchase
        * if not logged in, display login / register button
        * if logged in as customer, display purchase button (link to customer purchase page)
      

* Login / Register Page

   * Template: form submit page
       * Switch between login and register. 
       * User can submit login or register form.

   * Functionality
     * Login as customer / booking agent / airline staff
     * Register as customer / booking agent / airline staff
   
     * if login succeeds, redirect to user profile page
     * if register succeeds, redirect to login page
     * if login / register fails, display error message and stay on the same login / register page

* Customer Profile Page

   * Template: form submit page 

   * Functionality
     * Purchase a ticket for a flight as a customer

* Booking Agent Profile Page

   * Template: form submit page

   * Functionality
     * Purchase a ticket for a flight as a booking agent

* Customer Profile Page

   * Template: dashboard
       * A display of user info.
       * A sidebar to navigate between different components

   * Functionality
     * By default, display user info and all upcoming flights he/she booked

     * An option bar to filter booked flights by 
       * same options as search flights, including status
   
     * Track spending of the customer
       * Total amount spent within a date range. By default, date range is past year
       * Month-wise spending in the date range.

* Booking Agent Profile Page

   * Template: dashboard

   * Functionality
      * By default, display user info and all upcoming flights for which he/she purchased on behalf of customers 

      * An option bar to filter booked flights by 
        * same options as search flights, including status

      * Search for upcoming flights 

      * View commission earned by the booking agent
        * Total commission earned within a date range. By default, date range is last 30 days
        * Total number of tickets sold within a date range. By default, date range is last 30 days
        * A way to specify a range of date range

      * View top customers
        * Top 5 customers who bought the most number of tickets within a date range. By default, date range is last 6 months. Shown in a x-y plot
        * Top 5 customers who spent the most money within a date range. By default, date range is last 6 months. Shown in a x-y plot


* Airline Staff Profile Page

    * Template: dashboard
    
    * Functionality
        * faef

* 404 Page

    * Template: error page

## Webpage Components

This section documents the components used in each webpage. When presented with multiple choice of components, the order of choice is

1. NextJS Material Kit components

2. Material UI components

3. Custom components

Below are the components used in each webpage.

### Home Page

### Login / Register Page

### Customer Profile Page

### Booking Agent Profile Page

### Airline Staff Profile Page