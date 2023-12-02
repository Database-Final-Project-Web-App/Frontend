import React, { useState, useCallback } from 'react';
import Datetime from "react-datetime";
import 'react-datetime/css/react-datetime.css';
import { makeStyles } from "@material-ui/core";
import CustomInput from "/components/CustomInput/CustomInput.js";
import InputLabel from "@material-ui/core/InputLabel";

// Assuming utilStyles are defined somewhere in your project
const utilStyles = {
  datetimeField: {
    paddingTop: '27px',
    marginBottom: '17px',
  },
	label: {
		top: "10px",
		fontSize: "11px",
		lineHeight: "1.42857",
		letterSpacing: "unset",
  },
};

const useUtilStyles = makeStyles(utilStyles);

// This function should be part of the component that maintains formData state
function handleFieldChange(setFormData, fieldName, fieldType) {
  return (value) => {
    setFormData(prevFormData => {
      // Check if the value is a moment object (for date and datetime inputs)
			if (fieldType === 'date') {
        // validate if value is a moment object
        if (!value.format) {
          return { ...prevFormData, [fieldName]: value }
        }
        return { ...prevFormData, [fieldName]: value.format('YYYY-MM-DD') };
			}
			else if (fieldType === 'time') {
        if (!value.format) {
          return { ...prevFormData, [fieldName]: value };
        }
				return { ...prevFormData, [fieldName]: value.format('HH:mm:ss') };
			}
			else if (fieldType === 'datetime') {
        if (!value.format) {
          return { ...prevFormData, [fieldName]: value };
        }    
				return { ...prevFormData, [fieldName]: value.format('YYYY-MM-DD HH:mm:ss') };
			}
			else {
        // For other input types, value will be a standard event
        return { ...prevFormData, [fieldName]: value.target.value };
      }
    });
  };
}

export function validateFields(fieldsConfig, data) {
  // 1. if required but not filled in, alert user and return false
  for (const field of fieldsConfig) {
		if (field.required && (data[field.name] === undefined || data[field.name] === '')) {
			return { flag: false, message: `Required field ${field.label} is empty` };
	  }
  }

  // 2. if date/time/datetime format is invalid, alert user and return false
  //    This can be simplified because date/time/datetime fields are all moment objects
  for (const field of fieldsConfig) {
    if (!(field.type === 'date' || field.type === 'time' || field.type === 'datetime')) {
      continue;
    }
  }
  return { flag: true, message: '' };
}

export function renderInputField(field, setFormData) {
  const utilClasses = useUtilStyles();

  switch (field.type) {
    case 'date':
    case 'time': 
    case 'datetime':
      return (
        <div key={field.name} className={utilClasses.datetimeField}>
					<InputLabel className={utilClasses.label}>
						{field.required ? `${field.label} (Required)` : field.label}
					</InputLabel>
          <Datetime
            inputProps={{ placeholder: field.label }}
            onChange={handleFieldChange(setFormData, field.name, field.type)}
            dateFormat={field.type === 'date' || field.type === 'datetime'}
            timeFormat={field.type === 'time' || field.type === 'datetime'}
          />
        </div>
      );
    default:
      return (
        <CustomInput
          key={field.name}
          labelText={field.required ? `${field.label} (Required)` : field.label}
          id={field.name}
          formControlProps={{ fullWidth: true }}
          inputProps={{
            type: field.type || "text",
            onChange: handleFieldChange(setFormData, field.name, field.type)
          }}
        />
      );
  }
}
