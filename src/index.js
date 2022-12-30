import ReactMarkedEditor from './editor';
import ReactMarkedView from './marked-view';
import Replacer from './util/text-replacer';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheckSquare
  ,faCoffee
  ,faStrikethrough
  ,faCode
  ,faBold
  ,faItalic
  ,faQuoteLeft
  ,faListUl
  ,faListOl
  ,faMinus
  ,faLink
  ,faTable
  ,faFileCode
  ,faImage
  ,faUpload
  ,faTerminal
  ,faColumns
  ,faEye
 } from '@fortawesome/free-solid-svg-icons'

library.add(faCheckSquare, faCoffee);
library.add(faStrikethrough);
library.add(faCode);
library.add(faBold);
library.add(faItalic);
library.add(faQuoteLeft);
library.add(faListUl);
library.add(faListOl);
library.add(faMinus);
library.add(faLink);
library.add(faTable);
library.add(faFileCode);
library.add(faImage);
library.add(faUpload);
library.add(faTerminal);
library.add(faColumns);
library.add(faEye);

export default ReactMarkedEditor;
export { ReactMarkedView, Replacer };
