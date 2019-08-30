const expect = require('chai').expect;
const mongoose = require('mongoose');
const db_connect = require('../../database');
const config = require('config');

const correct_username = "",
      correct_password = "",
      incorrect_username = "test",
      incorrect_password = "test";


console.log = () => 0;

describe('#Database', () => {
    describe ('connection', ()=>{
        afterEach((done) => {

            if(mongoose.connections.length) {
                mongoose.connections[0].close();
            }
            done();
        });
        it('should create a mongodb connection given the right credentials',async () => {
            

            await db_connect(correct_username, correct_password);

            expect(mongoose.connections.length).to.equal(1);
            expect(mongoose.connections[0].readyState).to.equal(1);
            expect(mongoose.connections[0].name).to.equal("test_myApp");
        });
        it('shouldn\'t create a mongodb connection given the wrong credentials',async () => {
            

            await db_connect(incorrect_username, incorrect_password);

            expect(mongoose.connections.length).to.equal(1);
            expect(mongoose.connections[0].readyState).to.equal(0);
        });
    });
});