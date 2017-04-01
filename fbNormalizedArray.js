  // 1. define the module and the other module dependencies (if any)
angular.module('fbNormalizedArray', ['firebase'])

.factory("$fbNormalizedArray", function ($firebaseArray, $firebaseObject) {

         /**
		  * $fbNormalizedArray 
          * Merge 2 firebase objects into one mutable object 
          * @ params
          * ref1 is the firebase ref you want to join on it with a foreign key ($id)
          * ref2 it the firebase ref you want to be joined with a primary key ($id)
          * alias1 is the property name of ref1 object default to $value
          * alias2 is the property name of ref1 object default to $extData
          *
          */
        return function(ref1, ref2, alias1, alias2, fKey) {


        // return merged mutable object of ref1 and ref2 with alias1 and alias2 as 2 original objects 
        return $firebaseArray.$extend({
            $$added: function(snap) {
                // allow the user to provide nested foreign key to join on 
                var child = fKey ? snap.val()[fKey] : snap.key;
                return $firebaseObject(ref2.child(child)).$loaded().then(function(data) {
                    // async merge  2 object with reference to the original one
                    // can't use shortcuts cause of the old webkit ionic runs on
                    // all upcoming 6 lines can be done in one single shortcut !!!!
                    var alias1Name = alias1 || "$value";
                    var alias2Name = alias2 || "$extData";
                    var object = {};
                    object.$id = snap.key;
                    object[alias1Name] = snap.val()
                    object[alias2Name] = angular.merge(data);

                    return object

                })

            },
            $$updated: function(snap) {
                    // get the index of the changed item 
                    var object = this.$list[this._indexCache[snap.key]];
                    // can't use shortcuts cause of the old webkit ionic runs on
                    var alias1Name = alias1 || "$value";
                    var object2 = {};
                    object2.$id = snap.key;
                    object2[alias1Name] = snap.val();

                    return angular.merge(object, object2)

                }
                // call $firebaseArray with ref1
                // @return promise
        })(ref1).$loaded();
    }

    })