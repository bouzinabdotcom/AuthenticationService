const database = require('../../database'),
      chai = require('chai'),
      {User} = require('../../user'),
      expect = chai.expect,
      char_jwt = require('chai-jwt'),
      app = require('express')(),
      request = require('supertest'),
      bcrypt = require('bcrypt'),
      mongoose = require('mongoose');




before(async () => {
    database('', '');
    const enc = await bcrypt.hash('test', 10);
    const test_user = new User({
        username: 'test',
        pwd: enc,
        email: {
            address: "test@test.test"
        }
    });
    await test_user.save();
    
});

after((done) => {
    User.findOneAndDelete({username: 'test'}, done);
    mongoose.connections[0].close(done);
    
});
describe('#Login', () => {
    it('should return access and refresh token in addition to user data and log the refresh token.', () => {

    });
});