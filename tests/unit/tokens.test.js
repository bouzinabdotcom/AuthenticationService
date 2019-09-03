const chai = require('chai'),
      expect = chai.expect,
      tokens = require('../../tokens'),
      chai_jwt = require('chai-jwt'),
      config = require('config');


chai.use(chai_jwt);
const  secret = config.get('jwt_secret');
describe('#Tokens', ()=> {
    describe('createToken()', () => {
        it('should create a signed token based on payload arg and ttl expiration', () => {
            const token = tokens.createToken({test: 'test'}, 60);
            expect(token).to.be.a.jwt;
            expect(token).to.be.signedWith(secret);
            expect(token).to.be.jwt.and.have.claim('test', 'test');
            expect(token).to.be.jwt.and.have.claim('exp');
        });
    });
});