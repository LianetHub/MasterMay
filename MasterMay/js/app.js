"use strict";


$(function () {


    // detect webP support
    function testWebP(callback) {
        let webP = new Image();
        webP.onload = webP.onerror = function () {
            callback(webP.height == 2);
        };
        webP.src =
            "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    }

    testWebP(function (support) {
        if (support == true) {
            $("body").addClass("webp");
        } else {
            $("body").addClass("no-webp");
        }
    });

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

        // // menu
        // if ($target.hasClass('icon-menu')) {
        //     $(".header").toggleClass("open-menu");
        //     $("body").toggleClass("lock-menu");
        // }

        // if ($target.is('.menu')) {
        //     $(".header").removeClass("open-menu");
        //     $("body").removeClass("lock-menu");
        // }

        // if ($target.is('.complectation__spoller')) {
        //     $target.toggleClass('active').next().slideToggle()
        // }

        // if ($target.is('.similar__item-title')) {
        //     $target.toggleClass('active').next().slideToggle();
        // }


        // // submenu
        // if ($target.is('.menu__link')) {

        //     let $submenu = $target.next();
        //     if ($submenu.length > 0) {
        //         e.preventDefault();
        //     }

        //     if ($target.hasClass('active')) {

        //         $target.removeClass('active');
        //         $submenu.removeClass('active');

        //     } else {

        //         $('.menu__link').removeClass('active');
        //         $('.submenu').removeClass('active');

        //         $target.addClass('active');
        //         $submenu.addClass('active');
        //     }

        // }


        // //  visual block 
        // if ($target.is('.visual__point')) {
        //     let $currentAction = $target.parent(".visual__item");
        //     let $currentList = $target.next(".visual__info");

        //     if ($target.hasClass('active')) {
        //         $currentAction.removeClass('active');
        //         $target.removeClass('active');
        //         $currentList.slideUp();
        //     } else {

        //         $('.visual__item').removeClass('active');
        //         $('.visual__point').removeClass('active');
        //         $('.visual__info').slideUp();


        //         $currentAction.addClass('active');
        //         $target.addClass('active');
        //         $currentList.slideDown();
        //     }
        // }

        // // clients tabs
        // if ($target.is('.clients__tabs-btn')) {
        //     let index = $target.index();
        //     updateClientsTabs(index);
        // }


    });

    if ($(".clients-slider-toggler").length > 0) {
        $(".clients-slider-toggler").on('change', (e) => {
            let index = $(e.target).val();
            updateClientsTabs(index);
        })
    }



    function updateClientsTabs(index) {
        $('.clients__tabs-btn').eq(index).addClass('active').siblings().removeClass('active');
        $('.clients__tabs-content').eq(index).addClass('active').siblings().removeClass('active');
        $('.clients__controls').eq(index).addClass('active').siblings().removeClass('active');
        $('.clients-slider-toggler').val(index);
        $('.clients-slider.slick-initialized').slick("setPosition");
    }





    // fancybox settings

    $('[data-fancybox]').fancybox({
        touch: false,
    });




    // range slider

    const rangeFilters = $('.catalog__filters-row');

    if (rangeFilters.length > 0) {
        rangeFilters.each(function () {
            const rangeSlider = $(this).find('.catalog__filters-range')[0];
            const startInput = $(this).find('.catalog__filters-input_start');
            const endInput = $(this).find('.catalog__filters-input_end');
            const inputs = [startInput, endInput];


            function formatNumber(value) {
                return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
            }

            function parseNumber(value) {
                return parseInt(value.replace(/\s/g, ''));
            }

            function updateMaxLength(input) {
                const maxLength = parseInt(input.attr('maxlength'));
                const numLength = maxLength - Math.floor((maxLength - 1) / 4);
                input.attr('maxlength', numLength);
            }

            updateMaxLength(startInput);
            updateMaxLength(endInput);

            startInput.val(formatNumber(startInput.val()));
            endInput.val(formatNumber(endInput.val()));

            noUiSlider.create(rangeSlider, {
                start: [parseNumber(startInput.val()), parseNumber(endInput.val())],
                connect: true,

                range: {
                    'min': [parseInt(startInput.attr('min'))],
                    'max': [parseInt(endInput.attr('max')) || 1000000]
                }
            });

            rangeSlider.noUiSlider.on('update', function (values, handle) {
                inputs[handle].val(formatNumber(Math.round(values[handle])));
            });

            rangeSlider.noUiSlider.on('start', function (values, handle) {
                inputs[handle].addClass('active');
            });

            const setRangeSlider = (i, value) => {
                let arr = [null, null];
                arr[i] = parseNumber(value);
                rangeSlider.noUiSlider.set(arr);
            };

            $.each(inputs, function (index, input) {
                $(input).on('change', function (e) {
                    setRangeSlider(index, $(this).val());
                });
            });

            $.each(inputs, function (index, input) {
                $(input).on('input', function (e) {
                    let value = $(this).val();
                    value = value.replace(/[^\d]/g, '');
                    $(this).val(formatNumber(value));
                    $(this).addClass('active');
                });
            });


        });
    }



    // sliders

    if ($('.about__slider').length > 0) {

        getDesktopSlick('.about__slider', {
            infinite: true,
            variableWidth: true,
            arrows: false,
            autoplay: true,
        });
    }

    if ($('.clients__photos').length > 0) {
        $('.clients__photos').slick({
            infinite: false,
            slidesToShow: 2.75,
            prevArrow: '.clients__photos-prev',
            nextArrow: '.clients__photos-next',
            rtl: true,
            responsive: [
                {
                    breakpoint: 992,
                    settings: {
                        variableWidth: false,
                        slidesToShow: 2,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        variableWidth: false,
                        slidesToShow: 1,
                    }
                }
            ]
        });
    }

    if ($('.clients__videos').length > 0) {
        $('.clients__videos').slick({
            infinite: false,
            variableWidth: true,
            prevArrow: '.clients__videos-prev',
            nextArrow: '.clients__videos-next',
            rtl: true,
            responsive: [
                {
                    breakpoint: 1400,
                    settings: {
                        variableWidth: false,
                        slidesToShow: 1.5,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        variableWidth: false,
                        slidesToShow: 1,
                    }
                }
            ]
        });
    }

    if ($('.about-page__slider').length > 0) {
        $('.about-page__slider').slick({
            infinite: true,
            arrows: false,
            autoplay: true,
            slidesToShow: 3.55,
            responsive: [
                {
                    breakpoint: 1400,
                    settings: {
                        slidesToShow: 3,
                    }
                },
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 2.75,
                    }
                },
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 2,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1.5,
                    }
                },
                {
                    breakpoint: 576,
                    settings: {
                        slidesToShow: 1,
                    }
                },
            ]
        });
    }

    if ($('.technologies__slider').length > 0) {
        $('.technologies__slider').slick({
            infinite: true,
            autoplay: true,
            slidesToShow: 1.84,
            arrows: false,
            responsive: [
                {
                    breakpoint: 1400,
                    settings: {
                        variableWidth: false,
                        slidesToShow: 1.5,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        variableWidth: false,
                        slidesToShow: 1,
                    }
                }
            ]
        });
    }

    if ($('.product-card__slider').length > 0) {
        $('.product-card__slider').slick({
            slidesToShow: 1,
            arrows: true,
            dots: true,
            speed: 500,
            fade: true,
            cssEase: 'linear'
        });
    }

    class CustomSlider {
        constructor(sliderSelector, options = {}) {
            this.slider = $(sliderSelector);
            this.slides = this.slider.find(options.slideSelector);
            this.prevBtn = $(options.prevBtn);
            this.nextBtn = $(options.nextBtn);

            this.currentIndex = options.currentIndex || 0;
            this.slideMargin = options.slideMargin || 0;
            this.slideWidth = this.calculateSlideWidth();
            this.onSlideChangeCallback = options.onSlideChange || (() => { });

            this.touchStartX = 0;
            this.touchEndX = 0;

            this.init();
        }

        calculateSlideWidth() {
            const windowWidth = $(window).width();
            switch (true) {
                case (windowWidth < 576):
                    return windowWidth - 2 * this.slideMargin - 20;
                case (windowWidth < 768):
                    return 240;
                case (windowWidth < 992):
                    return 350;
                case (windowWidth < 1200):
                    return 400;
                default:
                    return 500;
            }
        }

        updateSlides() {
            this.slides.removeClass('active');
            this.slides.eq(this.currentIndex).addClass('active');
            const offset = -(this.currentIndex * (this.slideWidth + this.slideMargin));
            this.slider.css('transform', `translate3d(${offset}px, 0, 0)`);
            this.slider.css('margin-left', `-${this.slideMargin / 2}px`);
            this.onSlideChangeCallback(this);
        }

        init() {
            this.slides.css('margin', `0 ${this.slideMargin / 2}px`);
            this.nextBtn.on('click', () => this.nextSlide());
            this.prevBtn.on('click', () => this.prevSlide());
            $(window).on('resize', () => {
                this.slideWidth = this.calculateSlideWidth();
                this.updateSlides();
            });
            this.slides.on('click', (e) => this.slideToClickedSlide(e));
            this.slider.on('touchstart', (e) => this.handleTouchStart(e));
            this.slider.on('touchmove', (e) => this.handleTouchMove(e));
            this.slider.on('touchend', () => this.handleTouchEnd());
            this.updateSlides();
        }

        nextSlide() {
            this.currentIndex = (this.currentIndex + 1) % this.slides.length;
            this.updateSlides();
        }

        prevSlide() {
            this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
            this.updateSlides();
        }

        slideToClickedSlide(event) {
            const clickedIndex = this.slides.index($(event.currentTarget));
            if (clickedIndex !== this.currentIndex) {
                this.currentIndex = clickedIndex;
                this.updateSlides();
            }
        }

        handleTouchStart(event) {
            this.touchStartX = event.originalEvent.touches[0].clientX;
        }

        handleTouchMove(event) {
            this.touchEndX = event.originalEvent.touches[0].clientX;
        }

        handleTouchEnd() {
            const deltaX = this.touchEndX - this.touchStartX;

            if (Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.prevSlide();
                } else {
                    this.nextSlide();
                }
            }
        }

        onSlideChange() {
            return this.currentIndex;
        }
    }


    if ($('.projects__slider').length > 0) {
        new CustomSlider('.projects__slider', {
            slideSelector: '.projects__slide',
            prevBtn: '.projects__prev',
            nextBtn: '.projects__next',
            currentIndex: 1,
            slideMargin: 20,
            onSlideChange: (slider) => {
                $('.projects__info').removeClass("active");
                $('.projects__info').eq(slider.currentIndex).addClass("active");
            }
        });
    }

    // mobile slick
    function getDesktopSlick(sliderName, options) {
        let init = false;

        function initSlick() {
            if (window.innerWidth >= 768) {
                if (!init) {
                    $(sliderName).slick(options);
                    init = true;
                }
            } else if (init) {
                $(sliderName).slick('unslick');
                init = false;
            }
        }

        initSlick();
        window.addEventListener('resize', initSlick);
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
    });


});
