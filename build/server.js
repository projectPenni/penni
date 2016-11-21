/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _express = __webpack_require__(1);

	var _express2 = _interopRequireDefault(_express);

	var _App = __webpack_require__(2);

	var _App2 = _interopRequireDefault(_App);

	var _server = __webpack_require__(5);

	var _server2 = _interopRequireDefault(_server);

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	var _v = __webpack_require__(9);

	var _v2 = _interopRequireDefault(_v);

	var _config = __webpack_require__(7);

	var _config2 = _interopRequireDefault(_config);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var app = (0, _express2.default)();

	var conversation = new _v2.default(_config2.default.login);
	var id = 1;

	var dialogueContexts = {};

	app.use('/static', _express2.default.static('static'));

	app.get('/', function (req, res) {
	  res.status(200).send('\n    <!DOCTYPE html>\n    <html>\n      <head>\n        <title>Penni</title>\n      </head>\n      <body>\n        <div id=\'main\'>\n        ' + 'loading...' + '\n        </div>\n        <script>var _id = ' + id.toString() + '</script>\n        <script src="/static/client.js"></script>\n      </body>\n  ');
	  id++;
	});

	app.get('/message', function (req, res) {
	  var message = req.query.message;
	  var _id = req.query._id;
	  if (!message) {
	    res.status(200).send("Sorry, I don't understand that");
	  } else if (!_id) {
	    res.status(400).send("You did not supply your id");
	  } else {
	    var context = undefined;
	    if (dialogueContexts.hasOwnProperty(_id)) {
	      context = dialogueContexts[_id];
	    }
	    conversation.message({
	      input: { text: message },
	      workspace_id: _config2.default.workspace_id,
	      context: context
	    }, function (err, response) {
	      if (err) {
	        console.error(err);
	        res.status(500).send("Sorry, we encountered an error");
	      } else {
	        if (response.output.text.length === 0) {
	          res.status(200).send("I don't know what to say...");
	        } else {
	          var reply = response.output.text.join('SPLITPOINT');
	          res.status(200).send(reply);
	        }
	        dialogueContexts[_id] = response.context;
	      }
	    });
	  }
	});

	app.get('*', function (req, res) {
	  res.status(404).send("404 page not found");
	});

	app.listen(3000, function () {
	  console.log('Penni is listening on port 3000');
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	var _http = __webpack_require__(4);

	var _http2 = _interopRequireDefault(_http);

	var _Message = __webpack_require__(8);

	var _Message2 = _interopRequireDefault(_Message);

	var _Loading = __webpack_require__(10);

	var _Loading2 = _interopRequireDefault(_Loading);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var App = function (_React$Component) {
	  _inherits(App, _React$Component);

	  function App() {
	    _classCallCheck(this, App);

	    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this));

	    _this.state = {
	      dialogueEntries: [],
	      loading: false
	    };
	    _this.sendMessage = _this.sendMessage.bind(_this);
	    return _this;
	  }

	  _createClass(App, [{
	    key: 'sendMessage',
	    value: function sendMessage(e) {
	      var _this2 = this;

	      e.preventDefault();
	      var message = e.target.message.value;
	      if (!message) {
	        return;
	      }
	      this.setState({
	        dialogueEntries: this.state.dialogueEntries.concat([_react2.default.createElement(_Message2.default, {
	          text: message,
	          key: this.state.dialogueEntries.length
	        })]),
	        loading: true
	      });
	      _http2.default.get({
	        host: "localhost",
	        port: 3000,
	        path: "/message?message=" + message + "&_id=" + this.props._id
	      }, function (res) {
	        var replies = '';
	        res.on('data', function (chunk) {
	          replies += chunk;
	        });

	        res.on('end', function () {
	          replies = replies.split('SPLITPOINT');
	          console.log(replies);
	          replies = replies.map(function (reply, index) {
	            return _react2.default.createElement(_Message2.default, {
	              text: reply,
	              key: index + _this2.state.dialogueEntries.length
	            });
	          });
	          console.log(replies);
	          _this2.setState({
	            dialogueEntries: _this2.state.dialogueEntries.concat(replies),
	            loading: false
	          });
	        });
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          'form',
	          { onSubmit: this.sendMessage },
	          _react2.default.createElement('input', { type: 'text', name: 'message' })
	        ),
	        this.state.dialogueEntries,
	        this.state.loading ? _react2.default.createElement(_Loading2.default, null) : null
	      );
	    }
	  }]);

	  return App;
	}(_react2.default.Component);

	exports.default = App;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("react");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("http");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("react-dom/server");

/***/ },
/* 6 */,
/* 7 */
/***/ function(module, exports) {

	'use strict';

	var config = {
	  login: {
	    username: 'c01a5691-dbb6-42bc-92e5-69a14fc04854',
	    password: 'F3u7BQNQMOU7',
	    version_date: '2016-09-20' },
	  workspace_id: '0ad29cc1-a640-46da-9807-2d9afd25e1e6'
	};

	module.exports = config;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Message = function (_React$Component) {
	  _inherits(Message, _React$Component);

	  function Message() {
	    _classCallCheck(this, Message);

	    return _possibleConstructorReturn(this, (Message.__proto__ || Object.getPrototypeOf(Message)).apply(this, arguments));
	  }

	  _createClass(Message, [{
	    key: "render",
	    value: function render() {
	      return _react2.default.createElement(
	        "div",
	        { style: { background: "red" } },
	        this.props.text
	      );
	    }
	  }]);

	  return Message;
	}(_react2.default.Component);

	exports.default = Message;

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("watson-developer-cloud/conversation/v1");

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Loading = function (_React$Component) {
	  _inherits(Loading, _React$Component);

	  function Loading() {
	    _classCallCheck(this, Loading);

	    return _possibleConstructorReturn(this, (Loading.__proto__ || Object.getPrototypeOf(Loading)).apply(this, arguments));
	  }

	  _createClass(Loading, [{
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'div',
	        null,
	        'Loading...'
	      );
	    }
	  }]);

	  return Loading;
	}(_react2.default.Component);

	exports.default = Loading;

/***/ }
/******/ ]);