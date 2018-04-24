import EmberObject, { computed } from '@ember/object';
import { all } from 'rsvp';

export default EmberObject.extend({

  stream: computed(function() {
    return this.models.create('stream');
  }).readOnly(),

  printer: computed(function() {
    return this.models.create('printer');
  }).readOnly(),

  ready() {
    return all([
      this.stream.ready.catch(err => console.log(err)),
      this.printer.ready.catch(err => console.log(err))
    ]).then(() => this);
  },

  capture() {
    let stream = this.stream;
    return this.models.create('frame/v1', { stream });
  }

});
