# react-admin-lolo
Lolo wrapper for https://github.com/marmelab/react-admin

## Usage
````
npx create-react-app my-app
cd my-app
npm i lolocompany/react-admin-lolo
````

````javascript
// in App.js
import React from "react";
import { LoloAdmin, LoloResource } from 'react-admin-lolo';

const App = () => (
  <LoloAdmin appId='APP_ID'>
    <LoloResource name='posts' />
    <LoloResource name='comments' />
  </LoloAdmin>
);

export default App;
````
