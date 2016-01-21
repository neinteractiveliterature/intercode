var Datetime =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var assign = __webpack_require__(2),
		React = __webpack_require__(3),
		DaysView = __webpack_require__(4),
		MonthsView = __webpack_require__(6),
		YearsView = __webpack_require__(7),
		TimeView = __webpack_require__(8),
		moment = __webpack_require__(5)
	;
	
	var TYPES = React.PropTypes;
	var Datetime = React.createClass({
		mixins: [
			__webpack_require__(9)
		],
		viewComponents: {
			days: DaysView,
			months: MonthsView,
			years: YearsView,
			time: TimeView
		},
		propTypes: {
			// value: TYPES.object | TYPES.string,
			// defaultValue: TYPES.object | TYPES.string,
			onBlur: TYPES.func,
			onChange: TYPES.func,
			locale: TYPES.string,
			input: TYPES.bool,
			// dateFormat: TYPES.string | TYPES.bool,
			// timeFormat: TYPES.string | TYPES.bool,
			inputProps: TYPES.object,
			viewMode: TYPES.oneOf(['years', 'months', 'days', 'time']),
			isValidDate: TYPES.func,
			open: TYPES.bool,
			strictParsing: TYPES.bool
		},
	
		getDefaultProps: function() {
			var nof = function(){};
			return {
				className: '',
				defaultValue: '',
				viewMode: 'days',
				inputProps: {},
				input: true,
				onBlur: nof,
				onChange: nof,
				timeFormat: true,
				dateFormat: true,
				strictParsing: true
			};
		},
	
		getInitialState: function() {
			var state = this.getStateFromProps( this.props );
	
			if( state.open == undefined )
				state.open = !this.props.input;
	
			state.currentView = this.props.dateFormat ? this.props.viewMode : 'time';
	
			return state;
		},
	
		getStateFromProps: function( props ){
			var formats = this.getFormats( props ),
				date = props.value || props.defaultValue,
				selectedDate, viewDate
			;
	
			if( date && typeof date == 'string' )
				selectedDate = this.localMoment( date, formats.datetime );
			else if( date )
				selectedDate = this.localMoment( date );
	
			if( selectedDate && !selectedDate.isValid() )
				selectedDate = null;
	
			viewDate = selectedDate ?
				selectedDate.clone().startOf("month") :
				this.localMoment().startOf("month")
			;
	
			return {
				inputFormat: formats.datetime,
				viewDate: viewDate,
				selectedDate: selectedDate,
				inputValue: selectedDate ? selectedDate.format( formats.datetime ) : (date || ''),
				open: props.open != undefined ? props.open : this.state && this.state.open
			};
		},
	
		getFormats: function( props ){
			var formats = {
					date: props.dateFormat || '',
					time: props.timeFormat || ''
				},
				locale = this.localMoment( props.date ).localeData()
			;
	
			if( formats.date === true ){
				formats.date = locale.longDateFormat('L');
			}
			if( formats.time === true ){
				formats.time = locale.longDateFormat('LT');
			}
	
			formats.datetime = formats.date && formats.time ?
				formats.date + ' ' + formats.time :
				formats.date || formats.time
			;
	
			return formats;
		},
	
		componentWillReceiveProps: function(nextProps) {
			var formats = this.getFormats( nextProps ),
				update = {}
			;
	
			if( nextProps.value != this.props.value ){
				update = this.getStateFromProps( nextProps );
			}
			if ( formats.datetime !== this.getFormats( this.props ).datetime ) {
				update.inputFormat = formats.datetime;
			}
	
			this.setState( update );
		},
	
		onInputChange: function( e ) {
			var value = e.target == null ? e : e.target.value,
				localMoment = this.localMoment( value, this.state.inputFormat ),
				update = { inputValue: value }
			;
	
			if ( localMoment.isValid() && !this.props.value ) {
				update.selectedDate = localMoment;
				update.viewDate = localMoment.clone().startOf("month");
			}
			else {
				update.selectedDate = null;
			}
	
			return this.setState( update, function() {
				return this.props.onChange( localMoment.isValid() ? localMoment : this.state.inputValue );
			});
		},
	
		showView: function( view ){
			var me = this;
			return function( e ){
				me.setState({ currentView: view });
			};
		},
	
		setDate: function( type ){
			var me = this,
				nextViews = {
					month: 'days',
					year: 'months'
				}
			;
			return function( e ){
				me.setState({
					viewDate: me.state.viewDate.clone()[ type ]( parseInt(e.target.getAttribute('data-value')) ).startOf( type ),
					currentView: nextViews[ type ]
				});
			};
		},
	
		addTime: function( amount, type, toSelected ){
			return this.updateTime( 'add', amount, type, toSelected );
		},
	
		subtractTime: function( amount, type, toSelected ){
			return this.updateTime( 'subtract', amount, type, toSelected );
		},
	
		updateTime: function( op, amount, type, toSelected ){
			var me = this;
	
			return function(){
				var update = {},
					date = toSelected ? 'selectedDate' : 'viewDate'
				;
	
				update[ date ] = me.state[ date ].clone()[ op ]( amount, type );
	
				me.setState( update );
			};
		},
	
		allowedSetTime: ['hours','minutes','seconds', 'milliseconds'],
		setTime: function( type, value ){
			var index = this.allowedSetTime.indexOf( type ) + 1,
				state = this.state,
				date = (state.selectedDate || state.viewDate).clone(),
				nextType
			;
	
			// It is needed to set all the time properties
			// to not to reset the time
			date[ type ]( value );
			for (; index < this.allowedSetTime.length; index++) {
				nextType = this.allowedSetTime[index];
				date[ nextType ]( date[nextType]() );
			}
	
			if( !this.props.value ){
				this.setState({
					selectedDate: date,
					inputValue: date.format( state.inputFormat )
				});
			}
			this.props.onChange( date );
		},
	
		updateSelectedDate: function( e ) {
			var target = e.target,
				modifier = 0,
				viewDate = this.state.viewDate,
				currentDate = this.state.selectedDate || viewDate,
				date
			;
	
			if(target.className.indexOf("rdtNew") != -1)
				modifier = 1;
			else if(target.className.indexOf("rdtOld") != -1)
				modifier = -1;
	
			date = viewDate.clone()
				.month( viewDate.month() + modifier )
				.date( parseInt( target.getAttribute('data-value') ) )
				.hours( currentDate.hours() )
				.minutes( currentDate.minutes() )
				.seconds( currentDate.seconds() )
				.milliseconds( currentDate.milliseconds() )
			;
	
			if( !this.props.value ){
				this.setState({
					selectedDate: date,
					viewDate: date.clone().startOf('month'),
					inputValue: date.format( this.state.inputFormat )
				});
			}
	
			this.props.onChange( date );
		},
	
		openCalendar: function() {
			this.setState({ open: true });
		},
	
		handleClickOutside: function(){
			if( this.props.input && this.state.open && !this.props.open ){
				this.setState({ open: false });
				this.props.onBlur( this.state.selectedDate || this.state.inputValue );
			}
		},
	
		localMoment: function( date, format ){
			var m = moment( date, format, this.props.strictParsing );
			if( this.props.locale )
				m.locale( this.props.locale );
			return m;
		},
	
		componentProps: {
			fromProps: ['value', 'isValidDate', 'renderDay', 'renderMonth', 'renderYear'],
			fromState: ['viewDate', 'selectedDate' ],
			fromThis: ['setDate', 'setTime', 'showView', 'addTime', 'subtractTime', 'updateSelectedDate', 'localMoment']
		},
	
		getComponentProps: function(){
			var me = this,
				formats = this.getFormats( this.props ),
				props = {dateFormat: formats.date, timeFormat: formats.time}
			;
	
			this.componentProps.fromProps.forEach( function( name ){
				props[ name ] = me.props[ name ];
			});
			this.componentProps.fromState.forEach( function( name ){
				props[ name ] = me.state[ name ];
			});
			this.componentProps.fromThis.forEach( function( name ){
				props[ name ] = me[ name ];
			});
	
			return props;
		},
	
		render: function() {
			var Component = this.viewComponents[ this.state.currentView ],
				DOM = React.DOM,
				className = 'rdt ' + this.props.className,
				children = []
			;
	
			if( this.props.input ){
				children = [ DOM.input( assign({
					key: 'i',
					type:'text',
					className: 'form-control',
					onFocus: this.openCalendar,
					onChange: this.onInputChange,
					value: this.state.inputValue
				}, this.props.inputProps ))];
			}
			else {
				className += ' rdtStatic';
			}
	
			if( this.state.open )
				className += ' rdtOpen';
	
			return DOM.div({className: className}, children.concat(
				DOM.div(
					{ key: 'dt', className: 'rdtPicker' },
					React.createElement( Component, this.getComponentProps())
				)
			));
		}
	});
	
	// Make moment accessible through the Datetime class
	Datetime.moment = moment;
	
	module.exports = Datetime;


/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;
	
	function ToObject(val) {
		if (val == null) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}
	
		return Object(val);
	}
	
	function ownEnumerableKeys(obj) {
		var keys = Object.getOwnPropertyNames(obj);
	
		if (Object.getOwnPropertySymbols) {
			keys = keys.concat(Object.getOwnPropertySymbols(obj));
		}
	
		return keys.filter(function (key) {
			return propIsEnumerable.call(obj, key);
		});
	}
	
	module.exports = Object.assign || function (target, source) {
		var from;
		var keys;
		var to = ToObject(target);
	
		for (var s = 1; s < arguments.length; s++) {
			from = arguments[s];
			keys = ownEnumerableKeys(Object(from));
	
			for (var i = 0; i < keys.length; i++) {
				to[keys[i]] = from[keys[i]];
			}
		}
	
		return to;
	};


/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(3),
		moment = __webpack_require__(5)
	;
	
	var DOM = React.DOM;
	var DateTimePickerDays = React.createClass({
	
		render: function() {
			var footer = this.renderFooter(),
				date = this.props.viewDate,
				locale = date.localeData(),
				tableChildren
			;
	
			tableChildren = [
				DOM.thead({ key: 'th'}, [
					DOM.tr({ key: 'h'},[
						DOM.th({ key: 'p', className: 'rdtPrev' }, DOM.button({onClick: this.props.subtractTime(1, 'months'), type: 'button' }, '‹')),
						DOM.th({ key: 's', className: 'rdtSwitch', onClick: this.props.showView('months'), colSpan: 5, 'data-value': this.props.viewDate.month() }, locale.months( date ) + ' ' + date.year() ),
						DOM.th({ key: 'n', className: 'rdtNext' }, DOM.button({onClick: this.props.addTime(1, 'months'), type: 'button' }, '›'))
					]),
					DOM.tr({ key: 'd'}, this.getDaysOfWeek( locale ).map( function( day, index ){ return DOM.th({ key: day + index, className: 'dow'}, day ); }) )
				]),
				DOM.tbody({key: 'tb'}, this.renderDays())
			];
	
			if( footer )
				tableChildren.push( footer );
	
			return DOM.div({ className: 'rdtDays' },
				DOM.table({}, tableChildren )
			);
		},
	
		/**
		 * Get a list of the days of the week
		 * depending on the current locale
		 * @return {array} A list with the shortname of the days
		 */
		getDaysOfWeek: function( locale ){
			var days = locale._weekdaysMin,
				first = locale.firstDayOfWeek(),
				dow = [],
				i = 0
			;
	
			days.forEach( function( day ){
				dow[ (7 + (i++) - first) % 7 ] = day;
			});
	
			return dow;
		},
	
		renderDays: function() {
			var date = this.props.viewDate,
				selected = this.props.selectedDate && this.props.selectedDate.clone(),
				prevMonth = date.clone().subtract( 1, 'months' ),
				currentYear = date.year(),
				currentMonth = date.month(),
				weeks = [],
				days = [],
				renderer = this.props.renderDay || this.renderDay,
				isValid = this.props.isValidDate || this.isValidDate,
				classes, disabled, dayProps, currentDate
			;
	
			// Go to the last week of the previous month
			prevMonth.date( prevMonth.daysInMonth() ).startOf('week');
			var lastDay = prevMonth.clone().add(42, 'd');
	
			while( prevMonth.isBefore( lastDay ) ){
				classes = 'rdtDay';
				currentDate = prevMonth.clone();
	
				if( ( prevMonth.year() == currentYear && prevMonth.month() < currentMonth ) || ( prevMonth.year() < currentYear ) )
					classes += ' rdtOld';
				else if( ( prevMonth.year() == currentYear && prevMonth.month() > currentMonth ) || ( prevMonth.year() > currentYear ) )
					classes += ' rdtNew';
	
				if( selected && prevMonth.isSame( {y: selected.year(), M: selected.month(), d: selected.date()} ) )
					classes += ' rdtActive';
	
				if (prevMonth.isSame(moment(), 'day') )
					classes += ' rdtToday';
	
				disabled = !isValid( currentDate, selected );
				if( disabled )
					classes += ' rdtDisabled';
	
				dayProps = {
					key: prevMonth.format('M_D'),
					'data-value': prevMonth.date(),
					className: classes
				};
				if( !disabled )
					dayProps.onClick = this.props.updateSelectedDate;
	
				days.push( renderer( dayProps, currentDate, selected ) );
	
				if( days.length == 7 ){
					weeks.push( DOM.tr( {key: prevMonth.format('M_D')}, days ) );
					days = [];
				}
	
				prevMonth.add( 1, 'd' );
			}
	
			return weeks;
		},
	
		renderDay: function( props, currentDate, selectedDate ){
			return DOM.td( props, currentDate.date() );
		},
	
		renderFooter: function(){
			if( !this.props.timeFormat )
				return '';
	
			var date = this.props.selectedDate || this.props.viewDate;
			return DOM.tfoot({ key: 'tf'},
				DOM.tr({},
					DOM.td({ onClick: this.props.showView('time'), colSpan: 7, className: 'rdtTimeToggle'}, date.format( this.props.timeFormat ))
				)
			);
		},
		isValidDate: function(){ return 1; }
	});
	
	module.exports = DateTimePickerDays;


/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = moment;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(3),
	moment = __webpack_require__(5)
	;
	
	var DOM = React.DOM;
	var DateTimePickerMonths = React.createClass({
		render: function() {
			return DOM.div({ className: 'rdtMonths' },[
				DOM.table({ key: 'a'}, DOM.thead({}, DOM.tr({},[
					DOM.th({ key: 'prev', className: 'rdtPrev' }, DOM.button({onClick: this.props.subtractTime(1, 'years'), type: 'button' }, '‹')),
					DOM.th({ key: 'year', className: 'rdtSwitch', onClick: this.props.showView('years'), colSpan: 2, 'data-value': this.props.viewDate.year()}, this.props.viewDate.year() ),
					DOM.th({ key: 'next', className: 'rdtNext' }, DOM.button({onClick: this.props.addTime(1, 'years'), type: 'button' }, '›'))
				]))),
				DOM.table({ key: 'months'}, DOM.tbody({ key: 'b'}, this.renderMonths()))
			]);
		},
	
		renderMonths: function() {
			var date = this.props.selectedDate,
				month = this.props.viewDate.month(),
				year = this.props.viewDate.year(),
				rows = [],
				i = 0,
				months = [],
				renderer = this.props.renderMonth || this.renderMonth,
				classes, props
			;
	
			while (i < 12) {
				classes = "rdtMonth";
				if( date && i === month && year === date.year() )
					classes += " rdtActive";
	
				props = {
					key: i,
					'data-value': i,
					className: classes,
					onClick: this.props.setDate('month')
				};
	
				months.push( renderer( props, i, year, date && date.clone() ));
	
				if( months.length == 4 ){
					rows.push( DOM.tr({ key: month + '_' + rows.length }, months) );
					months = [];
				}
	
				i++;
			}
	
			return rows;
		},
	
		renderMonth: function( props, month, year, selectedDate ) {
			return DOM.td( props, this.props.viewDate.localeData()._monthsShort[ month ] );
		}
	});
	
	module.exports = DateTimePickerMonths;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(3);
	
	var DOM = React.DOM;
	var DateTimePickerYears = React.createClass({
		render: function() {
			var year = parseInt(this.props.viewDate.year() / 10, 10) * 10;
	
			return DOM.div({ className: 'rdtYears' },[
				DOM.table({ key: 'a'}, DOM.thead({}, DOM.tr({},[
					DOM.th({ key: 'prev', className: 'rdtPrev' }, DOM.button({onClick: this.props.subtractTime(10, 'years'), type: 'button' }, '‹')),
					DOM.th({ key: 'year', className: 'rdtSwitch', onClick: this.props.showView('years'), colSpan: 2 }, year + '-' + (year + 9) ),
					DOM.th({ key: 'next', className: 'rdtNext'}, DOM.button({onClick: this.props.addTime(10, 'years'), type: 'button' }, '›'))
					]))),
				DOM.table({ key: 'years'}, DOM.tbody({}, this.renderYears( year )))
			]);
		},
	
		renderYears: function( year ) {
			var years = [],
				i = -1,
				rows = [],
				renderer = this.props.renderYear || this.renderYear,
				selectedDate = this.props.selectedDate,
				classes, props
			;
	
			year--;
			while (i < 11) {
				classes = 'rdtYear';
				if( i === -1 | i === 10 )
					classes += ' rdtOld';
				if( selectedDate && selectedDate.year() === year )
					classes += ' rdtActive';
	
				props = {
					key: year,
					'data-value': year,
					className: classes,
					onClick: this.props.setDate('year')
				};
	
				years.push( renderer( props, year, selectedDate && selectedDate.clone() ));
	
				if( years.length == 4 ){
					rows.push( DOM.tr({ key: i }, years ) );
					years = [];
				}
	
				year++;
				i++;
			}
	
			return rows;
		},
	
		renderYear: function( props, year, selectedDate ){
			return DOM.td( props, year );
		}
	});
	
	module.exports = DateTimePickerYears;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(3);
	
	var DOM = React.DOM;
	var DateTimePickerTime = React.createClass({
		getInitialState: function(){
			return this.calculateState( this.props );
		},
		calculateState: function( props ){
			var date = props.selectedDate || props.viewDate,
				format = props.timeFormat,
				counters = []
			;
	
			if( format.indexOf('H') != -1 || format.indexOf('h') != -1 ){
				counters.push('hours');
				if( format.indexOf('m') != -1 ){
					counters.push('minutes');
					if( format.indexOf('s') != -1 ){
						counters.push('seconds');
					}
				}
			}
	
			return {
				hours: date.format('H'),
				minutes: date.format('mm'),
				seconds: date.format('ss'),
				milliseconds: date.format('SSS'),
				counters: counters
			};
		},
		renderCounter: function( type ){
			return DOM.div({ key: type, className: 'rdtCounter'}, [
				DOM.button({ key:'up', className: 'rdtBtn', onMouseDown: this.onStartClicking( 'increase', type ), type: 'button' }, '▲' ),
				DOM.div({ key:'c', className: 'rdtCount' }, this.state[ type ] ),
				DOM.button({ key:'do', className: 'rdtBtn', onMouseDown: this.onStartClicking( 'decrease', type ), type: 'button' }, '▼' )
			]);
		},
		render: function() {
			var me = this,
				counters = []
			;
	
			this.state.counters.forEach( function(c){
				if( counters.length )
					counters.push( DOM.div( {key: 'sep' + counters.length, className: 'rdtCounterSeparator' }, ':' ));
				counters.push( me.renderCounter( c ) );
			});
	
			if( this.state.counters.length == 3 && this.props.timeFormat.indexOf('S') != -1 ){
				counters.push( DOM.div( {className: 'rdtCounterSeparator', key: 'sep5' }, ':' ));
				counters.push(
					DOM.div( {className: 'rdtCounter rdtMilli', key:'m'},
						DOM.input({ value: this.state.milliseconds, type: 'text', onChange: this.updateMilli })
						)
					);
			}
	
			return DOM.div( {className: 'rdtTime'},
				DOM.table( {}, [
					this.renderHeader(),
					DOM.tbody({key: 'b'}, DOM.tr({}, DOM.td({},
						DOM.div({ className: 'rdtCounters' }, counters )
					)))
				])
			);
		},
		componentWillReceiveProps: function( nextProps, nextState ){
			this.setState( this.calculateState( nextProps ) );
		},
		updateMilli: function( e ){
			var milli = parseInt( e.target.value );
			if( milli == e.target.value && milli >= 0 && milli < 1000 ){
				this.props.setTime( 'milliseconds', milli );
				this.setState({ milliseconds: milli });
			}
		},
		renderHeader: function(){
			if( !this.props.dateFormat )
				return '';
	
			var date = this.props.selectedDate || this.props.viewDate;
			return DOM.thead({ key: 'h'}, DOM.tr({},
				DOM.th( {className: 'rdtSwitch', colSpan: 4, onClick: this.props.showView('days')}, date.format( this.props.dateFormat ) )
			));
		},
		onStartClicking: function( action, type ){
			var me = this,
				update = {},
				value = this.state[ type ]
			;
	
	
			return function(){
				var update = {};
				update[ type ] = me[ action ]( type );
				me.setState( update );
	
				me.timer = setTimeout( function(){
					me.increaseTimer = setInterval( function(){
						update[ type ] = me[ action ]( type );
						me.setState( update );
					},70);
				}, 500);
	
				me.mouseUpListener = function(){
					clearTimeout( me.timer );
					clearInterval( me.increaseTimer );
					me.props.setTime( type, me.state[ type ] );
					document.body.removeEventListener('mouseup', me.mouseUpListener);
				};
	
				document.body.addEventListener('mouseup', me.mouseUpListener);
			};
		},
	
		maxValues: {
			hours: 23,
			minutes: 59,
			seconds: 59,
			milliseconds: 999
		},
		padValues: {
			hours: 1,
			minutes: 2,
			seconds: 2,
			milliseconds: 3
		},
		increase: function( type ){
			var value = parseInt(this.state[ type ]) + 1;
			if( value > this.maxValues[ type ] )
				value = 0;
			return this.pad( type, value );
		},
		decrease: function( type ){
			var value = parseInt(this.state[ type ]) - 1;
			if( value < 0 )
				value = this.maxValues[ type ];
			return this.pad( type, value );
		},
		pad: function( type, value ){
			var str = value + '';
			while( str.length < this.padValues[ type ] )
				str = '0' + str;
			return str;
		}
	});
	
	module.exports = DateTimePickerTime;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// This is extracted from https://github.com/Pomax/react-onclickoutside
	// And modified to support react 0.13 and react 0.14
	
	var React = __webpack_require__(3),
		version = React.version && React.version.split('.')
	;
	
	if( version && ( version[0] > 0 || version[1] > 13 ) )
		React = __webpack_require__(10);
	
	// Use a parallel array because we can't use
	// objects as keys, they get toString-coerced
	var registeredComponents = [];
	var handlers = [];
	
	var IGNORE_CLASS = 'ignore-react-onclickoutside';
	
	var isSourceFound = function(source, localNode) {
	 if (source === localNode) {
	   return true;
	 }
	 // SVG <use/> elements do not technically reside in the rendered DOM, so
	 // they do not have classList directly, but they offer a link to their
	 // corresponding element, which can have classList. This extra check is for
	 // that case.
	 // See: http://www.w3.org/TR/SVG11/struct.html#InterfaceSVGUseElement
	 // Discussion: https://github.com/Pomax/react-onclickoutside/pull/17
	 if (source.correspondingElement) {
	   return source.correspondingElement.classList.contains(IGNORE_CLASS);
	 }
	 return source.classList.contains(IGNORE_CLASS);
	};
	
	module.exports = {
	 componentDidMount: function() {
	   if(typeof this.handleClickOutside !== "function")
	     throw new Error("Component lacks a handleClickOutside(event) function for processing outside click events.");
	
	   var fn = this.__outsideClickHandler = (function(localNode, eventHandler) {
	     return function(evt) {
	       evt.stopPropagation();
	       var source = evt.target;
	       var found = false;
	       // If source=local then this event came from "somewhere"
	       // inside and should be ignored. We could handle this with
	       // a layered approach, too, but that requires going back to
	       // thinking in terms of Dom node nesting, running counter
	       // to React's "you shouldn't care about the DOM" philosophy.
	       while(source.parentNode) {
	         found = isSourceFound(source, localNode);
	         if(found) return;
	         source = source.parentNode;
	       }
	       eventHandler(evt);
	     }
	   }(React.findDOMNode(this), this.handleClickOutside));
	
	   var pos = registeredComponents.length;
	   registeredComponents.push(this);
	   handlers[pos] = fn;
	
	   // If there is a truthy disableOnClickOutside property for this
	   // component, don't immediately start listening for outside events.
	   if (!this.props.disableOnClickOutside) {
	     this.enableOnClickOutside();
	   }
	 },
	
	 componentWillUnmount: function() {
	   this.disableOnClickOutside();
	   this.__outsideClickHandler = false;
	   var pos = registeredComponents.indexOf(this);
	   if( pos>-1) {
	     if (handlers[pos]) {
	       // clean up so we don't leak memory
	       handlers.splice(pos, 1);
	       registeredComponents.splice(pos, 1);
	     }
	   }
	 },
	
	 /**
	  * Can be called to explicitly enable event listening
	  * for clicks and touches outside of this element.
	  */
	 enableOnClickOutside: function() {
	   var fn = this.__outsideClickHandler;
	   document.addEventListener("mousedown", fn);
	   document.addEventListener("touchstart", fn);
	 },
	
	 /**
	  * Can be called to explicitly disable event listening
	  * for clicks and touches outside of this element.
	  */
	 disableOnClickOutside: function() {
	   var fn = this.__outsideClickHandler;
	   document.removeEventListener("mousedown", fn);
	   document.removeEventListener("touchstart", fn);
	 }
	};


/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = ReactDOM;

/***/ }
/******/ ]);
//# sourceMappingURL=react-datetime.js.map