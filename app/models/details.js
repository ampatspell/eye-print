import EmberObject, { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import serverTimestamp from 'ember-cli-zuglet/util/server-timestamp';

const sentencer = requireNode('sentencer');

const pad = (n, width) => {
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
};

export default EmberObject.extend({

  state: null,
  store: service(),

  now: null,
  identifier: null,
  description: null,

  nowString: computed('now', function() {
    return this.now.toLocaleString('LV-lv');
  }).readOnly(),

  identifierString: computed('identifier', function() {
    return pad(this.identifier, 10);
  }).readOnly(),

  async build(previous) {
    let now = new Date();

    let identifier = this.get('state.last.content.data.identifier');
    if(identifier === undefined) {
      identifier = -1;
    }

    identifier++;

    this.setProperties({
      now,
      identifier,
      description: sentencer.make('{{ adjective }} {{ noun }}'),
    });
  },

  async prepare() {
    let { identifier } = this;

    let now = new Date();
    let doc = this.store.collection('identities').doc().new();

    doc.data.setProperties({
      identifier,
      description: this.description,
      created_at: now
    });

    doc.save();

    this.setProperties({ now, doc });
  },

  async _save(blob) {
    let doc = this.doc;

    let ref = this.store.storage.ref('identities').child(doc.id);
    let task = ref.put({
      type: 'data',
      data: blob,
      metadata: {}
    });
    await task.promise;
    
    doc.set('data.image_url', task.downloadURL);
    await doc.save();
  },

  save(blob) {
    this._save(blob);
  }

});
