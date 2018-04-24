import EmberObject from '@ember/object';

export default EmberObject.extend({

  fn: null,

  run() {
    let spawn = requireNode('child_process').spawn;
    console.log(spawn);
  }

});
