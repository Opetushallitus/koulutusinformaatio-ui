// import { combineReducers, con } from 'redux';
import { combineReducers } from '@reduxjs/toolkit';
import koulutusSlice from './koulutusSlice';
import hakutulosSlice from './hakutulosSlice';

export default combineReducers({
  koulutus: koulutusSlice,
  hakutulos: hakutulosSlice,
});
