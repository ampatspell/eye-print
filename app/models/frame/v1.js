import Frame from '../frame';
import atkinson from './util/atkinson';

export default Frame.extend({

  renderPicture() {
    let { ctx, picture, size: { width } } = this;

    let pic = atkinson(picture, width, 5);

    ctx.save();

    ctx.translate(width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(pic, 0, 0);
    ctx.restore();

    return pic.height;
  },

  renderId(o) {
    let { ctx, details } = this;

    ctx.fillStyle = '#000';
    ctx.textAlign = 'right';

    ctx.font = 'bold 50px Roboto Mono';
    ctx.fillText(details.id, this.size.width, o + 10);
  },

  renderDetails() {
    let { ctx, details } = this;

    ctx.fillStyle = '#000';
    ctx.textAlign = 'left';

    ctx.font = 'bold 23px Roboto Mono';
    ctx.fillText(`#${details.identifier}`, 0, 14);

    ctx.font = '23px Roboto Mono';
    ctx.fillText(details.description, 0, 35);

    ctx.font = 'bold 21px Roboto Mono';
    ctx.fillText(details.date, 0, 50);

    ctx.font = 'bold 26px Roboto Mono';
    ctx.textAlign = 'center';
    ctx.fillText('carry this at all times'.toUpperCase(), this.size.width / 2, 90);
  },

  render() {
    let ctx = this.ctx;

    let o = this.renderPicture();

    this.renderId(o);

    ctx.translate(0, o);
    this.renderDetails();
  }

});
