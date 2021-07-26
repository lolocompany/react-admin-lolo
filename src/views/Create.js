import React, {useContext} from 'react';
import * as ra from 'react-admin';
import { titleize, singularize } from 'inflection';
import { ResourceContext }  from '../views/Resource';
import { CreateActions } from '../components';
import { FormComponent } from '../rjsf';

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