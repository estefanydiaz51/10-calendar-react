import { configureStore } from "@reduxjs/toolkit"
import { renderHook, waitFor } from "@testing-library/react"
import { act } from "react-dom/test-utils"
import { Provider } from "react-redux"
import { calendarApi } from "../../src/api"
import { useAuthStore } from "../../src/hooks"
import { authSlice } from "../../src/store"
import { initialState, notAuthenticatedState } from "../fixtures/authStates"
import { testUserCredentials } from "../fixtures/testUser"


const getMockStore = (initialState) => {
  return configureStore({
    reducer: {
      auth: authSlice.reducer
    },
    preloadedState: {
      auth: {...initialState}
    }
  })
}
describe('Pruebas en el useAuthStore', () => {

  beforeEach(() => localStorage.clear())
  test('debe de regresar los valores por defecto', () => {
    localStorage.clear()
    const mockStore = getMockStore({...initialState})
    const { result } = renderHook(() => useAuthStore(),
      {
        wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
      }
    )

    expect(result.current).toEqual({
      errorMessage: undefined,
      status: 'checking',
      user: {},
      checkAuthToken: expect.any(Function),
      startLogin: expect.any(Function),
      startLogout: expect.any(Function),
      startRegister: expect.any(Function)
    })
  })

  test('debe de realizar el login correctamente', async() => {
    localStorage.clear()
    const mockStore = getMockStore({...notAuthenticatedState})

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
    })

    await act(async() => {
      await result.current.startLogin(testUserCredentials)
    })

    const { status, user, errorMessage } = result.current

    expect({ errorMessage, status,  user} ).toEqual({
      errorMessage: undefined,
      status: 'authenticated',
      user: {name: 'Test User', uid: '641d0c01ff36275e755f3021'},
    })

    expect(localStorage.getItem('token')).toEqual(expect.any(String))
    expect(localStorage.getItem('token-init-date')).toEqual(expect.any(String))

  })

  test('debd de fallar la autenticación', async() => { 
    localStorage.clear()
    const mockStore = getMockStore({...notAuthenticatedState})

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
    })

    await act(async() => {
      await result.current.startLogin({email: 'algo2@google.com', password: '12345666'})
    })

    const { errorMessage, status,  user} = result.current

    expect(localStorage.getItem('token')).toBeNull()
    
    expect({ errorMessage, status,  user}).toEqual({
        errorMessage: 'Credenciales incorrectas',
        status: 'not-authenticated',
        user: {}
      }
    )

    await waitFor(
      () => expect(result.current.errorMessage).toBe(undefined)
    )
   })

  test('startRegister debe de crear un usuario', async() => { 
    localStorage.clear()
    const mockStore = getMockStore({...notAuthenticatedState})
    const newUser = {email: 'algo@google.com', password: '12345666', name:'Test user2'}

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
    })

    const spy = jest.spyOn(calendarApi, 'post').mockReturnValue({
      data: {
        ok: true,
        uid: '12321323213123',
        name: 'Test User',
        token: 'ALGUN-TOKEN'
      }
    })
    await act(async() => {
      await result.current.startRegister(newUser)
    })

    const { errorMessage, status,  user} = result.current

    expect({ errorMessage, status,  user}).toEqual({
      errorMessage: undefined,
      status: 'authenticated',
      user: { name: 'Test User', uid: '12321323213123' }
    })

    spy.mockRestore()
  })

  test('startRegister debe de fallar la creación', async() => { 
    localStorage.clear()
    const mockStore = getMockStore({...notAuthenticatedState})

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
    })

    await act(async() => {
      await result.current.startRegister(testUserCredentials)
    })

    const { errorMessage, status,  user} = result.current

    expect({ errorMessage, status,  user}).toEqual({
      errorMessage: 'Un usuario ya existe con ese correo',
      status: 'not-authenticated',
      user: {}
    })
  })
  

  test('checkAuthToken debe de fallar si no hay token', async() => { 
    const mockStore = getMockStore({...notAuthenticatedState})

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
    })

    await act(async() => {
      await result.current.checkAuthToken()
    })

    const { errorMessage, status,  user} = result.current

    expect({ errorMessage, status,  user}).toEqual({
      errorMessage: undefined,
      status: 'not-authenticated',
      user: {}
    })
  })

  test('checkAuthToken debe de authenticar el usuario si hay token', async() => { 

    const { data } = await calendarApi.post('/auth', testUserCredentials)
    localStorage.setItem('token', data.token)

    const mockStore = getMockStore({...initialState})

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
    })

    await act(async() => {
      await result.current.checkAuthToken()
    })

    const { errorMessage, status,  user} = result.current

    expect({ errorMessage, status,  user}).toEqual({
      errorMessage: undefined,
      status: 'authenticated',
      user: { name: 'Test User', uid: '641d0c01ff36275e755f3021' }
    })
  })
})
