import React from 'react';
import { useContext } from 'react';
import { ResourceContext }  from './Resource';
import { titleize, singularize } from 'inflection';
import * as ra from 'react-admin';
import CreateActions from './CreateActions';
import FormComponent from './rjsf/FormComponent';

const Create = props => {
  const { createSchema } = useContext(ResourceContext);
  const controllerData = ra.useCreateController({ ...props });

	return (
    <div>
      <CreateActions {...props} />
      <ra.TitleForRecord
        title={props.title}
        record={controllerData.record}
        defaultTitle={getTitle(createSchema.title || controllerData.resource)}
      />
      <FormComponent 
        controllerData={controllerData}
        schema={createSchema}
      />
		</div>
	);
};

const getTitle = (resource = '') => {
  return 'Create ' + titleize(singularize(resource));
}

export default Create