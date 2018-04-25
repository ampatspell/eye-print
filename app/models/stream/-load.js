import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { defer } from 'rsvp';
import { readOnly } from '@ember/object/computed';

const maybe = (owner, fn) => {
  if(owner.isDestroying) {
    return;
  }
  return fn();
}

export default Mixin.create({

  isReady: false,
  isError: false,
  error: null,

  stream: null,

  _deferred: computed(function() {
    return defer();
  }).readOnly(),

  ready: readOnly('_deferred.promise'),

  size: computed('stream', function() {
    let stream = this.stream;
    if(!stream) {
      return;
    }
    let settings = stream.getVideoTracks()[0].getSettings();
    let { width, height } = settings;
    return {
      width,
      height
    };
  }).readOnly(),

  init() {
    this._super(...arguments);
    this._start();
  },

  _onStream(stream) {
    this.setProperties({
      isReady: true,
      stream
    });
    this._deferred.resolve(stream);
  },

  _onError(error) {
    this.setProperties({
      isError: true,
      error
    });
    this._deferred.reject(error);
  },

  _start() {
    navigator.mediaDevices.getUserMedia({ video: true }).then(
      stream => maybe(this, () => this._onStream(stream)),
      err => maybe(this, () => this._onError(err))
    );
  },

  _stop() {
  },

  willDestroy() {
    this._super(...arguments);
    this._stop();
  }

});
