const database = require('../../database'),
      {User} = require('../../user'),
      chai = require('chai'),
      chai_jwt = require('chai-jwt'),
      expect = chai.expect,
      app = require('../../index'),
      request = require('supertest'),
      bcrypt = require('bcrypt'),
      mongoose = require('mongoose');


chai.use(chai_jwt);


describe('#Login', () => {
    before(async () => {
        await database('', '');
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
    
    
    it('should return access and refresh token in addition to user data and log the refresh token.', (done) => {
        request(app)
            .post('/login')
            .send({username: 'test', pwd: 'test'})
            .expect(200)
            .end((err, res) => {
                if(err) return done(err);
                ['access', 'refresh', 'user'].forEach(prop => expect(res.body).to.have.property(prop));
                expect(res.body.access).to.be.a.jwt;
                expect(res.body.refresh).to.be.a.jwt;
                ['_id', 'username', 'dateCreated', 'email', 'privilege'].forEach(prop => expect(res.body.user).to.have.property(prop));
                expect(res.body.user).to.not.have.property('pwd');
                done();
            });

        
    });

    it('should return a 400 response if username is wrong', (done) => {
        request(app)
            .post('/login')
            .send({username: "bad", pwd: 'test'})
            .expect(400)
            .end((err, res) => {
                if(err) done(err);

                expect(res.body).to.have.property('type', 'Authentication Error');
                expect(res.body).to.have.property('body', "Username or Password incorrect.");

                done();
            });
    });

    it('should return a 400 response if pwd is wrong', (done) => {
        request(app)
            .post('/login')
            .send({username: "test", pwd: 'bad'})
            .expect(400)
            .end((err, res) => {
                if(err) done(err);

                expect(res.body).to.have.property('type', 'Authentication Error');
                expect(res.body).to.have.property('body', "Username or Password incorrect.");

                done();
            });
    });

    it('should return a 500 response if there\'s a problem with db', (done) => {
        mongoose.connections[0].close();
       request(app)
            .post('/login')
            .send({username: "test", pwd: 'test'})
            .expect(500)
            .end((err, res) => {
                if(err) done(err);

                expect(res.body).to.have.property('type', 'Database Problem');
                expect(res.body).to.have.property('body', "Something went wrong.");

                database('', '');
                done();
            });

    });

    after(async () => {

        if(mongoose.connections.length == 1 && mongoose.connections[0].readyState == 0) {
            database('', '');
        }
        await User.findOneAndDelete({username: 'test'});
        await mongoose.connections[0].close();
    });
});