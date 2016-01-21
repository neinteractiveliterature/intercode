var CurrencyMaskedInput =
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
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var CurrencyMaskedInput = (function (_Component) {
	  _inherits(CurrencyMaskedInput, _Component);
	
	  function CurrencyMaskedInput(props) {
	    _classCallCheck(this, CurrencyMaskedInput);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CurrencyMaskedInput).call(this, props));
	
	    _this.state = {
	      value: props.value
	    };
	    return _this;
	  }
	
	  _createClass(CurrencyMaskedInput, [{
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      var value = nextProps.value;
	
	      // allows the user to update the value after render
	
	      if (this._isValidUpdateValue(value)) {
	        this.setState({ value: value });
	      }
	    }
	  }, {
	    key: 'onChange',
	    value: function onChange(evt) {
	      var _this2 = this;
	
	      var value = this._maskedInputValue(evt.target.value, evt.target.validity);
	
	      this.setState({ value: value }, function () {
	        if (_this2.props.onChange) {
	          // call original callback, if it exists
	          _this2.props.onChange(evt, value);
	        }
	      });
	    }
	  }, {
	    key: '_isValidUpdateValue',
	    value: function _isValidUpdateValue(value) {
	      // A String of numbers, or a number, will have digits. Null or undefined will not.
	      var isANumber = String(value).match(/\d/g);
	
	      return Boolean(isANumber);
	    }
	  }, {
	    key: '_maskedInputValue',
	    value: function _maskedInputValue(value) {
	      var validity = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	      // a falsy value with "good" input indicates the user is clearing the text,
	      // so allow them to.
	      if (!value && !validity.badInput) {
	        return null;
	      }
	
	      // extract digits. if no digits, fill in a zero.
	      var digits = value.match(/\d/g) || ['0'];
	
	      // zero-pad a one-digit input
	      if (digits.length === 1) {
	        digits.unshift('0');
	      }
	
	      // add a decimal point
	      digits.splice(digits.length - 2, 0, '.');
	
	      // make a number with 2 decimal points
	      return Number(digits.join('')).toFixed(2);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this3 = this;
	
	      return _react2.default.createElement('input', _extends({
	        ref: function ref() {
	          return _this3.value = _this3.state.value;
	        },
	        type: 'number',
	        pattern: '\\d*'
	      }, this.props, {
	        value: this.state.value,
	        onChange: this.onChange.bind(this)
	      }));
	    }
	  }]);
	
	  return CurrencyMaskedInput;
	})(_react.Component);
	
	exports.default = CurrencyMaskedInput;
	
	CurrencyMaskedInput.propTypes = {
	  onChange: _react.PropTypes.func,
	  value: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string])
	};
	
	CurrencyMaskedInput.defaultProps = {
	  value: null
	};
	
	module.exports = CurrencyMaskedInput;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = React;

/***/ }
/******/ ]);
//# sourceMappingURL=react-currency-masked-input.js.map