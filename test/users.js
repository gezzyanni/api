import supertest from "supertest";
const request = supertest('https://gorest.co.in/public/v2/');

import { expect } from "chai";

const TOKEN = 'ed22240579e550bb16f6f67329f9de6cf40a4387c1974ecf2076afc8a9549c87';

describe('Users', ()=>{

    xit("GET /users", (done)=>{
        //request.get('users?access-token=8ad68b6d94a3809e61545c6395d0cf943bd6530f81a8c90188fa9df3eeedfbd1')
        request.get(`users?access-token=${TOKEN}`).end((err, res) => {
            //console.log('Error: ' + err);
            //console.log(res.body);

            //expect(res.body).to.not.be.empty;
            expect(res.body).to.be.empty; // Purposely failing a test to check whether assertion works
            done();
        })
    }) 

    xit("GET /users", () => { //Handling asyncronous behaviour of requests using return and then [Recommended] [Note: we need to remove err here]
        //Using return and then
        return request.get(`users?access-token=${TOKEN}`).then((res) => {
        console.log(res.body);
        //expect(res.body).to.not.be.empty; 
        expect(res.body).to.be.empty; // Purposely failing a test to check wether assertion works correctly
        });
    }); 

    xit("GET /users/:id", () => { // To get users by id [Here user id = 5484 and user ids may keep getting deleted so you need to check the available users and use that usre id]
        return request.get(`users/5484?access-token=${TOKEN}`).then((res) => {
            //expect(res.body).to.not.be.empty; 
            console.log(res.body);
            expect(res.body.id).to.be.eq(5484);
            expect(res.body.name).to.be.eq('Baalaaditya Devar');
            expect(res.body.email).to.be.eq('baalaaditya_devar@muller.org');
        });
    }); 

    xit("GET /users with query params", () => { // Filtering the users data by gender, status etc
        const url = `users?access-token=${TOKEN}&gender=male&status=inactive`;
        return request.get(url).then((res) => {
            console.log(res.body);
            expect(res.body).to.not.be.empty; 
            res.body.forEach((data) => {
                expect(data.gender).to.eq('female');
                expect(data.status).to.eq('inactive');
            });
        });
    }); 

    xit("POST /users", () => { 
        const data = {
            "name": "Marnus",
            //"email": "marnus@yopmail.com",
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
                // Asserting each data one by one
                /* 
                expect(res.body.name).to.be.eq(data.name);
                expect(res.body.email).to.be.eq(data.email);
                expect(res.body.gender).to.be.eq(data.gender);
                expect(res.body.status).to.be.eq(data.status);
                */

                // or

                // Assert all data at once
                //data.email = 'testing@yopmail.com'  // Updated a wrong email in data to check if assertion works
                expect(res.body).to.deep.include(data);
            });
    }); 

    xit("PUT /users/:id", () => { 
        const data = {
            "name": "Steve Smith",
            "email": `smith@yopmail.com`,  
            "status": "active"
        };

        return request
            .put('users/20520')
            .set("Authorization", `Bearer ${TOKEN}`)
            .send(data)
            .then((res) => {
                console.log(res.body); 
                expect(res.body).to.deep.include(data);            
            });
    }); 

    xit("DELETE /users/:id", () => { 
        return request
            .delete('users/3428')
            .set("Authorization", `Bearer ${TOKEN}`)
            .then((res) => {
                console.log(res.body); 
                expect(res.body).to.be.empty;     // If we run th delete request more than oce for the same user id we should get 'Resource not found' message  
            });
    });
})
