# react-admin-lolo
A library for schema-driven web apps using [Lolo](https://lolo.company), [React Admin](https://github.com/marmelab/react-admin) and [RJSF](https://github.com/rjsf-team/react-jsonschema-form)

## Usage
````
npx create-react-app movie-app
cd movie-app
npm install react-admin react-admin-import-csv \
	@rjsf/core @rjsf/material-ui aws-amplify @aws-amplify/ui-react \
	lolocompany/react-admin-lolo
````

````javascript
// in App.js
import React from "react";
import { LoloAdmin, LoloResource } from 'react-admin-lolo';

const App = () => (
  <LoloAdmin apiUrl={process.env.REACT_APP_API_URL}>
    <LoloResource name='movies' />
    <LoloResource name='directors' />
  </LoloAdmin>
);

export default App;
````

## Customizing

### Override Props

LoloResource supports the same override props as react-admin [Resource](https://marmelab.com/react-admin/Resource.html#the-resource-component). So for example, to customize the side menu icon and list view for directors:

````javascript
import UserIcon from '@material-ui/icons/People';
import MyList from './MyList';

<LoloResource name='directors' icon={UserIcon} list={MyList} />
````

### Schema Transforms

Schema transform functions help you manipulate the schema that is fetched from the respective resource's schema API. `LoloResource` component accepts the following schema tranform functions as props:

- `listSchemaTransform`: Manipulates the `List` component schema. It helps in displaying selected fields on the table list. For Example, the following will only display *ID* and *Name* on the enterprise table:

```javascript
<LoloResource
  name='enterprises'
  listSchemaTransform={({properties, ...rest}) => {
    const {id, name} = properties
    return {
      ...rest,
      properties: {id, name}
    }
  }} />
```

- `createSchemaTransform`: Manipulates the `Create` component schema. For Example, the following will add an extra field *customId* on the create form with a read only property:

```javascript
<LoloResource createSchemaTransform={(schema) => ({...schema, customId: {type: 'string', readOnly: true}})} />
```

- `editSchemaTransform`: Manipulates the `Edit` component schema. For Example, the following will add an extra field *customId* on the edit form:

```javascript
<LoloResource editSchemaTransform={(schema) => ({...schema, customId: {type: 'string'}}})} />
```

