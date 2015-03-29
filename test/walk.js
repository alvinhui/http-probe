var walk = require('../lib/walk');
var _ = require('underscore');
var path = require('path');

describe('walk()', function() {
    it('should find the right type of file', function(done) {
        var types = ['html', 'vm'];
        var c = 0;
        walk({
            dirs: [path.join(process.cwd(), 'test', 'files', '1')],
            types: types,
            dirFilters: ['Temp', '_Temp']
        }, function(file, nextFile){
            var i = file.lastIndexOf('.')+1;
            var type = file.slice(i);

            _.indexOf(types, type).should.above(-1);
            c++;

            nextFile();
        }, function(err){
            if (err) return done(err);

            c.should.equal(4);
            done();
        });
    });
});