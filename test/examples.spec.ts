import * as chai from 'chai';
import * as fg from 'fast-glob';
import * as path from 'path';
import * as cp from 'child_process';

const expect = chai.expect;

describe('examples', () => {
    const base = path.join(__dirname, '../examples');
    const files = fg.sync('**/*', { cwd: base });

    files.forEach((filePath) => {
        it(filePath, (done) => {
            const forked = cp.fork(path.join(base, filePath), [], {
            })

            forked.on('exit', (code, signal) => {
                expect(code).to.equal(0);
                expect(signal).to.be.null;
                done();
            })
        })
    })
});