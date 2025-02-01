"use strict";


$(function () {



    const isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (
                isMobile.Android() ||
                isMobile.BlackBerry() ||
                isMobile.iOS() ||
                isMobile.Opera() ||
                isMobile.Windows()
            );
        },
    };

    function getNavigator() {
        if (isMobile.any() || window.innerWidth < 992) {
            $("body").removeClass("_pc").addClass("_touch");
        } else {
            $("body").removeClass("_touch").addClass("_pc");
        }
    }

    getNavigator();

    $(window).on("resize", () => getNavigator());



    // click handler
    $(document).on('click', function (e) {

        let $target = $(e.target);

        if ($target.is('.favorite-btn')) {
            $target.toggleClass('active')
        }

        // menu
        if ($target.hasClass('icon-menu')) {
            $(".header").toggleClass("open-menu");
            $("body").toggleClass("lock-menu");
        }

        if ($target.is('.menu')) {
            $(".header").removeClass("open-menu");
            $("body").removeClass("lock-menu");
        }


        // header search
        if ($target.is('[data-seach-toggler]')) {
            $target.toggleClass('active');
            $('.header__search').toggleClass('active');
        }


        // submenu
        if ($target.is('.menu__link')) {

            let $submenu = $target.next();
            if ($submenu.length > 0) {
                e.preventDefault();
            }

            if ($target.hasClass('active')) {

                $target.removeClass('active');
                $submenu.removeClass('active');

            } else {

                $('.menu__link').removeClass('active');
                $('.submenu').removeClass('active');

                $target.addClass('active');
                $submenu.addClass('active');
            }

        }
    });




    // fancybox settings

    $('[data-fancybox]').fancybox({
        touch: false,
    });

    if ($('[name="question"]').length > 0) {
        $('[name="question"]').on('change', function () {

            $('.popup__form').removeClass('active');
            $(`.popup__form#${$(this).val()}`).addClass('active');

        })
    }





    // sliders

    if ($('.cases__slider').length > 0) {

        $('.cases__slider').slick({
            infinite: true,
            centerMode: true,
            centerPadding: '20px',
            slidesToShow: 1,
        });
    }

    if ($('.gallery__slider').length > 0) {

        $('.gallery__slider').slick({
            infinite: true,
            slidesToShow: 1,
        });
    }





    // header height

    getHeaderHeight();

    function getHeaderHeight() {
        const headerHeight = $('.header').outerHeight();
        $("body").css('--header-height', headerHeight + "px");
        return headerHeight;
    }

    window.addEventListener('resize', () => getHeaderHeight());


    $(window).on('scroll', function () {
        if ($(this).scrollTop() > getHeaderHeight()) {
            $('header').addClass('scroll');
        } else {
            $('header').removeClass('scroll');
        }
        if ($('.benefits').length > 0) {
            if (window.scrollY > ($('.benefits').offset().top - getHeaderHeight())) {
                $('header').addClass('bordered');
            } else {
                $('header').removeClass('bordered');
            }
        }
    });


    // animation

    // init ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    function initPromoAnimation() {
        if ($('.promo').length === 0) return;

        let promoSection = $('.promo');
        let promoTitle = $('.promo__title');
        let promoLogo = $('.promo__logo');
        let promoColumn = $('.promo__column');
        let promoImageWrapper = $('.promo__image');

        function updateAnimation() {
            let targetHeight = promoSection.outerHeight();

            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: promoSection[0],
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                    pin: true,
                }
            });

            tl.to([promoTitle, promoLogo, promoColumn], {
                opacity: 0,
                height: 0,
                paddingTop: 0,
                paddingBottom: 0,
                duration: 1
            }, 0).to(promoImageWrapper, {
                height: targetHeight - getHeaderHeight(),
                marginTop: getHeaderHeight(),
                duration: 1
            }, 0);
        }

        ScrollTrigger.matchMedia({
            "(min-width: 992px)": function () {
                updateAnimation();
            }
        });
    }


    initPromoAnimation();

    window.addEventListener('resize', () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        initPromoAnimation();
    });

    // project-card parallax

    if ($('.project-card__image').length > 0) {

        gsap.to('.project-card__image img', {
            y: "-20%",
            ease: 'none',
            scrollTrigger: {
                trigger: '.project-card',
                start: `${-1 * getHeaderHeight()}px top`,
                end: 'bottom top',
                scrub: true
            },
        });
    }




});
