import React from 'react';
import { useContext, useState, useEffect } from 'react';
import { Box, Card } from '@material-ui/core';
import { ResourceContext }  from './Resource';
import { titleize, singularize } from 'inflection';
import * as ra from 'react-admin';
import EditActions from './EditActions';
import CustomToolbar from './components/CustomToolbar'
import Form from "@rjsf/material-ui";

const Edit = props => {
  const [ formData, setFormData ] = useState({});
  const [ schemaState, setSchemaState ] = useState({})
	const [ hasErrors, setHasErrors ] = useState(true);
	const { editSchema, fields, widgets } = useContext(ResourceContext);
	const { uiSchema = {}, ...schema } = editSchema

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
  }, [editSchema])

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
  					schema={schemaState || {}}
  					uiSchema={uiSchema}
  					formData={formData}
            showErrorList={false}
            liveValidate={true}
            fields={fields}
            widgets={widgets}
  					onChange={({ formData, errors }) => {
              setFormData(formData);
  						setHasErrors(!!errors.length);
  					}}
            >
  					{' '}
  				</Form>
        </Box>
      </Card>
  		<CustomToolbar>
  			<Box display="flex" justifyContent="space-between" width="100%">
  				<ra.SaveButton
  					saving={saving}
  					disabled={hasErrors}
  					handleSubmitWithRedirect={() => save(formData)}
  				  />
  				<ra.DeleteButton
  					record={record}
  					basePath={basePath}
  					resource={resource}
            undoable={false}
  					/>
  			</Box>
  		</CustomToolbar>
    </div>
	);
};

const getTitle = (resource = '') => {
  return 'Edit ' + titleize(singularize(resource));
}

export default Edit