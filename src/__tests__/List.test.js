import React from 'react'

describe('List test suite', () => {

  //DOM TEST
  test('test no listSchema available, to return null component', () => {
    /*
      ResourceContext should be mocked and the schema should be null

      List render should return null
    */
  })

  //DOM TEST
  test('test List rendering list based on props, listSchema and ResourceContext', () => {
    /* (List component level only)
      Mock test Data implementation
      
      Render list and pass mock data
      1.For ex: if props hasEdit -> would render <BulkAction...
      
      ResourceContext should be mocked and the schema should be passed accordingly

      Test values available based on props/contextData in DOM
    */
  })

  //DOM TEST
  test('test Filter component, render filters based on listSchema', () => {
    /*
      Pass testSchema

      Test DOM tags / by Role available and Values available in them (getByRole) 
    */
  })

  //UNIT TEST
  test('test toField to list data, render DOM nodes based on arguments', () => {
    /*
      Pass sample props based on schema to render data

      Test DOM tags rendered based on schema pass (byRole, byText) etc
    */
  })  
})