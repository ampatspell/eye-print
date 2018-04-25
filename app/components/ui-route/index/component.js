import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNameBindings: [ ':ui-route', ':ui-route-index' ],

  loop: computed(function() {
    let fn = () => this.preview();
    return this.models.create('loop', { fn });
  }).readOnly(),

  actions: {
    print() {
      if(this.loop.isSuspended) {
        return;
      }
      this.print();
    }
  },

  didInsertElement() {
    this._super(...arguments);
    this.loop.start();
  },

  willDestroyElement() {
    this._super(...arguments);
    this.loop.destroy();
  },

  async preview() {
    let frame = await this.state.createPreviewFrame();

    if(this.isDestroying) {
      return;
    }

    this.set('frame', frame);
  },

  async print() {
    let resume = await this.loop.suspend();
    let frame = await this.state.createPrintFrame();

    if(this.isDestroying) {
      return;
    }

    this.set('frame', frame);

    await this.state.printFrame(frame);

    resume(5000);
  }

});
