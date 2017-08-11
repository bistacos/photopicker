module.exports = function (app) {
    // api ---------------------------------------------------------------------

    app.get('/api/photos', function (req, res) {
      getPhotos(function(err, results) {
        if (err) { res.status(500).json(err) }
        else { res.status(200).json(results); }
      });
    });

    app.post('/api/photos/seed', function (req, res) {
      seedPhotos(function(err, results) {
        if (err) { res.status(500).json(err) }
        else { res.status(200).json(results); }
      });
    });

    app.post('/api/photos/purchased', function (req, res) {
      purchasePhotos(req.body.purchasedIds, function(err, results) {
        if (err) { res.status(500).json(err) }
        else { res.status(200).json(results); }
      });
    });

    app.delete('/api/photos/all', function (req, res) {
      clearDb(function(err, results) {
        if (err) { res.status(500).json(err) }
        else { res.status(200).json(results); }
      });
    });

    // DB Querying functions ----------------------------------------------------

    function getPhotos (callback) {
      // Get the current MongoDB collection
      var collection = app.db.collection('documents');
      collection.find({}).toArray(function(err, results) {
        callback(err, results);
      });
    }

    // for the purposes of this demo only. Obviously.
    function clearDb (callback) {
      var collection = app.db.collection('documents');
      collection.deleteMany({}, function(err, results) {
        console.log("Removed "+results.deletedCount+" records");
        callback(err, results.ops);
      });
    }

    function seedPhotos (callback) {
      var collection = app.db.collection('documents');
      collection.insertMany([
        { id : 1,
          filename: "che",
          img_path: "https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAAleAAAAJDRiZDE1ZmI1LWJlMzQtNDU0Yy04ZThkLTBhYzkxMzNiNDZlMA.jpg",
          purchased: false
        },
        { id : 2,
          filename: "max",
          img_path: "https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAAcqAAAAJGEzZmE0NjBmLTZlZmEtNDM0MS1hYWZmLWZhZTUxOGI2ZDhhZg.jpg",
          purchased: false
        },
        { id : 3,
          filename: "tim",
          img_path: "https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAAfDAAAAJDNjODcxZjM0LTJkYTUtNDk0Yi04ODhkLTM4NWFjMmUyZTg0NA.jpg",
          purchased: false
        },
        { id : 4,
          filename: "yixin",
          img_path: "https://media.licdn.com/mpr/mpr/shrinknp_400_400/p/7/000/2c1/308/1fdecf5.jpg",
          purchased: false
        }
      ], function(err, results) {
        console.log("Seeded the DB with 4 photos");
        callback(err, results.ops);
      });
    }

    function purchasePhotos (photoIds, callback) {
      if (Array.isArray(photoIds) === false) return callback('Parameter validation error in purchasePhotos()');
      var collection = app.db.collection('documents');
      collection.updateMany({ id: { $in: photoIds } }, { $set: { "purchased" : true }}, function(err, results) {
        console.log("Updated "+results.modifiedCount+" records");
        callback(err, results.ops);
      });
    }
};
