import LoadMixin from './stream/-load';
import EmberObject from '@ember/object';
import { resolve } from 'rsvp';

export default EmberObject.extend(LoadMixin, {

  capture() {
    let stream = this.stream;
    let track = stream.getTracks()[0];
    let capture = new ImageCapture(track);
    return resolve(capture.takePhoto());
  }

});
