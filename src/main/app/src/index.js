import React, { Suspense } from 'react';

import { MuiThemeProvider } from '@material-ui/core';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import 'typeface-open-sans';

import { postClientError } from '#/src/api/konfoApi';
import App from '#/src/App';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { useQueryOnce } from '#/src/hooks';
import ScrollToTop from '#/src/ScrollToTop';
import { getKonfoStore } from '#/src/store';
import { theme } from '#/src/theme';
import { configureI18n } from '#/src/tools/i18n';
import { configureUrls } from '#/src/urls';

const queryClient = new QueryClient();

if ('serviceWorker' in navigator) {
  if (!window.Cypress) {
    console.log('Registering service worker');
    navigator.serviceWorker
      .register('/konfo/service-worker-custom.js', { scope: '/konfo/' })
      .then(
        function (registration) {
          console.log('Service worker registration succeeded:', registration);
        },
        /*catch*/ function (error) {
          console.log('Service worker registration failed:', error);
        }
      );
  } else {
    console.log('Not registering service worker');
  }
}

window.onerror = (errorMsg, url, line, col, errorObj) => {
  postClientError({
    'error-message': errorMsg,
    url: url,
    line: line,
    col: col,
    'user-agent': window.navigator.userAgent,
    stack: '' + errorObj,
  });
};

const InitGate = ({ children }) => {
  const { status: urlStatus } = useQueryOnce('urls', configureUrls);
  const { status: i18nStatus } = useQueryOnce('i18n', configureI18n);
  if ([urlStatus, i18nStatus].includes('loading')) {
    return <LoadingCircle />;
  } else if ([urlStatus, i18nStatus].includes('error')) {
    return <div>Sovelluksen lataaminen epäonnistui!</div>;
  } else {
    return children;
  }
};

ReactDOM.render(
  <Suspense fallback={<LoadingCircle />}>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Provider store={getKonfoStore()}>
        <BrowserRouter basename={'/konfo'}>
          <MuiThemeProvider theme={theme}>
            <InitGate>
              <ScrollToTop />
              <App />
            </InitGate>
          </MuiThemeProvider>
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  </Suspense>,
  document.getElementById('wrapper')
);
