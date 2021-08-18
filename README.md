# react-admin-lolo
A Library for schema-driven web apps using [Lolo](https://lolo.company), [React Admin](https://github.com/marmelab/react-admin) and [RJSF](https://github.com/rjsf-team/react-jsonschema-form) at core.

From **Create, Read, Update, Delete** operations to more complex implementations such as Graphs, Autocomplete widgets and Map Integrations are **schema driven**. 

That is, *As Schema changes, the View, Components, Widgets change and operate accordingly.* 

## Installation
Create a new React app using custom configurations or create-react-app
```
npx create-react-app my-example-app
```

react-admin-lolo is available via npm as [Lolo](https://lolo.company) Org scoped publicly  available package. You can install it using:
```
npm install --save @lolocompany/react-admin-lolo
```
### Note:
react-admin-lolo requires a few dependencies to be installed along with it to operate as expected.
 - @aws-amplify/ui-react:  >=1.0.0
 - aws-amplify:  >=3.0.0
 - react-admin:  >=3.0.0
 - react-admin-import-csv:  >=1.0.0
```
npm install --save @aws-amplify/ui-react aws-amplify react-admin react-admin-import-csv
```
## Documentation

### Implementation
To generate base Layout, Menu, AppBar and Dashboard view out of the box, include the following code in your React App, `App.js` file. 
```javascript
// in App.js

import React from  'react';
import  {  LoloAdmin,  LoloResource  }  from  '@lolocompany/react-admin-lolo';
import { Layout } from './Layout'

function App() {
  return (
    <LoloAdmin
      apiUrl={process.env.REACT_APP_API_URL}
      title='My Admin'
      dashboard={() => <h1>Dashboard Panel!</h1>}
      layout={Layout}
    >
      <LoloResource
        name='directors'
      />
      <LoloResource
        name='movies'
      />
    </LoloAdmin>
  );
}

export default App;
```

### Customizing

#### Override Props

LoloResource supports the same override props as react-admin [Resource](https://marmelab.com/react-admin/Resource.html#the-resource-component). So for example, to customize the side menu icon and list view for directors:


```javascript
import UserIcon from  '@material-ui/icons/People';
import MyList from  './MyList';

<LoloResource  name='directors'  icon={UserIcon} list={MyList} />;

```

#### Schema Transforms

Schema transform functions help you manipulate the schema that is fetched from the respective resource's schema API. Each function recieves following values as arguments `transform(writableSchema, pristineSchema, selectedAccount)` where in:

-  `writableSchema`: Manipulated schema with updated/removed properties

-  `pristineSchema`: Original schema recieved from the resource's schema API

-  `selectedAccount`: Current account selected for the panel


The `LoloResource` component accepts the following schema tranform functions as props:

-  `listSchemaTransform`: Manipulates the `List` component schema. It helps in displaying selected fields on the table list. For Example, the following will only display _ID_ and _Name_ on the enterprise table:

```javascript
<LoloResource
  name="enterprises"
  listSchemaTransform={({ properties,  ...rest }, pristineSchema, selectedAccount)  =>  {
    const  {  id,  name  }  =  properties;
    return  {
      ...rest,
      properties:  {  id,  name  },
    };
  }}
/>
```

-  `createSchemaTransform`: Manipulates the `Create` component schema. For Example, the following will add an extra field _customId_ on the create form with a read only property:
  
```javascript
<LoloResource
  createSchemaTransform={(writableSchema, pristineSchema, selectedAccount)  => ({
    ...writableSchema,
    customId:  {  type:  'string',  readOnly:  true  },
  })}
/>
```  

-  `editSchemaTransform`: Manipulates the `Edit` component schema. For Example, the following will add an extra field _customId_ on the edit form:

```javascript
<LoloResource  editSchemaTransform={(writableSchema, pristineSchema, selectedAccount)  => ({...writableSchema, customId:  {type:  'string'}})} />
```