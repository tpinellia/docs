(() => {
    var e = {
        539: (e, t, n) => {
            var o, l, r;
            l = [], void 0 === (r = "function" == typeof (o = function (e) {
                "use strict";
                const t = !!(e && e.document && e.document.querySelector && e.addEventListener);
                if ("undefined" == typeof window && !t) return;
                const o = n(496);
                return e.tocbot = o, o
            }(void 0 !== n.g ? n.g : window || n.g)) ? o.apply(t, l) : o) || (e.exports = r)
        },
        496: (e, t, n) => {
            "use strict";

            function o(e) {
                var t, n = [].forEach,
                    o = [].some,
                    l = document.body,
                    r = !0,
                    i = " ";

                function s(t, o) {
                    var l, r, a, u = o.appendChild((l = t, r = document.createElement("li"), a = document.createElement("a"), e.listItemClass && r.setAttribute("class", e.listItemClass), e.onClick && (a.onclick = e.onClick), e.includeTitleTags && a.setAttribute("title", l.textContent), e.includeHtml && l.childNodes.length ? n.call(l.childNodes, (function (e) {
                        a.appendChild(e.cloneNode(!0))
                    })) : a.textContent = l.textContent, a.setAttribute("href", e.basePath + "#" + l.id), a.setAttribute("class", e.linkClass + i + "node-name--" + l.nodeName + i + e.extraLinkClasses), r.appendChild(a), r));
                    if (t.children.length) {
                        var d = c(t.isCollapsed);
                        t.children.forEach((function (e) {
                            s(e, d)
                        })), u.appendChild(d)
                    }
                }

                function c(t) {
                    var n = e.orderedList ? "ol" : "ul",
                        o = document.createElement(n),
                        l = e.listClass + i + e.extraListClasses;
                    return t && (l = (l = l + i + e.collapsibleClass) + i + e.isCollapsedClass), o.setAttribute("class", l), o
                }

                function a(t) {
                    var n = 0;
                    return null !== t && (n = t.offsetTop, e.hasInnerContainers && (n += a(t.offsetParent))), n
                }

                function u(e, t) {
                    return e && e.className !== t && (e.className = t), e
                }

                function d(t) {
                    return t && -1 !== t.className.indexOf(e.collapsibleClass) && -1 !== t.className.indexOf(e.isCollapsedClass) ? (u(t, t.className.replace(i + e.isCollapsedClass, "")), d(t.parentNode.parentNode)) : t
                }
                return {
                    enableTocAnimation: function () {
                        r = !0
                    },
                    disableTocAnimation: function (t) {
                        var n = t.target || t.srcElement;
                        "string" == typeof n.className && -1 !== n.className.indexOf(e.linkClass) && (r = !1)
                    },
                    render: function (e, n) {
                        var o = c(!1);
                        if (n.forEach((function (e) {
                            s(e, o)
                        })), null !== (t = e || t)) return t.firstChild && t.removeChild(t.firstChild), 0 === n.length ? t : t.appendChild(o)
                    },
                    updateToc: function (s) {
                        var c;
                        c = e.scrollContainer && document.querySelector(e.scrollContainer) ? document.querySelector(e.scrollContainer).scrollTop : document.documentElement.scrollTop || l.scrollTop, e.positionFixedSelector && function () {
                            var n;
                            n = e.scrollContainer && document.querySelector(e.scrollContainer) ? document.querySelector(e.scrollContainer).scrollTop : document.documentElement.scrollTop || l.scrollTop;
                            var o = document.querySelector(e.positionFixedSelector);
                            "auto" === e.fixedSidebarOffset && (e.fixedSidebarOffset = t.offsetTop), n > e.fixedSidebarOffset ? -1 === o.className.indexOf(e.positionFixedClass) && (o.className += i + e.positionFixedClass) : o.className = o.className.replace(i + e.positionFixedClass, "")
                        }();
                        var f, m = s;
                        if (r && null !== t && m.length > 0) {
                            o.call(m, (function (t, n) {
                                return a(t) > c + e.headingsOffset + 10 ? (f = m[0 === n ? n : n - 1], !0) : n === m.length - 1 ? (f = m[m.length - 1], !0) : void 0
                            }));
                            var h = t.querySelector("." + e.activeLinkClass),
                                p = t.querySelector("." + e.linkClass + ".node-name--" + f.nodeName + '[href="' + e.basePath + "#" + f.id.replace(/([ #;&,.+*~':"!^$[\]()=>|/\\@])/g, "\\$1") + '"]');
                            if (h === p) return;
                            var C = t.querySelectorAll("." + e.linkClass);
                            n.call(C, (function (t) {
                                u(t, t.className.replace(i + e.activeLinkClass, ""))
                            }));
                            var g = t.querySelectorAll("." + e.listItemClass);
                            n.call(g, (function (t) {
                                u(t, t.className.replace(i + e.activeListItemClass, ""))
                            })), p && -1 === p.className.indexOf(e.activeLinkClass) && (p.className += i + e.activeLinkClass);
                            var v = p && p.parentNode;
                            v && -1 === v.className.indexOf(e.activeListItemClass) && (v.className += i + e.activeListItemClass);
                            var S = t.querySelectorAll("." + e.listClass + "." + e.collapsibleClass);
                            n.call(S, (function (t) {
                                -1 === t.className.indexOf(e.isCollapsedClass) && (t.className += i + e.isCollapsedClass)
                            })), p && p.nextSibling && -1 !== p.nextSibling.className.indexOf(e.isCollapsedClass) && u(p.nextSibling, p.nextSibling.className.replace(i + e.isCollapsedClass, "")), d(p && p.parentNode.parentNode)
                        }
                    }
                }
            }
            n.r(t), n.d(t, {
                _buildHtml: () => s,
                _headingsArray: () => a,
                _options: () => f,
                _parseContent: () => c,
                _scrollListener: () => u,
                destroy: () => h,
                init: () => m,
                refresh: () => p
            });
            const l = {
                tocSelector: ".js-toc",
                contentSelector: ".js-toc-content",
                headingSelector: "h1, h2, h3",
                ignoreSelector: ".js-toc-ignore",
                hasInnerContainers: !1,
                linkClass: "toc-link",
                extraLinkClasses: "",
                activeLinkClass: "is-active-link",
                listClass: "toc-list",
                extraListClasses: "",
                isCollapsedClass: "is-collapsed",
                collapsibleClass: "is-collapsible",
                listItemClass: "toc-list-item",
                activeListItemClass: "is-active-li",
                collapseDepth: 0,
                scrollSmooth: !0,
                scrollSmoothDuration: 420,
                scrollSmoothOffset: 0,
                scrollEndCallback: function (e) { },
                headingsOffset: 1,
                throttleTimeout: 50,
                positionFixedSelector: null,
                positionFixedClass: "is-position-fixed",
                fixedSidebarOffset: "auto",
                includeHtml: !1,
                includeTitleTags: !1,
                onClick: function (e) { },
                orderedList: !0,
                scrollContainer: null,
                skipRendering: !1,
                headingLabelCallback: !1,
                ignoreHiddenElements: !1,
                headingObjectCallback: null,
                basePath: "",
                disableTocScrollSync: !1,
                tocScrollOffset: 0
            };

            function r(e) {
                var t = e.duration,
                    n = e.offset,
                    o = location.hash ? l(location.href) : location.href;

                function l(e) {
                    return e.slice(0, e.lastIndexOf("#"))
                }
                document.body.addEventListener("click", (function (r) {
                    var i;
                    "a" !== (i = r.target).tagName.toLowerCase() || !(i.hash.length > 0 || "#" === i.href.charAt(i.href.length - 1)) || l(i.href) !== o && l(i.href) + "#" !== o || r.target.className.indexOf("no-smooth-scroll") > -1 || "#" === r.target.href.charAt(r.target.href.length - 2) && "!" === r.target.href.charAt(r.target.href.length - 1) || -1 === r.target.className.indexOf(e.linkClass) || function (e, t) {
                        var n, o, l = window.pageYOffset,
                            r = {
                                duration: t.duration,
                                offset: t.offset || 0,
                                callback: t.callback,
                                easing: t.easing || function (e, t, n, o) {
                                    return (e /= o / 2) < 1 ? n / 2 * e * e + t : -n / 2 * (--e * (e - 2) - 1) + t
                                }
                            },
                            i = document.querySelector('[id="' + decodeURI(e).split("#").join("") + '"]') || document.querySelector('[id="' + e.split("#").join("") + '"]'),
                            s = "string" == typeof e ? r.offset + (e ? i && i.getBoundingClientRect().top || 0 : -(document.documentElement.scrollTop || document.body.scrollTop)) : e,
                            c = "function" == typeof r.duration ? r.duration(s) : r.duration;

                        function a(e) {
                            o = e - n, window.scrollTo(0, r.easing(o, l, s, c)), o < c ? requestAnimationFrame(a) : (window.scrollTo(0, l + s), "function" == typeof r.callback && r.callback())
                        }
                        requestAnimationFrame((function (e) {
                            n = e, a(e)
                        }))
                    }(r.target.hash, {
                        duration: t,
                        offset: n,
                        callback: function () {
                            var e, t;
                            e = r.target.hash, (t = document.getElementById(e.substring(1))) && (/^(?:a|select|input|button|textarea)$/i.test(t.tagName) || (t.tabIndex = -1), t.focus())
                        }
                    })
                }), !1)
            }
            const i = 30;
            let s, c, a, u, d, f = {};

            function m(e) {
                f = function () {
                    const e = {};
                    for (let t = 0; t < arguments.length; t++) {
                        const n = arguments[t];
                        for (const t in n) C.call(n, t) && (e[t] = n[t])
                    }
                    return e
                }(l, e || {}), f.scrollSmooth && (f.duration = f.scrollSmoothDuration, f.offset = f.scrollSmoothOffset, r(f)), s = o(f), c = function (e) {
                    var t = [].reduce;

                    function n(e) {
                        return e[e.length - 1]
                    }

                    function o(e) {
                        return +e.nodeName.toUpperCase().replace("H", "")
                    }

                    function l(t) {
                        if (! function (e) {
                            try {
                                return e instanceof window.HTMLElement || e instanceof window.parent.HTMLElement
                            } catch (t) {
                                return e instanceof window.HTMLElement
                            }
                        }(t)) return t;
                        if (e.ignoreHiddenElements && (!t.offsetHeight || !t.offsetParent)) return null;
                        const n = t.getAttribute("data-heading-label") || (e.headingLabelCallback ? String(e.headingLabelCallback(t.innerText)) : (t.innerText || t.textContent).trim());
                        var l = {
                            id: t.id,
                            children: [],
                            nodeName: t.nodeName,
                            headingLevel: o(t),
                            textContent: n
                        };
                        return e.includeHtml && (l.childNodes = t.childNodes), e.headingObjectCallback ? e.headingObjectCallback(l, t) : l
                    }
                    return {
                        nestHeadingsArray: function (o) {
                            return t.call(o, (function (t, o) {
                                var r = l(o);
                                return r && function (t, o) {
                                    for (var r = l(t), i = r.headingLevel, s = o, c = n(s), a = i - (c ? c.headingLevel : 0); a > 0 && (!(c = n(s)) || i !== c.headingLevel);) c && void 0 !== c.children && (s = c.children), a--;
                                    i >= e.collapseDepth && (r.isCollapsed = !0), s.push(r)
                                }(r, t.nest), t
                            }), {
                                nest: []
                            })
                        },
                        selectHeadings: function (t, n) {
                            var o = n;
                            e.ignoreSelector && (o = n.split(",").map((function (t) {
                                return t.trim() + ":not(" + e.ignoreSelector + ")"
                            })));
                            try {
                                return t.querySelectorAll(o)
                            } catch (e) {
                                return console.warn("Headers not found with selector: " + o), null
                            }
                        }
                    }
                }(f), h();
                const t = function (e) {
                    try {
                        return e.contentElement || document.querySelector(e.contentSelector)
                    } catch (t) {
                        return console.warn("Contents element not found: " + e.contentSelector), null
                    }
                }(f);
                if (null === t) return;
                const n = v(f);
                if (null === n) return;
                if (a = c.selectHeadings(t, f.headingSelector), null === a) return;
                const m = c.nestHeadingsArray(a).nest;
                if (f.skipRendering) return this;
                s.render(n, m), u = g((function (e) {
                    s.updateToc(a), !f.disableTocScrollSync && function (e) {
                        var t = e.tocElement || document.querySelector(e.tocSelector);
                        if (t && t.scrollHeight > t.clientHeight) {
                            var n = t.querySelector("." + e.activeListItemClass);
                            if (n) {
                                var o = t.scrollTop,
                                    l = o + t.clientHeight,
                                    r = n.offsetTop,
                                    s = r + n.clientHeight;
                                r < o + e.tocScrollOffset ? t.scrollTop -= o - r + e.tocScrollOffset : s > l - e.tocScrollOffset - i && (t.scrollTop += s - l + e.tocScrollOffset + 2 * i)
                            }
                        }
                    }(f);
                    const t = e && e.target && e.target.scrollingElement && 0 === e.target.scrollingElement.scrollTop;
                    (e && (0 === e.eventPhase || null === e.currentTarget) || t) && (s.updateToc(a), f.scrollEndCallback && f.scrollEndCallback(e))
                }), f.throttleTimeout), u(), f.scrollContainer && document.querySelector(f.scrollContainer) ? (document.querySelector(f.scrollContainer).addEventListener("scroll", u, !1), document.querySelector(f.scrollContainer).addEventListener("resize", u, !1)) : (document.addEventListener("scroll", u, !1), document.addEventListener("resize", u, !1));
                let p = null;
                d = g((function (e) {
                    f.scrollSmooth && s.disableTocAnimation(e), s.updateToc(a), p && clearTimeout(p), p = setTimeout((function () {
                        s.enableTocAnimation()
                    }), f.scrollSmoothDuration)
                }), f.throttleTimeout), f.scrollContainer && document.querySelector(f.scrollContainer) ? document.querySelector(f.scrollContainer).addEventListener("click", d, !1) : document.addEventListener("click", d, !1)
            }

            function h() {
                const e = v(f);
                null !== e && (f.skipRendering || e && (e.innerHTML = ""), f.scrollContainer && document.querySelector(f.scrollContainer) ? (document.querySelector(f.scrollContainer).removeEventListener("scroll", u, !1), document.querySelector(f.scrollContainer).removeEventListener("resize", u, !1), s && document.querySelector(f.scrollContainer).removeEventListener("click", d, !1)) : (document.removeEventListener("scroll", u, !1), document.removeEventListener("resize", u, !1), s && document.removeEventListener("click", d, !1)))
            }

            function p(e) {
                h(), m(e || f)
            }
            const C = Object.prototype.hasOwnProperty;

            function g(e, t, n) {
                let o, l;
                return t || (t = 250),
                    function () {
                        const r = n || this,
                            i = +new Date,
                            s = arguments;
                        o && i < o + t ? (clearTimeout(l), l = setTimeout((function () {
                            o = i, e.apply(r, s)
                        }), t)) : (o = i, e.apply(r, s))
                    }
            }

            function v(e) {
                try {
                    return e.tocElement || document.querySelector(e.tocSelector)
                } catch (t) {
                    return console.warn("TOC element not found: " + e.tocSelector), null
                }
            }
        }
    },
        t = {};

    function n(o) {
        var l = t[o];
        if (void 0 !== l) return l.exports;
        var r = t[o] = {
            exports: {}
        };
        return e[o](r, r.exports, n), r.exports
    }
    n.d = (e, t) => {
        for (var o in t) n.o(t, o) && !n.o(e, o) && Object.defineProperty(e, o, {
            enumerable: !0,
            get: t[o]
        })
    }, n.g = function () {
        if ("object" == typeof globalThis) return globalThis;
        try {
            return this || new Function("return this")()
        } catch (e) {
            if ("object" == typeof window) return window
        }
    }(), n.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t), n.r = e => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }, n(539)
})();

tocbot.init({
    // Where to render the table of contents.
    tocSelector: '.post_toc',
    // Where to grab the headings to build the table of contents.
    contentSelector: '.post_body',
    // Which headings to grab inside of the contentSelector element.
    headingSelector: 'h2,h3',
    headingsOffset: 70,
    // scrollSmoothOffset: -70,
    activeLinkClass: 'active',
});