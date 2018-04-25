import EmberObject from '@ember/object';

const sentencer = requireNode('sentencer');

const pad = (n, width) => {
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
};

export default EmberObject.extend({

  identifier: null,
  description: null,

  async build() {
    let now = new Date();
    let id = 1;
    this.setProperties({
      now,
      id,
      identifier: pad(id, 10),
      description: sentencer.make('{{ adjective }} {{ noun }}'),
      date: now.toLocaleString('LV-lv')
    });
  },

  async prepare() {

  },

  async save(blob) {

  }

});
