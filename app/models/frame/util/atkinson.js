// https://github.com/gazs/canvas-atkinson-dither/blob/master/worker.coffee
const lumninance = (pixels, r, g, b) => {
  let { data, width } = pixels;
  let len = data.length;
  for(let i = 0; i < len; i += 4) {
    let v = parseInt(data[i] * r + data[i + 1] * g + data[i + 2] * b, 10);
    data[i] = data[i + 1] = data[i + 2] = v;
  }
  return pixels;
};

const atkinson = pixels => {
  let { data, width } = pixels;
  let len = data.length;
  for(let i = 0; i < len; i += 4) {
    let neighbours = [ i + 4, i + 8, i + (4 * width) - 4, i + (4 * width), i + (4 * width) + 4, i + (8 * width) ];
    let mono = data[i] <= 128 ? 0 : 255
    let err = parseInt((data[i] - mono) / 8, 10);
    for(let n = 0; n < neighbours.length; n++) {
      data[neighbours[n]] += err;
    }
    data[i] = mono;
    data[i + 1] = data[i + 2] = data[i];
    data[i + 3] = mono ? 0 : 255;
  }
  return pixels;
};

export default (picture, width, zoom) => {
  let scale = width / picture.width;
  let w = picture.width * scale;
  let h = picture.height * scale;

  let zw = w * zoom;
  let zh = h * zoom;

  let ox = w / 2 - (zw / 2);
  let oy = h / 2 - (zh / 2);

  let canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;

  let ctx = canvas.getContext('2d');
  ctx.drawImage(picture, ox, oy, zw, zh);

  let pixels = ctx.getImageData(0, 0, w, h);
  pixels = lumninance(pixels, 0.3, 0.59, 0.11);
  pixels = atkinson(pixels);
  ctx.putImageData(pixels, 0, 0);

  return canvas;
}
