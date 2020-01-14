@extends('layouts.app')
@section('title', '| Gantt Chart')

@section('content')
    <div class='col-lg-12'>
        <h1>
            <i class='fa fa-key'></i>Gantt Chart
        </h1>
        <hr>

        @include('includes.nav')
        @include('admin.includes.message')
        @include('admin.includes.error')
        <div class="mb-3 row">
            <div class="col-6">
                <p class="button-text-info"
                   style="border-radius: 3px 0px 0px 3px; margin-right: 0px; border-right: 1px solid rgb(196, 201, 204);">
                    Sort by</p>
                <select id="select_sort_field" class="ant-btn button-margin-left ant-dropdown-trigger"
                        style="border-radius: 0px; margin-right: 0px;">
                    <option value="text">None</option>
                    <option value="start_date">Start Date</option>
                    <option value="duration">Duration</option>
                    <option value="progress">Progress</option>
                </select>
                <button data-direction=false type="button" class="sort-direction ant-btn"
                        style="border-radius: 0px 3px 3px 0px; border-left: 1px solid rgb(196, 201, 204);">
                    <svg data-direction=false aria-hidden="true" data-prefix="fas" data-icon="arrow-down"
                         class="svg-inline--fa fa-arrow-down fa-w-14 " role="img" xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 448 512">
                        <path data-direction=false fill="currentColor"
                              d="M413.1 222.5l22.2 22.2c9.4 9.4 9.4 24.6 0 33.9L241 473c-9.4 9.4-24.6 9.4-33.9 0L12.7 278.6c-9.4-9.4-9.4-24.6 0-33.9l22.2-22.2c9.5-9.5 25-9.3 34.3.4L184 343.4V56c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24v287.4l114.8-120.5c9.3-9.8 24.8-10 34.3-.4z"></path>
                    </svg>
                </button>
                <button data-direction=true type="button" class="sort-direction ant-btn"
                        style="display: none;border-radius: 0px 3px 3px 0px; border-left: 1px solid rgb(196, 201, 204);">
                    <svg data-direction=true aria-hidden="true" data-prefix="fas" data-icon="arrow-up"
                         class="svg-inline--fa fa-arrow-up fa-w-14 " role="img" xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 448 512">
                        <path data-direction=true fill="currentColor"
                              d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"></path>
                    </svg>
                </button>
            </div>
            <div class="col-6 text-right">
                <button type="button" class="change-to ant-btn button-margin-left" data-change="refresh">
                    <svg data-change="refresh" aria-hidden="true" data-prefix="fas" data-icon="redo-alt"
                         class="svg-inline--fa fa-redo-alt fa-w-16 " role="img" xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 512 512">
                        <path data-change="refresh" fill="currentColor"
                              d="M256.455 8c66.269.119 126.437 26.233 170.859 68.685l35.715-35.715C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.75c-30.864-28.899-70.801-44.907-113.23-45.273-92.398-.798-170.283 73.977-169.484 169.442C88.764 348.009 162.184 424 256 424c41.127 0 79.997-14.678 110.629-41.556 4.743-4.161 11.906-3.908 16.368.553l39.662 39.662c4.872 4.872 4.631 12.815-.482 17.433C378.202 479.813 319.926 504 256 504 119.034 504 8.001 392.967 8 256.002 7.999 119.193 119.646 7.755 256.455 8z"></path>
                    </svg>
                </button>
                <div class="ant-radio-group">
                    <label data-change="days" class="change-to ant-radio-button-wrapper ant-radio-button-wrapper-checked">
                        <span class="ant-radio-button">
                            <input type="radio" class="ant-radio-button ant-radio-button-checked" value="Days">
                            <span class="ant-radio-button-inner"> </span>
                        </span>
                        <span >Days</span>
                    </label>
                    <label data-change="weeks" class="change-to ant-radio-button-wrapper">
                        <span class="ant-radio-button">
                            <input type="radio" class="ant-radio-button-input" value="Weeks">
                            <span class="ant-radio-button-inner"></span>
                        </span>
                        <span>Weeks</span>
                    </label>
                    <label data-change="months" class="change-to ant-radio-button-wrapper">
                        <span class="ant-radio-button">
                            <input type="radio" class="ant-radio-button-input" value="Months">
                            <span class="ant-radio-button-inner"></span>
                        </span>
                        <span>Months</span>
                    </label>
                </div>
            </div>
        </div>
        <div class="mb-3 row">
            <div class="col-12 float-right">
                <div class="float-right">
                    <div class="form-inline">
                        <div class="btn-group mr-1">
                            <input id="task_name" type="text" class="form-control" placeholder="Task name..."
                                   aria-label="" name="task_name">
                        </div>
                        <div class="btn-group mr-1">
                            <input id="project_name" type="text" class="ml-1 form-control"
                                   placeholder="Projects name..." aria-label="" name="project_name">
                        </div>
                        <div class="btn-group mr-1">
                            {{ Form::select('author_name', $users, $params['author_name'] ?? [], ['id' => 'author_name', 'class' => 'ml-1 w-200px text-capitalize selectPlugin selectizedCustomize', 'placeholder' => 'Choose author...']) }}
                        </div>
                        <div class="btn-group mr-1">
                            {{ Form::select('assignee_name', $users, $params['assignee_name'] ?? [], ['id' => 'assignee_name', 'class' => 'ml-1 w-200px text-capitalize selectPlugin selectizedCustomize', 'placeholder' => 'Choose assignee...']) }}
                        </div>
                        <div class="btn-group mr-2">
                            {{ Form::select('labels_name', $labels, $params['labels_name'] ?? [], ['id' => 'labels_name', 'class' => 'ml-1 w-150px text-capitalize selectPlugin selectizedCustomize', 'placeholder' => 'Choose label...']) }}
                        </div>
                        <div class="btn-group mr-2">
                            {{ Form::select('team_id', $teams, $params['team_id'] ?? [], ['id' => 'team_id', 'class' => 'ml-1 w-200px text-capitalize selectPlugin selectizedCustomize', 'placeholder' => 'Choose team...']) }}
                        </div>
                        <div class="btn-group mr-2">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <div class="input-group-text">From:</div>
                                </div>
                                <input id="btnfmdate" type="text" class="form-control w-100px" aria-label="" name="fmdate">
                            </div>
                        </div>
                        <div class="btn-group mr-2">
                            <div class="input-group-prepend">
                                <div class="input-group-text">To:</div>
                            </div>
                            <input id="btntodate" type="text" class="form-control w-100px" aria-label="" name="todate">
                            <div class="input-group-append">
                                <button class="btn btn-secondary" type="button" id="filter_button">Filter
                                </button>
                            </div>
                            <div class="input-group-append">
                                <button class="btn btn-outline-secondary" type="button" id="refresh_button">Refresh</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <hr>
        <div id="gantt_chart" style='width:100%; height:570px;'></div>
    </div>
    <form class="update-task-form" action="#" method="post">
        <div class="gantt_cal_light" role="dialog" aria-hidden="false"
             style="position: absolute;visibility: visible; height: 355px; display: none; top: 50%; left: 50%;"
             aria-label=" ">
            <div class="gantt_cal_ltitle" role="heading" style="cursor: pointer;">
                <span class="gantt_mark">&nbsp;</span>[<span class="gantt_time"></span>] - [<span
                    class="gantt_title"></span>]
            </div>
            <div class="gantt_cal_larea" style="height: 465px;">
                <div id="area_1566182907448" class="gantt_cal_lsection">
                    <label for="input_1566182907454"
                           style=" display: none !important">undefined</label>
                </div>
                <div class="dhx_cal_ltext">
                    <label>Title</label>
                    <input style="max-width: 523px" class="input-inline" type="text"
                           id="popup_task_name">
                </div>
                <div class="dhx_cal_ltext">
                    <label>Asignees </label>
                    <div style="max-width: 523px; font-weight: normal"
                         id="user_assignee_name">
                    </div>
                </div>
                <div class="dhx_cal_ltext">
                    <label>Description</label>
                    <textarea style="max-width: 523px" cols="75" rows="5" class="input-inline" type="text"
                              id="popup_description">
                    </textarea>
                </div>
                <div class="dhx_cal_ltext">
                    <label>Project: <b id="popup_project_name">< Project's Name ></b></label>
                </div>
                <div style="height:72px;padding-top:0px;font-size:inherit;text-align:center;"
                     class="gantt_section_time">
                    <div>
                        <label>Start date (Y-m-d H:i)</label>
                        <select aria-label="Years" id="start_year">

                        </select>
                        -
                        <select aria-label="Months" id="start_month">

                        </select>
                        -
                        <select aria-label="Days" id="start_day">

                        </select>
                        &nbsp;&nbsp;&nbsp;
                        <select aria-label="Hours" id="start_hour">

                        </select>
                        :
                        <select aria-label="Minutes" id="start_minute">

                        </select>
                    </div>
                    <div id="area_1566182907448" class="gantt_cal_lsection">
                        <label for="input_1566182907454" style=" display: none !important">undefined</label>
                    </div>
                    <div>
                        <label>Duration</label>
                        <input style="width: auto!important;" class="input-inline" type="number" step="0.5"
                               id="popup_duration">
                    </div>
                </div>
            </div>
            <div role="button" aria-label="Add Card" tabindex="0"
                 class="gantt_btn_set gantt_left_btn_set gantt_save_btn_set">
                <div dhx_button="1" class="gantt_save_btn"></div>
                <div>Update</div>
            </div>
            <div role="button" aria-label="Cancel" tabindex="0"
                 class="gantt_btn_set gantt_left_btn_set gantt_cancel_btn_set">
                <div dhx_button="1" class="gantt_cancel_btn"></div>
                <div>Cancel</div>
            </div>
        </div>
    </form>
    <div class="gantt_cal_cover" style="height: 927px;display: none"></div>
@endsection
@push('styles')
    <link href="{{ asset('js/ganttchart/css/dhtmlxgantt.css') }}" rel="stylesheet" type="text/css">
    <link href="{{ asset('selectize/selectize.default.css') }}" rel="stylesheet" type="text/css">
    <link href="{{ asset('datetimepicker/css/jquery-ui.css') }}" rel="stylesheet">
    <link href="{{ asset('css/dhtmlxgantt_material.css') }}" rel="stylesheet">
    <style type="text/css">
        html, body {
            height: 100%;
            padding: 0px;
            margin: 0px;
            overflow: hidden;
        }

        .today-cell {
            background: #f7e0b7;
        }
        .now-cell{
            background: #b6e284;
        }
    </style>
@endpush
@push('scripts')
    <script type="text/javascript" src="{{ asset('js/ganttchart/js/dhtmlxgantt.js') }}"></script>
    <script type="text/javascript" src="{{ asset('js/ganttchart/js/dhtmlxgantt_tooltip.js') }}"></script>
    <script type="text/javascript" src="{{ asset('datetimepicker/js/jquery-ui.js') }}"></script>
    <script type="text/javascript" src="{{ asset('selectize/selectize.min.js') }}"></script>
    <script type="text/javascript">
        // Form filter
        var filterLabelsField = $('#labels_name');
        var filterAssigneeField = $('#assignee_name');
        var filterAuthorField = $('#author_name');
        var filterTeamsField = $('#team_id');
        var ganttChart = {};
        $(function () {
            ganttChart = new GanttChart({
                submitURL: "{{ route('admin.gantt.data') }}",
                saveTaskURL: "{{ route('admin.gantt.update') }}",
                year_el: 'select#start_year',
                month_el: 'select#start_month',
                day_el: 'select#start_day',
                hour_el: 'select#start_hour',
                minute_el: 'select#start_minute',
                gantt_chart: 'div#gantt_chart',
                isAdmin: true,
                gantt: gantt,
                filterButton: '#filter_button',
                refreshButton: '#refresh_button',
                filterLabelsField: filterLabelsField,
                filterAssigneeField: filterAssigneeField,
                filterAuthorField: filterAuthorField,
                filterTeamsField: filterTeamsField,
            });
            // Init element and gantt chart
            ganttChart.render().dhtmlx();
            ganttChart.popup.center();
            $(window).resize(function () {
                ganttChart.popup.center();
            });
        });
    </script>
    <script type="text/javascript" src="{{ asset('js/ganttchart/js/process.js') }}"></script>
@endpush
