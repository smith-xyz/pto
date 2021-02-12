import 'jest'
import { DataOptions } from '../DataTable'

describe('testing sorting and filtering', () =>{
    it('can sort the data with numbers descending', () => {
        let data = [
            {
                id: 1,
                startDate: "01-01-2020"
            },
            {
                id: 7,
                startDate: "01-02-2020"
            },
            {
                id: 3,
                startDate: "01-01-2020"
            }
        ]

        const test = DataOptions.sortData('id', 'desc', data)

        expect(test).toBe(data)
        expect(test[0].id).toEqual(7)
        expect(test[1].id).toEqual(3)
        expect(test[2].id).toEqual(1)
    })

    it('can sort the data with numbers ascending', () => {
        let data = [
            {
                id: 1,
                startDate: "01-01-2020"
            },
            {
                id: 7,
                startDate: "01-02-2020"
            },
            {
                id: 3,
                startDate: "01-01-2020"
            }
        ]

        const test = DataOptions.sortData('id', 'asc', data)

        expect(test).toBe(data)
        expect(test[0].id).toEqual(1)
        expect(test[1].id).toEqual(3)
        expect(test[2].id).toEqual(7)
    })

    it('can sort the data with dates that are strings descending', () => {
        let data = [
            {
                id: 1,
                startDate: "01-01-2020"
            },
            {
                id: 7,
                startDate: "01-02-2020"
            },
            {
                id: 3,
                startDate: "01-03-2020"
            }
        ]

        const test = DataOptions.sortData('Start Date', 'desc', data)

        expect(test).toBe(data)
        expect(test[0].startDate).toBe("01-03-2020")
        expect(test[1].startDate).toBe("01-02-2020")
        expect(test[2].startDate).toBe("01-01-2020")
    })

    it('can sort the data with dates that are strings ascending', () => {
        let data = [
            {
                id: 1,
                startDate: "01-03-2020"
            },
            {
                id: 7,
                startDate: "01-01-2020"
            },
            {
                id: 3,
                startDate: "01-06-2020"
            }
        ]

        const test = DataOptions.sortData('Start Date', 'asc', data)

        expect(test).toBe(data)
        expect(test[0].startDate).toBe("01-01-2020")
        expect(test[1].startDate).toBe("01-03-2020")
        expect(test[2].startDate).toBe("01-06-2020")
    })

    it('will filter data by object key values over entire array', () => {
        let data = [
            {
                id: 1,
                startDate: "01-03-2020",
                property: "test"
            },
            {
                id: 7,
                startDate: "01-01-2020",
                property: "test"
            },
            {
                id: 3,
                startDate: "01-06-2020",
                property: "test"
            }
        ]

        let filter = "06"

        let test = DataOptions.filter(filter, data)

        expect(test).not.toStrictEqual(data)
        expect(test.length).toBe(1)
        expect(test[0]).toEqual(data[2])

        filter = "2020"

        test = DataOptions.filter(filter, data)
        
        expect(test).toStrictEqual(data)
        expect(test.length).toBe(data.length)

        filter = 7

        test = DataOptions.filter(filter, data)

        expect(test).not.toStrictEqual(data)
        expect(test.length).toBe(1)
        expect(test[0]).toEqual(data[1])
    })
})