import { combineReducers } from 'redux';
import koulutusSlice from './koulutusSlice';
import hakutulosSlice from './hakutulosSlice';

export default combineReducers({
  koulutus: koulutusSlice,
  hakutulos: hakutulosSlice,
});
