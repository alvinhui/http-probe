var find = require('../lib/find');
var path = require('path');
var tag = require('../config/tag');

describe('find()', function() {
    it('should return the right result', function(done) {
        var filepath = path.join(process.cwd(), 'test', 'files', '1', '1.html');
        find(filepath, {
            ignores: ['ignoreme'],
            replaces: [
                {
                    from: ['$!{guiModule}'],
                    to: 'http://g.tbcdn.cn'
                }
            ],
            tags: tag
        }, function(err, file, allURLs, probeURLs, errorURLs, ignoreURLs, errorProbes){
            if (err) return done(err);

            file.should.equal(filepath);
            allURLs.length.should.equal(6);
            probeURLs.length.should.equal(3);
            errorURLs.length.should.equal(1);
            ignoreURLs.length.should.equal(1);
            errorProbes.length.should.equal(1);

            done();
        });
    });
});