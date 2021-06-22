import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router';
import * as ra from 'react-admin';
import traverse from 'traverse';

import Create from './Create';
import Edit from './Edit';
import List from './List';
import * as rjsf from './rjsf';
import { deepClone, removeReadonly } from './utils'
import { useAdminContext } from './hooks/useAdminContext'
import { singularize } from 'inflection';

const ResourceContext = React.createContext();

const Resource = props => {
  const {
    name,
    intent,
    editSchemaTransform = (schema) => ({...schema}),
    createSchemaTransform = (schema) => ({...schema}),
    listSchemaTransform = (schema) => ({...schema}),
  } = props;

  const [ schema, setSchema ] = useState({});
  const [ editSchema, setEditSchema ] = useState({});
  const [ createSchema, setCreateSchema ] = useState({});
  const [ listSchema, setListSchema ] = useState({})
  const { fields, widgets, selectedAccount } = useAdminContext();
  const dataProvider = ra.useDataProvider();

  useEffect(() => {
    if (intent !== 'route' || !selectedAccount || !dataProvider) return;

    dataProvider.sendRequest('/schemas/' + singularize(name))
      .then(({ data: pristineSchema }) => {
        delete pristineSchema.additionalProperties;
        setSchema(pristineSchema);

        const writableSchema = enableWidgets(removeReadonly(pristineSchema));

        setEditSchema(editSchemaTransform(
          writableSchema,
          pristineSchema,
          selectedAccount
        ));

        setCreateSchema(createSchemaTransform(
          writableSchema,
          pristineSchema,
          selectedAccount
        ));

        setListSchema(buildListSchema(
          listSchemaTransform,
          writableSchema,
          pristineSchema,
          selectedAccount
        ));
      });
  }, [ name, selectedAccount, dataProvider ]);

  return (
    <ResourceContext.Provider value={{ schema, editSchema, createSchema, listSchema, fields, widgets }}>
      <ra.Resource
        list={List}
        create={Create}
        edit={Edit}
        {...props}
      />
    </ResourceContext.Provider>
  );
};

const oneOf = part => part === 'oneOf';

const enableWidgets = (json) => {
  const { uiSchema = {}, ...schema } = deepClone(json)

  traverse(schema).forEach(function() {
    if (!/Ids?$/.test(this.key)) return;
    let path = this.path.filter(part => ![ 'properties', 'dependencies' ].includes(part));

    while (path.find(oneOf)) {
      path.splice(path.findIndex(oneOf) - 1, 3);
    }

    const schemaPatch = this.key.endsWith('s') ?
      { 'ui:field':  rjsf.ReferenceInputManyField } :
      { 'ui:widget': withRouter(rjsf.ReferenceInputWidget) };

    // Don't overwrite any existing uiSchema
    traverse(uiSchema).set(path, {
      ...schemaPatch,
      ...traverse(uiSchema).get(path)
    });
  });

  return { uiSchema, ...schema }
}

const buildListSchema = (listTransform, wrSchema, prSchema, selectedAccount) => {
  return listTransform({
    ...wrSchema,
    properties: {
      ...wrSchema.properties,
      createdAt: prSchema.properties.createdAt
    }
  }, prSchema, selectedAccount);
};

export {
  Resource,
  ResourceContext
}