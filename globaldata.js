  var gFolderName = "网盘/";
  var gNFConfig ={};
  var gCurDirStats ={"dirsCount":2,"filesCount":26,"filesSize":240506,"id":1020,"ownerId":11127};
  var gReqListUrl="http://nf.mail.163.com/netfolder/web/list.do";
  var gReqListParam ="?uid=mailfortest01@163.com&id=-1&getFiles=1&getShareInfo=0&nextStart=-&pageIndex=2&pageSize=10&pagesCount=1&orderBy=0&desc=0"
  var gPageSize =20;
  var GE={};
  var gUploadJsUrl = "upload.js";// 相对地址(测试)
  var gSwfUrl = "upload2.swf";   //flash上传控件地址
  var gAllCount;
  var gShowMode;
  var gRawClientData;
  var gFolderCount;
  var gFileCount	 = 14;
  var gFolerCheck;
  var gFileChect;
  var gFolderBegin;	// 文件夹遍历起始位置，因为文件夹接口不支持翻页，所以如果判断起始位置小于文件夹数目，就取全部文件夹，然后再分段输出
  var gDownloadUrl	= "http://webmail.mail.163.com/app/wp/doGetFile.jsp?sid=EBkkkoMMYoHZOEcxvzMMxsRKtYYVdFub&mode=download";
  var gPackUrl		= "doPack.jsp?sid=EBkkkoMMYoHZOEcxvzMMxsRKtYYVdFub";
  var gSortUrl		= "list.jsp?sid=EBkkkoMMYoHZOEcxvzMMxsRKtYYVdFub";
  var gParentUrl		= "";
  var gPrevOnlineUrl	= "http://preview.mail.163.com/preview?sid=EBkkkoMMYoHZOEcxvzMMxsRKtYYVdFub&keyfrom=wp163.com";
  var gBaseTypeDescUrl= "list.jsp?sid=EBkkkoMMYoHZOEcxvzMMxsRKtYYVdFub&desc=true&ver=js35";
  var gPrevPicUrl		= "http://webmail.mail.163.com/app/wp/doGetFile.jsp?sid=EBkkkoMMYoHZOEcxvzMMxsRKtYYVdFub&mode=inline"; // 图标预览URL
  var gActionUrl		= "doAction.jsp?sid=EBkkkoMMYoHZOEcxvzMMxsRKtYYVdFub"; // 网盘操作统一入口
  var gTreeUrl		= "tree.jsp?sid=EBkkkoMMYoHZOEcxvzMMxsRKtYYVdFub";		// 文件夹树形结果页面
  var gMiniSearchUrl	= "search.jsp?sid=EBkkkoMMYoHZOEcxvzMMxsRKtYYVdFub&recursive=true&nf_search=true&backfid=1442983";
  //var gUploadUrl		= "http://webmail.mail.163.com/app/wp/upload.jsp?sid=EBkkkoMMYoHZOEcxvzMMxsRKtYYVdFub&type=flash&fixname=true";
  var gUploadUrl = "http://fs.mail.163.com/fs/formUpload";
  var gCheckUrl		= "http://webmail.mail.163.com/app/wp/doCheck.jsp?sid=EBkkkoMMYoHZOEcxvzMMxsRKtYYVdFub";
  var gUploadJs		= "http://mimg.126.net/p/app/wp/js/1101050957/upload.js";
  var gMiscJsUrl     ="http://nf.mail.163.com/netfolder/js/misc.js";// 绝对地址(测试)
  var gFormUrl		= "form.jsp?sid=EBkkkoMMYoHZOEcxvzMMxsRKtYYVdFub&fid=1442983";
  var gLockUrl		= "http://advlock.mail.163.com/advlock/Login.do?sid=&username=changpinggou@163.com&tounlock=@nf&style=jy3&host=webmail.mail.163.com";
  var gSelectCount = 0;
  var gOrder	= "date";
  var gDesc	= "true";
  var gSend   = ""; // 是否是发送页面
  var gVer	= "js35";
  var gImageList	 = [];
  var gImageIndex	 = {};
  var gPrewNumber;// 缩略图模式每页显示数目
  var gUploadLimitM = 100;	  // 单次上传限制M
  var gSendLimitM	  = 51;   //
  var gUsableSize   =102400000; // 网盘剩余容量
  var gUsedCapacity = 20;
  var gSearch = false;
  var gCapcity =10000;
  var gUsableCapacity= 1000;
  var gDownloadURL =undefined;
  var gZipDownloadURL=undefined;
  var gUploadCallbackUrl = "http://nf.mail.163.com/netfolder/uploadcallback.html";//测试用
  var gJifen = 1000;
  var gPageScrollUrl="location.href='list.jsp?sid=NADguLmmrBQqKanhfBmmUXjIaQWlHBzQ&desc=true&ver=js35&fid=1442984&page_no=' + this.value;";
  var gSearch;
  var gPathStack = [];
  var gCurDirId = 1020; 
  var gSid =undefined;
  var gPreviewURL= undefined;
  var gFormUploadURL =undefined;
  var gMailDomain ="163.com";
  var gMasterHost=undefined;
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
  var gFullDomain;
  var gUid= undefined;
  var gLocked = 2;  //网盘是否加锁1-加锁 2-没有加锁
  var gUserName =undefined;
  var gFullDomain ="mail.163.com";
  gFolder = [{"createTime":1305599943749,
  "description":"描述",
  "dirName":"testUpdate",
  "files":[],
  "id":1295,
  "namePath":"/",
  "owner":"mailfortest01@163.com",
  "ownerId":11127,
  "parentId":1020,
  "path":"/",
  "status":0,
  "subdirs":[],
  "sysType":0,
  "type":0,
  "updateTime":1305637025203000000,
  "version":{"type":1,"value":"1305637025203000000|1305637025203000000"}},
  
  {"createTime":1305600017505,
   "description":"描述",
   "dirName":"test1",
   "files":[],
   "id":1298,
   "namePath":"/",
   "owner":"mailfortest01@163.com",
   "ownerId":11127,
   "parentId":1020,
   "path":"/",
   "status":0,
   "subdirs":[],
   "sysType":0,
   "type":0,
   "updateTime":1305600017505000000,
   "version":{"type":0,"value":"1305600017505000000|1305600017505000000"}}];
   

    gFile = [{"config":{"options":{"sizeLimit":0}},"createTime":1306389244266,"creator":"mailfortest01@163.com","creatorId":11127,"description":"","doc":{"URL":"","md5High":1475346231,"md5Low":-488737346,"size":1052,"type":0},"fileName":"instantmail.rgs.m4","id":55118,"owner":"mailfortest01@163.com","ownerId":11127,"parentId":1020,"shares":[],"status":0,"type":0,"updateTime":1306389244266000000,"version":{"type":0,"value":"1306389244266000000|1306389244266000000"}},{"config":{"options":{"sizeLimit":0}},"createTime":1306389332013,"creator":"mailfortest01@163.com","creatorId":11127,"description":"","doc":{"URL":"","md5High":-213257,"md5Low":-1073746529,"size":4293,"type":0},"fileName":"mycredentials.pfx","id":55121,"owner":"mailfortest01@163.com","ownerId":11127,"parentId":1020,"shares":[],"status":0,"type":0,"updateTime":1306389332013000000,"version":{"type":0,"value":"1306389332013000000|1306389332013000000"}},{"config":{"options":{"sizeLimit":0}},"createTime":1306389346376,"creator":"mailfortest01@163.com","creatorId":11127,"description":"","doc":{"URL":"","md5High":1860169469,"md5Low":-402798694,"size":384872,"type":0},"fileName":"ACCDDSLM.DLL","id":55122,"owner":"mailfortest01@163.com","ownerId":11127,"parentId":1020,"shares":[],"status":0,"type":0,"updateTime":1306389346376000000,"version":{"type":0,"value":"1306389346376000000|1306389346376000000"}},{"config":{"options":{"sizeLimit":0}},"createTime":1306389348124,"creator":"mailfortest01@163.com","creatorId":11127,"description":"","doc":{"URL":"","md5High":-25180900,"md5Low":-41943298,"size":404320,"type":0},"fileName":"ACCDDSF.DLL","id":55123,"owner":"mailfortest01@163.com","ownerId":11127,"parentId":1020,"shares":[],"status":0,"type":0,"updateTime":1306389348124000000,"version":{"type":0,"value":"1306389348124000000|1306389348124000000"}},{"config":{"options":{"sizeLimit":0}},"createTime":1306389360247,"creator":"mailfortest01@163.com","creatorId":11127,"description":"","doc":{"URL":"","md5High":-302138369,"md5Low":-2105363,"size":2204,"type":0},"fileName":"msxpsdrv.inf","id":55124,"owner":"mailfortest01@163.com","ownerId":11127,"parentId":1020,"shares":[{"actState":{"options":{"anonyDDCount":0,"exchangeDDCount":0,"ownerDDCount":0,"sharedDDCount":0}},"config":{"options":{"anonyAccess":0,"anonyDDActDuration":1,"anonyDDLimit":10,"exchangeDDLimit":80,"otherDDLimit":10,"ownerAccessOnly":0,"ownerDDActDuration":15,"ownerDDLimit":80,"shareDuration":15,"sharedDDActDuration":3,"sharedDDLimit":10}},"createTime":0,"expiryTime":-1,"fileId":0,"id":1,"shareKey":"000001","shareTarget":"","shareURL":"XXXXXXXXXXXXXX","shared":true,"sharer":"","sharerId":11127},{"actState":{"options":{"anonyDDCount":0,"exchangeDDCount":0,"ownerDDCount":0,"sharedDDCount":0}},"config":{"options":{"anonyAccess":0,"anonyDDActDuration":1,"anonyDDLimit":10,"exchangeDDLimit":80,"otherDDLimit":10,"ownerAccessOnly":0,"ownerDDActDuration":15,"ownerDDLimit":80,"shareDuration":15,"sharedDDActDuration":3,"sharedDDLimit":10}},"createTime":0,"expiryTime":-1,"fileId":0,"id":1,"shareKey":"000002","shareTarget":"","shareURL":"XXXXXXXXXXXXXX","shared":true,"sharer":"","sharerId":11127},{"actState":{"options":{"anonyDDCount":0,"exchangeDDCount":0,"ownerDDCount":0,"sharedDDCount":0}},"config":{"options":{"anonyAccess":0,"anonyDDActDuration":1,"anonyDDLimit":10,"exchangeDDLimit":80,"otherDDLimit":10,"ownerAccessOnly":0,"ownerDDActDuration":15,"ownerDDLimit":80,"shareDuration":15,"sharedDDActDuration":3,"sharedDDLimit":10}},"createTime":0,"expiryTime":-1,"fileId":0,"id":1,"shareKey":"000003","shareTarget":"","shareURL":"XXXXXXXXXXXXXX","shared":true,"sharer":"","sharerId":11127},{"actState":{"options":{"anonyDDCount":0,"exchangeDDCount":0,"ownerDDCount":0,"sharedDDCount":0}},"config":{"options":{"anonyAccess":0,"anonyDDActDuration":1,"anonyDDLimit":10,"exchangeDDLimit":80,"otherDDLimit":10,"ownerAccessOnly":0,"ownerDDActDuration":15,"ownerDDLimit":80,"shareDuration":15,"sharedDDActDuration":3,"sharedDDLimit":10}},"createTime":0,"expiryTime":-1,"fileId":0,"id":1,"shareKey":"000004","shareTarget":"","shareURL":"XXXXXXXXXXXXXX","shared":true,"sharer":"","sharerId":11127}],"status":0,"type":0,"updateTime":1306389360247000000,"version":{"type":0,"value":"1306389360247000000|1306389360247000000"}},{"config":{"options":{"sizeLimit":0}},"createTime":1306389360626,"creator":"mailfortest01@163.com","creatorId":11127,"description":"","doc":{"URL":"","md5High":-1121976337,"md5Low":989426157,"size":73,"type":0},"fileName":"msxpsinc.gpd","id":55125,"owner":"mailfortest01@163.com","ownerId":11127,"parentId":1020,"shares":[],"status":0,"type":0,"updateTime":1306389360626000000,"version":{"type":0,"value":"1306389360626000000|1306389360626000000"}},{"config":{"options":{"sizeLimit":0}},"createTime":1306389361117,"creator":"mailfortest01@163.com","creatorId":11127,"description":"","doc":{"URL":"","md5High":-88608809,"md5Low":-268828705,"size":72,"type":0},"fileName":"msxpsinc.ppd","id":55126,"owner":"mailfortest01@163.com","ownerId":11127,"parentId":1020,"shares":[],"status":0,"type":0,"updateTime":1306389361117000000,"version":{"type":0,"value":"1306389361117000000|1306389361117000000"}},{"config":{"options":{"sizeLimit":0}},"createTime":1306389362388,"creator":"mailfortest01@163.com","creatorId":11127,"description":"","doc":{"URL":"","md5High":-335577387,"md5Low":2013263547,"size":748032,"type":0},"fileName":"mxdwdrv.dll","id":55127,"owner":"mailfortest01@163.com","ownerId":11127,"parentId":1020,"shares":[],"status":0,"type":0,"updateTime":1306389362388000000,"version":{"type":0,"value":"1306389362388000000|1306389362388000000"}},{"config":{"options":{"sizeLimit":0}},"createTime":1306389364226,"creator":"mailfortest01@163.com","creatorId":11127,"description":"","doc":{"URL":"","md5High":-537773638,"md5Low":-677380097,"size":2936832,"type":0},"fileName":"xpssvcs.dll","id":55128,"owner":"mailfortest01@163.com","ownerId":11127,"parentId":1020,"shares":[],"status":0,"type":0,"updateTime":1306389364226000000,"version":{"type":0,"value":"1306389364226000000|1306389364226000000"}},{"config":{"options":{"sizeLimit":0}},"createTime":1306389406662,"creator":"mailfortest01@163.com","creatorId":11127,"description":"","doc":{"URL":"","md5High":-1073784897,"md5Low":-268534785,"size":1020,"type":0},"fileName":"INFOPATH.PIP","id":55129,"owner":"mailfortest01@163.com","ownerId":11127,"parentId":1020,"shares":[],"status":0,"type":0,"updateTime":1306389406662000000,"version":{"type":0,"value":"1306389406662000000|1306389406662000000"}},{"config":{"options":{"sizeLimit":0}},"createTime":1306389408044,"creator":"mailfortest01@163.com","creatorId":11127,"description":"","doc":{"URL":"","md5High":1992294351,"md5Low":-334780834,"size":953192,"type":0},"fileName":"ACCDDS.DLL","id":55130,"owner":"mailfortest01@163.com","ownerId":11127,"parentId":1020,"shares":[],"status":0,"type":0,"updateTime":1306389408044000000,"version":{"type":0,"value":"1306389408044000000|1306389408044000000"}},{"config":{"options":{"sizeLimit":0}},"createTime":1306389408908,"creator":"mailfortest01@163.com","creatorId":11127,"description":"","doc":{"URL":"","md5High":-402671077,"md5Low":1979561399,"size":71504,"type":0},"fileName":"excelcnvpxy.dll","id":55131,"owner":"mailfortest01@163.com","ownerId":11127,"parentId":1020,"shares":[],"status":0,"type":0,"updateTime":1306389408908000000,"version":{"type":0,"value":"1306389408908000000|1306389408908000000"}},{"config":{"options":{"sizeLimit":0}},"createTime":1306389967009,"creator":"mailfortest01@163.com","creatorId":11127,"description":"","doc":{"URL":"","md5High":-2170933,"md5Low":1863319215,"size":6246194,"type":0},"fileName":"阿桑-心甘情愿.mp3","id":55133,"owner":"mailfortest01@163.com","ownerId":11127,"parentId":1020,"shares":[],"status":0,"type":0,"updateTime":1306389967009000000,"version":{"type":0,"value":"1306389967009000000|1306389967009000000"}},{"config":{"options":{"sizeLimit":0}},"createTime":1306391126080,"creator":"mailfortest01@163.com","creatorId":11127,"description":"","doc":{"URL":"","md5High":-808009730,"md5Low":-134226945,"size":2106,"type":0},"fileName":"urs_checker.cc","id":55158,"owner":"mailfortest01@163.com","ownerId":11127,"parentId":1020,"shares":[],"status":0,"type":0,"updateTime":1306391126080000000,"version":{"type":0,"value":"1306391126080000000|1306391126080000000"}},{"config":{"options":{"sizeLimit":0}},"createTime":1306392566561,"creator":"mailfortest01@163.com","creatorId":11127,"description":"","doc":{"URL":"","md5High":-945001219,"md5Low":-1095238657,"size":7149,"type":0},"fileName":"Robo.2010.Bluray.720p.DTS.x264-CHD.nfo","id":55170,"owner":"mailfortest01@163.com","ownerId":11127,"parentId":1020,"shares":[],"status":0,"type":0,"updateTime":1306392566561000000,"version":{"type":0,"value":"1306392566561000000|1306392566561000000"}},{"config":{"options":{"sizeLimit":0}},"createTime":1306392616290,"creator":"mailfortest01@163.com","creatorId":11127,"description":"","doc":{"URL":"","md5High":-134227205,"md5Low":-1216348169,"size":8953966,"type":0},"fileName":"gvim72_PConline.exe","id":55171,"owner":"mailfortest01@163.com","ownerId":11127,"parentId":1020,"shares":[],"status":0,"type":0,"updateTime":1306392616290000000,"version":{"type":0,"value":"1306392616290000000|1306392616290000000"}},{"config":{"options":{"sizeLimit":0}},"createTime":1306392851227,"creator":"mailfortest01@163.com","creatorId":11127,"description":"","doc":{"URL":"","md5High":-661519,"md5Low":2079776495,"size":792,"type":0},"fileName":"down.jsp","id":55177,"owner":"mailfortest01@163.com","ownerId":11127,"parentId":1020,"shares":[],"status":0,"type":0,"updateTime":1306392851227000000,"version":{"type":0,"value":"1306392851227000000|1306392851227000000"}},{"config":{"options":{"sizeLimit":0}},"createTime":1306392851298,"creator":"mailfortest01@163.com","creatorId":11127,"description":"","doc":{"URL":"","md5High":-864026658,"md5Low":1957455471,"size":11347,"type":0},"fileName":"file.jsp","id":55178,"owner":"mailfortest01@163.com","ownerId":11127,"parentId":1020,"shares":[],"status":0,"type":0,"updateTime":1306392851298000000,"version":{"type":0,"value":"1306392851298000000|1306392851298000000"}},{"config":{"options":{"sizeLimit":0}},"createTime":1306392851482,"creator":"mailfortest01@163.com","creatorId":11127,"description":"","doc":{"URL":"","md5High":2130706109,"md5Low":-96486157,"size":192,"type":0},"fileName":"option.jsp","id":55179,"owner":"mailfortest01@163.com","ownerId":11127,"parentId":1020,"shares":[],"status":0,"type":0,"updateTime":1306392851482000000,"version":{"type":0,"value":"1306392851482000000|1306392851482000000"}},{"config":{"options":{"sizeLimit":0}},"createTime":1306392851635,"creator":"mailfortest01@163.com","creatorId":11127,"description":"","doc":{"URL":"","md5High":-193114385,"md5Low":-1074021668,"size":4836,"type":0},"fileName":"form.jsp","id":55180,"owner":"mailfortest01@163.com","ownerId":11127,"parentId":1020,"shares":[],"status":0,"type":0,"updateTime":1306392851635000000,"version":{"type":0,"value":"1306392851635000000|1306392851635000000"}}];



