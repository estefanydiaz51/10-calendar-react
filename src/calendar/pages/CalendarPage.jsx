import { Calendar } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import { Navbar, CalendarEvent, CalendarModal, FabAddNew, FabDelete } from '../'

import { localizer, getMessagesES } from '../../helpers'
import { useState } from 'react'
import { useCalendarStore, useUiStore } from '../../hooks'


export const CalendarPage = () => {
  const {openDateModal} = useUiStore()
  const {events, setActiveEvent} = useCalendarStore()
  const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'week')
  const eventStyleGetter = (event, start, end, isSelected) => {
    const style = {
      backgroundColor: '#09b67b',
      borderRadius: '0px',
      opacity: 0.8,
      color:'white'
    }
    return {
      style
    }
  }

  const onDoubleClick = (event) => {
    openDateModal()
  }
  const onSelect = (event) => {
    setActiveEvent(event)
  }
  const onViewChanged = (event) => {
    localStorage.setItem('lastView', event)
    setLastView(event)
  }
  return (
    <>
      <Navbar />
      <Calendar
        culture='es'
        localizer={localizer}
        defaultView={lastView}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc(100vh - 80px)' }}
        messages={getMessagesES()}
        eventPropGetter={eventStyleGetter}
        components={{
          event: CalendarEvent
        }}
        onDoubleClickEvent={onDoubleClick}
        onSelectEvent={onSelect}
        onView={onViewChanged}
      />
      <CalendarModal />
      <FabAddNew></FabAddNew>
      <FabDelete></FabDelete>
    </>
  )
}
