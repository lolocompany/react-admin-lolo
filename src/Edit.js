import React from 'react';
import { useContext, useState, useEffect } from 'react';
import { Box, Card } from '@material-ui/core';
import { ResourceContext }  from './Resource';
import { titleize, singularize } from 'inflection';
import * as ra from 'react-admin';
import EditActions from './EditActions';
import Form from "@rjsf/material-ui";

const Edit = props => {
  const [ formData, setFormData ] = useState({});
  const [schemaState, setSchemaState] = useState({})
	const [ hasErrors, setHasErrors ] = useState(true);
	const { editSchema: schema, uiSchema } = useContext(ResourceContext);
	let form;

  const {
    basePath,
    record,
    resource,
    save,
    saving
  } = ra.useEditController({ ...props, undoable: false });

  useEffect(() => setFormData(record), [ record ]);

  useEffect(() => {
    if(schema) {
      const {$id, ...restSchema} = schema
      setSchemaState(restSchema)
    }
  }, [schema])

	return (
    <div>
      <EditActions {...props}/>
      <ra.TitleForRecord
        title={props.title}
        record={record}
        defaultTitle={getTitle(schemaState.title || resource)}
      />
      <Card>
        <Box px={2} pb={1}>
  				<Form
  					ref={f => { form = f; }}
  					schema={schemaState || {}}
  					uiSchema={uiSchema}
  					formData={formData}
            showErrorList={false}
            liveValidate={true}
  					onChange={({ formData, errors }) => {
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
  				<ra.DeleteButton
  					record={record}
  					basePath={basePath}
  					resource={resource}
            undoable={false}
  					/>
  			</Box>
  		</ra.Toolbar>
    </div>
	);
};

const getTitle = (resource = '') => {
  return 'Edit ' + titleize(singularize(resource));
}

export default Edit