import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// react components for routing our app without refresh
import Link from "next/link";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons

// core components
// import HeaderLinks from "/components/Header/HeaderLinks.js";
import Footer from "/components/Footer/Footer.js";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import Button from "/components/CustomButtons/Button.js";
// sections for this page

import styles from "/styles/jss/nextjs-material-kit/pages/components.js";

import ATRSHeader from "/atrs-components/Header/ATRSHeader";
import ATRSFooter from "/atrs-components/Footer/ATRSFooter";

import SectionTest from "/atrs-sections/TestSections/SectionTest";

const useStyles = makeStyles(styles);

export default function Index(props) {
  const classes = useStyles();
  const { ...rest } = props;
  return (
    <div>
      <ATRSHeader {...rest} />
     
      <div className={classNames(classes.main)}>
        {/* <SectionTest /> */}
      </div>
      <ATRSFooter />
    </div>
  );
}
