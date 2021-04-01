import React from 'react';
import { useContext, useState, useEffect } from 'react';
import Form from "@rjsf/material-ui";
import { Box, Card } from '@material-ui/core';
import { ResourceContext }  from './Resource';
import { titleize, singularize } from 'inflection';
import * as ra from 'react-admin';
import CreateActions from './CreateActions';
import { isEqual } from '../dist/utils';

const Create = props => {
  const [ formData, setFormData ] = useState({});
  const [schemaState, setSchemaState] = useState({})
	const [ hasErrors, setHasErrors ] = useState(true);
  const { createSchema: schema, uiSchema, widgets, fields } = useContext(ResourceContext);
	let form;

  const {
    defaultTitle,
    record,
    resource,
    save,
    saving,
  } = ra.useCreateController({ ...props });

  function usePrevious(value) {
    const ref = React.useRef()
    if(!isEqual(ref.current, value)){
      ref.current = value
    }
    return ref.current
  }

  useEffect(() => {
    if(schema) {
      const {$id, ...restSchema} = schema
      setSchemaState(restSchema)
    }
  }, [schema])
  
  useEffect(() => {
    if(form) {
      setHasErrors(!!form.state.errors.length)
    }
  }, usePrevious(form))
  
	return (
    <div>
      <CreateActions {...props} />
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
            fields={fields}
            widgets={widgets}
						onChange={({ formData }) => {
              setFormData(formData);
            }}>
            {' '}
          </Form>
        </Box>
      </Card>
  		<ra.Toolbar>
        <Box display="flex" justifyContent="space-between" width="100%">
          <ra.SaveButton
            saving={saving}
            disabled={hasErrors}
            handleSubmitWithRedirect={() => save(formData)}
          />
        </Box>
  		</ra.Toolbar>
		</div>
	);
};

const getTitle = (resource = '') => {
  return 'Create ' + titleize(singularize(resource));
}

export default Create