import Component from '@ember/component';
import { Promise } from 'rsvp';
import { computed } from '@ember/object';
import { next } from '@ember/runloop';

export default Component.extend({
  classNameBindings: [ ':ui-route', ':ui-route-index' ],

  loop: computed(function() {
    let fn = () => this.capture();
    return this.models.create('loop', { fn });
  }).readOnly(),

  actions: {
    print() {
      if(this.loop.isSuspended) {
        return;
      }
      this.print();
    }
  },

  didInsertElement() {
    this._super(...arguments);
    this.loop.start();
  },

  willDestroyElement() {
    this._super(...arguments);
    this.loop.destroy();
  },

  capture() {
    return this.state.capture().promise.then(frame => {
      if(this.isDestroying) {
        return;
      }
      this.set('frame', frame);
    });
  },

  async print() {
    let enable = this.loop.suspend();
    let frame = this.frame;
    let blob = frame.blob;
    this.state.printer.schedule(async printer => {
      await printer.image(blob);
      await printer.flush();
      await enable(3000);
    });
  }

});
