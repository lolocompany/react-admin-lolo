import React from 'react';
import { useContext, useState } from 'react';
import { withTheme } from '@rjsf/core';
import { Create, Toolbar, SaveButton } from 'react-admin';
import { Theme as MaterialUITheme } from '@rjsf/material-ui';
import { Box } from '@material-ui/core';
import { ResourceContext }  from './Resource';

const Form = withTheme(MaterialUITheme);
const RProps = props => props.render(props);

const LoloCreate = props => {
	const [ formValid, setFormValid ] = useState(true);
	const { schema, uiSchema } = useContext(ResourceContext);
	let form;

	if (!schema) return null;

	return (
		<Create {...props} undoable={false}>
 			<RProps render={formProps => (
  			<Box p="1em">
  				<Box display="flex">
  					<Box flex={2} mr="1em">
							<Form
								ref={f => { form = f; }}
								schema={schema}
								uiSchema={uiSchema}
								formData={formProps.record}
								liveValidate={true}
								onChange={({ formData, errors }) => {
									Object.assign(formProps.record, form.state.formData);
									setFormValid(!errors.length)
								}}
								showErrorList={false}>
								{' '}
							</Form>
  					</Box>
  				</Box>
  			<Toolbar>
  				<Box display="flex" justifyContent="space-between" width="100%">
  					<SaveButton
  						saving={formProps.saving}
  						disabled={!formValid}
  						handleSubmitWithRedirect={() => formProps.save(form.state.formData)}
  					/>
  				</Box>
  			</Toolbar>
  		</Box>
  		)}/>
		</Create>
	);
};

export default LoloCreate