import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { A } from '@ember/array';

export default EmberObject.extend({

  printer: computed(function() {
    return this.models.create('printer/printer');
  }),

  ready: readOnly('printer.ready'),

  queue: computed(function() {
    return A();
  }).readOnly(),

  _schedule(job) {
    let queue = this.queue;
    let last = this.queue.lastObject;

    queue.pushObject(job);

    let run = () => {
      job.promise.catch(() => {}).finally(() => queue.removeObject(job));
      job.run();
    };

    if(last) {
      last.promise.catch(() => {}).finally(() => run());
    } else {
      run();
    }

    return job;
  },

  schedule(fn) {
    let job = this.models.create('printer/job', { printer: this.printer, job: fn });
    return this._schedule(job);
  }

});
