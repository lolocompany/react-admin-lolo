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

LoloResource supports the same override props as react-admin [Resource](https://marmelab.com/react-admin/Resource.html#the-resource-component). So for example, to customize the side menu icon and list view for directors:

````javascript
import UserIcon from '@material-ui/icons/People';
import MyList from './MyList';

<LoloResource name='directors' icon={UserIcon} list={MyList} />
````
