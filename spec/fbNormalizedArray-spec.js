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

  var arr, $firebaseArray, $timeout, $rootScope, $q, tick, $fbNormalizedArray;
  beforeEach(function () {
    module('firebase.database');
    module('fbNormalizedArray');
    inject(function (_$firebaseArray_, _$timeout_, _$rootScope_, _$q_, _$fbNormalizedArray_) {

      $timeout = _$timeout_;
      $firebaseArray = _$firebaseArray_;
      $rootScope = _$rootScope_;
      $q = _$q_;
      $fbNormalizedArray = _$fbNormalizedArray_;

      firebase.database.enableLogging(function () { tick() });
      tick = function () {
        setTimeout(function () {
          $q.defer();
          $timeout(function () {
            $rootScope.$digest();
          })
          try {
            $timeout.flush();
          } catch (err) {
            // This throws an error when there is nothing to flush...
          }
        })
      };

    });
  });


  describe('Read Query', function () {



    it('should work on a query', function (done) {

      var ref = stubRef();
      ref.set(STUB_DATA);

      var ref1 = ref.child('projects').child("iRehearse-App");
      var ref2 = ref.child('users');

      var arr = new $fbNormalizedArray(ref1, ref2, 'member', 'contact');

      arr.then(function (res) {
        expect(res[0].$id).toBe("James Gardner")
        expect(res[0].member.role).toBe("CTO")
        expect(res[0].contact.email).toBe("jawgardner@gmail.com")

        done();
      })
    });

    it('should work on a foreign Key', function (done) {
      var ref = stubRef();
      ref.set(STUB_DATA);

      var ref1 = ref.child('projects').child("iRehearse-Web").child("team");
      var ref2 = ref.child('users');

      // var arr = $firebaseArray(query).$loaded();

      var arr = new $fbNormalizedArray(ref1, ref2, 'member', 'contact', 'name');

      arr.then(function (res) {
        expect(res[0].member.name).toBe("Mohamed Habashy");
        expect(res[0].member.role).toBe("Collaborator");
        expect(res[0].contact.email).toBe("mohamed.habshey10@gmail.com");
        expect(res[0].contact.github).toBe("https://github.com/Mohamed-Habshey");

        expect(res[1].member.name).toBe("Sean");
        expect(res[1].member.role).toBe("Founder");
        expect(res[1].contact.$value).toEqual(null)

        done();
      })


    });

    it('should work without alias', function (done) {
      var ref = stubRef();
      ref.set(STUB_DATA);

      var ref1 = ref.child('projects').child("iRehearse-App");
      var ref2 = ref.child('users');

      var arr = new $fbNormalizedArray(ref1, ref2);

      arr.then(function (res) {
        expect(res[0].$id).toBe("James Gardner")
        expect(res[0].$value.role).toBe("CTO")
        expect(res[0].$extData.email).toBe("jawgardner@gmail.com")

        done();
      })


    });

    it('should work on Updated', function (done) {

      var ref = stubRef();
      ref.set(STUB_DATA);
      var ref1 = ref.child('projects').child("iRehearse-App");
      var ref2 = ref.child('users');

      var arr
      return new $fbNormalizedArray(ref1, ref2)

        .then(function (res) {

          arr = res;
          expect(res[0].$id).toBe("James Gardner");
          expect(res[0].$value.role).toBe("CTO")
          return expect(res[0].$extData.email).toBe("jawgardner@gmail.com")


        }).then(function () {
          var query = ref.child('projects').child("iRehearse-App").limitToFirst(1);
          return $firebaseArray(query).$loaded()
        })
        .then(function (result) {

          result[0].role = 'CPO';

          return result.$save(0);
        })
        .then(function () {

          expect(arr[0].$value.role).toBe("CPO")
        }).then(function () {
          return done();
        });




    }, 10000);

  });

  function stubRef() {
    return firebase.database().ref().push();
  }



});