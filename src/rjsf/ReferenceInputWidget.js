import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CreateIcon from '@material-ui/icons/CreateOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { transform } from 'inflection';
import { debounce } from "throttle-debounce";
import {useIsMountedRef, useAdminContext} from '../hooks';

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
}));

function ReferenceInputWidget(props) {
  const { id, value, onChange, schema, variant, uiSchema, showCreate = true } = props;

 	const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [findBy, setFindBy] = React.useState('name');
	const { dataProvider } = useAdminContext();
  const isMountedRef = useIsMountedRef()

	const classes = useStyles();

	const typeCamel = id.split('_').pop().replace(/Id$/, '');
  const typePlural = transform(typeCamel, [ 'underscore', 'dasherize', 'pluralize' ]);

  const getOptionsArray = (arr) => {
    return arr.map((v) => ({ id: v.id, value: v.name || v.id }))
  }

  // TODO: handle readOnly

  const search = React.useMemo(
    () => debounce(500, async (filter, cb) => {
    	if(isMountedRef.current) {
        setLoading(true);
        const res = await dataProvider.getList(typePlural, {
          filter,
          pagination: { perPage: 25 }
        });
        setLoading(false);

        // Ugly hack for resources without a name field (createById)
        if (res.data.length && res.data.every(item => !item.name)) {
          setFindBy('id');
        }

        cb(res.data);
      }
    }), []
  );

  React.useEffect(() => {
  	if (loading) {
  		return;

    } else if (value) {
    	const selectedOption = options.find(opt => opt.id === value);
    	if (selectedOption) {
    		setInputValue(selectedOption.value);
    	} else {
	    	(async () => {
	    		setLoading(true);
          try {
  					const res = await dataProvider.getOne(typePlural, { id: value });
            if (res && res.data) {
              setInputValue(res.data.name || res.data.id);
  						setOptions(getOptionsArray([ res.data ]));
  					}
          } catch (err) {
            console.error('getOne', typePlural, value, err.message);
          }
					setLoading(false);
	    	})();
	    }

    } else {
	    search({ [findBy]: inputValue }, results => {
	    	setOptions(getOptionsArray(results));
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
          getOptionLabel={option => (option.value || option)}
          getOptionSelected={option => option && option.id === value}
          filterOptions={x => x}
          options={options}
          autoComplete
          includeInputInList
          filterSelectedOptions
          value={inputValue}
          inputValue={inputValue}
          onChange={(event, newValue) => {
            if (newValue) {
              setInputValue(newValue.value);
              onChange(newValue.id);
            } else {
              setInputValue('');
              onChange(undefined);
            }
            }}
          onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
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
        />
      </Grid>
      <Grid item xs={1} align='right'>
        { showCreate ? (<Button
          style={{marginTop: 16}}
          title={`Create new ${transform(typeCamel, [ 'titleize']) }`}
          onClick={() => props.history.push(`/${typePlural}/create`)}>
          <CreateIcon />
        </Button>) : null}
      </Grid>
    </Grid>
  );
}

export default ReferenceInputWidget
