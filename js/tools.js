var sliderPeriod    = 5000;
var sliderTimer     = null;

(function($) {

    $(document).ready(function() {

        $('.header-office-link').click(function(e) {
            $(this).parent().toggleClass('open');
            e.preventDefault();
        });

        $(document).click(function(e) {
            if ($(e.target).parents().filter('.header-office').length == 0) {
                $('.header-office.open').removeClass('open');
            }
        });

        $('.header-office-popup div').click(function() {
            $('.header-office.open').removeClass('open');
        });

        $('.slider').each(function() {
            var curSlider = $(this);
            curSlider.data('curIndex', 0);
            curSlider.data('disableAnimation', true);
            curSlider.find('.slider-content li:first').css({'z-index': 2, 'left': 0, 'top': 0});
            var curHTML = '';
            curSlider.find('.slider-content li').each(function() {
                curHTML += '<a href="#"></a>';
            });
            $('.slider-ctrl').html(curHTML);
            $('.slider-ctrl a:first').addClass('active');
            sliderTimer = window.setTimeout(sliderNext, sliderPeriod);
        });

        function sliderNext() {
            var curSlider = $('.slider');

            if (curSlider.data('disableAnimation')) {
                var curIndex = curSlider.data('curIndex');
                var newIndex = curIndex + 1;
                if (newIndex >= curSlider.find('.slider-content li').length) {
                    newIndex = 0;
                }

                curSlider.data('curIndex', newIndex);
                curSlider.data('disableAnimation', false);

                curSlider.find('.slider-content li').eq(curIndex).css({'z-index': 2});
                curSlider.find('.slider-content li').eq(newIndex).css({'z-index': 1, 'left': 0, 'top': 0}).show();

                curSlider.find('.slider-ctrl a.active').removeClass('active');
                curSlider.find('.slider-ctrl a').eq(newIndex).addClass('active');

                curSlider.find('.slider-content li').eq(curIndex).fadeOut(function() {
                    curSlider.data('disableAnimation', true);
                    sliderTimer = window.setTimeout(sliderNext, sliderPeriod);
                });
            }
        }

        $('.slider').on('click', '.slider-ctrl a', function(e) {
            if (!$(this).hasClass('active')) {
                window.clearTimeout(sliderTimer);
                sliderTimer = null;

                var curSlider = $('.slider');
                if (curSlider.data('disableAnimation')) {
                    var curIndex = curSlider.data('curIndex');
                    var newIndex = $('.slider-ctrl a').index($(this));

                    curSlider.data('curIndex', newIndex);
                    curSlider.data('disableAnimation', false);

                    curSlider.find('.slider-content li').eq(curIndex).css({'z-index': 2});
                    curSlider.find('.slider-content li').eq(newIndex).css({'z-index': 1, 'left': 0, 'top': 0}).show();

                    curSlider.find('.slider-ctrl a.active').removeClass('active');
                    curSlider.find('.slider-ctrl a').eq(newIndex).addClass('active');

                    curSlider.find('.slider-content li').eq(curIndex).fadeOut(function() {
                        curSlider.data('disableAnimation', true);
                        sliderTimer = window.setTimeout(sliderNext, sliderPeriod);
                    });
                }
            }

            e.preventDefault();
        });

        $('.gallery-video a, .gallery-photos a').fancybox({
            helpers: {
                media: true,
                overlay: {
                    locked: false
                }
            },
            tpl: {
                closeBtn : '<a title="Закрыть" class="fancybox-item fancybox-close" href="javascript:;"></a>',
                next     : '<a title="Следующая" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',
                prev     : '<a title="Предыдущая" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'
            },
            padding: 0
        });

        $('.services-item-mobile-open').click(function(e) {
            var curLink = $(this);
            var curText = curLink.html();
            curLink.html(curLink.attr('rel'));
            curLink.attr('rel', curText);
            curLink.parent().toggleClass('open');
            e.preventDefault();
        });

        $('.content-crop-open').click(function(e) {
            $(this).parent().toggleClass('open');
            e.preventDefault();
        });

        $('input.maskPhone').mask('+7 (999) 999-99-99');

        $.extend($.validator.messages, {
            required: 'Не заполнено поле',
            email: 'Введен некорректный e-mail'
        });

        $('.form-select select').chosen({disable_search: true});

        $('form').each(function() {
            $(this).validate({
              invalidHandler: function(form, validatorcalc) {
                  validatorcalc.showErrors();
                  $('.form-file').each(function() {
                      var curField = $(this);
                      if (curField.find('label.error').length > 0) {
                          curField.after(curField.find('label.error').clone());
                          curField.find('label.error').remove();
                      }
                  });
              }
            });
        });

        $('.form-checkbox span input:checked').parent().addClass('checked');
        $('.form-checkbox').click(function() {
            $(this).find('span').toggleClass('checked');
            $(this).find('input').prop('checked', $(this).find('span').hasClass('checked')).trigger('change');
        });

        $('.form-radio span input:checked').parent().addClass('checked');
        $('.form-radio').click(function() {
            var curName = $(this).find('input').attr('name');
            $('.form-radio input[name="' + curName + '"]').parent().removeClass('checked');
            $(this).find('span').addClass('checked');
            $(this).find('input').prop('checked', true).trigger('change');
        });

        $('.form-file input').change(function() {
            $(this).parent().parent().find('.form-file-title').html($(this).val().replace(/.*(\/|\\)/, '')).show();
            $(this).parent().parent().parent().find('label.error').remove();
        });

        $('.header-callback a').click(function(e) {
            $.ajax({
                type: 'GET',
                url: $(this).attr('href'),
                dataType: 'html',
                cache: false
            }).done(function(html) {
                if ($('.window').length > 0) {
                    windowClose();
                }
                windowOpen(html);

                $('.window input.maskPhone').mask('+7 (999) 999-99-99');
                $('.window form').validate({
                    submitHandler: function(form) {
                        $.ajax({
                            type: 'POST',
                            url: $(form).attr('action'),
                            data: $(form).serialize(),
                            dataType: 'html',
                            cache: false
                        }).done(function(html) {
                            if ($('.window').length > 0) {
                                windowClose();
                            }
                            windowOpen(html);
                        });
                    }
                });

            });
            e.preventDefault();
        });

        $('.search-mobile').click(function(e) {
            $(this).toggleClass('active');
            $('.search-mobile-form').toggleClass('active');

            $('.menu-mobile, .menu-mobile-content, .side').removeClass('active');

            e.preventDefault();
        });

        $('.menu-mobile').click(function(e) {
            $(this).toggleClass('active');
            $('.menu-mobile-content').toggleClass('active');

            $('.search-mobile, .search-mobile-form, .side').removeClass('active');

            e.preventDefault();
        });

        $('.menu-mobile-content > ul > li > a').click(function(e) {
            if ($(this).find('span').length > 0) {
                $(this).parent().toggleClass('open');
                e.preventDefault();
            }
        });

        $('.menu-mobile-content > ul > li.active').each(function() {
            if ($(this).find('span').length > 0) {
                $(this).addClass('open');
            }
        });

        $('.side-menu-link').click(function(e) {
            $('.side').toggleClass('active');

            $('.menu-mobile, .menu-mobile-content, .search-mobile, .search-mobile-form').removeClass('active');

            e.preventDefault();
        });

    });

    $(window).bind('load resize', function() {
        $('.content-crop').each(function() {
            var curBlock = $(this);
            if (curBlock.find('.content-crop-inner').height() > curBlock.height()) {
                curBlock.addClass('active');
            } else {
                curBlock.removeClass('active');
            }
        });
    });

    function windowOpen(contentWindow) {
        var windowWidth     = $(window).width();
        var windowHeight    = $(window).height();
        var curScrollTop    = $(window).scrollTop();

        var bodyWidth = $('body').width();
        $('body').css({'height': windowHeight, 'overflow': 'hidden'});
        var scrollWidth =  $('body').width() - bodyWidth;
        $('body').css({'padding-right': scrollWidth + 'px'});
        $(window).scrollTop(0);
        $('.top').css({'margin-top': -curScrollTop});
        $('.top').data('scrollTop', curScrollTop);

        $('body').append('<div class="window"><div class="window-overlay"></div><div class="window-loading"></div><div class="window-container window-container-load"><div class="window-content">' + contentWindow + '<a href="#" class="window-close">Закрыть</a></div></div></div>')

        if ($('.window-container img').length > 0) {
            $('.window-container img').each(function() {
                $(this).attr('src', $(this).attr('src'));
            });
            $('.window-container').data('curImg', 0);
            $('.window-container img').load(function() {
                var curImg = $('.window-container').data('curImg');
                curImg++;
                $('.window-container').data('curImg', curImg);
                if ($('.window-container img').length == curImg) {
                    $('.window-loading').remove();
                    $('.window-container').removeClass('window-container-load');
                    windowPosition();
                }
            });
        } else {
            $('.window-loading').remove();
            $('.window-container').removeClass('window-container-load');
            windowPosition();
        }

        $('.window-overlay').click(function() {
            windowClose();
        });

        $('.window-close').click(function(e) {
            windowClose();
            e.preventDefault();
        });

        $('body').bind('keyup', keyUpBody);
    }

    function windowPosition() {
        var windowWidth     = $(window).width();
        var windowHeight    = $(window).height();

        if ($('.window-container').width() > windowWidth - 110) {
            $('.window-container').css({'margin-left': 55, 'left': 'auto'});
            $('.window-overlay').width($('.window-container').width() + 110);
        } else {
            $('.window-container').css({'margin-left': -$('.window-container').width() / 2});
        }

        if ($('.window-container').height() > windowHeight - 80) {
            $('.window-overlay').height($('.window-container').height() + 80);
        } else {
            $('.window-container').css({'margin-top': -$('.window-container').height() / 2});
        }
    }

    function keyUpBody(e) {
        if (e.keyCode == 27) {
            windowClose();
        }
    }

    function windowClose() {
        $('body').unbind('keyup', keyUpBody);
        $('.window').remove();
        $('.top').css({'margin-top': '0'});
        $('body').css({'height': 'auto', 'overflow': 'visible', 'padding-right': 0});
        $(window).scrollTop($('.top').data('scrollTop'));
    }

})(jQuery);