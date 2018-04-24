import Service from '@ember/service';
import { getOwner } from '@ember/application';
import { assign } from '@ember/polyfills';

export default Service.extend({

  create(name, props) {
    return getOwner(this).factoryFor(`model:${name}`).create(assign({ models: this }, props));
  }

});
