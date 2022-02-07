"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var emotion_1 = require("emotion");
exports.default = (function (styleOverride, useDarkTheme) {
    var _a, _b, _c, _d, _e, _f, _g;
    if (useDarkTheme === void 0) { useDarkTheme = false; }
    var _h = styleOverride.variables, overrideVariables = _h === void 0 ? {} : _h, styles = __rest(styleOverride, ["variables"]);
    var themeVariables = {
        light: __assign({
            diffViewerBackground: '#fff',
            diffViewerColor: '#212529',
            addedBackground: '#e6ffed',
            addedColor: '#24292e',
            removedBackground: '#ffeef0',
            removedColor: '#24292e',
            wordAddedBackground: '#acf2bd',
            wordRemovedBackground: '#fdb8c0',
            addedGutterBackground: '#cdffd8',
            removedGutterBackground: '#ffdce0',
            gutterBackground: '#f7f7f7',
            gutterBackgroundDark: '#f3f1f1',
            highlightBackground: '#fffbdd',
            highlightGutterBackground: '#fff5b1',
            codeFoldGutterBackground: '#dbedff',
            codeFoldBackground: '#f1f8ff',
            emptyLineBackground: '#fafbfc',
            gutterColor: '#212529',
            addedGutterColor: '#212529',
            removedGutterColor: '#212529',
            codeFoldContentColor: '#212529',
            diffViewerTitleBackground: '#fafbfc',
            diffViewerTitleColor: '#212529',
            diffViewerTitleBorderColor: '#eee',
        }, (overrideVariables.light || {})),
        dark: __assign({
            diffViewerBackground: '#2e303c',
            diffViewerColor: '#FFF',
            addedBackground: '#044B53',
            addedColor: 'white',
            removedBackground: '#632F34',
            removedColor: 'white',
            wordAddedBackground: '#055d67',
            wordRemovedBackground: '#7d383f',
            addedGutterBackground: '#034148',
            removedGutterBackground: '#632b30',
            gutterBackground: '#2c2f3a',
            gutterBackgroundDark: '#262933',
            highlightBackground: '#2a3967',
            highlightGutterBackground: '#2d4077',
            codeFoldGutterBackground: '#21232b',
            codeFoldBackground: '#262831',
            emptyLineBackground: '#363946',
            gutterColor: '#464c67',
            addedGutterColor: '#8c8c8c',
            removedGutterColor: '#8c8c8c',
            codeFoldContentColor: '#555a7b',
            diffViewerTitleBackground: '#2f323e',
            diffViewerTitleColor: '#555a7b',
            diffViewerTitleBorderColor: '#353846',
        }, (overrideVariables.dark || {})),
    };
    var variables = useDarkTheme ? themeVariables.dark : themeVariables.light;
    var content = emotion_1.css({
        width: '100%',
        label: 'content',
    });
    var splitView = emotion_1.css((_a = {},
        _a["." + content] = {
            width: '50%',
        },
        _a.label = 'split-view',
        _a));
    var diffContainer = emotion_1.css({
        width: '100%',
        background: variables.diffViewerBackground,
        pre: {
            margin: 0,
            whiteSpace: 'pre-wrap',
            lineHeight: '25px',
        },
        label: 'diff-container',
        borderCollapse: 'collapse',
    });
    var codeFoldContent = emotion_1.css({
        color: variables.codeFoldContentColor,
        label: 'code-fold-content',
    });
    var contentText = emotion_1.css({
        color: variables.diffViewerColor,
        label: 'content-text',
    });
    var titleBlock = emotion_1.css((_b = {
            background: variables.diffViewerTitleBackground,
            padding: 10,
            borderBottom: "1px solid " + variables.diffViewerTitleBorderColor,
            label: 'title-block',
            ':last-child': {
                borderLeft: "1px solid " + variables.diffViewerTitleBorderColor,
            }
        },
        _b["." + contentText] = {
            color: variables.diffViewerTitleColor,
        },
        _b));
    var lineNumber = emotion_1.css({
        color: variables.gutterColor,
        label: 'line-number',
    });
    var diffRemoved = emotion_1.css((_c = {
            background: variables.removedBackground,
            color: variables.removedColor,
            pre: {
                color: variables.removedColor,
            }
        },
        _c["." + lineNumber] = {
            color: variables.removedGutterColor,
        },
        _c.label = 'diff-removed',
        _c));
    var diffAdded = emotion_1.css((_d = {
            background: variables.addedBackground,
            color: variables.addedColor,
            pre: {
                color: variables.addedColor,
            }
        },
        _d["." + lineNumber] = {
            color: variables.addedGutterColor,
        },
        _d.label = 'diff-added',
        _d));
    var wordDiff = emotion_1.css({
        padding: 2,
        display: 'inline-flex',
        borderRadius: 1,
        label: 'word-diff',
    });
    var wordAdded = emotion_1.css({
        background: variables.wordAddedBackground,
        label: 'word-added',
    });
    var wordRemoved = emotion_1.css({
        background: variables.wordRemovedBackground,
        label: 'word-removed',
    });
    var codeFoldGutter = emotion_1.css({
        backgroundColor: variables.codeFoldGutterBackground,
        label: 'code-fold-gutter',
    });
    var codeFold = emotion_1.css({
        backgroundColor: variables.codeFoldBackground,
        height: 40,
        fontSize: 14,
        fontWeight: 700,
        label: 'code-fold',
        a: {
            textDecoration: 'underline !important',
            cursor: 'pointer',
            pre: {
                display: 'inline',
            },
        },
    });
    var emptyLine = emotion_1.css({
        backgroundColor: variables.emptyLineBackground,
        label: 'empty-line',
    });
    var marker = emotion_1.css((_e = {
            width: 25,
            paddingLeft: 10,
            paddingRight: 10,
            userSelect: 'none',
            label: 'marker'
        },
        _e["&." + diffAdded] = {
            pre: {
                color: variables.addedColor,
            },
        },
        _e["&." + diffRemoved] = {
            pre: {
                color: variables.removedColor,
            },
        },
        _e));
    var highlightedLine = emotion_1.css((_f = {
            background: variables.highlightBackground,
            label: 'highlighted-line'
        },
        _f["." + wordAdded + ", ." + wordRemoved] = {
            backgroundColor: 'initial',
        },
        _f));
    var highlightedGutter = emotion_1.css({
        label: 'highlighted-gutter',
    });
    var gutter = emotion_1.css((_g = {
            userSelect: 'none',
            minWidth: 50,
            padding: '0 10px',
            label: 'gutter',
            textAlign: 'right',
            background: variables.gutterBackground,
            '&:hover': {
                cursor: 'pointer',
                background: variables.gutterBackgroundDark,
                pre: {
                    opacity: 1,
                },
            },
            pre: {
                opacity: 0.5,
            }
        },
        _g["&." + diffAdded] = {
            background: variables.addedGutterBackground,
        },
        _g["&." + diffRemoved] = {
            background: variables.removedGutterBackground,
        },
        _g["&." + highlightedGutter] = {
            background: variables.highlightGutterBackground,
            '&:hover': {
                background: variables.highlightGutterBackground,
            },
        },
        _g));
    var emptyGutter = emotion_1.css({
        '&:hover': {
            background: variables.gutterBackground,
            cursor: 'initial',
        },
        label: 'empty-gutter',
    });
    var line = emotion_1.css({
        verticalAlign: 'baseline',
        label: 'line',
    });
    var defaultStyles = {
        diffContainer: diffContainer,
        diffRemoved: diffRemoved,
        diffAdded: diffAdded,
        splitView: splitView,
        marker: marker,
        highlightedGutter: highlightedGutter,
        highlightedLine: highlightedLine,
        gutter: gutter,
        line: line,
        wordDiff: wordDiff,
        wordAdded: wordAdded,
        wordRemoved: wordRemoved,
        codeFoldGutter: codeFoldGutter,
        codeFold: codeFold,
        emptyGutter: emptyGutter,
        emptyLine: emptyLine,
        lineNumber: lineNumber,
        contentText: contentText,
        content: content,
        codeFoldContent: codeFoldContent,
        titleBlock: titleBlock,
    };
    var computerOverrideStyles = Object.keys(styles).reduce(function (acc, key) {
        var _a;
        return (__assign(__assign({}, acc), (_a = {},
            _a[key] = emotion_1.css(styles[key]),
            _a)));
    }, {});
    return Object.keys(defaultStyles).reduce(function (acc, key) {
        var _a;
        return (__assign(__assign({}, acc), (_a = {},
            _a[key] = computerOverrideStyles[key]
                ? emotion_1.cx(defaultStyles[key], computerOverrideStyles[key])
                : defaultStyles[key],
            _a)));
    }, {});
});
