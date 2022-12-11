import supertest from "supertest";
const request = supertest('https://gorest.co.in/public/v2/');
//const { faker } = require('@faker-js/faker');

const TOKEN = 'ed22240579e550bb16f6f67329f9de6cf40a4387c1974ecf2076afc8a9549c87';

export const createRandomUser = async () => {

    const userData = {
        "name": "Dewald Brewis",
        "email": `test-${Math.floor(Math.random() * 9999)}@yopmail.com`,  // To pass a random email everytime
        //"email": faker.internet.email(), // To pass a random email everytime using faker
        "gender": "male",
        "status": "active"
    };

    const res = await request
        .post('users')
        .set("Authorization", `Bearer ${TOKEN}`)
        .send(userData)
    //userId = res.body.id;
    //console.log(userId);
    //console.log(res.body);
    return res.body.id;
};