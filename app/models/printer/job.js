import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { defer } from 'rsvp';

export default EmberObject.extend({

  printer: null,
  job: null,

  init() {
    this._super(...arguments);
    this._deferred = defer();
  },

  promise: readOnly('_deferred.promise'),

  async run() {
    try {
      let printer = this.printer;
      await printer.reset();
      await this.job(printer);
      await printer.flush();
      this._deferred.resolve();
    } catch(err) {
      console.log('print/job', err);
      this._deferred.reject(err);
    }
  }

});
