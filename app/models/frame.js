import EmberObject, { computed } from '@ember/object';
import { Promise, resolve, reject } from 'rsvp';

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

  createBlob() {
    let width = 384;
    let height = 380;

    let canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.size = { width, height };

    return resolve()
      .then(() => this.render())
      .then(() => this.canvasToBlob(canvas));
  },

  invoke() {
    return resolve()
      .then(() => this.createBlob())
      .then(blob => this.set('blob', blob))
      .then(() => this, err => {
        console.log(err);
        return reject(err);
      });
  }

});
