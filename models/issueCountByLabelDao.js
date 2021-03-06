var DocumentDBClient = require('documentdb').DocumentClient;
var docdbUtils = require('./docdbUtils');

function IssueCountByLabelDao(documentDBClient, databaseId, collectionId) {
  this.client = documentDBClient;
  this.databaseId = databaseId;
  this.collectionId = collectionId;
  this.database = null;
  this.collection = null;
}

IssueCountByLabelDao.prototype = {
  init: function (callback) {
    var self = this;
    self.initialized = false;
    docdbUtils.getOrCreateDatabase(self.client, self.databaseId, function (err, db) {
      if (err) {
        callback(err);
      } else {
        self.database = db;
        docdbUtils.getOrCreateCollection(self.client, self.database._self, self.collectionId, function (err, coll) {
          if (err) {
            callback(err);
          } else {
            self.collection = coll;
            self.initialized = true;
            callback();
          }
        });
      }
    });
  },
  find: function (querySpec, callback) {
    var self = this;
    var executeQuery = function () {
      self.client.queryDocuments(self.collection._self, querySpec).toArray(function (err, results) {
        if (err) {
          callback(err);
        } else {
          callback(null, results);
        }
      });
    }
    if (self.initialized) {
      executeQuery();
    } else {
      console.log('db NOT initialized');
      self.init(function (err) {
        if (err) {
          console.log('db FAILED to initialize');
          callback(err);
        } else {
          console.log('db initialized');
          executeQuery();
        }
      })
    }
  },
  addItem: function (item, callback) {
    var self = this;
    item.date = Date.now();
    item.completed = false;
    self.client.createDocument(self.collection._self, item, function (err, doc) {
      if (err) {
        callback(err);
      } else {
        callback(null, doc);
      }
    });
  },
  updateItem: function (itemId, callback) {
    var self = this;
    self.getItem(itemId, function (err, doc) {
      if (err) {
        callback(err);
      } else {
        doc.completed = true;
        self.client.replaceDocument(doc._self, doc, function (err, replaced) {
          if (err) {
            callback(err);
          } else {
            callback(null, replaced);
          }
        });
      }
    });
  },

  getItem: function (itemId, callback) {
    var self = this;

    var querySpec = {
      query: 'SELECT * FROM root r WHERE r.id = @id',
      parameters: [{
        name: '@id',
        value: itemId
      }]
    };

    self.client.queryDocuments(self.collection._self, querySpec).toArray(function (err, results) {
      if (err) {
        callback(err);

      } else {
        callback(null, results[0]);
      }
    });
  }
};

module.exports = IssueCountByLabelDao;
