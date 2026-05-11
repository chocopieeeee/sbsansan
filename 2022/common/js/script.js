function checkMobile(){
    var varUA = navigator.userAgent.toLowerCase(); //userAgent 값 얻기
    if ( varUA.indexOf('android') > -1) {
        $('html').removeAttr('data-device').attr('data-device','android');
    } else if ( varUA.indexOf("iphone") > -1||varUA.indexOf("ipad") > -1||varUA.indexOf("ipod") > -1 ) {
        $('html').removeAttr('data-device').attr('data-device','ios');
    } else {
        //아이폰, 안드로이드 외
        //$('html').addClass('other');
    }

}

var mobile = (/iphone|ipad|ipod|android/i.test(navigator.userAgent.toLowerCase()));

if (mobile) {
  //모바일 처리
}else{
  //비 모바일 처리
}

var touchEvent = {
    opt : {
        wrap : $('html'),
        wrapper : $('body'),
        container : $('#container'),
        windowH : $(window).height(),
        winSch : ''
    },
    stop : function(){
        winSch = $(window).scrollTop();

        touchEvent.opt.container.on('scroll touchmove mousewheel', function(e){
            e.preventDefault();
            e.stopPropagation();
            return false;
        });

        $('body').addClass('overflow');

        // touchEvent.opt.wrap.css({
        //     'width' : '100%',
        //     'height' : '100vh',
        //     'position' : 'fixed',
        //     'top' : -winSch
        // });
    },
    start : function(){
        touchEvent.opt.wrap.removeAttr('style');
        $(window).scrollTop(winSch)
        $('body').removeClass('overflow');
        touchEvent.opt.container.off('scroll touchmove mousewheel');
    }
}

function makeScroll(){
    var $target = $('.scrollbar-area_inner');
    if($target.length){
        if($(window).width() < 769){
            $target.scrollbar({
                "autoScrollSize": false,
                "scrollx": $('.external-scroll_x')
            });
        } else {
            $target.scrollbar('destroy')
        };
    };
};

function customScrollY(target){
    var $target = $(target);

    $(window).on('resize load' , function(){
        var $winW = $(window).width();

        if($target.is('.footer_layer_scroll')){
            if($winW < 769){
                deleteSCroll()
            } else {
                makeScroll();
            }
        } else {
            if($winW < 1024){
                deleteSCroll()
            } else {
                makeScroll();
            }
        }

        function makeScroll(){
            $target.each(function(){
                $(this).scrollbar();
            });
        }
        function deleteSCroll(){
            $target.each(function(){
                $(this).scrollbar('destroy');
            });
        }
    })
};


function faqInit(){
    var $obj = $('.faq_area'),
        $btn = $obj.find('.btn-panel');

    $btn.on('click' , function(){
        $(this).toggleClass('active');
        $(this).next().slideToggle(150);
    })
}
function moveSessionScroll(cls,sessionSt){
    if($('#wrap').hasClass(cls) && sessionSt){
        var  $thisTargetTop =$('.common-swiper_tab li.active a').offset().top;
        $('#header').css('transition','none');
        $('html, body').stop().animate(
            {
                'scrollTop' : +sessionSt
            },
            {
                duration:0,
                complete: function() {
                    if(+sessionSt!=$thisTargetTop) $('html, body').stop().animate({'scrollTop' : $thisTargetTop},{ duration:500});
                }
            }
        );
    }
}

function tabMove(){
    var $tab = $('.common-swiper_tab a'),
        $panel = $('[data-js="anchor-target"]');

    $tab.each(function(){
        $(this).on('click' , function(e){

            if(!$(this).hasClass('is-link')){
                e.preventDefault();
                $(this).parent().siblings().removeClass('active');
                $(this).parent().addClass('active');
            }else{
                sessionStorage.setItem('cur-st',$(window).scrollTop());
                //if($('#wrap').hasClass('equitable_edu'))sessionStorage.setItem('esg_edu-st',$(window).scrollTop());
                //if($('#wrap').hasClass('history'))sessionStorage.setItem('history-st',$(window).scrollTop());
            }



            if(!$panel.length == 0){
                move($(this).parent().index())
            }
        })
    });
    //moveSessionScroll('equitable_edu', sessionStorage.getItem('esg_edu-st'));
    //moveSessionScroll('history', sessionStorage.getItem('history-st'));
    var sessionSt = sessionStorage.getItem('cur-st');
    if(sessionSt&&$('.common-swiper_tab li.active a').length>0){
        var $thisTargetTop =$('.common-swiper_tab li.active a').offset().top;

        $('#header').css('transition','none');
        $('html, body').stop().animate(
            {
                'scrollTop' : +sessionSt
            },
            {
                duration:0,
                complete: function() {
                    if(+sessionSt!=$thisTargetTop) $('html, body').stop().animate({'scrollTop' : $thisTargetTop},{ duration:500});
                }
            }
        );
    }


    function scrollMove(){
        if($panel.length){
            $(window).on('scroll' , function(){
                $tab.each(function(){
                    var $panelIdx = $panel.eq($(this).parent().index()),
                        $docT = $(document).scrollTop();
            //        if($docT > $panelIdx.offset().top){
             //           $tab.parent().siblings().removeClass('active');
             //           $(this).parent().addClass('active')
             //       }
                });
            });
        }
    }

    scrollMove();

    function move(index){
        var $thisTargetTop;

        $thisTargetTop = $panel.eq(index).offset().top + (parseInt($panel.eq(index).css('padding-top')) / 2);

        $('html, body').stop().animate(
            {
                'scrollTop' : $thisTargetTop
            },
            {
                duration:500,
                // queue: false,
                complete: function() {
                    //console.log('complete')
                }
            }
        );
    };
};

function tabMove2(){
    var $tab = $('.common-swiper_tab2 a')

    $tab.each(function(){
        $(this).on('click' , function(e){
            if($(this).hasClass('is-link')){
                sessionStorage.setItem('cur-st',$(window).scrollTop());
            }
            if($(this).parents('.esg_welfare-tab').length){

                var $thisTargetTop = $(this).parents('.layout_section_outer').offset().top + (parseInt($(this).parents('.layout_section_outer').css('padding-top')) / 2);

                $('html, body').stop().animate(
                    {
                        'scrollTop' : $thisTargetTop
                    },
                    {
                        duration:500,
                        // queue: false,
                        complete: function() {
                            //console.log('complete')
                        }
                    }
                );
            }

            // $(this).parent().siblings().removeClass('active');
            // $(this).parent().addClass('active');

        })
    });
};

function cssTransitionPreload(){
    $(".css-transitions-preload").each(function (index, element) {
        setTimeout(function () { $(element).removeClass("css-transitions-preload") }, 10);
    });
}

function tabActive(tabParent, panelParent){
    var $tab = $(tabParent).children(),
        $panel = $(panelParent).children();

    $tab.on('click' , function(){
        // console.log($(this).index());

        if(!$(this).find('a').is('is-link')){
            $tab.removeClass('active');
            $(this).addClass('active');
        }

        $panel.removeClass('active');
        $panel.eq($(this).index()).addClass('active');
    });
}

function eduMemberChg(){
    var $obj = $('.esg_edu_member_area'),
        $select = $obj.find('.common-select_box'),
        $panel = $obj.children();

    $select.each(function(){
        $(this).on('change' , function(){
            var $idx = $(this).find('option:selected').index();

            $select.eq($idx).find('option').eq($idx).prop('selected' , true);
            $panel.removeClass('active');
            $panel.eq($idx).addClass('active')
        });
    });
};

function eduMemberMore(){
    var $btn = $('.member_list_more button');

    $btn.on('click' , function(){
        $('.esg_edu_member_item.active .esg_member_list').eq(0).find('li:hidden').slice(0,10).show();
        if($('.esg_edu_member_item.active .esg_member_list').eq(0).find('li:hidden').length === 0){
            $(this).parent().hide();
        }
    });
};

function eduMemberFaq(){
    var $btn = $('.education_volunteers-faq .btn_area .common-btn');

    $btn.on('click' , function(){
        $('.education_volunteers-faq .faq_list').eq(0).find('li:hidden').slice(0,5).show();
        if($('.education_volunteers-faq .faq_list').eq(0).find('li:hidden').length === 0){
            $(this).parent().hide();
        }
    });
};

function videoHeight(){
    var $obj = $('.video-wrapper');


    function autoHeight(){
        var $winH = $(window).outerHeight(),
            $headerH = $('#header').outerHeight();

        $obj.css('height', $winH - $headerH);

    }

    autoHeight();

    $(window).resize('resize' , autoHeight);
}


function btnScrollTop(){
    var $btn = $('.btn-scroll-top');

        $(window).on('scroll resize' , function(){
            var $docH = $(document).height(),
                $winH = $(window).outerHeight(),
                $scrT = $(window).scrollTop(),
                $footT = $('#footer').outerHeight();

            if($scrT >= $docH - $winH - $footT){
                $btn.addClass('is-end')
            } else {
                $btn.removeClass('is-end')
            }

            if($scrT >= $winH / 2 && $(window).width() >= 1024){
                $btn.fadeIn(300);
            } else {
                $btn.fadeOut(300);
            }
        })

    $btn.on('click' , function(){
        $("html, body").animate({scrollTop: 0},600);
    })
}

$(function(){

    /* 상단 탭 */
    $('.common-swiper_tab').each(function(i, el) {
        var slides = $(el).find('.swiper-slide'),
            idx = Math.max(slides.filter('.active').index() , 0),
            $winW = $(window).width(),
            s = undefined,
            $tab = $('.common-swiper_tab a'),
            $panel = $('[data-js="anchor-target"]'),
            $subW = $(this).parents('.common-swiper_area').is('.sub-main') ? 1400 : 1280;

        // if ( slides.eq(idx)[0].offsetLeft <= $(window).width() - slides.eq(idx).width() ) {
        //     console.log(slides.eq(idx)[0].offsetLeft)
        //     console.log(slides.eq(idx).width())
        //     idx = 0;
        // }

        function initSwiper() {
            if ($winW < $subW && s == undefined) {
                s = new Swiper(el, {
                    initialSlide : idx,
                    observer: true,
                    observeParents: true,
                    slidesPerView: 'auto',
                    on : {
                        init : function(){
                        },
                        transitionEnd : function(){
                            $('.common-swiper_area').eq(0).removeClass('is-end');
                            if(this.isEnd) {
                                $('.common-swiper_area').eq(0).addClass('is-end');
                            }
                        }
                    }
                });

                function scrollMove(){
                    $(window).on('load scroll resize' , function(){
                        $winW = $(window).width();
                        if($panel.length && $winW < 1280){
                            // console.log(s)
                            $tab.each(function(){
                                var $panelIdx = $panel.eq($(this).parent().index()),
                                    $docT = $(document).scrollTop();
                                if($panelIdx.offset() && $docT > $panelIdx.offset().top){
                                    setTimeout(function(){
                                        if(s != undefined){
                                            s.slideTo(slides.filter('.active').index());
                                        }
                                    },500)
                                }
                            });
                            clickMove();
                        }
                    });
                }

                function clickMove(){
                    slides.on('click' , function(){
                        if(s != undefined){
                            s.slideTo($(this).index());
                        }
                    });
                }

                scrollMove();

            } else if ($winW > 1400 && s != undefined) {
                s.destroy();
                s = undefined;
            };
        };

        initSwiper();

        $(window).on('resize', function () {
            $winW = $(window).width();
            initSwiper();
        });
    });

    /* 서비스 소개 */
    $('.main_biz_slider').each(function(i, el) {
        var slides = $(el).find('.swiper-slide');
        var $winW = $(window).width();
        var s = undefined;

        if(slides.length <= 1){
            $(this).find('.swiper-wrapper').addClass('is-disabled');
            $(this).find('.swiper-pagination').addClass('is-disabled');
        }

        function initSwiper() {
            // console.log('init')
            if ($winW < 769 && s == undefined) {
                s = new Swiper(el, {
                    initialSlide : 0,
                    slidesPerView: 1,
                    observer: true,
                    observeParents: true,
                    // pagination: {
                    //     clickable : true,
                    //     el: '.main_biz',
                    //     type: 'bullets'
                    // },
                    breakpoints: {
                        768: {
                            slidesPerView: 2.15,
                            spaceBetween: 0
                        },
                        480: {
                            slidesPerView: 1.15,
                            spaceBetween: 0
                        },
                    }
                });

            s.update();

            } else if ($winW > 768 && s != undefined) {
                // console.log('destory')
                s.destroy();
                s = undefined;
            };
        };

        initSwiper();

        $(window).on('resize', function () {
            $winW = $(window).width();
            initSwiper();
        });

    });

    /* 추천대상 슬라이더 */
    $('.recomm_biz_slider').each(function(i, el) {
        var $winW = $(window).width();
        var s = undefined;

        function initSwiper() {
            if ($winW < 1280 && s == undefined) {
                s = new Swiper(el, {
                    initialSlide : 0,
                    slidesPerView: 'auto',
                    observeParents : true,
                    observer: true,
                    pagination: {
                        el: '.recomm_biz',
                        type: 'bullets'
                    },
                    breakpoints: {
                        1280: {
                            slidesPerView: 1,
                            spaceBetween: 24
                        }
                    }
                });

                s.update();

            } else if ($winW > 768 && s != undefined) {
                s.destroy();
                s = undefined;
            };
        };

        initSwiper();

        $(window).on('resize', function () {
            $winW = $(window).width();
            initSwiper();
        });
    });




    /* 주요 서비스 슬라이더 */
    $('.serv_list_slider').each(function(i, el) {
          var $winW = $(window).width();
        var s = undefined;

        function initSwiper() {
            if ($winW < 1281 && s == undefined) {
                s = new Swiper(el, {
                    initialSlide : 0,
                    slidesPerView: 'auto',
                    observeParents : true,
                    observer: true,
                    pagination: {
                        el: '.ncs_biz',
                        type: 'bullets'
                    },
                    breakpoints: {
                        768: {
                            slidesPerView: 1,
                            spaceBetween: 24
                        }
                    }
                });

                s.update();

            } else if ($winW > 1280 && s != undefined) {
                s.destroy();
                s = undefined;
            };
        };

        initSwiper();

        $(window).on('resize', function () {
            $winW = $(window).width();
            initSwiper();
        });

    });

    $('.recomm_industry_slider').each(function(i, el) {
        var slides = $(el).find('.swiper-slide');
        var $winW = $(window).width();
        var s = undefined;

        if(slides.length <= 1){
            $(this).find('.swiper-wrapper').addClass('is-disabled');
            $(this).find('.swiper-pagination').addClass('is-disabled');
        }

        function initSwiper() {
            if ($winW < 769 && s == undefined) {
                s = new Swiper(el, {
                    initialSlide : 0,
                    slidesPerView: 'auto',
                    observer: true,
                    observeParents: true,
                    breakpoints: {
                        768: {
                            slidesPerView: 2.15,
                            spaceBetween: 24
                        },
                        480: {
                            slidesPerView: 1.15,
                            spaceBetween: 24
                        }
                    }
                });

                s.update();

            } else if ($winW > 768 && s != undefined) {
                s.destroy();
                s = undefined;
            };
        };

        initSwiper();

        $(window).on('resize', function () {
            $winW = $(window).width();
            initSwiper();
        });

    });

    /* 활용사례 슬라이더 */
    $('.use_case_slider').each(function(i, el) {
        var slides = $(el).find('.swiper-slide');
        var $winW = $(window).width();
        var s = undefined;

        if(slides.length <= 1){
            $(this).find('.swiper-wrapper').addClass('is-disabled');
            $(this).find('.swiper-pagination').addClass('is-disabled');
        }

        function initSwiper() {
            s = new Swiper(el, {
                initialSlide : 0,
                slidesPerView: 'auto',
                observer: true,
                observeParents: true,
                spaceBetween: 24,
                // simulateTouch : false,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                breakpoints: {
                    1280: {
                        slidesPerView: 'auto',
                        spaceBetween: 24
                        // simulateTouch : true
                    },
                    1024: {
                        slidesPerView: 'auto',
                        spaceBetween: 16
                        // simulateTouch : true
                    },
                    768: {
                        slidesPerView: 2.15,
                        spaceBetween: 16
                        // simulateTouch : true
                    },
                    600: {
                        slidesPerView: 1.15,
                        spaceBetween: 16
                        // simulateTouch : true
                    }
                }
            });

            // s.update();

            if($winW > 768){
                s.slides.removeAttr('style')
                s.update();
            }
        };

        initSwiper();

        $(window).on('resize', function () {
            $winW = $(window).width();
            initSwiper();
        });
    });

    /* 소개 영상 */
    $('.common-movie_slider').each(function(i, el) {
        var slides = $(el).find('.swiper-slide');
        var $winW = $(window).width();
        var s = undefined;

        if(slides.length <= 1){
            $(this).find('.swiper-wrapper').addClass('is-disabled');
        }

        function initSwiper() {
            s = new Swiper(el, {
                initialSlide : 0,
                slidesPerView: 'auto',
                spaceBetween: 24,
                breakpoints: {
                    1024: {
                        slidesPerView: 'auto'
                    },
                    768: {
                        slidesPerView: 1.15,
                        spaceBetween: 16
                    },
                    480: {
                        slidesPerView: 1.15,
                        spaceBetween: 16
                    },
                    375: {
                        slidesPerView: 1,
                        spaceBetween: 16
                    }
                }
            });

            // s.update();

            if($winW > 768){
                s.slides.removeAttr('style')
                s.update();
            }
        };

        initSwiper();

        $(window).on('resize', function () {
            $winW = $(window).width();
            initSwiper();
        });
    });

    $('.common-swiper_tab2').each(function(i, el) {
        var slides = $(el).find('.swiper-slide'),
            idx = Math.max(slides.filter('.active').index() , 0),
            $winW = $(window).width(),
            s = undefined;

        function initSwiper() {
            if ($winW < 1281 && s == undefined) {
                s = new Swiper(el, {
                    initialSlide : idx,
                    observer: true,
                    observeParents: true,
                    slidesPerView: 'auto'
                });

                function clickMove(){
                    slides.on('click' , function(){
                        s.slideTo($(this).index());
                    });
                }

                slides.find('a').on('click' , function(e){
                    if(!$(this).hasClass('is-link')){
                        e.preventDefault();
                    }
                });



                clickMove();

            } else if ($winW > 1280 && s != undefined) {
                s.destroy();
                s = undefined;
            };
        };

        initSwiper();

        $(window).on('resize', function () {
            $winW = $(window).width();
            initSwiper();
        });
    });

    /*
    $('.location_img_slider').each(function(i, el) {
        var slides = $(el).find('.swiper-slide'),
            $winW = $(window).width(),
            s = undefined;

        function initSwiper() {
            s = new Swiper(el, {
                initialSlide : 0,
                slidesPerView: 1,
                observer: true,
                observeParents: true,
                spaceBetween: 24,
                pagination: {
                    clickable : true,
                    el: '.location-bullet',
                    type: 'bullets'
                },
                // simulateTouch : false,
                navigation: {
                    nextEl: '.location-button-next',
                    prevEl: '.location-button-prev'
                }
            });
        };

        initSwiper();
    });
    */

    $('.esg_welfare_slider').each(function(i, el) {
        var $winW = $(window).width();
        var s = undefined;

        function initSwiper() {
            if ($winW < 769 && s == undefined) {
                s = new Swiper(el, {
                    initialSlide : 0,
                    slidesPerView: 'auto',
                    observeParents : true,
                    observer: true,
                    pagination: {
                        el: '.esg_welfare_pagination',
                        type: 'bullets'
                    },
                    breakpoints: {
                        768: {
                            slidesPerView: 1,
                            spaceBetween: 24
                        }
                    }
                });

                s.update();

            } else if ($winW > 768 && s != undefined) {
                s.destroy();
                s = undefined;
            };
        };

        initSwiper();

        $(window).on('resize', function () {
            $winW = $(window).width();
            initSwiper();
        });
    });

    /* 기술 관련 동영상 슬라이더 */
    $('.tech_movie_slider').each(function(i, el) {
        var slides = $(el).find('.swiper-slide');
        var $winW = $(window).width();
        var s = undefined;

        if(slides.length <= 1){
            $(this).find('.swiper-wrapper').addClass('is-disabled');
            $(this).find('.swiper-pagination').addClass('is-disabled');
        }

        function initSwiper() {
            s = new Swiper(el, {
                initialSlide : 0,
                slidesPerView: 2,
                observer: true,
                observeParents: true,
                spaceBetween: 24,
                // simulateTouch : false,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                breakpoints: {
                    // 1280: {
                    //     slidesPerView: 'auto',
                    //     spaceBetween: 24
                    //     // simulateTouch : true
                    // },
                    // 1024: {
                    //     slidesPerView: 'auto',
                    //     spaceBetween: 16
                    //     // simulateTouch : true
                    // },
                    // 768: {
                    //     slidesPerView: 2.15,
                    //     spaceBetween: 16
                    //     // simulateTouch : true
                    // },
                    // 600: {
                    //     slidesPerView: 1.15,
                    //     spaceBetween: 16
                    //     // simulateTouch : true
                    // }
                    600: {
                        slidesPerView: 1.15
                    }
                }
            });

            // s.update();

            if($winW > 768){
                s.slides.removeAttr('style')
                s.update();
            }
        };

        initSwiper();

        $(window).on('resize', function () {
            $winW = $(window).width();
            initSwiper();
        });
    });

    checkMobile();
    makeScroll();



    customScrollY('.provision_box');
    customScrollY('.use_case-scroll');
    customScrollY('.footer_layer_scroll');

    $(window).on('resize' , makeScroll);
    $(window).on('resize', checkMobile);


    faqInit();
    tabMove();
    tabMove2();

    cssTransitionPreload();

    tabActive('.common-swiper_tab2 .swiper-wrapper','.tab-panel_area');
    tabActive('.esg_welfare-tab .swiper-wrapper','.esg_welfare-panel');

    eduMemberChg();
    eduMemberMore();
    eduMemberFaq();

    videoHeight();

    btnScrollTop();

    setTimeout(function () { AOS.init(); }, 100);

	//230803 쓰지않음
	//$('.curri-info-cont').each(function (index, item){
	//	if($(item).children('h3').text().indexOf('개강일정') >= 0){
	//		$(item).addClass('hide')
	//		$('.curri-info-cont').addClass('curri-flex');
	//	}
	//});
});

function openKakaoMap(obj){
	var ts, key, $mapChild, paHeight;
	var $map = $(obj).find('.daumMap');
	ts = $map.data('timestamp');
	key = $map.data('key');
	$mapChild = $map.children('div');
	mapH = ( $(obj).parent().height()-35 ) || 170;

	$('.daumMap > div').html('');
	$('.daumMap > div').attr({
		'class': '',
		'id': ''
	});
	$mapChild.addClass('root_daum_roughmap root_daum_roughmap_landing');
	$mapChild.attr('id', 'daumRoughmapContainer'+ts);

	 new daum.roughmap.Lander({
		"timestamp" : ts,
		"key" : key,
		"mapHeight" : mapH
	}).render(); 
}//카카오맵(자신 객체로사용)

