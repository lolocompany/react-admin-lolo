"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var ra = _interopRequireWildcard(require("react-admin"));

var _TextField = _interopRequireDefault(require("@material-ui/core/TextField"));

var _Autocomplete = _interopRequireDefault(require("@material-ui/lab/Autocomplete"));

var _CircularProgress = _interopRequireDefault(require("@material-ui/core/CircularProgress"));

var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));

var _Button = _interopRequireDefault(require("@material-ui/core/Button"));

var _CreateOutlined = _interopRequireDefault(require("@material-ui/icons/CreateOutlined"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _styles = require("@material-ui/core/styles");

var _parse = _interopRequireDefault(require("autosuggest-highlight/parse"));

var _inflection = require("inflection");

var _throttleDebounce = require("throttle-debounce");

var _Admin = require("../Admin");

var _utils = require("../utils");

var _useIsMountedRef = _interopRequireDefault(require("../hooks/useIsMountedRef"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const useStyles = (0, _styles.makeStyles)(theme => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2)
  }
}));

function ReferenceInputWidget(props) {
  const {
    id,
    value,
    onChange,
    schema,
    variant,
    uiSchema,
    showCreate = true
  } = props;

  const [inputValue, setInputValue] = _react.default.useState('');

  const [options, setOptions] = _react.default.useState([]);

  const [loading, setLoading] = _react.default.useState(false);

  const [findBy, setFindBy] = _react.default.useState('name');

  const {
    dataProvider
  } = _react.default.useContext(_Admin.AdminContext);

  const isMountedRef = (0, _useIsMountedRef.default)();
  const classes = useStyles();
  const typeCamel = id.split('_').pop().replace(/Id$/, '');
  const typePlural = (0, _inflection.transform)(typeCamel, ['underscore', 'dasherize', 'pluralize']);

  const getOptionsArray = arr => {
    return arr.map(v => ({
      id: v.id,
      value: v.name || v.id
    }));
  }; // TODO: handle readOnly


  const search = _react.default.useMemo(() => (0, _throttleDebounce.debounce)(500, async (filter, cb) => {
    if (isMountedRef.current) {
      setLoading(true);
      const res = await dataProvider.getList(typePlural, {
        filter,
        pagination: {
          perPage: 25
        }
      });
      setLoading(false); // Ugly hack for resources without a name field (createById)

      if (res.data.length && res.data.every(item => !item.name)) {
        setFindBy('id');
      }

      cb(res.data);
    }
  }), []);

  _react.default.useEffect(() => {
    if (loading) {
      return;
    } else if (value) {
      const selectedOption = options.find(opt => opt.value === value);

      if (selectedOption) {
        setInputValue(selectedOption.value);
      } else {
        (async () => {
          setLoading(true);

          try {
            const res = await dataProvider.getOne(typePlural, {
              id: value
            });

            if (res && res.data) {
              setInputValue(res.data.name || res.data.id);
              setOptions(getOptionsArray([res.data]));
            }
          } catch (err) {
            console.error('getOne', typePlural, value, err.message);
          }

          setLoading(false);
        })();
      }
    } else {
      search({
        [findBy]: inputValue
      }, results => {
        setOptions(getOptionsArray(results));
      });
    }
  }, [value, inputValue, search]);

  return /*#__PURE__*/_react.default.createElement(_Grid.default, {
    container: true
  }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
    item: true,
    xs: 11
  }, /*#__PURE__*/_react.default.createElement(_Autocomplete.default, {
    id: id,
    autoComplete: true,
    blurOnSelect: true,
    getOptionLabel: option => option.value,
    getOptionSelected: option => option && option.value === value,
    filterOptions: x => x,
    options: options,
    autoComplete: true,
    includeInputInList: true,
    filterSelectedOptions: true // value={value}
    ,
    inputValue: inputValue,
    onChange: (event, newValue) => {
      if (newValue) {
        setInputValue(newValue.value);
        onChange(newValue.id);
      } else {
        setInputValue('');
        onChange(undefined);
      }
    },
    onInputChange: (event, newInputValue) => setInputValue(newInputValue),
    renderInput: params => /*#__PURE__*/_react.default.createElement(_TextField.default, _extends({}, params, {
      label: schema && schema.title || typePlural,
      style: {
        minWidth: 186,
        margin: 4
      },
      variant: variant,
      InputProps: { ...params.InputProps,
        endAdornment: /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, loading ? /*#__PURE__*/_react.default.createElement(_CircularProgress.default, {
          color: "inherit",
          size: 18
        }) : null, params.InputProps.endAdornment)
      }
    }))
  })), /*#__PURE__*/_react.default.createElement(_Grid.default, {
    item: true,
    xs: 1,
    align: "right"
  }, showCreate ? /*#__PURE__*/_react.default.createElement(_Button.default, {
    style: {
      marginTop: 16
    },
    title: `Create new ${(0, _inflection.transform)(typeCamel, ['titleize'])}`,
    onClick: () => props.history.push(`/${typePlural}/create`)
  }, /*#__PURE__*/_react.default.createElement(_CreateOutlined.default, null)) : null));
}

var _default = ReferenceInputWidget;
exports.default = _default;