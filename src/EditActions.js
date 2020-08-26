import React from 'react';
import * as ra from 'react-admin';

const EditActions = ({ basePath, resource }) => (
  <ra.TopToolbar>
    <ra.ListButton basePath={basePath} resource={resource} />
  </ra.TopToolbar>
);

export default EditActions