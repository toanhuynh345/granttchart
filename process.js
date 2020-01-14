GanttChart = function (options) {
    return this.init(options);
}
GanttChart.prototype = {
    // Default values
    yearCountFrom: 2015,
    yearCountTo: 2030,
    monthCountFrom: 1,
    monthCountTo: 12,
    dayCountFrom: 1,
    dayCountTo: 31,
    hourCountFrom: 0,
    hourCountTo: 23,
    minuteCountFrom: 0,
    minuteCountTo: 59,
    submitURL: '',
    saveTaskURL: '',
    isAdmin: false,
    // Elements
    selectELYear: null,
    selectELMonth: null,
    selectELDay: null,
    selectELHour: null,
    selectELMinute: null,
    ganttChart: null,
    filterButton: null,
    refreshButton: null,
    //jQuery object elements
    maskEL: $('.gantt_cal_cover'),
    popup: $('.gantt_cal_light[role=dialog]'),
    taskName: $('#task_name'),
    projectName: $('#project_name'),
    authorName: $('#author_name'),
    assigneeName: $('#assignee_name'),
    LabelsName: $('#labels_name'),
    TeamId: $('#team_id'),
    fromDate: $('#btnfmdate'),
    toDate: $('#btntodate'),
    currentID: null,
    // gantt Object
    gantt: null,
    sortDirection: false,
    sortField: 'text',
    // jQuery Object
    filterLabelsField: null,
    filterAssigneeField: null,
    filterAuthorField: null,
    filterTeamsField: null,
    //Days weeks radio:
    timelineHoverToday: "days",
    // function
    init: function (options) {
        this.overlayIn();
        this.submitURL = options.submitURL ? options.submitURL : '';
        this.saveTaskURL = options.saveTaskURL ? options.saveTaskURL : '';
        this.selectELYear = options.year_el ? $(options.year_el) : null;
        this.selectELMonth = options.month_el ? $(options.month_el) : null;
        this.selectELDay = options.day_el ? $(options.day_el) : null;
        this.selectELHour = options.hour_el ? $(options.hour_el) : null;
        this.selectELMinute = options.minute_el ? $(options.minute_el) : null;
        this.ganttChart = options.gantt_chart ? options.gantt_chart : null;
        this.isAdmin = options.isAdmin ? options.isAdmin : false;
        this.filterButton = options.filterButton ? options.filterButton : null;
        this.refreshButton = options.refreshButton ? options.refreshButton : null;
        this.filterLabelsField = options.filterLabelsField ? options.filterLabelsField : null;
        this.filterAssigneeField = options.filterAssigneeField ? options.filterAssigneeField : null;
        this.filterAuthorField = options.filterAuthorField ? options.filterAuthorField : null;
        this.filterTeamsField = options.filterTeamsField ? options.filterTeamsField : null;

        this.fromDate.datepicker({
            dateFormat: "dd-mm-yy"
        });
        this.toDate.datepicker({
            dateFormat: "dd-mm-yy"
        });
        if (!options.gantt) {
            return false;
        }
        this.gantt = options.gantt;
        // Init event assignment
        this.attachChangeViewEvent()
            .initSortField()
            .initSortDirection()
            .initSavebuttonEvent()
            .initCancelButtonEvent()
            .initFilterEvent()
            .initRefreshEvent()
            .onGanttReady()
            .initJQueryCenter();

        return this;
    },
    initJQueryCenter: function () {
        var that = this;
        // Create jQuery plugin to central the element
        jQuery.fn.center = function () {
            this.css("position", "absolute");
            this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) +
                $(window).scrollTop()) + "px");
            this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) +
                $(window).scrollLeft()) + "px");
            return this;
        }
        return that;
    },
    initSortField: function () {
        var that = this;
        $('#select_sort_field').change(function (event) {
            that.setSortField($(event.target).val());
            that.sorting();
        }.bind(that));
        return that;
    },
    initSortDirection: function () {
        var that = this;

        $('.sort-direction').click(function (event) {
            that.setSortDirection($(event.target).data('direction'));
            let hiddenEL = $('.sort-direction').not(':hidden');
            $('.sort-direction').not(':visible').show();
            hiddenEL.hide();
            that.sorting();
        }.bind(that));
        return that;
    },
    initSavebuttonEvent: function () {
        var that = this;
        $('.gantt_save_btn_set').click(function () {
            $('#overlay-loading').fadeIn();
            that.saveTask();
        });
        return that;
    },
    initCancelButtonEvent: function () {
        var that = this;
        $('.gantt_cancel_btn_set').click(function (event) {
            that.closePopup();
        });
        return that;
    },
    initFilterEvent: function () {
        var that = this;
        $(that.filterButton).click(function () {
            that.overlayIn();
            that.reloadGant();
            that.onGanttReady();
        }.bind(that));
        return that;
    },
    initRefreshEvent: function () {
        var that = this;
        $(that.refreshButton).click(function () {
            that.overlayIn();
            that.taskName.val('');
            that.projectName.val('');
            that.authorName.val('');
            that.assigneeName.val('');
            that.LabelsName.val('');
            that.TeamId.val('');
            that.fromDate.val('');
            that.toDate.val('');
            let labelControl = that.filterLabelsField[0].selectize;
            labelControl.clear();
            let assigneeControl = that.filterAssigneeField[0].selectize;
            assigneeControl.clear();
            let auhorControl = that.filterAuthorField[0].selectize;
            auhorControl.clear();
            let teamControl = that.filterTeamsField[0].selectize;
            teamControl.clear();
            that.resetActivedClasses();
            that.onGanttReady();
        }.bind(that));

        return that;
    },
    render: function () {
        // Initial Elements
        //  Year
        this.renderPopupSelectInput(this.selectELYear, this.yearCountFrom, this.yearCountTo);
        // //  Month
        this.renderPopupSelectInput(this.selectELMonth, this.monthCountFrom, this.monthCountTo);
        // //  Day
        this.renderPopupSelectInput(this.selectELDay, this.dayCountFrom, this.dayCountTo);
        // //  Hour
        this.renderPopupSelectInput(this.selectELHour, this.hourCountFrom, this.hourCountTo);
        // //  Minute
        this.renderPopupSelectInput(this.selectELMinute, this.minuteCountFrom, this.minuteCountTo);

        return this;
    },
    renderPopupSelectInput: function ($element, from, to) {
        for (i = from; i <= to; i++) {
            let option = new Option(i, i);
            $(option).html(i);
            $element.append(option);
        }
    },
    renderPopupSelectedInput: ($element, selected) => {
        $element.prop('selectedIndex', selected).val(selected);
    },
    attachChangeViewEvent: function () {
        var that = this;
        $('.change-to').click(function (event) {
            $('.change-to').removeClass('ant-radio-button-wrapper-checked');
            $(event.currentTarget).addClass('ant-radio-button-wrapper-checked');
            let config = [];
            let isReload = true;
            // return false;
            switch ($(event.currentTarget).data('change')) {
                case 'refresh':
                    that.reloadGant(that.submitURL);
                    isReload = false;
                    break;
                case 'days':
                    config = [
                        {
                            unit: "day", step: 1, format: "%d, %M", css: function (date) {
                                if (!that.gantt.isWorkTime({date: date, unit: "day"})) {
                                    return "weekend"
                                }
                            }
                        }
                    ]
                    that.timelineHoverToday = "days";
                    break;
                case 'weeks':
                    config = [
                        {
                            unit: "week", step: 1, format: function (date) {
                                let weekInformation = that.getWeekNumber(new Date(date));
                                return "#" + weekInformation[1] + "-" + weekInformation[0];
                            }
                        }
                    ];
                    that.timelineHoverToday = "weeks";
                    break;
                case 'months':
                    config = [
                        {unit: "month", step: 1, format: "%M, %Y"},
                    ];
                    break;
            }
            if (isReload) {
                that.overlayIn();
                that.gantt.config.scales = config;
                that.reloadGant();
            }
        }.bind(that));
        return that;
    },
    resetActivedClasses: function () {
        $('.change-to').removeClass('ant-radio-button-wrapper-checked');
        $('.change-to[data-change="days"]').trigger('click');
    },
    reloadGant: function (url) {
        var that = this;
        that.gantt.clearAll();
        let taskName = that.taskName.val();
        let projectName = that.projectName.val();
        let authorName = that.authorName.val();
        let assigneeName = that.assigneeName.val();
        let LabelsName = that.LabelsName.val();
        let TeamId = that.TeamId.val();
        let fromDate = that.fromDate.val();
        let toDate = that.toDate.val();
        var URL = that.submitURL + "?" + $.param({
            'task_name': taskName,
            'project_name': projectName,
            'author_name': authorName,
            'assignee_name': assigneeName,
            'labels_name': LabelsName,
            'team_id': TeamId,
            'btnfmdate': fromDate,
            'btntodate': toDate
        });
        if (!url) {
            that.gantt.load(URL);
        } else {
            that.gantt.load(url);
        }
        return that;
    },
    closePopup: function () {
        this.popup.hide();
        this.hideMask();

        return this;
    },
    showMask: function () {
        this.maskEL.show();

        return this;
    },
    hideMask: function () {
        this.maskEL.hide();
        this.maskEL.hide();
        return this;
    },
    closePopup: function () {
        this.popup.hide();
        this.hideMask();
    },
    overlayIn: function () {
        $('#overlay-loading').fadeIn();
    },
    overLayOut: function () {
        $('#overlay-loading').fadeOut();
    },
    dhtmlx: function () {
        var that = this;
        var week_now = that.getWeekNumber(new Date())[1];
        that.hideMask();
        that.gantt.config.duration_unit = "hour";
        that.gantt.config.columns = [
            {
                name: "text",
                label: "Task name",
                width: "*",
                tree: true
            }
            ,
            {
                name: "start_date",
                label: "Start time",
                align: "left"
            }
            ,
            {
                name: "real_duration",
                label: "Duration",
                align: "center"
            }
        ];
        that.gantt.templates.rightside_text = function (start, end, task) {
            return "<b>Progess: </b>" + (task.progress * 100) + "%";
        };
        that.gantt.config.scale_offset_minimal = false;
        that.gantt.templates.tooltip_text = function (start, end, task) {
            return "<b>Task:</b> " + task.text + "<br/><b>Duration:</b> " + task.real_duration + " hours";
        };
        that.gantt.templates.timeline_cell_class = function (evs, date, section) {
            switch (that.timelineHoverToday) {
                case "days":
                    if (date.getDate() == (new Date()).getDate() &&
                        (new Date(date)).getMonth() == (new Date()).getMonth() &&
                        (new Date(date)).getFullYear() == (new Date()).getFullYear()) {
                        return "now-cell";
                    } else if ((new Date(date)).getMonth() == (new Date()).getMonth() &&
                        (new Date(date)).getFullYear() == (new Date()).getFullYear()) {
                        return "today-cell";
                    }
                    break;
                case "weeks":
                    if (that.getWeekNumber(new Date(date))[1] == week_now) {
                        return "now-cell";
                    } else if ((new Date(date)).getMonth() == (new Date()).getMonth() &&
                        (new Date(date)).getFullYear() == (new Date()).getFullYear()) {
                        return "today-cell"
                    }
                    break;
                default:
                    if ((new Date(date)).getMonth() == (new Date()).getMonth() &&
                        (new Date(date)).getFullYear() == (new Date()).getFullYear()) {
                        return "today-cell";
                    }
                    break;
            }
            return "";
        };

        that.gantt.config.date_format = "%Y-%m-%d %H:%i:%s";
        that.gantt.config.auto_scheduling = true;
        that.gantt.config.auto_scheduling_strict = true;
        // gantt.config.readonly = true;
        that.gantt.config.drag_move = false;
        that.gantt.config.drag_resize = false;
        that.gantt.config.drag_progress = false;
        that.gantt.config.drag_links = false;
        that.gantt.config.work_time = true;      // removes non-working time from calculations
        that.gantt.config.skip_off_time = true;  // hides non-working time in the chart
        gantt.config.open_tree_initially = true; // openes all branches initially
        // gantt.config.details_on_dblclick = true;
        that.gantt.init("gantt_chart");
        that.gantt.load(that.submitURL);
        that.gantt.showLightbox = function (id) {
            that.currentID = id;
            let task = that.gantt.getTask(id);
            let isProject = Number.isInteger(task.id);
            if (that.isAdmin && isProject) {
                that.gantt.alert({
                    title: "Error: Can't update project",
                    type: "alert-error",
                    text: "You CAN NOT update : [" + task.text + "]"
                });
                return false;
            }
            let startDate = that.formatDate(task.start_date);
            // Process for start date elements
            that.renderPopupSelectedInput($(that.selectELYear[0]), startDate['year']);
            that.renderPopupSelectedInput($(that.selectELMonth[0]), startDate['month']);
            that.renderPopupSelectedInput($(that.selectELDay[0]), startDate['day']);
            that.renderPopupSelectedInput($(that.selectELHour[0]), startDate['hour']);
            that.renderPopupSelectedInput($(that.selectELMinute[0]), startDate['minute']);
            that.hideMask();
            that.renderTaskElements(task, that.isAdmin && isProject);
            that.popup.show();
            that.showMask();
        }.bind(that);

        that.gantt.hideLightbox = function () {
            that.popup.hide();
            that.hideMask();
        };
        return that;
    },
    onGanttReady: function () {
        var that = this;
        that.gantt.attachEvent("onLoadEnd", function () {
            that.overLayOut();
            if (that.fromDate.val()) {
                let fromDate = that.fromDate.val();
                let splittedFromDate = fromDate.split("-");
                let fromdate = new Date(splittedFromDate[2], splittedFromDate[1] - 1, splittedFromDate[0]);
                that.gantt.showDate(fromdate); //shows the current date
            }
        });
        return that;
    },
    renderTaskElements: function (task, isProject) {
        // check this task is project or not
        let startDate = this.formatDate(task.start_date);
        $('#popup_task_name').val(task.text);
        if (task.user_assignee_name) {
            $('#user_assignee_name').text(task.user_assignee_name.join(', '));
        }
        $('#popup_description').val(task.description);
        let dateTimeString = startDate['year'] + "-" + startDate['month'] + "-" + startDate['day'] + " " + startDate['hour'] + ":" + startDate['minute'];
        $('.update-task-form .gantt_cal_ltitle .gantt_time').text(dateTimeString);
        $('.update-task-form .gantt_cal_ltitle .gantt_title').text(task.text.trim());
        $('#popup_duration').attr('disabled', isProject).val(task.real_duration);
        $('#popup_project_name').text(task.project_name);
    },
    saveTask: function () {
        var regex = /[0-9]*$/;
        regex.test(this.currentID);
        RegExp.lastMatch;
        var id = RegExp['$&'];
        let month = this.selectELMonth.val() < 10 ? "0" + this.selectELMonth.val() : this.selectELMonth.val();
        let date = this.selectELDay.val() < 10 ? "0" + this.selectELDay.val() : this.selectELDay.val();
        let hour = this.selectELHour.val() < 10 ? "0" + this.selectELHour.val() : this.selectELHour.val();
        let minute = this.selectELMinute.val() < 10 ? "0" + this.selectELMinute.val() : this.selectELMinute.val();
        let data = {
            'id': id,
            'text': $('#popup_task_name').val(),
            'description': $('#popup_description').val(),
            'start_date': this.selectELYear.val() + "-" + month + "-" + date + " " + hour + ":" + minute,
            'duration': $('#popup_duration').val(),
            "_token": $('meta[name="csrf-token"]').attr('content'),
        };
        var that = this;
        $.ajax({
            url: that.saveTaskURL,
            method: 'PUT',
            data: data,
            dataType: 'json',
            async: false,
            success: function (response) {
                that.closePopup();
                that.saveGanttTask(data);
                $('#overlay-loading').fadeOut();
            },
            error: function (response) {
                that.closePopup();
                $('#overlay-loading').fadeOut();
                that.gantt.alert({
                    title: "Error: Update task failed",
                    type: "alert-error",
                    text: "Please check yur input on task: [" + data.text + "]"
                });
            }
        });
    },
    saveGanttTask: function (data) {
        var that = this;
        var task = that.gantt.getTask(that.currentID);
        let previousDuration = task.real_duration;
        task.text = data.text;
        task.description = data.description;
        task.start_date = new Date(data.start_date);
        task.duration = (data.duration);
        task.real_duration = data.duration;
        task.end_date = that.gantt.calculateEndDate(task.start_date, data.duration);
        that.gantt.updateTask(task.id);
        if (that.isAdmin) {
            that.updateParentGanttElement(task, previousDuration);
        }
    },
    updateParentGanttElement: function (task, previousDuration) {
        let project = this.gantt.getTask(task.parent);
        project.duration = ((project.real_duration - previousDuration) + task.duration);
        project.real_duration = (project.real_duration - previousDuration) + task.duration;
        this.gantt.updateTask(project.id);
    },
    setSortField: function (field) {
        this.sortField = field;
    },
    setSortDirection: function (direction) {
        this.sortDirection = direction;
    },
    sorting: function () {
        this.gantt.sort(this.sortField, this.sortDirection);
    },
    formatDate: function (date) {
        let dateTime = new Date(date);
        let result = {
            'year': dateTime.getUTCFullYear(),
            'month': dateTime.getMonth() + 1,
            'day': dateTime.getDate(),
            'hour': dateTime.getHours(),
            'minute': dateTime.getUTCMinutes()
        };
        return result;
    },
    getWeekNumber: function (d) {
        // Copy date so don't modify original
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        // Set to nearest Thursday: current date + 4 - current day number
        // Make Sunday's day number 7
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        // Get first day of year
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        // Calculate full weeks to nearest Thursday
        var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        // Return array of year and week number
        return [d.getUTCFullYear(), weekNo];
    },
};
