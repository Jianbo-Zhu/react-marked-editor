import React, { Component } from 'react';
import propTypes from 'prop-types';
import { marked } from 'marked';
import highlight from 'highlight.js';
import specialRenderer from './util/special-renderer';
import { tokenizer } from './helpers'
import "./marked-view.css";
class ReactMarkedView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { markdown, markedOptions, className, markdownClass, style, openLinkInBlank } = this.props;
        let renderer = new marked.Renderer();
        renderer.em = specialRenderer.em;
        renderer.image = specialRenderer.image;
        if (openLinkInBlank) {
            renderer.link = specialRenderer.link;
        }
        markedOptions && marked.setOptions(Object.assign({
            highlight: (code, lang) => {
                let str = lang ? highlight.highlight(lang, code).value : highlight.highlightAuto(code).value;
                return str;
            },
            renderer: renderer,
            silent: true
        }, markedOptions));
        marked.use({ tokenizer: tokenizer });

        let html = marked.parse(markdown);
        markdownClass = markdownClass ? markdownClass : 'markdown-body';
        let cls = combineClassName(className, markdownClass);
        return (
            <div style={style} className={cls}>
                <div dangerouslySetInnerHTML={{ __html: html }}></div>

            </div>
        );
    }
}
ReactMarkedView.propTypes = {
    markdown: propTypes.string,
    markdownClass: propTypes.string,
    markedOptions: propTypes.object,
    openLinkInBlank: propTypes.bool
};
ReactMarkedView.defaultProps = {
    markdown: '',
    markdownClass: undefined,
    markedOptions: {},
    openLinkInBlank: false
};

function combineClassName() {
    if (arguments.length == 0) {
        return;
    }
    let args = arguments;
    let cls = null;
    for (let i = 0; i < args.length; i++) {
        let element = args[i];
        if (element && element !== '') {
            if (cls) {
                cls = cls + ' ' + element;
            }
            else {
                cls = element;
            }
        }
    }
    return cls;
}

export default ReactMarkedView;