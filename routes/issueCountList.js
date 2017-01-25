var DocumentDBClient = require('documentdb').DocumentClient;
var async = require('async');

function IssueCountList(issueCountByLabelDao) {
  this.issueCountByLabelDao = issueCountByLabelDao;
}

IssueCountList.prototype = {
  showIssueCountReports: function (req, res) {
    var self = this;
    var reports = {};
    var repositories = [
      'azure-iot-sdk-c',
      'azure-iot-sdk-node',
      'azure-iot-sdk-python',
      'azure-iot-sdk-csharp',
      'azure-iot-sdk-java',
      'iothub-explorer',
      'iothub-diagnostics'
    ];

    function getReports (repo, callback) {
      var querySpec = {
          query: 'SELECT * FROM report WHERE report.name = \'' + repo + '\' ORDER BY report.at DESC'
      };
      console.log(querySpec.query);

      self.issueCountByLabelDao.find(querySpec, function(err, items) {
        if (err) {
          throw err;
        }
        console.log('got ' + items.length + ' issues for ' + repo);
        reports[repo] = items;
        callback();
      });
    }


    async.each(repositories, getReports, function(err) {
      if (err) {
        throw err;
      }

      res.render('index', {
        reports: reports
      });
    });
  }
};

module.exports = IssueCountList;
