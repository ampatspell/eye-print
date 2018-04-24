import EmberObject, { computed } from '@ember/object';
import { resolve } from 'rsvp';

export default EmberObject.extend({

  stream: computed(function() {
    return this.models.create('stream');
  }).readOnly(),

  ready() {
    return this.stream.ready.catch(err => {
      console.log(err);
    });
  },

  capture() {
    let stream = this.stream;
    return this.models.create('frame/v1', { stream });
  }

});
