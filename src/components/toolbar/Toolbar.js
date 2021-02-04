import React from 'react'
import './Toolbar.css'

import Icon from 'react-icons-kit'
import { bold } from 'react-icons-kit/iconic/bold'
import { italic } from 'react-icons-kit/iconic/italic'
import { list } from 'react-icons-kit/iconic/list'
import { link } from 'react-icons-kit/iconic/link'
import { check } from 'react-icons-kit/iconic/check'
import { header } from 'react-icons-kit/iconic/header'
import { code } from 'react-icons-kit/iconic/code'
import { plus } from 'react-icons-kit/iconic/plus'
import { download } from 'react-icons-kit/iconic/download'

import { MathfieldComponent } from 'react-mathlive'
import Mathlive from 'mathlive'
import {Mathfield, MathfieldElement} from 'mathlive'
//imports for CodeBlock
import * as ace from 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-min-noconflict/theme-tomorrow_night_eighties';
import 'ace-builds/src-min-noconflict/mode-javascript';
import 'ace-builds/src-min-noconflict/mode-java';



export default function Toolbar() {

    //TODO: Populate these methods
    function format(com, val) {
        document.getElementById('editor').focus();
        document.execCommand(com, false, val);
    }

    function addLink() {
        const show = document.getElementById('url-input');
        if (show.classList.contains('hidden')) {
            show.classList.remove('hidden');
        } else {
            show.classList.add('hidden');
        }
    }

    function setUrl() {

        var inputVal = document.getElementById('textFormatUrl').value;
        const text = document.getSelection();
        const show = document.getElementById('url-input');
        
        
        //Creates hyperlink
        format(
            'insertHTML', `<a href='${inputVal}' target='_blank'>${text}</a>`
        );

        //This makes the url input tag blank again. I could use "" or '' but JS thinks strings are the same as null
        inputVal = "";
        document.getElementById('textFormatUrl').value = " ";

        //hides the input tag again 
        show.classList.add('hidden');
    }

    function setHeader() {
        const target = document.getSelection();
        format('insertHTML', `<h2>${target}</h2>`);
    }

    ////////////////////////////////////////
    //Vito is working on this
    var lang="";
    function openMenu(){
        document.getElementById("dropdown").classList.toggle("active");
        document.getElementById("cb-jv").addEventListener("click", function() {
            lang="cb-jv";
            document.getElementById("cb-jv").innerHTML = lang;
          });
          return lang;
    }
    
    function addCodeBlock(lang) {   
            //creating new filled div
            var next_line= document.getElementById('editor');
            //next_line.innerHTML=" chosed "+lang;
            format(
                'insertParagraph',
                `<pre class='editor' id='${next_line}'</pre>`
            );
            const codeBlock = document.createElement('pre');
            const target = document.getSelection();
            if (
                target.focusNode.nodeName.includes('#text') ||
                target.focusNode.classList.contains('title') ||
                target.focusNode.className.includes('codeBlock')
            ) {
                return
            }
            const id = `codeBlock-${document.getElementsByClassName('codeBlock').length + 1}`;           
             codeBlock.classList.add('codeBlock')

            var new_block=format(
                'insertHTML',
                `<pre class='codeBlock' id='${id}'>${target}</pre>`
            );
            //Embbedding Ace code editor
            var mode_name;
            switch(lang){
                case "cb-jv":
                    mode_name="ace/mode/java";
                    break;
                case "cb-py":
                    mode_name="ace/mode/python";
                // code block
                    break;
                default:
                    mode_name="ace/mode/javascript";
                    

            }
            var code_editor=ace.edit(id, {
                theme: "ace/theme/tomorrow_night_eighties",
                mode: mode_name,
                maxLines: 30,
                wrap: true,
                autoScrollEditorIntoView: true,
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
            });
                   
            addLineAfterBlock(id); 
    }

    //Experimenting with this
    /* 
    function addCodeBlock_2(){
        var next_line= document.getElementById('editor');
            format(
                'insertParagraph',
                `<pre class='editor' id='${next_line}'</pre>`
            );
        var element = document.createElement('new_div');
        document.getElementById('editor').appendChild(element);
        ace.edit(element);
        
        var code_editor=ace.edit(element, {
            theme: "ace/theme/tomorrow_night_eighties",
            mode: "ace/mode/javascript",
            maxLines: 30,
            wrap: true,
            autoScrollEditorIntoView: true,
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
        });
        addLineAfterBlock(element);     
        
        
    }*/
    
    
    function addLineAfterBlock(id) {
        const block = document.getElementById(`${id}`);
        const div = document.createElement('div');
        const br = document.createElement('br');

        div.appendChild(br);
        if (!block) {
            return;
        } else {
            block.after(div);
        }
    }
    ////////////////////////////////////////////////////////

    //Emily working on this. Uses the Mathlive library and API
    function addEquation() {

        //Focus on editor, insert line
        document.getElementById('editor').focus();
        var next_line= document.getElementById('editor');
        format(
            'insert',
            `<pre class='editor' id='${next_line}'</pre>`
        );

        //Create new math block element
        const mathBlock = new MathfieldElement();

        //set initial value and options. Changing this will
        //change what the initial math equation looks like upon adding
        //Currently empty
        mathBlock.setValue("");

        //Chunk of code setting math block options and attributes
        mathBlock.setOptions({
            virtualKeyboardMode: "off",
            //virtualKeyboards: "all",
            //virtualKeyboardTheme: "",
            //virtualKeyboardLayout: "auto",
            //virtualKeyboardToolbarOptions: "default",
            smartMode: true,
            smartFence: true,
            resetStyle: true,
            selectionMode: "beforeendr",
        });
        mathBlock.setAttribute("resetStyle", "true");
        mathBlock.setAttribute("id",
            `mathBlock-${document.getElementsByClassName('mathBlock').length + 1}`);
        const id = mathBlock.id;
        mathBlock.setAttribute("class", 'mathBlock');

        //Added event listener for when you exit out of math block using arrow
        //key
        mathBlock.addEventListener('focus-out', (ev) => {
            if (ev.detail.direction == "forward") {

                document.getElementById('editor').focus();
                var next_line= document.getElementById('editor');
                format(
                    'insert',
                    `<pre class='editor' id='${next_line}'</pre>`
                );
            } else if (ev.detail.direction == "backward") {
                document.getElementById('editor').focus();
            }
        });

        //Event Listener to change math block value when there is user input
        mathBlock.addEventListener('input', (ev) => {
            mathBlock.setValue(ev.target.value);
        })

        const target = document.getSelection();

        //Checking if valid location to place a math block
        if (
            target.focusNode.nodeName.includes('#text') ||
            target.focusNode.classList.contains('title') ||
            target.focusNode.className.includes('mathBlock')
        ) {
            return
        }

        //Focuses back on editor, and then inserts a block at
        //the cursor using added function insertBlockAtCursor
        const ellie = document.getElementById('editor');
        document.getElementById('editor').focus();
        insertBlockAtCursor(mathBlock, target);

        /*
            //Block of comments to test out different methods of inserting
            //blocks and text elements

            //const texty = document.createTextNode("hello world!");
            //const spanny = document.createElement('span');
            //const t = document.createTextNode("This is a span element");
            //spanny.appendChild(t);
            //ellie.appendChild(spanny);
            //document.body.appendChild(spanny);
            //insertTextAtCaret(spanny);

        */
        document.getElementById(id).focus();
        /* Original format/executeCommand function. Does not appear to
            be functional in the context of a <math-field> element
        format('insert',
                    `<pre class="mathBlock" id="${id}">${target}</pre>`
                );
        */

        //If you comment out this line suddenly allows text editing to
        //the right of the math field. Will hold off on text to side of
        //until inline equation is figured out
        addLineAfterBlock(id);

    }


    //Method to handle Tab and Enter button press (Emily)
    function keyHandle(evt) {
        const key = evt.keyCode;
        switch (key) {
            case 9: //Tab
                insertTextAtCursor('\t');
                evt.preventDefault();
                break;
            case 13: //Enter
                insertTextAtCursor('\n');
                evt.preventDefault();
                break;
        }
    }

    //Inserts text block at current cursor position (Emily)
    function insertTextAtCursor(text) {
        var sel, range;
        sel = window.getSelection();
        range = sel.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(text));
    }

    //Inserts an inline-block element at current cursor position (Emily)
    function insertBlockAtCursor(block, target) {
        var range;
        range = target.getRangeAt(0);
        range.deleteContents();
        range.insertNode(block);
    }

    //Experiment method to perform a different text insertion at cursor (Emily)
    function insertTextAtCaret(text) {
        var sel, range;
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();
                range.insertNode( document.createTextNode(text) );
            }
        } else if (document.selection && document.selection.createRange) {
            document.selection.createRange().text = text;
        }
    }

    //Save selection before you insert an element (Emily)
    function saveSelection(sel) {
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                return sel.getRangeAt(0);
            }
        } else if (document.selection && document.selection.createRange) {
            return document.selection.createRange();
        }
        return null;
    }

    //Restore the previously saved selection (Emily)
    function restoreSelection(range, sel) {
        if (range) {
            if (window.getSelection) {
                sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (document.selection && range.select) {
                range.select();
            }
        }
    }

    //Insert HTML directly at caret position. Basically another
    //experimental method to test out insertion of elements at
    //cursor in doc (Emily)
    function pasteHtmlAtCaret(html, selectPastedContent) {
        var sel, range;
        if (window.getSelection) {
            // IE9 and non-IE
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();

                // Range.createContextualFragment() would be useful here but is
                // only relatively recently standardized and is not supported in
                // some browsers (IE9, for one)
                var el = document.createElement("div");
                el.innerHTML = html;
                var frag = document.createDocumentFragment(), node, lastNode;
                while ( (node = el.firstChild) ) {
                    lastNode = frag.appendChild(node);
                }
                var firstNode = frag.firstChild;
                range.insertNode(frag);

                // Preserve the selection
                if (lastNode) {
                    range = range.cloneRange();
                    range.setStartAfter(lastNode);
                    if (selectPastedContent) {
                        range.setStartBefore(firstNode);
                    } else {
                        range.collapse(true);
                    }
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        } else if ( (sel = document.selection) && sel.type != "Control") {
            // IE < 9
            var originalRange = sel.createRange();
            originalRange.collapse(true);
            sel.createRange().pasteHTML(html);
            if (selectPastedContent) {
                range = sel.createRange();
                range.setEndPoint("StartToStart", originalRange);
                range.select();
            }
        }
    }


    //
    //
    //
    //
    //
    //
    //
    //



    //Temporary code for storing title and content into a txt file
    function handleSave() {
        const content = document.getElementById('editor').innerHTML;
        const title = document.getElementById('title').textContent;

        let data =
            '\r' + title + ' \r\n' +
            '\r\n' + content + ' \r\n';
        const textToBLOB = new Blob([data], { type: 'text/plain' });
        const sFileName = 'noteOutput.txt';

        let newLink = document.createElement("a");
        newLink.download = sFileName;
        if (window.webkitURL != null) {
            newLink.href = window.webkitURL.createObjectURL(textToBLOB);
        }
        else {
            newLink.href = window.URL.createObjectURL(textToBLOB);
            newLink.style.display = "none";
            document.body.appendChild(newLink);
        }

        newLink.click();
    }

    //Zach handling saving method
    function handleSave() { }
    /**
     * Use icons from react-icons-kit for the toolbar instead of win98 buttons for the toolbar
     * this will require npm add react-icons-kit
     */

    return (
        <div className='toolbar'>
            <div class="tooltip">
                <span class="tooltiptext">Bold</span>
                <button onClick={e => format('bold')}>
                    <Icon icon={bold} />
                </button>
            </div>
            <div class="tooltip">
                <span class="tooltiptext">Italicize</span>
                <button onClick={e => format('italic')}>
                    <Icon icon={italic} />
                </button>
            </div>
            <div class="tooltip">
                <span class="tooltiptext">List</span>
                <button onClick={e => format('insertOrderedList')}>
                    <Icon icon={list} />
                </button>
            </div>
            <div class="tooltip">
                <span class="tooltiptext">Hyperlink</span>
                <button onClick={e => addLink()}>
                    <Icon icon={link} />
                </button>
            </div>
            
            <div id='url-input' className='hidden'>
                <input id='textFormatUrl' placeholder='url' />
                <button onClick={e => setUrl(e)}>
                    <Icon icon={check} />
                </button>
            </div>
            <div class="tooltip">
                <span class="tooltiptext">Header</span>
                <button onClick={e => setHeader()}>
                    <Icon icon={header} />
                </button>
            </div>
            <div class="tooltip">
                <span class="tooltiptext">Code Block</span>
                <button onClick={e => addCodeBlock(lang)}>
                    <Icon icon={code} />
                </button>
            </div>
            <div class="tooltip">
                <span class="tooltiptext">Equation</span>
                <button onClick={e => addEquation()}>
                    <Icon icon={plus} />
                </button>
            </div>
            <div class="tooltip">
                <span class="tooltiptext">Save</span>
                <button onClick={e => handleSave()}>
                    <Icon icon={download} />
                </button>
            </div>
            <button onClick={e => openMenu()}>
                Language for CodeBlock
                <ul id="dropdown">
                    <li id="cb-js">Javascript</li>
                    <li id="cb-jv">Java</li>
                    <li id="cb-py">Python</li>
                    <li id="cb-C++">C++</li>
                </ul>
            </button>
        </div>
    )
}