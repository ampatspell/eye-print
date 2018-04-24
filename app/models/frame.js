import EmberObject, { computed } from '@ember/object';
import { Promise, hash, resolve } from 'rsvp';
import { assign } from '@ember/polyfills';

export default EmberObject.extend({

  blob: null,

  url: computed('blob', function() {
    let blob = this.blob;
    if(!blob) {
      return;
    }
    return URL.createObjectURL(blob);
  }).readOnly(),

  init() {
    this._super(...arguments);
    this.promise = this.invoke();
  },

  canvasToBlob(canvas) {
    return new Promise(resolve => canvas.toBlob(blob => resolve(blob), 'image/png'))
  },

  createBlob(hash) {
    let width = 384;
    let height = 400;

    let canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    let ctx = canvas.getContext('2d');
    let size = { width, height };

    return resolve()
      .then(() => this.render(assign({ ctx, size }, hash)))
      .then(() => this.canvasToBlob(canvas));
  },

  invoke() {
    return resolve()
      .then(() => hash(this.load()))
      .then(hash => this.createBlob(hash))
      .then(blob => this.set('blob', blob))
      .then(() => this);
  }

});
