import Frame from '../frame';
import atkinson from './util/atkinson';

const zoom = 5;

export default Frame.extend({

  load() {
    return {
      picture: this.stream.capture().then(blob => createImageBitmap(blob))
    };
  },

  picture(picture, width) {
    return atkinson(picture, width, zoom);
  },

  render({ ctx, size: { width, height }, picture }) {
    ctx.drawImage(this.picture(picture, width), 0, 0);
  }

});
