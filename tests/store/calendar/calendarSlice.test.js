import { calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onSetActiveEvent, onUpdateEvent } from "../../../src/store/calendar/calendarSlice"
import { calendarWithActiveEventState, calendarWithEventState, events, initialState } from "../../fixtures/calendarStates"

describe('Pruebas en calendarSlice', () => { 
  test('debe de regresar el estado por defecto  ', () => {
    const state = calendarSlice.getInitialState()
    expect(state).toEqual(initialState)
  })

  test('onSetActiveEvent debe de activar el evento', () => { 
    const state = calendarSlice.reducer(calendarWithEventState, onSetActiveEvent(events[0]))
    expect(state.activeEvent).toEqual(events[0])
  })

  test('onAddNewEvent debe de agregar el evento', () => {
    const newEvent = {
      id: '3',
      start: new Date('2023-11-01 13:00:00'),
      end: new Date('2023-11-01 17:00:00'),
      title: 'Cumpleaños de Alejandro',
      notes: 'Alguna nota e alejandro'
    }

    const state= calendarSlice.reducer(calendarWithEventState, onAddNewEvent(newEvent))
    expect(state.events).toEqual([...events, newEvent])
  })

  test('onUpdateEvent debe de actualizar el evento', () => {
    const newEvent = {
      id: '1',
      start: new Date('2023-11-01 13:00:00'),
      end: new Date('2023-11-01 17:00:00'),
      title: 'Cumpleaños de Alejandro actualizado',
      notes: 'Alguna nota e actualizada'
    }

    const state= calendarSlice.reducer(calendarWithEventState, onUpdateEvent(newEvent))
    expect(state.events).toContain(newEvent)
  })

  test('onDeleteEvent debe de borrar el evento activo', () => {
    const state = calendarSlice.reducer(calendarWithActiveEventState, onDeleteEvent())
    expect(state.activeEvent).toBeNull()
    expect(state.events).not.toContain(events[0])
  })

  test('onLoadEvents debe establecer los eventos', () => {
    const state = calendarSlice.reducer(initialState, onLoadEvents(events))
    expect(state.isLoadingEvents).toBeFalsy()
    expect(state.events).toEqual(events)
  })

  test('onLogoutCalendar debe de limpiar el estado', () => {

    const state= calendarSlice.reducer(calendarWithActiveEventState, onLogoutCalendar())
    expect(state).toEqual(initialState)
  })
  
  
  
})