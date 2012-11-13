YUI.add("scrollview-paginator",function(e,t){function w(){w.superclass.constructor.apply(this,arguments)}var n=e.ClassNameManager.getClassName,r="scrollview",i=n(r,"hidden"),s=n(r,"paged"),o=e.ScrollView?e.ScrollView.UI_SRC:"ui",u="index",a="scrollX",f="scrollY",l="total",c="host",h="boundingBox",p="contentBox",d="selector",v="flick",m="drag",g="axis",y="x",b="y";e.extend(w,e.Plugin.Base,{initializer:function(e){var t=this,n=t.get(c);t._pageDims=[],t._pageBuffer=1,t._optimizeMemory=!1,t._host=n,t._bb=n._bb,t._cb=n._cb,t._cIndex=t.get(u),t._cAxis=t.get(g),e._optimizeMemory&&(t._optimizeMemory=e._optimizeMemory),e._pageBuffer&&(t._pageBuffer=e._pageBuffer),t._bindAttrs()},_bindAttrs:function(){var e=this;e.after({indexChange:e._afterIndexChange,axisChange:e._afterAxisChange}),e.beforeHostMethod("scrollTo",e._beforeHostScrollTo),e.beforeHostMethod("_mousewheel",e._beforeHostMousewheel),e.beforeHostMethod("_flick",e._beforeHostFlick),e.afterHostMethod("_onGestureMoveEnd",e._afterHostGestureMoveEnd),e.afterHostMethod("_uiDimensionsChange",e._afterHostUIDimensionsChange),e.afterHostMethod("syncUI",e._afterHostSyncUI),e.afterHostEvent("render",e._afterHostRender),e.afterHostEvent("scrollEnd",e._afterHostScrollEnded)},_afterHostRender:function(e){var t=this,n=t._bb,r=t._host,i=t._cIndex,o=t._cAxis,u=t._getPageNodes(),a=u.size(),f=t._pageDims[i];o[b]?r._maxScrollX=f.maxScrollX:o[y]&&(r._maxScrollY=f.maxScrollY),t.set(l,a),i!==0&&t.scrollToIndex(i,0),n.addClass(s),t._optimize()},_afterHostSyncUI:function(e){var t=this,n=t._host,r=n.get(v),i=t._getPageNodes(),s=i.size(),o;t.set(l,s),t._cAxis===undefined&&t._set(g,n.get(g))},_afterHostUIDimensionsChange:function(e){var t=this,n=t._host,r=n._getScrollDims(),i=r.offsetWidth,s=r.offsetHeight,o=t._getPageNodes();o.each(function(e,n){var r=e.get("scrollWidth"),o=e.get("scrollHeight"),u=Math.max(0,r-i),a=Math.max(0,o-s);t._pageDims[n]?(t._pageDims[n].maxScrollX=u,t._pageDims[n].maxScrollY=a):t._pageDims[n]={scrollX:0,scrollY:0,maxScrollX:u,maxScrollY:a,width:r,height:o}})},_beforeHostScrollTo:function(t,n,r,i,s){var o=this,u=o._host,a=u._gesture,f=o._cIndex,l=o._cAxis,c=o._getPageNodes(),h;return a&&(h=a.axis,h===b?t=null:n=null,l[h]===!1&&(s=c.item(f))),new e.Do.AlterArgs("new args",[t,n,r,i,s])},_afterHostGestureMoveEnd:function(e){if(this._host._gesture.flick)return;var t=this,n=t._host,r=n._gesture,i=t._cIndex,s=t._getPageNodes(),o=s.item(i),a=t._cAxis,f=r.axis,l=f===y,c=r[l?"deltaX":"deltaY"],h=c>0,p=t._pageDims[i],d=p[l?"width":"height"]/2,v=Math.abs(c)>=d,m=a[f],g=n.rtl;m&&(v?t[g===h?"prev":"next"]():t.scrollToIndex(t.get(u)))},_beforeHostMousewheel:function(t){var n=this,r=n._host,i=r._bb,s=t.wheelDelta<0,o=n._cAxis;if(i.contains(t.target)&&o[b])return n[s?"next":"prev"](),t.preventDefault(),new e.Do.Prevent},_beforeHostFlick:function(t){if(this._host._isOutOfBounds())return new e.Do.Prevent;var n=this,r=n._host,i=r._gesture,s=n._cIndex,o=n.get(g),u=t.flick,a=u.velocity,f=u.axis,l=a<0,c=o[f],h=r.rtl;i&&(i.flick=u);if(c)return n[h===l?"prev":"next"](),new e.Do.Prevent},_afterHostScrollEnded:function(e){var t=this,n=t._host,r=t._cIndex,i=n.get(a),s=n.get(f),o=t._cAxis;o[b]?t._pageDims[r].scrollX=i:t._pageDims[r].scrollY=s,t._optimize()},_afterIndexChange:function(e){var t=this,n=t._host,r=e.newVal,i=t._pageDims[r],s=n._cAxis,u=t._cAxis;t._cIndex=r,s[y]&&s[b]&&(u[b]?(n._maxScrollX=i.maxScrollX,n.set(a,i.scrollX,{src:o})):u[y]&&(n._maxScrollY=i.maxScrollY,n.set(f,i.scrollY,{src:o}))),e.src!==o&&t.scrollToIndex(r)},_optimize:function(){if(!this._optimizeMemory)return!1;var e=this,t=e._cIndex,n=e._getStage(t);e._showNodes(n.visible),e._hideNodes(n.hidden)},_getStage:function(e){var t=this,n=t._pageBuffer,r=t.get(l),i=t._getPageNodes(),s=Math.max(0,e-n),o=Math.min(r,e+1+n);return{visible:i.splice(s,o-s),hidden:i}},_showNodes:function(e){e&&e.removeClass(i).setStyle("visibility","")},_hideNodes:function(e){e&&e.addClass(i).setStyle("visibility","hidden")},_getPageNodes:function(){var e=this,t=e._host,n=t._cb,r=e.get(d),i=r?n.all(r):n.get("children");return i},next:function(){var e=this,t=e._cIndex,n=t+1,r=e.get(l);if(n>=r)return;e.set(u,n)},prev:function(){var e=this,t=e._cIndex,n=t-1;if(n<0)return;e.set(u,n)},scrollTo:function(){return this.scrollToIndex.apply(this,arguments)},scrollToIndex:function(e,t,n){var r=this,i=r._host,s=r._getPageNodes().item(e),l=r._cAxis[y]?a:f,c=s.get(l===a?"offsetLeft":"offsetTop");t=t!==undefined?t:w.TRANSITION.duration,n=n!==undefined?n:w.TRANSITION.easing,r.set(u,e,{src:o}),r._showNodes(s),i.set(l,c,{duration:t,easing:n})},_axisSetter:function(t,n){if(e.Lang.isString(t))return{x:t.match(/x/i)?!0:!1,y:t.match(/y/i)?!0:!1}},_afterAxisChange:function(e){this._cAxis=e.newVal}},{NAME:"pluginScrollViewPaginator",NS:"pages",ATTRS:{axis:{setter:"_axisSetter",writeOnce:"initOnly"},selector:{value:null},index:{value:0},total:{value:0}},TRANSITION:{duration:300,easing:"ease-out"}}),e.namespace("Plugin").ScrollViewPaginator=w},"@VERSION@",{requires:["plugin","classnamemanager"]});
