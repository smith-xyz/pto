import React, { useState, useEffect } from 'react'
import RequestsService from '../../services/RequestsService'
import { withStyles } from '@material-ui/core/styles'
import { fade } from '@material-ui/core/styles/colorManipulator'
import Paper from "@material-ui/core/Paper"
import { ViewState } from "@devexpress/dx-react-scheduler"
import {
  Scheduler,
  WeekView,
  MonthView,
  Toolbar,
  ViewSwitcher,
  Appointments,
  DateNavigator
} from "@devexpress/dx-react-scheduler-material-ui"

import DataTable from '../Common/DataTable'
import Spinner from '../Common/Spinner'
import { toast } from 'react-toastify'

const style = theme => ({
  todayCell: {
    backgroundColor: fade(theme.palette.primary.main, 0.1),
    '&:hover': {
      backgroundColor: fade(theme.palette.primary.main, 0.14),
    },
    '&:focus': {
      backgroundColor: fade(theme.palette.primary.main, 0.16),
    },
  },
  weekendCell: {
    backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
    '&:hover': {
      backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
    },
    '&:focus': {
      backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
    },
  },
  today: {
    backgroundColor: fade(theme.palette.primary.main, 0.16),
  },
  weekend: {
    backgroundColor: fade(theme.palette.action.disabledBackground, 0.06),
  },
})

const TimeTableCellBase = ({ classes, ...restProps }) => {
  const { startDate } = restProps;
  const date = new Date(startDate);
  if (date.getDate() === new Date().getDate()) {
    return <WeekView.TimeTableCell {...restProps} className={classes.todayCell} />;
  } if (date.getDay() === 0 || date.getDay() === 6) {
    return <WeekView.TimeTableCell {...restProps} className={classes.weekendCell} />;
  } return <WeekView.TimeTableCell {...restProps} />;
}

const TimeTableCell = withStyles(style, { name: 'TimeTableCell' })(TimeTableCellBase)

const DayScaleCellBase = ({ classes, ...restProps }) => {
  const { startDate, today } = restProps;
  if (today) {
    return <WeekView.DayScaleCell {...restProps} className={classes.today} />;
  } if (startDate.getDay() === 0 || startDate.getDay() === 6) {
    return <WeekView.DayScaleCell {...restProps} className={classes.weekend} />;
  } return <WeekView.DayScaleCell {...restProps} />;
};

const DayScaleCell = withStyles(style, { name: 'DayScaleCell' })(DayScaleCellBase)

const Calendar = () => {
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  
  useEffect(() => {
    setIsLoading(true)
    getRequests()
    setIsLoading(false)
  }, [])

  const currentDate = new Date()

  const getRequests = async () => {
    RequestsService.getCalendarRequests()
      .then(res => {
        setRequests(res.data)
      }).catch(err => {
          toast.error('Error Loading Data')
      })
  }

  const tableList = requests.map(data => {
    return { title: data.title, startDate: data.startDate }
  })
  
  return (
    <div className="calendar-container">
      { isLoading? <Spinner /> : <React.Fragment>
      <div className="upcoming-list-container">
        <h2 className="header-formatter-1">
          <span className="header-style-1">Upcoming PTO</span>
        </h2>
        <DataTable className="table-spacing-utility-2" data={tableList} for={"calendar"}/>
      </div>
      <div className="calendar-view-container">
          <div className="calendar">
            <Paper>
              <Scheduler data={requests}>
                    <ViewState
                      defaultCurrentDate={currentDate}
                      defaultCurrentViewName="Month"
                    />
                    <WeekView
                      startDayHour={9}
                      endDayHour={18}
                      timeTableCellComponent={TimeTableCell}
                      dayScaleCellComponent={DayScaleCell}
                    />
                    <MonthView />
                    <Toolbar />
                    <DateNavigator />
                    <ViewSwitcher />
                    <Appointments />
              </Scheduler>
            </Paper>
          </div>
      </div>
      </React.Fragment>}
    </div>
  )
}

export default Calendar