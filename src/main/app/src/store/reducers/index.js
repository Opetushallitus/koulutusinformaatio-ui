// import { combineReducers, con } from 'redux';
import { combineReducers } from '@reduxjs/toolkit';
import koulutusSlice from './koulutusSlice';
import hakutulosSlice from './hakutulosSlice';
import oppilaitosSlice from './oppilaitosSlice';

export default combineReducers({
  koulutus: koulutusSlice,
  oppilaitos: oppilaitosSlice,
  hakutulos: hakutulosSlice,
});
