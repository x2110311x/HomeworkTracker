$('.datepicker').datepicker({
    format: {

        toDisplay: function (date, format, language) {
            var d = new Date(date);
            var n = d.getDay(); // Uses the day of the week picked as an offset

            var m = new Date(date);
            var s = new Date(date);
            m.setDate(m.getDate()+1-n); //Set to Monday 
            s.setDate(s.getDate()+7-n); //Set to Sunday
            var MondayString = (m.getMonth()+1)+"/"+m.getDate();
            var SundayString = (s.getMonth()+1)+"/"+s.getDate();
            var week = MondayString+" - "+SundayString+" ("+s.getFullYear()+")";
            return week;
        },
        toValue: function (date, format, language) {
            var d = new Date(date);
            var n = d.getDay(); // Uses the day of the week picked as an offset

            var m = new Date(date);
            m.setDate(m.getDate() + 1-n); //Finds and stores the monday value
            return new Date(m);
        }
    },
    weekStart: '1',
    keyboardNavigation: false
    
});