export const events = [
  {
    id: '1',
    start: new Date('2022-10-21 13:00:00'),
    end: new Date('2022-10-21 17:00:00'),
    title: 'Cumpleaños de Estefany',
    notes: 'Alguna nota'
  },
  {
    id: '2',
    start: new Date('2023-11-01 13:00:00'),
    end: new Date('2023-11-01 17:00:00'),
    title: 'Cumpleaños de Alejandro',
    notes: 'Alguna nota e alejandro'
  }
]


export const initialState = {
  isLoadingEvents: true,
  events: [],
  activeEvent: null
}

export const calendarWithEventState = {
  isLoadingEvents: false,
  events: [...events],
  activeEvent: null
}

export const calendarWithActiveEventState = {
  isLoadingEvents: false,
  events: [...events],
  activeEvent: {...events[0]}
}