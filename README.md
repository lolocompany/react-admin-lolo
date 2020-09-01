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
  <LoloAdmin appId='APP_ID'>
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




    "@aws-amplify/ui-react": "^0.2.16",
    "@rjsf/core": "^2.3.0",
    "@rjsf/material-ui": "^2.3.0",
    "@testing-library/jest-dom": "^4.2.4",
    "@testing-library/react": "^9.5.0",
    "@testing-library/user-event": "^7.2.1",
    "aws-amplify": "^3.0.25",
    "react": "^16.13.1",
    "react-admin": "^3.8.2",
    "react-admin-import-csv": "^0.2.19",
    "react-admin-lolo": "github:lolocompany/react-admin-lolo",
    "react-dom": "^16.13.1",
    "react-scripts": "3.4.3"