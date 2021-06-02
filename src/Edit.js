import React from 'react';
import { useContext } from 'react';
import { ResourceContext }  from './Resource';
import { titleize, singularize } from 'inflection';
import * as ra from 'react-admin';
import EditActions from './EditActions';
import {FormComponent} from './rjsf';

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