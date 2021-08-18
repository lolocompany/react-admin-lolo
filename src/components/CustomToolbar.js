import React from 'react';
import { Toolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  toolbarStyle: {
    backgroundColor: theme.palette.grey[100],
    marginTop: theme.spacing(2),
  },
}));

const CustomToolbar = props => {
  const classes = useStyles();
  return <Toolbar className={classes.toolbarStyle}>{props.children}</Toolbar>;
};

export default CustomToolbar;
