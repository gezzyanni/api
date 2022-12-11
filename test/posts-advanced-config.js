// import supertest from "supertest";
// import qa from '../config/qa'
// const request = supertest(qa.baseUrl); //Instead of these three we can put this in common.js file and common.js file

require('dotenv').config()
import request from "../config/common";
const { faker } = require('@faker-js/faker');

import { expect } from "chai";
import { createRandomUser } from "../helper/user_helper";

// const TOKEN = 'ed22240579e550bb16f6f67329f9de6cf40a4387c1974ecf2076afc8a9549c87'; // As we are taking token from .env file
const TOKEN = process.env.USER_TOKEN;

describe.only('Users Posts', () => {

    let postId, userId;
    /*
    before(() => {

        const userData = {
            "name": "Dewald Brewis",
            "email": `test-${Math.floor(Math.random() * 9999)}@yopmail.com`,  // To pass a random email everytime
            "gender": "male",
            "status": "active"
        };

        return request
            .post('users')
            .set("Authorization", `Bearer ${TOKEN}`)
            .send(userData)
            .then(async (res) => {
                console.log(res.body); 
                expect(res.body).to.deep.include(userData);
                userId = res.body.id;
                console.log(userId);
            }); 
    });
    */

    // Instead of addinf everything here we can put that in user_helper and call it here in before hook. And lets make the before block async
    before( async () => {
        userId = await createRandomUser(); //From this we are getting the userId of user created in createRandomUser();
    });

    it("/posts", async () => { 
        const data = {
            "user_id": userId,
            "title": "Equity",
            "body": "Equity dashboard"
        };
        const postRes = await request
            .post('posts')
            .set("Authorization", `Bearer ${TOKEN}`)
            .send(data)
        console.log(postRes.body); 
        expect(postRes.body).to.deep.include(data);
        postId = postRes.body.id;
    });      

    it("GET /posts/:id", async () => { 
        const res = await request
            .get(`posts/${postId}`)
            .set("Authorization", `Bearer ${TOKEN}`)
            .expect(200)
            //.expect(201) //To verify wether assretion works
    }); 

    describe('Negative Tests', () => {
        it("401 Authentication failed", async () => {   // Running the API test without sending token
            const data = {
                "user_id": userId,
                "title": "Equity",
                "body": "Equity dashboard"
            };
            const postRes = await request
                .post('posts')
                //.set("Authorization", `Bearer ${TOKEN}`)
                .send(data)
            console.log(postRes.body);
            console.log(postRes.status);
            expect(postRes.status).to.eq(401);
            expect(postRes.body.message).to.eq("Authentication failed");
        });

        it("422 Data validation failed", async () => {   // Sendind wrong data in payload of POST request
            const data = {
                "user_id": userId,
                "title": "Equity",
                //"body": "Equity dashboard" //Here we are not sending body in data that is required
            };
            const postRes = await request
                .post('posts')
                .set("Authorization", `Bearer ${TOKEN}`)
                .send(data)
            console.log(postRes.body);
            console.log(postRes.body[0].field);
            console.log(postRes.body[0].message);
            expect(postRes.status).to.eq(422);
            expect(postRes.body[0].field).to.eq("body");
            expect(postRes.body[0].message).to.eq("can't be blank");
        });

        it("Using Faker", async () => {   
            const data = {
                "user_id": userId,
                "title": faker.name.fullName(),  // faker.name.fullName() --> This will generate a random name
                "body": faker.lorem.sentence()   // faker.lorem.sentence() --> This will generate a random sentence
            };
            const postRes = await request
                .post('posts')
                .set("Authorization", `Bearer ${TOKEN}`)
                .send(data)
            console.log(postRes.body);
        });
    });
})