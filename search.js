(function($) {
  $(window).load(function () {
    GE.userName		= gUserName || "mailfortest01@163.com";
    GE.uid = undefined;
    GE.sid		= gSid || "EBkkkoMMYoHZOEcxvzMMxsRKtYYVdFub";
    GE.domain	= gMailDomain;
    GE.fullDomain= gFullDomain || "mail.163.com";//兼容本地测试
    GE.host = gMasterHost;                         //webmail主机
    GE.ver = gVer;                                 //webmail版本

    GE.shareAccess= true;
    GE.picModeInit = false;

    GE.uploadLimitM = 100; //单次上传限制M
    GE.sendLimitM	  = gUploadLimitM || 50;           //上传文件大小限制M
    GE.curPage = (gNFConfig.curPageIndex || 0) +1;   //当前页索引,从1开始,测试
    GE.pageSize = gNFConfig.pageSize || 5; //页面大小
    GE.totalPage = gNFConfig.totalPages || 5;  //总页数
    GE.usedCapacity = gUsedCapacity || 100;    //兼容本地测试
    GE.usableCapcacity =gUsableCapacity || 0;   //兼容本地测试

    GE.orderBy = gNFConfig.order || 0;         //页面排序类型
    GE.desc = (gNFConfig.desc === true) ? 1 :0;            //页面排序方式
    GE.capcity = gCapcity || 100000;
    GE.downloadURL = gDownloadURL || "http://cloud.mail.163.com/dfs/service/";
    GE.zipDownloadURL = gZipDownloadURL || "http://cloud.mail.163.com/archive?op=downloadArchive"; //打包下载地址
    GE.previewURL = gPreviewURL || "http://cloud.mail.163.com/fs/preview";//兼容测试
    GE.formUploadURL = gFormUploadURL || "http://cloud.mail.163.com/fs/preview"; //兼容测试
    GE.uploadCallbackUrl =gUploadCallbackUrl || "http://nf.mail.163.com/netfolder/uploadcallback.html";//测试用
    var rootDirId = -1;
    var curDirId =-1;  //gCurDirStats.id || gCurDirId;
    var DocSets ={};     //{id,DocSet}
    window.fid = curDirId;
    (function(){
    	  var plaintext;
      if((gRawClientData == undefined) || !(plaintext=Base64.decode(NETEASE_Url.decode(gRawClientData)))){
    		clientdata ={};
    		}else{
    			try{
       		clientdata = jQuery.secureEvalJSON(plaintext); 
       	}catch(e){
       		clientdata ={};
      	 	}	
    		}
       if(!clientdata.pathStack ||(clientdata.pathStack.length ==0)){
       	clientdata.pathStack =[];
         clientdata.pathStack.push({id : curDirId,dirName:"网盘"});
       }
       GE.showMode = clientdata.showMode || 0; //页面显示模式,0(默认)-列表显示，1-图标显示 
    })();

    var pageNav = new PageNavigate({curPage : GE.curPage,totalPage : GE.totalPage,dirId: curDirId,clientData : clientdata});
    var nfAjax =  new NFAjaxInterface({sid: GE.sid,productName : gDomainMisc[GE.fullDomain].productName});

    var UserInfo = AsyncCall(function(get){
       nfAjax.GetUserInfo(GE.userName,function(result){
      		if(result.type === "error"){
           get("error");
         }else if(result.type === "OK"){
         	get(result.data.result.user);
         }
       });
    });
    
    UserInfo(function(user){
      GE.uid = user.id;
    });
    /*
    *异步获取目录结构数据
    */ 
    var DirStructureData = AsyncCall(function(get){
       nfAjax.GetDirStructure(-1,10,1,0,function(result){
       	window.fid = 1020; //默认目录为当前目录,兼容测试
      		if((result===undefined) || (result.data ===undefined)||(result.data.code !== 200)){
           get("error");
         }else{
           var oDir = result.data.result.dir;
         	get(oDir);
         }
       });
    });
    /*
    *异步生成目录结构HTML代码
    */ 
    window.DirStructureHtml = AsyncCall(function(get){
    		DirStructureData(function(oDir){
       	if(oDir === "error"){
        		get("获取目录数据失败");
        	}else{
         	var sHtml	= '<ul class="g-tree">' +fWpCreateFromJson(oDir) + '</ul>';
           get(sHtml,1020);//测试目录ID
         }
       })
     });

    setTimeout(function(){window.DirStructureHtml(function(result){});}, 500);
     
    /*
    * 直接跳转到某一目录
    * @param   {destId: 目的目录ID}
    * @return  {void}
    **/
    function SwitchDirStraight(destId){
      DirStructureData(function(dirs){
        var stop = false;
        var paths=[];
        function DFS(oDir,selDirId){
          var dirname = oDir.dirName;
          var did = oDir.id;
          var oChildren = oDir.subdirs;
          paths.push({id:did,dirName:dirname});
          if(did == destId){
            stop =true;
            return;
          }
          
          var nLen=0;
          if(oChildren && oChildren.length){
            nLen = oChildren.length;
          }
          
          for(var i=0;(i<nLen)&&(!stop);i++){
            var oChild = oChildren[i];
            DFS(oChild,selDirId);
            if(!stop)paths.pop();
          }
          
        };
        DFS(dirs,window.fid);
        if(!stop)return;
        if(paths[0] && (paths[0].dirName === "root")){
          paths[0].dirName = "网盘";
        }
        pageNav && pageNav.setPathStack(paths);
        pageNav && pageNav.navigateToDir(destId);//window.fid 为选择的目录ID
      });
    };     
     /*
    获取搜索文件的路径
    */
    var GetFilePath = function(parentId,callback){
    		var destId = parentId;
    		DirStructureData(function(dirs){
        var stop = false;
        var paths=[];
        function DFS(oDir,selDirId){
          var dirname = oDir.dirName;
          var did = oDir.id;
          var oChildren = oDir.subdirs;
          paths.push(dirname);
          if(did == destId){
            stop =true;
            return;
          }
          
          var nLen=0;
          if(oChildren && oChildren.length){
            nLen = oChildren.length;
          }
          
          for(var i=0;(i<nLen)&&(!stop);i++){
            var oChild = oChildren[i];
            DFS(oChild,selDirId);
            if(!stop)paths.pop();
          }
          
        };
        DFS(dirs,parentId);
        if(!stop)return;
        if(paths[0] && (paths[0] === "root")){
          paths[0] = "网盘";
        }
        callback(paths);
      });
    };
    /*
    *异步初始化文档数据
    */
    var InitDocSetAsyn = AsyncCall(function(get){
      DocSets[curDirId] = new DocSet(curDirId);
      DocSets[curDirId].AddFolders(gFolder);
      DocSets[curDirId].AddFiles(gFile);
      get(true);
    });
    
    var RenderListAsyn = AsyncCall(function(get){
		  InitDocSetAsyn(function(init){
         if(!init)return;
       	$("#listAllCheck").click(function(){
         	var nodes= $(".list-item-ckb");       
         	if($(this).is(":checked")) {
          	nodes.attr("checked", true);
          	nodes.parent().parent().addClass("chked");
          	DocSets[curDirId].SelectAllItems(true);
        	}else{
          nodes.attr("checked", false);
          nodes.parent().parent().removeClass("chked");
          DocSets[curDirId].SelectAllItems(false);
        }
       });
      var files = DocSets[curDirId].files;
      for(var id in files){
        if(id !==undefined){
          files[id].list_mode_dom =  RenderFileItem(files[id]);
        }				
      }
      var dom_root = $(".content-table");
      DocSets[curDirId] && DocSets[curDirId].RenderList(dom_root,"dateAsc");
      
      $(".item_path",dom_root).each(function(i){
         GetFilePath($(this).attr("fid"),BindThis(this,function(paths){
           var temp =  paths.join('\/');	
          	$(this).html(temp);
         }));
      });

      $(".item_path",dom_root).click(function(){
      	 var dirid =  $(this).attr("fid");
        SwitchDirStraight(dirid);
      });

      var cnt = dom_root.children().length;

      if((cnt <1) && (clientdata.pathStack.length >1)){
			 $(".back").show();
        $(".listempty").show();
      }else if((cnt <1) && (clientdata.pathStack.length<2)){
        $(".back").hide();
        $(".listempty").show();
      }else if(clientdata.pathStack.length >1){
        $(".back").show();
        $(".listempty").hide();
      }else{
        $(".back").hide();
        $(".listempty").hide();      	
      }
      //0-根据创建时间排序,1-根据过期时间排序，2-根据文件名排序，3-根据文件类型排序,4-根据大小
      if(GE.orderBy ===2){
      	 var node = $("#colicon_filename");
       if(GE.desc === 0){
       	node.removeClass("ico-list-up").addClass("ico-list-down");
        	node.parent().val(1);
       }else{
       	node.removeClass("ico-list-down").addClass("ico-list-up");
         node.parent().val(0);       
       }
      	node.show();
      }else if(GE.orderBy ===0){
      	  var node = $("#colicon_time");
        if(GE.desc === 0){
         node.removeClass("ico-list-down").addClass("ico-list-up");
        	node.parent().val(1);
        }else{
       	node.removeClass("ico-list-up").addClass("ico-list-down");
         node.parent().val(0);
        }
        node.show();
      }else if(GE.orderBy === 4){
      		var node = $("#colicon_size");
        	if(GE.desc === 0){
       		node.removeClass("ico-list-down").addClass("ico-list-up");
        		node.parent().val(1);
        	}else{
       		node.removeClass("ico-list-up").addClass("ico-list-down");
         	node.parent().val(0);
        	}
        	node.show();
      }

      $("#header_filename").click(function(){
      		var desc = $(this).val();
         if(desc.length ==0){
         	desc = 1;
         }
      		pageNav && pageNav.navigateBySort(2,desc);
      });
      
      $("#header_size").click(function(){
         var desc = $(this).val();
         if(desc.length ==0){
         	desc = 1;
         }
      		pageNav && pageNav.navigateBySort(4,desc);
      });
      
      $("#header_time").click(function(){
         var desc = $(this).val();
         if(desc.length ==0){
         	desc = 1;
         }      
      		pageNav && pageNav.navigateBySort(0,desc);
      });
      
      $(".back-parent").click(function(){
      		pageNav && pageNav.navigateParentDir();
      });
      get(true);
       }); 
    });
    
    var RenderPicAsyn = AsyncCall(function(get){
			InitDocSetAsyn(function(init){
       	if(!init)return;
         $("#picAllCheck").click(function(){
      	  var nodes= $(".ipt-c");       
         if($(this).is(":checked")) {
         	nodes.attr("checked", true);
         	nodes.parent().parent().css("backgroundColor","#FFFFCA");
         	DocSets[curDirId].SelectAllItems(true);
        	}else{
         	nodes.attr("checked", false);
         	nodes.parent().parent().css("backgroundColor","transparent");
         	DocSets[curDirId].SelectAllItems(false);
         }
      	});
      var cnt=0;
      var files = DocSets[curDirId].files;
      for(var id in files){
        if((id !==undefined) &&(files[id].pic_mode_dom === undefined)){
          cnt ++;
          files[id].pic_mode_dom =  RenderPicFileItem(files[id]);
        }				
      }
      var dom_root =$("#pic_Body");
      DocSets[curDirId] && DocSets[curDirId].RenderPicList(dom_root,"dateAsc");
      $(".file_pic",dom_root).each(function(i){
				GetFileThumb($(this).attr("iid"),$(this).attr("fname"),BindThis(this,function(fid,fileicon){ 
	  		$(this).html(fileicon);
        }));
      });
      
      if((cnt <1) && (clientdata.pathStack.length >1)){
			 $(".back").show();
        $(".listempty").show();
      }else if((cnt <1) && (clientdata.pathStack.length<2)){
        $(".back").hide();
        $(".listempty").show();
      }else if(clientdata.pathStack.length >1){
        $(".back").show();
        $(".listempty").hide();
      }else{
        $(".back").hide();
        $(".listempty").hide();      	
      }

      $(".back-parent").click(function(){
				pageNav && pageNav.navigateParentDir();      
      });
      get(true);
       });
    });
     
    /*
    *异步装载msic.js
    */   
    var LoadMiscJsAsyn =  AsyncCall(function(get){
    		   nfAjax && nfAjax.GetMiscJs(gMiscJsUrl,function(result){
          	if(result.type === "error"){
            	get(false);
           }else if(result.type === "OK"){
            	AppendJsBySource(result.data);
             get(true);
           }
         });
    });
    
    setTimeout(function(){LoadMiscJsAsyn(function(result){});}, 600);
    /*
    *以附件发送网盘文件，跳转到组信页面
    */
    function SwithToCompose(aPostFile){
      var sUrl = "http://" + gMasterHost + "/app/wp/send.jsp";
      var sMethod = "POST";
      var oForm = document.createElement("FORM", "formRequest");
      oForm.method = "post";
      oForm.target = "ifrmUtilRequest";
	    document.body.appendChild(oForm);
	    oForm.action = sUrl;
		  var oInput = document.createElement("INPUT");
		  oInput.name = "data";
		  oInput.value = $.toJSON(aPostFile);
	    oInput.type = "hidden";
		  oForm.appendChild(oInput);
	    oForm.submit();
    };

    /*
    * 判断是否是未上传完的文件
    */
    function IsUnUploadedFile(id,oFile){
	    var oFile = oFile || fWpGetFileFromMid(mid);
	    if(oFile && oFile.misc && oFile.misc.remainsize >0){
		    return true;
	    }
	    return false;
    }; 
 
    /*
    * 获取文件缩略图标
    * @return  {string} list/pic 显示模式：列表方式/图片方式，默认列表方式
    */    
    function GetFileThumb(fid,fname,callback){
      var sIndex = fGetFileIconIndex(fname);
      if(false){//fWpIsUnUploadedFile
		    callback(fid, '<a href="javascript:void(0)" class="pic pic-icon" onclick="return false;"><b class="ico ico-bfile ico-bfile-'+sIndex+'"></b></a>');    
	      return;
	    }else if(fWpIsPic(fname,sIndex)){
        nfAjax.GetFileCert(fid,function(result){
     	    if(result.type === "error"){
            callback(fid,'<a class="pic pic-icon" href="javascript:void(0)"><b class="ico ico-bfile ico-bfile-'+sIndex+'"></b></a>');     		     		
            return;
          }else if(result.type === "OK"){
            var sDownloadUrl= GE.downloadURL + fname + "?op=downloadFile&uid=" + GE.userName + "&file="+ result.docURL;
       	   var sThunmbPicUrl = GE.downloadURL + fname + "?op=thumbFile&uid=" +GE.userName + "&file="+ result.docURL +"&size=100x100";
            callback(fid,'<a href="'+sDownloadUrl+'" class="pic"><img src="'+sThunmbPicUrl+'" /></a>');
            return;
          }
       }); 
      }else if(false/*fWpIsMedia(fname)*/){
         //callback(fid,'<a href="javascript:fGoto()" class="pic pic-icon" onclick="fWpPlayMusic(\''+fname+'\',\''+sDownloadUrl+'\')"><b class="ico ico-bfile ico-bfile-'+sIndex+'"></b></a>');
         return;
      }else{
         callback(fid,'<a class="pic pic-icon" href="javascript:void(0)"><b class="ico ico-bfile ico-bfile-'+sIndex+'"></b></a>');			
         return;     	
      }
    };  
    /**
    * 网盘文件移动回调函数
    * @param
    * @return  {void}
    **/
    function MoveFileCallback(fid,result){
			if((result.file.type === "error") && (result.folder.type === "error")){
				fCommonMsgBox({content:"文件移动失败。"});	
      	}else if((result.file.type === "error") &&(result.folder.type === "OK")){
       	fCommonMsgBox({content:"文件部分移动失败。"});
        	SwitchDirStraight(fid);
       }else if((result.file.type === "OK") &&(result.folder.type === "error")){
       	fCommonMsgBox({content:"不能移动父文件夹到子文件夹中，部分移动失败。"});
        	SwitchDirStraight(fid);
       }else {
       	SwitchDirStraight(fid); 
       }
    };
    /**
    * 显示修改网盘文件详情页面
    * @param   {string} id 网盘文件id
    * @param   {string} sFolder 文件所在路径
    * @return  {void}
    *
    **/
    function showFileDetailDlg(id){
      var oFile = DocSets[curDirId].files[id];
      if(oFile === undefined)return;
      var sName = oFile.fileName;
      var nSize = oFile.doc.size;
      var sMemo = oFile.description ? oFile.description : "暂未添加";
      var creationDate = ConvertFromEpoch(oFile.createTime);

      var nLastIndex = sName.lastIndexOf(".");
      var sPre = sName;
      var sSuffix = "";
      if(nLastIndex != -1){
        sPre = sName.substr(0,nLastIndex);
        sSuffix = sName.substr(nLastIndex);
      }      
      var node = $("#tmpl_file_info_dlg").tmpl({
        docName : sPre,
        suffix : sSuffix,
        memo : sMemo,
        icon_index : fGetFileIconIndex(sName),
        size : nSize,
        date : creationDate,
        path : function(){
         var pathstr='';
         for(var i=0;i<clientdata.pathStack.length;i++){
            pathstr+= clientdata.pathStack[i].dirName;
            pathstr+='/';
         }
         return pathstr;
        }
      });
      $.tmpl.complete();
      $("#filetype",node).show();
      $("#filesize",node).show();
      $("#uploadtime",node).show();
      function _fWpSubmitModify(){
        var filePre  = $("#filePre").val();
        var fileMemo = $("#fileMemo").val();
        if(!filePre)return;
        if((filePre != sPre)||(fileMemo != sMemo)){
            var sNewName = filePre + sSuffix;
            //ajax请求修改文件名或备注
             nfAjax.UpdateFile(id,{parentId: curDirId,fileName :sNewName,description: fileMemo},function(result){
            	if(result.type === "OK"){
              	DocSets[curDirId].RenameFile(id,sNewName,fileMemo);
                var selector = "a[iid='" + id +"']";
                $(selector).text(sNewName);
                if(fileMemo != sMemo){
                	var selector = "tr[id='" + id +"']";
                  var fitem = $(selector);
                  if(fileMemo.length >0){
                  	$(".memo",fitem).text(" - "+fileMemo);
                  }else{
                  	$(".memo",fitem).text(fileMemo);
                  }
                }
              }else if(result.data.code === 611){
              	fCommonMsgBox({title:"修改文件信息",content:"与其他文件重名。"});
              }else if(result.data.code === 555){
              	fCommonMsgBox({title:"修改文件信息",content:"文件不存在。"});
              }else {
              	fCommonMsgBox({title:"修改文件信息",content:"修改文件信息失败。"});
              }
            });
        }
      };

      var oButton = fCommonMsgBox({noIcon:true,title:"文件详情",content:node.html(),hasCancel:true,call:_fWpSubmitModify});
      var _fMemoCount = function(){
        var sValue = $("#fileMemo").val();
        if(sValue == "暂未添加"){
            sValue = "";
        }
        var oErr = $("#fileMemoErr");
        if(sValue.length > 50){
            oErr.html("已超出"+(sValue.length-50)+" 字");
            oButton["ok"].disabled = true;
        }else{
            oErr.html("还可以输入"+(50-sValue.length)+" 字");
            if(oButton["ok"].disabled){
                oButton["ok"].disabled = false;
            }
        }
      };

      $("#fileMemo").focus(function(){
			  if($(this).html() == "暂未添加"){
          $(this).html('');
         }
      });

      $("#fileMemo").keydown(_fMemoCount);
      $("#fileMemo").keyup(_fMemoCount);
      _fMemoCount();
    };
    /**
    * 显示网盘文件移动详情页面
    * @param
    * @return  {void}
    **/
    function showMoveDlg(){
      var oResult  = DocSets[curDirId].GetAllCheckItems();
      var aFolder  = oResult.folder;
      var aFile    = oResult.file;
      var ntotalSel = aFolder.length + aFile.length;
      
      function onSubmitMove(){
        var fid = window.fid;
        if(fid === undefined)return;
				nfAjax && nfAjax.MoveItems(oResult,fid,function(result){
					MoveFileCallback(fid,result);
         });
      };

      if (ntotalSel == 0) {
        fCommonMsgBox({content:"请先选择您移动的文件。"});
		    return;
      }

		  var node = $("#tmpl_move_dlg").tmpl({
    		  tips : "要将选中的"+ ntotalSel + "个文件移动到:" 
      });
		 $.tmpl.complete();
      var bottomHtml = '<div id="btnNewFolder" class="btn btn-dft"><span>新建文件夹</span></div>';
      var oReturn = fCommonMsgBox({noIcon:true,title:"移动文件",
                                   bottom:bottomHtml,content:node.html(),
                                   okText:"移 动",hasCancel:true,
                                   call:onSubmitMove});
    };
    /**
    * 渲染文件列表项
    * @param
    * @return  {void}
    **/
    function RenderFileItem(file){
      var node = $("#tmpl_file_item").tmpl({
      						id : file.id,
                  name : file.fileName,
                  info : file.description ? ('-' + file.description) : '',//未确定
                  icon_index :fGetFileIconIndex(file.fileName),
                  size : ConvertFileSize(file.doc.size),
                  date : ConvertFromEpoch(file.createTime),
                  parentId : file.parentId,
                  path : ""});
      $.tmpl.complete();

      if((file.shares === undefined) ||(file.shares.length === 0)){
      	 $("#share",node).parent().show();
      	 $("#remove_share",node).parent().hide();      
      }else{
      	 $("#share",node).parent().hide();
      	 $("#remove_share",node).parent().show();
         $(".share-info",node).show();      	
      }
      
      if(fCommonIsPrev(file.fileName)){
        $("#online_preview",node).parent().show();
      }else{
        $("#online_preview",node).parent().hide();      
      }
      
      if(document.all){      //ie
        $(".txt-link",node).addClass("oprt");
      }
      
      node.mouseenter(function(ev) {
        var cnt = DocSets[curDirId].GetAllCheckItems().file.length + DocSets[curDirId].GetAllCheckItems().folder.length;
        if(cnt > 0){
          $(".txt-link",this).hide();
        }else{
          $(".txt-link",this).show();            
        }
        $(this).addClass("over");
      });

      node.mouseleave(function(ev) {
        $(".txt-link",this).hide();
        $(this).removeClass("over");
      });
      
      $("#online_preview",node).click(function(){
         var iid = $(this).parent().parent().attr("iid");
         var ofile = DocSets[curDirId].files[iid] && DocSets[curDirId].files[iid];
         var filename= ofile.fileName;
         var url = ofile.URL;
         url = url.substr(0,url.indexOf('|'));
         var href = GE.previewURL + "?uid=" + GE.uid+ "&product=" +gDomainMisc[GE.fullDomain].productName+"&docURL=" + url;
         window.open(href);
      });

      $("#download",node).click(function(){
        var iid=$(this).parent().parent().attr("iid");
        var filename= DocSets[curDirId].files[iid] && DocSets[curDirId].files[iid].fileName;
				nfAjax && nfAjax.DownLoadFile(iid,function(result){
          if(result.type === "error"){
             fCommonMsgBox({content:"下载失败。"});
	        }else if(result.type === "OK"){
          		var url = GE.downloadURL + filename +"?op=downloadFile&uid=" + GE.userName + "&file="+ result.docURL;
              window.location =url;
          }
        });
      });

      $("#sendbyemail",node).click(function(){
      alert("发送");
      });
  
      $("#rename",node).click(function(){
        var id=$(this).parent().parent().parent().parent().attr("id");
        showFileDetailDlg(id);
      });

      $("#remark",node).click(function(){
        var id=$(this).parent().parent().parent().parent().attr("id");
        showFileDetailDlg(id);
      });        
        
      $(".list-item-ckb",node).click(function(){
        var checked = $(this).is(":checked");
        if(checked === true){
          $(this).parent().parent().addClass("chked");
        }else{
          $(this).parent().parent().removeClass("chked");
        }
        DocSets[curDirId] && DocSets[curDirId].OnSelFile($(this).parent().parent().attr("id"),checked);
        if(DocSets[curDirId].GetCheckItemsCnt() == DocSets[curDirId].GetAllItemsCnt()){
          $("#listAllCheck").attr("checked", true);
        }else{
          $("#listAllCheck").attr("checked", false);
        }
      });

      $(".ico-drag",node).mousedown(function(){
         var item = $(this).parent().parent();
         var checkbox= $(".list-item-ckb",item);
         checkbox.attr("checked", true);
         item.addClass("chked");
         var iid= item.attr("id");
         DocSets[curDirId].OnSelFile(iid,true);
         var oResult  = DocSets[curDirId].GetAllCheckItems();
      		var aFolder  = oResult.folder;
      		var aFile    = oResult.file;
         var ntotalSel = aFolder.length + aFile.length;
         fWpDragMove(this,ntotalSel,function(fid){
         	if ((ntotalSel == 0) ||(fid === undefined)) {
		    			return;
      			}

					nfAjax && nfAjax.MoveItems(oResult,fid,function(result){
           	MoveFileCallback(fid,result);
          });
        });      
      });

      $("#remain_download",node).click(function(){
        var fid=$(this).parent().parent().parent().parent().attr("id");
        ShowJifenDlg(DocSets[curDirId].files[fid]);
      });
      
      $(".name",node).click(function(){
         var iid= $(this).attr("iid");
         var filename = $(this).text();
				 nfAjax && nfAjax.DownLoadFile(iid,function(result){	
				  if(result.type === "error"){
            fCommonMsg("下载文件失败",5000);
	        }else if(result.type === "OK"){
            var url = GE.downloadURL + filename +"?op=downloadFile&uid=" + GE.userName + "&file="+ result.docURL + "&fileName=" +filename;
            window.location = url;
           }
         }); 
      });

      return  node;
    };
 
    /**
    * @param {file} //文件数据
    * @return  {string} //dom数据
    **/    
    function RenderPicFileItem(file){
      var node = $("#tmpl_file_pic_item").tmpl({
          id   : file.id,
          name : file.fileName,
          fileicon :'',
          size : ConvertFileSize(file.doc.size),
          date : ConvertFromEpoch(file.createTime)
        });
      $.tmpl.complete();
      
      $(".ipt-c",node).click(function(){
      var checked = $(this).is(":checked");
        if(checked === true){
          $(this).parent().parent().css("backgroundColor","#FFFFCA");
        }else{
          $(this).parent().parent().css("backgroundColor","transparent");
        }
        DocSets[curDirId] && DocSets[curDirId].OnSelFile($(this).attr("id"),checked);

        if(DocSets[curDirId].GetCheckItemsCnt() == DocSets[curDirId].GetAllItemsCnt()){
          $("#picAllCheck").attr("checked", true);
        }else{
          $("#picAllCheck").attr("checked", false);
        }
      });
 
      $(node).mouseover(function(e){
        if(!fCheckIsOnMouseOver(this,e)){
          return;
        }
        $(this).css("backgroundColor","#FFFFE1");   
      });

      $(node).mouseout(function(e){
        // 判断是否是真正的out，ie，ff下移动到子dom后会有out再over的事件产生，这里就不用再做处理。
		    if(!fCheckIsOnMouseOut(this,e)){
			    return;
		    }
        var checked = $(".ipt-c",this).is(":checked");
        if(checked){
          $(this).css("backgroundColor","#FFFFCA");
        }else{
          $(this).css("backgroundColor","transparent");
        }	
      });
        
      $("#pic_download",node).click(function(){
    	  var iid=$(this).attr("fid");
       var filename= DocSets[curDirId].files[iid] && DocSets[curDirId].files[iid].fileName;
				nfAjax && nfAjax.DownLoadFile(iid,function(result){
          if(result.type === "error"){
          		//fCommonMsg("下载文件失败",5000);只有线上才有这个对话框
	        }else if(result.type === "OK"){
          	  var url= GE.downloadURL + filename +"?op=downloadFile&uid=" + GE.userName + "&file="+ result.docURL + "&fileName=" +filename;
             window.location = url;
             //$.get(url,function(result){});
          }
        });
      });

      $("#pic_rename",node).click(function(){
    	  var id=$(this).attr("fid");
        showFileDetailDlg(id);
      });

      $(".name",node).click(function(){
        var iid=$(this).attr("iid");
        var filename= DocSets[curDirId].files[iid] && DocSets[curDirId].files[iid].fileName;
        nfAjax && nfAjax.DownLoadFile(iid,function(result){
          if(result.type === "error"){
            fCommonMsgBox({content:"下载文件出错"});
	        }else if(result.type === "OK"){
          	  var url= GE.downloadURL + filename +"?op=downloadFile&uid=" + GE.userName + "&file="+ result.docURL + "&fileName=" +filename;
             window.location = url;
          }
        });
      });

      return node;      
    };
   
    /**
    * 绑定工具栏下拉列表事件处理函数
    **/    
    function BindDropDownListEvent(){
		 //0-根据创建时间排序,1-根据过期时间排序，2-根据文件名排序，3-根据文件类型排序,4-根据大小
      if(GE.orderBy ===0){
      		if(GE.desc === 1){
         	$("#tb_time_desc").children().show();
         }else if(GE.desc === 0){
         	$("#tb_time_asc").children().show();
         }
      }else if(GE.orderBy ===1){
      }else if(GE.orderBy ===2){
      		$("#tb_file_name").children().show();				
      }else if(GE.orderBy ===3){
      		$("#tb_file_type").children().show();
      }else if(GE.orderBy ===4){
      		if(GE.desc === 1){
         	$("#tb_size_desc").children().show();
         }else if(GE.desc === 0){
         	$("#tb_size_asc").children().show();
         }
      }

			$("#tb_send_CommonAttachMent").click(function() {
         var oItems = DocSets[curDirId].GetAllCheckItems();
         var aFile = oItems.file;
         if(oItems.folder.length>0){
           fCommonMsgBox({title:"系统提示",content:"文件夹不能直接进行邮件发送。"});
           return;
         }
         if(oItems.file.length<1){
           fCommonMsgBox({title:"系统提示",content:"你还没选择需要发送的文件。"});
           return;	
         }	
         var aPostFile =[];
         nfAjax && nfAjax.GetFileCertSet(aFile,function(result){
          	if(result.type === "OK"){	
            	LoadMiscJsAsyn(function(init){
              	if(init == true){
                	var certs= result.certs;
                	for(var i=0;i<certs.length;i++){
                  	var oFile = DocSets[curDirId].GetFileFromId(certs[i].id);
                    var docURL = certs[i].token.docURL;
                    if(!oFile)continue;
                    var url =(GE.downloadURL + oFile.fileName +"?op=downloadFile&uid=" + GE.userName + "&file="+ docURL);
                    var contType = fGetFileContentType(oFile.fileName);                   
                    aPostFile.push({
                			type : "url",
                			mode : "copy_opt",
                			name : url,
                			displayName : oFile.fileName,
                			contentType : contType,
                			size : oFile.doc.size                    	
                    });
                  }
              		SwithToCompose(aPostFile);
           		}else if(init == false){
                	LoadMiscJsAsyn("reset");
                  fCommonMsgBox({title:"系统提示",content:"以附件发送文件失败"});
                }
             });
           }else if(result.type === "error"){
           	fCommonMsgBox({title:"系统提示",content:"以附件发送文件失败"});
           }
         },false);
       });

		  $("#tb_send_ShareAttachment").click(function() {
			  var oItems = DocSets[curDirId].GetAllCheckItems();
         var aFile = oItems.aFile;
         if(oItems.folder.length>0){
           fCommonMsgBox({title:"系统提示",content:"文件夹不能直接进行邮件发送。"});
           return;
         }
         if(oItems.file.length<1){
           fCommonMsgBox({title:"系统提示",content:"你还没选择需要发送的文件。"});
           return;	
         }
         //首先共享文件
         var aPostFile =[];
         nfAjax && nfAjax.ShareFileSet(aFile,function(result){
         	if(result.type === "error"){
           	fCommonMsgBox({title:"系统提示",content:"你还没选择需要发送的文件。"});
						return;            
           }else if(result.type === "OK"){
           	nfAjax && nfAjax.GetFileCertSet(aFile,function(res){
          			if(res.type === "OK"){
           			LoadMiscJsAsyn(function(init){
            				if(init == true){
                       //组装aPostFile
                       var certs= res.certs;
                	     for(var i=0;i<certs.length;i++){
                         var oFile = DocSets[curDirId].GetFileFromId(certs[i].id);
                         var docURL = certs[i].docURL;
                         if(!oFile)continue;
                         var url = GE.downloadURL + oFile.fileName +"?op=downloadFile&uid=" + GE.userName + "&file="+ docURL;
                         var contType = fGetFileContentType(oFile.fileName);                   
                         aPostFile.push({
                           type : "url",
                           mode : "copy_opt",
                           name : url,
                           displayName : oFile.fileName,
                           contentType : contType,
                           size : oFile.doc.size                    	
                         });
                       }                       
                		 SwithToCompose(aPostFile);
                		}
              		})
           		}else{
           			fCommonMsgBox({title:"系统提示",content:"以共享附件发送文件失败"});
            			return;
           		}
         		},false);
           }
         });
    	  });
    };
    /**
    * 绑定工具栏事件处理函数
    * @param   {dom element}
    * @return  {void}
    *
    **/    
    function BindToolbarEvent(node){
      var select =$("#pagesel", node);
 		  for(var j=1;j<GE.totalPage + 1;j++){
        option_node = $("#tmpl_select_option").tmpl({
          	curPage : j,
          	totalPage : GE.totalPage
        });
  		  $.tmpl.complete();
        
        option_node.attr("selected", (j == GE.curPage));   
        select.append(option_node);
      }

      if(GE.totalPage===1){
        $("a",node).addClass("txt-disabd");
      }else if(GE.curPage === 1){
        $("#first_page",node).addClass("txt-disabd");
       	$("#pre_page",node).addClass("txt-disabd");
        $("#next_page",node).click(function(){
          pageNav && pageNav.navigateToNext();            
        });
       	
        $("#last_page",node).click(function(){
          pageNav && pageNav.navigateToLast();
        });         
      }else if(GE.curPage === GE.totalPage){
        $("#first_page",node).click(function(){
          pageNav && pageNav.navigateToFirst();           
        });       	
        $("#pre_page",node).click(function(){
          pageNav && pageNav.navigateToPre();         
        });
       	$("#next_page",node).addClass("txt-disabd");
       	$("#last_page",node).addClass("txt-disabd");        
       }else {        
        $("#first_page",node).click(function(){
					pageNav && pageNav.navigateToFirst();
        });
        $("#pre_page",node).click(function(){
          pageNav && pageNav.navigateToPre();            
        }); 
        $("#next_page",node).click(function(){
          pageNav && pageNav.navigateToNext();         
        });
       	
        $("#last_page",node).click(function(){
           pageNav && pageNav.navigateToLast();         
         }); 
      }

      select.change(function(){
        pageNav && pageNav.navigateToIndex($(this).val());
      });

      $("#tb_return", node).click(function(){
      	   pageNav && pageNav.RefreshPage();
      });
		  $("#tb_download", node).click(function() {
        var aFile = DocSets[curDirId].GetAllCheckItems().file;
        var aFolder = DocSets[curDirId].GetAllCheckItems().folder;
				var cnt = aFile.length + aFolder.length;
        var dirname = "netfolder";
        if(cnt <1){
          fCommonMsgBox({title:"下载文件出错",content:"请选择需要下载的文件或文件夹。"});
        	return;
        }else if(cnt ===1){
          (aFile.length !== 0) ? dirname=aFile[0].fileName : dirname = aFolder[0].dirName;
        }
				nfAjax && nfAjax.ZipDownLoadItems(aFile,aFolder,function(result){
         	if(result.type === "error"){
             fCommonMsgBox({content:"下载过程出错。"});
	        	}else if(result.type === "OK"){
              var url = GE.zipDownloadURL +"&uid=" + GE.uid + "&file="+ result.docURL;
          		window.location = url;
          	}
         });         
		  });
   
		  $("#tb_del", node).click(function() {
        var aFile = DocSets[curDirId].GetAllCheckItems().file;
        var aFolder = DocSets[curDirId].GetAllCheckItems().folder;
				var cnt = aFile.length + aFolder.length;
        if(cnt <1){
          fCommonMsgBox({title:"删除文件出错",content:"请选择需要删除的文件或文件夹。"});
          return;
        }

        var sContent = "";
        if(cnt > 1){ //删除多个文件
          sContent = "确定要删除选中的"+(cnt);
          if(aFile.length == 0){ // 在没选中文件的情况下提示文件夹
            sContent += "个文件夹吗？";
          }else{
            sContent += "个文件吗？";
          }
        }else{  // 删除单个文件或单个文件夹
          if(aFile.length > 0){
    		    var oFile = DocSets[curDirId].GetFileFromId(aFile[0]);
            sContent = oFile? oFile.fileName : "";
          }else if(aFolder.length > 0){
            var oFolder = DocSets[curDirId].GetFolderFromId(aFolder[0]);
            sContent = oFolder? oFolder.dirName : "";
          }
          sContent = '您确定要删除“' + sContent +'<span style="font-family:simsun">”</span>吗？';
        }
				fCommonMsgBox({title:"删除文件",content:sContent,hasCancel:true,call:function(){
          if(aFile.length >0){
          	nfAjax.DelFiles(aFile,function(result){
         	if(result.type === "OK"){
         		pageNav.RefreshPage();
            }else {
            	fCommonMsgBox({title:"删除文件出错",content:"删除文件失败。"});
            }
           });
          }
          
         if(aFolder.length >0){
          	nfAjax.DelFolders(aFolder,true,false,false,function(result){
         	if(result.type === "OK"){
         		pageNav.RefreshPage(); 
            }else {
            	fCommonMsgBox({title:"删除文件出错",content:"删除文件夹失败。"});
            }
           });					
         }
         }});
		  });

		  $("#tb_send", node).click(function() {
			  ShowDropDownList($(".send-file"),this,"send");
      });
      
	    $("#tb_move", node).click(function() {
			  showMoveDlg();
      });

	    $("#tb_sort", node).click(function() {
			  ShowDropDownList($(".sort-file"),this,"sort");    		
      });

	    $("#tb_time_desc").click(function() {
         pageNav && pageNav.navigateBySort(0,1);	
      });

	    $("#tb_time_asc").click(function() {
         pageNav && pageNav.navigateBySort(0,0);	    
      });
    	  $("#tb_size_desc").click(function() {
         pageNav && pageNav.navigateBySort(4,1);
      });

      $("#tb_size_asc").click(function() {
         pageNav && pageNav.navigateBySort(4,0);	      
      });

      $("#tb_file_type").click(function() {
        pageNav && pageNav.navigateBySort(3,0);
      });
      $("#tb_file_name").click(function() {
        pageNav && pageNav.navigateBySort(2,0);      
      });     
    };
    
    function SwitchShowMode(mode){
    		if(mode === 0){
       	RenderListAsyn(function(init){
         	if(!init)return;
           $("#divList").show();
           $("#divPic").hide();
         });
       }else if(mode === 1){
       	RenderPicAsyn(function(init){
         	if(!init)return;
           $("#divList").hide();
           $("#divPic").show();
         });
       }
    };
     /**
    * 渲染框架标题信息
    * @param   {void}
    * @return  {void}
    **/    
	  var render_title_area = function(){
       var tmpl_param= {
           total_result : 100, //测试数据
           keyword : "搜索关键字",
           range : "搜索范围",
           date  : "搜索日期",
           size : "大小",
           type : "文档类型"
      }
      var node = $("#tmpl_title_area").tmpl(tmpl_param);
      $.tmpl.complete();
      
      $(".btn-srch",node).click(function(){
      		alert("搜索");
      });
      $(".ico-mode-list",node).click(function(){
			 if($(this).hasClass("ico-mode-list-on"))return;
			 pageNav && pageNav.SetShowMode(0);
      	 $(".ico-mode-pic").removeClass("ico-mode-pic-on");
        $(this).addClass("ico-mode-list-on");
        SwitchShowMode(0);
      });
      
      if(GE.showMode === 0){
      		$(".ico-mode-list",node).addClass("ico-mode-list-on");
      }else if(GE.showMode ===1){
      		$(".ico-mode-pic",node).addClass("ico-mode-pic-on");      	  
      }

      $(".ico-mode-pic",node).click(function(){
         if ($(this).hasClass("ico-mode-pic-on"))return;
         pageNav && pageNav.SetShowMode(1);
      	 $(".ico-mode-list").removeClass("ico-mode-list-on");
         $(this).addClass("ico-mode-pic-on");
         SwitchShowMode(1);        
      });
      
      $(".lock",node).click(function(){
      		if(gLocked === 1){
         	//1-加锁，则进入解锁页面
          	
         }else if(gLocked === 2){
            //2-没有加锁，则进入加锁页面
            
         }
      });
      
      $(".g-title-1").append(node);
      $(".file_center").click(function(){
		  	fGotoFileCenter();        
      });
    };
    /**
    * 渲染框架头信息
    * @param   {void}
    * @return  {void}
    **/    
    var render_frame_header = function(){
		  var node = $("#tmpl_frame_header").tmpl({paths: function(){
      																				  if(clientdata.pathStack.length < 2)return [];
                                                  	return clientdata.pathStack.slice(0,clientdata.pathStack.length -1);
                                                  },
                                                  curFolderName : clientdata.pathStack[clientdata.pathStack.length -1].dirName});
      $.tmpl.complete();
      
      $(".path_item",node).click(function(){
		  	var did=$(this).attr("dirId");
        	var path;
				while((path =pageNav.popPathStack())){
          	if(path && (path.id == did))break;
         }
         if(path && path.id){
         	pageNav.navigateToDir(path.id,path.dirName);
         }
      });

      $("#header_path",node).click(function(){
        var node = $("#tmpl_move_dlg").tmpl({tips : "选择需要打开的文件夹" });
        $.tmpl.complete();
        
        $(".ico-info",node).hide();
        $("#upgrade163vip",node).click(function(){});
      
        if(GE.ver == "js35"  || GE.ver == "js4"){
          $("#upgrade163vip",node).show();
        };

        window.fid = curDirId;
        
        function onSubmitMove(){
          if((window.fid ===undefined) || (window.fid === curDirId))return;
          SwitchDirStraight(window.fid);
        };
        
        var oReturn = fCommonMsgBox({noIcon:true,title:"路径",content:node.html(),okText:"确 定",hasCancel:true,call:onSubmitMove});
      });
      
      $(".path").append(node);
    };
    /**
    * 渲染下工具栏
    * @param   {void}
    * @return  {void}
    *
    **/ 
    var render_bottom_toolbar = function(){
  	  var node = $("#tmpl_frame_toolbar").tmpl({});
		  $.tmpl.complete();
		  $(".toolbar-bottom").append(node);
	    BindToolbarEvent(node);      
    };

    /**
    * 渲染上工具栏
    * @param   {void}
    * @return  {void}
    *
    **/ 
    var render_top_toolbar = function(){
      var node = $("#tmpl_frame_toolbar").tmpl({});
      $.tmpl.complete();
      $(".toolbar-top").append(node);
      BindToolbarEvent(node);
    };

    /**
    * 渲染网盘
    * @param   {void}
    * @return  {void}
    **/	  
    var render_netfolder = function(){
  	  render_title_area();
	    render_top_toolbar();
		  render_frame_header();
      SwitchShowMode(GE.showMode);
		  render_bottom_toolbar();
      BindDropDownListEvent();
    };
	  render_netfolder();
  });
})(jQuery);

