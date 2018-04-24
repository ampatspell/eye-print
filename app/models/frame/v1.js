import Frame from '../frame';

const withPixels = (pixels, cb) => {
  let { data, width, height } = pixels;
  let step = 4;

  let pixel = { i: 0, r: 0, g: 0, b: 0, a: 0 };

  const get = (pixel, x, y) => {
    let i = y * (width * step) + x * step;
    pixel.i = i;
    pixel.x = x;
    pixel.y = y;
    pixel.r = data[i];
    pixel.g = data[i + 1];
    pixel.b = data[i + 2];
    pixel.a = data[i + 3];
  };

  const set = pixel => {
    let i = pixel.i;
    data[i]     = pixel.r;
    data[i + 1] = pixel.g;
    data[i + 2] = pixel.b;
    data[i + 3] = pixel.a;
  }

  for(let x = 0; x < width; x++) {
    for(let y = 0; y < height; y++) {
      get(pixel, x, y);
      cb(pixel);
      set(pixel);
    }
  }
  return pixels;
}

const grayscale = pixels => withPixels(pixels, pixel => {
  let v = 0.7 * pixel.r + 0.5 * pixel.g + 0.5 * pixel.b;
  if(v > 128) {
    pixel.r = 0;
    pixel.g = 0;
    pixel.b = 0;
    pixel.a = 255;
  } else {
    pixel.a = 0;
  }
});

const dotted = pixels => withPixels(pixels, pixel => {
  if(pixel.a === 0) {
    return;
  }
  pixel.a = pixel.y % 2 === 0 || pixel.x % 2 !== 0 ? 255 : 0;
});

export default Frame.extend({

  load() {
    return {
      picture: this.stream.capture().then(blob => createImageBitmap(blob))
    };
  },

  picture(picture, width) {
    let scale = width / picture.width;
    let w = picture.width * scale;
    let h = picture.height * scale;

    let canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;

    let ctx = canvas.getContext('2d');
    ctx.drawImage(picture, 0, 0, w, h);

    let pixels = ctx.getImageData(0, 0, w, h);
    pixels = grayscale(pixels);
    pixels = dotted(pixels);
    ctx.putImageData(pixels, 0, 0);

    return canvas;
  },

  render({ ctx, size: { width, height }, picture }) {
    ctx.drawImage(this.picture(picture, width), 0, 0);
  }

});
