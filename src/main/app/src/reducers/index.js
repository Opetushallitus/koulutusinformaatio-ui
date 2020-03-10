import { combineReducers } from 'redux';
import koulutusSlice from './koulutusSlice';

export default combineReducers({
  koulutus: koulutusSlice,
});
