import React, { useContext, Fragment } from 'react';
import * as ra from 'react-admin';
import { pluralize, inflect } from 'inflection';
import { ResourceContext } from '../views/Resource';
import { keyToRef, TextField } from '../utils';
import { ListActions, Filter } from '../components';
import { ListEmpty } from './';

const ExpandPanel = ({ id, record, resource }) => (
  <pre style={{ fontSize: '1.1rem' }}>{JSON.stringify(record, null, 2)}</pre>
);

const BulkActionButtons = props => (
  <Fragment>
    <ra.BulkDeleteButton {...props} />
  </Fragment>
);

const List = props => {
  const { listSchema: schema } = useContext(ResourceContext);

  if (!Object.keys(schema).length) return null;

  return (
    <ra.List
      {...props}
      bulkActionButtons={props.hasEdit ? <BulkActionButtons /> : false}
      filters={<Filter schema={schema} />}
      actions={<ListActions />}
      empty={<ListEmpty />}
      sort={{ field: 'createdAt', order: 'ASC' }}
      title={schema.title ? pluralize(schema.title) : undefined}
    >
      <ra.Datagrid
        rowClick={props.hasShow ? 'show' : props.hasEdit ? 'edit' : null}
        expand={props.expand || <ExpandPanel />}
      >
        {Object.entries(schema.properties).map(toField)}
      </ra.Datagrid>
    </ra.List>
  );
};

const toField = ([key, fieldSchema]) => {
  const fieldProps = {
    source: key,
    label: fieldSchema ? fieldSchema.title : '',
    key,
  };

  if (key.endsWith('Id')) return refField(fieldProps);
  if (key.endsWith('Ids')) return refManyField(fieldProps);
  if (fieldSchema.enum) return enumField(fieldProps, fieldSchema);

  switch (fieldSchema.type) {
    case 'string':
      return fieldSchema.format === 'date-time' ? (
        <ra.DateField {...fieldProps} showTime={true} />
      ) : (
        <ra.TextField {...fieldProps} />
      );

    case 'boolean':
      return <ra.BooleanField {...fieldProps} />;

    case 'integer':
    case 'number':
      return <ra.NumberField {...fieldProps} />;

    default:
      return null;
  }
};

const refField = ({ key, ...props }) => {
  return (
    <ra.ReferenceField reference={keyToRef(key)} key={key} {...props}>
      <TextField />
    </ra.ReferenceField>
  );
};

const refManyField = ({ key, label, ...props }) => {
  return (
    <ra.FunctionField
      label={label}
      render={record => {
        const count = (record[key] || []).length;
        return `${count} ${inflect('items', count)}`;
      }}
    />
  );
};

const enumField = (fieldProps, fieldSchema) => {
  const { enum: _enum, enumNames = [] } = fieldSchema;
  const choices = _enum.map((id, i) => ({ id, name: enumNames[i] || id }));

  return <ra.SelectField {...fieldProps} choices={choices} translateChoice={false} />;
};

export default List;
