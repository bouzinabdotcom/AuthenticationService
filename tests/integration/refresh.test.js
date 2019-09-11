const database = require('../../database'),
      chai = require('chai'),
      expect = chai.expect,
      request = require('supertest'),
      chai_jwt = require('chai-jwt'),
      app = require('../../index'), 
      bcrypt = require('bcrypt'),
      {User} = require('../../user'),
      mongoose = require('mongoose'),
      config = require('config'),
      {createToken} = require('../../tokens');



chai.use(chai_jwt);

describe('#refresh', () => {

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

    it('should return a new access token if logged in.', (done) => {
        
        
        request(app)
            .post('/login')
            .send({username: 'test', pwd: 'test'})
            .expect(200)
            .end((err, res) => {
                if(err) done(err);

                expect(res.body).to.have.property('refresh');
                expect(res.body.refresh).to.be.jwt;


                request(app)
                    .post('/refresh')
                    .set('x-refresh-token',res.body.refresh)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.have.property("access");
                        expect(res.body.access).to.be.jwt;
                        done(err);
                    });
                
            });

        
        



    });

    it('should return an invalid token error (expired)', (done) => {
        
        const expired_refresh_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0b3JyNDI0ZzRrMGY3MjJ4MyIsImlzcyI6InRlc3QiLCJ1c2VyaWQiOiI1ZDc4ZDkyMTUzOTcwZDEwMGE3ZTcwMmEiLCJpYXQiOjE1NjgyMDIxMjgsImV4cCI6MTU2ODIwMjEyOX0.UsYCGaOiogDIGPTlKzm7V_Vd2cPGcJaBJKulmRZCHk0";
        request(app)
            .post('/refresh')
            .set('x-refresh-token', expired_refresh_token)
            .expect(400)
            .end((err, res) => {
                expect(res.body).to.have.property("type", "InvalidToken");
                expect(res.body).to.have.property("body", "jwt expired");
                done(err);
            });
        
    });

    it('should refurn an invalid token (not whitelisted)', (done) => {

        const payload = {
            userid: "testuser",
            jti: "testjti",
            iss: config.get('jwt_secret')
        };

        const not_whitlisted_token = createToken(payload, 10);

        request(app)
            .post('/refresh')
            .set('x-refresh-token', not_whitlisted_token)
            .expect(400)
            .end((err, res) => {
                if(err) done(err);

                expect(res.body).to.have.property('type', 'InvalidToken');
                expect(res.body).to.have.property('body', 'Token not valid for this application.');

                done();
            });
    });

    it('should refurn an invalid token (different issuer)', (done) => {

        const payload = {
            userid: "testuser",
            jti: "testjti",
            iss: "testIssuer"
        };

        const not_whitlisted_token = createToken(payload, 10);

        request(app)
            .post('/refresh')
            .set('x-refresh-token', not_whitlisted_token)
            .expect(400)
            .end((err, res) => {
                if(err) done(err);

                expect(res.body).to.have.property('type', 'InvalidToken');
                expect(res.body).to.have.property('body', 'Token not valid for this application.');

                done();
            });
    });

    after(async () => {

        await User.findOneAndDelete({username: 'test'});
        await mongoose.connections[0].close();
    });
});
