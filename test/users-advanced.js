import supertest from "supertest";
const request = supertest('https://gorest.co.in/public/v2/');

import { expect } from "chai";

const TOKEN = 'ed22240579e550bb16f6f67329f9de6cf40a4387c1974ecf2076afc8a9549c87';

describe.only('Users', ()=>{
    let userId;
    describe('POST', ()=>{
        it("/users", () => { 
            const data = {
                "name": "Dewald Brewis",
                //"email": "dewald@yopmail.com",
                "email": `test-${Math.floor(Math.random() * 9999)}@yopmail.com`,  // To pass a random email everytime
                "gender": "male",
                "status": "active"
            };

            return request
                .post('users')
                .set("Authorization", `Bearer ${TOKEN}`)
                .send(data)
                .then((res) => {
                    console.log(res.body); 
                    //data.email = 'testing@yopmail.com'  // Updated a wrong email in data to check if assertion works
                    expect(res.body).to.deep.include(data);
                    userId = res.body.id;
                    console.log(userId);
                });
        }); 
    });

    describe('GET', ()=>{
        it("/users", () => { 
            //Using return and then
            return request.get(`users?access-token=${TOKEN}`).then((res) => {
            expect(res.body).to.not.be.empty; 
            //expect(res.body).to.be.empty; // Purposely failing a test to check wether assertion works correctly
            });
        }); 
    
        it("/users/:id", () => { // To get users by id [Here user id = 4225 and user ids may keep getting deleted so you need to check the available users and use that usre id]
            return request.get(`users/${userId}?access-token=${TOKEN}`).then((res) => {
                //expect(res.body).to.not.be.empty; 
                //console.log(res.body);
                expect(res.body.id).to.be.eq(userId);
            });
        }); 

        it("/users with query params", () => { // Filtering the users data by gender, status etc
            const url = `users?access-token=${TOKEN}&gender=female&status=active`;
            return request.get(url).then((res) => {
                //console.log(res.body);
                expect(res.body).to.not.be.empty; 
                res.body.forEach((data) => {
                    expect(data.gender).to.eq('female');
                    expect(data.status).to.eq('active');
                });
            });
        }); 
    });

    describe('PUT', ()=>{
        it("/users/:id", () => { 
            const data = {
                "name": "Virat Kohli",
                "email": `test-${Math.floor(Math.random() * 9999)}@yopmail.com`,  // To pass a random email everytime
                "status": "active"
            };

            return request
                .put(`users/${userId}`)
                .set("Authorization", `Bearer ${TOKEN}`)
                .send(data)
                .then((res) => {
                    console.log(res.body); 
                    expect(res.body).to.deep.include(data);            
                });
        }); 
    }); 

    describe('DELETE', ()=>{
        it("/users/:id", () => { 
            return request
                .delete(`users/${userId}`)
                .set("Authorization", `Bearer ${TOKEN}`)
                .then((res) => {
                    console.log(res.body); 
                    expect(res.body).to.be.empty;     // If we run th delete request more than oce for the same user id we should get 'Resource not found' message  
                });
        }); 
    });

});