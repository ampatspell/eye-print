import Service, { inject as service } from '@ember/service';

export default Service.extend({

  models: service(),

  schedule(fn) {
    let job = this.models.create('print/job', { fn });
    job.run();
    return job;
  }

});
