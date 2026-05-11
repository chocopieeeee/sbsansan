var scrollDirection = 'scrollDown',
	agent = navigator.userAgent.toLowerCase(),
	iosDetectTap;

if ((navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf('msie') != -1)) {
	$('html').addClass('ie');
	$('.bg-text').removeAttr('data-aos data-aos-offset');
} else if (agent.match(/ipad/i) != null || agent.match(/iphone/i) != null || agent.match(/ipod/i) != null){
	$(document).on({
		'touchstart' : function(){
			iosDetectTap = true;
		},
		'touchmove' : function(){
			iosDetectTap = false;
		}
	});
}

var mainSlider = (function($){
	var init = function(){
		var $slider = $('.visual-wrapper .visual-slider'),
			$video = $('.visual-wrapper').find('video'),
			$btn = $('.btn-control'),
			$timerWrap = $('.slider-timer'),
			$timer = $('.progress .top'),
			$durationNum = 6000;

		if ($slider.find('.swiper-slide').length > 1){
			$timerWrap.show();
			var slider = new Swiper($slider, {
				loop: true,
				loopAdditionalSlides: 2,
				navigation: {
				  nextEl: ".swiper-button-next",
				  prevEl: ".swiper-button-prev",
				},
				pagination: {
					el: '.fraction',
					type: 'custom',
					renderCustom: function (swiper, current, total) {
						return '<span class="current-num">'+ current + '</span> <span class="div">|</span> <span class="total-num">' + total + '</span>';
					}
				}
			});

			function slideControl(current){
				var currentSlide = $slider.find('.swiper-slide').eq(current),
					currentVideo = currentSlide.find('video')[0],
					durationNum = $durationNum;

				$slider.find('.swiper-slide video').each(function(){
					if ($(this).get(0).readyState >= 1){
						$(this).get(0).pause();
						$(this).get(0).currentTime = 0;
					}
				});

				if (currentVideo){
					if (!currentSlide.find('video').get(0).duration){
						currentSlide.find('video').on('loadedmetadata', function(){
							var durationTime = this.duration * 1000;
							durationNum = durationTime;
							currentVideo.play();
							timer(durationNum);
						});
					} else {
						var durationTime = currentSlide.find('video').get(0).duration * 1000;
						durationNum = durationTime;
						currentVideo.play();
						timer(durationNum);
					}
				} else {
					timer(durationNum);
				}
			}

			function timer(durationNum){
				$timer.stop().removeAttr('style');
				if (!$btn.hasClass('is-pause')){
					$timer.animate({
						'stroke-dashoffset' : 0
					}, durationNum, 'linear', function(){
						slider.slideNext();
					});
				}
			}

			slider.on("slideChangeTransitionStart", function(s){
				slideControl(slider.activeIndex);
			});

			$btn.on('click' , function(){
				if($(this).hasClass('is-pause')){
					$(this).removeClass('is-pause').text('정지');
					slideControl($slider.find('.swiper-slide-active').index());
					$timer.addClass('active');
				} else {
					$(this).addClass('is-pause').text('시작');
					$timer.stop().removeAttr('style').removeClass('active');
				}
			});

			if ($slider.find('.swiper-slide-active video').length > 0){
				$slider.find('.swiper-slide-active video').on('loadedmetadata', function(){
					slideControl($slider.find('.swiper-slide-active').index());
				});
			} else {
				slideControl($slider.find('.swiper-slide-active').index());
			}
		}
	}
	return {
        init:init
    };
})(jQuery);

function convertImages(elem, callback) {
	$(elem).each(function(){
		var $this = $(this)
			imgID = $this.attr('id');
			imgClass = $this.attr('class');
			imgURL = $this.attr('src');

		$.get(imgURL, function(data) {
			var $svg = $(data).find('svg');

			if(typeof imgID !== 'undefined') {
				$svg = $svg.attr('id', imgID);
			}
			if(typeof imgClass !== 'undefined') {
				$svg = $svg.attr('class', imgClass+' replaced-svg');
			}
			$svg = $svg.removeAttr('xmlns:a');

			$this.replaceWith($svg);
		}, 'xml');
	});
}


function vidEnded(){
	console.log('ended');
}

function bgResponsive(st){
	var root = $('html'),
		wrap = $('.bg-responsive-container'),
		target = wrap.find('.seminar-wr'),
		targetPos = target.offset().top,
		resultNum = $('#header').hasClass('hide_header')?targetPos: targetPos+400,
		bgText = wrap.find('.bg-text'),
		activePos = st + window.innerHeight,
		textOffset = [],
		duration = 500;

	if ($('#header').hasClass('hide_header')){
		scrollDirection = 'scrollDown'
	} else {
		scrollDirection = 'scrollUp'
	}

	if (st > resultNum){
		if (!wrap.hasClass('active')) wrap.addClass('active');

	} else {
		if (wrap.hasClass('active')) wrap.removeClass('active');
	}

	if ($('html').hasClass('ie')){
		bgText.each(function(idx){
			var svg = $(this).find('path'),
				duration = 1000;

			textOffset.push($(this).offset().top);

			if (activePos >= textOffset[idx]){
				if (!$(this).hasClass('active')){
					$(this).addClass('active');
					$(this).find('path').stop().animate({
						'stroke-dashoffset' : 0
					}, duration, 'linear');
				}
			} else {
				if ($(this).hasClass('active')){
					svg.removeAttr('style');
					$(this).removeClass('active');
				}
			}
		});
	}
}

var responsiveControl = (function($){

	var subViCondition = (window.innerWidth > 768)? [false, false] : [false, false];

	function init(){
		var winW = window.innerWidth,
			subViWrap = $('.sub-visual .tit-area'),
			ctBannerWrap = $('.culture-wrap .half-wrap'),
			ctBanner = ctBannerWrap.find('.banner');

		if (winW > 768){
			if (subViCondition[0] == false){
				subViCondition = [true, false];
				

				ctBannerWrap.attr('data-aos', 'fade-up');
				ctBanner.removeAttr('data-aos');
			}
		} else {
			if (subViCondition[1] == false){
				subViCondition = [false, true];


				ctBannerWrap.removeAttr('data-aos');
				ctBanner.attr('data-aos', 'fade-up');
			}
		}
	}

	return {
		init:init
	}
})(jQuery);


var windowW = window.innerWidth,
	aosReset;

$('.visual-wrapper').css('height', window.innerHeight);

EventDispatcher.add(this, Events.RESIZE, function(){
	var winW = window.innerWidth;
	if (windowW != winW){
		windowW = winW;
		$('.visual-wrapper').css('height', window.innerHeight);
		clearTimeout(aosReset);
		aosReset = setTimeout(function(){
			AOS.init();
		}, 500);

		//mainSlider.init();

		responsiveControl.init();
	}
});

EventDispatcher.add(this, Events.SCROLL_EVENT, function(st){
	(st <= 0) ? $('#header').addClass('root') : $('#header').removeClass('root');
//	bgResponsive(st);
});

$(window).load(function(){
	AOS.init();
});



//채용정보 API호출.
$(function(){
	mainSlider.init();
	responsiveControl.init();
	convertImages('.img-svg');
	convertImages('#header .btn_language img');
	convertImages('#header .btn_search img');

	var st = $(window).scrollTop();
	var $currentFocusGnb = $('#header .inner .gnb-wrap .sub-menu1');
	if (st <= 0){
		$('#header').addClass('root');
	}

	var headerHover;
/*
	$('#header.root .inner .gnb-wrap >ul > li').hover(function(){
		clearTimeout(headerHover);
		$('#header').addClass('hover');
	},function(){
		headerHover = setTimeout(function(){
			$('#header').removeClass('hover');
		}, 400);
	});
*/
	$('#header .inner .gnb-wrap >ul > li > a').on("focusin", function(){
		clearTimeout(headerHover);
		$('#header').addClass('hover');
	});

	$('#header .inner .gnb-wrap .sub a').eq(-1).on("focusout",function(){
		headerHover = setTimeout(function(){
			$('#header').removeClass('hover');
		}, 400);
	});

	if ($('html').hasClass('ie')){
		$('.bg-text').removeAttr('data-aos');
	}

	$('.notice-layer .pop-close').on('click', function(){
		$(this).closest('.notice-layer').removeClass('active');
	});
	$('.notice-layer .control-area.first label').on('click', function(){
		$(this).closest('.notice-layer').removeClass('active');
		setCookie('pop_notice1', 'Y' , 1 );
	});
	$('.notice-layer .control-area.second label').on('click', function(){
		$(this).closest('.notice-layer').removeClass('active');
		setCookie('pop_notice2', 'Y' , 1 );
	});
});



//쿠키설정
function setCookie( name, value, expiredays ) {
	var todayDate = new Date();
	todayDate.setDate( todayDate.getDate() + expiredays );
	document.cookie = name + '=' + escape( value ) + '; path=/; expires=' + todayDate.toGMTString() + ';'
}

//쿠키 불러오기
function getCookie(name)
{
    var obj = name + "=";
    var x = 0;
    while ( x <= document.cookie.length )
    {
        var y = (x+obj.length);
        if ( document.cookie.substring( x, y ) == obj )
        {
            if ((endOfCookie=document.cookie.indexOf( ";", y )) == -1 )
                endOfCookie = document.cookie.length;
            return unescape( document.cookie.substring( y, endOfCookie ) );
        }
        x = document.cookie.indexOf( " ", x ) + 1;

        if ( x == 0 ) break;
    }
    return "";
}

$(function(){
    if(getCookie("pop_notice1") !="Y"){
        $("#pop_notice1").show();
    }
    if(getCookie("pop_notice2") !="Y"){
        $("#pop_notice2").show();
    }
});