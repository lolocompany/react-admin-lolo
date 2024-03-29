import React, { useContext, Fragment } from 'react';
import * as ra from 'react-admin';
import { pluralize, inflect } from 'inflection';
import { ResourceContext } from '../views/Resource';
import { keyToRef, TextField } from '../utils';
import { ListActions, Filter } from '../components';
import { ListEmpty } from './';

const Pagination = <ra.Pagination rowsPerPageOptions={[10, 15, 25, 50, 100, 250, 500]} />

const ExpandPanel = ({ id, record, resource }) => (
  <pre style={{ fontSize: '1.1rem' }}>{JSON.stringify(record, null, 2)}</pre>
);

const BulkActionButtons = props => (
  <Fragment>
    <ra.BulkDeleteButton {...props} />
  </Fragment>
);

const List = props => {
  const { listSchema, schema } = useContext(ResourceContext);

  if (!Object.keys(listSchema).length) return null;

  const filterSchema = JSON.parse(JSON.stringify(schema));
  delete filterSchema.properties.accountId;

  return (
    <ra.List
      bulkActionButtons={props.hasEdit ? <BulkActionButtons /> : false}
      filters={<Filter schema={filterSchema} />}
      actions={<ListActions />}
      empty={<ListEmpty />}
      sort={{ field: 'createdAt', order: 'ASC' }}
      title={listSchema.title ? pluralize(listSchema.title) : undefined}
      pagination={Pagination}
      perPage={15}
      {...props}
    >
      {props.children ? props.children : (<ra.Datagrid
        rowClick={props.hasShow ? 'show' : props.hasEdit ? 'edit' : null}
        expand={props.expand || <ExpandPanel />}
      >
        {Object.entries(listSchema.properties).map(toField)}
      </ra.Datagrid>
      )}
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
