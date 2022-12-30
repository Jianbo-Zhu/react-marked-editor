import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import throttle from 'lodash.throttle';
import ReactMarkedEditor, { Replacer } from '../../src/';
import marked from "marked";
import {
  rtrim,
  splitCells,
  escape,
  findClosingBracket
} from './helpers.js';
export default class App extends Component {
  constructor(props) {
    super(props);

    // marked.use({ tokenizer });
    // console.log(marked);
    this.handleMarkdownChange = this.handleMarkdownChange.bind(this);
    this.handleWindowResize = throttle(this.handleWindowResize.bind(this), 200);
    this.state = {
      winWidth: 1024,
      winHeight: 768
    }
    this.markdown = md;
  }

  handleMarkdownChange(newValue) {
    this.markdown = newValue;
  }

  componentDidMount() {
    this.setState({
      winWidth: window.innerWidth,
      winHeight: window.innerHeight
    });
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
  }

  handleWindowResize() {
    this.setState({
      winWidth: window.innerWidth,
      winHeight: window.innerHeight
    });
  }

  /**
   * @param codeMirror -> the codemirror doc instance
   * @param clickEvent -> the click event
   */
  handleImageUploadClick(codeMirror, clickEvent) {
    alert('You clicked the custom button! And an image will be added to editor.');
    const replacer = new Replacer(codeMirror)
    replacer.image('http://codemirror.net/doc/logo.png')
  }

  render() {
    const styles = {
      wrapper: {
        width: this.state.winWidth - 100,
        border: '1px solid #eee'
      }
    }
    //custom buttons defined here
    const btns = [
      {
        title: 'custom button',
        icon: 'upload',
        onClick: this.handleImageUploadClick.bind(this)
      }
    ]
    const tokenizer1 = {
      codespan(src) {
        const match = src.match(/^\$+([^\$\n]+?)\$+/);
        console.log("tokenizer", src);
        if (match) {
          console.log('in match', match[0], match[1]);
          return {
            type: 'codespan',
            raw: match[0],
            text: match[1].trim()
          };
        }

        // return false to use original codespan tokenizer
        return false;
      }
    };
    
    const tokenizer = {
      table(src) {
        const regexp=new RegExp('^ *\\|\\|\\|([^\\n ].*\\|.*)\\n' // Header
        + ' {0,3}(?:\\| *)?(:?-+:? *(?:\\| *:?-+:? *)*)(?:\\| *)?' // Align
        + '(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)'); // Cells
        const cap = regexp.exec(src);
        if (cap) {
          console.log("matches", cap);
          const item = {
            type: 'table',
            header: splitCells(cap[1]).map(c => { return { text: c }; }),
            align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
            rows: cap[3] && cap[3].trim() ? cap[3].replace(/\n[ \t]*$/, '').split('\n') : []
          };
          console.log("item", item);
          if (item.header.length === item.align.length) {
            item.raw = cap[0];

            let l = item.align.length;
            let i, j, k, row;
            for (i = 0; i < l; i++) {
              if (/^ *-+: *$/.test(item.align[i])) {
                item.align[i] = 'right';
              } else if (/^ *:-+: *$/.test(item.align[i])) {
                item.align[i] = 'center';
              } else if (/^ *:-+ *$/.test(item.align[i])) {
                item.align[i] = 'left';
              } else {
                item.align[i] = null;
              }
            }

            l = item.rows.length;
            for (i = 0; i < l; i++) {
              item.rows[i] = splitCells(item.rows[i], item.header.length).map(c => { return { text: c }; });
            }

            // parse child tokens inside headers and cells

            // header child tokens
            l = item.header.length;
            for (j = 0; j < l; j++) {
              item.header[j].tokens = this.lexer.inline(item.header[j].text);
            }

            // cell child tokens
            l = item.rows.length;
            for (j = 0; j < l; j++) {
              row = item.rows[j];
              for (k = 0; k < row.length; k++) {
                row[k].tokens = this.lexer.inline(row[k].text);
              }
            }
            console.log("return item:", item);
            return item;
          }
        }
      }
    }

    marked.use({ tokenizer: tokenizer });
    return (
      <div className="wrapper">
        <ReactMarkedEditor style={styles.wrapper}
          editorHeight={this.state.winHeight - 140}
          initialMarkdown={md}
          toolbarCustomButtons={btns}
          onChange={this.handleMarkdownChange}
        // markedOptions={{ tokenizer }}
        />
        <style jsx>{`
					.wrapper {
						margin: 50px 50px 0px 50px;
					}
				`}</style>
        <style jsx global>{`
				* {
					margin: 0px;
					padding: 0px;
				}
				`}</style>
      </div>
    );
  }
}

const md = `
# React marked editor example

1. item1
2. item3
3. item3

--------

- item1
- item2
- item3

A text of \`markdown\`.

\`\`\`js
console.log('this is javascript code');
\`\`\`

|||this is table| A | B |
|---|---|---|
|    hello    | 1 | 2 |
|    world    | 3 | 4 |

#### EOF

$ latex code $\\n\\n\` other code \`
`;
