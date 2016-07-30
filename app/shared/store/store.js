import { createStore, combineReducers, applyMiddleware } from 'redux'
import tableReducer from '../reducers/TableReducer.js'
import userReducer from '../reducers/UserReducer.js'
import logger from 'redux-logger'
import thunk from 'redux-thunk'

const middleware = applyMiddleware(thunk, logger());
const reducer = combineReducers({tableReducer,userReducer});
const store = createStore(reducer, middleware);


export default store;
