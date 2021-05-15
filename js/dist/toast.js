/*!
  * Bootstrap toast.js v5.0.111 (https://getbootstrap.com/)
  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('./dom/data.js'), require('./dom/event-handler.js'), require('./dom/manipulator.js'), require('./base-component.js')) :
  typeof define === 'function' && define.amd ? define(['./dom/data', './dom/event-handler', './dom/manipulator', './base-component'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Toast = factory(global.Data, global.EventHandler, global.Manipulator, global.Base));
}(this, (function (Data, EventHandler, Manipulator, BaseComponent) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var Data__default = /*#__PURE__*/_interopDefaultLegacy(Data);
  var EventHandler__default = /*#__PURE__*/_interopDefaultLegacy(EventHandler);
  var Manipulator__default = /*#__PURE__*/_interopDefaultLegacy(Manipulator);
  var BaseComponent__default = /*#__PURE__*/_interopDefaultLegacy(BaseComponent);

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;

    _setPrototypeOf(subClass, superClass);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  var toType = function toType(obj) {
    if (obj === null || obj === undefined) {
      return "" + obj;
    }

    return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
  };

  var isElement = function isElement(obj) {
    if (!obj || typeof obj !== 'object') {
      return false;
    }

    if (typeof obj.jquery !== 'undefined') {
      obj = obj[0];
    }

    return typeof obj.nodeType !== 'undefined';
  };

  var typeCheckConfig = function typeCheckConfig(componentName, config, configTypes) {
    Object.keys(configTypes).forEach(function (property) {
      var expectedTypes = configTypes[property];
      var value = config[property];
      var valueType = value && isElement(value) ? 'element' : toType(value);

      if (!new RegExp(expectedTypes).test(valueType)) {
        throw new TypeError(componentName.toUpperCase() + ": Option \"" + property + "\" provided type \"" + valueType + "\" but expected type \"" + expectedTypes + "\".");
      }
    });
  };

  var reflow = function reflow(element) {
    return element.offsetHeight;
  };

  var getjQuery = function getjQuery() {
    var _window = window,
        jQuery = _window.jQuery;

    if (jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
      return jQuery;
    }

    return null;
  };

  var onDOMContentLoaded = function onDOMContentLoaded(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  };

  var defineJQueryPlugin = function defineJQueryPlugin(plugin) {
    onDOMContentLoaded(function () {
      var $ = getjQuery();
      /* istanbul ignore if */

      if ($) {
        var name = plugin.NAME;
        var JQUERY_NO_CONFLICT = $.fn[name];
        $.fn[name] = plugin.jQueryInterface;
        $.fn[name].Constructor = plugin;

        $.fn[name].noConflict = function () {
          $.fn[name] = JQUERY_NO_CONFLICT;
          return plugin.jQueryInterface;
        };
      }
    });
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'toast';
  var DATA_KEY = 'bs.toast';
  var EVENT_KEY = "." + DATA_KEY;
  var EVENT_CLICK_DISMISS = "click.dismiss" + EVENT_KEY;
  var EVENT_MOUSEOVER = "mouseover" + EVENT_KEY;
  var EVENT_MOUSEOUT = "mouseout" + EVENT_KEY;
  var EVENT_FOCUSIN = "focusin" + EVENT_KEY;
  var EVENT_FOCUSOUT = "focusout" + EVENT_KEY;
  var EVENT_HIDE = "hide" + EVENT_KEY;
  var EVENT_HIDDEN = "hidden" + EVENT_KEY;
  var EVENT_SHOW = "show" + EVENT_KEY;
  var EVENT_SHOWN = "shown" + EVENT_KEY;
  var CLASS_NAME_FADE = 'fade';
  var CLASS_NAME_HIDE = 'hide';
  var CLASS_NAME_SHOW = 'show';
  var CLASS_NAME_SHOWING = 'showing';
  var DefaultType = {
    animation: 'boolean',
    autohide: 'boolean',
    delay: 'number'
  };
  var Default = {
    animation: true,
    autohide: true,
    delay: 5000
  };
  var SELECTOR_DATA_DISMISS = '[data-bs-dismiss="toast"]';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Toast = /*#__PURE__*/function (_BaseComponent) {
    _inheritsLoose(Toast, _BaseComponent);

    function Toast(element, config) {
      var _this;

      _this = _BaseComponent.call(this, element) || this;
      _this._config = _this._getConfig(config);
      _this._timeout = null;
      _this._hasMouseInteraction = false;
      _this._hasKeyboardInteraction = false;

      _this._setListeners();

      return _this;
    } // Getters


    var _proto = Toast.prototype;

    // Public
    _proto.show = function show() {
      var _this2 = this;

      var showEvent = EventHandler__default['default'].trigger(this._element, EVENT_SHOW);

      if (showEvent.defaultPrevented) {
        return;
      }

      this._clearTimeout();

      if (this._config.animation) {
        this._element.classList.add(CLASS_NAME_FADE);
      }

      var complete = function complete() {
        _this2._element.classList.remove(CLASS_NAME_SHOWING);

        _this2._element.classList.add(CLASS_NAME_SHOW);

        EventHandler__default['default'].trigger(_this2._element, EVENT_SHOWN);

        _this2._maybeScheduleHide();
      };

      this._element.classList.remove(CLASS_NAME_HIDE);

      reflow(this._element);

      this._element.classList.add(CLASS_NAME_SHOWING);

      this._queueCallback(complete, this._element, this._config.animation);
    };

    _proto.hide = function hide() {
      var _this3 = this;

      if (!this._element.classList.contains(CLASS_NAME_SHOW)) {
        return;
      }

      var hideEvent = EventHandler__default['default'].trigger(this._element, EVENT_HIDE);

      if (hideEvent.defaultPrevented) {
        return;
      }

      var complete = function complete() {
        _this3._element.classList.add(CLASS_NAME_HIDE);

        EventHandler__default['default'].trigger(_this3._element, EVENT_HIDDEN);
      };

      this._element.classList.remove(CLASS_NAME_SHOW);

      this._queueCallback(complete, this._element, this._config.animation);
    };

    _proto.dispose = function dispose() {
      this._clearTimeout();

      if (this._element.classList.contains(CLASS_NAME_SHOW)) {
        this._element.classList.remove(CLASS_NAME_SHOW);
      }

      _BaseComponent.prototype.dispose.call(this);
    } // Private
    ;

    _proto._getConfig = function _getConfig(config) {
      config = _extends({}, Default, Manipulator__default['default'].getDataAttributes(this._element), typeof config === 'object' && config ? config : {});
      typeCheckConfig(NAME, config, this.constructor.DefaultType);
      return config;
    };

    _proto._maybeScheduleHide = function _maybeScheduleHide() {
      var _this4 = this;

      if (!this._config.autohide) {
        return;
      }

      if (this._hasMouseInteraction || this._hasKeyboardInteraction) {
        return;
      }

      this._timeout = setTimeout(function () {
        _this4.hide();
      }, this._config.delay);
    };

    _proto._onInteraction = function _onInteraction(event, isInteracting) {
      switch (event.type) {
        case 'mouseover':
        case 'mouseout':
          this._hasMouseInteraction = isInteracting;
          break;

        case 'focusin':
        case 'focusout':
          this._hasKeyboardInteraction = isInteracting;
          break;
      }

      if (isInteracting) {
        this._clearTimeout();

        return;
      }

      var nextElement = event.relatedTarget;

      if (this._element === nextElement || this._element.contains(nextElement)) {
        return;
      }

      this._maybeScheduleHide();
    };

    _proto._setListeners = function _setListeners() {
      var _this5 = this;

      EventHandler__default['default'].on(this._element, EVENT_CLICK_DISMISS, SELECTOR_DATA_DISMISS, function () {
        return _this5.hide();
      });
      EventHandler__default['default'].on(this._element, EVENT_MOUSEOVER, function (event) {
        return _this5._onInteraction(event, true);
      });
      EventHandler__default['default'].on(this._element, EVENT_MOUSEOUT, function (event) {
        return _this5._onInteraction(event, false);
      });
      EventHandler__default['default'].on(this._element, EVENT_FOCUSIN, function (event) {
        return _this5._onInteraction(event, true);
      });
      EventHandler__default['default'].on(this._element, EVENT_FOCUSOUT, function (event) {
        return _this5._onInteraction(event, false);
      });
    };

    _proto._clearTimeout = function _clearTimeout() {
      clearTimeout(this._timeout);
      this._timeout = null;
    } // Static
    ;

    Toast.jQueryInterface = function jQueryInterface(config) {
      return this.each(function () {
        var data = Data__default['default'].get(this, DATA_KEY);

        var _config = typeof config === 'object' && config;

        if (!data) {
          data = new Toast(this, _config);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config](this);
        }
      });
    };

    _createClass(Toast, null, [{
      key: "DefaultType",
      get: function get() {
        return DefaultType;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default;
      }
    }, {
      key: "NAME",
      get: function get() {
        return NAME;
      }
    }]);

    return Toast;
  }(BaseComponent__default['default']);
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Toast to jQuery only if jQuery is present
   */


  defineJQueryPlugin(Toast);

  return Toast;

})));
//# sourceMappingURL=toast.js.map
