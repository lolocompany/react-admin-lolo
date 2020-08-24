import React from 'react';
import { useContext, useState, useEffect } from 'react';
import { withTheme } from '@rjsf/core';
import { Toolbar, SaveButton } from 'react-admin';
import { useCreateController, TitleForRecord } from 'react-admin';
import { Theme as MaterialUITheme } from '@rjsf/material-ui';
import { Box } from '@material-ui/core';
import { ResourceContext }  from './Resource';

const Form = withTheme(MaterialUITheme);

const Create = props => {
  const [ formData, setFormData ] = useState({});
	const [ hasErrors, setHasErrors ] = useState(true);
  const [ liveValidate, setLiveValidate ] = useState(false);
	const { schema, uiSchema } = useContext(ResourceContext);
	let form;

  const {
    defaultTitle,
    record,
    save,
    saving,
  } = useCreateController({ ...props });

  //useEffect(() => setFormData(record), [ record ]);

  if (!schema) return null;

	return (
		<Box p="1em">
			<Box display="flex">
				<Box flex={2} mr="1em">
          <TitleForRecord
            title={props.title}
            record={record}
            defaultTitle={defaultTitle}
          />
					<Form
						ref={f => { form = f; }}
						schema={schema}
						uiSchema={uiSchema}
						formData={formData}
            showErrorList={false}
            liveValidate={liveValidate}
						onChange={({ formData, errors }) => {
              setLiveValidate(true);
              setFormData(formData);
							setHasErrors(!!errors.length);
							}}
            onSubmit={({ formData })=> save(formData)}
            >
						{' '}
					</Form>
				</Box>
			</Box>
  		<Toolbar>
  			<Box display="flex" justifyContent="space-between" width="100%">
  				<SaveButton
  					saving={saving}
  					disabled={hasErrors}
  					handleSubmitWithRedirect={() => form.submit()}
  				/>
  			</Box>
  		</Toolbar>
		</Box>
	);
};

export default Create