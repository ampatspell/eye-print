import Component from '@ember/component';
import { Promise } from 'rsvp';
import { computed } from '@ember/object';
import { next } from '@ember/runloop';

export default Component.extend({
  classNameBindings: [ ':ui-route', ':ui-route-index' ],

  actions: {
    print() {
      this.print();
    }
  },

  didInsertElement() {
    this._super(...arguments);
    this.capture();
  },

  capture() {
    next(() => {
      this.state.capture().promise.then(frame => {
        this.set('frame', frame);
        next(() => this.capture());
      });
    });
  },

  async print() {
    let frame = this.frame;
    let blob = frame.blob;
    this.state.printer.schedule(async printer => {
      await printer.image(blob);
    });
  }

});
