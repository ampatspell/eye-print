import { Promise } from 'rsvp';

export default {
  name: 'eye-print',
  after: 'eye-print:store',
  initialize(app) {
    window.Promise = Promise;

    let state = app.lookup('service:models').create('state');
    app.register('service:state', state, { instantiate: false });

    app.inject('route', 'state', 'service:state');
    app.inject('component', 'state', 'service:state');

    app.inject('component', 'models', 'service:models');
  }
}
