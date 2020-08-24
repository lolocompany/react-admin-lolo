import React from 'react'
import Button from '@material-ui/core/Button'
import { withRouter } from 'react-router'

const BackButton = ({ history: { goBack }, children, ...props }) => (
  <Button {...props} onClick={goBack}>
    {children}
  </Button>
)

export default withRouter(BackButton)