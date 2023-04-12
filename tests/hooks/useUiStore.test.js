import { configureStore } from "@reduxjs/toolkit"
import { render, renderHook } from "@testing-library/react"
import { act } from "react-dom/test-utils"
import { Provider } from "react-redux"
import { useUiStore } from "../../src/hooks"
import { store, uiSlice } from "../../src/store"

const getMockStore = (initialState) => {
  return configureStore({
    reducer: {
      ui: uiSlice.reducer
    },
    preloadedState: {
      ui: {...initialState}
    }
  })
}

describe('Pruebas en el useUiStore ', () => { 
  test('debe de regresar los valores por defecto', () => {
    const mockStore = getMockStore( {isDateModalOpen: false})
    const { result } = renderHook(() => useUiStore(), {
      wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
    })
    expect(result.current).toEqual({
      isDateModalOpen: false,
      closeDateModal: expect.any(Function),
      openDateModal: expect.any(Function),
      toggleDateModal: expect.any(Function)
    })
  })
  test('openDateModal debe de colocar tru en el isDateModalOpen', () => { 
    const mockStore = getMockStore({isDateModalOpen: false})
    const { result } = renderHook(() => useUiStore(), {
      wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
    })

    const { isDateModalOpen, openDateModal } = result.current
    act(() => {
      openDateModal()
    })

    expect(result.current.isDateModalOpen).toBeTruthy()

  })  

  test('debe colocar false en isDateModalOpen', () => {
    const mockStore = getMockStore({isDateModalOpen: true})

    const { result } = renderHook(() => useUiStore(), {
      wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
    })

    act(() => {
      result.current.closeDateModal()
    })

    expect(result.current.isDateModalOpen).toBeFalsy()

  })

  test('ToggleDateModal debe de cambiar el estado respectivamente', () => {
    const mockStore = getMockStore({isDateModalOpen: true})

    const { result } = renderHook(() => useUiStore(), {
      wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
    })

    act(() => {
      result.current.toggleDateModal()
    })

    expect(result.current.isDateModalOpen).toBeFalsy()

    act(() => {
      result.current.toggleDateModal()
    })

    expect(result.current.isDateModalOpen).toBeTruthy()

  })
  
})