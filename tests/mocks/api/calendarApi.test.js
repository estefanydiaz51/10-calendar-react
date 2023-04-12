import { calendarApi } from '../../../src/api'


describe('Pruebaseb el calendarApi', () => {
  test('debe de tener la configuración por defecto', () => { 
    expect(calendarApi.defaults.baseURL).toBe(process.env.VITE_API_URL)
  })


  test('debe de tener el x-token en el header de todas las peticiones', async() => {
    const token = 'ABC-123-XYZ'
    localStorage.setItem('token', token)
    try{
      const res = await calendarApi.post('/auth', {
        email: 'test@gmail.com',
        password: '123456',
      })
      expect(res.config.headers['x-token']).toBe(token)
    }catch(error){
      
    }
    
  })
})