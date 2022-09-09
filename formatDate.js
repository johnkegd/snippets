window = window.com || {};
window.aem = window.aem || {};
window.aem.forms = window.aem.forms || {};
window.aem.forms.control = window.aem.forms.control || {};
window.aem.forms.control.datepicker = window.aem.forms.control.datepicker || {};

(function (context) {
    var self = {};
    self.referenceDates = {};
    self.datePickers = {};

    context.put = function (datePickerInputField) {
        self.datePickers[datePickerInputField.attr('id')] = datePickerInputField;
    };

    /**
     * Formats the technical date yyyy-mm-dd to Swiss format dd.mm.yyyy
     * @param dateString Date string to formate
     * @returns {string} Formatted date
     */
    context.formatDate = function (dateString) {
        var result = '';

        if (dateString && (dateString.match(/-/g) || []).length == 2) {
            var valueArray = dateString.split('-');
            result = valueArray[2] + '.' + valueArray[1] + '.' + valueArray[0];
        }

        return result;
    };

    /**
     * Handles the conversion from different date entries to the iso date format (YYYY-MM-DD).
     * @param date The entered date or date string.
     * @return date The converted date as iso date format.
     */
    context.convertDate = function (date) {
        if (date instanceof Date) {
            date = self.getCleanYear(date.getFullYear().toString()) + "-" + self.getCleanMonth((date.getMonth() + 1).toString()) + "-" + self.getCleanDay(date.getDate());
        } else {
            var arrayDate;
            var dd_day;
            var mm_month;
            var yy_year;
            var yyyy_year;

            if (date.length == 8 && (date.indexOf(".") == -1)) {
                dd_day = date.substr(0, 2);
                mm_month = date.substr(2, 2);
                yyyy_year = date.substr(4, 4);
                date = dd_day + "." + mm_month + "." + yyyy_year;
            }

            if (date.length == 8 && (date.indexOf(".") != 1)) {
                dd_day = date.substr(0, 2);
                mm_month = date.substr(3, 2);
                yy_year = date.substr(6, 2);
                date = dd_day + "." + mm_month + "." + yy_year;
            }

            if (date.length == 6 && (date.indexOf(".") != 1)) {
                dd_day = date.substr(0, 2);
                mm_month = date.substr(2, 2);
                yy_year = date.substr(4, 2);
                date = dd_day + "." + mm_month + "." + yy_year;
            }

            if (date.length == 4 && (date.indexOf(".") != 1)) {
                yy_year = date.substr(0, 4);
                date = '01' + "." + '01' + "." + yy_year;
            }

            if (date.length == 2 && (date.indexOf(".") != 1)) {
                yy_year = date.substr(0, 2);
                date = '01' + "." + '01' + "." + yy_year;
            }

            if (date.length == 1 && (date.indexOf(".") != 1)) {
                yy_year = date.substr(0, 1);
                date = '01' + "." + '01' + "." + yy_year;
            }

            if ((date.substr(2, 1) == ".") || (date.substr(1, 1) == ".")) {
                arrayDate = date.split(".");
            } else if (date.substr(4, 1) == "-") {
                var arrayTemp = date.split("-");
                arrayDate = new Array(arrayTemp[2], arrayTemp[1], arrayTemp[0]);
            } else {
                // add another DateFormat
            }

            if (arrayDate != null && arrayDate.length == 3) {
                dd_day = self.getCleanDay(arrayDate[0]);
                mm_month = self.getCleanMonth(arrayDate[1]);
                var yyyy_year = self.getCleanYear(arrayDate[2]);

                // reformat date to 'yyyy-mm-dd'
                if (dd_day != arrayDate[0] || mm_month != arrayDate[1] || yyyy_year != arrayDate[2] || date.indexOf(".") > 0) {
                    date = yyyy_year + "-" + mm_month + "-" + dd_day;
                }
            }
        }
        return date;
    };

    /**
     * Parses the incomming string as a 1 or 2 digit day and returns the dd-day as string.
     */
    self.getCleanDay = function (dayString) {
        var day = parseInt(dayString);
        if ((dayString.length == 2) && (dayString.substr(0, 1) == "0")) {
            day = parseInt(dayString.substr(1));
        }
        day = "00" + day;
        return day.substring(day.length - 2);
    };

    /**
     * Parses the incomming string as a 1 or 2 digit day and returns the full day as integer
     */
    self.getCleanMonth = function (monthString) {
        var month = parseInt(monthString);
        if ((monthString.length == 2) && (monthString.substr(0, 1) == "0")) {
            month = parseInt(monthString.substr(1));
        }
        month = "00" + month;
        return month.substring(month.length - 2);
    };

    /**
     * Parses the incomming string as a 1 or 2 or 4 digit year and returns the full yyyy-year as string
     */
    self.getCleanYear = function (yearString) {
        var year = parseInt(yearString);

        if (yearString.length == 2) {
            if (yearString.substr(0, 1) == "0") {
                yearString = yearString.substr(1);
            }

            year = parseInt(yearString);

            var currentYear = new Date().getFullYear().toString().substr(-2);

            while ((currentYear.length > 0) && (currentYear.substr(0, 1) == "0")) {
                currentYear = currentYear.substr(1);
            }
            var maxYear = parseInt(currentYear) + 30;

            if (year <= maxYear) {
                year = year + 2000;
            } else {
                year = year + 1900;
            }
        }

        if (yearString.length == 1) {
            year = parseInt(yearString);

            var currentYear = new Date().getFullYear().toString().substr(-1);

            while ((currentYear.length > 0) && (currentYear.substr(0, 1) == "0")) {
                currentYear = currentYear.substr(1);
            }
            var maxYear = parseInt(currentYear) + 30;

            if (year <= maxYear) {
                year = year + 2000;
            } else {
                year = year + 1900;
            }
        }
        year = "0000" + year;
        return year.substr(year.length - 4);
    };

    /**
     * Set first selectable date (see https://jqueryui.com/datepicker/#min-max for more details).
     * @param datePicker DatePicker control
     * @param selectionFrom From string
     * @deprecated
     */
    context.setSelectionFrom = function (datePicker, selectionFrom) {
        context.setDateRangeFrom(datePicker, selectionFrom);
    };

    /**
     * Set last selectable date (see https://jqueryui.com/datepicker/#min-max for more details).
     * @param datePicker DatePicker control
     * @param selectionTo To string
     * @deprecated
     */
    context.setSelectionTo = function (datePicker, selectionTo) {
        context.setDateRangeTo(datePicker, selectionTo);
    };

    /**
     * Set first selectable date (see https://jqueryui.com/datepicker/#min-max for more details).
     * @param datePicker DatePicker control
     * @param dateRangeFrom From string
     */
    context.setDateRangeFrom = function (datePicker, dateRangeFrom) {
        if (self.isServerSide()) {
            return;
        }
        self.getDatePickerInputField(datePicker).attr('data-range-from', context.convertDate(dateRangeFrom));
        if (self.isNotEmpty(datePicker.value)) {
            guideBridge.validate([], datePicker.somExpression, true);
        }
    };

    /**
     * Set last selectable date (see https://jqueryui.com/datepicker/#min-max for more details).
     * @param datePicker DatePicker control
     * @param dateRangeTo To string
     */
    context.setDateRangeTo = function (datePicker, dateRangeTo) {
        if (self.isServerSide()) {
            return;
        }
        self.getDatePickerInputField(datePicker).attr('data-range-to', context.convertDate(dateRangeTo));
        if (self.isNotEmpty(datePicker.value)) {
            guideBridge.validate([], datePicker.somExpression, true);
        }
    };

    /**
     * Checks if a weekday is enabled.
     *
     * @param datePickerInputField The datePickerInputField control
     * @param date optional date for check the range.
     */
    context.isWeekdayAvailable = function (datePickerInputField, date) {
        var activeWeekdays = datePickerInputField.attr('data-active-weekdays');
        return activeWeekdays.indexOf('' + date.getDay()) > -1;
    };

    /**
     * checks if the selected date is on a available weekday and if the date is within the limit.
     * @param datePicker DatePicker control
     */
    context.validate = function (datePicker) {
        if (self.isServerSide()) {
            return true;
        }
        var datePickerInputField = self.getDatePickerInputField(datePicker);
        var date = new Date(datePicker.value);
        if (!context.isWeekdayAvailable(datePickerInputField, date)) {
            var availableWeekdays = self.availableWeekdaysString(datePickerInputField);
            datePicker.validateExpMessage = $('#' + datePicker.id).find('.dateTimeEdit').attr('data-weekday-validation-message').replace('{0}', availableWeekdays);
            return false;
        }

        if (!context.isDateInRange(datePickerInputField, date)) {
            datePicker.validateExpMessage = self.availableDatesValidationString(datePicker, datePickerInputField);
            return false;
        }
        return true;
    };

    /**
     * checks if the date is within the limit.
     *
     * @param datePicker The date picker control.
     * @param date optional date for check the range.
     */
    context.isDateInRange = function (datePickerInputField, date) {
        var dataRangeFrom = datePickerInputField.attr('data-range-from');
        var dataRangeTo = datePickerInputField.attr('data-range-to');
        date.setHours(0, 0, 0, 0);

        if (self.isNotEmpty(dataRangeFrom)) {
            if (date < self.getLimitDate(datePickerInputField, dataRangeFrom)) {
                return false;
            }
        }
        if (self.isNotEmpty(dataRangeTo)) {
            if (date > self.getLimitDate(datePickerInputField, dataRangeTo)) {
                return false;
            }
        }
        return true;
    };

    /**
     * Sets the reference date, which is used fot the date range limitation. The default date is the today's date.
     *
     * @param datePicker DatePicker control
     * @param referenceDate the Date that should be the reference for the limit
     */
    context.setReferenceDate = function (datePicker, referenceDate) {
        if (self.isServerSide()) {
            return;
        }
        self.referenceDates[self.getDatePickerInputField(datePicker).attr('id')] = referenceDate;
        if (self.isNotEmpty(datePicker.value)) {
            guideBridge.validate([], datePicker.somExpression, true);
        }
    }

    /**
     * Returns the reference date or the date of today.
     *
     * @param datePicker DatePicker control
     * @return The reference date for the range comparison.
     */
    context.getReferenceDate = function (datePicker) {
        return self.getReferenceDate(self.getDatePickerInputField(datePicker));
    };

    self.getReferenceDate = function (datePickerInputField) {
        var referenceDate = self.referenceDates[datePickerInputField.attr('id')];
        if (self.isNotEmpty(referenceDate)) {
            return referenceDate;
        } else {
            return new Date();
        }
    };

    self.getDatePickerInputField = function (datePicker) {
        var selector = datePicker.jsonModel.id ? datePicker.jsonModel.id : datePicker.jsonModel.templateId;
        return $('#' + selector).find('.datepicker input');
    };

    self.availableWeekdaysString = function (datePickerInputField) {
        var dayNamesShort = self.datePickers[datePickerInputField.attr('id')].datepicker('option', 'dayNamesShort');
        var activeWeekdays = datePickerInputField.attr('data-active-weekdays').split('-');
        var availableWeekdays = "";
        activeWeekdays.forEach(function (activeWeekday) {
            availableWeekdays += dayNamesShort[activeWeekday] + ', ';
        });
        if (availableWeekdays.length > 0) {
            availableWeekdays = availableWeekdays.substr(0, availableWeekdays.length - 2);
        }
        return availableWeekdays;
    };

    /**
     * Returns the validation string with date limits
     * @param datePickerInputField The date picker control.
     */
    self.availableDatesValidationString = function (datePicker, datePickerInputField) {
        var dateFromString = datePickerInputField.attr('data-range-from');
        var dateToString = datePickerInputField.attr('data-range-to');

        if (self.isNotEmpty(dateFromString) && self.isNotEmpty(dateToString)) {
            var dateFrom = self.getLimitDate(datePickerInputField, dateFromString);
            var dateTo = self.getLimitDate(datePickerInputField, dateToString);

            return $('#' + datePicker.id).find('.dateTimeEdit').attr('data-date-range-validation-message').replace('{0}', dateFrom.toLocaleDateString()).replace('{1}', dateTo.toLocaleDateString());
        }
        if (self.isNotEmpty(dateFromString)) {
            var dateFrom = self.getLimitDate(datePickerInputField, dateFromString);
            return $('#' + datePicker.id).find('.dateTimeEdit').attr('data-date-range-from-validation-message').replace('{0}', dateFrom.toLocaleDateString());
        }
        if (self.isNotEmpty(dateToString)) {
            var dateTo = self.getLimitDate(datePickerInputField, dateToString);
            return $('#' + datePicker.id).find('.dateTimeEdit').attr('data-date-range-to-validation-message').replace('{0}', dateTo.toLocaleDateString());
        }
    }

    /**
     * Returns the limitation date for comparison.
     *
     * @param dateRange number of days, weeks, months or years
     * @type type type that shows if it is a day, week, month or year
     */
    self.getLimitDate = function (datePickerInputField, dateRange) {
        var limitDate = new Date(self.getReferenceDate(datePickerInputField));
        var groups = dateRange.split(' ');
        groups.forEach(function (group) {
            if (group != '') {
                var limitParts = group.split(new RegExp('([d,D,w,W,m,M,y,Y]+)'));
                if (limitParts.length == 1) {
                    if (group.indexOf('-') === 4) {
                        limitDate = new Date(group);
                    } else {
                        limitDate.setDate(limitDate.getDate() + parseInt(group));
                    }
                } else {
                    var type = limitParts[1].toUpperCase();
                    var number = parseInt(limitParts[0]);
                    if (type == "W") {
                        limitDate.setDate(limitDate.getDate() + (number * 7));
                    } else if (type == "M") {
                        limitDate.setMonth(limitDate.getMonth() + number);
                    } else if (type == "Y") {
                        limitDate.setFullYear(limitDate.getFullYear() + number);
                    } else {
                        limitDate.setDate(limitDate.getDate() + number);
                    }
                }
            }
        });
        limitDate.setHours(0, 0, 0, 0);
        return limitDate;
    };

    self.isNotEmpty = function (value) {
        return value != null && value != undefined && value != '';
    };

    self.isServerSide = function () {
        return !location.host;
    };
}(window.aem.forms.control.datepicker));
