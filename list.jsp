<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ page isELIgnored="true" %>
<%@page import="com.netease.mail.fs.domain.dir.FSDirStatsInfo"%>
<%@page import="com.netease.mail.fs.domain.PagedQueryInfo"%>
<%@page import="com.netease.mail.fs.domain.dir.FSDir"%>
<%@page import="net.sf.json.JSONArray"%>
<%@page import="net.sf.json.JSONObject"%>
<%@page import="com.netease.mail.fs.domain.user.FSUserFileStatsInfo"%>
<%
    String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<html>
	<head>
		<base href="<%=basePath%>" />
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta name="keywords" content="" />
		<meta name="description" content="http://mimg.126.net/xm/all/netfolder/100519/" />
    
		<title>极速3.5 网盘</title>
		<script type="text/javascript" src="http://mimg.126.net/xm/all/style_comm/js/theme_output.js"></script>
    <script type="text/javascript" src="http://mimg.126.net/mailapi/webmailapi-1.1.0.min.utf8.js"></script> 
    <script type="text/javascript" src="js/jquery-1.3.2.js"></script>
    <script type="text/javascript" src="js/tools.js"></script>  
		<!--2010-5-19 网盘所有页面更改css url-->
		<!--
		<link href="css/style.css" rel="stylesheet" type="text/css" />
		-->
    <!--全局变量区-->
    <script type="text/javascript">
      <%FSDir fsDir = (FSDir)request.getAttribute("fsDir");
        FSDirStatsInfo dirStats = (FSDirStatsInfo)request.getAttribute("dirStats");
        PagedQueryInfo pagedQueryInfo = (PagedQueryInfo)request.getAttribute("pagedQueryInfo");
        FSUserFileStatsInfo fileStats = (FSUserFileStatsInfo)request.getAttribute("fileStats");%>
      gDomainMisc ={
        "mail.163.com"     : {
          feedback  : "http://zhidao.mail.163.com/zhidao/newquiz.jsp#网易网盘",
          upgradeUrl : "http://upnetdisk.mail.163.com/netfolder/index.do",
          vipAdUrl   : "http://reg.vip.163.com/upgradeIndex.m?b10due1",
          productName :  "cloudstorage.mail.163",
          bShowUpgrade : true
        },
        "mail.126.com"     : {
          feedback    : "http://zhidao.mail.126.com/zhidao/newquiz.jsp#网易网盘",
  	      upgradeUrl  : "http://upnetdisk.mail.126.com/netfolder/index.do",
  	      vipAdUrl    : "http://reg.vip.126.com/upgradeIndex.m?b66due1",
          productName  : "cloudstorage.mail.126",
          bShowUpgrade : true          
        },
        "mail.yeah.net"    : {
  	      feedback  : "http://zhidao.mail.yeah.net/zhidao/newquiz.jsp#网易网盘",
  	      upgradeUrl: "http://upnetdisk.mail.yeah.net/netfolder/indexyeah.do",
          productName : "cloudstorage.mail.yeah", 
          bShowUpgrade : true          
        },
        "mail.netease.com" : {
          feedback     : "http://zhidao.mail.yeah.net/zhidao/newquiz.jsp#网易网盘",
  	      upgradeUrl   : "http://upnetdisk.mail.yeah.net/netfolder/indexyeah.do",
          bShowUpgrade : false
        },
        "mail.188.com"     : {
          feedback     : "http://mail.188.com/dc/jianyi/jy-188-index.htm?site=188wp",
          productName  : "cloudstorage.mail.vip188",
          bShowUpgrade : false 
        },
        "vip.126.com" : {
          feedback     : "http://vip.126.com/survey/jianyi/suggest.htm?site=vipwp",
          productName  : "cloudstorage.mail.vip126",
          bShowUpgrade : false 
        },
        "vip.163.com" : {
          feedback     : "http://vip.163.com/dc/jianyi/jy-vip-index.htm?site=vipwp",
          productName  : "cloudstorage.mail.vip163",
          bShowUpgrade : false }
      };
      //http://nf.mail.163.com/netfolder/web/index.do?
      //sid=pExImGyyRDKuFARUORyykybmnjKuEvgB&uid=changpinggou@163.com&
      //host=cg1a192.mail.163.com&ver=js4
      //&style=9&skin=163blue&color=005590
      //gMasterData: {"sid":, "uid":, "host":, "ver":, "style":, "skin":, "color":}
      gMaterData= <%=request.getAttribute("queryData") %>;
      gMasterHost = gMaterData.host;//webmail 主机地址,jsp给出
      gVer = gMaterData.ver;        //webmail 版本
      gUserName = gMaterData.uid;   //webmail 用户名
      gSid = gMaterData.sid;        //webmail 会话ID
      gStyle = gMaterData.style;    //webmail 样式
      gSkin = gMaterData.skin;      //webmail 皮肤
      gColor = gMaterData.color;    //webmail 颜色
      gRawClientData = gMaterData.clientData; //客户端数据
      gFromCompose = gMaterData.send || false;         //表示从写信页面跳转来

      gFullDomain = gMasterHost && gMasterHost.substr(gMasterHost.indexOf('.')+1); //完全的主机域名
      gMailDomain = gUserName && gUserName.substr(gUserName.indexOf('@')+1);     //获取邮箱域名

      gLocked = 2;  //网盘是否加锁1-加锁 2-没有加锁
      gSearch = false;
      
      gUploadCallbackUrl = "http://nf.mail.163.com/netfolder/uploadcallback.html";//测试用
      gDownloadURL   = "http://cloud.mail.163.com/dfs/service/"; //文件下载地址
      gZipDownloadURL= "http://cloud.mail.163.com/archive?op=downloadArchive"; //打包下载地址
      gUploadUrl     ="http://cloud.mail.163.com/fs/formUpload";   //flash上传地址（测试用)
      
      gFormUploadURL ="http://cloud.mail.163.com/fs/formUpload";//表单上传地址(测试用)
      gPreviewURL    ="http://cloud.mail.163.com/fsprev/preview";  //预览地址(测试用)
      gUploadJsUrl   ="http://nf.mail.163.com/netfolder/js/upload.js";// 绝对地址(测试)
      gMiscJsUrl     ="http://nf.mail.163.com/netfolder/js/misc.js";// 绝对地址(测试)
      gSwfUrl        ="js/upload2.swf";   //flash上传控件地址
      
      gPageSize = 20;                 //每页显示数目
      gUploadLimitM = 50;             //单个文件上传限制
      gTotalDocsLimit= 500;           //目录下子目录和文件总数限制
      
      gCapcity = <%=fileStats.getCapacity() %>; //网盘总容量
      gUsedCapacity = <%=fileStats.getFilesStats().getSpaceUsed() %>;// 网盘剩余容量
      gUsableCapacity = gCapcity - gUsedCapacity; //网盘可用空间

      gCurDirStats = <%= dirStats %>;//{"dirsCount":2,"filesCount":26,"filesSize":240506,"id":1020,"ownerId":11127}
      gDirsCnt = gCurDirStats.stats.dirsCount || 0; 
      gFilesCnt = gCurDirStats.stats.filesCount || 0;
      gTotalDocs = gDirsCnt + gFilesCnt;

      gNFConfig ={
        pageSize : <%= pagedQueryInfo.getPageSize()%>,
        curPageIndex : <%= pagedQueryInfo.getPageIndex() %>,
        order : <%= pagedQueryInfo.getOrderBy() %>,
        desc  : <%= pagedQueryInfo.getDesc() %>,
        nextStart : "<%= pagedQueryInfo.getNextStart() %>",
        totalPages : <%= pagedQueryInfo.getTotalCount() / pagedQueryInfo.getPageSize() + 1 %>
      };
	    gFile = <%= JSONArray.fromObject(fsDir.getFiles()) %>;
	    gFolder = <%= JSONArray.fromObject(fsDir.getSubdirs())  %>;
    </script>

    <link href="http://mimg.126.net/xm/all/netfolder/100603/css/style_101101.css" rel="stylesheet" type="text/css" />
    <link href="http://mimg.126.net/xm/all/netfolder/100519/css/upgrade.css" rel="stylesheet" type="text/css" />
    <script language="javascript" src="js/backend.js?<%= new Date().getTime() %>"></script> 
    <script language="javascript" src="js/netfolder.js?<%= new Date().getTime() %>"></script>
    
    <script id="tmpl_title_area" type="text/html">
       <a class="file_center" href="javascript:void(0)" style="text-decoration:none;">文件中心</a>
       <span id="spnFileCenter" style="">&nbsp;&gt;&gt;&nbsp;</span>
		  <h2>网盘</h2>
      <span class="txt-info">本页共${total_foldercnt}个文件夹 ${total_filecnt}个文件 | 容量：
      	<span class="g-probar" title="已使用${percent}">
        	<span style="width:${percent}"></span>
        </span>
        <span class="maxsize">${usedCapacity}/${totalCapacity}</span> 
        <strong><a id ="capacity_upgrade" href="javascript:void(0)">升级</a></strong>&nbsp;
        <a id="feedback" href="javascript:void(0)">意见反馈</a>&nbsp;
      </span>
		  <div class="ext">
			  <!--<a href="javascript:void(0)" class="lock"><img src="${lock_icon_url}" alt="${lock_alt_txt}"/></a>-->
			  <span class="mode">
				  显示：<a href="javascript:void(0)" id="list_mode" class="ico ico-mode ico-mode-list"></a> 
                <a href="javascript:void(0)" id="icon_mode" class="ico ico-mode ico-mode-pic"></a>
			  </span>
        <span class="srch">
					<span class="g-srch">
          	<span class="ipt-t ipt-t-dft">
            	<input id="srch_text" type="text" />
              <a href="javascript:;" class="btn btn-srch"></a>
              <span class="btn btn-advsrch"></span>
            </span>
			    </span>
        </span>
		  </div>
    </script>
    
    <script id="tmpl_frame_header" type="text/html">
    		<div>
       	<a id="header_path" href="javascript:void(0)">路径</a>：
        {{each paths}}
        	<a id="path_${$value.id}" class ="path_item" dirId=${$value.id} href="javascript:void(0)">${$value.dirName}</a>
          <span class="txt-info"> &gt;&gt; </span>
        {{/each}}
        ${curFolderName}
        <strong id ="upgrade163vip" style="position:absolute;right:0;top:0;display:none">
        	<a href="javascipt:void(0)">开启vip特权(18G)
          </a>
        </strong>
      </div>
    </script>
    <script id="tmpl_select_option" type="text/html">
    		<option value="${curPage}">${curPage}/${totalPage}</option>
    </script>
    <!--工具栏start-->
    <script id="tmpl_frame_toolbar" type="text/html">
      {{if (from_compose_page === true)}}
      	<div class="btngrp">
        <div id= "tb_confirm" class="btn btn-dft txt-b"><span>确定</span></div>
      </div>
      <div class="btngrp">
        <div id= "tb_cancel" class="btn btn-dft"><span>取消</span></div>
      </div>       
      {{else}}
      <div class="btngrp">
        <div id="tb_upload" class="btn btn-dft txt-b"><span>上 传</span></div>
      </div>
      <div class="btngrp">
        <div id= "tb_createfodler" class="btn btn-dft"><span>新建文件夹</span></div>
      </div>
      <div class="btngrp">
        <div id="tb_download" class="btn btn-dft btn-dft-gl" style="position:relative"><span>下 载</span></div>
        <div id="tb_del" class="btn btn-dft btn-dft-gc"><span>删 除</span></div>
        <div id="tb_send" class="btn btn-dft btn-dft-pd btn-dft-gc"><span>发 送</span><b class="arr"></b></div>
        <div id="tb_move" class="btn btn-dft btn-dft-gc"><span>移 动</span></div>
      </div>
      <div class="btngrp">
        <div id="tb_sort" class="btn btn-dft-pd btn-dft"><span>排 序</span><b class="arr"></b></div>
      </div>
      <div class="btngrp btngrp-ext">
        <a id="first_page" href="javascript:void(0)">首页</a>
        <a id="pre_page"   href="javascript:void(0)">上页</a>
        <a id="next_page"  href="javascript:void(0)">下页</a>
        <a id="last_page"  href="javascript:void()">末页</a>

        <select id="pagesel" name="page_no">
        </select>
      </div>
    {{/if}}
    </script>
    <!--工具栏end-->

		<!--upload对话框HTML-->
    <script id="tmpl_upload_dlg" type="text/html">
      <div>
			  <div id="absoluteDiv" style="position:absolute;"></div>
        <div id="divUploadContent" class="gSys-inner-netfolder">
          <div class="gSys-body upload">
            <div id="selectDiv" class="pos">文件上传位置： 
              <select id="flash_upload_folder">
              </select>
            </div>
            <div class="ln-thin ln-c-light"></div>
            <div class="buttons">
              <div class="ext txt-info">
                      网盘剩余容量：${usableSize}
              </div>
              <div class="btn btn-dft" id="divUpload">
                <span>上传文件</span>
              </div>
            </div>
            <div class="intro txt-info">
              <ul>
                <li><span class="dot">&middot;</span>网易网盘将永久保存您的重要文件，永不过期 </li>
                <li><span class="dot">&middot;</span>使用Flash支持批量文件上传（单个文件 ${sendLimit} M以内）</li>
                <li><span class="dot">&middot;</span>可预览缩略图，设置文件备注</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </script>
    <!--upload对话框HTML end-->

    <!-- 列表目录项-->
    <script id="tmpl_dir_item" type="text/html">
       <tr class="share" id="${id}" did=${id}><!--class = "share" - "over share" - "chked"-->
         <td class="wd0"><b class="ico ico-drag"></b></td>
        <td class="wd1 ckb"><input class="list-item-ckb" type="checkbox" /></td>
        <td class="wd2">
          <b class="ico ico-file ico-file-dir"></b>
          <a href="javascript:void(0)" class="name" iid=${id} dirid=${id}>${name}</a>
          <span class="txt-info"></span>
          <span class="txt-info memo">${memo}</span>
          <span class="txt-link" style="display:none" iid=${id}>[            
            <a href="javascript:void(0)" id= "zipdownload">打包下载</a> | 
            <a href="javascript:void(0)" id= "rename">改名</a> | 
            <a href="javascript:void(0)" id= "remark">备注</a>]
          </span>
        </td>
        <td class="wd3"></td>
        <td class="wd4"></td>
      </tr>       
    </script>

    <!-- 列表文件项-->   
    <script id="tmpl_file_item" type="text/html">
		<tr class="share" id="${id}"><!--class = "share" - "over share" - "chked"-->
       <td class="wd0"><b class="ico ico-drag"></b></td>
      <td class="wd1 ckb"><input class="list-item-ckb" type="checkbox" /></td>
      <td class="wd2">
        <b class="ico ico-file ico-file-${icon_index}"></b>
        <a href="javascript:void(0)" class="name" iid=${id}>${name}</a>
        <span class="txt-info memo">${info}</span>
        <span class="txt-link " style="display:none" iid=${id}><span>[</span>
          <span><a href="javascript:void(0)" id= "online_preview">预览</a> |</span>
          <span><a href="javascript:void(0)" id= "download">下载</a> |</span>
          <span><a href="javascript:void(0)" id= "sendbyemail">发送</a> |</span>
          <span style="display:none"><a href="javascript:void(0)" id= "remove_share">取消共享</a> |</span>           
          <span style="display:none"><a href="javascript:void(0)" id= "share">共享</a> |</span> 
          <span><a href="javascript:void(0)" id= "rename">改名</a> |</span> 
          <span><a href="javascript:void(0)" id= "remark">备注</a>]</span>
        </span>
        {{each shares}}
        <div class="share-info" id= "${$value.id}" style="display:none">
          <span class="col col1 txt-info">可下载数：<a href="javascript:void(0)" id="remain_download">${$value.sharedDDLimit}</a></span>
          <span class="col col2 txt-info">共享链接：<a href="${$value.shareURL}" target="_blank" id="share_url">${$value.shareURL}</a></span>
          <span class="col col3 txt-info">提取码：<span id="share_key">${$value.shareKey}</span></span>
        </div>
        {{/each}}
      </td>
      <td class="wd3">${size}</td>
      <td class="wd4">${date}</td>
    </tr>    
    </script>

    <!-- 图标目录项-->
    <script id="tmpl_dir_pic_item" type="text/html">   
      <div class="item">
        <div class="checkbox">
          <input id="${id}" type="checkbox" class="ipt-c">
        </div>
        <div class="cont">
          <a href="javascript:void(0)" class="pic pic-icon name" iid=${id}>
            <b class="ico ico-bfile ico-bfile-dir"></b>
          </a>
          <ul class="info">
            <li><a href="javascript:void(0)" class="name pic-name" iid=${id} dirid=${id}>${name}(${filecnt})</a></li>
            <li class="txt-info">${size}</li>
            <li class="txt-link">
	            <a href="javascript:void(0)" id="pic_zipdownload" iid=${id}>打包下载</a> |
              <a href="javascript:void(0)" id="pic_rename" fid="${id}">改名</a>
            </li>
          </ul>
        </div>
      </div>
    </script>

    <!-- 图标文件项-->
    <script id="tmpl_file_pic_item" type="text/html">
      <div class="item">
        <div class="checkbox"><input id="${id}" type="checkbox" class="ipt-c" /></div>
	      <div class="cont">
        	<div class="name file_pic" iid=${id} fname=${name}>${fileicon}</div>
          <ul class="info">
			      <li><a href="javascript:void(0)" class="name" iid=${id}>${name}</a></li>
            <li class="txt-info">${size} | ${date}</li>
            <li class="txt-link">
              <span style="display:none"><a href="javascript:void(0)" id="pic_delete">删除</a> |</span>
              <span style="display:none"><a href="javascript:void(0)" id="pic_preview">预览</a> |</span> 
              <span style="display:none"><a href="javascript:void(0)" target="_blank" id="pic_online_preview" style="display:none">预览</a> |</span> 
              <span style="display:none"><a href="javascript:void(0)" id="pic_play_music" style="display:none">试听</a> |</span> 
              <span><a href="javascript:void(0)" id="pic_download" fid=${id}>下载</a> |</span>
              <span style="display:none"><a href="javascript:void(0)" id="pic_send">发送</a> |</span>
              <span><a href="javascript:void(0)" id="pic_rename" fid=${id}>改名</a></span>
            </li>
          </ul>
	      </div>
      </div>
    </script>

    <!--upload对话框HTML-->
    <script id="tmpl_upload_dlg" type="text/html">
      <div>
			  <div id="absoluteDiv" style="position:absolute;"></div>
        <div id="divUploadContent" class="gSys-inner-netfolder">
          <div class="gSys-body upload">
            <div id="selectDiv" class="pos">文件上传位置： 
              <select>
               {{each folders}}
            	  <option>${$value.name}</option>
              {{/each}}
              </select>
            </div>
            <div class="ln-thin ln-c-light"></div>
            <div class="buttons">
              <div class="ext txt-info">
                      网盘剩余容量：${ConvertFileSize(usableSize)}
              </div>
              <div class="btn btn-dft" id="divUpload">
                <span>上传文件</span>
              </div>
            </div>
            <div class="intro txt-info">
              <ul>
                <li><span class="dot">&middot;</span>网易网盘将永久保存您的重要文件，永不过期 </li>
                <li><span class="dot">&middot;</span>使用Flash支持批量文件上传（单个文件 ${ConvertFileSize(sendLimit)} M以内）</li>
                <li><span class="dot">&middot;</span>可预览缩略图，设置文件备注</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </script>
    <!--upload对话框HTML end-->
    
    <!--move 对话框HTML-->
    <script id="tmpl_move_dlg" type="text/html">
    <div>
      <div class="gSys-inner-netfolder">
        <div class="gSys-body select">
            <div class="gSys-header">
                <b class="ico ico-info" title="提示："></b>
                <div class="ct">
                    <strong>${tips}</strong>
                </div>
            </div>
            <div class="folders">
                <iframe id="ifrSaveToNf" src="web/dir.htm" height="100%" width="100%" frameborder="0"></iframe>
            </div>
        </div>
        </div>
      </div>
		</script>
    <!--move 对话框HTML end-->

    <!--积分对话框-->
    <script id="tmpl_jifen_dlg" type="text/html">
    	<div>
      <p>
	      <strong>文件${name}可下载
		      <span class="txt-succ">${dllt}</span>次，已下载
		      <span class="txt-succ">${dlcnt}</span>次
	      </strong>
      </p>
      <p class="txt-12">增加：
	      <input id="wpJifenShareInput" type="text" class="ipt-t ipt-t-dft" value="5" maxlength="4" style="width:50px;ime-mode:Disabled" /> 次，将使用
        <span id="wpJifenShareSpan">50</span> 个邮箱积分
      </p>
      <p id="wpJifenShareP" class="txt-12 txt-err" style="display:none">您的积分不足，可减少次数</p>
      <p class="txt-12 txt-disabd">每次下载将使用 
        <span class="txt-succ">
  	      <strong>10</strong>
        </span> 积分，您当前有 
        <span class="txt-succ">
  	      <strong>${jifen}</strong>
        </span> 积分
      </p>
    </div>
    </script>
    
    <!--文件描述信息对话框HTML-->
    <script id="tmpl_file_info_dlg" type="text/html">
      <div>
        <div class="gSys-inner-netfolder">
          <div class="gSys-body edit">
            <table class="g-table-optcomm">
              <tr>
                <th>文件名：</th>
                <td>
                    <input id="filePre" type="text" class="ipt-t ipt-t-dft" value="${docName}" /> ${suffix}
                </td>
              </tr>
              <tr>
                <th>备注：</th>
                <td>
                    <textarea id="fileMemo" cols="50" rows="3" class="txt-info">${memo}</textarea>
                    <div id="fileMemoErr" class="txt-err">还可以输入50字</div>
                </td>
              </tr>
              <tr id="filetype" style="display:none">
                <th>文件类型：</th>
                <td><b class="ico ico-file ico-file-${icon_index}"></b>&nbsp;${suffix}文件</td>
              </tr>
              <tr id="filecount" style="display:none">
                <th>文件数：</th>
                <td>${filecnt}文件</td>
              </tr>
              <tr id="filesize" style="display:none">
                <th>文件大小：</th>
                <td>${ConvertFileSize(size)}</td>
              </tr>
              <tr id="foldersize" style="display:none">
                <th>文件大夹小：</th>
                <td>${ConvertFileSize(size)}</td>
              </tr>
              <tr>
                <th>所在位置：</th>
                <td>${path}</td>
              </tr>
              <tr id="uploadtime" style="display:none">
                <th>上传时间：</th>
                <td>${date}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </script>
    
    <!--基本模式上传HTML代码-->
    <script id="tmpl_normal_upload" type="text/html">
       <div class="g-title-1">
           <a id="path_wp" href="javascript:void(0)">网盘</a>
          <span class="txt-link sprt">&gt;&gt;</span>
          <h2>上传文件</h2>
          <span class="txt-info">(基本模式)</span>
          <span class="txt-info">容量：
            <span class="g-probar" title="已使用${percent}">
              <span style="width:${percent}"></span>
            </span>
            <span class="maxsize">${usedCapacity}/${totalCapacity}</span>
          </span>
      </div>
	    <div class="ln-thick ln-c-mid"></div>
	    <table class="gNetfolder-upload">
		    <tbody class="pos">
		    	<tr>
				   <th>上传位置：</th>
				   <td>
          	<select id="upload_dir" name="fid">
            </select>
           </td>
			   	</tr>
		    </tbody>
		    <form id="postForm" action="${action}" method="post" enctype="multipart/form-data" target="ifr_form_upload">
		    <tbody class="file">
			    <tr class="tips">
				    <th></th>
				    <td>
					    温馨提示：可上传100M以内的文件
				    </td>
			    </tr>
					<input name="uid" type="hidden" />
					<input name="product" type="hidden" />
					<input name="parentId" type="hidden" />
					<input name="nameConflictPolicy" type="hidden" />
					<input name="renamePolicy" type="hidden" />
					<input name="filename" type="hidden" />
					<input name="type" type="hidden" />
					<input name="callbackURL" type="hidden" />
          <input name="clear" type="reset" style="display:none"/>
          {{each items}}
			    <tr class="item">
				    <th>${$value.no}</th>
				    <td>
					    <input type="file" name=${$value.name} class="ipt-f" >
				    </td>
			    </tr>
         {{/each}}
			    <tr class="item" id="uploading" style="display:none">
				    <th></th>
				    <td>
					    <img src="http://mimg.126.net/xm/all/netfolder/100312/img/upload2.gif" alt="" style="margin-bottom:5px"/><br/><strong>上传中，请稍候…</strong>
				    </td>
			    </tr>
		    </tbody>
		    </form>
		    <tbody class="submit">
			    <tr>
				    <th></th>
				    <td>
					    <div class="btn btn-dft txt-b" id="startformupload"><span>开始上传</span></div>
					　  <div class="btn btn-dft txt-b" id="back_main_page"><span>返回</span></div>
				    </td>
			    </tr>
		    </tbody>	
	    </table>
	    <iframe id="ifr_form_upload" name="ifr_form_upload" src="" style="display:none"></iframe>   
    </script>
    
    <!--网盘升级HTML代码-->
    <script id="tmpl_upgrade_dlg" type="text/html">
      <!-- 顶栏 Start -->
       <div class="g-title-1">
        <a id="back_to_netfolder" href="javascript:void(0)">网盘</a><span class="txt-link sprt">&gt;&gt;</span><h2>网盘升级</h2>
      </div>
      <div class="ln-thick ln-c-mid"></div>
      <!-- 顶栏 End -->
      <div class="intro txt-info">
        <b class="ico ico-ntfdrup"></b>
        <p>网盘是网易邮箱为用户提供的文件储存服务，可随时随地上传和下载文档、照片、音乐、软件，快捷方便。只需要1个邮箱积分就能兑换到163M网盘，支持上传单个文件不超过50M，文件上传后永久保存！</p>
      </div>
      <div class="main">
        <p><strong>使用邮箱积分可兑换到更高容量网盘：</strong></p>
        <p>您目前拥有 <span class="txt-impt">${total_jifen}</span> 积分，最大可兑换 <span class="txt-match">${total_exchange_capacity}</span> 网盘&nbsp;&nbsp;&nbsp;
          <a id="get_jifen" href="javascript:void(0)">如何获取积分？</a>
        </p>
        <ul>
          <li id="owned_capacity" style="display:none">
            <!--进度条变灰：增加g-probar-disabd-->
            <span class="g-probar g-probar-disabd" style="${pixel_cnt}:px"><span></span></span><span class="num txt-info">${capacity}M</span><span class="txt-match">您目前拥有的网盘容量</span>
          </li>
					
          <li id="capacity_163">
      	    <span class="g-probar " style="width:28px"><span style="width:0"></span></span><span class="num txt-info">280M</span> 
				    <div class="ext">
						  <span class="condition fn-ib">需用<span class="txt-impt">1</span>积分升级</span>
				  	  <span class="btn btn-dft btn-dft-disabd"><span>兑 换</span></span>
				    </div>
			    </li>
          
          <li id="capacity_280">
      	    <span class="g-probar " style="width:58px"><span style="width:0"></span></span><span class="num txt-info">280M</span> 
				      <div class="ext">
						    <span class="condition fn-ib">需用<span class="txt-impt">800</span>积分升级</span>
				  	    <span class="btn btn-dft btn-dft-disabd"><span>兑 换</span></span>
				      </div>
			    </li>
         
		      <li id="capacity_512">
				    <span class="g-probar " style="width:105px"><span style="width:0"></span></span><span class="num txt-info">512M</span> 
				      <div class="ext">
					      <span class="condition fn-ib">需用<span class="txt-impt">1800</span>积分升级</span>
					      <span class="btn btn-dft btn-dft-disabd"><span>兑 换</span></span>
              </div>
			    </li>
		      <li id="capacity_2G">
				    <span class="g-probar " style="width:288px"><span style="width:0"></span></span><span class="num txt-info">2G</span> 
				    <div class="ext">
					    <span class="condition fn-ib">需开通随身邮包月服务</span>
					    <span class="btn btn-dft" ><span>开 通</span></span><a href="http://dxyy.mail.163.com/smspack/userconf/index.do" >点击了解</a>
			      </div>
			    </li>

        </ul>
      </div>
    </script>
  </head>
  <body>
		<div class="gNetfolder">
    <div id="wp_form_upload" style="display:none">
    </div>
    <div id="wp_main_page">
      <!-- 顶栏 Start -->
      <div class="g-title-1">
      </div>
			<!-- 顶栏 End -->
			<!--2010-5-19 增加提示栏-->
      <!--
		  <div class="tipsbar">
			  <b class="ico ico-alert"></b>温馨提示：<a href="#">免费绑定手机邮获取<em class="txt-impt">512M</em>网盘</a>
				<a href="#" class="btn btn-close">关闭</a>
			</div>
      -->
			<!--2010-6-2 增加路径-->
      <div class="path" style="position:relative">
      </div>
			<!-- 上工具栏 Start -->
      <div class="g-toolbar toolbar-top">
      </div>
      <div class="ln-thin ln-c-mid"></div>
			<!-- 上工具栏 End -->
      <!-- 图标 start -->      
      <div id="divPic" class ="gNetfolder-pic" style="display:none">
        <table class="g-table-comm">
          <thead>
	          <tr>
		          <th class="wd0"></th>
              <th class="wd1 ckb"><input id="picAllCheck" type="checkbox" /></th>
              <th class="wd2">全选</th>
            </tr>
          </thead>
          <tbody class="back" style="display:none">
	          <tr>
		          <td class="wd0"></td>
		          <td class="wd1 ckb"></td>
		          <td ><a class="back-parent" href="javascript:void(0)"><b class="ico ico-back"></b>返回上级</a></td>
	          </tr>
          </tbody>
        </table>       
      	<div id="pic_Body" class="piclist">
          <div class="nofile txt-info listempty" style="display:none">
	      		<strong>该文件夹没有文件</strong>
        		<strong style="display:none">没有找到相关<span class="txt-match"></span>的文件</strong>
        	</div>
        </div>
      </div>
      <!-- 图标 End -->      
      <!-- 列表 start -->
      <div id="divList" class="gNetfolder-list">
      	<table class="g-table-comm">
        	<thead>
          	<tr>
            	<th class="wd0"></th>
            	<th class="wd1 ckb"><input id="listAllCheck" type="checkbox" /></th>
            	<th id="header_filename" class="wd2">文件名<b id ="colicon_filename" class="ico ico-list-down" style="display:none"></th>
            	<th id="header_size" class="wd3">大小<b id="colicon_size" class="ico ico-list-down" style="display:none"></b></th>
            	<th id="header_time" class="wd4">时间<b id="colicon_time" class="ico ico-list-down" style="display:none"></b></th>
          	</tr>
        	</thead>
          <tbody class="back" style="display:none">
          	<tr>
               <td class="wd0"></td>
               <td class="wd1 ckb"></td>
               <td colspan="3"><a class="back-parent" href="javascript:void(0)"><b class="ico ico-back"></b>返回上级</a>
               </td>
            </tr>
          </tbody>
          <tbody class="listempty" style="display:none">
          	<tr>
               <td colspan="5" class="nofile txt-info">
               		<strong>该文件夹没有文件</strong>
                  <strong style="display:none">没有找到相关<span class="txt-match"></span>的文件</strong>
               </td>
            </tr>
          </tbody>
        	<tbody class="content-table">
        	</tbody>
      	</table>
      </div>
      <!-- 列表 end -->
			<!-- 下工具栏 Start -->
      <div class="g-toolbar toolbar-bottom">
      </div>
      <!-- 下工具栏 End -->
		</div>

		<!--下载下拉菜单-->
		<div class="g-menu" style="width:100px;display:none">
			<div class="g-menu-inner">
				<ul>
					<li class="txt-b"><a href="javascript:void(0);">下载</a></li>
					<!--<li><a href="javascript:void(0);">打包下载</a></li>-->
				</ul>
			</div>
		</div>
		<!--发送下拉菜单-->
		<div class="g-menu send-file" style="width:130px;display:none">
			<div class="g-menu-inner">
				<ul>
					<li><a href="javascript:void(0);" id = "tb_send_CommonAttachMent">以普通附件发送</a></li>
					<li><a href="javascript:void(0);" id = "tb_send_ShareAttachment">以共享附件发送</a><!--<a href="#" class="ext">[?]</a>--></li>
					</ul>
			</div>
		</div>
    <!--排序下拉菜单-->
    <div class="g-menu g-menu-hasico sort-file" style="width:120px;display:none">
			<div class="g-menu-inner">
				<ul class="tb-sort">
					<li><a id="tb_time_desc" href="javascript:void(0);"><b class="ico ico-slct ico-slct-radio" style="display:none"></b>时间从新到旧</a></li>
					<li><a id="tb_time_asc"  href="javascript:void(0);"><b class="ico ico-slct ico-slct-radio" style="display:none"></b>时间从旧到新</a></li>
					<li><a id="tb_size_desc" href="javascript:void(0);"><b class="ico ico-slct ico-slct-radio" style="display:none"></b>文件从大到小</a></li>
					<li><a id="tb_size_asc"  href="javascript:void(0);"><b class="ico ico-slct ico-slct-radio" style="display:none"></b>文件从小到大</a></li>
					<li><a id="tb_file_type" href="javascript:void(0);"><b class="ico ico-slct ico-slct-radio" style="display:none"></b>按文件类型</a></li>
          <li><a id="tb_file_name" href="javascript:void(0);"><b class="ico ico-slct ico-slct-radio" style="display:none"></b>按文件名</a></li>
				</ul>
			</div>
		</div>
    <!--排序下拉菜单 end-->
  </div>
  
  <div class="gNetfolderUpdate">
  </div>
  
  <iframe name="ifrmUtilRequest" src="about:blank" style="display:none"></iframe>
  </body>
</html>
