import { expect } from "chai";
import supertest from "supertest";

const request = supertest('https://gorest.co.in/public/v2/');

const TOKEN = '0506591d43f092fdeb15d66e38869a5d178830f87e7ae33f07911c5d4095af4b';

describe("GET Users", () => { // Filtering the users data by gender, status etc
    it('Success get  with status inactive', async () => {
        const url = `users?access-token=${TOKEN}&status=inactive`;
        return request.get(url).then((res) => {
            console.log(res.body);
            expect(res.body).to.not.be.empty; 
            res.body.forEach((data) => {
                expect(data.status).to.eq('inactive');
            });
        });
    });
});
