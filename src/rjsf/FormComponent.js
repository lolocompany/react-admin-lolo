import React, {useState, useEffect, useRef,useContext} from 'react';
import * as ra from 'react-admin';
import { Box, Card } from '@material-ui/core';
import Form from "@rjsf/material-ui";
import { ResourceContext }  from '../views/Resource';
import { CustomToolbar } from '../components'
import { isEqual } from '../utils';

const FormComponent = (props) => {
  const [ formData, setFormData ] = useState({});
  const [ schemaState, setSchemaState ] = useState({})
	const [ hasErrors, setHasErrors ] = useState(true);
  
  const {
    schema: schemaProp,
    controllerData = {}
  } = props
  const { 
    basePath,
    record,
    resource,
    save,
    saving
  } = controllerData
  const { fields, widgets } = useContext(ResourceContext);
	const { uiSchema = {}, ...schema } = schemaProp
  let form;

  useEffect(() => setFormData(record), [ record ]);

  useEffect(() => {
    if(schema) {
      const {$id, ...restSchema} = schema
      setSchemaState(restSchema)
    }
  }, [schemaProp])

  function usePrevious(value) {
    const ref = useRef()
    if(!isEqual(ref.current, value)){
      ref.current = value
    }
    return ref.current
  }

  useEffect(() => {
    if(form) {
      setHasErrors(!!form.state.errors.length)
    }
  }, usePrevious(form))

  return (
    <React.Fragment>
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
    </React.Fragment>
  )
}

export default FormComponent