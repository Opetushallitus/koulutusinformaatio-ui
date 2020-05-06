import { getDefaultMiddleware, configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import reducer from './reducers';

const logger = createLogger({
  predicate: () => process.env.NODE_ENV === 'development',
});

const middleware = [...getDefaultMiddleware(), logger];

export function getKonfoStore() {
  const store = configureStore({
    reducer,
    middleware,
    devTools: process.env.NODE_ENV === 'development',
  });

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./reducers', () => store.replaceReducer(reducer));
  }
  return store;
}
