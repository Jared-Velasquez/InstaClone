import {combineReducers} from 'redux';
import counterReducer from './counter';
import loggedReducer from './isLogged';
import accountData from './accountInfo';

const rootReducer = combineReducers({
    counter: counterReducer,
    isLogged: loggedReducer,
    accountInfo: accountData,
});

export default rootReducer;