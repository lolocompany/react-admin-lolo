import React from 'react';
import * as ra from 'react-admin';

const CreateActions = ({ basePath, resource }) => (
  <ra.TopToolbar>
    <ra.ListButton basePath={basePath} resource={resource} />
  </ra.TopToolbar>
);

export default CreateActions;
