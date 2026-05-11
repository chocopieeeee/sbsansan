
window.EventDispatcher = (function(){
    var listeners = [];
    var isDispatchPlaying = false;
    var removeArr = [];

    function removeStart(){
        if(removeArr.length == 0) return;
        for(var i = 0, l = removeArr.length; i < l; ++i){
            removeListener(removeArr[i].s, removeArr[i].e, removeArr[i].c);
        }
        removeArr = [];
    }

    function removeListener(scope, evt_name, callback){
        if(typeof listeners[evt_name] != "undefined"){
            for(var i = 0, l = listeners[evt_name].length; i < l; ++i){
                if(listeners[evt_name][i].s == scope){
                    delete listeners[evt_name][i].s;
                    delete listeners[evt_name][i].c;

                    listeners[evt_name].splice(i, 1);
                    if(callback) callback();
                    break;
                }
            }
        }
    }

    return {
        add:function(scope, evt_name, callback){
            if(typeof listeners[evt_name] == "undefined") listeners[evt_name] = [];
            listeners[evt_name].push({s:scope, c:callback});
        },
        is:function(evt_name, params){
            if(typeof listeners[evt_name] != "undefined"){
				isDispatchPlaying = true;
				var paramAry =  Array.prototype.slice.call(arguments);
				paramAry.shift();
                for(var i = 0, l = listeners[evt_name].length; i < l; ++i){
                    var s = listeners[evt_name][i].s;
                    listeners[evt_name][i].c.apply(s, paramAry);

                    if(i == l-1) isDispatchPlaying = false, removeStart();
                }
            }
        },
        remove:function(scope, evt_name, callback){
            if(isDispatchPlaying) removeArr.push({s:scope, e:evt_name, c:callback});
            else removeListener(scope, evt_name, callback);
        }
    };
})();

var Events = {
    SCROLL_EVENT:"SCROLL_EVENT",
    RESIZE:"RESIZE",
};

function getURLParameter(name) {
	var rtnval = '';
	var nowAddress = unescape(location.href);
	var parameters = (nowAddress.slice(nowAddress.indexOf('?')+1,nowAddress.length)).split('&');

	for(var i = 0 ; i < parameters.length ; i++) {
		var varName = parameters[i].split('=')[0];
		if(varName.toUpperCase() == name.toUpperCase()) {
			rtnval = parameters[i].split('=')[1];
			break;
		}
	}
	return rtnval;
}
function isTablet(){
    var ua = window.navigator.userAgent.toLowerCase();
	var isiPad = ua.indexOf('ipad') > -1 || ua.indexOf('macintosh') > -1 && 'ontouchend' in document;
	var is_tablet = isiPad || /Mobile|ipad|iphone|ipod|android|blackberry|windows phone|opera mini|silk/i.test(ua);
    return is_tablet;
}
var disableBodyScroll=function(){var e,t=!1,o=!1;Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector),Element.prototype.closest||(Element.prototype.closest=function(e){var t=this;if(!document.documentElement.contains(el))return null;do{if(t.matches(e))return t;t=t.parentElement}while(null!==t);return el});var n=function(e){!1!==o&&e.target.closest(t)||e.preventDefault()},r=function(t){1===t.targetTouches.length&&(e=t.targetTouches[0].clientY)},c=function(t){if(1===t.targetTouches.length){var n=t.targetTouches[0].clientY-e;0===o.scrollTop&&n>0&&t.preventDefault(),o.scrollHeight-o.scrollTop<=o.clientHeight&&n<0&&t.preventDefault()}};return function(e,l){void 0!==l&&(t=l,o=document.querySelector(l)),!0===e?(!1!==o&&(o.addEventListener("touchstart",r,!1),o.addEventListener("touchmove",c,!1)),document.body.addEventListener("touchmove",n,!1)):(!1!==o&&(o.removeEventListener("touchstart",r,!1),o.removeEventListener("touchmove",c,!1)),document.body.removeEventListener("touchmove",n,!1))}}();
var curSt = 0;
var preventScroll = function(target){
    curSt = $(window).scrollTop();
	$('html').addClass('no-scroll');
	disableBodyScroll(true,target);
	$('#container,footer').attr('aria-hidden', 'true');
}
var allowScroll = function(target){

	$('html').removeClass('no-scroll');

	disableBodyScroll(false,target);
	$('html').css({'scroll-behavior':''});
	$('#container,footer').attr('aria-hidden', 'false');
    $(window).scrollTop(curSt);
}


var GNB =  (function ($) {

    var lastScrollTop = 0, delta = 5;
    var init = function(){
        var $header = $('#header');
        var $nav = $('.common-swiper_area[data-js]');

        EventDispatcher.add(this, Events.SCROLL_EVENT, function(st){
            if($nav.length==0)return;
            if(Math.abs(lastScrollTop - st) <= delta)return;
            console.log($nav.length>0)

            if (st >= $('.layout_section_outer').offset().top-$header.outerHeight()){
                $nav.addClass('fixed');

            }else{
                $nav.removeClass('fixed');
            }
        });
        EventDispatcher.add(this, Events.SCROLL_EVENT, function(st){

            if(Math.abs(lastScrollTop - st) <= delta)return;

            var condition = $nav.length>0?st >=$('.layout_section_outer').offset().top-$header.outerHeight():st >=$header.outerHeight();
            if (st > lastScrollTop && condition){

                //$nav.addClass('hide_nav');$header.addClass('hide_header');

            }else{
                //$nav.removeClass('hide_nav');$header.removeClass('hide_header');
            }

            lastScrollTop = st;
        });
        listener();
        setAtive();
    }
    var setAtive = function(){

        var replaceUrlArr = [
            {replaceDepth:[0,2]
                ,page:[]},
            {replaceDepth:[3,0]
                ,page:[]},
            {replaceDepth:[4,0]
                ,page:[]},
            {replaceDepth:[3,3,0]
                ,page:[]}
        ];

        if($('#header .inner .gnb-wrap a[href="'+window.location.pathname+'"').parents('li').length>0){
            $('#header .inner .gnb-wrap a[href="'+window.location.pathname+'"').parents('li').addClass('active');
            $('#sitemap .sitemap-body a[href="'+window.location.pathname+'"').parents('li').addClass('active open');
        }else{
            for(var i=0;i<replaceUrlArr.length;i++){
                var replaceDepth = replaceUrlArr[i].replaceDepth;
                var page = replaceUrlArr[i].page;

                if(page.indexOf(window.location.pathname) > -1) {
                    var $depth1 = $('#header .inner .gnb-wrap >ul > li:eq('+replaceDepth[0]+'), #sitemap .sitemap-body >ul>li:eq('+replaceDepth[0]+')');
                    $depth1.addClass('active');
                    for(var j = 1;j<replaceDepth.length;j++){
                        $depth1.find('.sub-'+(j+1)+'depth > li:eq('+replaceDepth[j]+')').addClass('active');

                    }
                }

                if(window.location.pathname.indexOf('/news/') > -1){
                    var $depth1 = $('#header .inner .gnb-wrap >ul > li:eq(4)');
                    $depth1.addClass('active');
                }

            }
        }

		if(window.location.pathname.indexOf('/edu/tool/') > -1){
			$('#header .inner .gnb-wrap a[href="'+window.location.pathname+'"').parents('li').removeClass('active');
		}


    };
    var listener = function(){
        var $header = $('#header');
        var $search =  $('#search-layer');
        var $menuSitemap = $('#sitemap');
        var $currentFocusGnb = $('#header .inner .gnb-wrap .sub-menu1');
        var getScrollbarSize =function(){
            const scrollDiv = document.createElement("div");

            scrollDiv.className = "scrollbar-measure";
            scrollDiv.style.position = "fixed";
            scrollDiv.style.top = "0";
            scrollDiv.style.left = "0";
            scrollDiv.style.right = "0";
            scrollDiv.style.bottom = "0";

            document.body.appendChild(scrollDiv);

            // Get the scrollbar width
            const scrollbarWidth = window.innerWidth - scrollDiv.clientWidth;

            // Delete the DIV
            document.body.removeChild(scrollDiv);

            return scrollbarWidth;
        };
        window.onpageshow = function(event){
            if(event.persisted || (window.performance && window.performance.navigation.type==2)){
                if($('body').hasClass('opensitemap')){
                    $('#header .btn_menu').click();
                }

            }
        }


        /*
        $('#header .inner .gnb-wrap >ul > li').hover(function(){
            var $sub = $(this).children('.sub');
            $sub.stop().fadeIn(500);
        },function(){
            $(this).children('.sub').stop().fadeOut(500);
        });
    */
        $('#sitemap .sitemap-body ul li a:not(.btn_submenu), #header .inner .gnb-wrap ul  li  a').on("click",function(){
            sessionStorage.removeItem('cur-st');
        });
        if(isTablet()){

        }


        $('#header .inner .gnb-wrap >ul > li > a').on("mouseenter",function(){
            $('#header .inner .gnb-wrap >ul > li.hover').removeClass('hover');
            $(this).parent().addClass('hover');
            $header.addClass('hover');
        });

        $('#header').on("mouseleave",function(){
            $('#header .inner .gnb-wrap >ul > li').removeClass('hover');
            $header.removeClass('hover');
        });

        $('#header .inner .gnb-wrap >ul > li > a').on("focusin",function(){

            if($(this).siblings('.sub')[0]==$currentFocusGnb[0]){
                $currentFocusGnb.addClass('hover');
            }else{
                $currentFocusGnb.stop().css({visibility:'',opacity:''});
                $currentFocusGnb  = $(this).siblings('.sub');
                $currentFocusGnb.addClass('hover');

            }
        });
        $('#header .inner .gnb-wrap .sub a').eq(-1).on("focusout",function(){
            $('#header .inner .gnb-wrap .sub').removeClass('hover');
        });

        $('#header .btn_language').on("focusin",function(){
            $('#header .language_list').css({opacity:1,visibility:'visible'});
        });

        $("#header .language_list li").eq(-1).find('a').on("focusout",function(){
            $('#header .language_list').css({opacity:'',visibility:''});
        });

        $('#header .btn_menu').on('click',function(e){
            e.preventDefault();
            if($('body').hasClass('opensitemap')){

                $('body').removeClass('opensitemap');
                $(this).css('margin-right','');
                setTimeout(function() {
                    $('#sitemap').hide().attr('aria-hidden',"true");
                    allowScroll('#sitemap');
                    $(document).off('focusin.sitemapFocus');
                    $header.removeAttr("tabIndex").blur();

                },0);

            }else{
				if(window.matchMedia("(min-width: 1024px)").matches){//240327 web에서 작용
					if(document.body.scrollHeight > window.innerHeight)$(this).css('margin-right',getScrollbarSize());
				}
                $('#sitemap').show().attr('aria-hidden',"false");
                $('#container, #footer').attr('aria-hidden',"true");
                preventScroll('#sitemap');
                setTimeout(function() {
                    $('body').addClass('opensitemap');
                    $header.attr("tabIndex", "-1");
                    $(document).off('focusin.sitemapFocus').on('focusin.sitemapFocus', $.proxy(function (e) {
                        if ($header[0] !== e.target && !$header.has(e.target).length) {
                            $header.trigger("focus");
                        }
                    }, this));

                },0);
            }
        });

        $(document).on('click', '#sitemap .btn_submenu',  function(e) {
            if($('#sitemap').css('backgroundImage')!='none')return;
            e.preventDefault();

            var $parent = $(this).parent('li');
            var $sub =  $(this).next();

            if($parent.hasClass('open')){
                $parent.removeClass('open');
                $parent.find('li.open').removeClass('open');
                $sub.stop().slideUp({duration: 300});
                $parent.find('li.open:not(.active) > a').next().stop().slideUp({duration: 300});
                //$(this).focus();
            }else{
                $parent.addClass('open');
                $sub.find('li.active').addClass('open');
                $sub.find('li.active > a').next().stop().slideDown({duration: 300});
                $sub.stop().slideDown({duration: 300});
                //$(this).prev('a').focus();
            }

        });

        $('#header .btn_search').on('click',function(e){
            e.preventDefault();
            if(document.body.scrollHeight > window.innerHeight)$search.find('.btn_close_search').css('margin-right',getScrollbarSize());
            $search.show();
            preventScroll('#search-layer');

            setTimeout(function() {
                $('body').addClass('opensearch');
                $search.find('input[type="search"]').focus();
                $search.attr("tabIndex", "-1");
				$(document).off('focusin.searchFocus').on('focusin.searchFocus', $.proxy(function (e) {
					if ($search[0] !== e.target && !$search.has(e.target).length) {
						$search.trigger("focus");
					}
				}, this));
            },0);
        });
        $search.find('.btn_close_search').on('click',function(e){
            e.preventDefault();
            $('body').removeClass('opensearch');
            $search.find('.btn_close_search').css('margin-right','');
            setTimeout(function() {
                $search.hide();
                allowScroll('#search-layer');
                $(document).off('focusin.searchFocus');
                $search.removeAttr("tabIndex").blur();

            },0);
        });

    }

    return {
        init:init
    };

})(jQuery);
var TumbList =  (function ($) {
    var getTranslateY = function(transform){return parseInt(transform.match(/translateY\(([^#\&\?]*)px\).*/)[1])};
    var getTranslateX = function(transform){return parseInt(transform.match(/translateX\(([^#\&\?]*)px\).*/)[1])};

    function setThumbPos($lists,options){
        if($lists.length==0)return;
        var colNum = options.colNum, marginW = options.marginW,marginH = options.marginH, imgW = ($lists.parent().width()-marginW*(colNum-1))/colNum;
        var imgStack = new Array(colNum+1).join('0').split('').map(parseFloat),idxStack = new Array(colNum+1).join('0').split('').map(parseFloat);
        //new Array(colNum).fill(0);
        var colWidth = imgW+marginW, startNum = 0;


        for (var i = startNum; i < $lists.length; i++) {
            let mod = i%colNum;
            let x = colWidth * mod;
            // var recentListMin = (startNum==0 && i<startNum+colNum)?0:getRecentListMin(idxStack,$lists);
            // var mod = (startNum==0 && i<startNum+colNum)?i%colNum:recentListMin.mod;
            // var x = (startNum==0 && i<startNum+colNum)?colWidth * mod:getTranslateX($lists[recentListMin.idx].style.transform);
            var y = imgStack[mod];
            idxStack[mod]=i;
            imgStack[mod] += ($lists.eq(i).outerHeight() + (typeof marginH=='function'?marginH(i):marginH));
            $lists.eq(i).css({'transform':'translateX('+x+'px) translateY('+y+'px)'});
            $lists.eq(i).attr('data-pos',true);

            if (i === $lists.length - 1) {
                $lists.parent().css("height", Math.max.apply(0, imgStack)-(typeof marginH=='function'?marginH(i):marginH));

                $(window).trigger('scroll');

            }

        }

    }

    function getRecentListMin(idxStack,$lists){
        var curNum = idxStack[0];
        var min =$lists.eq(curNum).outerHeight()+getTranslateY($lists[curNum].style.transform),minIdx=curNum;
        var mod =0;


        for(var i = 0;i<idxStack.length;i++){
            var idx = idxStack[i];
            if (min > $lists.eq(idx).outerHeight()+getTranslateY($lists[idx].style.transform)) {
                min = $lists.eq(idx).outerHeight()+getTranslateY($lists[idx].style.transform);
                minIdx = idx;
                mod = i;
            }
        }

        return {idx:minIdx,mod:mod};
    }

    function loadImgs($loadImg,callback){
        var cnt = 0;
        for(var i=0;i<$loadImg.length;i++){
            var img = new Image();
            img.src=$loadImg[i].getAttribute('src');
            img.addEventListener('load',function(e){
                cnt++;
                if(cnt==$loadImg.length-1){
                    callback();
                }
            });

        }
    }
    function init($list,options,$loadImg,callback){
        EventDispatcher.add(this, Events.RESIZE, function(){
            add($list,options,$loadImg);
            callback && callback();
        });
        EventDispatcher.is(Events.RESIZE);
    }
    function add($list,options,$loadImg,callback){
        loadImgs($loadImg,function(){
            setThumbPos($list,options);
            callback && callback();
        });
        setThumbPos($list,options);
    }


return {
    setThumbPos:setThumbPos,
    loadImgs:loadImgs,
    init:init,
    add:add
};

})(jQuery);



$(function(){
    GNB.init();
    $(window).resize(function(e){
		EventDispatcher.is(Events.RESIZE);
	});

	$(window).scroll(function(e){
        var last_scroll = $(window).scrollTop();

        EventDispatcher.is(Events.SCROLL_EVENT,last_scroll,e);
    });

    $("#footer .select_policy h2 a").on("click", function(e) {
        e.preventDefault();
        e.stopPropagation();


        if( $(this).parents('.select_policy').hasClass('on')){
            $(this).parents('.select_policy').removeClass('on');
        }else{
            $('.select_policy.on').removeClass('on');
            $(this).parents('.select_policy').addClass('on');
        }
	});
    $(document).on('click',function(e){
        if ($(e.target).parents('.select_policy.on').length==0) {

            if(!$(e.target).attr('href') || $(e.target).attr('href').indexOf('http')==-1){
                $('.select_policy.on').removeClass('on');
            }

        }

    });

	//하단 퀵버튼 닫기
	$('.btmQuick .quickClose').on('click', function(e){
		$('body').removeClass('lock');
		$('.btmQuick').removeClass('on');
	});
});
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function copyClip(url){
	var $temp = $('<input>');
	$('body').append($temp);
	$temp.val(url).select();
	document.execCommand('copy');
	$temp.remove();
	alert('이벤트 URL이 복사 되었습니다!');
}


	//221220 지점추가팝업
	//하단 퀵버튼 열기
	function btQuickOpen(){
		$('body').addClass('lock');
		$('.btmQuick').addClass('on');
	};
	

