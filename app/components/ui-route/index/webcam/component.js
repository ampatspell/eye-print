import Component from '@ember/component';
import { htmlSafe } from '@ember/string';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  tagName: 'video',

  attributeBindings: [ 'style' ],

  stream: null,
  size: readOnly('stream.size'),

  style: computed('size', function() {
    let { size } = this;
    if(!size) {
      return;
    }
    return htmlSafe(`width: ${size.width}px; height: ${size.height}px`);
  }).readOnly(),

  onStream(stream) {
    if(this.isDestroying) {
      return;
    }
    let element = this.element;
    element.srcObject = stream;
    element.play();
  },

  didInsertElement() {
    this._super(...arguments);
    this.stream.ready.then(stream => this.onStream(stream));
  }

});
