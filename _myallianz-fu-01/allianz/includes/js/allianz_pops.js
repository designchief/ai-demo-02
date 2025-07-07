/*
* Allianz original pop-up code
*
* Taken from original Allianz Direct pop-up code
*/
function PopUp(URL,ijMigrate) {
	var l = 0;
	var t = 0;
	var w = 1028;
	var h = 768;
	var strref = document.URL.substring(0,100);
	strref = strref.replace(/[^a-zA-Z 0-9/.:]+/g,'^');
	var strurl = document.referrer.substring(0,100);
	strurl = strurl.replace(/[^a-zA-Z 0-9/.:]+/g,'^');
	URL = URL + '+ASTREF(A1000):' + strref + '+ASTURL(A1000):' + strurl;
// Site tracking update
if(ijMigrate==null) {
ijMigrate=false;
} 
else if(ijMigrate=='n' || ijMigrate=='N'){
ijMigrate=false;
} 
else if(ijMigrate=='y' || ijMigrate=='Y'){
      ijMigrate=true;
}
if(ijMigrate){
//        if (URL.indexOf('?') != -1)
//        {               URL = URL + '?';       }
//        else
//        {               URL = URL + '&';       }
	URL = URL + '&';
        URL = URL + SITEINTEL.config.cookieQPName + '=' + getCookie(SITEINTEL.config.cookieName);
}
// End of Site tracking update

	var windowprops ="location=no,scrollbars=yes,menubars=no,toolbar=no,resizable=yes,status=yes" +",left=" + l + ",top=" + t + ",width=" + w + ",height=" + h;
	popup = window.open(URL,"MenuPopup",windowprops);
/*	popup.moveTo(0,0); */
}


NS4 = ( document.layers);
IE4 = (document.all );
ver4 = ( NS4 || IE4 );
IE5 = ( IE4 && navigator.appVersion.indexOf( "5.") != -1 );
isMac = ( navigator.appVersion.indexOf( "Mac" ) != -1 );


/*
* Required for Site Tracking, to pass cookie details between domains
*/
function getCookie(c_name)
{
var i,x,y,ARRcookies=document.cookie.split(";");
for (i=0;i<ARRcookies.length;i++)
{
  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
  x=x.replace(/^\s+|\s+$/g,"");
  if (x==c_name)
    {
    return unescape(y);
    }
  }
}