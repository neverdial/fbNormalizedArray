'use strict';

describe('fbNormalizedArray module', function () {
  var fb
  beforeAll(function (done) {
    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyAD5ZYMiagvgshLD5o8ZFzCtjwlj7JIFws",
      authDomain: "fbnormalizedarray.firebaseapp.com",
      databaseURL: "https://fbnormalizedarray.firebaseio.com",
      projectId: "fbnormalizedarray",
      storageBucket: "fbnormalizedarray.appspot.com",
      messagingSenderId: "224585557006"
    };
    firebase.initializeApp(config);
    console.log("Connected to firebase! ");
    fb = firebase.database().ref();
    done()

  })
  beforeEach(module('fbNormalizedArray'));


  it('should ....',
    function (done) {

      inject(function ($fbNormalizedArray, $firebaseArray, $rootScope) {
        //spec body

        expect($fbNormalizedArray).toBeDefined();
        var ref1 = fb.child('projects').child("iRehearse-App");
        var ref2 = fb.child('users');
        $firebaseArray(ref2).$loaded().then(function name(data) {
          console.log(JSON.stringify(data));
        }).catch(function (error) {
          console.log("Error:", error);
        });
         $rootScope.$digest();
        debugger;
        console.log($fbNormalizedArray);
        return new $fbNormalizedArray(ref1, ref2, 'member', 'contact')
          .then(function (data) {
            console.log(JSON.stringify(data));
            expect($fbNormalizedArray).toBeDefined();
            done();
          }).catch(function (error) {
            console.log(JSON.stringify(error));
            done();
          }).finally(function () {

            // calling done for this test to stop waiting for the asynchronous test
            done();
          });
        expect($fbNormalizedArray).toBeDefined();
        $rootScope.$digest();
      })
    }, 30000
  );


});