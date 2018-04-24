import EmberObject from '@ember/object';
import { gt } from '@ember/object/computed';
import { next, later } from '@ember/runloop';
import { resolve, defer } from 'rsvp';

export default EmberObject.extend({

  fn: null,
  suspends: 0,

  isSuspended: gt('suspends', 0),

  init() {
    this._super(...arguments);
  },

  schedule() {
    next(() => {
      if(this.isDestroying || this.suspends > 0) {
        return;
      }
      resolve(this.fn()).catch(() => {}).finally(() => this.schedule());
    });
  },

  start() {
    this.schedule();
  },

  suspend() {
    let suspends = this.suspends + 1;
    this.set('suspends', suspends);

    let invoked = false;
    let deferred = defer();

    return delay => {
      if(invoked) {
        return;
      }
      invoked = true;

      later(() => {
        if(this.isDestroying) {
          return;
        }

        let suspends = this.suspends - 1;
        this.set('suspends', suspends);

        deferred.resolve();

        if(suspends === 0) {
          this.schedule();
        }
      }, delay);

      return deferred.promise;
    };
  },

  willDestroy() {
    this._super(...arguments);
  }

});
