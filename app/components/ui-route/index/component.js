import Component from '@ember/component';
import { Promise } from 'rsvp';
import { computed } from '@ember/object';

export default Component.extend({
  classNameBindings: [ ':ui-route', ':ui-route-index' ],

  actions: {
    run() {
      this.capture();
    }
  },

  didInsertElement() {
    this._super(...arguments);
    this.capture();
  },

  capture() {
    this.state.capture().promise.then(frame => {
      if(this.isDestroying) {
        return;
      }
      this.set('frame', frame);
      return this.print(frame);
    });
  },

  async print(frame) {
    let blob = frame.get('blob');
    this.state.printer.schedule(async printer => {
      await printer.image(blob);
    });
  }

});
