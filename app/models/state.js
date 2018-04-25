import EmberObject, { computed } from '@ember/object';
import { all, resolve } from 'rsvp';
import { inject as service } from '@ember/service';

export default EmberObject.extend({

  store: service(),

  last: computed(function() {
    return this.store.collection('identities').orderBy('identifier', 'desc').query({ type: 'first' });
  }).readOnly(),

  stream: computed(function() {
    return this.models.create('stream');
  }).readOnly(),

  printer: computed(function() {
    return this.models.create('printer');
  }).readOnly(),

  ready() {
    return resolve()
      .then(() => this.store.ready)
      .then(() => all([
        this.last.load(),
        this.stream.ready.catch(err => console.log(err)),
        this.printer.ready.catch(err => console.log(err))
      ])).then(() => {
        this.last.observe();
      }).then(() => this);
  },

  captureFrame() {
    return this.stream.capture().then(blob => createImageBitmap(blob));
  },

  async createFrame(details) {
    let picture = await this.captureFrame();
    let model = this.models.create('frame/v1', { picture, details });
    await model.promise;
    return model;
  },

  async recreateDetails() {
    let details = this.models.create('details', { state: this });
    await details.build();
    this.details = details;
    return details;
  },

  async createPreviewFrame() {
    let details = this.details;
    if(!details) {
      details = await this.recreateDetails();
    }
    return await this.createFrame(details);
  },

  async createPrintFrame() {
    let details = this.details;
    await details.prepare();
    let frame = await this.createFrame(details);
    await details.save(frame.blob);
    return frame;
  },

  async printFrame(frame) {
    this.printer.schedule(async printer => {
      await printer.image(frame.blob);
      await printer.feed(3);
    });
    await this.recreateDetails();
  }

});
