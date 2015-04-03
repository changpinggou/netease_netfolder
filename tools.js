window.GE = {};

var $break = {};
var $continue = {};
String.prototype.stripTags        = fStripTags;       // 删除标签
String.prototype.escapeHTML       = fEscapeHTML;      // html编码
String.prototype.unescapeHTML     = fUnescapeHTML;    // html解码
String.prototype.encodeHTML		  = fEncodeHTML;    // html编码
String.prototype.decodeHTML		  = fDecodeHTML;    // html解码
String.prototype.usc_hdc          = fUsc_hdc;         // url＆html解码
String.prototype.trim             = fTrim;            // 删除字符串两边的空格
String.prototype.ltrim            = fLtrim;           // 删除左边的空格
String.prototype.rtrim            = fRtrim;           // 删除右边的空格
String.prototype.len              = fLen;             // 字符串的长度,可以检查中文
String.prototype.left             = fLeft;            // 截取左边数起第几个字符,截取后用...代替
String.prototype.posIndexOf		   = fPosIndexOf;	  // 第几个字符的位置
Date.prototype.dateAdd            = fDateAdd;         // 日期类型增加天数
Date.prototype.format             = fDateFormat;      // 格式化日期为yyyy-MM-dd hh:mm:ss

Field.clear             = fClear;           // 清除内容
Field.activate          = fActivate;        // 激活对象

EV.getTarget		= fGetTarget;			// 获取target
EV.getEvent			= fGetEvent;			// 获取event
EV.stopEvent		= fStopEvent;			// 取消事件和事件冒泡
EV.observeAndCache  = fObserveAndCache;
EV.stopPropagation	= fStopPropagation;		// 取消事件冒泡
EV.preventDefault	= fPreventDefault;		// 取消事件
EV.pointerX			= fPointerX;			// 鼠标x位置
EV.pointerY			= fPointerY;			// 鼠标y位置
EV.observers		= false;				    // 监听事件的缓存对象	
EV.stopObserving	= fStopObserving;		// 取消事件监听
EV.observe			= fObserve;				// 增加事件监听

Array.prototype.each = fArrayEach;

// IE5兼容
if (!Array.prototype.push) {
  Array.prototype.ie5  = true;
  Array.prototype.push = function() {
	var startLength = this.length;
	for (var i = 0; i < arguments.length; i++)
	  this[startLength + i] = arguments[i];
	return this.length;
  }
}
if (!Array.prototype.shift) {
  Array.prototype.shift = function () {
	var returnValue = this[0];
	for (i = 1; i < this.length; i++) {
	  this[i - 1] = this[i];
	}
	this.length--;
	return returnValue;
  }
}
if (!Array.prototype.pop) {
  Array.prototype.pop = function () {
	  lastElement = this[this.length-1];
	  this.length = Math.max(this.length-1,0);
	  return lastElement;
  }
}

/**
 * 转换成字符串
 */
Array.prototype.toString = function(){
	return this.join("");
};

/**
 * 通过id获取对象
 *
 * @param  {string}args  id字符串，可以有多个参数，用逗号分开
 * @return {Object}      根据id返回相应的对象   
 */
function $() {
  var aElements = [];
  var nLength = arguments.length;
  for (var i = 0; i < nLength; i++) {
	var oElement = arguments[i];
	if(typeof oElement == 'string'){
		oElement = document.getElementById(oElement);
	}
	if(nLength == 1){
		return oElement;
	}
	aElements.push(oElement);
  }
  return aElements;
}

/**
 * 文本输入框函数集合
 * 
 * @class 文本输入框对象
 */
function Field(){
  // TODO
}
/**
 * 元素函数集合
 * 
 * @class 元素对象
 */
function El(){
  // TODO
}
/**
 * event函数集合
 * 
 * @class event对象
 */
function EV(){}

/**
 * 检查字符串是否是合法的格式
 *
 * @param  {string}strEmail  Email地址
 * @return {Boolean}         如果Email地址错误返回空字符串
 */
function fIsEmailAddr(sEmail){
	return /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(sEmail);
}

/**
 * 检查字符串的日期格式是否正确
 *
 * @param  {date}sDate  要验证的日期 
 * @return {Boolean}    日期格式是否合法，合法的格式为yyyy-MM-dd 
 */
function fCheckDate(sDate){
  var aStr = sDate.split("-");
  var oDate = new Date(aStr[0],aStr[1]-1,aStr[2]);
  if(oDate.getFullYear() != aStr[0] || (oDate.getMonth()+1) != parseInt(aStr[1],10) || oDate.getDate() != parseInt(aStr[2],10)){
	return false;
  }
  return true;
}

/**
 * 去掉字符串两边的空格
 *
 * @param   void   
 * @return {String} 去掉两边空格后的字符串    
 */
function fTrim(){
  return this.replace(/(^\s*)|(\s*$)/g, "");
}

/**
 * 去掉字符串左边的空格 
 *
 * @param   void   
 * @return {String} 去掉左边空格后的字符串    
 */
function fLtrim(){
  return this.replace(/(^\s*)/g, "");
}

/**
 * 去掉字符串右边的空格
 *
 * @param   void   
 * @return {String} 去掉右边空格后的字符串    
 */
function fRtrim(){
  return this.replace(/(\s*$)/g, "");
}

/**
 * 去掉字符串的所有空格
 *
 * @param   void   
 * @return {String} 去掉所有空格后的字符串    
 */
function fCleanBlank(){
  return this.replace( /\s/g, "");
}

/**
 * 第几个字符的位置
 *
 * @param  {String}sSearch  需要匹配的目的字符串  
 * @return {Number}nIndex  第几个目的字符串  
 * example 查找 "abcdeabcde" 中第二个b的位置
 */
function fPosIndexOf(sSearch, nIndex){
	var aStr = this.split(sSearch);
	if(aStr.length - 1 < nIndex){
		return -1;
	}else{
		var len = 0;
		for(var i=0; i<nIndex; i++){
			len += aStr[i].length;
			len += sSearch.length;
		}
		return len - sSearch.length;
	}
}

/**
 * 取字符串长度,包括中文字的长度，一个中文字符长度为2
 *
 * @param   void  
 * @return {Number}  字符串的长度    
 */
function fLen(){
  var nCNLenth = 0;
  var nLenth = this.length;
  for (var i=0; i<nLenth; i++){
	if(this.charCodeAt(i)>255){
	  nCNLenth += 2; 
	}else{
	  nCNLenth++;
	}
  }
  return nCNLenth;
}

/**
 * 删除标签字符串
 *
 * @param   void
 * @return {String}   删除标签后的字符串 
 */
function fStripTags(){
	return this.replace(/<\/?[^>]+>/gi, '');
};

/**
 * html编码
 *
 * @param   void
 * @return {String}   编码后的html代码
 */
function fEscapeHTML(){
	var oDiv = document.createElement('div');
	var oText = document.createTextNode(this);
	oDiv.appendChild(oText);
	return oDiv.innerHTML;
};

/**
 * html解码
 *
 * @param   void
 * @return {String}  解码后的html代码  
 */
function fUnescapeHTML(){
	var oDiv = document.createElement('div');
	oDiv.innerHTML = this.stripTags();
	return oDiv.childNodes[0].nodeValue;
};

/**
 * html编码
 */
function fEncodeHTML(){
	var s = this;
	s = s.replace(/\&/gi,"&amp;");
	s = s.replace(/</gi,"&lt;");
	s = s.replace(/>/gi,"&gt;");
	s = s.replace(/\"/gi,"&quot;");
	return s;
}

/**
 * html解码
 */
function fDecodeHTML(){
	var s = this;
	s = s.replace(/&lt;/gi,"<");
	s = s.replace(/&gt;/gi,">");
	s = s.replace(/&quot;/gi,"\"");
	s = s.replace(/&amp;/gi,"&");
	s = s.replace(/&nbsp;/gi," ");
	return s;
}

/**
 * url＆html解码
 *
 * @param   void  
 * @return {String}  解码后的url＆html字符串  
 */
function fUsc_hdc(){
  return unescape(this.unescapeHTML());
}

/**
 * 截取字符串左边n位
 *
 * @param  {number}n  要截取的位数 
 * @return {String}   截取的字符串 
 */
function fLeft(nLen){
  var i = 0;
  var j = 0;
  if(this.len() <= nLen){
	return this;
  }
  while(j < nLen){
	if(this.charCodeAt(i)>255){
	  j += 2;
	}else{
	  j ++;
	}
	i ++;
  }
  return this.substring(0,i) + "..";
}

/**
 * 日期变量增加n天
 *
 * @param  {number}n  要增加的天数,小于0表示减n天  
 * @return {Date}     增加了n天后的日期    
 */
function fDateAdd(n){
  return new Date(this.valueOf()+n*3600*24*1000);
};

/**
 * 格式化日期为 yyyy-MM-dd hh:mm:ss
 *
 * @param  {void}  
 * @return {String}
 *          返回字符串日期
 */
function fDateFormat(bOnlyDate){
	var nYear = this.getFullYear();
	var nMonth = this.getMonth() + 1;
	var nDate = this.getDate();
	var nHour = this.getHours();
	var nMinute = this.getMinutes();
	var nSecond = this.getSeconds();
	// 格式化时间
	var sTime = nYear + (nMonth<10 ? '-0' : '-')+ nMonth + (nDate<10 ? '-0' : '-')+ nDate + 
			   (nHour<10 ? ' 0' : ' ')+ nHour + (nMinute<10 ? ':0' : ":")+ nMinute + (nSecond<10 ? ':0' : ':')+ nSecond;
	if(bOnlyDate){
		return sTime.split(" ")[0];
	}
	// 返回时间
	return sTime
}

/**
 * 获取事件的触发元素
 * Returns the event's target element
 * @param {Event} ev Event对象
 * @param {boolean} resolveTextNode when set to true the target's
 *                  parent will be returned if the target is a 
 *                  text node
 * @return {HTMLElement} 返回事件的触发元素，如果是文本则返回父元素
 */
function fGetTarget(ev, resolveTextNode){
	if(!ev) ev = this.getEvent();
	var t = ev.target || ev.srcElement;

	if (resolveTextNode && t && "#text" == t.nodeName) {
		return t.parentNode;
	} else {
		return t;
	}
}

/**
 * 增加事件监视并cache下来
 * @param {element}oElement 事件的对象
 * @param {string}name 事件
 * @param {function}observer 绑定事件的函数
 * @param {bool}useCapture
 * @return {void}
 */
function fObserveAndCache(oElement, name, observer, useCapture) {
	if (!this.observers){
		this.observers = [];
	}
	if (oElement.addEventListener) {
		this.observers.push([oElement, name, observer, useCapture]);
		oElement.addEventListener(name, observer, useCapture);
	}else if(oElement.attachEvent) {
		this.observers.push([oElement, name, observer, useCapture]);
		oElement.attachEvent('on' + name, observer);
	}
}

/**
 * 获取event对象
 * @param {Event} event对象
 * @return {Event} event对象
 */
function fGetEvent (e) {
	var ev = e || window.event || top.event;
	
	if (!ev) {
		var aCaller = [];
		var c = this.getEvent.caller;
		while (c) {
			ev = c.arguments[0];
			if (ev && Event == ev.constructor) {
				break;
			}
			
			var b = false;
			for(var i=0;i<aCaller.length;i++){
				if(c == aCaller[i]){
					b = true;
					break;
				}
			}
			if(b){
				break;
			}else{
				aCaller.push(c);
			}
			c = c.caller;
		}
	}

	return ev;
}

/**
 * 阻止事件冒泡触发以及阻止默认事件触发
 * @param {Event} ev event对象
 * @return {void}
 */
function fStopEvent(ev) {
	if(!ev){
		ev = this.getEvent();
	}
	this.stopPropagation(ev);
	this.preventDefault(ev);
}

/**
 * 阻止事件冒泡触发
 * @param {Event} ev event对象
 * @return {void}
 */
function fStopPropagation(ev) {
	if(!ev){
		ev = this.getEvent();
	}
	if (ev.stopPropagation) {
		ev.stopPropagation();
	}else{
		ev.cancelBubble = true;
	}
}

/**
 * 阻止默认事件触发
 * @param {Event} ev event对象
 * @return {void}
 */
function fPreventDefault(ev) {
	if(!ev){
		ev = this.getEvent();
	}
	if (ev.preventDefault) {
		ev.preventDefault();
	} else {
		ev.returnValue = false;
	}
}

/**
 * 事件触发鼠标x坐标
 * @param {event}ev event对象
 * @return {number}返回x坐标
 */
function fPointerX(ev) {
	if(!ev){
		ev = this.getEvent();
	}
	var doc = document;
	return ev.pageX || (ev.clientX +
	  (doc.documentElement.scrollLeft || doc.body.scrollLeft));
}

/**
 * 事件触发鼠标x坐标
 * @param {event}ev event对象
 * @return {number}返回y坐标
 */
function fPointerY(ev) {
	if(!ev){
		ev = this.getEvent();
	}
	var doc = document;
	return ev.pageY || (ev.clientY +
	  (doc.documentElement.scrollTop || doc.body.scrollTop));
}

/**
 * 增加事件监视
 * @param {element}oElement 事件的对象
 * @param {string}name 事件
 * @param {function}observer 绑定事件的函数
 * @param {bool}useCapture
 * @return {void}
 */
function fObserve(oElement, name, observer, useCapture) {
	useCapture = useCapture || false;
	
	if (name == 'keypress' &&
		(navigator.appVersion.match(/Konqueror|Safari|KHTML/)
		|| oElement.attachEvent)){
	  name = 'keydown';
	}
	
	this.observeAndCache(oElement, name, observer, useCapture);
}

/**
 * 移除事件监视
 * @param {element}oElement 事件的对象
 * @param {string}name 事件
 * @param {function}observer 绑定事件的函数
 * @param {bool}useCapture
 * @return {void}
 */
function fStopObserving(oElement, name, observer, useCapture) {
	useCapture = useCapture || false;
	
	if (name == 'keypress' &&
		(navigator.appVersion.match(/Konqueror|Safari|KHTML/)
		|| oElement.detachEvent)){
	  name = 'keydown';
	}

	if (oElement.removeEventListener) {
	  oElement.removeEventListener(name, observer, useCapture);
	} else if (oElement.detachEvent) {
	  oElement.detachEvent('on' + name, observer);
	}
}

/**
 * 遍历数组
 * @param  {function} func 遍历需要调用的函数 
 * @return {void}
 */
function fArrayEach(func){
	for(var i=0,m=this.length;i<m;i++){
		try{
			func(i, this[i]);
		}catch(exp){
			if(exp == $break){
				break;
			}else if(exp == $continue){
				continue;
			}else{
				throw exp;
			}
		}
	}
}

/**
 * 遍历数组
 * @param  {object} value 判断数组中是否含有某个值 
 * @return {boolean} 
 */
function fArrayHas(value){
	var r = false;
	this.each(function(i, o){
		if(o == value){
			r = true;
			throw $break;
		}
	});
	return r;
};

/**
 * 转换成字符串
 */
function fArrayToString(sSplitter){
	if(!sSplitter){
		sSplitter = "";
	}
	return this.join(sSplitter);
}

/**
 * 检查当前是否真是onmouseover状态
 * @private
 * @param  {object}o 绑定事件的对象
 * @param  {object}e 事件
 * @return {bool} 返回状态     
 */
function fCheckIsOnMouseOver(o, e){
	try{
		var e = e || EV.getEvent();
		var to = e.toElement || e.target;
		var from = e.fromElement || e.relatedTarget;
		if(El.descendantOf(to, o) && !El.descendantOf(from, o)){
			return true;
		}else{
			return false;
		}
	}catch(exp){
		return true;
	}
}
/**
 * 检查当前是否真是onmouseout状态
 * @private
 * @param  {object}o 绑定事件的对象
 * @param  {object}e 事件
 * @return {bool} 返回状态     
 */
function fCheckIsOnMouseOut(o, e){
	try{
		var e = e || EV.getEvent();
		var to = e.toElement || e.relatedTarget;
		var from = e.fromElement || e.target;
		// var div = El.createElement("div");div.innerHTML = to.outerHTML.encodeHTML();document.body.appendChild(div);
		if(!El.descendantOf(to, o) && El.descendantOf(from, o)){
			return true;
		}else{
			return false;
		}
	}catch(exp){
		return true;
	}
}

/**
 * 使对象可以拖动
 * @param {object}obj 触发拖动的对象
 * @param {object}oMoveObj 被拖动的对象
 */
function fSetDragable(obj, oMoveObj){
	var oDoc = top.document;
	var fSelectEvent = function(){return false};
	var fObjMoving = function(e){
		var ev = e || top.event;		// 获取event对象
		if(oDoc.all && ev.button != 1){
			obj.onmouseup();
			return;
		}
		var x = EV.pointerX(ev);	// 获取鼠标坐标
		var y = EV.pointerY(ev);	
		var x1 = x - oMoveObj.x;
		var y1 = y - oMoveObj.y;
		oMoveObj.style.left = parseInt(oMoveObj.style.left, 10) + x1 + "px";	// 设置位置
		oMoveObj.style.top = parseInt(oMoveObj.style.top, 10) + y1 + "px";
		oMoveObj.x = x;
		oMoveObj.y = y;
		// $$("spnTest").innerHTML = "x:"+ oMoveObj.style.left +" -- y:" + oMoveObj.style.top;
	};
	obj.onmousedown = function(e){
		var ev = e || top.event;	// 获取event对象
		var x = EV.pointerX(ev);	// 获取鼠标坐标
		var y = EV.pointerY(ev);
		oMoveObj.x = x;
		oMoveObj.y = y;
		EV.observe(oDoc, "mousemove", fObjMoving);		// 添加oDoc onmousemove事件
		EV.observe(oDoc, "selectstart", fSelectEvent);	// 添加oDoc selectstart事件
	};
	obj.onmouseup = function(){
		EV.stopObserving(oDoc, "mousemove", fObjMoving);
		EV.stopObserving(oDoc, "selectstart", fSelectEvent);
		var oMaskItem = $("maskItem");
		if(oMaskItem){
			oMaskItem.style.display = "none";
		}
	};
}

// 检查文件名是否合法
function fCheckFolderName(sName){
	var sMsg = "";
	if(sName == ""){
		sMsg = "文件夹名称不能为空!";
	}
	if(sName.length > 12){
		sMsg = "长度不能大于12个字符!";
	}
	if(/[,%\'\"\/\\;|\<\>\&\.\*]/.test(sName)){
		sMsg = "请不要输入 ＂, % \' \" \\ \/ ；|<>&.*＂ 等特殊字符。";
	}
	try{
		if(top.frames.folder.aFolderId.has(sName)){
			sMsg = "同名文件夹已存在。";
		}
	}catch(exp){}
	return sMsg;
}
/**
 * 取本地cookie
 * @param   {String}sName cookie的name
 * @return  {void}
 */
function fGetCookie(sName) {
   var sSearch = sName + "=";
   if(document.cookie.length > 0) {
	  var sOffset = document.cookie.indexOf(sSearch);
	  if(sOffset != -1) {
		 sOffset += sSearch.length;
		 end = document.cookie.indexOf(";", sOffset);
		 if(end == -1) end = document.cookie.length;
		 return unescape(document.cookie.substring(sOffset, end));
	  }
	  else return "";
   }
}
function fRemoveById(sId){
	var o = document.getElementById(sId);
	if(o){
		o.parentNode.removeChild(o);
	}
}
function replace(eC,aKB){
	if(eC){
		return this.aFe(eC);
	}else{
		return this.toString();
	}
}
function aFe(eC){
	if(!this.Mc){
		this.Mc=this.anj.split(this.apM);
		this.arh=this.Mc.concat();
	}

	var aaZ=this.Mc,
	Ym=this.arh;

	for(var i=1,aP=aaZ.length;i<aP;i+=2){
		Ym[i]=eC[aaZ[i]];
	}

	return Ym.join("");
}
/**
 * 对象坐标
 * @param {element}oElement 坐标的对象
 * @return {array}返回坐标数组
 */
function fPosition(oElement) {
	if(!oElement){
		var oElement = this;
	}
	var nT = 0, nL = 0;
	do {
	  nT += oElement.offsetTop  || 0;
	  nL += oElement.offsetLeft || 0;
	  oElement = oElement.offsetParent;
	} while (oElement);
	return [nL, nT];
}
/**
 * 浏览器类型
 * @param   void
 * @return  {void}
 */
function fGetUserAgen(){
	GE.isIE = document.all ? true : false;
	var sUserAgent = window.navigator.userAgent.toLowerCase();
	var sAppName = "";
	var sVersion = "";
	if(/msie/.test(sUserAgent)){// IE
		sAppName   = "msie";
	}else if(/firefox/.test(sUserAgent)){// ff
		sAppName = "firefox";
	}else if(/netscape/.test(sUserAgent)){// netscape
		sAppName = "netscape";
	}else if(/opera/ig.test(sUserAgent)){// opera
		sAppName = "opera";
	}else if(/chrome/ig.test(sUserAgent)){// chrome
		sAppName = "chrome";
		sVersion = "0";
	}else if(/safari/ig.test(sUserAgent)){// safari
		sAppName = "safari";
		sVersion = "0";
	}
	var match = /(webkit)[ \/]([\w.]+)/.exec( sUserAgent ) ||
			/(opera)(?:.*version)?[ \/]([\w.]+)/.exec( sUserAgent ) ||
			/(msie) ([\w.]+)/.exec( sUserAgent ) ||
			!/compatible/.test( sUserAgent ) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec( sUserAgent ) ||
		  	[];
	GE.gAppName = sAppName; // 浏览器名称
	GE.gVersion = isNaN(match[2] - 0) ? match[2] : (match[2] - 0); // 版本号
	GE.gAppType = match[1];	// 类型
	if(sAppName == "msie" && sVersion >= 5 && sVersion < 5.5){
		GE.isIE5 = true;
	}
}

/**
 * 引用外部js
 * @method  getScript
 * @param {string} sUrl:外部js的url
 * @param {string} sCharset:编码
 * @return {boolean} 返回是否请求
 * @for CommonControl
 */
function fCommonGetScript(sUrl, sCharset){ 
	var oJs = document.createElement("script");
	oJs.setAttribute("src", sUrl);
	oJs.setAttribute("charset", sCharset || "utf-8");
	oJs.setAttribute("type", "text/javascript");
  var oHead = document.getElementsByTagName('HEAD').item(0);   
	oHead.appendChild(oJs);
	return true;
}
/**
 * 附加外部js
 * @method  AppendJsBySource
 * @param {source: js文本}
 */
function AppendJsBySource(source){  
  var oHead = document.getElementsByTagName('HEAD').item(0); 
  var oScript = document.createElement("script"); 
  oScript.language = "javascript";
  oScript.setAttribute("charset","utf-8");
  oScript.type = "text/javascript";
  oScript.text = source;
  oHead.appendChild(oScript);
};

/**
 * 系统提示框
 * @method  msgBox
 * @param {object}o 提示信息对象
 * @param {object}返回button对象
 * @for Msg
 */
function fCommonMsgBox(o){
	var msgbox = document.getElementById("dvMsgbox");
	if(msgbox){ // 删除已有的提示框
		document.body.removeChild(msgbox);
	}
	if(o.height == "max"){
		o.height = document.body.offsetHeight - 50;
	}
	var sHtml = '<div class="gSys-msg" style="display:block" id="dvMsgbox">' +
		'<div class="gSys-msg-win" style="width:'+ (o.width ? o.width : '460') +'px;" id="dvMsgboxChild">' +
		'			<div class="fn-bgx bg-main-2 hd" id="dvMsgHead">' +
		'				<span class="fn-bg rc-l"></span>' +
		'				<h4>'+ (o.title ? o.title : '系统提示') +'</h4>' +
		'				<span class="sub txt-14">'+ (o.quotTitle ? '('+ o.quotTitle +')' : '') +'</span>' +
		'				<span class="fn-bg rc-r"></span>' +
		'				<a href="javascript:fGoto()" id="lnkClose" class="fn-bg Aclose" hidefocus="true" title="关闭">关闭</a>' +
		'			</div>' +
		'			<div class="cont bdr-c-dark" style="'+ (o.height ? "height:" + o.height + "px;": '') +'">$content$</div>' +
		'			<div class="ft bdr-c-dark bg-cont" '+(o.hideBottom ? 'style="display:none;" ':'') +'>' +
		'				<div class="sup" id="dvMsgBottomDiv" style="margin:8px">'+ (o.bottom || "") +'</div>' +
		'				<div class="opt">' +
		'					$disbtn$' +
		'					$extbtn$' + '<div id="btnMsgOk" class="btn btn-dft"><span>'+(o.okText || "确 定")+'</span></div>' + 
		'					$cancel$' +
		'				</div>' +
		'			</div>' +
		'		</div>' +
		(o.noMask ? '' : '<div class="mask" id="dvMsgMask">&nbsp;</div>') +
		'	</div>';
	var sContent = '<div class="gSys-inner-comm">' +
		'	<b class="ico '+ (o.icon || "ico-info") +'" title="提示："></b>' +
		'	<div class="ct">'+ o.content +'</div>' +
		'</div>';
	if(o.isPrompt){
		sContent = '<div class="gSys-inner-comm"><b class="ico ico-info" title="提示："></b><div class="ct"><table class="gSys-Itab-ipt"><tbody><tr><th><nobr>'+ o.content +'：</nobr></th><td><input type="'+ (o.inputType || "text") +'"  id="txtPromptInput" class="ipt-t-dft" onkeydown="if((event.charCode || event.keyCode) == 13){$(\'btnMsgOk\').onclick();}" /><div class="txt-err" id="spnEroMsg"></div><span id="spnMsgBoxExtOption"></span></td></tr></tbody></table></div></div>';
	}
	if(o.noIcon){// 不显示左侧图标
		sContent = o.content;
	}
	// 替换内容
	sHtml = sHtml.replace("$content$", sContent);
	// 替换按钮
	var sCancel = "";
	sHtml = sHtml.replace("$cancel$", o.hasCancel ? '<div id="btnMsgCancel" class="btn btn-dft"><span>'+(o.cancelText || "取 消")+'</span></div>' : '');
	var sExtbtn = "";
	sHtml = sHtml.replace("$extbtn$", o.extBtn ? '<div id="btnMsgExt" class="btn btn-dft"><span>'+o.extBtn.text+'</span></div>' : '');
	// 禁止按钮
	sHtml = sHtml.replace("$disbtn$", o.disBtn ? '<div id="btnMsgDis" class="btn btn-dft"><span>'+(o.cancelText || "确 定")+'</span></div>' : '');
	
	var oCon = document.createElement("DIV"); // 顶部生成对话框
	oCon.innerHTML = sHtml;
	document.body.appendChild(oCon.firstChild);
	var oMsgBox = document.getElementById("dvMsgbox");
  var otxtPromp = document.getElementById("txtPromptInput");
	if(o.isPrompt){// 如果是提示对话框模式
		otxtPromp.value = o.defaultValue || ""; // 填充默认值
		window.setTimeout(Field.activate.bind(Field, otxtPromp), 0);// 光标自动定位
	}   
	var oTopDoc = document;
  var dvMsgboxChild = document.getElementById("dvMsgboxChild");
	if(o.noPos){ // 不设置位置
		dvMsgboxChild.style.left = o.noPos.x + "px";
		dvMsgboxChild.style.top = o.noPos.y + "px";        
	}else{
		// 设置定位坐标
		var h = dvMsgboxChild.offsetHeight;
		var w = dvMsgboxChild.offsetWidth;
		var sScrollTop = (oTopDoc.documentElement.scrollTop || oTopDoc.body.scrollTop); // document.body.scrollTop;			
		var x = ((oTopDoc.documentElement.offsetWidth || oTopDoc.body.offsetWidth) - w)/2;
		var y = ((oTopDoc.documentElement.clientHeight || oTopDoc.body.clientHeight) - h )/2 + sScrollTop;
		y = y < 10 ? 10 : y;
		dvMsgboxChild.style.left = x + "px";
		dvMsgboxChild.style.top = y + "px";    
	}
  var dvMsgMask =document.getElementById("dvMsgMask"); 
	if(dvMsgMask){
  	dvMsgMask.style.height = oTopDoc.body.scrollHeight + "px";
  }
  
	fCommonSetWinDragable(document.getElementById("dvMsgHead"),dvMsgboxChild); // 设置可以拖动
	var aHideItems = [];
	var obtnMsgOk = document.getElementById("btnMsgOk");
  var olnkClose = document.getElementById("lnkClose");
  try{
		obtnMsgOk.focus();// 自动聚焦到确定按钮
	}catch(e){}
	// 确定按钮点击事件
	obtnMsgOk.onclick = function(){
	try{
			EV.stopEvent();
	}catch(e){}
		if(!o.call){// 如果没有确定的call
			o.cancelCall = null;
      	if(olnkClose){olnkClose.onclick();}
		}else{
			var r = null;
			try{
				var param = null;
				if(otxtPromp){// 如果是提示框
					param = otxtPromp.value;
				}
				r = o.call(param);// 调用call
				if(o.isPrompt && r){// 返回非false
					document.getElementById("spnEroMsg").innerHTML = r.msg || r; // 显示返回的错误
					otxtPromp.select();// 聚焦到输入框
					return;
				}
			}catch(e){}
			if(!r){// 返回后关闭
				if(oMsgBox){
					o.cancelCall = null;
					if(olnkClose) olnkClose.onclick();
				}
			}
		}
	};

	// 确定按钮键盘事件
	obtnMsgOk.onkeydown = function (){
		var e = EV.getEvent();
		var sKey = e.charCode || e.keyCode;
		if(sKey == 13 || sKey == 32){// enter 或者是space键
			$("btnMsgOk").onclick();
		}
	};
	// 取消按钮点击事件
  var obtnMsgCancel = document.getElementById("btnMsgCancel");
	(obtnMsgCancel || {}).onclick = function(){
		try{
			if(o.cancelCall && o.cancelCall()){// 调用cancel的call
				return false;
			}
		}catch(e){}
		o.cancelCall = null;
		if(olnkClose){olnkClose.onclick();}
		return false;
	};
	// 扩展按钮点击事件
	(document.getElementById("btnMsgExt") || {}).onclick = function(){
		try{
			if(o.extBtn.call && o.extBtn.call()){
				return false;
			}
		}catch(e){}
		return false;
	};
	// 关闭链接点击事件
	olnkClose.onclick = function(){
    try {
      if(arguments[0] === "callexit"){
        o.exitCall && o.exitCall();
      }
    }catch(e){}
    this.onClose && this.onClose();
		try{
			if(o.cancelCall && o.cancelCall()){
				return false;
			}
		}catch(e){}
		document.body.removeChild(oMsgBox);// 删除对话框
		aHideItems.each(function(i, value){// 显示被隐藏的元素
			value.style.visibility = "visible";
		});
		return false;
	};
  /*
	var arr = ((GE.isIE && GE.gVersion == "6")?(["SELECT"]):(((!GE.isIE || (GE.isIE && (GE.gVersion == "7" || GE.gVersion == "8"))) || GE.gAppName == "opera")?[]:["SELECT"]));
	for(var i=0;i<arr.length;i++){
		$A(document.getElementsByTagName(arr[i])).each(function(i, o){
			if(El.descendantOf(o, $("dvMsgbox"))) throw $continue;// 不隐藏对话框里面的元素
			o.style.visibility = "hidden";
			aHideItems[aHideItems.length] = o;
		});
	}
  */

	if(o.initFlash){
		if(GE.uploaderJs){
			oFileUploader.init({id:"absoluteDiv"});
		}else{
			fCommonGetScript(gUploadJsUrl,"utf-8");
		}            
	}
	return {ok : obtnMsgOk, cancel :obtnMsgCancel, close :olnkClose, prompt:otxtPromp};
}
/**
 * 使顶部window对象可以拖动
 * @method  setTopWinDragable
 * @param {object}obj 触发拖动的对象
 * @param {object}oMoveObj 被拖动的对象
 * @for CommonControl
 */
function fCommonSetWinDragable(obj, oMoveObj){
	obj = $(obj);
	oMoveObj = $(oMoveObj);
	var fSelectEvent = function(){return false};
	var fObjMoving = function(){
		var ev = EV.getEvent();		// 获取event对象
		if(GE.isIE && ev.button != 1){
			obj.onmouseup();
			return;
		}
		var x = EV.pointerX(ev);	// 获取鼠标坐标
		var y = EV.pointerY(ev);	
		var x1 = x - oMoveObj.x;
		var y1 = y - oMoveObj.y;
		oMoveObj.style.left = parseInt(oMoveObj.style.left || oMoveObj.currentStyle.left, 10) + x1 + "px";	// 设置位置
		oMoveObj.style.top = parseInt(oMoveObj.style.top || oMoveObj.currentStyle.top, 10) + y1 + "px";
		oMoveObj.x = x;
		oMoveObj.y = y;
	};
	obj.onmousedown = function(){
		var ev = EV.getEvent();		// 获取event对象
		var x = EV.pointerX(ev);	// 获取鼠标坐标
		var y = EV.pointerY(ev);
		oMoveObj.x = x;
		oMoveObj.y = y;
		EV.observe(document, "mousemove", fObjMoving);		// 添加document onmousemove事件
		EV.observe(document, "selectstart", fSelectEvent);	// 添加document selectstart事件
		
	};
	obj.onmouseup = function(){
		EV.stopObserving(document, "mousemove", fObjMoving);
		EV.stopObserving(document, "selectstart", fSelectEvent);
	};
}


fGetUserAgen();

/**
 * 网盘文件ico配置
 * @method  fileIco 
 * @return  {void}
 * @for Read
 */
GE.fileIco = {
		"ext.xls":"2","ext.xlsx":"2","ext.csv":"2",
		"ext.doc":"3","ext.docx":"3","ext.wps":"3","ext.et" : "3","ext.dps" : "3",
		"ext.ppt":"4","ext.pptx":"4",
		"ext.7z":"5",
		"ext.rar":"6","ext.cab":"6","ext.jar":"6","ext.arj":"6","ext.tar":"6","ext.gz":"6","ext.tgz":"6",
		"ext.zip":"7",
		"ext.iso":"8","ext.img":"8","ext.nrg":"8","ext.mdf":"8","ext.mds":"8",
		"ext.eml":"9",
		"ext.htm":"10","ext.html":"10","ext.shtml":"10","ext.xhtml":"10","ext.mht":"10","ext.asp":"10","ext.aspx":"10",
		"ext.js":"11",
		"ext.css":"12","ext.ini":"12","ext.inf":"12","ext.xml":"12",
		"ext.hlp":"13","ext.chm":"13",
		"ext.exe":"14","ext.app":"14","ext.com":"14",
		"ext.bat":"15","ext.cmd":"15",
		"ext.ttf":"16","ext.fon":"16",
		"ext.pdf":"17",
		"ext.psd":"18","ext.pdd":"18","ext.ps":"18",
		"ext.ai":"19","ext.eps":"19",
		"ext.fla":"20",
		"ext.swf":"21","ext.flv":"21",
		"ext.txt":"22","ext.java":"22","ext.jsp":"22","ext.c":"22","ext.cpp":"22","ext.h":"22","ext.hpp":"22","ext.py":"22","ext.cs":"22","ext.sh":"22",
		"ext.rtf":"23",
		"ext.reg":"24",
		"ext.ra":"25","ext.ram":"25","ext.rpm":"25","ext.rmx":"25","ext.rm":"25","ext.rmvb":"25",
		"ext.wm":"26","ext.wma":"26","ext.wmv":"26","ext.asf":"26","ext.wmp":"26",
		"ext.mov":"27","ext.qt":"27","ext.3gp":"27","ext.3gpp":"27","ext.amr":"27",
		"ext.avi":"28","ext.mkv":"28","ext.mp4":"28","ext.mpg":"28","ext.mpeg":"28","ext.vob":"28","ext.dat":"28","ext.ts":"28","ext.tp":"28","ext.m2ts":"28","ext.evo":"28","ext.pmp":"28","ext.vp6":"28","ext.ivf":"28","ext.dsm":"28","ext.dsv":"28","ext.dsa":"28","ext.dss":"28","ext.fli":"28","ext.flc":"28","ext.flic":"28","ext.roq":"28",
		"ext.mpa":"29","ext.m1a":"29","ext.m2a":"29","ext.mp2":"29","ext.mp3":"29","ext.ac3":"29","ext.dts":"29","ext.ddp":"29","ext.flac":"29","ext.ape":"29","ext.mac":"29","ext.apl":"29","ext.shn":"29","ext.tta":"29","ext.wv":"29","ext.cda":"29","ext.wav":"29","ext.aac":"29","ext.m4a":"29","ext.mka":"29","ext.ogg":"29","ext.mpc":"29","ext.mp+":"29","ext.mpp":"29","ext.au":"29","ext.aif":"29","ext.aifc":"29","ext.aiff":"29","ext.mid":"29","ext.midi":"29","ext.rmi":"29",
		"ext.todo":"30",
		"ext.jpg":"31","ext.jpeg":"31",
		"ext.gif":"32",
		"ext.png":"33",
		"ext.bmp":"34","ext.dib":"34","ext.rle":"34",
		"ext.tif":"35","ext.tiff":"35","ext.xif":"35",
		"ext.emf":"36",
		"ext.wmf":"37",
		"ext.ico":"38","ext.icl":"38","ext.cur":"38","ext.ani":"38",
		"ext.raw":"39","ext.mos":"39","ext.fff":"39","ext.032":"39","ext.bay":"39",
		"ext.cdr":"40","ext.csl":"40","ext.cmx":"40","ext.wpg":"40",
		"ext.dll":"41","ext.ocx":"41","ext.chk":"41","ext.manifest":"41",
		"ext.torrent":"42"};

    /**
 * 清除输入框的内容
 *
 * @param  {void}  输入框对象, 参数没有数量限制
 * @return {void}
 */
function fClear() {
	var nLength = arguments.length;
	for (var i = 0; i < nLength; i++){
		$(arguments[i]).value = '';
	}
}

/**
 * 激活对象
 *
 * @param  {object}element 需要激活的对象
 * @return {void}
 */
function fActivate(oElement) {
  try{
	$(oElement).focus();
	$(oElement).select();
  }catch(exp){}
}

/**
 * 在indexFrame里建立对象
 *
 * @param {string}tag  要建立的对象的标签
 * @param {string}sId  要建立的对象的id
 * @param {object}     返回根据标签建立的对象
 */
function fCreateElement(sTag, sId){
	if(sId){
		var o = $(sId);
		if(o){
			El.remove(o);
		}
	}
	var oElement = document.createElement(sTag);
	if(sId){
		oElement.id = sId;
	}
	return oElement;
}

/**
 * 网盘文件ico index 获取
 * @param {fname : 网盘文件全名}
 * @return  {index : css索引号}
 */
function fGetFileIconIndex(fname){
  var sName = fname;
  var sIco = (sName.replace(/(.|\n)*\./,"ext.")).toLowerCase();
  return GE.fileIco[sIco];
}

/**
 * 网盘文件contentType获取
 * @param {fname : 网盘文件全名}
 * @return  {contentType}
 */
function fGetFileContentType(fname){
  var sName = fname;
  var suffix = (sName.replace(/(.|\n)*\./,"ext.")).toLowerCase();
  return GE.contentType[suffix];
}
/**
 * 返回是否是图片文件
 * @param   {string}	sName	文件名
 * @param   {string}	sIndex	文件图标编号
 * @return  {boolean}	是否是图片文件
 */
function fWpIsPic(sName){
	sIndex = fGetFileIconIndex(sName);
	if(sIndex == "31" || sIndex == "32" || sIndex == "33" || sIndex == "34"){
		return true;
	}
	return false;
}

/**
 * 返回文件中心图片文件
 */
function fGotoFileCenter(){
  WebmailHelper.evalScript("top.CC.goFileCenter('file_center')");
};
/**
 * 返回是否支持试听
 * @param   {string}	sName	文件名
 * @return  {boolean}	是否支持在线试听
 * IE mp3,wav,wma,mid
 * 非IE mp3,wav,swf
 */
function fWpIsMedia(sName){
	var sIco = (sName.replace(/(.|\n)*\./,"ext.")).toLowerCase();
	if(GE.isIE){
		if(sIco == "ext.mp3" || sIco == "ext.wav" || sIco == "ext.wma" || sIco == "ext.mid" || sIco == "ext.midi"){
			return true;
		}
	}else{
		if(sIco == "ext.mp3" || sIco == "ext.wav" || sIco == "ext.swf"){
			return true;
		}
	}
	return false;
}

/**
 * 返回是否支持在线预览
 * @param   {string}	sName	文件名
 * @param   {string}	sIndex	文件图标编号
 * @return  {boolean}	是否支持在线预览
 */
function fCommonIsPrev(sName,sIndex){
	if(sName){
		var sIco = (sName.replace(/(.|\n)*\./,"ext.")).toLowerCase();
		sIndex = GE.fileIco[sIco];	
	}
	if(sIndex == "2" || sIndex == "3" || 
  		sIndex == "4" || sIndex == "6" || 
        sIndex == "7" || sIndex == "10" || 
         sIndex == "11" || sIndex == "12" || 
           sIndex == "17" || sIndex == "22" ||
             sIndex == "31" || sIndex == "32" || sIndex == "33" || sIndex == "34"){
		return true;
	}
	return false;
}

// helper
function BindThis(me, fun) {
    return function() {
      return fun.apply(me, arguments);
    };
};
function CompleteCall(fun, result) {
  if (fun === undefined) {
    return;
  } else if (typeof fun === "function") {
    return fun(result);
  }
};

function	ConvertFileSize(filesize) {
    if (filesize < 0)
      file_size = "0";
    else if (filesize < 1024)
      file_size = filesize + "B";
    else if (filesize < 1024 * 1024)
      file_size = (filesize / 1024).toFixed(2).replace(/\.*0+$/ig, "") + "K";
    else if (filesize < 1024 * 1024 * 1024)
      file_size = (filesize / (1024 * 1024)).toFixed(2).replace(/\.*0+$/ig, "") + "M";
    else
      file_size = (filesize / (1024 * 1024 * 1024)).toFixed(2).replace(/\.*0+$/ig, "") + "G";

    return file_size;
  };

//现在文件、目录的创建时间、更新是都是毫秒+6位的，相当于ns了
function ConvertFromEpoch(epoch){
     epoch = epoch /1000000;
  	var curDate =new Date;
    	var date = new Date(epoch);
     if(curDate.getFullYear() == date.getFullYear()){
    		return (date.getMonth() + 1) + "月" + date.getDate() + "日";
     }
     return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  };

function memofix(memo){
  	if(memo){
    		return '-' + memo;
    }
    return memo;
  };
/**
 * html编码
 */
function EncodeHTML(sHtml){
  if(!sHtml)return '';
	return sHtml.replace(/\&/gi,"&amp;").replace(/</gi,"&lt;").replace(/>/gi,"&gt;").replace(/\"/gi,"&quot;");
}
/**
 *  网盘拖动移动
 *  @return  {void}
 *
 **/
function fWpDragMove(oCheck,nSeleCnt,callback){
	var oMoveObj = fCreateElement("DIV");
	oMoveObj.className = "dragtips bg-err txt-err bdr-c-err";
	oMoveObj.style.position = "absolute";
	var sHtml = '<b id="moveIco" class="ico ico-err-small"></b><p>您选择了'+nSeleCnt+'个文件 '
	if(gDirsCnt === 0){
		sHtml += '<span class="txt-info">(此目录下还没有文件夹)</span> '
	}
	sHtml += '</p>';
	oMoveObj.innerHTML = sHtml;
	document.body.appendChild(oMoveObj);	
	var movetoFid = undefined;
	var fSelectEvent = function(){return false};
  var fDocMouseUp =function(){
		EV.stopObserving(document, "mousemove",   fObjMoving);
		EV.stopObserving(document, "selectstart", fSelectEvent);
		EV.stopObserving(document, "mouseup",	    fDocMouseUp);
		oMoveObj.parentNode.removeChild(oMoveObj);
		callback(movetoFid);
	};

	var fObjMoving = function(){
		var ev = EV.getEvent();		// 获取event对象
		if(GE.isIE && ev.button != 1){
			fDocMouseUp();
			return;
		}
		var x = EV.pointerX(ev)+4;	// 获取鼠标坐标
		var y = EV.pointerY(ev)+4;	
		var x1 = x - oMoveObj.x;
		var y1 = y - oMoveObj.y;
		oMoveObj.style.left = parseInt(oMoveObj.style.left || oMoveObj.currentStyle.left, 10) + x1;	// 设置位置
		oMoveObj.style.top = parseInt(oMoveObj.style.top || oMoveObj.currentStyle.top, 10) + y1;
		oMoveObj.x = x;
		oMoveObj.y = y;
		var oSrc = EV.getTarget();
		while(oSrc && oSrc.parentNode != oSrc){
			if(oSrc.tagName && oSrc.tagName.toUpperCase() == "TR")
				break;
			oSrc = oSrc.parentNode;
		}
		if(oSrc && oSrc.getAttribute("did")){
			movetoFid = oSrc.getAttribute("did");
			oMoveObj.className = "dragtips bg-succ txt-succ bdr-c-succ";
			$("moveIco").className ='ico ico-success-small';
		}else{
			movetoFid = undefined;
			oMoveObj.className = "dragtips bg-err txt-err bdr-c-err";
			$("moveIco").className ='ico ico-err-small';
		}
	};
	// 初始化
	var ev = EV.getEvent();		// 获取event对象
	var x = EV.pointerX(ev);	// 获取鼠标坐标
	var y = EV.pointerY(ev);
	oMoveObj.style.left = x+4+"px";
	oMoveObj.style.top  = y+4+"px";
	oMoveObj.x = x+4;
	oMoveObj.y = y+4;
	EV.observe(document, "mousemove",	fObjMoving);		// 添加document onmousemove事件
	EV.observe(document, "selectstart", fSelectEvent);	// 添加document selectstart事件
	EV.observe(document, "mouseup", fDocMouseUp);	// 添加document selectstart事件
}
 /**
  *从JSON对象创建select元素
  **/
function CreateSelectFromJson(oDir,level){
  var oChildren = oDir.subdirs;
  var dirName = EncodeHTML(oDir.dirName);
  if(!dirName || (dirName === "root")){
    	dirName="网易网盘";
  }
  if(oChildren && oChildren.length){
    var nLen	= oChildren.length;
    var sHtml	= '<option value="'+oDir.id+'" dirname="' + dirName +'">';
    for(var i=0;i<(level<<1);i++){
    	sHtml+='&nbsp;';
    }
    sHtml+= dirName;
    sHtml+='</option>';
    ++level;
    for(var i = 0;i < nLen;i++){
      var oChild = oChildren[i];
      sHtml += CreateSelectFromJson(oChild,level);
    }
    return sHtml;
  }else{
    var temp = '<option value="'+oDir.id+'" dirname="' + dirName +'">';
    for(var i=0;i<(level<<1);i++){
    	temp+='&nbsp;';
    }
    temp +=dirName;
    temp +='</option>';
    return temp;
  }
};

 /**
  *从JSON对象创建目录树
  **/
function fWpCreateFromJson(oDir){
  var oChildren = oDir.subdirs;
  var dirName = EncodeHTML(oDir.dirName);
  if(!dirName || (dirName === "root")){
    	dirName="网易网盘";
  }
  if(oChildren && oChildren.length){
    var nLen	= oChildren.length;
    var	sHtml	= '<li class="fold">'+
              '<span class="ico ico-node" onclick="this.parentNode.className=this.parentNode.className==\'fold\'?\'unfold\':\'fold\';return false;">折叠/展开</span>'+
              '<span class="node">'+
                    '<span id="' +oDir.id+ '" dirname="' +dirName+ '" onclick="fSelectFlder(this);">'+
                    '<b class="ico ico-file ico-file-dir"></b>&nbsp;'+dirName +
                  '</span>'
                '</span>'
              '</li>';
    sHtml	+= '<ul>'
    for(var i = 0;i < nLen;i++){
      var oChild = oChildren[i];
      sHtml += fWpCreateFromJson(oChild);
    }
    sHtml += '</ul>\n';
    return sHtml;
  }else{
    return '<li class="nochild"><span class="node"><span id="'+oDir.id+'" dirname="'+ dirName +'" onclick="fSelectFlder(this);"><b class="ico ico-file ico-file-dir"></b>&nbsp;'+dirName +'</span></span></li>\n';	
  }
};
/**
 * async generated object wrapper template
 * @param produce affect the usage of async generated object from fetch function below, which store in variable me
 *        in case the object is native object, return it dirctly (see AsyncCall)
 *        in case the object is a function which can be used to get a dynamic value lately, call it an return it's return value (see AsyncCallDymanic)
 *        other complex transformation can be done too
 */
var ___AsyncCallTemplate = function(produce) {
  /**
   * this one is the generated object wrapper, which is used to queue calls rely on the very object
   * @param fetch is the async function which used to generate the very object asynchronously
   *        fetch take a callback as parameter, which will receive the object after it's generated
   */
  return function(fetch) {
    var me;
    var cached_action;
    var fetch_state;
    var do_fetch = function() {
      var state = {
        done: false,
        cancel: false
      };
      fetch(function(result) {
        if (!state.cancel) {
          me = result;
          state.done = true;
          if (cached_action) {
          	 for(var j=0;j<cached_action.length;j++){
             	 cached_action[j](produce(me));
             }
            cached_action = undefined;
          }
        }
      });
      return state;
    };
    /**
     * this is the wrapper generated queued-base async-call on the fetched object
     * @param action can be three kind of values listed below
     *          string value "reset", which is used to reset the cached value
     *          function type value, which will be invoke on fetched object
     *          undefined/other value, which will return the fetched object directly
     *          notice that if the object fetching process is not yet done, undefined may be return.
     *          caller must be responsed to check the response value for sanity
     */
    return function(action) {
      if (typeof(action) === "string") {
        if (action === "reset") {
          if (fetch_state) {
            fetch_state.cancel = true;
          }
          me = undefined;
          fetch_state = do_fetch();
        }
      }
      if (typeof(action) === "function") {
        if (me) {
          action(produce(me));
        } else {
          if (cached_action !== undefined) {
            cached_action.push(action);
            return;
          }

          cached_action = [];
          cached_action.push(action);

          fetch_state = do_fetch();
        }
      } else {
        return me;
      }
    };
  };
};

var AsyncCall = ___AsyncCallTemplate(function(me) {
  return me;
});
var AsyncCallDymanic = ___AsyncCallTemplate(function(me) {
  return me();
}); 

/*
 * jQuery JSON Plugin
 * version: 2.1 (2009-08-14)
 *
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 *
 * Brantley Harris wrote this plugin. It is based somewhat on the JSON.org 
 * website's http://www.json.org/json2.js, which proclaims:
 * "NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.", a sentiment that
 * I uphold.
 *
 * It is also influenced heavily by MochiKit's serializeJSON, which is 
 * copyrighted 2005 by Bob Ippolito.
 */ 
(function($) {
    /** jQuery.toJSON( json-serializble )
        Converts the given argument into a JSON respresentation.

        If an object has a "toJSON" function, that will be used to get the representation.
        Non-integer/string keys are skipped in the object, as are keys that point to a function.

        json-serializble:
            The *thing* to be converted.
     **/
    $.toJSON = function(o)
    {
        if (typeof(JSON) == 'object' && JSON.stringify)
            return JSON.stringify(o);
        
        var type = typeof(o);
    
        if (o === null)
            return "null";
    
        if (type == "undefined")
            return undefined;
        
        if (type == "number" || type == "boolean")
            return o + "";
    
        if (type == "string")
            return $.quoteString(o);
    
        if (type == 'object')
        {
            if (typeof o.toJSON == "function") 
                return $.toJSON( o.toJSON() );
            
            if (o.constructor === Date)
            {
                var month = o.getUTCMonth() + 1;
                if (month < 10) month = '0' + month;

                var day = o.getUTCDate();
                if (day < 10) day = '0' + day;

                var year = o.getUTCFullYear();
                
                var hours = o.getUTCHours();
                if (hours < 10) hours = '0' + hours;
                
                var minutes = o.getUTCMinutes();
                if (minutes < 10) minutes = '0' + minutes;
                
                var seconds = o.getUTCSeconds();
                if (seconds < 10) seconds = '0' + seconds;
                
                var milli = o.getUTCMilliseconds();
                if (milli < 100) milli = '0' + milli;
                if (milli < 10) milli = '0' + milli;

                return '"' + year + '-' + month + '-' + day + 'T' +
                             hours + ':' + minutes + ':' + seconds + 
                             '.' + milli + 'Z"'; 
            }

            if (o.constructor === Array) 
            {
                var ret = [];
                for (var i = 0; i < o.length; i++)
                    ret.push( $.toJSON(o[i]) || "null" );

                return "[" + ret.join(",") + "]";
            }
        
            var pairs = [];
            for (var k in o) {
                var name;
                var type = typeof k;

                if (type == "number")
                    name = '"' + k + '"';
                else if (type == "string")
                    name = $.quoteString(k);
                else
                    continue;  //skip non-string or number keys
            
                if (typeof o[k] == "function") 
                    continue;  //skip pairs where the value is a function.
            
                var val = $.toJSON(o[k]);
            
                pairs.push(name + ":" + val);
            }

            return "{" + pairs.join(", ") + "}";
        }
    };

    /** jQuery.evalJSON(src)
        Evaluates a given piece of json source.
     **/
    $.evalJSON = function(src)
    {
        if (typeof(JSON) == 'object' && JSON.parse)
            return JSON.parse(src);
        return eval("(" + src + ")");
    };
    
    /** jQuery.secureEvalJSON(src)
        Evals JSON in a way that is *more* secure.
    **/
    $.secureEvalJSON = function(src)
    {
        if (typeof(JSON) == 'object' && JSON.parse)
            return JSON.parse(src);
        
        var filtered = src;
        filtered = filtered.replace(/\\["\\\/bfnrtu]/g, '@');
        filtered = filtered.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
        filtered = filtered.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
        
        if (/^[\],:{}\s]*$/.test(filtered))
            return eval("(" + src + ")");
        else
            throw new SyntaxError("Error parsing JSON, source is not valid.");
    };

    /** jQuery.quoteString(string)
        Returns a string-repr of a string, escaping quotes intelligently.  
        Mostly a support function for toJSON.
    
        Examples:
            >>> jQuery.quoteString("apple")
            "apple"
        
            >>> jQuery.quoteString('"Where are we going?", she asked.')
            "\"Where are we going?\", she asked."
     **/
    $.quoteString = function(string)
    {
        if (string.match(_escapeable))
        {
            return '"' + string.replace(_escapeable, function (a) 
            {
                var c = _meta[a];
                if (typeof c === 'string') return c;
                c = a.charCodeAt();
                return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
            }) + '"';
        }
        return '"' + string + '"';
    };
    
    var _escapeable = /["\\\x00-\x1f\x7f-\x9f]/g;
    
    var _meta = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"' : '\\"',
        '\\': '\\\\'
    };
})(jQuery);

/*
 * jQuery Templates Plugin 1.0.0pre
 * http://github.com/jquery/jquery-tmpl
 * Requires jQuery 1.4.2
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */
(function(a){var r=a.fn.domManip,d="_tmplitem",q=/^[^<]*(<[\w\W]+>)[^>]*$|\{\{\! /,b={},f={},e,p={key:0,data:{}},i=0,c=0,l=[];function g(g,d,h,e){var c={data:e||(e===0||e===false)?e:d?d.data:{},_wrap:d?d._wrap:null,tmpl:null,parent:d||null,nodes:[],calls:u,nest:w,wrap:x,html:v,update:t};g&&a.extend(c,g,{nodes:[],parent:d});if(h){c.tmpl=h;c._ctnt=c._ctnt||c.tmpl(a,c);c.key=++i;(l.length?f:b)[i]=c}return c}a.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(f,d){a.fn[f]=function(n){var g=[],i=a(n),k,h,m,l,j=this.length===1&&this[0].parentNode;e=b||{};if(j&&j.nodeType===11&&j.childNodes.length===1&&i.length===1){i[d](this[0]);g=this}else{for(h=0,m=i.length;h<m;h++){c=h;k=(h>0?this.clone(true):this).get();a(i[h])[d](k);g=g.concat(k)}c=0;g=this.pushStack(g,f,i.selector)}l=e;e=null;a.tmpl.complete(l);return g}});a.fn.extend({tmpl:function(d,c,b){return a.tmpl(this[0],d,c,b)},tmplItem:function(){return a.tmplItem(this[0])},template:function(b){return a.template(b,this[0])},domManip:function(d,m,k){if(d[0]&&a.isArray(d[0])){var g=a.makeArray(arguments),h=d[0],j=h.length,i=0,f;while(i<j&&!(f=a.data(h[i++],"tmplItem")));if(f&&c)g[2]=function(b){a.tmpl.afterManip(this,b,k)};r.apply(this,g)}else r.apply(this,arguments);c=0;!e&&a.tmpl.complete(b);return this}});a.extend({tmpl:function(d,h,e,c){var i,k=!c;if(k){c=p;d=a.template[d]||a.template(null,d);f={}}else if(!d){d=c.tmpl;b[c.key]=c;c.nodes=[];c.wrapped&&n(c,c.wrapped);return a(j(c,null,c.tmpl(a,c)))}if(!d)return[];if(typeof h==="function")h=h.call(c||{});e&&e.wrapped&&n(e,e.wrapped);i=a.isArray(h)?a.map(h,function(a){return a?g(e,c,d,a):null}):[g(e,c,d,h)];return k?a(j(c,null,i)):i},tmplItem:function(b){var c;if(b instanceof a)b=b[0];while(b&&b.nodeType===1&&!(c=a.data(b,"tmplItem"))&&(b=b.parentNode));return c||p},template:function(c,b){if(b){if(typeof b==="string")b=o(b);else if(b instanceof a)b=b[0]||{};if(b.nodeType)b=a.data(b,"tmpl")||a.data(b,"tmpl",o(b.innerHTML));return typeof c==="string"?(a.template[c]=b):b}return c?typeof c!=="string"?a.template(null,c):a.template[c]||a.template(null,q.test(c)?c:a(c)):null},encode:function(a){return(""+a).split("<").join("&lt;").split(">").join("&gt;").split('"').join("&#34;").split("'").join("&#39;")}});a.extend(a.tmpl,{tag:{tmpl:{_default:{$2:"null"},open:"if($notnull_1){__=__.concat($item.nest($1,$2));}"},wrap:{_default:{$2:"null"},open:"$item.calls(__,$1,$2);__=[];",close:"call=$item.calls();__=call._.concat($item.wrap(call,__));"},each:{_default:{$2:"$index, $value"},open:"if($notnull_1){$.each($1a,function($2){with(this){",close:"}});}"},"if":{open:"if(($notnull_1) && $1a){",close:"}"},"else":{_default:{$1:"true"},open:"}else if(($notnull_1) && $1a){"},html:{open:"if($notnull_1){__.push($1a);}"},"=":{_default:{$1:"$data"},open:"if($notnull_1){__.push($.encode($1a));}"},"!":{open:""}},complete:function(){b={}},afterManip:function(f,b,d){var e=b.nodeType===11?a.makeArray(b.childNodes):b.nodeType===1?[b]:[];d.call(f,b);m(e);c++}});function j(e,g,f){var b,c=f?a.map(f,function(a){return typeof a==="string"?e.key?a.replace(/(<\w+)(?=[\s>])(?![^>]*_tmplitem)([^>]*)/g,"$1 "+d+'="'+e.key+'" $2'):a:j(a,e,a._ctnt)}):e;if(g)return c;c=c.join("");c.replace(/^\s*([^<\s][^<]*)?(<[\w\W]+>)([^>]*[^>\s])?\s*$/,function(f,c,e,d){b=a(e).get();m(b);if(c)b=k(c).concat(b);if(d)b=b.concat(k(d))});return b?b:k(c)}function k(c){var b=document.createElement("div");b.innerHTML=c;return a.makeArray(b.childNodes)}function o(b){return new Function("jQuery","$item","var $=jQuery,call,__=[],$data=$item.data;with($data){__.push('"+a.trim(b).replace(/([\\'])/g,"\\$1").replace(/[\r\t\n]/g," ").replace(/\$\{([^\}]*)\}/g,"{{= $1}}").replace(/\{\{(\/?)(\w+|.)(?:\(((?:[^\}]|\}(?!\}))*?)?\))?(?:\s+(.*?)?)?(\(((?:[^\}]|\}(?!\}))*?)\))?\s*\}\}/g,function(m,l,k,g,b,c,d){var j=a.tmpl.tag[k],i,e,f;if(!j)throw"Unknown template tag: "+k;i=j._default||[];if(c&&!/\w$/.test(b)){b+=c;c=""}if(b){b=h(b);d=d?","+h(d)+")":c?")":"";e=c?b.indexOf(".")>-1?b+h(c):"("+b+").call($item"+d:b;f=c?e:"(typeof("+b+")==='function'?("+b+").call($item):("+b+"))"}else f=e=i.$1||"null";g=h(g);return"');"+j[l?"close":"open"].split("$notnull_1").join(b?"typeof("+b+")!=='undefined' && ("+b+")!=null":"true").split("$1a").join(f).split("$1").join(e).split("$2").join(g||i.$2||"")+"__.push('"})+"');}return __;")}function n(c,b){c._wrap=j(c,true,a.isArray(b)?b:[q.test(b)?b:a(b).html()]).join("")}function h(a){return a?a.replace(/\\'/g,"'").replace(/\\\\/g,"\\"):null}function s(b){var a=document.createElement("div");a.appendChild(b.cloneNode(true));return a.innerHTML}function m(o){var n="_"+c,k,j,l={},e,p,h;for(e=0,p=o.length;e<p;e++){if((k=o[e]).nodeType!==1)continue;j=k.getElementsByTagName("*");for(h=j.length-1;h>=0;h--)m(j[h]);m(k)}function m(j){var p,h=j,k,e,m;if(m=j.getAttribute(d)){while(h.parentNode&&(h=h.parentNode).nodeType===1&&!(p=h.getAttribute(d)));if(p!==m){h=h.parentNode?h.nodeType===11?0:h.getAttribute(d)||0:0;if(!(e=b[m])){e=f[m];e=g(e,b[h]||f[h]);e.key=++i;b[i]=e}c&&o(m)}j.removeAttribute(d)}else if(c&&(e=a.data(j,"tmplItem"))){o(e.key);b[e.key]=e;h=a.data(j.parentNode,"tmplItem");h=h?h.key:0}if(e){k=e;while(k&&k.key!=h){k.nodes.push(j);k=k.parent}delete e._ctnt;delete e._wrap;a.data(j,"tmplItem",e)}function o(a){a=a+n;e=l[a]=l[a]||g(e,b[e.parent.key+n]||e.parent)}}}function u(a,d,c,b){if(!a)return l.pop();l.push({_:a,tmpl:d,item:this,data:c,options:b})}function w(d,c,b){return a.tmpl(a.template(d),c,b,this)}function x(b,d){var c=b.options||{};c.wrapped=d;return a.tmpl(a.template(b.tmpl),b.data,c,b.item)}function v(d,c){var b=this._wrap;return a.map(a(a.isArray(b)?b.join(""):b).filter(d||"*"),function(a){return c?a.innerText||a.textContent:a.outerHTML||s(a)})}function t(){var b=this.nodes;a.tmpl(null,null,null,this).insertBefore(b[0]);a(b).remove()}})(jQuery);


/**
*  Base64 encode / decode
**/
var Base64 = {
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
		input = Base64._utf8_encode(input);
		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
		}
		return output;
	},
 
	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		while (i < input.length) {
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
		  output = output + String.fromCharCode(chr1);
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
		}
		output = Base64._utf8_decode(output);
		return output;
	},
 
	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
		}
		return utftext;
	},
 
	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
		while ( i < utftext.length ) {
			c = utftext.charCodeAt(i);
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}
		return string;
	}
};
  
/**
*  URL encode / decode
**/
var NETEASE_Url = {
	// public method for url encoding
	encode : function (string) {
		return escape(this._utf8_encode(string));
	},
	// public method for url decoding
	decode : function (string) {
		return this._utf8_decode(unescape(string));
	},
	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
		}
		return utftext;
	},
	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
		while ( i < utftext.length ) {
			c = utftext.charCodeAt(i);
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}
		return string;
	}
};