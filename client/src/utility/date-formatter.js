import moment from 'moment'

//form data = '2020-01-01'
//stored data = '2020-10-01T00:00:00.000Z'

export default {
    setFormattedDate(date) {
        return moment.utc(date, 'YYYY-MM-DD').format()
    },
    getFormattedDate(date) {
        if (moment.utc(date, 'YYYY-MM-DD', true).isValid()) {
            return moment.utc(date, 'YYYY-MM-DD').format('YYYY-MM-DD')
        }

        if (moment.utc(date, 'MM-DD-YYYY', true).isValid()) {
            return moment.utc(date, 'MM-DD-YYYY').format('YYYY-MM-DD')
        }
    }
}