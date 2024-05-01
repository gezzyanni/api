import { expect } from 'chai';
import supertest from 'supertest';

describe('Get Todos', () => {
    it('Success get list todos for shows only 10 items', async () => {
        const response = await supertest('https://gorest.co.in/public/v2').get('/todos?page=1');
        console.log(response.body);
        expect(response.status).to.equal(200);
    });
});
