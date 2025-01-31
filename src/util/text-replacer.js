

export default class Replacer {
	constructor(codeMirror) {
		this.editor = codeMirror;
	}

	replace(actionType) {
		if (actionType == 'bold') {
			return this.bold();
		}
		if (actionType == 'remove') {
			return this.remove();
		}
		if (actionType == 'italic') {
			return this.italic();
		}
		if (actionType == 'code-inline') {
			return this.codeInline();
		}
		if (/^h[1-6]$/.test(actionType)) {
			return this.header(parseInt(actionType[1]));
		}
		if (actionType == 'quote') {
			return this.quote();
		}
		if (actionType == 'ul') {
			return this.ul();
		}
		if (actionType == 'ol') {
			return this.ol();
		}
		if (actionType == 'separate') {
			return this.separate();
		}
		if (actionType == 'link') {
			return this.link();
		}
		if (actionType == 'image') {
			return this.image();
		}
		if (actionType == 'code') {
			return this.code();
		}
		if (actionType == 'table') {
			return this.table();
		}
	}

	bold() {
		let sels = this.editor.listSelections().map(selObj => {
			let fromPos = selObj.anchor;
			let toPos = selObj.head;
			if (this.comparePos(selObj.anchor, selObj.head) > 0) {
				fromPos = selObj.head;
				toPos = selObj.anchor;
			}
			let content = this.editor.getRange(fromPos, toPos, ' ');
			this.editor.replaceRange(`**${content}**`, fromPos, toPos);
			let resultPos = {
				line: fromPos.line,
				ch: content.length > 0 ? fromPos.ch + content.length + 4 : fromPos.ch + 2
			};
			return {
				anchor: resultPos,
				head: resultPos
			};
		});
		this.editor.setSelections(sels);
		this.editor.focus();
	}

	remove() {
		let sels = this.editor.listSelections().map(selObj => {
			let fromPos = selObj.anchor;
			let toPos = selObj.head;
			if (this.comparePos(selObj.anchor, selObj.head) > 0) {
				fromPos = selObj.head;
				toPos = selObj.anchor;
			}
			let content = this.editor.getRange(fromPos, toPos, ' ');
			this.editor.replaceRange(`~~${content}~~`, fromPos, toPos);
			let resultPos = {
				line: fromPos.line,
				ch: content.length > 0 ? fromPos.ch + content.length + 4 : fromPos.ch + 2
			};
			return {
				anchor: resultPos,
				head: resultPos
			};
		});
		this.editor.setSelections(sels);
		this.editor.focus();
	}

	italic() {
		let sels = this.editor.listSelections().map(selObj => {
			let fromPos = selObj.anchor;
			let toPos = selObj.head;
			if (this.comparePos(selObj.anchor, selObj.head) > 0) {
				fromPos = selObj.head;
				toPos = selObj.anchor;
			}
			let content = this.editor.getRange(fromPos, toPos, ' ');
			this.editor.replaceRange(`*${content}*`, fromPos, toPos);
			let resultPos = {
				line: fromPos.line,
				ch: content.length > 0 ? fromPos.ch + content.length + 2 : fromPos.ch + 1
			};
			return {
				anchor: resultPos,
				head: resultPos
			};
		});
		this.editor.setSelections(sels);
		this.editor.focus();
	}

	codeInline() {
		let sels = this.editor.listSelections().map(selObj => {
			let fromPos = selObj.anchor;
			let toPos = selObj.head;
			if (this.comparePos(selObj.anchor, selObj.head) > 0) {
				fromPos = selObj.head;
				toPos = selObj.anchor;
			}
			let content = this.editor.getRange(fromPos, toPos, ' ');
			this.editor.replaceRange(`\`${content}\``, fromPos, toPos);
			let resultPos = {
				line: fromPos.line,
				ch: content.length > 0 ? fromPos.ch + content.length + 2 : fromPos.ch + 1
			};
			return {
				anchor: resultPos,
				head: resultPos
			};
		});
		this.editor.setSelections(sels);
		this.editor.focus();
	}

	header(n) {
		let s = '';
		while (n--) {
			s += '#';
		}
		s += ' ';
		this.insertStringAtLineFirst(s);
		this.editor.focus();
	}

	quote() {
		this.insertStringAtLineFirst('> ');
		this.editor.focus();
	}

	ul() {
		this.insertStringAtLineFirst('- ');
		this.editor.focus();
	}

	ol() {
		this.insertStringAtLineFirst(idx => {
			return `${idx}. `;
		});
		this.editor.focus();
	}

	separate() {
		this.editor.listSelections().forEach(selObj => {
			let pos = selObj.head;
			if (this.editor.getLine(pos.line) == '') {
				this.editor.replaceRange('\n------------\n\n', pos, pos);
			}
			else {
				this.editor.replaceRange('\n\n------------\n\n', pos, pos);
			}	
		})
		this.editor.focus();
	}

	link(url) {
		let sels = this.editor.listSelections().map(selObj => {
			let fromPos = selObj.anchor;
			let toPos = selObj.head;
			if (this.comparePos(selObj.anchor, selObj.head) > 0) {
				fromPos = selObj.head;
				toPos = selObj.anchor;
			}
			let content = this.editor.getRange(fromPos, toPos, ' ');
			if (!url) {
				url = ''
			}
			this.editor.replaceRange(`[${content}](${url})`, fromPos, toPos);
			let resultPos = {
				line: fromPos.line,
				ch: fromPos.ch + content.length + url.length + 3
			};
			return {
				anchor: resultPos,
				head: resultPos
			};
		});
		this.editor.setSelections(sels);
		this.editor.focus();
	}

	image(url) {
		let sels = this.editor.listSelections().map(selObj => {
			let fromPos = selObj.anchor;
			let toPos = selObj.head;
			if (this.comparePos(selObj.anchor, selObj.head) > 0) {
				fromPos = selObj.head;
				toPos = selObj.anchor;
			}
			let content = this.editor.getRange(fromPos, toPos, ' ');
			if (!url) {
				url = ''
			}
			this.editor.replaceRange(`![${content}](${url})`, fromPos, toPos);
			let resultPos = {
				line: fromPos.line,
				ch: fromPos.ch + content.length + url.length + 4
			};
			return {
				anchor: resultPos,
				head: resultPos
			};
		});
		this.editor.setSelections(sels);
		this.editor.focus();
	}

	code() {
		let sels = this.editor.listSelections().map(selObj => {
			let pos = selObj.anchor;
			if (this.comparePos(selObj.anchor, selObj.head) > 0) {
				pos = selObj.head;
			}
			if (this.editor.getLine(pos.line) == '') {
				this.editor.replaceRange('\n\`\`\`\n\`\`\`', pos, pos);
				let resultPos = {
					line: pos.line + 1,
					ch: 3
				};
				return {
					anchor: resultPos,
					head: resultPos
				};
			}
			else {
				this.editor.replaceRange('\n\n\`\`\`\n\`\`\`', pos, pos);
				let resultPos = {
					line: pos.line + 2,
					ch: 3
				};
				return {
					anchor: resultPos,
					head: resultPos
				};
			}
		});
		this.editor.setSelections(sels);
		this.editor.focus();
	}

	table() {
		const table = '|||:Header 1|:Header 2|:Header 3|:Header 4\n|| Row 1 .. |  |  |  \n|| Row 2 .. |  |  |  \n|| Row 3 .. |  |  |  \n|| Row 4 .. |  |  |  ';
		this.editor.listSelections().forEach(selObj => {
			let pos = selObj.head;
			if (this.editor.getLine(pos.line) == '') {
				this.editor.replaceRange(`\n${table}`, pos, pos);
			}
			else {
				this.editor.replaceRange(`\n\n${table}`, pos, pos);
			}	
		})
		this.editor.focus();
	}

	insertStringAtLineFirst(s) {
		let selObjs = this.editor.listSelections();
		selObjs.forEach(obj => {
			let idx = 1;
			if (obj.anchor.line - obj.head.line > 0) {
				for (let i = obj.head.line; i <= obj.anchor.line; i++) {
					if (this.editor.getLine(i) == '') {
						continue;
					}
					let pos = {
						line: i,
						ch: 0
					};
					let str = ((typeof s) == 'function') ? s(idx++) : s;
					this.editor.replaceRange(str, pos, pos);
				}
			}
			else {
				for (let i = obj.anchor.line; i <= obj.head.line; i++) {
					if (this.editor.getLine(i) == '') {
						continue;
					}
					let pos = {
						line: i,
						ch: 0
					};
					let str = ((typeof s) == 'function') ? s(idx++) : s;
					this.editor.replaceRange(str, pos, pos);
				}
			}
		});
	}

	comparePos(pos1, pos2) {
		if (pos1.line > pos2.line) {
			return 1;
		}
		if (pos1.line < pos2.line) {
			return -1;
		}
		if (pos1.ch > pos2.ch) {
			return 1;
		}
		if (pos1.ch < pos2.ch) {
			return -1;
		}
		return 0;
	}
	
	destory() {
		this.editor = null;
	}
}