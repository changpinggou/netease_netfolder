<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ page isELIgnored="true" %>
<%@page import="com.netease.mail.fs.domain.dir.FSDirStats"%>
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
		<!--2010-5-19 网盘所有页面更改css url-->
		<!--
		<link href="css/style.css" rel="stylesheet" type="text/css" />
		-->
    <!--全局变量区-->
      <%
        FSDir fsDir = (FSDir)request.getAttribute("fsDir");
        PagedQueryInfo pagedQueryInfo = (PagedQueryInfo)request.getAttribute("pagedQueryInfo");
      %>

     <script type="text/javascript">
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
      	//gMaterData= <%=request.getAttribute("queryData") %>;
      	gMasterHost =undefined;//gMaterData.host;//webmail主机地址,jsp给出
      	gVer =undefined;// gMaterData.ver;        //webmail 版本
      	gUserName =undefined;// gMaterData.uid;   //webmail 用户名
      	gSid =undefined;// gMaterData.sid;        //webmail 会话ID
      	gStyle =undefined;// gMaterData.style;    //webmail 样式
      	gSkin =undefined;// gMaterData.skin;      //webmail 皮肤
      	gColor =undefined;// gMaterData.color;    //webmail 颜色
      	gRawClientData = undefined;//gMaterData.clientData; //客户端数据
       
       gSearchRange="";//搜索范围(JSP给出) 
       gSearchKeyWord ="";//搜索关键字
       gSearchDate = "";  //搜索时间
       gSearchSize = "";  //搜索大小
       gSearchType = "";   //搜索类型
     
       gFullDomain = undefined; //完全的主机域名
       gMailDomain = "163.com";     //获取邮箱域名
       gUsedCapacity =undefined;
       gUsableCapacity =undefined;
       gCapcity =undefined;

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
       gNFConfig ={
        pageSize : <%= pagedQueryInfo.getPageSize()%>,
        curPageIndex : <%= pagedQueryInfo.getPageIndex() %>,
        order : <%= pagedQueryInfo.getOrderBy() %>,
        nextStart : "<%= pagedQueryInfo.getNextStart() %>",
        totalPages : "<%= pagedQueryInfo.getPagesCount() %>"
       };
       gSearch = true; //表示搜索页面
	     gFile = <%= JSONArray.fromObject(fsDir.getFiles()) %>;
	     gFolder = [];
    </script>

    <link href="http://mimg.126.net/xm/all/netfolder/100603/css/style_101101.css" rel="stylesheet" type="text/css" />
    <script type="text/javascript" src="http://mimg.126.net/p/tools/jquery/jquery-1.3.2.min.js"></script>
    <script type="text/javascript" src="http://mimg.126.net/mailapi/webmailapi-1.1.0.min.utf8.js"></script> 
    <script language="javascript" src="js/backend.js"></script>
    <script language="javascript" src="js/tools.js"></script>    
    <script language="javascript" src="js/search.js"></script>
    
    <script id="tmpl_title_area" type="text/html">
       <a class="file_center" href="javascript:void(0)" style="text-decoration:none;">文件中心</a>
      <span id="spnFileCenter" style="">&nbsp;&gt;&gt;&nbsp;</span>
       
		  <h2>网盘</h2>
      <span class="txt-info">搜索到${total_result}个文件</span>
      
		  <div class="ext">
			  <span class="mode">
				  显示：<a href="javascript:void(0)" id="list_mode" class="ico ico-mode ico-mode-list ico-mode-list-on"></a> 
                <a href="javascript:void(0)" id="icon_mode" class="ico ico-mode ico-mode-pic"></a>
			  </span>
        <span id="miniSearchDiv" class="srch" style="display:none">
					<span class="g-srch">
          	<span class="ipt-t ipt-t-dft">
            	<input id="minikeyword" type="text" class="txt-info" value="搜索网盘" />
              <a href="javascript:void(0)" class="btn btn-srch"></a>
              <span class="btn btn-advsrch"></span>
            </span>
          </span>
			  </span>
      </div>
      
      <div class="srchinfo">搜索条件：
			    <span id="condictionSpan" class="txt-info">
				    关键词为<span class="txt-match">"${keyword}"</span>
				    搜索范围为<span class="txt-match">"${range}"</span>
				    时间为<span class="txt-match">"${date}"</span>
				    大小为<span class="txt-match">"${size}"</span>
				    类型为<span class="txt-match">"${type}"</span>
			    </span>
		  </div>
    </script>
    
    <script id="tmpl_select_option" type="text/html">
    		<option value="${curPage}">${curPage}/${totalPage}</option>
    </script>
    <!--工具栏start-->
    <script id="tmpl_frame_toolbar" type="text/html">
      <div class="btngrp">
        <a id="tb_return" class="btn btn-dft txt-b"><span>返 回</span></a>
      </div>
      <div class="btngrp">
        <div id="tb_download" class="btn btn-dft btn-dft-pd btn-dft-gl" style="position:relative"><span>下载</span></div>
        <div id="tb_del" class="btn btn-dft btn-dft-gc"><span>删 除</span></div>
        <div id="tb_move" class="btn btn-dft btn-dft-gc"><span>移 动</span></div>
      </div>
      <div class="btngrp btngrp-ext">
        <a id="first_page" href="javascript:void(0)">首页</a>
        <a id="pre_page"   href="javascript:void(0)">上页</a>
        <a id="next_page"  href="javascript:void(0)">下页</a>
        <a id="last_page"  href="javascript:void()">末页</a>

        <select id="pagesel" name="page_no">
        </select>
      </div>
    </script>
    <!--工具栏end-->

    <!-- 列表文件项-->   
    <script id="tmpl_file_item" type="text/html">
		<tr class="share" id="${id}"><!--class = "share" - "over share" - "chked"-->
       <td class="wd0"><b class="ico ico-drag"></b></td>
      <td class="wd1 ckb"><input class="list-item-ckb" type="checkbox" /></td>
      <td class="wd2">
        <b class="ico ico-file ico-file-${icon_index}"></b>
        <a href="javascript:void(0)" class="name" iid=${id}>${name}</a>
        <span class="txt-info memo" iid=${id}>${info}</span>
        <span class="txt-link " style="display:none" iid=${id}><span>[</span>
          <span><a href="javascript:void(0)" id= "online_preview">预览</a> |</span>
          <span><a href="javascript:void(0)" id= "download">下载</a> |</span>
          <span><a href="javascript:void(0)" id= "sendbyemail">发送</a> |</span>
          <span><a href="javascript:void(0)" id= "rename">改名</a> |</span> 
          <span><a href="javascript:void(0)" id= "remark">备注</a>]</span>
        </span>
      </td>
      <td class="wd5"><a href="javascript:void(0)" class="item_path" fid=${parentId}></a>${path}</td>
      <td class="wd3">${size}</td>
      <td class="wd4">${date}</td>
    </tr>    
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
  </head>
  <body>
		<div class="gNetfolder">
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
      <div class="path">
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
              <th id="header_location" class="wd5">位置</th>
            	<th id="header_size" class="wd3">大小<b id="colicon_size" class="ico ico-list-down" style="display:none"></b></th>
            	<th id="header_time" class="wd4">时间<b id="colicon_time" class="ico ico-list-down" style="display:none"></b></th>
          	</tr>
        	</thead>
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
  </body>
</html>
