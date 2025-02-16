/* NightVisionCharts v0.4.1 | License: MIT
 © 2022 ChartMaster. All rights reserved */
(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.NightVision = {}));
})(this, function(exports2) {
  "use strict";var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

  function _mergeNamespaces(n, m) {
    for (var i = 0; i < m.length; i++) {
      const e = m[i];
      if (typeof e !== "string" && !Array.isArray(e)) {
        for (const k in e) {
          if (k !== "default" && !(k in n)) {
            const d = Object.getOwnPropertyDescriptor(e, k);
            if (d) {
              Object.defineProperty(n, k, d.get ? d : {
                enumerable: true,
                get: () => e[k]
              });
            }
          }
        }
      }
    }
    return Object.freeze(Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }));
  }
  function noop() {
  }
  const identity = (x) => x;
  function run(fn) {
    return fn();
  }
  function blank_object() {
    return /* @__PURE__ */ Object.create(null);
  }
  function run_all(fns) {
    fns.forEach(run);
  }
  function is_function(thing) {
    return typeof thing === "function";
  }
  function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || a && typeof a === "object" || typeof a === "function";
  }
  function is_empty(obj) {
    return Object.keys(obj).length === 0;
  }
  const is_client = typeof window !== "undefined";
  let now = is_client ? () => window.performance.now() : () => Date.now();
  let raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;
  const tasks = /* @__PURE__ */ new Set();
  function run_tasks(now2) {
    tasks.forEach((task) => {
      if (!task.c(now2)) {
        tasks.delete(task);
        task.f();
      }
    });
    if (tasks.size !== 0)
      raf(run_tasks);
  }
  function loop$1(callback) {
    let task;
    if (tasks.size === 0)
      raf(run_tasks);
    return {
      promise: new Promise((fulfill) => {
        tasks.add(task = { c: callback, f: fulfill });
      }),
      abort() {
        tasks.delete(task);
      }
    };
  }
  function append(target, node) {
    target.appendChild(node);
  }
  function append_styles(target, style_sheet_id, styles) {
    const append_styles_to = get_root_for_style(target);
    if (!append_styles_to.getElementById(style_sheet_id)) {
      const style = element("style");
      style.id = style_sheet_id;
      style.textContent = styles;
      append_stylesheet(append_styles_to, style);
    }
  }
  function get_root_for_style(node) {
    if (!node)
      return document;
    const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
    if (root && /** @type {ShadowRoot} */
    root.host) {
      return (
        /** @type {ShadowRoot} */
        root
      );
    }
    return node.ownerDocument;
  }
  function append_empty_stylesheet(node) {
    const style_element = element("style");
    style_element.textContent = "/* empty */";
    append_stylesheet(get_root_for_style(node), style_element);
    return style_element.sheet;
  }
  function append_stylesheet(node, style) {
    append(
      /** @type {Document} */
      node.head || node,
      style
    );
    return style.sheet;
  }
  function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
  }
  function detach(node) {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }
  function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
      if (iterations[i])
        iterations[i].d(detaching);
    }
  }
  function element(name) {
    return document.createElement(name);
  }
  function svg_element(name) {
    return document.createElementNS("http://www.w3.org/2000/svg", name);
  }
  function text(data) {
    return document.createTextNode(data);
  }
  function space() {
    return text(" ");
  }
  function empty() {
    return text("");
  }
  function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
  }
  function stop_propagation(fn) {
    return function(event) {
      event.stopPropagation();
      return fn.call(this, event);
    };
  }
  function attr(node, attribute, value) {
    if (value == null)
      node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
      node.setAttribute(attribute, value);
  }
  function children(element2) {
    return Array.from(element2.childNodes);
  }
  function set_data(text2, data) {
    data = "" + data;
    if (text2.data === data)
      return;
    text2.data = /** @type {string} */
    data;
  }
  function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
    return new CustomEvent(type, { detail, bubbles, cancelable });
  }
  class HtmlTag {
    constructor(is_svg = false) {
      /**
       * @private
       * @default false
       */
      __publicField(this, "is_svg", false);
      /** parent for creating node */
      __publicField(this, "e");
      /** html tag nodes */
      __publicField(this, "n");
      /** target */
      __publicField(this, "t");
      /** anchor */
      __publicField(this, "a");
      this.is_svg = is_svg;
      this.e = this.n = null;
    }
    /**
     * @param {string} html
     * @returns {void}
     */
    c(html) {
      this.h(html);
    }
    /**
     * @param {string} html
     * @param {HTMLElement | SVGElement} target
     * @param {HTMLElement | SVGElement} anchor
     * @returns {void}
     */
    m(html, target, anchor = null) {
      if (!this.e) {
        if (this.is_svg)
          this.e = svg_element(
            /** @type {keyof SVGElementTagNameMap} */
            target.nodeName
          );
        else
          this.e = element(
            /** @type {keyof HTMLElementTagNameMap} */
            target.nodeType === 11 ? "TEMPLATE" : target.nodeName
          );
        this.t = target.tagName !== "TEMPLATE" ? target : (
          /** @type {HTMLTemplateElement} */
          target.content
        );
        this.c(html);
      }
      this.i(anchor);
    }
    /**
     * @param {string} html
     * @returns {void}
     */
    h(html) {
      this.e.innerHTML = html;
      this.n = Array.from(
        this.e.nodeName === "TEMPLATE" ? this.e.content.childNodes : this.e.childNodes
      );
    }
    /**
     * @returns {void} */
    i(anchor) {
      for (let i = 0; i < this.n.length; i += 1) {
        insert(this.t, this.n[i], anchor);
      }
    }
    /**
     * @param {string} html
     * @returns {void}
     */
    p(html) {
      this.d();
      this.h(html);
      this.i(this.a);
    }
    /**
     * @returns {void} */
    d() {
      this.n.forEach(detach);
    }
  }
  const managed_styles = /* @__PURE__ */ new Map();
  let active = 0;
  function hash(str) {
    let hash2 = 5381;
    let i = str.length;
    while (i--)
      hash2 = (hash2 << 5) - hash2 ^ str.charCodeAt(i);
    return hash2 >>> 0;
  }
  function create_style_information(doc, node) {
    const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
    managed_styles.set(doc, info);
    return info;
  }
  function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
    const step = 16.666 / duration;
    let keyframes = "{\n";
    for (let p = 0; p <= 1; p += step) {
      const t = a + (b - a) * ease(p);
      keyframes += p * 100 + `%{${fn(t, 1 - t)}}
`;
    }
    const rule = keyframes + `100% {${fn(b, 1 - b)}}
}`;
    const name = `__svelte_${hash(rule)}_${uid}`;
    const doc = get_root_for_style(node);
    const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
    if (!rules[name]) {
      rules[name] = true;
      stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
    }
    const animation = node.style.animation || "";
    node.style.animation = `${animation ? `${animation}, ` : ""}${name} ${duration}ms linear ${delay}ms 1 both`;
    active += 1;
    return name;
  }
  function delete_rule(node, name) {
    const previous = (node.style.animation || "").split(", ");
    const next = previous.filter(
      name ? (anim) => anim.indexOf(name) < 0 : (anim) => anim.indexOf("__svelte") === -1
      // remove all Svelte animations
    );
    const deleted = previous.length - next.length;
    if (deleted) {
      node.style.animation = next.join(", ");
      active -= deleted;
      if (!active)
        clear_rules();
    }
  }
  function clear_rules() {
    raf(() => {
      if (active)
        return;
      managed_styles.forEach((info) => {
        const { ownerNode } = info.stylesheet;
        if (ownerNode)
          detach(ownerNode);
      });
      managed_styles.clear();
    });
  }
  let current_component;
  function set_current_component(component) {
    current_component = component;
  }
  function get_current_component() {
    if (!current_component)
      throw new Error("Function called outside component initialization");
    return current_component;
  }
  function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
  }
  function onDestroy(fn) {
    get_current_component().$$.on_destroy.push(fn);
  }
  const dirty_components = [];
  const binding_callbacks = [];
  let render_callbacks = [];
  const flush_callbacks = [];
  const resolved_promise = /* @__PURE__ */ Promise.resolve();
  let update_scheduled = false;
  function schedule_update() {
    if (!update_scheduled) {
      update_scheduled = true;
      resolved_promise.then(flush);
    }
  }
  function add_render_callback(fn) {
    render_callbacks.push(fn);
  }
  const seen_callbacks = /* @__PURE__ */ new Set();
  let flushidx = 0;
  function flush() {
    if (flushidx !== 0) {
      return;
    }
    const saved_component = current_component;
    do {
      try {
        while (flushidx < dirty_components.length) {
          const component = dirty_components[flushidx];
          flushidx++;
          set_current_component(component);
          update(component.$$);
        }
      } catch (e) {
        dirty_components.length = 0;
        flushidx = 0;
        throw e;
      }
      set_current_component(null);
      dirty_components.length = 0;
      flushidx = 0;
      while (binding_callbacks.length)
        binding_callbacks.pop()();
      for (let i = 0; i < render_callbacks.length; i += 1) {
        const callback = render_callbacks[i];
        if (!seen_callbacks.has(callback)) {
          seen_callbacks.add(callback);
          callback();
        }
      }
      render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
      flush_callbacks.pop()();
    }
    update_scheduled = false;
    seen_callbacks.clear();
    set_current_component(saved_component);
  }
  function update($$) {
    if ($$.fragment !== null) {
      $$.update();
      run_all($$.before_update);
      const dirty = $$.dirty;
      $$.dirty = [-1];
      $$.fragment && $$.fragment.p($$.ctx, dirty);
      $$.after_update.forEach(add_render_callback);
    }
  }
  function flush_render_callbacks(fns) {
    const filtered = [];
    const targets = [];
    render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
    targets.forEach((c) => c());
    render_callbacks = filtered;
  }
  let promise;
  function wait() {
    if (!promise) {
      promise = Promise.resolve();
      promise.then(() => {
        promise = null;
      });
    }
    return promise;
  }
  function dispatch(node, direction, kind) {
    node.dispatchEvent(custom_event(`${direction ? "intro" : "outro"}${kind}`));
  }
  const outroing = /* @__PURE__ */ new Set();
  let outros;
  function group_outros() {
    outros = {
      r: 0,
      c: [],
      p: outros
      // parent group
    };
  }
  function check_outros() {
    if (!outros.r) {
      run_all(outros.c);
    }
    outros = outros.p;
  }
  function transition_in(block, local) {
    if (block && block.i) {
      outroing.delete(block);
      block.i(local);
    }
  }
  function transition_out(block, local, detach2, callback) {
    if (block && block.o) {
      if (outroing.has(block))
        return;
      outroing.add(block);
      outros.c.push(() => {
        outroing.delete(block);
        if (callback) {
          if (detach2)
            block.d(1);
          callback();
        }
      });
      block.o(local);
    } else if (callback) {
      callback();
    }
  }
  const null_transition = { duration: 0 };
  function create_bidirectional_transition(node, fn, params, intro) {
    const options = { direction: "both" };
    let config = fn(node, params, options);
    let t = intro ? 0 : 1;
    let running_program = null;
    let pending_program = null;
    let animation_name = null;
    let original_inert_value;
    function clear_animation() {
      if (animation_name)
        delete_rule(node, animation_name);
    }
    function init2(program, duration) {
      const d = (
        /** @type {Program['d']} */
        program.b - t
      );
      duration *= Math.abs(d);
      return {
        a: t,
        b: program.b,
        d,
        duration,
        start: program.start,
        end: program.start + duration,
        group: program.group
      };
    }
    function go(b) {
      const {
        delay = 0,
        duration = 300,
        easing = identity,
        tick = noop,
        css
      } = config || null_transition;
      const program = {
        start: now() + delay,
        b
      };
      if (!b) {
        program.group = outros;
        outros.r += 1;
      }
      if ("inert" in node) {
        if (b) {
          if (original_inert_value !== void 0) {
            node.inert = original_inert_value;
          }
        } else {
          original_inert_value = /** @type {HTMLElement} */
          node.inert;
          node.inert = true;
        }
      }
      if (running_program || pending_program) {
        pending_program = program;
      } else {
        if (css) {
          clear_animation();
          animation_name = create_rule(node, t, b, duration, delay, easing, css);
        }
        if (b)
          tick(0, 1);
        running_program = init2(program, duration);
        add_render_callback(() => dispatch(node, b, "start"));
        loop$1((now2) => {
          if (pending_program && now2 > pending_program.start) {
            running_program = init2(pending_program, duration);
            pending_program = null;
            dispatch(node, running_program.b, "start");
            if (css) {
              clear_animation();
              animation_name = create_rule(
                node,
                t,
                running_program.b,
                running_program.duration,
                0,
                easing,
                config.css
              );
            }
          }
          if (running_program) {
            if (now2 >= running_program.end) {
              tick(t = running_program.b, 1 - t);
              dispatch(node, running_program.b, "end");
              if (!pending_program) {
                if (running_program.b) {
                  clear_animation();
                } else {
                  if (!--running_program.group.r)
                    run_all(running_program.group.c);
                }
              }
              running_program = null;
            } else if (now2 >= running_program.start) {
              const p = now2 - running_program.start;
              t = running_program.a + running_program.d * easing(p / running_program.duration);
              tick(t, 1 - t);
            }
          }
          return !!(running_program || pending_program);
        });
      }
    }
    return {
      run(b) {
        if (is_function(config)) {
          wait().then(() => {
            const opts = { direction: b ? "in" : "out" };
            config = config(opts);
            go(b);
          });
        } else {
          go(b);
        }
      },
      end() {
        clear_animation();
        running_program = pending_program = null;
      }
    };
  }
  function ensure_array_like(array_like_or_iterator) {
    return (array_like_or_iterator == null ? void 0 : array_like_or_iterator.length) !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
  }
  function create_component(block) {
    block && block.c();
  }
  function mount_component(component, target, anchor) {
    const { fragment, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    add_render_callback(() => {
      const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
      if (component.$$.on_destroy) {
        component.$$.on_destroy.push(...new_on_destroy);
      } else {
        run_all(new_on_destroy);
      }
      component.$$.on_mount = [];
    });
    after_update.forEach(add_render_callback);
  }
  function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
      flush_render_callbacks($$.after_update);
      run_all($$.on_destroy);
      $$.fragment && $$.fragment.d(detaching);
      $$.on_destroy = $$.fragment = null;
      $$.ctx = [];
    }
  }
  function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
      dirty_components.push(component);
      schedule_update();
      component.$$.dirty.fill(0);
    }
    component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
  }
  function init(component, options, instance2, create_fragment2, not_equal, props, append_styles2 = null, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
      fragment: null,
      ctx: [],
      // state
      props,
      update: noop,
      not_equal,
      bound: blank_object(),
      // lifecycle
      on_mount: [],
      on_destroy: [],
      on_disconnect: [],
      before_update: [],
      after_update: [],
      context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
      // everything else
      callbacks: blank_object(),
      dirty,
      skip_bound: false,
      root: options.target || parent_component.$$.root
    };
    append_styles2 && append_styles2($$.root);
    let ready = false;
    $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
      const value = rest.length ? rest[0] : ret;
      if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
        if (!$$.skip_bound && $$.bound[i])
          $$.bound[i](value);
        if (ready)
          make_dirty(component, i);
      }
      return ret;
    }) : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
    if (options.target) {
      if (options.hydrate) {
        const nodes = children(options.target);
        $$.fragment && $$.fragment.l(nodes);
        nodes.forEach(detach);
      } else {
        $$.fragment && $$.fragment.c();
      }
      if (options.intro)
        transition_in(component.$$.fragment);
      mount_component(component, options.target, options.anchor);
      flush();
    }
    set_current_component(parent_component);
  }
  class SvelteComponent {
    constructor() {
      /**
       * ### PRIVATE API
       *
       * Do not use, may change at any time
       *
       * @type {any}
       */
      __publicField(this, "$$");
      /**
       * ### PRIVATE API
       *
       * Do not use, may change at any time
       *
       * @type {any}
       */
      __publicField(this, "$$set");
    }
    /** @returns {void} */
    $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop;
    }
    /**
     * @template {Extract<keyof Events, string>} K
     * @param {K} type
     * @param {((e: Events[K]) => void) | null | undefined} callback
     * @returns {() => void}
     */
    $on(type, callback) {
      if (!is_function(callback)) {
        return noop;
      }
      const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return () => {
        const index = callbacks.indexOf(callback);
        if (index !== -1)
          callbacks.splice(index, 1);
      };
    }
    /**
     * @param {Partial<Props>} props
     * @returns {void}
     */
    $set(props) {
      if (this.$$set && !is_empty(props)) {
        this.$$.skip_bound = true;
        this.$$set(props);
        this.$$.skip_bound = false;
      }
    }
  }
  const PUBLIC_VERSION = "4";
  if (typeof window !== "undefined")
    (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(PUBLIC_VERSION);
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var util$1 = {};
  function isArrayLike(o) {
    if (o && // o is not null, undefined, etc.
    typeof o === "object" && // o is an object
    isFinite(o.length) && // o.length is a finite number
    o.length >= 0 && // o.length is non-negative
    o.length === Math.floor(o.length) && // o.length is an integer
    o.length < 4294967296)
      return true;
    else
      return false;
  }
  function isSortable(o) {
    if (o && // o is not null, undefined, etc.
    typeof o === "object" && // o is an object
    typeof o.sort === "function")
      return true;
    else
      return false;
  }
  util$1.isSortableArrayLike = function(o) {
    return isArrayLike(o) && isSortable(o);
  };
  var compare = {
    /**
     * Compare two numbers.
     *
     * @param {Number} a
     * @param {Number} b
     * @returns {Number} 1 if a > b, 0 if a = b, -1 if a < b
     */
    numcmp: function(a, b) {
      return a - b;
    },
    /**
     * Compare two strings.
     *
     * @param {Number|String} a
     * @param {Number|String} b
     * @returns {Number} 1 if a > b, 0 if a = b, -1 if a < b
     */
    strcmp: function(a, b) {
      return a < b ? -1 : a > b ? 1 : 0;
    }
  };
  var binary = {};
  function loop(data, min, max, index, valpos) {
    var curr = max + min >>> 1;
    var diff = this.compare(data[curr][this.index], index);
    if (!diff) {
      return valpos[index] = {
        "found": true,
        "index": curr,
        "prev": null,
        "next": null
      };
    }
    if (min >= max) {
      return valpos[index] = {
        "found": false,
        "index": null,
        "prev": diff < 0 ? max : max - 1,
        "next": diff < 0 ? max + 1 : max
      };
    }
    if (diff > 0)
      return loop.call(this, data, min, curr - 1, index, valpos);
    else
      return loop.call(this, data, curr + 1, max, index, valpos);
  }
  function search(index) {
    var data = this.data;
    return loop.call(this, data, 0, data.length - 1, index, this.valpos);
  }
  binary.search = search;
  var util = util$1, cmp = compare, bin = binary;
  var lib = IndexedArray;
  function IndexedArray(data, index) {
    if (!util.isSortableArrayLike(data))
      throw new Error("Invalid data");
    if (!index || data.length > 0 && !(index in data[0]))
      throw new Error("Invalid index");
    this.data = data;
    this.index = index;
    this.setBoundaries();
    this.compare = typeof this.minv === "number" ? cmp.numcmp : cmp.strcmp;
    this.search = bin.search;
    this.valpos = {};
    this.cursor = null;
    this.nextlow = null;
    this.nexthigh = null;
  }
  IndexedArray.prototype.setCompare = function(fn) {
    if (typeof fn !== "function")
      throw new Error("Invalid argument");
    this.compare = fn;
    return this;
  };
  IndexedArray.prototype.setSearch = function(fn) {
    if (typeof fn !== "function")
      throw new Error("Invalid argument");
    this.search = fn;
    return this;
  };
  IndexedArray.prototype.sort = function() {
    var self2 = this, index = this.index;
    this.data.sort(function(a, b) {
      return self2.compare(a[index], b[index]);
    });
    this.setBoundaries();
    return this;
  };
  IndexedArray.prototype.setBoundaries = function() {
    var data = this.data, index = this.index;
    this.minv = data.length && data[0][index];
    this.maxv = data.length && data[data.length - 1][index];
    return this;
  };
  IndexedArray.prototype.fetch = function(value) {
    if (this.data.length === 0) {
      this.cursor = null;
      this.nextlow = null;
      this.nexthigh = null;
      return this;
    }
    if (this.compare(value, this.minv) === -1) {
      this.cursor = null;
      this.nextlow = null;
      this.nexthigh = 0;
      return this;
    }
    if (this.compare(value, this.maxv) === 1) {
      this.cursor = null;
      this.nextlow = this.data.length - 1;
      this.nexthigh = null;
      return this;
    }
    var valpos = this.valpos, pos = valpos[value];
    if (pos) {
      if (pos.found) {
        this.cursor = pos.index;
        this.nextlow = null;
        this.nexthigh = null;
      } else {
        this.cursor = null;
        this.nextlow = pos.prev;
        this.nexthigh = pos.next;
      }
      return this;
    }
    var result = this.search.call(this, value);
    this.cursor = result.index;
    this.nextlow = result.prev;
    this.nexthigh = result.next;
    return this;
  };
  IndexedArray.prototype.get = function(value) {
    if (value)
      this.fetch(value);
    var pos = this.cursor;
    return pos !== null ? this.data[pos] : null;
  };
  IndexedArray.prototype.getRange = function(begin, end) {
    if (this.compare(begin, end) === 1) {
      return [];
    }
    this.fetch(begin);
    var start = this.cursor || this.nexthigh;
    this.fetch(end);
    var finish = this.cursor || this.nextlow;
    if (start === null || finish === null) {
      return [];
    }
    return this.data.slice(start, finish + 1);
  };
  const IndexedArray$1 = /* @__PURE__ */ getDefaultExportFromCjs(lib);
  const SECOND = 1e3;
  const MINUTE$1 = SECOND * 60;
  const MINUTE3 = MINUTE$1 * 3;
  const MINUTE5 = MINUTE$1 * 5;
  const MINUTE15$1 = MINUTE$1 * 15;
  const MINUTE30 = MINUTE$1 * 30;
  const HOUR$2 = MINUTE$1 * 60;
  const HOUR4 = HOUR$2 * 4;
  const HOUR12 = HOUR$2 * 12;
  const DAY$2 = HOUR$2 * 24;
  const WEEK$2 = DAY$2 * 7;
  const MONTH$2 = WEEK$2 * 4;
  const YEAR$2 = DAY$2 * 365;
  const MONTHMAP$1 = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  const TIMESCALES$1 = [
    YEAR$2 * 10,
    YEAR$2 * 5,
    YEAR$2 * 3,
    YEAR$2 * 2,
    YEAR$2,
    MONTH$2 * 6,
    MONTH$2 * 4,
    MONTH$2 * 3,
    MONTH$2 * 2,
    MONTH$2,
    DAY$2 * 15,
    DAY$2 * 10,
    DAY$2 * 7,
    DAY$2 * 5,
    DAY$2 * 3,
    DAY$2 * 2,
    DAY$2,
    HOUR$2 * 12,
    HOUR$2 * 6,
    HOUR$2 * 3,
    HOUR$2 * 1.5,
    HOUR$2,
    MINUTE30,
    MINUTE15$1,
    MINUTE$1 * 10,
    MINUTE5,
    MINUTE$1 * 2,
    MINUTE$1
  ];
  const $SCALES$2 = [0.05, 0.1, 0.2, 0.25, 0.5, 0.8, 1, 2, 5];
  const COLORS = {
    back: "#14151c",
    // Background color
    grid: "#252732",
    // Grid color
    text: "#adadad",
    // Regular text color
    textHL: "#dedddd",
    // Highlighted text color
    textLG: "#c4c4c4",
    // Legend text color
    llValue: "#818989",
    // Legend value color
    llBack: "#14151c77",
    // Legend bar background
    llSelect: "#2d7b2f",
    // Legend select border
    scale: "#606060",
    // Scale edge color
    cross: "#8091a0",
    // Crosshair color
    candleUp: "#41a376",
    // "Green" candle color
    candleDw: "#de4646",
    // "Red" candle color
    wickUp: "#23a77688",
    // "Green" wick color
    wickDw: "#e5415088",
    // "Red" wick color
    volUp: "#41a37682",
    // "Green" volume color
    volDw: "#de464682",
    // "Red" volume color
    panel: "#2a2f38",
    // Scale panel color
    tbBack: void 0,
    // Toolbar background
    tbBorder: "#8282827d"
    // Toolbar border color
  };
  const ChartConfig = {
    SBMIN: 60,
    // Minimal sidebar, px
    SBMAX: Infinity,
    // Max sidebar, px
    TOOLBAR: 57,
    // Toolbar width, px
    TB_ICON: 25,
    // Toolbar icon size, px
    TB_ITEM_M: 6,
    // Toolbar item margin, px
    TB_ICON_BRI: 1,
    // Toolbar icon brightness
    TB_ICON_HOLD: 420,
    // Wait to expand, ms
    TB_BORDER: 1,
    // Toolbar border, px
    TB_B_STYLE: "dotted",
    // Toolbar border style
    TOOL_COLL: 7,
    // Tool collision threshold
    PIN_RADIUS: 5.5,
    // Tool pin radius
    EXPAND: 0.15,
    // Expand y-range, %/100 of range
    CANDLEW: 0.7,
    // Candle width, %/100 of step
    GRIDX: 100,
    // Grid x-step target, px
    GRIDY: 47,
    // Grid y-step target, px
    BOTBAR: 28,
    // Bottom bar height, px
    PANHEIGHT: 22,
    // Scale panel height, px
    DEFAULT_LEN: 50,
    // Starting range, candles
    MINIMUM_LEN: 5,
    // Minimal starting range, candles
    MIN_ZOOM: 5,
    // Minimal zoom, candles
    MAX_ZOOM: 5e3,
    // Maximal zoom, candles,
    VOLSCALE: 0.15,
    // Volume bars height, %/100 of layout.height
    UX_OPACITY: 0.9,
    // Ux background opacity
    ZOOM_MODE: "tv",
    // Zoom mode, 'tv' or 'tl'
    L_BTN_SIZE: 21,
    // Legend Button size, px
    L_BTN_MARGIN: "-6px 0 -6px 0",
    // css margin
    SCROLL_WHEEL: "prevent",
    // Scroll wheel morde, 'prevent', 'pass', 'click',
    QUANTIZE_AFTER: 0,
    // Quantize cursor after, ms
    AUTO_PRE_SAMPLE: 10,
    // Sample size for auto-precision
    CANDLE_TIME: true
    // Show remaining candle time 
  };
  ChartConfig.FONT = `11px -apple-system,BlinkMacSystemFont,
    Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,
    Fira Sans,Droid Sans,Helvetica Neue,
    sans-serif`;
  const IB_TF_WARN = "When using IB mode you should specify timeframe ('tf' filed in 'chart' object),otherwise you can get an unexpected behaviour";
  const MAP_UNIT = {
    "1s": SECOND,
    "5s": SECOND * 5,
    "10s": SECOND * 10,
    "20s": SECOND * 20,
    "30s": SECOND * 30,
    "1m": MINUTE$1,
    "3m": MINUTE3,
    "5m": MINUTE5,
    "15m": MINUTE15$1,
    "30m": MINUTE30,
    "1H": HOUR$2,
    "2H": HOUR$2 * 2,
    "3H": HOUR$2 * 3,
    "4H": HOUR4,
    "12H": HOUR12,
    "1D": DAY$2,
    "1W": WEEK$2,
    "1M": MONTH$2,
    "1Y": YEAR$2,
    // Lower case variants
    "1h": HOUR$2,
    "2h": HOUR$2 * 2,
    "3h": HOUR$2 * 3,
    "4h": HOUR4,
    "12h": HOUR12,
    "1d": DAY$2,
    "1w": WEEK$2,
    "1y": YEAR$2
  };
  const HPX$8 = -0.5;
  const Const = {
    SECOND,
    MINUTE: MINUTE$1,
    MINUTE5,
    MINUTE15: MINUTE15$1,
    MINUTE30,
    HOUR: HOUR$2,
    HOUR4,
    DAY: DAY$2,
    WEEK: WEEK$2,
    MONTH: MONTH$2,
    YEAR: YEAR$2,
    MONTHMAP: MONTHMAP$1,
    TIMESCALES: TIMESCALES$1,
    $SCALES: $SCALES$2,
    ChartConfig,
    MAP_UNIT,
    IB_TF_WARN,
    COLORS,
    HPX: HPX$8
  };
  const Utils = {
    clamp(num, min, max) {
      return num <= min ? min : num >= max ? max : num;
    },
    addZero(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    },
    // Start of the day (zero millisecond)
    dayStart(t) {
      const start = new Date(t);
      return start.setUTCHours(0, 0, 0, 0);
    },
    // Start of the month
    monthStart(t) {
      const date = new Date(t);
      return Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        1
      );
    },
    // Start of the year
    yearStart(t) {
      return Date.UTC(new Date(t).getFullYear());
    },
    getYear(t) {
      if (!t)
        return void 0;
      return new Date(t).getUTCFullYear();
    },
    getMonth(t) {
      if (!t)
        return void 0;
      return new Date(t).getUTCMonth();
    },
    // Nearest in array
    nearestA(x, array) {
      let dist = Infinity;
      let val = null;
      let index = -1;
      for (var i = 0; i < array.length; i++) {
        var xi = array[i];
        if (Math.abs(xi - x) < dist) {
          dist = Math.abs(xi - x);
          val = xi;
          index = i;
        }
      }
      return [index, val];
    },
    // Nearest value by time (in timeseries)
    nearestTs(t, ts) {
      let dist = Infinity;
      let val = null;
      let index = -1;
      for (var i = 0; i < ts.length; i++) {
        var ti = ts[i][0];
        if (Math.abs(ti - t) < dist) {
          dist = Math.abs(ti - t);
          val = ts[i];
          index = i;
        }
      }
      return [index, val];
    },
    // Nearest value by index (in timeseries)
    nearestTsIb(i, ts, offset) {
      const index = Math.floor(i - offset) + 1;
      const val = ts[index] || null;
      return [index, val];
    },
    round(num, decimals = 8) {
      return parseFloat(num.toFixed(decimals));
    },
    // Strip? No, it's ugly floats in js
    strip(number) {
      return parseFloat(
        parseFloat(number).toPrecision(12)
      );
    },
    getDay(t) {
      return t ? new Date(t).getDate() : null;
    },
    // Update array keeping the same reference
    overwrite(arr, new_arr) {
      arr.splice(0, arr.length, ...new_arr);
    },
    // Get full list of overlays on all panes
    allOverlays(panes = []) {
      return panes.map((x) => x.overlays || []).flat();
    },
    // Detects a timeframe of the data
    detectTimeframe(data) {
      const len = Math.min(data.length - 1, 99);
      let min = Infinity;
      data.slice(0, len).forEach((x, i) => {
        const d = data[i + 1][0] - x[0];
        if (d === d && d < min)
          min = d;
      });
      if (min >= Const.MONTH && min <= Const.DAY * 30) {
        return Const.DAY * 31;
      }
      return min;
    },
    // Fast filter. Really fast, like 10X
    fastFilter(arr, t1, t2) {
      if (!arr.length)
        return [arr, void 0];
      try {
        const ia = new IndexedArray$1(arr, "0");
        const res = ia.getRange(t1, t2);
        const i0 = ia.valpos[t1].next;
        return [res, i0];
      } catch (e) {
        return [arr.filter(
          (x) => x[0] >= t1 && x[0] <= t2
        ), 0];
      }
    },
    // Fast filter 2 (returns indices)
    fastFilter2(arr, t1, t2) {
      if (!arr.length)
        return [arr, void 0];
      try {
        const ia = new IndexedArray$1(arr, "0");
        ia.fetch(t1);
        const start = ia.cursor || ia.nexthigh;
        ia.fetch(t2);
        const finish = ia.cursor || ia.nextlow;
        return [start, finish + 1];
      } catch (e) {
        const subset = arr.filter(
          (x) => x[0] >= t1 && x[0] <= t2
        );
        const i1 = arr.indexOf(subset[0]);
        const i2 = arr.indexOf(subset[subset.length - 1]);
        return [i1, i2];
      }
    },
    // Fast filter (index-based)
    fastFilterIB(arr, t1, t2) {
      if (!arr.length)
        return [void 0, void 0];
      let i1 = Math.floor(t1);
      if (i1 < 0)
        i1 = 0;
      const i2 = Math.floor(t2 + 1);
      return [i1, i2];
    },
    // Nearest indexes (left and right)
    fastNearest(arr, t1) {
      const ia = new IndexedArray$1(arr, "0");
      ia.fetch(t1);
      return [ia.nextlow, ia.nexthigh];
    },
    now() {
      return (/* @__PURE__ */ new Date()).getTime();
    },
    pause(delay) {
      return new Promise((rs) => setTimeout(rs, delay));
    },
    // Limit crazy wheel delta values
    smartWheel(delta) {
      const abs = Math.abs(delta);
      if (abs > 500) {
        return (200 + Math.log(abs)) * Math.sign(delta);
      }
      return delta;
    },
    // Parse the original mouse event to find deltaX
    getDeltaX(event) {
      return event.originalEvent.deltaX / 12;
    },
    // Parse the original mouse event to find deltaY
    getDeltaY(event) {
      return event.originalEvent.deltaY / 12;
    },
    // Apply opacity to a hex color
    applyOpacity(c, op) {
      if (c.length === 7) {
        let n = Math.floor(op * 255);
        n = this.clamp(n, 0, 255);
        c += n.toString(16);
      }
      return c;
    },
    // Parse timeframe or return value in ms
    // TODO: add full parser
    // (https://github.com/tvjsx/trading-vue-js/
    // blob/master/src/helpers/script_utils.js#L98)
    parseTf(smth) {
      if (typeof smth === "string") {
        return Const.MAP_UNIT[smth];
      } else {
        return smth;
      }
    },
    // Detect index shift between the main data subset
    // and the overlay's subset (for IB-mode)
    indexShift(sub, data) {
      if (!data.length)
        return 0;
      const first = data[0][0];
      let second;
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] !== first) {
          second = data[i][0];
          break;
        }
      }
      for (var j = 0; j < sub.length; j++) {
        if (sub[j][0] === second) {
          return j - i;
        }
      }
      return 0;
    },
    // Fallback fix for Brave browser
    // https://github.com/brave/brave-browser/issues/1738
    measureText(ctx, text2, nvId) {
      const m = ctx.measureTextOrg(text2);
      if (m.width === 0) {
        const doc = document;
        const id = "nvjs-measure-text";
        let el = doc.getElementById(id);
        if (!el) {
          const base = doc.getElementById(nvId);
          el = doc.createElement("div");
          el.id = id;
          el.style.position = "absolute";
          el.style.top = "-1000px";
          base.appendChild(el);
        }
        if (ctx.font)
          el.style.font = ctx.font;
        el.innerText = text2.replace(/ /g, ".");
        return { width: el.offsetWidth };
      } else {
        return m;
      }
    },
    uuid(temp = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx") {
      return temp.replace(/[xy]/g, (c) => {
        var r = Math.random() * 16 | 0, v = c == "x" ? r : r & 3 | 8;
        return v.toString(16);
      });
    },
    uuid2() {
      return this.uuid("xxxxxxxxxxxx");
    },
    uuid3() {
      return Math.random().toString().slice(2).replace(/^0+/, "");
    },
    // Delayed warning, f = condition lambda fn
    warn(f, text2, delay = 0) {
      setTimeout(() => {
        if (f())
          console.warn(text2);
      }, delay);
    },
    // Checks if script props updated
    // (and not style settings or something else)
    /*isScrPropsUpd(n, prev) {
    	      let p = prev.find(x => x.v.$uuid === n.v.$uuid)
    	      if (!p) return false
    
    	      let props = n.p.settings.$props
    	      if (!props) return false
    
    	      return props.some(x => n.v[x] !== p.v[x])
    	  },*/
    // Checks if it's time to make a script update
    // (based on execInterval in ms)
    delayedExec(v) {
      if (!v.script || !v.script.execInterval)
        return true;
      const t = this.now();
      const dt = v.script.execInterval;
      if (!v.settings.$last_exec || t > v.settings.$last_exec + dt) {
        v.settings.$last_exec = t;
        return true;
      }
      return false;
    },
    // Format names such 'RSI, $length', where
    // length - is one of the settings
    formatName(ov) {
      if (!ov.name)
        return void 0;
      let name = ov.name;
      for (var k in ov.settings || {}) {
        const val = ov.settings[k];
        const reg = new RegExp(`\\$${k}`, "g");
        name = name.replace(reg, val);
      }
      return name;
    },
    // Default cursor mode
    xMode() {
      return this.is_mobile ? "explore" : "default";
    },
    defaultPrevented(event) {
      if (event.original) {
        return event.original.defaultPrevented;
      }
      return event.defaultPrevented;
    },
    // Get a view from the data by the name
    /*view(data, name) {
        if (!data.views) return data
        let v = data.views.find(x => x.name === name)
        if (!v) return data
        return v.data
    },*/
    /*concatArrays(arrays) {
        var acc = []
        for (var a of arrays) {
            acc = acc.concat(a)
        }
        return acc
    },*/
    // Call
    afterAll(object, f, time) {
      clearTimeout(object.__afterAllId__);
      object.__afterAllId__ = setTimeout(() => f(), time);
    },
    // Default auto-precision sampler for a generic
    // timeseries-element: [time, x1, x2, x3, ...]
    defaultPreSampler(el) {
      if (!el)
        return [];
      const out = [];
      for (var i = 1; i < el.length; i++) {
        if (typeof el[i] === "number") {
          out.push(el[i]);
        }
      }
      return out;
    },
    // Get scales by side id (0 - left, 1 - right)
    getScalesBySide(side, layout) {
      if (!layout)
        return [];
      const template = layout.settings.scaleTemplate;
      return template[side].map((id) => layout.scales[id]).filter((x) => x);
    },
    // If scaleTemplate is changed there could be a
    // situation when user forget to reset scaleSideIdxs.
    // Here we attemp to get them in sync
    autoScaleSideId(S, sides, idxs) {
      if (sides[S].length) {
        if (!idxs[S] || !sides[S].includes(idxs[S])) {
          idxs[S] = sides[S][0];
        }
      } else {
        idxs[S] = void 0;
      }
    },
    // Debug function, shows how many times
    // this method is called per second
    callsPerSecond() {
      if (window.__counter__ === void 0) {
        window.__counter__ = 0;
      }
      window.__counter__++;
      if (window.__cpsId__)
        return;
      window.__cpsId__ = setTimeout(() => {
        console.log(window.__counter__, "upd/sec");
        window.__counter__ = 0;
        window.__cpsId__ = null;
      }, 1e3);
    },
    // Calculate an index offset for a timeseries
    // against the main ts. (for indexBased mode)
    findIndexOffset(mainTs, ts) {
      const set1 = {};
      const set2 = {};
      for (let i = 0; i < mainTs.length; i++) {
        set1[mainTs[i][0]] = i;
      }
      for (let i = 0; i < ts.length; i++) {
        set2[ts[i][0]] = i;
      }
      const deltas = [];
      for (const t in set2) {
        if (set1[t] !== void 0) {
          const d = set1[t] - set2[t];
          if (!deltas.length || deltas[0] === d) {
            deltas.unshift(d);
          }
          if (deltas.length === 3) {
            return deltas.pop();
          }
        }
      }
      return 0;
    },
    // Format cash values
    formatCash(n) {
      if (n == void 0)
        return "x";
      if (typeof n !== "number")
        return n;
      if (n < 1e3)
        return n.toFixed(0);
      if (n >= 1e3 && n < 1e6)
        return +(n / 1e3).toFixed(2) + "K";
      if (n >= 1e6 && n < 1e9)
        return +(n / 1e6).toFixed(2) + "M";
      if (n >= 1e9 && n < 1e12)
        return +(n / 1e9).toFixed(2) + "B";
      if (n >= 1e12)
        return +(n / 1e12).toFixed(2) + "T";
    },
    // Time range of a data subset (from i0 to iN-1)
    realTimeRange(data) {
      if (!data.length)
        return 0;
      return data[data.length - 1][0] - data[0][0];
    },
    // Get sizes left and right parts of a number
    // (11.22 -> ['11', '22'])
    numberLR(x) {
      var str = x != null ? x.toString() : "";
      let l, r, rs, _s, ls;
      if (x < 1e-6) {
        [_s, rs] = str.split("e-");
        [l, r] = ls.split(".");
        if (!r)
          r = "";
        r = { length: r.length + parseInt(rs) || 0 };
      } else {
        [l, r] = str.split(".");
      }
      return [l.length, r ? r.length : 0];
    },
    // Get a hash of current overlay disposition:
    // pane1.uuid+ov1.type+ov2.type+...+pane2.uuid+...
    ovDispositionHash(panes) {
      let h = "";
      for (var pane of panes) {
        h += pane.uuid;
        for (var ov of pane.overlays) {
          if (ov.main)
            continue;
          h += ov.type;
        }
      }
      return h;
    },
    // Format cursor event for the '$cursor-update' hook
    // TODO: doesn't work for renko
    makeCursorEvent($cursor, cursor, layout) {
      $cursor.values = cursor.values;
      $cursor.ti = cursor.ti;
      $cursor.time = cursor.time;
      $cursor.ohlcCoord = () => {
        const ohlc = layout.main.ohlc(cursor.time);
        return ohlc ? {
          x: layout.main.time2x(cursor.ti),
          ys: ohlc.map((x) => layout.main.value2y(x))
        } : null;
      };
      return $cursor;
    },
    // Adjust mouse coords to fix the shift caused by 
    // css transforms
    adjustMouse(event, canvas) {
      const rect = canvas.getBoundingClientRect();
      const adjustedX = event.clientX - rect.left;
      const adjustedY = event.clientY - rect.top;
      return new Proxy(event, {
        get(target, prop) {
          if (prop === "layerX") {
            return adjustedX;
          } else if (prop === "layerY") {
            return adjustedY;
          }
          if (typeof target[prop] === "function") {
            return target[prop].bind(target);
          }
          return target[prop];
        }
      });
    },
    // GPT to the moon!
    getCandleTime(timeframeMs) {
      if (timeframeMs <= 0)
        return "-----";
      const now2 = /* @__PURE__ */ new Date();
      const nowMs = now2.getTime();
      let remainingMs;
      if (timeframeMs === 7 * 24 * 60 * 60 * 1e3) {
        const daysLeft = 7 - now2.getUTCDay();
        remainingMs = daysLeft * 24 * 60 * 60 * 1e3 - nowMs % (24 * 60 * 60 * 1e3);
      } else if (timeframeMs >= 28 * 24 * 60 * 60 * 1e3 && timeframeMs < 365 * 24 * 60 * 60 * 1e3) {
        const nextMonth = new Date(Date.UTC(now2.getUTCFullYear(), now2.getUTCMonth() + 1, 1));
        remainingMs = nextMonth.getTime() - nowMs;
      } else if (timeframeMs >= 365 * 24 * 60 * 60 * 1e3) {
        const nextYear = new Date(Date.UTC(now2.getUTCFullYear() + 1, 0, 1));
        remainingMs = nextYear.getTime() - nowMs;
      } else {
        const elapsed = nowMs % timeframeMs;
        remainingMs = timeframeMs - elapsed;
      }
      const days = Math.floor(remainingMs / (24 * 60 * 60 * 1e3));
      const hours = Math.floor(remainingMs % (24 * 60 * 60 * 1e3) / (60 * 60 * 1e3));
      const minutes = Math.floor(remainingMs % (60 * 60 * 1e3) / (60 * 1e3));
      const seconds = Math.floor(remainingMs % (60 * 1e3) / 1e3);
      if (timeframeMs >= 24 * 60 * 60 * 1e3) {
        return `${days > 0 ? days + "d " : ""}${hours}h${days <= 0 ? " " + String(minutes).padStart(2, "0") + "m" : ""}`;
      }
      return `${hours > 0 ? String(hours).padStart(2, "0") + ":" : ""}${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    },
    // WTF with modern web development
    isMobile: ((w) => "onorientationchange" in w && (!!navigator.maxTouchPoints || !!navigator.msMaxTouchPoints || ("ontouchstart" in w || w.DocumentTouch && document instanceof w.DocumentTouch)))(typeof window !== "undefined" ? window : {})
  };
  const math = {
    // Distance from point to line
    // p1 = point, (p2, p3) = line
    point2line(p1, p2, p3) {
      const { area: area2, base } = this.tri(p1, p2, p3);
      return Math.abs(this.tri_h(area2, base));
    },
    // Distance from point to segment
    // p1 = point, (p2, p3) = segment
    point2seg(p1, p2, p3) {
      const { area: area2, base } = this.tri(p1, p2, p3);
      const proj = this.dot_prod(p1, p2, p3) / base;
      const l1 = Math.max(-proj, 0);
      const l2 = Math.max(proj - base, 0);
      const h = Math.abs(this.tri_h(area2, base));
      return Math.max(h, l1, l2);
    },
    // Distance from point to ray
    // p1 = point, (p2, p3) = ray
    point2ray(p1, p2, p3) {
      const { area: area2, base } = this.tri(p1, p2, p3);
      const proj = this.dot_prod(p1, p2, p3) / base;
      const l1 = Math.max(-proj, 0);
      const h = Math.abs(this.tri_h(area2, base));
      return Math.max(h, l1);
    },
    tri(p1, p2, p3) {
      const area2 = this.area(p1, p2, p3);
      const dx = p3[0] - p2[0];
      const dy = p3[1] - p2[1];
      const base = Math.sqrt(dx * dx + dy * dy);
      return { area: area2, base };
    },
    /* Area of triangle:
              p1
            /    \
          p2  _  p3
      */
    area(p1, p2, p3) {
      return p1[0] * (p2[1] - p3[1]) + p2[0] * (p3[1] - p1[1]) + p3[0] * (p1[1] - p2[1]);
    },
    // Triangle height
    tri_h(area2, base) {
      return area2 / base;
    },
    // Dot product of (p2, p3) and (p2, p1)
    dot_prod(p1, p2, p3) {
      const v1 = [p3[0] - p2[0], p3[1] - p2[1]];
      const v2 = [p1[0] - p2[0], p1[1] - p2[1]];
      return v1[0] * v2[0] + v1[1] * v2[1];
    },
    // Symmetrical log
    log(x) {
      return Math.sign(x) * Math.log(Math.abs(x) + 1);
    },
    // Symmetrical exp
    exp(x) {
      return Math.sign(x) * (Math.exp(Math.abs(x)) - 1);
    },
    // Middle line on log scale based on range & px height
    log_mid(r, h) {
      const log_hi = this.log(r[0]);
      const log_lo = this.log(r[1]);
      const px = h / 2;
      const gx = log_hi - px * (log_hi - log_lo) / h;
      return this.exp(gx);
    },
    // Return new adjusted range, based on the previous
    // range, new $hi, target middle line
    re_range(r1, hi2, mid) {
      const log_hi1 = this.log(r1[0]);
      const log_lo1 = this.log(r1[1]);
      const log_hi2 = this.log(hi2);
      const log_$ = this.log(mid);
      const W = (log_hi2 - log_$) * (log_hi1 - log_lo1) / (log_hi1 - log_$);
      return this.exp(log_hi2 - W);
    }
    // Return new adjusted range, based on the previous
    // range, new $hi, target middle line + dy (shift)
    // WASTE
    /*range_shift(r1, hi2, mid, dy, h) {
    	        let log_hi1 = this.log(r1[0])
    	        let log_lo1 = this.log(r1[1])
    	        let log_hi2 = this.log(hi2)
    	        let log_$ = this.log(mid)
    
    	        let W = h * (log_hi2 - log_$) /
    	                (h * (log_hi1 - log_$) / (log_hi1 - log_lo1) + dy)
    
    	        return this.exp(log_hi2 - W)
    
    	    }*/
  };
  class Cursor {
    constructor(meta) {
      this.meta = meta;
    }
    xSync(hub, layout, props, update2) {
      if (update2.visible === false) {
        this.hide();
        return this;
      }
      const prevT = this.ti;
      Object.assign(this, update2);
      const start = layout.main.startx;
      const step = layout.main.pxStep;
      this.yValues(layout);
      if (this.locked && !this.meta.scrollLock) {
        this.x = layout.main.time2x(prevT);
        return this;
      }
      this.x = Math.round((this.x - start) / step) * step + start;
      this.x = Math.floor(this.x - 1) + 0.5;
      return this.xValues(hub, layout, props);
    }
    // Get nearest data values
    xValues(hub, layout, props) {
      if (!this.locked || this.meta.scrollLock) {
        this.ti = layout.main.x2ti(this.x);
      }
      const values = [];
      let vi;
      for (var pane of hub.panes()) {
        const arr = [];
        for (var i = 0; i < pane.overlays.length; i++) {
          const ov = pane.overlays[i];
          if (!layout.indexBased) {
            vi = Utils.nearestTs(this.ti, ov.dataSubset) || [];
          } else {
            const off = ov.indexOffset;
            vi = Utils.nearestTsIb(this.ti, ov.data, off) || [];
          }
          if (ov.main) {
            this.time = vi[1] ? vi[1][0] : void 0;
          }
          arr.push(vi[1]);
        }
        values.push(arr);
      }
      this.values = values;
      this.quantizeTime(hub, layout, props);
      return this;
    }
    // Calculate y-values for each scale
    yValues(layout) {
      const gridId = this.gridId;
      if (!layout.grids[gridId])
        return;
      this.scales = {};
      const grid = layout.grids[gridId];
      for (var scale of Object.values(grid.scales)) {
        const $ = this.y2value(this.y, scale);
        this.scales[scale.scaleSpecs.id] = $;
      }
    }
    // Quantize time (by interval)
    quantizeTime(hub, layout, props) {
      const id = hub.chart.id;
      const ovId = hub.mainOv.id;
      if (!this.values || !this.values[id])
        return;
      const v = this.values[id][ovId];
      if (!v)
        return;
      const r = Math.abs((v[0] - this.ti) / props.interval);
      if (r >= 0.5) {
        const n = Math.round(this.ti / props.interval);
        this.ti = n * props.interval;
      } else {
        this.ti = v[0];
      }
      if (!layout.indexBased) {
        this.time = this.ti;
      }
    }
    // Copy of the same function from layoutFn.js
    y2value(y, scale) {
      const ls = scale.scaleSpecs.log;
      if (ls)
        return math.exp((y - scale.B) / scale.A);
      return (y - scale.B) / scale.A;
    }
    getValue(paneId, ovId) {
      if (!this.values)
        return void 0;
      const paneValues = this.values[paneId] || [];
      return paneValues[ovId];
    }
    hide() {
      this.visible = false;
      delete this.scales;
      delete this.x;
      delete this.y;
      if (!this.locked)
        delete this.ti;
    }
  }
  class Events {
    // TODO: add component call priority (think)
    // TODO: build event inspector (think)
    constructor() {
      this.handlers = {};
    }
    // Immediately calls all handlers with the
    // specified type (there can be only one
    // listener of this type per each component)
    emit(type, obj) {
      const components = this.handlers[type];
      if (!components)
        return;
      for (var name in components) {
        components[name](obj);
      }
    }
    // Component-specific update
    emitSpec(comp, type, obj) {
      const components = this.handlers[type];
      if (!components)
        return;
      if (!components[comp])
        return;
      components[comp](obj);
    }
    // TODO: imlement more specific emitter, e.g.
    // emitRegex() which uses RegEx to match
    // components
    // Add event listener to a specific component:
    // '<component>:<event-type>'
    on(compAndType, f) {
      const [comp, type] = compAndType.split(":");
      if (!this.handlers[type]) {
        this.handlers[type] = {};
      }
      this.handlers[type][comp] = f;
    }
    // Remove event listeners / one listener
    off(comp, type = null) {
      if (type && this.handlers[type]) {
        delete this.handlers[type][comp];
        return;
      }
      for (const handlerType in this.handlers) {
        delete this.handlers[handlerType][comp];
      }
    }
  }
  const instances$6 = {};
  function instance$j(id) {
    if (!instances$6[id]) {
      instances$6[id] = new Events(id);
    }
    return instances$6[id];
  }
  const Events$1 = { instance: instance$j };
  class SeClient {
    constructor(id, chart) {
      this.chart = chart;
      this.ww = chart.ww;
      this.ww.onevent = this.onEvent.bind(this);
    }
    setRefs(hub, scan) {
      this.hub = hub;
      this.scan = scan;
    }
    // Listen to the events from web-worker
    onEvent(e) {
      switch (e.data.type) {
        case "overlay-data":
          this.onOverlayData(e.data.data);
          break;
        case "engine-state":
          this.onEngineState(e.data.data);
          break;
      }
    }
    // Upload initial data
    async uploadData() {
      if (!this.hub.mainOv)
        return;
      await this.ww.exec("upload-data", {
        meta: {
          range: this.chart.range,
          tf: this.scan.tf
        },
        dss: {
          // TODO: 'cv' data key for [close, vol] chart
          ohlcv: this.hub.mainOv.data
        }
      });
    }
    // Update data (when new live data arrives)
    // TODO: autoscroll
    async updateData() {
      if (!this.hub.mainOv || !this.hub.mainOv.data)
        return;
      const ohlcv = this.hub.mainOv.data;
      const data = await this.ww.exec("update-data", {
        // Send the last two candles
        ohlcv: ohlcv.slice(-2)
      });
      let unshift = false;
      for (var ov of this.hub.allOverlays()) {
        if (data[ov.uuid]) {
          const last = ov.data[ov.data.length - 1];
          const nw = data[ov.uuid];
          if (!last || nw[0] > last[0]) {
            ov.data.push(nw);
            unshift = true;
          } else if (nw[0] === last[0]) {
            ov.data[ov.data.length - 1] = nw;
          }
        }
      }
      if (unshift) {
        this.chart.update("data");
      } else {
        this.chart.update();
      }
    }
    async execScripts() {
      const list = this.hub.panes().map((x) => ({
        id: x.id,
        uuid: x.uuid,
        scripts: x.scripts
      }));
      await this.ww.exec("exec-all-scripts", list);
    }
    async uploadAndExec() {
      await this.uploadData();
      await this.execScripts();
    }
    // Remove all overlays produced by scripts & add new
    replaceOverlays(data) {
      for (var pane of this.hub.panes()) {
        pane.overlays = pane.overlays.filter((x) => !x.prod);
        const p = data.find((x) => x.uuid === pane.uuid);
        if (p && p.overlays) {
          pane.overlays.push(...p.overlays);
        }
      }
      this.chart.update();
    }
    // Opdate data of overlays produced by scripts
    updateOverlays(data) {
      for (var pane of this.hub.panes()) {
        const p = data.find((x) => x.uuid === pane.uuid);
        if (p && p.overlays) {
          const ovs = pane.overlays.filter((x) => x.prod);
          for (var i = 0; i < ovs.length; i++) {
            const dst = ovs[i];
            const src = p.overlays[i];
            if (dst && src) {
              dst.name = src.name;
              dst.data = src.data;
              dst.uuid = src.uuid;
            }
          }
        }
      }
      this.chart.update("data", { updateHash: true });
    }
    // Event handlers
    onOverlayData(data) {
      const h1 = Utils.ovDispositionHash(this.hub.panes());
      const h2 = Utils.ovDispositionHash(data);
      if (h1 === h2) {
        this.updateOverlays(data);
      } else {
        this.replaceOverlays(data);
      }
    }
    onEngineState(data) {
      this.state = Object.assign(this.state || {}, data);
    }
  }
  const instances$5 = {};
  function instance$i(id, chart) {
    if (!instances$5[id]) {
      instances$5[id] = new SeClient(id, chart);
    }
    return instances$5[id];
  }
  const SeClient$1 = { instance: instance$i };
  class DataView$ {
    constructor(src, i1, i2) {
      this.src = src;
      this.i1 = Math.max(0, i1 - 1);
      this.i2 = Math.min(i2, src.length - 1);
      this.length = this.i2 - this.i1 + 1;
    }
    makeSubset() {
      return this.src.slice(
        this.i1,
        this.i2 + 1
      );
    }
  }
  class DataHub {
    constructor(nvId) {
      const events = Events$1.instance(nvId);
      const se = SeClient$1.instance(nvId);
      this.events = events;
      this.se = se;
      se.hub = this;
      events.on("hub:set-scale-index", this.onScaleIndex.bind(this));
      events.on("hub:display-overlay", this.onDisplayOv.bind(this));
    }
    init(data) {
      var _a;
      this.data = data;
      this.indexBased = (_a = data.indexBased) != null ? _a : false;
      this.chart = null;
      this.offchart = null;
      this.mainOv = null;
      this.mainPaneId = null;
    }
    // Update data on 'range-changed'. Should apply
    // filters only (not updating the full structure)
    updateRange(range) {
      for (var pane of this.data.panes) {
        for (var ov of pane.overlays) {
          const off = ov.indexOffset;
          ov.dataView = this.filter(ov.data, range, off);
          ov.dataSubset = ov.dataView.makeSubset();
        }
      }
    }
    // Calculate visible data section
    // (& completes the main structure)
    // TODO: smarter algo of adding/removing panes. Uuids
    // should remain the same if pane still exists
    calcSubset(range) {
      var paneId = 0;
      for (var pane of this.data.panes || []) {
        pane.id = paneId++;
        pane.overlays = pane.overlays || [];
        pane.settings = pane.settings || {};
        var ovId = 0;
        for (var ov of pane.overlays) {
          ov.id = ovId++;
          ov.main = !!ov.main;
          ov.data = ov.data || [];
          ov.dataView = this.filter(
            ov.data,
            range,
            ov.indexOffset
          );
          ov.dataSubset = ov.dataView.makeSubset();
          ov.dataExt = ov.dataExt || {};
          ov.settings = ov.settings || {};
          ov.props = ov.props || {};
          ov.uuid = ov.uuid || Utils.uuid3();
        }
        pane.uuid = pane.uuid || Utils.uuid3();
      }
    }
    // Load indicator scripts
    async loadScripts(exec = false) {
      for (var pane of this.data.panes || []) {
        var scriptId = 0;
        pane.scripts = pane.scripts || [];
        for (var s of pane.scripts) {
          s.id = scriptId++;
          s.settings = s.settings || {};
          s.props = s.props || {};
          s.uuid = s.uuid || Utils.uuid3();
        }
      }
      if (exec) {
        await Utils.pause(0);
        await this.se.uploadAndExec();
      }
    }
    // Detect the main chart, define offcharts
    detectMain() {
      const all = Utils.allOverlays(this.data.panes);
      const mainOv = all.find((x) => x.main) || all[0];
      if (!all.length || !mainOv)
        return;
      mainOv.main = true;
      this.chart = this.data.panes.find(
        (x) => x.overlays.find(
          (y) => y.main
        )
      );
      this.offchart = this.data.panes.filter(
        (x) => x !== this.chart
      );
      this.mainOv = mainOv;
      this.mainPaneId = this.panes().indexOf(this.chart);
      for (var ov of all) {
        if (ov !== mainOv)
          ov.main = false;
      }
    }
    // [API] Create a subset of timeseries
    filter(data, range, offset = 0) {
      const filter = this.indexBased ? Utils.fastFilterIB : Utils.fastFilter2;
      var ix = filter(
        data,
        range[0] - offset,
        range[1] - offset
      );
      return new DataView$(data, ix[0], ix[1]);
    }
    // [API] Get all active panes (with uuid)
    panes() {
      return (this.data.panes || []).filter((x) => x.uuid);
    }
    // [API] Get overlay ref by paneId & ovId
    overlay(paneId, ovId) {
      var _a;
      return (_a = this.panes()[paneId]) == null ? void 0 : _a.overlays[ovId];
    }
    // [API] Get overlay data by paneId & ovId
    ovData(paneId, ovId) {
      var _a, _b;
      return (_b = (_a = this.panes()[paneId]) == null ? void 0 : _a.overlays[ovId]) == null ? void 0 : _b.data;
    }
    // [API] Get overlay extra data by paneId & ovId
    ovDataExt(paneId, ovId) {
      var _a, _b;
      return (_b = (_a = this.panes()[paneId]) == null ? void 0 : _a.overlays[ovId]) == null ? void 0 : _b.dataExt;
    }
    // [API] Get overlay data subset by paneId & ovId
    ovDataSubset(paneId, ovId) {
      var _a, _b;
      return (_b = (_a = this.panes()[paneId]) == null ? void 0 : _a.overlays[ovId]) == null ? void 0 : _b.dataSubset;
    }
    // [API] Get All overlays
    allOverlays(type) {
      const all = Utils.allOverlays(this.data.panes);
      return type ? all.filter((x) => x.type === type) : all;
    }
    // Event handlers
    onScaleIndex(event) {
      const pane = this.panes()[event.paneId];
      if (!pane)
        return;
      pane.settings.scaleIndex = event.index;
      pane.settings.scaleSideIdxs = event.sideIdxs;
      this.events.emitSpec("chart", "update-layout");
    }
    onDisplayOv(event) {
      const pane = this.panes()[event.paneId];
      if (!pane)
        return;
      const ov = pane.overlays[event.ovId];
      if (!ov)
        return;
      ov.settings.display = event.flag;
      const llId = `${event.paneId}-${event.ovId}`;
      this.events.emitSpec("chart", "update-layout");
      this.events.emitSpec(`ll-${llId}`, "update-ll");
    }
  }
  const instances$4 = {};
  function instance$h(id) {
    if (!instances$4[id]) {
      instances$4[id] = new DataHub(id);
    }
    return instances$4[id];
  }
  const DataHub$1 = { instance: instance$h };
  class MetaHub {
    constructor(nvId) {
      const events = Events$1.instance(nvId);
      this.hub = DataHub$1.instance(nvId);
      this.events = events;
      events.on("meta:sidebar-transform", this.onYTransform.bind(this));
      events.on("meta:select-overlay", this.onOverlaySelect.bind(this));
      events.on("meta:grid-mousedown", this.onGridMousedown.bind(this));
      events.on("meta:scroll-lock", this.onScrollLock.bind(this));
      this.storage = {};
    }
    init(props) {
      this.panes = 0;
      this.ready = false;
      this.legendFns = [];
      this.yTransforms = [];
      this.preSamplers = [];
      this.yRangeFns = [];
      this.autoPrecisions = [];
      this.valueTrackers = [];
      this.selectedOverlay = void 0;
      this.ohlcMap = [];
      this.ohlcFn = void 0;
      this.scrollLock = false;
    }
    // Extract meta functions from overlay
    exctractFrom(overlay) {
      var _a;
      const gridId = overlay.gridId();
      const id = overlay.id();
      var yrfs = this.yRangeFns[gridId] || [];
      yrfs[id] = overlay.yRange ? {
        exec: overlay.yRange,
        preCalc: overlay.yRangePreCalc
      } : null;
      var aps = this.preSamplers[gridId] || [];
      aps[id] = overlay.preSampler;
      var lfs = this.legendFns[gridId] || [];
      lfs[id] = {
        legend: overlay.legend,
        legendHtml: overlay.legendHtml,
        noLegend: (_a = overlay.noLegend) != null ? _a : false
      };
      var vts = this.valueTrackers[gridId] || [];
      vts[id] = overlay.valueTracker;
      const main = this.hub.overlay(gridId, id).main;
      if (main) {
        this.ohlcFn = overlay.ohlc;
      }
      this.yRangeFns[gridId] = yrfs;
      this.preSamplers[gridId] = aps;
      this.legendFns[gridId] = lfs;
      this.valueTrackers[gridId] = vts;
    }
    // Maps timestamp => ohlc, index
    // TODO: should add support for indexBased? 
    calcOhlcMap() {
      this.ohlcMap = {};
      const data = this.hub.mainOv.data;
      for (var i = 0; i < data.length; i++) {
        this.ohlcMap[data[i][0]] = {
          ref: data[i],
          index: i
        };
      }
    }
    // Store auto precision for a specific overlay
    setAutoPrec(gridId, ovId, prec) {
      const aps = this.autoPrecisions[gridId] || [];
      aps[ovId] = prec;
      this.autoPrecisions[gridId] = aps;
    }
    // Call this after all overlays are processed
    // We need to make an update to apply freshly
    // extracted functions
    // TODO: probably can do better
    finish() {
      this.panes++;
      if (this.panes < this.hub.panes().length)
        return;
      this.autoPrecisions = [];
      this.calcOhlcMap();
      this.ready = true;
      setTimeout(() => {
        this.events.emitSpec("chart", "update-layout");
        this.events.emit("update-legend");
      });
    }
    // Store some meta info such as ytransform by
    // (pane.uuid + scaleId) hash
    store() {
      this.storage = {};
      const yts = this.yTransforms || [];
      for (var paneId in yts) {
        const paneYts = yts[paneId];
        const pane = this.hub.panes()[paneId];
        if (!pane)
          continue;
        for (var scaleId in paneYts) {
          const hash2 = `yts:${pane.uuid}:${scaleId}`;
          this.storage[hash2] = paneYts[scaleId];
        }
      }
    }
    // Restore that info after an update in the
    // pane/overlay order
    restore() {
      const yts = this.yTransforms;
      for (var hash2 in this.storage) {
        const [type, uuid1, uuid2] = hash2.split(":");
        const pane = this.hub.panes().find((x) => x.uuid === uuid1);
        if (!pane)
          continue;
        switch (type) {
          case "yts":
            if (!yts[pane.id])
              yts[pane.id] = [];
            yts[pane.id][uuid2] = this.storage[hash2];
            break;
        }
      }
      this.store();
    }
    // [API] Get y-transform of a specific scale
    getYtransform(gridId, scaleId) {
      return (this.yTransforms[gridId] || [])[scaleId];
    }
    // [API] Get auto precision of a specific overlay
    getAutoPrec(gridId, ovId) {
      return (this.autoPrecisions[gridId] || [])[ovId];
    }
    // [API] Get a precision smapler of a specific overlay
    getPreSampler(gridId, ovId) {
      return (this.preSamplers[gridId] || [])[ovId];
    }
    // [API] Get legend formatter of a specific overlay
    getLegendFns(gridId, ovId) {
      return (this.legendFns[gridId] || [])[ovId];
    }
    // [API] Get OHLC values to use as "magnet" values
    ohlc(t) {
      const el = this.ohlcMap[t];
      if (!el || !this.ohlcFn)
        return;
      return this.ohlcFn(el.ref);
    }
    // EVENT HANDLERS
    // User changed y-range
    onYTransform(event) {
      const yts = this.yTransforms[event.gridId] || {};
      const tx = yts[event.scaleId] || {};
      yts[event.scaleId] = Object.assign(tx, event);
      this.yTransforms[event.gridId] = yts;
      if (event.updateLayout) {
        this.events.emitSpec("chart", "update-layout");
      }
      this.store();
    }
    // User tapped legend & selected the overlay
    onOverlaySelect(event) {
      this.selectedOverlay = event.index;
      this.events.emit("$overlay-select", {
        index: event.index,
        ov: this.hub.overlay(...event.index)
      });
    }
    // User tapped grid (& deselected all overlays)
    onGridMousedown(event) {
      this.selectedOverlay = void 0;
      this.events.emit("$overlay-select", {
        index: void 0,
        ov: void 0
      });
    }
    // Overlay/user set lock on scrolling
    onScrollLock(event) {
      this.scrollLock = event;
    }
  }
  const instances$3 = {};
  function instance$g(id) {
    if (!instances$3[id]) {
      instances$3[id] = new MetaHub(id);
    }
    return instances$3[id];
  }
  const MetaHub$1 = { instance: instance$g };
  class DataScanner {
    constructor() {
    }
    init(props) {
      this.props = props;
      this.hub = DataHub$1.instance(props.id);
    }
    detectInterval() {
      this.all = Utils.allOverlays(this.hub.data.panes);
      if (this.all.filter((x) => x.main).length > 1) {
        console.warn(
          "Two or more overlays with flagged as 'main'"
        );
      }
      let mainOv = this.all.find((x) => x.main) || this.all[0];
      mainOv = mainOv || {};
      this.main = mainOv.data || [];
      const userTf = (mainOv.settings || {}).timeFrame;
      if (userTf !== void 0) {
        this.tf = Utils.parseTf(userTf);
      } else {
        this.tf = Utils.detectTimeframe(this.main);
      }
      this.interval = this.hub.data.indexBased ? 1 : this.tf;
      this.ibMode = this.hub.data.indexBased;
      return this.interval;
    }
    getTimeframe() {
      return this.tf;
    }
    // [API] Range that shown on a chart startup
    defaultRange() {
      const dl = this.props.config.DEFAULT_LEN;
      const ml = this.props.config.MINIMUM_LEN + 0.5;
      const l = this.main.length - 1;
      if (this.main.length < 2)
        return [];
      if (this.main.length <= dl) {
        var s = 0, d = ml;
      } else {
        s = l - dl, d = 0.5;
      }
      if (!this.hub.data.indexBased) {
        return [
          this.main[s][0] - this.interval * d,
          this.main[l][0] + this.interval * ml
        ];
      } else {
        return [
          s - this.interval * d,
          l + this.interval * ml
        ];
      }
    }
    // Calculate index offsets to adjust non-main ovs
    calcIndexOffsets() {
      var _a, _b;
      if (!this.hub.data.indexBased)
        return;
      for (var ov of this.all) {
        if (ov.data === this.main) {
          ov.indexOffset = (_a = ov.indexOffset) != null ? _a : 0;
          continue;
        }
        const d = Utils.findIndexOffset(this.main, ov.data);
        ov.indexOffset = (_b = ov.indexOffset) != null ? _b : d;
      }
    }
    // Calculte hash of the current panes
    calcPanesHash() {
      let hash2 = "";
      for (var pane of this.hub.data.panes || []) {
        hash2 += pane.uuid;
        for (var ov of pane.overlays || []) {
          hash2 += ov.uuid;
        }
      }
      return hash2;
    }
    // Detect changes in pane order/collection
    panesChanged() {
      const hash2 = this.calcPanesHash();
      return hash2 !== this.panesHash;
    }
    updatePanesHash() {
      this.panesHash = this.calcPanesHash();
    }
  }
  const instances$2 = {};
  function instance$f(id) {
    if (!instances$2[id]) {
      instances$2[id] = new DataScanner(id);
    }
    return instances$2[id];
  }
  const DataScan = { instance: instance$f };
  const HPX$7 = Const.HPX;
  function layoutFn(self2, range, overlay = null) {
    var _a;
    const dt = range[1] - range[0];
    const r = self2.spacex / dt;
    const ls = (self2.scaleSpecs || {}).log || false;
    const offset = (_a = overlay ? overlay.indexOffset : 0) != null ? _a : 0;
    Object.assign(self2, {
      // Time and global index to screen x-coordinate
      // (universal mapping that works both in timeBased
      // & indexBased modes):
      // Time-index switch (returns time or index depending on the mode)
      ti: (t, i) => {
        return self2.indexBased ? i : t;
      },
      // Time-or-index to screen x-coordinate
      ti2x: (t, i) => {
        const src = self2.indexBased ? i + offset : t;
        return Math.floor((src - range[0]) * r) + HPX$7;
      },
      // Time to screen x-coordinates
      time2x: (t) => {
        return Math.floor((t - range[0]) * r) + HPX$7;
      },
      // Price/value to screen y-coordinates
      value2y: (y) => {
        if (ls)
          y = math.log(y);
        return Math.floor(y * self2.A + self2.B) + HPX$7;
      },
      // Time-axis nearest step
      tMagnet: (t) => {
      },
      // Screen-Y to dollar value (or whatever)
      y2value: (y) => {
        if (ls)
          return math.exp((y - self2.B) / self2.A);
        return (y - self2.B) / self2.A;
      },
      // Screen-X to timestamp
      x2time: (x) => {
        return range[0] + x / r;
      },
      // Screen-X to time-index
      x2ti: (x) => {
        return range[0] + x / r;
      },
      // $-axis nearest step
      $magnet: (price) => {
      },
      // Nearest candlestick
      cMagnet: (t) => {
        const cn = self2.candles || self2.master_grid.candles;
        const arr = cn.map((x) => x.raw[0]);
        const i = Utils.nearestA(t, arr)[0];
        return cn[i];
      },
      // Nearest data points
      dataMagnet: (t) => {
      }
    });
    return self2;
  }
  const logScale = {
    candle(self2, mid, p, $p) {
      return {
        x: mid,
        w: self2.pxStep * $p.config.CANDLEW,
        o: Math.floor(math.log(p[1]) * self2.A + self2.B),
        h: Math.floor(math.log(p[2]) * self2.A + self2.B),
        l: Math.floor(math.log(p[3]) * self2.A + self2.B),
        c: Math.floor(math.log(p[4]) * self2.A + self2.B),
        raw: p
      };
    },
    expand(self2, height) {
      const A = -height / (math.log(self2.$hi) - math.log(self2.$lo));
      const B = -math.log(self2.$hi) * A;
      const top = -height * 0.1;
      const bot = height * 1.1;
      self2.$hi = math.exp((top - B) / A);
      self2.$lo = math.exp((bot - B) / A);
    }
  };
  const AppleArea = `
// NavyJS ~ 0.2-lite

// <ds>Area chart, like in MacOS Stocks app </ds>
// format: [<timestamp>, <value>]

[OVERLAY name=AppleArea, ctx=Canvas, version=1.0.0]

// Define new props
prop('colorUp', { type: 'color', def: '#57db64' })
prop('colorDown', { type: 'color', def: '#ff3b2f' })
prop('colorSelect', { type: 'color', def: '#49bef4' })
prop('colorSelectBack', { type: 'color', def: '#00a7f455' })
prop('colorSelectValue', { type: 'color', def: '#3b8fed' })
prop('colorBaseline', { type: 'color', def: '#555555' })
prop('lineWidth', { type: 'number', def: 1.5 })
prop('showName', { type: 'boolean', def: false })

const HPX = - 0.5
const FONT = 'bold 14' + $core.props.config.FONT.slice(2)
let direction = 1
let mode = 'display'

init() {
    setTimeout(() => {
        $events.emit('show-crosshair', false)
        $events.emit('show-sb-panel', false)
        $events.emit('show-bb-panel', false)
    })
}

destroy() {
    $events.emit('show-crosshair', true)
    $events.emit('show-sb-panel', true)
    $events.emit('show-bb-panel', true)
}

draw(ctx) {

    mode = $core.cursor.visible ? 'select' : 'display'

    const layout = $core.layout
    const data = $core.data // Full dataset
    const view = $core.view // Visible view

    drawBaseline(ctx, layout)

    const grd = ctx.createLinearGradient(0, 0, 0, layout.height)
    let color = mode === 'select' ? $props.colorSelect : (
        direction > 0 ? $props.colorUp : $props.colorDown
    )
    let cb = mode === 'select' ? $props.colorSelectBack : (color + '55')
    grd.addColorStop(0, cb)
    grd.addColorStop(1, color + '00')

    // Line
    ctx.lineWidth = $props.lineWidth
    ctx.strokeStyle = color
    ctx.lineJoin = "round"
    ctx.beginPath()
    for (var i = view.i1, n = view.i2; i <= n; i++) {
        let p = data[i]
        let x = layout.ti2x(p[0], i)
        let y = layout.value2y(p[1])
        ctx.lineTo(x, y)
    }
    ctx.stroke()

    // Area
    ctx.fillStyle = grd
    ctx.beginPath()
    let p0 = (data[0] || [])[0]
    let pN = (data[data.length - 1] || [])[0]
    ctx.lineTo(layout.ti2x(p0, 0), layout.height)
    for (var i = view.i1, n = view.i2; i <= n; i++) {
        let p = data[i]
        let x = layout.ti2x(p[0], i)
        let y = layout.value2y(p[1])
        ctx.lineTo(x, y)
    }
    ctx.lineTo(layout.ti2x(pN, i - 1), layout.height)
    ctx.fill()

    let rightMost = $core.dataSubset.slice(-1)[0][0]
    if ($core.cursor.ti > rightMost) return

    drawVertical(ctx, layout) 

    // Draw selection circle
    drawSelectionCircle(ctx, layout);

}

// Line that starts from the leftmost price value
drawBaseline(ctx, layout) {
    let v0 = $core.dataSubset[0][1]
    let vLast = $core.dataSubset.slice(-1)[0][1]

    direction = Math.sign(vLast - v0)

    let y = layout.value2y(v0)
    ctx.save()
    ctx.strokeStyle = $props.colorBaseline
    ctx.beginPath()
    ctx.setLineDash([3])
    ctx.moveTo(0, y + HPX)
    ctx.lineTo(layout.width + HPX, y + HPX)
    ctx.stroke()
    ctx.restore()

}

// Draw vertical line with value 
drawVertical(ctx, layout) {
    if (mode === 'select' && $core.cursor.visible) {
        // Draw vertical line
        ctx.strokeStyle = $props.colorSelect
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo($core.cursor.x, 5)
        ctx.lineTo($core.cursor.x, layout.height)
        ctx.stroke()

        // Display value panel
        const selectedValue = $core.cursor.values[0][0][1]
        const valueText = selectedValue.toFixed(2)

        ctx.font = FONT
        ctx.fillStyle = $props.colorSelect
        const textWidth = ctx.measureText(valueText).width

        // Calculate position for the value panel
        const panelX = $core.cursor.x - textWidth / 2
        const panelY = 5 // Distance from the top of the canvas

        // Draw value panel background
        ctx.fillStyle = $core.colors.back
        const panelHeight = 20 // Height of the panel
        ctx.fillRect(panelX - 5, panelY, textWidth + 10, panelHeight)

        // Draw value text
        ctx.fillStyle = $props.colorSelectValue
        const textY = panelY + panelHeight - 5 // Vertical position of the text, adjusted for padding
        ctx.fillText(valueText, panelX, textY)
    }
}

// Draw a circle around the selected price point
drawSelectionCircle(ctx, layout) {
    if (mode === 'select' && $core.cursor.visible) {

        let selectedValue = $core.cursor.values[0][0][1];

        const circleRadius = 8; // Radius of the circle
        const circleStrokeWidth = 2; // Stroke width of the circle
        const circleX = $core.cursor.x;
        const circleY = layout.value2y(selectedValue);

        // Draw circle stroke (back color)
        ctx.strokeStyle = $core.colors.back;
        ctx.lineWidth = circleStrokeWidth;
        ctx.beginPath();
        ctx.arc(circleX, circleY, circleRadius + circleStrokeWidth / 2, 0, 2 * Math.PI);
        ctx.stroke();

        // Draw circle (select color)
        ctx.fillStyle = $props.colorSelect;
        ctx.beginPath();
        ctx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
        ctx.fill();
    }
}

// Precision sampling
preSampler(x) => [x[1]]

// Map data item to OHLC (for candle magnets etc.)
// Here we simulate a candle with 0 height
ohlc(x) => Array(4).fill(x[$props.dataIndex])

// Legend, defined as pairs [value, color]
legend(x) => $props.showName ? [] : null
`;
  const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: AppleArea
  }, Symbol.toStringTag, { value: "Module" }));
  const ArrowTrades = "\n// Navy ~ 0.2-lite\n\n// <ds>Stacked arrow trades</ds>\n// Format: [<timestamp>, [<dir>, <?label> <?big>], ...]\n// <dir> :: 1 for buy -1 for sell\n// <?label> :: trade label (null for no label)\n// <?big> :: true/false, make an arrow big\n\n[OVERLAY name=ArrowTrades, ctx=Canvas, version=1.0.0]\n\nprop('buyColor', {  type: 'color', def: '#08c65e' })\nprop('sellColor', {  type: 'color', def: '#e42633' })\nprop('size', {  type: 'number', def: 7 })\nprop('showLabels', {  type: 'boolean', def: true })\nprop('markerOutline', {  type: 'boolean', def: true })\nprop('outlineWidth', {  type: 'number', def: 4 })\n\n// Draw function (called on each update)\n// Library provides a lot of useful variables to make\n// overlays ($core in the main collection)\ndraw(ctx) {\n    ctx.lineWidth = $props.outlineWidth\n    const layout = $core.layout\n    const data = $core.data // Full dataset\n    const view = $core.view // Visible view\n\n    // Fill sell trades\n    ctx.fillStyle = $props.buyColor\n    ctx.beginPath()\n    let lbls1 = iterTrades(ctx, view, data, layout, -1)\n    ctx.fill()\n\n    // Fill buy trades\n    ctx.fillStyle = $props.sellColor\n    ctx.beginPath()\n    let lbls2 = iterTrades(ctx, view, data, layout, 1)\n    ctx.fill()\n\n    // Draw labels\n    if ($props.showLabels) {\n        ctx.fillStyle = $core.colors.textHL\n        ctx.font = $core.props.config.FONT\n        let all = [...lbls1, ...lbls2]\n        drawLabels(ctx, view, layout, all)\n    }\n\n}\n\n// Iter through arcs\niterTrades(ctx, view, data, layout, dir) {\n    let lables = []\n    for (var i = view.i1, n = view.i2; i <= n; i++) {\n        let p = data[i]\n        let ohlc = layout.ohlc(p[0])\n        if (!ohlc) continue\n        let x = layout.ti2x(p[0], i)\n        if (dir > 0) {\n            var y = layout.value2y(ohlc[1])\n        } else {\n            var y = layout.value2y(ohlc[2])\n        }\n        for (var k = 1; k < p.length; k++) {\n            if (Math.sign(p[k][0]) === dir) continue\n            let size = $props.size\n            if (p[k][2]) size *= 1.5\n            let yk = y - dir * (15 * (k - 1) + 10)\n            let align = dir < 0 ? 'right' : 'left'\n            let dy = p[k][2] ? - dir * 1 : 0\n            if (p[k][1]) {\n                lables.push([ x + 10 * dir, yk + dy, p[k][1], align])\n            }\n            drawArrow(ctx, x, yk, -dir, size)\n        }\n    }\n    return lables\n}\n\ndrawArrow(ctx, x, y, dir, size) {\n    ctx.moveTo(x, y)\n    ctx.lineTo(x + size * dir * 0.63, y + size * dir)\n    ctx.lineTo(x - size * dir * 0.63, y + size * dir)\n}\n\n// Draw simple lables\ndrawLabels(ctx, view, layout, lables) {\n    for (var l of lables) {\n        ctx.textAlign = l[3]\n        let dy = l[3] === 'right' ? 7 : 0\n        ctx.fillText(l[2], l[0], l[1] + dy)\n    }\n}\n\n// Not affecting the y-range\nyRange() => null\n\n// Legend formatter, Array of [value, color] pairs\n// x represents one data item e.g. [<time>, <value>]\nlegend(x) {\n    let items = []\n    for (var i = 1; i < x.length; i++) {\n        items.push([\n            x[i][1] || (x[i][0] > 0 ? 'Buy' : 'Sell'),\n            x[i][0] > 0 ? $props.buyColor : $props.sellColor\n        ])\n    }\n    return items\n}\n";
  const __vite_glob_0_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: ArrowTrades
  }, Symbol.toStringTag, { value: "Module" }));
  const Band = "// Navy ~ 0.2-lite\n\n// <ds>Bands indicator, e.g. BollingerBands</ds> \n// format: [<timestamp>, <high>, <mid>, <low>]\n\n[OVERLAY name=Band, ctx=Canvas, verion=1.0.0]\n\n// Overlay props\nprop('color', { type: 'Color', def: '#b41d70' })\nprop('backColor', { type: 'Color', def: $props.color + '11' })\nprop('lineWidth', { type: 'number', def: 1 })\nprop('showMid', { type: 'boolean', def: true })\n\n// Draw call\ndraw(ctx) {\n     // Background\n    const data = $core.data\n    const view = $core.view\n    const layout = $core.layout\n    ctx.beginPath()\n    ctx.fillStyle = $props.backColor\n    for (var i = view.i1, n = view.i2; i <= n; i++) {\n        let p = data[i]\n        let x = layout.ti2x(p[0], i)\n        let y = layout.value2y(p[1] || undefined)\n        ctx.lineTo(x, y)\n    }\n    for (var i = view.i2, i1 = view.i1; i >= i1; i--) {\n        let p = data[i]\n        let x = layout.ti2x(p[0], i)\n        let y = layout.value2y(p[3] || undefined)\n        ctx.lineTo(x, y)\n    }\n    ctx.fill()\n    // Lines\n    // TODO: can be faster by combining line\n    // into one path with moveTo in b/w\n    ctx.lineWidth = $props.lineWidth\n    ctx.strokeStyle = $props.color\n    // Top line\n    ctx.beginPath()\n    for (var i = view.i1, n = view.i2; i <= n; i++) {\n        let p = data[i]\n        let x = layout.ti2x(p[0], i)\n        let y = layout.value2y(p[1] || undefined)\n        ctx.lineTo(x, y)\n    }\n    ctx.stroke()\n    // Bottom line\n    ctx.beginPath()\n    for (var i = view.i1, n = view.i2; i <= n; i++) {\n        let p = data[i]\n        let x = layout.ti2x(p[0], i)\n        let y = layout.value2y(p[3] || undefined)\n        ctx.lineTo(x, y)\n    }\n    ctx.stroke()\n    // Middle line\n    if (!$props.showMid) return\n    ctx.beginPath()\n    for (var i = 0; i < data.length; i++) {\n        let p = data[i]\n        let x = layout.ti2x(p[0], i)\n        let y = layout.value2y(p[2] || undefined)\n        ctx.lineTo(x, y)\n    }\n    ctx.stroke()\n}\n\n// Legend, defined as pairs [value, color]\nlegend(x) => $props.showMid ? [\n    [x[1], $props.color],\n    [x[2], $props.color],\n    [x[3], $props.color]\n] : [\n    [x[1], $props.color],\n    [x[3], $props.color]\n]\n";
  const __vite_glob_0_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Band
  }, Symbol.toStringTag, { value: "Module" }));
  const CandlesPlus = `
// NavyJS ~ 0.2-lite

// <ds>Colored Candles (Warning: coloring makes it slower)</ds>
// Format: [<timestamp>, <open>, <high>, <low>, <close>, <?volume>, <?color>]
// <?color> :: Candle body color

[OVERLAY name=CandlesPlus, ctx=Canvas, version=1.0.0]

// Define the props
prop('colorBodyUp', { type: 'color', def: $core.colors.candleUp })
prop('colorBodyDw', { type: 'color', def: $core.colors.candleDw })
prop('colorWickUp', { type: 'color', def: $core.colors.wickUp })
prop('colorWickDw', { type: 'color', def: $core.colors.wickDw })
prop('colorVolUp', { type: 'color', def: $core.colors.volUp })
prop('colorVolDw', { type: 'color', def: $core.colors.volDw })
prop('showVolume', { type: 'boolean', def: true })
prop('showWicks', { type: 'boolean', def: true })
prop('currencySymbol', { type: 'string', def: '$' })
prop('showAvgVolume', { type: 'boolean', def: true })
prop('avgVolumeSMA', { type: 'number', def: 20 })
prop('colorAvgVol', { type: 'color', def: '#1cccb777'})
prop('scaleSymbol', { type: 'string|boolean', def: false })
prop('priceLine', { type: 'boolean', def: true })
prop('showValueTracker', { type: 'boolean', def: true })
prop('coloringBodies', { type: 'boolean', def: true })
prop('coloringWicks', { type: 'boolean', def: false })
prop('coloringVolume', { type: 'boolean', def: false })

// Draw call
draw(ctx) {

    let cnv = $lib.layoutCnv($core, true, $props.showVolume)
    let bodies = cnv.upBodies.length ? cnv.upBodies : cnv.dwBodies
    if (!bodies.length) return
    let w = Math.max(bodies[0].w, 1)
    let sw = $props.showWicks
    let cb = $props.coloringBodies
    let cw = $props.coloringWicks
    let cv = $props.coloringVolume

    if (sw) {
        drawCvPart(ctx, $lib.candleWick, cnv.dwWicks, 1, 'colorWickDw', cw)
        drawCvPart(ctx, $lib.candleWick, cnv.upWicks, 1, 'colorWickUp', cw)
    }
    drawCvPart(ctx, $lib.candleBody, cnv.dwBodies, w, 'colorBodyDw', cb)
    drawCvPart(ctx, $lib.candleBody, cnv.upBodies, w, 'colorBodyUp', cb)
    drawCvPart(ctx, $lib.volumeBar, cnv.dwVolbars, w, 'colorVolDw', cv)
    drawCvPart(ctx, $lib.volumeBar, cnv.upVolbars, w, 'colorVolUp', cv)

    if ($props.showVolume && $props.showAvgVolume) {
        $lib.avgVolume(ctx, $core, $props, cnv)
    }

}

// Draw candle part
drawCvPart(ctx, f, arr, w, color, coloring = false) {
    let layout = $core.layout
    let prevColor = null
    ctx.lineWidth = w
    ctx.strokeStyle = $props[color]
    ctx.beginPath()
    for (var i = 0, n = arr.length; i < n; i++) {
        if (coloring) {
            var c = arr[i].src[6]
            if (c) {
                if (c !== prevColor) {
                    ctx.stroke()
                    ctx.beginPath()
                }
                ctx.strokeStyle = c
            } else if (prevColor !== $props[color]) {
                ctx.stroke()
                ctx.beginPath()
                ctx.strokeStyle = $props[color]
                prevColor = $props[color]
            }
            prevColor = c
        }
        f(ctx, arr[i], layout)
    }
    ctx.stroke()
}

// Define y-range (by finding max High, min Low)
static yRange(data) {
    let len = data.length
    var h, l, high = -Infinity, low = Infinity
    for(var i = 0; i < len; i++) {
        let point = data[i]
        if (point[2] > high) high = point[2]
        if (point[3] < low) low = point[3]
    }
    return [high, low]
}

// Use [Open, Close] for precision detection
static preSampler(x) => [x[1], x[4]]

// Map data item to OHLC (for candle magnets etc.)
ohlc(x) => [x[1], x[2], x[3], x[4]]

// Price label + Scale symbol + price line
valueTracker(x) => {
    show: $props.showValueTracker,
    symbol: $props.scaleSymbol,
    line: $props.priceLine,
    color: $lib.candleColor($props, $core.data[$core.data.length - 1]),
    value: x[4] // close
}

// Define the OHLCV legend
legendHtml(x, prec, f) {
    let color1 = $core.colors.text
    let v = $core.cursor.getValue($core.paneId, $core.id)
    let sym = $props.currencySymbol
    let color2 = v[4] >= v[1] ?
        $props.colorBodyUp : $props.colorBodyDw
    if ($props.coloringBodies && x[6]) {
        color2 = x[6]
    }
    let fc = $lib.formatCash
    return \`
    <span style="color: \${color2}">
        <span style="margin-left: 3px;"></span>
        <span style="color: \${color1}">O</span>
        <span class="nvjs-ll-value">\${f(x[1])}</span>
        <span style="color: \${color1}">H</span>
        <span class="nvjs-ll-value">\${f(x[2])}</span>
        <span style="color: \${color1}">L</span>
        <span class="nvjs-ll-value">\${f(x[3])}</span>
        <span style="color: \${color1}">C</span>
        <span class="nvjs-ll-value">\${f(x[4])}</span>
    \`
    + ($props.showVolume ? \`
        <span style="color: \${color1}">V</span>
        <span class="nvjs-ll-value">\${sym+fc(x[5])}</span>\` : \`\`)
    + \`</span>\`
    }
`;
  const __vite_glob_0_3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: CandlesPlus
  }, Symbol.toStringTag, { value: "Module" }));
  const Cloud = "// Navy ~ 0.2-lite\n\n// <ds>Cloud</ds>, format [<timestamp>, <line1>, <line2>]\n[OVERLAY name=Cloud, ctx=Canvas, verion=0.1.0]\n\n// Overlay props\nprop('color1', { type: 'color', def: '#55d7b0aa' })\nprop('color2', { type: 'color', def: '#d94d64aa' })\nprop('back1', { type: 'color', def: '#79ffde22' })\nprop('back2', { type: 'color', def: '#ff246c22' })\nprop('drawLines', { type: 'boolean', def: false })\n\n// Draw call\n// TODO: speed-up (draw segment with the same color together)\ndraw(ctx) {\n\n    const layout = $core.layout\n    const data = $core.data\n    const view = $core.view\n\n    ctx.lineWidth = 1\n\n    for (var i = view.i1, n = view.i2; i <= n; i++) {\n        let p1 = map(layout, data[i], i)\n        let p2 = map(layout, data[i+1], i+1)\n\n        if (!p2) continue\n        if (p1.y1 !== p1.y1) continue // Fix NaN\n\n         // Background\n        ctx.beginPath()\n        ctx.fillStyle =  p1.y1 < p1.y2 ? $props.back1 : $props.back2\n        ctx.moveTo(p1.x, p1.y1)\n        ctx.lineTo(p2.x + 0.1, p2.y1)\n        ctx.lineTo(p2.x + 0.1, p2.y2)\n        ctx.lineTo(p1.x, p1.y2)\n        ctx.fill()\n        // Lines\n        if (!$props.drawLines) continue\n        ctx.beginPath()\n        ctx.strokeStyle = $props.color1\n        ctx.moveTo(p1.x, p1.y1)\n        ctx.lineTo(p2.x, p2.y1)\n        ctx.stroke()\n        ctx.beginPath()\n        ctx.strokeStyle = $props.color2\n        ctx.moveTo(p1.x, p1.y2)\n        ctx.lineTo(p2.x, p2.y2)\n        ctx.stroke()\n    }\n}\n\nmap(layout, p, i) {\n    return p && {\n        x:  layout.ti2x(p[0], i),\n        y1: layout.value2y(p[1]),\n        y2: layout.value2y(p[2])\n    }\n}\n\n// Legend, defined as pairs [value, color]\nlegend(x) => [[x[1], $props.color1], [x[2], $props.color2]]\n";
  const __vite_glob_0_4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Cloud
  }, Symbol.toStringTag, { value: "Module" }));
  const Histogram = `// Navy ~ 0.2-lite

// <ds>Colored histogram, can be used for MACD</ds>
// Format: [<timestamp>, <hist>, <?value>, <?signal>]
// <hist> :: histogram value (e.g. MACD bars)
// <?value> :: value of the first line (e.g. MACD value)
// <?signal> :: value of the second line (e.g. MACD signal)

[OVERLAY name=Histogram, ctx=Canvas, verion=1.0.1]
// "#35a776", "#79e0b3", "#e54150", "#ea969e"
// Overlay props
prop('barWidth', { type: 'number', def: 4 })
prop('lineWidth', { type: 'number', def: 1 })
prop('colorUp', { type: 'Color', def: '#35a776' })
prop('colorDw', { type: 'Color', def: '#e54150' })
prop('colorSemiUp', { type: 'Color', def: '#79e0b3' })
prop('colorSemiDw', { type: 'Color', def: '#ea969e' })
prop('colorValue', { type: 'Color', def: '#3782f2' })
prop('colorSignal', { type: 'Color', def: '#f48709' })

// Draw call
draw(ctx) {

    const layout = $core.layout
    const view = $core.view

    let groups = splitBars(view, layout, view.src)

    ctx.lineWidth = detectBarWidth(view, layout, view.src)

    // Semi-down

    ctx.strokeStyle = $props.colorSemiDw
    drawBars(ctx, layout, groups.semiDw)

    // Semi-up
    ctx.strokeStyle = $props.colorSemiUp
    drawBars(ctx, layout, groups.semiUp)

    // Down
    ctx.strokeStyle = $props.colorDw
    drawBars(ctx, layout, groups.dw)

    // Up
    ctx.strokeStyle = $props.colorUp
    drawBars(ctx, layout, groups.up)

    // Drawing the lines
    ctx.lineWidth = $props.lineWidth
    ctx.lineJoin = "round"

    ctx.strokeStyle = $props.colorValue
    drawSpline(ctx, view, layout, 2)

    ctx.strokeStyle = $props.colorSignal
    drawSpline(ctx, view, layout, 3)

}

detectBarWidth(view, layout, data) {
    if (!data[view.i2 - 1]) return 0
    let p1 = layout.ti2x(data[view.i2 - 1][0], view.i2 - 1)
    let p2 = layout.ti2x(data[view.i2][0], view.i2)
    if ((p2 - p1) < 1) {
        return 1
    } else {
        return $props.barWidth
    }
}

splitBars(view, layout, data) {
    const off = $props.barWidth % 2 ? 0 : 0.5
    let semiDw = []
    let semiUp = []
    let dw = []
    let up = []
    for (var i = view.i1, n = view.i2; i <= n; i++) {
        let prev = data[i - 1]
        let p = data[i]
        let x = layout.ti2x(p[0], i) - off
        let y = layout.value2y(p[1]) - 0.5
        let bar = {x, y}
        if (p[1] >= 0) {
            var color = 0
            if (prev && p[1] < prev[1]) color = 1
        } else {
            var color = 2
            if (prev && p[1] > prev[1]) color = 3
        }
        switch(color) {
            case 0:
                up.push(bar)
                break
            case 1:
                semiUp.push(bar)
                break
            case 2:
                dw.push(bar)
                break
            case 3:
                semiDw.push(bar)
                break
        }
    }
    return { semiDw, semiUp, dw, up }
}

drawBars(ctx, layout, group) {
    const data = $core.data
    const base = layout.value2y(0) + 0.5
    ctx.beginPath()
    for (var bar of group) {
        ctx.moveTo(bar.x, base)
        ctx.lineTo(bar.x, bar.y)
    }
    ctx.stroke()
}

drawSpline(ctx, view, layout, idx) {
    ctx.beginPath()
    const data = view.src
    for (var i = view.i1, n = view.i2; i <= n; i++) {
        let p = data[i]
        let x = layout.ti2x(p[0], i)
        let y = layout.value2y(p[idx])
        ctx.lineTo(x, y)
    }
    ctx.stroke()
}

// Legend, defined as pairs [value, color]
// TODO: colorize the hist point
legend(x) => [
    [x[1], $props.color],
    [x[2], $props.colorValue],
    [x[3], $props.colorSignal]
]
`;
  const __vite_glob_0_5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Histogram
  }, Symbol.toStringTag, { value: "Module" }));
  const PriceLabels = `// Navy ~ 0.2-lite

// <ds>Price labels that stick to candles</ds>
// Format: [<timestamp>, <LabelObject>]
// <LabelObject> {
//   text :: string, text of the label
//   dir :: direction, 1 = points up, -1 = points down
//   pin :: "open" | "high" | "low" | "close"
//   ?color :: color, text color
//   ?back :: color, background
//   ?stroke :: stroke color
//   ?offset, px, offest from the pin
// }

[OVERLAY name=PriceLabels, ctx=Canvas, verion=1.0.0]

// Overlay props
prop('color', { type: 'Color', def: $core.colors.text })
prop('back', { type: 'Color', def: $core.colors.back })
prop('stroke', { type: 'Color', def: $core.colors.scale })
prop('borderRadius', { type: 'number', def: 3 })
prop('offset', { type: 'number', def: 5 })

const PINMAP = {
    open: 0,
    high: 1,
    low: 2,
    close: 3
}

// Draw call
draw(ctx) {
    const layout = $core.layout
    const view = $core.view
    const data = $core.data

    ctx.font = $core.props.config.FONT

    let items = calcItems(ctx, layout, view, data)

    // Draw items
    ctx.lineWidth = 1
    ctx.textAlign = 'center'
    for (var item of items) {
        let off = (item.o ?? $props.offset) * item.dir
        let dy = (item.dir > 0 ? 19 : -11)
        item.y += off
        ctx.strokeStyle = item.s || $props.stroke
        ctx.fillStyle = item.b || $props.back
        ctx.beginPath()
        drawBody(ctx, item)
        ctx.stroke()
        ctx.fill()
        ctx.fillStyle = item.c || $props.color
        ctx.fillText(item.text, item.x, item.y + dy)
    }
}

calcItems(ctx, layout, view, data) {

    let items = []
    for (var i = view.i1, n = view.i2; i <= n; i++) {
        let p = data[i]
        let specs = p[1]
        let ohlc = layout.ohlc(p[0])
        if (!ohlc) continue
        let x = layout.ti2x(p[0], i)
        let y = layout.value2y(ohlc[PINMAP[specs.pin]])
        let w = ctx.measureText(specs.text).width
        let h = 20
        let dir = specs.dir
        items.push({
            x, y, w, h, dir,
            c: specs.color,
            b: specs.back,
            s: specs.stroke,
            o: specs.offset,
            text: specs.text})
    }
    return items
}

drawBody(ctx, item) {
    let r = $props.borderRadius
    let hw = item.w // half width
    let d = - item.dir
    let x = item.x
    let y = item.y
    ctx.moveTo(x, y)
    ctx.lineTo(x + 5, y - 5 * d)
    ctx.lineTo(x + hw - r, y - 5 * d)
    ctx.quadraticCurveTo(x + hw, y - 5 * d, x + hw, y - (5 + r) * d)
    ctx.lineTo(x + hw, y - (5 + item.h - r) * d)
    ctx.quadraticCurveTo(x + hw, y - (5 + item.h) * d, x + hw - r, y - (5 + item.h) * d)
    ctx.lineTo(x - hw + r, y - (5 + item.h) * d)
    ctx.quadraticCurveTo(x - hw, y - (5 + item.h) * d, x - hw, y - (5 + item.h - r) * d)
    ctx.lineTo(x - hw, y - (5 + r) * d)
    ctx.quadraticCurveTo(x - hw, y - 5 * d, x - hw + r, y - 5 * d)
    ctx.lineTo(x - 5, y - 5 * d)
    ctx.lineTo(x, y)
}

// Legend, defined as pairs [value, color]
legend(x) => [[x[1].text, x[1].color || $props.color]]
`;
  const __vite_glob_0_6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: PriceLabels
  }, Symbol.toStringTag, { value: "Module" }));
  const Range = `// Navy ~ 0.2-lite

// <ds>Ranging indicator, e.g. RSI</ds>
// Format: [<timestamp>, <value>]

[OVERLAY name=Range, ctx=Canvas, verion=1.0.1]

// Overlay props
prop('color', { type: 'Color', def: '#ec206e' })
prop('backColor', { type: 'Color', def: '#381e9c16' })
prop('bandColor', { type: 'Color', def: '#535559' })
prop('lineWidth', { type: 'number', def: 1 })
prop('upperBand', { type: 'number', def: 70 })
prop('lowerBand', { type: 'number', def: 30 })

// Draw call
draw(ctx) {
    const layout = $core.layout
    const upper = layout.value2y($props.upperBand)
    const lower = layout.value2y($props.lowerBand)
    const data = $core.data
    const view = $core.view
    // RSI values
    ctx.lineWidth = $props.lineWidth
    ctx.lineJoin = "round"
    ctx.strokeStyle = $props.color
    ctx.beginPath()
    for (var i = view.i1, n = view.i2; i <= n; i++) {
        let p = data[i]
        let x = layout.ti2x(p[0], i)
        let y = layout.value2y(p[1])
        ctx.lineTo(x, y)
    }
    ctx.stroke()
    ctx.strokeStyle = $props.bandColor
    ctx.setLineDash([5]) // Will be removed after draw()
    ctx.beginPath()
    // Fill the area between the bands
    ctx.fillStyle = $props.backColor
    ctx.fillRect(0, upper, layout.width, lower - upper)
    // Upper band
    ctx.moveTo(0, upper)
    ctx.lineTo(layout.width, upper)
    // Lower band
    ctx.moveTo(0, lower)
    ctx.lineTo(layout.width, lower)
    ctx.stroke()
}

yRange(data, hi, lo) => [
    Math.max(hi, $props.upperBand),
    Math.min(lo, $props.lowerBand)
]

// Legend, defined as pairs [value, color]
legend(x) => [[x[1], $props.color]]
`;
  const __vite_glob_0_7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Range
  }, Symbol.toStringTag, { value: "Module" }));
  const Sparse = "// Navy ~ 0.2-lite\n\n// <ds>Sparse data: points, squares, crosses, triangles</ds>\n// Format: [<timestamp>, <value>, <?direction>]\n// <value> :: Price/value\n// <?direction> :: Triangle direction: 1 | -1\n\n[OVERLAY name=Sparse, ctx=Canvas, verion=1.0.0]\n\n// Overlay props\nprop('color', { type: 'Color', def: '#898989' })\nprop('size', { type: 'number', def: 3 })\nprop('shape', {\n    type: 'string',\n    def: 'point',\n    options: ['point', 'square', 'cross', 'triangle']\n})\n\n// Draw call\ndraw(ctx) {\n    const layout = $core.layout\n    const view = $core.view\n\n    ctx.fillStyle = $props.color\n    ctx.strokeStyle = $props.color\n\n    switch($props.shape) {\n        case 'point':\n            drawArcs(ctx, view, layout)\n        break\n        case 'square':\n            drawSquares(ctx, view, layout)\n        break\n        case 'cross':\n            drawCrosses(ctx, view, layout)\n        break\n        case 'triangle':\n            drawTriandles(ctx, view, layout)\n        break\n    }\n}\n\ndrawArcs(ctx, view, layout) {\n    const radius = $props.size\n    const data = view.src\n    ctx.beginPath()\n    for (var i = view.i1, n = view.i2; i <= n; i++) {\n        let p = data[i]\n        let x = layout.ti2x(p[0], i)\n        let y = layout.value2y(p[1])\n        ctx.moveTo(x+radius, y)\n        ctx.arc(x, y, radius, 0, Math.PI * 2, false)\n    }\n    ctx.fill()\n}\n\ndrawSquares(ctx, view, layout) {\n    const half = $props.size\n    const side = half * 2\n    const data = view.src\n    ctx.beginPath()\n    for (var i = view.i1, n = view.i2; i <= n; i++) {\n        let p = data[i]\n        let x = layout.ti2x(p[0], i)\n        let y = layout.value2y(p[1])\n        ctx.moveTo(x-half, y-half)\n        ctx.lineTo(x+half, y-half)\n        ctx.lineTo(x+half, y+half)\n        ctx.lineTo(x-half, y+half)\n    }\n    ctx.fill()\n}\n\ndrawCrosses(ctx, view, layout) {\n    const half = $props.size\n    const side = half * 2\n    const data = view.src\n    ctx.lineWidth = Math.max(half - 1, 1)\n    ctx.beginPath()\n    for (var i = view.i1, n = view.i2; i <= n; i++) {\n        let p = data[i]\n        let x = layout.ti2x(p[0], i)\n        let y = layout.value2y(p[1])\n        ctx.moveTo(x-half, y)\n        ctx.lineTo(x+half, y)\n        ctx.moveTo(x, y-half)\n        ctx.lineTo(x, y+half)\n    }\n    ctx.stroke()\n}\n\ndrawTriandles(ctx, view, layout) {\n    const half = $props.size\n    const side = half * 2\n    const data = view.src\n    ctx.beginPath()\n    for (var i = view.i1, n = view.i2; i <= n; i++) {\n        let p = data[i]\n        let x = layout.ti2x(p[0], i)\n        let y = layout.value2y(p[1])\n        let dir = p[2] ?? 1\n        ctx.moveTo(x, y)\n        ctx.lineTo(x + side * dir * 0.63, y + side * dir)\n        ctx.lineTo(x - side * dir * 0.63, y + side * dir)\n    }\n    ctx.fill()\n}\n\nstatic yRange(data) {\n    let len = data.length\n    var h, l, high = -Infinity, low = Infinity\n    for(var i = 0; i < len; i++) {\n        let point = data[i][1]\n        if (point > high) high = point\n        if (point < low) low = point\n    }\n    return [high, low]\n}\n\nstatic preSampler(x) => [x[1]]\n\n// Legend, defined as pairs [value, color]\nlegend(x) => [[Math.random(), $props.color]]\n";
  const __vite_glob_0_8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Sparse
  }, Symbol.toStringTag, { value: "Module" }));
  const Splines = `
// NavyJS ~ 0.2-lite

// <ds>Multiple splines</ds> 
// Format: [<timestamp>, <line1>, <line2>, ...]

[OVERLAY name=Splines, ctx=Canvas, version=1.0.0]

prop('lineWidth', { type: 'number', def: 1 })
prop('widths', { type: 'Array', def: [] })
prop('colors', { type: 'Array', def: [] })
prop('skipNan', { type: 'boolean', def: false })

const COLORS = $props.colors.length ? $props.colors : [
    '#53c153', '#d1c045', '#d37734', '#d63953', '#c43cb9',
    '#6c3cc4', '#444bc9', '#44c2c9', '#44c98d'
]
draw(ctx) {

    let num = ($core.data[0] || []).length ?? 0
    for (var i = 0; i < num; i++) {
        let _i = i % COLORS.length
        ctx.strokeStyle = COLORS[_i]
        ctx.lineJoin = "round"
        ctx.lineWidth = $props.widths[i] || $props.lineWidth
        ctx.beginPath()
        drawSpline(ctx, i)
        ctx.stroke()
    }

}

drawSpline(ctx, idx) {
    const layout = $core.layout
    const data = $core.data
    const view = $core.view
    if (!this.skipNan) {
        for (var i = view.i1, n = view.i2; i <= n; i++) {
            let p = data[i]
            let x = layout.ti2x(p[0], i)
            let y = layout.value2y(p[idx + 1])
            ctx.lineTo(x, y)
        }
    } else {
        var skip = false
        for (var i = view.i1, n = view.i2; i <= n; i++) {
            let p = data[i]
            let x = layout.ti2x(p[0], i)
            let y = layout.value2y(p[idx + 1])
            if (p[idx + 1] == null || y !== y) {
                skip = true
            } else {
                if (skip) ctx.moveTo(x, y)
                ctx.lineTo(x, y)
                skip = false
            }
        }
    }
}

// Legend, defined as pairs [value, color]
legend(x) => x.slice(1) // remove time
    .map((v, i) => [ // map value => color
        v, COLORS[i % COLORS.length]
    ])
`;
  const __vite_glob_0_9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Splines
  }, Symbol.toStringTag, { value: "Module" }));
  const SuperBands = "// Navy ~ 0.2-lite\n\n// <ds>Two bands: above and below the price (like LuxAlgo Reverse Zones)</ds>\n// Format: [<timestamp>, <high1>, <mid1>, <low1>, <high2>, <mid2>, <low2>]\n/*\n--- <high1> ---\n--- <mid1> ---\n--- <low1> ---\n~~~ price ~~~\n--- <high2> ---\n--- <mid2> ---\n--- <low2> ---\n*/\n\n[OVERLAY name=SuperBands, ctx=Canvas, verion=1.0.0]\n\n// Overlay props\nprop('color1', { type: 'color', def: '#d80d3848' })\nprop('color1dark', { type: 'color', def: '#d80d3824' })\nprop('color2', { type: 'color', def: '#1edbbe33' })\nprop('color2dark', { type: 'color', def: '#1edbbe15' })\n\n// Draw call\ndraw(ctx) {\n    const view = $core.view\n    const layout = $core.layout\n\n    ctx.fillStyle = $props.color1\n    drawBand(ctx, layout, view, 1, 2)\n\n    ctx.fillStyle = $props.color1dark\n    drawBand(ctx, layout, view, 2, 3)\n\n    ctx.fillStyle = $props.color2dark\n    drawBand(ctx, layout, view, 4, 5)\n\n    ctx.fillStyle = $props.color2\n    drawBand(ctx, layout, view, 5, 6)\n\n}\n\n\ndrawBand(ctx, layout, view, i1, i2) {\n    let data = $core.view.src\n    ctx.beginPath()\n    for (var i = view.i1, n = view.i2; i <= n; i++) {\n        let p = data[i]\n        let x = layout.ti2x(p[0], i)\n        let y = layout.value2y(p[i1] || undefined)\n        ctx.lineTo(x, y)\n    }\n    for (var i = view.i2, i1 = view.i1; i >= i1; i--) {\n        let p = data[i]\n        let x = layout.ti2x(p[0], i)\n        let y = layout.value2y(p[i2] || undefined)\n        ctx.lineTo(x, y)\n    }\n    ctx.fill()\n}\n\n// Legend, defined as pairs [value, color]\nlegend(x) => [\n    [x[1], $props.color1], [x[2], $props.color1], [x[3], $props.color1],\n    [x[4], $props.color2], [x[5], $props.color2], [x[6], $props.color2]\n]\n";
  const __vite_glob_0_10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: SuperBands
  }, Symbol.toStringTag, { value: "Module" }));
  const Trades = "\n// Navy ~ 0.2-lite\n\n// <ds>Simple trades</ds>\n// Format: [<timestamp>, <dir>, <price>, <?label>]\n// <dir> :: 1 for buy -1 for sell\n// <price> :: trade price\n// <?label> :: trade label\n[OVERLAY name=Trades, ctx=Canvas, version=1.0.0]\n\nprop('buyColor', {  type: 'color', def: '#08b2c6' })\nprop('sellColor', {  type: 'color', def: '#e42633' })\nprop('radius', {  type: 'number', def: 4 })\nprop('showLabels', {  type: 'boolean', def: true })\nprop('markerOutline', {  type: 'boolean', def: true })\nprop('outlineWidth', {  type: 'number', def: 4 })\n\n// Draw function (called on each update)\n// Library provides a lot of useful variables to make\n// overlays ($core in the main collection)\ndraw(ctx) {\n    ctx.lineWidth = $props.outlineWidth\n    const layout = $core.layout\n    const data = $core.data // Full dataset\n    const view = $core.view // Visible view\n\n    // Outline\n    if ($props.markerOutline) {\n        ctx.strokeStyle = $core.colors.back\n        ctx.beginPath()\n        iterArcs(ctx, view, data, layout)\n        ctx.stroke()\n    }\n\n    // Fill sell trades\n    ctx.fillStyle = $props.buyColor\n    ctx.beginPath()\n    iterArcs(ctx, view, data, layout, -1)\n    ctx.fill()\n\n    // Fill buy trades\n    ctx.fillStyle = $props.sellColor\n    ctx.beginPath()\n    iterArcs(ctx, view, data, layout, 1)\n    ctx.fill()\n\n    // Draw labels\n    if ($props.showLabels) {\n        ctx.fillStyle = $core.colors.textHL\n        ctx.font = $core.props.config.FONT\n        ctx.textAlign = 'center'\n        drawLabels(ctx, view, data, layout)\n    }\n\n}\n\n// Iter through arcs\niterArcs(ctx, view, data, layout, dir) {\n    const radius = $props.radius\n    for (var i = view.i1, n = view.i2; i <= n; i++) {\n        let p = data[i]\n        if (Math.sign(p[1]) === dir) continue\n        let x = layout.ti2x(p[0], i)\n        let y = layout.value2y(p[2])\n        ctx.moveTo(x+radius, y)\n        ctx.arc(x, y, radius, 0, Math.PI * 2, false)\n    }\n}\n\n// Draw simple lables\ndrawLabels(ctx, view, data, layout) {\n    for (var i = view.i1, n = view.i2; i <= n; i++) {\n        let p = data[i]\n        let x = layout.ti2x(p[0], i)\n        let y = layout.value2y(p[2])\n        ctx.fillText(p[3], x, y - 25)\n    }\n}\n\n// Sample data point with index 2\nstatic preSampler(x) => x[2]\n\n// Not affecting the y-range\nstatic yRange() => null\n\n// Legend formatter, Array of [value, color] pairs\n// x represents one data item e.g. [<time>, <value>]\nlegend(x) {\n    if (x[1] > 0) {\n        return [\n            ['Buy', $props.buyColor],\n            [x[2], $core.colors.text],\n            [x[3]]\n        ]\n    } else {\n        return [\n            ['Sell', $props.sellColor],\n            [x[2], $core.colors.text],\n            [x[3]]\n        ]\n    }\n}\n";
  const __vite_glob_0_11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Trades
  }, Symbol.toStringTag, { value: "Module" }));
  const Volume = "// Navy ~ 0.2-lite\n\n// <ds>Regular volume</ds> \n// Format: [<timestamp>, <volume>, <direction>]\n// <direction> :: 1 for green volume, - 1 for red volume\n\n[OVERLAY name=Volume, ctx=Canvas, verion=1.0.0]\n\n// Overlay props\nprop('colorVolUp', { type: 'color', def: '#41a37682' })\nprop('colorVolDw', { type: 'color', def: '#de464682' })\nprop('barsHeight', { type: 'number', def: 0.15, step: 0.1 })\nprop('currencySymbol', { type: 'string', def: '$' })\nprop('showAvgVolume', { type: 'boolean', def: true })\nprop('avgVolumeSMA', { type: 'number', def: 20 })\nprop('colorAvgVol', { type: 'color', def: '#17e2bb99'})\n\n// Draw call\ndraw(ctx) {\n\n    let height = $core.id === 0 ? 0.8 : $props.barsHeight\n    let cnv = $lib.layoutCnv($core, false, true, 1, 2, height)\n    let bars = cnv.upVolbars.length ? cnv.upVolbars : cnv.dwVolbars\n    if (!bars.length) return\n\n    drawCvPart(ctx, $lib.volumeBar, cnv.dwVolbars, 'colorVolDw')\n    drawCvPart(ctx, $lib.volumeBar, cnv.upVolbars, 'colorVolUp')\n\n    if ($props.showAvgVolume) $lib.avgVolume(ctx, $core, $props, cnv, 1)\n}\n\n// Draw candle part\ndrawCvPart(ctx, f, arr, color) {\n    let layout = $core.layout\n    ctx.strokeStyle = $props[color]\n    ctx.beginPath()\n    for (var i = 0, n = arr.length; i < n; i++) {\n        f(ctx, arr[i], layout)\n    }\n    ctx.stroke()\n}\n\n// Custom y-range\nyRange(data, hi, lo) {\n    // Remove this overlay for yRange calculation\n    // if it's not the main overlay of the pane\n    if ($core.id !== 0) {\n        return null\n    } else {\n        return [hi, lo, false]\n    }\n}\n\n// Legend, defined as pairs [value, color]\nlegend(x) {\n    let v = $core.cursor.getValue($core.paneId, $core.id)\n    let sym = $props.currencySymbol\n    let color = v[2] > 0 ?\n        $props.colorVolUp : $props.colorVolDw\n    let fc = $lib.formatCash\n    return [[sym + fc(x[1]), color.slice(0, 7)]]\n}\n";
  const __vite_glob_0_12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Volume
  }, Symbol.toStringTag, { value: "Module" }));
  const VolumeDelta = `// Navy ~ 0.2-lite

// <ds>Volume bars with delta ( = buyVol - sellVol)</ds>
// Format: [<timestamp>, <buyVol>, <sellVol>, <total>, <delta>]

[OVERLAY name=VolumeDelta, ctx=Canvas, verion=1.0.0]

// Overlay props
prop('colorVolUp', { type: 'color', def: '#41a37682' })
prop('colorVolDw', { type: 'color', def: '#de464682' })
prop('colorVolDeltaUp', { type: 'color', def: '#41a376' })
prop('colorVolDeltaDw', { type: 'color', def: '#de4646' })
prop('barsHeight', { type: 'number', def: 0.15, step: 0.1 })

// Draw call
draw(ctx) {

    let height = $core.id === 0 ? 0.8 : $props.barsHeight
    let cnv = $lib.layoutCnv($core, false, true, 1, 4, height)
    let bars = cnv.upVolbars.length ? cnv.upVolbars : cnv.dwVolbars
    if (!bars.length) return

    drawCvPart(ctx, $lib.volumeBar, cnv.dwVolbars, 'colorVolDw')
    drawCvPart(ctx, $lib.volumeBar, cnv.upVolbars, 'colorVolUp')

    let dwDelta = makeDelta(cnv.dwVolbars)
    let upDelta = makeDelta(cnv.upVolbars)

    drawCvPart(ctx, $lib.volumeBar, dwDelta, 'colorVolDeltaDw')
    drawCvPart(ctx, $lib.volumeBar, upDelta, 'colorVolDeltaUp')

}

// Draw candle part
drawCvPart(ctx, f, arr, color) {
    let layout = $core.layout
    ctx.strokeStyle = $props[color]
    ctx.beginPath()
    for (var i = 0, n = arr.length; i < n; i++) {
        f(ctx, arr[i], layout)
    }
    ctx.stroke()
}

makeDelta(bars) {
    let delta = []
    for (var bar of bars) {
        let src = bar.src
        let k = Math.abs(src[4]) / src[3]
        bar.h =  bar.h * k
        delta.push(bar)
    }
    return delta
}

// Custom y-range
yRange(data, hi, lo) {
    // Remove this overlay for yRange calculation
    // if it's not the main overlay of the pane
    if ($core.id !== 0) {
        return null
    } else {
        return [hi, lo, false]
    }
}

// Legend, defined as pairs [value, color]
legendHtml(x) {
    let v = $core.cursor.getValue($core.paneId, $core.id)
    let sym = $props.currencySymbol
    let color1 = $core.colors.text
    let color2 = v[4] > 0 ?
        $props.colorVolDeltaUp : $props.colorVolDeltaDw
    let fc = $lib.formatCash
    let sign = v[4] > 0 ? '+' : ''
    return \`
    <span style="color: \${color2}">
        <span style="margin-left: 3px;"></span>
        <span style="color: \${color1}">B</span>
        <span class="nvjs-ll-value">\${fc(x[1])}</span>
        <span style="color: \${color1}">S</span>
        <span class="nvjs-ll-value">\${fc(x[2])}</span>
        <span style="color: \${color1}">Σ</span>
        <span class="nvjs-ll-value">\${fc(x[3])}</span>
        <span style="color: \${color1}">Δ</span>
        <span class="nvjs-ll-value">\${sign}\${fc(x[4])}</span>
    \`
    //return [[sym + fc(x[1]), color.slice(0, 7)]]
}
`;
  const __vite_glob_0_13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: VolumeDelta
  }, Symbol.toStringTag, { value: "Module" }));
  const area = `
// NavyJS ~ 0.2-lite

// <ds>Area chart</ds>, format: [<timestamp>, <value>]

[OVERLAY name=Area, ctx=Canvas, version=1.0.0]

// Define new props
prop('color', { type: 'color', def: '#31ce31' })
prop('lineWidth', { type: 'number', def: 1.25 })
prop('back1', { type: 'color', def: $props.color + '15' })
prop('back2', { type: 'color', def: $props.color + '01' })
prop('dataIndex', { type: 'integer', def: 1 })

draw(ctx) {
   
    const layout = $core.layout
    const data = $core.data // Full dataset
    const view = $core.view // Visible view
    const idx = $props.dataIndex
    const grd = ctx.createLinearGradient(0, 0, 0, layout.height)
    grd.addColorStop(0, $props.back1)
    grd.addColorStop(1, $props.back2)

    // Line
    ctx.lineWidth = $props.lineWidth
    ctx.strokeStyle = $props.color
    ctx.lineJoin = "round"
    ctx.beginPath()
    for (var i = view.i1, n = view.i2; i <= n; i++) {
        let p = data[i]
        let x = layout.ti2x(p[0], i)
        let y = layout.value2y(p[idx])
        ctx.lineTo(x, y)
    }
    ctx.stroke()

    // Area
    ctx.fillStyle = grd
    ctx.beginPath()
    let p0 = (data[0] || [])[0]
    let pN = (data[data.length - 1] || [])[0]
    ctx.lineTo(layout.ti2x(p0, 0), layout.height)
    for (var i = view.i1, n = view.i2; i <= n; i++) {
        let p = data[i]
        let x = layout.ti2x(p[0], i)
        let y = layout.value2y(p[idx])
        ctx.lineTo(x, y)
    }
    ctx.lineTo(layout.ti2x(pN, i - 1), layout.height)
    ctx.fill()

}

// Precision sampling
preSampler(x) => [x[$props.dataIndex]]

// Map data item to OHLC (for candle magnets etc.)
// Here we simulate a candle with 0 height
ohlc(x) => Array(4).fill(x[$props.dataIndex])

// Legend, defined as pairs [value, color]
yRange(data) {
    let di = $props.dataIndex
    let len = data.length
    var h, l, high = -Infinity, low = Infinity
    for(var i = 0; i < len; i++) {
        let point = data[i][di]
        if (point > high) high = point
        if (point < low) low = point
    }
    return [high, low]
}

// Legend, defined as pairs [value, color]
legend(x) => [[x[$props.dataIndex], $props.color]]
`;
  const __vite_glob_0_14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: area
  }, Symbol.toStringTag, { value: "Module" }));
  const candles = `
// NavyJS ~ 0.2-lite

// <ds>Standart japanese candles</ds>, format:
// [<timestamp>, <open>, <high>, <low>, <close>, <?volume>]

[OVERLAY name=Candles, ctx=Canvas, version=1.0.0]

// Define the props
prop('colorBodyUp', { type: 'color', def: $core.colors.candleUp })
prop('colorBodyDw', { type: 'color', def: $core.colors.candleDw })
prop('colorWickUp', { type: 'color', def: $core.colors.wickUp })
prop('colorWickDw', { type: 'color', def: $core.colors.wickDw })
prop('colorVolUp', { type: 'color', def: $core.colors.volUp })
prop('colorVolDw', { type: 'color', def: $core.colors.volDw })
prop('showVolume', { type: 'boolean', def: true })
prop('currencySymbol', { type: 'string', def: '$' })
prop('showAvgVolume', { type: 'boolean', def: true })
prop('avgVolumeSMA', { type: 'number', def: 20 })
prop('colorAvgVol', { type: 'color', def: '#1cccb777'})
prop('scaleSymbol', { type: 'string|boolean', def: false })
prop('priceLine', { type: 'boolean', def: true })
prop('showValueTracker', { type: 'boolean', def: true })


// Draw call
draw(ctx) {

    let cnv = $lib.layoutCnv($core, true, $props.showVolume)
    let bodies = cnv.upBodies.length ? cnv.upBodies : cnv.dwBodies
    if (!bodies.length) return
    let w = Math.max(bodies[0].w, 1)

    drawCvPart(ctx, $lib.candleWick, cnv.dwWicks, 1, 'colorWickDw')
    drawCvPart(ctx, $lib.candleWick, cnv.upWicks, 1, 'colorWickUp')
    drawCvPart(ctx, $lib.candleBody, cnv.dwBodies, w, 'colorBodyDw')
    drawCvPart(ctx, $lib.candleBody, cnv.upBodies, w, 'colorBodyUp')
    drawCvPart(ctx, $lib.volumeBar, cnv.dwVolbars, w, 'colorVolDw')
    drawCvPart(ctx, $lib.volumeBar, cnv.upVolbars, w, 'colorVolUp')

    if ($props.showVolume && $props.showAvgVolume) {
        $lib.avgVolume(ctx, $core, $props, cnv)
    }

}

// Draw candle part
drawCvPart(ctx, f, arr, w, color) {
    let layout = $core.layout
    ctx.lineWidth = w
    ctx.strokeStyle = $props[color]
    ctx.beginPath()
    for (var i = 0, n = arr.length; i < n; i++) {
        f(ctx, arr[i], layout)
    }
    ctx.stroke()
}

// Define y-range (by finding max High, min Low)
static yRange(data) {
    let len = data.length
    var h, l, high = -Infinity, low = Infinity
    for(var i = 0; i < len; i++) {
        let point = data[i]
        if (point[2] > high) high = point[2]
        if (point[3] < low) low = point[3]
    }
    return [high, low]
}

// Use [Open, Close] for precision detection
static preSampler(x) => [x[1], x[4]]

// Map data item to OHLC (for candle magnets etc.)
ohlc(x) => [x[1], x[2], x[3], x[4]]

// Price label + Scale symbol + price line
valueTracker(x) => {
    show: $props.showValueTracker,
    symbol: $props.scaleSymbol,
    line: $props.priceLine,
    color: $lib.candleColor($props, $core.data[$core.data.length - 1]),
    value: x[4] // close
}

// Define the OHLCV legend
legendHtml(x, prec, f) {
    let color1 = $core.colors.text
    let v = $core.cursor.getValue($core.paneId, $core.id)
    let sym = $props.currencySymbol
    let color2 = v[4] >= v[1] ?
        $props.colorBodyUp : $props.colorBodyDw
    let fc = $lib.formatCash
    return \`
    <span style="color: \${color2}">
        <span style="margin-left: 3px;"></span>
        <span style="color: \${color1}">O</span>
        <span class="nvjs-ll-value">\${f(x[1])}</span>
        <span style="color: \${color1}">H</span>
        <span class="nvjs-ll-value">\${f(x[2])}</span>
        <span style="color: \${color1}">L</span>
        <span class="nvjs-ll-value">\${f(x[3])}</span>
        <span style="color: \${color1}">C</span>
        <span class="nvjs-ll-value">\${f(x[4])}</span>
    \`
    + ($props.showVolume ? \`
        <span style="color: \${color1}">V</span>
        <span class="nvjs-ll-value">\${sym+fc(x[5])}</span>\` : \`\`)
    + \`</span>\`
    }
`;
  const __vite_glob_0_15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: candles
  }, Symbol.toStringTag, { value: "Module" }));
  const spline = `
// NavyJS ~ 0.2-lite

// <ds>Single spline</ds>
// Format: [<timestamp>, <number>]

[OVERLAY name=Spline, ctx=Canvas, version=1.1.0]

// Define new props
prop('color', { type: 'color', def: '#31ce31' })
prop('lineWidth', { type: 'number', def: 1 })
prop('dataIndex', { type: 'integer', def: 1 })


draw(ctx) {
    ctx.lineWidth = $props.lineWidth
    ctx.lineJoin = "round"
    ctx.strokeStyle = $props.color
    ctx.beginPath()
    const layout = $core.layout
    const data = $core.data // Full dataset
    const view = $core.view // Visible view
    const idx = $props.dataIndex
    for (var i = view.i1, n = view.i2; i <= n; i++) {
        let p = data[i]
        let x = layout.ti2x(p[0], i)
        let y = layout.value2y(p[idx])
        ctx.lineTo(x, y)
    }
    ctx.stroke()
}

// Price label + Scale symbol + price line
/*valueTracker(x) => {
    show: true,
    symbol: $core.src.name,
    line: true,
    color: $props.color,
    value: x[$props.dataIndex]
}*/

preSampler(x) => [x[$props.dataIndex]]

// Map data item to OHLC (for candle magnets etc.)
// Here we simulate a candle with 0 height
ohlc(x) => Array(4).fill(x[$props.dataIndex])

yRange(data) {
    let di = $props.dataIndex
    let len = data.length
    var h, l, high = -Infinity, low = Infinity
    for(var i = 0; i < len; i++) {
        let point = data[i][di]
        if (point > high) high = point
        if (point < low) low = point
    }
    return [high, low]
}

// Legend, defined as pairs [value, color]
legend(x) => [[x[$props.dataIndex], $props.color]]
`;
  const __vite_glob_0_16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: spline
  }, Symbol.toStringTag, { value: "Module" }));
  const LineTool = "// Navy ~ 0.2-lite\n// <ds>Drawing lines [Tap + Hold]</ds>\n\n[OVERLAY name=LineTool, ctx=Canvas, verion=1.0.0]\n\nlet timeId = null\nlet mouseX = 0\nlet lines = {} // Line objects stored by uuid\n\ninit() {\n    // Restore lines from dataExt\n    for (var line of $core.dataExt.lines || []) {\n        lines[line.uuid] = new $lib.TrendLine($core, line)\n        lines[line.uuid].onSelect = lineSelected\n    }\n}\n\ndraw(ctx) {\n    for (var line of Object.values(lines)) {\n        line.draw(ctx)\n    }\n}\n\nnewLine() {\n\n    if (unfinishedLines() || mouseMoved()) return\n\n    if (!$core.dataExt.lines) {\n        $core.dataExt.lines = []\n    }\n\n    let t = $core.cursor.time\n    let $ = $core.layout.y2value($core.cursor.y)\n    let uuid = $lib.Utils.uuid3()\n    \n    let line = {\n        type: 'segment',\n        p1: [t, $],\n        p2: [t, $],\n        uuid: uuid\n    }\n    $core.dataExt.lines.push(line)\n    lines[uuid] = new $lib.TrendLine($core, line, true)\n    lines[uuid].onSelect = lineSelected\n    lines[uuid].selected = true\n\n    $events.emit('scroll-lock', true)\n    $events.emit('update-layout')\n\n}\n\nlineSelected($uuid) {\n    for (var uuid in lines) {\n        lines[uuid].selected = uuid === $uuid\n    }\n    $events.emit('update-layout')\n}\n\nunfinishedLines() {\n    for (var line of Object.values(lines)) {\n        if (line.pins.some(x => x.state !== 'settled')) {\n            return true\n        }\n    }\n    return false\n}\n\nmouseMoved() {\n    let d = Math.abs(mouseX - $core.mouse.x)\n    return d > 5\n}\n\nremoveLine(uuid) {\n    delete lines[uuid]\n    $core.dataExt.lines.filter(x => x.uuid !== uuid)\n    $events.emit('update-layout')\n}\n\npropagate(name, data) {\n    // TODO: sort by z-index\n    for (var line of Object.values(lines)) {\n        line[name](data)\n    }\n} \n\nmousedown(event) {\n    timeId = setTimeout(newLine, 1000)\n    mouseX = $core.mouse.x\n    lineSelected(null)\n    $events.emit('update-layout')\n    propagate('mousedown', event)\n}\n\nmouseup(event) {\n    clearTimeout(timeId)\n    timeId = null\n    propagate('mouseup', event)\n}\n\nmousemove(event) {\n    propagate('mousemove', event)\n}\n\nkeydown(event) {\n    if (event.code === 'Backspace') {\n        let s = Object.values(lines).find(x => x.selected)\n        if (s) removeLine(s.data.uuid)\n    }\n}\n\nlegend() => null";
  const __vite_glob_1_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: LineTool
  }, Symbol.toStringTag, { value: "Module" }));
  const RangeTool = "// Navy ~ 0.2-lite\n// <ds>Time & value measurment tool [Shift+Click]</ds>\n\n[OVERLAY name=RangeTool, ctx=Canvas, verion=1.0.1, author=GPT4]\n\nlet pin1 = null \nlet pin2 = null \nlet shift = false\nlet state = 'idle'\n\n// TODO: fix for index-based\ndraw(ctx) {\n    const layout = $core.layout \n\n    if (pin1 && pin2) {\n        const x1 = layout.time2x(pin1.t) // time to x coordinate\n        const x2 = layout.time2x(pin2.t) // time to x coordinate\n        const y1 = layout.value2y(pin1.v) // value to y coordinate\n        const y2 = layout.value2y(pin2.v) // value to y coordinate\n\n         // change fill color based on percentage\n        let color = percent() >= 0 ? '#3355ff' : '#ff3333';\n        ctx.fillStyle = color + '33';\n        ctx.fillRect(x1, y1, x2 - x1, y2 - y1)\n\n        // draw arrows in the middle of rectangle\n        let midX = (x1 + x2) / 2;\n        let midY = (y1 + y2) / 2;\n        $lib.drawArrow(ctx, midX, y1, midX, y2, color, Math.abs(y2 - y1) > 42); \n        $lib.drawArrow(ctx, x1, midY, x2, midY, color, Math.abs(x2 - x1) > 42);  \n\n        // draw rounded rectangle with text\n        const text1 = `${deltaValue().toFixed(2)} (${percent().toFixed(2)}%)`;\n        const text2 = `${bars()} bars, ${timeText()}`;\n        const text = `${text1}\\n${text2}`;\n        const textWidth = ctx.measureText(text).width;\n        \n        const padding = 10;\n        const mainRectCenterX = (x1 + x2) / 2; // calculate center of the main rectangle\n        const roundRectX = mainRectCenterX - textWidth / 2 - padding; // center the text rectangle relative to the main rectangle\n        const roundRectWidth = textWidth + 2 * padding;\n        const roundRectHeight = 50;  // adjust as needed\n        const roundRectY = percent() > 0 ? Math.min(y1, y2) - roundRectHeight - padding : Math.max(y1, y2) + padding;\n        const roundRectRadius = 5;   // adjust as needed\n        ctx.fillStyle = color + 'cc';\n        $lib.roundRect(ctx, roundRectX, roundRectY, roundRectWidth, roundRectHeight, roundRectRadius);\n\n        // draw text\n        ctx.fillStyle = '#ffffffcc' // color;\n        ctx.font = $lib.rescaleFont($core.props.config.FONT, 14);\n        ctx.textAlign = 'center';\n        ctx.textBaseline = 'middle';\n        ctx.fillText(text1, roundRectX + roundRectWidth / 2, roundRectY + roundRectHeight / 4);\n        ctx.fillText(text2, roundRectX + roundRectWidth / 2, roundRectY + 3 * roundRectHeight / 4);\n      \n    }\n}\n\n// Calculate the percentage of the are between pins v-values\n// assuming that pin2 is above pin1 equals positive value\n// and negative otherwise\npercent() {\n    if (pin1 && pin2) {\n        let delta = pin2.v - pin1.v;\n        return (delta / pin1.v) * 100;\n    }\n    return 0;\n}\n\n// Calculate delta time between pins t-values\n// assuming that pin2 on the right of pin1 equals positive value\n// and negative otherwise\ndeltaTime() {\n    if (pin1 && pin2) {\n        return pin2.t - pin1.t\n    }\n    return 0\n}\n\n// Calculate delta value between pins v-values\n// assuming that pin2 is above pin1 equals positive value\n// and negative otherwise\ndeltaValue() {\n    if (pin1 && pin2) {\n        return pin2.v - pin1.v\n    }\n    return 0\n}\n\n// Delta time in bars\nbars() {\n    let data = $core.hub.mainOv.dataSubset\n    if (pin1 && pin2) {\n        const layout = $core.layout\n        const bars = data.filter(bar => {\n            return bar[0] >= Math.min(pin1.t, pin2.t) && bar[0] <= Math.max(pin1.t, pin2.t)\n        });\n        let count = bars.length - 1; // reduce the count by 1\n        return pin2.t < pin1.t ? -count : count; // make it negative if pin2.t < pin1.t\n    }\n    return 0\n}\n\n// Delta time in text format\ntimeText() {\n    let deltaTimeMs = deltaTime();  // returns delta time in milliseconds\n    let timeFrameMs = $core.props.timeFrame;  // returns current chart timeframe in milliseconds\n\n    let negative = deltaTimeMs < 0;\n    deltaTimeMs = Math.abs(deltaTimeMs);\n\n    let minutes = Math.floor((deltaTimeMs / (1000 * 60)) % 60);\n    let hours = Math.floor((deltaTimeMs / (1000 * 60 * 60)) % 24);\n    let days = Math.floor(deltaTimeMs / (1000 * 60 * 60 * 24));\n\n    let result = \"\";\n    if (days > 0) {\n        result += days + \"d \";\n    }\n    if ((hours > 0 || days > 0) && hours !== 0) {\n        result += hours + \"h \";\n    }\n    if (minutes > 0 && timeFrameMs < 60 * 60 * 1000 && minutes !== 0) {\n        result += minutes + \"m\";\n    }\n\n    return (negative ? '-' : '') + result.trim();\n}\n\n\n\nkeydown(event) {\n    if (event.key === 'Shift') {\n        shift = true\n    }\n}\n\nkeyup(event) {\n    if (event.key === 'Shift') {\n        shift = false\n    }\n}\n\nmousedown(event) {\n    const layout = $core.layout \n    if (state === 'idle' && shift) {\n        // Create the first pin \n        pin1 = {\n            t: $core.cursor.time,\n            v: layout.y2value(event.layerY)\n        }\n        pin2 = { ...pin1 }\n        state = 'drawing'\n    } else if (state === 'drawing') {\n        state = 'finished'\n    } else if (state === 'finished') {\n        state = 'idle'\n        pin1 = null \n        pin2 = null \n    }\n    $events.emitSpec('chart', 'update-layout')\n}\n\nmousemove(event) {\n    if (state === 'drawing') {\n        const layout = $core.layout \n        // Create the second pin \n        pin2 = {\n            t: $core.cursor.time,\n            v: layout.y2value(event.layerY)\n        }\n    }\n}\n\n// Disable legend by returning null\nlegend() => null\n";
  const __vite_glob_1_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: RangeTool
  }, Symbol.toStringTag, { value: "Module" }));
  const ALMA = "\n// Navy ~ 0.2-lite\n// <ds>Arnaud Legoux Moving Average</ds>\n\n[INDICATOR name=ALMA, version=1.0.0]\n\nprop('length', { type: 'integer', def: 10 })\nprop('offset', { type: 'number', def: 0.9 })\nprop('sigma', { type: 'number', def: 5 })\nprop('color', { type: 'color', def: '#559de0' })\nprop('prec', { type: 'integer', def: autoPrec() })\nprop('zIndex', { type: 'integer', def: 0 })\n\nlet $ = $props\n\nthis.specs = {\n    name: `ALMA ${$.length} ${$.offset} ${$.sigma}`,\n    props: {\n        color: $props.color,\n    },\n    settings: {\n        precision: $props.prec,\n        zIndex: $props.zIndex\n    }\n}\n\n[UPDATE]\n\nlet length = $props.length\nlet offset = $props.offset\nlet sigma = $props.sigma\n\nSpline(alma(close, length, offset, sigma), this.specs)\n";
  const __vite_glob_2_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: ALMA
  }, Symbol.toStringTag, { value: "Module" }));
  const ATR = "\n// Navy ~ 0.2-lite\n// <ds>Average True Range</ds>\n\n[INDICATOR name=ATR, version=1.0.0]\n\nprop('length', { type: 'integer', def: 15 })\nprop('color', { type: 'color', def: '#e52468' })\nprop('prec', { type: 'integer', def: autoPrec() })\nprop('zIndex', { type: 'integer', def: 0 })\n\nthis.specs = {\n    name: 'ATR ' + $props.length,\n    props: {\n        color: $props.color\n    },\n    settings: {\n        precision: $props.prec,\n        zIndex: $props.zIndex\n    }\n}\n\n[UPDATE]\n\nSpline(atr($props.length), this.specs)\n";
  const __vite_glob_2_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: ATR
  }, Symbol.toStringTag, { value: "Module" }));
  const ATRp = "\n// Navy ~ 0.2-lite\n// <ds>Average True Range, percentage</ds>\n\n[INDICATOR name=ATRp, version=1.0.0]\n\nprop('length', { type: 'integer', def: 15 })\nprop('color', { type: 'color', def: '#f44336' })\nprop('prec', { type: 'integer', def: autoPrec() })\nprop('zIndex', { type: 'integer', def: 0 })\n\nthis.specs = {\n    name: 'ATR% ' + $props.length,\n    props: {\n        color: $props.color\n    },\n    settings: {\n        precision: $props.prec,\n        zIndex: $props.zIndex\n    }\n}\n\n[UPDATE]\n\nlet k = 100 / close[0]\nSpline(atr($props.length)[0] * k, this.specs)\n";
  const __vite_glob_2_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: ATRp
  }, Symbol.toStringTag, { value: "Module" }));
  const BB = "\n// Navy ~ 0.2-lite\n// <ds>Bollinger Bands</ds>\n\n[INDICATOR name=BB, version=1.0.0]\n\nprop('length', { type: 'integer', def: 21 })\nprop('stddev', { type: 'number', def: 2 })\nprop('color', { type: 'color', def: '#2cc6c9ab' })\nprop('backColor', { type: 'color', def: '#2cc6c90a' })\nprop('prec', { type: 'integer', def: autoPrec() })\nprop('zIndex', { type: 'integer', def: 0 })\n\nthis.specs = {\n    name: `BB ${$props.length} ${$props.stddev}`,\n    props: {\n        color: $props.color,\n        backColor: $props.backColor,\n    },\n    settings: {\n        precision: $props.prec,\n        zIndex: $props.zIndex\n    }\n}\n\n[UPDATE]\n\nlet length = $props.length\nlet stddev = $props.stddev\nlet [m, h, l] = bb(close, length, stddev)\nBand([h[0], m[0], l[0]], this.specs)\n";
  const __vite_glob_2_3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: BB
  }, Symbol.toStringTag, { value: "Module" }));
  const BBW = "\n// Navy ~ 0.2-lite\n// <ds>Bollinger Bands Width</ds>\n\n[INDICATOR name=BBW, version=1.0.0]\n\nprop('length', { type: 'integer', def: 21 })\nprop('stddev', { type: 'number', def: 2 })\nprop('color', { type: 'color', def: '#2cc6c9ab' })\nprop('prec', { type: 'integer', def: autoPrec() })\nprop('zIndex', { type: 'integer', def: 0 })\n\nthis.specs = {\n    name: `BBW ${$props.length} ${$props.stddev}`,\n    props: {\n        color: $props.color,\n        backColor: $props.backColor,\n    },\n    settings: {\n        precision: $props.prec,\n        zIndex: $props.zIndex\n    }\n}\n\n[UPDATE]\n\nlet length = $props.length\nlet stddev = $props.stddev\nSpline(bbw(close, length, stddev), this.specs)\n";
  const __vite_glob_2_4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: BBW
  }, Symbol.toStringTag, { value: "Module" }));
  const CCI = "\n// Navy ~ 0.2-lite\n// <ds>Commodity Channel Index</ds>\n\n[INDICATOR name=CCI, version=1.0.0]\n\nprop('length', { type: 'integer', def: 21 })\nprop('upperBand', { type: 'number', def: 100 })\nprop('lowerBand', { type: 'number', def: -100 })\nprop('color', { type: 'color', def: '#e28a3dee' })\nprop('backColor', { type: 'color', def: '#e28a3d11' })\nprop('bandColor', { type: 'color', def: '#999999' })\nprop('prec', { type: 'integer', def: 2 })\nprop('zIndex', { type: 'integer', def: 0 })\n\nthis.specs = {\n    name: 'CCI ' + $props.length,\n    props: {\n        color: $props.color,\n        backColor: $props.backColor,\n        bandColor: $props.bandColor,\n        upperBand: $props.upperBand,\n        lowerBand: $props.lowerBand,\n    },\n    settings: {\n        precision: $props.prec,\n        zIndex: $props.zIndex\n    }\n}\n\n[UPDATE]\n\nRange(cci(close, $props.length), this.specs)\n";
  const __vite_glob_2_5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: CCI
  }, Symbol.toStringTag, { value: "Module" }));
  const CMO = "\n// Navy ~ 0.2-lite\n// <ds>Chande Momentum Oscillator</ds>\n\n[INDICATOR name=CMO, version=1.0.0]\n\nprop('length', { type: 'integer', def: 10 })\nprop('color', { type: 'color', def: '#559de0' })\nprop('prec', { type: 'integer', def: autoPrec() })\nprop('zIndex', { type: 'integer', def: 0 })\n\nthis.specs = {\n    name: `CMO ${$props.length}`,\n    props: {\n        color: $props.color\n    },\n    settings: {\n        precision: $props.prec,\n        zIndex: $props.zIndex\n    }\n}\n\n[UPDATE]\n\nlet length = $props.length\nSpline(cmo(close, length), this.specs)\n";
  const __vite_glob_2_6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: CMO
  }, Symbol.toStringTag, { value: "Module" }));
  const COG = "\n// Navy ~ 0.2-lite\n// <ds>Center of Gravity</ds>\n\n[INDICATOR name=COG, version=1.0.0]\n\nprop('length', { type: 'integer', def: 10 })\nprop('color', { type: 'color', def: '#559de0' })\nprop('prec', { type: 'integer', def: autoPrec() })\nprop('zIndex', { type: 'integer', def: 0 })\n\nthis.specs = {\n    name: `COG ${$props.length}`,\n    props: {\n        color: $props.color\n    },\n    settings: {\n        precision: $props.prec,\n        zIndex: $props.zIndex\n    }\n}\n\n[UPDATE]\n\nlet length = $props.length\nSpline(cog(close, length), this.specs)\n";
  const __vite_glob_2_7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: COG
  }, Symbol.toStringTag, { value: "Module" }));
  const DMI = `
// Navy ~ 0.2-lite
// <ds>Directional Movement Index</ds>

[INDICATOR name=DMI, version=1.0.0]

prop('length', { type: 'integer', def: 15 })
prop('smooth', { type: 'integer', def: 15 })
prop('color1', { type: 'color', def: "#ef1360" })
prop('color2', { type: 'color', def: "#3782f2" })
prop('color3', { type: 'color', def: "#f48709" })
prop('prec', { type: 'integer', def: 2 })
prop('zIndex', { type: 'integer', def: 0 })

this.specs = {
    name: \`DMI \${$props.length} \${$props.smooth}\`,
    props: {
        colors: [$props.color1, $props.color2, $props.color3]
    },
    settings: {
        precision: $props.prec,
        zIndex: $props.zIndex
    }
}

[UPDATE]

let [adx, dp, dn] = dmi($props.length, $props.smooth)
Splines([adx[0], dp[0], dn[0]], this.specs)
`;
  const __vite_glob_2_8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: DMI
  }, Symbol.toStringTag, { value: "Module" }));
  const EMA = "\n// Navy ~ 0.2-lite\n// <ds>Exponential Moving Average</ds>\n\n[INDICATOR name=EMA, version=1.0.0]\n\nprop('length', { type: 'integer', def: 12 })\nprop('color', { type: 'color', def: '#f7890c' })\nprop('prec', { type: 'integer', def: autoPrec() })\nprop('zIndex', { type: 'integer', def: 0 })\n\nthis.specs = {\n    name: `EMA ${$props.length}`,\n    props: {\n        color: $props.color,\n    },\n    settings: {\n        precision: $props.prec,\n        zIndex: $props.zIndex\n    }\n}\n\n[UPDATE]\n\nSpline(ema(close, $props.length), this.specs)\n";
  const __vite_glob_2_9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: EMA
  }, Symbol.toStringTag, { value: "Module" }));
  const HMA = "\n// Navy ~ 0.2-lite\n// <ds>Hull Moving Average</ds>\n\n[INDICATOR name=HMA, version=1.0.0]\n\nprop('length', { type: 'integer', def: 10 })\nprop('color', { type: 'color', def: '#3af475' })\nprop('prec', { type: 'integer', def: autoPrec() })\nprop('zIndex', { type: 'integer', def: 0 })\n\nthis.specs = {\n    name: `HMA ${$props.length}`,\n    props: {\n        color: $props.color,\n    },\n    settings: {\n        precision: $props.prec,\n        zIndex: $props.zIndex\n    }\n}\n\n[UPDATE]\n\nSpline(hma(close, $props.length), this.specs)\n";
  const __vite_glob_2_10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: HMA
  }, Symbol.toStringTag, { value: "Module" }));
  const Ichimoku = "\n// Navy ~ 0.2-lite\n// <ds>Ichimoku Cloud</ds>\n\n[INDICATOR name=Ichimoku, version=1.0.0]\n\nprop('convLength', { type: 'integer', def: 9 })\nprop('baseLength', { type: 'integer', def: 26 })\nprop('laggingLength', { type: 'integer', def: 52 })\nprop('displacement', { type: 'integer', def: 26 })\nprop('cloudUpColor', { type: 'color', def: '#79ffde18' })\nprop('cloudDwColor', { type: 'color', def: '#ff246c18' })\nprop('convColor', { type: 'color', def: '#4eb6d8' })\nprop('baseColor', { type: 'color', def: '#d626a1' })\nprop('laggingColor', { type: 'color', def: '#66cc66' })\nprop('prec', { type: 'integer', def: autoPrec() })\nprop('zIndex', { type: 'integer', def: 0 })\n\nthis.specs = ({name, props}) => ({\n    name: name,\n    props: props,\n    settings: {\n        precision: $props.prec,\n        zIndex: $props.zIndex\n    }\n})\n\n[UPDATE]\n\nlet $ = $props\nlet donchian = (len, id) => ts(\n    avg(lowest(low, len)[0], highest(high, len)[0]), id\n)\nlet conversionLine = donchian($.convLength, 1)\nlet baseLine = donchian($.baseLength, 2)\nlet leadLine1 = ts(avg(conversionLine[0], baseLine[0]))\nlet leadLine2 = donchian($.laggingLength, 3)\nlet lagging = ts(close[0])\noffset(leadLine1, $.displacement - 1)\noffset(leadLine2, $.displacement - 1)\noffset(lagging, -$.displacement + 1)\n\nCloud([leadLine1, leadLine2], this.specs({\n    name: `Cloud`,\n    props: {\n        back1: $props.cloudUpColor,\n        back2: $props.cloudDwColor\n    }\n}))\n\nSplines([conversionLine, baseLine], this.specs({\n    name: `Base Lines ${$.convLength} ${$.baseLength}`,\n    props: {\n        colors: [\n            $props.convColor,\n            $props.baseColor\n        ]\n    }\n}))\n\nSpline(lagging, this.specs({\n    name: `Lagging Span ${$.laggingLength}`,\n    props: {\n        color: $props.laggingColor\n    }\n}))\n";
  const __vite_glob_2_11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Ichimoku
  }, Symbol.toStringTag, { value: "Module" }));
  const KC = "\n// Navy ~ 0.2-lite\n// <ds>Keltner Channels</ds>\n\n[INDICATOR name=KC, version=1.0.0]\n\nprop('length', { type: 'integer', def: 20 })\nprop('mult', { type: 'number', def: 1 })\nprop('trueRange', { type: 'boolean', def: true })\nprop('color', { type: 'color', def: '#4c8dffab' })\nprop('backColor', { type: 'color', def: '#4c8dff0a' })\nprop('prec', { type: 'integer', def: autoPrec() })\nprop('zIndex', { type: 'integer', def: 0 })\n\nthis.specs = {\n    name: `KC ${$props.length} ${$props.mult}`,\n    props: {\n        color: $props.color,\n        backColor: $props.backColor,\n    },\n    settings: {\n        precision: $props.prec,\n        zIndex: $props.zIndex\n    }\n}\n\n[UPDATE]\n\nlet $ = $props\nlet [m, h, l] = kc(close, $.length, $.mult, $.trueRange)\nBand([h[0], m[0], l[0]], this.specs)\n";
  const __vite_glob_2_12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: KC
  }, Symbol.toStringTag, { value: "Module" }));
  const KCW = "\n// Navy ~ 0.2-lite\n// <ds>Keltner Channels Width</ds>\n\n[INDICATOR name=KCW, version=1.0.0]\n\nprop('length', { type: 'integer', def: 20 })\nprop('mult', { type: 'number', def: 1 })\nprop('trueRange', { type: 'boolean', def: true })\nprop('color', { type: 'color', def: '#4c8dffab' })\nprop('backColor', { type: 'color', def: '#4c8dff0a' })\nprop('prec', { type: 'integer', def: autoPrec() })\nprop('zIndex', { type: 'integer', def: 0 })\n\nthis.specs = {\n    name: `KCW ${$props.length} ${$props.mult}`,\n    props: {\n        color: $props.color,\n        backColor: $props.backColor,\n    },\n    settings: {\n        precision: $props.prec,\n        zIndex: $props.zIndex\n    }\n}\n\n[UPDATE]\n\nlet $ = $props\nlet w = kcw(close, $.length, $.mult, $.trueRange)\nSpline(w, this.specs)\n";
  const __vite_glob_2_13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: KCW
  }, Symbol.toStringTag, { value: "Module" }));
  const MACD = "\n// Navy ~ 0.2-lite\n// <ds>Moving Average Convergence/Divergence</ds>\n\n[INDICATOR name=MACD, version=1.0.0]\n\nprop('fast', { type: 'integer', def: 12 })\nprop('slow', { type: 'integer', def: 26 })\nprop('smooth', { type: 'integer', def: 9 })\nprop('colorMacd', { type: 'color', def: '#3782f2' })\nprop('colorSignal', { type: 'color', def: '#f48709' })\nprop('colorUp', { type: 'Color', def: '#35a776' })\nprop('colorDw', { type: 'Color', def: '#e54150' })\nprop('colorSemiUp', { type: 'Color', def: '#79e0b3' })\nprop('colorSemiDw', { type: 'Color', def: '#ea969e' })\nprop('prec', { type: 'integer', def: autoPrec() })\nprop('zIndex', { type: 'integer', def: 0 })\n\nlet $ = $props\nthis.specs = {\n    name: `MACD ${$.fast} ${$.slow} ${$.smooth}`,\n    props: {\n        colorValue: $.colorMacd,\n        colorSignal: $.colorSignal,\n        colorUp: $.colorUp,\n        colorDw: $.colorDw,\n        colorSemiUp: $.colorSemiUp,\n        colorSemiDw: $.colorSemiDw\n    },\n    settings: {\n        precision: $props.prec,\n        zIndex: $props.zIndex\n    }\n}\n\n[UPDATE]\n\nlet $ = $props\nlet [m, s, h] = macd(close, $.fast, $.slow, $.smooth)\n\nHistogram([h[0], m[0], s[0]], this.specs)\n";
  const __vite_glob_2_14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: MACD
  }, Symbol.toStringTag, { value: "Module" }));
  const MFI = "\n// Navy ~ 0.2-lite\n// <ds>Money Flow Index	</ds>\n\n[INDICATOR name=MFI, version=1.0.0]\n\nprop('length', { type: 'integer', def: 14 })\nprop('upperBand', { type: 'number', def: 80 })\nprop('lowerBand', { type: 'number', def: 20 })\nprop('color', { type: 'color', def: '#85c427ee' })\nprop('backColor', { type: 'color', def: '#85c42711' })\nprop('bandColor', { type: 'color', def: '#999999' })\nprop('prec', { type: 'integer', def: 2 })\nprop('zIndex', { type: 'integer', def: 0 })\n\nthis.specs = {\n    name: 'MFI ' + $props.length,\n    props: {\n        color: $props.color,\n        backColor: $props.backColor,\n        bandColor: $props.bandColor,\n        upperBand: $props.upperBand,\n        lowerBand: $props.lowerBand,\n    },\n    settings: {\n        precision: $props.prec,\n        zIndex: $props.zIndex\n    }\n}\n\n[UPDATE]\n\nlet hlc3 = ts((high[0] + low[0] + close[0]) / 3)\nRange(mfi(hlc3, $props.length), this.specs)\n";
  const __vite_glob_2_15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: MFI
  }, Symbol.toStringTag, { value: "Module" }));
  const MOM = "\n// Navy ~ 0.2-lite\n// <ds>Momentum</ds>\n\n[INDICATOR name=MOM, version=1.0.0]\n\nprop('length', { type: 'integer', def: 11 })\nprop('color', { type: 'color', def: '#bcc427ee' })\nprop('prec', { type: 'integer', def: autoPrec() })\nprop('zIndex', { type: 'integer', def: 0 })\n\nthis.specs = {\n    name: `MOM ${$props.length}`,\n    props: {\n        color: $props.color\n    },\n    settings: {\n        precision: $props.prec,\n        zIndex: $props.zIndex\n    }\n}\n\n[UPDATE]\n\nlet length = $props.length\nSpline(mom(close, length), this.specs)\n";
  const __vite_glob_2_16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: MOM
  }, Symbol.toStringTag, { value: "Module" }));
  const ROC = "\n// Navy ~ 0.2-lite\n// <ds>Rate of Change</ds>\n\n[INDICATOR name=ROC, version=1.0.0]\n\nprop('length', { type: 'integer', def: 9 })\nprop('color', { type: 'color', def: '#279fc4' })\nprop('prec', { type: 'integer', def: autoPrec() })\nprop('zIndex', { type: 'integer', def: 0 })\n\nthis.specs = {\n    name: `ROC ${$props.length}`,\n    props: {\n        color: $props.color\n    },\n    settings: {\n        precision: $props.prec,\n        zIndex: $props.zIndex\n    }\n}\n\n[UPDATE]\n\nlet length = $props.length\nSpline(roc(close, length), this.specs)\n";
  const __vite_glob_2_17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: ROC
  }, Symbol.toStringTag, { value: "Module" }));
  const RSI = "\n// Navy ~ 0.2-lite\n// <ds>Relative Strength Index</ds>\n\n[INDICATOR name=RSI, version=1.0.0]\n\nprop('length', { type: 'integer', def: 14 })\nprop('color', { type: 'color', def: '#3399ff' })\nprop('prec', { type: 'integer', def: 2 })\nprop('zIndex', { type: 'integer', def: 0 })\n\nthis.specs = {\n    name: 'RSI ' + $props.length,\n    props: {\n        color: $props.color\n    },\n    settings: {\n        precision: $props.prec,\n        zIndex: $props.zIndex\n    }\n}\n\n[UPDATE]\n\nRange(rsi(close, $props.length), this.specs)\n";
  const __vite_glob_2_18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: RSI
  }, Symbol.toStringTag, { value: "Module" }));
  const Ribbon = "\n// Navy ~ 0.2-lite\n// <ds>Exponential Moving Average Ribbon</ds>\n\n[INDICATOR name=Ribbon, version=1.0.0]\n\nprop('start', { type: 'integer', def: 10 })\nprop('number', { type: 'integer', def: 5 })\nprop('step', { type: 'integer', def: 10 })\nprop('colors', { type: 'array', def: [\"#3aaaf4ee\"] })\nprop('prec', { type: 'integer', def: autoPrec() })\nprop('zIndex', { type: 'integer', def: 0 })\n\nthis.specs = {\n    name: `EMA x ${$props.number}`,\n    props: {\n        colors: $props.colors,\n    },\n    settings: {\n        precision: $props.prec,\n        zIndex: $props.zIndex\n    }\n}\n\n[UPDATE]\n\nlet $ = $props\nlet arr = []\nfor (var i = 0; i < $.number; i++) {\n    let l = $.start + i * $.step\n    arr.push(ema(close, l)[0])\n}\n\nSplines(arr, this.specs)\n";
  const __vite_glob_2_19 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Ribbon
  }, Symbol.toStringTag, { value: "Module" }));
  const SAR = "\n// Navy ~ 0.2-lite\n// <ds>Parabolic SAR</ds>\n\n[INDICATOR name=SAR, version=1.0.0]\n\nprop('start', { type: 'number', def: 0.02 })\nprop('inc', { type: 'number', def: 0.02 })\nprop('max', { type: 'number', def: 0.2 })\nprop('color', { type: 'color', def: '#35a9c6' })\nprop('prec', { type: 'integer', def: autoPrec() })\nprop('zIndex', { type: 'integer', def: 0 })\n\nlet $ = $props\nthis.specs = {\n    name: `SAR ${$.start} ${$.inc} ${$.max}`,\n    props: {\n        color: $props.color,\n        shape: 'cross'\n    },\n    settings: {\n        precision: $props.prec,\n        zIndex: $props.zIndex\n    }\n}\n\n[UPDATE]\n\nlet $ = $props\nSparse(sar($.start, $.inc, $.max), this.specs)\n";
  const __vite_glob_2_20 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: SAR
  }, Symbol.toStringTag, { value: "Module" }));
  const SMA = "\n// Navy ~ 0.2-lite\n// <ds>Simple Moving Average</ds>\n\n[INDICATOR name=SMA, version=1.0.0]\n\nprop('length', { type: 'integer', def: 12 })\nprop('color', { type: 'color', def: '#d1385c' })\nprop('prec', { type: 'integer', def: autoPrec() })\nprop('zIndex', { type: 'integer', def: 0 })\n\nthis.specs = {\n    name: `SMA ${$props.length}`,\n    props: {\n        color: $props.color,\n    },\n    settings: {\n        precision: $props.prec,\n        zIndex: $props.zIndex\n    }\n}\n\n[UPDATE]\n\nSpline(sma(close, $props.length), this.specs)\n";
  const __vite_glob_2_21 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: SMA
  }, Symbol.toStringTag, { value: "Module" }));
  const SWMA = "\n// Navy ~ 0.2-lite\n// <ds>Symmetrically Weighted Moving Average</ds>\n\n[INDICATOR name=SWMA, version=1.0.0]\n\nprop('color', { type: 'color', def: '#e57440' })\nprop('prec', { type: 'integer', def: autoPrec() })\nprop('zIndex', { type: 'integer', def: 0 })\n\nthis.specs = {\n    name: `SWMA`,\n    props: {\n        color: $props.color,\n    },\n    settings: {\n        precision: $props.prec,\n        zIndex: $props.zIndex\n    }\n}\n\n[UPDATE]\n\nSpline(swma(close), this.specs)\n";
  const __vite_glob_2_22 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: SWMA
  }, Symbol.toStringTag, { value: "Module" }));
  const Stoch = "\n// Navy ~ 0.2-lite\n// <ds>Stochastic</ds>, format: [<timestamp>, <kLine>, <dLine>]\n\n[OVERLAY name=Stoch, version=1.0.0]\n\nprop('kColor', { type: 'color', def: '#3782f2' })\nprop('dColor', { type: 'color', def: '#f48709' })\nprop('bandColor', { type: 'color', def: '#535559' })\nprop('backColor', { type: 'color', def: '#381e9c16' })\nprop('upperBand', { type: 'number', def: 80 })\nprop('lowerBand', { type: 'number', def: 20 })\n\ndraw(ctx) {\n    const layout = $core.layout\n    const upper = layout.value2y($props.upperBand)\n    const lower = layout.value2y($props.lowerBand)\n    const data = $core.data\n    const view = $core.view\n\n    // K\n    ctx.lineWidth = 1\n    ctx.strokeStyle = $props.kColor\n    ctx.beginPath()\n    for (var i = view.i1, n = view.i2; i <= n; i++) {\n        let p = data[i]\n        let x = layout.ti2x(p[0], i)\n        let y = layout.value2y(p[1])\n        ctx.lineTo(x, y)\n    }\n    ctx.stroke()\n\n    // D\n    ctx.strokeStyle = $props.dColor\n    ctx.beginPath()\n    for (var i = view.i1, n = view.i2; i <= n; i++) {\n        let p = data[i]\n        let x = layout.ti2x(p[0], i)\n        let y = layout.value2y(p[2])\n        ctx.lineTo(x, y)\n    }\n    ctx.stroke()\n\n    ctx.strokeStyle = $props.bandColor\n    ctx.setLineDash([5]) // Will be removed after draw()\n    ctx.beginPath()\n    // Fill the area between the bands\n    ctx.fillStyle = $props.backColor\n    ctx.fillRect(0, upper, layout.width, lower - upper)\n    // Upper band\n    ctx.moveTo(0, upper)\n    ctx.lineTo(layout.width, upper)\n    // Lower band\n    ctx.moveTo(0, lower)\n    ctx.lineTo(layout.width, lower)\n    ctx.stroke()\n}\n\nyRange(data, hi, lo) => [\n    Math.max(hi, $props.upperBand),\n    Math.min(lo, $props.lowerBand)\n]\n\n// Legend, defined as pairs [value, color]\nlegend(x) => [[x[1], $props.kColor], [x[1], $props.dColor]]\n\n\n[INDICATOR name=Stoch, version=1.0.0]\n\nprop('paramK', { def: 14 })\nprop('paramD', { def: 3 })\nprop('smooth', { def: 3 })\nprop('kColor', { type: 'color', def: '#3782f2' })\nprop('dColor', { type: 'color', def: '#f48709' })\nprop('prec', { type: 'integer', def: 2 })\nprop('zIndex', { type: 'integer', def: 0 })\n\nlet $ = $props\nthis.specs = {\n    name: `Stoch ${$.paramK} ${$.paramD} ${$.smooth}`,\n    props: {\n        kColor: $props.kColor,\n        dColor: $props.dColor\n    },\n    settings: {\n        precision: $props.prec,\n        zIndex: $props.zIndex\n    }\n}\n\n[UPDATE]\n\nlet $ = $props\nlet k = sma(stoch(close, high, low, $.paramK), $.smooth)\nlet d = sma(k, $.paramD)\nStoch([k[0], d[0]], this.specs)\n";
  const __vite_glob_2_23 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Stoch
  }, Symbol.toStringTag, { value: "Module" }));
  const TSI = "\n// Navy ~ 0.2-lite\n// <ds>True Strength Index</ds>\n\n[INDICATOR name=TSI, version=1.0.0]\n\nprop('long', { type: 'integer', def: 25 })\nprop('short', { type: 'integer', def: 13 })\nprop('signal', { type: 'integer', def: 13 })\nprop('color1', { type: 'color', def: '#3bb3e4' })\nprop('color2', { type: 'color', def: '#f7046d' })\nprop('prec', { type: 'integer', def: autoPrec() })\nprop('zIndex', { type: 'integer', def: 0 })\n\nlet $ = $props\nthis.specs = {\n    name: `TSI ${$.long} ${$.short} ${$.signal}`,\n    props: {\n        colors: [$.color1, $.color2]\n    },\n    settings: {\n        precision: $props.prec,\n        zIndex: $props.zIndex\n    }\n}\n\n[UPDATE]\n\nlet $ = $props\nlet val = tsi(close, $.short, $.long)\nlet sig = ema(val, $.signal)\nSplines([val[0] * 100, sig[0] * 100], this.specs)\n";
  const __vite_glob_2_24 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: TSI
  }, Symbol.toStringTag, { value: "Module" }));
  const VWMA = "\n// Navy ~ 0.2-lite\n// <ds>Volume Weighted Moving Average</ds>\n\n[INDICATOR name=VWMA, version=1.0.0]\n\nprop('length', { type: 'integer', def: 20 })\nprop('color', { type: 'color', def: '#db0670' })\nprop('prec', { type: 'integer', def: autoPrec() })\nprop('zIndex', { type: 'integer', def: 0 })\n\nthis.specs = {\n    name: `VWMA ${$props.length}`,\n    props: {\n        color: $props.color,\n    },\n    settings: {\n        precision: $props.prec,\n        zIndex: $props.zIndex\n    }\n}\n\n[UPDATE]\n\nSpline(vwma(close, $props.length), this.specs)\n";
  const __vite_glob_2_25 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: VWMA
  }, Symbol.toStringTag, { value: "Module" }));
  const WilliamsR = "\n// Navy ~ 0.2-lite\n// <ds>Williams %R</ds>\n\n[INDICATOR name=WilliamsR, version=1.0.0]\n\nprop('length', { type: 'integer', def: 14 })\nprop('upperBand', { type: 'number', def: -20 })\nprop('lowerBand', { type: 'number', def: -80 })\nprop('color', { type: 'color', def: '#0980e8' })\nprop('backColor', { type: 'color', def: '#9b9ba316' })\nprop('bandColor', { type: 'color', def: '#535559' })\nprop('prec', { type: 'integer', def: autoPrec() })\nprop('zIndex', { type: 'integer', def: 0 })\n\nthis.specs = {\n    name: `%R ${$props.length}`,\n    props: {\n        color: $props.color,\n        backColor: $props.backColor,\n        bandColor: $props.bandColor,\n        upperBand: $props.upperBand,\n        lowerBand: $props.lowerBand,\n    },\n    settings: {\n        precision: $props.prec,\n        zIndex: $props.zIndex\n    }\n}\n\n[UPDATE]\n\nRange(wpr($props.length), this.specs)\n";
  const __vite_glob_2_26 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: WilliamsR
  }, Symbol.toStringTag, { value: "Module" }));
  var stripComments = { exports: {} };
  const compile$1 = (cst, options = {}) => {
    const keepProtected = options.safe === true || options.keepProtected === true;
    let firstSeen = false;
    const walk = (node) => {
      let output = "";
      let inner;
      let lines;
      for (const child of node.nodes) {
        switch (child.type) {
          case "block":
            if (options.first && firstSeen === true) {
              output += walk(child);
              break;
            }
            if (options.preserveNewlines === true) {
              inner = walk(child);
              lines = inner.split("\n");
              output += "\n".repeat(lines.length - 1);
              break;
            }
            if (keepProtected === true && child.protected === true) {
              output += walk(child);
              break;
            }
            firstSeen = true;
            break;
          case "line":
            if (options.first && firstSeen === true) {
              output += child.value;
              break;
            }
            if (keepProtected === true && child.protected === true) {
              output += child.value;
            }
            firstSeen = true;
            break;
          case "open":
          case "close":
          case "text":
          case "newline":
          default: {
            output += child.value || "";
            break;
          }
        }
      }
      return output;
    };
    return walk(cst);
  };
  var compile_1 = compile$1;
  let Node$1 = class Node {
    constructor(node) {
      this.type = node.type;
      if (node.value)
        this.value = node.value;
      if (node.match)
        this.match = node.match;
      this.newline = node.newline || "";
    }
    get protected() {
      return Boolean(this.match) && this.match[1] === "!";
    }
  };
  let Block$1 = class Block extends Node$1 {
    constructor(node) {
      super(node);
      this.nodes = node.nodes || [];
    }
    push(node) {
      this.nodes.push(node);
    }
    get protected() {
      return this.nodes.length > 0 && this.nodes[0].protected === true;
    }
  };
  var Node_1 = { Node: Node$1, Block: Block$1 };
  var languages$1 = {};
  (function(exports3) {
    exports3.ada = { LINE_REGEX: /^--.*/ };
    exports3.apl = { LINE_REGEX: /^⍝.*/ };
    exports3.applescript = {
      BLOCK_OPEN_REGEX: /^\(\*/,
      BLOCK_CLOSE_REGEX: /^\*\)/
    };
    exports3.csharp = {
      LINE_REGEX: /^\/\/.*/
    };
    exports3.haskell = {
      BLOCK_OPEN_REGEX: /^\{-/,
      BLOCK_CLOSE_REGEX: /^-\}/,
      LINE_REGEX: /^--.*/
    };
    exports3.javascript = {
      BLOCK_OPEN_REGEX: /^\/\*\*?(!?)/,
      BLOCK_CLOSE_REGEX: /^\*\/(\n?)/,
      LINE_REGEX: /^\/\/(!?).*/
    };
    exports3.lua = {
      BLOCK_OPEN_REGEX: /^--\[\[/,
      BLOCK_CLOSE_REGEX: /^\]\]/,
      LINE_REGEX: /^--.*/
    };
    exports3.matlab = {
      BLOCK_OPEN_REGEX: /^%{/,
      BLOCK_CLOSE_REGEX: /^%}/,
      LINE_REGEX: /^%.*/
    };
    exports3.perl = {
      LINE_REGEX: /^#.*/
    };
    exports3.php = {
      ...exports3.javascript,
      LINE_REGEX: /^(#|\/\/).*?(?=\?>|\n)/
    };
    exports3.python = {
      BLOCK_OPEN_REGEX: /^"""/,
      BLOCK_CLOSE_REGEX: /^"""/,
      LINE_REGEX: /^#.*/
    };
    exports3.ruby = {
      BLOCK_OPEN_REGEX: /^=begin/,
      BLOCK_CLOSE_REGEX: /^=end/,
      LINE_REGEX: /^#.*/
    };
    exports3.shebang = exports3.hashbang = {
      LINE_REGEX: /^#!.*/
    };
    exports3.c = exports3.javascript;
    exports3.csharp = exports3.javascript;
    exports3.css = exports3.javascript;
    exports3.java = exports3.javascript;
    exports3.js = exports3.javascript;
    exports3.less = exports3.javascript;
    exports3.pascal = exports3.applescript;
    exports3.ocaml = exports3.applescript;
    exports3.sass = exports3.javascript;
    exports3.sql = exports3.ada;
    exports3.swift = exports3.javascript;
    exports3.ts = exports3.javascript;
    exports3.typscript = exports3.javascript;
  })(languages$1);
  const { Node, Block } = Node_1;
  const languages = languages$1;
  const constants = {
    ESCAPED_CHAR_REGEX: /^\\./,
    QUOTED_STRING_REGEX: /^(['"`])((?:\\\1|[^\1])*?)(\1)/,
    NEWLINE_REGEX: /^\r*\n/
  };
  const parse$1 = (input, options = {}) => {
    if (typeof input !== "string") {
      throw new TypeError("Expected input to be a string");
    }
    const cst = new Block({ type: "root", nodes: [] });
    const stack = [cst];
    const name = (options.language || "javascript").toLowerCase();
    const lang = languages[name];
    if (typeof lang === "undefined") {
      throw new Error(`Language "${name}" is not supported by strip-comments`);
    }
    const { LINE_REGEX, BLOCK_OPEN_REGEX, BLOCK_CLOSE_REGEX } = lang;
    let block = cst;
    let remaining = input;
    let token;
    let prev;
    const source = [BLOCK_OPEN_REGEX, BLOCK_CLOSE_REGEX].filter(Boolean);
    let tripleQuotes = false;
    if (source.every((regex) => regex.source === '^"""')) {
      tripleQuotes = true;
    }
    const consume = (value = remaining[0] || "") => {
      remaining = remaining.slice(value.length);
      return value;
    };
    const scan = (regex, type = "text") => {
      const match = regex.exec(remaining);
      if (match) {
        consume(match[0]);
        return { type, value: match[0], match };
      }
    };
    const push = (node) => {
      if (prev && prev.type === "text" && node.type === "text") {
        prev.value += node.value;
        return;
      }
      block.push(node);
      if (node.nodes) {
        stack.push(node);
        block = node;
      }
      prev = node;
    };
    const pop = () => {
      if (block.type === "root") {
        throw new SyntaxError("Unclosed block comment");
      }
      stack.pop();
      block = stack[stack.length - 1];
    };
    while (remaining !== "") {
      if (token = scan(constants.ESCAPED_CHAR_REGEX, "text")) {
        push(new Node(token));
        continue;
      }
      if (block.type !== "block" && (!prev || !/\w$/.test(prev.value)) && !(tripleQuotes && remaining.startsWith('"""'))) {
        if (token = scan(constants.QUOTED_STRING_REGEX, "text")) {
          push(new Node(token));
          continue;
        }
      }
      if (token = scan(constants.NEWLINE_REGEX, "newline")) {
        push(new Node(token));
        continue;
      }
      if (BLOCK_OPEN_REGEX && options.block && !(tripleQuotes && block.type === "block")) {
        if (token = scan(BLOCK_OPEN_REGEX, "open")) {
          push(new Block({ type: "block" }));
          push(new Node(token));
          continue;
        }
      }
      if (BLOCK_CLOSE_REGEX && block.type === "block" && options.block) {
        if (token = scan(BLOCK_CLOSE_REGEX, "close")) {
          token.newline = token.match[1] || "";
          push(new Node(token));
          pop();
          continue;
        }
      }
      if (LINE_REGEX && block.type !== "block" && options.line) {
        if (token = scan(LINE_REGEX, "line")) {
          push(new Node(token));
          continue;
        }
      }
      if (token = scan(/^[a-zABD-Z0-9\t ]+/, "text")) {
        push(new Node(token));
        continue;
      }
      push(new Node({ type: "text", value: consume(remaining[0]) }));
    }
    return cst;
  };
  var parse_1 = parse$1;
  /*!
   * strip-comments <https://github.com/jonschlinkert/strip-comments>
   * Copyright (c) 2014-present, Jon Schlinkert.
   * Released under the MIT License.
   */
  const compile = compile_1;
  const parse = parse_1;
  const strip = stripComments.exports = (input, options) => {
    const opts = { ...options, block: true, line: true };
    return compile(parse(input, opts), opts);
  };
  strip.block = (input, options) => {
    const opts = { ...options, block: true };
    return compile(parse(input, opts), opts);
  };
  strip.line = (input, options) => {
    const opts = { ...options, line: true };
    return compile(parse(input, opts), opts);
  };
  strip.first = (input, options) => {
    const opts = { ...options, block: true, line: true, first: true };
    return compile(parse(input, opts), opts);
  };
  strip.parse = parse;
  var stripCommentsExports = stripComments.exports;
  const strip$1 = /* @__PURE__ */ getDefaultExportFromCjs(stripCommentsExports);
  function decomment(src, file) {
    return strip$1(src);
  }
  function maskStrings(src, file) {
    const quotes = findStrings(src, file);
    for (var q of quotes) {
      let tmp = src.slice(0, q[0] + 1);
      tmp += src.slice(q[0] + 1, q[1]).replaceAll("/*", "[!C~1!]").replaceAll("//", "[!C~2!]");
      tmp += src.slice(q[1]);
      src = tmp;
    }
    return src;
  }
  function unmaskStrings(src, file) {
    return src.replaceAll("[!C~1!]", "/*").replaceAll("[!C~2!]", "//");
  }
  function findStrings(src, file) {
    const count = { "'": 0, '"': 0, "`": 0 };
    const pairs = [];
    let pair = null;
    for (var i = 0; i < src.length; i++) {
      for (var type in count) {
        if (src[i] === type && src[i - 1] !== "\\") {
          count[type]++;
          if (!pair)
            pair = [i, void 0];
        }
        if (src[i] === type && src[i - 1] !== "\\" && i > pair[0]) {
          count[type] = 0;
          if (pair && Object.values(count).every((x) => !x)) {
            pair[1] = i;
            pairs.push(pair);
            pair = null;
          }
        }
        if (count[type] < 0) {
          throw `Missing quote ${type} in ${file}`;
        }
      }
    }
    if (pair !== null) {
      throw `Missing quote in ${file}: ${JSON.stringify(count)}`;
    }
    return pairs;
  }
  function maskRegex(src, f = btoa) {
    const rex = /\/([^*/]?.+)\//g;
    do {
      var m = rex.exec(src);
      if (m) {
        let length = m[0].length;
        if (m[1].slice(-1) === "*") {
          length--;
          m[1] = m[1].slice(0, -1);
        }
        let tmp = src.slice(0, m.index + 1);
        const r = f(m[1]);
        tmp += r + src.slice(m.index + length - 1);
        src = tmp;
        rex.lastIndex = m.index + r.length;
      }
    } while (m);
    return src;
  }
  function findClosingBracket(src, startPos, file, btype = "{}") {
    const open = btype[0];
    const close = btype[1];
    const count = { "'": 0, '"': 0, "`": 0 };
    let count2 = 0;
    let pair = null;
    for (var i = startPos; i < src.length; i++) {
      for (var type in count) {
        if (src[i] === type && src[i - 1] !== "\\") {
          count[type]++;
          if (!pair)
            pair = [i, void 0];
        }
        if (src[i] === type && src[i - 1] !== "\\" && i > pair[0]) {
          count[type] = 0;
          if (pair && Object.values(count).every((x) => !x)) {
            pair[1] = i;
            pair = null;
          }
        }
        if (count[type] < 0) {
          throw `Missing quote ${type} in ${file}`;
        }
      }
      const sum = count["'"] + count['"'] + count["`"];
      if (sum === 0) {
        if (src[i] === open)
          count2++;
        if (src[i] === close)
          count2--;
        if (count2 === 0)
          break;
      }
    }
    if (count2 !== 0) {
      throw `Missing bracket in ${file}: ${btype}`;
    }
    if (pair !== null) {
      throw `Missing quote in ${file}: ${JSON.stringify(count)}`;
    }
    return i;
  }
  function extractStaticBlocks(script) {
    const matches = [];
    let currentIndex = 0;
    while (currentIndex < script.length) {
      const staticIndex = script.indexOf("static", currentIndex);
      if (staticIndex === -1)
        break;
      const arrowIndex = script.indexOf("=>", staticIndex);
      if (arrowIndex === -1)
        break;
      currentIndex = arrowIndex + 2;
      while ([" ", "	", "\n", "\r"].includes(script[currentIndex])) {
        currentIndex++;
      }
      const nextChar = script[currentIndex];
      if (["{", "[", "("].includes(nextChar)) {
        let closingIndex;
        try {
          closingIndex = findClosingBracket(script, currentIndex, "script", nextChar + { "{": "}", "[": "]", "(": ")" }[nextChar]);
        } catch (error2) {
          console.error(error2);
          continue;
        }
        matches.push(script.slice(staticIndex, closingIndex + 1).trim());
        currentIndex = closingIndex + 1;
      } else {
        const newLineIndex = script.indexOf("\n", currentIndex);
        matches.push(script.slice(staticIndex, newLineIndex !== -1 ? newLineIndex : void 0).trim());
      }
    }
    return matches.join("\n");
  }
  const tools = {
    maskStrings,
    unmaskStrings,
    findStrings,
    maskRegex,
    decomment,
    findClosingBracket,
    extractStaticBlocks
  };
  const FREGX1 = /(function[\s]+|)([$A-Z_][0-9A-Z_$.]*)[\s]*?\(([^()]*?)\)[\s]*?{/gmi;
  const FREGX2 = /(function[\s]+|)([$A-Z_][0-9A-Z_$.]*)[\s]*?\(([^()]*?)\)[\s]*?=>[\s]*?{/gmi;
  const FREGX3 = /(function[\s]+|)([$A-Z_][0-9A-Z_$.]*)[\s]*?\(([^()]*?)\)[\s]*?=>/gmi;
  const SREGX = /static\s+var\s+([a-zA-Z0-9_]+)\s*=/g;
  const KWORDS = ["if", "for", "while", "switch", "catch", "with"];
  class ParserOV {
    constructor(tagProps, src) {
      this.tagProps = this.parseTagProps(tagProps);
      this.src = src;
      this.flags = "";
      this.parseBody();
    }
    parseTagProps(src) {
      const obj = {};
      const pairs = src.split(",");
      for (var p of pairs) {
        const [key, val] = p.split("=");
        obj[key.trim()] = val.trim();
      }
      return obj;
    }
    parseBody() {
      let code = tools.decomment(this.src);
      code = this.prepFuncions1(code);
      code = this.prepFuncions2(code);
      code = this.prepFuncions3(code);
      const blocks = tools.extractStaticBlocks(code);
      this.static = this.wrapStatic(blocks);
      code = this.renameStatic(code);
      this.prefab = this.wrapTheCode(code, this.flags);
    }
    // Find all function declarations & replace them with
    // arrow functions (first category: f() {} )
    prepFuncions1(code) {
      let copy = "";
      let i = 0;
      FREGX1.lastIndex = 0;
      do {
        var m = FREGX1.exec(code);
        if (m) {
          m[1].trim();
          const fname = m[2];
          const fargs = m[3];
          const open = FREGX1.lastIndex - 1;
          const close = tools.findClosingBracket(code, open);
          if (!KWORDS.includes(fname)) {
            const block = code.slice(open, close + 1);
            copy += code.slice(i, m.index);
            copy += `var ${fname} = (${fargs}) => ${block}`;
            this.parseFlags(fname, fargs, block);
          } else {
            copy += code.slice(i, close + 1);
          }
          FREGX1.lastIndex = close;
          i = close + 1;
        }
      } while (m);
      return copy + code.slice(i);
    }
    // Find all function declarations & replace them with
    // arrow functions (third category: f() => {})
    prepFuncions2(code) {
      let copy = "";
      let i = 0;
      FREGX2.lastIndex = 0;
      do {
        var m = FREGX2.exec(code);
        if (m) {
          m[1].trim();
          const fname = m[2];
          const fargs = m[3];
          const open = FREGX2.lastIndex - 1;
          const close = tools.findClosingBracket(code, open);
          if (!KWORDS.includes(fname)) {
            const block = code.slice(open, close + 1);
            copy += code.slice(i, m.index);
            copy += `var ${fname} = (${fargs}) => (${block})`;
            this.parseFlags(fname, fargs, block);
          } else {
            copy += code.slice(i, close + 1);
          }
          FREGX2.lastIndex = close;
          i = close + 1;
        }
      } while (m);
      return copy + code.slice(i);
    }
    // Find all function declarations & replace them with
    // arrow functions (third category: f() => Expression)
    prepFuncions3(code) {
      let copy = "";
      let i = 0;
      FREGX3.lastIndex = 0;
      do {
        var m = FREGX3.exec(code);
        if (m) {
          m[1].trim();
          const fname = m[2];
          const fargs = m[3];
          const arrow = FREGX3.lastIndex;
          copy += code.slice(i, m.index);
          copy += `var ${fname} = (${fargs}) => `;
          const block = code.slice(arrow).split("\n")[0].trim();
          this.parseFlags(fname, fargs, block);
          i = arrow + 1;
        }
      } while (m);
      return copy + code.slice(i);
    }
    // Add some flag for the future use (e.g. in layout)
    parseFlags(name, fargs, block) {
      if (name === "yRange") {
        const x = fargs.trim().split(",").length > 1;
        this.flags += `yRangePreCalc: ${x},
`;
      } else if (name === "legend") {
        if (block === "null" || block === "undefined") {
          this.flags += "noLegend: true,\n";
        }
      }
    }
    wrapStatic(code) {
      const renamed = code.replace(SREGX, "$static.$1 =");
      const wrappedScript = `
            var $static = {}
            ${renamed}
            return $static
        `;
      try {
        const dynamicFunction = new Function(wrappedScript);
        const result = dynamicFunction();
        return result;
      } catch (error2) {
        console.error("Error parsing static functions", error2);
      }
      return {};
    }
    // Rename static functions 
    renameStatic(code) {
      return code.replace(SREGX, "$static.$1 =");
    }
    // Create a function that returns a new overlay object
    wrapTheCode(code, flags) {
      return new Function("env", `

            // Setup the environment
            let { $core, $props, $events } = env
            let prop = (...args) => env.prop(...args)
            let watchProp = (...args) => env.watchProp(...args)
            let $static = {} 

            // Add primitives
            let $lib = env.lib

            // Function stubs
            var init = () => {}
            var destroy = () => {}
            var meta = () => null
            var dataFormat = () => null
            var draw = () => {}
            var drawSidebar = null
            var drawBotbar = null
            var yRange = null
            var preSampler = null
            var legend = null
            var legendHtml = null
            var valueTracker = null
            var ohlc = null

            // Event handler stubs
            var mousemove = null
            var mouseout = null
            var mouseup = null
            var mousedown = null
            var click = null
            var keyup = null
            var keydown = null
            var keypress = null

            // Overlay code
            ${code}

            // Output overlay object
            return {
                gridId: () => $core.layout.id,
                id: () => $core.id,
                init, destroy, meta, dataFormat,
                draw, drawSidebar, drawBotbar,
                yRange, preSampler,
                legend, legendHtml,
                valueTracker, ohlc,
                mousemove, mouseout, mouseup,
                mousedown, click, keyup, keydown,
                keypress,
                // Generated flags
                ${flags}
            }
        `);
    }
  }
  const SPLIT = /\[[\s]*?UPDATE[\s]*?\]|\[[\s]*?POST[\s]*?\]/gm;
  const UPDATE = /\[[\s]*?UPDATE[\s]*?\]([\s\S]*?)(\[POST|\[UPDATE|\[EOF)/gm;
  const POST = /\[[\s]*?POST[\s]*?\]([\s\S]*?)(\[POST|\[UPDATE|\[EOF)/gm;
  class ParserIND {
    constructor(tagProps, src) {
      this.tagProps = this.parseTagProps(tagProps);
      this.src = src;
      this.parseBody();
    }
    parseTagProps(src) {
      const obj = {};
      const pairs = src.split(",");
      for (var p of pairs) {
        const [key, val] = p.split("=");
        obj[key.trim()] = val.trim();
      }
      return obj;
    }
    parseBody() {
      SPLIT.lastIndex = 0;
      UPDATE.lastIndex = 0;
      POST.lastIndex = 0;
      let code = tools.decomment(this.src);
      this.init = code.split(SPLIT)[0];
      code += "\n[EOF]";
      this.update = (UPDATE.exec(code) || [])[1];
      this.post = (POST.exec(code) || [])[1];
    }
  }
  const VERSION = 0.2;
  const TAG = "lite";
  const VERS_REGX = /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm;
  const OV_REGX = /\[OVERLAY[\s]+([\s\S]*?)]([\s\S]*?)(\[OVERLAY|\[INDICATOR|\[EOF)/gm;
  const IND_REGX = /\[INDICATOR[\s]+([\s\S]*?)]([\s\S]*?)(\[OVERLAY|\[INDICATOR|\[EOF)/gm;
  class Parser {
    constructor(src, name = "Unknown Script") {
      name = this.extractName(src) || name;
      this.version = VERSION;
      this.src = src + "\n[EOF]";
      this.scriptName = name;
      this.scriptVers = this.navyVers()[0];
      this.scriptTag = this.navyVers()[1];
      this.overlays = [];
      this.indicators = [];
      if (this.scriptVers === 0) {
        console.warn(`${name}: There is no script version string`);
      }
      if (this.scriptVers > this.version) {
        console.warn(`${name}: Script version > parser version`);
      }
      if (this.scriptVers < 0.2 && src.includes("OVERLAY") && src.includes("yRange")) {
        console.warn(`${name}: Update yRange() function (see docs)`);
      }
      if (this.scriptTag !== TAG) {
        console.warn(
          `${name}: Script version should have 'lite' tag
Most likely are using the community version of NavyJS
with a script written for the PRO version.
If not the case just use 'lite' tag: ${VERSION}-lite`
        );
      }
      this.overlayTags();
      this.indicatorTags();
    }
    // Parse the version
    navyVers() {
      const first = (this.src.match(VERS_REGX) || [])[0];
      if (first) {
        const pair = first.split("~");
        if (pair.length < 2)
          return [0];
        const vers = parseFloat(pair[1]);
        const tag = pair[1].split("-")[1];
        return [vers === vers ? vers : 0, tag];
      }
      return [0];
    }
    extractName(script) {
      const regex = /\[.*?name=([^\s,]+)/;
      const match = script.match(regex);
      if (match && match[1]) {
        return match[1].trim();
      } else {
        return null;
      }
    }
    // Parse [OVERLAY] tags
    overlayTags() {
      OV_REGX.lastIndex = 0;
      let match;
      while (match = OV_REGX.exec(this.src)) {
        this.overlays.push(new ParserOV(
          match[1],
          match[2]
        ));
        OV_REGX.lastIndex -= 10;
      }
    }
    // Parse [INDICATOR] tags
    indicatorTags() {
      IND_REGX.lastIndex = 0;
      let match;
      while (match = IND_REGX.exec(this.src)) {
        this.indicators.push(new ParserIND(
          match[1],
          match[2]
        ));
        IND_REGX.lastIndex -= 12;
      }
    }
  }
  const encodedJs = "KGZ1bmN0aW9uKCkgewogICJ1c2Ugc3RyaWN0IjsKICBmdW5jdGlvbiByZWdyZXNzaW9uKGRhdGEsIGxlbiwgb2Zmc2V0KSB7CiAgICBkYXRhID0gZGF0YS5zbGljZSgwLCBsZW4pLnJldmVyc2UoKS5tYXAoKHgsIGkpID0+IFtpLCB4XSk7CiAgICB2YXIgc3VtX3ggPSAwLCBzdW1feSA9IDAsIHN1bV94eSA9IDAsIHN1bV94eCA9IDAsIGNvdW50ID0gMCwgbSwgYjsKICAgIGZvciAobGV0IGkgPSAwLCBkYXRhbGVuID0gZGF0YS5sZW5ndGg7IGkgPCBkYXRhbGVuOyBpKyspIHsKICAgICAgaWYgKCFkYXRhW2ldKQogICAgICAgIHJldHVybiBOYU47CiAgICAgIHZhciBwb2ludCA9IGRhdGFbaV07CiAgICAgIHN1bV94ICs9IHBvaW50WzBdOwogICAgICBzdW1feSArPSBwb2ludFsxXTsKICAgICAgc3VtX3h4ICs9IHBvaW50WzBdICogcG9pbnRbMF07CiAgICAgIHN1bV94eSArPSBwb2ludFswXSAqIHBvaW50WzFdOwogICAgICBjb3VudCsrOwogICAgfQogICAgbSA9IChjb3VudCAqIHN1bV94eSAtIHN1bV94ICogc3VtX3kpIC8gKGNvdW50ICogc3VtX3h4IC0gc3VtX3ggKiBzdW1feCk7CiAgICBiID0gc3VtX3kgLyBjb3VudCAtIG0gKiBzdW1feCAvIGNvdW50OwogICAgcmV0dXJuIG0gKiAoZGF0YS5sZW5ndGggLSAxIC0gb2Zmc2V0KSArIGI7CiAgfQogIGZ1bmN0aW9uIGdldERlZmF1bHRFeHBvcnRGcm9tQ2pzKHgpIHsKICAgIHJldHVybiB4ICYmIHguX19lc01vZHVsZSAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoeCwgImRlZmF1bHQiKSA/IHhbImRlZmF1bHQiXSA6IHg7CiAgfQogIHZhciB1dGlsJDEgPSB7fTsKICBmdW5jdGlvbiBpc0FycmF5TGlrZShvKSB7CiAgICBpZiAobyAmJiAvLyBvIGlzIG5vdCBudWxsLCB1bmRlZmluZWQsIGV0Yy4KICAgIHR5cGVvZiBvID09PSAib2JqZWN0IiAmJiAvLyBvIGlzIGFuIG9iamVjdAogICAgaXNGaW5pdGUoby5sZW5ndGgpICYmIC8vIG8ubGVuZ3RoIGlzIGEgZmluaXRlIG51bWJlcgogICAgby5sZW5ndGggPj0gMCAmJiAvLyBvLmxlbmd0aCBpcyBub24tbmVnYXRpdmUKICAgIG8ubGVuZ3RoID09PSBNYXRoLmZsb29yKG8ubGVuZ3RoKSAmJiAvLyBvLmxlbmd0aCBpcyBhbiBpbnRlZ2VyCiAgICBvLmxlbmd0aCA8IDQyOTQ5NjcyOTYpCiAgICAgIHJldHVybiB0cnVlOwogICAgZWxzZQogICAgICByZXR1cm4gZmFsc2U7CiAgfQogIGZ1bmN0aW9uIGlzU29ydGFibGUobykgewogICAgaWYgKG8gJiYgLy8gbyBpcyBub3QgbnVsbCwgdW5kZWZpbmVkLCBldGMuCiAgICB0eXBlb2YgbyA9PT0gIm9iamVjdCIgJiYgLy8gbyBpcyBhbiBvYmplY3QKICAgIHR5cGVvZiBvLnNvcnQgPT09ICJmdW5jdGlvbiIpCiAgICAgIHJldHVybiB0cnVlOwogICAgZWxzZQogICAgICByZXR1cm4gZmFsc2U7CiAgfQogIHV0aWwkMS5pc1NvcnRhYmxlQXJyYXlMaWtlID0gZnVuY3Rpb24obykgewogICAgcmV0dXJuIGlzQXJyYXlMaWtlKG8pICYmIGlzU29ydGFibGUobyk7CiAgfTsKICB2YXIgY29tcGFyZSA9IHsKICAgIC8qKgogICAgICogQ29tcGFyZSB0d28gbnVtYmVycy4KICAgICAqCiAgICAgKiBAcGFyYW0ge051bWJlcn0gYQogICAgICogQHBhcmFtIHtOdW1iZXJ9IGIKICAgICAqIEByZXR1cm5zIHtOdW1iZXJ9IDEgaWYgYSA+IGIsIDAgaWYgYSA9IGIsIC0xIGlmIGEgPCBiCiAgICAgKi8KICAgIG51bWNtcDogZnVuY3Rpb24oYSwgYikgewogICAgICByZXR1cm4gYSAtIGI7CiAgICB9LAogICAgLyoqCiAgICAgKiBDb21wYXJlIHR3byBzdHJpbmdzLgogICAgICoKICAgICAqIEBwYXJhbSB7TnVtYmVyfFN0cmluZ30gYQogICAgICogQHBhcmFtIHtOdW1iZXJ8U3RyaW5nfSBiCiAgICAgKiBAcmV0dXJucyB7TnVtYmVyfSAxIGlmIGEgPiBiLCAwIGlmIGEgPSBiLCAtMSBpZiBhIDwgYgogICAgICovCiAgICBzdHJjbXA6IGZ1bmN0aW9uKGEsIGIpIHsKICAgICAgcmV0dXJuIGEgPCBiID8gLTEgOiBhID4gYiA/IDEgOiAwOwogICAgfQogIH07CiAgdmFyIGJpbmFyeSA9IHt9OwogIGZ1bmN0aW9uIGxvb3AoZGF0YSwgbWluLCBtYXgsIGluZGV4LCB2YWxwb3MpIHsKICAgIHZhciBjdXJyID0gbWF4ICsgbWluID4+PiAxOwogICAgdmFyIGRpZmYgPSB0aGlzLmNvbXBhcmUoZGF0YVtjdXJyXVt0aGlzLmluZGV4XSwgaW5kZXgpOwogICAgaWYgKCFkaWZmKSB7CiAgICAgIHJldHVybiB2YWxwb3NbaW5kZXhdID0gewogICAgICAgICJmb3VuZCI6IHRydWUsCiAgICAgICAgImluZGV4IjogY3VyciwKICAgICAgICAicHJldiI6IG51bGwsCiAgICAgICAgIm5leHQiOiBudWxsCiAgICAgIH07CiAgICB9CiAgICBpZiAobWluID49IG1heCkgewogICAgICByZXR1cm4gdmFscG9zW2luZGV4XSA9IHsKICAgICAgICAiZm91bmQiOiBmYWxzZSwKICAgICAgICAiaW5kZXgiOiBudWxsLAogICAgICAgICJwcmV2IjogZGlmZiA8IDAgPyBtYXggOiBtYXggLSAxLAogICAgICAgICJuZXh0IjogZGlmZiA8IDAgPyBtYXggKyAxIDogbWF4CiAgICAgIH07CiAgICB9CiAgICBpZiAoZGlmZiA+IDApCiAgICAgIHJldHVybiBsb29wLmNhbGwodGhpcywgZGF0YSwgbWluLCBjdXJyIC0gMSwgaW5kZXgsIHZhbHBvcyk7CiAgICBlbHNlCiAgICAgIHJldHVybiBsb29wLmNhbGwodGhpcywgZGF0YSwgY3VyciArIDEsIG1heCwgaW5kZXgsIHZhbHBvcyk7CiAgfQogIGZ1bmN0aW9uIHNlYXJjaChpbmRleCkgewogICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7CiAgICByZXR1cm4gbG9vcC5jYWxsKHRoaXMsIGRhdGEsIDAsIGRhdGEubGVuZ3RoIC0gMSwgaW5kZXgsIHRoaXMudmFscG9zKTsKICB9CiAgYmluYXJ5LnNlYXJjaCA9IHNlYXJjaDsKICB2YXIgdXRpbCA9IHV0aWwkMSwgY21wID0gY29tcGFyZSwgYmluID0gYmluYXJ5OwogIHZhciBsaWIgPSBJbmRleGVkQXJyYXk7CiAgZnVuY3Rpb24gSW5kZXhlZEFycmF5KGRhdGEsIGluZGV4KSB7CiAgICBpZiAoIXV0aWwuaXNTb3J0YWJsZUFycmF5TGlrZShkYXRhKSkKICAgICAgdGhyb3cgbmV3IEVycm9yKCJJbnZhbGlkIGRhdGEiKTsKICAgIGlmICghaW5kZXggfHwgZGF0YS5sZW5ndGggPiAwICYmICEoaW5kZXggaW4gZGF0YVswXSkpCiAgICAgIHRocm93IG5ldyBFcnJvcigiSW52YWxpZCBpbmRleCIpOwogICAgdGhpcy5kYXRhID0gZGF0YTsKICAgIHRoaXMuaW5kZXggPSBpbmRleDsKICAgIHRoaXMuc2V0Qm91bmRhcmllcygpOwogICAgdGhpcy5jb21wYXJlID0gdHlwZW9mIHRoaXMubWludiA9PT0gIm51bWJlciIgPyBjbXAubnVtY21wIDogY21wLnN0cmNtcDsKICAgIHRoaXMuc2VhcmNoID0gYmluLnNlYXJjaDsKICAgIHRoaXMudmFscG9zID0ge307CiAgICB0aGlzLmN1cnNvciA9IG51bGw7CiAgICB0aGlzLm5leHRsb3cgPSBudWxsOwogICAgdGhpcy5uZXh0aGlnaCA9IG51bGw7CiAgfQogIEluZGV4ZWRBcnJheS5wcm90b3R5cGUuc2V0Q29tcGFyZSA9IGZ1bmN0aW9uKGZuKSB7CiAgICBpZiAodHlwZW9mIGZuICE9PSAiZnVuY3Rpb24iKQogICAgICB0aHJvdyBuZXcgRXJyb3IoIkludmFsaWQgYXJndW1lbnQiKTsKICAgIHRoaXMuY29tcGFyZSA9IGZuOwogICAgcmV0dXJuIHRoaXM7CiAgfTsKICBJbmRleGVkQXJyYXkucHJvdG90eXBlLnNldFNlYXJjaCA9IGZ1bmN0aW9uKGZuKSB7CiAgICBpZiAodHlwZW9mIGZuICE9PSAiZnVuY3Rpb24iKQogICAgICB0aHJvdyBuZXcgRXJyb3IoIkludmFsaWQgYXJndW1lbnQiKTsKICAgIHRoaXMuc2VhcmNoID0gZm47CiAgICByZXR1cm4gdGhpczsKICB9OwogIEluZGV4ZWRBcnJheS5wcm90b3R5cGUuc29ydCA9IGZ1bmN0aW9uKCkgewogICAgdmFyIHNlbGYyID0gdGhpcywgaW5kZXggPSB0aGlzLmluZGV4OwogICAgdGhpcy5kYXRhLnNvcnQoZnVuY3Rpb24oYSwgYikgewogICAgICByZXR1cm4gc2VsZjIuY29tcGFyZShhW2luZGV4XSwgYltpbmRleF0pOwogICAgfSk7CiAgICB0aGlzLnNldEJvdW5kYXJpZXMoKTsKICAgIHJldHVybiB0aGlzOwogIH07CiAgSW5kZXhlZEFycmF5LnByb3RvdHlwZS5zZXRCb3VuZGFyaWVzID0gZnVuY3Rpb24oKSB7CiAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YSwgaW5kZXggPSB0aGlzLmluZGV4OwogICAgdGhpcy5taW52ID0gZGF0YS5sZW5ndGggJiYgZGF0YVswXVtpbmRleF07CiAgICB0aGlzLm1heHYgPSBkYXRhLmxlbmd0aCAmJiBkYXRhW2RhdGEubGVuZ3RoIC0gMV1baW5kZXhdOwogICAgcmV0dXJuIHRoaXM7CiAgfTsKICBJbmRleGVkQXJyYXkucHJvdG90eXBlLmZldGNoID0gZnVuY3Rpb24odmFsdWUpIHsKICAgIGlmICh0aGlzLmRhdGEubGVuZ3RoID09PSAwKSB7CiAgICAgIHRoaXMuY3Vyc29yID0gbnVsbDsKICAgICAgdGhpcy5uZXh0bG93ID0gbnVsbDsKICAgICAgdGhpcy5uZXh0aGlnaCA9IG51bGw7CiAgICAgIHJldHVybiB0aGlzOwogICAgfQogICAgaWYgKHRoaXMuY29tcGFyZSh2YWx1ZSwgdGhpcy5taW52KSA9PT0gLTEpIHsKICAgICAgdGhpcy5jdXJzb3IgPSBudWxsOwogICAgICB0aGlzLm5leHRsb3cgPSBudWxsOwogICAgICB0aGlzLm5leHRoaWdoID0gMDsKICAgICAgcmV0dXJuIHRoaXM7CiAgICB9CiAgICBpZiAodGhpcy5jb21wYXJlKHZhbHVlLCB0aGlzLm1heHYpID09PSAxKSB7CiAgICAgIHRoaXMuY3Vyc29yID0gbnVsbDsKICAgICAgdGhpcy5uZXh0bG93ID0gdGhpcy5kYXRhLmxlbmd0aCAtIDE7CiAgICAgIHRoaXMubmV4dGhpZ2ggPSBudWxsOwogICAgICByZXR1cm4gdGhpczsKICAgIH0KICAgIHZhciB2YWxwb3MgPSB0aGlzLnZhbHBvcywgcG9zID0gdmFscG9zW3ZhbHVlXTsKICAgIGlmIChwb3MpIHsKICAgICAgaWYgKHBvcy5mb3VuZCkgewogICAgICAgIHRoaXMuY3Vyc29yID0gcG9zLmluZGV4OwogICAgICAgIHRoaXMubmV4dGxvdyA9IG51bGw7CiAgICAgICAgdGhpcy5uZXh0aGlnaCA9IG51bGw7CiAgICAgIH0gZWxzZSB7CiAgICAgICAgdGhpcy5jdXJzb3IgPSBudWxsOwogICAgICAgIHRoaXMubmV4dGxvdyA9IHBvcy5wcmV2OwogICAgICAgIHRoaXMubmV4dGhpZ2ggPSBwb3MubmV4dDsKICAgICAgfQogICAgICByZXR1cm4gdGhpczsKICAgIH0KICAgIHZhciByZXN1bHQgPSB0aGlzLnNlYXJjaC5jYWxsKHRoaXMsIHZhbHVlKTsKICAgIHRoaXMuY3Vyc29yID0gcmVzdWx0LmluZGV4OwogICAgdGhpcy5uZXh0bG93ID0gcmVzdWx0LnByZXY7CiAgICB0aGlzLm5leHRoaWdoID0gcmVzdWx0Lm5leHQ7CiAgICByZXR1cm4gdGhpczsKICB9OwogIEluZGV4ZWRBcnJheS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24odmFsdWUpIHsKICAgIGlmICh2YWx1ZSkKICAgICAgdGhpcy5mZXRjaCh2YWx1ZSk7CiAgICB2YXIgcG9zID0gdGhpcy5jdXJzb3I7CiAgICByZXR1cm4gcG9zICE9PSBudWxsID8gdGhpcy5kYXRhW3Bvc10gOiBudWxsOwogIH07CiAgSW5kZXhlZEFycmF5LnByb3RvdHlwZS5nZXRSYW5nZSA9IGZ1bmN0aW9uKGJlZ2luLCBlbmQpIHsKICAgIGlmICh0aGlzLmNvbXBhcmUoYmVnaW4sIGVuZCkgPT09IDEpIHsKICAgICAgcmV0dXJuIFtdOwogICAgfQogICAgdGhpcy5mZXRjaChiZWdpbik7CiAgICB2YXIgc3RhcnQgPSB0aGlzLmN1cnNvciB8fCB0aGlzLm5leHRoaWdoOwogICAgdGhpcy5mZXRjaChlbmQpOwogICAgdmFyIGZpbmlzaCA9IHRoaXMuY3Vyc29yIHx8IHRoaXMubmV4dGxvdzsKICAgIGlmIChzdGFydCA9PT0gbnVsbCB8fCBmaW5pc2ggPT09IG51bGwpIHsKICAgICAgcmV0dXJuIFtdOwogICAgfQogICAgcmV0dXJuIHRoaXMuZGF0YS5zbGljZShzdGFydCwgZmluaXNoICsgMSk7CiAgfTsKICB2YXIgSW5kZXhlZEFycmF5JDEgPSAvKiBAX19QVVJFX18gKi8gZ2V0RGVmYXVsdEV4cG9ydEZyb21DanMobGliKTsKICBjb25zdCBTRUNPTkQgPSAxZTM7CiAgY29uc3QgTUlOVVRFID0gU0VDT05EICogNjA7CiAgY29uc3QgTUlOVVRFMyA9IE1JTlVURSAqIDM7CiAgY29uc3QgTUlOVVRFNSA9IE1JTlVURSAqIDU7CiAgY29uc3QgTUlOVVRFMTUgPSBNSU5VVEUgKiAxNTsKICBjb25zdCBNSU5VVEUzMCA9IE1JTlVURSAqIDMwOwogIGNvbnN0IEhPVVIgPSBNSU5VVEUgKiA2MDsKICBjb25zdCBIT1VSNCA9IEhPVVIgKiA0OwogIGNvbnN0IEhPVVIxMiA9IEhPVVIgKiAxMjsKICBjb25zdCBEQVkgPSBIT1VSICogMjQ7CiAgY29uc3QgV0VFSyA9IERBWSAqIDc7CiAgY29uc3QgTU9OVEggPSBXRUVLICogNDsKICBjb25zdCBZRUFSID0gREFZICogMzY1OwogIGNvbnN0IE1PTlRITUFQID0gWwogICAgIkphbiIsCiAgICAiRmViIiwKICAgICJNYXIiLAogICAgIkFwciIsCiAgICAiTWF5IiwKICAgICJKdW4iLAogICAgIkp1bCIsCiAgICAiQXVnIiwKICAgICJTZXAiLAogICAgIk9jdCIsCiAgICAiTm92IiwKICAgICJEZWMiCiAgXTsKICBjb25zdCBUSU1FU0NBTEVTID0gWwogICAgWUVBUiAqIDEwLAogICAgWUVBUiAqIDUsCiAgICBZRUFSICogMywKICAgIFlFQVIgKiAyLAogICAgWUVBUiwKICAgIE1PTlRIICogNiwKICAgIE1PTlRIICogNCwKICAgIE1PTlRIICogMywKICAgIE1PTlRIICogMiwKICAgIE1PTlRILAogICAgREFZICogMTUsCiAgICBEQVkgKiAxMCwKICAgIERBWSAqIDcsCiAgICBEQVkgKiA1LAogICAgREFZICogMywKICAgIERBWSAqIDIsCiAgICBEQVksCiAgICBIT1VSICogMTIsCiAgICBIT1VSICogNiwKICAgIEhPVVIgKiAzLAogICAgSE9VUiAqIDEuNSwKICAgIEhPVVIsCiAgICBNSU5VVEUzMCwKICAgIE1JTlVURTE1LAogICAgTUlOVVRFICogMTAsCiAgICBNSU5VVEU1LAogICAgTUlOVVRFICogMiwKICAgIE1JTlVURQogIF07CiAgY29uc3QgJFNDQUxFUyA9IFswLjA1LCAwLjEsIDAuMiwgMC4yNSwgMC41LCAwLjgsIDEsIDIsIDVdOwogIGNvbnN0IENPTE9SUyA9IHsKICAgIGJhY2s6ICIjMTQxNTFjIiwKICAgIC8vIEJhY2tncm91bmQgY29sb3IKICAgIGdyaWQ6ICIjMjUyNzMyIiwKICAgIC8vIEdyaWQgY29sb3IKICAgIHRleHQ6ICIjYWRhZGFkIiwKICAgIC8vIFJlZ3VsYXIgdGV4dCBjb2xvcgogICAgdGV4dEhMOiAiI2RlZGRkZCIsCiAgICAvLyBIaWdobGlnaHRlZCB0ZXh0IGNvbG9yCiAgICB0ZXh0TEc6ICIjYzRjNGM0IiwKICAgIC8vIExlZ2VuZCB0ZXh0IGNvbG9yCiAgICBsbFZhbHVlOiAiIzgxODk4OSIsCiAgICAvLyBMZWdlbmQgdmFsdWUgY29sb3IKICAgIGxsQmFjazogIiMxNDE1MWM3NyIsCiAgICAvLyBMZWdlbmQgYmFyIGJhY2tncm91bmQKICAgIGxsU2VsZWN0OiAiIzJkN2IyZiIsCiAgICAvLyBMZWdlbmQgc2VsZWN0IGJvcmRlcgogICAgc2NhbGU6ICIjNjA2MDYwIiwKICAgIC8vIFNjYWxlIGVkZ2UgY29sb3IKICAgIGNyb3NzOiAiIzgwOTFhMCIsCiAgICAvLyBDcm9zc2hhaXIgY29sb3IKICAgIGNhbmRsZVVwOiAiIzQxYTM3NiIsCiAgICAvLyAiR3JlZW4iIGNhbmRsZSBjb2xvcgogICAgY2FuZGxlRHc6ICIjZGU0NjQ2IiwKICAgIC8vICJSZWQiIGNhbmRsZSBjb2xvcgogICAgd2lja1VwOiAiIzIzYTc3Njg4IiwKICAgIC8vICJHcmVlbiIgd2ljayBjb2xvcgogICAgd2lja0R3OiAiI2U1NDE1MDg4IiwKICAgIC8vICJSZWQiIHdpY2sgY29sb3IKICAgIHZvbFVwOiAiIzQxYTM3NjgyIiwKICAgIC8vICJHcmVlbiIgdm9sdW1lIGNvbG9yCiAgICB2b2xEdzogIiNkZTQ2NDY4MiIsCiAgICAvLyAiUmVkIiB2b2x1bWUgY29sb3IKICAgIHBhbmVsOiAiIzJhMmYzOCIsCiAgICAvLyBTY2FsZSBwYW5lbCBjb2xvcgogICAgdGJCYWNrOiB2b2lkIDAsCiAgICAvLyBUb29sYmFyIGJhY2tncm91bmQKICAgIHRiQm9yZGVyOiAiIzgyODI4MjdkIgogICAgLy8gVG9vbGJhciBib3JkZXIgY29sb3IKICB9OwogIGNvbnN0IENoYXJ0Q29uZmlnID0gewogICAgU0JNSU46IDYwLAogICAgLy8gTWluaW1hbCBzaWRlYmFyLCBweAogICAgU0JNQVg6IEluZmluaXR5LAogICAgLy8gTWF4IHNpZGViYXIsIHB4CiAgICBUT09MQkFSOiA1NywKICAgIC8vIFRvb2xiYXIgd2lkdGgsIHB4CiAgICBUQl9JQ09OOiAyNSwKICAgIC8vIFRvb2xiYXIgaWNvbiBzaXplLCBweAogICAgVEJfSVRFTV9NOiA2LAogICAgLy8gVG9vbGJhciBpdGVtIG1hcmdpbiwgcHgKICAgIFRCX0lDT05fQlJJOiAxLAogICAgLy8gVG9vbGJhciBpY29uIGJyaWdodG5lc3MKICAgIFRCX0lDT05fSE9MRDogNDIwLAogICAgLy8gV2FpdCB0byBleHBhbmQsIG1zCiAgICBUQl9CT1JERVI6IDEsCiAgICAvLyBUb29sYmFyIGJvcmRlciwgcHgKICAgIFRCX0JfU1RZTEU6ICJkb3R0ZWQiLAogICAgLy8gVG9vbGJhciBib3JkZXIgc3R5bGUKICAgIFRPT0xfQ09MTDogNywKICAgIC8vIFRvb2wgY29sbGlzaW9uIHRocmVzaG9sZAogICAgUElOX1JBRElVUzogNS41LAogICAgLy8gVG9vbCBwaW4gcmFkaXVzCiAgICBFWFBBTkQ6IDAuMTUsCiAgICAvLyBFeHBhbmQgeS1yYW5nZSwgJS8xMDAgb2YgcmFuZ2UKICAgIENBTkRMRVc6IDAuNywKICAgIC8vIENhbmRsZSB3aWR0aCwgJS8xMDAgb2Ygc3RlcAogICAgR1JJRFg6IDEwMCwKICAgIC8vIEdyaWQgeC1zdGVwIHRhcmdldCwgcHgKICAgIEdSSURZOiA0NywKICAgIC8vIEdyaWQgeS1zdGVwIHRhcmdldCwgcHgKICAgIEJPVEJBUjogMjgsCiAgICAvLyBCb3R0b20gYmFyIGhlaWdodCwgcHgKICAgIFBBTkhFSUdIVDogMjIsCiAgICAvLyBTY2FsZSBwYW5lbCBoZWlnaHQsIHB4CiAgICBERUZBVUxUX0xFTjogNTAsCiAgICAvLyBTdGFydGluZyByYW5nZSwgY2FuZGxlcwogICAgTUlOSU1VTV9MRU46IDUsCiAgICAvLyBNaW5pbWFsIHN0YXJ0aW5nIHJhbmdlLCBjYW5kbGVzCiAgICBNSU5fWk9PTTogNSwKICAgIC8vIE1pbmltYWwgem9vbSwgY2FuZGxlcwogICAgTUFYX1pPT006IDVlMywKICAgIC8vIE1heGltYWwgem9vbSwgY2FuZGxlcywKICAgIFZPTFNDQUxFOiAwLjE1LAogICAgLy8gVm9sdW1lIGJhcnMgaGVpZ2h0LCAlLzEwMCBvZiBsYXlvdXQuaGVpZ2h0CiAgICBVWF9PUEFDSVRZOiAwLjksCiAgICAvLyBVeCBiYWNrZ3JvdW5kIG9wYWNpdHkKICAgIFpPT01fTU9ERTogInR2IiwKICAgIC8vIFpvb20gbW9kZSwgJ3R2JyBvciAndGwnCiAgICBMX0JUTl9TSVpFOiAyMSwKICAgIC8vIExlZ2VuZCBCdXR0b24gc2l6ZSwgcHgKICAgIExfQlROX01BUkdJTjogIi02cHggMCAtNnB4IDAiLAogICAgLy8gY3NzIG1hcmdpbgogICAgU0NST0xMX1dIRUVMOiAicHJldmVudCIsCiAgICAvLyBTY3JvbGwgd2hlZWwgbW9yZGUsICdwcmV2ZW50JywgJ3Bhc3MnLCAnY2xpY2snLAogICAgUVVBTlRJWkVfQUZURVI6IDAsCiAgICAvLyBRdWFudGl6ZSBjdXJzb3IgYWZ0ZXIsIG1zCiAgICBBVVRPX1BSRV9TQU1QTEU6IDEwLAogICAgLy8gU2FtcGxlIHNpemUgZm9yIGF1dG8tcHJlY2lzaW9uCiAgICBDQU5ETEVfVElNRTogdHJ1ZQogICAgLy8gU2hvdyByZW1haW5pbmcgY2FuZGxlIHRpbWUgCiAgfTsKICBDaGFydENvbmZpZy5GT05UID0gYDExcHggLWFwcGxlLXN5c3RlbSxCbGlua01hY1N5c3RlbUZvbnQsCiAgICBTZWdvZSBVSSxSb2JvdG8sT3h5Z2VuLFVidW50dSxDYW50YXJlbGwsCiAgICBGaXJhIFNhbnMsRHJvaWQgU2FucyxIZWx2ZXRpY2EgTmV1ZSwKICAgIHNhbnMtc2VyaWZgOwogIGNvbnN0IElCX1RGX1dBUk4gPSAiV2hlbiB1c2luZyBJQiBtb2RlIHlvdSBzaG91bGQgc3BlY2lmeSB0aW1lZnJhbWUgKCd0ZicgZmlsZWQgaW4gJ2NoYXJ0JyBvYmplY3QpLG90aGVyd2lzZSB5b3UgY2FuIGdldCBhbiB1bmV4cGVjdGVkIGJlaGF2aW91ciI7CiAgY29uc3QgTUFQX1VOSVQgPSB7CiAgICAiMXMiOiBTRUNPTkQsCiAgICAiNXMiOiBTRUNPTkQgKiA1LAogICAgIjEwcyI6IFNFQ09ORCAqIDEwLAogICAgIjIwcyI6IFNFQ09ORCAqIDIwLAogICAgIjMwcyI6IFNFQ09ORCAqIDMwLAogICAgIjFtIjogTUlOVVRFLAogICAgIjNtIjogTUlOVVRFMywKICAgICI1bSI6IE1JTlVURTUsCiAgICAiMTVtIjogTUlOVVRFMTUsCiAgICAiMzBtIjogTUlOVVRFMzAsCiAgICAiMUgiOiBIT1VSLAogICAgIjJIIjogSE9VUiAqIDIsCiAgICAiM0giOiBIT1VSICogMywKICAgICI0SCI6IEhPVVI0LAogICAgIjEySCI6IEhPVVIxMiwKICAgICIxRCI6IERBWSwKICAgICIxVyI6IFdFRUssCiAgICAiMU0iOiBNT05USCwKICAgICIxWSI6IFlFQVIsCiAgICAvLyBMb3dlciBjYXNlIHZhcmlhbnRzCiAgICAiMWgiOiBIT1VSLAogICAgIjJoIjogSE9VUiAqIDIsCiAgICAiM2giOiBIT1VSICogMywKICAgICI0aCI6IEhPVVI0LAogICAgIjEyaCI6IEhPVVIxMiwKICAgICIxZCI6IERBWSwKICAgICIxdyI6IFdFRUssCiAgICAiMXkiOiBZRUFSCiAgfTsKICBjb25zdCBIUFggPSAtMC41OwogIHZhciBDb25zdCA9IHsKICAgIFNFQ09ORCwKICAgIE1JTlVURSwKICAgIE1JTlVURTUsCiAgICBNSU5VVEUxNSwKICAgIE1JTlVURTMwLAogICAgSE9VUiwKICAgIEhPVVI0LAogICAgREFZLAogICAgV0VFSywKICAgIE1PTlRILAogICAgWUVBUiwKICAgIE1PTlRITUFQLAogICAgVElNRVNDQUxFUywKICAgICRTQ0FMRVMsCiAgICBDaGFydENvbmZpZywKICAgIE1BUF9VTklULAogICAgSUJfVEZfV0FSTiwKICAgIENPTE9SUywKICAgIEhQWAogIH07CiAgdmFyIFV0aWxzID0gewogICAgY2xhbXAobnVtLCBtaW4sIG1heCkgewogICAgICByZXR1cm4gbnVtIDw9IG1pbiA/IG1pbiA6IG51bSA+PSBtYXggPyBtYXggOiBudW07CiAgICB9LAogICAgYWRkWmVybyhpKSB7CiAgICAgIGlmIChpIDwgMTApIHsKICAgICAgICBpID0gIjAiICsgaTsKICAgICAgfQogICAgICByZXR1cm4gaTsKICAgIH0sCiAgICAvLyBTdGFydCBvZiB0aGUgZGF5ICh6ZXJvIG1pbGxpc2Vjb25kKQogICAgZGF5U3RhcnQodCkgewogICAgICBjb25zdCBzdGFydCA9IG5ldyBEYXRlKHQpOwogICAgICByZXR1cm4gc3RhcnQuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7CiAgICB9LAogICAgLy8gU3RhcnQgb2YgdGhlIG1vbnRoCiAgICBtb250aFN0YXJ0KHQpIHsKICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHQpOwogICAgICByZXR1cm4gRGF0ZS5VVEMoCiAgICAgICAgZGF0ZS5nZXRGdWxsWWVhcigpLAogICAgICAgIGRhdGUuZ2V0TW9udGgoKSwKICAgICAgICAxCiAgICAgICk7CiAgICB9LAogICAgLy8gU3RhcnQgb2YgdGhlIHllYXIKICAgIHllYXJTdGFydCh0KSB7CiAgICAgIHJldHVybiBEYXRlLlVUQyhuZXcgRGF0ZSh0KS5nZXRGdWxsWWVhcigpKTsKICAgIH0sCiAgICBnZXRZZWFyKHQpIHsKICAgICAgaWYgKCF0KQogICAgICAgIHJldHVybiB2b2lkIDA7CiAgICAgIHJldHVybiBuZXcgRGF0ZSh0KS5nZXRVVENGdWxsWWVhcigpOwogICAgfSwKICAgIGdldE1vbnRoKHQpIHsKICAgICAgaWYgKCF0KQogICAgICAgIHJldHVybiB2b2lkIDA7CiAgICAgIHJldHVybiBuZXcgRGF0ZSh0KS5nZXRVVENNb250aCgpOwogICAgfSwKICAgIC8vIE5lYXJlc3QgaW4gYXJyYXkKICAgIG5lYXJlc3RBKHgsIGFycmF5KSB7CiAgICAgIGxldCBkaXN0ID0gSW5maW5pdHk7CiAgICAgIGxldCB2YWwgPSBudWxsOwogICAgICBsZXQgaW5kZXggPSAtMTsKICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykgewogICAgICAgIHZhciB4aSA9IGFycmF5W2ldOwogICAgICAgIGlmIChNYXRoLmFicyh4aSAtIHgpIDwgZGlzdCkgewogICAgICAgICAgZGlzdCA9IE1hdGguYWJzKHhpIC0geCk7CiAgICAgICAgICB2YWwgPSB4aTsKICAgICAgICAgIGluZGV4ID0gaTsKICAgICAgICB9CiAgICAgIH0KICAgICAgcmV0dXJuIFtpbmRleCwgdmFsXTsKICAgIH0sCiAgICAvLyBOZWFyZXN0IHZhbHVlIGJ5IHRpbWUgKGluIHRpbWVzZXJpZXMpCiAgICBuZWFyZXN0VHModCwgdHMpIHsKICAgICAgbGV0IGRpc3QgPSBJbmZpbml0eTsKICAgICAgbGV0IHZhbCA9IG51bGw7CiAgICAgIGxldCBpbmRleCA9IC0xOwogICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRzLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgdmFyIHRpID0gdHNbaV1bMF07CiAgICAgICAgaWYgKE1hdGguYWJzKHRpIC0gdCkgPCBkaXN0KSB7CiAgICAgICAgICBkaXN0ID0gTWF0aC5hYnModGkgLSB0KTsKICAgICAgICAgIHZhbCA9IHRzW2ldOwogICAgICAgICAgaW5kZXggPSBpOwogICAgICAgIH0KICAgICAgfQogICAgICByZXR1cm4gW2luZGV4LCB2YWxdOwogICAgfSwKICAgIC8vIE5lYXJlc3QgdmFsdWUgYnkgaW5kZXggKGluIHRpbWVzZXJpZXMpCiAgICBuZWFyZXN0VHNJYihpLCB0cywgb2Zmc2V0KSB7CiAgICAgIGNvbnN0IGluZGV4ID0gTWF0aC5mbG9vcihpIC0gb2Zmc2V0KSArIDE7CiAgICAgIGNvbnN0IHZhbCA9IHRzW2luZGV4XSB8fCBudWxsOwogICAgICByZXR1cm4gW2luZGV4LCB2YWxdOwogICAgfSwKICAgIHJvdW5kKG51bSwgZGVjaW1hbHMgPSA4KSB7CiAgICAgIHJldHVybiBwYXJzZUZsb2F0KG51bS50b0ZpeGVkKGRlY2ltYWxzKSk7CiAgICB9LAogICAgLy8gU3RyaXA/IE5vLCBpdCdzIHVnbHkgZmxvYXRzIGluIGpzCiAgICBzdHJpcChudW1iZXIpIHsKICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoCiAgICAgICAgcGFyc2VGbG9hdChudW1iZXIpLnRvUHJlY2lzaW9uKDEyKQogICAgICApOwogICAgfSwKICAgIGdldERheSh0KSB7CiAgICAgIHJldHVybiB0ID8gbmV3IERhdGUodCkuZ2V0RGF0ZSgpIDogbnVsbDsKICAgIH0sCiAgICAvLyBVcGRhdGUgYXJyYXkga2VlcGluZyB0aGUgc2FtZSByZWZlcmVuY2UKICAgIG92ZXJ3cml0ZShhcnIsIG5ld19hcnIpIHsKICAgICAgYXJyLnNwbGljZSgwLCBhcnIubGVuZ3RoLCAuLi5uZXdfYXJyKTsKICAgIH0sCiAgICAvLyBHZXQgZnVsbCBsaXN0IG9mIG92ZXJsYXlzIG9uIGFsbCBwYW5lcwogICAgYWxsT3ZlcmxheXMocGFuZXMgPSBbXSkgewogICAgICByZXR1cm4gcGFuZXMubWFwKCh4KSA9PiB4Lm92ZXJsYXlzIHx8IFtdKS5mbGF0KCk7CiAgICB9LAogICAgLy8gRGV0ZWN0cyBhIHRpbWVmcmFtZSBvZiB0aGUgZGF0YQogICAgZGV0ZWN0VGltZWZyYW1lKGRhdGEpIHsKICAgICAgY29uc3QgbGVuID0gTWF0aC5taW4oZGF0YS5sZW5ndGggLSAxLCA5OSk7CiAgICAgIGxldCBtaW4gPSBJbmZpbml0eTsKICAgICAgZGF0YS5zbGljZSgwLCBsZW4pLmZvckVhY2goKHgsIGkpID0+IHsKICAgICAgICBjb25zdCBkID0gZGF0YVtpICsgMV1bMF0gLSB4WzBdOwogICAgICAgIGlmIChkID09PSBkICYmIGQgPCBtaW4pCiAgICAgICAgICBtaW4gPSBkOwogICAgICB9KTsKICAgICAgaWYgKG1pbiA+PSBDb25zdC5NT05USCAmJiBtaW4gPD0gQ29uc3QuREFZICogMzApIHsKICAgICAgICByZXR1cm4gQ29uc3QuREFZICogMzE7CiAgICAgIH0KICAgICAgcmV0dXJuIG1pbjsKICAgIH0sCiAgICAvLyBGYXN0IGZpbHRlci4gUmVhbGx5IGZhc3QsIGxpa2UgMTBYCiAgICBmYXN0RmlsdGVyKGFyciwgdDEsIHQyKSB7CiAgICAgIGlmICghYXJyLmxlbmd0aCkKICAgICAgICByZXR1cm4gW2Fyciwgdm9pZCAwXTsKICAgICAgdHJ5IHsKICAgICAgICBjb25zdCBpYSA9IG5ldyBJbmRleGVkQXJyYXkkMShhcnIsICIwIik7CiAgICAgICAgY29uc3QgcmVzID0gaWEuZ2V0UmFuZ2UodDEsIHQyKTsKICAgICAgICBjb25zdCBpMCA9IGlhLnZhbHBvc1t0MV0ubmV4dDsKICAgICAgICByZXR1cm4gW3JlcywgaTBdOwogICAgICB9IGNhdGNoIChlKSB7CiAgICAgICAgcmV0dXJuIFthcnIuZmlsdGVyKAogICAgICAgICAgKHgpID0+IHhbMF0gPj0gdDEgJiYgeFswXSA8PSB0MgogICAgICAgICksIDBdOwogICAgICB9CiAgICB9LAogICAgLy8gRmFzdCBmaWx0ZXIgMiAocmV0dXJucyBpbmRpY2VzKQogICAgZmFzdEZpbHRlcjIoYXJyLCB0MSwgdDIpIHsKICAgICAgaWYgKCFhcnIubGVuZ3RoKQogICAgICAgIHJldHVybiBbYXJyLCB2b2lkIDBdOwogICAgICB0cnkgewogICAgICAgIGNvbnN0IGlhID0gbmV3IEluZGV4ZWRBcnJheSQxKGFyciwgIjAiKTsKICAgICAgICBpYS5mZXRjaCh0MSk7CiAgICAgICAgY29uc3Qgc3RhcnQgPSBpYS5jdXJzb3IgfHwgaWEubmV4dGhpZ2g7CiAgICAgICAgaWEuZmV0Y2godDIpOwogICAgICAgIGNvbnN0IGZpbmlzaCA9IGlhLmN1cnNvciB8fCBpYS5uZXh0bG93OwogICAgICAgIHJldHVybiBbc3RhcnQsIGZpbmlzaCArIDFdOwogICAgICB9IGNhdGNoIChlKSB7CiAgICAgICAgY29uc3Qgc3Vic2V0ID0gYXJyLmZpbHRlcigKICAgICAgICAgICh4KSA9PiB4WzBdID49IHQxICYmIHhbMF0gPD0gdDIKICAgICAgICApOwogICAgICAgIGNvbnN0IGkxID0gYXJyLmluZGV4T2Yoc3Vic2V0WzBdKTsKICAgICAgICBjb25zdCBpMiA9IGFyci5pbmRleE9mKHN1YnNldFtzdWJzZXQubGVuZ3RoIC0gMV0pOwogICAgICAgIHJldHVybiBbaTEsIGkyXTsKICAgICAgfQogICAgfSwKICAgIC8vIEZhc3QgZmlsdGVyIChpbmRleC1iYXNlZCkKICAgIGZhc3RGaWx0ZXJJQihhcnIsIHQxLCB0MikgewogICAgICBpZiAoIWFyci5sZW5ndGgpCiAgICAgICAgcmV0dXJuIFt2b2lkIDAsIHZvaWQgMF07CiAgICAgIGxldCBpMSA9IE1hdGguZmxvb3IodDEpOwogICAgICBpZiAoaTEgPCAwKQogICAgICAgIGkxID0gMDsKICAgICAgY29uc3QgaTIgPSBNYXRoLmZsb29yKHQyICsgMSk7CiAgICAgIHJldHVybiBbaTEsIGkyXTsKICAgIH0sCiAgICAvLyBOZWFyZXN0IGluZGV4ZXMgKGxlZnQgYW5kIHJpZ2h0KQogICAgZmFzdE5lYXJlc3QoYXJyLCB0MSkgewogICAgICBjb25zdCBpYSA9IG5ldyBJbmRleGVkQXJyYXkkMShhcnIsICIwIik7CiAgICAgIGlhLmZldGNoKHQxKTsKICAgICAgcmV0dXJuIFtpYS5uZXh0bG93LCBpYS5uZXh0aGlnaF07CiAgICB9LAogICAgbm93KCkgewogICAgICByZXR1cm4gKC8qIEBfX1BVUkVfXyAqLyBuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7CiAgICB9LAogICAgcGF1c2UoZGVsYXkpIHsKICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChycykgPT4gc2V0VGltZW91dChycywgZGVsYXkpKTsKICAgIH0sCiAgICAvLyBMaW1pdCBjcmF6eSB3aGVlbCBkZWx0YSB2YWx1ZXMKICAgIHNtYXJ0V2hlZWwoZGVsdGEpIHsKICAgICAgY29uc3QgYWJzID0gTWF0aC5hYnMoZGVsdGEpOwogICAgICBpZiAoYWJzID4gNTAwKSB7CiAgICAgICAgcmV0dXJuICgyMDAgKyBNYXRoLmxvZyhhYnMpKSAqIE1hdGguc2lnbihkZWx0YSk7CiAgICAgIH0KICAgICAgcmV0dXJuIGRlbHRhOwogICAgfSwKICAgIC8vIFBhcnNlIHRoZSBvcmlnaW5hbCBtb3VzZSBldmVudCB0byBmaW5kIGRlbHRhWAogICAgZ2V0RGVsdGFYKGV2ZW50KSB7CiAgICAgIHJldHVybiBldmVudC5vcmlnaW5hbEV2ZW50LmRlbHRhWCAvIDEyOwogICAgfSwKICAgIC8vIFBhcnNlIHRoZSBvcmlnaW5hbCBtb3VzZSBldmVudCB0byBmaW5kIGRlbHRhWQogICAgZ2V0RGVsdGFZKGV2ZW50KSB7CiAgICAgIHJldHVybiBldmVudC5vcmlnaW5hbEV2ZW50LmRlbHRhWSAvIDEyOwogICAgfSwKICAgIC8vIEFwcGx5IG9wYWNpdHkgdG8gYSBoZXggY29sb3IKICAgIGFwcGx5T3BhY2l0eShjLCBvcCkgewogICAgICBpZiAoYy5sZW5ndGggPT09IDcpIHsKICAgICAgICBsZXQgbiA9IE1hdGguZmxvb3Iob3AgKiAyNTUpOwogICAgICAgIG4gPSB0aGlzLmNsYW1wKG4sIDAsIDI1NSk7CiAgICAgICAgYyArPSBuLnRvU3RyaW5nKDE2KTsKICAgICAgfQogICAgICByZXR1cm4gYzsKICAgIH0sCiAgICAvLyBQYXJzZSB0aW1lZnJhbWUgb3IgcmV0dXJuIHZhbHVlIGluIG1zCiAgICAvLyBUT0RPOiBhZGQgZnVsbCBwYXJzZXIKICAgIC8vIChodHRwczovL2dpdGh1Yi5jb20vdHZqc3gvdHJhZGluZy12dWUtanMvCiAgICAvLyBibG9iL21hc3Rlci9zcmMvaGVscGVycy9zY3JpcHRfdXRpbHMuanMjTDk4KQogICAgcGFyc2VUZihzbXRoKSB7CiAgICAgIGlmICh0eXBlb2Ygc210aCA9PT0gInN0cmluZyIpIHsKICAgICAgICByZXR1cm4gQ29uc3QuTUFQX1VOSVRbc210aF07CiAgICAgIH0gZWxzZSB7CiAgICAgICAgcmV0dXJuIHNtdGg7CiAgICAgIH0KICAgIH0sCiAgICAvLyBEZXRlY3QgaW5kZXggc2hpZnQgYmV0d2VlbiB0aGUgbWFpbiBkYXRhIHN1YnNldAogICAgLy8gYW5kIHRoZSBvdmVybGF5J3Mgc3Vic2V0IChmb3IgSUItbW9kZSkKICAgIGluZGV4U2hpZnQoc3ViLCBkYXRhKSB7CiAgICAgIGlmICghZGF0YS5sZW5ndGgpCiAgICAgICAgcmV0dXJuIDA7CiAgICAgIGNvbnN0IGZpcnN0ID0gZGF0YVswXVswXTsKICAgICAgbGV0IHNlY29uZDsKICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgaWYgKGRhdGFbaV1bMF0gIT09IGZpcnN0KSB7CiAgICAgICAgICBzZWNvbmQgPSBkYXRhW2ldWzBdOwogICAgICAgICAgYnJlYWs7CiAgICAgICAgfQogICAgICB9CiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgc3ViLmxlbmd0aDsgaisrKSB7CiAgICAgICAgaWYgKHN1YltqXVswXSA9PT0gc2Vjb25kKSB7CiAgICAgICAgICByZXR1cm4gaiAtIGk7CiAgICAgICAgfQogICAgICB9CiAgICAgIHJldHVybiAwOwogICAgfSwKICAgIC8vIEZhbGxiYWNrIGZpeCBmb3IgQnJhdmUgYnJvd3NlcgogICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2JyYXZlL2JyYXZlLWJyb3dzZXIvaXNzdWVzLzE3MzgKICAgIG1lYXN1cmVUZXh0KGN0eCwgdGV4dCwgbnZJZCkgewogICAgICBjb25zdCBtID0gY3R4Lm1lYXN1cmVUZXh0T3JnKHRleHQpOwogICAgICBpZiAobS53aWR0aCA9PT0gMCkgewogICAgICAgIGNvbnN0IGRvYyA9IGRvY3VtZW50OwogICAgICAgIGNvbnN0IGlkID0gIm52anMtbWVhc3VyZS10ZXh0IjsKICAgICAgICBsZXQgZWwgPSBkb2MuZ2V0RWxlbWVudEJ5SWQoaWQpOwogICAgICAgIGlmICghZWwpIHsKICAgICAgICAgIGNvbnN0IGJhc2UgPSBkb2MuZ2V0RWxlbWVudEJ5SWQobnZJZCk7CiAgICAgICAgICBlbCA9IGRvYy5jcmVhdGVFbGVtZW50KCJkaXYiKTsKICAgICAgICAgIGVsLmlkID0gaWQ7CiAgICAgICAgICBlbC5zdHlsZS5wb3NpdGlvbiA9ICJhYnNvbHV0ZSI7CiAgICAgICAgICBlbC5zdHlsZS50b3AgPSAiLTEwMDBweCI7CiAgICAgICAgICBiYXNlLmFwcGVuZENoaWxkKGVsKTsKICAgICAgICB9CiAgICAgICAgaWYgKGN0eC5mb250KQogICAgICAgICAgZWwuc3R5bGUuZm9udCA9IGN0eC5mb250OwogICAgICAgIGVsLmlubmVyVGV4dCA9IHRleHQucmVwbGFjZSgvIC9nLCAiLiIpOwogICAgICAgIHJldHVybiB7IHdpZHRoOiBlbC5vZmZzZXRXaWR0aCB9OwogICAgICB9IGVsc2UgewogICAgICAgIHJldHVybiBtOwogICAgICB9CiAgICB9LAogICAgdXVpZCh0ZW1wID0gInh4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCIpIHsKICAgICAgcmV0dXJuIHRlbXAucmVwbGFjZSgvW3h5XS9nLCAoYykgPT4gewogICAgICAgIHZhciByID0gTWF0aC5yYW5kb20oKSAqIDE2IHwgMCwgdiA9IGMgPT0gIngiID8gciA6IHIgJiAzIHwgODsKICAgICAgICByZXR1cm4gdi50b1N0cmluZygxNik7CiAgICAgIH0pOwogICAgfSwKICAgIHV1aWQyKCkgewogICAgICByZXR1cm4gdGhpcy51dWlkKCJ4eHh4eHh4eHh4eHgiKTsKICAgIH0sCiAgICB1dWlkMygpIHsKICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoKS5zbGljZSgyKS5yZXBsYWNlKC9eMCsvLCAiIik7CiAgICB9LAogICAgLy8gRGVsYXllZCB3YXJuaW5nLCBmID0gY29uZGl0aW9uIGxhbWJkYSBmbgogICAgd2FybihmLCB0ZXh0LCBkZWxheSA9IDApIHsKICAgICAgc2V0VGltZW91dCgoKSA9PiB7CiAgICAgICAgaWYgKGYoKSkKICAgICAgICAgIGNvbnNvbGUud2Fybih0ZXh0KTsKICAgICAgfSwgZGVsYXkpOwogICAgfSwKICAgIC8vIENoZWNrcyBpZiBzY3JpcHQgcHJvcHMgdXBkYXRlZAogICAgLy8gKGFuZCBub3Qgc3R5bGUgc2V0dGluZ3Mgb3Igc29tZXRoaW5nIGVsc2UpCiAgICAvKmlzU2NyUHJvcHNVcGQobiwgcHJldikgewogICAgICAgICAgICBsZXQgcCA9IHByZXYuZmluZCh4ID0+IHgudi4kdXVpZCA9PT0gbi52LiR1dWlkKQogICAgICAgICAgICBpZiAoIXApIHJldHVybiBmYWxzZQogICAgCiAgICAgICAgICAgIGxldCBwcm9wcyA9IG4ucC5zZXR0aW5ncy4kcHJvcHMKICAgICAgICAgICAgaWYgKCFwcm9wcykgcmV0dXJuIGZhbHNlCiAgICAKICAgICAgICAgICAgcmV0dXJuIHByb3BzLnNvbWUoeCA9PiBuLnZbeF0gIT09IHAudlt4XSkKICAgICAgICB9LCovCiAgICAvLyBDaGVja3MgaWYgaXQncyB0aW1lIHRvIG1ha2UgYSBzY3JpcHQgdXBkYXRlCiAgICAvLyAoYmFzZWQgb24gZXhlY0ludGVydmFsIGluIG1zKQogICAgZGVsYXllZEV4ZWModikgewogICAgICBpZiAoIXYuc2NyaXB0IHx8ICF2LnNjcmlwdC5leGVjSW50ZXJ2YWwpCiAgICAgICAgcmV0dXJuIHRydWU7CiAgICAgIGNvbnN0IHQgPSB0aGlzLm5vdygpOwogICAgICBjb25zdCBkdCA9IHYuc2NyaXB0LmV4ZWNJbnRlcnZhbDsKICAgICAgaWYgKCF2LnNldHRpbmdzLiRsYXN0X2V4ZWMgfHwgdCA+IHYuc2V0dGluZ3MuJGxhc3RfZXhlYyArIGR0KSB7CiAgICAgICAgdi5zZXR0aW5ncy4kbGFzdF9leGVjID0gdDsKICAgICAgICByZXR1cm4gdHJ1ZTsKICAgICAgfQogICAgICByZXR1cm4gZmFsc2U7CiAgICB9LAogICAgLy8gRm9ybWF0IG5hbWVzIHN1Y2ggJ1JTSSwgJGxlbmd0aCcsIHdoZXJlCiAgICAvLyBsZW5ndGggLSBpcyBvbmUgb2YgdGhlIHNldHRpbmdzCiAgICBmb3JtYXROYW1lKG92KSB7CiAgICAgIGlmICghb3YubmFtZSkKICAgICAgICByZXR1cm4gdm9pZCAwOwogICAgICBsZXQgbmFtZSA9IG92Lm5hbWU7CiAgICAgIGZvciAodmFyIGsgaW4gb3Yuc2V0dGluZ3MgfHwge30pIHsKICAgICAgICBjb25zdCB2YWwgPSBvdi5zZXR0aW5nc1trXTsKICAgICAgICBjb25zdCByZWcgPSBuZXcgUmVnRXhwKGBcXCQke2t9YCwgImciKTsKICAgICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKHJlZywgdmFsKTsKICAgICAgfQogICAgICByZXR1cm4gbmFtZTsKICAgIH0sCiAgICAvLyBEZWZhdWx0IGN1cnNvciBtb2RlCiAgICB4TW9kZSgpIHsKICAgICAgcmV0dXJuIHRoaXMuaXNfbW9iaWxlID8gImV4cGxvcmUiIDogImRlZmF1bHQiOwogICAgfSwKICAgIGRlZmF1bHRQcmV2ZW50ZWQoZXZlbnQpIHsKICAgICAgaWYgKGV2ZW50Lm9yaWdpbmFsKSB7CiAgICAgICAgcmV0dXJuIGV2ZW50Lm9yaWdpbmFsLmRlZmF1bHRQcmV2ZW50ZWQ7CiAgICAgIH0KICAgICAgcmV0dXJuIGV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQ7CiAgICB9LAogICAgLy8gR2V0IGEgdmlldyBmcm9tIHRoZSBkYXRhIGJ5IHRoZSBuYW1lCiAgICAvKnZpZXcoZGF0YSwgbmFtZSkgewogICAgICAgIGlmICghZGF0YS52aWV3cykgcmV0dXJuIGRhdGEKICAgICAgICBsZXQgdiA9IGRhdGEudmlld3MuZmluZCh4ID0+IHgubmFtZSA9PT0gbmFtZSkKICAgICAgICBpZiAoIXYpIHJldHVybiBkYXRhCiAgICAgICAgcmV0dXJuIHYuZGF0YQogICAgfSwqLwogICAgLypjb25jYXRBcnJheXMoYXJyYXlzKSB7CiAgICAgICAgdmFyIGFjYyA9IFtdCiAgICAgICAgZm9yICh2YXIgYSBvZiBhcnJheXMpIHsKICAgICAgICAgICAgYWNjID0gYWNjLmNvbmNhdChhKQogICAgICAgIH0KICAgICAgICByZXR1cm4gYWNjCiAgICB9LCovCiAgICAvLyBDYWxsCiAgICBhZnRlckFsbChvYmplY3QsIGYsIHRpbWUpIHsKICAgICAgY2xlYXJUaW1lb3V0KG9iamVjdC5fX2FmdGVyQWxsSWRfXyk7CiAgICAgIG9iamVjdC5fX2FmdGVyQWxsSWRfXyA9IHNldFRpbWVvdXQoKCkgPT4gZigpLCB0aW1lKTsKICAgIH0sCiAgICAvLyBEZWZhdWx0IGF1dG8tcHJlY2lzaW9uIHNhbXBsZXIgZm9yIGEgZ2VuZXJpYwogICAgLy8gdGltZXNlcmllcy1lbGVtZW50OiBbdGltZSwgeDEsIHgyLCB4MywgLi4uXQogICAgZGVmYXVsdFByZVNhbXBsZXIoZWwpIHsKICAgICAgaWYgKCFlbCkKICAgICAgICByZXR1cm4gW107CiAgICAgIGNvbnN0IG91dCA9IFtdOwogICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGVsLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgaWYgKHR5cGVvZiBlbFtpXSA9PT0gIm51bWJlciIpIHsKICAgICAgICAgIG91dC5wdXNoKGVsW2ldKTsKICAgICAgICB9CiAgICAgIH0KICAgICAgcmV0dXJuIG91dDsKICAgIH0sCiAgICAvLyBHZXQgc2NhbGVzIGJ5IHNpZGUgaWQgKDAgLSBsZWZ0LCAxIC0gcmlnaHQpCiAgICBnZXRTY2FsZXNCeVNpZGUoc2lkZSwgbGF5b3V0KSB7CiAgICAgIGlmICghbGF5b3V0KQogICAgICAgIHJldHVybiBbXTsKICAgICAgY29uc3QgdGVtcGxhdGUgPSBsYXlvdXQuc2V0dGluZ3Muc2NhbGVUZW1wbGF0ZTsKICAgICAgcmV0dXJuIHRlbXBsYXRlW3NpZGVdLm1hcCgoaWQpID0+IGxheW91dC5zY2FsZXNbaWRdKS5maWx0ZXIoKHgpID0+IHgpOwogICAgfSwKICAgIC8vIElmIHNjYWxlVGVtcGxhdGUgaXMgY2hhbmdlZCB0aGVyZSBjb3VsZCBiZSBhCiAgICAvLyBzaXR1YXRpb24gd2hlbiB1c2VyIGZvcmdldCB0byByZXNldCBzY2FsZVNpZGVJZHhzLgogICAgLy8gSGVyZSB3ZSBhdHRlbXAgdG8gZ2V0IHRoZW0gaW4gc3luYwogICAgYXV0b1NjYWxlU2lkZUlkKFMsIHNpZGVzLCBpZHhzKSB7CiAgICAgIGlmIChzaWRlc1tTXS5sZW5ndGgpIHsKICAgICAgICBpZiAoIWlkeHNbU10gfHwgIXNpZGVzW1NdLmluY2x1ZGVzKGlkeHNbU10pKSB7CiAgICAgICAgICBpZHhzW1NdID0gc2lkZXNbU11bMF07CiAgICAgICAgfQogICAgICB9IGVsc2UgewogICAgICAgIGlkeHNbU10gPSB2b2lkIDA7CiAgICAgIH0KICAgIH0sCiAgICAvLyBEZWJ1ZyBmdW5jdGlvbiwgc2hvd3MgaG93IG1hbnkgdGltZXMKICAgIC8vIHRoaXMgbWV0aG9kIGlzIGNhbGxlZCBwZXIgc2Vjb25kCiAgICBjYWxsc1BlclNlY29uZCgpIHsKICAgICAgaWYgKHdpbmRvdy5fX2NvdW50ZXJfXyA9PT0gdm9pZCAwKSB7CiAgICAgICAgd2luZG93Ll9fY291bnRlcl9fID0gMDsKICAgICAgfQogICAgICB3aW5kb3cuX19jb3VudGVyX18rKzsKICAgICAgaWYgKHdpbmRvdy5fX2Nwc0lkX18pCiAgICAgICAgcmV0dXJuOwogICAgICB3aW5kb3cuX19jcHNJZF9fID0gc2V0VGltZW91dCgoKSA9PiB7CiAgICAgICAgY29uc29sZS5sb2cod2luZG93Ll9fY291bnRlcl9fLCAidXBkL3NlYyIpOwogICAgICAgIHdpbmRvdy5fX2NvdW50ZXJfXyA9IDA7CiAgICAgICAgd2luZG93Ll9fY3BzSWRfXyA9IG51bGw7CiAgICAgIH0sIDFlMyk7CiAgICB9LAogICAgLy8gQ2FsY3VsYXRlIGFuIGluZGV4IG9mZnNldCBmb3IgYSB0aW1lc2VyaWVzCiAgICAvLyBhZ2FpbnN0IHRoZSBtYWluIHRzLiAoZm9yIGluZGV4QmFzZWQgbW9kZSkKICAgIGZpbmRJbmRleE9mZnNldChtYWluVHMsIHRzKSB7CiAgICAgIGNvbnN0IHNldDEgPSB7fTsKICAgICAgY29uc3Qgc2V0MiA9IHt9OwogICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1haW5Ucy5sZW5ndGg7IGkrKykgewogICAgICAgIHNldDFbbWFpblRzW2ldWzBdXSA9IGk7CiAgICAgIH0KICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0cy5sZW5ndGg7IGkrKykgewogICAgICAgIHNldDJbdHNbaV1bMF1dID0gaTsKICAgICAgfQogICAgICBjb25zdCBkZWx0YXMgPSBbXTsKICAgICAgZm9yIChjb25zdCB0IGluIHNldDIpIHsKICAgICAgICBpZiAoc2V0MVt0XSAhPT0gdm9pZCAwKSB7CiAgICAgICAgICBjb25zdCBkID0gc2V0MVt0XSAtIHNldDJbdF07CiAgICAgICAgICBpZiAoIWRlbHRhcy5sZW5ndGggfHwgZGVsdGFzWzBdID09PSBkKSB7CiAgICAgICAgICAgIGRlbHRhcy51bnNoaWZ0KGQpOwogICAgICAgICAgfQogICAgICAgICAgaWYgKGRlbHRhcy5sZW5ndGggPT09IDMpIHsKICAgICAgICAgICAgcmV0dXJuIGRlbHRhcy5wb3AoKTsKICAgICAgICAgIH0KICAgICAgICB9CiAgICAgIH0KICAgICAgcmV0dXJuIDA7CiAgICB9LAogICAgLy8gRm9ybWF0IGNhc2ggdmFsdWVzCiAgICBmb3JtYXRDYXNoKG4pIHsKICAgICAgaWYgKG4gPT0gdm9pZCAwKQogICAgICAgIHJldHVybiAieCI7CiAgICAgIGlmICh0eXBlb2YgbiAhPT0gIm51bWJlciIpCiAgICAgICAgcmV0dXJuIG47CiAgICAgIGlmIChuIDwgMWUzKQogICAgICAgIHJldHVybiBuLnRvRml4ZWQoMCk7CiAgICAgIGlmIChuID49IDFlMyAmJiBuIDwgMWU2KQogICAgICAgIHJldHVybiArKG4gLyAxZTMpLnRvRml4ZWQoMikgKyAiSyI7CiAgICAgIGlmIChuID49IDFlNiAmJiBuIDwgMWU5KQogICAgICAgIHJldHVybiArKG4gLyAxZTYpLnRvRml4ZWQoMikgKyAiTSI7CiAgICAgIGlmIChuID49IDFlOSAmJiBuIDwgMWUxMikKICAgICAgICByZXR1cm4gKyhuIC8gMWU5KS50b0ZpeGVkKDIpICsgIkIiOwogICAgICBpZiAobiA+PSAxZTEyKQogICAgICAgIHJldHVybiArKG4gLyAxZTEyKS50b0ZpeGVkKDIpICsgIlQiOwogICAgfSwKICAgIC8vIFRpbWUgcmFuZ2Ugb2YgYSBkYXRhIHN1YnNldCAoZnJvbSBpMCB0byBpTi0xKQogICAgcmVhbFRpbWVSYW5nZShkYXRhKSB7CiAgICAgIGlmICghZGF0YS5sZW5ndGgpCiAgICAgICAgcmV0dXJuIDA7CiAgICAgIHJldHVybiBkYXRhW2RhdGEubGVuZ3RoIC0gMV1bMF0gLSBkYXRhWzBdWzBdOwogICAgfSwKICAgIC8vIEdldCBzaXplcyBsZWZ0IGFuZCByaWdodCBwYXJ0cyBvZiBhIG51bWJlcgogICAgLy8gKDExLjIyIC0+IFsnMTEnLCAnMjInXSkKICAgIG51bWJlckxSKHgpIHsKICAgICAgdmFyIHN0ciA9IHggIT0gbnVsbCA/IHgudG9TdHJpbmcoKSA6ICIiOwogICAgICBsZXQgbCwgciwgcnMsIF9zLCBsczsKICAgICAgaWYgKHggPCAxZS02KSB7CiAgICAgICAgW19zLCByc10gPSBzdHIuc3BsaXQoImUtIik7CiAgICAgICAgW2wsIHJdID0gbHMuc3BsaXQoIi4iKTsKICAgICAgICBpZiAoIXIpCiAgICAgICAgICByID0gIiI7CiAgICAgICAgciA9IHsgbGVuZ3RoOiByLmxlbmd0aCArIHBhcnNlSW50KHJzKSB8fCAwIH07CiAgICAgIH0gZWxzZSB7CiAgICAgICAgW2wsIHJdID0gc3RyLnNwbGl0KCIuIik7CiAgICAgIH0KICAgICAgcmV0dXJuIFtsLmxlbmd0aCwgciA/IHIubGVuZ3RoIDogMF07CiAgICB9LAogICAgLy8gR2V0IGEgaGFzaCBvZiBjdXJyZW50IG92ZXJsYXkgZGlzcG9zaXRpb246CiAgICAvLyBwYW5lMS51dWlkK292MS50eXBlK292Mi50eXBlKy4uLitwYW5lMi51dWlkKy4uLgogICAgb3ZEaXNwb3NpdGlvbkhhc2gocGFuZXMpIHsKICAgICAgbGV0IGggPSAiIjsKICAgICAgZm9yICh2YXIgcGFuZSBvZiBwYW5lcykgewogICAgICAgIGggKz0gcGFuZS51dWlkOwogICAgICAgIGZvciAodmFyIG92IG9mIHBhbmUub3ZlcmxheXMpIHsKICAgICAgICAgIGlmIChvdi5tYWluKQogICAgICAgICAgICBjb250aW51ZTsKICAgICAgICAgIGggKz0gb3YudHlwZTsKICAgICAgICB9CiAgICAgIH0KICAgICAgcmV0dXJuIGg7CiAgICB9LAogICAgLy8gRm9ybWF0IGN1cnNvciBldmVudCBmb3IgdGhlICckY3Vyc29yLXVwZGF0ZScgaG9vawogICAgLy8gVE9ETzogZG9lc24ndCB3b3JrIGZvciByZW5rbwogICAgbWFrZUN1cnNvckV2ZW50KCRjdXJzb3IsIGN1cnNvciwgbGF5b3V0KSB7CiAgICAgICRjdXJzb3IudmFsdWVzID0gY3Vyc29yLnZhbHVlczsKICAgICAgJGN1cnNvci50aSA9IGN1cnNvci50aTsKICAgICAgJGN1cnNvci50aW1lID0gY3Vyc29yLnRpbWU7CiAgICAgICRjdXJzb3Iub2hsY0Nvb3JkID0gKCkgPT4gewogICAgICAgIGNvbnN0IG9obGMgPSBsYXlvdXQubWFpbi5vaGxjKGN1cnNvci50aW1lKTsKICAgICAgICByZXR1cm4gb2hsYyA/IHsKICAgICAgICAgIHg6IGxheW91dC5tYWluLnRpbWUyeChjdXJzb3IudGkpLAogICAgICAgICAgeXM6IG9obGMubWFwKCh4KSA9PiBsYXlvdXQubWFpbi52YWx1ZTJ5KHgpKQogICAgICAgIH0gOiBudWxsOwogICAgICB9OwogICAgICByZXR1cm4gJGN1cnNvcjsKICAgIH0sCiAgICAvLyBBZGp1c3QgbW91c2UgY29vcmRzIHRvIGZpeCB0aGUgc2hpZnQgY2F1c2VkIGJ5IAogICAgLy8gY3NzIHRyYW5zZm9ybXMKICAgIGFkanVzdE1vdXNlKGV2ZW50LCBjYW52YXMpIHsKICAgICAgY29uc3QgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTsKICAgICAgY29uc3QgYWRqdXN0ZWRYID0gZXZlbnQuY2xpZW50WCAtIHJlY3QubGVmdDsKICAgICAgY29uc3QgYWRqdXN0ZWRZID0gZXZlbnQuY2xpZW50WSAtIHJlY3QudG9wOwogICAgICByZXR1cm4gbmV3IFByb3h5KGV2ZW50LCB7CiAgICAgICAgZ2V0KHRhcmdldCwgcHJvcCkgewogICAgICAgICAgaWYgKHByb3AgPT09ICJsYXllclgiKSB7CiAgICAgICAgICAgIHJldHVybiBhZGp1c3RlZFg7CiAgICAgICAgICB9IGVsc2UgaWYgKHByb3AgPT09ICJsYXllclkiKSB7CiAgICAgICAgICAgIHJldHVybiBhZGp1c3RlZFk7CiAgICAgICAgICB9CiAgICAgICAgICBpZiAodHlwZW9mIHRhcmdldFtwcm9wXSA9PT0gImZ1bmN0aW9uIikgewogICAgICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BdLmJpbmQodGFyZ2V0KTsKICAgICAgICAgIH0KICAgICAgICAgIHJldHVybiB0YXJnZXRbcHJvcF07CiAgICAgICAgfQogICAgICB9KTsKICAgIH0sCiAgICAvLyBHUFQgdG8gdGhlIG1vb24hCiAgICBnZXRDYW5kbGVUaW1lKHRpbWVmcmFtZU1zKSB7CiAgICAgIGlmICh0aW1lZnJhbWVNcyA8PSAwKQogICAgICAgIHJldHVybiAiLS0tLS0iOwogICAgICBjb25zdCBub3cyID0gLyogQF9fUFVSRV9fICovIG5ldyBEYXRlKCk7CiAgICAgIGNvbnN0IG5vd01zID0gbm93Mi5nZXRUaW1lKCk7CiAgICAgIGxldCByZW1haW5pbmdNczsKICAgICAgaWYgKHRpbWVmcmFtZU1zID09PSA3ICogMjQgKiA2MCAqIDYwICogMWUzKSB7CiAgICAgICAgY29uc3QgZGF5c0xlZnQgPSA3IC0gbm93Mi5nZXRVVENEYXkoKTsKICAgICAgICByZW1haW5pbmdNcyA9IGRheXNMZWZ0ICogMjQgKiA2MCAqIDYwICogMWUzIC0gbm93TXMgJSAoMjQgKiA2MCAqIDYwICogMWUzKTsKICAgICAgfSBlbHNlIGlmICh0aW1lZnJhbWVNcyA+PSAyOCAqIDI0ICogNjAgKiA2MCAqIDFlMyAmJiB0aW1lZnJhbWVNcyA8IDM2NSAqIDI0ICogNjAgKiA2MCAqIDFlMykgewogICAgICAgIGNvbnN0IG5leHRNb250aCA9IG5ldyBEYXRlKERhdGUuVVRDKG5vdzIuZ2V0VVRDRnVsbFllYXIoKSwgbm93Mi5nZXRVVENNb250aCgpICsgMSwgMSkpOwogICAgICAgIHJlbWFpbmluZ01zID0gbmV4dE1vbnRoLmdldFRpbWUoKSAtIG5vd01zOwogICAgICB9IGVsc2UgaWYgKHRpbWVmcmFtZU1zID49IDM2NSAqIDI0ICogNjAgKiA2MCAqIDFlMykgewogICAgICAgIGNvbnN0IG5leHRZZWFyID0gbmV3IERhdGUoRGF0ZS5VVEMobm93Mi5nZXRVVENGdWxsWWVhcigpICsgMSwgMCwgMSkpOwogICAgICAgIHJlbWFpbmluZ01zID0gbmV4dFllYXIuZ2V0VGltZSgpIC0gbm93TXM7CiAgICAgIH0gZWxzZSB7CiAgICAgICAgY29uc3QgZWxhcHNlZCA9IG5vd01zICUgdGltZWZyYW1lTXM7CiAgICAgICAgcmVtYWluaW5nTXMgPSB0aW1lZnJhbWVNcyAtIGVsYXBzZWQ7CiAgICAgIH0KICAgICAgY29uc3QgZGF5cyA9IE1hdGguZmxvb3IocmVtYWluaW5nTXMgLyAoMjQgKiA2MCAqIDYwICogMWUzKSk7CiAgICAgIGNvbnN0IGhvdXJzID0gTWF0aC5mbG9vcihyZW1haW5pbmdNcyAlICgyNCAqIDYwICogNjAgKiAxZTMpIC8gKDYwICogNjAgKiAxZTMpKTsKICAgICAgY29uc3QgbWludXRlcyA9IE1hdGguZmxvb3IocmVtYWluaW5nTXMgJSAoNjAgKiA2MCAqIDFlMykgLyAoNjAgKiAxZTMpKTsKICAgICAgY29uc3Qgc2Vjb25kcyA9IE1hdGguZmxvb3IocmVtYWluaW5nTXMgJSAoNjAgKiAxZTMpIC8gMWUzKTsKICAgICAgaWYgKHRpbWVmcmFtZU1zID49IDI0ICogNjAgKiA2MCAqIDFlMykgewogICAgICAgIHJldHVybiBgJHtkYXlzID4gMCA/IGRheXMgKyAiZCAiIDogIiJ9JHtob3Vyc31oJHtkYXlzIDw9IDAgPyAiICIgKyBTdHJpbmcobWludXRlcykucGFkU3RhcnQoMiwgIjAiKSArICJtIiA6ICIifWA7CiAgICAgIH0KICAgICAgcmV0dXJuIGAke2hvdXJzID4gMCA/IFN0cmluZyhob3VycykucGFkU3RhcnQoMiwgIjAiKSArICI6IiA6ICIifSR7U3RyaW5nKG1pbnV0ZXMpLnBhZFN0YXJ0KDIsICIwIil9OiR7U3RyaW5nKHNlY29uZHMpLnBhZFN0YXJ0KDIsICIwIil9YDsKICAgIH0sCiAgICAvLyBXVEYgd2l0aCBtb2Rlcm4gd2ViIGRldmVsb3BtZW50CiAgICBpc01vYmlsZTogKCh3KSA9PiAib25vcmllbnRhdGlvbmNoYW5nZSIgaW4gdyAmJiAoISFuYXZpZ2F0b3IubWF4VG91Y2hQb2ludHMgfHwgISFuYXZpZ2F0b3IubXNNYXhUb3VjaFBvaW50cyB8fCAoIm9udG91Y2hzdGFydCIgaW4gdyB8fCB3LkRvY3VtZW50VG91Y2ggJiYgZG9jdW1lbnQgaW5zdGFuY2VvZiB3LkRvY3VtZW50VG91Y2gpKSkodHlwZW9mIHdpbmRvdyAhPT0gInVuZGVmaW5lZCIgPyB3aW5kb3cgOiB7fSkKICB9OwogIGNvbnN0IEZERUZTID0gLyhmdW5jdGlvbiB8KShbJEEtWl9dWzAtOUEtWl8kLl0qKVtcc10qP1woKC4qPylcKS9nbWk7CiAgY29uc3QgU0JSQUNLRVRTID0gLyhbJEEtWl9dWzAtOUEtWl8kLl0qKVtcc10qP1xbKFteIl5bXlxdXSs/KVxdL2dtaTsKICBjb25zdCBURlNUUiA9IC8oXGQrKShcdyopL2dtOwogIGNvbnN0IEJVRl9JTkMkMSA9IDU7CiAgdmFyIHRmX2NhY2hlID0ge307CiAgZnVuY3Rpb24gZl9hcmdzKHNyYykgewogICAgRkRFRlMubGFzdEluZGV4ID0gMDsKICAgIHZhciBtID0gRkRFRlMuZXhlYyhzcmMpOwogICAgaWYgKG0pIHsKICAgICAgbVsxXS50cmltKCk7CiAgICAgIG1bMl0udHJpbSgpOwogICAgICBjb25zdCBmYXJncyA9IG1bM10udHJpbSgpOwogICAgICByZXR1cm4gZmFyZ3Muc3BsaXQoIiwiKS5tYXAoKHgpID0+IHgudHJpbSgpKTsKICAgIH0KICAgIHJldHVybiBbXTsKICB9CiAgZnVuY3Rpb24gZl9ib2R5KHNyYykgewogICAgcmV0dXJuIHNyYy5zbGljZSgKICAgICAgc3JjLmluZGV4T2YoInsiKSArIDEsCiAgICAgIHNyYy5sYXN0SW5kZXhPZigifSIpCiAgICApOwogIH0KICBmdW5jdGlvbiB3cmFwX2lkeHMoc3JjLCBwcmUgPSAiIikgewogICAgU0JSQUNLRVRTLmxhc3RJbmRleCA9IDA7CiAgICBsZXQgY2hhbmdlZCA9IGZhbHNlOwogICAgZG8gewogICAgICB2YXIgbSA9IFNCUkFDS0VUUy5leGVjKHNyYyk7CiAgICAgIGlmIChtKSB7CiAgICAgICAgY29uc3Qgdm5hbWUgPSBtWzFdLnRyaW0oKTsKICAgICAgICBjb25zdCB2aW5kZXggPSBtWzJdLnRyaW0oKTsKICAgICAgICBpZiAodmluZGV4ID09PSAiMCIgfHwgcGFyc2VJbnQodmluZGV4KSA8IEJVRl9JTkMkMSkgewogICAgICAgICAgY29udGludWU7CiAgICAgICAgfQogICAgICAgIHN3aXRjaCAodm5hbWUpIHsKICAgICAgICAgIGNhc2UgImxldCI6CiAgICAgICAgICBjYXNlICJ2YXIiOgogICAgICAgICAgY2FzZSAicmV0dXJuIjoKICAgICAgICAgICAgY29udGludWU7CiAgICAgICAgfQogICAgICAgIGNvbnN0IHdyYXAgPSBgJHt2bmFtZX1bJHtwcmV9X2koJHt2aW5kZXh9LCAke3ZuYW1lfSldYDsKICAgICAgICBzcmMgPSBzcmMucmVwbGFjZShtWzBdLCB3cmFwKTsKICAgICAgICBjaGFuZ2VkID0gdHJ1ZTsKICAgICAgfQogICAgfSB3aGlsZSAobSk7CiAgICByZXR1cm4gY2hhbmdlZCA/IHNyYyA6IHNyYzsKICB9CiAgZnVuY3Rpb24gdGZfZnJvbV9wYWlyKG51bSwgcGYpIHsKICAgIHZhciBtdWx0ID0gMTsKICAgIHN3aXRjaCAocGYpIHsKICAgICAgY2FzZSAicyI6CiAgICAgICAgbXVsdCA9IENvbnN0LlNFQ09ORDsKICAgICAgICBicmVhazsKICAgICAgY2FzZSAibSI6CiAgICAgICAgbXVsdCA9IENvbnN0Lk1JTlVURTsKICAgICAgICBicmVhazsKICAgICAgY2FzZSAiSCI6CiAgICAgICAgbXVsdCA9IENvbnN0LkhPVVI7CiAgICAgICAgYnJlYWs7CiAgICAgIGNhc2UgIkQiOgogICAgICAgIG11bHQgPSBDb25zdC5EQVk7CiAgICAgICAgYnJlYWs7CiAgICAgIGNhc2UgIlciOgogICAgICAgIG11bHQgPSBDb25zdC5XRUVLOwogICAgICAgIGJyZWFrOwogICAgICBjYXNlICJNIjoKICAgICAgICBtdWx0ID0gQ29uc3QuTU9OVEg7CiAgICAgICAgYnJlYWs7CiAgICAgIGNhc2UgIlkiOgogICAgICAgIG11bHQgPSBDb25zdC5ZRUFSOwogICAgICAgIGJyZWFrOwogICAgfQogICAgcmV0dXJuIHBhcnNlSW50KG51bSkgKiBtdWx0OwogIH0KICBmdW5jdGlvbiB0Zl9mcm9tX3N0cihzdHIpIHsKICAgIGlmICh0eXBlb2Ygc3RyID09PSAibnVtYmVyIikKICAgICAgcmV0dXJuIHN0cjsKICAgIGlmICh0Zl9jYWNoZVtzdHJdKQogICAgICByZXR1cm4gdGZfY2FjaGVbc3RyXTsKICAgIFRGU1RSLmxhc3RJbmRleCA9IDA7CiAgICBjb25zdCBtID0gVEZTVFIuZXhlYyhzdHIpOwogICAgaWYgKG0pIHsKICAgICAgdGZfY2FjaGVbc3RyXSA9IHRmX2Zyb21fcGFpcihtWzFdLCBtWzJdKTsKICAgICAgcmV0dXJuIHRmX2NhY2hlW3N0cl07CiAgICB9CiAgICByZXR1cm4gdm9pZCAwOwogIH0KICBmdW5jdGlvbiBnZXRfZm5faWQocHJlLCBpZCkgewogICAgcmV0dXJuIHByZSArICItIiArIGlkLnNwbGl0KCI8LSIpLnBvcCgpOwogIH0KICBmdW5jdGlvbiBuZXh0dChkYXRhLCB0LCB0aSA9IDApIHsKICAgIGxldCBpMCA9IDA7CiAgICBsZXQgaU4gPSBkYXRhLmxlbmd0aCAtIDE7CiAgICB3aGlsZSAoaTAgPD0gaU4pIHsKICAgICAgdmFyIG1pZCA9IE1hdGguZmxvb3IoKGkwICsgaU4pIC8gMik7CiAgICAgIGlmIChkYXRhW21pZF1bdGldID09PSB0KSB7CiAgICAgICAgcmV0dXJuIG1pZDsKICAgICAgfSBlbHNlIGlmIChkYXRhW21pZF1bdGldIDwgdCkgewogICAgICAgIGkwID0gbWlkICsgMTsKICAgICAgfSBlbHNlIHsKICAgICAgICBpTiA9IG1pZCAtIDE7CiAgICAgIH0KICAgIH0KICAgIHJldHVybiB0IDwgZGF0YVttaWRdW3RpXSA/IG1pZCA6IG1pZCArIDE7CiAgfQogIGZ1bmN0aW9uIHNpemVfb2ZfZHNzKGRhdGEpIHsKICAgIGxldCBieXRlcyA9IDA7CiAgICBmb3IgKHZhciBpZCBpbiBkYXRhKSB7CiAgICAgIGlmIChkYXRhW2lkXS5kYXRhICYmIGRhdGFbaWRdLmRhdGFbMF0pIHsKICAgICAgICBjb25zdCBzMCA9IHNpemVfb2YoZGF0YVtpZF0uZGF0YVswXSk7CiAgICAgICAgYnl0ZXMgKz0gczAgKiBkYXRhW2lkXS5kYXRhLmxlbmd0aDsKICAgICAgfQogICAgfQogICAgcmV0dXJuIGJ5dGVzOwogIH0KICBmdW5jdGlvbiBzaXplX29mKG9iamVjdCkgewogICAgdmFyIGxpc3QgPSBbXSwgc3RhY2sgPSBbb2JqZWN0XSwgYnl0ZXMgPSAwOwogICAgd2hpbGUgKHN0YWNrLmxlbmd0aCkgewogICAgICB2YXIgdmFsdWUgPSBzdGFjay5wb3AoKTsKICAgICAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7CiAgICAgIGlmICh0eXBlID09PSAiYm9vbGVhbiIpIHsKICAgICAgICBieXRlcyArPSA0OwogICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICJzdHJpbmciKSB7CiAgICAgICAgYnl0ZXMgKz0gdmFsdWUubGVuZ3RoICogMjsKICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAibnVtYmVyIikgewogICAgICAgIGJ5dGVzICs9IDg7CiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gIm9iamVjdCIgJiYgbGlzdC5pbmRleE9mKHZhbHVlKSA9PT0gLTEpIHsKICAgICAgICBsaXN0LnB1c2godmFsdWUpOwogICAgICAgIGZvciAodmFyIGkgaW4gdmFsdWUpIHsKICAgICAgICAgIHN0YWNrLnB1c2godmFsdWVbaV0pOwogICAgICAgIH0KICAgICAgfQogICAgfQogICAgcmV0dXJuIGJ5dGVzOwogIH0KICBmdW5jdGlvbiB1cGRhdGUoZGF0YSwgdmFsKSB7CiAgICBjb25zdCBpID0gZGF0YS5sZW5ndGggLSAxOwogICAgY29uc3QgbGFzdCA9IGRhdGFbaV07CiAgICBpZiAoIWxhc3QgfHwgdmFsWzBdID4gbGFzdFswXSkgewogICAgICBkYXRhLnB1c2godmFsKTsKICAgIH0gZWxzZSB7CiAgICAgIGRhdGFbaV0gPSB2YWw7CiAgICB9CiAgfQogIGZ1bmN0aW9uIG5vdygpIHsKICAgIHJldHVybiAoLyogQF9fUFVSRV9fICovIG5ldyBEYXRlKCkpLmdldFRpbWUoKTsKICB9CiAgZnVuY3Rpb24gb3ZlcnJpZGVPdmVybGF5KG92MSwgb3YyKSB7CiAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhvdjIpKSB7CiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICJvYmplY3QiICYmIHZhbHVlICE9PSBudWxsICYmICFBcnJheS5pc0FycmF5KHZhbHVlKSkgewogICAgICAgIGlmICghb3YxW2tleV0pIHsKICAgICAgICAgIG92MVtrZXldID0ge307CiAgICAgICAgfQogICAgICAgIE9iamVjdC5hc3NpZ24ob3YxW2tleV0sIHZhbHVlKTsKICAgICAgfSBlbHNlIHsKICAgICAgICBvdjFba2V5XSA9IHZhbHVlOwogICAgICB9CiAgICB9CiAgICByZXR1cm4gb3YxOwogIH0KICBjb25zdCBERUZfTElNSVQkMiA9IDU7CiAgZnVuY3Rpb24gU2FtcGxlcihULCBhdXRvID0gZmFsc2UpIHsKICAgIGNvbnN0IFRpID0gWyJoaWdoIiwgImxvdyIsICJjbG9zZSIsICJ2b2wiXS5pbmRleE9mKFQpOwogICAgcmV0dXJuIGZ1bmN0aW9uKHgsIHQpIHsKICAgICAgY29uc3QgdGYgPSB0aGlzLl9fdGZfXzsKICAgICAgdGhpcy5fX2lkX187CiAgICAgIHQgPSB0IHx8IHNlLnQ7CiAgICAgIGNvbnN0IHZhbCA9IGF1dG8gPyBzZVtUXVswXSA6IHg7CiAgICAgIGlmICghdGhpcy5fX3QwX18gfHwgdCA+PSB0aGlzLl9fdDBfXyArIHRmKSB7CiAgICAgICAgdGhpcy51bnNoaWZ0KFRpICE9PSAzID8gdmFsIDogMCk7CiAgICAgICAgdGhpcy5fX3QwX18gPSB0IC0gdCAlIHRmOwogICAgICB9CiAgICAgIHN3aXRjaCAoVGkpIHsKICAgICAgICBjYXNlIDA6CiAgICAgICAgICBpZiAodmFsID4gdGhpc1swXSkKICAgICAgICAgICAgdGhpc1swXSA9IHZhbDsKICAgICAgICAgIGJyZWFrOwogICAgICAgIGNhc2UgMToKICAgICAgICAgIGlmICh2YWwgPCB0aGlzWzBdKQogICAgICAgICAgICB0aGlzWzBdID0gdmFsOwogICAgICAgICAgYnJlYWs7CiAgICAgICAgY2FzZSAyOgogICAgICAgICAgdGhpc1swXSA9IHZhbDsKICAgICAgICAgIGJyZWFrOwogICAgICAgIGNhc2UgMzoKICAgICAgICAgIHRoaXNbMF0gKz0gdmFsOwogICAgICB9CiAgICAgIHRoaXMubGVuZ3RoID0gdGhpcy5fX2xlbl9fIHx8IERFRl9MSU1JVCQyOwogICAgfTsKICB9CiAgZnVuY3Rpb24gVFMoaWQsIGFyciwgbGVuKSB7CiAgICBhcnIuX19pZF9fID0gaWQ7CiAgICBhcnIuX19sZW5fXyA9IGxlbjsKICAgIHJldHVybiBhcnI7CiAgfQogIGNvbnN0IE9ITENWID0gWyJvcGVuIiwgImhpZ2giLCAibG93IiwgImNsb3NlIiwgInZvbCJdOwogIGNvbnN0IEFSUiA9IDA7CiAgY29uc3QgVFNTID0gMTsKICBjb25zdCBOVU0gPSAyOwogIGNsYXNzIFN5bSB7CiAgICBjb25zdHJ1Y3RvcihkYXRhLCBwYXJhbXMpIHsKICAgICAgdGhpcy5pZCA9IHBhcmFtcy5pZDsKICAgICAgdGhpcy50ZiA9IHRmX2Zyb21fc3RyKHBhcmFtcy50Zik7CiAgICAgIHRoaXMuZm9ybWF0ID0gcGFyYW1zLmZvcm1hdDsKICAgICAgdGhpcy5hZ2d0eXBlID0gcGFyYW1zLmFnZ3R5cGUgfHwgIm9obGN2IjsKICAgICAgdGhpcy53aW5kb3cgPSB0Zl9mcm9tX3N0cihwYXJhbXMud2luZG93KTsKICAgICAgdGhpcy5maWxsZ2FwcyA9IHBhcmFtcy5maWxsZ2FwczsKICAgICAgdGhpcy5kYXRhID0gZGF0YTsKICAgICAgdGhpcy5kYXRhX3R5cGUgPSBBUlI7CiAgICAgIHRoaXMubWFpbiA9ICEhcGFyYW1zLm1haW47CiAgICAgIHRoaXMuaWR4ID0gdGhpcy5kYXRhX2lkeCgpOwogICAgICB0aGlzLnRtYXAgPSB7fTsKICAgICAgdGhpcy50ZiA9IHRoaXMudGYgfHwgc2UudGY7CiAgICAgIGlmICh0aGlzLm1haW4pCiAgICAgICAgdGhpcy50ZiA9IHNlLnRmOwogICAgICBpZiAodGhpcy5hZ2d0eXBlID09PSAib2hsY3YiKSB7CiAgICAgICAgZm9yIChjb25zdCBpZCBvZiBPSExDVikgewogICAgICAgICAgdGhpc1tpZF0gPSBUUyhgJHt0aGlzLmlkfV8ke2lkfWAsIFtdKTsKICAgICAgICAgIHRoaXNbaWRdLl9fZm5fXyA9IFNhbXBsZXIoaWQpLmJpbmQodGhpc1tpZF0pOwogICAgICAgICAgdGhpc1tpZF0uX190Zl9fID0gdGhpcy50ZjsKICAgICAgICB9CiAgICAgIH0KICAgICAgaWYgKHRoaXMuYWdndHlwZSA9PT0gImNvcHkiKSB7CiAgICAgICAgZm9yIChjb25zdCBpZCBvZiBPSExDVikgewogICAgICAgICAgdGhpc1tpZF0gPSBUUyhgJHt0aGlzLmlkfV8ke2lkfWAsIFtdKTsKICAgICAgICAgIHRoaXNbaWRdLl9fdGZfXyA9IHRoaXMudGY7CiAgICAgICAgfQogICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5kYXRhLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgICB0aGlzLnRtYXBbdGhpcy5kYXRhW2ldWzBdXSA9IGk7CiAgICAgICAgfQogICAgICB9CiAgICAgIGlmICh0eXBlb2YgdGhpcy5hZ2d0eXBlID09PSAiZnVuY3Rpb24iKSB7CiAgICAgICAgdGhpcy5jbG9zZSA9IFRTKGAke3RoaXMuaWR9X2Nsb3NlYCwgW10pOwogICAgICAgIHRoaXMuY2xvc2UuX19mbl9fID0gdGhpcy5hZ2d0eXBlOwogICAgICAgIHRoaXMuY2xvc2UuX190Zl9fID0gdGhpcy50ZjsKICAgICAgfQogICAgICBpZiAodGhpcy5tYWluKSB7CiAgICAgICAgaWYgKCF0aGlzLnRmKQogICAgICAgICAgdGhyb3cgIk1haW4gdGYgc2hvdWxkIGJlIGRlZmluZWQiOwogICAgICAgIHNlLmN1c3RvbV9tYWluID0gdGhpczsKICAgICAgICBjb25zdCB0MCA9IHRoaXMuZGF0YVswXVswXTsKICAgICAgICBzZS50ID0gdDAgLSB0MCAlIHRoaXMudGY7CiAgICAgICAgdGhpcy51cGRhdGUobnVsbCwgc2UudCk7CiAgICAgICAgc2UuZGF0YS5vaGxjdi5kYXRhLmxlbmd0aCA9IDA7CiAgICAgICAgc2UuZGF0YS5vaGxjdi5kYXRhLnB1c2goWwogICAgICAgICAgc2UudCwKICAgICAgICAgIHRoaXMub3BlblswXSwKICAgICAgICAgIHRoaXMuaGlnaFswXSwKICAgICAgICAgIHRoaXMubG93WzBdLAogICAgICAgICAgdGhpcy5jbG9zZVswXSwKICAgICAgICAgIHRoaXMudm9sWzBdCiAgICAgICAgXSk7CiAgICAgIH0KICAgIH0KICAgIHVwZGF0ZSh4LCB0KSB7CiAgICAgIGlmICh0aGlzLmFnZ3R5cGUgPT09ICJvaGxjdiIpIHsKICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVfb2hsY3YoeCwgdCk7CiAgICAgIH0gZWxzZSBpZiAodGhpcy5hZ2d0eXBlID09PSAiY29weSIpIHsKICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVfY29weSh4LCB0KTsKICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5hZ2d0eXBlID09PSAiZnVuY3Rpb24iKSB7CiAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlX2N1c3RvbSh4LCB0KTsKICAgICAgfQogICAgfQogICAgdXBkYXRlX29obGN2KHgsIHQpIHsKICAgICAgdCA9IHQgfHwgc2UudDsKICAgICAgY29uc3QgaWR4ID0gdGhpcy5pZHg7CiAgICAgIHN3aXRjaCAodGhpcy5kYXRhX3R5cGUpIHsKICAgICAgICBjYXNlIEFSUjogewogICAgICAgICAgaWYgKHQgPiB0aGlzLmRhdGFbdGhpcy5kYXRhLmxlbmd0aCAtIDFdWzBdKQogICAgICAgICAgICByZXR1cm4gZmFsc2U7CiAgICAgICAgICBsZXQgdDAgPSB0aGlzLndpbmRvdyA/IHQgLSB0aGlzLndpbmRvdyArIHRoaXMudGYgOiB0OwogICAgICAgICAgY29uc3QgZHQgPSB0MCAlIHRoaXMudGY7CiAgICAgICAgICB0MCAtPSBkdDsKICAgICAgICAgIGNvbnN0IGkwID0gbmV4dHQodGhpcy5kYXRhLCB0MCk7CiAgICAgICAgICBpZiAoaTAgPj0gdGhpcy5kYXRhLmxlbmd0aCkKICAgICAgICAgICAgcmV0dXJuIGZhbHNlOwogICAgICAgICAgY29uc3QgdDEgPSB0ICsgc2UudGY7CiAgICAgICAgICBpZiAodCA8IHRoaXMudm9sLl9fdDBfXyArIHRoaXMudGYpCiAgICAgICAgICAgIHRoaXMudm9sWzBdID0gMDsKICAgICAgICAgIGxldCBub2V2ZW50ID0gdHJ1ZTsKICAgICAgICAgIGZvciAodmFyIGkgPSBpMDsgaSA8IHRoaXMuZGF0YS5sZW5ndGg7IGkrKykgewogICAgICAgICAgICBub2V2ZW50ID0gZmFsc2U7CiAgICAgICAgICAgIGNvbnN0IGRwID0gdGhpcy5kYXRhW2ldOwogICAgICAgICAgICBpZiAoZHBbaWR4LnRpbWVdID49IHQxKQogICAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgICB0aGlzLm9wZW4uX19mbl9fKGRwW2lkeC5vcGVuXSwgdCk7CiAgICAgICAgICAgIHRoaXMuaGlnaC5fX2ZuX18oZHBbaWR4LmhpZ2hdLCB0KTsKICAgICAgICAgICAgdGhpcy5sb3cuX19mbl9fKGRwW2lkeC5sb3ddLCB0KTsKICAgICAgICAgICAgdGhpcy5jbG9zZS5fX2ZuX18oZHBbaWR4LmNsb3NlXSwgdCk7CiAgICAgICAgICAgIHRoaXMudm9sLl9fZm5fXyhkcFtpZHgudm9sXSwgdCk7CiAgICAgICAgICB9CiAgICAgICAgICBpZiAobm9ldmVudCkgewogICAgICAgICAgICBpZiAodGhpcy5maWxsZ2FwcyA9PT0gZmFsc2UgJiYgIXRoaXMubWFpbikKICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7CiAgICAgICAgICAgIGNvbnN0IGxhc3QgPSB0aGlzLmNsb3NlWzBdOwogICAgICAgICAgICB0aGlzLm9wZW4uX19mbl9fKGxhc3QsIHQpOwogICAgICAgICAgICB0aGlzLmhpZ2guX19mbl9fKGxhc3QsIHQpOwogICAgICAgICAgICB0aGlzLmxvdy5fX2ZuX18obGFzdCwgdCk7CiAgICAgICAgICAgIHRoaXMuY2xvc2UuX19mbl9fKGxhc3QsIHQpOwogICAgICAgICAgICB0aGlzLnZvbC5fX2ZuX18oMCwgdCk7CiAgICAgICAgICB9CiAgICAgICAgICBicmVhazsKICAgICAgICB9CiAgICAgIH0KICAgICAgcmV0dXJuIHRydWU7CiAgICB9CiAgICB1cGRhdGVfY29weSh4LCB0KSB7CiAgICAgIHQgPSB0IHx8IHNlLnQ7CiAgICAgIGNvbnN0IGkgPSB0aGlzLnRtYXBbdF07CiAgICAgIGxldCBzID0gdGhpcy5kYXRhW2ldOwogICAgICBjb25zdCB0czAgPSB0aGlzLl9fdDBfXzsKICAgICAgaWYgKCF0czAgfHwgdCA+PSB0czAgKyB0aGlzLnRmKSB7CiAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCA1OyBrKyspIHsKICAgICAgICAgIGNvbnN0IHRzbiA9IE9ITENWW2tdOwogICAgICAgICAgdGhpc1t0c25dLnVuc2hpZnQodm9pZCAwKTsKICAgICAgICB9CiAgICAgICAgdGhpcy5fX3QwX18gPSB0IC0gdCAlIHRoaXMudGY7CiAgICAgICAgY29uc3QgbGFzdCA9IHRoaXMuZGF0YS5sZW5ndGggLSAxOwogICAgICAgIGlmICh0aGlzLl9fdDBfXyA9PT0gdGhpcy5kYXRhW2xhc3RdWzBdKSB7CiAgICAgICAgICB0aGlzLnRtYXBbdGhpcy5fX3QwX19dID0gbGFzdDsKICAgICAgICAgIHMgPSB0aGlzLmRhdGFbbGFzdF07CiAgICAgICAgfQogICAgICB9CiAgICAgIGlmIChzKSB7CiAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCA1OyBrKyspIHsKICAgICAgICAgIGNvbnN0IHRzbiA9IE9ITENWW2tdOwogICAgICAgICAgdGhpc1t0c25dWzBdID0gc1trICsgMV07CiAgICAgICAgfQogICAgICB9IGVsc2UgaWYgKHRoaXMuZmlsbGdhcHMpIHsKICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IDU7IGsrKykgewogICAgICAgICAgY29uc3QgdHNuID0gT0hMQ1Zba107CiAgICAgICAgICB0aGlzW3Rzbl1bMF0gPSB0aGlzLmNsb3NlWzFdOwogICAgICAgIH0KICAgICAgfQogICAgfQogICAgdXBkYXRlX2N1c3RvbSh4LCB0KSB7CiAgICAgIHQgPSB0IHx8IHNlLnQ7CiAgICAgIGNvbnN0IGlkeCA9IHRoaXMuaWR4OwogICAgICBzd2l0Y2ggKHRoaXMuZGF0YV90eXBlKSB7CiAgICAgICAgY2FzZSBBUlI6IHsKICAgICAgICAgIGlmICghdGhpcy5kYXRhLmxlbmd0aCkKICAgICAgICAgICAgcmV0dXJuIGZhbHNlOwogICAgICAgICAgaWYgKHQgPiB0aGlzLmRhdGFbdGhpcy5kYXRhLmxlbmd0aCAtIDFdWzBdKQogICAgICAgICAgICByZXR1cm4gZmFsc2U7CiAgICAgICAgICBsZXQgdDAgPSB0aGlzLndpbmRvdyA/IHQgLSB0aGlzLndpbmRvdyArIHRoaXMudGYgOiB0OwogICAgICAgICAgY29uc3QgZHQgPSB0MCAlIHRoaXMudGY7CiAgICAgICAgICB0MCAtPSBkdDsKICAgICAgICAgIGNvbnN0IGkwID0gbmV4dHQodGhpcy5kYXRhLCB0MCk7CiAgICAgICAgICBpZiAoaTAgPj0gdGhpcy5kYXRhLmxlbmd0aCkKICAgICAgICAgICAgcmV0dXJuIGZhbHNlOwogICAgICAgICAgY29uc3QgdDEgPSB0ICsgc2UudGY7CiAgICAgICAgICBjb25zdCBzdWIgPSBbXTsKICAgICAgICAgIGZvciAodmFyIGkgPSBpMDsgaSA8IHRoaXMuZGF0YS5sZW5ndGg7IGkrKykgewogICAgICAgICAgICBjb25zdCBkcCA9IHRoaXMuZGF0YVtpXTsKICAgICAgICAgICAgaWYgKGRwW2lkeC50aW1lXSA+PSB0MSkKICAgICAgICAgICAgICBicmVhazsKICAgICAgICAgICAgc3ViLnB1c2goZHApOwogICAgICAgICAgfQogICAgICAgICAgaWYgKHN1Yi5sZW5ndGggfHwgdGhpcy5maWxsZ2FwcyA9PT0gZmFsc2UpIHsKICAgICAgICAgICAgdmFyIHZhbCA9IHRoaXMuY2xvc2UuX19mbl9fKHN1Yik7CiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZmlsbGdhcHMgIT09IGZhbHNlKSB7CiAgICAgICAgICAgIHZhbCA9IHRoaXMuY2xvc2VbMF07CiAgICAgICAgICB9CiAgICAgICAgICBjb25zdCB0czAgPSB0aGlzLmNsb3NlLl9fdDBfXzsKICAgICAgICAgIGlmICghdHMwIHx8IHQgPj0gdHMwICsgdGhpcy50ZikgewogICAgICAgICAgICB0aGlzLmNsb3NlLnVuc2hpZnQodmFsKTsKICAgICAgICAgICAgdGhpcy5jbG9zZS5fX3QwX18gPSB0IC0gdCAlIHRoaXMudGY7CiAgICAgICAgICB9IGVsc2UgewogICAgICAgICAgICB0aGlzLmNsb3NlWzBdID0gdmFsOwogICAgICAgICAgfQogICAgICAgICAgYnJlYWs7CiAgICAgICAgfQogICAgICB9CiAgICAgIHJldHVybiB0cnVlOwogICAgfQogICAgLy8gQ2FsY3VsYXRlcyBkYXRhIGluZGljZXMgZnJvbSB0aGUgZm9ybWF0CiAgICBkYXRhX2lkeCgpIHsKICAgICAgY29uc3QgaWR4ID0ge307CiAgICAgIHN3aXRjaCAodGhpcy5hZ2d0eXBlKSB7CiAgICAgICAgY2FzZSAib2hsY3YiOgogICAgICAgICAgaWYgKCF0aGlzLmZvcm1hdCkgewogICAgICAgICAgICBjb25zdCB4MCA9IHRoaXMuZGF0YVswXTsKICAgICAgICAgICAgaWYgKCF4MCB8fCB4MC5sZW5ndGggPT09IDYpIHsKICAgICAgICAgICAgICB0aGlzLmZvcm1hdCA9ICJ0aW1lOm9wZW46aGlnaDpsb3c6Y2xvc2U6dm9sIjsKICAgICAgICAgICAgfSBlbHNlIGlmICh4MC5sZW5ndGggPT09IDMpIHsKICAgICAgICAgICAgICB0aGlzLmZvcm1hdCA9ICJ0aW1lOm9wZW4saGlnaCxsb3csY2xvc2U6dm9sIjsKICAgICAgICAgICAgfQogICAgICAgICAgfQogICAgICAgICAgYnJlYWs7CiAgICAgICAgZGVmYXVsdDoKICAgICAgICAgIHRoaXMuZm9ybWF0ID0gInRpbWU6Y2xvc2UiOwogICAgICAgICAgYnJlYWs7CiAgICAgIH0KICAgICAgdGhpcy5mb3JtYXQuc3BsaXQoIjoiKS5mb3JFYWNoKCh4LCBpKSA9PiB7CiAgICAgICAgaWYgKCF4Lmxlbmd0aCkKICAgICAgICAgIHJldHVybjsKICAgICAgICBjb25zdCBsaXN0ID0geC5zcGxpdCgiLCIpOwogICAgICAgIGxpc3QuZm9yRWFjaCgoeSkgPT4gaWR4W3ldID0gaSk7CiAgICAgIH0pOwogICAgICByZXR1cm4gaWR4OwogICAgfQogIH0KICBjbGFzcyBWaWV3IHsKICAgIGNvbnN0cnVjdG9yKHN0ZCwgbmFtZSwgcHJvcHMpIHsKICAgICAgdGhpcy5zdGQgPSBzdGQ7CiAgICAgIHRoaXMubmFtZSA9IG5hbWU7CiAgICAgIHRoaXMucHJvcHMgPSBwcm9wcyB8fCB7fTsKICAgICAgdGhpcy5wcm9wcy4kc3ludGggPSB0cnVlOwogICAgICB0aGlzLnByb3BzLnRmID0gdGZfZnJvbV9zdHIodGhpcy5wcm9wcy50Zik7CiAgICAgIHRoaXMudGYgPSB0aGlzLnByb3BzLnRmOwogICAgICB0aGlzLml0ZXIgPSB7CiAgICAgICAgb25jaGFydDogKHgsIG4sIHMpID0+IHRoaXMub25jaGFydCh4LCBuLCBzLCB0cnVlKSwKICAgICAgICBvZmZjaGFydDogKHgsIG4sIHMpID0+IHRoaXMub2ZmY2hhcnQoeCwgbiwgcywgdHJ1ZSkKICAgICAgfTsKICAgIH0KICAgIC8vIEFkZCBjaGFydCBwb2ludAogICAgY2hhcnQoeCwgc2V0dCA9IHt9KSB7CiAgICAgIGlmICh0aGlzLnRmICYmICF0aGlzLnN0ZC5vbmNsb3NlKHRoaXMudGYpKQogICAgICAgIHJldHVybjsKICAgICAgc2V0dC52aWV3ID0gdGhpcy5uYW1lOwogICAgICBzZXR0LnZwcm9wcyA9IHRoaXMucHJvcHM7CiAgICAgIGlmICh4ICYmIHguYWdndHlwZSkgewogICAgICAgIGNvbnN0IHgwID0gWwogICAgICAgICAgeC5vcGVuWzBdLAogICAgICAgICAgeC5oaWdoWzBdLAogICAgICAgICAgeC5sb3dbMF0sCiAgICAgICAgICB4LmNsb3NlWzBdLAogICAgICAgICAgeC52b2xbMF0KICAgICAgICBdOwogICAgICAgIHRoaXMuc3RkLmNoYXJ0KHgwLCBzZXR0KTsKICAgICAgfSBlbHNlIHsKICAgICAgICB0aGlzLnN0ZC5jaGFydCh4LCBzZXR0KTsKICAgICAgfQogICAgfQogICAgLy8gQWRkIG9uY2hhcnQgcG9pbnQKICAgIG9uY2hhcnQoeCwgbmFtZSwgc2V0dCA9IHt9LCBpdGVyKSB7CiAgICAgIGlmICh0aGlzLnRmICYmICF0aGlzLnN0ZC5vbmNsb3NlKHRoaXMudGYpICYmICFpdGVyKQogICAgICAgIHJldHVybjsKICAgICAgc2V0dC52aWV3ID0gdGhpcy5uYW1lOwogICAgICBzZXR0LnZwcm9wcyA9IHRoaXMucHJvcHM7CiAgICAgIG5hbWUgPSBzZXR0LnZpZXcgKyAiLyIgKyAobmFtZSB8fCAiT1YiKTsKICAgICAgdGhpcy5zdGQub25jaGFydCh4LCBuYW1lLCBzZXR0KTsKICAgIH0KICAgIC8vIEFkZCBvZmZjaGFydCBwb2ludAogICAgb2ZmY2hhcnQoeCwgbmFtZSwgc2V0dCA9IHt9LCBpdGVyKSB7CiAgICAgIGlmICh0aGlzLnRmICYmICF0aGlzLnN0ZC5vbmNsb3NlKHRoaXMudGYpICYmICFpdGVyKQogICAgICAgIHJldHVybjsKICAgICAgc2V0dC52aWV3ID0gdGhpcy5uYW1lOwogICAgICBzZXR0LnZwcm9wcyA9IHRoaXMucHJvcHM7CiAgICAgIG5hbWUgPSBzZXR0LnZpZXcgKyAiLyIgKyAobmFtZSB8fCAiT1YiKTsKICAgICAgdGhpcy5zdGQub2ZmY2hhcnQoeCwgbmFtZSwgc2V0dCk7CiAgICB9CiAgICAvLyBTZXR0ZXJzIChzZXQgdGhlIGVudGlyZSBvdmVybGF5IG9iamVjdCkKICAgICRjaGFydChkYXRhLCBzZXR0ID0ge30pIHsKICAgICAgY29uc3QgdHlwZSA9IHNldHQudHlwZTsKICAgICAgc2V0dC4kc3ludGggPSB0cnVlOwogICAgICBzZXR0LnNraXBOYU4gPSB0cnVlOwogICAgICB0aGlzLnN0ZC5lbnYuY2hhcnRbdGhpcy5uYW1lXSA9IHsKICAgICAgICB0eXBlOiB0eXBlIHx8ICJDYW5kbGVzIiwKICAgICAgICBkYXRhLAogICAgICAgIHNldHRpbmdzOiBzZXR0LAogICAgICAgIHZpZXc6IHRoaXMubmFtZSwKICAgICAgICB2cHJvcHM6IHRoaXMucHJvcHMsCiAgICAgICAgaW5kZXhCYXNlZDogdGhpcy5wcm9wcy5pYiwKICAgICAgICB0ZjogdGhpcy5wcm9wcy50ZgogICAgICB9OwogICAgICBkZWxldGUgc2V0dC50eXBlOwogICAgICBkZWxldGUgc2V0dC52cHJvcHM7CiAgICAgIGRlbGV0ZSBzZXR0LnZpZXc7CiAgICB9CiAgICAkb25jaGFydChkYXRhLCBuYW1lLCBzZXR0ID0ge30pIHsKICAgICAgY29uc3QgdHlwZSA9IHNldHQudHlwZTsKICAgICAgbmFtZSA9IHRoaXMubmFtZSArICIvIiArIChuYW1lIHx8ICJPViIpOwogICAgICBzZXR0LiRzeW50aCA9IHRydWU7CiAgICAgIHNldHQuc2tpcE5hTiA9IHRydWU7CiAgICAgIHRoaXMuc3RkLmVudi5vbmNoYXJ0W25hbWVdID0gewogICAgICAgIG5hbWUsCiAgICAgICAgdHlwZTogdHlwZSB8fCAiU3BsaW5lIiwKICAgICAgICBkYXRhLAogICAgICAgIHNldHRpbmdzOiBzZXR0LAogICAgICAgIHNjcmlwdHM6IGZhbHNlLAogICAgICAgIGdyaWQ6IHNldHQuZ3JpZCB8fCB7fSwKICAgICAgICB2aWV3OiB0aGlzLm5hbWUsCiAgICAgICAgdnByb3BzOiB0aGlzLnByb3BzCiAgICAgIH07CiAgICAgIGRlbGV0ZSBzZXR0LnR5cGU7CiAgICAgIGRlbGV0ZSBzZXR0LmdyaWQ7CiAgICB9CiAgICAkb2ZmY2hhcnQoZGF0YSwgbmFtZSwgc2V0dCA9IHt9KSB7CiAgICAgIGNvbnN0IHR5cGUgPSBzZXR0LnR5cGU7CiAgICAgIG5hbWUgPSB0aGlzLm5hbWUgKyAiLyIgKyAobmFtZSB8fCAiT1YiKTsKICAgICAgc2V0dC4kc3ludGggPSB0cnVlOwogICAgICBzZXR0LnNraXBOYU4gPSB0cnVlOwogICAgICB0aGlzLnN0ZC5lbnYub2ZmY2hhcnRbbmFtZV0gPSB7CiAgICAgICAgbmFtZSwKICAgICAgICB0eXBlOiB0eXBlIHx8ICJTcGxpbmUiLAogICAgICAgIGRhdGEsCiAgICAgICAgc2V0dGluZ3M6IHNldHQsCiAgICAgICAgc2NyaXB0czogZmFsc2UsCiAgICAgICAgZ3JpZDogc2V0dC5ncmlkIHx8IHt9LAogICAgICAgIHZpZXc6IHRoaXMubmFtZSwKICAgICAgICB2cHJvcHM6IHRoaXMucHJvcHMKICAgICAgfTsKICAgICAgZGVsZXRlIHNldHQudHlwZTsKICAgICAgZGVsZXRlIHNldHQuZ3JpZDsKICAgIH0KICB9CiAgY29uc3QgQlVGX0lOQyA9IDU7CiAgY2xhc3MgU2NyaXB0U3RkIHsKICAgIGNvbnN0cnVjdG9yKGVudikgewogICAgICB0aGlzLmVudiA9IGVudjsKICAgICAgdGhpcy5zZSA9IHNlOwogICAgICB0aGlzLlNXTUEgPSBbMSAvIDYsIDIgLyA2LCAyIC8gNiwgMSAvIDZdOwogICAgICB0aGlzLlNUREVWX0VQUyA9IDFlLTEwOwogICAgICB0aGlzLlNUREVWX1ogPSAxZS00OwogICAgICB0aGlzLl9pbmRleF90cmFja2luZygpOwogICAgfQogICAgLy8gV3JhcCBldmVyeSBpbmRleCB3aXRoIGluZGV4LXRyYWNraW5nIGZ1bmN0aW9uCiAgICAvLyBUaGF0IHdheSB3ZSB3aWxsIGtub3cgZXhhY3QgaW5kZXggcmFuZ2VzCiAgICBfaW5kZXhfdHJhY2tpbmcoKSB7CiAgICAgIGNvbnN0IHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXMpOwogICAgICBmb3IgKHZhciBrIG9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHByb3RvKSkgewogICAgICAgIHN3aXRjaCAoaykgewogICAgICAgICAgY2FzZSAiY29uc3RydWN0b3IiOgogICAgICAgICAgY2FzZSAidHMiOgogICAgICAgICAgY2FzZSAidHN0ZiI6CiAgICAgICAgICBjYXNlICJzYW1wbGUiOgogICAgICAgICAgY2FzZSAiX2luZGV4X3RyYWNraW5nIjoKICAgICAgICAgIGNhc2UgIl90c2lkIjoKICAgICAgICAgIGNhc2UgIl9pIjoKICAgICAgICAgIGNhc2UgIl92IjoKICAgICAgICAgIGNhc2UgIl9hZGRfaSI6CiAgICAgICAgICBjYXNlICJjaGFydCI6CiAgICAgICAgICBjYXNlICJzeW0iOgogICAgICAgICAgY2FzZSAidmlldyI6CiAgICAgICAgICBjYXNlICJwcm9wIjoKICAgICAgICAgIGNhc2UgImF1dG9QcmVjIjoKICAgICAgICAgICAgY29udGludWU7CiAgICAgICAgfQogICAgICAgIGNvbnN0IGYgPSB0aGlzLl9hZGRfaShrLCB0aGlzW2tdLnRvU3RyaW5nKCkpOwogICAgICAgIGlmIChmKQogICAgICAgICAgdGhpc1trXSA9IGY7CiAgICAgIH0KICAgIH0KICAgIC8qKgogICAgICAgKiBEZWNsYXJlIG5ldyBzY3JpcHQgcHJvcGVydHkKICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBQcm9wZXJ5IG5hbWUKICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGRlc2NyIC0gUHJvcGVyeSBkZXNjcmlwdG9yCiAgICAgICAqLwogICAgcHJvcChuYW1lLCBkZXNjcikgewogICAgICBjb25zdCBwcm9wcyA9IHRoaXMuZW52LnNyYy5wcm9wczsKICAgICAgaWYgKCEobmFtZSBpbiBwcm9wcykpIHsKICAgICAgICBwcm9wc1tuYW1lXSA9IGRlc2NyLmRlZjsKICAgICAgfQogICAgfQogICAgLyoqCiAgICAgICAqIEdldCBwcmVjaXNpb24gb2Ygb2hsYyBkYXRhc2V0CiAgICAgICAqIEByZXR1cm4ge251bWJlcn0gLSBPaGxjIHByZWNpb3Npb24KICAgICAgICovCiAgICBhdXRvUHJlYygpIHsKICAgICAgaWYgKCFzZS5kYXRhLm9obGN2KQogICAgICAgIHJldHVybiB2b2lkIDA7CiAgICAgIGNvbnN0IGRhdGEgPSBzZS5kYXRhLm9obGN2LmRhdGE7CiAgICAgIGNvbnN0IGxlbiA9IGRhdGEubGVuZ3RoOwogICAgICBjb25zdCBpMCA9IE1hdGgubWF4KDAsIGxlbiAtIDEwMCk7CiAgICAgIGxldCBtYXggPSAwOwogICAgICBmb3IgKHZhciBpID0gaTA7IGkgPCBsZW47IGkrKykgewogICAgICAgIGNvbnN0IHAgPSBkYXRhW2ldOwogICAgICAgIGZvciAodmFyIGsgPSAxOyBrIDwgNTsgaysrKSB7CiAgICAgICAgICBjb25zdCByID0gVXRpbHMubnVtYmVyTFIocFtrXSlbMV07CiAgICAgICAgICBpZiAociA+IG1heCkKICAgICAgICAgICAgbWF4ID0gcjsKICAgICAgICB9CiAgICAgIH0KICAgICAgcmV0dXJuIG1heDsKICAgIH0KICAgIC8vIEFkZCBpbmRleCB0cmFja2luZyB0byB0aGUgZnVuY3Rpb24KICAgIF9hZGRfaShuYW1lLCBzcmMpIHsKICAgICAgY29uc3QgYXJncyA9IGZfYXJncyhzcmMpOwogICAgICBzcmMgPSBmX2JvZHkoc3JjKTsKICAgICAgY29uc3Qgc3JjMiA9IHdyYXBfaWR4cyhzcmMsICJ0aGlzLiIpOwogICAgICBpZiAoc3JjMiAhPT0gc3JjKSB7CiAgICAgICAgcmV0dXJuIG5ldyBGdW5jdGlvbiguLi5hcmdzLCBzcmMyKTsKICAgICAgfQogICAgICByZXR1cm4gbnVsbDsKICAgIH0KICAgIC8vIEdlbmVyYXRlIHRoZSBuZXh0IHRpbWVzZXJpZXMgaWQKICAgIF90c2lkKHByZXYsIG5leHQpIHsKICAgICAgcmV0dXJuIGAke3ByZXZ9PC0ke25leHR9YDsKICAgIH0KICAgIC8vIEluZGV4LXRyYWNrZXIKICAgIF9pKGksIHgpIHsKICAgICAgaWYgKHggIT0gdm9pZCAwICYmIHggPT09IHggJiYgeC5fX2lkX18pIHsKICAgICAgICBpZiAoIXguX19sZW5fXyB8fCBpID49IHguX19sZW5fXykgewogICAgICAgICAgeC5fX2xlbl9fID0gaSArIEJVRl9JTkM7CiAgICAgICAgfQogICAgICB9CiAgICAgIHJldHVybiBpOwogICAgfQogICAgLy8gSW5kZXgtdHJhY2tlciAob2JqZWN0LWJhc2VkKQogICAgX3YoeCwgaSkgewogICAgICBpZiAoeCAhPSB2b2lkIDAgJiYgeCA9PT0geCAmJiB4Ll9faWRfXykgewogICAgICAgIGlmICgheC5fX2xlbl9fIHx8IGkgPj0geC5fX2xlbl9fKSB7CiAgICAgICAgICB4Ll9fbGVuX18gPSBpICsgQlVGX0lOQzsKICAgICAgICB9CiAgICAgIH0KICAgICAgcmV0dXJuIHg7CiAgICB9CiAgICAvKioKICAgICAgICogQ3JlYXRlcyBhIG5ldyB0aW1lLXNlcmllcyAmIHJlY29yZHMgZWFjaCB4LgogICAgICAgKiBSZXR1cm5zICBhbiBhcnJheS4gSWQgaXMgYXV0by1nZW5yYXRlZAogICAgICAgKiBAcGFyYW0geyp9IHggLSBBIHZhcmlhYmxlIHRvIHNhbXBsZSBmcm9tCiAgICAgICAqIEByZXR1cm4ge1RTfSAtIE5ldyB0aW1lLXNlcmllcwogICAgICAgKi8KICAgIHRzKHgsIF9pZCwgX3RmKSB7CiAgICAgIGlmIChfdGYpCiAgICAgICAgcmV0dXJuIHRoaXMudHN0Zih4LCBfdGYsIF9pZCk7CiAgICAgIGxldCB0cyA9IHRoaXMuZW52LnRzc1tfaWRdOwogICAgICBpZiAoIXRzKSB7CiAgICAgICAgdHMgPSB0aGlzLmVudi50c3NbX2lkXSA9IFt4XTsKICAgICAgICB0cy5fX2lkX18gPSBfaWQ7CiAgICAgIH0gZWxzZSB7CiAgICAgICAgdHNbMF0gPSB4OwogICAgICB9CiAgICAgIHJldHVybiB0czsKICAgIH0KICAgIC8qKgogICAgICAgKiBDcmVhdGVzIGEgbmV3IHRpbWUtc2VyaWVzICYgcmVjb3JkcyBlYWNoIHguCiAgICAgICAqIFVzZXMgU2FtcGxlciB0byBhZ2dyZWdhdGUgdGhlIHZhbHVlcwogICAgICAgKiBSZXR1cm4gdGhlIGFuIGFycmF5LiBJZCBpcyBhdXRvLWdlbnJhdGVkCiAgICAgICAqIEBwYXJhbSB7Kn0geCAtIEEgdmFyaWFibGUgdG8gc2FtcGxlIGZyb20KICAgICAgICogQHBhcmFtIHsobnVtYmVyfHN0cmluZyl9IHRmIC0gVGltZWZyYW1lIGluIG1zIG9yIGFzIGEgc3RyaW5nCiAgICAgICAqIEByZXR1cm4ge1RTfSAtIE5ldyB0aW1lLXNlcmllcwogICAgICAgKi8KICAgIHRzdGYoeCwgdGYsIF9pZCkgewogICAgICBsZXQgdHMgPSB0aGlzLmVudi50c3NbX2lkXTsKICAgICAgaWYgKCF0cykgewogICAgICAgIHRzID0gdGhpcy5lbnYudHNzW19pZF0gPSBbeF07CiAgICAgICAgdHMuX19pZF9fID0gX2lkOwogICAgICAgIHRzLl9fdGZfXyA9IHRmX2Zyb21fc3RyKHRmKTsKICAgICAgICB0cy5fX2ZuX18gPSBTYW1wbGVyKCJjbG9zZSIpLmJpbmQodHMpOwogICAgICB9IGVsc2UgewogICAgICAgIHRzLl9fZm5fXyh4KTsKICAgICAgfQogICAgICByZXR1cm4gdHM7CiAgICB9CiAgICAvKioKICAgICAgICogQ3JlYXRlcyBhIG5ldyBjdXN0b20gc2FtcGxlci4KICAgICAgICogUmV0dXJuIHRoZSBhbiBhcnJheS4gSWQgaXMgYXV0by1nZW5yYXRlZAogICAgICAgKiBAcGFyYW0geyp9IHggLSBBIHZhcmlhYmxlIHRvIHNhbXBsZSBmcm9tCiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIC0gU2FtcGxlciB0eXBlCiAgICAgICAqIEBwYXJhbSB7KG51bWJlcnxzdHJpbmcpfSB0ZiAtIFRpbWVmcmFtZSBpbiBtcyBvciBhcyBhIHN0cmluZwogICAgICAgKiBAcmV0dXJuIHtUU30gLSBOZXcgdGltZS1zZXJpZXMKICAgICAgICovCiAgICBzYW1wbGUoeCwgdHlwZSwgdGYsIF9pZCkgewogICAgICBsZXQgdHMgPSB0aGlzLmVudi50c3NbX2lkXTsKICAgICAgaWYgKCF0cykgewogICAgICAgIHRzID0gdGhpcy5lbnYudHNzW19pZF0gPSBbeF07CiAgICAgICAgdHMuX19pZF9fID0gX2lkOwogICAgICAgIHRzLl9fdGZfXyA9IHRmX2Zyb21fc3RyKHRmKTsKICAgICAgICB0cy5fX2ZuX18gPSBTYW1wbGVyKHR5cGUpLmJpbmQodHMpOwogICAgICB9IGVsc2UgewogICAgICAgIHRzLl9fZm5fXyh4KTsKICAgICAgfQogICAgICByZXR1cm4gdHM7CiAgICB9CiAgICAvKioKICAgICAgICogUmVwbGFjZXMgdGhlIHZhcmlhYmxlIGlmIGl0J3MgTmFOCiAgICAgICAqIEBwYXJhbSB7Kn0geCAtIFRoZSB2YXJpYWJsZQogICAgICAgKiBAcGFyYW0geyp9IFt2XSAtIEEgdmFsdWUgdG8gcmVwbGFjZSB3aXRoCiAgICAgICAqIEByZXR1cm4geyp9IC0gTmV3IHZhbHVlCiAgICAgICAqLwogICAgbnooeCwgdikgewogICAgICBpZiAoeCA9PSB2b2lkIDAgfHwgeCAhPT0geCkgewogICAgICAgIHJldHVybiB2IHx8IDA7CiAgICAgIH0KICAgICAgcmV0dXJuIHg7CiAgICB9CiAgICAvKioKICAgICAgICogSXMgdGhlIHZhcmlhYmxlIE5hTiA/CiAgICAgICAqIEBwYXJhbSB7Kn0geCAtIFRoZSB2YXJpYWJsZQogICAgICAgKiBAcmV0dXJuIHtib29sZWFufSAtIE5ldyB2YWx1ZQogICAgICAgKi8KICAgIG5hKHgpIHsKICAgICAgcmV0dXJuIHggPT0gdm9pZCAwIHx8IHggIT09IHg7CiAgICB9CiAgICAvKiogUmVwbGFjZXMgdGhlIHZhciB3aXRoIE5hTiBpZiBJbmZpbml0ZQogICAgICAgKiBAcGFyYW0geyp9IHggLSBUaGUgdmFyaWFibGUKICAgICAgICogQHBhcmFtIHsqfSBbdl0gLSBBIHZhbHVlIHRvIHJlcGxhY2Ugd2l0aAogICAgICAgKiBAcmV0dXJuIHsqfSAtIE5ldyB2YWx1ZQogICAgICAgKi8KICAgIG5mKHgsIHYpIHsKICAgICAgaWYgKCFpc0Zpbml0ZSh4KSkgewogICAgICAgIHJldHVybiB2ICE9PSB2b2lkIDAgPyB2IDogTmFOOwogICAgICB9CiAgICAgIHJldHVybiB4OwogICAgfQogICAgLy8gTWF0aCBvcGVyYXRvcnMgb24gdC1zZXJpZXMgYW5kIG51bWJlcnMKICAgIC8qKiBBZGRzIHZhbHVlcyAvIHRpbWUtc2VyaWVzCiAgICAgICAqIEBwYXJhbSB7KFRTfCopfSB4IC0gRmlyc3QgaW5wdXQKICAgICAgICogQHBhcmFtIHsoVFN8Kil9IHkgLSBTZWNvbmQgaW5wdXQKICAgICAgICogQHJldHVybiB7VFN9IC0gTmV3IHRpbWUtc2VyaWVzCiAgICAgICAqLwogICAgYWRkKHgsIHksIF9pZCkgewogICAgICBjb25zdCBpZCA9IHRoaXMuX3RzaWQoX2lkLCAiYWRkIik7CiAgICAgIGNvbnN0IHgwID0gdGhpcy5uYSh4KSA/IE5hTiA6IHguX19pZF9fID8geFswXSA6IHg7CiAgICAgIGNvbnN0IHkwID0gdGhpcy5uYSh5KSA/IE5hTiA6IHkuX19pZF9fID8geVswXSA6IHk7CiAgICAgIHJldHVybiB0aGlzLnRzKHgwICsgeTAsIGlkLCB4Ll9fdGZfXyk7CiAgICB9CiAgICAvKiogU3VidHJhY3RzIHZhbHVlcyAvIHRpbWUtc2VyaWVzCiAgICAgICAqIEBwYXJhbSB7KFRTfCopfSB4IC0gRmlyc3QgaW5wdXQKICAgICAgICogQHBhcmFtIHsoVFN8Kil9IHkgLSBTZWNvbmQgaW5wdXQKICAgICAgICogQHJldHVybiB7VFN9IC0gTmV3IHRpbWUtc2VyaWVzCiAgICAgICAqLwogICAgc3ViKHgsIHksIF9pZCkgewogICAgICBjb25zdCBpZCA9IHRoaXMuX3RzaWQoX2lkLCAic3ViIik7CiAgICAgIGNvbnN0IHgwID0gdGhpcy5uYSh4KSA/IE5hTiA6IHguX19pZF9fID8geFswXSA6IHg7CiAgICAgIGNvbnN0IHkwID0gdGhpcy5uYSh5KSA/IE5hTiA6IHkuX19pZF9fID8geVswXSA6IHk7CiAgICAgIHJldHVybiB0aGlzLnRzKHgwIC0geTAsIGlkLCB4Ll9fdGZfXyk7CiAgICB9CiAgICAvKiogTXVsdGlwbGllcyB2YWx1ZXMgLyB0aW1lLXNlcmllcwogICAgICAgKiBAcGFyYW0geyhUU3wqKX0geCAtIEZpcnN0IGlucHV0CiAgICAgICAqIEBwYXJhbSB7KFRTfCopfSB5IC0gU2Vjb25kIGlucHV0CiAgICAgICAqIEByZXR1cm4ge1RTfSAtIE5ldyB0aW1lLXNlcmllcwogICAgICAgKi8KICAgIG11bHQoeCwgeSwgX2lkKSB7CiAgICAgIGNvbnN0IGlkID0gdGhpcy5fdHNpZChfaWQsICJtdWx0Iik7CiAgICAgIGNvbnN0IHgwID0gdGhpcy5uYSh4KSA/IE5hTiA6IHguX19pZF9fID8geFswXSA6IHg7CiAgICAgIGNvbnN0IHkwID0gdGhpcy5uYSh5KSA/IE5hTiA6IHkuX19pZF9fID8geVswXSA6IHk7CiAgICAgIHJldHVybiB0aGlzLnRzKHgwICogeTAsIGlkLCB4Ll9fdGZfXyk7CiAgICB9CiAgICAvKiogRGl2aWRlcyB2YWx1ZXMgLyB0aW1lLXNlcmllcwogICAgICAgKiBAcGFyYW0geyhUU3wqKX0geCAtIEZpcnN0IGlucHV0CiAgICAgICAqIEBwYXJhbSB7KFRTfCopfSB5IC0gU2Vjb25kIGlucHV0CiAgICAgICAqIEByZXR1cm4ge1RTfSAtIE5ldyB0aW1lLXNlcmllcwogICAgICAgKi8KICAgIGRpdih4LCB5LCBfaWQpIHsKICAgICAgY29uc3QgaWQgPSB0aGlzLl90c2lkKF9pZCwgImRpdiIpOwogICAgICBjb25zdCB4MCA9IHRoaXMubmEoeCkgPyBOYU4gOiB4Ll9faWRfXyA/IHhbMF0gOiB4OwogICAgICBjb25zdCB5MCA9IHRoaXMubmEoeSkgPyBOYU4gOiB5Ll9faWRfXyA/IHlbMF0gOiB5OwogICAgICByZXR1cm4gdGhpcy50cyh4MCAvIHkwLCBpZCwgeC5fX3RmX18pOwogICAgfQogICAgLyoqIFJldHVybnMgYSBuZWdhdGl2ZSB2YWx1ZSAvIHRpbWUtc2VyaWVzCiAgICAgICAqIEBwYXJhbSB7KFRTfCopfSB4IC0gSW5wdXQKICAgICAgICogQHJldHVybiB7VFN9IC0gTmV3IHRpbWUtc2VyaWVzCiAgICAgICAqLwogICAgbmVnKHgsIF9pZCkgewogICAgICBjb25zdCBpZCA9IHRoaXMuX3RzaWQoX2lkLCAibmVnIik7CiAgICAgIGNvbnN0IHgwID0gdGhpcy5uYSh4KSA/IE5hTiA6IHguX19pZF9fID8geFswXSA6IHg7CiAgICAgIHJldHVybiB0aGlzLnRzKC14MCwgaWQsIHguX190Zl9fKTsKICAgIH0KICAgIC8qKiBBYnNvbHV0ZSB2YWx1ZQogICAgICAgKiBAcGFyYW0ge251bWJlcn0geCAtIElucHV0CiAgICAgICAqIEByZXR1cm4ge251bWJlcn0gLSBBYnNvbHV0ZSB2YWx1ZQogICAgICAgKi8KICAgIGFicyh4KSB7CiAgICAgIHJldHVybiBNYXRoLmFicyh4KTsKICAgIH0KICAgIC8qKiBBcmNjb3NpbmUgZnVuY3Rpb24KICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSBJbnB1dAogICAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IC0gQXJjY29zaW5lIG9mIHgKICAgICAgICovCiAgICBhY29zKHgpIHsKICAgICAgcmV0dXJuIE1hdGguYWNvcyh4KTsKICAgIH0KICAgIC8qKiBFbWl0cyBhbiBldmVudCB0byBEYXRhQ3ViZQogICAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSAtIFNpZ25hbCB0eXBlCiAgICAgICAqIEBwYXJhbSB7Kn0gZGF0YSAtIFNpZ25hbCBkYXRhCiAgICAgICAqLwogICAgc2lnbmFsKHR5cGUsIGRhdGEgPSB7fSkgewogICAgICBpZiAodGhpcy5zZS5zaGFyZWQuZXZlbnQgIT09ICJ1cGRhdGUiKQogICAgICAgIHJldHVybjsKICAgICAgdGhpcy5zZS5zZW5kKCJzY3JpcHQtc2lnbmFsIiwgeyB0eXBlLCBkYXRhIH0pOwogICAgfQogICAgLyoqIEVtaXRzIGFuIGV2ZW50IGlmIGNvbmQgPT09IHRydWUKICAgICAgICogQHBhcmFtIHsoYm9vbGVhbnxUUyl9IGNvbmQgLSBUaGUgY29uZGl0aW9uCiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIC0gU2lnbmFsIHR5cGUKICAgICAgICogQHBhcmFtIHsqfSBkYXRhIC0gU2lnbmFsIGRhdGEKICAgICAgICovCiAgICBzaWduYWxpZihjb25kLCB0eXBlLCBkYXRhID0ge30pIHsKICAgICAgaWYgKHRoaXMuc2Uuc2hhcmVkLmV2ZW50ICE9PSAidXBkYXRlIikKICAgICAgICByZXR1cm47CiAgICAgIGlmIChjb25kICYmIGNvbmQuX19pZF9fKQogICAgICAgIGNvbmQgPSBjb25kWzBdOwogICAgICBpZiAoY29uZCkgewogICAgICAgIHRoaXMuc2Uuc2VuZCgic2NyaXB0LXNpZ25hbCIsIHsgdHlwZSwgZGF0YSB9KTsKICAgICAgfQogICAgfQogICAgLyoqIEFybmF1ZCBMZWdvdXggTW92aW5nIEF2ZXJhZ2UKICAgICAgICogQHBhcmFtIHtUU30gc3JjIC0gSW5wdXQKICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGxlbiAtIExlbmd0aAogICAgICAgKiBAcGFyYW0ge251bWJlcn0gb2Zmc2V0IC0gT2Zmc2V0CiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzaWdtYSAtIFNpZ21hCiAgICAgICAqIEByZXR1cm4ge1RTfSAtIE5ldyB0aW1lLXNlcmllcwogICAgICAgKi8KICAgIGFsbWEoc3JjLCBsZW4sIG9mZnNldCwgc2lnbWEsIF9pZCkgewogICAgICBjb25zdCBpZCA9IHRoaXMuX3RzaWQoX2lkLCBgYWxtYSgke2xlbn0sJHtvZmZzZXR9LCR7c2lnbWF9KWApOwogICAgICBjb25zdCBtID0gTWF0aC5mbG9vcihvZmZzZXQgKiAobGVuIC0gMSkpOwogICAgICBjb25zdCBzID0gbGVuIC8gc2lnbWE7CiAgICAgIGxldCBub3JtID0gMDsKICAgICAgbGV0IHN1bSA9IDA7CiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHsKICAgICAgICBjb25zdCB3ID0gTWF0aC5leHAoLTEgKiBNYXRoLnBvdyhpIC0gbSwgMikgLyAoMiAqIE1hdGgucG93KHMsIDIpKSk7CiAgICAgICAgbm9ybSA9IG5vcm0gKyB3OwogICAgICAgIHN1bSA9IHN1bSArIHNyY1tsZW4gLSBpIC0gMV0gKiB3OwogICAgICB9CiAgICAgIHJldHVybiB0aGlzLnRzKHN1bSAvIG5vcm0sIGlkLCBzcmMuX190Zl9fKTsKICAgIH0KICAgIC8qKiBBcmNzaW5lIGZ1bmN0aW9uCiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gSW5wdXQKICAgICAgICogQHJldHVybiB7bnVtYmVyfSAtIEFyY3NpbmUgb2YgeAogICAgICAgKi8KICAgIGFzaW4oeCkgewogICAgICByZXR1cm4gTWF0aC5hc2luKHgpOwogICAgfQogICAgLyoqIEFyY3RhbmdlbnQgZnVuY3Rpb24KICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSBJbnB1dAogICAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IC0gQXJjdGFuZ2VudCBvZiB4CiAgICAgICAqLwogICAgYXRhbih4KSB7CiAgICAgIHJldHVybiBNYXRoLmF0YW4oeCk7CiAgICB9CiAgICAvKiogQXZlcmFnZSBUcnVlIFJhbmdlCiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZW4gLSBMZW5ndGgKICAgICAgICogQHJldHVybiB7VFN9IC0gTmV3IHRpbWUtc2VyaWVzCiAgICAgICAqLwogICAgYXRyKGxlbiwgX2lkLCBfdGYpIHsKICAgICAgY29uc3QgdGZzID0gX3RmIHx8ICIiOwogICAgICBjb25zdCBpZCA9IHRoaXMuX3RzaWQoX2lkLCBgYXRyKCR7bGVufSlgKTsKICAgICAgY29uc3QgaGlnaCA9IHRoaXMuZW52LnNoYXJlZFtgaGlnaCR7dGZzfWBdOwogICAgICBjb25zdCBsb3cgPSB0aGlzLmVudi5zaGFyZWRbYGxvdyR7dGZzfWBdOwogICAgICBjb25zdCBjbG9zZSA9IHRoaXMuZW52LnNoYXJlZFtgY2xvc2Uke3Rmc31gXTsKICAgICAgY29uc3QgdHIgPSB0aGlzLnRzKDAsIGlkLCBfdGYpOwogICAgICB0clswXSA9IHRoaXMubmEoaGlnaFsxXSkgPyBoaWdoWzBdIC0gbG93WzBdIDogTWF0aC5tYXgoCiAgICAgICAgTWF0aC5tYXgoCiAgICAgICAgICBoaWdoWzBdIC0gbG93WzBdLAogICAgICAgICAgTWF0aC5hYnMoaGlnaFswXSAtIGNsb3NlWzFdKQogICAgICAgICksCiAgICAgICAgTWF0aC5hYnMobG93WzBdIC0gY2xvc2VbMV0pCiAgICAgICk7CiAgICAgIHJldHVybiB0aGlzLnJtYSh0ciwgbGVuLCBpZCk7CiAgICB9CiAgICAvKiogQXZlcmFnZSBvZiBhcmd1bWVudHMKICAgICAgICogQHBhcmFtIHsuLi5udW1iZXJ9IGFyZ3MgLSBOdW1lcmljIHZhbHVlcwogICAgICAgKiBAcmV0dXJuIHtudW1iZXJ9CiAgICAgICAqLwogICAgYXZnKC4uLmFyZ3MpIHsKICAgICAgYXJncy5wb3AoKTsKICAgICAgbGV0IHN1bSA9IDA7CiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykgewogICAgICAgIHN1bSArPSBhcmdzW2ldOwogICAgICB9CiAgICAgIHJldHVybiBzdW0gLyBhcmdzLmxlbmd0aDsKICAgIH0KICAgIC8qKiBDYW5kbGVzIHNpbmNlIHRoZSBldmVudCBvY2N1cmVkIChjb25kID09PSB0cnVlKQogICAgICAgKiBAcGFyYW0geyhib29sZWFufFRTKX0gY29uZCAtIHRoZSBjb25kaXRpb24KICAgICAgICovCiAgICBzaW5jZShjb25kLCBfaWQpIHsKICAgICAgY29uc3QgaWQgPSB0aGlzLl90c2lkKF9pZCwgInNpbmNlKCkiKTsKICAgICAgaWYgKGNvbmQgJiYgY29uZC5fX2lkX18pCiAgICAgICAgY29uZCA9IGNvbmRbMF07CiAgICAgIGNvbnN0IHMgPSB0aGlzLnRzKHZvaWQgMCwgaWQpOwogICAgICBzWzBdID0gY29uZCA/IDAgOiBzWzFdICsgMTsKICAgICAgcmV0dXJuIHM7CiAgICB9CiAgICAvKiogQm9sbGluZ2VyIEJhbmRzCiAgICAgICAqIEBwYXJhbSB7VFN9IHNyYyAtIElucHV0CiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZW4gLSBMZW5ndGgKICAgICAgICogQHBhcmFtIHtudW1iZXJ9IG11bHQgLSBNdWx0aXBsaWVyCiAgICAgICAqIEByZXR1cm4ge1RTW119IC0gQXJyYXkgb2YgbmV3IHRpbWUtc2VyaWVzICgzIGJhbmRzKQogICAgICAgKi8KICAgIGJiKHNyYywgbGVuLCBtdWx0LCBfaWQpIHsKICAgICAgY29uc3QgaWQgPSB0aGlzLl90c2lkKF9pZCwgYGJiKCR7bGVufSwke211bHR9KWApOwogICAgICBjb25zdCBiYXNpcyA9IHRoaXMuc21hKHNyYywgbGVuLCBpZCk7CiAgICAgIGNvbnN0IGRldiA9IHRoaXMuc3RkZXYoc3JjLCBsZW4sIGlkKVswXSAqIG11bHQ7CiAgICAgIHJldHVybiBbCiAgICAgICAgYmFzaXMsCiAgICAgICAgdGhpcy50cyhiYXNpc1swXSArIGRldiwgaWQgKyAiMSIsIHNyYy5fX3RmX18pLAogICAgICAgIHRoaXMudHMoYmFzaXNbMF0gLSBkZXYsIGlkICsgIjIiLCBzcmMuX190Zl9fKQogICAgICBdOwogICAgfQogICAgLyoqIEJvbGxpbmdlciBCYW5kcyBXaWR0aAogICAgICAgKiBAcGFyYW0ge1RTfSBzcmMgLSBJbnB1dAogICAgICAgKiBAcGFyYW0ge251bWJlcn0gbGVuIC0gTGVuZ3RoCiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtdWx0IC0gTXVsdGlwbGllcgogICAgICAgKiBAcmV0dXJuIHtUU30gLSBOZXcgdGltZS1zZXJpZXMKICAgICAgICovCiAgICBiYncoc3JjLCBsZW4sIG11bHQsIF9pZCkgewogICAgICBjb25zdCBpZCA9IHRoaXMuX3RzaWQoX2lkLCBgYmJ3KCR7bGVufSwke211bHR9KWApOwogICAgICBjb25zdCBiYXNpcyA9IHRoaXMuc21hKHNyYywgbGVuLCBpZClbMF07CiAgICAgIGNvbnN0IGRldiA9IHRoaXMuc3RkZXYoc3JjLCBsZW4sIGlkKVswXSAqIG11bHQ7CiAgICAgIHJldHVybiB0aGlzLnRzKDIgKiBkZXYgLyBiYXNpcywgaWQsIHNyYy5fX3RmX18pOwogICAgfQogICAgLyoqIENvbnZlcnRzIHRoZSB2YXJpYWJsZSB0byBCb29sZWFuCiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IFRoZSB2YXJpYWJsZQogICAgICAgKiBAcmV0dXJuIHtudW1iZXJ9CiAgICAgICAqLwogICAgYm9vbCh4KSB7CiAgICAgIHJldHVybiAhIXg7CiAgICB9CiAgICAvKiogQ29tbW9kaXR5IENoYW5uZWwgSW5kZXgKICAgICAgICogQHBhcmFtIHtUU30gc3JjIC0gSW5wdXQKICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGxlbiAtIExlbmd0aAogICAgICAgKiBAcmV0dXJuIHtUU30gLSBOZXcgdGltZS1zZXJpZXMKICAgICAgICovCiAgICBjY2koc3JjLCBsZW4sIF9pZCkgewogICAgICBjb25zdCBpZCA9IHRoaXMuX3RzaWQoX2lkLCBgY2NpKCR7bGVufSlgKTsKICAgICAgY29uc3QgbWEgPSB0aGlzLnNtYShzcmMsIGxlbiwgaWQpOwogICAgICBjb25zdCBkZXYgPSB0aGlzLmRldihzcmMsIGxlbiwgaWQpOwogICAgICBjb25zdCBjY2kgPSAoc3JjWzBdIC0gbWFbMF0pIC8gKDAuMDE1ICogZGV2WzBdKTsKICAgICAgcmV0dXJuIHRoaXMudHMoY2NpLCBpZCwgc3JjLl9fdGZfXyk7CiAgICB9CiAgICAvKiogU2hvcnRjdXQgZm9yIE1hdGguY2VpbCgpCiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IFRoZSB2YXJpYWJsZQogICAgICAgKiBAcmV0dXJuIHtudW1iZXJ9CiAgICAgICAqLwogICAgY2VpbCh4KSB7CiAgICAgIHJldHVybiBNYXRoLmNlaWwoeCk7CiAgICB9CiAgICAvKiogQ2hhbmdlOiB4WzBdIC0geFtsZW5dCiAgICAgICAqIEBwYXJhbSB7VFN9IHNyYyAtIElucHV0CiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuXSAtIExlbmd0aAogICAgICAgKiBAcmV0dXJuIHtUU30gLSBOZXcgdGltZS1zZXJpZXMKICAgICAgICovCiAgICBjaGFuZ2Uoc3JjLCBsZW4gPSAxLCBfaWQpIHsKICAgICAgY29uc3QgaWQgPSB0aGlzLl90c2lkKF9pZCwgYGNoYW5nZSgke2xlbn0pYCk7CiAgICAgIHJldHVybiB0aGlzLnRzKHNyY1swXSAtIHNyY1tsZW5dLCBpZCwgc3JjLl9fdGZfXyk7CiAgICB9CiAgICAvKiogQ2hhbmRlIE1vbWVudHVtIE9zY2lsbGF0b3IKICAgICAgICogQHBhcmFtIHtUU30gc3JjIC0gSW5wdXQKICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGxlbiAtIExlbmd0aAogICAgICAgKiBAcmV0dXJuIHtUU30gLSBOZXcgdGltZS1zZXJpZXMKICAgICAgICovCiAgICBjbW8oc3JjLCBsZW4sIF9pZCkgewogICAgICBjb25zdCBpZCA9IHRoaXMuX3RzaWQoX2lkLCBgY21vKCR7bGVufSlgKTsKICAgICAgY29uc3QgbW9tID0gdGhpcy5jaGFuZ2Uoc3JjLCAxLCBpZCk7CiAgICAgIGNvbnN0IGcgPSB0aGlzLnRzKG1vbVswXSA+PSAwID8gbW9tWzBdIDogMCwgaWQgKyAiZyIsIHNyYy5fX3RmX18pOwogICAgICBjb25zdCBsID0gdGhpcy50cyhtb21bMF0gPj0gMCA/IDAgOiAtbW9tWzBdLCBpZCArICJsIiwgc3JjLl9fdGZfXyk7CiAgICAgIGNvbnN0IHNtMSA9IHRoaXMuc3VtKGcsIGxlbiwgaWQgKyAiMSIpWzBdOwogICAgICBjb25zdCBzbTIgPSB0aGlzLnN1bShsLCBsZW4sIGlkICsgIjIiKVswXTsKICAgICAgcmV0dXJuIHRoaXMudHMoMTAwICogKHNtMSAtIHNtMikgLyAoc20xICsgc20yKSwgaWQsIHNyYy5fX3RmX18pOwogICAgfQogICAgLyoqIENlbnRlciBvZiBHcmF2aXR5CiAgICAgICAqIEBwYXJhbSB7VFN9IHNyYyAtIElucHV0CiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZW4gLSBMZW5ndGgKICAgICAgICogQHJldHVybiB7VFN9IC0gTmV3IHRpbWUtc2VyaWVzCiAgICAgICAqLwogICAgY29nKHNyYywgbGVuLCBfaWQpIHsKICAgICAgY29uc3QgaWQgPSB0aGlzLl90c2lkKF9pZCwgYGNtbygke2xlbn0pYCk7CiAgICAgIGNvbnN0IHN1bSA9IHRoaXMuc3VtKHNyYywgbGVuLCBpZClbMF07CiAgICAgIGxldCBudW0gPSAwOwogICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7CiAgICAgICAgbnVtICs9IHNyY1tpXSAqIChpICsgMSk7CiAgICAgIH0KICAgICAgcmV0dXJuIHRoaXMudHMoLW51bSAvIHN1bSwgaWQsIHNyYy5fX3RmX18pOwogICAgfQogICAgLy8gQ29ycmVsYXRpb24KICAgIGNvcnIoKSB7CiAgICB9CiAgICAvKiogQ29zaW5lIGZ1bmN0aW9uCiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gSW5wdXQKICAgICAgICogQHJldHVybiB7bnVtYmVyfSAtIENvc2luZSBvZiB4CiAgICAgICAqLwogICAgY29zKHgpIHsKICAgICAgcmV0dXJuIE1hdGguY29zKHgpOwogICAgfQogICAgLyoqIFdoZW4gb25lIHRpbWUtc2VyaWVzIGNyb3NzZXMgYW5vdGhlcgogICAgICAgKiBAcGFyYW0ge1RTfSBzcmMxIC0gVFMxCiAgICAgICAqIEBwYXJhbSB7VFN9IHNyYzIgLSBUUzIKICAgICAgICogQHJldHVybiB7VFN9IC0gTmV3IHRpbWUtc2VyaWVzCiAgICAgICAqLwogICAgY3Jvc3Moc3JjMSwgc3JjMiwgX2lkKSB7CiAgICAgIGNvbnN0IGlkID0gdGhpcy5fdHNpZChfaWQsICJjcm9zcyIpOwogICAgICBjb25zdCB4ID0gc3JjMVswXSA+IHNyYzJbMF0gIT09IHNyYzFbMV0gPiBzcmMyWzFdOwogICAgICByZXR1cm4gdGhpcy50cyh4LCBpZCwgc3JjMS5fX3RmX18pOwogICAgfQogICAgLyoqIFdoZW4gb25lIHRpbWUtc2VyaWVzIGdvZXMgb3ZlciBhbm90aGVyIG9uZQogICAgICAgKiBAcGFyYW0ge1RTfSBzcmMxIC0gVFMxCiAgICAgICAqIEBwYXJhbSB7VFN9IHNyYzIgLSBUUzIKICAgICAgICogQHJldHVybiB7VFN9IC0gTmV3IHRpbWUtc2VyaWVzCiAgICAgICAqLwogICAgY3Jvc3NvdmVyKHNyYzEsIHNyYzIsIF9pZCkgewogICAgICBjb25zdCBpZCA9IHRoaXMuX3RzaWQoX2lkLCAiY3Jvc3NvdmVyIik7CiAgICAgIGNvbnN0IHggPSBzcmMxWzBdID4gc3JjMlswXSAmJiBzcmMxWzFdIDw9IHNyYzJbMV07CiAgICAgIHJldHVybiB0aGlzLnRzKHgsIGlkLCBzcmMxLl9fdGZfXyk7CiAgICB9CiAgICAvKiogV2hlbiBvbmUgdGltZS1zZXJpZXMgZ29lcyB1bmRlciBhbm90aGVyIG9uZQogICAgICAgKiBAcGFyYW0ge1RTfSBzcmMxIC0gVFMxCiAgICAgICAqIEBwYXJhbSB7VFN9IHNyYzIgLSBUUzIKICAgICAgICogQHJldHVybiB7VFN9IC0gTmV3IHRpbWUtc2VyaWVzCiAgICAgICAqLwogICAgY3Jvc3N1bmRlcihzcmMxLCBzcmMyLCBfaWQpIHsKICAgICAgY29uc3QgaWQgPSB0aGlzLl90c2lkKF9pZCwgImNyb3NzdW5kZXIiKTsKICAgICAgY29uc3QgeCA9IHNyYzFbMF0gPCBzcmMyWzBdICYmIHNyYzFbMV0gPj0gc3JjMlsxXTsKICAgICAgcmV0dXJuIHRoaXMudHMoeCwgaWQsIHNyYzEuX190Zl9fKTsKICAgIH0KICAgIC8qKiBTdW0gb2YgYWxsIGVsZW1lbnRzIG9mIHNyYwogICAgICAgKiBAcGFyYW0ge1RTfSBzcmMxIC0gSW5wdXQKICAgICAgICogQHJldHVybiB7VFN9IC0gTmV3IHRpbWUtc2VyaWVzCiAgICAgICAqLwogICAgY3VtKHNyYywgX2lkKSB7CiAgICAgIGNvbnN0IGlkID0gdGhpcy5fdHNpZChfaWQsICJjdW0iKTsKICAgICAgY29uc3QgcmVzID0gdGhpcy50cygwLCBpZCwgc3JjLl9fdGZfXyk7CiAgICAgIHJlc1swXSA9IHRoaXMubnooc3JjWzBdKSArIHRoaXMubnoocmVzWzFdKTsKICAgICAgcmV0dXJuIHJlczsKICAgIH0KICAgIC8qKiBEYXkgb2YgbW9udGgsIGxpdGVyYWxseQogICAgICAgKiBAcGFyYW0ge251bWJlcn0gW3RpbWVdIC0gVGltZSBpbiBtcyAoY3VycmVudCB0LCBpZiBub3QgZGVmaW5lZCkKICAgICAgICogQHJldHVybiB7bnVtYmVyfSAtIERheQogICAgICAgKi8KICAgIGRheW9mbW9udGgodGltZSkgewogICAgICByZXR1cm4gbmV3IERhdGUodGltZSB8fCBzZS50KS5nZXRVVENEYXRlKCk7CiAgICB9CiAgICAvKiogRGF5IG9mIHdlZWssIGxpdGVyYWxseQogICAgICAgKiBAcGFyYW0ge251bWJlcn0gW3RpbWVdIC0gVGltZSBpbiBtcyAoY3VycmVudCB0LCBpZiBub3QgZGVmaW5lZCkKICAgICAgICogQHJldHVybiB7bnVtYmVyfSAtIERheQogICAgICAgKi8KICAgIGRheW9md2Vlayh0aW1lKSB7CiAgICAgIHJldHVybiBuZXcgRGF0ZSh0aW1lIHx8IHNlLnQpLmdldFVUQ0RheSgpICsgMTsKICAgIH0KICAgIC8qKiBEZXZpYXRpb24gZnJvbSBTTUEKICAgICAgICogQHBhcmFtIHtUU30gc3JjIC0gSW5wdXQKICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGxlbiAtIExlbmd0aAogICAgICAgKiBAcmV0dXJuIHtUU30gLSBOZXcgdGltZS1zZXJpZXMKICAgICAgICovCiAgICBkZXYoc3JjLCBsZW4sIF9pZCkgewogICAgICBjb25zdCBpZCA9IHRoaXMuX3RzaWQoX2lkLCBgZGV2KCR7bGVufSlgKTsKICAgICAgY29uc3QgbWVhbiA9IHRoaXMuc21hKHNyYywgbGVuLCBpZClbMF07CiAgICAgIGxldCBzdW0gPSAwOwogICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7CiAgICAgICAgc3VtICs9IE1hdGguYWJzKHNyY1tpXSAtIG1lYW4pOwogICAgICB9CiAgICAgIHJldHVybiB0aGlzLnRzKHN1bSAvIGxlbiwgaWQsIHNyYy5fX3RmX18pOwogICAgfQogICAgLyoqIERpcmVjdGlvbmFsIE1vdmVtZW50IEluZGV4IEFEWCwgK0RJLCAtREkKICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGxlbiAtIExlbmd0aAogICAgICAgKiBAcGFyYW0ge251bWJlcn0gc21vb3RoIC0gU21vb3RobmVzcwogICAgICAgKiBAcmV0dXJuIHtUU30gLSBOZXcgdGltZS1zZXJpZXMKICAgICAgICovCiAgICBkbWkobGVuLCBzbW9vdGgsIF9pZCwgX3RmKSB7CiAgICAgIGNvbnN0IGlkID0gdGhpcy5fdHNpZChfaWQsIGBkbWkoJHtsZW59LCR7c21vb3RofSlgKTsKICAgICAgY29uc3QgdGZzID0gX3RmIHx8ICIiOwogICAgICBjb25zdCBoaWdoID0gdGhpcy5lbnYuc2hhcmVkW2BoaWdoJHt0ZnN9YF07CiAgICAgIGNvbnN0IGxvdyA9IHRoaXMuZW52LnNoYXJlZFtgbG93JHt0ZnN9YF07CiAgICAgIGNvbnN0IHVwID0gdGhpcy5jaGFuZ2UoaGlnaCwgMSwgaWQgKyAiMSIpWzBdOwogICAgICBjb25zdCBkb3duID0gdGhpcy5uZWcodGhpcy5jaGFuZ2UobG93LCAxLCBpZCArICIyIiksIGlkKVswXTsKICAgICAgY29uc3QgcGx1c0RNID0gdGhpcy50cygKICAgICAgICAxMDAgKiAodGhpcy5uYSh1cCkgPyBOYU4gOiB1cCA+IGRvd24gJiYgdXAgPiAwID8gdXAgOiAwKSwKICAgICAgICBpZCArICIzIiwKICAgICAgICBfdGYKICAgICAgKTsKICAgICAgY29uc3QgbWludXNETSA9IHRoaXMudHMoCiAgICAgICAgMTAwICogKHRoaXMubmEoZG93bikgPyBOYU4gOiBkb3duID4gdXAgJiYgZG93biA+IDAgPyBkb3duIDogMCksCiAgICAgICAgaWQgKyAiNCIsCiAgICAgICAgX3RmCiAgICAgICk7CiAgICAgIGNvbnN0IHRydXIgPSB0aGlzLnJtYSh0aGlzLnRyKGZhbHNlLCBpZCwgX3RmKSwgbGVuLCBpZCArICI1Iik7CiAgICAgIGNvbnN0IHBsdXMgPSB0aGlzLmRpdigKICAgICAgICB0aGlzLnJtYShwbHVzRE0sIGxlbiwgaWQgKyAiNiIpLAogICAgICAgIHRydXIsCiAgICAgICAgaWQgKyAiOCIKICAgICAgKTsKICAgICAgY29uc3QgbWludXMgPSB0aGlzLmRpdigKICAgICAgICB0aGlzLnJtYShtaW51c0RNLCBsZW4sIGlkICsgIjciKSwKICAgICAgICB0cnVyLAogICAgICAgIGlkICsgIjkiCiAgICAgICk7CiAgICAgIGNvbnN0IHN1bSA9IHRoaXMuYWRkKHBsdXMsIG1pbnVzLCBpZCArICIxMCIpWzBdOwogICAgICBjb25zdCBhZHggPSB0aGlzLnJtYSgKICAgICAgICB0aGlzLnRzKDEwMCAqIE1hdGguYWJzKHBsdXNbMF0gLSBtaW51c1swXSkgLyAoc3VtID09PSAwID8gMSA6IHN1bSksIGlkICsgIjExIiwgX3RmKSwKICAgICAgICBzbW9vdGgsCiAgICAgICAgaWQgKyAiMTIiCiAgICAgICk7CiAgICAgIHJldHVybiBbYWR4LCBwbHVzLCBtaW51c107CiAgICB9CiAgICAvKiogRXhwb25lbnRpYWwgTW92aW5nIEF2ZXJhZ2Ugd2l0aCBhbHBoYSA9IDIgLyAoeSArIDEpCiAgICAgICAqIEBwYXJhbSB7VFN9IHNyYyAtIElucHV0CiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZW4gLSBMZW5ndGgKICAgICAgICogQHJldHVybiB7VFN9IC0gTmV3IHRpbWUtc2VyaWVzCiAgICAgICAqLwogICAgZW1hKHNyYywgbGVuLCBfaWQpIHsKICAgICAgY29uc3QgaWQgPSB0aGlzLl90c2lkKF9pZCwgYGVtYSgke2xlbn0pYCk7CiAgICAgIGNvbnN0IGEgPSAyIC8gKGxlbiArIDEpOwogICAgICBjb25zdCBlbWEgPSB0aGlzLnRzKDAsIGlkLCBzcmMuX190Zl9fKTsKICAgICAgZW1hWzBdID0gdGhpcy5uYShlbWFbMV0pID8gdGhpcy5zbWEoc3JjLCBsZW4sIGlkKVswXSA6IGEgKiBzcmNbMF0gKyAoMSAtIGEpICogdGhpcy5ueihlbWFbMV0pOwogICAgICByZXR1cm4gZW1hOwogICAgfQogICAgLyoqIFNob3J0Y3V0IGZvciBNYXRoLmV4cCgpCiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IFRoZSB2YXJpYWJsZQogICAgICAgKiBAcmV0dXJuIHtudW1iZXJ9CiAgICAgICAqLwogICAgZXhwKHgpIHsKICAgICAgcmV0dXJuIE1hdGguZXhwKHgpOwogICAgfQogICAgLyoqIFRlc3QgaWYgInNyYyIgVFMgaXMgZmFsbGluZyBmb3IgImxlbiIgY2FuZGxlcwogICAgICAgKiBAcGFyYW0ge1RTfSBzcmMgLSBJbnB1dAogICAgICAgKiBAcGFyYW0ge251bWJlcn0gbGVuIC0gTGVuZ3RoCiAgICAgICAqIEByZXR1cm4ge1RTfSAtIE5ldyB0aW1lLXNlcmllcwogICAgICAgKi8KICAgIGZhbGxpbmcoc3JjLCBsZW4sIF9pZCkgewogICAgICBjb25zdCBpZCA9IHRoaXMuX3RzaWQoX2lkLCBgZmFsbGluZygke2xlbn0pYCk7CiAgICAgIGNvbnN0IGJvdCA9IHNyY1swXTsKICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBsZW4gKyAxOyBpKyspIHsKICAgICAgICBpZiAoYm90ID49IHNyY1tpXSkgewogICAgICAgICAgcmV0dXJuIHRoaXMudHMoZmFsc2UsIGlkLCBzcmMuX190Zl9fKTsKICAgICAgICB9CiAgICAgIH0KICAgICAgcmV0dXJuIHRoaXMudHModHJ1ZSwgaWQsIHNyYy5fX3RmX18pOwogICAgfQogICAgLyoqIEZvciBhIGdpdmVuIHNlcmllcyByZXBsYWNlcyBOYU4gdmFsdWVzIHdpdGgKICAgICAgICogcHJldmlvdXMgbmVhcmVzdCBub24tTmFOIHZhbHVlCiAgICAgICAqIEBwYXJhbSB7VFN9IHNyYyAtIElucHV0IHRpbWUtc2VyaWVzCiAgICAgICAqIEByZXR1cm4ge1RTfQogICAgICAgKi8KICAgIGZpeG5hbihzcmMpIHsKICAgICAgaWYgKHRoaXMubmEoc3JjWzBdKSkgewogICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgc3JjLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgICBpZiAoIXRoaXMubmEoc3JjW2ldKSkgewogICAgICAgICAgICBzcmNbMF0gPSBzcmNbaV07CiAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgfQogICAgICAgIH0KICAgICAgfQogICAgICByZXR1cm4gc3JjOwogICAgfQogICAgLyogVE9ETzogdGhpbmsKICAgICAgc2tpcG5hbih4LCBfaWQpIHsKICAgICAgICAgIGxldCBpZCA9IHRoaXMuX3RzaWQoX2lkLCBgc2tpcG5hbigpYCkKICAgICAgICAgIHJldHVybiB0aGlzLnRzKHRydWUsIGlkLCBzcmMuX190Zl9fKQogICAgICB9Ki8KICAgIC8qKiBTaG9ydGN1dCBmb3IgTWF0aC5mbG9vcigpCiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IFRoZSB2YXJpYWJsZQogICAgICAgKiBAcmV0dXJuIHtudW1iZXJ9CiAgICAgICAqLwogICAgZmxvb3IoeCkgewogICAgfQogICAgLyoqIEhpZ2hlc3QgdmFsdWUgZm9yIGEgZ2l2ZW4gbnVtYmVyIG9mIGNhbmRsZXMgYmFjawogICAgICAgKiBAcGFyYW0ge1RTfSBzcmMgLSBJbnB1dAogICAgICAgKiBAcGFyYW0ge251bWJlcn0gbGVuIC0gTGVuZ3RoCiAgICAgICAqIEByZXR1cm4ge1RTfSAtIE5ldyB0aW1lLXNlcmllcwogICAgICAgKi8KICAgIGhpZ2hlc3Qoc3JjLCBsZW4sIF9pZCkgewogICAgICBjb25zdCBpZCA9IHRoaXMuX3RzaWQoX2lkLCBgaGlnaGVzdCgke2xlbn0pYCk7CiAgICAgIGxldCBoaWdoID0gLUluZmluaXR5OwogICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7CiAgICAgICAgaWYgKHNyY1tpXSA+IGhpZ2gpCiAgICAgICAgICBoaWdoID0gc3JjW2ldOwogICAgICB9CiAgICAgIHJldHVybiB0aGlzLnRzKGhpZ2gsIGlkLCBzcmMuX190Zl9fKTsKICAgIH0KICAgIC8qKiBIaWdoZXN0IHZhbHVlIG9mZnNldCBmb3IgYSBnaXZlbiBudW1iZXIgb2YgYmFycyBiYWNrCiAgICAgICAqIEBwYXJhbSB7VFN9IHNyYyAtIElucHV0CiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZW4gLSBMZW5ndGgKICAgICAgICovCiAgICBoaWdoZXN0YmFycyhzcmMsIGxlbiwgX2lkKSB7CiAgICAgIGNvbnN0IGlkID0gdGhpcy5fdHNpZChfaWQsIGBoaWdoZXN0YmFycygke2xlbn0pYCk7CiAgICAgIGxldCBoaWdoID0gLUluZmluaXR5OwogICAgICBsZXQgaGkgPSAwOwogICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7CiAgICAgICAgaWYgKHNyY1tpXSA+IGhpZ2gpIHsKICAgICAgICAgIGhpZ2ggPSBzcmNbaV0sIGhpID0gaTsKICAgICAgICB9CiAgICAgIH0KICAgICAgcmV0dXJuIHRoaXMudHMoLWhpLCBpZCwgc3JjLl9fdGZfXyk7CiAgICB9CiAgICAvKiogSHVsbCBNb3ZpbmcgQXZlcmFnZQogICAgICAgKiBAcGFyYW0ge1RTfSBzcmMgLSBJbnB1dAogICAgICAgKiBAcGFyYW0ge251bWJlcn0gbGVuIC0gTGVuZ3RoCiAgICAgICAqIEByZXR1cm4ge1RTfSAtIE5ldyB0aW1lLXNlcmllcwogICAgICAgKi8KICAgIGhtYShzcmMsIGxlbiwgX2lkKSB7CiAgICAgIGNvbnN0IGlkID0gdGhpcy5fdHNpZChfaWQsIGBobWEoJHtsZW59KWApOwogICAgICBjb25zdCBsZW4yID0gTWF0aC5mbG9vcihsZW4gLyAyKTsKICAgICAgY29uc3QgbGVuMyA9IE1hdGgucm91bmQoTWF0aC5zcXJ0KGxlbikpOwogICAgICBjb25zdCBhID0gdGhpcy5tdWx0KHRoaXMud21hKHNyYywgbGVuMiwgaWQgKyAiMSIpLCAyLCBpZCk7CiAgICAgIGNvbnN0IGIgPSB0aGlzLndtYShzcmMsIGxlbiwgaWQgKyAiMiIpOwogICAgICBjb25zdCBkZWx0ID0gdGhpcy5zdWIoYSwgYiwgaWQgKyAiMyIpOwogICAgICByZXR1cm4gdGhpcy53bWEoZGVsdCwgbGVuMywgaWQgKyAiNCIpOwogICAgfQogICAgLyoqIFJldHVybnMgaG91cnMgb2YgYSBnaXZlbiB0aW1lc3RhbXAKICAgICAgICogQHBhcmFtIHtudW1iZXJ9IFt0aW1lXSAtIFRpbWUgaW4gbXMgKGN1cnJlbnQgdCwgaWYgbm90IGRlZmluZWQpCiAgICAgICAqIEByZXR1cm4ge251bWJlcn0gLSBIb3VyCiAgICAgICAqLwogICAgaG91cih0aW1lKSB7CiAgICAgIHJldHVybiBuZXcgRGF0ZSh0aW1lIHx8IHNlLnQpLmdldFVUQ0hvdXJzKCk7CiAgICB9CiAgICAvKiogUmV0dXJucyB4IG9yIHkgZGVwZW5kaW5nIG9uIHRoZSBjb25kaXRpb24KICAgICAgICogQHBhcmFtIHsoYm9vbGVhbnxUUyl9IGNvbmQgLSBDb25kaXRpb24KICAgICAgICogQHBhcmFtIHsqfSB4IC0gRnJpc3QgdmFsdWUKICAgICAgICogQHBhcmFtIHsqfSB5IC0gU2Vjb25kIHZhbHVlCiAgICAgICAqIEByZXR1cm4geyp9CiAgICAgICAqLwogICAgaWZmKGNvbmQsIHgsIHkpIHsKICAgICAgaWYgKGNvbmQgJiYgY29uZC5fX2lkX18pCiAgICAgICAgY29uZCA9IGNvbmRbMF07CiAgICAgIHJldHVybiBjb25kID8geCA6IHk7CiAgICB9CiAgICAvKiogS2VsdG5lciBDaGFubmVscwogICAgICAgKiBAcGFyYW0ge1RTfSBzcmMgLSBJbnB1dAogICAgICAgKiBAcGFyYW0ge251bWJlcn0gbGVuIC0gTGVuZ3RoCiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtdWx0IC0gTXVsdGlwbGllcgogICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFt1c2VfdHJdIC0gVXNlIHRydWUgcmFuZ2UKICAgICAgICogQHJldHVybiB7VFNbXX0gLSBBcnJheSBvZiBuZXcgdGltZS1zZXJpZXMgKDMgYmFuZHMpCiAgICAgICAqLwogICAga2Moc3JjLCBsZW4sIG11bHQsIHVzZV90ciA9IHRydWUsIF9pZCwgX3RmKSB7CiAgICAgIGNvbnN0IGlkID0gdGhpcy5fdHNpZChfaWQsIGBrYygke2xlbn0sJHttdWx0fSwke3VzZV90cn0pYCk7CiAgICAgIGNvbnN0IHRmcyA9IF90ZiB8fCAiIjsKICAgICAgY29uc3QgaGlnaCA9IHRoaXMuZW52LnNoYXJlZFtgaGlnaCR7dGZzfWBdOwogICAgICBjb25zdCBsb3cgPSB0aGlzLmVudi5zaGFyZWRbYGxvdyR7dGZzfWBdOwogICAgICBjb25zdCBiYXNpcyA9IHRoaXMuZW1hKHNyYywgbGVuLCBpZCArICIxIik7CiAgICAgIGNvbnN0IHJhbmdlID0gdXNlX3RyID8gdGhpcy50cihmYWxzZSwgaWQgKyAiMiIsIF90ZikgOiB0aGlzLnRzKGhpZ2hbMF0gLSBsb3dbMF0sIGlkICsgIjMiLCBzcmMuX190Zl9fKTsKICAgICAgY29uc3QgZW1hID0gdGhpcy5lbWEocmFuZ2UsIGxlbiwgaWQgKyAiNCIpOwogICAgICByZXR1cm4gWwogICAgICAgIGJhc2lzLAogICAgICAgIHRoaXMudHMoYmFzaXNbMF0gKyBlbWFbMF0gKiBtdWx0LCBpZCArICI1Iiwgc3JjLl9fdGZfXyksCiAgICAgICAgdGhpcy50cyhiYXNpc1swXSAtIGVtYVswXSAqIG11bHQsIGlkICsgIjYiLCBzcmMuX190Zl9fKQogICAgICBdOwogICAgfQogICAgLyoqIEtlbHRuZXIgQ2hhbm5lbHMgV2lkdGgKICAgICAgICogQHBhcmFtIHtUU30gc3JjIC0gSW5wdXQKICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGxlbiAtIExlbmd0aAogICAgICAgKiBAcGFyYW0ge251bWJlcn0gbXVsdCAtIE11bHRpcGxpZXIKICAgICAgICogQHBhcmFtIHtib29sZWFufSBbdXNlX3RyXSAtIFVzZSB0cnVlIHJhbmdlCiAgICAgICAqIEByZXR1cm4ge1RTfSAtIE5ldyB0aW1lLXNlcmllcwogICAgICAgKi8KICAgIGtjdyhzcmMsIGxlbiwgbXVsdCwgdXNlX3RyID0gdHJ1ZSwgX2lkLCBfdGYpIHsKICAgICAgY29uc3QgaWQgPSB0aGlzLl90c2lkKF9pZCwgYGtjdygke2xlbn0sJHttdWx0fSwke3VzZV90cn0pYCk7CiAgICAgIGNvbnN0IGtjID0gdGhpcy5rYyhzcmMsIGxlbiwgbXVsdCwgdXNlX3RyLCAia2N3IiwgX3RmKTsKICAgICAgcmV0dXJuIHRoaXMudHMoKGtjWzFdWzBdIC0ga2NbMl1bMF0pIC8ga2NbMF1bMF0sIGlkLCBzcmMuX190Zl9fKTsKICAgIH0KICAgIC8qKiBMaW5lYXIgUmVncmVzc2lvbgogICAgICAgKiBAcGFyYW0ge1RTfSBzcmMgLSBJbnB1dAogICAgICAgKiBAcGFyYW0ge251bWJlcn0gbGVuIC0gTGVuZ3RoCiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBvZmZzZXQgLSBPZmZzZXQKICAgICAgICogQHJldHVybiB7VFN9IC0gTmV3IHRpbWUtc2VyaWVzCiAgICAgICAqLwogICAgbGlucmVnKHNyYywgbGVuLCBvZmZzZXQgPSAwLCBfaWQpIHsKICAgICAgY29uc3QgaWQgPSB0aGlzLl90c2lkKF9pZCwgYGxpbnJlZygke2xlbn0pYCk7CiAgICAgIHNyYy5fX2xlbl9fID0gTWF0aC5tYXgoc3JjLl9fbGVuX18gfHwgMCwgbGVuKTsKICAgICAgY29uc3QgbHIgPSByZWdyZXNzaW9uKHNyYywgbGVuLCBvZmZzZXQpOwogICAgICByZXR1cm4gdGhpcy50cyhsciwgaWQsIHNyYy5fX3RmX18pOwogICAgfQogICAgLyoqIFNob3J0Y3V0IGZvciBNYXRoLmxvZygpCiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IFRoZSB2YXJpYWJsZQogICAgICAgKiBAcmV0dXJuIHtudW1iZXJ9CiAgICAgICAqLwogICAgbG9nKHgpIHsKICAgICAgcmV0dXJuIE1hdGgubG9nKHgpOwogICAgfQogICAgLyoqIFNob3J0Y3V0IGZvciBNYXRoLmxvZzEwKCkKICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHggVGhlIHZhcmlhYmxlCiAgICAgICAqIEByZXR1cm4ge251bWJlcn0KICAgICAgICovCiAgICBsb2cxMCh4KSB7CiAgICAgIHJldHVybiBNYXRoLmxvZzEwKHgpOwogICAgfQogICAgLyoqIExvd2VzdCB2YWx1ZSBmb3IgYSBnaXZlbiBudW1iZXIgb2YgY2FuZGxlcyBiYWNrCiAgICAgICAqIEBwYXJhbSB7VFN9IHNyYyAtIElucHV0CiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZW4gLSBMZW5ndGgKICAgICAgICogQHJldHVybiB7VFN9IC0gTmV3IHRpbWUtc2VyaWVzCiAgICAgICAqLwogICAgbG93ZXN0KHNyYywgbGVuLCBfaWQpIHsKICAgICAgY29uc3QgaWQgPSB0aGlzLl90c2lkKF9pZCwgYGxvd2VzdCgke2xlbn0pYCk7CiAgICAgIGxldCBsb3cgPSBJbmZpbml0eTsKICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykgewogICAgICAgIGlmIChzcmNbaV0gPCBsb3cpCiAgICAgICAgICBsb3cgPSBzcmNbaV07CiAgICAgIH0KICAgICAgcmV0dXJuIHRoaXMudHMobG93LCBpZCwgc3JjLl9fdGZfXyk7CiAgICB9CiAgICAvKiogTG93ZXN0IHZhbHVlIG9mZnNldCBmb3IgYSBnaXZlbiBudW1iZXIgb2YgYmFycyBiYWNrCiAgICAgICAqIEBwYXJhbSB7VFN9IHNyYyAtIElucHV0CiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZW4gLSBMZW5ndGgKICAgICAgICovCiAgICBsb3dlc3RiYXJzKHNyYywgbGVuLCBfaWQpIHsKICAgICAgY29uc3QgaWQgPSB0aGlzLl90c2lkKF9pZCwgYGxvd2VzdGJhcnMoJHtsZW59KWApOwogICAgICBsZXQgbG93ID0gSW5maW5pdHk7CiAgICAgIGxldCBsaSA9IDA7CiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHsKICAgICAgICBpZiAoc3JjW2ldIDwgbG93KSB7CiAgICAgICAgICBsb3cgPSBzcmNbaV0sIGxpID0gaTsKICAgICAgICB9CiAgICAgIH0KICAgICAgcmV0dXJuIHRoaXMudHMoLWxpLCBpZCwgc3JjLl9fdGZfXyk7CiAgICB9CiAgICAvKiogTW92aW5nIEF2ZXJhZ2UgQ29udmVyZ2VuY2UvRGl2ZXJnZW5jZQogICAgICAgKiBAcGFyYW0ge1RTfSBzcmMgLSBJbnB1dAogICAgICAgKiBAcGFyYW0ge251bWJlcn0gZmFzdCAtIEZhc3QgRU1BCiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzbG93IC0gU2xvdyBFTUEKICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHNpZyAtIFNpZ25hbAogICAgICAgKiBAcmV0dXJuIHtUU1tdfSAtIFttYWNkLCBzaWduYWwsIGhpc3RdCiAgICAgICAqLwogICAgbWFjZChzcmMsIGZhc3QsIHNsb3csIHNpZywgX2lkKSB7CiAgICAgIGNvbnN0IGlkID0gdGhpcy5fdHNpZChfaWQsIGBtYWNkKCR7ZmFzdH0ke3Nsb3d9JHtzaWd9KWApOwogICAgICBjb25zdCBmYXN0X21hID0gdGhpcy5lbWEoc3JjLCBmYXN0LCBpZCArICIxIik7CiAgICAgIGNvbnN0IHNsb3dfbWEgPSB0aGlzLmVtYShzcmMsIHNsb3csIGlkICsgIjIiKTsKICAgICAgY29uc3QgbWFjZCA9IHRoaXMuc3ViKGZhc3RfbWEsIHNsb3dfbWEsIGlkICsgIjMiKTsKICAgICAgY29uc3Qgc2lnbmFsID0gdGhpcy5lbWEobWFjZCwgc2lnLCBpZCArICI0Iik7CiAgICAgIGNvbnN0IGhpc3QgPSB0aGlzLnN1YihtYWNkLCBzaWduYWwsIGlkICsgIjUiKTsKICAgICAgcmV0dXJuIFttYWNkLCBzaWduYWwsIGhpc3RdOwogICAgfQogICAgLyoqIE1heCBvZiBhcmd1bWVudHMKICAgICAgICogQHBhcmFtIHsuLi5udW1iZXJ9IGFyZ3MgLSBOdW1lcmljIHZhbHVlcwogICAgICAgKiBAcmV0dXJuIHtudW1iZXJ9CiAgICAgICAqLwogICAgbWF4KC4uLmFyZ3MpIHsKICAgICAgYXJncy5wb3AoKTsKICAgICAgcmV0dXJuIE1hdGgubWF4KC4uLmFyZ3MpOwogICAgfQogICAgLyoqIFNlbmRzIHVwZGF0ZSB0byBzb21lIG92ZXJsYXkgLyBtYWluIGNoYXJ0CiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpZCAtIE92ZXJsYXkgaWQKICAgICAgICogQHBhcmFtIHtPYmplY3R9IGZpZWxkcyAtIEZpZWxkcyB0byBiZSBvdmVyd3JpdHRlbgogICAgICAgKi8KICAgIG1vZGlmeShpZCwgZmllbGRzKSB7CiAgICAgIHNlLnNlbmQoIm1vZGlmeS1vdmVybGF5IiwgeyB1dWlkOiBpZCwgZmllbGRzIH0pOwogICAgfQogICAgLyoqIFNldHMgdGhlIHJldmVyc2UgYnVmZmVyIHNpemUgZm9yIGEgZ2l2ZW4KICAgICAgICogdGltZS1zZXJpZXMgKGRlZmF1bHQgPSA1LCBncm93cyBvbiBkZW1hbmQpCiAgICAgICAqIEBwYXJhbSB7VFN9IHNyYyAtIElucHV0CiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZW4gLSBOZXcgbGVuZ3RoCiAgICAgICAqLwogICAgYnVmZnNpemUoc3JjLCBsZW4pIHsKICAgICAgc3JjLl9fbGVuX18gPSBsZW47CiAgICB9CiAgICAvKiogTW9uZXkgRmxvdyBJbmRleAogICAgICAgKiBAcGFyYW0ge1RTfSBzcmMgLSBJbnB1dAogICAgICAgKiBAcGFyYW0ge251bWJlcn0gbGVuIC0gTGVuZ3RoCiAgICAgICAqIEByZXR1cm4ge1RTfSAtIE5ldyB0aW1lLXNlcmllcwogICAgICAgKi8KICAgIG1maShzcmMsIGxlbiwgX2lkKSB7CiAgICAgIGNvbnN0IGlkID0gdGhpcy5fdHNpZChfaWQsIGBtZmkoJHtsZW59KWApOwogICAgICBjb25zdCB2b2wgPSB0aGlzLmVudi5zaGFyZWQudm9sOwogICAgICBjb25zdCBjaCA9IHRoaXMuY2hhbmdlKHNyYywgMSwgaWQgKyAiMSIpWzBdOwogICAgICBjb25zdCB0czEgPSB0aGlzLm11bHQodm9sLCBjaCA8PSAwID8gMCA6IHNyY1swXSwgaWQgKyAiMiIpOwogICAgICBjb25zdCB0czIgPSB0aGlzLm11bHQodm9sLCBjaCA+PSAwID8gMCA6IHNyY1swXSwgaWQgKyAiMyIpOwogICAgICBjb25zdCB1cHBlciA9IHRoaXMuc3VtKHRzMSwgbGVuLCBpZCArICI0Iik7CiAgICAgIGNvbnN0IGxvd2VyID0gdGhpcy5zdW0odHMyLCBsZW4sIGlkICsgIjUiKTsKICAgICAgbGV0IHJlcyA9IHZvaWQgMDsKICAgICAgaWYgKCF0aGlzLm5hKGxvd2VyKSkgewogICAgICAgIHJlcyA9IHRoaXMucnNpKHVwcGVyLCBsb3dlciwgaWQgKyAiNiIpWzBdOwogICAgICB9CiAgICAgIHJldHVybiB0aGlzLnRzKHJlcywgaWQsIHNyYy5fX3RmX18pOwogICAgfQogICAgLyoqIE1pbiBvZiBhcmd1bWVudHMKICAgICAgICogQHBhcmFtIHsuLi5udW1iZXJ9IGFyZ3MgLSBOdW1lcmljIHZhbHVlcwogICAgICAgKiBAcmV0dXJuIHtudW1iZXJ9CiAgICAgICAqLwogICAgbWluKC4uLmFyZ3MpIHsKICAgICAgYXJncy5wb3AoKTsKICAgICAgcmV0dXJuIE1hdGgubWluKC4uLmFyZ3MpOwogICAgfQogICAgLyoqIFJldHVybnMgbWludXRlcyBvZiBhIGdpdmVuIHRpbWVzdGFtcAogICAgICAgKiBAcGFyYW0ge251bWJlcn0gW3RpbWVdIC0gVGltZSBpbiBtcyAoY3VycmVudCB0LCBpZiBub3QgZGVmaW5lZCkKICAgICAgICogQHJldHVybiB7bnVtYmVyfSAtIEhvdXIKICAgICAgICovCiAgICBtaW51dGUodGltZSkgewogICAgICByZXR1cm4gbmV3IERhdGUodGltZSB8fCBzZS50KS5nZXRVVENNaW51dGVzKCk7CiAgICB9CiAgICAvKiogTW9tZW50dW0KICAgICAgICogQHBhcmFtIHtUU30gc3JjIC0gSW5wdXQKICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGxlbiAtIExlbmd0aAogICAgICAgKiBAcmV0dXJuIHtUU30gLSBOZXcgdGltZS1zZXJpZXMKICAgICAgICovCiAgICBtb20oc3JjLCBsZW4sIF9pZCkgewogICAgICBjb25zdCBpZCA9IHRoaXMuX3RzaWQoX2lkLCBgbW9tKCR7bGVufSlgKTsKICAgICAgcmV0dXJuIHRoaXMudHMoc3JjWzBdIC0gc3JjW2xlbl0sIGlkLCBzcmMuX190Zl9fKTsKICAgIH0KICAgIC8qKiBNb250aAogICAgICAgKiBAcGFyYW0ge251bWJlcn0gW3RpbWVdIC0gVGltZSBpbiBtcyAoY3VycmVudCB0LCBpZiBub3QgZGVmaW5lZCkKICAgICAgICogQHJldHVybiB7bnVtYmVyfSAtIERheQogICAgICAgKi8KICAgIG1vbnRoKHRpbWUpIHsKICAgICAgcmV0dXJuIG5ldyBEYXRlKHRpbWUgfHwgc2UudCkuZ2V0VVRDTW9udGgoKTsKICAgIH0KICAgIC8qKiBEaXNwbGF5IGRhdGEgcG9pbnQgYXMgdGhlIG1haW4gY2hhcnQKICAgICAgICogQHBhcmFtIHsoVFN8VFNbXXwqKX0geCAtIERhdGEgcG9pbnQgLyBUUyAvIGFycmF5IG9mIFRTCiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbc2V0dF0gLSBPYmplY3Qgd2l0aCBzZXR0aW5ncyAmIE9WIHR5cGUKICAgICAgICovCiAgICBjaGFydCh4LCBzZXR0ID0ge30sIF9pZCkgewogICAgICBjb25zdCB2aWV3ID0gc2V0dC52aWV3IHx8ICJtYWluIjsKICAgICAgbGV0IG9mZiA9IDA7CiAgICAgIGlmICh4ICYmIHguX19pZF9fKSB7CiAgICAgICAgb2ZmID0geC5fX29mZnNldF9fIHx8IDA7CiAgICAgICAgeCA9IHhbMF07CiAgICAgIH0KICAgICAgaWYgKEFycmF5LmlzQXJyYXkoeCkgJiYgeFswXSAmJiB4WzBdLl9faWRfXykgewogICAgICAgIG9mZiA9IHhbMF0uX19vZmZzZXRfXyB8fCAwOwogICAgICAgIHggPSB4Lm1hcCgoeDIpID0+IHgyWzBdKTsKICAgICAgfQogICAgICBpZiAoIXRoaXMuZW52LmNoYXJ0W3ZpZXddKSB7CiAgICAgICAgY29uc3QgdHlwZSA9IHNldHQudHlwZTsKICAgICAgICBzZXR0LiRzeW50aCA9IHRydWU7CiAgICAgICAgc2V0dC5za2lwTmFOID0gdHJ1ZTsKICAgICAgICB0aGlzLmVudi5jaGFydFt2aWV3XSA9IHsKICAgICAgICAgIHR5cGU6IHR5cGUgfHwgIkNhbmRsZXMiLAogICAgICAgICAgZGF0YTogW10sCiAgICAgICAgICBzZXR0aW5nczogc2V0dCwKICAgICAgICAgIHZpZXcsCiAgICAgICAgICB2cHJvcHM6IHNldHQudnByb3BzLAogICAgICAgICAgaW5kZXhCYXNlZDogc2V0dC52cHJvcHMuaWIsCiAgICAgICAgICB0Zjogc2V0dC52cHJvcHMudGYKICAgICAgICB9OwogICAgICAgIGRlbGV0ZSBzZXR0LnR5cGU7CiAgICAgICAgZGVsZXRlIHNldHQudnByb3BzOwogICAgICAgIGRlbGV0ZSBzZXR0LnZpZXc7CiAgICAgIH0KICAgICAgb2ZmICo9IHNlLnRmOwogICAgICBjb25zdCB2ID0gQXJyYXkuaXNBcnJheSh4KSA/IFtzZS50ICsgb2ZmLCAuLi54XSA6IFtzZS50ICsgb2ZmLCB4XTsKICAgICAgdXBkYXRlKHRoaXMuZW52LmNoYXJ0W3ZpZXddLmRhdGEsIHYpOwogICAgfQogICAgLyoqIFJldHVybnMgdHJ1ZSB3aGVuIHRoZSBjYW5kbGUodGYpIGlzIGJlaW5nIGNsb3NlZAogICAgICAgKiAoY3JlYXRlIGEgbmV3IG92ZXJsYXkgaW4gRGF0YUN1YmUpCiAgICAgICAqIEBwYXJhbSB7KG51bWJlcnxzdHJpbmcpfSB0ZiAtIFRpbWVmcmFtZSBpbiBtcyBvciBhcyBhIHN0cmluZwogICAgICAgKiBAcmV0dXJuIHtib29sZWFufQogICAgICAgKi8KICAgIG9uY2xvc2UodGYpIHsKICAgICAgaWYgKCF0aGlzLmVudi5zaGFyZWQub25jbG9zZSkKICAgICAgICByZXR1cm4gZmFsc2U7CiAgICAgIGlmICghdGYpCiAgICAgICAgdGYgPSBzZS50ZjsKICAgICAgcmV0dXJuIChzZS50ICsgc2UudGYpICUgdGZfZnJvbV9zdHIodGYpID09PSAwOwogICAgfQogICAgLyoqIFNlbmRzIHNldHRpbmdzIHVwZGF0ZQogICAgICAgKiAoY2FuIGJlIGNhbGxlZCBmcm9tIGluaXQoKSwgdXBkYXRlKCkgb3IgcG9zdCgpKQogICAgICAgKiBAcGFyYW0ge09iamVjdH0gdXBkIC0gU2V0dGluZ3MgdXBkYXRlIChvYmplY3QgdG8gbWVyZ2UpCiAgICAgICAqLwogICAgc2V0dGluZ3ModXBkKSB7CiAgICAgIHRoaXMuZW52LnNlbmRfbW9kaWZ5KHsgc2V0dGluZ3M6IHVwZCB9KTsKICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLmVudi5zcmMuc2V0dCwgdXBkKTsKICAgIH0KICAgIC8qKiBTaGlmdHMgVFMgbGVmdCBvciByaWdodCBieSAibnVtIiBjYW5kbGVzCiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBudW0gLSBPZmZzZXQgbWVhc3VyZWQgaW4gY2FuZGxlcwogICAgICAgKiBAcmV0dXJuIHtUU30gLSBOZXcgLyBleGlzdGluZyB0aW1lLXNlcmllcwogICAgICAgKi8KICAgIG9mZnNldChzcmMsIG51bSwgX2lkKSB7CiAgICAgIGlmIChzcmMuX19pZF9fKSB7CiAgICAgICAgc3JjLl9fb2Zmc2V0X18gPSBudW07CiAgICAgICAgcmV0dXJuIHNyYzsKICAgICAgfQogICAgICBjb25zdCBpZCA9IHRoaXMuX3RzaWQoX2lkLCBgb2Zmc2V0KCR7bnVtfSlgKTsKICAgICAgY29uc3Qgb3V0ID0gdGhpcy50cyhzcmMsIGlkKTsKICAgICAgb3V0Ll9fb2Zmc2V0X18gPSBudW07CiAgICAgIHJldHVybiBvdXQ7CiAgICB9CiAgICAvLyBwZXJjZW50aWxlX2xpbmVhcl9pbnRlcnBvbGF0aW9uCiAgICBsaW5lYXJpbnQoKSB7CiAgICB9CiAgICAvLyBwZXJjZW50aWxlX25lYXJlc3RfcmFuawogICAgbmVhcmVzdHJhbmsoKSB7CiAgICB9CiAgICAvKiogVGhlIGN1cnJlbnQgdGltZQogICAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IC0gdGltZXN0YW1wCiAgICAgICAqLwogICAgbm93KCkgewogICAgICByZXR1cm4gKC8qIEBfX1BVUkVfXyAqLyBuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7CiAgICB9CiAgICBwZXJjZW50cmFuaygpIHsKICAgIH0KICAgIC8qKiBSZXR1cm5zIHByaWNlIG9mIHRoZSBwaXZvdCBoaWdoIHBvaW50CiAgICAgICAqIFRpcDogd29ya3MgYmVzdCB3aXRoIGBvZmZzZXRgIGZ1bmN0aW9uCiAgICAgICAqIEBwYXJhbSB7VFN9IHNyYyAtIElucHV0CiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZWZ0IC0gbGVmdCB0aHJlc2hvbGQsIGNhbmRsZXMKICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHJpZ2h0IC0gcmlnaHQgdGhyZXNob2xkLCBjYW5kbGVzCiAgICAgICAqIEByZXR1cm4ge1RTfSAtIE5ldyB0aW1lLXNlcmllcwogICAgICAgKi8KICAgIHBpdm90aGlnaChzcmMsIGxlZnQsIHJpZ2h0LCBfaWQpIHsKICAgICAgY29uc3QgaWQgPSB0aGlzLl90c2lkKF9pZCwgYHBpdm90aGlnaCgke2xlZnR9LCR7cmlnaHR9KWApOwogICAgICBjb25zdCBsZW4gPSBsZWZ0ICsgcmlnaHQgKyAxOwogICAgICBjb25zdCB0b3AgPSBzcmNbcmlnaHRdOwogICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7CiAgICAgICAgaWYgKHRvcCA8PSBzcmNbaV0gJiYgaSAhPT0gcmlnaHQpIHsKICAgICAgICAgIHJldHVybiB0aGlzLnRzKE5hTiwgaWQsIHNyYy5fX3RmX18pOwogICAgICAgIH0KICAgICAgfQogICAgICByZXR1cm4gdGhpcy50cyh0b3AsIGlkLCBzcmMuX190Zl9fKTsKICAgIH0KICAgIC8qKiBSZXR1cm5zIHByaWNlIG9mIHRoZSBwaXZvdCBsb3cgcG9pbnQKICAgICAgICogVGlwOiB3b3JrcyBiZXN0IHdpdGggYG9mZnNldGAgZnVuY3Rpb24KICAgICAgICogQHBhcmFtIHtUU30gc3JjIC0gSW5wdXQKICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGxlZnQgLSBsZWZ0IHRocmVzaG9sZCwgY2FuZGxlcwogICAgICAgKiBAcGFyYW0ge251bWJlcn0gcmlnaHQgLSByaWdodCB0aHJlc2hvbGQsIGNhbmRsZXMKICAgICAgICogQHJldHVybiB7VFN9IC0gTmV3IHRpbWUtc2VyaWVzCiAgICAgICAqLwogICAgcGl2b3Rsb3coc3JjLCBsZWZ0LCByaWdodCwgX2lkKSB7CiAgICAgIGNvbnN0IGlkID0gdGhpcy5fdHNpZChfaWQsIGBwaXZvdGxvdygke2xlZnR9LCR7cmlnaHR9KWApOwogICAgICBjb25zdCBsZW4gPSBsZWZ0ICsgcmlnaHQgKyAxOwogICAgICBjb25zdCBib3QgPSBzcmNbcmlnaHRdOwogICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7CiAgICAgICAgaWYgKGJvdCA+PSBzcmNbaV0gJiYgaSAhPT0gcmlnaHQpIHsKICAgICAgICAgIHJldHVybiB0aGlzLnRzKE5hTiwgaWQsIHNyYy5fX3RmX18pOwogICAgICAgIH0KICAgICAgfQogICAgICByZXR1cm4gdGhpcy50cyhib3QsIGlkLCBzcmMuX190Zl9fKTsKICAgIH0KICAgIC8qKiBTaG9ydGN1dCBmb3IgTWF0aC5wb3coKQogICAgICAgKiBAcGFyYW0ge251bWJlcn0geCBUaGUgdmFyaWFibGUKICAgICAgICogQHJldHVybiB7bnVtYmVyfQogICAgICAgKi8KICAgIHBvdyh4KSB7CiAgICAgIHJldHVybiBNYXRoLnBvdyh4KTsKICAgIH0KICAgIC8qKiBUZXN0IGlmICJzcmMiIFRTIGlzIHJpc2luZyBmb3IgImxlbiIgY2FuZGxlcwogICAgICAgKiBAcGFyYW0ge1RTfSBzcmMgLSBJbnB1dAogICAgICAgKiBAcGFyYW0ge251bWJlcn0gbGVuIC0gTGVuZ3RoCiAgICAgICAqIEByZXR1cm4ge1RTfSAtIE5ldyB0aW1lLXNlcmllcwogICAgICAgKi8KICAgIHJpc2luZyhzcmMsIGxlbiwgX2lkKSB7CiAgICAgIGNvbnN0IGlkID0gdGhpcy5fdHNpZChfaWQsIGByaXNpbmcoJHtsZW59KWApOwogICAgICBjb25zdCB0b3AgPSBzcmNbMF07CiAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgbGVuICsgMTsgaSsrKSB7CiAgICAgICAgaWYgKHRvcCA8PSBzcmNbaV0pIHsKICAgICAgICAgIHJldHVybiB0aGlzLnRzKGZhbHNlLCBpZCwgc3JjLl9fdGZfXyk7CiAgICAgICAgfQogICAgICB9CiAgICAgIHJldHVybiB0aGlzLnRzKHRydWUsIGlkLCBzcmMuX190Zl9fKTsKICAgIH0KICAgIC8qKiBFeHBvbmVudGlhbGx5IE1BIHdpdGggYWxwaGEgPSAxIC8gbGVuZ3RoCiAgICAgICAqIFVzZWQgaW4gUlNJCiAgICAgICAqIEBwYXJhbSB7VFN9IHNyYyAtIElucHV0CiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZW4gLSBMZW5ndGgKICAgICAgICogQHJldHVybiB7VFN9IC0gTmV3IHRpbWUtc2VyaWVzCiAgICAgICAqLwogICAgcm1hKHNyYywgbGVuLCBfaWQpIHsKICAgICAgY29uc3QgaWQgPSB0aGlzLl90c2lkKF9pZCwgYHJtYSgke2xlbn0pYCk7CiAgICAgIGNvbnN0IGEgPSBsZW47CiAgICAgIGNvbnN0IHN1bSA9IHRoaXMudHMoMCwgaWQsIHNyYy5fX3RmX18pOwogICAgICBzdW1bMF0gPSB0aGlzLm5hKHN1bVsxXSkgPyB0aGlzLnNtYShzcmMsIGxlbiwgaWQpWzBdIDogKHNyY1swXSArIChhIC0gMSkgKiB0aGlzLm56KHN1bVsxXSkpIC8gYTsKICAgICAgcmV0dXJuIHN1bTsKICAgIH0KICAgIC8qKiBSYXRlIG9mIENoYW5nZQogICAgICAgKiBAcGFyYW0ge1RTfSBzcmMgLSBJbnB1dAogICAgICAgKiBAcGFyYW0ge251bWJlcn0gbGVuIC0gTGVuZ3RoCiAgICAgICAqIEByZXR1cm4ge1RTfSAtIE5ldyB0aW1lLXNlcmllcwogICAgICAgKi8KICAgIHJvYyhzcmMsIGxlbiwgX2lkKSB7CiAgICAgIGNvbnN0IGlkID0gdGhpcy5fdHNpZChfaWQsIGByb2MoJHtsZW59KWApOwogICAgICByZXR1cm4gdGhpcy50cygKICAgICAgICAxMDAgKiAoc3JjWzBdIC0gc3JjW2xlbl0pIC8gc3JjW2xlbl0sCiAgICAgICAgaWQsCiAgICAgICAgc3JjLl9fdGZfXwogICAgICApOwogICAgfQogICAgLyoqIFNob3J0Y3V0IGZvciBNYXRoLnJvdW5kKCkKICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHggVGhlIHZhcmlhYmxlCiAgICAgICAqIEByZXR1cm4ge251bWJlcn0KICAgICAgICovCiAgICByb3VuZCh4KSB7CiAgICAgIHJldHVybiBNYXRoLnJvdW5kKHgpOwogICAgfQogICAgLyoqIFJlbGF0aXZlIFN0cmVuZ3RoIEluZGV4CiAgICAgICAqIEBwYXJhbSB7VFN9IHggLSBGaXJzdCBJbnB1dAogICAgICAgKiBAcGFyYW0ge251bWJlcnxUU30geSAtIFNlY29uZCBJbnB1dAogICAgICAgKiBAcmV0dXJuIHtUU30gLSBOZXcgdGltZS1zZXJpZXMKICAgICAgICovCiAgICByc2koeCwgeSwgX2lkKSB7CiAgICAgIGxldCBpZCwgcnNpOwogICAgICBpZiAoIXRoaXMubmEoeSkgJiYgeS5fX2lkX18pIHsKICAgICAgICBpZCA9IHRoaXMuX3RzaWQoX2lkLCAicnNpKHgseSkiKTsKICAgICAgICByc2kgPSAxMDAgLSAxMDAgLyAoMSArIHRoaXMuZGl2KHgsIHksIGlkKVswXSk7CiAgICAgIH0gZWxzZSB7CiAgICAgICAgaWQgPSB0aGlzLl90c2lkKF9pZCwgYHJzaSgke3l9KWApOwogICAgICAgIGNvbnN0IGNoID0gdGhpcy5jaGFuZ2UoeCwgMSwgX2lkKVswXTsKICAgICAgICBjb25zdCBwYyA9IHRoaXMudHMoTWF0aC5tYXgoY2gsIDApLCBpZCArICIxIiwgeC5fX3RmX18pOwogICAgICAgIGNvbnN0IG5jID0gdGhpcy50cygtTWF0aC5taW4oY2gsIDApLCBpZCArICIyIiwgeC5fX3RmX18pOwogICAgICAgIGNvbnN0IHVwID0gdGhpcy5ybWEocGMsIHksIGlkICsgIjMiKVswXTsKICAgICAgICBjb25zdCBkb3duID0gdGhpcy5ybWEobmMsIHksIGlkICsgIjQiKVswXTsKICAgICAgICByc2kgPSBkb3duID09PSAwID8gMTAwIDogdXAgPT09IDAgPyAwIDogMTAwIC0gMTAwIC8gKDEgKyB1cCAvIGRvd24pOwogICAgICB9CiAgICAgIHJldHVybiB0aGlzLnRzKHJzaSwgaWQgKyAiNSIsIHguX190Zl9fKTsKICAgIH0KICAgIC8qKiBQYXJhYm9saWMgU0FSCiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydCAtIFN0YXJ0CiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmMgLSBJbmNyZW1lbnQKICAgICAgICogQHBhcmFtIHtudW1iZXJ9IG1heCAtIE1heGltdW0KICAgICAgICogQHJldHVybiB7VFN9IC0gTmV3IHRpbWUtc2VyaWVzCiAgICAgICAqLwogICAgc2FyKHN0YXJ0LCBpbmMsIG1heCwgX2lkLCBfdGYpIHsKICAgICAgY29uc3QgaWQgPSB0aGlzLl90c2lkKF9pZCwgYHNhcigke3N0YXJ0fSwke2luY30sJHttYXh9KWApOwogICAgICBjb25zdCB0ZnMgPSBfdGYgfHwgIiI7CiAgICAgIGNvbnN0IGhpZ2ggPSB0aGlzLmVudi5zaGFyZWRbYGhpZ2gke3Rmc31gXTsKICAgICAgY29uc3QgbG93ID0gdGhpcy5lbnYuc2hhcmVkW2Bsb3cke3Rmc31gXTsKICAgICAgY29uc3QgY2xvc2UgPSB0aGlzLmVudi5zaGFyZWRbYGNsb3NlJHt0ZnN9YF07CiAgICAgIGNvbnN0IG1pblRpY2sgPSAwOwogICAgICBjb25zdCBvdXQgPSB0aGlzLnRzKHZvaWQgMCwgaWQgKyAiMSIsIF90Zik7CiAgICAgIGNvbnN0IHBvcyA9IHRoaXMudHModm9pZCAwLCBpZCArICIyIiwgX3RmKTsKICAgICAgY29uc3QgbWF4TWluID0gdGhpcy50cyh2b2lkIDAsIGlkICsgIjMiLCBfdGYpOwogICAgICBjb25zdCBhY2MgPSB0aGlzLnRzKHZvaWQgMCwgaWQgKyAiNCIsIF90Zik7CiAgICAgIGNvbnN0IG4gPSBfdGYgPyBvdXQuX19sZW5fXyAtIDEgOiB0aGlzLnNlLml0ZXI7CiAgICAgIGxldCBwcmV2OwogICAgICBsZXQgb3V0U2V0ID0gZmFsc2U7CiAgICAgIGlmIChuID49IDEpIHsKICAgICAgICBwcmV2ID0gb3V0WzFdOwogICAgICAgIGlmIChuID09PSAxKSB7CiAgICAgICAgICBpZiAoY2xvc2VbMF0gPiBjbG9zZVsxXSkgewogICAgICAgICAgICBwb3NbMF0gPSAxOwogICAgICAgICAgICBtYXhNaW5bMF0gPSBNYXRoLm1heChoaWdoWzBdLCBoaWdoWzFdKTsKICAgICAgICAgICAgcHJldiA9IE1hdGgubWluKGxvd1swXSwgbG93WzFdKTsKICAgICAgICAgIH0gZWxzZSB7CiAgICAgICAgICAgIHBvc1swXSA9IC0xOwogICAgICAgICAgICBtYXhNaW5bMF0gPSBNYXRoLm1pbihsb3dbMF0sIGxvd1sxXSk7CiAgICAgICAgICAgIHByZXYgPSBNYXRoLm1heChoaWdoWzBdLCBoaWdoWzFdKTsKICAgICAgICAgIH0KICAgICAgICAgIGFjY1swXSA9IHN0YXJ0OwogICAgICAgIH0gZWxzZSB7CiAgICAgICAgICBwb3NbMF0gPSBwb3NbMV07CiAgICAgICAgICBhY2NbMF0gPSBhY2NbMV07CiAgICAgICAgICBtYXhNaW5bMF0gPSBtYXhNaW5bMV07CiAgICAgICAgfQogICAgICAgIGlmIChwb3NbMF0gPT09IDEpIHsKICAgICAgICAgIGlmIChoaWdoWzBdID4gbWF4TWluWzBdKSB7CiAgICAgICAgICAgIG1heE1pblswXSA9IGhpZ2hbMF07CiAgICAgICAgICAgIGFjY1swXSA9IE1hdGgubWluKGFjY1swXSArIGluYywgbWF4KTsKICAgICAgICAgIH0KICAgICAgICAgIGlmIChsb3dbMF0gPD0gcHJldikgewogICAgICAgICAgICBwb3NbMF0gPSAtMTsKICAgICAgICAgICAgb3V0WzBdID0gbWF4TWluWzBdOwogICAgICAgICAgICBtYXhNaW5bMF0gPSBsb3dbMF07CiAgICAgICAgICAgIGFjY1swXSA9IHN0YXJ0OwogICAgICAgICAgICBvdXRTZXQgPSB0cnVlOwogICAgICAgICAgfQogICAgICAgIH0gZWxzZSB7CiAgICAgICAgICBpZiAobG93WzBdIDwgbWF4TWluWzBdKSB7CiAgICAgICAgICAgIG1heE1pblswXSA9IGxvd1swXTsKICAgICAgICAgICAgYWNjWzBdID0gTWF0aC5taW4oYWNjWzBdICsgaW5jLCBtYXgpOwogICAgICAgICAgfQogICAgICAgICAgaWYgKGhpZ2hbMF0gPj0gcHJldikgewogICAgICAgICAgICBwb3NbMF0gPSAxOwogICAgICAgICAgICBvdXRbMF0gPSBtYXhNaW5bMF07CiAgICAgICAgICAgIG1heE1pblswXSA9IGhpZ2hbMF07CiAgICAgICAgICAgIGFjY1swXSA9IHN0YXJ0OwogICAgICAgICAgICBvdXRTZXQgPSB0cnVlOwogICAgICAgICAgfQogICAgICAgIH0KICAgICAgICBpZiAoIW91dFNldCkgewogICAgICAgICAgb3V0WzBdID0gcHJldiArIGFjY1swXSAqIChtYXhNaW5bMF0gLSBwcmV2KTsKICAgICAgICAgIGlmIChwb3NbMF0gPT09IDEpIHsKICAgICAgICAgICAgaWYgKG91dFswXSA+PSBsb3dbMF0pCiAgICAgICAgICAgICAgb3V0WzBdID0gbG93WzBdIC0gbWluVGljazsKICAgICAgICAgIH0KICAgICAgICAgIGlmIChwb3NbMF0gPT09IC0xKSB7CiAgICAgICAgICAgIGlmIChvdXRbMF0gPD0gaGlnaFswXSkKICAgICAgICAgICAgICBvdXRbMF0gPSBoaWdoWzBdICsgbWluVGljazsKICAgICAgICAgIH0KICAgICAgICB9CiAgICAgIH0KICAgICAgcmV0dXJuIG91dDsKICAgIH0KICAgIC8qKiBSZXR1cm5zIHNlY29uZHMgb2YgYSBnaXZlbiB0aW1lc3RhbXAKICAgICAgICogQHBhcmFtIHtudW1iZXJ9IFt0aW1lXSAtIFRpbWUgaW4gbXMgKGN1cnJlbnQgdCwgaWYgbm90IGRlZmluZWQpCiAgICAgICAqIEByZXR1cm4ge251bWJlcn0gLSBIb3VyCiAgICAgICAqLwogICAgc2Vjb25kKHRpbWUpIHsKICAgICAgcmV0dXJuIG5ldyBEYXRlKHRpbWUgfHwgc2UudCkuZ2V0VVRDU2Vjb25kcygpOwogICAgfQogICAgLyoqIFNob3J0Y3V0IGZvciBNYXRoLnNpbmcoKQogICAgICAgKiBAcGFyYW0ge251bWJlcn0geCBUaGUgdmFyaWFibGUKICAgICAgICogQHJldHVybiB7bnVtYmVyfQogICAgICAgKi8KICAgIHNpZ24oeCkgewogICAgICByZXR1cm4gTWF0aC5zaWduKHgpOwogICAgfQogICAgLyoqIFNpbmUgZnVuY3Rpb24KICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHggVGhlIHZhcmlhYmxlCiAgICAgICAqIEByZXR1cm4ge251bWJlcn0KICAgICAgICovCiAgICBzaW4oeCkgewogICAgICByZXR1cm4gTWF0aC5zaW4oeCk7CiAgICB9CiAgICAvKiogU2ltcGxlIE1vdmluZyBBdmVyYWdlCiAgICAgICAqIEBwYXJhbSB7VFN9IHNyYyAtIElucHV0CiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZW4gLSBMZW5ndGgKICAgICAgICogQHJldHVybiB7VFN9IC0gTmV3IHRpbWUtc2VyaWVzCiAgICAgICAqLwogICAgc21hKHNyYywgbGVuLCBfaWQpIHsKICAgICAgY29uc3QgaWQgPSB0aGlzLl90c2lkKF9pZCwgYHNtYSgke2xlbn0pYCk7CiAgICAgIGxldCBzdW0gPSAwOwogICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7CiAgICAgICAgc3VtID0gc3VtICsgc3JjW2ldOwogICAgICB9CiAgICAgIHJldHVybiB0aGlzLnRzKHN1bSAvIGxlbiwgaWQsIHNyYy5fX3RmX18pOwogICAgfQogICAgLyoqIFNob3J0Y3V0IGZvciBNYXRoLnNxcnQoKQogICAgICAgKiBAcGFyYW0ge251bWJlcn0geCBUaGUgdmFyaWFibGUKICAgICAgICogQHJldHVybiB7bnVtYmVyfQogICAgICAgKi8KICAgIHNxcnQoeCkgewogICAgICByZXR1cm4gTWF0aC5zcXJ0KHgpOwogICAgfQogICAgLyoqIFN0YW5kYXJkIGRldmlhdGlvbgogICAgICAgKiBAcGFyYW0ge1RTfSBzcmMgLSBJbnB1dAogICAgICAgKiBAcGFyYW0ge251bWJlcn0gbGVuIC0gTGVuZ3RoCiAgICAgICAqIEByZXR1cm4ge1RTfSAtIE5ldyB0aW1lLXNlcmllcwogICAgICAgKi8KICAgIHN0ZGV2KHNyYywgbGVuLCBfaWQpIHsKICAgICAgY29uc3Qgc3VtZiA9ICh4LCB5KSA9PiB7CiAgICAgICAgY29uc3QgcmVzID0geCArIHk7CiAgICAgICAgcmV0dXJuIHJlczsKICAgICAgfTsKICAgICAgY29uc3QgaWQgPSB0aGlzLl90c2lkKF9pZCwgYHN0ZGV2KCR7bGVufSlgKTsKICAgICAgY29uc3QgYXZnID0gdGhpcy5zbWEoc3JjLCBsZW4sIGlkKTsKICAgICAgbGV0IHNxZCA9IDA7CiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHsKICAgICAgICBjb25zdCBzdW0gPSBzdW1mKHNyY1tpXSwgLWF2Z1swXSk7CiAgICAgICAgc3FkICs9IHN1bSAqIHN1bTsKICAgICAgfQogICAgICByZXR1cm4gdGhpcy50cyhNYXRoLnNxcnQoc3FkIC8gbGVuKSwgaWQsIHNyYy5fX3RmX18pOwogICAgfQogICAgLyoqIFN0b2NoYXN0aWMKICAgICAgICogQHBhcmFtIHtUU30gc3JjIC0gSW5wdXQKICAgICAgICogQHBhcmFtIHtUU30gaGlnaCAtIFRTIG9mIGhpZ2gKICAgICAgICogQHBhcmFtIHtUU30gbG93IC0gVFMgb2YgbG93CiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZW4gLSBMZW5ndGgKICAgICAgICogQHJldHVybiB7VFN9IC0gTmV3IHRpbWUtc2VyaWVzCiAgICAgICAqLwogICAgc3RvY2goc3JjLCBoaWdoLCBsb3csIGxlbiwgX2lkKSB7CiAgICAgIGNvbnN0IGlkID0gdGhpcy5fdHNpZChfaWQsIGBzdW0oJHtsZW59KWApOwogICAgICBjb25zdCB4ID0gMTAwICogKHNyY1swXSAtIHRoaXMubG93ZXN0KGxvdywgbGVuKVswXSk7CiAgICAgIGNvbnN0IHkgPSB0aGlzLmhpZ2hlc3QoaGlnaCwgbGVuKVswXSAtIHRoaXMubG93ZXN0KGxvdywgbGVuKVswXTsKICAgICAgcmV0dXJuIHRoaXMudHMoeCAvIHksIGlkLCBzcmMuX190Zl9fKTsKICAgIH0KICAgIC8qKiBSZXR1cm5zIHRoZSBzbGlkaW5nIHN1bSBvZiBsYXN0ICJsZW4iIHZhbHVlcyBvZiB0aGUgc291cmNlCiAgICAgICAqIEBwYXJhbSB7VFN9IHNyYyAtIElucHV0CiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZW4gLSBMZW5ndGgKICAgICAgICogQHJldHVybiB7VFN9IC0gTmV3IHRpbWUtc2VyaWVzCiAgICAgICAqLwogICAgc3VtKHNyYywgbGVuLCBfaWQpIHsKICAgICAgY29uc3QgaWQgPSB0aGlzLl90c2lkKF9pZCwgYHN1bSgke2xlbn0pYCk7CiAgICAgIGxldCBzdW0gPSAwOwogICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7CiAgICAgICAgc3VtID0gc3VtICsgc3JjW2ldOwogICAgICB9CiAgICAgIHJldHVybiB0aGlzLnRzKHN1bSwgaWQsIHNyYy5fX3RmX18pOwogICAgfQogICAgLyoqIFN1cGVydHJlbmQgSW5kaWNhdG9yCiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBmYWN0b3IgLSBBVFIgbXVsdGlwbGllcgogICAgICAgKiBAcGFyYW0ge251bWJlcn0gYXRybGVuIC0gTGVuZ3RoIG9mIEFUUgogICAgICAgKiBAcmV0dXJuIHtUU1tdfSAtIFN1cGVydHJlbmQgbGluZSBhbmQgZGlyZWN0aW9uIG9mIHRyZW5kCiAgICAgICAqLwogICAgc3VwZXJ0cmVuZChmYWN0b3IsIGF0cmxlbiwgX2lkLCBfdGYpIHsKICAgICAgY29uc3QgaWQgPSB0aGlzLl90c2lkKF9pZCwgYHN1cGVydHJlbmQoJHtmYWN0b3J9LCR7YXRybGVufSlgKTsKICAgICAgY29uc3QgdGZzID0gX3RmIHx8ICIiOwogICAgICBjb25zdCBoaWdoID0gdGhpcy5lbnYuc2hhcmVkW2BoaWdoJHt0ZnN9YF07CiAgICAgIGNvbnN0IGxvdyA9IHRoaXMuZW52LnNoYXJlZFtgbG93JHt0ZnN9YF07CiAgICAgIGNvbnN0IGNsb3NlID0gdGhpcy5lbnYuc2hhcmVkW2BjbG9zZSR7dGZzfWBdOwogICAgICBjb25zdCBobDIgPSAoaGlnaFswXSArIGxvd1swXSkgKiAwLjU7CiAgICAgIGNvbnN0IGF0ciA9IGZhY3RvciAqIHRoaXMuYXRyKGF0cmxlbiwgaWQgKyAiMSIsIF90ZilbMF07CiAgICAgIGNvbnN0IGxzID0gdGhpcy50cyhobDIgLSBhdHIsIGlkICsgIjIiLCBfdGYpOwogICAgICBjb25zdCBsczEgPSB0aGlzLm56KGxzWzFdLCBsc1swXSk7CiAgICAgIGxzWzBdID0gY2xvc2VbMV0gPiBsczEgPyBNYXRoLm1heChsc1swXSwgbHMxKSA6IGxzWzBdOwogICAgICBjb25zdCBzcyA9IHRoaXMudHMoaGwyICsgYXRyLCBpZCArICIzIiwgX3RmKTsKICAgICAgY29uc3Qgc3MxID0gdGhpcy5ueihzc1sxXSwgc3MpOwogICAgICBzc1swXSA9IGNsb3NlWzFdIDwgc3MxID8gTWF0aC5taW4oc3NbMF0sIHNzMSkgOiBzc1swXTsKICAgICAgY29uc3QgZGlyID0gdGhpcy50cygxLCBpZCArICI0IiwgX3RmKTsKICAgICAgZGlyWzBdID0gdGhpcy5ueihkaXJbMV0sIGRpclswXSk7CiAgICAgIGRpclswXSA9IGRpclswXSA9PT0gLTEgJiYgY2xvc2VbMF0gPiBzczEgPyAxIDogZGlyWzBdID09PSAxICYmIGNsb3NlWzBdIDwgbHMxID8gLTEgOiBkaXJbMF07CiAgICAgIGNvbnN0IHBsb3QgPSB0aGlzLnRzKGRpclswXSA9PT0gMSA/IGxzWzBdIDogc3NbMF0sIGlkICsgIjUiLCBfdGYpOwogICAgICByZXR1cm4gW3Bsb3QsIHRoaXMubmVnKGRpciwgaWQgKyAiNiIpXTsKICAgIH0KICAgIC8qKiBTeW1tZXRyaWNhbGx5IFdlaWdodGVkIE1vdmluZyBBdmVyYWdlCiAgICAgICAqIEBwYXJhbSB7VFN9IHNyYyAtIElucHV0CiAgICAgICAqIEByZXR1cm4ge1RTfSAtIE5ldyB0aW1lLXNlcmllcwogICAgICAgKi8KICAgIHN3bWEoc3JjLCBfaWQpIHsKICAgICAgY29uc3QgaWQgPSB0aGlzLl90c2lkKF9pZCwgInN3bWEiKTsKICAgICAgY29uc3Qgc3VtID0gc3JjWzNdICogdGhpcy5TV01BWzBdICsgc3JjWzJdICogdGhpcy5TV01BWzFdICsgc3JjWzFdICogdGhpcy5TV01BWzJdICsgc3JjWzBdICogdGhpcy5TV01BWzNdOwogICAgICByZXR1cm4gdGhpcy50cyhzdW0sIGlkLCBzcmMuX190Zl9fKTsKICAgIH0KICAgIC8qKiBDcmVhdGVzIGEgbmV3IFN5bWJvbC4KICAgICAgICogQHBhcmFtIHsqfSB4IC0gU29tZXRoaW5nLCBkZXBlbmRzIG9uIGFyZyB2YXJpYXRpb24KICAgICAgICogQHBhcmFtIHsqfSB5IC0gU29tZXRoaW5nLCBkZXBlbmRzIG9uIGFyZyB2YXJpYXRpb24KICAgICAgICogQHJldHVybiB7U3ltfQogICAgICAgKiBBcmd1bWVudCB2YXJpYXRpb25zOgogICAgICAgKiBkYXRhKEFycmF5KSwgW3BhcmFtcyhPYmplY3QpXQogICAgICAgKiB0cyhUUyksIFtwYXJhbXMoT2JqZWN0KV0KICAgICAgICogcG9pbnQoTnVtYmVyKSwgW3BhcmFtcyhPYmplY3QpXQogICAgICAgKiB0ZihTdHJpbmcpIDFtLCA1bSwgMUgsIGV0Yy4gKHVzZXMgbWFpbiBPSExDVikKICAgICAgICogUGFyYW1zIG9iamVjdDogewogICAgICAgKiAgaWQ6IFN0cmluZywKICAgICAgICogIHRmOiBTdHJpbmd8TnVtYmVyLAogICAgICAgKiAgYWdndHlwZTogU3RyaW5nIChUT0RPOiBUeXBlIG9mIGFnZ3JlZ2F0aW9uKQogICAgICAgKiAgZm9ybWF0OiBTdHJpbmcgKERhdGEgZm9ybWF0LCBlLmcuICJ0aW1lOnByaWNlOnZvbCIpCiAgICAgICAqICB3aW5kb3c6IFN0cmluZ3xOdW1iZXIgKEFnZ3JlZ2F0aW9uIHdpbmRvdykKICAgICAgICogIG1haW4gdHJ1ZXxmYWxzZSAoVXNlIGFzIHRoZSBtYWluIGNoYXJ0KQogICAgICAgKiB9CiAgICAgICAqLwogICAgc3ltKHgsIHkgPSB7fSwgX2lkKSB7CiAgICAgIGNvbnN0IGlkID0geS5pZCB8fCB0aGlzLl90c2lkKF9pZCwgInN5bSIpOwogICAgICB5LmlkID0gaWQ7CiAgICAgIGlmICh0aGlzLmVudi5zeW1zW2lkXSkgewogICAgICAgIHRoaXMuZW52LnN5bXNbaWRdLnVwZGF0ZSh4KTsKICAgICAgICByZXR1cm4gdGhpcy5lbnYuc3ltc1tpZF07CiAgICAgIH0KICAgICAgc3dpdGNoICh0eXBlb2YgeCkgewogICAgICAgIGNhc2UgIm9iamVjdCI6CiAgICAgICAgICB2YXIgc3ltID0gbmV3IFN5bSh4LCB5KTsKICAgICAgICAgIHRoaXMuZW52LnN5bXNbaWRdID0gc3ltOwogICAgICAgICAgaWYgKHguX19pZF9fKSB7CiAgICAgICAgICAgIHN5bS5kYXRhX3R5cGUgPSBUU1M7CiAgICAgICAgICB9IGVsc2UgewogICAgICAgICAgICBzeW0uZGF0YV90eXBlID0gQVJSOwogICAgICAgICAgfQogICAgICAgICAgYnJlYWs7CiAgICAgICAgY2FzZSAibnVtYmVyIjoKICAgICAgICAgIHN5bSA9IG5ldyBTeW0obnVsbCwgeSk7CiAgICAgICAgICBzeW0uZGF0YV90eXBlID0gTlVNOwogICAgICAgICAgYnJlYWs7CiAgICAgICAgY2FzZSAic3RyaW5nIjoKICAgICAgICAgIHkudGYgPSB4OwogICAgICAgICAgc3ltID0gbmV3IFN5bShzZS5kYXRhLm9obGN2LmRhdGEsIHkpOwogICAgICAgICAgc3ltLmRhdGFfdHlwZSA9IEFSUjsKICAgICAgICAgIGJyZWFrOwogICAgICB9CiAgICAgIHRoaXMuZW52LnN5bXNbaWRdID0gc3ltOwogICAgICByZXR1cm4gc3ltOwogICAgfQogICAgLyoqIFRhbmdlbnQgZnVuY3Rpb24KICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHggVGhlIHZhcmlhYmxlCiAgICAgICAqIEByZXR1cm4ge251bWJlcn0KICAgICAgICovCiAgICB0YW4oeCkgewogICAgICByZXR1cm4gTWF0aC50YW4oeCk7CiAgICB9CiAgICB0aW1lKHJlcywgc2VzaCkgewogICAgfQogICAgdGltZXN0YW1wKCkgewogICAgfQogICAgLyoqIFRydWUgUmFuZ2UKICAgICAgICogQHBhcmFtIHtUU30gZml4bmFuIC0gRml4IE5hTiB2YWx1ZXMKICAgICAgICogQHJldHVybiB7VFN9IC0gTmV3IHRpbWUtc2VyaWVzCiAgICAgICAqLwogICAgdHIoZml4bmFuID0gZmFsc2UsIF9pZCwgX3RmKSB7CiAgICAgIGNvbnN0IGlkID0gdGhpcy5fdHNpZChfaWQsIGB0cigke2ZpeG5hbn0pYCk7CiAgICAgIGNvbnN0IHRmcyA9IF90ZiB8fCAiIjsKICAgICAgY29uc3QgaGlnaCA9IHRoaXMuZW52LnNoYXJlZFtgaGlnaCR7dGZzfWBdOwogICAgICBjb25zdCBsb3cgPSB0aGlzLmVudi5zaGFyZWRbYGxvdyR7dGZzfWBdOwogICAgICBjb25zdCBjbG9zZSA9IHRoaXMuZW52LnNoYXJlZFtgY2xvc2Uke3Rmc31gXTsKICAgICAgbGV0IHJlcyA9IDA7CiAgICAgIGlmICh0aGlzLm5hKGNsb3NlWzFdKSAmJiBmaXhuYW4pIHsKICAgICAgICByZXMgPSBoaWdoWzBdIC0gbG93WzBdOwogICAgICB9IGVsc2UgewogICAgICAgIHJlcyA9IE1hdGgubWF4KAogICAgICAgICAgaGlnaFswXSAtIGxvd1swXSwKICAgICAgICAgIE1hdGguYWJzKGhpZ2hbMF0gLSBjbG9zZVsxXSksCiAgICAgICAgICBNYXRoLmFicyhsb3dbMF0gLSBjbG9zZVsxXSkKICAgICAgICApOwogICAgICB9CiAgICAgIHJldHVybiB0aGlzLnRzKHJlcywgaWQsIF90Zik7CiAgICB9CiAgICAvKiogVHJ1ZSBzdHJlbmd0aCBpbmRleAogICAgICAgKiBAcGFyYW0ge1RTfSBzcmMgLSBJbnB1dAogICAgICAgKiBAcGFyYW0ge251bWJlcn0gc2hvcnQgLSBTaG9ydCBsZW5ndGgKICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGxvbmcgLSBMb25nIGxlbmd0aAogICAgICAgKiBAcmV0dXJuIHtUU30gLSBOZXcgdGltZS1zZXJpZXMKICAgICAgICovCiAgICB0c2koc3JjLCBzaG9ydCwgbG9uZywgX2lkKSB7CiAgICAgIGNvbnN0IGlkID0gdGhpcy5fdHNpZChfaWQsIGB0c2koJHtzaG9ydH0sJHtsb25nfSlgKTsKICAgICAgY29uc3QgbSA9IHRoaXMuY2hhbmdlKHNyYywgMSwgaWQgKyAiMCIpOwogICAgICBjb25zdCBtX2FicyA9IHRoaXMudHMoTWF0aC5hYnMobVswXSksIGlkICsgIjEiLCBzcmMuX190Zl9fKTsKICAgICAgY29uc3QgdHNpID0gdGhpcy5lbWEodGhpcy5lbWEobSwgbG9uZywgaWQgKyAiMSIpLCBzaG9ydCwgaWQgKyAiMiIpWzBdIC8gdGhpcy5lbWEodGhpcy5lbWEobV9hYnMsIGxvbmcsIGlkICsgIjMiKSwgc2hvcnQsIGlkICsgIjQiKVswXTsKICAgICAgcmV0dXJuIHRoaXMudHModHNpLCBpZCwgc3JjLl9fdGZfXyk7CiAgICB9CiAgICB2YXJpYW5jZShzcmMsIGxlbikgewogICAgfQogICAgLyoqIENyZWF0ZSBhIG5ldyBWaWV3CiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gVmlldyBuYW1lCiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwcm9wcyAtIFZpZXcgcHJvcGVydGllcwogICAgICAgKi8KICAgIHZpZXcobmFtZSwgcHJvcHMgPSB7fSwgX2lkKSB7CiAgICAgIGlmICghdGhpcy5lbnYudmlld3NbbmFtZV0pIHsKICAgICAgICBjb25zdCB2aWV3ID0gbmV3IFZpZXcodGhpcywgbmFtZSwgcHJvcHMpOwogICAgICAgIHRoaXMuZW52LnZpZXdzW25hbWVdID0gdmlldzsKICAgICAgICByZXR1cm4gdmlldzsKICAgICAgfQogICAgICByZXR1cm4gdGhpcy5lbnYudmlld3NbbmFtZV07CiAgICB9CiAgICB2d2FwKHNyYykgewogICAgfQogICAgLyoqIFZvbHVtZSBXZWlnaHRlZCBNb3ZpbmcgQXZlcmFnZQogICAgICAgKiBAcGFyYW0ge1RTfSBzcmMgLSBJbnB1dAogICAgICAgKiBAcGFyYW0ge251bWJlcn0gbGVuIC0gbGVuZ3RoCiAgICAgICAqIEByZXR1cm4ge1RTfSAtIE5ldyB0aW1lLXNlcmllcwogICAgICAgKi8KICAgIHZ3bWEoc3JjLCBsZW4sIF9pZCkgewogICAgICBjb25zdCBpZCA9IHRoaXMuX3RzaWQoX2lkLCBgdndtYSgke2xlbn0pYCk7CiAgICAgIGNvbnN0IHZvbCA9IHRoaXMuZW52LnNoYXJlZC52b2w7CiAgICAgIGNvbnN0IHN4diA9IHRoaXMudHMoc3JjWzBdICogdm9sWzBdLCBpZCArICIxIiwgc3JjLl9fdGZfXyk7CiAgICAgIGNvbnN0IHJlcyA9IHRoaXMuc21hKHN4diwgbGVuLCBpZCArICIyIilbMF0gLyB0aGlzLnNtYSh2b2wsIGxlbiwgaWQgKyAiMyIpWzBdOwogICAgICByZXR1cm4gdGhpcy50cyhyZXMsIGlkICsgIjQiLCBzcmMuX190Zl9fKTsKICAgIH0KICAgIC8qKiBXZWVrIG9mIHllYXIsIGxpdGVyYWxseQogICAgICAgKiBAcGFyYW0ge251bWJlcn0gW3RpbWVdIC0gVGltZSBpbiBtcyAoY3VycmVudCB0LCBpZiBub3QgZGVmaW5lZCkKICAgICAgICogQHJldHVybiB7bnVtYmVyfSAtIFdlZWsKICAgICAgICovCiAgICB3ZWVrb2Z5ZWFyKHRpbWUpIHsKICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHRpbWUgfHwgc2UudCk7CiAgICAgIGRhdGUuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7CiAgICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldFVUQ0RhdGUoKSArIDMgLSAoZGF0ZS5nZXRVVENEYXkoKSArIDYpICUgNyk7CiAgICAgIGNvbnN0IHdlZWsxID0gbmV3IERhdGUoZGF0ZS5nZXRVVENGdWxsWWVhcigpLCAwLCA0KTsKICAgICAgcmV0dXJuIDEgKyBNYXRoLnJvdW5kKAogICAgICAgICgoZGF0ZSAtIHdlZWsxKSAvIDg2NGU1IC0gMyArICh3ZWVrMS5nZXRVVENEYXkoKSArIDYpICUgNykgLyA3CiAgICAgICk7CiAgICB9CiAgICAvKiogV2VpZ2h0ZWQgbW92aW5nIGF2ZXJhZ2UKICAgICAgICogQHBhcmFtIHtUU30gc3JjIC0gSW5wdXQKICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGxlbiAtIGxlbmd0aAogICAgICAgKiBAcmV0dXJuIHtUU30gLSBOZXcgdGltZS1zZXJpZXMKICAgICAgICovCiAgICB3bWEoc3JjLCBsZW4sIF9pZCkgewogICAgICBjb25zdCBpZCA9IHRoaXMuX3RzaWQoX2lkLCBgd21hKCR7bGVufSlgKTsKICAgICAgbGV0IG5vcm0gPSAwOwogICAgICBsZXQgc3VtID0gMDsKICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykgewogICAgICAgIGNvbnN0IHcgPSAobGVuIC0gaSkgKiBsZW47CiAgICAgICAgbm9ybSArPSB3OwogICAgICAgIHN1bSArPSBzcmNbaV0gKiB3OwogICAgICB9CiAgICAgIHJldHVybiB0aGlzLnRzKHN1bSAvIG5vcm0sIGlkLCBzcmMuX190Zl9fKTsKICAgIH0KICAgIC8qKiBXaWxsaWFtcyAlUgogICAgICAgKiBAcGFyYW0ge251bWJlcn0gbGVuIC0gbGVuZ3RoCiAgICAgICAqIEByZXR1cm4ge1RTfSAtIE5ldyB0aW1lLXNlcmllcwogICAgICAgKi8KICAgIHdwcihsZW4sIF9pZCwgX3RmKSB7CiAgICAgIGNvbnN0IGlkID0gdGhpcy5fdHNpZChfaWQsIGB3cHIoJHtsZW59KWApOwogICAgICBjb25zdCB0ZnMgPSBfdGYgfHwgIiI7CiAgICAgIGNvbnN0IGhpZ2ggPSB0aGlzLmVudi5zaGFyZWRbYGhpZ2gke3Rmc31gXTsKICAgICAgY29uc3QgbG93ID0gdGhpcy5lbnYuc2hhcmVkW2Bsb3cke3Rmc31gXTsKICAgICAgY29uc3QgY2xvc2UgPSB0aGlzLmVudi5zaGFyZWRbYGNsb3NlJHt0ZnN9YF07CiAgICAgIGNvbnN0IGhoID0gdGhpcy5oaWdoZXN0KGhpZ2gsIGxlbiwgaWQpOwogICAgICBjb25zdCBsbCA9IHRoaXMubG93ZXN0KGxvdywgbGVuLCBpZCk7CiAgICAgIGNvbnN0IHJlcyA9IChoaFswXSAtIGNsb3NlWzBdKSAvIChoaFswXSAtIGxsWzBdKTsKICAgICAgcmV0dXJuIHRoaXMudHMoLXJlcyAqIDEwMCwgaWQsIF90Zik7CiAgICB9CiAgICAvKiogWWVhcgogICAgICAgKiBAcGFyYW0ge251bWJlcn0gW3RpbWVdIC0gVGltZSBpbiBtcyAoY3VycmVudCB0LCBpZiBub3QgZGVmaW5lZCkKICAgICAgICogQHJldHVybiB7bnVtYmVyfSAtIFllYXIKICAgICAgICovCiAgICB5ZWFyKHRpbWUpIHsKICAgICAgcmV0dXJuIG5ldyBEYXRlKHRpbWUgfHwgc2UudCkuZ2V0VVRDRnVsbFllYXIoKTsKICAgIH0KICB9CiAgY2xhc3MgUGFuZSB7CiAgICBjb25zdHJ1Y3RvcihlbnYpIHsKICAgICAgdGhpcy5zY3JpcHRJZCA9IGVudi5pZDsKICAgICAgdGhpcy5lbnYgPSBlbnY7CiAgICAgIHRoaXMuc2VsZklkID0gdGhpcy5maW5kU2VsZklkKGVudi5pZCk7CiAgICAgIHRoaXMucGFuZU1hcCA9IHRoaXMuY3JlYXRlTWFwKCk7CiAgICAgIHRoaXMubmFtZTJvdiA9IHt9OwogICAgICB0aGlzLnNlbGYgPSB0aGlzLnBhbmVMaWIodGhpcy5zZWxmSWQpOwogICAgfQogICAgLy8gQ3JlYXRlIGEgdmlydHVhbCBwYW5lIHdpdGggYWxsIG92ZXJsYXlzLCBzbwogICAgLy8gd2UgY2FuIGNhbGwsIGUuZy46IHBhbmUuc2VsZi48T3ZlcmxheVR5cGU+KC4uLikKICAgIHBhbmVMaWIodXVpZCkgewogICAgICBjb25zdCBsaWIyID0ge307CiAgICAgIGZvciAodmFyIGsgaW4gc2VsZi5zY3JpcHRMaWIucHJlZmFicykgewogICAgICAgIGxpYjJba10gPSAoKHR5cGUpID0+IHsKICAgICAgICAgIHJldHVybiAodiwgc3BlY3MsIF9pZCkgPT4gewogICAgICAgICAgICBjb25zdCBuYW1lID0gZ2V0X2ZuX2lkKHR5cGUsIF9pZCAhPSBudWxsID8gX2lkIDogc3BlY3MpOwogICAgICAgICAgICBpZiAoIXRoaXMubmFtZTJvdltuYW1lXSkgewogICAgICAgICAgICAgIGxldCBwYW5lID0gdGhpcy5wYW5lTWFwW3V1aWRdOwogICAgICAgICAgICAgIGlmICghcGFuZSkKICAgICAgICAgICAgICAgIHBhbmUgPSB0aGlzLmNyZWF0ZVBhbmUoKTsKICAgICAgICAgICAgICB0aGlzLm5hbWUyb3ZbbmFtZV0gPSB0aGlzLm5ld092ZXJsYXkoCiAgICAgICAgICAgICAgICBwYW5lLAogICAgICAgICAgICAgICAgbmFtZSwKICAgICAgICAgICAgICAgIHR5cGUsCiAgICAgICAgICAgICAgICBzcGVjcwogICAgICAgICAgICAgICk7CiAgICAgICAgICAgIH0KICAgICAgICAgICAgY29uc3Qgb3YgPSB0aGlzLm5hbWUyb3ZbbmFtZV07CiAgICAgICAgICAgIHRoaXMuYWRkTmV3VmFsdWUob3YsIHYpOwogICAgICAgICAgfTsKICAgICAgICB9KShrKTsKICAgICAgfQogICAgICByZXR1cm4gbGliMjsKICAgIH0KICAgIC8vIENyZWF0ZSB7cGFuZS51dWlkID0+IHBhbmV9IG1hcAogICAgY3JlYXRlTWFwKCkgewogICAgICBjb25zdCBtYXAgPSB7fTsKICAgICAgZm9yICh2YXIgcGFuZSBvZiBzZWxmLnBhbmVTdHJ1Y3QpIHsKICAgICAgICBtYXBbcGFuZS51dWlkXSA9IHBhbmU7CiAgICAgIH0KICAgICAgcmV0dXJuIG1hcDsKICAgIH0KICAgIC8vIEZpbmQgcGFuZS5zZWxmIGlkCiAgICBmaW5kU2VsZklkKGlkKSB7CiAgICAgIGZvciAodmFyIHBhbmUgb2Ygc2VsZi5wYW5lU3RydWN0KSB7CiAgICAgICAgZm9yICh2YXIgc2NyaXB0IG9mIHBhbmUuc2NyaXB0cykgewogICAgICAgICAgaWYgKHNjcmlwdC51dWlkID09PSBpZCkgewogICAgICAgICAgICByZXR1cm4gcGFuZS51dWlkOwogICAgICAgICAgfQogICAgICAgIH0KICAgICAgfQogICAgfQogICAgLy8gQWRkIGEgbmV3IG92ZXJsYXkgdG8gdGhlIHN0cnVjdAogICAgbmV3T3ZlcmxheShwYW5lLCBuYW1lLCB0eXBlLCBzcGVjcykgewogICAgICB2YXIgX2EsIF9iLCBfYzsKICAgICAgaWYgKCFwYW5lLm92ZXJsYXlzKQogICAgICAgIHBhbmUub3ZlcmxheXMgPSBbXTsKICAgICAgY29uc3Qgb3YgPSB7CiAgICAgICAgbmFtZTogKF9hID0gc3BlY3MubmFtZSkgIT0gbnVsbCA/IF9hIDogbmFtZSwKICAgICAgICB0eXBlLAogICAgICAgIHNldHRpbmdzOiAoX2IgPSBzcGVjcy5zZXR0aW5ncykgIT0gbnVsbCA/IF9iIDoge30sCiAgICAgICAgcHJvcHM6IChfYyA9IHNwZWNzLnByb3BzKSAhPSBudWxsID8gX2MgOiB7fSwKICAgICAgICB1dWlkOiBVdGlscy51dWlkMygpLAogICAgICAgIHByb2Q6IHRoaXMuc2NyaXB0SWQsCiAgICAgICAgZGF0YTogW10KICAgICAgfTsKICAgICAgcGFuZS5vdmVybGF5cy5wdXNoKG92KTsKICAgICAgcmV0dXJuIG92OwogICAgfQogICAgLy8gQWRkIG5ldyB2YWx1ZSB0byBvdmVybGF5J3MgZGF0YQogICAgYWRkTmV3VmFsdWUob3YsIHgpIHsKICAgICAgbGV0IG9mZiA9IDA7CiAgICAgIGlmICh4ICYmIHguX19pZF9fKSB7CiAgICAgICAgb2ZmID0geC5fX29mZnNldF9fIHx8IDA7CiAgICAgICAgeCA9IHhbMF07CiAgICAgIH0KICAgICAgaWYgKEFycmF5LmlzQXJyYXkoeCkgJiYgeFswXSAmJiB4WzBdLl9faWRfXykgewogICAgICAgIG9mZiA9IHhbMF0uX19vZmZzZXRfXyB8fCAwOwogICAgICAgIHggPSB4Lm1hcCgoeDIpID0+IHgyWzBdKTsKICAgICAgfQogICAgICBvZmYgKj0gc2UudGY7CiAgICAgIGNvbnN0IHYgPSBBcnJheS5pc0FycmF5KHgpID8gW3NlLnQgKyBvZmYsIC4uLnhdIDogW3NlLnQgKyBvZmYsIHhdOwogICAgICB1cGRhdGUob3YuZGF0YSwgdik7CiAgICB9CiAgICBjcmVhdGVQYW5lKCkgewogICAgfQogIH0KICBjb25zdCBGREVGUzEgPSAvKGZ1bmN0aW9uIHwpKFskQS1aX11bMC05QS1aXyQuXSopW1xzXSo/XCgoLio/XHMqKVwpL21pOwogIGNvbnN0IEZERUZTMiA9IC8oZnVuY3Rpb24gfCkoWyRBLVpfXVswLTlBLVpfJC5dKilbXHNdKj9cKCguKlxzKilcKS9nbWlzOwogIGNvbnN0IERFRl9MSU1JVCQxID0gNTsKICBjbGFzcyBTY3JpcHRFbnYgewogICAgY29uc3RydWN0b3IocywgZGF0YSkgewogICAgICB0aGlzLnN0ZCA9IHNlLnN0ZF9pbmplY3QobmV3IFNjcmlwdFN0ZCh0aGlzKSk7CiAgICAgIHRoaXMuaWQgPSBzLnV1aWQ7CiAgICAgIHRoaXMuc3JjID0gczsKICAgICAgdGhpcy5vdXRwdXQgPSB7fTsKICAgICAgdGhpcy5kYXRhID0gW107CiAgICAgIHRoaXMudHNzID0ge307CiAgICAgIHRoaXMuc3ltcyA9IHt9OwogICAgICB0aGlzLnZpZXdzID0ge307CiAgICAgIHRoaXMuc2hhcmVkID0gZGF0YTsKICAgICAgdGhpcy5vdXRwdXQuYm94X21ha2VyID0gdGhpcy5tYWtlX2JveCgpOwogICAgICB0aGlzLnBhbmUgPSBuZXcgUGFuZSh0aGlzKTsKICAgIH0KICAgIGJ1aWxkKCkgewogICAgICB0aGlzLm91dHB1dC5ib3hfbWFrZXIodGhpcywgdGhpcy5zaGFyZWQsIHNlKTsKICAgICAgZGVsZXRlIHRoaXMub3V0cHV0LmJveF9tYWtlcjsKICAgIH0KICAgIGluaXQoKSB7CiAgICAgIHRoaXMub3V0cHV0LmluaXQoKTsKICAgIH0KICAgIHN0ZXAodW5zaGlmdCA9IHRydWUpIHsKICAgICAgaWYgKHVuc2hpZnQpCiAgICAgICAgdGhpcy51bnNoaWZ0KCk7CiAgICAgIHRoaXMub3V0cHV0LnVwZGF0ZSgpOwogICAgICB0aGlzLmxpbWl0KCk7CiAgICB9CiAgICB1bnNoaWZ0KCkgewogICAgICBmb3IgKHZhciBpZCBpbiB0aGlzLnRzcykgewogICAgICAgIGlmICh0aGlzLnRzc1tpZF0uX190Zl9fKQogICAgICAgICAgY29udGludWU7CiAgICAgICAgdGhpcy50c3NbaWRdLnVuc2hpZnQodm9pZCAwKTsKICAgICAgfQogICAgfQogICAgLy8gTGltaXQgZW52Lm91dHB1dCBsZW5ndGgKICAgIGxpbWl0KCkgewogICAgICBmb3IgKHZhciBpZCBpbiB0aGlzLnRzcykgewogICAgICAgIGNvbnN0IHRzID0gdGhpcy50c3NbaWRdOwogICAgICAgIHRzLmxlbmd0aCA9IHRzLl9fbGVuX18gfHwgREVGX0xJTUlUJDE7CiAgICAgIH0KICAgIH0KICAgIC8vIEEgc21hbGwgc2FuZGJveCBmb3IgYSBwYXJ0aWN1bGFyIHNjcmlwdAogICAgLy8gVE9ETzogYWRkIHN1cHBvcnQgb2YgJ1NvdXJjZScgcHJvcCB0eXBlIChvcGVuLCBoaWdoLCBobDIgLi4uKQogICAgbWFrZV9ib3goKSB7CiAgICAgIGNvbnN0IGNvZGUgPSB0aGlzLnNyYy5jb2RlOwogICAgICBjb25zdCBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzLnN0ZCk7CiAgICAgIGxldCBzdGQgPSAiIjsKICAgICAgZm9yIChjb25zdCBrIG9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHByb3RvKSkgewogICAgICAgIGlmIChrID09PSAiY29uc3RydWN0b3IiKQogICAgICAgICAgY29udGludWU7CiAgICAgICAgc3RkICs9IGBjb25zdCBzdGRfJHtrfSA9IHNlbGYuc3RkLiR7a30uYmluZChzZWxmLnN0ZCkKYDsKICAgICAgfQogICAgICBsZXQgdHNzID0gIiI7CiAgICAgIGZvciAoY29uc3QgayBpbiB0aGlzLnNoYXJlZCkgewogICAgICAgIGlmICh0aGlzLnNoYXJlZFtrXSAmJiB0aGlzLnNoYXJlZFtrXS5fX2lkX18pIHsKICAgICAgICAgIHRzcyArPSBgY29uc3QgJHtrfSA9IHNoYXJlZC4ke2t9CmA7CiAgICAgICAgfQogICAgICB9CiAgICAgIGNvbnN0IGRzcyA9ICIiOwogICAgICB0cnkgewogICAgICAgIHJldHVybiBGdW5jdGlvbigic2VsZixzaGFyZWQsc2UiLCBgCiAgICAgICAgICAgICAgICAndXNlIHN0cmljdCc7CgogICAgICAgICAgICAgICAgLy8gQnVpbHQtaW4gZnVuY3Rpb25zIChhbGlhc2VzKQogICAgICAgICAgICAgICAgJHtzdGR9CgogICAgICAgICAgICAgICAgLy8gTW9kdWxlcyAoQVBJIC8gaW50ZXJmYWNlcykKICAgICAgICAgICAgICAgICR7dGhpcy5tYWtlX21vZHVsZXMoKX0KCiAgICAgICAgICAgICAgICAvLyBUaW1lc2VyaWVzCiAgICAgICAgICAgICAgICAke3Rzc30KCiAgICAgICAgICAgICAgICAvLyBEaXJlY3QgZGF0YSB0cwogICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IHNlbGYuZGF0YQogICAgICAgICAgICAgICAgY29uc3Qgb2hsY3YgPSBzaGFyZWQuZHNzLm9obGN2LmRhdGEKICAgICAgICAgICAgICAgICR7ZHNzfQoKICAgICAgICAgICAgICAgIC8vIFNjcmlwdCdzIHByb3BlcnRpZXMgKGluaXQpCiAgICAgICAgICAgICAgICBjb25zdCAkcHJvcHMgPSBzZWxmLnNyYy5wcm9wcwoKICAgICAgICAgICAgICAgIC8vIEdsb2JhbHMKICAgICAgICAgICAgICAgIGNvbnN0IHNldHRpbmdzID0gc2VsZi5zcmMuc2V0dGluZ3MKICAgICAgICAgICAgICAgIGNvbnN0IHRmID0gc2hhcmVkLnRmCiAgICAgICAgICAgICAgICBjb25zdCByYW5nZSA9IHNoYXJlZC5yYW5nZQogICAgICAgICAgICAgICAgY29uc3QgcGFuZSA9IHNlbGYucGFuZQoKICAgICAgICAgICAgICAgIHRoaXMuaW5pdCA9IChfaWQgPSAncm9vdCcpID0+IHsKICAgICAgICAgICAgICAgICAgICAke3RoaXMucHJlcChjb2RlLmluaXQpfQogICAgICAgICAgICAgICAgfQoKICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlID0gKF9pZCA9ICdyb290JykgPT4gewogICAgICAgICAgICAgICAgICAgIGNvbnN0IHQgPSBzaGFyZWQudCgpCiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXRlciA9IHNoYXJlZC5pdGVyKCkKICAgICAgICAgICAgICAgICAgICAke3RoaXMucHJlcChjb2RlLnVwZGF0ZSl9CiAgICAgICAgICAgICAgICB9CgogICAgICAgICAgICAgICAgdGhpcy5wb3N0ID0gKF9pZCA9ICdyb290JykgPT4gewogICAgICAgICAgICAgICAgICAgICR7dGhpcy5wcmVwKGNvZGUucG9zdCl9CiAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgIGApOwogICAgICB9IGNhdGNoIChlKSB7CiAgICAgICAgY29uc29sZS5sb2coZSk7CiAgICAgICAgcmV0dXJuIEZ1bmN0aW9uKCJzZWxmLHNoYXJlZCIsIGAKICAgICAgICAgICAgICAgICd1c2Ugc3RyaWN0JzsKICAgICAgICAgICAgICAgIHRoaXMuaW5pdCA9ICgpID0+IHt9CiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSA9ICgpID0+IHt9CiAgICAgICAgICAgICAgICB0aGlzLnBvc3QgPSAoKSA9PiB7fQogICAgICAgICAgICBgKTsKICAgICAgfQogICAgfQogICAgLy8gTWFrZSBkZWZpbml0aW9ucyBmb3IgbW9kdWxlcwogICAgbWFrZV9tb2R1bGVzKCkgewogICAgICBsZXQgcyA9ICIiOwogICAgICBmb3IgKHZhciBpZCBpbiBzZS5tb2RzKSB7CiAgICAgICAgaWYgKCFzZS5tb2RzW2lkXS5hcGkpCiAgICAgICAgICBjb250aW51ZTsKICAgICAgICBzICs9IGBjb25zdCAke2lkfSA9IHNlLm1vZHNbJyR7aWR9J10uYXBpW3NlbGYuaWRdYDsKICAgICAgICBzICs9ICJcbiI7CiAgICAgIH0KICAgICAgcmV0dXJuIHM7CiAgICB9CiAgICAvLyBQcmVwcm9jZXNzIHRoZSB1cGRhdGUgZnVuY3Rpb24uCiAgICAvLyBSZXBsYWNlIGZ1bmN0aW9ucyB3aXRoIHRoZSBmdWxsIGFyZ3VtZW50cyBsaXN0ICsKICAgIC8vIGdlbmVyYXRlICYgYWRkIHRzaWQKICAgIC8vIFRPRE86IGltcGxlbWVudCByZWN1cnNpdmUgcHJlcHBpbmcgKHdpdGgganMgc3ludGF4IHBhcnNlcikKICAgIHByZXAoc3JjKSB7CiAgICAgIGNvbnN0IGggPSB0aGlzLnNyYy50eXBlOwogICAgICBzcmMgPSAiCQkgIGxldCBfcHJlZiA9IGAke19pZH08LSIgKyBoICsgIjwtYFxuIiArIHNyYzsKICAgICAgRkRFRlMyLmxhc3RJbmRleCA9IDA7CiAgICAgIGxldCBjYWxsX2lkID0gMDsKICAgICAgY29uc3QgcHJlZmFicyA9IHNlbGYuc2NyaXB0TGliLnByZWZhYnM7CiAgICAgIGRvIHsKICAgICAgICB2YXIgbSA9IEZERUZTMi5leGVjKHNyYyk7CiAgICAgICAgaWYgKG0pIHsKICAgICAgICAgIGNvbnN0IGZrZXl3b3JkID0gbVsxXS50cmltKCk7CiAgICAgICAgICBjb25zdCBmbmFtZSA9IG1bMl07CiAgICAgICAgICBtWzNdOwogICAgICAgICAgaWYgKGZrZXl3b3JkID09PSAiZnVuY3Rpb24iKQogICAgICAgICAgICA7CiAgICAgICAgICBlbHNlIHsKICAgICAgICAgICAgbGV0IG9mZiA9IG0uaW5kZXggKyBtWzBdLmluZGV4T2YoIigiKTsKICAgICAgICAgICAgY29uc3QgaTEgPSBtLmluZGV4OwogICAgICAgICAgICBjb25zdCBtMCA9IHRoaXMucGFyZW50aGVzZXMobVswXSk7CiAgICAgICAgICAgIGNvbnN0IGkyID0gbS5pbmRleCArIG0wLmxlbmd0aDsKICAgICAgICAgICAgY29uc3QgYXJnczIgPSB0aGlzLmFyZ3MyKG1bMF0pOwogICAgICAgICAgICBpZiAodGhpcy5zdGRbZm5hbWVdKSB7CiAgICAgICAgICAgICAgc3JjID0gdGhpcy5wb3N0Zml4KHNyYywgbSwgKytjYWxsX2lkKTsKICAgICAgICAgICAgICBvZmYgKz0gNDsKICAgICAgICAgICAgfSBlbHNlIGlmIChmbmFtZSBpbiBwcmVmYWJzKSB7CiAgICAgICAgICAgICAgb2ZmICs9IDEwOwogICAgICAgICAgICAgIGNvbnN0IHV0c2lkID0gYF9wcmVmKyJmJHsrK2NhbGxfaWR9ImA7CiAgICAgICAgICAgICAgc3JjID0gdGhpcy5yZXBsYWNlKAogICAgICAgICAgICAgICAgc3JjLAogICAgICAgICAgICAgICAgYHBhbmUuc2VsZi4ke2ZuYW1lfSgke2FyZ3MyfSwgJHt1dHNpZH0pYCwKICAgICAgICAgICAgICAgIGkxLAogICAgICAgICAgICAgICAgaTIKICAgICAgICAgICAgICApOwogICAgICAgICAgICB9IGVsc2UgaWYgKGZuYW1lLnNsaWNlKDAsIDQpID09PSAicGFuZSIgJiYgZm5hbWUuc3BsaXQoIi4iKS5wb3AoKSBpbiBwcmVmYWJzKSB7CiAgICAgICAgICAgICAgY29uc3QgdXRzaWQgPSBgX3ByZWYrImYkeysrY2FsbF9pZH0iYDsKICAgICAgICAgICAgICBzcmMgPSB0aGlzLnJlcGxhY2UoCiAgICAgICAgICAgICAgICBzcmMsCiAgICAgICAgICAgICAgICBgJHtmbmFtZX0oJHthcmdzMn0sICR7dXRzaWR9KWAsCiAgICAgICAgICAgICAgICBpMSwKICAgICAgICAgICAgICAgIGkyCiAgICAgICAgICAgICAgKTsKICAgICAgICAgICAgfQogICAgICAgICAgICBGREVGUzIubGFzdEluZGV4ID0gb2ZmOwogICAgICAgICAgfQogICAgICAgIH0KICAgICAgfSB3aGlsZSAobSk7CiAgICAgIHJldHVybiB3cmFwX2lkeHMoc3JjLCAic3RkXyIpOwogICAgfQogICAgLy8gUG9zdGZpeCBmdW5jdGlvbiBjYWxscyB3aXRoIHRzIF9pZHMKICAgIHBvc3RmaXgoc3JjLCBtLCBjYWxsX2lkKSB7CiAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuZ2V0X2FyZ3ModGhpcy5mZGVmKG1bMl0pKS5sZW5ndGg7CiAgICAgIGNvbnN0IG0wID0gdGhpcy5wYXJlbnRoZXNlcyhtWzBdKTsKICAgICAgY29uc3QgYXJncyA9IHRoaXMuZ2V0X2FyZ3NfMihtMCk7CiAgICAgIGZvciAodmFyIGkgPSBhcmdzLmxlbmd0aDsgaSA8IHRhcmdldDsgaSsrKSB7CiAgICAgICAgYXJncy5wdXNoKCJ2b2lkIDAiKTsKICAgICAgfQogICAgICBhcmdzLnB1c2goYF9wcmVmKyJmJHtjYWxsX2lkfSJgKTsKICAgICAgcmV0dXJuIHNyYy5yZXBsYWNlKG0wLCBgc3RkXyR7bVsyXX0oJHthcmdzLmpvaW4oIiwgIil9KWApOwogICAgfQogICAgLy8gSW5zZXJ0IHN0cmluZyBpbnRvIHRleHQKICAgIHJlcGxhY2Uoc3JjLCBzdHIsIGkxLCBpMikgewogICAgICByZXR1cm4gW3NyYy5zbGljZSgwLCBpMSksIHN0ciwgc3JjLnNsaWNlKGkyKV0uam9pbigiIik7CiAgICB9CiAgICBwYXJlbnRoZXNlcyhzdHIpIHsKICAgICAgdmFyIGNvdW50ID0gMCwgZmlyc3QgPSBmYWxzZTsKICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHsKICAgICAgICBpZiAoc3RyW2ldID09PSAiKCIpIHsKICAgICAgICAgIGNvdW50Kys7CiAgICAgICAgICBmaXJzdCA9IHRydWU7CiAgICAgICAgfSBlbHNlIGlmIChzdHJbaV0gPT09ICIpIikgewogICAgICAgICAgY291bnQtLTsKICAgICAgICB9CiAgICAgICAgaWYgKGZpcnN0ICYmIGNvdW50ID09PSAwKSB7CiAgICAgICAgICByZXR1cm4gc3RyLnN1YnN0cigwLCBpICsgMSk7CiAgICAgICAgfQogICAgICB9CiAgICAgIHJldHVybiBzdHI7CiAgICB9CiAgICBhcmdzMihzdHIpIHsKICAgICAgdmFyIGNvdW50ID0gMCwgZmlyc3QgPSBmYWxzZTsKICAgICAgdmFyIGkxID0gMDsKICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHsKICAgICAgICBpZiAoc3RyW2ldID09PSAiKCIpIHsKICAgICAgICAgIGNvdW50Kys7CiAgICAgICAgICBpZiAoIWZpcnN0KQogICAgICAgICAgICBpMSA9IGkgKyAxOwogICAgICAgICAgZmlyc3QgPSB0cnVlOwogICAgICAgIH0gZWxzZSBpZiAoc3RyW2ldID09PSAiKSIpIHsKICAgICAgICAgIGNvdW50LS07CiAgICAgICAgfQogICAgICAgIGlmIChmaXJzdCAmJiBjb3VudCA9PT0gMCkgewogICAgICAgICAgcmV0dXJuIHN0ci5zdWJzdHJpbmcoaTEsIGkpOwogICAgICAgIH0KICAgICAgfQogICAgICByZXR1cm4gc3RyOwogICAgfQogICAgLy8gR2V0IHRoZSBmdW5jdGlvbiBkZWZpbml0aW9uCiAgICAvLyBUT0RPOiBhZGQgc3VwcG9ydCBvZiBtb2R1bGVzCiAgICBmZGVmKGZuYW1lKSB7CiAgICAgIHJldHVybiB0aGlzLnN0ZFtmbmFtZV0udG9TdHJpbmcoKTsKICAgIH0KICAgIC8vIEdldCBhcmdzIGluIHRoZSBmdW5jdGlvbidzIGRlZmluaXRpb24KICAgIGdldF9hcmdzKHNyYykgewogICAgICBjb25zdCByZWcgPSB0aGlzLnJlZ2V4X2Nsb25lKEZERUZTMSk7CiAgICAgIHJlZy5sYXN0SW5kZXggPSAwOwogICAgICBjb25zdCBtID0gcmVnLmV4ZWMoc3JjKTsKICAgICAgaWYgKCFtWzNdLnRyaW0oKS5sZW5ndGgpCiAgICAgICAgcmV0dXJuIFtdOwogICAgICBjb25zdCBhcnIgPSBtWzNdLnNwbGl0KCIsIikubWFwKCh4KSA9PiB4LnRyaW0oKSkuZmlsdGVyKCh4KSA9PiB4ICE9PSAiX2lkIiAmJiB4ICE9PSAiX3RmIik7CiAgICAgIHJldHVybiBhcnI7CiAgICB9CiAgICBnZXRfYXJnc18yKHN0cikgewogICAgICBjb25zdCBwYXJ0cyA9IFtdOwogICAgICBsZXQgYyA9IDA7CiAgICAgIGxldCBzID0gMDsKICAgICAgdmFyIHExID0gZmFsc2UsIHEyID0gZmFsc2UsIHEzID0gZmFsc2U7CiAgICAgIGxldCBwYXJ0OwogICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykgewogICAgICAgIGlmIChzdHJbaV0gPT09ICIoIikgewogICAgICAgICAgYysrOwogICAgICAgICAgaWYgKCFwYXJ0KQogICAgICAgICAgICBwYXJ0ID0gW2kgKyAxXTsKICAgICAgICB9CiAgICAgICAgaWYgKHN0cltpXSA9PT0gIikiKQogICAgICAgICAgYy0tOwogICAgICAgIGlmIChzdHJbaV0gPT09ICJbIikKICAgICAgICAgIHMrKzsKICAgICAgICBpZiAoc3RyW2ldID09PSAiXSIpCiAgICAgICAgICBzLS07CiAgICAgICAgaWYgKHN0cltpXSA9PT0gIiciKQogICAgICAgICAgcTEgPSAhcTE7CiAgICAgICAgaWYgKHN0cltpXSA9PT0gJyInKQogICAgICAgICAgcTIgPSAhcTI7CiAgICAgICAgaWYgKHN0cltpXSA9PT0gImAiKQogICAgICAgICAgcTMgPSAhcTM7CiAgICAgICAgaWYgKHN0cltpXSA9PT0gIiwiICYmIGMgPT09IDEgJiYgIXMgJiYgIXExICYmICFxMiAmJiAhcTMpIHsKICAgICAgICAgIGlmIChwYXJ0KSB7CiAgICAgICAgICAgIHBhcnRbMV0gPSBpOwogICAgICAgICAgICBwYXJ0cy5wdXNoKHBhcnQpOwogICAgICAgICAgICBwYXJ0ID0gW2kgKyAxXTsKICAgICAgICAgIH0KICAgICAgICB9CiAgICAgICAgaWYgKGMgPT09IDAgJiYgcGFydCkgewogICAgICAgICAgcGFydFsxXSA9IGk7CiAgICAgICAgICBwYXJ0cy5wdXNoKHBhcnQpOwogICAgICAgICAgcGFydCA9IG51bGw7CiAgICAgICAgfQogICAgICB9CiAgICAgIHJldHVybiBwYXJ0cy5tYXAoKHgpID0+IHN0ci5zbGljZSguLi54KSkuZmlsdGVyKCh4KSA9PiAvW15cc10rLy5leGVjKHgpKTsKICAgIH0KICAgIHJlZ2V4X2Nsb25lKHJleCkgewogICAgICByZXR1cm4gbmV3IFJlZ0V4cChyZXguc291cmNlLCByZXguZmxhZ3MpOwogICAgfQogICAgc2VuZF9tb2RpZnkodXBkKSB7CiAgICAgIHNlLnNlbmQoIm1vZGlmeS1vdmVybGF5IiwgewogICAgICAgIHV1aWQ6IHRoaXMuaWQsCiAgICAgICAgZmllbGRzOiB1cGQKICAgICAgfSk7CiAgICB9CiAgfQogIGNvbnN0IFNZTVRGID0gLyhvcGVufGhpZ2h8bG93fGNsb3NlfHZvbCkoXGQrKShcdyopL2dtOwogIGNvbnN0IEZOU1REID0gLyhhP3RyfGtjdz98ZG1pfHNhcnxzdXBlcnRyZW5kfHdwcikoXGQrP1x3KilccypcKC9nbTsKICBjb25zdCBTWU1TVEQgPSAvKD86aGwyfGhsYzN8b2hsYzQpL2dtOwogIHZhciBzeW1zdGQgPSB7CiAgICBwYXJzZShzKSB7CiAgICAgIGNvbnN0IHNzID0gcy5jb2RlOwogICAgICBjb25zdCBhbGwgPSBgJHtzcy5pbml0fQoke3NzLnVwZGF0ZX0KJHtzcy5wb3N0fWA7CiAgICAgIFNZTVRGLmxhc3RJbmRleCA9IDA7CiAgICAgIEZOU1RELmxhc3RJbmRleCA9IDA7CiAgICAgIFNZTVNURC5sYXN0SW5kZXggPSAwOwogICAgICBsZXQgbTsKICAgICAgZG8gewogICAgICAgIG0gPSBTWU1URi5leGVjKGFsbCk7CiAgICAgICAgaWYgKG0pIHsKICAgICAgICAgIGlmIChtWzBdIGluIHNlLnRzcykKICAgICAgICAgICAgY29udGludWU7CiAgICAgICAgICBjb25zdCB0cyA9IHNlLnRzc1ttWzBdXSA9IFRTKG1bMF0sIFtdKTsKICAgICAgICAgIHRzLl9fdGZfXyA9IHRmX2Zyb21fcGFpcihtWzJdLCBtWzNdKTsKICAgICAgICAgIHRzLl9fZm5fXyA9IFNhbXBsZXIobVsxXSwgdHJ1ZSkuYmluZCh0cyk7CiAgICAgICAgfQogICAgICB9IHdoaWxlIChtKTsKICAgICAgZG8gewogICAgICAgIG0gPSBTWU1TVEQuZXhlYyhhbGwpOwogICAgICAgIGlmIChtKSB7CiAgICAgICAgICBpZiAobVswXSBpbiBzZS50c3MpCiAgICAgICAgICAgIGNvbnRpbnVlOwogICAgICAgICAgdGhpcy5wYXJzZV90c19zeW0obVswXSk7CiAgICAgICAgfQogICAgICB9IHdoaWxlIChtKTsKICAgICAgZG8gewogICAgICAgIG0gPSBGTlNURC5leGVjKGFsbCk7CiAgICAgICAgaWYgKG0pIHsKICAgICAgICAgIGNvbnN0IGZuID0gbVsxXSArIG1bMl07CiAgICAgICAgICBjb25zdCB0ZiA9IG1bMl07CiAgICAgICAgICBpZiAoZm4gaW4gc2Uuc3RkX3BsdXMpCiAgICAgICAgICAgIGNvbnRpbnVlOwogICAgICAgICAgc3dpdGNoIChtWzFdKSB7CiAgICAgICAgICAgIGNhc2UgInRyIjoKICAgICAgICAgICAgICB0aGlzLmRlcHMoWyJoaWdoIiwgImxvdyIsICJjbG9zZSJdLCBtWzJdKTsKICAgICAgICAgICAgICBzZS5zdGRfcGx1c1tmbl0gPSBmdW5jdGlvbihmaXhuYW4gPSBmYWxzZSwgX2lkKSB7CiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50cihmaXhuYW4sIF9pZCwgdGYpOwogICAgICAgICAgICAgIH07CiAgICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICAgIGNhc2UgImF0ciI6CiAgICAgICAgICAgICAgdGhpcy5kZXBzKFsiaGlnaCIsICJsb3ciLCAiY2xvc2UiXSwgbVsyXSk7CiAgICAgICAgICAgICAgc2Uuc3RkX3BsdXNbZm5dID0gZnVuY3Rpb24obGVuLCBfaWQpIHsKICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmF0cihsZW4sIF9pZCwgdGYpOwogICAgICAgICAgICAgIH07CiAgICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICAgIGNhc2UgImtjIjoKICAgICAgICAgICAgICB0aGlzLmRlcHMoWyJoaWdoIiwgImxvdyIsICJjbG9zZSJdLCBtWzJdKTsKICAgICAgICAgICAgICBzZS5zdGRfcGx1c1tmbl0gPSBmdW5jdGlvbihzcmMsIGxlbiwgbXVsdCwgdXNlX3RyID0gdHJ1ZSwgX2lkKSB7CiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5rYyhzcmMsIGxlbiwgbXVsdCwgdXNlX3RyLCBfaWQsIHRmKTsKICAgICAgICAgICAgICB9OwogICAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgICBjYXNlICJrY3ciOgogICAgICAgICAgICAgIHRoaXMuZGVwcyhbImhpZ2giLCAibG93IiwgImNsb3NlIl0sIG1bMl0pOwogICAgICAgICAgICAgIHNlLnN0ZF9wbHVzW2ZuXSA9IGZ1bmN0aW9uKHNyYywgbGVuLCBtdWx0LCB1c2VfdHIgPSB0cnVlLCBfaWQpIHsKICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmtjdyhzcmMsIGxlbiwgbXVsdCwgdXNlX3RyLCBfaWQsIHRmKTsKICAgICAgICAgICAgICB9OwogICAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgICBjYXNlICJkbWkiOgogICAgICAgICAgICAgIHRoaXMuZGVwcyhbImhpZ2giLCAibG93IiwgImNsb3NlIl0sIG1bMl0pOwogICAgICAgICAgICAgIHNlLnN0ZF9wbHVzW2ZuXSA9IGZ1bmN0aW9uKGxlbiwgc21vb3RoLCBfaWQpIHsKICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRtaShsZW4sIHNtb290aCwgX2lkLCB0Zik7CiAgICAgICAgICAgICAgfTsKICAgICAgICAgICAgICBicmVhazsKICAgICAgICAgICAgY2FzZSAic2FyIjoKICAgICAgICAgICAgICB0aGlzLmRlcHMoWyJoaWdoIiwgImxvdyIsICJjbG9zZSJdLCBtWzJdKTsKICAgICAgICAgICAgICBzZS5zdGRfcGx1c1tmbl0gPSBmdW5jdGlvbihzdGFydCwgaW5jLCBtYXgsIF9pZCkgewogICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2FyKHN0YXJ0LCBpbmMsIG1heCwgX2lkLCB0Zik7CiAgICAgICAgICAgICAgfTsKICAgICAgICAgICAgICBicmVhazsKICAgICAgICAgICAgY2FzZSAic3VwZXJ0cmVuZCI6CiAgICAgICAgICAgICAgdGhpcy5kZXBzKFsiaGlnaCIsICJsb3ciLCAiY2xvc2UiXSwgbVsyXSk7CiAgICAgICAgICAgICAgc2Uuc3RkX3BsdXNbZm5dID0gZnVuY3Rpb24oZmFjdG9yLCBhdHJsZW4sIF9pZCkgewogICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3VwZXJ0cmVuZChmYWN0b3IsIGF0cmxlbiwgX2lkLCB0Zik7CiAgICAgICAgICAgICAgfTsKICAgICAgICAgICAgICBicmVhazsKICAgICAgICAgICAgY2FzZSAid3ByIjoKICAgICAgICAgICAgICB0aGlzLmRlcHMoWyJoaWdoIiwgImxvdyIsICJjbG9zZSJdLCBtWzJdKTsKICAgICAgICAgICAgICBzZS5zdGRfcGx1c1tmbl0gPSBmdW5jdGlvbihsZW4sIF9pZCkgewogICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMud3ByKGxlbiwgX2lkLCB0Zik7CiAgICAgICAgICAgICAgfTsKICAgICAgICAgICAgICBicmVhazsKICAgICAgICAgIH0KICAgICAgICB9CiAgICAgIH0gd2hpbGUgKG0pOwogICAgfSwKICAgIHBhcnNlX3RzX3N5bShzeW0sIHRmKSB7CiAgICAgIHN3aXRjaCAoc3ltKSB7CiAgICAgICAgY2FzZSAiaGwyIjoKICAgICAgICAgIHNlLnRzc1siaGwyIl0gPSBUUygiaGwyIiwgW10pOwogICAgICAgICAgc2UudHNzWyJobDIiXS5fX2ZuX18gPSAoKSA9PiB7CiAgICAgICAgICAgIHJldHVybiAoc2UuaGlnaFswXSArIHNlLmxvd1swXSkgKiAwLjU7CiAgICAgICAgICB9OwogICAgICAgICAgYnJlYWs7CiAgICAgICAgY2FzZSAiaGxjMyI6CiAgICAgICAgICBzZS50c3NbImhsYzMiXSA9IFRTKCJobGMzIiwgW10pOwogICAgICAgICAgc2UudHNzWyJobGMzIl0uX19mbl9fID0gKCkgPT4gewogICAgICAgICAgICByZXR1cm4gKHNlLmhpZ2hbMF0gKyBzZS5sb3dbMF0gKyBzZS5jbG9zZVswXSkgLyAzOwogICAgICAgICAgfTsKICAgICAgICAgIGJyZWFrOwogICAgICAgIGNhc2UgIm9obGM0IjoKICAgICAgICAgIHNlLnRzc1sib2hsYzQiXSA9IFRTKCJvaGxjNCIsIFtdKTsKICAgICAgICAgIHNlLnRzc1sib2hsYzQiXS5fX2ZuX18gPSAoKSA9PiB7CiAgICAgICAgICAgIHJldHVybiAoc2Uub3BlblswXSArIHNlLmhpZ2hbMF0gKyBzZS5sb3dbMF0gKyBzZS5jbG9zZVswXSkgKiAwLjI1OwogICAgICAgICAgfTsKICAgICAgICAgIGJyZWFrOwogICAgICB9CiAgICB9LAogICAgZGVwcyh0eXBlcywgdGYpIHsKICAgICAgZm9yICh2YXIgdHlwZSBvZiB0eXBlcykgewogICAgICAgIGNvbnN0IHN5bSA9IHR5cGUgKyB0ZjsKICAgICAgICBpZiAoc3ltIGluIHNlLnRzcykKICAgICAgICAgIGNvbnRpbnVlOwogICAgICAgIGNvbnN0IHRzID0gc2UudHNzW3N5bV0gPSBUUyhzeW0sIFtdKTsKICAgICAgICB0cy5fX3RmX18gPSB0Zl9mcm9tX3N0cih0Zik7CiAgICAgICAgdHMuX19mbl9fID0gU2FtcGxlcih0eXBlLCB0cnVlKS5iaW5kKHRzKTsKICAgICAgfQogICAgfQogIH07CiAgY29uc3QgREVGX0xJTUlUID0gNTsKICBjbGFzcyBTY3JpcHRFbmdpbmUgewogICAgY29uc3RydWN0b3IoKSB7CiAgICAgIHRoaXMubWFwID0ge307CiAgICAgIHRoaXMuZGF0YSA9IHt9OwogICAgICB0aGlzLnF1ZXVlID0gW107CiAgICAgIHRoaXMuZGVsdGFfcXVldWUgPSBbXTsKICAgICAgdGhpcy51cGRhdGVfcXVldWUgPSBbXTsKICAgICAgdGhpcy5zZXR0ID0ge307CiAgICAgIHRoaXMuc3RhdGUgPSB7fTsKICAgICAgdGhpcy5tb2RzID0ge307CiAgICAgIHRoaXMuc3RkX3BsdXMgPSB7fTsKICAgICAgdGhpcy50ZiA9IHZvaWQgMDsKICAgIH0KICAgIGFzeW5jIGV4ZWNfYWxsKCkgewogICAgICBpZiAoIXRoaXMuZGF0YS5vaGxjdikKICAgICAgICByZXR1cm47CiAgICAgIHRoaXMubWFwID0gdGhpcy5zdHJ1Y3RfdG9fbWFwKHNlbGYucGFuZVN0cnVjdCk7CiAgICAgIGlmICghdGhpcy5pbml0X3N0YXRlKCkpCiAgICAgICAgcmV0dXJuOwogICAgICB0aGlzLmluaXRfbWFwKCk7CiAgICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLm1hcCkubGVuZ3RoKSB7CiAgICAgICAgYXdhaXQgdGhpcy5ydW4oKTsKICAgICAgICB0aGlzLmRyYWluX3F1ZXVlcygpOwogICAgICB9IGVsc2UgewogICAgICAgIHRoaXMuc2VuZCgib3ZlcmxheS1kYXRhIiwgdGhpcy5mb3JtYXRfZGF0YSgpKTsKICAgICAgfQogICAgICB0aGlzLnNlbmRfc3RhdGUoKTsKICAgIH0KICAgIC8vIEV4ZWMgc2VsZWN0ZWQKICAgIGFzeW5jIGV4ZWNfc2VsKGRlbHRhKSB7CiAgICAgIGlmICghdGhpcy5kYXRhLm9obGN2KQogICAgICAgIHJldHVybjsKICAgICAgY29uc3Qgc2VsID0gT2JqZWN0LmtleXMoZGVsdGEpLmZpbHRlcigoeCkgPT4geCBpbiB0aGlzLm1hcCk7CiAgICAgIGlmICghdGhpcy5pbml0X3N0YXRlKHNlbCkpIHsKICAgICAgICB0aGlzLmRlbHRhX3F1ZXVlLnB1c2goZGVsdGEpOwogICAgICAgIHJldHVybjsKICAgICAgfQogICAgICBmb3IgKHZhciBpZCBpbiBkZWx0YSkgewogICAgICAgIGlmICghdGhpcy5tYXBbaWRdKQogICAgICAgICAgY29udGludWU7CiAgICAgICAgY29uc3QgcHJvcHMgPSB0aGlzLm1hcFtpZF0uc3JjLnByb3BzIHx8IHt9OwogICAgICAgIGZvciAodmFyIGsgaW4gcHJvcHMpIHsKICAgICAgICAgIGlmIChrIGluIGRlbHRhW2lkXSkgewogICAgICAgICAgICBwcm9wc1trXS52YWwgPSBkZWx0YVtpZF1ba107CiAgICAgICAgICB9CiAgICAgICAgfQogICAgICAgIHRoaXMuYWRkX3NjcmlwdCh0aGlzLm1hcFtpZF0pOwogICAgICB9CiAgICAgIGF3YWl0IHRoaXMucnVuKHNlbCk7CiAgICAgIHRoaXMuZHJhaW5fcXVldWVzKCk7CiAgICAgIHRoaXMuc2VuZF9zdGF0ZSgpOwogICAgfQogICAgLy8gQWRkIHNjcmlwdCAoY3JlYXRlIGEgbmV3IFNjcmlwdEVudiwgYWRkIHRvIHRoZSBtYXApCiAgICBhZGRfc2NyaXB0KHMpIHsKICAgICAgY29uc3Qgc2NyaXB0ID0gc2VsZi5zY3JpcHRMaWIuaVNjcmlwdHNbcy50eXBlXTsKICAgICAgaWYgKCFzY3JpcHQpIHsKICAgICAgICBkZWxldGUgdGhpcy5tYXBbcy51dWlkXTsKICAgICAgICByZXR1cm4gY29uc29sZS5sb2coIlVua25vd24gc2NyaXB0OiAiLCBzLnR5cGUpOwogICAgICB9CiAgICAgIHMuY29kZSA9IHsKICAgICAgICBpbml0OiBzY3JpcHQuY29kZS5pbml0IHx8ICIiLAogICAgICAgIHVwZGF0ZTogc2NyaXB0LmNvZGUudXBkYXRlIHx8ICIiLAogICAgICAgIHBvc3Q6IHNjcmlwdC5jb2RlLnBvc3QgfHwgIiIKICAgICAgfTsKICAgICAgc3ltc3RkLnBhcnNlKHMpOwogICAgICBmb3IgKGNvbnN0IGlkIGluIHRoaXMubW9kcykgewogICAgICAgIGlmICh0aGlzLm1vZHNbaWRdLnByZV9lbnYpIHsKICAgICAgICAgIHRoaXMubW9kc1tpZF0ucHJlX2VudihzLnV1aWQsIHMpOwogICAgICAgIH0KICAgICAgfQogICAgICBzLmVudiA9IG5ldyBTY3JpcHRFbnYocywgT2JqZWN0LmFzc2lnbih0aGlzLnNoYXJlZCwgewogICAgICAgIG9wZW46IHRoaXMub3BlbiwKICAgICAgICBoaWdoOiB0aGlzLmhpZ2gsCiAgICAgICAgbG93OiB0aGlzLmxvdywKICAgICAgICBjbG9zZTogdGhpcy5jbG9zZSwKICAgICAgICB2b2w6IHRoaXMudm9sLAogICAgICAgIGRzczogdGhpcy5kYXRhLAogICAgICAgIHQ6ICgpID0+IHRoaXMudCwKICAgICAgICBpdGVyOiAoKSA9PiB0aGlzLml0ZXIsCiAgICAgICAgdGY6IHRoaXMudGYsCiAgICAgICAgcmFuZ2U6IHRoaXMucmFuZ2UsCiAgICAgICAgb25jbG9zZTogdHJ1ZQogICAgICB9LCB0aGlzLnRzcykpOwogICAgICB0aGlzLm1hcFtzLnV1aWRdID0gczsKICAgICAgZm9yIChjb25zdCBpZCBpbiB0aGlzLm1vZHMpIHsKICAgICAgICBpZiAodGhpcy5tb2RzW2lkXS5uZXdfZW52KSB7CiAgICAgICAgICB0aGlzLm1vZHNbaWRdLm5ld19lbnYocy51dWlkLCBzKTsKICAgICAgICB9CiAgICAgIH0KICAgICAgcy5lbnYuYnVpbGQoKTsKICAgIH0KICAgIC8vIExpdmUgdXBkYXRlCiAgICB1cGRhdGUoY2FuZGxlcywgZSkgewogICAgICBpZiAoIXRoaXMuZGF0YS5vaGxjdiB8fCAhdGhpcy5kYXRhLm9obGN2LmRhdGEubGVuZ3RoKSB7CiAgICAgICAgcmV0dXJuIHRoaXMuc2VuZF91cGRhdGUoZS5kYXRhLmlkKTsKICAgICAgfQogICAgICBpZiAodGhpcy5ydW5uaW5nKSB7CiAgICAgICAgdGhpcy51cGRhdGVfcXVldWUucHVzaChbY2FuZGxlcywgZV0pOwogICAgICAgIHJldHVybjsKICAgICAgfQogICAgICBpZiAoIXRoaXMuc2hhcmVkKQogICAgICAgIHJldHVybjsKICAgICAgY29uc3QgbWZzMSA9IHRoaXMubWFrZV9tb2RzX2hvb2tzKCJwcmVfc3RlcCIpOwogICAgICBjb25zdCBtZnMyID0gdGhpcy5tYWtlX21vZHNfaG9va3MoInBvc3Rfc3RlcCIpOwogICAgICBjb25zdCBzdGVwID0gKHNlbCwgdW5zaGlmdCkgPT4gewogICAgICAgIGZvciAobGV0IG0gPSAwOyBtIDwgbWZzMS5sZW5ndGg7IG0rKykgewogICAgICAgICAgbWZzMVttXShzZWwpOwogICAgICAgIH0KICAgICAgICBmb3IgKGNvbnN0IGlkIG9mIHNlbCkgewogICAgICAgICAgdGhpcy5tYXBbaWRdLmVudi5zdGVwKHVuc2hpZnQpOwogICAgICAgIH0KICAgICAgICBmb3IgKGxldCBtID0gMDsgbSA8IG1mczIubGVuZ3RoOyBtKyspIHsKICAgICAgICAgIG1mczJbbV0oc2VsKTsKICAgICAgICB9CiAgICAgIH07CiAgICAgIHRyeSB7CiAgICAgICAgY29uc3Qgb2hsY3YgPSB0aGlzLmRhdGEub2hsY3YuZGF0YTsKICAgICAgICBsZXQgaSA9IG9obGN2Lmxlbmd0aCAtIDE7CiAgICAgICAgY29uc3QgbGFzdCA9IG9obGN2W2ldOwogICAgICAgIGNvbnN0IHNlbCA9IE9iamVjdC5rZXlzKHRoaXMubWFwKTsKICAgICAgICBsZXQgdW5zaGlmdCA9IGZhbHNlOwogICAgICAgIHRoaXMuc2hhcmVkLmV2ZW50ID0gInVwZGF0ZSI7CiAgICAgICAgZm9yICh2YXIgY2FuZGxlIG9mIGNhbmRsZXMpIHsKICAgICAgICAgIGlmIChjYW5kbGVbMF0gPiBsYXN0WzBdKSB7CiAgICAgICAgICAgIHRoaXMuc2hhcmVkLm9uY2xvc2UgPSB0cnVlOwogICAgICAgICAgICBzdGVwKHNlbCwgZmFsc2UpOwogICAgICAgICAgICBvaGxjdi5wdXNoKGNhbmRsZSk7CiAgICAgICAgICAgIHVuc2hpZnQgPSB0cnVlOwogICAgICAgICAgICBpKys7CiAgICAgICAgICB9IGVsc2UgaWYgKGNhbmRsZVswXSA8IGxhc3RbMF0pIHsKICAgICAgICAgICAgY29udGludWU7CiAgICAgICAgICB9IGVsc2UgewogICAgICAgICAgICBvaGxjdltpXSA9IGNhbmRsZTsKICAgICAgICAgIH0KICAgICAgICB9CiAgICAgICAgdGhpcy5pdGVyID0gaTsKICAgICAgICB0aGlzLnQgPSBvaGxjdltpXVswXTsKICAgICAgICB0aGlzLnN0ZXAob2hsY3ZbaV0sIHVuc2hpZnQpOwogICAgICAgIHRoaXMuc2hhcmVkLm9uY2xvc2UgPSBmYWxzZTsKICAgICAgICBzdGVwKHNlbCwgdW5zaGlmdCk7CiAgICAgICAgdGhpcy5saW1pdCgpOwogICAgICAgIHRoaXMuc2VuZF91cGRhdGUoZS5kYXRhLmlkKTsKICAgICAgICB0aGlzLnNlbmRfc3RhdGUoKTsKICAgICAgfSBjYXRjaCAoZXJyKSB7CiAgICAgICAgY29uc29sZS5sb2coZXJyKTsKICAgICAgfQogICAgfQogICAgaW5pdF9zdGF0ZShzZWwpIHsKICAgICAgc2VsID0gc2VsICE9IG51bGwgPyBzZWwgOiBPYmplY3Qua2V5cyh0aGlzLm1hcCk7CiAgICAgIGNvbnN0IHRhc2sgPSBzZWwuam9pbigiLCIpOwogICAgICBpZiAodGhpcy5ydW5uaW5nKSB7CiAgICAgICAgdGhpcy5fcmVzdGFydCA9IHRhc2sgPT09IHRoaXMudGFzazsKICAgICAgICByZXR1cm4gZmFsc2U7CiAgICAgIH0KICAgICAgdGhpcy5vcGVuID0gVFMoIm9wZW4iLCBbXSk7CiAgICAgIHRoaXMuaGlnaCA9IFRTKCJoaWdoIiwgW10pOwogICAgICB0aGlzLmxvdyA9IFRTKCJsb3ciLCBbXSk7CiAgICAgIHRoaXMuY2xvc2UgPSBUUygiY2xvc2UiLCBbXSk7CiAgICAgIHRoaXMudm9sID0gVFMoInZvbCIsIFtdKTsKICAgICAgdGhpcy50c3MgPSB7fTsKICAgICAgdGhpcy5zdGRfcGx1cyA9IHt9OwogICAgICB0aGlzLnNoYXJlZCA9IHt9OwogICAgICB0aGlzLml0ZXIgPSAwOwogICAgICB0aGlzLnQgPSAwOwogICAgICB0aGlzLnNraXAgPSBmYWxzZTsKICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7CiAgICAgIHRoaXMudGFzayA9IHRhc2s7CiAgICAgIHJldHVybiB0cnVlOwogICAgfQogICAgLy8gQ29udmVydCBmdWxsIHNjcmlwdCBzdHJ1Y3QgdG8gYSBtYXAKICAgIHN0cnVjdF90b19tYXAoc3RydWN0KSB7CiAgICAgIHZhciBfYTsKICAgICAgY29uc3QgbWFwID0ge307CiAgICAgIGNvbnN0IGxpc3QgPSBbXTsKICAgICAgZm9yICh2YXIgcGFuZSBvZiBzdHJ1Y3QpIHsKICAgICAgICBmb3IgKHZhciBzIG9mIHBhbmUuc2NyaXB0cykgewogICAgICAgICAgbGlzdC5wdXNoKFtzLnV1aWQsIHMsIChfYSA9IHMuc2V0dGluZ3MuZXhlY09yZGVyKSAhPSBudWxsID8gX2EgOiAxXSk7CiAgICAgICAgfQogICAgICB9CiAgICAgIGxpc3Quc29ydCgoYSwgYikgPT4gYVsyXSAtIGJbMl0pOwogICAgICBsaXN0LmZvckVhY2goKHgpID0+IHsKICAgICAgICBtYXBbeFswXV0gPSB4WzFdOwogICAgICB9KTsKICAgICAgcmV0dXJuIG1hcDsKICAgIH0KICAgIC8vIEluamVjdC9vdmVycmlkZSBmdW5jdGlvbnMgaW4gdGhlIHN0ZCBsaWIgb2JqZWN0CiAgICBzdGRfaW5qZWN0KHN0ZCkgewogICAgICBjb25zdCBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihzdGQpOwogICAgICBPYmplY3QuYXNzaWduKHByb3RvLCB0aGlzLnN0ZF9wbHVzKTsKICAgICAgcmV0dXJuIHN0ZDsKICAgIH0KICAgIHNlbmRfc3RhdGUoKSB7CiAgICAgIHRoaXMuc2VuZCgiZW5naW5lLXN0YXRlIiwgewogICAgICAgIHNjcmlwdHM6IE9iamVjdC5rZXlzKHRoaXMubWFwKS5sZW5ndGgsCiAgICAgICAgbGFzdF9wZXJmOiB0aGlzLnBlcmYsCiAgICAgICAgaXRlcjogdGhpcy5pdGVyLAogICAgICAgIGxhc3RfdDogdGhpcy50LAogICAgICAgIGRhdGFfc2l6ZTogdGhpcy5kYXRhX3NpemUsCiAgICAgICAgcnVubmluZzogZmFsc2UKICAgICAgfSk7CiAgICB9CiAgICBzZW5kX3VwZGF0ZSh0YXNrSWQpIHsKICAgICAgdGhpcy5zZW5kKAogICAgICAgICJvdmVybGF5LXVwZGF0ZSIsCiAgICAgICAgdGhpcy5mb3JtYXRfdXBkYXRlKCksCiAgICAgICAgdGFza0lkCiAgICAgICk7CiAgICB9CiAgICBpbml0X21hcCgpIHsKICAgICAgZm9yICh2YXIgaWQgaW4gdGhpcy5tYXApIHsKICAgICAgICB0aGlzLmFkZF9zY3JpcHQodGhpcy5tYXBbaWRdKTsKICAgICAgfQogICAgfQogICAgYXN5bmMgcnVuKHNlbCkgewogICAgICB0aGlzLnNlbmQoImVuZ2luZS1zdGF0ZSIsIHsgcnVubmluZzogdHJ1ZSB9KTsKICAgICAgdmFyIHQxID0gVXRpbHMubm93KCk7CiAgICAgIHNlbCA9IHNlbCB8fCBPYmplY3Qua2V5cyh0aGlzLm1hcCk7CiAgICAgIHRoaXMucHJlX3J1bl9tb2RzKHNlbCk7CiAgICAgIGNvbnN0IG1mczEgPSB0aGlzLm1ha2VfbW9kc19ob29rcygicHJlX3N0ZXAiKTsKICAgICAgY29uc3QgbWZzMiA9IHRoaXMubWFrZV9tb2RzX2hvb2tzKCJwb3N0X3N0ZXAiKTsKICAgICAgdGhpcy5ydW5uaW5nID0gdHJ1ZTsKICAgICAgdHJ5IHsKICAgICAgICBmb3IgKGNvbnN0IGlkIG9mIHNlbCkgewogICAgICAgICAgdGhpcy5tYXBbaWRdLmVudi5pbml0KCk7CiAgICAgICAgfQogICAgICAgIGNvbnN0IG9obGN2ID0gdGhpcy5kYXRhLm9obGN2LmRhdGE7CiAgICAgICAgY29uc3Qgc3RhcnQgPSB0aGlzLnN0YXJ0KG9obGN2KTsKICAgICAgICB0aGlzLnNoYXJlZC5ldmVudCA9ICJzdGVwIjsKICAgICAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBvaGxjdi5sZW5ndGg7IGkrKykgewogICAgICAgICAgaWYgKGkgJSA1ZTMgPT09IDApCiAgICAgICAgICAgIGF3YWl0IFV0aWxzLnBhdXNlKDApOwogICAgICAgICAgaWYgKHRoaXMucmVzdGFydGVkKCkpCiAgICAgICAgICAgIHJldHVybjsKICAgICAgICAgIHRoaXMuaXRlciA9IGkgLSBzdGFydDsKICAgICAgICAgIHRoaXMudCA9IG9obGN2W2ldWzBdOwogICAgICAgICAgdGhpcy5zdGVwKG9obGN2W2ldKTsKICAgICAgICAgIHRoaXMuc2hhcmVkLm9uY2xvc2UgPSBpICE9PSBvaGxjdi5sZW5ndGggLSAxOwogICAgICAgICAgZm9yIChsZXQgbSA9IDA7IG0gPCBtZnMxLmxlbmd0aDsgbSsrKSB7CiAgICAgICAgICAgIG1mczFbbV0oc2VsKTsKICAgICAgICAgIH0KICAgICAgICAgIGZvciAoY29uc3QgaWQgb2Ygc2VsKQogICAgICAgICAgICB0aGlzLm1hcFtpZF0uZW52LnN0ZXAoKTsKICAgICAgICAgIGZvciAobGV0IG0gPSAwOyBtIDwgbWZzMi5sZW5ndGg7IG0rKykgewogICAgICAgICAgICBtZnMyW21dKHNlbCk7CiAgICAgICAgICB9CiAgICAgICAgICB0aGlzLmxpbWl0KCk7CiAgICAgICAgfQogICAgICAgIGZvciAoY29uc3QgaWQgb2Ygc2VsKSB7CiAgICAgICAgICB0aGlzLm1hcFtpZF0uZW52Lm91dHB1dC5wb3N0KCk7CiAgICAgICAgfQogICAgICB9IGNhdGNoIChlcnIpIHsKICAgICAgICBjb25zb2xlLmxvZyhlcnIpOwogICAgICB9CiAgICAgIHRoaXMucG9zdF9ydW5fbW9kcyhzZWwpOwogICAgICB0aGlzLnBlcmYgPSBVdGlscy5ub3coKSAtIHQxOwogICAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZTsKICAgICAgdGhpcy5zZW5kKCJvdmVybGF5LWRhdGEiLCB0aGlzLmZvcm1hdF9kYXRhKCkpOwogICAgfQogICAgc3RlcChkYXRhLCB1bnNoaWZ0ID0gdHJ1ZSkgewogICAgICBpZiAodW5zaGlmdCkgewogICAgICAgIHRoaXMub3Blbi51bnNoaWZ0KGRhdGFbMV0pOwogICAgICAgIHRoaXMuaGlnaC51bnNoaWZ0KGRhdGFbMl0pOwogICAgICAgIHRoaXMubG93LnVuc2hpZnQoZGF0YVszXSk7CiAgICAgICAgdGhpcy5jbG9zZS51bnNoaWZ0KGRhdGFbNF0pOwogICAgICAgIHRoaXMudm9sLnVuc2hpZnQoZGF0YVs1XSk7CiAgICAgICAgZm9yIChjb25zdCBpZCBpbiB0aGlzLnRzcykgewogICAgICAgICAgaWYgKHRoaXMudHNzW2lkXS5fX3RmX18pCiAgICAgICAgICAgIHRoaXMudHNzW2lkXS5fX2ZuX18oKTsKICAgICAgICAgIGVsc2UKICAgICAgICAgICAgdGhpcy50c3NbaWRdLnVuc2hpZnQodGhpcy50c3NbaWRdLl9fZm5fXygpKTsKICAgICAgICB9CiAgICAgIH0gZWxzZSB7CiAgICAgICAgdGhpcy5vcGVuWzBdID0gZGF0YVsxXTsKICAgICAgICB0aGlzLmhpZ2hbMF0gPSBkYXRhWzJdOwogICAgICAgIHRoaXMubG93WzBdID0gZGF0YVszXTsKICAgICAgICB0aGlzLmNsb3NlWzBdID0gZGF0YVs0XTsKICAgICAgICB0aGlzLnZvbFswXSA9IGRhdGFbNV07CiAgICAgICAgZm9yIChjb25zdCBpZCBpbiB0aGlzLnRzcykgewogICAgICAgICAgaWYgKHRoaXMudHNzW2lkXS5fX3RmX18pCiAgICAgICAgICAgIHRoaXMudHNzW2lkXS5fX2ZuX18oKTsKICAgICAgICAgIGVsc2UKICAgICAgICAgICAgdGhpcy50c3NbaWRdWzBdID0gdGhpcy50c3NbaWRdLl9fZm5fXygpOwogICAgICAgIH0KICAgICAgfQogICAgfQogICAgbGltaXQoKSB7CiAgICAgIHRoaXMub3Blbi5sZW5ndGggPSB0aGlzLm9wZW4uX19sZW5fXyB8fCBERUZfTElNSVQ7CiAgICAgIHRoaXMuaGlnaC5sZW5ndGggPSB0aGlzLmhpZ2guX19sZW5fXyB8fCBERUZfTElNSVQ7CiAgICAgIHRoaXMubG93Lmxlbmd0aCA9IHRoaXMubG93Ll9fbGVuX18gfHwgREVGX0xJTUlUOwogICAgICB0aGlzLmNsb3NlLmxlbmd0aCA9IHRoaXMuY2xvc2UuX19sZW5fXyB8fCBERUZfTElNSVQ7CiAgICAgIHRoaXMudm9sLmxlbmd0aCA9IHRoaXMudm9sLl9fbGVuX18gfHwgREVGX0xJTUlUOwogICAgfQogICAgc3RhcnQob2hsY3YpIHsKICAgICAgY29uc3QgZGVwdGggPSB0aGlzLnNldHQuc2NyaXB0X2RlcHRoOwogICAgICByZXR1cm4gZGVwdGggPyBNYXRoLm1heChvaGxjdi5sZW5ndGggLSBkZXB0aCwgMCkgOiAwOwogICAgfQogICAgZHJhaW5fcXVldWVzKCkgewogICAgICBpZiAodGhpcy5xdWV1ZS5sZW5ndGgpIHsKICAgICAgICB0aGlzLmV4ZWNfYWxsKCk7CiAgICAgIH0gZWxzZSBpZiAodGhpcy5kZWx0YV9xdWV1ZS5sZW5ndGgpIHsKICAgICAgICB0aGlzLmV4ZWNfc2VsKHRoaXMuZGVsdGFfcXVldWUucG9wKCkpOwogICAgICAgIHRoaXMuZGVsdGFfcXVldWUgPSBbXTsKICAgICAgfSBlbHNlIHsKICAgICAgICB3aGlsZSAodGhpcy51cGRhdGVfcXVldWUubGVuZ3RoKSB7CiAgICAgICAgICBjb25zdCB1cGQgPSB0aGlzLnVwZGF0ZV9xdWV1ZS5zaGlmdCgpOwogICAgICAgICAgdGhpcy51cGRhdGUoLi4udXBkKTsKICAgICAgICB9CiAgICAgIH0KICAgIH0KICAgIGZvcm1hdF9kYXRhKCkgewogICAgICByZXR1cm4gc2VsZi5wYW5lU3RydWN0Lm1hcCgoeCkgPT4gKHsKICAgICAgICBpZDogeC5pZCwKICAgICAgICB1dWlkOiB4LnV1aWQsCiAgICAgICAgb3ZlcmxheXM6IHRoaXMub3ZlcnJpZGVfb3ZlcmxheXMoeC5vdmVybGF5cyB8fCBbXSkKICAgICAgfSkpOwogICAgfQogICAgLy8gT3ZlcnJpZGUgb3ZlcmxheSBmaWVsZHMgd2l0aCAnc2NyaXB0Lm92ZXJsYXknCiAgICBvdmVycmlkZV9vdmVybGF5cyhvdnMpIHsKICAgICAgZm9yICh2YXIgb3Ygb2Ygb3ZzKSB7CiAgICAgICAgY29uc3QgcyA9IHRoaXMubWFwW292LnByb2RdOwogICAgICAgIGlmICghcykKICAgICAgICAgIGNvbnRpbnVlOwogICAgICAgIGlmIChzLm92ZXJsYXkpIHsKICAgICAgICAgIG92ID0gb3ZlcnJpZGVPdmVybGF5KG92LCBzLm92ZXJsYXkpOwogICAgICAgIH0KICAgICAgfQogICAgICByZXR1cm4gb3ZzOwogICAgfQogICAgZm9ybWF0X3VwZGF0ZSgpIHsKICAgICAgY29uc3QgbWFwID0ge307CiAgICAgIGZvciAodmFyIHBhbmUgb2Ygc2VsZi5wYW5lU3RydWN0KSB7CiAgICAgICAgZm9yICh2YXIgb3Ygb2YgcGFuZS5vdmVybGF5cyB8fCBbXSkgewogICAgICAgICAgbWFwW292LnV1aWRdID0gb3YuZGF0YVtvdi5kYXRhLmxlbmd0aCAtIDFdOwogICAgICAgIH0KICAgICAgfQogICAgICByZXR1cm4gbWFwOwogICAgfQogICAgcmVzdGFydGVkKCkgewogICAgICBpZiAodGhpcy5fcmVzdGFydCkgewogICAgICAgIHRoaXMuX3Jlc3RhcnQgPSBmYWxzZTsKICAgICAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZTsKICAgICAgICB0aGlzLnBlcmYgPSAwOwogICAgICAgIHJldHVybiB0cnVlOwogICAgICB9CiAgICAgIHJldHVybiBmYWxzZTsKICAgIH0KICAgIHJlbW92ZV9zY3JpcHRzKGlkcykgewogICAgICBmb3IgKHZhciBpZCBvZiBpZHMpCiAgICAgICAgZGVsZXRlIHRoaXMubWFwW2lkXTsKICAgICAgdGhpcy5zZW5kX3N0YXRlKCk7CiAgICB9CiAgICBwcmVfcnVuX21vZHMoc2VsKSB7CiAgICAgIGZvciAodmFyIGlkIGluIHRoaXMubW9kcykgewogICAgICAgIGlmICh0aGlzLm1vZHNbaWRdLnByZV9ydW4pIHsKICAgICAgICAgIHRoaXMubW9kc1tpZF0ucHJlX3J1bihzZWwpOwogICAgICAgIH0KICAgICAgfQogICAgfQogICAgcG9zdF9ydW5fbW9kcyhzZWwpIHsKICAgICAgZm9yICh2YXIgaWQgaW4gdGhpcy5tb2RzKSB7CiAgICAgICAgaWYgKHRoaXMubW9kc1tpZF0ucG9zdF9ydW4pIHsKICAgICAgICAgIHRoaXMubW9kc1tpZF0ucG9zdF9ydW4oc2VsKTsKICAgICAgICB9CiAgICAgIH0KICAgIH0KICAgIG1ha2VfbW9kc19ob29rcyhuYW1lKSB7CiAgICAgIGNvbnN0IGFyciA9IFtdOwogICAgICBmb3IgKHZhciBpZCBpbiB0aGlzLm1vZHMpIHsKICAgICAgICBpZiAodGhpcy5tb2RzW2lkXVtuYW1lXSkgewogICAgICAgICAgYXJyLnB1c2godGhpcy5tb2RzW2lkXVtuYW1lXS5iaW5kKHRoaXMubW9kc1tpZF0pKTsKICAgICAgICB9CiAgICAgIH0KICAgICAgcmV0dXJuIGFycjsKICAgIH0KICAgIC8vIENhbGN1bGF0ZSBkYXRhIHNpemUKICAgIHJlY2FsY19zaXplKCkgewogICAgICB3aGlsZSAodHJ1ZSkgewogICAgICAgIHZhciBzeiA9IHNpemVfb2ZfZHNzKHRoaXMuZGF0YSkgLyAoMTAyNCAqIDEwMjQpOwogICAgICAgIGNvbnN0IGxpbSA9IHRoaXMuc2V0dC53d19yYW1fbGltaXQ7CiAgICAgICAgaWYgKGxpbSAmJiBzeiA+IGxpbSkgewogICAgICAgICAgdGhpcy5saW1pdF9zaXplKCk7CiAgICAgICAgfSBlbHNlCiAgICAgICAgICBicmVhazsKICAgICAgfQogICAgICB0aGlzLmRhdGFfc2l6ZSA9ICtzei50b0ZpeGVkKDIpOwogICAgICB0aGlzLnNlbmRfc3RhdGUoKTsKICAgIH0KICAgIC8vIExpbWl0IGRhdGEgc2l6ZSBieSB0aHJvd2luZyBvdXQgdGhlIGxlYXN0CiAgICAvLyBhY3RpdmUgZGF0YXNldHMgKG1lYXN1cmVkIGJ5ICdsYXN0X3VwZCcpCiAgICBsaW1pdF9zaXplKCkgewogICAgICBjb25zdCBkc3MgPSBPYmplY3QudmFsdWVzKHRoaXMuZGF0YSkubWFwKCh4KSA9PiAoewogICAgICAgIGlkOiB4LmlkLAogICAgICAgIHQ6IHgubGFzdF91cGQKICAgICAgfSkpOwogICAgICBkc3Muc29ydCgoYSwgYikgPT4gYS50IC0gYi50KTsKICAgICAgaWYgKGRzcy5sZW5ndGgpIHsKICAgICAgICBkZWxldGUgdGhpcy5kYXRhW2Rzc1swXS5pZF07CiAgICAgIH0KICAgIH0KICB9CiAgdmFyIHNlID0gbmV3IFNjcmlwdEVuZ2luZSgpOwogIGNsYXNzIERhdGFzZXRXVyB7CiAgICBjb25zdHJ1Y3RvcihpZCwgZGF0YSkgewogICAgICB0aGlzLmxhc3RfdXBkID0gbm93KCk7CiAgICAgIHRoaXMuaWQgPSBpZDsKICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHsKICAgICAgICB0aGlzLmRhdGEgPSBkYXRhOwogICAgICAgIGlmIChpZCA9PT0gIm9obGN2IikKICAgICAgICAgIHRoaXMudHlwZSA9ICJPSExDViI7CiAgICAgIH0gZWxzZSB7CiAgICAgICAgdGhpcy5kYXRhID0gZGF0YS5kYXRhOwogICAgICAgIHRoaXMudHlwZSA9IGRhdGEudHlwZTsKICAgICAgfQogICAgfQogICAgLy8gVXBkYXRlIGZyb20gJ3VwZGF0ZS1kYXRhJyBldmVudAogICAgLy8gVE9ETzogZHMgc2l6ZSBsaW1pdCAoaW4gTUIgLyBkYXRhIHBvaW50cykKICAgIHN0YXRpYyB1cGRhdGVfYWxsKHNlMiwgZGF0YSkgewogICAgICBmb3IgKHZhciBrIGluIGRhdGEpIHsKICAgICAgICBpZiAoayA9PT0gIm9obGN2IikKICAgICAgICAgIGNvbnRpbnVlOwogICAgICAgIGNvbnN0IGlkID0gay5zcGxpdCgiLiIpWzFdIHx8IGs7CiAgICAgICAgaWYgKCFzZTIuZGF0YVtpZF0pCiAgICAgICAgICBjb250aW51ZTsKICAgICAgICBjb25zdCBhcnIgPSBzZTIuZGF0YVtpZF0uZGF0YTsKICAgICAgICBjb25zdCBpTiA9IGFyci5sZW5ndGggLSAxOwogICAgICAgIGNvbnN0IGxhc3QgPSBhcnJbaU5dOwogICAgICAgIGZvciAodmFyIGRwIG9mIGRhdGFba10pIHsKICAgICAgICAgIGlmICghbGFzdCB8fCBkcFswXSA+IGxhc3RbMF0pIHsKICAgICAgICAgICAgYXJyLnB1c2goZHApOwogICAgICAgICAgfQogICAgICAgIH0KICAgICAgICBzZTIuZGF0YVtpZF0ubGFzdF91cGQgPSBub3coKTsKICAgICAgfQogICAgfQogICAgbWVyZ2UoZGF0YSkgewogICAgICBjb25zdCBsZW4gPSB0aGlzLmRhdGEubGVuZ3RoOwogICAgICBpZiAoIWxlbikgewogICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7CiAgICAgICAgcmV0dXJuOwogICAgICB9CiAgICAgIGNvbnN0IHQwID0gdGhpcy5kYXRhWzBdWzBdOwogICAgICBjb25zdCB0TiA9IHRoaXMuZGF0YVtsZW4gLSAxXVswXTsKICAgICAgY29uc3QgbCA9IGRhdGEuZmlsdGVyKCh4KSA9PiB4WzBdIDwgdDApOwogICAgICBjb25zdCByID0gZGF0YS5maWx0ZXIoKHgpID0+IHhbMF0gPiB0Tik7CiAgICAgIHRoaXMuZGF0YSA9IGwuY29uY2F0KHRoaXMuZGF0YSwgcik7CiAgICB9CiAgICAvLyBPbiBkYXRhc2V0IG9wZXJhdGlvbgogICAgb3Aoc2UyLCBvcCkgewogICAgICB0aGlzLmxhc3RfdXBkID0gbm93KCk7CiAgICAgIHN3aXRjaCAob3AudHlwZSkgewogICAgICAgIGNhc2UgInNldCI6CiAgICAgICAgICB0aGlzLmRhdGEgPSBvcC5kYXRhOwogICAgICAgICAgc2UyLnJlY2FsY19zaXplKCk7CiAgICAgICAgICBicmVhazsKICAgICAgICBjYXNlICJkZWwiOgogICAgICAgICAgZGVsZXRlIHNlMi5kYXRhW3RoaXMuaWRdOwogICAgICAgICAgc2UyLnJlY2FsY19zaXplKCk7CiAgICAgICAgICBicmVhazsKICAgICAgICBjYXNlICJtcmciOgogICAgICAgICAgdGhpcy5tZXJnZShvcC5kYXRhKTsKICAgICAgICAgIHNlMi5yZWNhbGNfc2l6ZSgpOwogICAgICAgICAgYnJlYWs7CiAgICAgIH0KICAgIH0KICB9CiAgc2VsZi5zY3JpcHRMaWIgPSB7fTsKICBzZWxmLnBhbmVTdHJ1Y3QgPSB7fTsKICBzZWxmLm9ubWVzc2FnZSA9IGFzeW5jIChlKSA9PiB7CiAgICBzd2l0Y2ggKGUuZGF0YS50eXBlKSB7CiAgICAgIGNhc2UgInVwbG9hZC1zY3JpcHRzIjoKICAgICAgICBzZWxmLnNjcmlwdExpYiA9IGUuZGF0YS5kYXRhOwogICAgICAgIGJyZWFrOwogICAgICBjYXNlICJzZW5kLW1ldGEtaW5mbyI6CiAgICAgICAgc2UudGYgPSB0Zl9mcm9tX3N0cihlLmRhdGEuZGF0YS50Zik7CiAgICAgICAgc2UucmFuZ2UgPSBlLmRhdGEuZGF0YS5yYW5nZTsKICAgICAgICBicmVhazsKICAgICAgY2FzZSAidXBsb2FkLWRhdGEiOgogICAgICAgIHNlLnRmID0gdGZfZnJvbV9zdHIoZS5kYXRhLmRhdGEubWV0YS50Zik7CiAgICAgICAgc2UucmFuZ2UgPSBlLmRhdGEuZGF0YS5tZXRhLnJhbmdlOwogICAgICAgIGZvciAodmFyIGlkIGluIGUuZGF0YS5kYXRhLmRzcykgewogICAgICAgICAgY29uc3QgZGF0YSA9IGUuZGF0YS5kYXRhLmRzc1tpZF07CiAgICAgICAgICBzZS5kYXRhW2lkXSA9IG5ldyBEYXRhc2V0V1coaWQsIGRhdGEpOwogICAgICAgIH0KICAgICAgICBzZS5yZWNhbGNfc2l6ZSgpOwogICAgICAgIHNlLnNlbmQoImRhdGEtdXBsb2FkZWQiLCB7fSwgZS5kYXRhLmlkKTsKICAgICAgICBicmVhazsKICAgICAgY2FzZSAiZXhlYy1hbGwtc2NyaXB0cyI6CiAgICAgICAgc2VsZi5wYW5lU3RydWN0ID0gZS5kYXRhLmRhdGE7CiAgICAgICAgc2UuZXhlY19hbGwoKTsKICAgICAgICBicmVhazsKICAgICAgY2FzZSAidXBkYXRlLWRhdGEiOgogICAgICAgIERhdGFzZXRXVy51cGRhdGVfYWxsKHNlLCBlLmRhdGEuZGF0YSk7CiAgICAgICAgaWYgKGUuZGF0YS5kYXRhLm9obGN2KSB7CiAgICAgICAgICBzZS51cGRhdGUoZS5kYXRhLmRhdGEub2hsY3YsIGUpOwogICAgICAgIH0KICAgICAgICBicmVhazsKICAgIH0KICB9OwogIHNlLnNlbmQgPSAodHlwZSwgZGF0YSwgaWQpID0+IHsKICAgIGlkID0gaWQgIT0gbnVsbCA/IGlkIDogVXRpbHMudXVpZCgpOwogICAgc3dpdGNoICh0eXBlKSB7CiAgICAgIGNhc2UgImRhdGEtdXBsb2FkZWQiOgogICAgICBjYXNlICJvdmVybGF5LWRhdGEiOgogICAgICBjYXNlICJvdmVybGF5LXVwZGF0ZSI6CiAgICAgIGNhc2UgImVuZ2luZS1zdGF0ZSI6CiAgICAgIGNhc2UgIm1vZGlmeS1vdmVybGF5IjoKICAgICAgY2FzZSAibW9kdWxlLWRhdGEiOgogICAgICBjYXNlICJzY3JpcHQtc2lnbmFsIjoKICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKHsKICAgICAgICAgIHR5cGUsCiAgICAgICAgICBkYXRhLAogICAgICAgICAgaWQKICAgICAgICB9KTsKICAgICAgICBicmVhazsKICAgIH0KICB9Owp9KSgpOwo=";
  const blob = typeof window !== "undefined" && window.Blob && new Blob([atob(encodedJs)], { type: "text/javascript;charset=utf-8" });
  function WorkerWrapper() {
    let objURL;
    try {
      objURL = blob && (window.URL || window.webkitURL).createObjectURL(blob);
      if (!objURL)
        throw "";
      return new Worker(objURL);
    } catch (e) {
      return new Worker("data:application/javascript;base64," + encodedJs);
    } finally {
      objURL && (window.URL || window.webkitURL).revokeObjectURL(objURL);
    }
  }
  class WebWork {
    constructor(id, chart) {
      this.chart = chart;
      this.tasks = {};
      this.onevent = () => {
      };
      this.start();
    }
    start() {
      if (this.worker)
        this.worker.terminate();
      this.worker = new WorkerWrapper();
      this.worker.onmessage = (e) => this.onmessage(e);
    }
    // TODO: Do we need this ???
    startSocket() {
    }
    send(msg, txKeys) {
      if (txKeys) {
        const txObjs = txKeys.map((k) => msg.data[k]);
        this.worker.postMessage(msg, txObjs);
      } else {
        this.worker.postMessage(msg);
      }
    }
    // Send to node.js via websocket
    sendToNode(msg, txKeys) {
    }
    onmessage(e) {
      if (e.data.id in this.tasks) {
        this.tasks[e.data.id](e.data.data);
        delete this.tasks[e.data.id];
      } else {
        this.onevent(e);
      }
    }
    // Execute a task
    async exec(type, data, txKeys) {
      return new Promise((rs, rj) => {
        const id = Utils.uuid();
        this.send({ type, id, data }, txKeys);
        this.tasks[id] = (res) => {
          rs(res);
        };
      });
    }
    // Execute a task, but just fucking do it,
    // do not wait for the result
    just(type, data, txKeys) {
      const id = Utils.uuid();
      this.send({ type, id, data }, txKeys);
    }
    // Relay an event from iframe postMessage
    // (for the future)
    async relay(event, just = false) {
      return new Promise((rs, rj) => {
        this.send(event, event.txKeys);
        if (!just) {
          this.tasks[event.id] = (res) => {
            rs(res);
          };
        }
      });
    }
    stop() {
      if (this.worker)
        this.worker.terminate();
    }
  }
  const instances$1 = {};
  function instance$e(id, chart) {
    if (!instances$1[id]) {
      instances$1[id] = new WebWork(id, chart);
    }
    return instances$1[id];
  }
  const WebWork$1 = { instance: instance$e };
  const Overlays = /* @__PURE__ */ Object.assign({
    "../scripts/AppleArea.navy": __vite_glob_0_0,
    "../scripts/ArrowTrades.navy": __vite_glob_0_1,
    "../scripts/Band.navy": __vite_glob_0_2,
    "../scripts/CandlesPlus.navy": __vite_glob_0_3,
    "../scripts/Cloud.navy": __vite_glob_0_4,
    "../scripts/Histogram.navy": __vite_glob_0_5,
    "../scripts/PriceLabels.navy": __vite_glob_0_6,
    "../scripts/Range.navy": __vite_glob_0_7,
    "../scripts/Sparse.navy": __vite_glob_0_8,
    "../scripts/Splines.navy": __vite_glob_0_9,
    "../scripts/SuperBands.navy": __vite_glob_0_10,
    "../scripts/Trades.navy": __vite_glob_0_11,
    "../scripts/Volume.navy": __vite_glob_0_12,
    "../scripts/VolumeDelta.navy": __vite_glob_0_13,
    "../scripts/area.navy": __vite_glob_0_14,
    "../scripts/candles.navy": __vite_glob_0_15,
    "../scripts/spline.navy": __vite_glob_0_16
  });
  const Tools = /* @__PURE__ */ Object.assign({
    "../scripts/tools/LineTool.navy": __vite_glob_1_0,
    "../scripts/tools/RangeTool.navy": __vite_glob_1_1
  });
  const Indicators = /* @__PURE__ */ Object.assign({
    "../scripts/indicators/ALMA.navy": __vite_glob_2_0,
    "../scripts/indicators/ATR.navy": __vite_glob_2_1,
    "../scripts/indicators/ATRp.navy": __vite_glob_2_2,
    "../scripts/indicators/BB.navy": __vite_glob_2_3,
    "../scripts/indicators/BBW.navy": __vite_glob_2_4,
    "../scripts/indicators/CCI.navy": __vite_glob_2_5,
    "../scripts/indicators/CMO.navy": __vite_glob_2_6,
    "../scripts/indicators/COG.navy": __vite_glob_2_7,
    "../scripts/indicators/DMI.navy": __vite_glob_2_8,
    "../scripts/indicators/EMA.navy": __vite_glob_2_9,
    "../scripts/indicators/HMA.navy": __vite_glob_2_10,
    "../scripts/indicators/Ichimoku.navy": __vite_glob_2_11,
    "../scripts/indicators/KC.navy": __vite_glob_2_12,
    "../scripts/indicators/KCW.navy": __vite_glob_2_13,
    "../scripts/indicators/MACD.navy": __vite_glob_2_14,
    "../scripts/indicators/MFI.navy": __vite_glob_2_15,
    "../scripts/indicators/MOM.navy": __vite_glob_2_16,
    "../scripts/indicators/ROC.navy": __vite_glob_2_17,
    "../scripts/indicators/RSI.navy": __vite_glob_2_18,
    "../scripts/indicators/Ribbon.navy": __vite_glob_2_19,
    "../scripts/indicators/SAR.navy": __vite_glob_2_20,
    "../scripts/indicators/SMA.navy": __vite_glob_2_21,
    "../scripts/indicators/SWMA.navy": __vite_glob_2_22,
    "../scripts/indicators/Stoch.navy": __vite_glob_2_23,
    "../scripts/indicators/TSI.navy": __vite_glob_2_24,
    "../scripts/indicators/VWMA.navy": __vite_glob_2_25,
    "../scripts/indicators/WilliamsR.navy": __vite_glob_2_26
  });
  class Scripts {
    constructor(id) {
      this.ww = WebWork$1.instance(id);
    }
    async init(srcs) {
      this.srcLib = Object.values(Overlays).map((x) => x.default);
      this.srcLib.push(...Object.values(Tools).map((x) => x.default));
      this.srcLib.push(...Object.values(Indicators).map((x) => x.default));
      this.srcLib.push(...srcs);
      this.prefabs = {};
      this.iScripts = {};
      this.parse();
      this.ww.exec("upload-scripts", {
        // Removing make() functions
        prefabs: Object.keys(this.prefabs).reduce((a, k) => {
          a[k] = {
            name: this.prefabs[k].name,
            author: this.prefabs[k].author,
            version: this.prefabs[k].version
          };
          return a;
        }, {}),
        iScripts: this.iScripts
      });
    }
    parse() {
      this.prefabs = {};
      for (var s of this.srcLib) {
        const parser = new Parser(s);
        for (var ov of parser.overlays) {
          this.prefabs[ov.tagProps.name] = {
            name: ov.tagProps.name,
            author: ov.tagProps.author,
            version: ov.tagProps.version,
            ctx: ov.tagProps.ctx || "Canvas",
            make: ov.prefab,
            static: ov.static
          };
        }
        for (var ind of parser.indicators) {
          this.iScripts[ind.tagProps.name] = {
            name: ind.tagProps.name,
            author: ind.tagProps.author,
            version: ind.tagProps.version,
            code: {
              init: ind.init,
              update: ind.update,
              post: ind.post
            }
          };
        }
      }
    }
  }
  const instances = {};
  function instance$d(id) {
    if (!instances[id]) {
      instances[id] = new Scripts(id);
    }
    return instances[id];
  }
  const Scripts$1 = { instance: instance$d };
  const { $SCALES: $SCALES$1 } = Const;
  const MAX_INT = Number.MAX_SAFE_INTEGER;
  function Scale(id, src, specs) {
    const { hub, props, settings, height } = specs;
    const { ctx } = props;
    const meta = MetaHub$1.instance(props.id);
    const prefabs = Scripts$1.instance(props.id).prefabs;
    const self2 = {};
    const yt = (meta.yTransforms[src.gridId] || [])[id];
    const gridId = src.gridId;
    const ovs = src.ovs;
    const ls = src.log;
    const SAMPLE = props.config.AUTO_PRE_SAMPLE;
    function calcSidebar() {
      const maxlen = Math.max(...ovs.map((x) => x.dataSubset.length));
      if (maxlen < 2) {
        self2.prec = 0;
        self2.sb = props.config.SBMIN;
        return;
      }
      if (src.precision !== void 0) {
        self2.prec = src.precision;
      } else {
        self2.prec = 0;
        for (const ov of ovs) {
          let prec;
          if (ov.settings.precision !== void 0) {
            prec = ov.settings.precision;
          } else {
            prec = calcPrecision(ov);
          }
          if (prec > self2.prec)
            self2.prec = prec;
        }
      }
      if (!isFinite(self2.$hi) || !isFinite(self2.$lo)) {
        self2.sb = props.config.SBMIN;
        return;
      }
      const lens = [];
      lens.push(self2.$hi.toFixed(self2.prec).length);
      lens.push(self2.$lo.toFixed(self2.prec).length);
      const str = "0".repeat(Math.max(...lens)) + "    ";
      self2.sb = ctx.measureText(str).width;
      self2.sb = Math.max(Math.floor(self2.sb), props.config.SBMIN);
      self2.sb = Math.min(self2.sb, props.config.SBMAX);
    }
    function calc$Range() {
      let hi = -Infinity, lo = Infinity;
      let exp;
      for (const ov of ovs) {
        if (ov.settings.display === false)
          continue;
        let yfn = (meta.yRangeFns[gridId] || [])[ov.id];
        const yfnStatic = prefabs[ov.type].static.yRange;
        if (yfnStatic) {
          yfn = {
            exec: yfnStatic,
            preCalc: yfnStatic.length > 1
            // Do we need h & l
          };
        }
        const data = ov.dataSubset;
        let h = -Infinity, l = Infinity;
        if (!yfn || yfn && yfn.preCalc) {
          for (let i = 0; i < data.length; i++) {
            for (let j = 1; j < data[i].length; j++) {
              const v = data[i][j];
              if (v > h)
                h = v;
              if (v < l)
                l = v;
            }
          }
        }
        if (yfn) {
          var yfnResult = yfn.exec(data, h, l);
          if (yfnResult) {
            [h, l, exp] = yfnResult;
          } else {
            [h, l] = [hi, lo];
          }
        }
        if (h > hi)
          hi = h;
        if (l < lo)
          lo = l;
      }
      if (yt && !yt.auto && yt.range) {
        self2.$hi = yt.range[0];
        self2.$lo = yt.range[1];
      } else {
        if (!ls) {
          exp = exp === false ? 0 : 1;
          self2.$hi = hi + (hi - lo) * props.config.EXPAND * exp;
          self2.$lo = lo - (hi - lo) * props.config.EXPAND * exp;
        } else {
          self2.$hi = hi;
          self2.$lo = lo;
          logScale.expand(self2, height);
        }
        if (self2.$hi === self2.$lo) {
          if (!ls) {
            self2.$hi *= 1.05;
            self2.$lo *= 0.95;
          } else {
            logScale.expand(self2, height);
          }
        }
      }
    }
    function calcPrecision(ov) {
      let maxR = 0;
      let sample = [];
      let f = meta.getPreSampler(gridId, ov.id);
      f = f || prefabs[ov.type].static.preSampler;
      f = f || Utils.defaultPreSampler;
      for (var i = 0; i < SAMPLE; i++) {
        const n = Math.floor(Math.random() * ov.dataSubset.length);
        const x = f(ov.dataSubset[n]);
        if (typeof x === "number")
          sample.push(x);
        else
          sample = sample.concat(x);
      }
      sample.forEach((x) => {
        const right = Utils.numberLR(x)[1];
        if (right > maxR)
          maxR = right;
      });
      const aprec = meta.getAutoPrec(gridId, ov.id);
      if (aprec === void 0 || maxR > aprec) {
        meta.setAutoPrec(gridId, ov.id, maxR);
        return maxR;
      }
      return aprec;
    }
    function calcTransform() {
      if (!ls) {
        self2.A = -height / (self2.$hi - self2.$lo);
        self2.B = -self2.$hi * self2.A;
      } else {
        self2.A = -height / (math.log(self2.$hi) - math.log(self2.$lo));
        self2.B = -math.log(self2.$hi) * self2.A;
      }
    }
    function dollarStep() {
      const yrange = self2.$hi - self2.$lo;
      const m = yrange * (props.config.GRIDY / height);
      const p = parseInt(yrange.toExponential().split("e")[1]);
      const d = Math.pow(10, p);
      const s = $SCALES$1.map((x) => x * d);
      return Utils.strip(Utils.nearestA(m, s)[1]);
    }
    function dollarMult() {
      const mult_hi = dollarMultHi();
      const mult_lo = dollarMultLo();
      return Math.max(mult_hi, mult_lo);
    }
    function dollarMultHi() {
      const h = Math.min(self2.B, height);
      if (h < props.config.GRIDY)
        return 1;
      const n = h / props.config.GRIDY;
      const yrange = self2.$hi;
      if (self2.$lo > 0) {
        var yratio = self2.$hi / self2.$lo;
      } else {
        yratio = self2.$hi / 1;
      }
      yrange * (props.config.GRIDY / h);
      parseInt(yrange.toExponential().split("e")[1]);
      return Math.pow(yratio, 1 / n);
    }
    function dollarMultLo() {
      const h = Math.min(height - self2.B, height);
      if (h < props.config.GRIDY)
        return 1;
      const n = h / props.config.GRIDY;
      const yrange = Math.abs(self2.$lo);
      if (self2.$hi < 0 && self2.$lo < 0) {
        var yratio = Math.abs(self2.$lo / self2.$hi);
      } else {
        yratio = Math.abs(self2.$lo) / 1;
      }
      yrange * (props.config.GRIDY / h);
      parseInt(yrange.toExponential().split("e")[1]);
      return Math.pow(yratio, 1 / n);
    }
    function gridY() {
      const m = Math.pow(10, -self2.prec);
      self2.$step = Math.max(m, dollarStep());
      self2.ys = [];
      const y1 = self2.$lo - self2.$lo % self2.$step;
      for (var y$ = y1; y$ <= self2.$hi; y$ += self2.$step) {
        const y = Math.floor(y$ * self2.A + self2.B);
        if (y > height)
          continue;
        self2.ys.push([y, Utils.strip(y$)]);
      }
    }
    function gridYLog() {
      self2.$_mult = dollarMult();
      self2.ys = [];
      const v = (self2.$hi + self2.$lo) / 2;
      const y1 = searchStartPos(v);
      const y2 = searchStartNeg(-v);
      let yp = -Infinity;
      const n = height / props.config.GRIDY;
      const q = 1 + (self2.$_mult - 1) / 2;
      for (let y$ = y1; y$ > 0; y$ /= self2.$_mult) {
        y$ = logRounder(y$, q);
        const y = Math.floor(math.log(y$) * self2.A + self2.B);
        self2.ys.push([y, Utils.strip(y$)]);
        if (y > height)
          break;
        if (y - yp < props.config.GRIDY * 0.7)
          break;
        if (self2.ys.length > n + 1)
          break;
        yp = y;
      }
      yp = Infinity;
      for (let y$ = y2; y$ < 0; y$ /= self2.$_mult) {
        y$ = logRounder(y$, q);
        const y = Math.floor(math.log(y$) * self2.A + self2.B);
        if (yp - y < props.config.GRIDY * 0.7)
          break;
        self2.ys.push([y, Utils.strip(y$)]);
        if (y < 0)
          break;
        if (self2.ys.length > n * 3 + 1)
          break;
        yp = y;
      }
    }
    function searchStartPos(value) {
      const N = height / props.config.GRIDY;
      var y = Infinity, y$ = value, count = 0;
      while (y > 0) {
        y = Math.floor(math.log(y$) * self2.A + self2.B);
        y$ *= self2.$_mult;
        if (count++ > N * 3)
          return 0;
      }
      return y$;
    }
    function searchStartNeg(value) {
      const N = height / props.config.GRIDY;
      var y = -Infinity, y$ = value, count = 0;
      while (y < height) {
        y = Math.floor(math.log(y$) * self2.A + self2.B);
        y$ *= self2.$_mult;
        if (count++ > N * 3)
          break;
      }
      return y$;
    }
    function logRounder(x, quality) {
      const s = Math.sign(x);
      x = Math.abs(x);
      if (x > 10) {
        for (var div = 10; div < MAX_INT; div *= 10) {
          const nice = Math.floor(x / div) * div;
          if (x / nice > quality) {
            break;
          }
        }
        div /= 10;
        return s * Math.floor(x / div) * div;
      } else if (x < 1) {
        for (var ro = 10; ro >= 1; ro--) {
          const nice = Utils.round(x, ro);
          if (x / nice > quality) {
            break;
          }
        }
        return s * Utils.round(x, ro + 1);
      } else {
        return s * Math.floor(x);
      }
    }
    calc$Range();
    calcSidebar();
    calcTransform();
    ls ? gridYLog() : gridY();
    self2.scaleSpecs = {
      id,
      log: src.log,
      ovIdxs: src.ovIdxs
    };
    self2.height = height;
    return self2;
  }
  const { TIMESCALES, $SCALES, WEEK: WEEK$1, MONTH: MONTH$1, YEAR: YEAR$1, HOUR: HOUR$1, DAY: DAY$1 } = Const;
  function GridMaker(id, specs, mainGrid = null) {
    const { hub, meta, props, settings, height } = specs;
    const { interval, timeFrame, range, ctx, timezone } = props;
    const ls = !!settings.logScale;
    const ovs = hub.panes()[id].overlays;
    const data = hub.mainOv.dataSubset;
    const view = hub.mainOv.dataView;
    const self2 = { indexBased: hub.indexBased };
    function scaleSplit() {
      const scales = unpackScales();
      for (var i = 0; i < ovs.length; i++) {
        const ov = ovs[i];
        const id2 = ov.settings.scale || "A";
        if (!scales[id2]) {
          scales[id2] = defineNewScale(id2);
        }
        scales[id2].ovs.push(ov);
        scales[id2].ovIdxs.push(i);
      }
      return Object.values(scales);
    }
    function unpackScales() {
      const out = {
        "A": defineNewScale("A")
      };
      for (var scaleId in settings.scales || {}) {
        const proto = settings.scales[scaleId];
        out[scaleId] = defineNewScale(scaleId, proto);
      }
      return out;
    }
    function defineNewScale(scaleId, proto = {}) {
      var _a;
      return {
        id: scaleId,
        gridId: id,
        ovs: [],
        ovIdxs: [],
        log: (_a = proto.log) != null ? _a : ls,
        precision: proto.precision
      };
    }
    function calcPositions() {
      if (data.length < 2)
        return;
      const dt = range[1] - range[0];
      self2.spacex = props.width - self2.sbMax[0] - self2.sbMax[1];
      const capacity = dt / interval;
      self2.pxStep = self2.spacex / capacity;
      const r = self2.spacex / dt;
      self2.startx = (data[0][0] - range[0]) * r;
    }
    function timeStep() {
      const k = self2.indexBased ? timeFrame : 1;
      const xrange = (range[1] - range[0]) * k;
      const m = xrange * (props.config.GRIDX / props.width);
      const s = TIMESCALES;
      return Utils.nearestA(m, s)[1];
    }
    function gridX() {
      if (!mainGrid) {
        calcPositions();
        self2.tStep = timeStep();
        self2.xs = [];
        const dt = range[1] - range[0];
        const r = self2.spacex / dt;
        let realDt = Utils.realTimeRange(data);
        if (!self2.indexBased)
          realDt = dt;
        if (self2.indexBased && range[1] - view.src.length > 0) {
          const k = 1 - (range[1] - view.src.length) / dt;
          realDt /= k;
        }
        const fixOffset = realDt / DAY$1 > 10;
        const fixOffset2 = realDt / MONTH$1 > 10;
        let i0 = view.i1;
        if (fixOffset2) {
          i0 = findYearStart(view.i1);
        } else if (fixOffset) {
          i0 = findMonthStart(view.i1);
        }
        for (var i = i0, n = view.i2; i <= n; i++) {
          const p = view.src[i];
          const prev = view.src[i - 1] || [];
          const prev_xs = self2.xs[self2.xs.length - 1] || [0, []];
          const ti = self2.indexBased ? i : p[0];
          const x = Math.floor((ti - range[0]) * r);
          insertLine(prev, p, x);
          const xs = self2.xs[self2.xs.length - 1] || [0, []];
          if (prev_xs === xs)
            continue;
          if (xs[1] - prev_xs[1] < self2.tStep * 0.8) {
            if (xs[2] * xs[3] <= prev_xs[2] * prev_xs[3]) {
              self2.xs.pop();
            } else {
              self2.xs.splice(self2.xs.length - 2, 1);
            }
          }
        }
        if (!self2.indexBased && timeFrame < WEEK$1 && r > 0) {
          extendLeft(dt, r);
          extendRight(dt, r);
        }
      } else {
        self2.tStep = mainGrid.tStep;
        self2.pxStep = mainGrid.pxStep;
        self2.startx = mainGrid.startx;
        self2.spacex = mainGrid.spacex;
        self2.xs = mainGrid.xs;
      }
    }
    function findMonthStart(i1) {
      const m0 = Utils.getMonth(view.src[i1][0]);
      for (var i = i1 - 1; i >= 0; i--) {
        const mi = Utils.getMonth(view.src[i][0]);
        if (mi !== m0)
          return i;
      }
      return 0;
    }
    function findYearStart(i1) {
      const y0 = Utils.getYear(view.src[i1][0]);
      for (var i = i1 - 1; i >= 0; i--) {
        const yi = Utils.getYear(view.src[i][0]);
        if (yi !== y0)
          return i;
      }
      return 0;
    }
    function insertLine(prev, p, x, m0) {
      const prevT = prev[0];
      const t = p[0];
      if ((prev[0] || timeFrame === YEAR$1) && Utils.getYear(t) !== Utils.getYear(prevT)) {
        self2.xs.push([x, t, YEAR$1, 1]);
      } else if (prev[0] && Utils.getMonth(t) !== Utils.getMonth(prevT)) {
        self2.xs.push([x, t, MONTH$1, 1]);
      } else if (Utils.dayStart(t) === t) {
        const r2 = Utils.getDay(t) === 13 ? 0 : 0.9;
        self2.xs.push([x, t, DAY$1, r2]);
      } else if (t % self2.tStep === 0) {
        self2.xs.push([x, t, timeFrame, 1]);
      }
    }
    function extendLeft(dt, r) {
      if (!self2.xs.length || !isFinite(r))
        return;
      let t = self2.xs[0][1];
      while (true) {
        t -= self2.tStep;
        const x = Math.floor((t - range[0]) * r);
        if (x < 0)
          break;
        if (t % timeFrame === 0) {
          self2.xs.unshift([x, t, timeFrame, 1]);
        }
      }
    }
    function extendRight(dt, r) {
      if (!self2.xs.length || !isFinite(r))
        return;
      let t = self2.xs[self2.xs.length - 1][1];
      while (true) {
        t += self2.tStep;
        const x = Math.floor((t - range[0]) * r);
        if (x > self2.spacex)
          break;
        if (t % interval === 0) {
          self2.xs.push([x, t, interval, 1]);
        }
      }
    }
    function applySizes() {
      self2.width = props.width - self2.sbMax[0] - self2.sbMax[1];
      self2.height = height;
    }
    function makeScales() {
      const scales = {};
      for (var src of scaleSplit()) {
        const scale = new Scale(src.id, src, specs);
        scales[src.id] = scale;
      }
      self2.scales = scales;
    }
    function selectSidebars() {
      if (!self2.scales[settings.scaleIndex]) {
        settings.scaleIndex = "A";
      }
      self2.scaleIndex = settings.scaleIndex;
      if (!settings.scaleTemplate) {
        settings.scaleTemplate = [[], Object.keys(self2.scales)];
      }
      const sides = settings.scaleTemplate;
      if (!sides[0] || !sides[1]) {
        console.error("Define scaleTemplate as [[],[]]");
      }
      if (!settings.scaleSideIdxs) {
        settings.scaleSideIdxs = [];
      }
      const idxs = settings.scaleSideIdxs;
      Utils.autoScaleSideId(0, sides, idxs);
      Utils.autoScaleSideId(1, sides, idxs);
      self2.sb = [];
      const lid = sides[0].includes(idxs[0]) ? idxs[0] : null;
      self2.sb.push(self2.scales[lid] ? self2.scales[lid].sb : 0);
      const rid = sides[1].includes(idxs[1]) ? idxs[1] : null;
      self2.sb.push(self2.scales[rid] ? self2.scales[rid].sb : 0);
    }
    function mergeScale() {
      const sb2 = self2.sb;
      Object.assign(self2, self2.scales[self2.scaleIndex]);
      self2.sb = sb2;
      self2.ys = self2.ys || [];
    }
    makeScales();
    selectSidebars();
    return {
      // First we need to calculate max sidebar width
      // (among all grids). Then we can actually make
      // them
      create: () => {
        gridX();
        applySizes();
        if (mainGrid) {
          self2.mainGrid = mainGrid;
        }
        self2.settings = settings;
        self2.main = !mainGrid;
        self2.id = id;
        mergeScale();
        self2.ohlc = meta.ohlc.bind(meta);
        return layoutFn(self2, range);
      },
      getLayout: () => self2,
      setMaxSidebar: (v) => self2.sbMax = v,
      getSidebar: () => self2.sb,
      id: () => id
    };
  }
  function Layout(props, hub, meta) {
    const chart = hub.chart;
    const offchart = hub.offchart;
    const panes = hub.panes().filter((x) => x.settings);
    if (!chart)
      return {};
    function gridHs() {
      const height = props.height - props.config.BOTBAR;
      if (panes.find((x) => x.settings.height)) {
        return weightedHs(height);
      }
      const n = offchart.length;
      const off_h = 2 * Math.sqrt(n) / 7 / (n || 1);
      const px = Math.floor(height * off_h);
      const m = height - px * n;
      const hs2 = Array(n + 1).fill(px);
      hs2[hub.mainPaneId] = m;
      return hs2;
    }
    function weightedHs(height) {
      let hs2 = hub.panes().map((x) => {
        var _a;
        return (_a = x.settings.height) != null ? _a : 1;
      });
      let sum = hs2.reduce((a, b) => a + b, 0);
      hs2 = hs2.map((x) => Math.floor(x / sum * height));
      sum = hs2.reduce((a, b) => a + b, 0);
      for (var i = 0; i < height - sum; i++)
        hs2[i % hs2.length]++;
      return hs2;
    }
    const hs = gridHs();
    const specs = (i) => ({
      hub,
      meta,
      props,
      settings: panes[i].settings,
      height: hs[i]
    });
    const mainGm = new GridMaker(
      hub.mainPaneId,
      specs(hub.mainPaneId)
    );
    const gms = [mainGm];
    for (const [i, pane] of panes.entries()) {
      if (i !== hub.mainPaneId) {
        gms.push(
          new GridMaker(
            i,
            specs(i),
            mainGm.getLayout()
          )
        );
      }
    }
    const sb2 = [
      Math.max(...gms.map((x) => x.getSidebar()[0])),
      Math.max(...gms.map((x) => x.getSidebar()[1]))
    ];
    const grids = [];
    let offset = 0;
    for (let i = 0; i < gms.length; i++) {
      const id = gms[i].id();
      gms[i].setMaxSidebar(sb2);
      grids[id] = gms[i].create();
    }
    for (let i = 0; i < grids.length; i++) {
      grids[i].offset = offset;
      offset += grids[i].height;
    }
    return {
      grids,
      main: grids.find((x) => x.main),
      indexBased: hub.indexBased,
      botbar: {
        width: props.width,
        height: props.config.BOTBAR,
        offset,
        xs: grids[0] ? grids[0].xs : []
      }
    };
  }
  function Context($p) {
    const el = document.createElement("canvas");
    const ctx = el.getContext("2d");
    ctx.font = $p.config.FONT;
    return ctx;
  }
  class Mouse {
    constructor(core) {
      const l = core.layout;
      this.core = core;
      this.map = {};
      this.listeners = 0;
      this.pressed = false;
      this.x = core.cursor.x;
      this.y = core.cursor.y;
      this.t = core.cursor.t;
      this.y$ = l.y2value(core.cursor.y);
    }
    // You can choose where to place the handler
    // (beginning or end of the queue)
    on(name, handler, dir = "unshift") {
      if (!handler)
        return;
      this.map[name] = this.map[name] || [];
      this.map[name][dir](handler);
      this.listeners++;
    }
    off(name, handler) {
      if (!this.map[name])
        return;
      const i = this.map[name].indexOf(handler);
      if (i < 0)
        return;
      this.map[name].splice(i, 1);
      this.listeners--;
    }
    // Called by Grid.svelte
    emit(name, event) {
      const l = this.core.layout;
      if (name in this.map) {
        for (var f of this.map[name]) {
          f(event);
        }
      }
      if (name === "mousemove") {
        this.x = event.layerX;
        this.y = event.layerY;
        this.t = l.x2time(this.x);
        this.y$ = l.y2value(this.y);
      }
      if (name === "mousedown") {
        this.pressed = true;
      }
      if (name === "mouseup") {
        this.pressed = false;
      }
    }
  }
  class Keys {
    constructor(core) {
      this.core = core;
      this.map = {};
      this.listeners = 0;
      this.keymap = {};
    }
    on(name, handler) {
      if (!handler)
        return;
      this.map[name] = this.map[name] || [];
      this.map[name].push(handler);
      this.listeners++;
    }
    // Called by Grid.svelte
    emit(name, event) {
      if (name in this.map) {
        for (var f of this.map[name]) {
          f(event);
        }
      }
      if (name === "keydown") {
        if (!this.keymap[event.key]) {
          this.emit(event.key);
        }
        this.keymap[event.key] = true;
      }
      if (name === "keyup") {
        this.keymap[event.key] = false;
      }
    }
    pressed(key) {
      return !!this.keymap[key];
    }
  }
  Const.HPX;
  class Candle {
    constructor(core, props, ctx, data) {
      this.ctx = ctx;
      this.core = core;
      this.style = data.src[6] || props;
      this.draw(data);
    }
    draw(data) {
      const green = data.src[4] >= data.src[1];
      const bodyColor = green ? this.style.colorCandleUp : this.style.colorCandleDw;
      const wickColor = green ? this.style.colorWickUp : this.style.colorWickDw;
      const w = Math.max(data.w, 1);
      const x05 = data.x - 1;
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = wickColor;
      this.ctx.beginPath();
      this.ctx.moveTo(x05, Math.floor(data.h));
      this.ctx.lineTo(x05, Math.floor(data.l));
      this.ctx.stroke();
      this.ctx.lineWidth = w;
      this.ctx.strokeStyle = bodyColor;
      this.ctx.beginPath();
      this.ctx.moveTo(
        x05,
        Math.floor(Math.min(data.o, data.c))
      );
      this.ctx.lineTo(
        x05,
        Math.floor(Math.max(data.o, data.c)) + (data.o === data.c ? 1 : 0)
      );
      this.ctx.stroke();
    }
  }
  function candleBody(ctx, data) {
    const x05 = data.x - 1;
    ctx.moveTo(
      x05,
      Math.floor(Math.min(data.o - 1, data.c - 1))
    );
    ctx.lineTo(
      x05,
      Math.floor(Math.max(data.o, data.c))
      //+ (data.o === data.c ? 1 : 0)
    );
  }
  function candleWick(ctx, data) {
    const x05 = data.x - 1;
    ctx.moveTo(x05, Math.floor(data.h));
    ctx.lineTo(x05, Math.floor(data.l));
  }
  const HPX$6 = Const.HPX;
  function volumeBar(ctx, data, layout) {
    const y0 = layout.height;
    const w = Math.max(1, data.x2 - data.x1 + HPX$6);
    const h = data.h;
    const x05 = (data.x2 + data.x1) * 0.5;
    ctx.lineWidth = w;
    ctx.moveTo(x05, y0 - h);
    ctx.lineTo(x05, y0);
  }
  const HPX$5 = Const.HPX;
  class VolbarExt {
    constructor(core, props, ctx, data) {
      this.ctx = ctx;
      this.style = data.src[6] || props;
      this.layout = core.layout;
      this.draw(data);
    }
    draw(data) {
      const y0 = this.layout.height;
      const w = data.x2 - data.x1;
      const h = Math.floor(data.h);
      this.ctx.fillStyle = data.green ? this.style.colorVolUp : this.style.colorVolDw;
      this.ctx.fillRect(
        Math.floor(data.x1),
        Math.floor(y0 - h + HPX$5),
        Math.floor(w),
        Math.floor(h + 1)
      );
    }
  }
  const HPX$4 = Const.HPX;
  function layoutCnv(core, $c = true, $v = true, vIndex = 5, dirIndex, vScale) {
    const config = core.props.config;
    const interval = core.props.interval;
    const data = core.data;
    const ti2x = core.layout.ti2x;
    const layout = core.layout;
    const view = core.view;
    const ls = layout.scaleSpecs.log;
    const upBodies = [];
    const dwBodies = [];
    const upWicks = [];
    const dwWicks = [];
    const upVolbars = [];
    const dwVolbars = [];
    if ($v) {
      var volScale = vScale != null ? vScale : config.VOLSCALE;
      var maxv = maxVolume(core.dataSubset, vIndex);
      var vs = volScale * layout.height / maxv;
    }
    var x1, x2, mid, prev = void 0;
    const { A, B, pxStep } = layout;
    const w = pxStep * config.CANDLEW;
    const splitter = pxStep > 5 ? 1 : 0;
    for (var i = view.i1, n = view.i2; i <= n; i++) {
      const p = data[i];
      const green = dirIndex ? p[dirIndex] > 0 : p[4] >= p[1];
      mid = ti2x(p[0], i) + 1;
      if (data[i - 1] && p[0] - data[i - 1][0] > interval) {
        prev = null;
      }
      if ($c) {
        const candle = ls ? {
          x: mid,
          w,
          o: Math.floor(math.log(p[1]) * A + B),
          h: Math.floor(math.log(p[2]) * A + B),
          l: Math.floor(math.log(p[3]) * A + B),
          c: Math.floor(math.log(p[4]) * A + B),
          green,
          src: p
        } : {
          x: mid,
          w,
          o: Math.floor(p[1] * A + B),
          h: Math.floor(p[2] * A + B),
          l: Math.floor(p[3] * A + B),
          c: Math.floor(p[4] * A + B),
          green,
          src: p
        };
        if (green) {
          upBodies.push(candle);
          upWicks.push(candle);
        } else {
          dwBodies.push(candle);
          dwWicks.push(candle);
        }
      }
      if ($v) {
        x1 = prev || Math.floor(mid - pxStep * 0.5);
        x2 = Math.floor(mid + pxStep * 0.5) + HPX$4;
        const volbar = {
          x1,
          x2,
          h: p[vIndex] * vs,
          green,
          src: p
        };
        if (green) {
          upVolbars.push(volbar);
        } else {
          dwVolbars.push(volbar);
        }
      }
      prev = x2 + splitter;
    }
    return {
      upBodies,
      upWicks,
      dwBodies,
      dwWicks,
      upVolbars,
      dwVolbars,
      maxVolume: maxv,
      volScale: vs
    };
  }
  function maxVolume(data, index) {
    let max = 0;
    for (var i = 0; i < data.length; i++) {
      const val = data[i][index];
      if (val > max)
        max = val;
    }
    return max;
  }
  function fastSma(data, di, i0, iN, length) {
    let acc = 0;
    const out = [];
    let counter = 0;
    const mult = 1 / length;
    const start = Math.max(i0 - length, 0);
    for (var i = start; i <= iN; i++) {
      acc += data[i][di];
      counter++;
      if (counter > length) {
        acc -= data[i - length][di];
        counter--;
      }
      if (counter === length) {
        out.push([data[i][0], acc * mult]);
      }
    }
    return out;
  }
  function candleColor(props, candle = []) {
    if (candle[4] >= candle[1]) {
      return props.colorBodyUp;
    } else {
      return props.colorBodyDw;
    }
  }
  function rescaleFont(fontString, newSize) {
    const pair = fontString.split("px");
    return newSize + "px" + pair[1];
  }
  function avgVolume(ctx, core, props, cnv, vIndex = 5) {
    const i1 = core.view.i1;
    const i2 = core.view.i2;
    const len = props.avgVolumeSMA;
    const sma = fastSma(core.data, vIndex, i1, i2, len);
    const layout = core.layout;
    cnv.maxVolume;
    const vs = cnv.volScale;
    const h = layout.height;
    core.props.config.VOLSCALE * 0.5 * h;
    ctx.lineJoin = "round";
    ctx.lineWidth = 0.75;
    ctx.strokeStyle = props.colorAvgVol;
    ctx.beginPath();
    if (core.layout.indexBased)
      return;
    const offset = core.data.length - sma.length;
    for (var i = 0, n = sma.length; i < n; i++) {
      const x = layout.ti2x(sma[i][0], i + offset);
      const y = h - sma[i][1] * vs;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  function roundRect$2(ctx, x, y, width, height, radius, fill = true, stroke) {
    if (typeof radius === "undefined") {
      radius = 5;
    }
    if (typeof radius === "number") {
      radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
      var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
      for (var side in defaultRadius) {
        radius[side] = radius[side] || defaultRadius[side];
      }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
      ctx.fill();
    }
    if (stroke) {
      ctx.stroke();
    }
  }
  function drawArrow(context, fromX, fromY, toX, toY, color, head = true) {
    const headLength = 7;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);
    context.beginPath();
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    if (head) {
      context.moveTo(toX, toY);
      context.lineTo(toX - headLength * Math.cos(angle - Math.PI / 5), toY - headLength * Math.sin(angle - Math.PI / 5));
      context.moveTo(toX, toY);
      context.lineTo(toX - headLength * Math.cos(angle + Math.PI / 5), toY - headLength * Math.sin(angle + Math.PI / 5));
    }
    context.strokeStyle = color;
    context.lineWidth = 1;
    context.stroke();
  }
  class TrendLine {
    constructor(core, line, nw = false) {
      this.core = core;
      this.data = line;
      this.hover = false;
      this.selected = false;
      this.onSelect = () => {
      };
      switch (line.type) {
        case "segment":
          this.line = new core.lib.Segment(core);
          break;
      }
      this.pins = [
        new core.lib.Pin(core, this, "p1"),
        new core.lib.Pin(core, this, "p2")
      ];
      if (nw)
        this.pins[1].state = "tracking";
    }
    draw(ctx) {
      this.line.update(this.data.p1, this.data.p2);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#33ff33";
      ctx.beginPath();
      this.line.draw(ctx);
      ctx.stroke();
      if (this.hover || this.selected) {
        for (var pin of this.pins) {
          pin.draw(ctx);
        }
      }
    }
    collision() {
      const mouse = this.core.mouse;
      const [x, y] = [mouse.x, mouse.y];
      return this.line.collision(x, y);
    }
    propagate(name, data) {
      for (var pin of this.pins) {
        pin[name](data);
      }
    }
    mousedown(event) {
      this.propagate("mousedown", event);
      if (this.collision()) {
        this.onSelect(this.data.uuid);
      }
    }
    mouseup(event) {
      this.propagate("mouseup", event);
    }
    mousemove(event) {
      this.hover = this.collision();
      this.propagate("mousemove", event);
    }
  }
  class Segment {
    // Overlay ref, canvas ctx
    constructor(core) {
      this.T = core.props.config.TOOL_COLL;
      this.core = core;
    }
    // Update line coordinates
    update(p1, p2) {
      const layout = this.core.layout;
      this.x1 = layout.time2x(p1[0]);
      this.y1 = layout.value2y(p1[1]);
      this.x2 = layout.time2x(p2[0]);
      this.y2 = layout.value2y(p2[1]);
    }
    // p1[t, $], p2[t, $] (time-price coordinates)
    // TODO: fix for index-based
    draw(ctx) {
      ctx.moveTo(this.x1, this.y1);
      ctx.lineTo(this.x2, this.y2);
    }
    // Collision function. x, y - mouse coord.
    collision(x, y) {
      return math.point2seg(
        [x, y],
        [this.x1, this.y1],
        [this.x2, this.y2]
      ) < this.T;
    }
  }
  class Pin {
    constructor(core, line, name, params = {}) {
      this.RADIUS = core.props.config.PIN_RADIUS;
      this.RADIUS_SQ = Math.pow(this.RADIUS + 7, 2);
      if (core.lib.Utils.isMobile) {
        this.RADIUS += 2;
        this.RADIUS_SQ *= 2.5;
      }
      this.COLOR_BACK = core.colors.back;
      this.COLOR_BR = core.colors.text;
      this.core = core;
      this.line = line;
      this.data = line.data;
      this.name = name;
      this.state = params.state || "settled";
      this.hidden = params.hidden || false;
      this.mouse = this.core.mouse;
      this.init();
    }
    // Init from data
    init() {
      if (this.data && this.data[this.name]) {
        const p = this.data[this.name];
        this.t = p[0];
        this.y$ = p[1];
      }
    }
    draw(ctx) {
      if (this.hidden)
        return;
      switch (this.state) {
        case "tracking":
          break;
        case "dragging":
          if (!this.moved)
            this.draw_circle(ctx);
          break;
        case "settled":
          this.draw_circle(ctx);
          break;
      }
    }
    draw_circle(ctx) {
      let r, lw;
      if (this.line.selected) {
        r = this.RADIUS;
        lw = 1.5;
      } else {
        r = this.RADIUS * 0.95;
        lw = 1;
      }
      ctx.lineWidth = lw;
      ctx.strokeStyle = this.COLOR_BR;
      ctx.fillStyle = this.COLOR_BACK;
      ctx.beginPath();
      ctx.arc(
        this.x = this.core.layout.time2x(this.t),
        this.y = this.core.layout.value2y(this.y$),
        r + 0.5,
        0,
        Math.PI * 2,
        true
      );
      ctx.fill();
      ctx.stroke();
    }
    update() {
      const y$ = this.core.layout.y2value(this.core.cursor.y);
      this.x = this.core.cursor.x;
      this.y = this.core.cursor.y;
      this.t = this.core.cursor.time;
      this.y$ = y$;
      this.data[this.name] = [this.t, this.y$];
    }
    mousemove(event) {
      switch (this.state) {
        case "tracking":
        case "dragging":
          this.moved = true;
          this.update();
          break;
      }
    }
    mousedown(event, force = false) {
      const Utils2 = this.core.lib.Utils;
      if (Utils2.defaultPrevented(event) && !force)
        return;
      switch (this.state) {
        case "tracking":
          this.state = "settled";
          if (this.onSettled)
            this.onSettled();
          this.core.events.emit("scroll-lock", false);
          break;
        case "settled":
          if (this.hidden)
            return;
          if (this.hover()) {
            this.state = "dragging";
            this.moved = false;
            this.core.events.emit("scroll-lock", true);
          }
          break;
      }
      if (this.hover()) {
        event.preventDefault();
      }
    }
    mouseup(event) {
      switch (this.state) {
        case "dragging":
          this.state = "settled";
          if (this.onSettled)
            this.onSettled();
          this.core.events.emit("scroll-lock", false);
          break;
      }
    }
    on(name, handler) {
      switch (name) {
        case "settled":
          this.onSettled = handler;
          break;
      }
    }
    hover() {
      const x = this.x;
      const y = this.y;
      return (x - this.mouse.x) * (x - this.mouse.x) + (y - this.mouse.y) * (y - this.mouse.y) < this.RADIUS_SQ;
    }
  }
  const formatCash = Utils.formatCash;
  class OverlayEnv {
    // TODO: auto update on prop/data change
    constructor(id, ovSrc, layout, props) {
      const hub = DataHub$1.instance(props.id);
      const meta = MetaHub$1.instance(props.id);
      const events = Events$1.instance(props.id);
      const scan = DataScan.instance(props.id);
      this.ovSrc = ovSrc;
      this.overlay = null;
      this.id = id;
      this.handlers = {};
      this.$core = { hub, meta, scan, events };
      this.update(ovSrc, layout, props);
      this.$props = ovSrc.props;
      this.$events = events;
      this.$core.mouse = new Mouse(this.$core);
      this.$core.keys = new Keys(this.$core);
      this.lib = {
        Candle,
        Volbar: VolbarExt,
        layoutCnv,
        formatCash,
        candleBody,
        candleWick,
        volumeBar,
        fastSma,
        avgVolume,
        candleColor,
        roundRect: roundRect$2,
        rescaleFont,
        drawArrow,
        TrendLine,
        Segment,
        Pin,
        Utils
      };
      this.$core.lib = this.lib;
    }
    // Defines new property
    prop(name, obj = {}) {
      if (!(name in this.$props)) {
        this.$props[name] = obj.def;
      }
    }
    // Update evnironment variables
    update(overlay, layout, props) {
      if (!layout)
        return;
      const core = this.$core;
      core.layout = this.buildLayout(
        layout,
        props.range,
        overlay
      );
      core.dataSubset = overlay.dataSubset;
      core.data = overlay.data;
      core.view = overlay.dataView;
      core.dataExt = overlay.dataExt;
      core.id = overlay.id;
      core.paneId = core.layout.id;
      core.uuid = overlay.uuid;
      core.range = props.range;
      core.colors = props.colors;
      core.cursor = props.cursor;
      core.src = overlay;
      core.props = props;
      core.indexOffset = overlay.indexOffset;
    }
    // Build the final layout API by merging
    // the selected scale to the rest layout
    // variables
    buildLayout(layout, range, overlay) {
      const obj = {};
      this.scaleId = /*this.scaleId !== undefined ?
      this.scaleId :*/
      this.getScaleId(layout);
      const s = layout.scales[this.scaleId];
      return layoutFn(
        Object.assign(obj, layout, s),
        range,
        overlay
      );
    }
    // Get the scale id of this overlay
    getScaleId(layout) {
      const scales = layout.scales;
      for (var i in scales) {
        const ovIdxs = scales[i].scaleSpecs.ovIdxs;
        if (ovIdxs.includes(this.id)) {
          return i;
        }
      }
    }
    watchProp(propName, handler) {
      this.handlers[propName] = this.handlers[propName] || [];
      this.handlers[propName].push(handler);
      let oldValue = this.$props[propName];
      delete this.$props[propName];
      Object.defineProperty(this.$props, propName, {
        get: () => oldValue,
        set: (newValue) => {
          const tmp = oldValue;
          oldValue = newValue;
          for (const handler2 of this.handlers[propName]) {
            handler2(newValue, tmp);
          }
        },
        enumerable: true,
        configurable: true
      });
    }
    destroy() {
      for (const prop in this.handlers) {
        const value = this.$props[prop];
        delete this.$props[prop];
        this.$props[prop] = value;
      }
      this.handlers = {};
    }
  }
  class Layer {
    constructor(id, name, nvId) {
      this.id = id;
      this.nvId = nvId;
      this.name = name;
      this.zIndex = 0;
      this.overlay = null;
      this.ovSrc = null;
      this.env = null;
      this.ctxType = null;
      this.display = true;
      this.opacity = void 0;
    }
    update() {
      var _a;
      if (!this.ovSrc)
        return;
      this.display = (_a = this.ovSrc.settings.display) != null ? _a : true;
    }
  }
  class FrameAnimation {
    constructor(cb) {
      this.t0 = this.t = Utils.now();
      this.id = setInterval(() => {
        if (Utils.now() - this.t > 100)
          return;
        if (Utils.now() - this.t0 > 1200) {
          this.stop();
        }
        if (this.id)
          cb(this);
        this.t = Utils.now();
      }, 16);
    }
    stop() {
      clearInterval(this.id);
      this.id = null;
    }
  }
  class Input {
    async setup(comp) {
      this.MIN_ZOOM = comp.props.config.MIN_ZOOM;
      this.MAX_ZOOM = comp.props.config.MAX_ZOOM;
      if (Utils.isMobile)
        this.MIN_ZOOM *= 0.5;
      this.canvas = comp.canvas;
      this.ctx = comp.ctx;
      this.props = comp.props;
      this.layout = comp.layout;
      this.rrId = comp.rrUpdId;
      this.gridUpdId = comp.gridUpdId;
      this.gridId = comp.id;
      this.cursor = {};
      this.oldMeta = {};
      this.range = this.props.range;
      this.interval = this.props.interval;
      this.offsetX = 0;
      this.offsetY = 0;
      this.deltas = 0;
      this.wmode = this.props.config.SCROLL_WHEEL;
      this.hub = DataHub$1.instance(this.props.id);
      this.meta = MetaHub$1.instance(this.props.id);
      this.events = Events$1.instance(this.props.id);
      await this.listeners();
      this.mouseEvents("addEventListener");
    }
    mouseEvents(cmd) {
      ["mousemove", "mouseout", "mouseup", "mousedown", "click"].forEach((e) => {
        if (cmd === "addEventListener") {
          this["_" + e] = this[e].bind(this);
        }
        this.canvas[cmd](e, this["_" + e]);
      });
    }
    async listeners() {
      const Hamster = await Promise.resolve().then(() => hamster$1);
      const Hammer = await Promise.resolve().then(() => hammer$1);
      this.hm = Hamster.default(this.canvas);
      this.hm.wheel((event, delta) => this.mousezoom(-delta * 50, event));
      const mc = this.mc = new Hammer.Manager(this.canvas);
      const T = Utils.isMobile ? 10 : 0;
      mc.add(new Hammer.Pan({ threshold: T }));
      mc.add(new Hammer.Tap());
      mc.add(new Hammer.Pinch({ threshold: 0 }));
      mc.get("pinch").set({ enable: true });
      if (Utils.isMobile)
        mc.add(new Hammer.Press());
      mc.on("panstart", (event) => {
        if (this.cursor.scroll_lock)
          return;
        if (this.cursor.mode === "aim") {
          return this.emitCursorCoord(event);
        }
        const scaleId = this.layout.scaleIndex;
        const tfrm = this.meta.getYtransform(this.gridId, scaleId);
        this.drug = {
          x: event.center.x + this.offsetX,
          y: event.center.y + this.offsetY,
          r: this.range.slice(),
          t: this.range[1] - this.range[0],
          o: tfrm ? tfrm.offset || 0 : 0,
          y_r: tfrm && tfrm.range ? tfrm.range.slice() : void 0,
          B: this.layout.B,
          t0: Utils.now()
        };
        this.events.emit("cursor-locked", true);
        this.events.emit("cursor-changed", {
          gridId: this.gridId,
          x: event.center.x + this.offsetX,
          y: event.center.y + this.offsetY
        });
      });
      mc.on("panmove", (event) => {
        if (Utils.isMobile) {
          this.calcOffset();
          this.propagate("mousemove", this.touch2mouse(event));
        }
        if (this.drug) {
          this.mousedrag(
            this.drug.x + event.deltaX,
            this.drug.y + event.deltaY
          );
        } else if (this.cursor.mode === "aim") {
          this.emitCursorCoord(event);
        }
      });
      mc.on("panend", (event) => {
        if (Utils.isMobile && this.drug) {
          this.panFade(event);
        }
        this.drug = null;
        this.events.emit("cursor-locked", false);
      });
      mc.on("tap", (event) => {
        if (!Utils.isMobile)
          return;
        this.simMousedown(event);
        if (this.fade)
          this.fade.stop();
        this.events.emit("cursor-changed", {});
        this.events.emit("cursor-changed", {
          mode: "explore"
        });
        this.events.emitSpec(this.rrId, "update-rr");
      });
      mc.on("pinchstart", () => {
        this.drug = null;
        this.pinch = {
          t: this.range[1] - this.range[0],
          r: this.range.slice()
        };
      });
      mc.on("pinchend", () => {
        this.pinch = null;
      });
      mc.on("pinch", (event) => {
        if (this.pinch)
          this.pinchZoom(event.scale);
      });
      mc.on("press", (event) => {
        if (!Utils.isMobile)
          return;
        if (this.fade)
          this.fade.stop();
        this.calcOffset();
        this.emitCursorCoord(event, { mode: "aim" });
        setTimeout(() => this.events.emitSpec(this.rrId, "update-rr"));
        this.simMousedown(event);
      });
      const add = this.canvas.addEventListener;
      add("gesturestart", this.gesturestart);
      add("gesturechange", this.gesturechange);
      add("gestureend", this.gestureend);
    }
    gesturestart(event) {
      event.preventDefault();
    }
    gesturechange(event) {
      event.preventDefault();
    }
    gestureend(event) {
      event.preventDefault();
    }
    mousemove(event) {
      if (Utils.isMobile)
        return;
      event = Utils.adjustMouse(event, this.canvas);
      this.events.emit("cursor-changed", {
        visible: true,
        gridId: this.gridId,
        x: event.layerX,
        y: event.layerY - 1
        // Align with the crosshair
      });
      this.calcOffset();
      this.propagate("mousemove", event);
    }
    mouseout(event) {
      if (Utils.isMobile)
        return;
      event = Utils.adjustMouse(event, this.canvas);
      this.events.emit("cursor-changed", { visible: false });
      this.propagate("mouseout", event);
    }
    mouseup(event) {
      event = Utils.adjustMouse(event, this.canvas);
      this.drug = null;
      this.events.emit("cursor-locked", false);
      this.propagate("mouseup", event);
    }
    mousedown(event) {
      event = Utils.adjustMouse(event, this.canvas);
      if (Utils.isMobile)
        return;
      this.events.emit("cursor-locked", true);
      this.propagate("mousedown", event);
      if (event.defaultPrevented)
        return;
      this.events.emit("grid-mousedown", [this.gridId, event]);
    }
    // Simulated mousedown (for mobile)
    simMousedown(event) {
      event = Utils.adjustMouse(event, this.canvas);
      if (event.srcEvent.defaultPrevented)
        return;
      this.events.emit("grid-mousedown", [this.gridId, event]);
      this.propagate("mousemove", this.touch2mouse(event));
      this.events.emitSpec(this.rrId, "update-rr");
      this.propagate("mousedown", this.touch2mouse(event));
      setTimeout(() => {
        this.propagate("click", this.touch2mouse(event));
      });
    }
    // Convert touch to "mouse" event
    touch2mouse(e) {
      this.calcOffset();
      return {
        original: e.srcEvent,
        layerX: e.center.x + this.offsetX,
        layerY: e.center.y + this.offsetY,
        preventDefault: function() {
          this.original.preventDefault();
        }
      };
    }
    click(event) {
      this.propagate("click", event);
    }
    emitCursorCoord(event, add = {}) {
      this.events.emit("cursor-changed", Object.assign({
        gridId: this.gridId,
        x: event.center.x + this.offsetX,
        y: event.center.y + this.offsetY
        //+ this.layout.offset
      }, add));
    }
    panFade(event) {
      const dt = Utils.now() - this.drug.t0;
      const dx = this.range[1] - this.drug.r[1];
      let v = 42 * dx / dt;
      const v0 = Math.abs(v * 0.01);
      if (dt > 500)
        return;
      if (this.fade)
        this.fade.stop();
      this.fade = new FrameAnimation((self2) => {
        v *= 0.85;
        if (Math.abs(v) < v0) {
          self2.stop();
        }
        this.range[0] += v;
        this.range[1] += v;
        this.changeRange();
      });
    }
    calcOffset() {
      const rect = this.canvas.getBoundingClientRect();
      this.offsetX = -rect.x;
      this.offsetY = -rect.y;
    }
    mousezoom(delta, event) {
      var _a;
      if (this.meta.scrollLock)
        return;
      if (this.wmode !== "pass") {
        if (this.wmode === "click" && !this.oldMeta.activated) {
          return;
        }
        event.originalEvent.preventDefault();
        event.preventDefault();
      }
      event.deltaX = event.deltaX || Utils.getDeltaX(event);
      event.deltaY = event.deltaY || Utils.getDeltaY(event);
      if (Math.abs(event.deltaX) > 0) {
        this.trackpad = true;
        if (Math.abs(event.deltaX) >= Math.abs(event.deltaY)) {
          delta *= 0.1;
        }
        this.trackpadScroll(event);
      }
      if (this.trackpad)
        delta *= 0.032;
      delta = Utils.smartWheel(delta);
      const dpr2 = (_a = window.devicePixelRatio) != null ? _a : 1;
      const data = this.hub.mainOv.dataSubset;
      if (delta < 0 && data.length <= this.MIN_ZOOM)
        return;
      if (delta > 0 && data.length > this.MAX_ZOOM)
        return;
      const k = this.interval / 1e3;
      const diff = delta * k * data.length;
      const tl = this.props.config.ZOOM_MODE === "tl";
      if (event.originalEvent.ctrlKey || tl) {
        const offset = event.originalEvent.offsetX;
        const diff1 = offset / (this.canvas.width / dpr2 - 1) * diff;
        const diff2 = diff - diff1;
        this.range[0] -= diff1;
        this.range[1] += diff2;
      } else {
        this.range[0] -= diff;
      }
      if (tl) {
        const offset = event.originalEvent.offsetY;
        const diff1 = offset / (this.canvas.height / dpr2 - 1) * 2;
        const diff2 = 2 - diff1;
        const z = diff / (this.range[1] - this.range[0]);
        this.events.emit("rezoom-range", {
          gridId: this.gridId,
          z,
          diff1,
          diff2
        });
      }
      this.changeRange();
    }
    mousedrag(x, y) {
      if (this.meta.scrollLock)
        return;
      const dt = this.drug.t * (this.drug.x - x) / this.layout.width;
      let d$ = this.layout.$hi - this.layout.$lo;
      d$ *= (this.drug.y - y) / this.layout.height;
      const offset = this.drug.o + d$;
      const ls = this.layout.settings.logScale;
      if (ls && this.drug.y_r) {
        const dy = this.drug.y - y;
        var range = this.drug.y_r.slice();
        range[0] = math.exp((0 - this.drug.B + dy) / this.layout.A);
        range[1] = math.exp(
          (this.layout.height - this.drug.B + dy) / this.layout.A
        );
      }
      const scaleId = this.layout.scaleIndex;
      const yTransform = this.meta.getYtransform(this.gridId, scaleId);
      if (this.drug.y_r && yTransform && !yTransform.auto) {
        this.events.emit("sidebar-transform", {
          gridId: this.gridId,
          scaleId,
          range: ls ? range || this.drug.y_r : [
            this.drug.y_r[0] - offset,
            this.drug.y_r[1] - offset
          ]
        });
      }
      this.range[0] = this.drug.r[0] + dt;
      this.range[1] = this.drug.r[1] + dt;
      this.changeRange();
    }
    pinchZoom(scale) {
      if (this.meta.scrollLock)
        return;
      const data = this.hub.mainOv.dataSubset;
      if (scale > 1 && data.length <= this.MIN_ZOOM)
        return;
      if (scale < 1 && data.length > this.MAX_ZOOM)
        return;
      const t = this.pinch.t;
      const nt = t * 1 / scale;
      this.range[0] = this.pinch.r[0] - (nt - t) * 0.5;
      this.range[1] = this.pinch.r[1] + (nt - t) * 0.5;
      this.changeRange();
    }
    trackpadScroll(event) {
      if (this.meta.scrollLock)
        return;
      const dt = this.range[1] - this.range[0];
      this.range[0] += event.deltaX * dt * 0.011;
      this.range[1] += event.deltaX * dt * 0.011;
      this.changeRange();
    }
    changeRange() {
      const data = this.hub.mainOv.data;
      if (!this.range.length || data.length < 2)
        return;
      const l = data.length - 1;
      const range = this.range;
      const layout = this.layout;
      range[0] = Utils.clamp(
        range[0],
        -Infinity,
        layout.ti(data[l][0], l) - this.interval * 5.5
      );
      range[1] = Utils.clamp(
        range[1],
        layout.ti(data[0][0], 0) + this.interval * 5.5,
        Infinity
      );
      this.events.emit("range-changed", range);
    }
    // Propagate mouse event to overlays
    propagate(name, event) {
      this.events.emitSpec(this.gridUpdId, "propagate", {
        name,
        event
      });
    }
    destroy() {
      const rm = this.canvas.removeEventListener;
      rm("gesturestart", this.gesturestart);
      rm("gesturechange", this.gesturechange);
      rm("gestureend", this.gestureend);
      if (this.mc)
        this.mc.destroy();
      if (this.hm)
        this.hm.unwheel();
      this.mouseEvents("removeEventListener");
    }
  }
  class Keyboard {
    constructor(updId, events) {
      this._keydown = this.keydown.bind(this);
      this._keyup = this.keyup.bind(this);
      this._keypress = this.keypress.bind(this);
      window.addEventListener("keydown", this._keydown);
      window.addEventListener("keyup", this._keyup);
      window.addEventListener("keypress", this._keypress);
      this.events = events;
      this.updId = updId;
    }
    off() {
      window.removeEventListener("keydown", this._keydown);
      window.removeEventListener("keyup", this._keyup);
      window.removeEventListener("keypress", this._keypress);
    }
    keydown(event) {
      this.events.emitSpec(this.updId, "propagate", {
        name: "keydown",
        event
      });
    }
    keyup(event) {
      this.events.emitSpec(this.updId, "propagate", {
        name: "keyup",
        event
      });
    }
    keypress(event) {
      this.events.emitSpec(this.updId, "propagate", {
        name: "keypress",
        event
      });
    }
  }
  const HPX$3 = Const.HPX;
  class Crosshair extends Layer {
    constructor(id, nvId) {
      super(id, "__$Crosshair__", nvId);
      this.events = Events$1.instance(this.nvId);
      this.events.on("crosshair:show-crosshair", this.onShowHide.bind(this));
      this.id = id;
      this.zIndex = 1e6;
      this.ctxType = "Canvas";
      this.show = true;
      this.overlay = {
        draw: this.draw.bind(this),
        destroy: this.destroy.bind(this)
      };
      this.env = {
        update: this.envEpdate.bind(this),
        destroy: () => {
        }
      };
    }
    draw(ctx) {
      if (!this.layout)
        return;
      const cursor = this.props.cursor;
      if (!cursor.visible || !this.show)
        return;
      ctx.save();
      ctx.strokeStyle = this.props.colors.cross;
      ctx.beginPath();
      ctx.setLineDash([5]);
      if (cursor.gridId === this.layout.id) {
        ctx.moveTo(0, cursor.y + HPX$3);
        ctx.lineTo(this.layout.width + HPX$3, cursor.y + HPX$3);
      }
      ctx.moveTo(cursor.x, 0);
      ctx.lineTo(cursor.x, this.layout.height);
      ctx.stroke();
      ctx.restore();
    }
    envEpdate(ovSrc, layout, props) {
      this.ovSrc = ovSrc;
      this.layout = layout;
      this.props = props;
    }
    onCursor(update2) {
      if (this.props)
        this.props.cursor = update2;
    }
    onShowHide(flag) {
      this.show = flag;
    }
    destroy() {
      this.events.off("crosshair");
    }
  }
  const HPX$2 = Const.HPX;
  class Grid extends Layer {
    constructor(id, nvId) {
      super(id, "__$Grid__", nvId);
      this.events = Events$1.instance(this.nvId);
      this.events.on("grid-layer:show-grid", this.onShowHide.bind(this));
      this.id = id;
      this.zIndex = -1e6;
      this.ctxType = "Canvas";
      this.show = true;
      this.overlay = {
        draw: this.draw.bind(this),
        destroy: this.destroy.bind(this)
      };
      this.env = {
        update: this.envEpdate.bind(this),
        destroy: () => {
        }
      };
    }
    draw(ctx) {
      const layout = this.layout;
      if (!layout || !this.show)
        return;
      ctx.strokeStyle = this.props.colors.grid;
      ctx.beginPath();
      const ymax = layout.height;
      for (var [x, p] of layout.xs) {
        ctx.moveTo(x + HPX$2, 0);
        ctx.lineTo(x + HPX$2, ymax);
      }
      for (var [y, y$] of layout.ys) {
        ctx.moveTo(0, y + HPX$2);
        ctx.lineTo(layout.width, y + HPX$2);
      }
      ctx.stroke();
    }
    envEpdate(ovSrc, layout, props) {
      this.ovSrc = ovSrc;
      this.layout = layout;
      this.props = props;
    }
    onShowHide(flag) {
      this.show = flag;
    }
    destroy() {
      this.events.off("grid-layer");
    }
  }
  const HPX$1 = Const.HPX;
  function body$1(props, layout, scale, side, ctx) {
    var points = scale.ys;
    ctx.font = props.config.FONT;
    var { x, y, w, h } = border(props, layout, side, ctx);
    ctx.fillStyle = props.colors.text;
    ctx.beginPath();
    for (var p of points) {
      if (p[0] > layout.height)
        continue;
      var x1 = side === "left" ? w + HPX$1 : x + HPX$1;
      var x2 = side === "left" ? x1 - 4.5 : x1 + 4.5;
      ctx.moveTo(x1, p[0] + HPX$1);
      ctx.lineTo(x2, p[0] + HPX$1);
      var offst = side === "left" ? -10 : 10;
      ctx.textAlign = side === "left" ? "end" : "start";
      const d = scale.prec;
      ctx.fillText(p[1].toFixed(d), x1 + offst, p[0] + 4);
    }
    ctx.stroke();
  }
  function border(props, layout, side, ctx) {
    var S = side === "right" ? 1 : 0;
    var sb2 = layout.sbMax[S];
    var x, y, w, h;
    switch (side) {
      case "left":
        x = 0;
        y = 0;
        w = Math.floor(sb2);
        h = layout.height;
        ctx.clearRect(x, y, w, h);
        ctx.strokeStyle = props.colors.scale;
        ctx.beginPath();
        ctx.moveTo(x + HPX$1 + w, 0);
        ctx.lineTo(x + HPX$1 + w, h);
        ctx.stroke();
        break;
      case "right":
        x = 0;
        y = 0;
        w = Math.floor(sb2);
        h = layout.height;
        ctx.clearRect(x, y, w, h);
        ctx.strokeStyle = props.colors.scale;
        ctx.beginPath();
        ctx.moveTo(x - HPX$1, 0);
        ctx.lineTo(x - HPX$1, h);
        ctx.stroke();
        break;
    }
    return { x, y, w, h };
  }
  function panel$1(props, layout, scale, side, ctx) {
    const panHeight = props.config.PANHEIGHT;
    const $ = props.cursor.scales[scale.scaleSpecs.id] || 0;
    const lbl = $.toFixed(scale.prec);
    ctx.fillStyle = props.colors.panel;
    var S = side === "right" ? 1 : 0;
    const panWidth = layout.sbMax[S] - 5;
    const x = S ? 1 : 4;
    const y = props.cursor.y - panHeight * 0.5 + HPX$1;
    const a = S ? 7 : panWidth - 3;
    roundRect$1(ctx, x, y, panWidth, panHeight, 3, S);
    ctx.fillStyle = props.colors.textHL;
    ctx.textAlign = S ? "left" : "right";
    ctx.fillText(lbl, a, y + 15);
  }
  function tracker(props, layout, scale, side, ctx, tracker2) {
    const panHeight = Math.floor(props.config.PANHEIGHT * 0.8);
    const ct = props.config.CANDLE_TIME && props.timeFrame >= Const.MINUTE;
    const $ = tracker2.value;
    const lbl = $.toFixed(scale.prec);
    ctx.fillStyle = tracker2.color;
    var S = side === "right" ? 1 : 0;
    const panWidth = layout.sbMax[S] - 5;
    const x = S ? 1 : 4;
    const y = tracker2.y - panHeight * 0.5 + HPX$1;
    const a = S ? 7 : panWidth - 3;
    const h = ct ? Math.floor(panHeight * 1.75) + 2 + HPX$1 : panHeight;
    roundRect$1(ctx, x, y, panWidth, h, 3, S);
    ctx.fillStyle = props.colors.back;
    ctx.textAlign = S ? "left" : "right";
    ctx.fillText(lbl, a, y + panHeight - 4);
    if (ct) {
      const rt = Utils.getCandleTime(props.timeFrame);
      ctx.textAlign = S ? "left" : "right";
      ctx.fillText(rt, a, y + panHeight + 9);
    }
  }
  function roundRect$1(ctx, x, y, w, h, r, s) {
    if (w < 2 * r)
      r = w / 2;
    if (h < 2 * r)
      r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r * s);
    ctx.arcTo(x + w, y + h, x, y + h, r * s);
    ctx.arcTo(x, y + h, x, y, r * (1 - s));
    ctx.arcTo(x, y, x + w, y, r * (1 - s));
    ctx.closePath();
    ctx.fill();
  }
  function upperBorder(props, layout, ctx) {
    ctx.strokeStyle = props.colors.scale;
    ctx.beginPath();
    ctx.moveTo(0, 0.5);
    ctx.lineTo(layout.width, 0.5);
    ctx.stroke();
  }
  function error(props, layout, side, ctx) {
    var S = side === "right" ? 1 : 0;
    var sb2 = layout.sbMax[S];
    ctx.font = props.config.FONT;
    border(props, layout, side, ctx);
    if (layout.id)
      upperBorder(props, layout, ctx);
    const x = Math.floor(sb2 * 0.5);
    const y = Math.floor(layout.height * 0.5);
    ctx.fillStyle = props.colors.text;
    ctx.textAlign = "center";
    ctx.fillText("Error", x, y);
  }
  const sb = {
    body: body$1,
    border,
    panel: panel$1,
    upperBorder,
    error,
    tracker
  };
  function priceLine(layout, ctx, tracker2) {
    ctx.strokeStyle = tracker2.color;
    ctx.setLineDash([1, 2]);
    ctx.beginPath();
    ctx.moveTo(0, tracker2.y);
    ctx.lineTo(layout.width, tracker2.y);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  class Trackers extends Layer {
    constructor(id, props, gridId) {
      super(id, "__$Trackers__");
      this.id = id;
      this.zIndex = 5e5;
      this.ctxType = "Canvas";
      this.hub = DataHub$1.instance(props.id);
      this.meta = MetaHub$1.instance(props.id);
      this.gridId = gridId;
      this.props = props;
      this.overlay = {
        draw: this.draw.bind(this),
        destroy: this.destroy.bind(this),
        drawSidebar: this.drawSidebar.bind(this)
      };
      this.env = {
        update: this.envEpdate.bind(this),
        destroy: () => {
        }
      };
    }
    draw(ctx) {
      if (!this.layout)
        return;
      const trackers = this.meta.valueTrackers[this.gridId] || [];
      this.trackers = [];
      for (var i = 0; i < trackers.length; i++) {
        const vt = trackers[i];
        if (!vt)
          continue;
        const data = this.hub.ovData(this.gridId, i) || [];
        const last = data[data.length - 1] || [];
        const tracker2 = vt(last);
        tracker2.ovId = i;
        if (!tracker2.show || tracker2.value === void 0)
          continue;
        tracker2.y = this.layout.value2y(tracker2.value);
        tracker2.color = tracker2.color || this.props.colors.scale;
        if (tracker2.line) {
          priceLine(this.layout, ctx, tracker2);
        }
        this.trackers.push(tracker2);
      }
    }
    drawSidebar(ctx, side, scale) {
      if (!this.layout)
        return;
      for (var tracker2 of this.trackers || []) {
        const scaleId = this.getScaleId(tracker2.ovId);
        if (scaleId !== scale.scaleSpecs.id)
          continue;
        sb.tracker(
          this.props,
          this.layout,
          scale,
          side,
          ctx,
          tracker2
        );
      }
    }
    envEpdate(ovSrc, layout, props) {
      this.ovSrc = ovSrc;
      this.layout = layout;
      this.props = props;
      this.scaleId = this.getScaleId();
    }
    // Get the scale id of this overlay
    // TODO: more efficient method of getting ov scale
    getScaleId(ovId) {
      const scales = this.layout.scales;
      for (var i in scales) {
        const ovIdxs = scales[i].scaleSpecs.ovIdxs;
        if (ovIdxs.includes(ovId)) {
          return i;
        }
      }
    }
    destroy() {
    }
  }
  function setup(id, w, h) {
    const canvas = document.getElementById(id);
    let dpr2 = window.devicePixelRatio || 1;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    if (dpr2 < 1)
      dpr2 = 1;
    var rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr2;
    canvas.height = rect.height * dpr2;
    const ctx = canvas.getContext("2d", {});
    ctx.scale(dpr2, dpr2);
    if (!ctx.measureTextOrg) {
      ctx.measureTextOrg = ctx.measureText;
    }
    const nvjsId = id.split("-").shift();
    ctx.measureText = (text2) => Utils.measureText(ctx, text2, nvjsId);
    return [canvas, ctx];
  }
  function resize(canvas, ctx, w, h) {
    let dpr2 = window.devicePixelRatio || 1;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    if (dpr2 < 1)
      dpr2 = 1;
    var rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr2;
    canvas.height = rect.height * dpr2;
    ctx.scale(dpr2, dpr2);
  }
  const dpr = { setup, resize };
  function create_fragment$c(ctx) {
    let div;
    let canvas_1;
    return {
      c() {
        div = element("div");
        canvas_1 = element("canvas");
        attr(
          canvas_1,
          "id",
          /*canvasId*/
          ctx[2]
        );
        attr(
          div,
          "id",
          /*rrId*/
          ctx[1]
        );
        attr(
          div,
          "style",
          /*rrStyle*/
          ctx[0]
        );
        attr(div, "class", "nvjs-canvas-rendrer svelte-8n0n7w");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, canvas_1);
      },
      p(ctx2, [dirty]) {
        if (dirty & /*rrStyle*/
        1) {
          attr(
            div,
            "style",
            /*rrStyle*/
            ctx2[0]
          );
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching) {
          detach(div);
        }
      }
    };
  }
  function instance$c($$self, $$props, $$invalidate) {
    let rrStyle;
    let width;
    let height;
    let { id } = $$props;
    let { props = {} } = $$props;
    let { rr = {} } = $$props;
    let { layout = {} } = $$props;
    let events = Events$1.instance(props.id);
    let rrUpdId = `rr-${id}-${rr.id}`;
    let gridUpdId = `grid-${id}`;
    let rrId = `${props.id}-rr-${id}-${rr.id}`;
    let canvasId = `${props.id}-canvas-${id}-${rr.id}`;
    events.on(`${rrUpdId}:update-rr`, update2);
    events.on(`${rrUpdId}:run-rr-task`, onTask);
    let canvas;
    let ctx;
    let input;
    onMount(() => {
      setup2();
    });
    onDestroy(() => {
      events.off(`${rrUpdId}`);
      if (input)
        input.destroy();
    });
    function attach($input) {
      input = $input;
      input.setup({
        id,
        canvas,
        ctx,
        props,
        layout,
        rrUpdId,
        gridUpdId
      });
    }
    function detach2() {
      if (input) {
        input.destroy();
        input = null;
      }
    }
    function getInput() {
      return input;
    }
    function setup2() {
      [canvas, ctx] = dpr.setup(canvasId, layout.width, layout.height);
    }
    function update2($layout = layout) {
      $$invalidate(3, layout = $layout);
      if (!ctx || !layout)
        return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      rr.layers.forEach((l) => {
        if (!l.display)
          return;
        ctx.save();
        let r = l.overlay;
        if (l.opacity)
          ctx.globalAlpha = l.opacity;
        try {
          r.draw(ctx);
        } catch (e) {
          console.log(`Layer ${id}.${l.id}`, e);
        }
        ctx.globalAlpha = 1;
        ctx.restore();
      });
      if (id > 0)
        upperBorder2();
    }
    function onTask(event) {
      event.handler(canvas, ctx, input);
    }
    function upperBorder2() {
      ctx.strokeStyle = props.colors.scale;
      ctx.beginPath();
      ctx.moveTo(0, 0.5);
      ctx.lineTo(layout.width, 0.5);
      ctx.stroke();
    }
    function resizeWatch() {
      if (!canvas)
        return;
      dpr.resize(canvas, ctx, layout.width, layout.height);
      update2();
    }
    $$self.$$set = ($$props2) => {
      if ("id" in $$props2)
        $$invalidate(4, id = $$props2.id);
      if ("props" in $$props2)
        $$invalidate(5, props = $$props2.props);
      if ("rr" in $$props2)
        $$invalidate(6, rr = $$props2.rr);
      if ("layout" in $$props2)
        $$invalidate(3, layout = $$props2.layout);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*layout*/
      8) {
        $$invalidate(0, rrStyle = `
    left: ${layout.sbMax[0]}px;
    top: ${layout.offset || 0}px;
    position: absolute;
    height: ${layout.height}px;
}`);
      }
      if ($$self.$$.dirty & /*layout*/
      8) {
        $$invalidate(11, width = layout.width);
      }
      if ($$self.$$.dirty & /*layout*/
      8) {
        $$invalidate(10, height = layout.height);
      }
      if ($$self.$$.dirty & /*width, height*/
      3072) {
        resizeWatch();
      }
    };
    return [
      rrStyle,
      rrId,
      canvasId,
      layout,
      id,
      props,
      rr,
      attach,
      detach2,
      getInput,
      height,
      width
    ];
  }
  class Canvas extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$c, create_fragment$c, safe_not_equal, {
        id: 4,
        props: 5,
        rr: 6,
        layout: 3,
        attach: 7,
        detach: 8,
        getInput: 9
      });
    }
    get attach() {
      return this.$$.ctx[7];
    }
    get detach() {
      return this.$$.ctx[8];
    }
    get getInput() {
      return this.$$.ctx[9];
    }
  }
  function get_each_context$4(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[23] = list[i];
    child_ctx[24] = list;
    child_ctx[25] = i;
    return child_ctx;
  }
  function create_if_block$6(ctx) {
    let canvas;
    let each_value = (
      /*each_value*/
      ctx[24]
    );
    let i = (
      /*i*/
      ctx[25]
    );
    let current;
    const assign_canvas = () => (
      /*canvas_binding*/
      ctx[7](canvas, each_value, i)
    );
    const unassign_canvas = () => (
      /*canvas_binding*/
      ctx[7](null, each_value, i)
    );
    let canvas_props = {
      id: (
        /*id*/
        ctx[1]
      ),
      layout: (
        /*layout*/
        ctx[0]
      ),
      props: (
        /*props*/
        ctx[2]
      ),
      rr: (
        /*rr*/
        ctx[23]
      )
    };
    canvas = new Canvas({ props: canvas_props });
    assign_canvas();
    return {
      c() {
        create_component(canvas.$$.fragment);
      },
      m(target, anchor) {
        mount_component(canvas, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        if (each_value !== /*each_value*/
        ctx2[24] || i !== /*i*/
        ctx2[25]) {
          unassign_canvas();
          each_value = /*each_value*/
          ctx2[24];
          i = /*i*/
          ctx2[25];
          assign_canvas();
        }
        const canvas_changes = {};
        if (dirty & /*id*/
        2)
          canvas_changes.id = /*id*/
          ctx2[1];
        if (dirty & /*layout*/
        1)
          canvas_changes.layout = /*layout*/
          ctx2[0];
        if (dirty & /*props*/
        4)
          canvas_changes.props = /*props*/
          ctx2[2];
        if (dirty & /*renderers*/
        8)
          canvas_changes.rr = /*rr*/
          ctx2[23];
        canvas.$set(canvas_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(canvas.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(canvas.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        unassign_canvas();
        destroy_component(canvas, detaching);
      }
    };
  }
  function create_each_block$4(ctx) {
    let if_block_anchor;
    let current;
    let if_block = (
      /*rr*/
      ctx[23].ctxType === "Canvas" && create_if_block$6(ctx)
    );
    return {
      c() {
        if (if_block)
          if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if (if_block)
          if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        if (
          /*rr*/
          ctx2[23].ctxType === "Canvas"
        ) {
          if (if_block) {
            if_block.p(ctx2, dirty);
            if (dirty & /*renderers*/
            8) {
              transition_in(if_block, 1);
            }
          } else {
            if_block = create_if_block$6(ctx2);
            if_block.c();
            transition_in(if_block, 1);
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        } else if (if_block) {
          group_outros();
          transition_out(if_block, 1, 1, () => {
            if_block = null;
          });
          check_outros();
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(if_block_anchor);
        }
        if (if_block)
          if_block.d(detaching);
      }
    };
  }
  function create_fragment$b(ctx) {
    let div;
    let current;
    let each_value = ensure_array_like(
      /*renderers*/
      ctx[3]
    );
    let each_blocks = [];
    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    }
    const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
      each_blocks[i] = null;
    });
    return {
      c() {
        div = element("div");
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        attr(div, "class", "nvjs-grid");
        attr(
          div,
          "style",
          /*style*/
          ctx[4]
        );
      },
      m(target, anchor) {
        insert(target, div, anchor);
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(div, null);
          }
        }
        current = true;
      },
      p(ctx2, [dirty]) {
        if (dirty & /*id, layout, props, renderers*/
        15) {
          each_value = ensure_array_like(
            /*renderers*/
            ctx2[3]
          );
          let i;
          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context$4(ctx2, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
              transition_in(each_blocks[i], 1);
            } else {
              each_blocks[i] = create_each_block$4(child_ctx);
              each_blocks[i].c();
              transition_in(each_blocks[i], 1);
              each_blocks[i].m(div, null);
            }
          }
          group_outros();
          for (i = each_value.length; i < each_blocks.length; i += 1) {
            out(i);
          }
          check_outros();
        }
        if (!current || dirty & /*style*/
        16) {
          attr(
            div,
            "style",
            /*style*/
            ctx2[4]
          );
        }
      },
      i(local) {
        if (current)
          return;
        for (let i = 0; i < each_value.length; i += 1) {
          transition_in(each_blocks[i]);
        }
        current = true;
      },
      o(local) {
        each_blocks = each_blocks.filter(Boolean);
        for (let i = 0; i < each_blocks.length; i += 1) {
          transition_out(each_blocks[i]);
        }
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        destroy_each(each_blocks, detaching);
      }
    };
  }
  function instance$b($$self, $$props, $$invalidate) {
    let style;
    let { id } = $$props;
    let { props } = $$props;
    let { main } = $$props;
    let { layout } = $$props;
    function getLayers() {
      return layers;
    }
    let hub = DataHub$1.instance(props.id);
    let meta = MetaHub$1.instance(props.id);
    let events = Events$1.instance(props.id);
    let scripts = Scripts$1.instance(props.id);
    let layers = [];
    let renderers = [];
    let input = null;
    let keyboard = null;
    events.on(`grid-${id}:update-grid`, update2);
    events.on(`grid-${id}:remake-grid`, make);
    events.on(`grid-${id}:propagate`, propagate);
    events.on(`grid-${id}:run-grid-task`, onTask);
    onMount(() => {
      make();
      keyboard = new Keyboard(`grid-${id}`, events);
    });
    onDestroy(() => {
      events.off(`grid-${id}`);
      keyboard.off();
    });
    function make(event) {
      if (!hub.panes()[id])
        return;
      destroyLayers();
      layers = makeLayers();
      $$invalidate(3, renderers = mergeByCtx());
      let last = renderers[renderers.length - 1];
      if (last)
        setTimeout(() => {
          if (last.ref) {
            detachInputs();
            last.ref.attach(input = new Input());
          }
        });
    }
    function detachInputs() {
      for (var rr of renderers) {
        rr.ref.detach();
      }
    }
    function destroyLayers() {
      for (var layer of layers) {
        layer.overlay.destroy();
        layer.env.destroy();
      }
    }
    function makeLayers() {
      let list = hub.panes()[id].overlays || [];
      let layers2 = [];
      for (var i = 0; i < list.length; i++) {
        let ov = list[i];
        let prefab = scripts.prefabs[ov.type];
        if (!prefab)
          continue;
        let l = new Layer(i, ov.name, props.id);
        let z = ov.settings.zIndex;
        l.zIndex = z != null ? z : ov.main ? 0 : -1;
        let env = new OverlayEnv(i, ov, layout, props);
        l.overlay = prefab.make(env);
        l.env = env;
        l.ovSrc = ov;
        l.ctxType = prefab.ctx;
        env.overlay = l.overlay;
        meta.exctractFrom(l.overlay);
        layers2.push(l);
        l.overlay.init();
      }
      layers2.push(new Crosshair(i++, props.id));
      layers2.push(new Grid(i++, props.id));
      layers2.push(new Trackers(i++, props, id));
      layers2.sort((l1, l2) => l1.zIndex - l2.zIndex);
      meta.finish();
      return layers2;
    }
    function mergeByCtx() {
      let rrs = [];
      let lastCtx = null;
      for (var l of layers) {
        if (l.ctxType !== lastCtx) {
          var last = {
            ctxType: l.ctxType,
            layers: [],
            id: rrs.length,
            ref: null
            // Renderer reference
          };
          rrs.push(last);
          lastCtx = l.ctxType;
        }
        last.layers.push(l);
      }
      return rrs;
    }
    function update2($layout = layout) {
      $$invalidate(0, layout = $layout);
      if (input)
        input.layout = layout;
      for (var l of layers) {
        l.env.update(l.ovSrc, layout, props);
        l.update();
      }
      for (var rr of renderers) {
        events.emitSpec(`rr-${id}-${rr.id}`, "update-rr", layout);
      }
    }
    function propagate(e) {
      let { name, event } = e;
      for (var layer of layers) {
        if (layer.overlay[name]) {
          layer.overlay[name](event);
        }
        if (layer.env.$core) {
          const mouse = layer.env.$core.mouse;
          const keys = layer.env.$core.keys;
          mouse.emit(name, event);
          keys.emit(name, event);
        }
      }
    }
    function onTask(event) {
      event.handler(layers, renderers, { update: update2 });
    }
    function canvas_binding($$value, each_value, i) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        each_value[i].ref = $$value;
        $$invalidate(3, renderers);
      });
    }
    $$self.$$set = ($$props2) => {
      if ("id" in $$props2)
        $$invalidate(1, id = $$props2.id);
      if ("props" in $$props2)
        $$invalidate(2, props = $$props2.props);
      if ("main" in $$props2)
        $$invalidate(5, main = $$props2.main);
      if ("layout" in $$props2)
        $$invalidate(0, layout = $$props2.layout);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*layout, props*/
      5) {
        $$invalidate(4, style = `
    width: ${layout.width}px;
    height: ${layout.height}px;
    background: ${props.colors.back};
    margin-left: ${layout.sbMax[0]}px;
`);
      }
    };
    return [layout, id, props, renderers, style, main, getLayers, canvas_binding];
  }
  class Grid_1 extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$b, create_fragment$b, safe_not_equal, {
        id: 1,
        props: 2,
        main: 5,
        layout: 0,
        getLayers: 6
      });
    }
    get getLayers() {
      return this.$$.ctx[6];
    }
  }
  function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
    const o = +getComputedStyle(node).opacity;
    return {
      delay,
      duration,
      easing,
      css: (t) => `opacity: ${t * o}`
    };
  }
  function add_css$4(target) {
    append_styles(target, "svelte-16w6gr6", ".scale-selector.svelte-16w6gr6{position:absolute;bottom:5px;display:grid;justify-content:center;align-content:center}.scale-button.svelte-16w6gr6{border-radius:3px;text-align:center;user-select:none;margin:auto;margin-top:1px}.scale-button.svelte-16w6gr6:hover{filter:brightness(1.2)}");
  }
  function get_each_context$3(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[13] = list[i];
    child_ctx[15] = i;
    const constants_0 = (
      /*scale*/
      child_ctx[13].scaleSpecs.id
    );
    child_ctx[1] = constants_0;
    return child_ctx;
  }
  function create_each_block$3(ctx) {
    let div;
    let t0_value = (
      /*id*/
      ctx[1] + ""
    );
    let t0;
    let t1;
    let div_style_value;
    let mounted;
    let dispose;
    function click_handler() {
      return (
        /*click_handler*/
        ctx[10](
          /*id*/
          ctx[1]
        )
      );
    }
    return {
      c() {
        div = element("div");
        t0 = text(t0_value);
        t1 = space();
        attr(div, "class", "scale-button svelte-16w6gr6");
        attr(div, "style", div_style_value = /*sbStyle*/
        ctx[2](
          /*id*/
          ctx[1]
        ));
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, t0);
        append(div, t1);
        if (!mounted) {
          dispose = listen(div, "click", stop_propagation(click_handler));
          mounted = true;
        }
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
        if (dirty & /*scales*/
        1 && t0_value !== (t0_value = /*id*/
        ctx[1] + ""))
          set_data(t0, t0_value);
        if (dirty & /*sbStyle, scales*/
        5 && div_style_value !== (div_style_value = /*sbStyle*/
        ctx[2](
          /*id*/
          ctx[1]
        ))) {
          attr(div, "style", div_style_value);
        }
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        mounted = false;
        dispose();
      }
    };
  }
  function create_fragment$a(ctx) {
    let div;
    let div_transition;
    let current;
    let each_value = ensure_array_like(
      /*scales*/
      ctx[0]
    );
    let each_blocks = [];
    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    }
    return {
      c() {
        div = element("div");
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        attr(div, "class", "scale-selector svelte-16w6gr6");
        attr(
          div,
          "id",
          /*ssId*/
          ctx[4]
        );
        attr(
          div,
          "style",
          /*ssStyle*/
          ctx[3]
        );
      },
      m(target, anchor) {
        insert(target, div, anchor);
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(div, null);
          }
        }
        current = true;
      },
      p(ctx2, [dirty]) {
        if (dirty & /*sbStyle, scales, onClick*/
        37) {
          each_value = ensure_array_like(
            /*scales*/
            ctx2[0]
          );
          let i;
          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context$3(ctx2, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
            } else {
              each_blocks[i] = create_each_block$3(child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(div, null);
            }
          }
          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }
          each_blocks.length = each_value.length;
        }
        if (!current || dirty & /*ssStyle*/
        8) {
          attr(
            div,
            "style",
            /*ssStyle*/
            ctx2[3]
          );
        }
      },
      i(local) {
        if (current)
          return;
        if (local) {
          add_render_callback(() => {
            if (!current)
              return;
            if (!div_transition)
              div_transition = create_bidirectional_transition(div, fade, { duration: 150 }, true);
            div_transition.run(1);
          });
        }
        current = true;
      },
      o(local) {
        if (local) {
          if (!div_transition)
            div_transition = create_bidirectional_transition(div, fade, { duration: 150 }, false);
          div_transition.run(0);
        }
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        destroy_each(each_blocks, detaching);
        if (detaching && div_transition)
          div_transition.end();
      }
    };
  }
  function instance$a($$self, $$props, $$invalidate) {
    let specs;
    let ssStyle;
    let sbStyle;
    let { id } = $$props;
    let { props } = $$props;
    let { layout } = $$props;
    let { scales } = $$props;
    let { side } = $$props;
    let events = Events$1.instance(props.id);
    let S = side === "right" ? 1 : 0;
    let ssId = `${props.id}-ss-${id}-${side}`;
    function onClick(index) {
      scales[index];
      let idxs = layout.settings.scaleSideIdxs;
      idxs[S] = index;
      events.emitSpec("hub", "set-scale-index", { paneId: id, index, sideIdxs: idxs });
    }
    const click_handler = (id2) => onClick(id2);
    $$self.$$set = ($$props2) => {
      if ("id" in $$props2)
        $$invalidate(1, id = $$props2.id);
      if ("props" in $$props2)
        $$invalidate(6, props = $$props2.props);
      if ("layout" in $$props2)
        $$invalidate(7, layout = $$props2.layout);
      if ("scales" in $$props2)
        $$invalidate(0, scales = $$props2.scales);
      if ("side" in $$props2)
        $$invalidate(8, side = $$props2.side);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*layout, scales*/
      129) {
        $$invalidate(9, specs = function ssWidth() {
          let obj = {};
          let sb2 = layout.sbMax[S];
          switch (scales.length) {
            case 2:
            case 4:
            default:
              obj.ssw = 46;
              obj.ssm = (sb2 - obj.ssw) / 2;
              obj.bw = 18;
              obj.bh = 18;
              obj.tmp = `50% 50%`;
              break;
            case 3:
              obj.ssw = 54;
              obj.ssm = (sb2 - obj.ssw) / 3;
              obj.bw = 15;
              obj.bh = 15;
              obj.tmp = `33% 33% 33%`;
              break;
          }
          return obj;
        }());
      }
      if ($$self.$$.dirty & /*specs, props*/
      576) {
        $$invalidate(3, ssStyle = `
    grid-template-columns: ${specs.tmp};
    font: ${props.config.FONT};
    width: ${specs.ssw}px;
    margin-left: ${specs.ssm}px;
`);
      }
      if ($$self.$$.dirty & /*layout, props, specs*/
      704) {
        $$invalidate(2, sbStyle = (i) => {
          let sel = i === layout.settings.scaleSideIdxs[S];
          let color = sel ? props.colors.text : props.colors.scale;
          return `
    background: ${props.colors.back};
    line-height: ${specs.bh}px;
    width: ${specs.bw}px;
    height: ${specs.bh}px;
    box-shadow: 0 0 0 1px ${props.colors.back};
    border: 1px solid ${color};
    color: ${color};
`;
        });
      }
    };
    return [
      scales,
      id,
      sbStyle,
      ssStyle,
      ssId,
      onClick,
      props,
      layout,
      side,
      specs,
      click_handler
    ];
  }
  class ScaleSelector extends SvelteComponent {
    constructor(options) {
      super();
      init(
        this,
        options,
        instance$a,
        create_fragment$a,
        safe_not_equal,
        {
          id: 1,
          props: 6,
          layout: 7,
          scales: 0,
          side: 8
        },
        add_css$4
      );
    }
  }
  function create_if_block$5(ctx) {
    let scaleselector;
    let current;
    scaleselector = new ScaleSelector({
      props: {
        id: (
          /*id*/
          ctx[1]
        ),
        props: (
          /*props*/
          ctx[2]
        ),
        layout: (
          /*layout*/
          ctx[0]
        ),
        scales: (
          /*scales*/
          ctx[4]
        ),
        side: (
          /*side*/
          ctx[3]
        )
      }
    });
    return {
      c() {
        create_component(scaleselector.$$.fragment);
      },
      m(target, anchor) {
        mount_component(scaleselector, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const scaleselector_changes = {};
        if (dirty[0] & /*id*/
        2)
          scaleselector_changes.id = /*id*/
          ctx2[1];
        if (dirty[0] & /*props*/
        4)
          scaleselector_changes.props = /*props*/
          ctx2[2];
        if (dirty[0] & /*layout*/
        1)
          scaleselector_changes.layout = /*layout*/
          ctx2[0];
        if (dirty[0] & /*scales*/
        16)
          scaleselector_changes.scales = /*scales*/
          ctx2[4];
        if (dirty[0] & /*side*/
        8)
          scaleselector_changes.side = /*side*/
          ctx2[3];
        scaleselector.$set(scaleselector_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(scaleselector.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(scaleselector.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(scaleselector, detaching);
      }
    };
  }
  function create_fragment$9(ctx) {
    let div;
    let canvas_1;
    let t;
    let current;
    let mounted;
    let dispose;
    let if_block = (
      /*scales*/
      ctx[4].length > 1 && /*showSwitch*/
      ctx[5] && create_if_block$5(ctx)
    );
    return {
      c() {
        div = element("div");
        canvas_1 = element("canvas");
        t = space();
        if (if_block)
          if_block.c();
        attr(
          canvas_1,
          "id",
          /*canvasId*/
          ctx[8]
        );
        attr(
          div,
          "id",
          /*sbId*/
          ctx[7]
        );
        attr(
          div,
          "style",
          /*sbStyle*/
          ctx[6]
        );
        attr(div, "class", "nvjs-sidebar svelte-gpuvhh");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, canvas_1);
        append(div, t);
        if (if_block)
          if_block.m(div, null);
        current = true;
        if (!mounted) {
          dispose = [
            listen(
              div,
              "click",
              /*onClick*/
              ctx[9]
            ),
            listen(
              div,
              "mouseover",
              /*onMouseOver*/
              ctx[10]
            ),
            listen(
              div,
              "mouseleave",
              /*onMouseLeave*/
              ctx[11]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (
          /*scales*/
          ctx2[4].length > 1 && /*showSwitch*/
          ctx2[5]
        ) {
          if (if_block) {
            if_block.p(ctx2, dirty);
            if (dirty[0] & /*scales, showSwitch*/
            48) {
              transition_in(if_block, 1);
            }
          } else {
            if_block = create_if_block$5(ctx2);
            if_block.c();
            transition_in(if_block, 1);
            if_block.m(div, null);
          }
        } else if (if_block) {
          group_outros();
          transition_out(if_block, 1, 1, () => {
            if_block = null;
          });
          check_outros();
        }
        if (!current || dirty[0] & /*sbStyle*/
        64) {
          attr(
            div,
            "style",
            /*sbStyle*/
            ctx2[6]
          );
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        if (if_block)
          if_block.d();
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function instance$9($$self, $$props, $$invalidate) {
    let sbStyle;
    let scale;
    let width;
    let height;
    let { id } = $$props;
    let { props = {} } = $$props;
    let { layout = {} } = $$props;
    let { side } = $$props;
    let { scales = [] } = $$props;
    let layers = [];
    function setLayers($layers) {
      layers = $layers;
    }
    let meta = MetaHub$1.instance(props.id);
    let events = Events$1.instance(props.id);
    let S = side === "right" ? 1 : 0;
    let sbUpdId = `sb-${id}-${side}`;
    let sbId = `${props.id}-sb-${id}-${side}`;
    let canvasId = `${props.id}-sb-canvas-${id}-${side}`;
    let showSwitch = false;
    let showPanel = true;
    events.on(`${sbUpdId}:update-sb`, update2);
    events.on(`${sbUpdId}:show-sb-panel`, (f) => showPanel = f);
    let canvas;
    let ctx;
    let mc;
    let zoom = 1;
    let yRange;
    let drug;
    let updId;
    onMount(async () => {
      await setup2();
    });
    onDestroy(() => {
      events.off(`${sbUpdId}`);
      if (mc)
        mc.destroy();
      clearInterval(updId);
    });
    async function setup2() {
      [canvas, ctx] = dpr.setup(canvasId, layout.sbMax[S], layout.height);
      update2();
      if (scale)
        await listeners();
      if (props.config.CANDLE_TIME && props.timeFrame >= Const.MINUTE) {
        let dt = Const.SECOND / 5;
        updId = setInterval(update2, dt);
      }
    }
    async function listeners() {
      const Hammer = await Promise.resolve().then(() => hammer$1);
      mc = new Hammer.Manager(canvas);
      mc.add(new Hammer.Pan({
        direction: Hammer.DIRECTION_VERTICAL,
        threshold: 0
      }));
      mc.add(new Hammer.Tap({
        event: "doubletap",
        taps: 2,
        posThreshold: 50
      }));
      mc.on("panstart", (event) => {
        if (!scale)
          return;
        let yTransform = getYtransform();
        if (yTransform) {
          zoom = yTransform.zoom;
        } else {
          zoom = 1;
        }
        yRange = [scale.$hi, scale.$lo];
        drug = {
          y: event.center.y,
          z: zoom,
          mid: math.log_mid(yRange, layout.height),
          A: scale.A,
          B: scale.B
        };
      });
      mc.on("panmove", (event) => {
        if (drug) {
          zoom = calcZoom(event);
          events.emit("sidebar-transform", {
            gridId: id,
            scaleId: scale.scaleSpecs.id,
            zoom,
            auto: false,
            range: calcRange(),
            drugging: true,
            updateLayout: true
          });
          update2();
        }
      });
      mc.on("panend", () => {
        drug = null;
        if (!scale)
          return;
        events.emit("sidebar-transform", {
          gridId: id,
          scaleId: scale.scaleSpecs.id,
          drugging: false,
          updateLayout: true
        });
      });
      mc.on("doubletap", () => {
        events.emit("sidebar-transform", {
          gridId: id,
          scaleId: scale.scaleSpecs.id,
          zoom: 1,
          auto: true,
          updateLayout: true
        });
        zoom = 1;
        update2();
      });
    }
    function update2($layout = layout) {
      if (!$layout)
        return;
      $$invalidate(0, layout = $layout);
      scale = getCurrentScale();
      if (!scale) {
        return sb.error(props, layout, side, ctx);
      }
      sb.body(props, layout, scale, side, ctx);
      ovDrawCalls();
      if (id)
        sb.upperBorder(props, layout, ctx);
      if (props.cursor.y && props.cursor.scales && showPanel) {
        if (props.cursor.gridId === layout.id) {
          sb.panel(props, layout, scale, side, ctx);
        }
      }
    }
    function ovDrawCalls() {
      for (var l of layers) {
        let ov = l.overlay;
        if (ov.drawSidebar) {
          ov.drawSidebar(ctx, side, scale);
        }
      }
    }
    function resizeWatch() {
      if (!canvas)
        return;
      dpr.resize(canvas, ctx, layout.sbMax[S], layout.height);
      update2();
    }
    function calcZoom(event) {
      let d = drug.y - event.center.y;
      let speed = d > 0 ? 3 : 1;
      let k = 1 + speed * d / layout.height;
      return Utils.clamp(drug.z * k, 5e-3, 100);
    }
    function calcRange(diff1 = 1, diff2 = 1) {
      let z = zoom / drug.z;
      let zk = (1 / z - 1) / 2;
      let range = yRange.slice();
      let delta = range[0] - range[1];
      if (!scale.log) {
        range[0] = range[0] + delta * zk * diff1;
        range[1] = range[1] - delta * zk * diff2;
      } else {
        let px_mid = layout.height / 2;
        let new_hi = px_mid - px_mid * (1 / z);
        let new_lo = px_mid + px_mid * (1 / z);
        let f = (y) => math.exp((y - drug.B) / drug.A);
        range.slice();
        range[0] = f(new_hi);
        range[1] = f(new_lo);
      }
      return range;
    }
    function getCurrentScale() {
      let scales2 = layout.scales;
      let template = layout.settings.scaleTemplate[S];
      let s = scales2[layout.settings.scaleSideIdxs[S]];
      if (s && template.includes(s.scaleSpecs.id)) {
        return s;
      }
      return null;
    }
    function getYtransform() {
      if (!meta.yTransforms[id])
        return;
      let scaleId = scale.scaleSpecs.id;
      return meta.yTransforms[id][scaleId];
    }
    function onClick(e) {
      if (!scale)
        return;
      events.emitSpec("hub", "set-scale-index", {
        paneId: id,
        index: scale.scaleSpecs.id,
        sideIdxs: layout.settings.scaleSideIdxs
      });
    }
    function onMouseOver() {
      $$invalidate(5, showSwitch = true);
    }
    function onMouseLeave() {
      $$invalidate(5, showSwitch = false);
    }
    $$self.$$set = ($$props2) => {
      if ("id" in $$props2)
        $$invalidate(1, id = $$props2.id);
      if ("props" in $$props2)
        $$invalidate(2, props = $$props2.props);
      if ("layout" in $$props2)
        $$invalidate(0, layout = $$props2.layout);
      if ("side" in $$props2)
        $$invalidate(3, side = $$props2.side);
      if ("scales" in $$props2)
        $$invalidate(4, scales = $$props2.scales);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty[0] & /*layout, props*/
      5) {
        $$invalidate(6, sbStyle = `
    left: ${S * (layout.width + layout.sbMax[0])}px;
    top: ${layout.offset || 0}px;
    position: absolute;
    background: ${props.colors.back};
    height: ${layout.height}px;
`);
      }
      if ($$self.$$.dirty[0] & /*layout*/
      1) {
        scale = getCurrentScale();
      }
      if ($$self.$$.dirty[0] & /*layout*/
      1) {
        $$invalidate(14, width = layout.width);
      }
      if ($$self.$$.dirty[0] & /*layout*/
      1) {
        $$invalidate(13, height = layout.height);
      }
      if ($$self.$$.dirty[0] & /*width, height*/
      24576) {
        resizeWatch();
      }
    };
    return [
      layout,
      id,
      props,
      side,
      scales,
      showSwitch,
      sbStyle,
      sbId,
      canvasId,
      onClick,
      onMouseOver,
      onMouseLeave,
      setLayers,
      height,
      width
    ];
  }
  class Sidebar extends SvelteComponent {
    constructor(options) {
      super();
      init(
        this,
        options,
        instance$9,
        create_fragment$9,
        safe_not_equal,
        {
          id: 1,
          props: 2,
          layout: 0,
          side: 3,
          scales: 4,
          setLayers: 12
        },
        null,
        [-1, -1]
      );
    }
    get setLayers() {
      return this.$$.ctx[12];
    }
  }
  function create_if_block$4(ctx) {
    let div;
    return {
      c() {
        div = element("div");
        attr(
          div,
          "id",
          /*stubId*/
          ctx[3]
        );
        attr(
          div,
          "style",
          /*stubStyle*/
          ctx[1]
        );
        attr(div, "class", "nvjs-sidebar-stub svelte-yr5ja6");
      },
      m(target, anchor) {
        insert(target, div, anchor);
      },
      p(ctx2, dirty) {
        if (dirty & /*stubStyle*/
        2) {
          attr(
            div,
            "style",
            /*stubStyle*/
            ctx2[1]
          );
        }
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
      }
    };
  }
  function create_fragment$8(ctx) {
    let if_block_anchor;
    let if_block = (
      /*layout*/
      ctx[0].sbMax[
        /*S*/
        ctx[2]
      ] && create_if_block$4(ctx)
    );
    return {
      c() {
        if (if_block)
          if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if (if_block)
          if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
      },
      p(ctx2, [dirty]) {
        if (
          /*layout*/
          ctx2[0].sbMax[
            /*S*/
            ctx2[2]
          ]
        ) {
          if (if_block) {
            if_block.p(ctx2, dirty);
          } else {
            if_block = create_if_block$4(ctx2);
            if_block.c();
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching) {
          detach(if_block_anchor);
        }
        if (if_block)
          if_block.d(detaching);
      }
    };
  }
  function instance$8($$self, $$props, $$invalidate) {
    let stubStyle;
    let { id } = $$props;
    let { props = {} } = $$props;
    let { layout = {} } = $$props;
    let { side } = $$props;
    let S = side === "right" ? 1 : 0;
    let stubId = `${props.id}-stub-${id}-${side}`;
    $$self.$$set = ($$props2) => {
      if ("id" in $$props2)
        $$invalidate(4, id = $$props2.id);
      if ("props" in $$props2)
        $$invalidate(5, props = $$props2.props);
      if ("layout" in $$props2)
        $$invalidate(0, layout = $$props2.layout);
      if ("side" in $$props2)
        $$invalidate(6, side = $$props2.side);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*layout, id, side, props*/
      113) {
        $$invalidate(1, stubStyle = `
    left: ${S * (layout.width + layout.sbMax[0])}px;
    top: ${layout.offset || 0}px;
    width: ${layout.sbMax[S] - 1}px;
    height: ${layout.height - (id ? 1 : 0)}px;
    position: absolute;
    border: 1px solid;
    border-${side}: none;
    border-bottom: none;
    /* TODO: remove to-boder, it's in the pane now */
    border-top: ${id ? "auto" : "none"};
    border-color: ${props.colors.scale};
    background: ${props.colors.back}
`);
      }
    };
    return [layout, stubStyle, S, stubId, id, props, side];
  }
  class SidebarStub extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$8, create_fragment$8, safe_not_equal, { id: 4, props: 5, layout: 0, side: 6 });
    }
  }
  const king = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAlJQTFRFAAAA7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIoTJ5QQQAAAMZ0Uk5TAAiA1fv+35cTG9b/6jUH0+4caZ0M7Lyi/SZztQGHmAMaz/czEuU2ePqsfZ4EHfUtD+LoPCdihoRgKH+ldaMFVoltCnDkbg0i1/Le60JVzfGOFQKhmwuSX7IGd8ov4e9T84zE7fmTirgJSNkjMWE0EPRZPulDGakpmWfmQFB5w2TdKr3cP03LW3xXwERH1HZS9lrwEbP4Xfw9ZtqITIXCsY8ukaCBNzDIqItUHiuCxxa2a0Y5MpXnLGO/ciVvyachGH6wxh8ghaUgOQAAA1FJREFUeJxjYBgFo2AUjATAyMTMwsrGzkGufk4ubjDg4SVPPx8/NxQICJJlgBA3HAiTo19EFKRVTJwVSEpIkmGAFEi/tAyDLIiWkydZv4IiUJ+SMgODiiqQoapGsgHqGkB9miCWFsgJ2jok6tcFRYGePohpYAhkGhnjUy1jYmpmbmGJ7E8rFqAuawjbBuQEWzsk9YL2TA6OynARJ2cXkBI2Vze4EncPoICnCYQj4gXkePvAJe18/SSAIv4BgRB+UDArJLZZQkJhVgSAhMJgOsJBshGRUJ5OlB40eUSLgAV8JWDphSUMGlQxsUBeXCDMAB1QgHjGQw13TIAnsESwSBKIKZoMIlNcweEgkwpyQBrC0/YgfnoGWC4zDqTSXxWsCywLclBWdg7YHKXcIKBIHihMRPMRBsj7AQUKCkHMomJweJWUloFosCyIYcXAUA5SxF3gG8QgU8EKdx4UVIJExIDBzgsO76pqGYYaFANqgbRlHYjlWR8k6Q2kGxqRDQhsAjkvk8EHlCa4m1uA7mzFMIAhpg3ETG5nB1EdqKm/E5QuurqbQVKGPSB/YjFARq0XxI4DB4oJin4GjnRQGBuB5I1qwGZjMYAhqMgbFkF96NmvPwUqM2EiJK6xGcAQFD8Jooo5G00/w+QpEJmpNtAEhdUABvlpkFTiHIRuAEOrEkhCg4mRAZ8BQKdOAKXRUgz9DE62QInpHTIMBAxgsJjKzRqOqZ+BYYYet0QaImhwGsAwcxZ7PgMWEGnjNRspT+M2gEgw8AbModSA6lEDBp0Bc0k3oAduACgD85PcDmLUhhswD8SaX45ZAuADggtA5XQymN0+HWTCrNqFTsTqjpQUigaXO4vAXJnFkMKqwG/J0kCC7pCZvEyqDlrwLYda6bQCVjumxNatXLVwdT7W1oS8m+Ca1rVNDUqwgnfdepgUnzMPNwKk8DQrbghZsrFz02blLfr6Ocp5m1bN7Nga0ZZlpISkzDPAAMn01Qu2sXJjAawpKRLYxLmTrbejOVB3x85i7GoxTU1evmu3DAMG0NGt3rN4rwB+zf6K+/p69vPhDGO7A2u6TQ9WHEriqkpA1jfBKOvwFOEllT36nIw4NSNAkEjgEUl9ZSSw0PLoejfSG5t0AQDCD8LOo5GzAgAAAABJRU5ErkJggg==";
  const king2 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAlJQTFRFAAAA7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIo7pIoTJ5QQQAAAMZ0Uk5TAAiA1fv+35cTG9b/6jUH0+4caZ0M7Lyi/SZztQGHmAMaz/czEuU2ePqsfZ4EHfUtD+LoPCdihoRgKH+ldaMFVoltCnDkbg0i1/Le60JVzfGOFQKhmwuSX7IGd8ov4e9T84zE7fmTirgJSNkjMWE0EPRZPulDGakpmWfmQFB5w2TdKr3cP03LW3xXwERH1HZS9lrwEbP4Xfw9ZtqITIXCsY8ukaCBNzDIqItUHiuCxxa2a0Y5MpXnLGO/ciVvyachGH6wxh8ghaUgOQAAA1JJREFUeJxjYBgFo2AUDAHAyMTMwsrGzkGufk4ubjDg4SVPPx8/NxQICJJlgBA3HAiTo19EFKRVTJwVSEpIkmGAFEi/tAyDLIiWkydZv4IiUJ+SMgODiiqQoapGsgHqGkB9miCWFsgJ2jok6tcFRYGePohpYAhkGhnjUy1jYmpmbmGJ7E8rFqAuawjbBuQEWzsk9YL2TA6OynARJ2cXkBI2Vze4EncPoICnCYQj4gXkePvAJe18/SSAIv4BgRB+UDArJLZZQkJhVgSAhMJgOsJBshGRUJ5OlB40eUSLgAV8JWDphSUMGlQxsUBeXCDMAB1QgHjGQw13TIAnsESwSBKIKZoMIlNcweEgkwpyQBrC0/YgfnoGWC4zDqTSXxWsCywLclBWdg7YHKXcIKBIHihMRPMRBsj7AQUKCkHMomJweJWUloFosCyIYcXAUA5SxF3gG8QgU8EKdx4UVIJExIDBzgsO76pqGYYaFANqgbRlHYjlWR8k6Q2kGxqRDQhsAjkvk8EHlCa4m1uA7mzFMIAhpg3ETG5nB1EdqKm/E5QuurqbQVKGPSB/YjFARq0XxI4DB4oJin4GjnRQGBuB5I1qwGZjMYAhqMgbFkF96NmvPwUqM2EiJK6xGcAQFD8Jooo5G00/w+QpEJmpNtAEhdUABvlpkFTiHIRuAEOrEkhCg4mRAZ8BQKdOAKXRUgz9DE62QInpHTIMBAxgsJjKzRqOqZ+BYYYet0QaImhwGsAwcxZ7PgMWEGnjNRspT+M2gEgw8AbModSA6lEDBp0Bc0k3oAduACgD85PcDmLUhhswD8SaX45ZAuADggtA5XQymN0+HWTCrNqFTsTqjpQUigaXO4vAXJnFkMKqwG/J0kCC7pCZvEyqDlrwLYda6bQCVjumxNatXLVwdT7W1oS8m+Ca1rVNDUqwgnfdepgUnzMPNwKk8DQrbghZsrFz02blLfr6Ocp5m1bN7Nga0ZZlpISkzDPAAMn01Qu2sXJjAawpKRLYxLmTrbejOVB3x85i7GoxTU1evmu3DAMG0NGt3rN4rwB+zf6K+/p69vPhDGO7A2u6TQ9WHEriqkpA1jfBKOvwFOEllT36nIw4NSNAkEjgEUl9ZSSw0PLoejfSG5tDAwAAOwrCzjMUsXkAAAAASUVORK5CYII=";
  const king3 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAABVxJREFUeJztmlmoVlUUx/30XjVLnFC0bJTsWlmZQwRlYlE+FIR2jQzRBpSISooGobKi0aLoRlSEUolU0EMDRQ9JUdFgiA9NFA0oDTfLVTaZZdb/39oXD/tb55x9vnvOPUp7wQ/u/c4e1lpnT2et3a9flChRokSJEiVKlChRokSJEiVKxSJdHYPBTeBD8BfYBb4ED4FRdetXqcDAA8BH4J8UtoDpdetZicCwQeD9DON7EDC+bn1LFxh1SYDxPayqW99SBQbtB34wDH0FPOHWgeTvf4OJdetdmsCYqwzjXwQN9/wO4/nDYEDduvdaYMT+YKNn3HYwNVFmJPjaK8P/Z9SpeykCI64Df3rGPWOUu8EYBatBWx16lyJQ/kBj5f8NTDbKDgObvbLd4KS+VroBjgAXgtvBrWAx6Cg6J1F+hTvsJI1am1H+amMUrAHtBfUfD+aLHrjuApdxyuW2gwJDwDLwlaEIT2uXg6GBihwGPvba+JnOzajD3eILr873YHZgn+2gE2xwO0mynW3gXjA6rXJ/8LixJSXh23wU7JujSMN15rfVFWDEIqPf58HAnHpt4Fo3xbLOGOvpaKuBTsNraU7oylqc8OxYsMmr92Oq95sN8dcNjpx5GXUabpj/EqA/ucdq5E2jIA8vW43fd7jp0LQmOGUeMN7+yjzjE23MN+q/DPZJ6W+Oc7CvJ4e9v73+Z5fVqT90PgETwJQU53AvvwD099qZJs1rCB05vIADBojO42Qbv4LzjLIzwXeGflyzTgXjwNP+c6tTv4EViWeTDIV6lOrscYJ7G48Yb695yOU7YanRDo/O7Yky0w1nk2/ALNl90jy7FQcs955zG3zDKMf5ebHoIjpRdNVOPv8cHNmCA0aDdcaom+Oez5bmcwP5DJySHJn4+6xeO8CV4eL2nlGW68T5okEN/9n10uKZHvXOleZzxGvgNGeo3xcdcoY0T8vSHMAhPgN8YJTnImStI6n7foADRokufv4C3G303+2GurUwl+MAV45DfaYx1C2uafXtJ/qb64zO6ud3sEBStuZSHZBwwjzwU4ZSjPlN6I3xrq8R4IWMfv4QPUKnHpRKd4Arz61qoaQfPpb5c7FVcQZsN/rgVybP+4MD6pfrgES9uW4IJuvyuDmuRXutPviNssbrY6foAtsIqF+dA1zdxW4osh737kUFbQzp42TZvcjyyL4ydH2p3AGu/hLwqehWGHzqK9D+QDfX+bV4pxT7RK7eAXuyRAdEB3Sc+X93wKzogOiA6IDogOiA6IBiDritBl0rEdEoUa4D/M9axub3+js7oneSVoc44HVjFDwnGhEu5bu+r0U0R3ifNEeXt1qFGdTcaTiBX3jLwTFgSA12FBLRr0ZGp3klZ71hD7nfqsiA52MpFQhzAMwN3AxOEA1b1z4ynN4Mmx0nehOFofusUN07qS9SNPLylOTnCBmk3OQ6uxuc40bIQWC4VHCpQTQEN9QN66NEv/BuEc0dMPdghcx83gZj8jridTbG87YENOg7hXUYr+eVmJdEM8kcMZeKxvhPByeK5uqPB5MdU9xv01wZOpQBFoa8HhTNDjMfwTB7d6CxSZi8YbZ6WBGP821yAflWslPmrbLLOW1HwIhrFSZs1oKjezP0eM3lIvCqaBKyKmXLciqN5jy/EhwuAUHTUEe0OWfwVHWF6IL5rujNzroMZvqb0+1J0SQMDzyHgkGlGJ3jEF5HGSu6IDFXxztFN4pmh58VTanzXjAztaEXF5Iw1M75znn/lmhyZJXomrLUGcv1g/ePM/MCfSqiWSPe9eE2ebDonkxFpxaEuwoz0oeAMaI7wN5/cXJPk38Bz1zMtWby+i0AAAAASUVORK5CYII=";
  const icons = {
    "open-eye": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAelQTFRFAAAAmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYMxdw0QAAAKN0Uk5TAB1Pq7bV/v/5xZFHCw6h6NOCOQMRbNGwTgdo7PPOlIAlJDOSoNr7w0FL1+ubRRgCIVqz/CIKkPbpexsBPOFcJ/WDCBm5mULqye/BYocVtyxQDDIFjCpyslXi8j70d17PH5cEU+54V4anWUmeUmuatBS4c6ac58cgW/1Gsc0PE+Znn+S1Ott9LfAaEmlRFi+kxiNUNEhtK7p6nUzWcWEu2aKt90TEJrgAAALFSURBVHic7VZrWxJBFF5pdbxkRWkKSolGRYmhZBkYoWSIRaFkXjIx7GIWXSktzS6opVlJZvf7L+3MLpszuzvL9jz1bd8vMO8579mZMzPnDMcZMGDgPyPPtI7PL0CosIgvLln/l+JS04aNiMIm8+YtuuVl5VuRCioqLbrkFmuV4F9t27a9xg6ordvh2ClQu3br0Dv3YNe99a4GgtznbmzCtIffn0PefOAg+LUc8iosvtZ6PI3Dfk39ERv4BNra1a3Bo3gWHc1s/bEQOHS62Q7OMDh0NbDMxwPw+ROaU4ychAiOU+pGK9jCUTnb3RMkh7HTkIlAr5r+TCFC+cokt3dW97mIsa8f5jlQq9T3DIJeLfJZhIbOxQhiGCLEu+VuvZCe0IjazDh8As4nCGIUCF6+F7B/FyKqem4Yb95FkrkExGXaaQwyc0Vdz43jAAHqaF0F5hpJmIBIMvRiAHSdpCw3IGTZ2vgmJOBWTC6UcFsIEKY4Lxy5O2vDFEJ3R1h67p54mycocvI+QqPS4AFcICtT78+Wg3GankJo+mH2vyugEWCmhRkgLgXAS3hEL+HxkxnhN+F8KhUkegl+cgmcF5KYppI4i+bmn9nt/WMFkv45pV+AJFYQ4yh4lFMeVfKK2EFaLWnYxkWSwQdpkiReyPTKg7REfZCLw1F+SRJddIBcR5l7BTsRIi/DxACpf01eJnw0lxWFTXGdI00eSa7nOmcLSoYgYkmbsAdDdEF5gwvKilKvWtIyb1eTK3pLWraoypNDI5LGRfUdy1yJy3pao/k4Hbis17AdxMZiZjTR4HuckpRGY4HWVoxbW+jDgtLU+tGTu7UBPn0WmmuKaq4+d2Of0FzTGabwDyzz4j0YXP7yFXd3+7dV83exvU8v5ZZjLKo/MKZ0PjAwSk0/FE+c2URuHYW86E8ePzZ+FfF1JZqZN2DAwL/Ab6ixeYt2jKORAAAAAElFTkSuQmCC",
    "closed-eye": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAblQTFRFAAAAmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYZNB/+AAAAJN0Uk5TAB1Pq7bV/v/5xZFHCw6h6NOCOQMRbNGwTgdo7PPOlIAlJDOSoNr7w0FL1+ubRRgCIVqz/CIKkPbpexsBPOFcJ/WDCBm5mULqye/BYocVtyxQBYwqclXiMvLkrF7PDB/9U+5XhqdZnlJrtBS4ppznW0axzQ/mtRoSURYvScYjMFQ0K7p6nUzWsn1xYS5t2aI6BK33FoqWFQAAAl5JREFUeJxjYBgFo2AU0BgwMjGzsLKxs3NwsnBx85ComZeJj58dBQgICgkTrV1EVIwdCxCXkCRKu6SUNFi9jKycvIIiECgpq6iqgYXUNYjQr6kFUqqto6uHJKhvYGgEEjZmMSGg3dTMHKjOwtIKQ8baRgfkDFs7vPrtZYFqHBydsMs6u4Bc4WqKW7+bO1CBhwFuBZqeQAVeerikvR2A1vvgdaKvH9AEVX/sklJAOc8AvPoZGAKDgCHhEIxNKoSDnZ2VUCADAzMU6M4wJUyJ8AigfgyTmSOjrNHFooEmxMSiiwYDg8c9DsPYeHZ2DAMYEoB+ZUGPC2D8JfpiugurAQxJQBOSUYVSgCGTiqkShwEMaUAT0pEFmIACGVgU4jJAMhNooQiCnwUMgOxAEgxgsAImuRwEN5edPQ8zAPEZwJAPlEmAcQqAGUgKqzLcBjAUsrMXFUPZug7kGRADMwDkhRISvWCH7AUGK2AglpIUiGXAQBRH4gcAo1GUBAMkS4HRWI4sAkpI+cQbAEpIFahCMcCkXEmsAViSMkMVMCbcMTMDVgOqgfprMAo27NkZmwHYszO0QKlFE3Suc0YTsa4HFSgNmPopL9KghSp64KAC31JQodqIS1oCVKyX4ikXNVVBxboCbgWQikUQRyXq3ASqWHLxVCzAqo0LVLW5N5dhStm0GBOu2oCgtQ1cueaiVK7WBobt4Mq1FD2asADJDkj1HlHT2QWq3RW7ewR7IdV7UQVh7SBQjr2BUUhkAwMEeJn6MJo4/ROI1g4BjAETWUCNjUmcLMrceEN+FIyCUUANAAAY0GNbcYUV2AAAAABJRU5ErkJggg==",
    king,
    king2,
    king3
  };
  function add_css$3(target) {
    append_styles(target, "svelte-1cdflqk", ".nvjs-eye.svelte-1cdflqk{width:20px;height:20px;float:right;margin-right:2px;margin-left:7px}.nvjs-eye.svelte-1cdflqk:hover{filter:brightness(1.25)}");
  }
  function create_fragment$7(ctx) {
    let div;
    let mounted;
    let dispose;
    return {
      c() {
        div = element("div");
        attr(div, "class", "nvjs-eye svelte-1cdflqk");
        attr(
          div,
          "style",
          /*eyeStyle*/
          ctx[0]
        );
      },
      m(target, anchor) {
        insert(target, div, anchor);
        if (!mounted) {
          dispose = listen(div, "click", stop_propagation(
            /*onDisplayClick*/
            ctx[1]
          ));
          mounted = true;
        }
      },
      p(ctx2, [dirty]) {
        if (dirty & /*eyeStyle*/
        1) {
          attr(
            div,
            "style",
            /*eyeStyle*/
            ctx2[0]
          );
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        mounted = false;
        dispose();
      }
    };
  }
  function instance$7($$self, $$props, $$invalidate) {
    let display;
    let state;
    let eyeStyle;
    let { gridId } = $$props;
    let { ov } = $$props;
    let { props } = $$props;
    let { height } = $$props;
    let events = Events$1.instance(props.id);
    function update2() {
      $$invalidate(7, display = ov.settings.display !== false);
    }
    function onDisplayClick() {
      events.emitSpec("hub", "display-overlay", {
        paneId: gridId,
        ovId: ov.id,
        flag: ov.settings.display === void 0 ? false : !ov.settings.display
      });
    }
    $$self.$$set = ($$props2) => {
      if ("gridId" in $$props2)
        $$invalidate(2, gridId = $$props2.gridId);
      if ("ov" in $$props2)
        $$invalidate(3, ov = $$props2.ov);
      if ("props" in $$props2)
        $$invalidate(4, props = $$props2.props);
      if ("height" in $$props2)
        $$invalidate(5, height = $$props2.height);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*ov*/
      8) {
        $$invalidate(7, display = ov.settings.display !== false);
      }
      if ($$self.$$.dirty & /*display*/
      128) {
        $$invalidate(8, state = display ? "open" : "closed");
      }
      if ($$self.$$.dirty & /*state, height*/
      288) {
        $$invalidate(0, eyeStyle = `
    background-image: url(${icons[state + "-eye"]});
    background-size: contain;
    background-repeat: no-repeat;
    margin-top: ${(height - 20) * 0.5 - 3}px;
    /* FIX 'overflow: hidden' changes baseline */
    margin-bottom: -2px;
`);
      }
    };
    return [eyeStyle, onDisplayClick, gridId, ov, props, height, update2, display, state];
  }
  class LegendControls extends SvelteComponent {
    constructor(options) {
      super();
      init(
        this,
        options,
        instance$7,
        create_fragment$7,
        safe_not_equal,
        {
          gridId: 2,
          ov: 3,
          props: 4,
          height: 5,
          update: 6
        },
        add_css$3
      );
    }
    get update() {
      return this.$$.ctx[6];
    }
  }
  const logo = [
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVQAAAC0CAMAAAD8fySxAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAvpQTFRFAAAA///////////////+/////////////////////////////v/////////////////////////////////////////////////////////////////////////////////+//////////7////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7////////+///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+///////////+//////////////////////////////////7////+////poUcigAAAP50Uk5TAD1AGUAtKyYkC/+5/5qTrNlmOjU5b2nMT+EDZMFjRT//7MT/aI+NGhUIM+YFusm38+0srmrkTcVMH/7Ql2yZa1RwbYwU+dcBYEODjlyKG+7dArTj3sbl6+KbWHE4MtLnB0ZHQnOGHbgKsCV0e9qi8A78nJ/7doIudWL0EksM8ngcIO/3F+p6ktbHi2Gdqzdyy/xVTsB9oX/9IanTyCemlYE2fBAPUUhSHii2pYTgz9TfRJ6qI4BJVoh39hO1U9gFW/lfSloqMMrcXaCykTQYeV69iaeUlpCYszs8r+jpBIUphyKxV6TRzTGovNvOo60b+sIwL1lQu7/VQRaEK34VtNnHAAAOsUlEQVR4nO2debxVVRWATxIqVwiNUAEzyKEgUEJTccoJUBwCsnBIRVNBFIGcQRMjE8kpzACnUFMTFedUUiMnHFIUCi0snzln2qCVTb9f77x3731nWHuvb+97zn39sb8/FPTstdfaZ9+z1jl77bWjKBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCDQCB9Zy0aXAqV9tP1fXZPXr23tvYN1/IxbV1JAoKsuyoVuFSvrOUrrbhcX0yPZ4GP69W309LNufSh+Az/xJj6udNfLSdongAG9kw02hFZv5GXcxlB6n75e4o30U/rbxEnaJ4EFmyYbfMp0Vf/0Xwd4GfdpoxKbpf62uZd0M1s4jYHGlpq0Vj6TbPBZYHIbAz1sGwS0ifncYA/hNoZkOuiftWgrF2lb6xYMTbf4PDR8mIdt20DZ23rItvIFtcvtHKT10S3YPt1iE2j4Du6mDd+RiS58oirOP2anQqWlnX8U7Zz4X8Kvvs4u7rbtmmje8YjOxydfdBdth7jr3bC0XpqoVot2TzfZAygQs6ezaXuNYJILn6iq848ZOYpK2xtIyzi+fZjlHoHqaCh5D2fJGvtWctFLnv2otP1zTdt+0alf3AHpJl2g6c6B6sAvWaQlTC5+okbrEYPGjIXSxumyhmbbDCUaeASq0nNFemj31kW58mVkUT8o7UBd1FeybbZHGjgHqqO+mmlv+D2OL36imt11SoeDWM+DwdgcnG10MGgU4xioHkJktj6XDnUTS/gatIhFHYcBSTkjDtVaVH+zjoHq4cyw8T5vagrkXT3miAlE2n5A0pHZRkdBFdwC1a/XmvVP/FPgaCepjH2hRazzY4CgA7KNjoUauAWqlvflpLcqY6JGE6FFlQGTgLTjdDk554/dv1OgOhmadbyLUApz/jEnAGlTKmrQm3P+UbQVU8ApUD2RySxlopJ39SpTp6nSBk/XxXwj3+wkpoBLoNrlZCbzFAeZmNj5q+9TVU5VpZ0GpAgRzOlQAYdZtSeTWMpEjc6w9pn+njNjpiaNhIZH5Zudmb9KvNE8UD3rm0CTVs52GiwK+VBfZ39N2qlAyKx8s3Ng/2dis05hAr/VzWWsMOBDfQezv61I66nLEJx/FMFPdPizZ99zmcDvOI0V5iDWe5XzFGlzdBHnS+02Yt3PpVZ9N9PQ4DVKmqjdtH7TjLBP1bHA+V8gNazHP7Yv/5XKhdQsbbG/aiwJEj24SB+FFLtapa0NJFwsNTyb9X4JtKru+Oz3qKSJqjj/PN+bZZM2D0gQnH8UXcp6Hw+t+j4Td5nraEHs4Zxwo39gkzYfWHKs1HBdNgowUB3EhJU1UZPOn70CLFhokXa53l50/or774iW10ZGXYgsqcx3Hy4GWKXPcLlF2hWpK8UH2pVyy51Y5yhQHb4AyRpa1kR1ePOvc5VRmrfzj6KrWd8oUP0hk7XIZ8AI17D+UxxnlHYVaG34Kntt7kJxnpNA9Tr2JjH0R35DppMNkjXaLD3NJO16IOEGuemNrH8SqBJv2cpozyHTmcsUSDPRJO2EjmuMXu/HctObWNcgUB2cXuw3RarlTdRoMbMlgykL+Ga9qcH5S49j6b6AQHVbY98pgbf4DpnOrfowZIjDG1MW8BK9uTEr8zbWvRqojro9viw/PzP/pcSJ6uP8Y+6QxQEPcadJlbtYz2qguhuTc4z/oGnYUvRs7wLyfLsbGGNcZruHDYYaqF6CxJQ4UVGKHrdtO9DwJyZV7mUda4GqcQNBmvsaGjY7c5kKecQs4PsrUj5tGoPzj6JhrGMtUAX5ca0s/WlDw2bnAWaJwIOCNLAobHL+7G2sogaqk1k6uros1Ajuzr+GlAUcf763f8C0bcl4KHGZ+XmuBKp3IuVLnag/QyrILMuL+7ne6iSzMmwfyblWg/ZKLvab7y9elfFBcv40ByCfBWxeEu3YQ2TJsbmF9WsNVO/LXy885EudqNHDzA6ZM7LSHgGNHjEr8yjr9jGLPXCxf8sChs5MPj/fgVwW8PGg0XCzMo+zbi23JToaSSh3osL4w0R2kxxwEmbnz3KwhV4T9M2mo8tsUcTQmbmd2WEgmwV8pd5kuU2bJ1CvlmjoSSRgRLkTFc4NI5nFZpBk+pRNnadRp3eZBbCd/b8oYujMPIOUiJFDggETktJmATmn29QRXLeAebLfgNqPeLaYwTPRkPOPWZGUdqT10vaYyuZloudQn+ZA9Xlr1zW0xKVGWZnoC9ToyDM1mbC+O2hwjk0d+MMxBars40HZE7VB5x+zKCGtB7DIqg58xJsC1VXV/2+fHr8savBMgM15CjMSCevmuhp1lBd39iXC8Ajpghb7S5+ojTr/mJUd4kTnn542VucvLJiJ/tEQqJ4n6peV8Kvihk9mEBi0DLlvFLPrCevPgubKpgWWpi8HqtctJW1Ln6jQ2yqsrkkjm/aVtZBqBqIwP5MTXg5U88kYEi8UOoAStbhQ+QRqp54FbCovkRwiW25bRHfJioHqYJSOfrKYcVgoLyIbTNQmT+3m72y9ug2786dru2KgugFq2kNqWixjUoOT/bOAOKWnz2qXBkr2qBv29LJDMVKgir5iNGGiFuH8Y6ouHRSXsuYLx6QLZJlusRCokiQuoc5A8QxCiui0ZwHLZdDSqDsWV8dXqUsPQqCKFvubMFHRzvy9F4GLVsXSyHq7WgOBPRnzgeqvUTtDZmyhkI9C10yaCq6Ks4BJaUnF+UfRb4AQKVAF++GbM1HR58tJie2IZi+2JkJFUDXnT91/Lj+eLfZbFnKLY4yuR58omvAS0Pc083e3BGC3/hGgs3zuAKprs6AZE5U4/8Wt1+0CrtsaDceJulLg1lQqv800YrXn1NCjCEhZnjjp4HekckUv8sO9X1eKVVLOBKovgybdF9xdyihmIM7/4fhCsi1gyQvgIlAAiVVSbkm1GYgW+8HPpABeAZq0paGPMj18XRcLfq8rJQdm2Y7S6Zi9Sd/NmajRq0CV9tWS14jWOrrzN75CZEZ1w2STXO05kdfLGMI8YJX91uqlbxC1Vd4kWsUvu+or1cpkC5Qt1KSJSpz/A9VrdyB6q6CnGqqknApUUe25qwsfP5G3gCr1V5flRPEUwvMWlYABHxDTgeodpEGTJmrN+Vs/UD9cu5i9PiqgYuGoknIyUEXFX98ufPhkSE2+Z+pX/4GoroBmC6uk3BGoosX+HVsKHz4Z4vw7ciV5gpAR4vxpJeWW+vWvk8st6VfF8o6uy4GJy1nymI0/Mr1QKcV6oIpqzzVtohLnPy5xPdl0buddphiqpFwPVFGZUlwiqFGqacs1P5Vz1nGsmAoHV2WvcGWFSZU04henrHo1zc5aWtHD2qZN1GgZGIbnkg0Wsm1OZi5liqmVlGNqgWqm8FJ/8c/vFTx0ZsiXnUGpFhcQay2syxRDlZSrgSpa7G/eREULEOmNEn/6MzHXCHP+sJJyNVBF1bTXFDtwNqbo2ozJNJEzwChLqGbI/bcHqigdvaXAUbNDnP+LmTYzZxsvBYlD+DMRqqTcEl9JNm1XXi1y2OyQPUu53dssJ98AdP6wknJbdZu/kCsfL3LY7JDvZU9mG02bQawwsDFVzVxJOeHc4wP5BpFuny502OwQ539YrtVlxAwD0PmLlZTzxL+i98iFfy1y1BTWAH3yZ6VMGkDsEKHOvzUgJuLehrXnxun9FQdw/k8IzS4mBotg588qKV8Jv7w28YmKqvFLTyOUWVEn+YJzM1fuTVXwZpWXUO25/osLGzHA+1XdbLwiNdxct0TGoaD2u+L4JP/SvTVQJZlzTZ2o0QeSqhnE8+fGgswKceX6b1w5VEn5fLLYv3VR44UgRSDeEluyjcp5JnPl6OHRNczpBxcVNFwMUq5EPiht1EhHk9sZQU8IjPjpPDHWJ9iQgkYLAl6a3zE0fdDB5A4cDrONxsKDFOpkH2K1qdvciUqcv/Gd2SuzwsH5F5W7Ufl74wPlAjmKx1hgkO2qz+B0SEHDiwztNHei1p2/QP2ntMzYenn+YhUH59/Y23AHzzc6So6MBjqZQzyfzIp1XNRrf2ynfBC/fXWaPFEbcP5tTBTMtFvt4vyjqMV9BPP8o9FBcqVeVc88FFMszbs6W/iGk3qwlKKdtRobImeI87eu7LCqfAkck+4+hGItWcfi+UxlQmbayzYBV+W+uinrKde6KQhP6bDxz0YGyIfaOXy29PJHrRLEbx4WrndTEH0ssdL0iYrO4XvfKsE1s8J8MIiIlg+vrzPu08Dw+AHWIRYoR6Tvygazipvz9/GEGZo/UVMldQ2sr4j4l1NmhZvzL8D9b+o7NN4QlbfRhOBTwWNWuaqYu+1uwX8nTFTy41LPwJjpslzt6Pw9YrY04oF35UK2RX2gSvm3g5E3uqoIKynnaXNhML24UIjzNx6OVGcaKQRQxdH553M93OoRGc9nKBFwCK/m/GNWWCXUYuD4YTjd0fnjSsoynTFRo3hBRLn1DwExE3BmxeHOKjZUM8daTrQkiPNHyce9qVP22MXEKimLdMpEJTuP0EltqBBAjMeRrw1shgEb4IsnPk1H21R+CJLUD5opHbOi4J+12SkTFX2t6IokjQVVWGJuclfSv7Yj3K9RMOC72gLhsBkJdoaEu/NP7zB0qtXQORM1mqNrNpLKQpkVV3go6e3+nVYYC4M4/55UGMrQ8drCXK+k7PbW/6FPX43zH6DaqVhashCAyfz/+qi52Gks6zh+DS8KcpTea1gaKWHg4fxpJeUsnTRRxUMfs3NsGBcHdoi0+Kh5RkoEfff3un8FYHL+iYGlzj9GLwTg4/ytlZTNI9xZE5Us/85xkacevXibl5pep+TO8+qqcYjzd9ofr37yztWQZLBKyik6baI+BpS7x0midtzxfD9Fh+QlaW8B3L8WzDwwqPc6SVxo3M/UPgi7+Sm6GiiaxpSmXD7zgXbqGdppnrJLsx10aIFVUk6iLwGVBTib3MX5xxxgfUz7OX+PhM13HNUOBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQOD/kv8BDVonljy6Jq4AAAAASUVORK5CYII="
  ];
  function add_css$2(target) {
    append_styles(target, "svelte-ccr182", ".nvjs-legend-line.svelte-ccr182{pointer-events:all;position:relative;user-select:none;border-radius:3px;padding:2px 5px;margin-bottom:2px;width:fit-content}.nvjs-logo.svelte-ccr182{width:35px;height:20px;float:left;margin-left:-5px;margin-right:2px;opacity:0.85}.nvjs-ll-data.svelte-ccr182{font-variant-numeric:tabular-nums}.nvjs-ll-value{margin-left:3px}.nvjs-ll-x{margin-left:3px}.nvjs-eye.svelte-ccr182{width:20px;height:20px;float:right;margin-right:2px;margin-left:7px}.nvjs-eye.svelte-ccr182:hover{filter:brightness(1.25)}.king-icon.svelte-ccr182{padding-left:8px;padding-right:8px;margin-right:4px;filter:grayscale()}");
  }
  function get_each_context_1(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[45] = list[i];
    child_ctx[47] = i;
    return child_ctx;
  }
  function get_each_context$2(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[45] = list[i];
    child_ctx[47] = i;
    return child_ctx;
  }
  function create_if_block$3(ctx) {
    let div;
    let t0;
    let span;
    let html_tag;
    let t1;
    let t2;
    let t3;
    let t4;
    let current;
    let mounted;
    let dispose;
    let if_block0 = (
      /*ov*/
      ctx[1].main && /*props*/
      ctx[2].showLogo && create_if_block_11(ctx)
    );
    let if_block1 = (
      /*ov*/
      ctx[1].main && create_if_block_10(ctx)
    );
    let if_block2 = (
      /*display*/
      ctx[8] && !/*hover*/
      ctx[3] && create_if_block_3(ctx)
    );
    let if_block3 = !/*display*/
    ctx[8] && !/*hover*/
    ctx[3] && create_if_block_2$1(ctx);
    let if_block4 = (
      /*hover*/
      ctx[3] && create_if_block_1$1(ctx)
    );
    return {
      c() {
        div = element("div");
        if (if_block0)
          if_block0.c();
        t0 = space();
        span = element("span");
        html_tag = new HtmlTag(false);
        t1 = space();
        if (if_block1)
          if_block1.c();
        t2 = space();
        if (if_block2)
          if_block2.c();
        t3 = space();
        if (if_block3)
          if_block3.c();
        t4 = space();
        if (if_block4)
          if_block4.c();
        html_tag.a = t1;
        attr(span, "class", "nvjs-ll-name");
        attr(div, "class", "nvjs-legend-line svelte-ccr182");
        attr(
          div,
          "style",
          /*style*/
          ctx[15]
        );
      },
      m(target, anchor) {
        insert(target, div, anchor);
        if (if_block0)
          if_block0.m(div, null);
        append(div, t0);
        append(div, span);
        html_tag.m(
          /*name*/
          ctx[20],
          span
        );
        append(span, t1);
        if (if_block1)
          if_block1.m(span, null);
        ctx[33](span);
        append(div, t2);
        if (if_block2)
          if_block2.m(div, null);
        append(div, t3);
        if (if_block3)
          if_block3.m(div, null);
        append(div, t4);
        if (if_block4)
          if_block4.m(div, null);
        ctx[35](div);
        current = true;
        if (!mounted) {
          dispose = [
            listen(
              div,
              "mousemove",
              /*onMouseMove*/
              ctx[21]
            ),
            listen(
              div,
              "mouseleave",
              /*onMouseLeave*/
              ctx[22]
            ),
            listen(
              div,
              "click",
              /*onClick*/
              ctx[23]
            ),
            listen(div, "keypress", null)
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (
          /*ov*/
          ctx2[1].main && /*props*/
          ctx2[2].showLogo
        ) {
          if (if_block0) {
            if_block0.p(ctx2, dirty);
          } else {
            if_block0 = create_if_block_11(ctx2);
            if_block0.c();
            if_block0.m(div, t0);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }
        if (!current || dirty[0] & /*name*/
        1048576)
          html_tag.p(
            /*name*/
            ctx2[20]
          );
        if (
          /*ov*/
          ctx2[1].main
        ) {
          if (if_block1) {
            if_block1.p(ctx2, dirty);
          } else {
            if_block1 = create_if_block_10(ctx2);
            if_block1.c();
            if_block1.m(span, null);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
        if (
          /*display*/
          ctx2[8] && !/*hover*/
          ctx2[3]
        ) {
          if (if_block2) {
            if_block2.p(ctx2, dirty);
          } else {
            if_block2 = create_if_block_3(ctx2);
            if_block2.c();
            if_block2.m(div, t3);
          }
        } else if (if_block2) {
          if_block2.d(1);
          if_block2 = null;
        }
        if (!/*display*/
        ctx2[8] && !/*hover*/
        ctx2[3]) {
          if (if_block3) {
            if_block3.p(ctx2, dirty);
          } else {
            if_block3 = create_if_block_2$1(ctx2);
            if_block3.c();
            if_block3.m(div, t4);
          }
        } else if (if_block3) {
          if_block3.d(1);
          if_block3 = null;
        }
        if (
          /*hover*/
          ctx2[3]
        ) {
          if (if_block4) {
            if_block4.p(ctx2, dirty);
            if (dirty[0] & /*hover*/
            8) {
              transition_in(if_block4, 1);
            }
          } else {
            if_block4 = create_if_block_1$1(ctx2);
            if_block4.c();
            transition_in(if_block4, 1);
            if_block4.m(div, null);
          }
        } else if (if_block4) {
          group_outros();
          transition_out(if_block4, 1, 1, () => {
            if_block4 = null;
          });
          check_outros();
        }
        if (!current || dirty[0] & /*style*/
        32768) {
          attr(
            div,
            "style",
            /*style*/
            ctx2[15]
          );
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block4);
        current = true;
      },
      o(local) {
        transition_out(if_block4);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        if (if_block0)
          if_block0.d();
        if (if_block1)
          if_block1.d();
        ctx[33](null);
        if (if_block2)
          if_block2.d();
        if (if_block3)
          if_block3.d();
        if (if_block4)
          if_block4.d();
        ctx[35](null);
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function create_if_block_11(ctx) {
    let div;
    return {
      c() {
        div = element("div");
        attr(div, "class", "nvjs-logo svelte-ccr182");
        attr(
          div,
          "style",
          /*logoStyle*/
          ctx[18]
        );
      },
      m(target, anchor) {
        insert(target, div, anchor);
      },
      p(ctx2, dirty) {
        if (dirty[0] & /*logoStyle*/
        262144) {
          attr(
            div,
            "style",
            /*logoStyle*/
            ctx2[18]
          );
        }
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
      }
    };
  }
  function create_if_block_10(ctx) {
    let span;
    return {
      c() {
        span = element("span");
        attr(span, "class", "king-icon svelte-ccr182");
        attr(
          span,
          "style",
          /*kingStyle*/
          ctx[16]
        );
      },
      m(target, anchor) {
        insert(target, span, anchor);
      },
      p(ctx2, dirty) {
        if (dirty[0] & /*kingStyle*/
        65536) {
          attr(
            span,
            "style",
            /*kingStyle*/
            ctx2[16]
          );
        }
      },
      d(detaching) {
        if (detaching) {
          detach(span);
        }
      }
    };
  }
  function create_if_block_3(ctx) {
    let span;
    function select_block_type(ctx2, dirty) {
      if (
        /*ov*/
        ctx2[1].settings.legendHtml
      )
        return create_if_block_4;
      if (!/*legend*/
      ctx2[10] && !/*legendHtml*/
      ctx2[14])
        return create_if_block_5;
      if (
        /*legendHtml*/
        ctx2[14] && /*data*/
        ctx2[9].length
      )
        return create_if_block_8;
      if (
        /*data*/
        ctx2[9].length
      )
        return create_if_block_9;
    }
    let current_block_type = select_block_type(ctx);
    let if_block = current_block_type && current_block_type(ctx);
    return {
      c() {
        span = element("span");
        if (if_block)
          if_block.c();
        attr(span, "class", "nvjs-ll-data svelte-ccr182");
        attr(
          span,
          "style",
          /*dataStyle*/
          ctx[19]
        );
      },
      m(target, anchor) {
        insert(target, span, anchor);
        if (if_block)
          if_block.m(span, null);
      },
      p(ctx2, dirty) {
        if (current_block_type === (current_block_type = select_block_type(ctx2)) && if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if (if_block)
            if_block.d(1);
          if_block = current_block_type && current_block_type(ctx2);
          if (if_block) {
            if_block.c();
            if_block.m(span, null);
          }
        }
        if (dirty[0] & /*dataStyle*/
        524288) {
          attr(
            span,
            "style",
            /*dataStyle*/
            ctx2[19]
          );
        }
      },
      d(detaching) {
        if (detaching) {
          detach(span);
        }
        if (if_block) {
          if_block.d();
        }
      }
    };
  }
  function create_if_block_9(ctx) {
    let each_1_anchor;
    let each_value_1 = ensure_array_like(
      /*legend*/
      ctx[10](
        /*data*/
        ctx[9],
        /*prec*/
        ctx[7]
      ) || []
    );
    let each_blocks = [];
    for (let i = 0; i < each_value_1.length; i += 1) {
      each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    }
    return {
      c() {
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        each_1_anchor = empty();
      },
      m(target, anchor) {
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(target, anchor);
          }
        }
        insert(target, each_1_anchor, anchor);
      },
      p(ctx2, dirty) {
        if (dirty[0] & /*legend, data, prec, formatter*/
        16778880) {
          each_value_1 = ensure_array_like(
            /*legend*/
            ctx2[10](
              /*data*/
              ctx2[9],
              /*prec*/
              ctx2[7]
            ) || []
          );
          let i;
          for (i = 0; i < each_value_1.length; i += 1) {
            const child_ctx = get_each_context_1(ctx2, each_value_1, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
            } else {
              each_blocks[i] = create_each_block_1(child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
            }
          }
          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }
          each_blocks.length = each_value_1.length;
        }
      },
      d(detaching) {
        if (detaching) {
          detach(each_1_anchor);
        }
        destroy_each(each_blocks, detaching);
      }
    };
  }
  function create_if_block_8(ctx) {
    let html_tag;
    let raw_value = (
      /*legendHtml*/
      ctx[14](
        /*data*/
        ctx[9],
        /*prec*/
        ctx[7],
        /*formatter*/
        ctx[24]
      ) + ""
    );
    let html_anchor;
    return {
      c() {
        html_tag = new HtmlTag(false);
        html_anchor = empty();
        html_tag.a = html_anchor;
      },
      m(target, anchor) {
        html_tag.m(raw_value, target, anchor);
        insert(target, html_anchor, anchor);
      },
      p(ctx2, dirty) {
        if (dirty[0] & /*legendHtml, data, prec*/
        17024 && raw_value !== (raw_value = /*legendHtml*/
        ctx2[14](
          /*data*/
          ctx2[9],
          /*prec*/
          ctx2[7],
          /*formatter*/
          ctx2[24]
        ) + ""))
          html_tag.p(raw_value);
      },
      d(detaching) {
        if (detaching) {
          detach(html_anchor);
          html_tag.d();
        }
      }
    };
  }
  function create_if_block_5(ctx) {
    let each_1_anchor;
    let each_value = ensure_array_like(
      /*data*/
      ctx[9]
    );
    let each_blocks = [];
    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    }
    return {
      c() {
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        each_1_anchor = empty();
      },
      m(target, anchor) {
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(target, anchor);
          }
        }
        insert(target, each_1_anchor, anchor);
      },
      p(ctx2, dirty) {
        if (dirty[0] & /*formatter, data*/
        16777728) {
          each_value = ensure_array_like(
            /*data*/
            ctx2[9]
          );
          let i;
          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context$2(ctx2, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
            } else {
              each_blocks[i] = create_each_block$2(child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
            }
          }
          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }
          each_blocks.length = each_value.length;
        }
      },
      d(detaching) {
        if (detaching) {
          detach(each_1_anchor);
        }
        destroy_each(each_blocks, detaching);
      }
    };
  }
  function create_if_block_4(ctx) {
    let html_tag;
    let raw_value = (
      /*ov*/
      ctx[1].settings.legendHtml + ""
    );
    let html_anchor;
    return {
      c() {
        html_tag = new HtmlTag(false);
        html_anchor = empty();
        html_tag.a = html_anchor;
      },
      m(target, anchor) {
        html_tag.m(raw_value, target, anchor);
        insert(target, html_anchor, anchor);
      },
      p(ctx2, dirty) {
        if (dirty[0] & /*ov*/
        2 && raw_value !== (raw_value = /*ov*/
        ctx2[1].settings.legendHtml + ""))
          html_tag.p(raw_value);
      },
      d(detaching) {
        if (detaching) {
          detach(html_anchor);
          html_tag.d();
        }
      }
    };
  }
  function create_each_block_1(ctx) {
    let span;
    let t0_value = (
      /*formatter*/
      ctx[24](
        /*v*/
        ctx[45][0]
      ) + ""
    );
    let t0;
    let t1;
    let span_style_value;
    return {
      c() {
        span = element("span");
        t0 = text(t0_value);
        t1 = space();
        attr(span, "class", "nvjs-ll-value");
        attr(span, "style", span_style_value = `color: ${/*v*/
        ctx[45][1]}`);
      },
      m(target, anchor) {
        insert(target, span, anchor);
        append(span, t0);
        append(span, t1);
      },
      p(ctx2, dirty) {
        if (dirty[0] & /*legend, data, prec*/
        1664 && t0_value !== (t0_value = /*formatter*/
        ctx2[24](
          /*v*/
          ctx2[45][0]
        ) + ""))
          set_data(t0, t0_value);
        if (dirty[0] & /*legend, data, prec*/
        1664 && span_style_value !== (span_style_value = `color: ${/*v*/
        ctx2[45][1]}`)) {
          attr(span, "style", span_style_value);
        }
      },
      d(detaching) {
        if (detaching) {
          detach(span);
        }
      }
    };
  }
  function create_if_block_6(ctx) {
    let if_block_anchor;
    function select_block_type_1(ctx2, dirty) {
      if (
        /*v*/
        ctx2[45] != null
      )
        return create_if_block_7;
      return create_else_block$2;
    }
    let current_block_type = select_block_type_1(ctx);
    let if_block = current_block_type(ctx);
    return {
      c() {
        if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
      },
      p(ctx2, dirty) {
        if (current_block_type === (current_block_type = select_block_type_1(ctx2)) && if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block.d(1);
          if_block = current_block_type(ctx2);
          if (if_block) {
            if_block.c();
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        }
      },
      d(detaching) {
        if (detaching) {
          detach(if_block_anchor);
        }
        if_block.d(detaching);
      }
    };
  }
  function create_else_block$2(ctx) {
    let span;
    return {
      c() {
        span = element("span");
        span.textContent = "x";
        attr(span, "class", "nvjs-ll-x");
      },
      m(target, anchor) {
        insert(target, span, anchor);
      },
      p: noop,
      d(detaching) {
        if (detaching) {
          detach(span);
        }
      }
    };
  }
  function create_if_block_7(ctx) {
    let span;
    let t0_value = (
      /*formatter*/
      ctx[24](
        /*v*/
        ctx[45]
      ) + ""
    );
    let t0;
    let t1;
    return {
      c() {
        span = element("span");
        t0 = text(t0_value);
        t1 = space();
        attr(span, "class", "nvjs-ll-value");
      },
      m(target, anchor) {
        insert(target, span, anchor);
        append(span, t0);
        append(span, t1);
      },
      p(ctx2, dirty) {
        if (dirty[0] & /*data*/
        512 && t0_value !== (t0_value = /*formatter*/
        ctx2[24](
          /*v*/
          ctx2[45]
        ) + ""))
          set_data(t0, t0_value);
      },
      d(detaching) {
        if (detaching) {
          detach(span);
        }
      }
    };
  }
  function create_each_block$2(ctx) {
    let if_block_anchor;
    let if_block = (
      /*i*/
      ctx[47] > 0 && create_if_block_6(ctx)
    );
    return {
      c() {
        if (if_block)
          if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if (if_block)
          if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
      },
      p(ctx2, dirty) {
        if (
          /*i*/
          ctx2[47] > 0
        )
          if_block.p(ctx2, dirty);
      },
      d(detaching) {
        if (detaching) {
          detach(if_block_anchor);
        }
        if (if_block)
          if_block.d(detaching);
      }
    };
  }
  function create_if_block_2$1(ctx) {
    let div;
    return {
      c() {
        div = element("div");
        attr(div, "class", "nvjs-eye svelte-ccr182");
        attr(
          div,
          "style",
          /*eyeStyle*/
          ctx[17]
        );
      },
      m(target, anchor) {
        insert(target, div, anchor);
      },
      p(ctx2, dirty) {
        if (dirty[0] & /*eyeStyle*/
        131072) {
          attr(
            div,
            "style",
            /*eyeStyle*/
            ctx2[17]
          );
        }
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
      }
    };
  }
  function create_if_block_1$1(ctx) {
    let legendcontrols;
    let current;
    let legendcontrols_props = {
      gridId: (
        /*gridId*/
        ctx[0]
      ),
      ov: (
        /*ov*/
        ctx[1]
      ),
      props: (
        /*props*/
        ctx[2]
      ),
      height: (
        /*boundary*/
        ctx[6].height
      )
    };
    legendcontrols = new LegendControls({ props: legendcontrols_props });
    ctx[34](legendcontrols);
    return {
      c() {
        create_component(legendcontrols.$$.fragment);
      },
      m(target, anchor) {
        mount_component(legendcontrols, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const legendcontrols_changes = {};
        if (dirty[0] & /*gridId*/
        1)
          legendcontrols_changes.gridId = /*gridId*/
          ctx2[0];
        if (dirty[0] & /*ov*/
        2)
          legendcontrols_changes.ov = /*ov*/
          ctx2[1];
        if (dirty[0] & /*props*/
        4)
          legendcontrols_changes.props = /*props*/
          ctx2[2];
        if (dirty[0] & /*boundary*/
        64)
          legendcontrols_changes.height = /*boundary*/
          ctx2[6].height;
        legendcontrols.$set(legendcontrols_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(legendcontrols.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(legendcontrols.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        ctx[34](null);
        destroy_component(legendcontrols, detaching);
      }
    };
  }
  function create_fragment$6(ctx) {
    let if_block_anchor;
    let current;
    let if_block = !/*legendFns*/
    ctx[11].noLegend && /*ov*/
    ctx[1].settings.showLegend !== false && /*show*/
    ctx[13] && create_if_block$3(ctx);
    return {
      c() {
        if (if_block)
          if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if (if_block)
          if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        if (!/*legendFns*/
        ctx2[11].noLegend && /*ov*/
        ctx2[1].settings.showLegend !== false && /*show*/
        ctx2[13]) {
          if (if_block) {
            if_block.p(ctx2, dirty);
            if (dirty[0] & /*legendFns, ov, show*/
            10242) {
              transition_in(if_block, 1);
            }
          } else {
            if_block = create_if_block$3(ctx2);
            if_block.c();
            transition_in(if_block, 1);
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        } else if (if_block) {
          group_outros();
          transition_out(if_block, 1, 1, () => {
            if_block = null;
          });
          check_outros();
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(if_block_anchor);
        }
        if (if_block)
          if_block.d(detaching);
      }
    };
  }
  function instance$6($$self, $$props, $$invalidate) {
    let updId;
    let name;
    let fontSz;
    let styleBase;
    let styleHover;
    let dataStyle;
    let logoStyle;
    let eyeStyle;
    let kingStyle;
    let boundary;
    let nBoundary;
    let style;
    let legendFns;
    let legend;
    let legendHtml;
    let values;
    let data;
    let scale;
    let prec;
    let display;
    let state;
    let { gridId } = $$props;
    let { ov } = $$props;
    let { props } = $$props;
    let { layout } = $$props;
    let meta = MetaHub$1.instance(props.id);
    let events = Events$1.instance(props.id);
    let hover = false;
    let ref;
    let nRef;
    let ctrlRef;
    let selected = false;
    let show = true;
    onMount(() => {
      events.on(`${updId}:update-ll`, update2);
      events.on(`${updId}:grid-mousedown`, onDeselect);
      events.on(`${updId}:select-overlay`, onDeselect);
    });
    onDestroy(() => {
      events.off(updId);
    });
    function update2() {
      $$invalidate(8, display = ov.settings.display !== false);
      if (ctrlRef)
        ctrlRef.update();
    }
    function onMouseMove(e) {
      if (e.clientX < nBoundary.x + nBoundary.width + 35 && !hover) {
        setTimeout(() => {
          updateBoundaries();
          $$invalidate(3, hover = true);
        });
      }
    }
    function onMouseLeave(e) {
      setTimeout(() => {
        updateBoundaries();
        $$invalidate(3, hover = false);
      });
    }
    function onClick() {
      events.emit("select-overlay", { index: [gridId, ov.id] });
      $$invalidate(26, selected = true);
    }
    function onDeselect(event) {
      $$invalidate(26, selected = false);
    }
    function formatter(x, $prec = prec) {
      if (x == void 0)
        return "x";
      if (typeof x !== "number")
        return x;
      return x.toFixed($prec);
    }
    function findOverlayScale(scales) {
      return Object.values(scales).find((x) => x.scaleSpecs.ovIdxs.includes(ov.id)) || scales[layout.scaleIndex];
    }
    function updateBoundaries() {
      if (!ref)
        return;
      $$invalidate(6, boundary = ref.getBoundingClientRect());
    }
    function span_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        nRef = $$value;
        $$invalidate(5, nRef);
      });
    }
    function legendcontrols_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        ctrlRef = $$value;
        $$invalidate(12, ctrlRef);
      });
    }
    function div_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        ref = $$value;
        $$invalidate(4, ref);
      });
    }
    $$self.$$set = ($$props2) => {
      if ("gridId" in $$props2)
        $$invalidate(0, gridId = $$props2.gridId);
      if ("ov" in $$props2)
        $$invalidate(1, ov = $$props2.ov);
      if ("props" in $$props2)
        $$invalidate(2, props = $$props2.props);
      if ("layout" in $$props2)
        $$invalidate(25, layout = $$props2.layout);
    };
    $$self.$$.update = () => {
      var _a;
      if ($$self.$$.dirty[0] & /*gridId, ov*/
      3) {
        updId = `ll-${gridId}-${ov.id}`;
      }
      if ($$self.$$.dirty[0] & /*ov*/
      2) {
        $$invalidate(20, name = (_a = ov.name) != null ? _a : `${ov.type || "Overlay"}-${ov.id}`);
      }
      if ($$self.$$.dirty[0] & /*props*/
      4) {
        $$invalidate(32, fontSz = parseInt(props.config.FONT.split("px").shift()));
      }
      if ($$self.$$.dirty[0] & /*props, ov, selected, layout*/
      100663302 | $$self.$$.dirty[1] & /*fontSz*/
      2) {
        $$invalidate(31, styleBase = `
    font: ${props.config.FONT};
    font-size: ${fontSz + (ov.main ? 5 : 3)}px;
    font-weight: 300;
    color: ${props.colors.textLG};
    background: ${selected ? props.colors.back : props.colors.llBack};
    border: 1px solid transparent;
    margin-right: 30px;
    max-width: ${layout.width - 20}px;
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    border-color: ${selected ? props.colors.llSelect : "auto"} !important;
`);
      }
      if ($$self.$$.dirty[0] & /*props*/
      4) {
        $$invalidate(30, styleHover = `
    background: ${props.colors.back};
    border: 1px solid ${props.colors.grid};

`);
      }
      if ($$self.$$.dirty[0] & /*ov, props*/
      6 | $$self.$$.dirty[1] & /*fontSz*/
      2) {
        $$invalidate(19, dataStyle = `
    font-size: ${fontSz + (ov.main ? 3 : 2)}px;
    color: ${props.colors.llValue}
`);
      }
      if ($$self.$$.dirty[0] & /*ov*/
      2) {
        $$invalidate(8, display = ov.settings.display !== false);
      }
      if ($$self.$$.dirty[0] & /*display*/
      256) {
        $$invalidate(27, state = display ? "open" : "closed");
      }
      if ($$self.$$.dirty[0] & /*ref*/
      16) {
        $$invalidate(6, boundary = ref ? ref.getBoundingClientRect() : {});
      }
      if ($$self.$$.dirty[0] & /*state, boundary*/
      134217792) {
        $$invalidate(17, eyeStyle = `
    background-image: url(${icons[state + "-eye"]});
    background-size: contain;
    background-repeat: no-repeat;
    margin-top: ${(boundary.height - 20) * 0.5 - 3}px;
    margin-bottom: -2px;
`);
      }
      if ($$self.$$.dirty[0] & /*boundary*/
      64) {
        `
    width: ${boundary.width}px;
    height: ${boundary.height}px;
    background: #55f9;
    top: -1px;
    left: -2px;
`;
      }
      if ($$self.$$.dirty[0] & /*props*/
      4) {
        $$invalidate(29, values = props.cursor.values || []);
      }
      if ($$self.$$.dirty[0] & /*values, gridId, ov*/
      536870915) {
        $$invalidate(9, data = (values[gridId] || [])[ov.id] || []);
      }
      if ($$self.$$.dirty[0] & /*hover, display, data*/
      776) {
        $$invalidate(16, kingStyle = `
    background-image: url(${icons["king3"]});
    background-size: contain;
    background-repeat: no-repeat;
    margin-left: ${hover || !display || !data.length ? 7 : 3}px;
`);
      }
      if ($$self.$$.dirty[0] & /*nRef*/
      32) {
        nBoundary = nRef ? nRef.getBoundingClientRect() : {};
      }
      if ($$self.$$.dirty[0] & /*hover, styleHover*/
      1073741832 | $$self.$$.dirty[1] & /*styleBase*/
      1) {
        $$invalidate(15, style = styleBase + (hover ? styleHover : ""));
      }
      if ($$self.$$.dirty[0] & /*gridId, ov*/
      3) {
        $$invalidate(11, legendFns = meta.getLegendFns(gridId, ov.id) || {});
      }
      if ($$self.$$.dirty[0] & /*legendFns*/
      2048) {
        $$invalidate(10, legend = legendFns.legend);
      }
      if ($$self.$$.dirty[0] & /*legendFns*/
      2048) {
        $$invalidate(14, legendHtml = legendFns.legendHtml);
      }
      if ($$self.$$.dirty[0] & /*layout*/
      33554432) {
        $$invalidate(28, scale = findOverlayScale(layout.scales));
      }
      if ($$self.$$.dirty[0] & /*scale*/
      268435456) {
        $$invalidate(7, prec = scale.prec);
      }
      if ($$self.$$.dirty[0] & /*legend, data, prec*/
      1664) {
        if (legend && data && !legend(data, prec))
          $$invalidate(13, show = false);
      }
    };
    $$invalidate(18, logoStyle = `
    background-image: url(${logo[0]});
    background-size: contain;
    background-repeat: no-repeat;
`);
    return [
      gridId,
      ov,
      props,
      hover,
      ref,
      nRef,
      boundary,
      prec,
      display,
      data,
      legend,
      legendFns,
      ctrlRef,
      show,
      legendHtml,
      style,
      kingStyle,
      eyeStyle,
      logoStyle,
      dataStyle,
      name,
      onMouseMove,
      onMouseLeave,
      onClick,
      formatter,
      layout,
      selected,
      state,
      scale,
      values,
      styleHover,
      styleBase,
      fontSz,
      span_binding,
      legendcontrols_binding,
      div_binding
    ];
  }
  class LegendLine extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$6, create_fragment$6, safe_not_equal, { gridId: 0, ov: 1, props: 2, layout: 25 }, add_css$2, [-1, -1]);
    }
  }
  function add_css$1(target) {
    append_styles(target, "svelte-16ib1si", ".nvjs-legend.svelte-16ib1si{pointer-events:none}");
  }
  function get_each_context$1(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[9] = list[i];
    child_ctx[11] = i;
    return child_ctx;
  }
  function create_if_block$2(ctx) {
    let div;
    let current;
    let each_value = ensure_array_like(
      /*hub*/
      ctx[5].panes()[
        /*id*/
        ctx[0]
      ].overlays
    );
    let each_blocks = [];
    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    }
    const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
      each_blocks[i] = null;
    });
    return {
      c() {
        div = element("div");
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        attr(div, "class", "nvjs-legend svelte-16ib1si");
        attr(
          div,
          "style",
          /*style*/
          ctx[4]
        );
      },
      m(target, anchor) {
        insert(target, div, anchor);
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(div, null);
          }
        }
        current = true;
      },
      p(ctx2, dirty) {
        if (dirty & /*id, props, layout, hub*/
        39) {
          each_value = ensure_array_like(
            /*hub*/
            ctx2[5].panes()[
              /*id*/
              ctx2[0]
            ].overlays
          );
          let i;
          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context$1(ctx2, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
              transition_in(each_blocks[i], 1);
            } else {
              each_blocks[i] = create_each_block$1(child_ctx);
              each_blocks[i].c();
              transition_in(each_blocks[i], 1);
              each_blocks[i].m(div, null);
            }
          }
          group_outros();
          for (i = each_value.length; i < each_blocks.length; i += 1) {
            out(i);
          }
          check_outros();
        }
        if (!current || dirty & /*style*/
        16) {
          attr(
            div,
            "style",
            /*style*/
            ctx2[4]
          );
        }
      },
      i(local) {
        if (current)
          return;
        for (let i = 0; i < each_value.length; i += 1) {
          transition_in(each_blocks[i]);
        }
        current = true;
      },
      o(local) {
        each_blocks = each_blocks.filter(Boolean);
        for (let i = 0; i < each_blocks.length; i += 1) {
          transition_out(each_blocks[i]);
        }
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        destroy_each(each_blocks, detaching);
      }
    };
  }
  function create_each_block$1(ctx) {
    let legendline;
    let current;
    legendline = new LegendLine({
      props: {
        gridId: (
          /*id*/
          ctx[0]
        ),
        props: (
          /*props*/
          ctx[1]
        ),
        layout: (
          /*layout*/
          ctx[2]
        ),
        ov: (
          /*ov*/
          ctx[9]
        )
      }
    });
    return {
      c() {
        create_component(legendline.$$.fragment);
      },
      m(target, anchor) {
        mount_component(legendline, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const legendline_changes = {};
        if (dirty & /*id*/
        1)
          legendline_changes.gridId = /*id*/
          ctx2[0];
        if (dirty & /*props*/
        2)
          legendline_changes.props = /*props*/
          ctx2[1];
        if (dirty & /*layout*/
        4)
          legendline_changes.layout = /*layout*/
          ctx2[2];
        if (dirty & /*id*/
        1)
          legendline_changes.ov = /*ov*/
          ctx2[9];
        legendline.$set(legendline_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(legendline.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(legendline.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(legendline, detaching);
      }
    };
  }
  function create_key_block(ctx) {
    let show_if = (
      /*hub*/
      ctx[5].panes()[
        /*id*/
        ctx[0]
      ]
    );
    let if_block_anchor;
    let current;
    let if_block = show_if && create_if_block$2(ctx);
    return {
      c() {
        if (if_block)
          if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if (if_block)
          if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        if (dirty & /*id*/
        1)
          show_if = /*hub*/
          ctx2[5].panes()[
            /*id*/
            ctx2[0]
          ];
        if (show_if) {
          if (if_block) {
            if_block.p(ctx2, dirty);
            if (dirty & /*id*/
            1) {
              transition_in(if_block, 1);
            }
          } else {
            if_block = create_if_block$2(ctx2);
            if_block.c();
            transition_in(if_block, 1);
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        } else if (if_block) {
          group_outros();
          transition_out(if_block, 1, 1, () => {
            if_block = null;
          });
          check_outros();
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(if_block_anchor);
        }
        if (if_block)
          if_block.d(detaching);
      }
    };
  }
  function create_fragment$5(ctx) {
    let previous_key = (
      /*legendRR*/
      ctx[3]
    );
    let key_block_anchor;
    let current;
    let key_block = create_key_block(ctx);
    return {
      c() {
        key_block.c();
        key_block_anchor = empty();
      },
      m(target, anchor) {
        key_block.m(target, anchor);
        insert(target, key_block_anchor, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        if (dirty & /*legendRR*/
        8 && safe_not_equal(previous_key, previous_key = /*legendRR*/
        ctx2[3])) {
          group_outros();
          transition_out(key_block, 1, 1, noop);
          check_outros();
          key_block = create_key_block(ctx2);
          key_block.c();
          transition_in(key_block, 1);
          key_block.m(key_block_anchor.parentNode, key_block_anchor);
        } else {
          key_block.p(ctx2, dirty);
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(key_block);
        current = true;
      },
      o(local) {
        transition_out(key_block);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(key_block_anchor);
        }
        key_block.d(detaching);
      }
    };
  }
  function instance$5($$self, $$props, $$invalidate) {
    let style;
    let { id } = $$props;
    let { props } = $$props;
    let { main } = $$props;
    let { layout } = $$props;
    let hub = DataHub$1.instance(props.id);
    let events = Events$1.instance(props.id);
    let legendRR = 0;
    events.on(`legend-${id}:update-legend`, update2);
    onDestroy(() => {
      events.off(`legend-${id}`);
    });
    function update2() {
      $$invalidate(3, legendRR++, legendRR);
    }
    $$self.$$set = ($$props2) => {
      if ("id" in $$props2)
        $$invalidate(0, id = $$props2.id);
      if ("props" in $$props2)
        $$invalidate(1, props = $$props2.props);
      if ("main" in $$props2)
        $$invalidate(6, main = $$props2.main);
      if ("layout" in $$props2)
        $$invalidate(2, layout = $$props2.layout);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*layout*/
      4) {
        $$invalidate(4, style = `
    left: ${layout.sbMax[0] + 5}px;
    top: ${(layout.offset || 0) + 5}px;
    position: absolute;
`);
      }
    };
    return [id, props, layout, legendRR, style, hub, main];
  }
  class Legend extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$5, create_fragment$5, safe_not_equal, { id: 0, props: 1, main: 6, layout: 2 }, add_css$1);
    }
  }
  function create_if_block$1(ctx) {
    let div;
    let grid_1;
    let t0;
    let legend;
    let t1;
    let current_block_type_index;
    let if_block0;
    let t2;
    let current_block_type_index_1;
    let if_block1;
    let current;
    let grid_1_props = {
      id: (
        /*id*/
        ctx[1]
      ),
      props: (
        /*props*/
        ctx[2]
      ),
      layout: (
        /*layout*/
        ctx[0]
      ),
      main: (
        /*main*/
        ctx[3]
      )
    };
    grid_1 = new Grid_1({ props: grid_1_props });
    ctx[10](grid_1);
    legend = new Legend({
      props: {
        id: (
          /*id*/
          ctx[1]
        ),
        props: (
          /*props*/
          ctx[2]
        ),
        layout: (
          /*layout*/
          ctx[0]
        ),
        main: (
          /*main*/
          ctx[3]
        )
      }
    });
    const if_block_creators = [create_if_block_2, create_else_block_1];
    const if_blocks = [];
    function select_block_type(ctx2, dirty) {
      if (
        /*leftSb*/
        ctx2[9].length
      )
        return 0;
      return 1;
    }
    current_block_type_index = select_block_type(ctx);
    if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    const if_block_creators_1 = [create_if_block_1, create_else_block$1];
    const if_blocks_1 = [];
    function select_block_type_1(ctx2, dirty) {
      if (
        /*rightSb*/
        ctx2[8].length
      )
        return 0;
      return 1;
    }
    current_block_type_index_1 = select_block_type_1(ctx);
    if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
    return {
      c() {
        div = element("div");
        create_component(grid_1.$$.fragment);
        t0 = space();
        create_component(legend.$$.fragment);
        t1 = space();
        if_block0.c();
        t2 = space();
        if_block1.c();
        attr(div, "class", "nvjs-pane");
        attr(
          div,
          "style",
          /*style*/
          ctx[7]
        );
      },
      m(target, anchor) {
        insert(target, div, anchor);
        mount_component(grid_1, div, null);
        append(div, t0);
        mount_component(legend, div, null);
        append(div, t1);
        if_blocks[current_block_type_index].m(div, null);
        append(div, t2);
        if_blocks_1[current_block_type_index_1].m(div, null);
        current = true;
      },
      p(ctx2, dirty) {
        const grid_1_changes = {};
        if (dirty & /*id*/
        2)
          grid_1_changes.id = /*id*/
          ctx2[1];
        if (dirty & /*props*/
        4)
          grid_1_changes.props = /*props*/
          ctx2[2];
        if (dirty & /*layout*/
        1)
          grid_1_changes.layout = /*layout*/
          ctx2[0];
        if (dirty & /*main*/
        8)
          grid_1_changes.main = /*main*/
          ctx2[3];
        grid_1.$set(grid_1_changes);
        const legend_changes = {};
        if (dirty & /*id*/
        2)
          legend_changes.id = /*id*/
          ctx2[1];
        if (dirty & /*props*/
        4)
          legend_changes.props = /*props*/
          ctx2[2];
        if (dirty & /*layout*/
        1)
          legend_changes.layout = /*layout*/
          ctx2[0];
        if (dirty & /*main*/
        8)
          legend_changes.main = /*main*/
          ctx2[3];
        legend.$set(legend_changes);
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx2);
        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        } else {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
          if_block0 = if_blocks[current_block_type_index];
          if (!if_block0) {
            if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block0.c();
          } else {
            if_block0.p(ctx2, dirty);
          }
          transition_in(if_block0, 1);
          if_block0.m(div, t2);
        }
        let previous_block_index_1 = current_block_type_index_1;
        current_block_type_index_1 = select_block_type_1(ctx2);
        if (current_block_type_index_1 === previous_block_index_1) {
          if_blocks_1[current_block_type_index_1].p(ctx2, dirty);
        } else {
          group_outros();
          transition_out(if_blocks_1[previous_block_index_1], 1, 1, () => {
            if_blocks_1[previous_block_index_1] = null;
          });
          check_outros();
          if_block1 = if_blocks_1[current_block_type_index_1];
          if (!if_block1) {
            if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx2);
            if_block1.c();
          } else {
            if_block1.p(ctx2, dirty);
          }
          transition_in(if_block1, 1);
          if_block1.m(div, null);
        }
        if (!current || dirty & /*style*/
        128) {
          attr(
            div,
            "style",
            /*style*/
            ctx2[7]
          );
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(grid_1.$$.fragment, local);
        transition_in(legend.$$.fragment, local);
        transition_in(if_block0);
        transition_in(if_block1);
        current = true;
      },
      o(local) {
        transition_out(grid_1.$$.fragment, local);
        transition_out(legend.$$.fragment, local);
        transition_out(if_block0);
        transition_out(if_block1);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        ctx[10](null);
        destroy_component(grid_1);
        destroy_component(legend);
        if_blocks[current_block_type_index].d();
        if_blocks_1[current_block_type_index_1].d();
      }
    };
  }
  function create_else_block_1(ctx) {
    let sidebarstub;
    let current;
    sidebarstub = new SidebarStub({
      props: {
        id: (
          /*id*/
          ctx[1]
        ),
        props: (
          /*props*/
          ctx[2]
        ),
        layout: (
          /*layout*/
          ctx[0]
        ),
        side: "left"
      }
    });
    return {
      c() {
        create_component(sidebarstub.$$.fragment);
      },
      m(target, anchor) {
        mount_component(sidebarstub, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const sidebarstub_changes = {};
        if (dirty & /*id*/
        2)
          sidebarstub_changes.id = /*id*/
          ctx2[1];
        if (dirty & /*props*/
        4)
          sidebarstub_changes.props = /*props*/
          ctx2[2];
        if (dirty & /*layout*/
        1)
          sidebarstub_changes.layout = /*layout*/
          ctx2[0];
        sidebarstub.$set(sidebarstub_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(sidebarstub.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(sidebarstub.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(sidebarstub, detaching);
      }
    };
  }
  function create_if_block_2(ctx) {
    let sidebar;
    let current;
    let sidebar_props = {
      id: (
        /*id*/
        ctx[1]
      ),
      props: (
        /*props*/
        ctx[2]
      ),
      layout: (
        /*layout*/
        ctx[0]
      ),
      side: "left",
      scales: (
        /*leftSb*/
        ctx[9]
      )
    };
    sidebar = new Sidebar({ props: sidebar_props });
    ctx[11](sidebar);
    return {
      c() {
        create_component(sidebar.$$.fragment);
      },
      m(target, anchor) {
        mount_component(sidebar, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const sidebar_changes = {};
        if (dirty & /*id*/
        2)
          sidebar_changes.id = /*id*/
          ctx2[1];
        if (dirty & /*props*/
        4)
          sidebar_changes.props = /*props*/
          ctx2[2];
        if (dirty & /*layout*/
        1)
          sidebar_changes.layout = /*layout*/
          ctx2[0];
        if (dirty & /*leftSb*/
        512)
          sidebar_changes.scales = /*leftSb*/
          ctx2[9];
        sidebar.$set(sidebar_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(sidebar.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(sidebar.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        ctx[11](null);
        destroy_component(sidebar, detaching);
      }
    };
  }
  function create_else_block$1(ctx) {
    let sidebarstub;
    let current;
    sidebarstub = new SidebarStub({
      props: {
        id: (
          /*id*/
          ctx[1]
        ),
        props: (
          /*props*/
          ctx[2]
        ),
        layout: (
          /*layout*/
          ctx[0]
        ),
        side: "right"
      }
    });
    return {
      c() {
        create_component(sidebarstub.$$.fragment);
      },
      m(target, anchor) {
        mount_component(sidebarstub, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const sidebarstub_changes = {};
        if (dirty & /*id*/
        2)
          sidebarstub_changes.id = /*id*/
          ctx2[1];
        if (dirty & /*props*/
        4)
          sidebarstub_changes.props = /*props*/
          ctx2[2];
        if (dirty & /*layout*/
        1)
          sidebarstub_changes.layout = /*layout*/
          ctx2[0];
        sidebarstub.$set(sidebarstub_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(sidebarstub.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(sidebarstub.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(sidebarstub, detaching);
      }
    };
  }
  function create_if_block_1(ctx) {
    let sidebar;
    let current;
    let sidebar_props = {
      id: (
        /*id*/
        ctx[1]
      ),
      props: (
        /*props*/
        ctx[2]
      ),
      layout: (
        /*layout*/
        ctx[0]
      ),
      side: "right",
      scales: (
        /*rightSb*/
        ctx[8]
      )
    };
    sidebar = new Sidebar({ props: sidebar_props });
    ctx[12](sidebar);
    return {
      c() {
        create_component(sidebar.$$.fragment);
      },
      m(target, anchor) {
        mount_component(sidebar, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const sidebar_changes = {};
        if (dirty & /*id*/
        2)
          sidebar_changes.id = /*id*/
          ctx2[1];
        if (dirty & /*props*/
        4)
          sidebar_changes.props = /*props*/
          ctx2[2];
        if (dirty & /*layout*/
        1)
          sidebar_changes.layout = /*layout*/
          ctx2[0];
        if (dirty & /*rightSb*/
        256)
          sidebar_changes.scales = /*rightSb*/
          ctx2[8];
        sidebar.$set(sidebar_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(sidebar.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(sidebar.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        ctx[12](null);
        destroy_component(sidebar, detaching);
      }
    };
  }
  function create_fragment$4(ctx) {
    let if_block_anchor;
    let current;
    let if_block = (
      /*layout*/
      ctx[0] && create_if_block$1(ctx)
    );
    return {
      c() {
        if (if_block)
          if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if (if_block)
          if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        if (
          /*layout*/
          ctx2[0]
        ) {
          if (if_block) {
            if_block.p(ctx2, dirty);
            if (dirty & /*layout*/
            1) {
              transition_in(if_block, 1);
            }
          } else {
            if_block = create_if_block$1(ctx2);
            if_block.c();
            transition_in(if_block, 1);
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        } else if (if_block) {
          group_outros();
          transition_out(if_block, 1, 1, () => {
            if_block = null;
          });
          check_outros();
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(if_block_anchor);
        }
        if (if_block)
          if_block.d(detaching);
      }
    };
  }
  function instance$4($$self, $$props, $$invalidate) {
    let leftSb;
    let rightSb;
    let style;
    let { id } = $$props;
    let { props } = $$props;
    let { main } = $$props;
    let { layout } = $$props;
    let events = Events$1.instance(props.id);
    let lsb;
    let rsb;
    let grid;
    events.on(`pane-${id}:update-pane`, update2);
    onMount(() => {
    });
    onDestroy(() => {
      events.off(`pane-${id}`);
    });
    function update2($layout) {
      if (!$layout.grids)
        return;
      $$invalidate(0, layout = $layout.grids[id]);
      events.emitSpec(`grid-${id}`, "update-grid", layout);
      let layers = grid && grid.getLayers ? grid.getLayers() : [];
      if (lsb)
        lsb.setLayers(layers);
      if (rsb)
        rsb.setLayers(layers);
      events.emitSpec(`sb-${id}-left`, "update-sb", layout);
      events.emitSpec(`sb-${id}-right`, "update-sb", layout);
    }
    function grid_1_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        grid = $$value;
        $$invalidate(6, grid);
      });
    }
    function sidebar_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        lsb = $$value;
        $$invalidate(4, lsb);
      });
    }
    function sidebar_binding_1($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        rsb = $$value;
        $$invalidate(5, rsb);
      });
    }
    $$self.$$set = ($$props2) => {
      if ("id" in $$props2)
        $$invalidate(1, id = $$props2.id);
      if ("props" in $$props2)
        $$invalidate(2, props = $$props2.props);
      if ("main" in $$props2)
        $$invalidate(3, main = $$props2.main);
      if ("layout" in $$props2)
        $$invalidate(0, layout = $$props2.layout);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*layout*/
      1) {
        $$invalidate(9, leftSb = Utils.getScalesBySide(0, layout));
      }
      if ($$self.$$.dirty & /*layout*/
      1) {
        $$invalidate(8, rightSb = Utils.getScalesBySide(1, layout));
      }
      if ($$self.$$.dirty & /*props, layout, id*/
      7) {
        $$invalidate(7, style = `
    width: ${props.width}px;
    height: ${(layout || {}).height}px;
    /* didn't work, coz canvas draws through the border
    border-top: ${id ? "1px solid" : "none"};
    border-color: ${props.colors.scale};
    box-sizing: border-box;*/
`);
      }
    };
    return [
      layout,
      id,
      props,
      main,
      lsb,
      rsb,
      grid,
      style,
      rightSb,
      leftSb,
      grid_1_binding,
      sidebar_binding,
      sidebar_binding_1
    ];
  }
  class Pane extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$4, create_fragment$4, safe_not_equal, { id: 1, props: 2, main: 3, layout: 0 });
    }
  }
  const {
    MINUTE15,
    MINUTE,
    HOUR,
    DAY,
    WEEK,
    MONTH,
    YEAR,
    MONTHMAP,
    HPX
  } = Const;
  function body(props, layout, ctx) {
    const width = layout.botbar.width;
    const height = layout.botbar.height;
    const sb0 = layout.main.sbMax[0];
    layout.main.sbMax[1];
    ctx.font = props.config.FONT;
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = props.colors.scale;
    ctx.beginPath();
    ctx.moveTo(0, 0.5);
    ctx.lineTo(Math.floor(width + 1), 0.5);
    ctx.stroke();
    ctx.fillStyle = props.colors.text;
    ctx.beginPath();
    for (var p of layout.botbar.xs) {
      const lbl = formatDate(props, p);
      const x = p[0] + sb0;
      ctx.moveTo(x + HPX, 0);
      ctx.lineTo(x + HPX, 4.5);
      if (!lblHighlight(props, p[1][0])) {
        ctx.globalAlpha = 0.85;
      }
      ctx.textAlign = "center";
      ctx.fillText(lbl, x, 18);
      ctx.globalAlpha = 1;
    }
    ctx.stroke();
  }
  function panel(props, layout, ctx) {
    const lbl = formatCursorX(props);
    ctx.fillStyle = props.colors.panel;
    const measure = ctx.measureText(lbl + "    ");
    const panwidth = Math.floor(measure.width + 10);
    const cursor = props.cursor.x + layout.main.sbMax[0];
    const x = Math.floor(cursor - panwidth * 0.5);
    const y = 1;
    const panheight = props.config.PANHEIGHT;
    roundRect(ctx, x, y, panwidth, panheight + 0.5, 3);
    ctx.fillStyle = props.colors.textHL;
    ctx.textAlign = "center";
    ctx.fillText(lbl, cursor, y + 16);
  }
  function formatDate(props, p) {
    const t = p[1];
    const tf = props.timeFrame;
    const k = tf < DAY ? 1 : 0;
    const tZ = t + k * props.timezone * HOUR;
    const d = new Date(tZ);
    if (p[2] === YEAR || Utils.yearStart(t) === t) {
      return d.getUTCFullYear();
    }
    if (p[2] === MONTH || Utils.monthStart(t) === t) {
      return MONTHMAP[d.getUTCMonth()];
    }
    if (Utils.dayStart(tZ) === tZ)
      return d.getUTCDate();
    const h = Utils.addZero(d.getUTCHours());
    const m = Utils.addZero(d.getUTCMinutes());
    return h + ":" + m;
  }
  function formatCursorX(props) {
    const t = props.cursor.time;
    if (t === void 0)
      return "Out of range";
    const tf = props.timeFrame;
    const k = tf < DAY ? 1 : 0;
    const d = new Date(t + k * props.timezone * HOUR);
    if (tf === YEAR) {
      return d.getUTCFullYear();
    }
    if (tf < YEAR) {
      var yr = "`" + `${d.getUTCFullYear()}`.slice(-2);
      var mo = MONTHMAP[d.getUTCMonth()];
      var dd = "01";
    }
    if (tf <= WEEK)
      dd = d.getUTCDate();
    const date = `${dd} ${mo} ${yr}`;
    let time = "";
    if (tf < DAY) {
      const h = Utils.addZero(d.getUTCHours());
      const m = Utils.addZero(d.getUTCMinutes());
      time = h + ":" + m;
    }
    return `${date}  ${time}`;
  }
  function lblHighlight(props, t) {
    const tf = props.timeFrame;
    if (t === 0)
      return true;
    if (Utils.monthStart(t) === t)
      return true;
    if (Utils.dayStart(t) === t)
      return true;
    if (tf <= MINUTE15 && t % HOUR === 0)
      return true;
    return false;
  }
  function roundRect(ctx, x, y, w, h, r) {
    if (w < 2 * r)
      r = w / 2;
    if (h < 2 * r)
      r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, 0);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, 0);
    ctx.closePath();
    ctx.fill();
  }
  const bb = {
    body,
    panel
  };
  function create_fragment$3(ctx) {
    let div;
    let canvas_1;
    return {
      c() {
        div = element("div");
        canvas_1 = element("canvas");
        attr(
          canvas_1,
          "id",
          /*canvasId*/
          ctx[2]
        );
        attr(div, "class", "nvjs-botbar svelte-8gplax");
        attr(
          div,
          "id",
          /*bbId*/
          ctx[1]
        );
        attr(
          div,
          "style",
          /*bbStyle*/
          ctx[0]
        );
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, canvas_1);
      },
      p(ctx2, [dirty]) {
        if (dirty & /*bbStyle*/
        1) {
          attr(
            div,
            "style",
            /*bbStyle*/
            ctx2[0]
          );
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching) {
          detach(div);
        }
      }
    };
  }
  function instance$3($$self, $$props, $$invalidate) {
    let bbStyle;
    let width;
    let { props = {} } = $$props;
    let { layout = {} } = $$props;
    let bbUpdId = `botbar`;
    let bbId = `${props.id}-botbar`;
    let canvasId = `${props.id}-botbar-canvas`;
    let events = Events$1.instance(props.id);
    events.on(`${bbUpdId}:update-bb`, update2);
    events.on(`${bbUpdId}:show-bb-panel`, (f) => showPanel = f);
    let canvas;
    let ctx;
    let showPanel = true;
    onMount(() => {
      setup2();
    });
    onDestroy(() => {
      events.off(`${bbUpdId}`);
    });
    function setup2() {
      let botbar = layout.botbar;
      [canvas, ctx] = dpr.setup(canvasId, botbar.width, botbar.height);
      update2();
    }
    function update2($layout = layout) {
      $$invalidate(3, layout = $layout);
      if (!layout.botbar)
        return;
      bb.body(props, layout, ctx);
      if (props.cursor.x && props.cursor.ti !== void 0 && showPanel) {
        bb.panel(props, layout, ctx);
      }
    }
    function resizeWatch() {
      let botbar = layout.botbar;
      if (!canvas || !botbar)
        return;
      dpr.resize(canvas, ctx, botbar.width, botbar.height);
      update2();
    }
    $$self.$$set = ($$props2) => {
      if ("props" in $$props2)
        $$invalidate(4, props = $$props2.props);
      if ("layout" in $$props2)
        $$invalidate(3, layout = $$props2.layout);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*props, layout*/
      24) {
        $$invalidate(0, bbStyle = `
    background: ${props.colors.back};
    width: ${(layout.botbar || {}).width}px;
    height: ${(layout.botbar || {}).height}px;
`);
      }
      if ($$self.$$.dirty & /*layout*/
      8) {
        $$invalidate(5, width = (layout.botbar || {}).width);
      }
      if ($$self.$$.dirty & /*width*/
      32) {
        resizeWatch();
      }
    };
    return [bbStyle, bbId, canvasId, layout, props, width];
  }
  class Botbar extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$3, create_fragment$3, safe_not_equal, { props: 4, layout: 3 });
    }
  }
  function create_fragment$2(ctx) {
    let div;
    let t;
    return {
      c() {
        div = element("div");
        t = text("No data ¯\\_( °﹏°)_/¯");
        attr(div, "class", "nvjs-no-data-stub svelte-172ri4o");
        attr(
          div,
          "style",
          /*style*/
          ctx[0]
        );
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, t);
      },
      p(ctx2, [dirty]) {
        if (dirty & /*style*/
        1) {
          attr(
            div,
            "style",
            /*style*/
            ctx2[0]
          );
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching) {
          detach(div);
        }
      }
    };
  }
  function instance$2($$self, $$props, $$invalidate) {
    let style;
    let { props } = $$props;
    $$self.$$set = ($$props2) => {
      if ("props" in $$props2)
        $$invalidate(1, props = $$props2.props);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*props*/
      2) {
        $$invalidate(0, style = `
    display: flex;
    width: ${props.width}px;
    height: ${props.height}px;
    background: ${props.colors.back};
    color: ${props.colors.scale};
    font: ${props.config.FONT};
    font-size: 18px;
    font-style: italic;
    user-select: none;
    align-items:center;
    justify-content:center;
`);
      }
    };
    return [style, props];
  }
  class NoDataStub extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$2, create_fragment$2, safe_not_equal, { props: 1 });
    }
  }
  function get_each_context(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[25] = list[i];
    child_ctx[27] = i;
    return child_ctx;
  }
  function create_else_block(ctx) {
    let nodatastub;
    let current;
    nodatastub = new NoDataStub({ props: { props: (
      /*props*/
      ctx[0]
    ) } });
    return {
      c() {
        create_component(nodatastub.$$.fragment);
      },
      m(target, anchor) {
        mount_component(nodatastub, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const nodatastub_changes = {};
        if (dirty & /*props*/
        1)
          nodatastub_changes.props = /*props*/
          ctx2[0];
        nodatastub.$set(nodatastub_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(nodatastub.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(nodatastub.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(nodatastub, detaching);
      }
    };
  }
  function create_if_block(ctx) {
    let t;
    let botbar;
    let current;
    let each_value = ensure_array_like(
      /*hub*/
      ctx[3].panes()
    );
    let each_blocks = [];
    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    }
    const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
      each_blocks[i] = null;
    });
    botbar = new Botbar({
      props: {
        props: (
          /*chartProps*/
          ctx[2]
        ),
        layout: (
          /*layout*/
          ctx[1]
        )
      }
    });
    return {
      c() {
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        t = space();
        create_component(botbar.$$.fragment);
      },
      m(target, anchor) {
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(target, anchor);
          }
        }
        insert(target, t, anchor);
        mount_component(botbar, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        if (dirty & /*layout, chartProps, hub*/
        14) {
          each_value = ensure_array_like(
            /*hub*/
            ctx2[3].panes()
          );
          let i;
          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context(ctx2, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
              transition_in(each_blocks[i], 1);
            } else {
              each_blocks[i] = create_each_block(child_ctx);
              each_blocks[i].c();
              transition_in(each_blocks[i], 1);
              each_blocks[i].m(t.parentNode, t);
            }
          }
          group_outros();
          for (i = each_value.length; i < each_blocks.length; i += 1) {
            out(i);
          }
          check_outros();
        }
        const botbar_changes = {};
        if (dirty & /*chartProps*/
        4)
          botbar_changes.props = /*chartProps*/
          ctx2[2];
        if (dirty & /*layout*/
        2)
          botbar_changes.layout = /*layout*/
          ctx2[1];
        botbar.$set(botbar_changes);
      },
      i(local) {
        if (current)
          return;
        for (let i = 0; i < each_value.length; i += 1) {
          transition_in(each_blocks[i]);
        }
        transition_in(botbar.$$.fragment, local);
        current = true;
      },
      o(local) {
        each_blocks = each_blocks.filter(Boolean);
        for (let i = 0; i < each_blocks.length; i += 1) {
          transition_out(each_blocks[i]);
        }
        transition_out(botbar.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(t);
        }
        destroy_each(each_blocks, detaching);
        destroy_component(botbar, detaching);
      }
    };
  }
  function create_each_block(ctx) {
    let pane_1;
    let current;
    pane_1 = new Pane({
      props: {
        id: (
          /*i*/
          ctx[27]
        ),
        layout: (
          /*layout*/
          ctx[1].grids[
            /*i*/
            ctx[27]
          ]
        ),
        props: (
          /*chartProps*/
          ctx[2]
        ),
        main: (
          /*pane*/
          ctx[25] === /*hub*/
          ctx[3].chart
        )
      }
    });
    return {
      c() {
        create_component(pane_1.$$.fragment);
      },
      m(target, anchor) {
        mount_component(pane_1, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const pane_1_changes = {};
        if (dirty & /*layout*/
        2)
          pane_1_changes.layout = /*layout*/
          ctx2[1].grids[
            /*i*/
            ctx2[27]
          ];
        if (dirty & /*chartProps*/
        4)
          pane_1_changes.props = /*chartProps*/
          ctx2[2];
        pane_1.$set(pane_1_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(pane_1.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(pane_1.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(pane_1, detaching);
      }
    };
  }
  function create_fragment$1(ctx) {
    let div;
    let current_block_type_index;
    let if_block;
    let current;
    const if_block_creators = [create_if_block, create_else_block];
    const if_blocks = [];
    function select_block_type(ctx2, dirty) {
      if (
        /*layout*/
        ctx2[1] && /*layout*/
        ctx2[1].main
      )
        return 0;
      return 1;
    }
    current_block_type_index = select_block_type(ctx);
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    return {
      c() {
        div = element("div");
        if_block.c();
        attr(div, "class", "nvjs-chart");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        if_blocks[current_block_type_index].m(div, null);
        current = true;
      },
      p(ctx2, [dirty]) {
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx2);
        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        } else {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
          if_block = if_blocks[current_block_type_index];
          if (!if_block) {
            if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block.c();
          } else {
            if_block.p(ctx2, dirty);
          }
          transition_in(if_block, 1);
          if_block.m(div, null);
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        if_blocks[current_block_type_index].d();
      }
    };
  }
  function instance$1($$self, $$props, $$invalidate) {
    let chartProps;
    let { props = {} } = $$props;
    function getLayout() {
      return layout;
    }
    function getRange() {
      return range;
    }
    function getCursor() {
      return cursor;
    }
    function setRange(val) {
      var _a;
      let emit = !((_a = val.preventDefault) != null ? _a : true);
      delete val.preventDefault;
      Object.assign(range, val);
      onRangeChanged(range, emit);
    }
    function setCursor(val) {
      var _a;
      let emit = !((_a = val.preventDefault) != null ? _a : true);
      delete val.preventDefault;
      Object.assign(cursor, val);
      onCursorChanged(cursor, emit);
    }
    let hub = DataHub$1.instance(props.id);
    let meta = MetaHub$1.instance(props.id);
    let events = Events$1.instance(props.id);
    let scan = DataScan.instance(props.id);
    scan.init(props);
    let interval = scan.detectInterval();
    let timeFrame = scan.getTimeframe();
    let range = scan.defaultRange();
    let cursor = new Cursor(meta);
    let storage = {};
    let ctx = new Context(props);
    let layout = null;
    scan.calcIndexOffsets();
    events.on("chart:cursor-changed", onCursorChanged);
    events.on("chart:cursor-locked", onCursorLocked);
    events.on("chart:range-changed", onRangeChanged);
    events.on("chart:update-layout", update2);
    events.on("chart:full-update", fullUpdate);
    onMount(() => {
      hub.calcSubset(range);
      hub.detectMain();
      hub.loadScripts(range, scan.tf, true);
      meta.init(props);
      scan.updatePanesHash();
      $$invalidate(1, layout = new Layout(chartProps, hub, meta));
    });
    onDestroy(() => {
      events.off("chart");
    });
    function onCursorChanged($cursor, emit = true) {
      if ($cursor.mode)
        $$invalidate(12, cursor.mode = $cursor.mode, cursor);
      if (cursor.mode !== "explore") {
        cursor.xSync(hub, layout, chartProps, $cursor);
        if ($cursor.visible === false) {
          setTimeout(() => update2());
        }
      }
      if (emit)
        events.emit("$cursor-update", Utils.makeCursorEvent($cursor, cursor, layout));
      update2();
    }
    function onCursorLocked(state) {
      if (cursor.scrollLock && state)
        return;
      $$invalidate(12, cursor.locked = state, cursor);
    }
    function onRangeChanged($range, emit = true) {
      if (emit)
        events.emit("$range-update", $range);
      rangeUpdate($range);
      hub.updateRange(range);
      if (cursor.locked)
        return;
      cursor.xValues(hub, layout, chartProps);
      cursor.yValues(layout);
      update2();
      let Q = props.config.QUANTIZE_AFTER;
      if (Q)
        Utils.afterAll(storage, quantizeCursor, Q);
    }
    function quantizeCursor() {
      cursor.xSync(hub, layout, chartProps, cursor);
      update2();
    }
    function update2(opt = {}, emit = true) {
      if (emit)
        events.emit("$chart-pre-update");
      if (opt.updateHash)
        scan.updatePanesHash();
      if (scan.panesChanged())
        return fullUpdate(opt);
      $$invalidate(12, cursor);
      $$invalidate(1, layout = new Layout(chartProps, hub, meta));
      events.emit("update-pane", layout);
      events.emitSpec("botbar", "update-bb", layout);
      if (emit)
        events.emit("$chart-update");
    }
    function fullUpdate(opt = {}) {
      let prevIbMode = scan.ibMode;
      $$invalidate(9, interval = scan.detectInterval());
      $$invalidate(10, timeFrame = scan.getTimeframe());
      let ibc = scan.ibMode !== prevIbMode;
      if (!range.length || opt.resetRange || ibc) {
        rangeUpdate(scan.defaultRange());
      }
      scan.calcIndexOffsets();
      hub.calcSubset(range);
      hub.init(hub.data);
      hub.detectMain();
      hub.loadScripts();
      meta.init(props);
      meta.restore();
      scan.updatePanesHash();
      update2();
      events.emit("remake-grid");
    }
    function rangeUpdate($range) {
      $$invalidate(11, range = $range);
      $$invalidate(
        2,
        chartProps.range = range,
        // Instant update
        chartProps
      );
    }
    $$self.$$set = ($$props2) => {
      if ("props" in $$props2)
        $$invalidate(0, props = $$props2.props);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*interval, timeFrame, range, cursor, props*/
      7681) {
        $$invalidate(2, chartProps = Object.assign({ interval, timeFrame, range, ctx, cursor }, props));
      }
    };
    return [
      props,
      layout,
      chartProps,
      hub,
      getLayout,
      getRange,
      getCursor,
      setRange,
      setCursor,
      interval,
      timeFrame,
      range,
      cursor
    ];
  }
  class Chart extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$1, create_fragment$1, safe_not_equal, {
        props: 0,
        getLayout: 4,
        getRange: 5,
        getCursor: 6,
        setRange: 7,
        setCursor: 8
      });
    }
    get getLayout() {
      return this.$$.ctx[4];
    }
    get getRange() {
      return this.$$.ctx[5];
    }
    get getCursor() {
      return this.$$.ctx[6];
    }
    get setRange() {
      return this.$$.ctx[7];
    }
    get setCursor() {
      return this.$$.ctx[8];
    }
  }
  function add_css(target) {
    append_styles(target, "svelte-7z7hqo", ".svelte-7z7hqo::after,.svelte-7z7hqo::before{box-sizing:content-box}.night-vision.svelte-7z7hqo{position:relative;direction:ltr}");
  }
  function create_fragment(ctx) {
    let div;
    let chart_1;
    let current;
    let chart_1_props = { props: (
      /*props*/
      ctx[1]
    ) };
    chart_1 = new Chart({ props: chart_1_props });
    ctx[19](chart_1);
    return {
      c() {
        div = element("div");
        create_component(chart_1.$$.fragment);
        attr(div, "class", "night-vision svelte-7z7hqo");
        attr(
          div,
          "id",
          /*id*/
          ctx[0]
        );
        attr(
          div,
          "style",
          /*style*/
          ctx[3]
        );
      },
      m(target, anchor) {
        insert(target, div, anchor);
        mount_component(chart_1, div, null);
        current = true;
      },
      p(ctx2, [dirty]) {
        const chart_1_changes = {};
        if (dirty & /*props*/
        2)
          chart_1_changes.props = /*props*/
          ctx2[1];
        chart_1.$set(chart_1_changes);
        if (!current || dirty & /*id*/
        1) {
          attr(
            div,
            "id",
            /*id*/
            ctx2[0]
          );
        }
        if (!current || dirty & /*style*/
        8) {
          attr(
            div,
            "style",
            /*style*/
            ctx2[3]
          );
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(chart_1.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(chart_1.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        ctx[19](null);
        destroy_component(chart_1);
      }
    };
  }
  function instance($$self, $$props, $$invalidate) {
    let configMerge;
    let offset;
    let colorsUser;
    let props;
    let style;
    let chart;
    function getChart() {
      return chart;
    }
    let { showLogo = false } = $$props;
    let { id = "nvjs" } = $$props;
    let { width = 750 } = $$props;
    let { height = 420 } = $$props;
    let { colors = {} } = $$props;
    let { toolbar = false } = $$props;
    let { scripts = [] } = $$props;
    let { config = {} } = $$props;
    let { indexBased = false } = $$props;
    let { timezone = 0 } = $$props;
    let { data = {} } = $$props;
    let { autoResize = false } = $$props;
    function chart_1_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        chart = $$value;
        $$invalidate(2, chart);
      });
    }
    $$self.$$set = ($$props2) => {
      if ("showLogo" in $$props2)
        $$invalidate(5, showLogo = $$props2.showLogo);
      if ("id" in $$props2)
        $$invalidate(0, id = $$props2.id);
      if ("width" in $$props2)
        $$invalidate(6, width = $$props2.width);
      if ("height" in $$props2)
        $$invalidate(7, height = $$props2.height);
      if ("colors" in $$props2)
        $$invalidate(8, colors = $$props2.colors);
      if ("toolbar" in $$props2)
        $$invalidate(9, toolbar = $$props2.toolbar);
      if ("scripts" in $$props2)
        $$invalidate(10, scripts = $$props2.scripts);
      if ("config" in $$props2)
        $$invalidate(11, config = $$props2.config);
      if ("indexBased" in $$props2)
        $$invalidate(12, indexBased = $$props2.indexBased);
      if ("timezone" in $$props2)
        $$invalidate(13, timezone = $$props2.timezone);
      if ("data" in $$props2)
        $$invalidate(14, data = $$props2.data);
      if ("autoResize" in $$props2)
        $$invalidate(15, autoResize = $$props2.autoResize);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*config*/
      2048) {
        $$invalidate(16, configMerge = Object.assign(Const.ChartConfig, config));
      }
      if ($$self.$$.dirty & /*toolbar, config*/
      2560) {
        $$invalidate(18, offset = toolbar ? config.TOOLBAR : 0);
      }
      if ($$self.$$.dirty & /*colors*/
      256) {
        $$invalidate(17, colorsUser = Object.assign(Const.COLORS, colors));
      }
      if ($$self.$$.dirty & /*showLogo, id, width, offset, height, colorsUser, scripts, configMerge, timezone*/
      468193) {
        $$invalidate(1, props = {
          showLogo,
          id,
          width: width - offset,
          height,
          colors: colorsUser,
          //toolbar,
          scripts,
          config: configMerge,
          //legendButtons,
          //indexBased,
          //extensions,
          //xSettings,
          //skin,
          timezone
        });
      }
      if ($$self.$$.dirty & /*props*/
      2) {
        $$invalidate(3, style = `
    width: ${props.width}px;
    height: ${props.height}px;
`);
      }
    };
    return [
      id,
      props,
      chart,
      style,
      getChart,
      showLogo,
      width,
      height,
      colors,
      toolbar,
      scripts,
      config,
      indexBased,
      timezone,
      data,
      autoResize,
      configMerge,
      colorsUser,
      offset,
      chart_1_binding
    ];
  }
  let NightVision$1 = class NightVision extends SvelteComponent {
    constructor(options) {
      super();
      init(
        this,
        options,
        instance,
        create_fragment,
        safe_not_equal,
        {
          getChart: 4,
          showLogo: 5,
          id: 0,
          width: 6,
          height: 7,
          colors: 8,
          toolbar: 9,
          scripts: 10,
          config: 11,
          indexBased: 12,
          timezone: 13,
          data: 14,
          autoResize: 15
        },
        add_css
      );
    }
    get getChart() {
      return this.$$.ctx[4];
    }
    get showLogo() {
      return this.$$.ctx[5];
    }
    set showLogo(showLogo) {
      this.$$set({ showLogo });
      flush();
    }
    get id() {
      return this.$$.ctx[0];
    }
    set id(id) {
      this.$$set({ id });
      flush();
    }
    get width() {
      return this.$$.ctx[6];
    }
    set width(width) {
      this.$$set({ width });
      flush();
    }
    get height() {
      return this.$$.ctx[7];
    }
    set height(height) {
      this.$$set({ height });
      flush();
    }
    get colors() {
      return this.$$.ctx[8];
    }
    set colors(colors) {
      this.$$set({ colors });
      flush();
    }
    get toolbar() {
      return this.$$.ctx[9];
    }
    set toolbar(toolbar) {
      this.$$set({ toolbar });
      flush();
    }
    get scripts() {
      return this.$$.ctx[10];
    }
    set scripts(scripts) {
      this.$$set({ scripts });
      flush();
    }
    get config() {
      return this.$$.ctx[11];
    }
    set config(config) {
      this.$$set({ config });
      flush();
    }
    get indexBased() {
      return this.$$.ctx[12];
    }
    set indexBased(indexBased) {
      this.$$set({ indexBased });
      flush();
    }
    get timezone() {
      return this.$$.ctx[13];
    }
    set timezone(timezone) {
      this.$$set({ timezone });
      flush();
    }
    get data() {
      return this.$$.ctx[14];
    }
    set data(data) {
      this.$$set({ data });
      flush();
    }
    get autoResize() {
      return this.$$.ctx[15];
    }
    set autoResize(autoResize) {
      this.$$set({ autoResize });
      flush();
    }
  };
  function resizeTracker(chart) {
    const resizeObserver = new ResizeObserver(() => {
      const rect = chart.root.getBoundingClientRect();
      chart.width = rect.width;
      chart.height = rect.height;
    });
    resizeObserver.observe(chart.root);
  }
  class NightVision {
    constructor(target, props = {}) {
      this._data = props.data || {};
      this._scripts = props.scripts || [];
      const id = props.id || "nvjs";
      this.ww = WebWork$1.instance(id, this);
      this.se = SeClient$1.instance(id, this);
      this.hub = DataHub$1.instance(id);
      this.meta = MetaHub$1.instance(id);
      this.scan = DataScan.instance(id);
      this.events = Events$1.instance(id);
      this.scriptHub = Scripts$1.instance(id);
      this.hub.init(this._data);
      this.scriptHub.init(this._scripts);
      this.root = document.getElementById(target);
      this.comp = new NightVision$1({
        target: this.root,
        props
      });
      if (props.autoResize) {
        resizeTracker(this);
      }
      this.se.setRefs(this.hub, this.scan);
    }
    // *** PROPS ***
    // (see the default values in NightVision.svelte)
    // Chart container id (should be unique)
    get id() {
      return this.comp.id;
    }
    set id(val) {
      this.comp.$set({ id: val });
    }
    // Width of the chart
    get width() {
      return this.comp.width;
    }
    set width(val) {
      this.comp.$set({ width: val });
      setTimeout(() => this.update());
    }
    // Height of the chart
    get height() {
      return this.comp.height;
    }
    set height(val) {
      this.comp.$set({ height: val });
      setTimeout(() => this.update());
    }
    // Colors (modify specific colors)
    // TODO: not reactive enough
    get colors() {
      return this.comp.colors;
    }
    set colors(val) {
      this.comp.$set({ colors: val });
    }
    // Show NV logo or not
    get showLogo() {
      return this.comp.showLogo;
    }
    set showLogo(val) {
      this.comp.$set({ id: val });
    }
    // User-defined scripts (overlays & indicators)
    get scripts() {
      return this._scripts;
    }
    set scripts(val) {
      this._scripts = val;
      this.scriptHub.init(this._scripts);
      this.update("full");
    }
    // The data (auto-updated on reset)
    get data() {
      return this._data;
    }
    set data(val) {
      this._data = val;
      this.update("full");
    }
    // Overwrites the default config values
    get config() {
      return this.comp.config;
    }
    set config(val) {
      this.comp.$set({ config: val });
    }
    // Index-based mode of rendering
    get indexBased() {
      return this.comp.indexBased;
    }
    set indexBased(val) {
      this.comp.$set({ indexBased: val });
    }
    // Timezone (Shift from UTC, hours)
    get timezone() {
      return this.comp.timezone;
    }
    set timezone(val) {
      this.comp.$set({ timezone: val });
      setTimeout(() => this.update());
    }
    // *** Internal variables ***
    get layout() {
      const chart = this.comp.getChart();
      if (!chart)
        return null;
      return chart.getLayout();
    }
    get range() {
      const chart = this.comp.getChart();
      if (!chart)
        return null;
      return chart.getRange();
    }
    set range(val) {
      const chart = this.comp.getChart();
      if (!chart)
        return;
      chart.setRange(val);
    }
    get cursor() {
      const chart = this.comp.getChart();
      if (!chart)
        return null;
      return chart.getCursor();
    }
    set cursor(val) {
      const chart = this.comp.getChart();
      if (!chart)
        return;
      chart.setCursor(val);
    }
    // *** METHODS ***
    // Various updates of the chart
    update(_type = "layout", opt = {}) {
      const [type, id] = _type.split("-");
      const ev = this.events;
      switch (type) {
        case "layout":
          ev.emitSpec("chart", "update-layout", opt);
          break;
        case "data":
          this.hub.updateRange(this.range);
          this.meta.calcOhlcMap();
          ev.emitSpec("chart", "update-layout", opt);
          break;
        case "full":
          this.hub.init(this._data);
          ev.emitSpec("chart", "full-update", opt);
          break;
        case "grid":
          if (id === void 0) {
            ev.emit("remake-grid");
          } else {
            const gridId = `grid-${id}`;
            ev.emitSpec(gridId, "remake-grid", opt);
          }
          break;
        case "legend":
          if (id === void 0) {
            ev.emit("update-legend");
          } else {
            const gridId = `legend-${id}`;
            ev.emitSpec(gridId, "update-legend", opt);
          }
          break;
      }
    }
    // Reset everything
    fullReset() {
      this.update("full", { resetRange: true });
    }
    // Go to time/index
    goto(ti) {
      const range = this.range;
      const dti = range[1] - range[0];
      this.range = [ti - dti, ti];
    }
    // Scroll on interval forward
    // TODO: keep legend updated, when the cursor is outside
    scroll() {
      if (this.cursor.locked)
        return;
      const main = this.hub.mainOv.data;
      const last = main[main.length - 1];
      const ib = this.hub.indexBased;
      if (!last)
        return;
      const tl = ib ? main.length - 1 : last[0];
      const d = this.range[1] - tl;
      const int = this.scan.interval;
      if (d > 0)
        this.goto(this.range[1] + int);
    }
    // Should call this to clean-up memory / events
    destroy() {
      this.comp.$destroy();
      this.ww.stop();
    }
  }
  var hamster$2 = { exports: {} };
  (function(module2, exports3) {
    (function(window2, document2) {
      var Hamster = function(element2) {
        return new Hamster.Instance(element2);
      };
      Hamster.SUPPORT = "wheel";
      Hamster.ADD_EVENT = "addEventListener";
      Hamster.REMOVE_EVENT = "removeEventListener";
      Hamster.PREFIX = "";
      Hamster.READY = false;
      Hamster.Instance = function(element2) {
        if (!Hamster.READY) {
          Hamster.normalise.browser();
          Hamster.READY = true;
        }
        this.element = element2;
        this.handlers = [];
        return this;
      };
      Hamster.Instance.prototype = {
        /**
         * bind events to the instance
         * @param   {Function}    handler
         * @param   {Boolean}     useCapture
         * @returns {Hamster.Instance}
         */
        wheel: function onEvent(handler, useCapture) {
          Hamster.event.add(this, Hamster.SUPPORT, handler, useCapture);
          if (Hamster.SUPPORT === "DOMMouseScroll") {
            Hamster.event.add(this, "MozMousePixelScroll", handler, useCapture);
          }
          return this;
        },
        /**
         * unbind events to the instance
         * @param   {Function}    handler
         * @param   {Boolean}     useCapture
         * @returns {Hamster.Instance}
         */
        unwheel: function offEvent(handler, useCapture) {
          if (handler === void 0 && (handler = this.handlers.slice(-1)[0])) {
            handler = handler.original;
          }
          Hamster.event.remove(this, Hamster.SUPPORT, handler, useCapture);
          if (Hamster.SUPPORT === "DOMMouseScroll") {
            Hamster.event.remove(this, "MozMousePixelScroll", handler, useCapture);
          }
          return this;
        }
      };
      Hamster.event = {
        /**
         * cross-browser 'addWheelListener'
         * @param   {Instance}    hamster
         * @param   {String}      eventName
         * @param   {Function}    handler
         * @param   {Boolean}     useCapture
         */
        add: function add(hamster2, eventName, handler, useCapture) {
          var originalHandler = handler;
          handler = function(originalEvent) {
            if (!originalEvent) {
              originalEvent = window2.event;
            }
            var event = Hamster.normalise.event(originalEvent), delta = Hamster.normalise.delta(originalEvent);
            return originalHandler(event, delta[0], delta[1], delta[2]);
          };
          hamster2.element[Hamster.ADD_EVENT](Hamster.PREFIX + eventName, handler, useCapture || false);
          hamster2.handlers.push({
            original: originalHandler,
            normalised: handler
          });
        },
        /**
         * removeWheelListener
         * @param   {Instance}    hamster
         * @param   {String}      eventName
         * @param   {Function}    handler
         * @param   {Boolean}     useCapture
         */
        remove: function remove(hamster2, eventName, handler, useCapture) {
          var originalHandler = handler, lookup = {}, handlers;
          for (var i = 0, len = hamster2.handlers.length; i < len; ++i) {
            lookup[hamster2.handlers[i].original] = hamster2.handlers[i];
          }
          handlers = lookup[originalHandler];
          handler = handlers.normalised;
          hamster2.element[Hamster.REMOVE_EVENT](Hamster.PREFIX + eventName, handler, useCapture || false);
          for (var h in hamster2.handlers) {
            if (hamster2.handlers[h] == handlers) {
              hamster2.handlers.splice(h, 1);
              break;
            }
          }
        }
      };
      var lowestDelta, lowestDeltaXY;
      Hamster.normalise = {
        /**
         * fix browser inconsistencies
         */
        browser: function normaliseBrowser() {
          if (!("onwheel" in document2 || document2.documentMode >= 9)) {
            Hamster.SUPPORT = document2.onmousewheel !== void 0 ? "mousewheel" : (
              // webkit and IE < 9 support at least "mousewheel"
              "DOMMouseScroll"
            );
          }
          if (!window2.addEventListener) {
            Hamster.ADD_EVENT = "attachEvent";
            Hamster.REMOVE_EVENT = "detachEvent";
            Hamster.PREFIX = "on";
          }
        },
        /**
         * create a normalised event object
         * @param   {Function}    originalEvent
         * @returns {Object}      event
         */
        event: function normaliseEvent(originalEvent) {
          var event = {
            // keep a reference to the original event object
            originalEvent,
            target: originalEvent.target || originalEvent.srcElement,
            type: "wheel",
            deltaMode: originalEvent.type === "MozMousePixelScroll" ? 0 : 1,
            deltaX: 0,
            deltaZ: 0,
            preventDefault: function() {
              if (originalEvent.preventDefault) {
                originalEvent.preventDefault();
              } else {
                originalEvent.returnValue = false;
              }
            },
            stopPropagation: function() {
              if (originalEvent.stopPropagation) {
                originalEvent.stopPropagation();
              } else {
                originalEvent.cancelBubble = false;
              }
            }
          };
          if (originalEvent.wheelDelta) {
            event.deltaY = -1 / 40 * originalEvent.wheelDelta;
          }
          if (originalEvent.wheelDeltaX) {
            event.deltaX = -1 / 40 * originalEvent.wheelDeltaX;
          }
          if (originalEvent.detail) {
            event.deltaY = originalEvent.detail;
          }
          return event;
        },
        /**
         * normalise 'deltas' of the mouse wheel
         * @param   {Function}    originalEvent
         * @returns {Array}       deltas
         */
        delta: function normaliseDelta(originalEvent) {
          var delta = 0, deltaX = 0, deltaY = 0, absDelta = 0, absDeltaXY = 0, fn;
          if (originalEvent.deltaY) {
            deltaY = originalEvent.deltaY * -1;
            delta = deltaY;
          }
          if (originalEvent.deltaX) {
            deltaX = originalEvent.deltaX;
            delta = deltaX * -1;
          }
          if (originalEvent.wheelDelta) {
            delta = originalEvent.wheelDelta;
          }
          if (originalEvent.wheelDeltaY) {
            deltaY = originalEvent.wheelDeltaY;
          }
          if (originalEvent.wheelDeltaX) {
            deltaX = originalEvent.wheelDeltaX * -1;
          }
          if (originalEvent.detail) {
            delta = originalEvent.detail * -1;
          }
          if (delta === 0) {
            return [0, 0, 0];
          }
          absDelta = Math.abs(delta);
          if (!lowestDelta || absDelta < lowestDelta) {
            lowestDelta = absDelta;
          }
          absDeltaXY = Math.max(Math.abs(deltaY), Math.abs(deltaX));
          if (!lowestDeltaXY || absDeltaXY < lowestDeltaXY) {
            lowestDeltaXY = absDeltaXY;
          }
          fn = delta > 0 ? "floor" : "ceil";
          delta = Math[fn](delta / lowestDelta);
          deltaX = Math[fn](deltaX / lowestDeltaXY);
          deltaY = Math[fn](deltaY / lowestDeltaXY);
          return [delta, deltaX, deltaY];
        }
      };
      if (typeof window2.define === "function" && window2.define.amd) {
        window2.define("hamster", [], function() {
          return Hamster;
        });
      } else {
        module2.exports = Hamster;
      }
    })(window, window.document);
  })(hamster$2);
  var hamsterExports = hamster$2.exports;
  const hamster = /* @__PURE__ */ getDefaultExportFromCjs(hamsterExports);
  const hamster$1 = /* @__PURE__ */ _mergeNamespaces({
    __proto__: null,
    default: hamster
  }, [hamsterExports]);
  var hammer$2 = { exports: {} };
  /*! Hammer.JS - v2.0.7 - 2016-04-22
   * http://hammerjs.github.io/
   *
   * Copyright (c) 2016 Jorik Tangelder;
   * Licensed under the MIT license */
  (function(module2) {
    (function(window2, document2, exportName, undefined$1) {
      var VENDOR_PREFIXES = ["", "webkit", "Moz", "MS", "ms", "o"];
      var TEST_ELEMENT = document2.createElement("div");
      var TYPE_FUNCTION = "function";
      var round = Math.round;
      var abs = Math.abs;
      var now2 = Date.now;
      function setTimeoutContext(fn, timeout, context) {
        return setTimeout(bindFn(fn, context), timeout);
      }
      function invokeArrayArg(arg, fn, context) {
        if (Array.isArray(arg)) {
          each(arg, context[fn], context);
          return true;
        }
        return false;
      }
      function each(obj, iterator, context) {
        var i;
        if (!obj) {
          return;
        }
        if (obj.forEach) {
          obj.forEach(iterator, context);
        } else if (obj.length !== undefined$1) {
          i = 0;
          while (i < obj.length) {
            iterator.call(context, obj[i], i, obj);
            i++;
          }
        } else {
          for (i in obj) {
            obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
          }
        }
      }
      function deprecate(method, name, message) {
        var deprecationMessage = "DEPRECATED METHOD: " + name + "\n" + message + " AT \n";
        return function() {
          var e = new Error("get-stack-trace");
          var stack = e && e.stack ? e.stack.replace(/^[^\(]+?[\n$]/gm, "").replace(/^\s+at\s+/gm, "").replace(/^Object.<anonymous>\s*\(/gm, "{anonymous}()@") : "Unknown Stack Trace";
          var log = window2.console && (window2.console.warn || window2.console.log);
          if (log) {
            log.call(window2.console, deprecationMessage, stack);
          }
          return method.apply(this, arguments);
        };
      }
      var assign;
      if (typeof Object.assign !== "function") {
        assign = function assign2(target) {
          if (target === undefined$1 || target === null) {
            throw new TypeError("Cannot convert undefined or null to object");
          }
          var output = Object(target);
          for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source !== undefined$1 && source !== null) {
              for (var nextKey in source) {
                if (source.hasOwnProperty(nextKey)) {
                  output[nextKey] = source[nextKey];
                }
              }
            }
          }
          return output;
        };
      } else {
        assign = Object.assign;
      }
      var extend = deprecate(function extend2(dest, src, merge2) {
        var keys = Object.keys(src);
        var i = 0;
        while (i < keys.length) {
          if (!merge2 || merge2 && dest[keys[i]] === undefined$1) {
            dest[keys[i]] = src[keys[i]];
          }
          i++;
        }
        return dest;
      }, "extend", "Use `assign`.");
      var merge = deprecate(function merge2(dest, src) {
        return extend(dest, src, true);
      }, "merge", "Use `assign`.");
      function inherit(child, base, properties) {
        var baseP = base.prototype, childP;
        childP = child.prototype = Object.create(baseP);
        childP.constructor = child;
        childP._super = baseP;
        if (properties) {
          assign(childP, properties);
        }
      }
      function bindFn(fn, context) {
        return function boundFn() {
          return fn.apply(context, arguments);
        };
      }
      function boolOrFn(val, args) {
        if (typeof val == TYPE_FUNCTION) {
          return val.apply(args ? args[0] || undefined$1 : undefined$1, args);
        }
        return val;
      }
      function ifUndefined(val1, val2) {
        return val1 === undefined$1 ? val2 : val1;
      }
      function addEventListeners(target, types, handler) {
        each(splitStr(types), function(type) {
          target.addEventListener(type, handler, false);
        });
      }
      function removeEventListeners(target, types, handler) {
        each(splitStr(types), function(type) {
          target.removeEventListener(type, handler, false);
        });
      }
      function hasParent(node, parent) {
        while (node) {
          if (node == parent) {
            return true;
          }
          node = node.parentNode;
        }
        return false;
      }
      function inStr(str, find) {
        return str.indexOf(find) > -1;
      }
      function splitStr(str) {
        return str.trim().split(/\s+/g);
      }
      function inArray(src, find, findByKey) {
        if (src.indexOf && !findByKey) {
          return src.indexOf(find);
        } else {
          var i = 0;
          while (i < src.length) {
            if (findByKey && src[i][findByKey] == find || !findByKey && src[i] === find) {
              return i;
            }
            i++;
          }
          return -1;
        }
      }
      function toArray(obj) {
        return Array.prototype.slice.call(obj, 0);
      }
      function uniqueArray(src, key, sort) {
        var results = [];
        var values = [];
        var i = 0;
        while (i < src.length) {
          var val = key ? src[i][key] : src[i];
          if (inArray(values, val) < 0) {
            results.push(src[i]);
          }
          values[i] = val;
          i++;
        }
        if (sort) {
          if (!key) {
            results = results.sort();
          } else {
            results = results.sort(function sortUniqueArray(a, b) {
              return a[key] > b[key];
            });
          }
        }
        return results;
      }
      function prefixed(obj, property) {
        var prefix, prop;
        var camelProp = property[0].toUpperCase() + property.slice(1);
        var i = 0;
        while (i < VENDOR_PREFIXES.length) {
          prefix = VENDOR_PREFIXES[i];
          prop = prefix ? prefix + camelProp : property;
          if (prop in obj) {
            return prop;
          }
          i++;
        }
        return undefined$1;
      }
      var _uniqueId = 1;
      function uniqueId() {
        return _uniqueId++;
      }
      function getWindowForElement(element2) {
        var doc = element2.ownerDocument || element2;
        return doc.defaultView || doc.parentWindow || window2;
      }
      var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;
      var SUPPORT_TOUCH = "ontouchstart" in window2;
      var SUPPORT_POINTER_EVENTS = prefixed(window2, "PointerEvent") !== undefined$1;
      var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);
      var INPUT_TYPE_TOUCH = "touch";
      var INPUT_TYPE_PEN = "pen";
      var INPUT_TYPE_MOUSE = "mouse";
      var INPUT_TYPE_KINECT = "kinect";
      var COMPUTE_INTERVAL = 25;
      var INPUT_START = 1;
      var INPUT_MOVE = 2;
      var INPUT_END = 4;
      var INPUT_CANCEL = 8;
      var DIRECTION_NONE = 1;
      var DIRECTION_LEFT = 2;
      var DIRECTION_RIGHT = 4;
      var DIRECTION_UP = 8;
      var DIRECTION_DOWN = 16;
      var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
      var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
      var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;
      var PROPS_XY = ["x", "y"];
      var PROPS_CLIENT_XY = ["clientX", "clientY"];
      function Input2(manager, callback) {
        var self2 = this;
        this.manager = manager;
        this.callback = callback;
        this.element = manager.element;
        this.target = manager.options.inputTarget;
        this.domHandler = function(ev) {
          if (boolOrFn(manager.options.enable, [manager])) {
            self2.handler(ev);
          }
        };
        this.init();
      }
      Input2.prototype = {
        /**
         * should handle the inputEvent data and trigger the callback
         * @virtual
         */
        handler: function() {
        },
        /**
         * bind the events
         */
        init: function() {
          this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
          this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
          this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
        },
        /**
         * unbind the events
         */
        destroy: function() {
          this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
          this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
          this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
        }
      };
      function createInputInstance(manager) {
        var Type;
        var inputClass = manager.options.inputClass;
        if (inputClass) {
          Type = inputClass;
        } else if (SUPPORT_POINTER_EVENTS) {
          Type = PointerEventInput;
        } else if (SUPPORT_ONLY_TOUCH) {
          Type = TouchInput;
        } else if (!SUPPORT_TOUCH) {
          Type = MouseInput;
        } else {
          Type = TouchMouseInput;
        }
        return new Type(manager, inputHandler);
      }
      function inputHandler(manager, eventType, input) {
        var pointersLen = input.pointers.length;
        var changedPointersLen = input.changedPointers.length;
        var isFirst = eventType & INPUT_START && pointersLen - changedPointersLen === 0;
        var isFinal = eventType & (INPUT_END | INPUT_CANCEL) && pointersLen - changedPointersLen === 0;
        input.isFirst = !!isFirst;
        input.isFinal = !!isFinal;
        if (isFirst) {
          manager.session = {};
        }
        input.eventType = eventType;
        computeInputData(manager, input);
        manager.emit("hammer.input", input);
        manager.recognize(input);
        manager.session.prevInput = input;
      }
      function computeInputData(manager, input) {
        var session = manager.session;
        var pointers = input.pointers;
        var pointersLength = pointers.length;
        if (!session.firstInput) {
          session.firstInput = simpleCloneInputData(input);
        }
        if (pointersLength > 1 && !session.firstMultiple) {
          session.firstMultiple = simpleCloneInputData(input);
        } else if (pointersLength === 1) {
          session.firstMultiple = false;
        }
        var firstInput = session.firstInput;
        var firstMultiple = session.firstMultiple;
        var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;
        var center = input.center = getCenter(pointers);
        input.timeStamp = now2();
        input.deltaTime = input.timeStamp - firstInput.timeStamp;
        input.angle = getAngle(offsetCenter, center);
        input.distance = getDistance(offsetCenter, center);
        computeDeltaXY(session, input);
        input.offsetDirection = getDirection(input.deltaX, input.deltaY);
        var overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
        input.overallVelocityX = overallVelocity.x;
        input.overallVelocityY = overallVelocity.y;
        input.overallVelocity = abs(overallVelocity.x) > abs(overallVelocity.y) ? overallVelocity.x : overallVelocity.y;
        input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
        input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;
        input.maxPointers = !session.prevInput ? input.pointers.length : input.pointers.length > session.prevInput.maxPointers ? input.pointers.length : session.prevInput.maxPointers;
        computeIntervalInputData(session, input);
        var target = manager.element;
        if (hasParent(input.srcEvent.target, target)) {
          target = input.srcEvent.target;
        }
        input.target = target;
      }
      function computeDeltaXY(session, input) {
        var center = input.center;
        var offset = session.offsetDelta || {};
        var prevDelta = session.prevDelta || {};
        var prevInput = session.prevInput || {};
        if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
          prevDelta = session.prevDelta = {
            x: prevInput.deltaX || 0,
            y: prevInput.deltaY || 0
          };
          offset = session.offsetDelta = {
            x: center.x,
            y: center.y
          };
        }
        input.deltaX = prevDelta.x + (center.x - offset.x);
        input.deltaY = prevDelta.y + (center.y - offset.y);
      }
      function computeIntervalInputData(session, input) {
        var last = session.lastInterval || input, deltaTime = input.timeStamp - last.timeStamp, velocity, velocityX, velocityY, direction;
        if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined$1)) {
          var deltaX = input.deltaX - last.deltaX;
          var deltaY = input.deltaY - last.deltaY;
          var v = getVelocity(deltaTime, deltaX, deltaY);
          velocityX = v.x;
          velocityY = v.y;
          velocity = abs(v.x) > abs(v.y) ? v.x : v.y;
          direction = getDirection(deltaX, deltaY);
          session.lastInterval = input;
        } else {
          velocity = last.velocity;
          velocityX = last.velocityX;
          velocityY = last.velocityY;
          direction = last.direction;
        }
        input.velocity = velocity;
        input.velocityX = velocityX;
        input.velocityY = velocityY;
        input.direction = direction;
      }
      function simpleCloneInputData(input) {
        var pointers = [];
        var i = 0;
        while (i < input.pointers.length) {
          pointers[i] = {
            clientX: round(input.pointers[i].clientX),
            clientY: round(input.pointers[i].clientY)
          };
          i++;
        }
        return {
          timeStamp: now2(),
          pointers,
          center: getCenter(pointers),
          deltaX: input.deltaX,
          deltaY: input.deltaY
        };
      }
      function getCenter(pointers) {
        var pointersLength = pointers.length;
        if (pointersLength === 1) {
          return {
            x: round(pointers[0].clientX),
            y: round(pointers[0].clientY)
          };
        }
        var x = 0, y = 0, i = 0;
        while (i < pointersLength) {
          x += pointers[i].clientX;
          y += pointers[i].clientY;
          i++;
        }
        return {
          x: round(x / pointersLength),
          y: round(y / pointersLength)
        };
      }
      function getVelocity(deltaTime, x, y) {
        return {
          x: x / deltaTime || 0,
          y: y / deltaTime || 0
        };
      }
      function getDirection(x, y) {
        if (x === y) {
          return DIRECTION_NONE;
        }
        if (abs(x) >= abs(y)) {
          return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
        }
        return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
      }
      function getDistance(p1, p2, props) {
        if (!props) {
          props = PROPS_XY;
        }
        var x = p2[props[0]] - p1[props[0]], y = p2[props[1]] - p1[props[1]];
        return Math.sqrt(x * x + y * y);
      }
      function getAngle(p1, p2, props) {
        if (!props) {
          props = PROPS_XY;
        }
        var x = p2[props[0]] - p1[props[0]], y = p2[props[1]] - p1[props[1]];
        return Math.atan2(y, x) * 180 / Math.PI;
      }
      function getRotation(start, end) {
        return getAngle(end[1], end[0], PROPS_CLIENT_XY) + getAngle(start[1], start[0], PROPS_CLIENT_XY);
      }
      function getScale(start, end) {
        return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
      }
      var MOUSE_INPUT_MAP = {
        mousedown: INPUT_START,
        mousemove: INPUT_MOVE,
        mouseup: INPUT_END
      };
      var MOUSE_ELEMENT_EVENTS = "mousedown";
      var MOUSE_WINDOW_EVENTS = "mousemove mouseup";
      function MouseInput() {
        this.evEl = MOUSE_ELEMENT_EVENTS;
        this.evWin = MOUSE_WINDOW_EVENTS;
        this.pressed = false;
        Input2.apply(this, arguments);
      }
      inherit(MouseInput, Input2, {
        /**
         * handle mouse events
         * @param {Object} ev
         */
        handler: function MEhandler(ev) {
          var eventType = MOUSE_INPUT_MAP[ev.type];
          if (eventType & INPUT_START && ev.button === 0) {
            this.pressed = true;
          }
          if (eventType & INPUT_MOVE && ev.which !== 1) {
            eventType = INPUT_END;
          }
          if (!this.pressed) {
            return;
          }
          if (eventType & INPUT_END) {
            this.pressed = false;
          }
          this.callback(this.manager, eventType, {
            pointers: [ev],
            changedPointers: [ev],
            pointerType: INPUT_TYPE_MOUSE,
            srcEvent: ev
          });
        }
      });
      var POINTER_INPUT_MAP = {
        pointerdown: INPUT_START,
        pointermove: INPUT_MOVE,
        pointerup: INPUT_END,
        pointercancel: INPUT_CANCEL,
        pointerout: INPUT_CANCEL
      };
      var IE10_POINTER_TYPE_ENUM = {
        2: INPUT_TYPE_TOUCH,
        3: INPUT_TYPE_PEN,
        4: INPUT_TYPE_MOUSE,
        5: INPUT_TYPE_KINECT
        // see https://twitter.com/jacobrossi/status/480596438489890816
      };
      var POINTER_ELEMENT_EVENTS = "pointerdown";
      var POINTER_WINDOW_EVENTS = "pointermove pointerup pointercancel";
      if (window2.MSPointerEvent && !window2.PointerEvent) {
        POINTER_ELEMENT_EVENTS = "MSPointerDown";
        POINTER_WINDOW_EVENTS = "MSPointerMove MSPointerUp MSPointerCancel";
      }
      function PointerEventInput() {
        this.evEl = POINTER_ELEMENT_EVENTS;
        this.evWin = POINTER_WINDOW_EVENTS;
        Input2.apply(this, arguments);
        this.store = this.manager.session.pointerEvents = [];
      }
      inherit(PointerEventInput, Input2, {
        /**
         * handle mouse events
         * @param {Object} ev
         */
        handler: function PEhandler(ev) {
          var store = this.store;
          var removePointer = false;
          var eventTypeNormalized = ev.type.toLowerCase().replace("ms", "");
          var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
          var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;
          var isTouch = pointerType == INPUT_TYPE_TOUCH;
          var storeIndex = inArray(store, ev.pointerId, "pointerId");
          if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
            if (storeIndex < 0) {
              store.push(ev);
              storeIndex = store.length - 1;
            }
          } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
            removePointer = true;
          }
          if (storeIndex < 0) {
            return;
          }
          store[storeIndex] = ev;
          this.callback(this.manager, eventType, {
            pointers: store,
            changedPointers: [ev],
            pointerType,
            srcEvent: ev
          });
          if (removePointer) {
            store.splice(storeIndex, 1);
          }
        }
      });
      var SINGLE_TOUCH_INPUT_MAP = {
        touchstart: INPUT_START,
        touchmove: INPUT_MOVE,
        touchend: INPUT_END,
        touchcancel: INPUT_CANCEL
      };
      var SINGLE_TOUCH_TARGET_EVENTS = "touchstart";
      var SINGLE_TOUCH_WINDOW_EVENTS = "touchstart touchmove touchend touchcancel";
      function SingleTouchInput() {
        this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
        this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
        this.started = false;
        Input2.apply(this, arguments);
      }
      inherit(SingleTouchInput, Input2, {
        handler: function TEhandler(ev) {
          var type = SINGLE_TOUCH_INPUT_MAP[ev.type];
          if (type === INPUT_START) {
            this.started = true;
          }
          if (!this.started) {
            return;
          }
          var touches = normalizeSingleTouches.call(this, ev, type);
          if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
            this.started = false;
          }
          this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
          });
        }
      });
      function normalizeSingleTouches(ev, type) {
        var all = toArray(ev.touches);
        var changed = toArray(ev.changedTouches);
        if (type & (INPUT_END | INPUT_CANCEL)) {
          all = uniqueArray(all.concat(changed), "identifier", true);
        }
        return [all, changed];
      }
      var TOUCH_INPUT_MAP = {
        touchstart: INPUT_START,
        touchmove: INPUT_MOVE,
        touchend: INPUT_END,
        touchcancel: INPUT_CANCEL
      };
      var TOUCH_TARGET_EVENTS = "touchstart touchmove touchend touchcancel";
      function TouchInput() {
        this.evTarget = TOUCH_TARGET_EVENTS;
        this.targetIds = {};
        Input2.apply(this, arguments);
      }
      inherit(TouchInput, Input2, {
        handler: function MTEhandler(ev) {
          var type = TOUCH_INPUT_MAP[ev.type];
          var touches = getTouches.call(this, ev, type);
          if (!touches) {
            return;
          }
          this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
          });
        }
      });
      function getTouches(ev, type) {
        var allTouches = toArray(ev.touches);
        var targetIds = this.targetIds;
        if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
          targetIds[allTouches[0].identifier] = true;
          return [allTouches, allTouches];
        }
        var i, targetTouches, changedTouches = toArray(ev.changedTouches), changedTargetTouches = [], target = this.target;
        targetTouches = allTouches.filter(function(touch) {
          return hasParent(touch.target, target);
        });
        if (type === INPUT_START) {
          i = 0;
          while (i < targetTouches.length) {
            targetIds[targetTouches[i].identifier] = true;
            i++;
          }
        }
        i = 0;
        while (i < changedTouches.length) {
          if (targetIds[changedTouches[i].identifier]) {
            changedTargetTouches.push(changedTouches[i]);
          }
          if (type & (INPUT_END | INPUT_CANCEL)) {
            delete targetIds[changedTouches[i].identifier];
          }
          i++;
        }
        if (!changedTargetTouches.length) {
          return;
        }
        return [
          // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
          uniqueArray(targetTouches.concat(changedTargetTouches), "identifier", true),
          changedTargetTouches
        ];
      }
      var DEDUP_TIMEOUT = 2500;
      var DEDUP_DISTANCE = 25;
      function TouchMouseInput() {
        Input2.apply(this, arguments);
        var handler = bindFn(this.handler, this);
        this.touch = new TouchInput(this.manager, handler);
        this.mouse = new MouseInput(this.manager, handler);
        this.primaryTouch = null;
        this.lastTouches = [];
      }
      inherit(TouchMouseInput, Input2, {
        /**
         * handle mouse and touch events
         * @param {Hammer} manager
         * @param {String} inputEvent
         * @param {Object} inputData
         */
        handler: function TMEhandler(manager, inputEvent, inputData) {
          var isTouch = inputData.pointerType == INPUT_TYPE_TOUCH, isMouse = inputData.pointerType == INPUT_TYPE_MOUSE;
          if (isMouse && inputData.sourceCapabilities && inputData.sourceCapabilities.firesTouchEvents) {
            return;
          }
          if (isTouch) {
            recordTouches.call(this, inputEvent, inputData);
          } else if (isMouse && isSyntheticEvent.call(this, inputData)) {
            return;
          }
          this.callback(manager, inputEvent, inputData);
        },
        /**
         * remove the event listeners
         */
        destroy: function destroy() {
          this.touch.destroy();
          this.mouse.destroy();
        }
      });
      function recordTouches(eventType, eventData) {
        if (eventType & INPUT_START) {
          this.primaryTouch = eventData.changedPointers[0].identifier;
          setLastTouch.call(this, eventData);
        } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
          setLastTouch.call(this, eventData);
        }
      }
      function setLastTouch(eventData) {
        var touch = eventData.changedPointers[0];
        if (touch.identifier === this.primaryTouch) {
          var lastTouch = { x: touch.clientX, y: touch.clientY };
          this.lastTouches.push(lastTouch);
          var lts = this.lastTouches;
          var removeLastTouch = function() {
            var i = lts.indexOf(lastTouch);
            if (i > -1) {
              lts.splice(i, 1);
            }
          };
          setTimeout(removeLastTouch, DEDUP_TIMEOUT);
        }
      }
      function isSyntheticEvent(eventData) {
        var x = eventData.srcEvent.clientX, y = eventData.srcEvent.clientY;
        for (var i = 0; i < this.lastTouches.length; i++) {
          var t = this.lastTouches[i];
          var dx = Math.abs(x - t.x), dy = Math.abs(y - t.y);
          if (dx <= DEDUP_DISTANCE && dy <= DEDUP_DISTANCE) {
            return true;
          }
        }
        return false;
      }
      var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, "touchAction");
      var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined$1;
      var TOUCH_ACTION_COMPUTE = "compute";
      var TOUCH_ACTION_AUTO = "auto";
      var TOUCH_ACTION_MANIPULATION = "manipulation";
      var TOUCH_ACTION_NONE = "none";
      var TOUCH_ACTION_PAN_X = "pan-x";
      var TOUCH_ACTION_PAN_Y = "pan-y";
      var TOUCH_ACTION_MAP = getTouchActionProps();
      function TouchAction(manager, value) {
        this.manager = manager;
        this.set(value);
      }
      TouchAction.prototype = {
        /**
         * set the touchAction value on the element or enable the polyfill
         * @param {String} value
         */
        set: function(value) {
          if (value == TOUCH_ACTION_COMPUTE) {
            value = this.compute();
          }
          if (NATIVE_TOUCH_ACTION && this.manager.element.style && TOUCH_ACTION_MAP[value]) {
            this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
          }
          this.actions = value.toLowerCase().trim();
        },
        /**
         * just re-set the touchAction value
         */
        update: function() {
          this.set(this.manager.options.touchAction);
        },
        /**
         * compute the value for the touchAction property based on the recognizer's settings
         * @returns {String} value
         */
        compute: function() {
          var actions = [];
          each(this.manager.recognizers, function(recognizer) {
            if (boolOrFn(recognizer.options.enable, [recognizer])) {
              actions = actions.concat(recognizer.getTouchAction());
            }
          });
          return cleanTouchActions(actions.join(" "));
        },
        /**
         * this method is called on each input cycle and provides the preventing of the browser behavior
         * @param {Object} input
         */
        preventDefaults: function(input) {
          var srcEvent = input.srcEvent;
          var direction = input.offsetDirection;
          if (this.manager.session.prevented) {
            srcEvent.preventDefault();
            return;
          }
          var actions = this.actions;
          var hasNone = inStr(actions, TOUCH_ACTION_NONE) && !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
          var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
          var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];
          if (hasNone) {
            var isTapPointer = input.pointers.length === 1;
            var isTapMovement = input.distance < 2;
            var isTapTouchTime = input.deltaTime < 250;
            if (isTapPointer && isTapMovement && isTapTouchTime) {
              return;
            }
          }
          if (hasPanX && hasPanY) {
            return;
          }
          if (hasNone || hasPanY && direction & DIRECTION_HORIZONTAL || hasPanX && direction & DIRECTION_VERTICAL) {
            return this.preventSrc(srcEvent);
          }
        },
        /**
         * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
         * @param {Object} srcEvent
         */
        preventSrc: function(srcEvent) {
          this.manager.session.prevented = true;
          srcEvent.preventDefault();
        }
      };
      function cleanTouchActions(actions) {
        if (inStr(actions, TOUCH_ACTION_NONE)) {
          return TOUCH_ACTION_NONE;
        }
        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);
        if (hasPanX && hasPanY) {
          return TOUCH_ACTION_NONE;
        }
        if (hasPanX || hasPanY) {
          return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
        }
        if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
          return TOUCH_ACTION_MANIPULATION;
        }
        return TOUCH_ACTION_AUTO;
      }
      function getTouchActionProps() {
        if (!NATIVE_TOUCH_ACTION) {
          return false;
        }
        var touchMap = {};
        var cssSupports = window2.CSS && window2.CSS.supports;
        ["auto", "manipulation", "pan-y", "pan-x", "pan-x pan-y", "none"].forEach(function(val) {
          touchMap[val] = cssSupports ? window2.CSS.supports("touch-action", val) : true;
        });
        return touchMap;
      }
      var STATE_POSSIBLE = 1;
      var STATE_BEGAN = 2;
      var STATE_CHANGED = 4;
      var STATE_ENDED = 8;
      var STATE_RECOGNIZED = STATE_ENDED;
      var STATE_CANCELLED = 16;
      var STATE_FAILED = 32;
      function Recognizer(options) {
        this.options = assign({}, this.defaults, options || {});
        this.id = uniqueId();
        this.manager = null;
        this.options.enable = ifUndefined(this.options.enable, true);
        this.state = STATE_POSSIBLE;
        this.simultaneous = {};
        this.requireFail = [];
      }
      Recognizer.prototype = {
        /**
         * @virtual
         * @type {Object}
         */
        defaults: {},
        /**
         * set options
         * @param {Object} options
         * @return {Recognizer}
         */
        set: function(options) {
          assign(this.options, options);
          this.manager && this.manager.touchAction.update();
          return this;
        },
        /**
         * recognize simultaneous with an other recognizer.
         * @param {Recognizer} otherRecognizer
         * @returns {Recognizer} this
         */
        recognizeWith: function(otherRecognizer) {
          if (invokeArrayArg(otherRecognizer, "recognizeWith", this)) {
            return this;
          }
          var simultaneous = this.simultaneous;
          otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
          if (!simultaneous[otherRecognizer.id]) {
            simultaneous[otherRecognizer.id] = otherRecognizer;
            otherRecognizer.recognizeWith(this);
          }
          return this;
        },
        /**
         * drop the simultaneous link. it doesnt remove the link on the other recognizer.
         * @param {Recognizer} otherRecognizer
         * @returns {Recognizer} this
         */
        dropRecognizeWith: function(otherRecognizer) {
          if (invokeArrayArg(otherRecognizer, "dropRecognizeWith", this)) {
            return this;
          }
          otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
          delete this.simultaneous[otherRecognizer.id];
          return this;
        },
        /**
         * recognizer can only run when an other is failing
         * @param {Recognizer} otherRecognizer
         * @returns {Recognizer} this
         */
        requireFailure: function(otherRecognizer) {
          if (invokeArrayArg(otherRecognizer, "requireFailure", this)) {
            return this;
          }
          var requireFail = this.requireFail;
          otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
          if (inArray(requireFail, otherRecognizer) === -1) {
            requireFail.push(otherRecognizer);
            otherRecognizer.requireFailure(this);
          }
          return this;
        },
        /**
         * drop the requireFailure link. it does not remove the link on the other recognizer.
         * @param {Recognizer} otherRecognizer
         * @returns {Recognizer} this
         */
        dropRequireFailure: function(otherRecognizer) {
          if (invokeArrayArg(otherRecognizer, "dropRequireFailure", this)) {
            return this;
          }
          otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
          var index = inArray(this.requireFail, otherRecognizer);
          if (index > -1) {
            this.requireFail.splice(index, 1);
          }
          return this;
        },
        /**
         * has require failures boolean
         * @returns {boolean}
         */
        hasRequireFailures: function() {
          return this.requireFail.length > 0;
        },
        /**
         * if the recognizer can recognize simultaneous with an other recognizer
         * @param {Recognizer} otherRecognizer
         * @returns {Boolean}
         */
        canRecognizeWith: function(otherRecognizer) {
          return !!this.simultaneous[otherRecognizer.id];
        },
        /**
         * You should use `tryEmit` instead of `emit` directly to check
         * that all the needed recognizers has failed before emitting.
         * @param {Object} input
         */
        emit: function(input) {
          var self2 = this;
          var state = this.state;
          function emit(event) {
            self2.manager.emit(event, input);
          }
          if (state < STATE_ENDED) {
            emit(self2.options.event + stateStr(state));
          }
          emit(self2.options.event);
          if (input.additionalEvent) {
            emit(input.additionalEvent);
          }
          if (state >= STATE_ENDED) {
            emit(self2.options.event + stateStr(state));
          }
        },
        /**
         * Check that all the require failure recognizers has failed,
         * if true, it emits a gesture event,
         * otherwise, setup the state to FAILED.
         * @param {Object} input
         */
        tryEmit: function(input) {
          if (this.canEmit()) {
            return this.emit(input);
          }
          this.state = STATE_FAILED;
        },
        /**
         * can we emit?
         * @returns {boolean}
         */
        canEmit: function() {
          var i = 0;
          while (i < this.requireFail.length) {
            if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
              return false;
            }
            i++;
          }
          return true;
        },
        /**
         * update the recognizer
         * @param {Object} inputData
         */
        recognize: function(inputData) {
          var inputDataClone = assign({}, inputData);
          if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
            this.reset();
            this.state = STATE_FAILED;
            return;
          }
          if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
            this.state = STATE_POSSIBLE;
          }
          this.state = this.process(inputDataClone);
          if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
            this.tryEmit(inputDataClone);
          }
        },
        /**
         * return the state of the recognizer
         * the actual recognizing happens in this method
         * @virtual
         * @param {Object} inputData
         * @returns {Const} STATE
         */
        process: function(inputData) {
        },
        // jshint ignore:line
        /**
         * return the preferred touch-action
         * @virtual
         * @returns {Array}
         */
        getTouchAction: function() {
        },
        /**
         * called when the gesture isn't allowed to recognize
         * like when another is being recognized or it is disabled
         * @virtual
         */
        reset: function() {
        }
      };
      function stateStr(state) {
        if (state & STATE_CANCELLED) {
          return "cancel";
        } else if (state & STATE_ENDED) {
          return "end";
        } else if (state & STATE_CHANGED) {
          return "move";
        } else if (state & STATE_BEGAN) {
          return "start";
        }
        return "";
      }
      function directionStr(direction) {
        if (direction == DIRECTION_DOWN) {
          return "down";
        } else if (direction == DIRECTION_UP) {
          return "up";
        } else if (direction == DIRECTION_LEFT) {
          return "left";
        } else if (direction == DIRECTION_RIGHT) {
          return "right";
        }
        return "";
      }
      function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
        var manager = recognizer.manager;
        if (manager) {
          return manager.get(otherRecognizer);
        }
        return otherRecognizer;
      }
      function AttrRecognizer() {
        Recognizer.apply(this, arguments);
      }
      inherit(AttrRecognizer, Recognizer, {
        /**
         * @namespace
         * @memberof AttrRecognizer
         */
        defaults: {
          /**
           * @type {Number}
           * @default 1
           */
          pointers: 1
        },
        /**
         * Used to check if it the recognizer receives valid input, like input.distance > 10.
         * @memberof AttrRecognizer
         * @param {Object} input
         * @returns {Boolean} recognized
         */
        attrTest: function(input) {
          var optionPointers = this.options.pointers;
          return optionPointers === 0 || input.pointers.length === optionPointers;
        },
        /**
         * Process the input and return the state for the recognizer
         * @memberof AttrRecognizer
         * @param {Object} input
         * @returns {*} State
         */
        process: function(input) {
          var state = this.state;
          var eventType = input.eventType;
          var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
          var isValid = this.attrTest(input);
          if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
            return state | STATE_CANCELLED;
          } else if (isRecognized || isValid) {
            if (eventType & INPUT_END) {
              return state | STATE_ENDED;
            } else if (!(state & STATE_BEGAN)) {
              return STATE_BEGAN;
            }
            return state | STATE_CHANGED;
          }
          return STATE_FAILED;
        }
      });
      function PanRecognizer() {
        AttrRecognizer.apply(this, arguments);
        this.pX = null;
        this.pY = null;
      }
      inherit(PanRecognizer, AttrRecognizer, {
        /**
         * @namespace
         * @memberof PanRecognizer
         */
        defaults: {
          event: "pan",
          threshold: 10,
          pointers: 1,
          direction: DIRECTION_ALL
        },
        getTouchAction: function() {
          var direction = this.options.direction;
          var actions = [];
          if (direction & DIRECTION_HORIZONTAL) {
            actions.push(TOUCH_ACTION_PAN_Y);
          }
          if (direction & DIRECTION_VERTICAL) {
            actions.push(TOUCH_ACTION_PAN_X);
          }
          return actions;
        },
        directionTest: function(input) {
          var options = this.options;
          var hasMoved = true;
          var distance = input.distance;
          var direction = input.direction;
          var x = input.deltaX;
          var y = input.deltaY;
          if (!(direction & options.direction)) {
            if (options.direction & DIRECTION_HORIZONTAL) {
              direction = x === 0 ? DIRECTION_NONE : x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
              hasMoved = x != this.pX;
              distance = Math.abs(input.deltaX);
            } else {
              direction = y === 0 ? DIRECTION_NONE : y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
              hasMoved = y != this.pY;
              distance = Math.abs(input.deltaY);
            }
          }
          input.direction = direction;
          return hasMoved && distance > options.threshold && direction & options.direction;
        },
        attrTest: function(input) {
          return AttrRecognizer.prototype.attrTest.call(this, input) && (this.state & STATE_BEGAN || !(this.state & STATE_BEGAN) && this.directionTest(input));
        },
        emit: function(input) {
          this.pX = input.deltaX;
          this.pY = input.deltaY;
          var direction = directionStr(input.direction);
          if (direction) {
            input.additionalEvent = this.options.event + direction;
          }
          this._super.emit.call(this, input);
        }
      });
      function PinchRecognizer() {
        AttrRecognizer.apply(this, arguments);
      }
      inherit(PinchRecognizer, AttrRecognizer, {
        /**
         * @namespace
         * @memberof PinchRecognizer
         */
        defaults: {
          event: "pinch",
          threshold: 0,
          pointers: 2
        },
        getTouchAction: function() {
          return [TOUCH_ACTION_NONE];
        },
        attrTest: function(input) {
          return this._super.attrTest.call(this, input) && (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
        },
        emit: function(input) {
          if (input.scale !== 1) {
            var inOut = input.scale < 1 ? "in" : "out";
            input.additionalEvent = this.options.event + inOut;
          }
          this._super.emit.call(this, input);
        }
      });
      function PressRecognizer() {
        Recognizer.apply(this, arguments);
        this._timer = null;
        this._input = null;
      }
      inherit(PressRecognizer, Recognizer, {
        /**
         * @namespace
         * @memberof PressRecognizer
         */
        defaults: {
          event: "press",
          pointers: 1,
          time: 251,
          // minimal time of the pointer to be pressed
          threshold: 9
          // a minimal movement is ok, but keep it low
        },
        getTouchAction: function() {
          return [TOUCH_ACTION_AUTO];
        },
        process: function(input) {
          var options = this.options;
          var validPointers = input.pointers.length === options.pointers;
          var validMovement = input.distance < options.threshold;
          var validTime = input.deltaTime > options.time;
          this._input = input;
          if (!validMovement || !validPointers || input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime) {
            this.reset();
          } else if (input.eventType & INPUT_START) {
            this.reset();
            this._timer = setTimeoutContext(function() {
              this.state = STATE_RECOGNIZED;
              this.tryEmit();
            }, options.time, this);
          } else if (input.eventType & INPUT_END) {
            return STATE_RECOGNIZED;
          }
          return STATE_FAILED;
        },
        reset: function() {
          clearTimeout(this._timer);
        },
        emit: function(input) {
          if (this.state !== STATE_RECOGNIZED) {
            return;
          }
          if (input && input.eventType & INPUT_END) {
            this.manager.emit(this.options.event + "up", input);
          } else {
            this._input.timeStamp = now2();
            this.manager.emit(this.options.event, this._input);
          }
        }
      });
      function RotateRecognizer() {
        AttrRecognizer.apply(this, arguments);
      }
      inherit(RotateRecognizer, AttrRecognizer, {
        /**
         * @namespace
         * @memberof RotateRecognizer
         */
        defaults: {
          event: "rotate",
          threshold: 0,
          pointers: 2
        },
        getTouchAction: function() {
          return [TOUCH_ACTION_NONE];
        },
        attrTest: function(input) {
          return this._super.attrTest.call(this, input) && (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
        }
      });
      function SwipeRecognizer() {
        AttrRecognizer.apply(this, arguments);
      }
      inherit(SwipeRecognizer, AttrRecognizer, {
        /**
         * @namespace
         * @memberof SwipeRecognizer
         */
        defaults: {
          event: "swipe",
          threshold: 10,
          velocity: 0.3,
          direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
          pointers: 1
        },
        getTouchAction: function() {
          return PanRecognizer.prototype.getTouchAction.call(this);
        },
        attrTest: function(input) {
          var direction = this.options.direction;
          var velocity;
          if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
            velocity = input.overallVelocity;
          } else if (direction & DIRECTION_HORIZONTAL) {
            velocity = input.overallVelocityX;
          } else if (direction & DIRECTION_VERTICAL) {
            velocity = input.overallVelocityY;
          }
          return this._super.attrTest.call(this, input) && direction & input.offsetDirection && input.distance > this.options.threshold && input.maxPointers == this.options.pointers && abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
        },
        emit: function(input) {
          var direction = directionStr(input.offsetDirection);
          if (direction) {
            this.manager.emit(this.options.event + direction, input);
          }
          this.manager.emit(this.options.event, input);
        }
      });
      function TapRecognizer() {
        Recognizer.apply(this, arguments);
        this.pTime = false;
        this.pCenter = false;
        this._timer = null;
        this._input = null;
        this.count = 0;
      }
      inherit(TapRecognizer, Recognizer, {
        /**
         * @namespace
         * @memberof PinchRecognizer
         */
        defaults: {
          event: "tap",
          pointers: 1,
          taps: 1,
          interval: 300,
          // max time between the multi-tap taps
          time: 250,
          // max time of the pointer to be down (like finger on the screen)
          threshold: 9,
          // a minimal movement is ok, but keep it low
          posThreshold: 10
          // a multi-tap can be a bit off the initial position
        },
        getTouchAction: function() {
          return [TOUCH_ACTION_MANIPULATION];
        },
        process: function(input) {
          var options = this.options;
          var validPointers = input.pointers.length === options.pointers;
          var validMovement = input.distance < options.threshold;
          var validTouchTime = input.deltaTime < options.time;
          this.reset();
          if (input.eventType & INPUT_START && this.count === 0) {
            return this.failTimeout();
          }
          if (validMovement && validTouchTime && validPointers) {
            if (input.eventType != INPUT_END) {
              return this.failTimeout();
            }
            var validInterval = this.pTime ? input.timeStamp - this.pTime < options.interval : true;
            var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;
            this.pTime = input.timeStamp;
            this.pCenter = input.center;
            if (!validMultiTap || !validInterval) {
              this.count = 1;
            } else {
              this.count += 1;
            }
            this._input = input;
            var tapCount = this.count % options.taps;
            if (tapCount === 0) {
              if (!this.hasRequireFailures()) {
                return STATE_RECOGNIZED;
              } else {
                this._timer = setTimeoutContext(function() {
                  this.state = STATE_RECOGNIZED;
                  this.tryEmit();
                }, options.interval, this);
                return STATE_BEGAN;
              }
            }
          }
          return STATE_FAILED;
        },
        failTimeout: function() {
          this._timer = setTimeoutContext(function() {
            this.state = STATE_FAILED;
          }, this.options.interval, this);
          return STATE_FAILED;
        },
        reset: function() {
          clearTimeout(this._timer);
        },
        emit: function() {
          if (this.state == STATE_RECOGNIZED) {
            this._input.tapCount = this.count;
            this.manager.emit(this.options.event, this._input);
          }
        }
      });
      function Hammer(element2, options) {
        options = options || {};
        options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
        return new Manager(element2, options);
      }
      Hammer.VERSION = "2.0.7";
      Hammer.defaults = {
        /**
         * set if DOM events are being triggered.
         * But this is slower and unused by simple implementations, so disabled by default.
         * @type {Boolean}
         * @default false
         */
        domEvents: false,
        /**
         * The value for the touchAction property/fallback.
         * When set to `compute` it will magically set the correct value based on the added recognizers.
         * @type {String}
         * @default compute
         */
        touchAction: TOUCH_ACTION_COMPUTE,
        /**
         * @type {Boolean}
         * @default true
         */
        enable: true,
        /**
         * EXPERIMENTAL FEATURE -- can be removed/changed
         * Change the parent input target element.
         * If Null, then it is being set the to main element.
         * @type {Null|EventTarget}
         * @default null
         */
        inputTarget: null,
        /**
         * force an input class
         * @type {Null|Function}
         * @default null
         */
        inputClass: null,
        /**
         * Default recognizer setup when calling `Hammer()`
         * When creating a new Manager these will be skipped.
         * @type {Array}
         */
        preset: [
          // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
          [RotateRecognizer, { enable: false }],
          [PinchRecognizer, { enable: false }, ["rotate"]],
          [SwipeRecognizer, { direction: DIRECTION_HORIZONTAL }],
          [PanRecognizer, { direction: DIRECTION_HORIZONTAL }, ["swipe"]],
          [TapRecognizer],
          [TapRecognizer, { event: "doubletap", taps: 2 }, ["tap"]],
          [PressRecognizer]
        ],
        /**
         * Some CSS properties can be used to improve the working of Hammer.
         * Add them to this method and they will be set when creating a new Manager.
         * @namespace
         */
        cssProps: {
          /**
           * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
           * @type {String}
           * @default 'none'
           */
          userSelect: "none",
          /**
           * Disable the Windows Phone grippers when pressing an element.
           * @type {String}
           * @default 'none'
           */
          touchSelect: "none",
          /**
           * Disables the default callout shown when you touch and hold a touch target.
           * On iOS, when you touch and hold a touch target such as a link, Safari displays
           * a callout containing information about the link. This property allows you to disable that callout.
           * @type {String}
           * @default 'none'
           */
          touchCallout: "none",
          /**
           * Specifies whether zooming is enabled. Used by IE10>
           * @type {String}
           * @default 'none'
           */
          contentZooming: "none",
          /**
           * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
           * @type {String}
           * @default 'none'
           */
          userDrag: "none",
          /**
           * Overrides the highlight color shown when the user taps a link or a JavaScript
           * clickable element in iOS. This property obeys the alpha value, if specified.
           * @type {String}
           * @default 'rgba(0,0,0,0)'
           */
          tapHighlightColor: "rgba(0,0,0,0)"
        }
      };
      var STOP = 1;
      var FORCED_STOP = 2;
      function Manager(element2, options) {
        this.options = assign({}, Hammer.defaults, options || {});
        this.options.inputTarget = this.options.inputTarget || element2;
        this.handlers = {};
        this.session = {};
        this.recognizers = [];
        this.oldCssProps = {};
        this.element = element2;
        this.input = createInputInstance(this);
        this.touchAction = new TouchAction(this, this.options.touchAction);
        toggleCssProps(this, true);
        each(this.options.recognizers, function(item) {
          var recognizer = this.add(new item[0](item[1]));
          item[2] && recognizer.recognizeWith(item[2]);
          item[3] && recognizer.requireFailure(item[3]);
        }, this);
      }
      Manager.prototype = {
        /**
         * set options
         * @param {Object} options
         * @returns {Manager}
         */
        set: function(options) {
          assign(this.options, options);
          if (options.touchAction) {
            this.touchAction.update();
          }
          if (options.inputTarget) {
            this.input.destroy();
            this.input.target = options.inputTarget;
            this.input.init();
          }
          return this;
        },
        /**
         * stop recognizing for this session.
         * This session will be discarded, when a new [input]start event is fired.
         * When forced, the recognizer cycle is stopped immediately.
         * @param {Boolean} [force]
         */
        stop: function(force) {
          this.session.stopped = force ? FORCED_STOP : STOP;
        },
        /**
         * run the recognizers!
         * called by the inputHandler function on every movement of the pointers (touches)
         * it walks through all the recognizers and tries to detect the gesture that is being made
         * @param {Object} inputData
         */
        recognize: function(inputData) {
          var session = this.session;
          if (session.stopped) {
            return;
          }
          this.touchAction.preventDefaults(inputData);
          var recognizer;
          var recognizers = this.recognizers;
          var curRecognizer = session.curRecognizer;
          if (!curRecognizer || curRecognizer && curRecognizer.state & STATE_RECOGNIZED) {
            curRecognizer = session.curRecognizer = null;
          }
          var i = 0;
          while (i < recognizers.length) {
            recognizer = recognizers[i];
            if (session.stopped !== FORCED_STOP && // 1
            (!curRecognizer || recognizer == curRecognizer || // 2
            recognizer.canRecognizeWith(curRecognizer))) {
              recognizer.recognize(inputData);
            } else {
              recognizer.reset();
            }
            if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
              curRecognizer = session.curRecognizer = recognizer;
            }
            i++;
          }
        },
        /**
         * get a recognizer by its event name.
         * @param {Recognizer|String} recognizer
         * @returns {Recognizer|Null}
         */
        get: function(recognizer) {
          if (recognizer instanceof Recognizer) {
            return recognizer;
          }
          var recognizers = this.recognizers;
          for (var i = 0; i < recognizers.length; i++) {
            if (recognizers[i].options.event == recognizer) {
              return recognizers[i];
            }
          }
          return null;
        },
        /**
         * add a recognizer to the manager
         * existing recognizers with the same event name will be removed
         * @param {Recognizer} recognizer
         * @returns {Recognizer|Manager}
         */
        add: function(recognizer) {
          if (invokeArrayArg(recognizer, "add", this)) {
            return this;
          }
          var existing = this.get(recognizer.options.event);
          if (existing) {
            this.remove(existing);
          }
          this.recognizers.push(recognizer);
          recognizer.manager = this;
          this.touchAction.update();
          return recognizer;
        },
        /**
         * remove a recognizer by name or instance
         * @param {Recognizer|String} recognizer
         * @returns {Manager}
         */
        remove: function(recognizer) {
          if (invokeArrayArg(recognizer, "remove", this)) {
            return this;
          }
          recognizer = this.get(recognizer);
          if (recognizer) {
            var recognizers = this.recognizers;
            var index = inArray(recognizers, recognizer);
            if (index !== -1) {
              recognizers.splice(index, 1);
              this.touchAction.update();
            }
          }
          return this;
        },
        /**
         * bind event
         * @param {String} events
         * @param {Function} handler
         * @returns {EventEmitter} this
         */
        on: function(events, handler) {
          if (events === undefined$1) {
            return;
          }
          if (handler === undefined$1) {
            return;
          }
          var handlers = this.handlers;
          each(splitStr(events), function(event) {
            handlers[event] = handlers[event] || [];
            handlers[event].push(handler);
          });
          return this;
        },
        /**
         * unbind event, leave emit blank to remove all handlers
         * @param {String} events
         * @param {Function} [handler]
         * @returns {EventEmitter} this
         */
        off: function(events, handler) {
          if (events === undefined$1) {
            return;
          }
          var handlers = this.handlers;
          each(splitStr(events), function(event) {
            if (!handler) {
              delete handlers[event];
            } else {
              handlers[event] && handlers[event].splice(inArray(handlers[event], handler), 1);
            }
          });
          return this;
        },
        /**
         * emit event to the listeners
         * @param {String} event
         * @param {Object} data
         */
        emit: function(event, data) {
          if (this.options.domEvents) {
            triggerDomEvent(event, data);
          }
          var handlers = this.handlers[event] && this.handlers[event].slice();
          if (!handlers || !handlers.length) {
            return;
          }
          data.type = event;
          data.preventDefault = function() {
            data.srcEvent.preventDefault();
          };
          var i = 0;
          while (i < handlers.length) {
            handlers[i](data);
            i++;
          }
        },
        /**
         * destroy the manager and unbinds all events
         * it doesn't unbind dom events, that is the user own responsibility
         */
        destroy: function() {
          this.element && toggleCssProps(this, false);
          this.handlers = {};
          this.session = {};
          this.input.destroy();
          this.element = null;
        }
      };
      function toggleCssProps(manager, add) {
        var element2 = manager.element;
        if (!element2.style) {
          return;
        }
        var prop;
        each(manager.options.cssProps, function(value, name) {
          prop = prefixed(element2.style, name);
          if (add) {
            manager.oldCssProps[prop] = element2.style[prop];
            element2.style[prop] = value;
          } else {
            element2.style[prop] = manager.oldCssProps[prop] || "";
          }
        });
        if (!add) {
          manager.oldCssProps = {};
        }
      }
      function triggerDomEvent(event, data) {
        var gestureEvent = document2.createEvent("Event");
        gestureEvent.initEvent(event, true, true);
        gestureEvent.gesture = data;
        data.target.dispatchEvent(gestureEvent);
      }
      assign(Hammer, {
        INPUT_START,
        INPUT_MOVE,
        INPUT_END,
        INPUT_CANCEL,
        STATE_POSSIBLE,
        STATE_BEGAN,
        STATE_CHANGED,
        STATE_ENDED,
        STATE_RECOGNIZED,
        STATE_CANCELLED,
        STATE_FAILED,
        DIRECTION_NONE,
        DIRECTION_LEFT,
        DIRECTION_RIGHT,
        DIRECTION_UP,
        DIRECTION_DOWN,
        DIRECTION_HORIZONTAL,
        DIRECTION_VERTICAL,
        DIRECTION_ALL,
        Manager,
        Input: Input2,
        TouchAction,
        TouchInput,
        MouseInput,
        PointerEventInput,
        TouchMouseInput,
        SingleTouchInput,
        Recognizer,
        AttrRecognizer,
        Tap: TapRecognizer,
        Pan: PanRecognizer,
        Swipe: SwipeRecognizer,
        Pinch: PinchRecognizer,
        Rotate: RotateRecognizer,
        Press: PressRecognizer,
        on: addEventListeners,
        off: removeEventListeners,
        each,
        merge,
        extend,
        assign,
        inherit,
        bindFn,
        prefixed
      });
      var freeGlobal = typeof window2 !== "undefined" ? window2 : typeof self !== "undefined" ? self : {};
      freeGlobal.Hammer = Hammer;
      if (typeof undefined$1 === "function" && undefined$1.amd) {
        undefined$1(function() {
          return Hammer;
        });
      } else if (module2.exports) {
        module2.exports = Hammer;
      } else {
        window2[exportName] = Hammer;
      }
    })(window, document, "Hammer");
  })(hammer$2);
  var hammerExports = hammer$2.exports;
  const hammer = /* @__PURE__ */ getDefaultExportFromCjs(hammerExports);
  const hammer$1 = /* @__PURE__ */ _mergeNamespaces({
    __proto__: null,
    default: hammer
  }, [hammerExports]);
  exports2.Const = Const;
  exports2.DataHub = DataHub$1;
  exports2.DataScan = DataScan;
  exports2.Events = Events$1;
  exports2.MetaHub = MetaHub$1;
  exports2.NightVision = NightVision;
  exports2.Parser = Parser;
  exports2.Scripts = Scripts$1;
  exports2.Utils = Utils;
  Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
});
