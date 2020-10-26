"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _redux = require("redux");

var _connectedReactRouter = require("connected-react-router");

var _reduxSaga = _interopRequireDefault(require("redux-saga"));

var _effects = require("redux-saga/effects");

var _reactAdmin = require("react-admin");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = ({
  authProvider,
  dataProvider,
  history
}) => {
  const reducer = (0, _redux.combineReducers)({
    admin: _reactAdmin.adminReducer,
    router: (0, _connectedReactRouter.connectRouter)(history) // add your own reducers here

  });

  const resettableAppReducer = (state, action) => reducer(action.type !== _reactAdmin.USER_LOGOUT ? state : undefined, action);

  const saga = function* rootSaga() {
    yield (0, _effects.all)([(0, _reactAdmin.adminSaga)(dataProvider, authProvider) // add your own sagas here
    ].map(_effects.fork));
  };

  const sagaMiddleware = (0, _reduxSaga.default)();

  const composeEnhancers = process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    trace: true,
    traceLimit: 25
  }) || _redux.compose;

  const store = (0, _redux.createStore)(resettableAppReducer, {
    /* set your initial state here */
  }, composeEnhancers((0, _redux.applyMiddleware)(sagaMiddleware, (0, _connectedReactRouter.routerMiddleware)(history) // add your own middlewares here
  ) // add your own enhancers here
  ));
  sagaMiddleware.run(saga);
  return store;
};

exports.default = _default;