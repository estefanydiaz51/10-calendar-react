import { fireEvent, render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { FabDelete } from "../../../src/calendar/components/FabDelete"
import { useCalendarStore } from "../../../src/hooks/useCalendarStore"


jest.mock('../../../src/hooks/useCalendarStore')
describe('Pruebas en FabDelete', () => {

  const mockStarDeletingEvent = jest.fn()


  beforeEach(() => {
    jest.clearAllMocks()
  })
  test('debe de mostrar el componente correctamente', () => { 

    useCalendarStore.mockReturnValue({
      hasEventSelected: false
    })
    render( <FabDelete />)

    const btn = screen.getByLabelText('btn-delete')
    expect(btn.classList).toContain('btn')
    expect(btn.classList).toContain('btn-danger')
    expect(btn.classList).toContain('fab-danger')
    expect(btn.style.display).toBe('none')
  })

  test('debe de mostrar el botón si hay un evento activo correctamente', () => { 

    useCalendarStore.mockReturnValue({
      hasEventSelected: true
    })
    render( <FabDelete />)

    const btn = screen.getByLabelText('btn-delete')
    expect(btn.style.display).toContain('')
  })

  test('debe de llamar  startDeletingEvent si hay evento activo', () => { 

    useCalendarStore.mockReturnValue({
      hasEventSelected: true,
      startDeletingEvent: mockStarDeletingEvent
    })
    render( <FabDelete />)

    const btn = screen.getByLabelText('btn-delete')
    fireEvent.click(btn)
    expect(mockStarDeletingEvent).toHaveBeenCalled()
  })
})
