'use strict';


describe('$fbNormalizedArray', function () {
  beforeAll(function (done) {
    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyCcB9Ozrh1M-WzrwrSMB6t5y1flL8yXYmY",
      authDomain: "oss-test.firebaseapp.com",
      databaseURL: "https://oss-test.firebaseio.com",
      storageBucket: "oss-test.appspot.com"
    };
    firebase.initializeApp(config);
    console.log("Connected to firebase! ");

    done()

  })

  var STUB_DATA = {
    "projects": {
      "iRehearse-App": {
        "James Gardner": {
          "role": "CTO"
        },
        "Marwa": {
          "role": "Collaborator"
        },
        "Mohamed Habashy": {
          "role": "Lead"
        }
      },
      "iRehearse-Web": {
        "team": {
          "-Hynakeqkiyq": {
            "name": "Mohamed Habashy",
            "other": "asdasasd",
            "role": "Collaborator"
          },
          "-Hynakewte": {
            "name": "Sean",
            "role": "Founder"
          },
          "-Hynakewyq": {
            "name": "James Gardner",
            "other": "blalbla",
            "role": "Author"
          }
        }
      }
    },
    "users": {
      "James Gardner": {
        "email": "jawgardner@gmail.com",
        "github": "https://github.com/jawgardner"
      },
      "Marwa": {
        "github": "https://github.com/MarwaAbuEssa"
      },
      "Mohamed Habashy": {
        "email": "mohamed.habshey10@gmail.com",
        "github": "https://github.com/Mohamed-Habshey"
      }
    }
  };

  it('should ....',
    function (done) {

      inject(function ($fbNormalizedArray, $firebaseArray, $rootScope) {
        //spec body
      var ref = stubRef();

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