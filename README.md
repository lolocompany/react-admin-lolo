# react-admin-lolo

A library for schema-driven web apps using [Lolo](https://lolo.company), [React Admin](https://github.com/marmelab/react-admin) and [RJSF](https://github.com/rjsf-team/react-jsonschema-form)

## Usage

```
npx create-react-app movie-app
cd movie-app
npm install react-admin react-admin-import-csv \
	@rjsf/core @rjsf/material-ui aws-amplify @aws-amplify/ui-react \
	lolocompany/react-admin-lolo
```

```javascript
// in App.js
import React from 'react';
import { LoloAdmin, LoloResource } from 'react-admin-lolo';

const App = () => (
  <LoloAdmin apiUrl={process.env.REACT_APP_API_URL}>
    <LoloResource name="movies" />
    <LoloResource name="directors" />
  </LoloAdmin>
);

export default App;
```

## Customizing

### Override Props

LoloResource supports the same override props as react-admin [Resource](https://marmelab.com/react-admin/Resource.html#the-resource-component). So for example, to customize the side menu icon and list view for directors:

```javascript
import UserIcon from '@material-ui/icons/People';
import MyList from './MyList';

<LoloResource name="directors" icon={UserIcon} list={MyList} />;
```

### Schema Transforms

Schema transform functions help you manipulate the schema that is fetched from the respective resource's schema API. Each function recieves following values as arguments `transform(writableSchema, pristineSchema, selectedAccount)` where in:

- `writableSchema`: Manipulated schema with updated/removed properties
- `pristineSchema`: Original schema recieved from the resource's schema API
- `selectedAccount`: Current account selected for the panel

The `LoloResource` component accepts the following schema tranform functions as props:

- `listSchemaTransform`: Manipulates the `List` component schema. It helps in displaying selected fields on the table list. For Example, the following will only display _ID_ and _Name_ on the enterprise table:

```javascript
<LoloResource
  name="enterprises"
  listSchemaTransform={({ properties, ...rest }, pristineSchema, selectedAccount) => {
    const { id, name } = properties;
    return {
      ...rest,
      properties: { id, name },
    };
  }}
/>
```

- `createSchemaTransform`: Manipulates the `Create` component schema. For Example, the following will add an extra field _customId_ on the create form with a read only property:

```javascript
<LoloResource
  createSchemaTransform={(writableSchema, pristineSchema, selectedAccount) => ({
    ...writableSchema,
    customId: { type: 'string', readOnly: true },
  })}
/>
```

- `editSchemaTransform`: Manipulates the `Edit` component schema. For Example, the following will add an extra field _customId_ on the edit form:

```javascript
<LoloResource editSchemaTransform={(writableSchema, pristineSchema, selectedAccount) => ({...writableSchema, customId: {type: 'string'}}})} />
```
