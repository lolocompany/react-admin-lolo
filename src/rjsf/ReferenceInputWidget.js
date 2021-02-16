import React from 'react';
import * as ra from 'react-admin';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CreateIcon from '@material-ui/icons/CreateOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import parse from 'autosuggest-highlight/parse';
import { transform } from 'inflection';
import { debounce } from "throttle-debounce";

import { AdminContext } from '../Admin';
import { keyToRef } from '../utils';

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
}));

function ReferenceInputWidget(props) {
  const { id, value, onChange, schema, variant, uiSchema } = props;

 	const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
	const { dataProvider } = React.useContext(AdminContext);

	const classes = useStyles();

	const typeCamel = id.split('_').pop().replace(/Id$/, '');
  const typePlural = transform(typeCamel, [ 'underscore', 'dasherize', 'pluralize' ]);

  // TODO: handle readOnly

  const search = React.useMemo(
    () => debounce(500, async (filter, cb) => {
    	setLoading(true);
			const res = await dataProvider.getList(typePlural, { 
				filter,
				pagination: { perPage: 25 }
			});
			setLoading(false);
			cb(res.data);
    }), []
  );

  React.useEffect(() => {
  	if (loading) {
  		return;

    } else if (value) {
    	const selectedOption = options.find(opt => opt.id === value);
    	if (selectedOption) {
    		setInputValue(selectedOption.name);

    	} else {
	    	(async () => {
	    		setLoading(true);
          try {
  					const res = await dataProvider.getOne(typePlural, { id: value });
  					if (res && res.data) {
  						setInputValue(res.data.name);
  						setOptions([ res.data ]);
  					} else {
  						setValue(undefined);
  					}
          } catch (err) {
            console.error('getOne', typePlural, value, err.message);
          }
					setLoading(false);
	    	})();
	    }

    } else {
	    search({ name: inputValue }, results => {
	    	setOptions(results);
	    });
	  }
  }, [value, inputValue, search]);

  return (
    <Grid container>
      <Grid item xs={11}>
        <Autocomplete
          id={id}
          autoComplete={true}
          blurOnSelect={true}
          getOptionLabel={option => option ? (option.name || option.id || '') : ''}
          getOptionSelected={option => option && option.id === value}
          filterOptions={x => x}
          options={options}
          autoComplete
          includeInputInList
          filterSelectedOptions
          value={value}
          inputValue={inputValue}
          onChange={(event, newValue) => {
            if (newValue) {
              setInputValue(newValue.name);
              onChange(newValue.id);
            } else {
              setInputValue('');
              onChange(undefined);
            }
            }}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={(schema && schema.title) || typePlural}
              style={{ minWidth: 186, margin: 4 }}
              variant={variant}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? <CircularProgress color="inherit" size={18} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
          renderOption={(option) => {
            return option.name || option.id
          }}
        />
      </Grid>
      <Grid item xs={1} align='right'>
        <Button
          style={{marginTop: 16}}
          title={`Create new ${transform(typeCamel, [ 'titleize']) }`}
          onClick={() => props.history.push(`/${typePlural}/create`)}>
          <CreateIcon />
        </Button>
      </Grid>
    </Grid>
  );
}

export default ReferenceInputWidget
