# react-admin-lolo
A library for building schema-driven web apps using [Lolo](https://lolo.company) and [React Admin](https://github.com/marmelab/react-admin)

## Usage
````
npx create-react-app movie-app
cd movie-app
npm i lolocompany/react-admin-lolo
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
