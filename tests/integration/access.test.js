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
      {createToken} = require('../../tokens'),
      objectID = mongoose.Types.ObjectId;


chai.use(chai_jwt);

describe('#access', () => {

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

    it('should return userid if access token is valid', (done) => {
        
        
        request(app)
            .post('/login')
            .send({username: 'test', pwd: 'test'})
            .expect(200)
            .end((err, res) => {
                if(err) done(err);

                expect(res.body).to.have.property('access');
                expect(res.body.access).to.be.jwt;


                request(app)
                    .post('/access')
                    .set('x-auth-token',res.body.access)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.have.property("userid");
                        expect(objectID.isValid(res.body.userid)).to.equal(true);
                        done(err);
                    });
                
            });

        
        



    });

    it('should return an invalid token error (expired)', (done) => {
        
        const expired_access_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJibG9nIiwidXNlcmlkIjoiNWQ3OGQ5MjE1Mzk3MGQxMDBhN2U3MDJhIiwicmp0aSI6IjRvcnI0MjJvOWsxMmkwdW1wIiwiaWF0IjoxNTY5NjExMjY5LCJleHAiOjE1Njk2MTMwNjl9.5wWaTiM_LJ5I16a2J3tOE9m4ShGghDINAu-NdIfg55k";
        request(app)
            .post('/access')
            .set('x-auth-token', expired_access_token)
            .expect(400)
            .end((err, res) => {
                expect(res.body).to.have.property("type", "InvalidToken");
                expect(res.body).to.have.property("body", "jwt expired");
                done(err);
            });
        
    });

    

    it('should return an invalid token (different issuer)', (done) => {

        const payload = {
            userid: "testuser",
            rjti: "testjti",
            iss: "testIssuer"
        };

        const not_issued_token = createToken(payload, 50);

        request(app)
            .post('/access')
            .set('x-auth-token', not_issued_token)
            .expect(400)
            .end((err, res) => {
                if(err) done(err);

                expect(res.body).to.have.property('type', 'InvalidToken');
                expect(res.body).to.have.property('body', 'Token not valid for this application.');

                done();
            });
    });

    it('should return an invalid token (missong property)', (done) => {

        const payload = {
            userid: "testuser",
            iss: "testIssuer"
        };

        const not_issued_token = createToken(payload, 50);

        request(app)
            .post('/access')
            .set('x-auth-token', not_issued_token)
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
