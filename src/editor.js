import React, { Component } from 'react';
import propTypes from 'prop-types';
import codeMirror from './codemirror-wrapper';
import debounce from 'lodash.debounce';
import ReactMarkedView from './marked-view';
import ScrollHelper from './util/scroll-helper';
import Replacer from './util/text-replacer';
import ToolBar from './toolbar';
import './editor.css';
class ReactMarkedEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markdown: props.initialMarkdown || '',
      showType: 'both'
    }
    this.scrollHelper = null;
    this.replacer = null;
    this.handleEditorTextChange = debounce(this.handleEditorTextChange.bind(this), 500);
    this.onEditorValueChange = this.onEditorValueChange.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.codeDoc = codeMirror.fromTextArea(this.refs.mdEditor, {
        mode: 'gfm',
        lineNumbers: true
      });
      this.scrollHelper = new ScrollHelper(this.codeDoc, this.refs.mdView);
      this.replacer = new Replacer(this.codeDoc);
      this.codeDoc.setValue(this.state.markdown);
      this.codeDoc.on('change', this.onEditorValueChange);
    }, 1);
  }

  componentWillUnmount() {
    if (this.codeDoc) {
      this.codeDoc.off('change', this.onEditorValueChange);
      this.codeDoc.setValue('');
      this.codeDoc = null;
    }
    this.refs.mdEditor.innerHTML = '';
    this.scrollHelper && this.scrollHelper.destory();
    this.replacer && this.replacer.destory();
    this.scrollHelper = null;
    this.replacer = null;
  }

  onEditorValueChange() {
    this.props.onChange && this.props.onChange(this.codeDoc.getValue());
    this.handleEditorTextChange();
  }

  handleEditorTextChange() {
    this.setState({
      markdown: this.codeDoc.getValue()
    });
  }

  handleToolbarAction(actionType) {
    if (actionType == 'state-editor') {
      this.setState({
        showType: 'editor'
      });
      return;
    }
    if (actionType == 'state-both') {
      this.setState({
        showType: 'both'
      });
      return;
    }
    if (actionType == 'state-view') {
      this.setState({
        showType: 'view'
      });
      return;
    }
    this.replacer && this.replacer.replace(actionType);
  }

  handleCustomButtonClick(fn, event) {
    fn(this.codeDoc, event);
  }

  render() {
    let {
      markdownClassName,
      markdownStyle,
      editorHeight,
      hideToolbar,
      toolbarCustomButtons,
      openLinkInBlank,
      markedOptions } = this.props;
    const styles = {
      wrapper: {
        height: editorHeight
      }
    }
    let editorClass = 'blockLeft';
    let viewClass = 'blockRight mdShow';
    switch (this.state.showType) {
      case 'editor':
        editorClass += ' blockFull';
        viewClass += ' blockHide';
        break;
      case 'view':
        editorClass += ' blockHide';
        viewClass += ' blockFull';
        break;
    }
    for (let btn of toolbarCustomButtons) {
      btn._onClick = this.handleCustomButtonClick.bind(this, btn.onClick);
    }
    return (
      <div style={this.props.style} className={this.props.className}>
        {!hideToolbar
          ? <ToolBar
            height={40}
            showType={this.state.showType}
            customButtons={toolbarCustomButtons}
            onItemClick={this.handleToolbarAction.bind(this)} />
          : null}
        <div className="wrapper" style={styles.wrapper}>
          <div className={editorClass}>
            <textarea ref="mdEditor" hidden></textarea>
          </div>
          <div className={viewClass} ref="mdView">
            <div className="marked-view-wrapper">
              <ReactMarkedView
                markdown={this.state.markdown}
                style={markdownStyle}
                openLinkInBlank={openLinkInBlank}
                markedOptions={markedOptions}
                markdownClass={markdownClassName} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ReactMarkedEditor.propTypes = {
  initialMarkdown: propTypes.string,
  onChange: propTypes.func,
  markdownClassName: propTypes.string,
  markdownStyle: propTypes.object,
  editorHeight: propTypes.any,
  hideToolbar: propTypes.bool,
  toolbarCustomButtons: propTypes.array,
  markedOptions: propTypes.object,
  openLinkInBlank: propTypes.bool
};
ReactMarkedEditor.defaultProps = {
  editorHeight: 100,
  hideToolbar: false,
  toolbarCustomButtons: [],
  openLinkInBlank: false
}

export default ReactMarkedEditor;