import React from 'react'
import { useEffect, useContext, useState } from 'react'
import { useRouter } from 'next/router'

import { authContext } from "/auth/Context.js";
import { isLogin, fetchUserProfileDetail } from '/utils/utils';

import { Container, Typography, TextField, Button, InputLabel, FormControl, Input } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Card from "/components/Card/Card.js";
import CardHeader from '/components/Card/CardHeader.js';
import CardBody from "/components/Card/CardBody.js";
import CardFooter from "/components/Card/CardFooter.js";

import styles from "/styles/jss/nextjs-material-kit/pages/components.js";

const useStyles = makeStyles(styles);


export function ManageFlightsPill() {
	/*
		- create new flights
		- change status of flights
	*/
}

export function ManageAirplanesPill() {
	/*
		- add airplane in the system
	*/
}

export function ManageAirportsPill() {
	/*
		- add airport in the system
	*/
}

export function ManageStaffsPill() {
	/*
		- grant new permissions to airline staffs
	*/
}

export function ManageAgentsPill() {
	/*
		- add booking agents
	*/
}