YUI.add("selection",function(B){var A="textContent",D="innerHTML",C="fontFamily";if(B.UA.ie){A="nodeValue";}B.Selection=function(L){var I,M,F,G,E,K;if(B.config.win.getSelection){I=B.config.win.getSelection();}else{if(B.config.doc.selection){I=B.config.doc.selection.createRange();}}this._selection=I;if(I.pasteHTML){this.isCollapsed=(I.compareEndPoints("StartToEnd",I))?false:true;if(this.isCollapsed){this.anchorNode=this.focusNode=B.one(I.parentElement());if(L){F=B.config.doc.elementFromPoint(L.clientX,L.clientY);}if(!F){M=I.parentElement();G=M.childNodes;E=I.duplicate();for(K=0;K<G.length;K++){if(E.inRange(I)){if(!F){F=G[K];}}}}this.ieNode=F;if(F){if(F.nodeType!==3){if(F.firstChild){F=F.firstChild;}if(F&&F.tagName&&F.tagName.toLowerCase()==="body"){if(F.firstChild){F=F.firstChild;}}}this.anchorNode=this.focusNode=B.Selection.resolve(F);this.anchorOffset=this.focusOffset=(this.anchorNode.nodeValue)?this.anchorNode.nodeValue.length:0;this.anchorTextNode=this.focusTextNode=B.one(F);}}else{if(I.htmlText&&I.htmlText!==""){var J=B.Node.create(I.htmlText);if(J&&J.get("id")){var H=J.get("id");this.anchorNode=this.focusNode=B.one("#"+H);}else{if(J){J=J.get("childNodes");this.anchorNode=this.focusNode=J.item(0);}}}}}else{this.isCollapsed=I.isCollapsed;this.anchorNode=B.Selection.resolve(I.anchorNode);this.focusNode=B.Selection.resolve(I.focusNode);this.anchorOffset=I.anchorOffset;this.focusOffset=I.focusOffset;this.anchorTextNode=B.one(I.anchorNode);this.focusTextNode=B.one(I.focusNode);}if(B.Lang.isString(I.text)){this.text=I.text;}else{if(I.toString){this.text=I.toString();}else{this.text="";}}};B.Selection.removeFontFamily=function(F){F.removeAttribute("face");var E=F.getAttribute("style").toLowerCase();if(E===""||(E=="font-family: ")){F.removeAttribute("style");}if(E.match(B.Selection.REG_FONTFAMILY)){E=E.replace(B.Selection.REG_FONTFAMILY,"");F.setAttribute("style",E);}};B.Selection.filter=function(E){var H=(new Date()).getTime();var G=B.all(B.Selection.ALL),K=B.all("strong,em"),N=B.config.doc,P,F={},I="",L;var J=(new Date()).getTime();G.each(function(R){var Q=B.Node.getDOMNode(R);if(Q.style[C]){F["."+R._yuid]=Q.style[C];R.addClass(R._yuid);B.Selection.removeFontFamily(Q);}});var O=(new Date()).getTime();B.all(".hr").addClass("yui-skip").addClass("yui-non");if(B.UA.ie){P=N.getElementsByTagName("hr");B.each(P,function(S){var R=N.createElement("div");R.className="hr yui-non yui-skip";R.setAttribute("readonly",true);R.setAttribute("contenteditable",false);if(S.parentNode){S.parentNode.replaceChild(R,S);}var Q=R.style;Q.border="1px solid #ccc";Q.lineHeight="0";Q.fontSize="0";Q.marginTop="5px";Q.marginBottom="5px";Q.marginLeft="0px";Q.marginRight="0px";Q.padding="0";});}B.each(F,function(R,Q){I+=Q+" { font-family: "+R.replace(/"/gi,"")+"; }";});B.StyleSheet(I,"editor");K.each(function(T,Q){var R=T.get("tagName").toLowerCase(),S="i";if(R==="strong"){S="b";}B.Selection.prototype._swap(K.item(Q),S);});L=B.all("ol,ul");L.each(function(R,Q){var S=R.all("li");if(!S.size()){R.remove();}});if(E){B.Selection.filterBlocks();}var M=(new Date()).getTime();};B.Selection.filterBlocks=function(){var F=(new Date()).getTime();var M=B.config.doc.body.childNodes,H,G,P=false,J=true,E,Q,R,O,L,N,S;if(M){for(H=0;H<M.length;H++){G=B.one(M[H]);if(!G.test(B.Selection.BLOCKS)){J=true;if(M[H].nodeType==3){N=M[H][A].match(B.Selection.REG_CHAR);S=M[H][A].match(B.Selection.REG_NON);if(N===null&&S){J=false;}}if(J){if(!P){P=[];}P.push(M[H]);}}else{P=B.Selection._wrapBlock(P);}}P=B.Selection._wrapBlock(P);}Q=B.all(B.Selection.DEFAULT_BLOCK_TAG);if(Q.size()===1){R=Q.item(0).all("br");if(R.size()===1){if(!R.item(0).test(".yui-cursor")){R.item(0).remove();}var I=Q.item(0).get("innerHTML");if(I===""||I===" "){Q.set("innerHTML",B.Selection.CURSOR);E=new B.Selection();E.focusCursor(true,true);}if(R.item(0).test(".yui-cursor")&&B.UA.ie){R.item(0).remove();}}}else{Q.each(function(U){var T=U.get("innerHTML");if(T===""){U.remove();}});}if(!B.UA.ie){}var K=(new Date()).getTime();};B.Selection.REG_FONTFAMILY=/font-family: ;/;B.Selection.REG_CHAR=/[a-zA-Z-0-9_!@#\$%\^&*\(\)-=_+\[\]\\{}|;':",.\/<>\?]/gi;B.Selection.REG_NON=/[\s\S|\n|\t]/gi;B.Selection.REG_NOHTML=/<\S[^><]*>/g;B.Selection._wrapBlock=function(F){if(F){var E=B.Node.create("<"+B.Selection.DEFAULT_BLOCK_TAG+"></"+B.Selection.DEFAULT_BLOCK_TAG+">"),H=B.one(F[0]),G;for(G=1;G<F.length;G++){E.append(F[G]);}H.replace(E);E.prepend(H);}return false;};B.Selection.unfilter=function(){var G=B.all("body [class]"),H="",F,I,E=B.one("body");G.each(function(J){if(J.hasClass(J._yuid)){J.setStyle(C,J.getStyle(C));J.removeClass(J._yuid);if(J.getAttribute("class")===""){J.removeAttribute("class");}}});F=B.all(".yui-non");F.each(function(J){if(!J.hasClass("yui-skip")&&J.get("innerHTML")===""){J.remove();}else{J.removeClass("yui-non").removeClass("yui-skip");}});I=B.all("body [id]");I.each(function(J){if(J.get("id").indexOf("yui_3_")===0){J.removeAttribute("id");J.removeAttribute("_yuid");}});if(E){H=E.get("innerHTML");}B.all(".hr").addClass("yui-skip").addClass("yui-non");return H;};B.Selection.resolve=function(F){if(F&&F.nodeType===3){try{F=F.parentNode;}catch(E){F="body";}}return B.one(F);};B.Selection.getText=function(F){var E=F.get("innerHTML").replace(B.Selection.REG_NOHTML,"");E=E.replace("<span><br></span>","").replace("<br>","");return E;};B.Selection.DEFAULT_BLOCK_TAG="p";B.Selection.ALL="[style],font[face]";B.Selection.BLOCKS="p,div,ul,ol,table,style";B.Selection.TMP="yui-tmp";B.Selection.DEFAULT_TAG="span";B.Selection.CURID="yui-cursor";B.Selection.CUR_WRAPID="yui-cursor-wrapper";B.Selection.CURSOR='<span><br class="yui-cursor"></span>';B.Selection.hasCursor=function(){var E=B.all("#"+B.Selection.CUR_WRAPID);return E.size();};B.Selection.cleanCursor=function(){var F,E="br.yui-cursor";F=B.all(E);if(F.size()){F.each(function(G){var I=G.get("parentNode.parentNode.childNodes"),H;if(I.size()){G.remove();}else{H=B.Selection.getText(I.item(0));if(H!==""){G.remove();}}});}};B.Selection.prototype={text:null,isCollapsed:null,anchorNode:null,anchorOffset:null,anchorTextNode:null,focusNode:null,focusOffset:null,focusTextNode:null,_selection:null,_wrap:function(G,E){var F=B.Node.create("<"+E+"></"+E+">");
F.set(D,G.get(D));G.set(D,"");G.append(F);return B.Node.getDOMNode(F);},_swap:function(G,E){var F=B.Node.create("<"+E+"></"+E+">");F.set(D,G.get(D));G.replace(F,G);return B.Node.getDOMNode(F);},getSelected:function(){B.Selection.filter();B.config.doc.execCommand("fontname",null,B.Selection.TMP);var F=B.all(B.Selection.ALL),E=[];F.each(function(H,G){if(H.getStyle(C)==B.Selection.TMP){H.setStyle(C,"");B.Selection.removeFontFamily(H);if(!H.test("body")){E.push(B.Node.getDOMNode(F.item(G)));}}});return B.all(E);},insertContent:function(E){return this.insertAtCursor(E,this.anchorTextNode,this.anchorOffset,true);},insertAtCursor:function(K,F,H,N){var P=B.Node.create("<"+B.Selection.DEFAULT_TAG+' class="yui-non"></'+B.Selection.DEFAULT_TAG+">"),E,I,G,O,J=this.createRange(),M;if(F&&F.test("body")){M=B.Node.create("<span></span>");F.append(M);F=M;}if(J.pasteHTML){if(H===0&&F&&!F.previous()&&F.get("nodeType")===3){F.insert(K,"before");if(J.moveToElementText){J.moveToElementText(B.Node.getDOMNode(F.previous()));}J.collapse(false);J.select();return F.previous();}else{O=B.Node.create(K);try{J.pasteHTML('<span id="rte-insert"></span>');}catch(L){}E=B.one("#rte-insert");if(E){E.set("id","");E.replace(O);if(J.moveToElementText){J.moveToElementText(B.Node.getDOMNode(O));}J.collapse(false);J.select();return O;}else{B.on("available",function(){E.set("id","");E.replace(O);if(J.moveToElementText){J.moveToElementText(B.Node.getDOMNode(O));}J.collapse(false);J.select();},"#rte-insert");}}}else{if(H>0){E=F.get(A);I=B.one(B.config.doc.createTextNode(E.substr(0,H)));G=B.one(B.config.doc.createTextNode(E.substr(H)));F.replace(I,F);O=B.Node.create(K);if(O.get("nodeType")===11){M=B.Node.create("<span></span>");M.append(O);O=M;}I.insert(O,"after");if(G){O.insert(P,"after");P.insert(G,"after");this.selectNode(P,N);}}else{if(F.get("nodeType")===3){F=F.get("parentNode");}O=B.Node.create(K);K=F.get("innerHTML").replace(/\n/gi,"");if(K===""||K==="<br>"){F.append(O);}else{if(O.get("parentNode")){F.insert(O,"before");}else{B.one("body").prepend(O);}}if(F.get("firstChild").test("br")){F.get("firstChild").remove();}}}return O;},wrapContent:function(F){F=(F)?F:B.Selection.DEFAULT_TAG;if(!this.isCollapsed){var H=this.getSelected(),K=[],G,I,J,E;H.each(function(N,L){var M=N.get("tagName").toLowerCase();if(M==="font"){K.push(this._swap(H.item(L),F));}else{K.push(this._wrap(H.item(L),F));}},this);G=this.createRange();J=K[0];I=K[K.length-1];if(this._selection.removeAllRanges){G.setStart(K[0],0);G.setEnd(I,I.childNodes.length);this._selection.removeAllRanges();this._selection.addRange(G);}else{if(G.moveToElementText){G.moveToElementText(B.Node.getDOMNode(J));E=this.createRange();E.moveToElementText(B.Node.getDOMNode(I));G.setEndPoint("EndToEnd",E);}G.select();}K=B.all(K);return K;}else{return B.all([]);}},replace:function(K,I){var F=this.createRange(),J,E,G,H;if(F.getBookmark){G=F.getBookmark();E=this.anchorNode.get("innerHTML").replace(K,I);this.anchorNode.set("innerHTML",E);F.moveToBookmark(G);H=B.one(F.parentElement());}else{J=this.anchorTextNode;E=J.get(A);G=E.indexOf(K);E=E.replace(K,"");J.set(A,E);H=this.insertAtCursor(I,J,G,true);}return H;},remove:function(){this._selection.removeAllRanges();return this;},createRange:function(){if(B.config.doc.selection){return B.config.doc.selection.createRange();}else{return B.config.doc.createRange();}},selectNode:function(H,J,E){if(!H){return;}E=E||0;H=B.Node.getDOMNode(H);var F=this.createRange();if(F.selectNode){F.selectNode(H);this._selection.removeAllRanges();this._selection.addRange(F);if(J){try{this._selection.collapse(H,E);}catch(G){this._selection.collapse(H,0);}}}else{if(H.nodeType===3){H=H.parentNode;}try{F.moveToElementText(H);}catch(I){}if(J){F.collapse(((E)?false:true));}F.select();}return this;},setCursor:function(){this.removeCursor(false);return this.insertContent(B.Selection.CURSOR);},getCursor:function(){return B.all("#"+B.Selection.CURID);},removeCursor:function(E){var F=this.getCursor();if(F){if(E){F.removeAttribute("id");F.set("innerHTML",'<br class="yui-cursor">');}else{F.remove();}}return F;},focusCursor:function(G,E){if(G!==false){G=true;}if(E!==false){E=true;}var F=this.removeCursor(true);if(F){F.each(function(H){this.selectNode(H,G,E);},this);}},toString:function(){return"Selection Object";}};},"@VERSION@",{skinnable:false,requires:["node"]});