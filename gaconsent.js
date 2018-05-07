/** Google Analytics.js Cookie Opt-in Consent Checker v1.2 - 2018-05-06
    Not to be construed as legal advice or opinion.
    Copyright 2018 Jefferson Scher. License: BSD-3-Clause   **/

// Wrapper for GA functions
var GAConsent = {

/******** CUSTOMIZE START ********/

	/* Your Analytics account & cookie */
	gapropid: 'UA-XXXXX-Y',
	gadomain: 'example.com',
	gaprefix: 'GA1.2.', /* Check your site's existing _ga cookie to confirm the correct prefix to the clientId */

	/* Events to record in GA related to a visitor's interaction with this script 
	   Clear everything between [] to turn off event logging */
	gaevents: ['yes', 'no', 'revoke', 'viewed', 'close', 'timeout'],

	/* Interpreting DNT or other signals */
	gadntmeansno: true,		/* If a "Do Not Track" signal is detected, treat that as "no" */

	/* Theming and panel features (for other changes, you'll need to edit code) */
	gaxbutton: false,		/* Provide an X close button (appears next to the triangle) */
	gaoptoutaddon: true,	/* Provide a link to Google's opt-out add-on */
	gaposition: 'center',	/* Recognized values are 'center' 'left' 'right' */
	gapositionfixed: true,	/* Fix to top of viewport (if false, element will scroll up with the page) */
	gatimeout: 30,			/* Number of seconds before invitation is faded out */
	gacolorscheme: 'color:#000;background:#f8f8f8 none;', /* black text on nearly-white with no BG image */
	gaopacity: '0.5', 		/* Invite tab opacity (0.5 => 50% faded, 0.75 => 25% faded, 1.0 => not faded) */

/******** CUSTOMIZE END ********/

	gaaction: '',

	doGA: function(forceform){
		// Check for setting created by the Google opt-out extension
		if (window['_gaUserPrefs'] !== undefined && window['_gaUserPrefs'].ioo !== undefined) return;
		
		// Check for reprompt
		forceform = forceform || false;

		// Check for other signals
		var gaDeemNo = false;
		if (GAConsent.gadntmeansno && !forceform){
			var gaDeemNo = (navigator.doNotTrack == 1 || navigator.doNotTrack == 'yes') ? true : false;
		}

		// If user previously gave consent, set up Google Analytics with a cookie
		var gaccook = Cookies.get('gaconsent');  // can be yes, no, undefined
		if (gaccook === 'yes' && forceform === false) { 
			// Set 7-day GA cookie
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
			ga('create', GAConsent.gapropid, {
				'cookieName': '_ga',
				'cookieDomain': GAConsent.gadomain,
				'cookieExpires': 7 * (60 * 60 * 24)  // Recognize return within 7 days (in seconds)
			});
			ga('set', 'anonymizeIp', true);  // Drop last part of IP address
			ga('send', 'pageview');	
		}

		// In all other cases, set up Google Analytics WITHOUT a cookie
		if (gaccook !== 'yes' && forceform === false){
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
			ga('create', GAConsent.gapropid, {
			  'storage': 'none'  // Separate page loads can't be recognized as the same user
			});
			ga('set', 'anonymizeIp', true);  // Drop last part of IP address
			ga('send', 'pageview');
		}

		// If user hasn't set yes or no, insert notification / opt-in
		// Requires IE9 or newer; IE compatibility mode set to IE9 or higher
		if ((gaccook === undefined && gaDeemNo === false) || forceform === true) {
			// Opt-out panel content (goes in either your <div id="gaconsent"> or a new one)
			var gaoptdiv = '<p id="gaconsentp">' + 
				'<span id="gainvite" title="Please select your Google Analytics cookie preference">Google Analytics <br>Cookie Preference</span>' +
				'<span id="gacaption">Welcome! Please select your Google Analytics cookie preference...</span></p>' +
				'<div id="gaclose"><span class="gadowntriangle">&#9660;</span><span class="gauptriangle">&#9650;</span>';
			if (GAConsent.gaxbutton){
				gaoptdiv += '<span class="gaxbutton">&#10006;</span>';
			}
			gaoptdiv += '</div>\n' +
				'<div id="gadetails">\n' + 
				'<p>We count page views anonymously. If you allow GA cookies to be set, the pages loaded with those cookies during a seven day period are counted as one "unique visitor". This gives us a more accurate count of site visitors.</p>\n' + 
				'<p>The GA cookies are only for this site, and contain a random number and timestamp like "GA1.2.<em>1915884793.1525032860</em>". No personal information is stored in the cookies.</p>\n' + 
				'<p><span id="gachoices">Will you help? <label><input type="radio" name="gacradio" value="yes">&nbsp;Yes&nbsp;</label><label><input type="radio" name="gacradio" value="no">&nbsp;No&nbsp;</label></span>&nbsp;<button id="btngasavepref">Save Preference</button>';
			if (GAConsent.gaoptoutaddon) {
				gaoptdiv += ' <span id="gaoptbutton"><em>or</em>&nbsp;<button id="btngaextension">Global opt-out</button></span></p>\n' + 
				'<p id="gaoptout">Google\'s opt-out add-on: <a href="https://tools.google.com/dlpage/gaoptout/" target="_blank">https://tools.google.com/dlpage/gaoptout/</a>'
			}
			gaoptdiv += '</p>\n</div>';

			// Theming
			if (GAConsent.gapositionfixed){
				var r = '#gaconsent {box-sizing:content-box;position:fixed;';
			} else {
				var r = '#gaconsent {box-sizing:content-box;position:absolute;';
			}
			//   position at top, dimensions 
			r += 'top:0;z-index:9999;max-width:80%;height:auto;margin:0 auto;padding:9px 12px 0;';
			//   default sans-serif font, cursor, faded (until hovered or clicked transition)
			r += 'font:15px sans-serif;cursor:pointer;opacity:' + GAConsent.gaopacity + ';transition:all 250ms ease-in-out;' + GAConsent.gacolorscheme
			// Horizontal position
			switch (GAConsent.gaposition){
				case 'left':
					r += 'left:0;border-radius:0 0 12px 0;width:136px} #gaconsent.gapersist{width:526px} ';
					break;
				case 'right':
					r += 'right:0;border-radius:0 0 0 12px;width:136px} #gaconsent.gapersist{width:526px} ';
					break;
				default:
					r += 'left:calc(50% - 80px);border-radius:0 0 12px 12px;width:146px} #gaconsent.gapersist{left:calc(50% - 275px);width:526px} ' +
						'#gaconsentp{text-align:center} ';
			}
			//   default sans-serif font, cursor, 50% faded (until hovered or clicked transition)
			r += '#gaconsent:hover, #gaconsent.gapersist {opacity:1;transition:all 250ms ease-in-out;} ';
			//   up/down/x buttons
			r += '#gaclose {display:none;position:absolute;top:5px;right:8px;color:#888;font-size:22px;line-height:22px} #gaclose>span{display:none} ' +
				'#gaconsent:hover:not(.gapersist) .gadowntriangle{display:inline} #gaconsent.gapersist .gauptriangle{display:inline} ' +
				'#gaconsent:hover .gaxbutton, #gaconsent.gapersist .gaxbutton{display:inline;margin-left:4px} ' +
				'#gaconsent:hover #gaclose, #gaconsent.gapersist #gaclose {display:block;} #gaclose>span:hover {color:#00f} ';
			if (GAConsent.gaxbutton){
				r += '#gaconsent:not(.gapersist):hover{padding-right:30px} ';
			}
			//   invitation paragraph and details box (click toggles gapersist)
			r += '#gaconsentp{margin:0 0 10px;font:15px sans-serif} #gaconsent.gapersist #gaconsentp{margin:0 13px 10px} ' +
				'#gacaption, #gaconsent.gapersist #gainvite{display:none} #gainvite, #gaconsent.gapersist #gacaption{display:inline} ' +
				'#gaconsent #gadetails {display:none;margin:10px 0 14px;border:1px solid #888;padding:12px 12px 0;cursor:auto} ' +
				'#gaconsent.gapersist #gadetails {display:block;} #gadetails p {margin:0 0 12px;line-height:20px;font:15px sans-serif} ' +
				'#gadetails label:hover {background:#ffd;border-radius:3px} #gaoptbutton{white-space:nowrap} #gaoptout{display:none} ';
			//   fade out and hide for print
			r += '#gaconsent.fade:not(.gapersist) {opacity:0;transition:opacity 250ms ease-in-out;} ' + 
				'@media print{#gaconsent{display:none;}} ';
			//   modifications for narrow screens
			r += '@media screen and (max-width: 679px){' +
				'#gaconsent.gapersist{left:calc(5% - 12px);max-width:90%;transition: all 250ms ease-in-out;}}';

			// Put it in
			//   new <style> element
			var s = document.createElement('style');
			s.appendChild(document.createTextNode(r));
			document.body.appendChild(s);
			//   opt-out div element
			var tgt = document.querySelector('#gaconsent');
			if (!tgt){
				tgt = document.createElement('div');
				tgt.id = 'gaconsent';
				document.body.insertBefore(tgt, document.body.childNodes[0]);
			}
			tgt.innerHTML = gaoptdiv;
			// preselect only if reprompting
			if (forceform === true){
				if (gaccook === 'yes') document.querySelector('input[name="gacradio"][value="yes"]').checked = true;
				if (gaccook === 'no') document.querySelector('input[name="gacradio"][value="no"]').checked = true;
				document.querySelector('#gaconsent').classList.add('gapersist');
			}
			// Event handlers
			document.querySelector('#gaconsent').addEventListener('click', function(evt){
				if (evt.target.className == 'gaxbutton'){
					GAConsent.gaaction = 'close';
					// Fade it out
					GAConsent.cleanup();
				} else if (document.querySelector('#gaconsent').classList.contains('gapersist')){
					if (evt.target.id == 'gaconsent' || evt.target.id == 'gaconsentp' || evt.target.className == 'gauptriangle'
						|| evt.target.id == 'gainvite' || evt.target.id == 'gacaption'){
						document.querySelector('#gaconsent').classList.remove('gapersist');
						// Reset timeout for fading the consent invitation
						garollup = window.setTimeout(GAConsent.divfade, GAConsent.gatimeout * 1000);
					}
				} else {
					document.querySelector('#gaconsent').classList.add('gapersist');
					if (garollup) window.clearTimeout(garollup); // don't fade while open
					GAConsent.gaaction = 'viewed';
				}
			}, false);
			document.querySelector('#btngasavepref').addEventListener('click', function(evt){
				var rads = document.querySelectorAll('input[name="gacradio"]');
				for (var i=0; i<rads.length; i++){
					if (rads[i].checked){
						// Record consent choice
						GAConsent.gaaction = rads[i].value;
						// Write the cookie with 6-month expiration
						Cookies.set('gaconsent', GAConsent.gaaction, { expires: 182, domain: GAConsent.gadomain });
						// Update Cookies
						if (GAConsent.gaaction === 'yes'){
							// Create the missing clientId cookie
							ga(function(oga){
								Cookies.set('_ga', GAConsent.gaprefix + oga.get('clientId'), { expires: 7, domain: GAConsent.gadomain });
							});
						} else if (GAConsent.gaaction === 'no'){
							GAConsent.flushcookies();
							window.setTimeout(GAConsent.flushcookies, 3000); // sweep for cookies that reappear
						}
						// Trigger removal of the opt-in/out area
						window.setTimeout(GAConsent.cleanup, 250);
						// Exit now
						return;
					}
				}
				// Probably a radio button was not selected, so highlight them
				document.querySelector('#gachoices').style.backgroundColor = '#ff0';
			}, false);
			if (GAConsent.gaoptoutaddon){
				document.querySelector('#btngaextension').addEventListener('click', function(evt){
					document.querySelector('#gaoptout').style.display = 'block';
					document.querySelector('#gaoptbutton').style.display = 'none';
				}, false);
			}
			// Consent invitation fades after user-defined timeout if no interaction
			garollup = window.setTimeout(GAConsent.divfade, GAConsent.gatimeout * 1000);
		}
	},

	cleanup: function(){
		// Post-choice: Clear the persistence
		if (document.querySelector('#gaconsent').classList.contains('gapersist')){
			document.querySelector('#gaconsent').classList.remove('gapersist');
		}
		// Set a 1/4 second fade-out
		garollup = window.setTimeout(GAConsent.divfade, 250);
	},

	divfade: function(){
		// Remove consent invitation
		var tgt = document.querySelector('#gaconsent');
		if (tgt && tgt.style.display != 'none'){
			tgt.classList.add('fade');
			window.setTimeout(function(){
				document.querySelector('#gaconsent').style.display = 'none';
			}, 700);
		}
		// Log (in)action
		if (GAConsent.gaaction === '') GAConsent.gaaction = 'timeout';
		if (GAConsent.gaevents.indexOf(GAConsent.gaaction) > -1){
			// yes, no, close, viewed (only sent after timeout), or timeout
			ga('send', {
				hitType: 'event',
				eventCategory: 'GAConsent',
				eventAction: GAConsent.gaaction
			});
		}
	},

	flushcookies: function(){
		// Remove common GA cookies for the domain (others could exist)
		Cookies.remove('_ga', { domain: GAConsent.gadomain });
		Cookies.remove('_gid', { domain: GAConsent.gadomain });
		Cookies.remove('_gat', { domain: GAConsent.gadomain });
		Cookies.remove('__utma', { domain: GAConsent.gadomain });
		Cookies.remove('__utmb', { domain: GAConsent.gadomain });
		Cookies.remove('__utmc', { domain: GAConsent.gadomain });
		Cookies.remove('__utmt', { domain: GAConsent.gadomain });
		Cookies.remove('__utmz', { domain: GAConsent.gadomain });
	},

	reprompt: function(){
		// To be run from elsewhere, for example, a menu item or privacy page link
		if (document.querySelector('#gaconsent')) document.querySelector('#gaconsent').style.display = '';
		GAConsent.doGA(true);
	},

	revoke: function(){
		// To be run from elsewhere, for example, a menu item or privacy page link
		// Record consent choice
		//   Write the opt-out cookie with 6-month expiration
		Cookies.set('gaconsent', 'no', { expires: 182, domain: GAConsent.gadomain });
		//   Log decision to GA
		if (GAConsent.gaevents.indexOf('revoke') > -1){
			ga('send', {
				hitType: 'event',
				eventCategory: 'GAConsent',
				eventAction: 'revoke'
			});
		}
		GAConsent.flushcookies();
		window.setTimeout(GAConsent.flushcookies, 3000); // sweep for reappearing cookies after 3 seconds
	}
};

// Timer for fading the consent invitation
var garollup;
// Set up GA and, if applicable, opt-in/out invitation, after 1 second
window.setTimeout(GAConsent.doGA, 1000);

// Cookie Library -- Delete this block if you already load this library
/*! js-cookie v2.2.0 | https://github.com/js-cookie/js-cookie | MIT */
!function(e){var n=!1;if("function"==typeof define&&define.amd&&(define(e),n=!0),"object"==typeof exports&&(module.exports=e(),n=!0),!n){var o=window.Cookies,t=window.Cookies=e();t.noConflict=function(){return window.Cookies=o,t}}}(function(){function e(){for(var e=0,n={};e<arguments.length;e++){var o=arguments[e];for(var t in o)n[t]=o[t]}return n}function n(o){function t(n,r,i){var c;if("undefined"!=typeof document){if(arguments.length>1){if("number"==typeof(i=e({path:"/"},t.defaults,i)).expires){var a=new Date;a.setMilliseconds(a.getMilliseconds()+864e5*i.expires),i.expires=a}i.expires=i.expires?i.expires.toUTCString():"";try{c=JSON.stringify(r),/^[\{\[]/.test(c)&&(r=c)}catch(e){}r=o.write?o.write(r,n):encodeURIComponent(r+"").replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),n=(n=(n=encodeURIComponent(n+"")).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent)).replace(/[\(\)]/g,escape);var s="";for(var f in i)i[f]&&(s+="; "+f,!0!==i[f]&&(s+="="+i[f]));return document.cookie=n+"="+r+s}n||(c={});for(var p=document.cookie?document.cookie.split("; "):[],d=/(%[0-9A-Z]{2})+/g,u=0;u<p.length;u++){var l=p[u].split("="),C=l.slice(1).join("=");this.json||'"'!==C.charAt(0)||(C=C.slice(1,-1));try{var m=l[0].replace(d,decodeURIComponent);if(C=o.read?o.read(C,m):o(C,m)||C.replace(d,decodeURIComponent),this.json)try{C=JSON.parse(C)}catch(e){}if(n===m){c=C;break}n||(c[m]=C)}catch(e){}}return c}}return t.set=t,t.get=function(e){return t.call(t,e)},t.getJSON=function(){return t.apply({json:!0},[].slice.call(arguments))},t.defaults={},t.remove=function(n,o){t(n,"",e(o,{expires:-1}))},t.withConverter=n,t}return n(function(){})});
