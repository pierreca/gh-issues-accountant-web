var DocumentDBClient = require('documentdb').DocumentClient;
var async = require('async');

function IssueCountList(issueCountByLabelDao) {
  this.issueCountByLabelDao = issueCountByLabelDao;
}

IssueCountList.prototype = {
    showIssueCountReports: function (req, res) {
        var self = this;
        var querySpec = {
            query: 'SELECT * FROM root r'
        };

        self.issueCountByLabelDao.find(querySpec, function (err, items) {
            if (err) {
                throw (err);
            }
            res.render('index', {
                title: 'Issues Count Reports',
                reports: items
            });
        });
    },
};

module.exports = IssueCountList;
