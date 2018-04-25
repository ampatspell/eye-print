import Store from 'ember-cli-zuglet/store';

const options = {
  firebase: {
    apiKey: "AIzaSyC2U9lzB9Kfqm4M4QbYOUm6yZ62uoAs0Lo",
    authDomain: "identity-737dd.firebaseapp.com",
    databaseURL: "https://identity-737dd.firebaseio.com",
    projectId: "identity-737dd",
    storageBucket: "identity-737dd.appspot.com",
    messagingSenderId: "742241930491"
  },
  firestore: {
    persistenceEnabled: false
  }
};

export default Store.extend({

  options

});
