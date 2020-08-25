import * as React from 'react';
import Inbox from '@material-ui/icons/Inbox';
import inflection from 'inflection';

import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslate, useListContext } from 'ra-core';
import { CreateButton } from 'react-admin';
import ImportButton from './ImportButton';

const useStyles = makeStyles(
  theme => ({
    message: {
      textAlign: 'center',
      opacity: theme.palette.type === 'light' ? 0.5 : 0.8,
      margin: '0 1em',
      color:
      theme.palette.type === 'light'
      ? 'inherit'
      : theme.palette.text.primary,
    },
    icon: {
      width: '9em',
      height: '9em',
    },
    toolbar: {
      textAlign: 'center',
      marginTop: '2em',
    },
  }),
  { name: 'RaEmpty' }
  );

const Empty = props => {
  const { resource, basePath } = useListContext(props);
  const classes = useStyles(props);
  const translate = useTranslate();

  const resourceName = translate(`resources.${resource}.forcedCaseName`, {
    smart_count: 0,
    _: inflection.humanize(
      translate(`resources.${resource}.name`, {
        smart_count: 0,
        _: inflection.pluralize(resource),
      }),
      true
      ),
  });

  const emptyMessage = translate('ra.page.empty', { name: resourceName });
  const inviteMessage = translate('ra.page.invite');

  return (
    <>
      <div className={classes.message}>
        <Inbox className={classes.icon} />
        <Typography variant="h4" paragraph>
          {translate(`resources.${resource}.empty`, {
            _: emptyMessage,
            })}
        </Typography>
        <Typography variant="body1">
          {translate(`resources.${resource}.invite`, {
            _: inviteMessage,
            })}
        </Typography>
      </div>
      <div className={classes.toolbar}>
        <CreateButton variant="contained" basePath={basePath} />
        <ImportButton {...props} />
      </div>
    </>
  );
};

export default Empty;