import React, { useContext } from 'react';
import * as ra from 'react-admin';
import { titleize, singularize } from 'inflection';
import { ResourceContext }  from '../views/Resource';
import {EditActions} from '../components';
import {FormComponent} from '../rjsf';

const Edit = props => {
	const { editSchema } = useContext(ResourceContext);
  const controllerData = ra.useEditController({ ...props, undoable: false });

	return (
    <div>
      <EditActions {...props}/>
      <ra.TitleForRecord
        title={props.title}
        record={controllerData.record}
        defaultTitle={getTitle(editSchema.title || controllerData.resource)}
      />
      <FormComponent
        controllerData={controllerData}
        schema={editSchema}
      />
    </div>
	);
};

const getTitle = (resource = '') => {
  return 'Edit ' + titleize(singularize(resource));
}

export default Edit