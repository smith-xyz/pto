import 'jest'
import dateFormatter from '../date-formatter'

describe('get and set dates in normalized format', () => {
    it('sets date in correct format that is stored in db', () => {
      const testDate = '2020-10-10'
      const testFormatter = dateFormatter.setFormattedDate(testDate)

      expect(testFormatter).not.toEqual(testDate)
      expect(testFormatter).toEqual('2020-10-10T00:00:00Z')
    })

    it('handles date string not in a valid format', () => {
      const testDate = ['20', '2020-', '2020-1', '2020-11-', '2020-11-1']
      testDate.forEach(d => {
        let testFormatter = dateFormatter.setFormattedDate(d)
        expect(testFormatter).not.toBeNull()
      })
    })

    it('gets date in correct format for form data', () => {
        const testDate = new Date('2020-10-10')
        const testFormatter = dateFormatter.getFormattedDate(testDate)

        expect(testFormatter).not.toEqual(testDate)
        expect(testFormatter).toEqual('2020-10-10')
    })

    it('handles converting MM DD YYYY format for form data', () => {
      const testDate = '10-10-2020'
      const testFormatter = dateFormatter.getFormattedDate(testDate)

      expect(testFormatter).toBe('2020-10-10')
    })
})