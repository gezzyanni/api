import supertest from "supertest";
const request = supertest('https://gorest.co.in/public/v2/');

import { expect } from "chai";
import { createRandomUser } from "../helper/user_helper";

const TOKEN = 'ed22240579e550bb16f6f67329f9de6cf40a4387c1974ecf2076afc8a9549c87';

describe('Users Posts', () => {

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

    // Instead of adding everything here we can put that in user_helper and call it here in before hook. And lets make the before block async
    before( async () => {
        userId = await createRandomUser(); //From this we are getting the userId of user created in createRandomUser();
    });

    it("/posts", async () => { // Here we are creating a new post and getting the postId of the post
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

    it("GET /posts/:id", async () => {  // Here we are getting the post by passing postId dynamically
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
    });

})