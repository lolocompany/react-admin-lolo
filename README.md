# react-admin-lolo
Lolo wrapper for https://github.com/marmelab/react-admin

## Usage
````
npx create-react-app my-app
cd my-app
npm i lolocompany/react-admin-lolo
````

````
// in App.js
import React from "react";
import { LoloAdmin, LoloResource } from 'react-admin-lolo';

const App = () => (
  <LoloAdmin appId='your app id'>
    <LoloResource name='crud resource 1' />
    <LoloResource name='crud resource 2' />
  </LoloAdmin>
);

export default App;
````
