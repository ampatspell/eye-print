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

  captureFrame() {
    return this.stream.capture().then(blob => createImageBitmap(blob));
  },

  async createFrame(details) {
    let picture = await this.captureFrame();
    let model = this.models.create('frame/v1', { picture, details });
    await model.promise;
    return model;
  },

  async createPreviewFrame() {
    let details = this.details;
    if(!details) {
      details = this.models.create('details');
      await details.build();
      this.details = details;
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
  }

});
