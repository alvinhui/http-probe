var request = require('../lib/request');

describe('request()', function() {
    it('should return the probe result', function(done) {
        var urls = [
            'http://g.tbcdn.cn/kissy/k/1.4.0/seed-min.js',
            'http://g.tbcdn.cn/tb/global/3.3.35/global-min.js',
            'https://g.alicdn.com/tb/mtbframe/1.0.2/pages/home/base.css',
            'http://g.tbcdn.cn/error-min.css'
        ];

        request(urls, function(response, body){
            return body.match(/http:\/\//) ? true : false;
        }, function(err, probeReport, probeErrors){
            if(err) return done(err);

            var match = 0,
                noMatch = 0;
            probeReport.forEach(function(report){
                if(report.isMatch){
                    match++;
                } else {
                    noMatch++;
                }
            });

            match.should.equal(2);
            noMatch.should.equal(1);
            probeErrors.length.should.equal(1);

            done();
        });
    });
});