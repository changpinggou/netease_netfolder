<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
%>

<c:set var="fileId" value="${fsFile.id}" /><%-- 文件id --%>
<c:set var="fileName" value="${fsFile.fileName}" /><%-- 文件名 --%>
<c:set var="fileSize" value="${fsFile.doc.size}" /><%-- 文件大小 --%>
<c:set var="docURL" value="${fsFile.doc.URL}" /><%-- 文件url --%>

<c:set var="sharedDDCount" value="${fsFile.shares[0].actState.options.sharedDDCount}" /><%-- 已下载次数 --%>
<c:set var="sharedDDLimit" value="${fsFile.shares[0].config.options.sharedDDLimit}" /><%-- 可下载总次数 --%>

<c:choose>
	<c:when test="${fullDomain eq 'mail.163.com'}">
		<c:set var="header_url" value="http://mail.163.com" />	
		<c:set var="header_logo_url" value="http://mimg.126.net/logo/163logo-s.gif" />
		<c:set var="free_email_url" value="http://email.163.com" />
		<c:set var="help_url" value="http://zhidao.mail.163.com/zhidao/newquiz.jsp#网易网盘" />
		<c:set var="feedback_url" value="http://zhidao.mail.163.com/zhidao/newquiz.jsp#网易网盘" />
		<c:set var="spamcomplaint_url" value="http://spamcomplaint.mail.163.com/spamcomplaint/reportIndex.jsp" />
	</c:when>
	<c:when test="${fullDomain eq 'mail.126.com'}">
		<c:set var="header_url" value="http://mail.126.com/" />	
		<c:set var="header_logo_url" value="http://mimg.126.net/logo/126logo-s.gif" />
		<c:set var="free_email_url" value="http://email.163.com" />
		<c:set var="help_url" value="http://help.163.com/special/00753VB9/126mail_adv_guide.html?id=2964" />
		<c:set var="feedback_url" value="http://zhidao.mail.126.com/zhidao/newquiz.jsp#网易网盘" />
		<c:set var="spamcomplaint_url" value="http://spamcomplaint.mail.126.com/spamcomplaint/reportIndex.jsp" />
	</c:when>
	<c:when test="${fullDomain eq 'mail.yeah.net'}">
		<c:set var="header_url" value="http://mail.yeah.net/" />	
		<c:set var="header_logo_url" value="http://mimg.126.net/logo/yeahlogo-s.gif" />
		<c:set var="free_email_url" value="http://email.163.com" />
		<c:set var="help_url" value="http://help.163.com/special/00753VBA/yeah_adv_guide.html?id=2327" />
		<c:set var="feedback_url" value="http://zhidao.mail.yeah.net/zhidao/newquiz.jsp#网易网盘" />
		<c:set var="spamcomplaint_url" value="http://spamcomplaint.mail.yeah.net/spamcomplaint/reportIndex.jsp" />
	</c:when>
</c:choose>
<html>
<head>
<base href="<%=basePath%>" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="CopyRight" content="NetEase,163" />
<meta name="author" content="apple chang" />
<meta name="Time" content="2011-6-15" />
<meta name="keywords" content="" />
<meta name="description" content="" />
<link rel="stylesheet" href="http://mimg.126.net/xm/all/netfolder/100603/share/css/style.css" type="text/css" />
<script type="text/javascript" src="http://mimg.126.net/p/tools/jquery/jquery-1.3.2.min.js"></script>
<script type="text/javascript">

/**
相关域的信息
 */

	gDomainMisc ={
		header_url       : "${header_url}",
		header_logo_url  : "${header_logo_url}",
		free_email_url   : "${free_email_url}",
		help_url         : "${help_url}",
		feedback_url     : "${feedback_url}",
		spamcomplaint_url: "${spamcomplaint_url}"
	}
/**
 * 网盘文件ico配置
 * @method  fileIco 
 * @return  {void}
 * @for Read
 */
fileIcoSet = {
	"ext.xls":"2","ext.xlsx":"2","ext.csv":"2",
	"ext.doc":"3","ext.docx":"3","ext.wps":"3",
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
	"ext.torrent":"42"
};

/**
 * 返回格式化后的大小
 * @param   {string}sSize 大小的字符串
 * @return  {string} 返回格式化后的大小
 */
function fCommonConvertSize(nSize, nFlag){
	nFlag = nFlag || 100;
	if(nSize == 0){
		return 0;
	}else if(nSize < 1024){
		return nSize + "B";
	}else if(nSize < 1024*1024){
		return Math.round(nSize/1024 * nFlag)/nFlag + "K";
	}else if(nSize < 1024*1024*1024){
		return Math.round(nSize/(1024*1024) * nFlag)/nFlag + "M";
	}else{
		return Math.round(nSize/(1024*1024*1024) * nFlag)/nFlag + "G";
	}
};

function fWpVerify(){
	var oInput = jQuery("#pickupCode");
  if(oInput.val().replace(/(^\s*)|(\s*$)/g, "")==""){
  	jQuery("#divCodeError")[0].style.display="";
		jQuery("#spanCodeError").html("提取码不能为空");
     return;
  }else{
  	jQuery("#divCodeError")[0].style.display="none";
  }
  var downloadURL ="http://cloud.mail.163.com/dfs/service/";
  var nfhost = "http://nf.mail.163.com";//obj.nfhost;测试
  var op =  "getDownloadCert"; 
  var username = "mailfortest01@163.com";//obj.username;测试
  var productSuffix = "mail.163";                  //邮箱域名
  var postdata = {
  	uid : "11127",          //完整的邮箱帐号名。必须指定
		id : ${fileId},         //有效的文件ID。	必须指定
    //owner : this.uid,//完整的邮箱帐号名。	非拥有者下载需指定
    //offset : 0,      //分块下载需指定。
    //length : 0,      //块大小,分块下载需指定。
    shareKey : oInput.val()     //共享下载码	 否		最长32个有效ASCⅡ字符。	非拥有者下载需指定。
  };
  var dlurl = window.downloadURL + "${fileName}" + "?op=downloadFile&uid=11127&file=";
  var result;
  jQuery.ajax({
    cache: false,
    async : true,
    url: nfhost + "/netfolder/service?op=" + op + "&product=cloudstorage."+productSuffix+"&uid=" + username,
    beforeSend: function(xhr) {
    },
    type: (postdata !== undefined) ? "POST" : "GET",
    data: postdata,
    dataType: "json",
    success: function(data) {
    		result =data;
    },
    complete: function() {
    		if(result && (result.code==200)){
        	window.open(dlurl + result.result.token.docURL);
       }else if(result && (result.code==500)){
         jQuery("#divCodeError")[0].style.display="";
         jQuery("#spanCodeError").html("服务器内部错误");
       }else if(result && (result.code==602)){
         jQuery("#divCodeError")[0].style.display="";
         jQuery("#spanCodeError").html("提取码错误，请核对后重新输入");
       }else{
       	jQuery("#divCodeError")[0].style.display="";
         jQuery("#spanCodeError").html("其他错误");
       }
    }
  });  
};
</script>
<title>网盘共享</title>

</head>

<body>
<!-- S 页面容器 -->
<div class="container">
	<!-- S 头部 -->
	<div class="header">
		<a class="logo" id="header_url" href="${header_url}" target="_blank" title="163网易免费邮">
			<img src="${header_logo_url}" alt="163网易免费邮" />
		</a>
		<span>网盘文件下载</span>
		<div class="opt"><a id="free_email" href="${free_email_url}" target="_blank" title="网易免费邮">网易免费邮</a> | <a href="${help_url}" target="_blank" title="帮助">帮助</a> | <a href="${feedback_url}" target="_blank" title="反馈">反馈</a></div>
	</div>
	<!-- E 头部 -->
	<!-- S 蓝色间隔线 -->
	<div class="fn-bg p-bg-ln"></div>
	<!-- E 蓝色间隔线 -->
	<!-- S 中部 -->
	<div class="main">
		<!-- S 下载区域 -->
		<div class="download">
			<div class="attachment-icon">
				<script language="javascript">document.write('<b class="ico ico-bfile ico-bfile-'+fileIcoSet[("${fileName}".replace(/(.|\n)*\./,"ext.")).toLowerCase()]+'"></b>');</script>
			</div><!-- 文件图标 -->
			<div class="attachment-name">
				${fileName}
			</div><!-- 附件名称 -->
			<div class="attachment-info">
				文件大小：<script language="javascript">document.write(fCommonConvertSize(${fileSize}));</script>
				<br/>
				已下载：<span id="wpHasDownTime"></span>${sharedDDCount}次<br />
				可下载：<em id="wpDownLeaveTime" class='em-main ' >${sharedDDLimit - sharedDDCount}</em>次
				<!-- S 提示语言 -->
				<br />
			</div>
			<div class="attachment-download">
      <form>
      	<fieldset>
			    <strong>输入提取码：</strong>
			  	<!-- 1、禁用输入框 disabled class="ipt-text ipt-text-disable" 2、激活输入框  class="ipt-text" -->
			  	<input id="pickupCode" class="ipt-text" type="text" value="" />&nbsp;&nbsp;&nbsp;<!-- <a href="" target="_blank">如何获得提取码</a>	-->
        	<div id="divCodeError" class="tips tips-error" style="display:none">
						<div class="fn-bg bg-l-arrow"></div>
						<div class="fn-bg bg-r-rad"></div>
						<span id="spanCodeError"></span>
					</div>
        	<!-- E 提示语言-->
					<br/>
					<!--1、禁用按钮 class="btn btn-big-disable" 2、激活按钮 class="btn btn-big" -->
        	<a id="wpDownloadHref" href="javascript:void(0)" onclick="fWpVerify();return false;" class="btn btn-big" ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 下&nbsp;&nbsp; 载&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></a>&nbsp;&nbsp;
				</fieldset>
      </form>				
        <span class="remark remark-attachment">注：如果此资源包含不符合国家法律的相关内容或信息，请
				
        <script language="JavaScript">
				<!--
           //var anchor='<a href="';
           //var spamcomplaint_param = '?ownerUid=chenjian63@163.com&filekey=1Ux1SsvkjqYy-nIL-9vqTy3W718ZrXKyTZA1Sn2LjgKCTyCy-nIL-9vqTy3Won2Lz48ZrXKyTZAdan7ErcGpS4APTuYBzstMfeYpz48mjeIk-s71UUUUeU2l39EtjqanVW8XFWktF4UZr43XF17yVZFPasKQUZCmaUtsU18USUjgUnkUTUj2U1kUTJjWU8xUTDjgU88U3JUKU1DU47jBU88U7DjWU05=&filesize=8192&currentDownloaded=1&filename='+encodeURIComponent("陈健_2010年第三季度工作总结1.doc");
           //var temp ='" target="_blank" title="进行举报">进行举报</a>';
           //document.write(anchor +spamcomplaint_url+spamcomplaint_param+ temp);
				-->
				</script>
				</span>
			</div>
		</div>
		<!-- E 下载区域 -->

		<!-- S 侧栏开始 -->
		<div class="aside">
			<div class="ad-l">
				<a href="http://mail.163.com/html/110127_imap/index.htm" target="_blank">
        <img src="http://mimg.126.net/xm/all/netfolder/100603/share/img/ad-imap-260x300.jpg" /></a>
			</div>
		</div>
		<!-- E 侧栏开始 -->
	</div>
	<!-- E 中部-->
	<!-- S 底部 -->
	<div class="footer">
		<a href="http://corp.163.com/index_gb.html" target="_blank" title="关于网易">关于网易</a>&nbsp;&nbsp;
		<a href="http://mail.163.com/html/mail_intro" target="_blank" title="关于网易免费邮">关于网易免费邮</a>&nbsp;&nbsp;
		<a href="http://mail.blog.163.com/" target="_blank" title="邮箱官方博客">邮箱官方博客</a>&nbsp;&nbsp;
		<a href="http://help.163.com" target="_blank" title="客户服务">客户服务</a>&nbsp;&nbsp;
		<a href="http://corp.163.com/gb/legal/legal.html" target="_blank" title="相关法律">相关法律</a>&nbsp;&nbsp;
		网易公司版权所有 &copy; 1997-<script language="javascript" src="http://mimg.163.com/copyright/year.js"></script>
	</div>
	<!-- E 底部 -->
	<span style="display:none"></span>
</div>
</body>
</html>