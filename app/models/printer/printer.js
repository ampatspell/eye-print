import EmberObject from '@ember/object';
import Mixin from '@ember/object/mixin';
import { Promise } from 'rsvp';

const names = [ 'flush', 'print', 'text', 'encode', 'font', 'style', 'align', 'size', 'feed' ];

const ForwardMixin = Mixin.create(names.reduce((hash, name) => {
  hash[name] = function() {
    let printer = this.printer;
    return printer[name].call(printer, ...arguments);
  }
  return hash;
}, {}));

export default EmberObject.extend(ForwardMixin, {

  init() {
    this._super(...arguments);
    this.ready = this.prepare().then(() => this);
  },

  async prepare() {
    let escpos = requireNode('escpos');
    this.escpos = escpos;
    this.device  = await escpos.USB.getDevice();
    this.printer = await escpos.Printer.create(this.device);
  },

  async reset() {
    await this.print('\x1b\x3f\x0a\x00');
    await this.print('\x1b\x40');

    await this.print('\x1c\x2e');
    await this.print('\x1b\x74\x19');
    await this.encode('1257');

    await this.font('a');
    await this.style('normal');
    await this.size(1, 1);
    await this.align('lt');
  },

  async image(blob) {
    const blobToBuffer = async blob => new Promise(resolve => {
      let reader = new FileReader();
      reader.onload = () => resolve(Buffer.from(reader.result));
      reader.readAsArrayBuffer(blob);
    });

    const PNGBufferToImage = buffer => new Promise(resolve => {
      this.escpos.Image.load(buffer, 'image/png', image => resolve(image));
    });

    let buffer = await blobToBuffer(blob);
    let image = await PNGBufferToImage(buffer);

    await this.printer.image(image);
  },

});
