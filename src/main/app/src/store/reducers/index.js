import { combineReducers } from '@reduxjs/toolkit';
import koulutusSlice from './koulutusSlice';
import hakutulosSlice from './hakutulosSlice';
import oppilaitosSlice from './oppilaitosSlice';
import toteutusSlice from './toteutusSlice';

export default combineReducers({
  koulutus: koulutusSlice,
  oppilaitos: oppilaitosSlice,
  hakutulos: hakutulosSlice,
  toteutus: toteutusSlice,
});
