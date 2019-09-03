const expect = require('chai').expect;
const error = require('../../error');

describe('#error', () => {
    it('should return an error object that has a type and a body', () => {
        const errorObject = error('typeOfError', 'aMessageOrBody');

        expect(errorObject).to.haveOwnProperty('type');
        expect(errorObject).to.haveOwnProperty('body');
        expect(errorObject.type).to.be.equal('typeOfError');
        expect(errorObject.body).to.be.equal('aMessageOrBody');
    });
});