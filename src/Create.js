import React from 'react';
import { useContext, useState } from 'react';
import { withTheme } from '@rjsf/core';
import { Theme as MaterialUITheme } from '@rjsf/material-ui';
import { Box, Card } from '@material-ui/core';
import { ResourceContext }  from './Resource';
import * as ra from 'react-admin';
import CreateActions from './CreateActions';

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
  } = ra.useCreateController({ ...props });

  if (!schema) return null;

	return (
    <div>
      <CreateActions {...props} />
      <ra.TitleForRecord
        title={props.title}
        record={record}
        defaultTitle={defaultTitle}
      />
      <Card>
        <Box px={2} pb={1}>
					<Form
						ref={f => { form = f; }}
						schema={schema}
						uiSchema={uiSchema}
						formData={formData}
            showErrorList={false}
            liveValidate={liveValidate}
						onChange={({ formData, errors }) => {
              console.log('onChange', form && form.state);
              if (!liveValidate) setLiveValidate(true);
              setFormData(formData);
							setHasErrors(!!errors.length);
							}}
            onSubmit={({ formData })=> save(formData)}
            >
						{' '}
          </Form>
        </Box>
      </Card>
  		<ra.Toolbar>
  			<Box display="flex" justifyContent="space-between" width="100%">
  				<ra.SaveButton
  					saving={saving}
  					disabled={hasErrors}
  					handleSubmitWithRedirect={() => form.submit()}
  				/>
  			</Box>
  		</ra.Toolbar>
		</div>
	);
};

export default Create