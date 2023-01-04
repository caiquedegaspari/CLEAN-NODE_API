import request from 'supertest'
import app from '../config/app'

describe('SignUp routes', () => {
  it('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup').send({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'anypassword',
        passwordConfirmation: 'anypassword'
      })
      .expect(200)
  })
})
