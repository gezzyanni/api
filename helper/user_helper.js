import supertest from "supertest";
const request = supertest('https://gorest.co.in/public/v2/');
//const { faker } = require('@faker-js/faker');

const TOKEN = '0506591d43f092fdeb15d66e38869a5d178830f87e7ae33f07911c5d4095af4b';

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