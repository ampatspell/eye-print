import Component from '@ember/component';
import { Promise } from 'rsvp';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNameBindings: [ ':ui-route', ':ui-route-index' ],

  printer: service(),

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

  print(frame) {
    console.log(frame);
    let blob = frame.get('blob');
    this.printer.schedule(print => {
      print.text('Electron');
    });
  }

});
