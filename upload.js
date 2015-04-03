/*
flash选择返回的文件数据
file =[{
  creation : ,//创建时间
  id : ,      //文件选择顺序
  modification ，//更改时间
  name , //文件名
  size , //文件大小
  type , //文件类型
  error, //文件错误
}]
邮箱插件选择返回的文件数据

file =[{
  name: ,//文件名字
  blob: ,//
  id ,   //索引
  size,  //大小
  percent, //上传百分比
  bytesLoaded,//已上传的字节数
}]

var UPLOADFILESTATUS = {
    // prepare to upload
    prepare: {}, //预备状态
    select :{},
    // file before upload, checking
    checking: {},
    // file is uploading
    uploading: {},
    done: {},   //
    complete : {},上传完成
    fail :{}//上传失败
    disable : {},禁止上传
    //error : {},文件错误
    deleted: ; //已删除
    // netfolder insufficient disk space
  };  // UPLOADFILESTATUS
*/

var gSwfUrl = "js/upload2.swf";
/*
初始化浏览器类型
*/
function initBrowserType() {
  var browser = {}; 
  var ua = navigator.userAgent.toLowerCase(); 
  if (window.ActiveXObject)   // IE 特有属性
      browser.ie = ua.match(/msie ([\d.]+)/)[1] 
  else if (ua.indexOf('firefox') != -1)
      browser.firefox = ua.match(/firefox\/([\d.]+)/)[1] 
  else if (window.MessageEvent && !document.getBoxObjectFor) 
      browser.chrome = ua.match(/chrome\/([\d.]+)/)[1] 
  else if (window.opera) // Opera 特有属性
      browser.opera = ua.match(/opera.([\d.]+)/)[1] 
  else if (window.openDatabase)  // Safari 特有属性
      browser.safari = ua.match(/version\/([\d.]+)/)[1]; 
  window.browser = browser;
};
/*
初始化邮箱插件
*/
(function() {
  initBrowserType();
  
  if (window.netease && window.netease.factory) {
      return;
  }

  var factory = null;
  
  if (window.browser.ie) {
  	try{
    		factory = new ActiveXObject('MailAssist.Factory');
    	}catch(e){
     	factory = undefined;
    }
  }
  else if (window.browser.firefox) {
  	try{
    		factory = new MailAssistFactory();  // Mailassist 在 Firefox 中定义的 Factory
    }catch(e){
    	  factory = undefined;
    }
  }
  else if (window.browser.chrome) {
    if ((typeof navigator.mimeTypes != 'undefined') && navigator.mimeTypes['application/x-mailassist']) {
      factory = document.createElement("object");
      //factory.style.display = "none"; // If set this, MailAssist.dll will not load immediate
      factory.width = 0;
      factory.height = 0;
      factory.type = 'application/x-mailassist';
      document.documentElement.appendChild(factory);
      if (factory && (typeof factory.create == 'undefined')) {
        // If NP_Initialize() returns an error, factory will still be created.
        // We need to make sure this case doesn't cause MailAssist to appear to
        // have been initialized.
        factory = null;
      }
    }
  }
  
  if (!factory) {
    return;
  }
  
  if (!window.netease) {
    netease = {};
  }
  
  if (!window.netease.factory) {
    window.netease = { factory: factory };
  }
})();
/*
文件上传基类
*/
/*
隐藏弹窗内容，添加子节点
 */
function fCommonUseBox(sHtml,sAction){
    var oUploadDiv = $("divUploadContent");
	if(oUploadDiv.style.display != "none"){
		oUploadDiv.style.display = "none"; 
		var oFlashDiv = $("absoluteDiv");
		oFlashDiv.style.width = "1px";
		oFlashDiv.style.height = "1px";
	}
	if($("divSecond")){
		$("divSecond").style.display = "none"; 
	}

	if($("divRename")){
		$("divRename").remove(); 
	}    
  var oDiv =fCreateElement("DIV");
  oDiv.innerHTML = sHtml;
  oDiv.className = "gSys-inner-netfolder";
  oUploadDiv.parentNode.appendChild(oDiv);
}

var FileUploadBase = function(obj){
  // get files need upload
  this.upload_entry = {};
  this.upload_file_index = 0;
  this.files_this_time = [];
  this.status = {
  	total : 0,       //本次上传总大小
		bytesLoaded : 0, //本次上传已上传大小
		filesLoaded : 0   //已上传文件数
  };

  var nSingleLimit = gUploadLimitM * 1024 * 1024;

  this.getSingleLimit = function(){
    return nSingleLimit;
  };

  this.getUsableLimit = function(){
    return gUsableCapacity;
  };
  
  this.getObject = function(){
    return obj;
  }
};

FileUploadBase.prototype.startUpload = function(){
  //init uploadUI
  var me =this;
  
  var sHtml = '\
    <div class="gSys-body upload">\
    <!--可滚动部分-->\
    	<div class="gSys-scroll">\
        <ul id="uploadUl"></ul>\
      </div>\
      <div id="divUploadAll" class="gSys-tips bg-tips txt-tips">\
        上传总进度：\
        <span class="g-probar"><span style="width:0%"></span></span>\
        <span class="num" >0%</span>，已上传<strong></strong>，总文件大小<strong></strong>\
      </div>\
    </div>\
  ';

	fCommonUseBox(sHtml);

	$("btnMsgOk").onclick = function (){
  	var l = me.files_this_time.length;
    	var oLnkClose = $("lnkClose");
		if(!oLnkClose)return;
  	for(var i =0;i<l;i++){
    		var oFile = me.upload_entry[me.files_this_time[i]];
       if(oFile.status === "uploading"){
         var r=confirm("文件还在上传中，确定停止上传吗!");
				if (r==true){
           me.deleteAllTask();
           if(me.status.filesLoaded > 0){
           	oLnkClose.onclick("callexit");
            	return;
           }else{
             oLnkClose.onclick();
             return;
           }
         }else{
         	return;
         }
       }
    }

    if(me.status.filesLoaded > 0){
			oLnkClose.onclick("callexit");
    }else{
    		oLnkClose.onclick();
    }
  };
  
  var oUploadUl =  $("uploadUl");
  function AddFileUI(oFile){
  	var oLi = fCreateElement("LI");
     oLi.id = "liWpFile" + oFile.id;
     oLi.className = "g-file g-file-wait";
     oLi.innerHTML = '\
      <b class="ico ico-loading"></b>\
      <div class="flname"><strong>'+oFile.name+'</strong></div>\
      <div class="info txt-info">\
      	<a href="javascript:void(0)" onclick="oFileUploader.deleteOneTask('+oFile.id+')" class="ext lnk">删除</a>等待上传中，请稍候...\
      </div>\
    ';
     oUploadUl.appendChild(oLi);
     
  }
  
  var oFile;
  var i,l=me.files_this_time.length;
  for(i=0;i<l;i++){
  	oFile = me.upload_entry[me.files_this_time[i]];
    this.status.total+=oFile.size;
	  AddFileUI(oFile);
  }

	//init statics data
  this.status.bytesLoaded = 0;

  var nBytesTotal = this.status.total;
  var oDivUploadAll = $("divUploadAll");
  var aStrong = oDivUploadAll.getElementsByTagName("STRONG");
  // 总文件大小
  aStrong[1].innerHTML = ConvertFileSize(nBytesTotal);
  
  if(this.files_this_time.length > 0){
    this.autoUpload(this.files_this_time.shift());
  }
};

FileUploadBase.prototype.getError = function(sError){
  switch(sError){
    case "extension":
      return "文件类型受限";
      break;
    case "empty":
      return "文件内容为空";
      break;
    case "limit":
      bFileExLimit = true;
      return "单个文件超过"+nSingleLimit+"M，无法上传";
      break;
    case "quota":
       return "文件大小超过总限制";
       break;
    case "2038":
       return "文件I/O错误";
       break;
    default:
    return  "未知错误，代码"+sError+"";           
    break;
  }
};

FileUploadBase.prototype.checkBeforeUpload = function(bAllSucceed,bAllFail){
  if(bAllSucceed){
    for(var index in this.upload_entry){
      this.files_this_time.push(index);
    }
    this.startUpload();
  }else if(bAllFail){
    var sErrorHtml = ""; 
    for(var i in this.upload_entry){
      oFile = this.upload_entry[i];
      var sName = oFile.name;
      if(sName.len() > 30){
        sName = sName.left(26);
      }
      sErrorHtml += '\
        <tr class="txt-disabd">\
          <td class="wd1 ckb"><input type="checkbox" disabled /></td>\
          <td class="wd2"><b class="ico ico-file ico-file-6"></b></td>\
          <td class="wd3"><span class="flname">'+sName+'</span>&nbsp;<span class="txt-err">('+this.getError(oFile.error)+')</span></td>\
          <td class="wd4">'+ConvertFileSize(oFile.size)+'</td>\
        </tr>\
        ';
    }
    var sHtml = '\
	  <div class="gSys-body select">\
      <!--公用内部头部-->\
      <div class="gSys-header">	\
			  <b class="ico ico-warning" title="提示："></b>\
					<div class="ct">\
						<strong>你选择的文件不能上传，原因如下：</strong>\
					</div>\
			</div>\
		  <table class="g-table-comm">\
        <thead>\
					<tr>\
						<th class="wd1 ckb"><input type="checkbox" /></th>\
						<th class="wd3">文件名</th>\
						<th class="wd4">大小</th>\
					</tr>\
				</thead>\
			</table>\
			<div class="gSys-scroll">\
				<table  class="g-table-comm">\
					<tbody id="selectTBody">\
      ';
     sHtml += sErrorHtml;
     /*
		if(bFileExLimit && (GE.domain == "163.com" || GE.domain == "126.com")){
			var sAdUrl = ( GE.domain == "163.com" ?  'http://reg.vip.163.com/upgradeIndex.m?b10dve1' : 'http://reg.vip.126.com/upgradeIndex.m?b66dve1');
			sHtml += '\
				<tr>\
					<td class="wd1 ckb"></td>\
					<td class="wd2"></td>\
					<td class="wd3"><a href="'+sAdUrl+'" target="_blank">开启VIP特权(300M单个文件上传)</a></td>\
					<td class="wd4"></td>\
				</tr>\
					';
		}
    */
     sHtml += '\
			     </tbody>\
		      </table>\
				</div>\
      </div>\
      ';
     fCommonUseBox(sHtml,"hideFlash");
  }else{
     var sErrorHtml = "";
     var sSelectHtml = "";
     var nErrorLength = 0;
     var nSelectSize  =0;   
     for(var i in this.upload_entry){
       oFile   = this.upload_entry[i];
       var sName = oFile.name;
       var sIndex = fGetFileIconIndex(sName); //这个函数我做了修改
       if(sName.len() > 28){
         sName = sName.left(24);
       }     
       if(oFile.error){
         nErrorLength++;
         sErrorHtml += '\
          <tr class="txt-disabd">\
						<td class="wd1 ckb"><input type="checkbox" disabled /></td>\
						<td class="wd2"><b class="ico ico-file ico-file-'+sIndex+'"></b></td>\
						<td class="wd3"><span class="flname">'+sName+'</span>&nbsp;<span class="txt-err">('+this.getError(oFile.error)+')</span></td>\
						<td class="wd4">'+ConvertFileSize(oFile.size)+'</td>\
				  </tr>\
        ';
       }else{
         sSelectHtml += '\
          <tr id="uploadTr'+oFile.id+'" class="chked">\
            <td class="wd1 ckb"><input type="checkbox" value="'+oFile.id+'" checked /></td>\
					  <td class="wd2"><b class="ico ico-file ico-file-'+sIndex+'"></b></td>\
						<td class="wd3"><span class="flname">'+sName+'</span></td>\
						<td class="wd4">'+ConvertFileSize(oFile.size)+'</td>\
					</tr>\
        ';
         nSelectSize += oFile.size;
       }
     }

     var sTitle ="";
     if(nSelectSize > this.getUsableLimit){
       sTitle ="本次上传文件超过网盘剩余容量，请做二次选择：";
     }else {
       sTitle ="您选择的部分文件由于以下原因，不能上传。";
     }
     
     var sHtml = '\
			<div id="divSecond" class="gSys-body select">\
				<div class="gSys-header">	\
					<b class="ico ico-warning" title="提示："></b>\
					<div class="ct">\
						<strong>'+sTitle+'</strong>\
					</div>\
				</div>\
				<table class="g-table-comm">\
					<thead>\
						<tr>\
							<th class="wd1 ckb"><input id="second_sel_all" type="checkbox" /></th>\
							<th class="wd3">文件名</th>\
							<th class="wd4">大小</th>\
						</tr>\
					</thead>\
				</table>\
				<div class="gSys-scroll">\
					<table  class="g-table-comm">\
						<tbody id="selectTBody">\
    ';
     sHtml += sErrorHtml;
     sHtml += sSelectHtml;
     sHtml += '\
			    </tbody>\
				</table>\
			</div>\
    ';

    var sErrorHtml = nErrorLength ? "(有"+nErrorLength+"个不能选择)" : "";
    if(nSelectSize < this.getUsableLimit){
       sHtml += '\
        <div id="sysAttachDiv" class="gSys-tips bg-succ txt-succ">\
					<b class="ico ico-success-small"></b>已选择'+ConvertFileSize(nSelectSize)+'，可以上传。'+sErrorHtml+'</span>\
				</div>\
      ';
    }else{
      sHtml += '\
        <div id="sysAttachDiv" class="gSys-tips bg-err txt-err">\
          <b class="ico ico-err-small"></b><span>上传文件超出网盘剩余容量'+ConvertFileSize(this.getUsableLimit)+'。'+sErrorHtml+'</span>\
			  </div>\
     ';
    }
    sHtml += '\
      </div>\
    ';
     
    fCommonUseBox(sHtml,"hideFlash");
    var oButton = $("btnMsgOk");
    
    //初始化二次选择
    function InitSecondSelect(){
      var odvSecond =$("divSecond");
      var ocbAll = $("second_sel_all");        
      function CheckItem(oItem,checked){
			  var oFile = oHash[oItem.value];
        var oTr = $("uploadTr"+oFile.id);
        if(checked){
          nSelectSize += oFile.size ;
          oFile.status = "select";  
          oTr.className = "chked";
        }else{
          nSelectSize -= oFile.size ;
          oFile.status = "";
          oTr.className = "";
        }
      };
      
      ocbAll.onclick =function(){
        var oTBody = $("selectTBody");
        var aInput = oTBody.getElementsByTagName("INPUT");
        var l = aInput.length;
        for(var i=0;i<l;i++ ){
          var oInput = aInput[i];
          if(oInput.type == "button")continue;
          if((oInput.checked !== this.checked) &&(oInput.disabled === false)){
            oInput.checked = this.checked;
            CheckItem(oInput,this.checked);
          }
        }
        var sBottomHtml = "";
        var oDiv = $("sysAttachDiv");
        if(nSelectSize <   this.getUsableLimit){
          oDiv.className = "gSys-tips bg-succ txt-succ";
          sBottomHtml = '<b class="ico ico-success-small"></b><span>已选择'+ConvertFileSize(nSelectSize)+'，可以上传</span>';                 
          oButton.disabled = false;
        }else{
          oDiv.className = "gSys-tips bg-err txt-err";
          sBottomHtml = '<b class="ico ico-err-small"></b><span>已选择'+ConvertFileSize(nSelectSize)+'，上传文件超出网盘剩余容量'+ConvertFileSize(this.getUsableLimit)+'</span>';
          oButton.disabled = true;
        }
        oDiv.innerHTML = sBottomHtml;
        return true;
      };
      
      var oTBody = $("selectTBody");
      var aInput = oTBody.getElementsByTagName("INPUT");
      var l = aInput.length;
      for(var i = 0;i<l;i++){
        var oInput = aInput[i];
        if(oInput.type == "button")continue;
        
        oInput.onclick = function (){
          CheckItem(this,this.checked);
          var sBottomHtml = "";
          var oDiv = $("sysAttachDiv");
          if(nSelectSize <   this.getUsableLimit){
            oDiv.className = "gSys-tips bg-succ txt-succ";
            sBottomHtml = '<b class="ico ico-success-small"></b><span>已选择'+ConvertFileSize(nSelectSize)+'，可以上传</span>';                 
            oButton.disabled = false;
          }else{
            oDiv.className = "gSys-tips bg-err txt-err";
            sBottomHtml = '<b class="ico ico-err-small"></b><span>已选择'+ConvertFileSize(nSelectSize)+'，上传文件超出网盘剩余容量'+ConvertFileSize(nSelectSize-nLeastLimit)+'</span>';
            oButton.disabled = true;
          }
          oDiv.innerHTML = sBottomHtml;
          return true;
        };
      }
    }
    InitSecondSelect();
    if(nSelectSize < this.getUsableLimit){
       oButton.disabled = false;
    }
    
    oButton.onclick = function _fCallBack(){
      for(var i in this.upload_entry){
        if(this.upload_entry[i].status == "select"){
           this.files_this_time.push(i);
        }
      }
      this.startUpload();
    };
  }
};

FileUploadBase.prototype.onCompleteFile = function(id){
  //UI更新
  var oFile = this.upload_entry[id];
  if(oFile.status === "complete"){
  	this.status.bytesLoaded += oFile.size; //更新上传统计数据
    	this.status.filesLoaded ++;
    	oFile.percent =100;
		oFile.bytesLoaded = oFile.size;
    this.updateFileItemUI(id);             //更新文件ITEM上传UI
    this.updateStaticsInfoUI();            //更新页面统计数据显示
  }else if(oFile.status === "fail"){
  	var oLi = $("liWpFile" + oFile.id);
		if(oLi){
    		oLi.className = "g-file g-file-err bg-err txt-err";
  		oLi.innerHTML = '\
         <b class="ico ico-att ico-att-err"></b>\
         <div class="flname"><strong>' + oFile.name + '</strong></div>\
         <div class="info">\
         <a href="javascript:void(0)" onclick="oFileUploader.deleteOneTask('+oFile.id+')" class="ext lnk">删除</a>上传出错:'+oFile.error+ '</div>';
  	}
  }
  if(this.files_this_time.length > 0){
    this.autoUpload(this.files_this_time.shift());
  }
};

FileUploadBase.prototype.onProgress = function(id){
  //更新各统计参数以及UI
	var oFile = this.upload_entry[id];
	if(oFile === undefined)return;
  oFile.percent = Math.floor((oFile.bytesLoaded / oFile.size) *100);
  this.updateFileItemUI(id);
};

FileUploadBase.prototype.updateFileItemUI = function(id){
	var oFile = this.upload_entry[id];
	if(oFile === undefined)return;
 	var oLi = $("liWpFile" + oFile.id);
  if(oFile.size == oFile.bytesLoaded){
  	oLi.getElementsByTagName("B")[0].className = "ico ico-att ico-att-succ"; // 上传完成修改图标
  	oLi.getElementsByTagName("A")[0].innerHTML = "";                            // 上传完成后去掉删除链接
  }

  var aSpan = oLi.getElementsByTagName("SPAN");
  aSpan[1].style.width = oFile.percent +"%";    // 上传比例图形
  aSpan[2].innerHTML = oFile.percent +"%";      // 上传比例
  var aState = oLi.getElementsByTagName("EM");
  aState[0].innerHTML = ConvertFileSize(parseInt(oFile.percent/100*oFile.size));   // 已上传大小
};

FileUploadBase.prototype.updateStaticsInfoUI =function(){
	var nBytesLoaded = this.status.bytesLoaded;
	var nBytesTotal  = this.status.total;
  var nTotalPercent = parseInt(nBytesLoaded/nBytesTotal*100);
	var oDivUploadAll = $("divUploadAll");
	var aSpan = oDivUploadAll.getElementsByTagName("SPAN");
	var aStrong = oDivUploadAll.getElementsByTagName("STRONG");
  
  //总上传文件大小
  aStrong[1].innerHTML = ConvertFileSize(nBytesTotal);
  //已上传文件大小
	aStrong[0].innerHTML = ConvertFileSize(nBytesLoaded);
  //百分比
  if(isNaN(nTotalPercent)){
  	nTotalPercent= 0;
  }else if(nTotalPercent >100){
  	nTotalPercent = 100;
  }
 	aSpan[1].style.width = nTotalPercent+"%";    // 上传比例图形
	aSpan[2].innerHTML = nTotalPercent+"%";    // 上传比例 
};

/*
邮箱插件上传对象
*/
var MailAssistUploader = function(obj){
  try{
    //由于邮箱插件太诡异，经常会出问题，为了安全起见，如果出现异常则转到flash上传
    obj.digest = window.netease.factory.create("ntes.blobdigest");
    obj.desktop = window.netease.factory.create('beta.desktop');
    obj.nfAjax = new NFAjaxInterface({sid: gSid,productName : "cloudstorage.mail.163"});	
  }catch(e){ 
    oFileUploader = new FlashUploader({
      url : gUploadUrl,
      policy :"http://nf.mail.163.com/netfolder/cp/", 
      name : "oFileUploader",
      menu : "网易邮箱网盘上传插件",
      field : "file000",
      variables: {"uid": GE.uid, //用户ID(从rpc获取) 测试用
                 "product": gDomainMisc[gFullDomain || "mail.163.com"].productName, //产品名
                 "parentId": gCurDirStats.id || 1020, //测试目录ID
                 "nameConflictPolicy": 0, //0（默认）：返回重名冲突错误；1：重命名新创建的文件；2：覆盖同名文件；其他：忽略并采用默认值。
                 "renamePolicy" : 1,
                 "type" : "flash"
                },
      filter: [
        {description:"所有文件 (*.*)",extension:"*.*"},
        {description:"图片文件 (*.jpg;*.gif;*.png)",extension:"*.jpg;*.gif;*.png"},
        {description:"文档文件 (*.pdf;*.doc;*.txt)",extension:"*.pdf;*.doc;*.txt"},
        {description:"网页文件 (*.mht;*.htm;*.html)",extension:"*.mht;*.htm;*.html"}
      ],
      auto : false,
      src  : gSwfUrl
	  });
    oFileUploader.init();
    return;
  }
  obj.blocksize = 1024 << 8; //块大小256K，根据大附件定的 
  FileUploadBase.call(this,obj);
};

MailAssistUploader.prototype = new FileUploadBase(null);

MailAssistUploader.prototype.init =function(){
  var oSpan = $("divUpload");
  var desktop = this.getObject().desktop;
  var me =this;
  oSpan.onclick = function(){
  	desktop.openFiles(function(files){
    		if(files.length <1)return;
    		me.filesSelCallback(files);
    });
  };  
};

MailAssistUploader.prototype.filesSelCallback = function(files){
  var nAllSize = 0;
  var bAllSucceed = true;                        //是否全部成功
  var bAllFail = true;                           //是否全部失败
  var nSingleLimit = this.getSingleLimit();      //单个文件限制
  var nUsableLimit = this.getUsableLimit();      //可用空间限制
  var nLeastLimit  = nSingleLimit < nUsableLimit ? nSingleLimit : nUsableLimit; // 二者最小限制
  for(i=0;i<files.length;i++){
    var oFile = {};
    oFile.name = files[i].name;
    oFile.blob = files[i].blob;
    oFile.id =i;
    oFile.size = files[i].blob ? files[i].blob.length : files[i].size;
    nAllSize += oFile.size;                
    if(oFile.size == 0){
       // 空文件
       oFile["error"] = "empty";
       oFile["status"] = "disable";
       bAllSucceed = false;
     }else if(oFile.size > nSingleLimit){
       // 单文件过大，超出本次能够上传的大小
       oFile["error"] = "limit";
       oFile["status"]="disable";
       bAllSucceed = false;
     }else if(nAllSize > nUsableLimit){ // 总文件过大
       bAllSucceed = false;  
       bAllFail = false;
       oFile["status"] = "prepare";
       oFile["error"] = "quota"   //文件大小超过网盘剩余容量总大小
     }else{
       // 队列选择状态	重要标记
       oFile["status"] = "prepare";
       bAllFail = false;
     }
     
    this.upload_entry[i] = oFile;
	}
  this.checkBeforeUpload(bAllSucceed,bAllFail);
};

MailAssistUploader.prototype.autoUpload = function(id){
    //顺序上传每一个文件
    var fid     = $("flash_upload_folder").value;      //上传文件ID
    var obj     = this.getObject();
    var digest  = obj.digest;
    var nfAjax  = obj.nfAjax;
    var desktop = obj.desktop;
    var blocksize = obj.blocksize;
    var oFile = this.upload_entry[id];
    if(oFile.status == "delete")return;
    oFile.status= "checking";
    
    var me = this;
    //更新UI
    var sId = oFile.id;
    var oLi = $("liWpFile" + sId);
    if(oLi){
      oLi.innerHTML = '\
      <b class="ico ico-att ico-att-upld"></b>\
        <div class="flname"><strong>'+oFile.name+'</strong></div>\
        <div class="progress">\
          <a href="javascript:void(0)" onclick="oFileUploader.deleteOneTask('+oFile.id+')" class="ext lnk">删除</a>\
          <span class="g-probar"><span style="width:0%"></span></span>\
          <span class="num">0%</span>\
        </div>\
        <div class="info txt-info">\
          <span class="upld">已上传：<em></em></span>\
        </div>\
    ';
    }

   digest && digest.CalculateMD5(oFile.blob,function(md5) {
     if(oFile.status == "deleted")return;
     oFile.status = "uploading";
     var newFileInfo = {
       parentId: fid,
       fileName: oFile.name,
       md5High: md5.substring(0, 16),
       md5Low: md5.substring(16),
       size: oFile.size  
     };
     nfAjax && nfAjax.CreateUploadFile(newFileInfo,function(result){
        if(result.type === "error"){
          if(oFile.status == "deleted")return;
          oFile.status= "fail"; //文件上传失败，更新UI
          oFile.error = "RPC代理接口返回错误"; //
          me.onCompleteFile(oFile.id);
        }else if(result.type === "OK"){
          if(result.data.type === 0){
           digest.CalculateCRC(oFile.blob,function(hash){	
            	var position = result.data.file.doc.position;
            	var url = result.data.token.docURL;
           	var sDashdash = "--";
          		var sBoundary = "----" + desktop.getUUID();
          		var sCrlf = "\r\n";
            	var id = result.data.file.id;
            	var block = function(position){
              	var remain = oFile.size -position;
           	  var bytes = remain > obj.blocksize ? obj.blocksize : remain;
              	return bytes;
              };
           	var progressData = function(offset,bytes){       
              	var sBlob;
							try{
                	sBlob = window.netease.factory.create('beta.blobbuilder');
                }catch(e){
                  if(oFile.status == "deleted")return;
            	  	oFile.status="fail";
                  oFile.error = "error occur in mailassist plugin";  //错误信息
            			me.onCompleteFile(oFile.id);                	
                	return;
                }
                sBlob.append(sDashdash + sBoundary + sCrlf);
                sBlob.append("Content-Disposition: form-data; name=\"dataDescriptor\"" + sCrlf);
                sBlob.append("Content-Type: text/plain" + sCrlf + sCrlf);
							sBlob.append(jQuery.toJSON({file:{offset: offset,length: bytes,checkSum:{type:1,value: hash}}}));
                sBlob.append(sCrlf);
                sBlob.append(sDashdash + sBoundary + sCrlf);
                sBlob.append("Content-Disposition: form-data; name=\"dataBlocks\"" + sCrlf);
                sBlob.append("Content-Type: application/octet-stream" + sCrlf + sCrlf);
							
                (function(){
                	//由于邮箱助手GearsBlob模块只能一次获取1024bytes,这个有待商榷
                	var start=offset;
                  var end = offset + bytes;
                  var len = end - start;
                  do{
                	  if(len > 1024){
                  	  sBlob.append(oFile.blob.getBytes(start,1024));
                      start +=1024;
                    }else{
                  	  sBlob.append(oFile.blob.getBytes(start,len));
                      start +=len; 
                    }
                    len =end - start;
                  }while(len > 0);
                })();

                sBlob.append(sCrlf);                
          			sBlob.append(sDashdash + sBoundary + sDashdash + sCrlf);
                
                var request;
                try{
                	request = window.netease.factory.create('beta.httprequest');
                }catch(e){
                  if(oFile.status == "deleted")return;
                	oFile.status="fail";
                  oFile.error = "error occur in mailassist plugin";  //错误信息
            			me.onCompleteFile(oFile.id);                	
                	return;
                }
                // 请求初始化
		         	request.open("POST",gDownloadURL + "/dfs/service?op=uploadFile" + "&uid=" + GE.uid + "&file=" +url,true);
              	request.setRequestHeader("content-type","multipart/form-data; boundary=" + sBoundary);
                
                request.onreadystatechange = function(){
                	if(request.readyState == 4){
                    var responseText = jQuery.evalJSON(request.responseText);
                    if(responseText.code == 200){
                    	if(responseText.result.doc.completed == true){
                       	nfAjax && nfAjax.CompleteFile(id,function(result){
                         	if(result.type =="OK"){
                             if(oFile.status == "deleted")return;
                           	oFile.status="complete";  //表示上传完成
                           	me.onCompleteFile(oFile.id);                          		
                           }else{
                             if(oFile.status == "deleted")return;
            								oFile.status="fail";
                           	oFile.error = "插件分块上传过程出错";
            								me.onCompleteFile(oFile.id);                           		
                           }
                         });
                      }else if(responseText.result.doc.completed == false){
                      		var position = responseText.result.doc.position;
                         oFile.bytesLoaded = position;
                         me.onProgress(oFile.id);
                      		progressData(position,block(position));
                         return;
                      }
                    }else{
                    	if(oFile.status == "deleted")return;
            					oFile.status="fail";
                    	oFile.error = "插件分块上传过程出错";
                    	me.onCompleteFile(oFile.id);
                    }
                 }
                };
                request.send(sBlob.getAsBlob());
              };
              if(oFile.status == "deleted"){
              	return;
              }else{
              	progressData(position,block(position));
              }
           });
          }else if(result.data.type === 3){
            if(oFile.status == "deleted")return;
            oFile.status="complete";  //表示上传完成
            me.onCompleteFile(oFile.id);
          }else{
            if(oFile.status == "deleted")return;
            oFile.status="fail";
            oFile.error = "RPC 代理接口返回出错";
            me.onCompleteFile(oFile.id);
          }
        }
     });
   });
};

MailAssistUploader.prototype.deleteAllTask =function(){
	// 总大小 总加载 累减
	var l = this.files_this_time.length;
  for(var i=0;i<l;i++){
  	var oFile = this.upload_entry[this.files_this_time[i]];
    oFile.status = "deleted";
	}
  this.upload_entry ={};
  this.files_this_time=[];	
  this.status.total = 0;
  this.status.bytesLoaded=0;
  this.status.filesLoaded=0;
};

MailAssistUploader.prototype.deleteOneTask =function(id){
  var oFile = this.upload_entry[id];
  if(!oFile)return;
  oFile.status = "deleted";
  var oLi = $("liWpFile" + id);
  if(oLi){
  	oLi.style.display = "none";	
  }

  this.status.total -=oFile.size;
  this.updateStaticsInfoUI();
	return true;	
};
/*
flash上传对象
*/
var FlashUploader = function(obj){
  this.policyLoaded = false;
  this.policyUrl = "http://nf.mail.163.com/netfolder/cp/"; //策略文件地址
  this.multi =true;                                            //允许多选
  FileUploadBase.call(this,obj);
};

FlashUploader.prototype = new FileUploadBase(null);

FlashUploader.prototype.init = function(){
  // Flash组件初始化参数
  var obj = this.getObject();
  var flash_src = obj.src;
  var divId = "absoluteDiv_Object";
  
	var sParam = this.multi ? "apiMulti=1&" : "";
	sParam += "apiListener="+obj.name+".dispatch";
	if(obj.host){
		sParam += "&apiHost="+this.host;
	}
	if(document.all){ 
     //if browser ie
		sHtml = '<object id="'+divId+'" width="100%" height="100%" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0"><param name="movie" value="'+flash_src+'" /><param name="flashVars" value="'+sParam+'" /><param name="quality" value="high" /><param name="wmode" value="transparent" /><param name="allowScriptAccess" value="always" /></object>';
	}else{     
     // other browser
		sHtml = '<embed id="'+divId+'" name="'+divId+'" src="'+flash_src+'" flashvars="'+sParam+'" quality="high" wmode="transparent" allowscriptaccess="always" width="100%" height="100%" type="application/x-shockwave-flash" />';
	}
  this.absoluteDiv = $("absoluteDiv");
  this.absoluteDiv.innerHTML = sHtml;
  this.plugin = $(divId);
  var oSpan = $("divUpload");
  // 背景对象	绝对定位其上方
  with(oSpan){
     absoluteDiv.style.width = offsetWidth + "px";
     absoluteDiv.style.height = offsetHeight + "px";
        // top left
     absoluteDiv.style.top = offsetTop  + "px";
     absoluteDiv.style.left = offsetLeft + "px";
  }
  var oLnkClose = $("lnkClose");
  var me =this;
  oLnkClose.onClose = function(){
  	me.deleteAllTask();
  };
};


FlashUploader.prototype.dispatch = function(oEvent){
	var sType = oEvent.type;
	var oFile = null;
  var plugin = this.plugin;
	// 文件事件
	if(oEvent.fileId){
		oFile = this.upload_entry[oEvent.fileId];
		// 空构造
		if(!oFile){
			oFile = {};
		}
	}
  
  switch(sType){
		// 组件初始化
		case "onReady":
    	var obj = this.getObject();
    	// 过滤列表
	  if(obj.filter && obj.filter.length){
			try{
				plugin.setFileTypes(obj.filter);
			}catch(e){}
	  }
	  // 菜单描述
	  if(obj.menu){
			try{
				plugin.setMenu(obj.menu);
			}catch(e){}
		}
		break;
		// 对话框选择
		case "onSelected":
			// oEvent.files 文件列表
			this.filesSelCallback(oEvent.files);
			break;
		// 对话框取消
		case "onCancel":
			//this.sendListener("onCancel",oEvent);
			break;
		// 上传开始
		case "onOpen":
			oFile["status"] = "uploading";
			oFile["bytesLoaded"] = oFile["percent"] = 0;
			break;
		// 上传进度	网络快文件小可能不轮询
		case "onProgress":
			//this.status["event"] = "progress";
			// [0-100] 上传进度
			oFile["bytesLoaded"] = oEvent.bytesLoaded;
			// oEvent.bytesTotal 与 oFile.size 等价
			//oFile["percent"] = Math.floor((oFile["bytesLoaded"]/oEvent.bytesTotal) * 100);
      	this.onProgress(oEvent.fileId);
			break;
		// 上传完成 网络快文件小也必定路过
		case "onComplete":
      break;
		// 服务端返回响应数据
		case "onCompleteData":
         oFile["status"] = "complete";//表示已经上传成功
			 	oFile["code"] = oEvent.code;
        	//由于服务器方面的原因，暂时302表示上传成功
         this.onCompleteFile(oEvent.fileId);
			break;
		// 上传错误
		case "onServerError":
		case "onHttpError":
		case "onIoError":
		case "onSecurityError":
			oFile["status"]  = "error";
			oFile["bytesLoaded"] = oFile["percent"] = 0;
			if(oEvent.error){
				oFile["error"] = oEvent.error;
         this.onCompleteFile(oFile.id);
			}else if(oEvent.code === 302){
				// HTTP 响应返回码 非200
         oFile["status"] ="done";//表示已经上传c成功
			 	oFile["code"] = oEvent.code;
         this.onCompleteFile(oFile.id); //由于服务器方面的原因，暂时302表示上传成功
      }else{
      	 oFile["code"] = oEvent.code;
        this.onCompleteFile(oFile.id);
      }
			break;
		default:
			// onMouseMove onMouseOver onMouseOut onMouseDown onMouseUp onMouseClick
			break;
	}
};

FlashUploader.prototype.filesSelCallback = function(files){
  var nAllSize = 0;
  var bAllSucceed = true;                        //是否全部成功
  var bAllFail = true;                           //是否全部失败
  var nSingleLimit = this.getSingleLimit();      //单个文件限制
  var nUsableLimit = this.getUsableLimit();      //可用空间限制
  var nLeastLimit  = nSingleLimit < nUsableLimit ? nSingleLimit : nUsableLimit; // 二者最小限制
  for(i=0;i<files.length;i++){
    var oFile = {};
    oFile.name = files[i].name;
    oFile.blob = files[i].blob;
    oFile.id =files[i].id ? files[i].id : i;
    oFile.size = files[i].blob ? files[i].blob.length : files[i].size;
    nAllSize += oFile.size;                
    if(oFile.size == 0){
       // 空文件
       oFile["error"] = "empty";
       oFile["status"] = "disable";
       bAllSucceed = false;
     }else if(oFile.size > nSingleLimit){
       // 单文件过大，超出本次能够上传的大小
       oFile["error"] = "limit";
       oFile["status"]="disable";
       bAllSucceed = false;
     }else if(nAllSize > nUsableLimit){ // 总文件过大
       bAllSucceed = false;  
       bAllFail = false;
       oFile["status"] = "prepare";
       oFile["error"] = "quota"   //文件大小超过网盘剩余容量总大小
     }else{
       // 队列选择状态	重要标记
       oFile["status"] = "prepare";
       bAllFail = false;
     }
     
    this.upload_entry[oFile.id] = oFile;
	}
  this.checkBeforeUpload(bAllSucceed,bAllFail);
};

FlashUploader.prototype.autoUpload = function(id){
    //顺序上传每一个文件
    var fid     = $("flash_upload_folder").value;      //上传文件ID
    var oFile = this.upload_entry[id];
    oFile.status= "checking";
    var me = this;

    var oLi = $("liWpFile" + id);
    if(oLi){
      oLi.innerHTML = '\
      <b class="ico ico-att ico-att-upld"></b>\
        <div class="flname"><strong>'+oFile.name+'</strong></div>\
        <div class="progress">\
          <a href="javascript:void(0)" onclick="oFileUploader.deleteOneTask('+oFile.id+')" class="ext lnk">删除</a>\
          <span class="g-probar"><span style="width:0%"></span></span>\
          <span class="num">0%</span>\
        </div>\
        <div class="info txt-info">\
          <span class="upld">已上传：<em></em></span>\
        </div>\
    ';
    }
    
	// 策略文件测试的时候去掉
	this.loadPolicy(this.policyUrl);
	try{
		// 开始单个文件上传
		oFile.status="uploading";
		var plugin = this.plugin;
		var obj = this.getObject();
		obj.variables.parentId = fid;
		plugin.startUpload(id,obj.url,obj.variables,obj.field);
	}catch(e){
		return false;
	}
	return true;     
}; 

FlashUploader.prototype.loadPolicy = function(url){
	if(this.policyLoaded === false){
		this.plugin.loadPolicy(url);
		this.policyLoaded = true;
  };
};
/*
终止所有上传任务
*/
FlashUploader.prototype.deleteAllTask = function(){
	// 总大小 总加载 累减
	var l = this.files_this_time.length;
  for(var i=0;i<l;i++){
    	try{
       this.plugin.removeFile(this.files_this_time[i]);
	  }catch(e){
		}
	}
  this.upload_entry ={};
  this.files_this_time=[];	
  this.status.total = 0;
  this.status.bytesLoaded=0;
  this.status.filesLoaded=0;
};
/*
终止某一上传任务
*/
FlashUploader.prototype.deleteOneTask = function(id){
	var me = this;
  try{ 
  	this.plugin.removeFile(id);
  }catch(e){
	}
  var oFile = this.upload_entry[id];
  oFile.status = "deleted";
  var oLi = $("liWpFile" + id);
  oLi.style.display = "none";

  this.status.total -=oFile.size;
  this.updateStaticsInfoUI();
	return true;
};



if(window.browser.ie){
	gSwfUrl += "?t="+(new Date()).valueOf(); // Maxthon等IE内核浏览器会导致附件不能二次上传
}else{
    // 非IE不能继承Coremail Session Cookie
    function _fGetCookie(sName){
        var sCookie = document.cookie;
        var sReturn = "";
        var sSearch = sName + "=";
        if(sCookie.length > 0){
          var sOffset = sCookie.indexOf(sSearch);
          if(sOffset != -1){
             sOffset += sSearch.length;
             var nEnd = sCookie.indexOf(";",sOffset);
             if(nEnd == -1){
                 nEnd = sCookie.length;
             }
             sReturn = sCookie.substring(sOffset,nEnd);
          }
        }
        return sReturn;
    }
    // Coremail Session Cookie 上传去掉coremail cookie，因为上传服务器暂时不需要
/*
    var sCoremail = _fGetCookie("Coremail");
    // 编码
    if(encodeURIComponent){
        sCoremail = encodeURIComponent(sCoremail);
    }else{
        sCoremail = escape(sCoremail);
    }
    gUploadUrl += '&Cookie.Coremail='+sCoremail;
*/
};

/*
优先使用插件上传
*/
var oFileUploader =null;
if(window.netease && window.netease.factory){
  //表示浏览器环境有插件存在
	oFileUploader = new MailAssistUploader({});
}else{
  oFileUploader = new FlashUploader({
    url : gUploadUrl,
    policy :"http://nf.mail.163.com/netfolder/cp/", 
    name : "oFileUploader",
    menu : "网易邮箱网盘上传插件",
    field : "file000",
    variables: {"uid": GE.uid, //用户ID(从rpc获取) 测试用
                 "product": gDomainMisc[gFullDomain || "mail.163.com"].productName, //产品名
                 "parentId": gCurDirStats.id || 1020, //测试目录ID
                 "nameConflictPolicy": 0, //0（默认）：返回重名冲突错误；1：重命名新创建的文件；2：覆盖同名文件；其他：忽略并采用默认值。
                 "renamePolicy" : 1,
                 "type" : "flash"
                },
    filter: [
        {description:"所有文件 (*.*)",extension:"*.*"},
        {description:"图片文件 (*.jpg;*.gif;*.png)",extension:"*.jpg;*.gif;*.png"},
        {description:"文档文件 (*.pdf;*.doc;*.txt)",extension:"*.pdf;*.doc;*.txt"},
        {description:"网页文件 (*.mht;*.htm;*.html)",extension:"*.mht;*.htm;*.html"}
    ],
    auto : false,
    src  : gSwfUrl
	});
}
oFileUploader.init(); //absoluteDiv 为flash控件附着DIV
GE.uploaderJs = true;