import React, { useState, useEffect } from 'react';
import { useDataProvider } from 'react-admin';
import { transform } from 'inflection';
import ArrayField from '@rjsf/core/lib/components/fields/ArrayField';

const ReferenceManyField = props => {
  const [items, setItems] = useState([]);
  const dataProvider = useDataProvider();

  const typeCamel = props.name.replace(/Ids$/, '');
  const typeCamelPlural = transform(typeCamel, ['pluralize']);
  const typeDashPlural = transform(typeCamelPlural, ['underscore', 'dasherize']);

  useEffect(() => {
    dataProvider.sendRequest('/' + typeDashPlural).then(res => setItems(res.data[typeCamelPlural]));
  }, [dataProvider]);

  props.schema.uniqueItems = true;
  props.schema.items.enum = items.map(item => item.id);
  props.schema.items.enumNames = items.map(item => item.name);

  return <ArrayField {...props} />;
};

export default ReferenceManyField;
