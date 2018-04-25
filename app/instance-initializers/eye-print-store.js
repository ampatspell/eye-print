import register from 'ember-cli-zuglet/register';
import Store from '../store';

export default {
  name: 'eye-print:store',
  initialize(app) {
    register({
      app,
      store: {
        identifier: 'store',
        factory: Store
      }
    });
  }
};
