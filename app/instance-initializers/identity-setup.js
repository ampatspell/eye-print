import { Promise } from 'rsvp';

export default {
  name: 'identity:setup',
  after: 'identity:store',
  initialize(app) {
    window.Promise = Promise;

    let state = app.lookup('service:models').create('state');
    app.register('service:state', state, { instantiate: false });

    app.inject('route', 'state', 'service:state');
    app.inject('component', 'state', 'service:state');

    app.inject('component', 'models', 'service:models');
  }
}
