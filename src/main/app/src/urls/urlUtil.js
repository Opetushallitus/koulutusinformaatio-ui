import { production, development } from './urls';
import { urls } from 'oph-urls-js';

const configure = async () => {
  const { NODE_ENV } = process.env;
  if (['development', 'test'].includes(NODE_ENV)) {
    urls.addProperties(development);
    urls.addOverrides({
      'konfo-backend.content': 'https://konfo-content.untuvaopintopolku.fi/$1',
    });
  } else {
    await urls.load({ overrides: production });
  }
};

export default configure;
