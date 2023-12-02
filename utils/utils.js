import Datetime from "react-datetime";
import { makeStyles } from "@material-ui/core";
import CustomInput from "/components/CustomInput/CustomInput.js";



const handleFieldChange = (fieldName) => (value) => {
	setFormData(prevFormData => ({ ...prevFormData, [fieldName]: value }));
};

const utilStyles = {};
utilStyles.datetimeField = {
	paddingTop: '27px',
	marginBottom: '17px',
}

const useUtilStyles = makeStyles(utilStyles);

export const renderInputField = (field) => {
	// overwrite datetime field in classes

	const utilClasses = useUtilStyles();


	switch (field.type) {
		case 'date':
		case 'time': 
		case 'datetime':
			return (
				<div className={utilClasses.datetimeField}>
					<Datetime
						inputProps={{ placeholder: field.label }}
						onChange={handleFieldChange(field.name)}
						dateformat={field.type === 'date' || field.type === 'datetime'}
						timeFormat={field.type === 'time' || field.type == 'datetime'}
					/>
				</div>
			);
		default:
			return (
				<CustomInput
					labelText={field.label}
					id={field.name}
					formControlProps={{
						fullWidth: true
					}}
					inputProps={{
						type: "text",
						onChange: (e) => handleFieldChange(field.name)(e.target.value)
					}}
				/>
			);
	}
};