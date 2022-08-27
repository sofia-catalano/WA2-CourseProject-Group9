const typeTicket = (date1, date2) =>{
    let diff= moment(date1).diff(moment(date2), 'minutes')
    if(diff<60) {
        return diff+ ' minutes'
    }
    diff= moment(date1).diff(moment(date2), 'hours')
    if(diff<24){
        return diff + ' hours'
    }
    diff= moment(date1).diff(moment(date2), 'days')
    if(diff<7){
        return diff + ' days'
    }

    diff= moment(date1).diff(moment(date2), 'months')
    if(diff<2){
        return '1 month'
    }

    return '1 year'

}

export default typeTicket