var PageNavigate = function(obj){
  this.Protocal ="http://";               //协议
  this.Domain ="nf.mail.163.com";        //域
  this.path = "/netfolder/web/list.do"; //路径
  this.ReqUrl = "http://nf.mail.163.com/netfolder/web/list.do";
  this.userName = GE.userName;                   
  this.sid =gSid || "EBkkkoMMYoHZOEcxvzMMxsRKtYYVdFub"; //会话ID 测试
  this.getFiles =1;       //表示除了请求目录数据还请求文件数据
  this.getShareInfo =1;   //是否返回文件共享数据，0-否，1-是
  this.nextStart ='-';    //查询起始
  this.pageIndex =0;      //页面索引
  this.pageSize  = gPageSize || 20;    //页面大小
  this.pagesCount=1;             //页面数，返回的页面数，-1返回所有页，0-返回一页，1(或>1)-返回指定页数
  this.orderBy=0;                //按某种方式排序。0-根据创建时间排序,1-根据过期时间排序，2-根据文件名排序，3-根据文件类型排序，不指定采用默认的方式 (请补全)
  this.desc =0;                  //0表示按升序，1表示降序
  this.dirId = obj.dirId || -1; //当前目录ID
  this.curPage = obj.curPage;    //当前页,从1开始
  this.totalPage = obj.totalPage;//总页面数          
  this.clientData =  obj.clientData;     ////showMode-显示模式
                                          //pathStack;//路径栈
};

PageNavigate.prototype.PostParam = function(){
	var clientdata = NETEASE_Url.encode(Base64.encode(jQuery.toJSON(this.clientData)));
  return {"uid" : this.userName,"id" : this.dirId,"getFiles" : this.getFiles,
          "getShareInfo" : this.getShareInfo,"nextStart" : this.nextStart,"pageIndex" : this.pageIndex,
          "pageSize" :  this.pageSize,"pagesCount" : this.pagesCount,"orderBy" : this.orderBy,
          "desc" : this.desc,"clientData" : clientdata,"sid" : gSid,"host" : gMasterHost,
          "style" : gStyle,"skin" : gSkin,"color" : gColor};
};

PageNavigate.prototype.PostRequest =function(){
	var oForm = document.createElement("FORM");
  oForm.action = this.ReqUrl;
  oForm.method = "POST";
  oForm.style.display="none";
  var params = this.PostParam();
  for(var param in params) {
		var opt=document.createElement("textarea");
		opt.name=param;
		opt.value=params[param];
		oForm.appendChild(opt);
	}
  document.body.appendChild(oForm);
	oForm.submit();
	return oForm;
};

PageNavigate.prototype.navigateToPre = function(){
  if(this.curPage === 1)return;
  this.pageIndex = this.curPage - 2;
  this.PostRequest();
};

PageNavigate.prototype.navigateToFirst = function(){
  if(this.curPage === 1)return;
  this.pageIndex = 0;
  this.PostRequest();
};

PageNavigate.prototype.navigateToLast = function(){
  if(this.curPage === this.totalPage)return;
  this.pageIndex = this.totalPage -1;
  this.PostRequest();
};

PageNavigate.prototype.navigateToNext = function(){
  if(this.curPage === this.totalPage)return;
  this.pageIndex = this.curPage;
  this.PostRequest();
};

PageNavigate.prototype.navigateBySort = function(sort,desc){
	if(sort<0 || sort >4 || desc <0 || desc >1)return;
  this.orderBy =sort;
  this.desc= desc;
  this.PostRequest(); 
};

PageNavigate.prototype.navigateToIndex = function(index){
  if((index <1) || index > this.totalPage)return;
  this.pageIndex = index -1;
  this.PostRequest();
};

PageNavigate.prototype.RefreshPage = function(){
  this.PostRequest();
};

PageNavigate.prototype.navigateToDir = function(did,name){
	this.dirId = did ? did : -1;
  if(name !==undefined){
  	this.clientData.pathStack.push({id: did,dirName: name});
  }
  this.PostRequest();
};

PageNavigate.prototype.navigateBack = function(){
	window.history.back(-1);
};

PageNavigate.prototype.navigateParentDir = function(){
  if(clientdata.pathStack && clientdata.pathStack.length >1){
    clientdata.pathStack.pop();
    var curDir = clientdata.pathStack[clientdata.pathStack.length -1];
    this.dirId = curDir.id || -1;
    this.PostRequest();
  }
};

/*
测试搜索
*/
PageNavigate.prototype.navigateToSearch = function(keyword){
	var oForm = document.createElement("FORM");
  oForm.action = "http://nf.mail.163.com/netfolder/web/search.do";
  oForm.method = "POST";
  oForm.style.display="none";
  var params = {
  	"uid" : this.userName,
     "key" : NETEASE_Url.encode(keyword),
     "dirId": -1
  };
  for(var param in params) {
		var opt=document.createElement("textarea");
		opt.name=param;
		opt.value=params[param];
		oForm.appendChild(opt);
	}
  document.body.appendChild(oForm);
	oForm.submit();
	return oForm;
};

PageNavigate.prototype.SetShowMode = function(mode){
	this.clientData.showMode = mode; //0-列表，1-图标
};

PageNavigate.prototype.pushPathStack = function(folderName){
  this.clientData.pathStack.push(folderName);
};

PageNavigate.prototype.popPathStack = function(){
	return this.clientData.pathStack.pop();
};

PageNavigate.prototype.setPathStack = function(aPath){
  if(aPath && (aPath.length >1)){
     this.clientData.pathStack = aPath;
  }
};

PageNavigate.prototype.setDirID = function(dirid){
  this.dirId = dirid;
};
PageNavigate.prototype.getDirInfoOnly = function(flag){
  if(flag === true){
    this.getFiles = 0;
  }else{
    this.getFiles =1;
  }
};
PageNavigate.prototype.getShareInfo = function(flag){
  if(flag === true){
    this.getShareInfo = 1;
  }else{
    this.getShareInfo =0;
  }
};

PageNavigate.prototype.setNextStart= function(index){
  this.nextStart =index;
};

var NFAjaxInterface = function(obj){
  this.protocal ="http://";               //协议
  this.path = "/netfolder/service";      //路径
	this.nfhost = "http://nf.mail.163.com";//obj.nfhost;测试
  this.username = GE.userName;//obj.username;测试
  this.sid =  obj.sid;
  this.domain = "163.com"; //域名,测试
  this.product = obj.productName; //产品名
  //其他的验证信息
  this.NFAjaxProxy = function(op, param, data,on_complete,async){
      var result;
      jQuery.ajax({
        cache: false,
        async : (async !== undefined) ? async : true,
        url: this.nfhost + "/netfolder/service?op=" + op + "&product=" +this.product+ "&uid=" + this.username + (param ? param : ""),
        beforeSend: function(xhr) {
        },
        type: (data !== undefined) ? "POST" : "GET",
        data: data,
        dataType: "json",
        success: function(data) {
          result = data;
        },
        complete: function() {
          on_complete && on_complete(result);
        }
      });
  };
};

NFAjaxInterface.prototype.DelFiles = function(aDocId,callback){
  this.NFAjaxProxy("delFiles",undefined,{id: aDocId},function(data){
    var result = {
      type: "error"
    }
    if (data && data.code) {
      if (data.code === 200) {
        result.type = "OK";
      }
      result.data =data;
    }
    CompleteCall(callback, result);
  });
};

 /**
 * 获取目录结构
 * @param   {aDocId:目录ID数组
 *           recur：false-不层级删除（如果存在子目录则会删除失败）,true-层级删除。
             emptycheck: false-允许删除非空目录,true-删除非空目录时返回错误。
             reserve: false-目录都可能会被删除,true-保留目录结构
             callback: 回调函数}
 * @return  {void}
 **/ 
NFAjaxInterface.prototype.DelFolders = function(aDocId,recur,emptycheck,reserve,callback){
	var postdata = {id : aDocId,recursive :recur,checkIfEmpty:emptycheck,reserveStructure : reserve};
  this.NFAjaxProxy("delDirs",undefined,postdata,function(data){
    var result = {
      type: "error"
    }
    if (data && data.code) {
      if (data.code === 200) {
        result.type = "OK";
      } 
      result.data=data;
    }
    CompleteCall(callback, result);  	
  });	
};

 /**
 * 文件共享
 * @param   {fid:文件ID
             callback: 回调函数}
 * @return  {void}
 **/ 
NFAjaxInterface.prototype.ShareFile = function(fid,callback){
	var postdata = {id : fid};
  this.NFAjaxProxy("shareFile",undefined,postdata,function(data){
    var result = {
      type: "error"
    }
    if (data && data.code) {
      if (data.code === 200) {
        result.type = "ok";
      } 
      result.data=data;
    }
    CompleteCall(callback, result);  	
  },false);	
};

 /**
 * 取消共享
 * @param   {fid:文件ID
             sharekey:共享下载码
             callback: 回调函数}
 * @return  {void}
 **/ 
NFAjaxInterface.prototype.RemoveFileShare = function(fid,shareId,callback){
	var postdata = {fileId : fid,id : shareId};
  this.NFAjaxProxy("cancelFileShare",undefined,postdata,function(data){
    var result = {
      type: "error"
    }
    if (data && data.code) {
      if (data.code === 200) {
        result.type = "OK";
      } 
      result.data=data;
    }
    CompleteCall(callback, result);  	
  },false);	
};

NFAjaxInterface.prototype.MoveItems = function(oDocId,DestDir,callback){
  var aFolderId  = oDocId.folder;
  var aFileId    = oDocId.file;
  var result = {
     file :{
       type : "error"
     },
     folder :{
       type : "error"
     }
  }
  if(aFileId.length >0){
     //移动文件
		var postdata = {id : aFileId,dirId :DestDir,nameConflictPolicy:0,renamePolicy : 0};
		this.NFAjaxProxy("moveFiles",undefined,postdata,BindThis(this,function(data){
    		if (data && data.code) {
     		if (data.code === 200) {
       		result.file.type = "OK";
      		}
      		result.file.data=data;
    		}
       postdata.id = aFolderId;
       if(aFolderId.length>0){
       	this.NFAjaxProxy("moveDirs",undefined,postdata,function(data){
    				if (data && data.code) {
     				if (data.code === 200) {
       				result.folder.type = "OK";
      				}
      				result.folder.data=data;
    				}
         CompleteCall(callback, result);
        });
       }else{
       	result.folder.type = "OK";
       	CompleteCall(callback, result);
       }
  	}));
  } else {
		result.file.type = "OK";
		this.NFAjaxProxy("moveDirs",undefined,postdata,function(data){
    		if (data && data.code) {
     		if (data.code === 200) {
       		result.folder.type = "OK";
      		}
      		result.folder.data=data;
    		}
       CompleteCall(callback, result);
     });
  }  
};

 /**
 * 更新文件信息
 * @param {folderid:有效目录ID
 *         update_info:{"parentId":69654392,
                        "fileName":"demo.txt",
                        "description":"Demo description"}
           callback: 回调函数}
 * @return {void}
 **/ 
NFAjaxInterface.prototype.UpdateFile = function(fileId,update_info,callback){
  var postdata = "id=" + fileId + "&file=" + jQuery.toJSON(update_info) + "&nameConflictPolicy=0&renamePolicy=1";
  this.NFAjaxProxy("updateFile",undefined,postdata,function(data){
    var result = {
      type: "error"
    }
    if (data && data.code) {
      if (data.code === 200) {
        result.type = "OK";
      }
      result.data =data;
    }
    CompleteCall(callback, result);
  });
};
 /**
 * 更新目录信息
 * @param {folderid:有效目录ID
 *         update_info:{dirName-目录名
                        description-描述}
           callback: 回调函数}
 * @return {void}
 **/ 
NFAjaxInterface.prototype.UpdateFolder = function(folderid,update_info,callback){
  var postdata = "id=" + folderid + "&dir=" + jQuery.toJSON(update_info) + "&nameConflictPolicy=0&renamePolicy=1"
  this.NFAjaxProxy("updateDir",undefined,postdata,function(data){
    var result = {
      type: "error"
    }
    if (data && data.code) {
      if (data.code === 200) {
        result.type = "OK";
      }
      result.data = data;
    }
    CompleteCall(callback, result);
  });		
};


 /**
 * 预览文件
 * @param {folderid:有效目录ID
 *         update_info:{dirName-目录名
                        description-描述}
           callback: 回调函数}
 * @return {void}
 **/ 
NFAjaxInterface.prototype.PreviewFile = function(id,callback){
	this.GetFileCert(id,callback);
};

 /**
 * 获取目录结构
 * @param {root_id:根目录ID, -1-针对当前目录，>=0 有效的目录ID
 *         recursive：递归层数,0-仅返回当前目录,n(n>1)-层级操作层数。
           full_info: 0-仅返回目录URI,1-返回完整目录信息
           fcnt_stat: 0-不统计文件总大小和数量,1-统计文件总大小和数量
           callback: 回调函数}
 * @return {void}
 **/ 
NFAjaxInterface.prototype.GetDirStructure = function(root_id,recursive,full_info,fcnt_stat,callback){
  if((recursive === undefined)||(full_info === undefined)||(fcnt_stat === undefined))return;
  var param = "&id="+root_id+"&recursive="+recursive+"&returnInfo="+full_info+"&countFiles="+fcnt_stat;
  this.NFAjaxProxy("getDirStructure",param,undefined,function(data){
	  var result = {
  	  type: "error"
    }
    if (data && data.code) {
      if (data.code === 200) {
        result.type = "OK";
      }
      result.data = data;
    }
    CompleteCall(callback, result);
  });
};

 /**
 * 创建文件夹
 * @param {pid:父目录ID
           name: 目录名
           memo: 描述信息
           callback: 回调函数}
 * @return {void}
 **/ 
NFAjaxInterface.prototype.CreateDir = function(pid,name,callback){
  var postdata= {
  	dir : jQuery.toJSON({dirName : name,parentId : pid,description : ''}),
		nameConflictPolicy : 0,
		renamePolicy : 1
  };
  this.NFAjaxProxy("createDir",undefined,postdata,function(data){
	  var result = {
  	  type: "error",
     	desc : ""
    }
    if (data && data.code) {
      if (data.code === 200) {
        result.type = "OK";
      }
      result.data = data;
    }
    result.desc = GE.commonErrorCode  && GE.commonErrorCode[data.code].description;
    CompleteCall(callback, result);
  });
};

 /**
 * 创建上传文件
 * @return {void}
 **/ 
NFAjaxInterface.prototype.CreateUploadFile = function(fileInfo,callback){
  var postdata = "uid=" +this.username + "&file=" + jQuery.toJSON(fileInfo) + "&nameConflictPolicy=1&renamePolicy=1";
  this.NFAjaxProxy("createFile",undefined,postdata,function(data){
	  var result = {
  	  type: "error"
    }
    if (data && data.code) {
      if (data.code === 200) {
        result.type = "OK";
      }
      result.data = data.result;
    }
    CompleteCall(callback, result);
  });
};

NFAjaxInterface.prototype.CompleteFile = function(id,callback){
  var postdata = "uid=" +this.username + "&id=" + id + "&nameConflictPolicy=1&renamePolicy=1";
  this.NFAjaxProxy("completeFile",undefined,postdata,function(data){
	  var result = {
  	  type: "error"
    }
    if (data && data.code) {
      if (data.code === 200) {
        result.type = "OK";
      }
      result.data = data.result;
    }
    CompleteCall(callback, result);
  });
};
/**
 * 获取用户文件操作凭证
 * @param  {id:文件ID,callback:回调}
 * @return {void}
 * 返回结构
 * {"code":200,
    "result":{"token":{
    "docURL":"xOu1W66olaCC4WHdSTX0G_E5bpAzb17_lJSeKEivnQ3h2mEnrd_lAJRLZPL",
    "context":":"UICoGkzb17_lJSeKEivnQ3h2mEnrd_lAJRq-_waBpSLZPLPOBq_xAUUhyjasSl7nb"
    }
**/
NFAjaxInterface.prototype.GetFileCert = function(id,callback,async){
	var postdata = {
  	uid :this.username,   //完整的邮箱帐号名。必须指定
		id : id         //有效的文件ID。	必须指定
    //owner : this.uid,//完整的邮箱帐号名。	非拥有者下载需指定
    //offset : 0,      //分块下载需指定。
    //length : 0,      //块大小,分块下载需指定。
    //shareKey : 0     //共享下载码	 否		最长32个有效ASCⅡ字符。	非拥有者下载需指定。
  };
  this.NFAjaxProxy("getDownloadCert",undefined,postdata,function(data){
	  var result = {
  	  type: "error",
     	desc : ""
    }
    	if (data && data.code) {
  	  if (data.code === 200) {
    		  result.type ="OK";
         result.id  = id;
         result.docURL = data.result.token.docURL;
    		  CompleteCall(callback, result);
      }else{
         result.desc = GE.commonErrorCode  && GE.commonErrorCode[data.code].description;
    		  CompleteCall(callback, result);
      }    
    }
  },async);
};

/**
 * 批量获取用户文件操作凭证
 * @param  {id:文件ID,callback:回调}
 * @return {void}
 * 返回结构
 * {"code":200,
    "result":{"cert":[{
    "id": 556472
    "token":{
    "docURL":"xOu1W66olaCC4WHdSTX0G_E5bpAzb17_lJSeKEivnQ3h2mEnrd_lAJRLZPL",
    "context":":"UICoGkzb17_lJSeKEivnQ3h2mEnrd_lAJRq-_waBpSLZPLPOBq_xAUUhyjasSl7nb"
    }]
   }
**/
NFAjaxInterface.prototype.GetFileCertSet = function(aId,callback,async){
	var postdata = {
  	uid :this.username,   //完整的邮箱帐号名。必须指定
		id : aId         //有效的文件ID。	必须指定
    //owner : this.uid,//完整的邮箱帐号名。	非拥有者下载需指定
    //offset : 0,      //分块下载需指定。
    //length : 0,      //块大小,分块下载需指定。
    //shareKey : 0     //共享下载码	 否		最长32个有效ASCⅡ字符。	非拥有者下载需指定。
  };
  this.NFAjaxProxy("getDownloadCertSet",undefined,postdata,function(data){
	  var result = {
  	  type: "error",
     	desc : ""
    }
    	if (data && data.code) {
  	  if (data.code === 200) {
      		result.type="OK";
         result.certs=data.result.cert;
    		  CompleteCall(callback, result);
      }else{
      	  result.desc = GE.commonErrorCode  && GE.commonErrorCode[data.code].description;
    		  CompleteCall(callback, result);
      }    
    }
  },async);
};

/**
 * 获取misc.js文件
 * @param  {id:文件ID,callback:回调}
 * @return {void}
**/
NFAjaxInterface.prototype.GetMiscJs = function(url,callback){
	  var result = {
  	  type: "error"
    }
  jQuery.get(url,[],function(data,textStatus){
    if(textStatus === "success"){
    		result.type ="OK";
			result.data = data;
    }
    CompleteCall(callback, result);
  },"javascript");
};

/**
 * 批量共享文件
 * @param  {aId:文件id数组,callback:回调}
 * @return {void}
 * 返回结构
 * {"code":200,
    "result":{"token":{
    "docURL":"xOu1W66olaCC4WHdSTX0G_E5bpAzb17_lJSeKEivnQ3h2mEnrd_lAJRLZPL",
    "context":":"UICoGkzb17_lJSeKEivnQ3h2mEnrd_lAJRq-_waBpSLZPLPOBq_xAUUhyjasSl7nb"
    }
**/
NFAjaxInterface.prototype.ShareFileSet = function(aId,callback){
	var postdata = {id : aId};
  this.NFAjaxProxy("shareFileSet",undefined,postdata,function(data){
	  var result = {
  	  type: "error"
    }
    if (data && data.code) {
      if (data.code === 200) {
        result.type = "OK";
      } 
      result.data=data;
    }
    CompleteCall(callback, result);  	
  },false);
};

/**
 * 下载文件
 * @param  {void}
 * @return {void}
 **/ 
NFAjaxInterface.prototype.DownLoadFile = function(id,callback){
	this.GetFileCert(id,callback);
};

/**
 * 打包下载文件
 * @param  {void}
 * @return {void}
 **/ 
NFAjaxInterface.prototype.ZipDownLoadItems = function(aFileId,aFolderId,callback){
	var postdata = {
  	uid    : this.username,   //完整的邮箱帐号名。必须指定
		dirId  : aFolderId,  //有效的文件夹ID数组。	必须指定
		fileId : aFileId     //有效的文件ID数据。必须制定
    //parentId :         周欣然说这个参数可能要
    //owner : this.uid,//完整的邮箱帐号名。	非拥有者下载需指定
    //offset : 0,      //分块下载需指定。
    //length : 0,      //块大小,分块下载需指定。
    //shareKey : 0     //共享下载码	 否		最长32个有效ASCⅡ字符。	非拥有者下载需指定。
  };
  /*返回结构
  * {"code":200,
    "result":{"token":{
    "docURL":"xOu1W66olaCC4WHdSTX0G_E5bpAzb17_lJSeKEivnQ3h2mEnrd_lAJRLZPL",
    "context":":"UICoGkzb17_lJSeKEivnQ3h2mEnrd_lAJRq-_waBpSLZPLPOBq_xAUUhyjasSl7nb"
    }
  */
  this.NFAjaxProxy("getZipDownloadCert",undefined,postdata,BindThis(this,function(data){
	  var result = {
  	  type: "error",
     	desc : ""
    }
    if (data && data.code) {
  	  if (data.code === 200) {
      		result.type = "OK";
         result.docURL = data.result.token.docURL;
         CompleteCall(callback, result);
      }else{
      	  result.desc = GE.commonErrorCode  && GE.commonErrorCode[data.code].description;
    		  CompleteCall(callback, result);
      } 
    }
  }));
};

/**
 * 获取用户信息
 * @param  {userName : 完整的邮箱帐号名}
 * @return {void}
 **/
NFAjaxInterface.prototype.GetUserInfo = function(userName,callback){
  var param="&uid=" + userName;
  this.NFAjaxProxy("getUser",param,undefined,BindThis(this,function(data){
	  var result = {
  	  type: "error",
     	desc : ""
    }
    if (data && data.code) {
  	  if (data.code === 200) {
      		result.type = "OK";
         result.data = data;
         CompleteCall(callback, result);
      }else{
      	  result.desc = GE.commonErrorCode  && GE.commonErrorCode[data.code].description;
    		  CompleteCall(callback, result);
      } 
    }
  }));
};

var DocSet = function(dirid) {
  this.folders  = {};
  this.files    = {};
  var selDirs  = {};
  var selFiles = {};
  this.dirid   = dirid;
  this.list_mode_dom = undefined;
  this.pic_mode_dom  = undefined;
  var sortList = {};
  var sort_type = "dateAsc"; //"dateDesc" "sizeAsc" "sizeDesc" "filetype"
  var filecnt  =0;
  var foldercnt=0;
  var me = this;
  var fWpIsUnUploadedFile = function(mid){
	  return false;
  };

  var SetSort = function(sort){
  	if(sort_type === sort){
    		if(sortList[sort] === undefined){
       	sortList[sort] = [];
        	for(var id in me.folders){
         	sortList[sort].push(id); 
         }
         for(var id in me.files){
         	sortList[sort].push(id);
         }
			}
     return;
    	}

     if(sortList[sort_type] === undefined){
     	//请求排序ID，dirid
     }
     sort_type = sort;
  };

	me.RenderList = function(dom_root,sort){
  	SetSort(sort);
		var list = sortList[sort_type];
     for(var j=0;j<list.length;j++){
     	this.folders[list[j]] ? dom_root.append(me.folders[list[j]].list_mode_dom) : dom_root.append(me.files[list[j]].list_mode_dom);
     }
  };
  
  me.RenderPicList = function(dom_root,sort){
    	SetSort(sort);
		var list = sortList[sort_type];
     for(var j=0;j<list.length;j++){
     	this.folders[list[j]] ? dom_root.append(me.folders[list[j]].pic_mode_dom) : dom_root.append(me.files[list[j]].pic_mode_dom);
     }    
  };
  me.SelectAllItems = function(checked){
  	for(var i in this.folders){
     	selDirs[i] = checked;
     }
     for(var i in this.files){
     	selFiles[i] =checked;
     }
  };
  me.OnSelFolder =function(id,checked){
  	selDirs[id] = checked;
  };
  
  me.OnSelFile = function(id,checked){
  	selFiles[id] = checked;
  };
  me.OnSelItem = function(id,checked){
  	for(var i in this.folders){
      if(i == id){
      		selDirs[i] = checked;
				return;          
      }
     }
     for(var i in this.files){
     	if(i == id){
      		selFiles[i] =checked;
				return;          
      }
     }		  
  };

  me.GetCount = function(){
    return count;
  };
  
  me.JifenToDltimes = function(fid,ntime){
  };

  me.GetFileFromId = function(id){
  	return me.files[id];
  };
	me.GetFolderFromId = function(id){
		return me.folders[id];  
  };

  me.AddFolders = function(afolders){
  	if(!afolders || !afolders[0])return;
		for(var j=0;j<afolders.length;j++){
    		if(me.folders[afolders[j].id] !== undefined)continue;
			me.folders[afolders[j].id] = afolders[j];
			foldercnt++;
    }
  };

  me.AddFiles = function(afiles){
  	if(!afiles || !afiles[0])return;
		for(var j=0;j<afiles.length;j++){
			if(me.files[afiles[j].id] !== undefined)continue;
			me.files[afiles[j].id] = afiles[j];
			filecnt++;
     }
  };

  me.RenameFile = function(id,name,memo){
		this.files[id] && (this.files[id].fileName = name);
		this.files[id] && (this.files[id].description = memo);   
  };

  me.RenameFolder = function(id,name,memo){
  	this.folders[id] && (this.folders[id].dirName = name);
		this.folders[id] && (this.folders[id].description = memo);    
  };

  me.GetAllCheckItems = function(){
  	var aFolder = [];
		var aFile = [];
     for(var i in selDirs){
     	if(selDirs[i] === true)aFolder.push(i);
     }
     for(var i in selFiles){
     	if(selFiles[i] === true)aFile.push(i)
     }
     return {folder: aFolder,file:aFile};
  };

  me.GetAllItemsCnt = function(){
    return filecnt + foldercnt;
  };
  
  me.GetCheckItemsCnt = function(){
     var cnt =0;
     for(var i in selDirs){
     	if(selDirs[i] === true)cnt++;
     }
     for(var i in selFiles){
     	if(selFiles[i] === true)cnt++;
     }
     return cnt;
  };
  
  me.GetPicFileSet = function(){
  	var aPicFile = [];
    for(var i in this.files){
    		if(fWpIsPic(this.files[i].fileName)){
       	aPicFile.push(i);
       }
    }
  };
  
  me.ZipDownload = function(){
    var oCheck = me.GetAllCheckItems();
	  for(var i = 0; i < oCheck.file.length; i++){
		  if(fWpIsUnUploadedFile(oCheck.file[i])){
			  fCommonMsgBox({title:"下载文件出错",content:"你选择了未上传完成的文件，不能下载。"});
			  return;
		  }
	  }
	  if(oCheck.folder.length == 0 && oCheck.file.length == 1){
		  location.href = gDownloadUrl + "&mid="+ oCheck.file[0];
	  }else if(oCheck.folder.length > 0 || oCheck.file.length > 0){
		  fWpPackDown(oCheck);
	  }else {
		  fCommonMsgBox({title:"下载文件出错",content:"请选择你需要下载的文件或文件夹。"});
	  }
  };

  me.Remove = function(docid) {
    if (me.docs[docid] === undefined) {
      return;
    }
    
    if(doc.type === "file"){
    		files.Remove(doc.id);
    }else{
    		folders.Remove(doc.id);
    }    
    delete me.docs[docid];
    me.count--;
  };

  me.Edit = function(doc) {
    if (me.docs[doc.id] === undefined) {
      return;
    }
    me.docs[doc.id] = doc;
  };

  me.Reset = function() {
    me.docs = {};
    folders.Reset();
    files.Reset();
    me.count = 0;
  };
};