(function(e){"use strict";var t=e.fancybox,n=function(t,n,r){r=r||"";if(e.type(r)==="object"){r=e.param(r,true)}e.each(n,function(e,n){t=t.replace("$"+e,n||"")});if(r.length){t+=(t.indexOf("?")>0?"&":"?")+r}return t};t.helpers.media={defaults:{youtube:{matcher:/(youtube\.com|youtu\.be|youtube-nocookie\.com)\/(watch\?v=|v\/|u\/|embed\/?)?(videoseries\?list=(.*)|[\w-]{11}|\?listType=(.*)&list=(.*)).*/i,params:{autoplay:1,autohide:1,fs:1,rel:0,hd:1,wmode:"opaque",enablejsapi:1},type:"iframe",url:"//www.youtube.com/embed/$3"},vimeo:{matcher:/(?:vimeo(?:pro)?.com)\/(?:[^\d]+)?(\d+)(?:.*)/,params:{autoplay:1,hd:1,show_title:1,show_byline:1,show_portrait:0,fullscreen:1},type:"iframe",url:"//player.vimeo.com/video/$1"},metacafe:{matcher:/metacafe.com\/(?:watch|fplayer)\/([\w\-]{1,10})/,params:{autoPlay:"yes"},type:"swf",url:function(t,n,r){r.swf.flashVars="playerVars="+e.param(n,true);return"//www.metacafe.com/fplayer/"+t[1]+"/.swf"}},dailymotion:{matcher:/dailymotion.com\/video\/(.*)\/?(.*)/,params:{additionalInfos:0,autoStart:1},type:"swf",url:"//www.dailymotion.com/swf/video/$1"},twitvid:{matcher:/twitvid\.com\/([a-zA-Z0-9_\-\?\=]+)/i,params:{autoplay:0},type:"iframe",url:"//www.twitvid.com/embed.php?guid=$1"},twitpic:{matcher:/twitpic\.com\/(?!(?:place|photos|events)\/)([a-zA-Z0-9\?\=\-]+)/i,type:"image",url:"//twitpic.com/show/full/$1/"},instagram:{matcher:/(instagr\.am|instagram\.com)\/p\/([a-zA-Z0-9_\-]+)\/?/i,type:"image",url:"//$1/p/$2/media/?size=l"},google_maps:{matcher:/maps\.google\.([a-z]{2,3}(\.[a-z]{2})?)\/(\?ll=|maps\?)(.*)/i,type:"iframe",url:function(e){return"//maps.google."+e[1]+"/"+e[3]+""+e[4]+"&output="+(e[4].indexOf("layer=c")>0?"svembed":"embed")}}},beforeLoad:function(t,r){var i=r.href||"",s=false,o,u,a,f;for(o in t){if(t.hasOwnProperty(o)){u=t[o];a=i.match(u.matcher);if(a){s=u.type;f=e.extend(true,{},u.params,r[o]||(e.isPlainObject(t[o])?t[o].params:null));i=e.type(u.url)==="function"?u.url.call(this,a,f,r):n(u.url,a,f);break}}}if(s){r.href=i;r.type=s;r.autoHeight=false}}}})(jQuery);

// bm global - moved from functions.js
Bm = {
    isMobile: false, // check on DOM ready (functions.js)
    mobile: {
        // init => mobile.js
    },
    social: {

    },
    user: {

    },
    feed: {

        /**
         * Работа с историей
         */
        changeHistory: function($el, event) {
            if (event.metaKey || event.ctrlKey || event.which == 2) {
                return false;
            }

            var post = $el.parents('.post').data('id'),
                path = window.location.pathname + '?from=' + post,
                $loading = $('.screen-loading'),
                $loadingIcon = $loading.children('.icon'),
                rotate,
                $content = Bridge.isMobile ? $('.js-main') : $('#main, #footer'),
                scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

            $content.addClass('hidden');
            window.scrollTo(0, 0);

            setTimeout(function() {
                $loading.removeClass('hidden');
                rotate = rotateStart($loadingIcon);
            }, 5000);

            $(document).on('click', '.js-stop-screen-loading', function() {
                $loading.addClass('hidden');
                $content.removeClass('hidden');
                rotateStop($loadingIcon, rotate);
                window.scrollTo(0, scrollTop);
            });

            window.history.replaceState(null, null, path);
        },

        /**
         * Читать далее
         */
        readMore: function($button) {
            var $wrapper = $button.parents('.js-post-text-wrapper');
            var $full = $wrapper.find('.js-post-text-full');

            $full.toggleClass('hidden');

            if ($button.data('long-post')) {
                $button.removeClass('js-post-text-readmore');
            } else {
                $button.toggleClass('hidden');
            }
        }
    },
    ajax: function($item, data) {
        if ($item.hasClass('ajax-disabled')) {
            return false;
        }

        var $loading = $item.children('.loading'),
            rotate;

        $.ajax({
            type: data.type || 'POST',
            url: data.url,
            data: data.data,
            timeout: 30000,
            beforeSend: function(result) {
                $item.addClass('ajax-disabled');
                rotate = rotateStart($loading);

                if (data.beforeSend) {
                    data.beforeSend(result);
                }
            },
            success: function(result) {
                if (data.success) {
                    data.success(result);
                }
            },
            error: function(result) {
                if (data.error) {
                    data.error(result);
                }
            }
        }).always(function() {
            $item.removeClass('ajax-disabled');
            rotateStop($loading, rotate);
        });
    },
    fancybox: {
        modals: {
            standart: {
                options: {
                    maxWidth	: 800,
                    padding     : 0,
                    height		: 'auto',
                    width       : 'auto',
                    openEffect  : 'none',
                    closeEffect : 'none',
                    autoSize    : false,
                    fitToView   : false,
                    closeBtn    : false,
                    scrolling   : false
                }
            },
            auth: {
                id: '#popup_auth',
                selector: '.fancybox-popup_login',
                options: {
                    padding     : 0,
                    height		: 'auto',
                    width       : 'auto',
                    openEffect  : 'none',
                    closeEffect : 'none',
                    autoSize    : false,
                    fitToView   : false,
                    closeBtn    : false,
                    beforeClose : function() {
                        $('.popup .popup__error').empty().hide();
                        $('.popup .item .input').removeClass('error');
                        $('.popup .item .input-error').empty().hide();
                    },
                    afterShow: function() {
                        if (this.href === '#popup_auth') {
                            $('#popup_auth input[name="login"]').focus();
                        } else if (this.href === '#popup_registration') {
                            $('#popup_registration input[name="email"]').focus();
                        } else if (this.href === '#popup_pwd_remind') {
                            $('#popup_pwd_remind input[name="email"]').focus();
                        }
                    }
                },
                onInit: function() {
                    $(this.selector).fancybox(this.options);
                },
                open: function(title, successUrl) {
                    var $container = $(this.id);

                    successUrl = successUrl || null;
                    title = title || null;

                    if(successUrl) {
                        $container.find('input[name=success_url]').val(successUrl);
                    }
                    if(title) {
                        $container.find('h3').html(title);
                    }

                    $.fancybox.open(this.id, this.options);
                }
            },
            media: {
                selector: '[data-video="fancybox"]',
                options: {
                    openEffect  : 'none',
                    closeEffect : 'none',
                    type        : 'iframe',
                    helpers : {
                        media : {}
                    },
                    closeBtn: false,
                    beforeShow: function(){
                        this.skin.append('<div class="fancyboxClose"></div>');
                    }
                },
                onInit: function() {
                    $(this.selector).fancybox(this.options);
                }
            }
        },
        open: function(id) {
            $.fancybox.open({href: '#' + id}, Bm.fancybox.modals.standart.options);
        }
    },
    search: {
        show: function($el) {
            if ($el && $el.hasClass('js-disabled')) {
                return false;
            }

            var $popup = $('.search-popup_block'),
                $overlay = $('.search-overlay'),
                $body = $('body'),
                $input = $popup.find('.search-popup_input'),
                pageScrollTop = document.documentElement.scrollTop || document.body.scrollTop;

            $body.css({'overflow': 'hidden'}).scrollTop(pageScrollTop);

            $popup.removeClass('hidden');
            $overlay.removeClass('hidden');
            $input.focus();
        },
        hide: function() {
            var $popup = $('.search-popup_block'),
                $overlay = $('.search-overlay'),
                $body = $('body');

            $body.css('overflow', 'auto');

            $popup.addClass('hidden');
            $overlay.addClass('hidden');
        }
    },
    menu: {
        show: function() {
            $('body').addClass('position-fixed');
            $('.header-menu-overlay').show();
            $('.header-entry-left-main-block').show().animate({
                'marginLeft' : '-500px',
                'opacity' : '1'
            }, 200);
        },
        hide: function() {
            $('body').removeClass('position-fixed');
            $('.header-entry-left-main-block').animate({
                'opacity' : '0',
                'marginLeft' : '-100%'
            }, 200);
            $('.header-menu-overlay').hide(200);
        }
    },
    switch: {

    },
    scroll: {
        value: 0,
        getValue: function() {
            Bm.scroll.value = document.documentElement.scrollTop || document.body.scrollTop;
        },
        setValue: function(value) {
            if (value) {
                window.scrollTo(0, value);
            } else {
                window.scrollTo(0, Bm.scroll.value);
                Bm.scroll.value = 0;
            }
        }
    },
    lock: function() {
        $('body').addClass('overflow-hidden').addClass('position-fixed');
    },
    unlock: function() {
        $('body').removeClass('overflow-hidden').removeClass('position-fixed');
    }
};

Bm.ab = (function(module) {
    var abPages = [];

    module.addPage = function(id, pages) {
        if(abPages[id]) {
            console.log('AbTest ' + id + ' already registered');
        } else {
            abPages[id] = pages;
        }
    };

    module.invokeTest = function(testId, pageId, request) {
        if(!abPages[testId]) {
            console.log('AbTest ' + testId + 'not register')
        } else {
            abPages[testId][pageId](request);
        }
    };

    return module;
}(Bm.ab || {}));
$(function() {


    /**
     * check mobile
     *
     * @type {*|jQuery}
     */
    Bridge.isMobile = $('body').hasClass('mobile');

    /**
     * check mobile
     */
    if (!Bridge.isMobile) {
        /**
         * popup open
         */
        $(document).on('click', '.js-popup-open', function() {
            Bridge.fancybox.open($(this).attr('href').substr(1));
        });

        /**
         * guest click
         */
        $(document).on('click', '.js-disabled', function() {
            Bridge.fancybox.modals.auth.open();
        });

        /**
         * auth popup open
         */
        $(document).on('click', '.js-popup-auth', function() {
            Bridge.fancybox.modals.auth.open();
        });

        /**
         * popup close
         */
        $(document).on('click', '.js-popup-close', function() {
            $.fancybox.close();
        });

    }

    /**
     * submit forms
     */
    $(document).on('click', '.js-form-submit', function() {
        $(this).parents('form').submit();
    });

    /**
     * bm8 dropdown
     */
    $(document).on('click', '.js-user-dropdown-toggle', function() {
        $('.js-user-dropdown').toggleClass('hidden');
    });
    $(document).on('click', function(e) {
        var $el = $(e.target);

        if (!$el.hasClass('js-user-dropdown-toggle') && !$el.parents().hasClass('js-user-dropdown-toggle') && !$el.hasClass('js-user-dropdown') && !$el.parents().hasClass('js-user-dropdown')) {
            $('.js-user-dropdown').addClass('hidden');
        }
    });
});

var Validator = {
    filters: {
        trim: function(value) {
            return jQuery.trim(value);
        },
        phoneCode: function(value) {
            if (8 == value) {
                return '+7';
            }

            var pattern = /^[0-9]{1,3}$/;
            if (pattern.test(value)) {
                return '+' + value;
            }

            return value;
        }
    },

    validators: {
        email: {
            pattern: /^(([^а-я<>()[\]\\.,;:\s@\"]+(\.[^а-я<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: 'Введите корректный e-mail',
            filters: ['trim']
        },
        name: {
            pattern: /^([a-zа-яA-ZА-ЯёЁ\-0-9 ]+)$/,
            message: "Введите корректное имя",
            filters: ['trim']
        },
        lastname: {
            pattern: /^([a-zа-яA-ZА-ЯёЁ\-0-9 ]+)$/,
            message: "Введите корректную фамилию",
            filters: ['trim']
        },
        phone: {
            pattern: /^([0-9]+)$/,
            message: "Введите корректный телефон",
            filters: ['trim']
        },
        city: {
            pattern: /^([a-zа-яA-ZА-ЯёЁ\-0-9 ]+)$/,
            message: "Введите корректное название города",
            filters: ['trim']
        },
        phone_code: {
            pattern: /^(\+[0-9]{1,3})$/,
            message: "Введите корректный код страны, например, +7",
            filters: ['trim', 'phoneCode']
        },
        partner: {
            pattern: /^([A-Za-z0-9]+)$/,
            message: "Введите корректный код партнера",
            filters: ['trim']
        },
        sms_code: {
            pattern: /^([0-9]+)$/,
            message: "Введите корректный смс код",
            filters: ['trim']
        },
        message: {
            pattern: /(.+)/,
            message: "Введите корректное сообщение",
            filters: ['trim']
        },
        captcha: {
            pattern: /^([A-Za-z0-9]+)$/,
            message: "Введите код на картинке",
            filters: ['trim']
        }
    },

    filter: function(value, filters) {
        for (var i = 0; i < filters.length; i++) {
            var filterName = filters[i];
            value = this.filters[filterName](value);
        }
        return value;
    },

    lastError: '',

    isValid: function(element) {
        var t = this;
        var isValid = true;
        element.find('[data-validator]:enabled').each(function() {
            var type = $(this).data('validator');
            var value = $(this).attr('value');
            var show = $(this).data('validator-show');

            if (t.validators[type] != undefined) {
                if (t.validators[type]['filters'] != undefined) {
                    value = t.filter(value, t.validators[type]['filters']);
                    $(this).attr('value', value);
                }
                if (!t.validators[type].pattern.test(value)) {
                    t.lastError = t.validators[type].message;
                    if (show == 'none') {
                        //пока так, все нормально
                    } else {
                        // вместо нормальных блоков с нотификациями зачем-то нужно делать алерты................
                        //$('#svyazErrorBlock').text(t.lastError);
                        alert(t.lastError);
                    }
                    $(this).focus();
                    return isValid = false;
                }
                else {
                    $('#svyazErrorBlock').empty();
                }
            }
        });
        element.find('select.city_0306').each(function() {
            var value = $(this).val();
            if (value == "-") {
                alert("Выберете город участия");
                return isValid = false;
            }
        });
        return isValid;
    }
};

var Bridge = {
    isMobile: false,
    fancybox: {
        modals: {
            standart: {
                options: {
                    maxWidth: 800,
                    padding: 0,
                    height: 'auto',
                    width: 'auto',
                    openEffect: 'none',
                    closeEffect: 'none',
                    autoSize: false,
                    fitToView: false,
                    closeBtn: false,
                    scrolling: false
                }
            },
            auth: {
                id: '#popup_auth',
                selector: '.fancybox-popup_login',
                options: {
                    padding: 0,
                    height: 'auto',
                    width: 'auto',
                    openEffect: 'none',
                    closeEffect: 'none',
                    autoSize: false,
                    fitToView: false,
                    closeBtn: false,
                    beforeClose: function() {
                        $('.popup .popup__error').empty().hide();
                        $('.popup .item .input').removeClass('error');
                        $('.popup .item .input-error').empty().hide();
                    },
                    afterShow: function() {
                        if (this.href === '#popup_auth') {
                            $('#popup_auth input[name="login"]').focus();
                        } else if (this.href === '#popup_registration') {
                            $('#popup_registration input[name="email"]').focus();
                        } else if (this.href === '#popup_pwd_remind') {
                            $('#popup_pwd_remind input[name="email"]').focus();
                        }
                    }
                },
                onInit: function() {
                    $(this.selector).fancybox(this.options);
                },
                open: function(title, successUrl) {
                    var $container = $(this.id);

                    successUrl = successUrl || null;
                    title = title || null;

                    if (successUrl) {
                        $container.find('input[name=success_url]').val(successUrl);
                    }
                    if (title) {
                        $container.find('h3').html(title);
                    }

                    $.fancybox.open(this.id, this.options);

                    if (Bridge.CapturePointsController) {
                        Bridge.CapturePointsController.setIsWatchedByPath(location.pathname);
                    }
                }
            },
            image: {
                config: {
                    2: {
                        differentTexts: true,
                        titleReg: 'Зарегистрируйтесь<br>и продолжайте',
                        titleAuth: 'Войдите и продолжайте',
                        text: 'Полный просмотр материала доступен для зарегистрированных пользователей'
                    },
                    4: {
                        differentTexts: false,
                        title: 'Получите подборку лучших историй выпускников Бизнес молодости, чтобы не тратить время на их поиск',
                        text: 'Введите адрес электронной почты, которой вы пользуетесь каждый день, нажмите «Получить кейсы» и мы пришлем подборку лучших кейсов',
                        buttonTitle: 'Получить кейсы'
                    },
                    8: {
                        differentTexts: true,
                        img: 'eye',
                        titleReg: 'Зарегистрируйтесь<br>и продолжайте',
                        titleAuth: 'Войдите и продолжайте',
                        text: 'Полный доступ к материалам сайта доступен для зарегистрированных пользователей'
                    },
                    9: {
                        differentTexts: true,
                        img: 'eye',
                        titleReg: 'Зарегистрируйтесь<br>и продолжайте',
                        titleAuth: 'Войдите и продолжайте',
                        text: 'Полный доступ к материалам сайта доступен для зарегистрированных пользователей'
                    }
                },
                remind: function (id, registerPage) {
                    this.open("popup_pwd_remind-image", id, registerPage);
                },
                registration: function (id, registerPage, afterActivationUrl) {
                    var config = this.config[id];
                    var title = config.differentTexts ? config.titleReg : config.title;

                    $("#popup_registration-image .popup__title").html(title);

                    if (config.buttonTitle) {
                        $("#popup_registration-image .bm-button").text(config.buttonTitle);
                    }
                    if (registerPage) {
                        $("#popup_registration-image input[name=register_page]").val(registerPage);
                    }
                    if (afterActivationUrl) {
                        $("#popup_registration-image input[name=after_activation_url]").val(afterActivationUrl);
                    }

                    this.open("popup_registration-image", id, registerPage, afterActivationUrl);
                },
                auth: function (id) {
                    var config = this.config[id];
                    var title = config.differentTexts ? config.titleAuth : config.title;

                    $("#popup_auth-image .popup__title").html(title);

                    if (config.buttonTitle) {
                        $("#popup_auth-image .bm-button").text(config.buttonTitle);
                    }

                    this.open("popup_auth-image", id);
                },
                open: function (elementId, id) {
                    var config = this.config[id];
                    var imgEl = $("#" + elementId + " .popup__img");

                    $("#" + elementId).attr("data-popup_id", id);
                    $("#" + elementId + " .popup__text").html(config.text);

                    imgEl.hide();
                    if (config.image_class) {
                        imgEl.show().removeAttr("class").addClass("popup__img").addClass(config.image_class);
                    }

                    Bridge.fancybox.open("#" + elementId);
                }
            }
        },
        open: function(id) {
            $.fancybox.open({href: '#' + id}, Bridge.fancybox.modals.standart.options);
        }
    }
};

var Bm = Bm || {};

/*
 * Глобальный файлик для подключения обработчиков
 */

$(function() {

    /**
     * Вернуться назад
     */
    $('.js-return-back').on('click', function() {
        if (history.length && history.length > 2) {
            history.back();

            return false;
        }
    });

});
// hints
function hintsShow(id) {
    var $hints = $('#hints');

    $('body').addClass('overflow-hidden').addClass('position-fixed');
    $hints.show();
    $hints.find('.hint' + id).show();
}

function hintsHide() {
    $('body').removeClass('overflow-hidden').removeClass('position-fixed');
    $('#hints').hide();
}

// rotate
function rotateStart($item) {
    var rotate,
        deg = 0;

    rotate = setInterval(function() {
        deg--;

        if (deg === -360) {
            deg = 0;
        }

        $item.css({
            '-ms-transform': 'rotate(' + deg + 'deg)',
            '-o-transform': 'rotate(' + deg + 'deg)',
            '-moz-transform': 'rotate(' + deg + 'deg)',
            '-webkit-transform': 'rotate(' + deg + 'deg)',
            'transform': 'rotate(' + deg + 'deg)'
        });
    }, 1);

    return rotate;
}

function rotateStop($item, rotate) {
    var deg = 0;

    $item.css({
        '-ms-transform': 'rotate(' + deg + 'deg)',
        '-o-transform': 'rotate(' + deg + 'deg)',
        '-moz-transform': 'rotate(' + deg + 'deg)',
        '-webkit-transform': 'rotate(' + deg + 'deg)',
        'transform': 'rotate(' + deg + 'deg)'
    });

    clearInterval(rotate);
}

// format numbers 3417585 => 3 417 585
function ebensFormat(num) {
    num = num.toString();
    num = num.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&nbsp;');

    return num;
}

/**
 * Process auto request
 *
 * @param $el
 */
function processAutoRequest($el) {

    var event_id = $el.data('event'),
        product_id = $el.data('product'),
        redirect = $el.data('redirect') ? $el.data('redirect') : window.location.pathname,
        isWebinar = $el.data('webinar') ? true : false;

    var showLoading = function() {
        $.fancybox('Идет обработка запроса', {
            modal: true,
            overlayColor: "#000000",
            overlayOpacity: 0.5,
            padding: 50,
            centerOnScroll: true,
            closeBtn: false,
            beforeShow: function(){
                this.skin.append('<div class="fancyboxClose"></div>');
            }
        });
    };

    $.ajax({
        url: '/request/auto/',
        data: {
            event_id: event_id,
            product_id: product_id
        },
        type: 'POST',
        beforeSend: showLoading,
        success: function(response) {
            console.log(response);
            if(response.errorCode == 1 || response.errorCode == 2) {
                if (isWebinar) {
                    window.location = redirect + "?requestId=" + response.requestId + '&requestHash=' + response.requestHash;
                } else {
                    window.location = redirect + "?request=" + response.requestId + "&security_code=" + response.securityCode;
                }
            } else {
                window.location = $this.attr('href');
            }
        }
    });
}

/**
 * Strip tags (used for wysiwig)
 *
 * @param str
 * @param allowed_tags
 *
 * @returns {*}
 */
function strip_tags (str, allowed_tags) {

    var key = '', allowed = false;
    var matches = [];
    var allowed_array = [];
    var allowed_tag = '';
    var i = 0;
    var k = '';
    var html = '';
    var replacer = function (search, replace, str) {
        return str.split(search).join(replace);
    };

    if (allowed_tags) {
        allowed_array = allowed_tags.match(/([a-zA-Z0-9]+)/gi);
    }

    str += '';

    matches = str.match(/(<\/?[\S][^>]*>)/gi);

    for (key in matches) {
        if (isNaN(key)) {
            continue;
        }

        html = matches[key].toString();
        allowed = false;

        for (k in allowed_array) {
            allowed_tag = allowed_array[k];
            i = -1;

            if (i != 0) { i = html.toLowerCase().indexOf('<'+allowed_tag+'>');}
            if (i != 0) { i = html.toLowerCase().indexOf('<'+allowed_tag+' ');}
            if (i != 0) { i = html.toLowerCase().indexOf('</'+allowed_tag)   ;}

            if (i == 0) {
                allowed = true;
                break;
            }
        }

        if (!allowed) {
            str = replacer(html, "", str); // Custom replace. No regexing
        }
    }

    return str;
}

$(function(){
    // assetic
    $(document).on('click', '.js-admin-assetic', function() {
        var $button = $(this),
            $url = $(this).data('url'),
            $theme = $(this).data('theme'),
            $layout = $(this).data('layout');

        if ($button.hasClass('disabled')) {
            return false;
        }

        $button.removeClass('error success');

        $.ajax({
            type: 'POST',
            url: $url,
            data: {
                theme: $theme,
                layout: $layout
            },
            beforeSend: function() {
                $button.addClass('disabled');
            },
            success: function (data) {
                $button.removeClass('disabled')
                if (data.status == 'success') {
                    $button.addClass('success');
                } else {
                    $button.addClass('error');
                }
            },
            error: function() {
                $button.removeClass('disabled').addClass('error');
            }
        });
    });

    // form select
    $(document).on('click', '.js-form-select', function() {
        var find = $(this).hasClass('js-find'),
            item = find ? $(document).find('.js-form-select[data-select="' + $(this).data('select')+ '"]') : $(this),
            block = item.parents('.js-form-block'),
            select = item.data('select'),
            form = block.find($('.js-form[data-form="' + select + '"]'));

        item.addClass('active').siblings().removeClass('active');
        form.removeClass('hidden').siblings().addClass('hidden');
    });

    for(var type in Bm.fancybox.modals) {
        if (Bm.fancybox.modals[type].hasOwnProperty('onInit')) {
            Bm.fancybox.modals[type]['onInit']();
        }
    }

    Bm.ab.addPage(1000, {
        js_main: function(request) {
            console.log(request);
            if(request['emailLink']) {
                var $abButton = $('#popup_main_done_email');
                $abButton.find('.email-link-js').attr('href', request['emailLink']);
                Bm.fancybox.open($abButton.attr('id'));
            } else {
                Bm.fancybox.open('popup_main_done');
            }
        },
        js_redirect: function(request) {
            window.location.href = request['redirect']
        }
    });

    // close hints
    $(document).on('click', '#hints', function() {
        hintsHide();
    });

    // custom fancybox close button
    $(document).on('click', '.fancyboxClose, .js-popup-close', function() {
        $.fancybox.close()
    });

    // applause
    $(document).on('mouseenter', '.check-in-js .clap.active', function() {
        var clap = $(this);
        var profit = $(this).next('.profit');

        if(profit.length == 0){
            return false;
        }
        $('.check-in-js .tooltip').hide();
        if (!profit.hasClass('active')) {
            clap.children('.tooltip').show()
        }
    });
    $(document).on('mouseleave', '.check-in-js .clap.active', function() {
        var self = this;
        setTimeout(function(){
            $(self).children('.tooltip').hide();
        }, 500);
    });
    $(document).on('click', '.check-in-js .clap', function(e){
        var clap = $(this),
            profit = $(this).next('.profit'),
            url = clap.data('url'),
            redirect = clap.data('redirect'),
            $item = $('.check-in-js .clap[data-url="' + url + '"]'),
            $counter = $item.find('[data-like-counter="' + url + '"]');

        if (clap.hasClass('disabled')) {
            if (Bridge.isMobile) {
                Bm.mobile.popup.show('login');
            } else {
                Bridge.fancybox.modals.auth.open(null, redirect);
            }

            return false;
        }

        if ($(e.target).closest('.tooltip').length == 1 && !profit.hasClass('active')) {
            profit.trigger('click');

            return false;
        }

        if (clap.hasClass('active')) {
            $.ajax({
                type: 'GET',
                url: url,
                data: {direction: 0},
                success: function(data){
                    if (!data.status || data.status !== 'ok') {
                        return false;
                    }
                    profit.addClass('disabled');

                    $item.removeClass('active');
                    $counter.html('<span class="icon"></span>Нравится ' + data.count);

                    clap.children('.tooltip').hide()
                }
            });
        } else {
            $.ajax({
                type: 'GET',
                url: url,
                data: {direction: 1},
                success: function(data){
                    if (!data.status || data.status !== 'ok') {
                        return false;
                    }
                    profit.removeClass('disabled');

                    $item.addClass('active');
                    $counter.html('<span class="icon"></span>Нравится ' + data.count);

                    if (profit.length != 0 && !profit.hasClass('active')) {
                        clap.children('.tooltip').show();
                    }
                }
            });
        }

        return false;
    });

    // profit
    $(document).on('click', '.check-in-js .profit', function(){
        var profit = $(this);
        var clap = profit.prev('.clap');
        var url = profit.data('url');
        var redirect = clap.data('redirect');

        if(profit.hasClass('disabled')){
            return false;
        }

        if(profit.hasClass('active')){
            if(confirm('Вы больше не считаете материал полезным?')){

                $.ajax({
                    type: 'GET',
                    url: url,
                    data: {direction: 0},
                    success: function(data){
                        if(!data.status || data.status !== 'ok'){
                            return false;
                        }

                        profit.removeClass('active');
                        $('[data-like-counter="' + url + '"]').text(data.count);
                    }
                });
            }
        } else {
            if(confirm('Вы действительно хотите отметить материал как полезный?')){

                $.ajax({
                    type: 'GET',
                    url: url,
                    data: {direction: 1},
                    success: function(data){
                        if(!data.status || data.status !== 'ok'){
                            return false;
                        }

                        profit.addClass('active');
                        $('[data-like-counter="' + url + '"]').text(data.count);
                        profit.prev('.clap').children('.tooltip').hide();

                        if(data.record_likes_count){
                            clap.addClass('active');
                            clap.children('span').text(data.record_likes_count);
                        }
                    }
                });
            }
        }
    });

    // textarea autoresize
    if($.fn.autosize){
        $('#opros textarea, textarea.autosize').autosize();
    }

    // custom select
    if($.fn.selectbox){
        $('select.selectbox').selectbox();
    }

    // Case block
    $(document).on('click', '.caseBlock .caseReadmore', function(){
        var caseBlock = $(this).parents('.caseBlock');

        if($(this).hasClass('hide')){
            caseBlock.find('.caseFullText').fadeOut(600);
            $(this).text('Читать далее').removeClass('hide');

            $('html, body').animate({
                scrollTop: caseBlock.offset().top
            }, 600);
        } else {
            caseBlock.find('.caseFullText').fadeIn(600);
            $(this).text('Скрыть текст').addClass('hide');

            $('html, body').animate({
                scrollTop: caseBlock.find('.caseFullText').offset().top
            }, 600);
        }
    });

    var Form = function() {
        var $form = null,
            $requestForm,
            $submit,
            $loading,
            $error,
            rotate,
            need_sms_activation = false,
            submitted = 1,
            urls = [
            '/request/only_register/',
            '/request/new/'
        ];

        var redirect_choices = {
            0: '/accept/',
            1: '/accept/',
            2: window.location.pathname + 'success/',
            3: window.location.pathname + 'success/'
        };
        var redirect_choice = 1;

        this.init = function(element) {
            $form = $(element);

            $requestForm = $(element);
            $submit = $requestForm.find('.js-request-form-submit');
            $loading = $requestForm.find('.js-request-form-loading');
            $error = $requestForm.find('.js-request-form-error');

            if($form.find("input[name=need_redirect]").val() != 0) {
                redirect_choice = $form.find("input[name=need_redirect]").val();
            }
            if($form.has('[data-sms]').length) {
                need_sms_activation = true;
                submitted = 0;
            }

            $form.find('[name=eventChanger]').change(function(){
                if ($(this)[0].tagName == 'SELECT') {
                    var $selectInput = $(this);
                    $.each($selectInput.find(':selected').data(), function(k, v){
                        $selectInput.data(k, v);
                    });
                }
                $form.find('input[name="event_id"]').attr('value', $(this).data('event'));
                $form.find('input[name="product_id"]').attr('value', $(this).data('product'));
                $form.find('input[name="redirect"]').attr('value', $(this).data('redirect'));
                $form.find('input[name="need_redirect"]').attr('value', $(this).data('need_redirect'));
            });

            $form.attr('onsubmit', '');
            $form.on('submit', function(e){
                if ($form.data('invalid')) {
                    return false;
                }
                if ($form.find('select[name=eventChanger]').length && !$form.find('select[name=eventChanger]').data('product')) {
                    alert('Вы должны выбрать город');
                    return false;
                }

                if ($form.attr('target') == '_blank') {

                    // Проверяем параметр формы
                    if (!checkValidation()) {
                        return false;
                    }

                    // Передаем управление в форму
                    return true;
                } else {
                    submitMainForm();
                }

                return false;
            });

            $('[data-updatecaptcha]').live('click', function(e){
                e.preventDefault();
                updateCaptcha();
            });

            $('[data-resendsms]').live('click', function(e){
                e.preventDefault();
                updatePhoneArea();
            });

        };

        var updatePhoneArea = function() {
            $form.find('input[name=firstname]').attr('readonly', 'readonly');
            $form.find('input[name=email]').attr('readonly', 'readonly');

            $.ajax({
                cache: false,
                url: '/request/phone_activation/',
                type: 'POST',
                timeout: 15000,
                data: {
                    phone_country: $form.find('input[name=phone_country_code]').val(),
                    phone_code: $form.find('input[name=phone_code]').val(),
                    phone: $form.find('input[name=phone]').val(),
                    page_id: $form.find('input[name=event_id]').val()
                },
                success: fillPhoneArea,
                error: showTimeoutError
            });
        };

        var fillPhoneArea = function(data) {
            hideLoading();
            if(data.status == 'success') {
                $form.find('[data-sms]').html(data.message);
            } else {
                $.fancybox(data.message, {
                    overlayColor: "#000000",
                    overlayOpacity: 0.5,
                    padding: 50,
                    closeBtn: false,
                    beforeShow: function(){
                        this.skin.append('<div class="fancyboxClose"></div>');
                    }
                });
            }

            var submitButton = $form.find('button[type=submit]');
            $form.off('submit');
            $(submitButton).text('Отправить');

            if ($form.find('.user-captcha').length) {
                $form.on('submit', function(e) {
                    e.preventDefault();
                    submitCaptchaForm();
                });
            } else if ($form.find(".activation_phone_accepted").length) {
                $(submitButton).hide();
                submitted = 1;
                submitMainForm();
            } else {
                $form.on('submit', function(e) {
                    e.preventDefault();
                    submitPhoneActivationForm();
                });
            }
        };

        var updateCaptcha = function() {
            var src = $form.find('.user-captcha').attr('src') + '?rnd=' + Math.random();
            $form.find('.user-captcha').attr('src', src);
        };

        var showLoading = function() {
            if (Bridge.isMobile && $requestForm.hasClass('js-request-form')) {
                $loading.removeClass('hidden');
                $submit.addClass('hidden');
                $error.empty().addClass('hidden');
                rotate = rotateStart($loading);
            } else {
                $.fancybox('Идет обработка запроса', {
                    modal: true,
                    overlayColor: "#000000",
                    overlayOpacity: 0.5,
                    padding: 50,
                    centerOnScroll: true,
                    closeBtn: false,
                    beforeShow: function(){
                        this.skin.append('<div class="fancyboxClose"></div>');
                    }
                });
            }
        };

        var showTimeoutError = function(message, errorCode) {
            ga_product_type = $form.find("input[name=product_type]").val();
            ga_product_name = "product_"+ $form.find("input[name=product_id]").val();
            ga('send','event','form_send_mistake',ga_product_type,ga_product_name);
            if(message instanceof Object) {
                message = 'Попробуйте отправить форму повторно';
            }
            message = message || 'Попробуйте отправить форму повторно';
            title = 'Извините, произошла ошибка.<br>'
            if(errorCode) {
                if(errorCode == 6) {
                    title = 'Операция выполнена успешно.<br/>'
                }
            }
            setTimeout(function() {
                if (Bridge.isMobile && $requestForm.hasClass('js-request-form')) {
                    $loading.addClass('hidden');
                    $submit.removeClass('hidden');
                    $error.text(message).removeClass('hidden');
                    rotate = rotateStop($loading, rotate);
                } else {
                    $.fancybox(title + message, {
                        overlayColor: "#000000",
                        overlayOpacity: 0.5,
                        padding: 50,
                        closeBtn: false,
                        beforeShow: function() {
                            this.skin.append('<div class="fancyboxClose"></div>');
                        }
                    });
                }
            }, 300);
            dataLayer.push({
                    'event': 'mixdata',
                    'eventCategory': 'Forms',
                    'eventAction': 'response',
                    'eventContent': 'Заявка',
                    'eventLabel': 'unsuccessful',
                    'errorCode': errorCode + ' ' + message
                }
            );
        };

        var hideLoading = function() {
            setTimeout(function() {
                if (Bridge.isMobile && $requestForm.hasClass('js-request-form')) {
                    $loading.addClass('hidden');
                    $submit.removeClass('hidden');
                    rotate = rotateStop($loading, rotate);
                } else {
                    $.fancybox.close();
                }
            }, 300);
        };

        var submitCaptchaForm = function() {
            if (!checkValidation()) {
                return false;
            }

            $.ajax({
                cache: false,
                url: '/request/phone_activation/',
                type: 'POST',
                timeout: 15000,
                data: {
                    phone_country: $form.find('input[name=phone_country_code]').val(),
                    phone_code: $form.find('input[name=phone_code]').val(),
                    phone: $form.find('input[name=phone]').val(),
                    captcha: $form.find('input[name=captcha]').val(),
                    page_id: $form.find('input[name=event_id]').val(),
                    confirm_captcha: 1
                },
                beforeSend: showLoading,
                success: fillPhoneArea,
                error: showTimeoutError
            });
        };

        var submitPhoneActivationForm = function() {
            if (!checkValidation()) {
                return false;
            }

            $.ajax({
                cache: false,
                url: '/request/phone_activation/',
                type: 'POST',
                timeout: 15000,
                data: {
                    code: $form.find('input[name=phone_activation_code]').val(),
                    activation_id: $form.find('input[name=phone_activation_id]').val(),
                    confirm_form_send: 1
                },
                beforeSend: showLoading,
                success: fillPhoneArea,
                error: showTimeoutError
            });
        };

        var submitMainForm = function() {

            if (!checkValidation()) {
                //ga_product_type = $form.find("input[name=product_type]").val();
                //ga_product_name = "product_"+ $form.find("input[name=product_id]").val();
                //ga('send','event','form_send_mistake',ga_product_type,ga_product_name);
                return false;
            }
			/*$.ajax({
                cache: false,
                url: $form.attr('action'),
                timeout: 15000,
                type: 'POST',
                data: $form.serialize(),
                beforeSend: showLoading,
                success:  parseRequest,
                error: showTimeoutError
            });*/
			$form.ubind('submit');
			$form.submit();

            return true;
        };

        /**
         * Проверка валидации
         *
         * @returns boolean
         */
        var checkValidation = function() {
            return Validator.isValid($form);
        };

        var parseRequest = function(request) {
            ga_product_type = $form.find("input[name=product_type]").val();
            ga_product_name = $form.find("input[name=product_name]").val();
            ga_event_name = $form.find("input[name=event_name]").val();
            ga_product_price = $form.find("input[name=product_price]").val();
            ga_product_id = $form.find("input[name=product_id]").val();
            ga_event_id = $form.find("input[name=event_id]").val();
            ga_event_default_id = $form.find("input[name=event_default_id]").val();

            if (request['redirect_system'] !== undefined && request['redirect_system'] != '') {
                // отправлять всю эту хрень надо только для вновь созданных заявок, если уже была заявка, то не отправлять
                if (request.errorCode == 1) {
                    ga('send', 'event', 'form_send', ga_product_type, ga_product_name);
                    ga('send', 'pageview', '/form_send/');
                    if (ga_product_price > 0) {
                        dataLayer.push({
                            event: "addToCart",
                            ecommerce: {
                                add: {
                                    products: [{
                                        id: ga_product_id, /// айди товара
                                        name: ga_product_name, // название продукта
                                        price: ga_product_price, /// цена за продукт
                                        quantity: 1 // Количество добавленых товаров ( по идеи должен быть всегда 1)
                                    }]
                                }
                            }
                        });
                    } else if (ga_event_name.indexOf('Онлайн') != -1) {
                        variant = 'Онлайн';
                        if (ga_event_default_id != ga_event_id) {
                            variant = 'Живое';
                        }
                        dataLayer.push({
                            event: "addToCart",
                            ecommerce: {
                                add: {
                                    products: [{
                                        id: ga_event_default_id, /// айди товара
                                        name: ga_event_name, // название продукта
                                        price: ga_product_price, /// цена за продукт
                                        quantity: 1, // Количество добавленых товаров ( по идеи должен быть всегда 1)
                                        variant: variant
                                    }]
                                }
                            }
                        });
                    } else {
                        dataLayer.push({
                            event: "addToCart",
                            ecommerce: {
                                add: {
                                    products: [{
                                        id: ga_event_default_id, /// айди товара
                                        name: ga_event_name, // название продукта
                                        price: ga_product_price, /// цена за продукт
                                        quantity: 1, // Количество добавленых товаров ( по идеи должен быть всегда 1)
                                    }]
                                }
                            }
                        });
                    }
                    dataLayer.push({
                            'event': 'mixdata',
                            'eventCategory': 'Forms',
                            'eventAction': 'response',
                            'eventContent': 'Заявка',
                            'eventLabel': 'successful'
                        }
                    );
                }
                window.location = request['redirect_system'];
                return;
            }

            redirect_choice = $form.find("input[name=need_redirect]").attr('value');
            if (request.errorCode == 0 || request.errorCode == 3 || request.errorCode == 6 || request.errorCode == 8 || request.errorCode == 9) {
                showTimeoutError(request['errorMessage'], request.errorCode);
            } else if (request.errorCode == 5) {
                ga('send','event','form_send_mistake',ga_product_type,ga_product_name);
                // Специальный режим, при котором запрещено покупать продукт - отправляем на страницу /fail/
                window.location = 'http://' + window.location.hostname + window.location.pathname + 'fail/';
            } else {
                if((need_sms_activation == true) && (submitted == 0)) {
                    $.fancybox.close();
                    updatePhoneArea();
                } else {
                    var redirect = $form.find("input[name=redirect]").val();
                    if(redirect == '') {
                        redirect = redirect_choices[redirect_choice];
                    }
                    // отправлять всю эту хрень надо только для вновь созданных заявок, если уже была заявка, то не отправлять
                    if (request.errorCode == 1) {
                        ga('send','event','form_send',ga_product_type,ga_product_name);
                        ga('send', 'pageview', '/form_send/');
                        dataLayer.push({
                                'event': 'mixdata',
                                'eventCategory': 'Forms',
                                'eventAction': 'response',
                                'eventContent': 'Заявка',
                                'eventLabel': 'successful'
                            }
                        );
                        if(ga_product_price>0) {
                            dataLayer.push({
                                event: "addToCart",
                                ecommerce: {
                                    add: {
                                        products: [{
                                            id: ga_product_id, /// айди товара
                                            name: ga_product_name, // название продукта
                                            price: ga_product_price, /// цена за продукт
                                            quantity: 1 // Количество добавленых товаров ( по идеи должен быть всегда 1)
                                        }]
                                    }
                                }
                            });
                        } else if (ga_event_name.indexOf('Онлайн')!=-1) {
                            variant = 'Онлайн';
                            if (ga_event_default_id!=ga_event_id) {
                                variant = 'Живое';
                            }
                            dataLayer.push({
                                event: "addToCart",
                                ecommerce: {
                                    add: {
                                        products: [{
                                            id: ga_event_default_id, /// айди товара
                                            name: ga_event_name, // название продукта
                                            price: ga_product_price, /// цена за продукт
                                            quantity: 1, // Количество добавленых товаров ( по идеи должен быть всегда 1)
                                            variant: variant
                                        }]
                                    }
                                }
                            });
                        } else {
                            dataLayer.push({
                                event: "addToCart",
                                ecommerce: {
                                    add: {
                                        products: [{
                                            id: ga_event_default_id, /// айди товара
                                            name: ga_event_name, // название продукта
                                            price: ga_product_price, /// цена за продукт
                                            quantity: 1, // Количество добавленых товаров ( по идеи должен быть всегда 1)
                                        }]
                                    }
                                }
                            });
                        }

                        yaCounter6044530.reachGoal('form_send_'+ga_product_type);
                    }

                    switch(redirect_choice) {
                        case '4':
                            var href = redirect + '?' + $.param({
                                    name:  $form.find("input[name=firstname]").val(),
                                    tel: $form.find("input[name=phone_code]").val() + $form.find("input[name=phone]").val(),
                                    mail: $form.find("input[name=email]").val(),
                                    client_id: request.userId
                                });
                            console.log(href);
                            $.fancybox.open(
                                {
                                    type: 'iframe',
                                    fitToView: false,
                                    width: 940,
                                    height: 580,
                                    padding: 0,
                                    margin: 20,
                                    autoSize: false,
                                    closeClick: false,
                                    openEffect: 'none',
                                    closeEffect: 'none',
                                    wrapCSS: 'intickets',
                                    helpers: {
                                        overlay : {
                                            closeClick : false
                                        }
                                    },
                                    href : href
                                }
                            );
                            break;
                        case '3':
                            $.ajax({
                                url: redirect,
                                type: 'GET',
                                data: {email: $form.find("input[name=email]").val()},
                                timeout: 15000,
                                complete: function(response, responseStatus) {
                                    $.fancybox.close();
                                    if(responseStatus == 'success') {
                                        $form.next().remove();
                                        $form.next().remove();
                                        $form.replaceWith(response.responseText);
                                    } else {
                                        alert('Произошла ошибка, попробуйте позже');
                                    }
                                }
                            });
                            break;
                        case '2':
                            // #4874 для ссылок, которые содержат в себе get-параметры, не надо добавлять email
                            if (redirect.indexOf('?category_id') >= 0) {
                                window.location = redirect;
                            } else {
                                window.location = redirect + "?requestId=" + request.requestId + '&requestHash=' + request.requestHash;
                            }
                            break;
                        case '6':
                            var redirect2 = $form.find("input[name=redirect2]").val();
                            if (request.errorCode == 2) {
                                window.location = redirect2;
                            } else {
                                window.location = redirect + "?requestId=" + request.requestId + '&requestHash=' + request.requestHash;
                            }
                            break;
                        case '1':
                        default:
                            window.location = redirect + "?request=" + request.requestId + "&security_code=" + request.securityCode;
                    }
                }
            }
        }
    };


    $('form[data-form=request]').each(function() {
        new Form().init(this);
    });


    $('[data-widget=timer]').each(function(){
        var t = this;
        var wr_hours = function() {
            var oToday = new Date();
            //var sTime = "December 11, 2012 12" +  ":15" + ":00"; //до какого числа таймер
            // задаём время с точностью до секунды — это не педантизм,
            // а важная деталь, избавляющая от багов при вычислении разницы между датами
            var sTime = $(t).data('timer');
            var oDeadLineDate = new Date(sTime); // собственно устанавливаем «час Икс»
            var sek = Math.floor((oDeadLineDate - oToday) / 1000);
            if(sek <= 0 && sek >= -2) {
                window.location = window.location.pathname;
                return false;
            }
            var sec= sek % 60 ; //сколько секунд осталось
            var min= Math.floor((sek /60)%60) ;//сколько минут осталось
            var hoursek= Math.floor((sek / (60*60)) %24) ;//сколько часов осталось
            var days= Math.floor(sek /(24*60*60)) ;//сколько дней осталось
            var time_wr= "" +days+"д. "+hoursek+"ч. " +min+"м. " +sec+"с.";
            if (days > 31) {
                time_wr= ""+(days-30)+"д. "+hoursek+"ч. " +min+"м. " +sec+"с.";
            }
            $(t).html(time_wr);
        };
        setInterval(wr_hours, 1000);
    });

    $('form[data-form=event-check]').submit(function () {
        var $t = $(this);
        if(!Validator.isValid($t)) {
            return false;
        }

        var email = $t.find('input[name=email]').val();
        var redirect = $t.find("input[name=redirect]").val();
        var redirect_choice = $t.find("input[name=need_redirect]").attr('value');
        if(redirect == '') {
            redirect = window.location.pathname + 'success/';
        }

        $.fancybox('Идет обработка запроса', {
            modal: true,
            overlayColor: "#000000",
            overlayOpacity: 0.5,
            padding: 50,
            centerOnScroll: true,
            closeBtn: false,
            beforeShow: function(){
                this.skin.append('<div class="fancyboxClose"></div>');
            }
        });

        $.ajax({
            cache: false,
            url: $t.attr('action'),
            timeout: 15000,
            type: 'POST',
            data: $t.serialize(),

            success:  function (data) {
                setTimeout(function() {
                    $.fancybox.close();
                }, 300);
                if (data.status == 'success') {
                    if (redirect_choice == 3) {
                        $.ajax({
                            url: redirect,
                            type: 'GET',
                            data: {email: email},
                            timeout: 15000,
                            complete: function(response, responseStatus) {
                                $.fancybox.close();
                                if(responseStatus == 'success') {
                                    $t.prev().remove();
                                    $t.prev().remove();
                                    $t.replaceWith(response.responseText);
                                } else {
                                    alert('Произошла ошибка, попробуйте позже');
                                }
                            }
                        });
                    } else {
                        // #4874 для ссылок, которые содержат в себе get-параметры, не надо добавлять email
                        if (redirect.indexOf('?category_id') >= 0) {
                            window.location = redirect;
                        } else {
                            window.location.href = redirect + "?requestId=" + data.message.requestId + '&requestHash=' + data.message.requestHash;
                        }
                    }
                } else if (data.status == 'message') {
                    $t.find('.email-response').addClass('success').html(data.message);
                } else {
                    $t.find('.email-response').removeClass('success').html(data.message);
                }
            },
            error: function(data) {
                setTimeout(function() {
                    $.fancybox('Извините, произошла ошибка. <br />Попробуйте отправить форму позднее', {
                        overlayColor: "#000000",
                        overlayOpacity: 0.5,
                        padding: 50,
                        closeBtn: false,
                        beforeShow: function(){
                            this.skin.append('<div class="fancyboxClose"></div>');
                        }
                    });
                }, 300);
            }
        });
        return false;
    });

    $('select[data-action="selectPriceByCity"]').on('change', function() {

        var cityId = $(this).val();

        var callback = function(el) {
            var productId = $(el).data('product-id');
            var eventId = $(el).data('event-id');
            var cityId = $(el).val();
            var cityName = $(el).find(':selected').text();
            var parentBlock = 'span.js-city-price-main-block',
                cityBlock = 'span.js-change-city-name_span i',
                priceBlock = 'span[data-price="true"]',
                loaderBlock = '.js-form-price-loader-block';

            $(self).parents(parentBlock).find(priceBlock).hide();
            $(self).parents(parentBlock).find(loaderBlock).css('display', 'inline-block');

            $.ajax({
                url: $(el).data('url'),
                type: 'POST',
                data: {
                    product_id: productId,
                    event_id: eventId,
                    city_id: cityId
                },
                success: function(data) {
                    $(el).parents(parentBlock).find(priceBlock).show();
                    $(el).parents(parentBlock).find(loaderBlock).hide();
                    $(el).parents(parentBlock).find(priceBlock).text(data.price);
                    $(el).parents(parentBlock).find(cityBlock).text(cityName);
                    $(el).parents('form').find('input[name="event_id"]').val(data.event_id);
                    $(el).parents('form').find('input[name="product_id"]').val(productId);
                }
            });
        };

        callback(this);

        // Выбираем такой же блок на всех доступных селектах
        $('select[data-action="selectPriceByCity"]').not(this).each(function(index) {

            if ($(this).val() != cityId) {
                $(this).find('option[value=' + cityId + ']').attr('selected', 'selected');
                callback(this);
            }
        });

    });

    $('form[data-form=svyaz]').submit(function(){
        var $form = $(this);
        if(!Validator.isValid($form)) {
            return false;
        }

        $.fancybox('Идет обработка запроса', {
            modal: true,
            overlayColor: "#000000",
            overlayOpacity: 0.5,
            padding: 50,
            centerOnScroll: true,
            closeBtn: false,
            beforeShow: function(){
                this.skin.append('<div class="fancyboxClose"></div>');
            }
        });

        $.post(
            '/request/svyaz/',
            $form.serialize(),
            function (data) {

                var captchaImage = $form.find('.captchaImage');
                var captchaBlock = $form.find('.captchaBlock');
                var captchaWord = $form.find('.captchaWord');
                var captchaCode = $form.find('.captchaCode');

                if ('status' in data && data['status'] == 'error') {
                    $.fancybox.close();

                    var message = data['rawMessage'];
                    if((data['rawMessage']) instanceof Array) {
                        message = data['rawMessage'].shift();
                    }
                    if (!message) {
                        message = data['message'];
                    }
                    var $input2 = $form.find('input').eq(0);

                    if ('captcha_url' in data) {
                        if (captchaBlock.is(':visible')) {
                            $('#svyazErrorBlock').text(message);
                        }

                        captchaImage.attr('src', data['captcha_url']);
                        captchaBlock.removeClass('hidden');
                        if (data['wrong_code']) {
                            captchaWord.addClass('error').focus();
                        }
                        $form.find('.captchaCode').val(data);
                        captchaWord.val('');
                    }
                    else {
                        captchaWord.removeClass('error').val('');
                        captchaBlock.addClass('hidden');
                        captchaCode.val('');

                        $('#svyazErrorBlock').empty();
                    }
                }
                else {
                    $form.find('.error-text').remove();
                    $form.removeClass('alert');
                    $form.find('input').removeClass('error');
                    $('#svyazErrorBlock').empty();

                    captchaBlock.addClass('hidden');
                    captchaWord.removeClass('error').val('');
                    captchaCode.val('');

                    if ($form.find('input[name="product_id"]').val() == 68 && $form.find('input[name="event_id"]').val() == 1076461) {
                        var name = $form.find('input[name="name"]').val();
                        var email = $form.find('input[name="email"]').val();
                        var phone = $form.find('input[name="phone_country"]').val() + $form.find('input[name="phone_code"]').val() + $form.find('input[name="phone"]').val();

                        var amoForm = $('.amoForm');
                        amoForm.find('input[name="name"]').val(name);
                        amoForm.find('input[name="email"]').val(email);
                        amoForm.find('input[name="phone"]').val(phone);
                        amoForm.find('input[name="packet"]').val(1);
                        $.post(
                            amoForm.attr('action'),
                            amoForm.serialize()
                        );
                    } else if ($form.find('input[name="product_id"]').val() == 68 && $form.find('input[name="event_id"]').val() == 1076460) {
                        var name = $form.find('input[name="name"]').val();
                        var email = $form.find('input[name="email"]').val();
                        var phone = $form.find('input[name="phone_country"]').val() + $form.find('input[name="phone_code"]').val() + $form.find('input[name="phone"]').val();

                        var amoForm = $('.amoForm');
                        amoForm.find('input[name="name"]').val(name);
                        amoForm.find('input[name="email"]').val(email);
                        amoForm.find('input[name="phone"]').val(phone);
                        amoForm.find('input[name="packet"]').val(2);
                        $.post(
                            amoForm.attr('action'),
                            amoForm.serialize()
                        );
                    }

                    if (data.redirect) {
                        window.location.href = data.redirect;
                        return;
                    }

                    if($form.find('input[name="redirect"]').length > 0) {
                        window.location.href = $form.find('input[name="redirect"]').val();
                        return;
                    }

                    if ($form.find('input[name="product_id"]').val() == 585) {

                        var name = $form.find('input[name="name"]').val();
                        var email = $form.find('input[name="email"]').val();
                        var phone = $form.find('input[name="phone_country"]').val() + $form.find('input[name="phone_code"]').val() + $form.find('input[name="phone"]').val();

                        var amoForm = $('.amoForm');
                        amoForm.find('input[name="first_name"]').val(name);
                        amoForm.find('input[name="email"]').val(email);
                        amoForm.find('input[name="phone"]').val(phone);

                        amoForm.submit();
                    }

                    setTimeout(function() {
                        $.fancybox(data.message, {
                            overlayColor: "#000000",
                            overlayOpacity: 0.5,
                            padding: 50,
                            centerOnScroll: true,
                            closeBtn: false,
                            beforeShow: function(){
                                this.skin.append('<div class="fancyboxClose"></div>');
                            }
                        });
                    }, 300);
                }
            }, 'json'
        );
        return false;
    });

    $('.enterForm .loginForm').find('form').submit(function(){
        var $self = $(this);

        if(!Validator.isValid($self)) {
            $self.find('.error').html(Validator.lastError);
            return false;
        }

        $.ajax({
            type: 'POST',
            url: $self.attr('action'),
            crossDomain: true,
            data: {
                login      : $self.find("input[name='login']").val(),
                password   : $self.find("input[name='password']").val()
            },
            dataType: 'json',
            headers:{
                'X-Requested-With': 'XMLHttpRequest'
            },
            xhrFields: {
                withCredentials: true
            },
            success: function(responseData, textStatus, jqXHR) {
                if (responseData.status == 'success')
                {
                    var success_url = $self.find('input[name=success_url]').val();
                    if (success_url != '') {
                        window.location = success_url;
                    } else {
                        window.location.reload();
                    }
                }
                else
                {
                    $self.find('.error').text(responseData.message).show();
                }
            },
            error: function (responseData, textStatus, errorThrown) {
                $self.find('.error').hide();
            }
        });

        return false;
    });

    $('.enterForm .recForm').find('form').submit(function(){
        var $self = $(this);

        if(!Validator.isValid($self)) {
            $self.find('.error').html(Validator.lastError);
            return false;
        }

        $.ajax({
            type: 'POST',
            url: $self.attr('action'),
            crossDomain: true,
            data: {
                email: $self.find("input[name='email']").val()
            },
            dataType: 'json',
            headers:{
                'X-Requested-With': 'XMLHttpRequest'
            },
            xhrFields: {
                withCredentials: true
            },
            success: function(responseData, textStatus, jqXHR) {
                if (responseData.status == 'success') {
                    $self.parents('.recForm').html('<p class="ta_c">' + responseData.message + '</p>');
                } else {
                    $self.find('.error').text(responseData.message).show();
                }
            },
            error: function (responseData, textStatus, errorThrown) {
                $self.find('.error').hide();
            }
        });

        return false;
    });

    $('.enterForm .regForm').find('form').submit(function(){
        var $self = $(this);

        if(!Validator.isValid($self)) {
            $self.find('.error').html(Validator.lastError);
            return false;
        }

        $self.find("input[type='submit']").attr('disabled','disabled');

        $.ajax({
            type: 'POST',
            url: $self.attr('action'),
            crossDomain: true,
            data:  $self.serialize(),
            dataType: 'json',
            headers:{
                'X-Requested-With': 'XMLHttpRequest'
            },
            xhrFields: {
                withCredentials: true
            },
            success: function(responseData, textStatus, jqXHR) {
                if (responseData.status == 'success') {
                    $self.parents('.regForm').html('<p class="ta_c">Проверьте свою электронную почту.</p>');
                } else {
                    $self.find('.error').text(responseData.message).show();
                }

            },
            error: function (responseData, textStatus, errorThrown) {
                $self.find('.error').hide();
            }
        });
        $self.find("input[type='submit']").removeAttr('disabled');

        return false;
    });

    $(document).on('click', '.enterForm .showLoginForm', function(){
        $(this).parents('.enterForm').children('.oneForm').hide();
        $(this).parents('.enterForm').children('.loginForm').show();
    });
    $(document).on('click', '.enterForm .showRegForm', function(){
        $(this).parents('.enterForm').children('.oneForm').hide();
        $(this).parents('.enterForm').children('.regForm').show();
    });
    $(document).on('click', '.enterForm .showRecForm', function(){
        $(this).parents('.enterForm').children('.oneForm').hide();
        $(this).parents('.enterForm').children('.recForm').show();
    });

    // Banners entry
    // #3984
    $(function(){
        $(".l_banners").each(function(){
            var banners = $(this).children().hide();
            banners.eq(Math.floor(Math.random() * banners.length)).show();

            //$(this).cycle({speed: 400});
        });
    });

    // #5458 Баннеры с классом js-promo-block-random ротируем через js
    $(function() {
        var jsPromoBlock = $('.js-promo-block-random');
        $(jsPromoBlock).hide();
        $(jsPromoBlock).eq(Math.floor(Math.random() * $(jsPromoBlock).length)).show();
    });

    // Col right banner toggle
    var oWindow = $(window),
        largeBanner = $(".banner-aside.large"),
        smallBanner = $(".banner-aside.small");

    if ( largeBanner.length ){
        var showOffset = largeBanner.position().top + largeBanner.height() + smallBanner.height();

        oWindow.on("scroll", function(){
            if( oWindow.scrollTop() > showOffset ){
                smallBanner.fadeIn(200);
            } else {
                smallBanner.fadeOut(200);
            }
        }).trigger("scroll");
    }

    var isCardUpdating = false;
    $('#card-block input[type=button]').click(function(){
        if ($('input[name=card]').val().length == 0)
        {
            showError('', {'card' : 'Введите номер карты'});
            return false;
        }

        if (!/(^[0-9 ]+$)/.test($('input[name=card]').val()))
        {
            showError('', {'card' : 'Неверный формат номера карты'});
            return false;
        }

        if (!isCardUpdating)
        {
            isCardUpdating = true;
            $.ajax({
                dataType: "json",
                url: '/profile/card/activate/',
                type: 'POST',
                data: $('#user-profile-form').serialize(),
                success: function(data) {
                    if (data.status == 'success') {
                        $('#card-block').html( '<p>' + data.message + '</p>' ).removeClass('message_error');
                    } else {
                        showError( data.message, data.fields );
                    }
                    isCardUpdating = false;
                },
                error: function(xhr, status) {
                    isCardUpdating = false;
                }
            });
        }


    });

    $('#card-block form').submit(function(){
        $('#card-block input[type=button]').click();
        return false;
    });

    function showError(message, fields) {
        $('#card-block').find('p').each(function(){
            $( this).remove();
        });
        $('#card-block').prepend('<p class="message_error">' + message + '</p>');

        for(var i in fields) {
            $('input[name=' + i +']').before('<p class="message_error">' + fields[i] + '</p>');
        }
    }

    // form agreement
    $('.form-agreement').each(function() {
        var $form = $(this),
            $parent = $form.find('.js-form-agreement-parent'),
            count = $form.find('.js-form-agreement-children').length,
            countChecked = $form.find('.js-form-agreement-children:checked').length;

        if (count === countChecked) {
            $parent.prop('indeterminate', false);
            $parent.prop('checked', true);
        } else if (countChecked === 0) {
            $parent.prop('indeterminate', false);
            $parent.prop('checked', false);
        } else {
            $parent.prop('indeterminate', true);
        }
    });

    $(document).on('click', '.form-agreement .js-form-agreement-options', function() {
        $(this).parents('.form-agreement').find('.js-form-agreement-choose').toggleClass('hidden');

        return false;
    });

    $(document).on('change', '.form-agreement .js-form-agreement-children', function() {
        var $form = $(this).parents('.form-agreement'),
            $parent = $form.find('.js-form-agreement-parent'),
            count = $form.find('.js-form-agreement-children').length,
            countChecked = $form.find('.js-form-agreement-children:checked').length;

        if (count === countChecked) {
            $parent.prop('indeterminate', false);
            $parent.prop('checked', true);
        } else if (countChecked === 0) {
            $parent.prop('indeterminate', false);
            $parent.prop('checked', false);
        } else {
            $parent.prop('indeterminate', true);
        }
    });

    $(document).on('change', '.form-agreement .js-form-agreement-parent', function() {
        var $form = $(this).parents('.form-agreement');

        if ($(this).prop('checked')) {
            $form.find('.js-form-agreement-children').prop('checked', true);
        } else {
            $form.find('.js-form-agreement-choose').removeClass('hidden');
            $form.find('.js-form-agreement-children').prop('checked', false);
        }
    });
});

function showConfirmPersonalAlert(checked) {
    if (!checked) {
        alert('Без согласия на обработку данных мы не можем принять заявку');
    }
}

//bm4 block!!!!

$(function() {
    var expertBlockRender = function() {
        $('.expertBlock').each(function(){
            var markerId = $(this).data('marker-block');
            var expertTop = $('[data-marker="' + markerId + '"]').offset().top + 10;
            var expertLeft = $('.post').offset().left + 525;
            $(this).css({'top' : expertTop, 'left' : expertLeft});
        });
    };

    expertBlockRender();
    $(window).resize(expertBlockRender);

    if(jQuery().sliderkit) {
        $('.topSlider').sliderkit({
            circular: false,
            mousewheel: false,
            shownavitems: 3,
            verticalnav: true,
            navclipcenter: true,
            auto: false,
            navscrollatend: true
        });
    }

    var ajaxNisha = 0;
    $(document).on('click', '.nishaBlock .one.more', function(){
        if(ajaxNisha) {
            return false;
        }
        var $this = $(this);
        $.ajax({
            url: '/ajax/random/tags/',
            type: 'POST',
            data: {
                type_id: 3,
                group_id: 3
            },
            success: function(data) {
                if(data.status == 'success') {
                    $this.siblings('.one:visible').fadeOut(600, function() {
                        var $caseBlocks= $this.siblings('.one');
                        for(var i in data.message) {
                            var $caseBlock = $caseBlocks.eq(i);
                            $caseBlock.find('img').attr('src', data.message[i]['img']);
                            $caseBlock.find('img').attr('alt', data.message[i]['name']);
                            $caseBlock.find('a').attr('href', '/case/tag/' + data.message[i]['alias'] + '/');
                            $caseBlock.find('a').text(data.message[i]['name']);
                        }
                        $(this).fadeIn(600);
                    });
                }
            },
            beforeSend: function() {
                ajaxNisha = 1;
            },
            complete: function() {
                ajaxNisha = 0;
            }
        });

    });

    $(document).on('click', '.search', function(){
        $('#searchBlock').fadeToggle(500);
        $('#searchInput').focus();
    });

    $('.topBlock .news .one:last').addClass('last');

    $(document).on('click', '.head_set-drop a', function(){
        $(this).siblings('.head_set-box').toggle();
    });

    $('.slider').on('fotorama:show', function (e, fotorama) {
        $(this).find('.slider_pagination .current').text(fotorama.activeIndex + 1);
        $(this).find('.slider_caption').text(fotorama.activeFrame.caption);
    });

    $(document).on('click', '[data-request="auto"]', function(e) {
        processAutoRequest($(this));
        return false;
    });

    $(document).on('click', '.check-in-js .star', function(e){
        var star = $(this);
        var url = star.data('url');
        var redirect = star.data('redirect');

        if(star.hasClass('disabled')){
            if (!redirect) {
                redirect = $('#popup_auth [name=success_url]').val();
            }
            if (!redirect.match(/#/)) {
                redirect += '?r='+Math.random();
            } else if (!redirect.match(/#comment/)) {
                var match = redirect.match(/^([^#]*)#(.*)/);
                if (match) {
                    redirect = '?r='+Math.random() + match[0];
                }
            }
            Bm.fancybox.modals.auth.open(null, redirect);

            return false;
        }

        if(star.hasClass('active')){
            $.ajax({
                type: 'GET',
                url: url,
                data: {direction: 0},
                success: function(data){
                    if(!data.status || data.status !== 'ok'){
                        return false;
                    }

                    star.removeClass('active');
                }
            });
        } else {
            $.ajax({
                type: 'GET',
                url: url,
                data: {direction: 1},
                success: function(data){
                    if(!data.status || data.status !== 'ok'){
                        return false;
                    }

                    star.addClass('active');
                }
            });
        }
    });

    $('.promoLink').on('click', function(){
        $(this).parent('li').find('.promoInputBlock').toggle();
        return false;
    });
});
$(function() {
    window.shareInit = function() {

        /**
         * Обычный вариант
         */

        $('div.share42init').each(function(idx) {
            var el = $(this), u = el.attr('data-url'), t = el.attr('data-title'), i = el.attr('data-image'), d = el.attr('data-description'), f = el.attr('data-path'), fn = el.attr('data-icons-file'), z = el.attr("data-zero-counter");
            var useTitles = el.attr('data-use-titles');
            if (!u)u = location.href;
            if (!fn)fn = 'icons.png';
            if (!z)z = 0;
            function fb_count(url) {
                var shares;
                $.getJSON('http://graph.facebook.com/?callback=?&ids=' + url, function(data) {
                    shares = data[url].shares || 0;
                    if (shares > 0 || z == 1)el.find('a[data-count="fb"]').append('<span class="share42-counter">' + shares + '</span>').data('shares', shares)
                })
            }

            fb_count(u);
            function twi_count(url) {
                var shares;
                $.getJSON('http://urls.api.twitter.com/1/urls/count.json?callback=?&url=' + url, function(data) {
                    shares = data.count;
                    if (shares > 0 || z == 1)el.find('a[data-count="twi"]').append('<span class="share42-counter">' + shares + '</span>').data('shares', shares)
                })
            }

            twi_count(u);
            function vk_count(url) {
                $.getScript('http://vk.com/share.php?act=count&index=' + idx + '&url=' + url);
                if (!window.VK)window.VK = {};
                window.VK.Share = {
                    count: function(idx, shares) {
                        if (shares > 0 || z == 1)$('div.share42init').eq(idx).find('a[data-count="vk"]').append('<span class="share42-counter">' + shares + '</span>').data('shares', shares)
                    }
                }
            }

            vk_count(u);
            if (!t)t = document.title;
            if (!d) {
                var meta = $('meta[name="description"]').attr('content');
                if (meta !== undefined)d = meta; else d = '';
            }
            u = encodeURIComponent(u);
            t = encodeURIComponent(t);
            t = t.replace(/\'/g, '%27');
            i = encodeURIComponent(i);
            d = encodeURIComponent(d);
            d = d.replace(/\'/g, '%27');
            var fbQuery = 'u=' + u;
            if (i != 'null' && i != '')fbQuery = 's=100&p[url]=' + u + '&p[title]=' + t + '&p[summary]=' + d + '&p[images][0]=' + i;
            var vkImage = '';
            if (i != 'null' && i != '')vkImage = '&image=' + i;
            var s = [
                '"#" data-count="vk" onclick="window.open(\'http://vk.com/share.php?url=' + u + '&title=' + t + vkImage + '&description=' + d + '\', \'_blank\', \'scrollbars=0, resizable=1, menubar=0, left=100, top=100, width=550, height=440, toolbar=0, status=0\');return false" title="Поделиться В Контакте"',
                '"#" data-count="fb" onclick="window.open(\'http://www.facebook.com/sharer.php?m2w&' + fbQuery + '\', \'_blank\', \'scrollbars=0, resizable=1, menubar=0, left=100, top=100, width=550, height=440, toolbar=0, status=0\');return false" title="Поделиться в Facebook"',
                '"#" data-count="twi" onclick="window.open(\'https://twitter.com/intent/tweet?text=' + t + '&url=' + u + '\', \'_blank\', \'scrollbars=0, resizable=1, menubar=0, left=100, top=100, width=550, height=440, toolbar=0, status=0\');return false" title="Добавить в Twitter"'
                 ];

            var titles = [
                'Вконтакте',
                'Фейсбук',
                'Твиттер'
            ];

            var l = '';
            for (var j = 0; j < s.length; j++) l += '<a rel="nofollow" class="share42-item" href=' + s[j] + ' target="_blank">' + (useTitles ? titles[j] : '') + '</a>';
            el.html('<div class="share42">' + l + '</div>');

            if (Bridge.isMobile) {
                el.find('.share42').append('<a class="share42-item" data-count="wa" href="whatsapp://send?text=' + t + ' ' + u + '"></a>');
            }
        });

        /**
         * Расширенный вариант
         * TODO: привести все к одному варианту
         */

        $('div.share42ext').each(function(idx) {
            var el = $(this), u = el.attr('data-url'), t = el.attr('data-title'), i = el.attr('data-image'), d = el.attr('data-description'), f = el.attr('data-path'), fn = el.attr('data-icons-file'), z = el.attr("data-zero-counter");
            if (!u)u = location.href;
            if (!fn)fn = 'icons.png';
            if (!z)z = 0;
            if (!f) {
                function path(name) {
                    var sc = document.getElementsByTagName('script'), sr = new RegExp('^(.*/|)(' + name + ')([#?]|$)');
                    for (var p = 0, scL = sc.length; p < scL; p++) {
                        var m = String(sc[p].src).match(sr);
                        if (m) {
                            if (m[1].match(/^((https?|file)\:\/{2,}|\w:[\/\\])/))return m[1];
                            if (m[1].indexOf("/") == 0)return m[1];
                            b = document.getElementsByTagName('base');
                            if (b[0] && b[0].href)return b[0].href + m[1]; else return document.location.pathname.match(/(.*[\/\\])/)[0] + m[1];
                        }
                    }
                    return null;
                }

                f = path('share42.js');
            }
            if (!t)t = document.title;
            if (!d) {
                var meta = $('meta[name="description"]').attr('content');
                if (meta !== undefined)d = meta; else d = '';
            }
            u = encodeURIComponent(u);
            t = encodeURIComponent(t);
            t = t.replace(/\'/g, '%27');
            i = encodeURIComponent(i);
            d = encodeURIComponent(d);
            d = d.replace(/\'/g, '%27');
            var fbQuery = 'u=' + u;
            if (i != 'null' && i != '')fbQuery = 's=100&p[url]=' + u + '&p[title]=' + t + '&p[summary]=' + d + '&p[images][0]=' + i;
            var vkImage = '';
            if (i != 'null' && i != '')vkImage = '&image=' + i;
            var s = new Array('"#" data-count="fb" onclick="window.open(\'http://www.facebook.com/sharer.php?m2w&' + fbQuery + '\', \'_blank\', \'scrollbars=0, resizable=1, menubar=0, left=100, top=100, width=550, height=440, toolbar=0, status=0\');return false" title="Поделиться в Facebook"', '"#" data-count="mail" onclick="window.open(\'http://connect.mail.ru/share?url=' + u + '&title=' + t + '&description=' + d + '&imageurl=' + i + '\', \'_blank\', \'scrollbars=0, resizable=1, menubar=0, left=100, top=100, width=550, height=440, toolbar=0, status=0\');return false" title="Поделиться в Моем Мире@Mail.Ru"', '"#" data-count="odkl" onclick="window.open(\'http://www.odnoklassniki.ru/dk?st.cmd=addShare&st._surl=' + u + '&title=' + t + '\', \'_blank\', \'scrollbars=0, resizable=1, menubar=0, left=100, top=100, width=550, height=440, toolbar=0, status=0\');return false" title="Добавить в Одноклассники"', '"#" data-count="vk" onclick="window.open(\'http://vk.com/share.php?url=' + u + '&title=' + t + vkImage + '&description=' + d + '\', \'_blank\', \'scrollbars=0, resizable=1, menubar=0, left=100, top=100, width=550, height=440, toolbar=0, status=0\');return false" title="Поделиться В Контакте"');
            var l = '';
            for (j = 0; j < s.length; j++)l += '<span class="share42-item" style="display:inline-block;margin:0 6px 6px 0;height:24px;"><a rel="nofollow" style="display:inline-block;width:24px;height:24px;margin:0;padding:0;outline:none;background:url(' + f + fn + ') -' + 24 * j + 'px 0 no-repeat" href=' + s[j] + ' target="_blank"></a></span>';
            el.html('<span id="share42">' + l + '</span>' + '');
        });

    };

    window.shareInit();
});
/**
 * Created with JetBrains PhpStorm.
 * User: n3b
 */



(function(window){

    if( window.BmSocialFB ) {
        return false;
    }

    window.BMSocialFB = {};

window.BmSocialFB = new function() {

	var sdk = this;
    var initialized = false;
	var callbackQueue = [];
	var authQueue = [];
	var _widgets =
	{
		like: function(params) {

			params = $.extend({}, {

				container: null,
				pageUrl: window.location.href

			}, params || {});

			if( ! params.container ) return false;

			var $cont = $('#' + params.container)
				.attr('class', 'fb-like')
				.attr('data-href', params.pageUrl)
				.attr('data-layout', 'button_count')
				.attr('data-send', 'false')
				.attr('data-show-faces', 'false');

			FB.XFBML.parse();
		},
		comments: function(params) {

			params = $.extend({}, {

				container: null,
				pageUrl: window.location.href,
				width: 500,
				posts: 10

			}, params || {});

			if( ! params.container ) return false;

			var $cont = $('#' + params.container).html('')
				.attr('class', 'fb-comments')
				.attr('data-href', params.pageUrl)
				.attr('data-num-posts', params.posts)
				.attr('data-width', params.width);

			FB.XFBML.parse();
		},
		auth: function(params) {

			params = $.extend({}, {

				container: null,
				width: 200,
				rows: 1,
				showFaces: true

			}, params || {});

			if( ! params.container ) return false;

            if( btn = document.getElementById(params.container + '-login-button') ) {
                btn.onclick = function(){ FB.login(); return false;};
                return false;
            }

			var $cont = $('#' + params.container)
				.attr('class', 'fb-login-button')
				.attr('data-show-faces', params.showFaces ? 'true' : 'false')
				.attr('data-width', params.width)
				.attr('data-max-rows', params.rows);

			FB.XFBML.parse();
		},
		group: function(params) {

			params = $.extend({}, {

				container: null,
				width: 292,
				showFaces: true,
				stram: false,
				border: false,
				header: false

			}, params || {});

			if( ! params.container ) return false;

			var $cont = $('#' + params.container).html('')
				.attr('class', 'fb-like-box')
				.attr('data-href', 'https://www.facebook.com/molodost.bz')
				.attr('data-show-faces', params.showFaces ? 'true' : 'false')
				.attr('data-stream', params.stram ? 'true' : 'false')
				.attr('data-show-border', params.border ? 'true' : 'false')
				.attr('data-header', params.header ? 'true' : 'false')
				.attr('data-width', params.width);

			FB.XFBML.parse();
		},
		membersComments: function(params) {

			params = $.extend({}, {

				container: null,
				pageUrl: window.location.href,
				width: 500,
				posts: 10

			}, params || {});

			if( ! params.container ) return false;

			authQueue.push(params);

			FB.getLoginStatus(loginStatusCallback);
		}
	};

	/**
	 * проверяем авторизацию на FB
	 * @param response
	 */
	var loginStatusCallback = function(response) {

        return _events.onJoin();

		if( ! ( response.status === 'connected' || response.status === 'not_authorized' ) ) {
			return _events.onCheck();
		}

		FB.api('/me/likes/293259244049605', function(response) {

			if( response.data && response.data.length ){
				_events.onJoin();
			}
			else {
				_events.onAuth();
			}
		});

	};

	var _events = {

		onCheck: function() {

			for( var key in authQueue ) {
				_widgets.auth({container: authQueue[key].container});
			}
		},
		onAuth: function() {

			for( var key in authQueue ) {
				_widgets.group({container: authQueue[key].container});
			}
		},
		onJoin: function() {

			var params;
			while( params = authQueue.shift() ) {
				_widgets.comments(params)
			}
		}
	};

	/**
	 * выполнить все колбеки в очереди
	 */
	var fireCallbacks = function()
	{
		var callback;

		while( callback = callbackQueue.shift() ) {
			callback.call(sdk);
		}
	};

	/**
	 * инициализация FB sdk
	 */
	var init = function()
	{
		if( typeof window.fbAsyncInit == 'undefined' )
		{
			window.fbAsyncInit = function()
			{
				if( window['socialCommentsCallbackUrl'] )
				{
					var fbCommentCallback = function(id){
						$.post(window['socialCommentsCallbackUrl'],{
							type: 'facebook',
							id: id
						});
					}

					FB.Event.subscribe('comment.create', function(response)
					{
						if( response.href ) {
							fbCommentCallback(response.href);
						}
					});

					FB.Event.subscribe('comment.remove', function(response)
					{
						if( response.href ) {
							fbCommentCallback(response.href);
						}
					});
				}

				FB.Event.subscribe('auth.login', loginStatusCallback);

				FB.Event.subscribe('edge.create', function(response)
				{
					if( 'https://www.facebook.com/molodost.bz' != response ) return;

					_events.onJoin();
				});

				fireCallbacks();
			};

			/* FB */
			(function (d, s, id) {
				var js, fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id)) return;
				js = d.createElement(s);
				js.id = id;
				js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=146851835502992";
				fjs.parentNode.insertBefore(js, fjs);
			}(document, 'script', 'facebook-jssdk'));
		}
		else if( typeof window.FB == 'undefined' )
		{
			setTimeout(init, 100);
		}
        else if( initialized )
        {
            fireCallbacks();
        }
	};

	/**
	 *
	 * @param name          имя виджета из массива _widgets
	 * @param params        параметры виджета
	 * @return {Boolean}
	 */
	sdk.widget = function(name, params)
	{
		if( ! _widgets[name] ) return false;

		callbackQueue.push(function(){ _widgets[name].call(sdk, params) });
		setTimeout(init, 0);
	};

};
})(window);

/**
 * Created with JetBrains PhpStorm.
 * User: n3b
 */

(function(window){

    if( window.BmSocialVK ) {
        return false;
    }

    window.BmSocialVK = {};

window.BmSocialVK = new function() {

    var sdk = this;
    var initialized = false;
    var callbackQueue = [];
    var authQueue = [];
    var _widgets =
    {
        like: function(params) {

            params = $.extend({}, {
                container: null
            }, params || {});

            if( ! params.container ) return false;

            var widgetParams = {
                pageUrl: params.pageUrl
            };

            VK.Widgets.Like( params.container, widgetParams );
        },
        comments: function(params) {

            params = $.extend({}, {
                container: null,
                width: 'auto',
                posts: 10,
                attach: '*'
            }, params || {});

            if( ! params.container ) return false;

            var $cont = $('#' + params.container);

            // dirty fix
            $cont.children().hide();

            var widgetParams = {
                width: params.width,
                limit: params.posts,
                attach: params.attach,
                pageUrl: params.pageUrl || params.pageId
            };

            VK.Widgets.Comments( params.container, widgetParams, params.pageId );
        },
        auth: function(params) {

            params = $.extend({}, {
                container: null
            }, params || {});

            if( ! params.container ) return false;

            var btnId = params.container + '-login-button';
            if( btn = document.getElementById(btnId) ) {
                btn.onclick = function(){ VK.Auth.login(loginStatusCallback); return false; };
                return false;
            }

            var btn = document.createElement('div');
            btn.id = btnId;
            btn.onclick = function(){ VK.Auth.login(loginStatusCallback); };
            document.getElementById(params.container).appendChild(btn);
            VK.UI.button( btnId );
        },
        group: function(params) {

            params = $.extend({}, {
                container: null,
                width: 'auto',
                height: 100
            }, params || {});

            if( ! params.container ) return false;

            var $cont = $('#' + params.container);

            $cont.html('<p>Вам необходимо вступить в группу:</p><div id="' + params.container + '_1"></div>');
            VK.Widgets.Group(params.container + '_1', { mode: 1, width: params.width, height: params.height }, 25276999);
        },
        membersComments: function(params) {

            params = $.extend({}, {
                container: null,
                width: 500,
                posts: 10
            }, params || {});

            if( ! params.container ) return false;

            authQueue.push(params);

            VK.Auth.getLoginStatus(loginStatusCallback);
        }

    };

    /**
     * проверяем авторизацию на VK
     * @param response
     */
    var loginStatusCallback = function(response)
    {
        return _events.onJoin();

        if (response.session) {
            VK.Api.call('groups.isMember', {group_id: 25276999, user_id: response.session.mid}, function(r) {
                r.response === 1 ? _events.onJoin() : _events.onAuth();
            });
        } else {
            _events.onCheck();
        }
    };

    var _events = {

        onCheck: function() {

            for( var key in authQueue ) {
                _widgets.auth({container: authQueue[key].container});
            }
        },
        onAuth: function() {

            for( var key in authQueue ) {
                _widgets.group({container: authQueue[key].container});
            }
        },
        onJoin: function() {

            var params;
            while( params = authQueue.shift() ) {
                _widgets.comments(params)
            }
        }
    };

    /**
     * выполнить все колбеки в очереди
     */
    var fireCallbacks = function()
    {
        var callback;

        while( callback = callbackQueue.shift() ) {
            callback.call(sdk);
        }
    };

    /**
     * инициализация VK sdk
     */
    var init = function()
    {
        if( typeof window.vkAsyncInit == 'undefined' )
        {
            window.vkAsyncInit = function()
            {
                // todo
                VK.init({apiId: 3489008});
                VK.Observer.subscribe("widgets.groups.joined", _events.onJoin);
                initialized = true;
                fireCallbacks();
            };

            /* VK */
            var id = 'vk_api_transport';
            if( document.getElementById(id) ) return;

            var div = document.createElement('div');
            div.id = id;
            var el = document.createElement("script");
            el.type = "text/javascript";
            el.src = "http://vk.com/js/api/openapi.js";
            el.async = true;
            div.appendChild(el);
            document.getElementsByTagName('body')[0].appendChild(div);
        }
        else if( typeof window.VK == 'undefined' )
        {
            setTimeout(init, 100);
        }
        else if( initialized )
        {
            fireCallbacks();
        }
    };

    /**
     *
     * @param name          имя виджета из массива _widgets
     * @param params        параметры виджета
     * @return {Boolean}
     */
    sdk.widget = function(name, params)
    {
        if( ! _widgets[name] ) return false;

        callbackQueue.push(function(){ _widgets[name].call(sdk, params) });
        setTimeout(init, 0);
    };
};
})(window);


/**
 * Глобальные методы для работы с video
 */
Bm.video = {

    nowPlaying: '',

    /**
     * Инлайновое проигрывание
     *
     * @param $el
     *
     * @returns {boolean}
     */
    inline: function($el) {

        var videoId = $el.attr('data-id'),
            source = $el.attr('data-url'),
            poster = $el.attr('data-image'),
            videoContainer = $('.js-video-player');

        if ($el.hasClass('started')) {
            return false;
        }

        var $authorized = $el.data('authorized');
        var $hasPhone = $el.data('has-phone');
        var $eventId = $el.data('event-id');
        var $productId = $el.data('product-id');

        // Проверяем авторизацию
        if ($authorized === 0) {
            Bm.video.showAuth();
            return false;
        }

        // Проверяем телефон
        if ($hasPhone === 0) {
            Bm.video.showPhone();
            return false;
        }

        // Проверяем event_id и product_id
        if ($eventId && $productId) {
            $.ajax({
                url : '/request/auto/',
                data: {
                    event_id:   $eventId,
                    product_id: $productId
                },
                type: 'POST'
            });
        }

        // Это первая инциализация видео?
        var isInitial = videoContainer.find('video').length == 0;
        //var video = isInitial ? $('<video class="video-js vjs-default-skin js-video-player" preload="none" controls></video>') : videoContainer.find('video');
        var video = isInitial ? $('<iframe width="100%" src="'+source+'" frameborder="0" allowfullscreen></iframe>') : videoContainer.find('video');

        if (isInitial) {
            video.attr('id', videoId);
        } else {
            video.attr('id', videoId + '_html5_api');
            videoContainer.attr('id', videoId);
        }

        video.attr('width', $el.attr('data-width')).
            attr('height', $el.attr('data-height')).
            attr('data-image', poster).
            attr('src', source).
            attr('data-update-url', $el.attr('data-update-url')).
            attr('data-youtube', $el.attr('data-youtube')).
            removeClass('vjs-default-skin').
            addClass($el.attr('data-skin'));

        $el.find('img').hide();
        $el.append(isInitial ? video : videoContainer);
        $el.addClass('started');

        // Инициализируем видео, останавливаем аудио
        Bm.video.init(video, true);
        if (Bm.audio) {
            Bm.audio.stop();
        }

        if (this.nowPlaying == '' || this.nowPlaying == videoId) {
            this.nowPlaying = videoId;
            return false;
        }

        var $wrapper = $('.js-video-wrapper[data-id="' + this.nowPlaying + '"]');

        $wrapper.removeClass('started');
        $wrapper.find('img').show();

        this.nowPlaying = videoId;

        var url = $el.data('view-url');
        var record_id = $el.data('record-id');
        $.ajax({
            type: 'POST',
            url: url,
            data: {
                record_id: record_id
            },
            success: function (data) {

            }
        });
    },

    /**
     * Остановить
     *
     * @returns {boolean}
     */
    stop: function() {

        if (this.nowPlaying == '') {
            return false;
        }

        videojs(this.nowPlaying).pause();

        var $wrapper = $('.js-video-wrapper[data-id="' + this.nowPlaying + '"]');

        $wrapper.removeClass('started');

        this.nowPlaying = '';
    }


};
(function(window) {
    if (window.social) {
        return false;
    }

    window.social = new function() {
        var t = this;
        t.bm5 = false;
        this.strategy = 'authorization';
        this.openAuthModal = function(href) {
            var w = 600,
                h = 500,
                left = (screen.width / 2) - (w / 2),
                top = (screen.height / 2) - (h / 2);
            window.open(href, '', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
            return false;
        };

        this.setMessage = function(message) {
            switch (message.result.status) {
                case 'token':
                    if (t.strategy == 'authorization') {
                        getUser(message.social);
                    }
                    if (t.strategy == 'link') {
                        linkAccount(message.social);
                    }
                    break;
                case 'error':
                    alert('Вы не были привязаны к соцсети ' + message.social);
                    break;
            }
        };

        var getUser = function(social) {
            var registerPage = $('#popup_registration').find('input[name=register_page]').val();
            $.ajax({
                type: 'POST',
                url: '/social/connect/' + social + '/',
                data: {
                    register_page: registerPage + ':' + social
                },
                success: function(data) {
                    switch (data.status) {
                        case 'userFound':
                            var redirect = $('#popup_auth').find('input[name=success_url]').val();
                            if (redirect != '') {
                                window.location.href = redirect;
                            } else {
                                window.location.href = data.message;
                            }
                            break;
                        case 'userNotFound':
                            t.actions.typeEmail($('#popup_email_type'), data, social);
                            break;
                        case 'error':
                            t.actions.error(data.message);
                            break;
                    }
                }
            });
        };

        var linkAccount = function(social) {
            $.ajax({
                type: 'POST',
                url: '/social/link/' + social + '/',
                data: {
                    check: true
                },
                success: function(response) {
                    var $container = $('#popup_link');
                    $container.find('.socialSelect').html(response.template);
                    Bridge.fancybox.open($container.attr('id'));
                }
            });
        };

        this.actions = {
            typeEmail: function($container, socialData, socialName) {
                $container.find('.socialSelect').html(socialData.template);
                Bridge.fancybox.open($container.attr('id'));

                var $form = $container.find('form'),
                    $submit = $container.find('.js-form-submit'),
                    $error = $form.find('.data-error');

                $form.on('submit', function() {
                    if ($submit.hasClass('disabled')) {
                        return false;
                    }

                    $error.empty();

                    if (!Validator.isValid($form)) {
                        $error.html(Validator.lastError);

                        return false;
                    }

                    $.ajax({
                        url: $form.attr('action'),
                        type: 'POST',
                        data: $form.serialize(),
                        beforeSend: function() {
                            $submit.addClass('disabled');
                        },
                        success: function(response) {
                            if ('needPassword' == response.status) {
                                t.actions.typePassword($('#popup_password_type'), response, socialName);
                            }
                            if ('error' == response.status) {
                                $error.text(response.message);
                            }
                            if ('success' == response.status && response.redirect != undefined) {
                                window.location.href = response.redirect;
                            }

                            $submit.removeClass('disabled');
                        },
                        error: function() {
                            $submit.removeClass('disabled');
                        }
                    });

                    return false;
                });
            },

            typePassword: function($container, socialData, socialName) {
                $container.find('.socialSelect').html(socialData.template);
                Bridge.fancybox.open($container.attr('id'));

                var $form = $container.find('form'),
                    $submit = $container.find('.js-form-submit'),
                    $error = $form.find('.data-error');

                $form.on('submit', function() {
                    if ($submit.hasClass('disabled')) {
                        return false;
                    }

                    $error.empty();

                    if (!Validator.isValid($form)) {
                        $error.html(Validator.lastError);

                        return false;
                    }

                    $.ajax({
                        url: $form.attr('action'),
                        type: 'POST',
                        data: $form.serialize(),
                        beforeSend: function() {
                            $submit.addClass('disabled');
                        },
                        success: function(response) {
                            if ('error' == response.status) {
                                $error.text(response.message);
                            }
                            if ('success' == response.status && response.redirect != undefined) {
                                window.location.href = response.redirect;
                            }

                            $submit.removeClass('disabled');
                        },
                        error: function() {
                            $submit.removeClass('disabled');
                        }
                    });
                    return false;
                });
            },

            error: function(error) {
                alert(error);
            }
        };

    };

})(window);

$(function() {
    var changeSocLink = function(currentLink) {
        var $link = $('a[href="' + currentLink + '"]').first(),
            newSoc = $link.attr('data-anti-social');

        $link.attr('data-anti-social', $link.attr('data-social'));
        $link.attr('data-social', newSoc).toggleClass('active');

        var newLink = $link.attr('data-anti-href');
        $link.attr('data-anti-href', $link.attr('href'));
        $link.attr('href', newLink);

        var newTitle = $link.attr('data-anti-title');
        $link.attr('data-anti-title', $link.attr('title'));
        $link.attr('title', newTitle);
    };

    var currentSocLink = null;

    $(document).on('click', '[data-social="link"]', function() {
        var href = $(this).attr('href'),
            strategy = $(this).data('social') || "authorization";

        currentSocLink = href;

        window.social.strategy = strategy;
        window.social.openAuthModal(href);

        return false;
    });

    $(document).on('click', '[data-social="unlink"]', function() {
        if (confirm('Вы действительно хотите отвязать аккаунт данной социальной сети?')) {
            var $link = $(this).attr('href');

            $.ajax({
                url: $link,
                type: 'GET',
                success: function() {
                    changeSocLink($link);
                }
            });
        }

        return false;
    });

    $(document).on('click', '[data-social="authorization"]', function() {
        var href = $(this).attr('href'),
            strategy = $(this).data('social') || "authorization";

        window.social.strategy = strategy;
        window.social.bm5 = $(this).hasClass('bm5-social');
        window.social.openAuthModal(href);

        return false;
    });

    $(document).on('submit', 'form.ajax_link', function() {
        var $form = $(this);

        $.ajax({
            url: $form.attr('action'),
            type: $form.attr('method'),
            data: $form.serialize(),
            success: function(response) {
                // TODO check errors
                $.fancybox.close();
                changeSocLink(currentSocLink);
            }
        });

        return false;
    })
});
$(function() {
    Bm.social.openShareDialogCallback = function($el, $parent) {
        $parent.find('.share42init_async').addClass('share42init');

        window.shareInit();

        var url = $el.data('url');
        var id = $el.data('id');
        var share_type = $el.data('type');

        setTimeout(function() {
            var count = 0;

            $parent.find('.share42-item').each(function() {
                if ($(this).data('shares')) {
                    count = count + parseInt($(this).data('shares'));
                }
            });

            $.ajax({
                type   : 'POST',
                url    : url,
                data   : {
                    count: count,
                    id   : id,
                    type : share_type
                },
                success: function(data) {
                    $parent.find('.share42init_async').removeClass('share42init');
                }
            });

        }, 1000);
    }
});
/* Russian (UTF-8) initialisation for the jQuery UI date picker plugin. */
/* Written by Andrew Stromnov (stromnov@gmail.com). */
jQuery(function($){
	$.datepicker.regional['ru'] = {
		closeText: 'Закрыть',
		prevText: '&#x3c;Пред',
		nextText: 'След&#x3e;',
		currentText: 'Сегодня',
		monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
		monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'],
		dayNames: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
		dayNamesShort: ['вск','пнд','втр','срд','чтв','птн','сбт'],
		dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
		weekHeader: 'Нед',
		dateFormat: 'dd.mm.yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['ru']);
});
/*! jQuery UI - v1.10.3 - 2013-08-08
* http://jqueryui.com
* Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.position.js, jquery.ui.autocomplete.js, jquery.ui.datepicker.js, jquery.ui.menu.js
* Copyright 2013 jQuery Foundation and other contributors Licensed MIT */

(function(e,t){function i(t,i){var a,n,r,o=t.nodeName.toLowerCase();return"area"===o?(a=t.parentNode,n=a.name,t.href&&n&&"map"===a.nodeName.toLowerCase()?(r=e("img[usemap=#"+n+"]")[0],!!r&&s(r)):!1):(/input|select|textarea|button|object/.test(o)?!t.disabled:"a"===o?t.href||i:i)&&s(t)}function s(t){return e.expr.filters.visible(t)&&!e(t).parents().addBack().filter(function(){return"hidden"===e.css(this,"visibility")}).length}var a=0,n=/^ui-id-\d+$/;e.ui=e.ui||{},e.extend(e.ui,{version:"1.10.3",keyCode:{BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38}}),e.fn.extend({focus:function(t){return function(i,s){return"number"==typeof i?this.each(function(){var t=this;setTimeout(function(){e(t).focus(),s&&s.call(t)},i)}):t.apply(this,arguments)}}(e.fn.focus),scrollParent:function(){var t;return t=e.ui.ie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?this.parents().filter(function(){return/(relative|absolute|fixed)/.test(e.css(this,"position"))&&/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0):this.parents().filter(function(){return/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0),/fixed/.test(this.css("position"))||!t.length?e(document):t},zIndex:function(i){if(i!==t)return this.css("zIndex",i);if(this.length)for(var s,a,n=e(this[0]);n.length&&n[0]!==document;){if(s=n.css("position"),("absolute"===s||"relative"===s||"fixed"===s)&&(a=parseInt(n.css("zIndex"),10),!isNaN(a)&&0!==a))return a;n=n.parent()}return 0},uniqueId:function(){return this.each(function(){this.id||(this.id="ui-id-"+ ++a)})},removeUniqueId:function(){return this.each(function(){n.test(this.id)&&e(this).removeAttr("id")})}}),e.extend(e.expr[":"],{data:e.expr.createPseudo?e.expr.createPseudo(function(t){return function(i){return!!e.data(i,t)}}):function(t,i,s){return!!e.data(t,s[3])},focusable:function(t){return i(t,!isNaN(e.attr(t,"tabindex")))},tabbable:function(t){var s=e.attr(t,"tabindex"),a=isNaN(s);return(a||s>=0)&&i(t,!a)}}),e("<a>").outerWidth(1).jquery||e.each(["Width","Height"],function(i,s){function a(t,i,s,a){return e.each(n,function(){i-=parseFloat(e.css(t,"padding"+this))||0,s&&(i-=parseFloat(e.css(t,"border"+this+"Width"))||0),a&&(i-=parseFloat(e.css(t,"margin"+this))||0)}),i}var n="Width"===s?["Left","Right"]:["Top","Bottom"],r=s.toLowerCase(),o={innerWidth:e.fn.innerWidth,innerHeight:e.fn.innerHeight,outerWidth:e.fn.outerWidth,outerHeight:e.fn.outerHeight};e.fn["inner"+s]=function(i){return i===t?o["inner"+s].call(this):this.each(function(){e(this).css(r,a(this,i)+"px")})},e.fn["outer"+s]=function(t,i){return"number"!=typeof t?o["outer"+s].call(this,t):this.each(function(){e(this).css(r,a(this,t,!0,i)+"px")})}}),e.fn.addBack||(e.fn.addBack=function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}),e("<a>").data("a-b","a").removeData("a-b").data("a-b")&&(e.fn.removeData=function(t){return function(i){return arguments.length?t.call(this,e.camelCase(i)):t.call(this)}}(e.fn.removeData)),e.ui.ie=!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()),e.support.selectstart="onselectstart"in document.createElement("div"),e.fn.extend({disableSelection:function(){return this.bind((e.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(e){e.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}}),e.extend(e.ui,{plugin:{add:function(t,i,s){var a,n=e.ui[t].prototype;for(a in s)n.plugins[a]=n.plugins[a]||[],n.plugins[a].push([i,s[a]])},call:function(e,t,i){var s,a=e.plugins[t];if(a&&e.element[0].parentNode&&11!==e.element[0].parentNode.nodeType)for(s=0;a.length>s;s++)e.options[a[s][0]]&&a[s][1].apply(e.element,i)}},hasScroll:function(t,i){if("hidden"===e(t).css("overflow"))return!1;var s=i&&"left"===i?"scrollLeft":"scrollTop",a=!1;return t[s]>0?!0:(t[s]=1,a=t[s]>0,t[s]=0,a)}})})(jQuery);(function(e,t){var i=0,s=Array.prototype.slice,n=e.cleanData;e.cleanData=function(t){for(var i,s=0;null!=(i=t[s]);s++)try{e(i).triggerHandler("remove")}catch(a){}n(t)},e.widget=function(i,s,n){var a,r,o,h,l={},u=i.split(".")[0];i=i.split(".")[1],a=u+"-"+i,n||(n=s,s=e.Widget),e.expr[":"][a.toLowerCase()]=function(t){return!!e.data(t,a)},e[u]=e[u]||{},r=e[u][i],o=e[u][i]=function(e,i){return this._createWidget?(arguments.length&&this._createWidget(e,i),t):new o(e,i)},e.extend(o,r,{version:n.version,_proto:e.extend({},n),_childConstructors:[]}),h=new s,h.options=e.widget.extend({},h.options),e.each(n,function(i,n){return e.isFunction(n)?(l[i]=function(){var e=function(){return s.prototype[i].apply(this,arguments)},t=function(e){return s.prototype[i].apply(this,e)};return function(){var i,s=this._super,a=this._superApply;return this._super=e,this._superApply=t,i=n.apply(this,arguments),this._super=s,this._superApply=a,i}}(),t):(l[i]=n,t)}),o.prototype=e.widget.extend(h,{widgetEventPrefix:r?h.widgetEventPrefix:i},l,{constructor:o,namespace:u,widgetName:i,widgetFullName:a}),r?(e.each(r._childConstructors,function(t,i){var s=i.prototype;e.widget(s.namespace+"."+s.widgetName,o,i._proto)}),delete r._childConstructors):s._childConstructors.push(o),e.widget.bridge(i,o)},e.widget.extend=function(i){for(var n,a,r=s.call(arguments,1),o=0,h=r.length;h>o;o++)for(n in r[o])a=r[o][n],r[o].hasOwnProperty(n)&&a!==t&&(i[n]=e.isPlainObject(a)?e.isPlainObject(i[n])?e.widget.extend({},i[n],a):e.widget.extend({},a):a);return i},e.widget.bridge=function(i,n){var a=n.prototype.widgetFullName||i;e.fn[i]=function(r){var o="string"==typeof r,h=s.call(arguments,1),l=this;return r=!o&&h.length?e.widget.extend.apply(null,[r].concat(h)):r,o?this.each(function(){var s,n=e.data(this,a);return n?e.isFunction(n[r])&&"_"!==r.charAt(0)?(s=n[r].apply(n,h),s!==n&&s!==t?(l=s&&s.jquery?l.pushStack(s.get()):s,!1):t):e.error("no such method '"+r+"' for "+i+" widget instance"):e.error("cannot call methods on "+i+" prior to initialization; "+"attempted to call method '"+r+"'")}):this.each(function(){var t=e.data(this,a);t?t.option(r||{})._init():e.data(this,a,new n(r,this))}),l}},e.Widget=function(){},e.Widget._childConstructors=[],e.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{disabled:!1,create:null},_createWidget:function(t,s){s=e(s||this.defaultElement||this)[0],this.element=e(s),this.uuid=i++,this.eventNamespace="."+this.widgetName+this.uuid,this.options=e.widget.extend({},this.options,this._getCreateOptions(),t),this.bindings=e(),this.hoverable=e(),this.focusable=e(),s!==this&&(e.data(s,this.widgetFullName,this),this._on(!0,this.element,{remove:function(e){e.target===s&&this.destroy()}}),this.document=e(s.style?s.ownerDocument:s.document||s),this.window=e(this.document[0].defaultView||this.document[0].parentWindow)),this._create(),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:e.noop,_getCreateEventData:e.noop,_create:e.noop,_init:e.noop,destroy:function(){this._destroy(),this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(e.camelCase(this.widgetFullName)),this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName+"-disabled "+"ui-state-disabled"),this.bindings.unbind(this.eventNamespace),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")},_destroy:e.noop,widget:function(){return this.element},option:function(i,s){var n,a,r,o=i;if(0===arguments.length)return e.widget.extend({},this.options);if("string"==typeof i)if(o={},n=i.split("."),i=n.shift(),n.length){for(a=o[i]=e.widget.extend({},this.options[i]),r=0;n.length-1>r;r++)a[n[r]]=a[n[r]]||{},a=a[n[r]];if(i=n.pop(),s===t)return a[i]===t?null:a[i];a[i]=s}else{if(s===t)return this.options[i]===t?null:this.options[i];o[i]=s}return this._setOptions(o),this},_setOptions:function(e){var t;for(t in e)this._setOption(t,e[t]);return this},_setOption:function(e,t){return this.options[e]=t,"disabled"===e&&(this.widget().toggleClass(this.widgetFullName+"-disabled ui-state-disabled",!!t).attr("aria-disabled",t),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")),this},enable:function(){return this._setOption("disabled",!1)},disable:function(){return this._setOption("disabled",!0)},_on:function(i,s,n){var a,r=this;"boolean"!=typeof i&&(n=s,s=i,i=!1),n?(s=a=e(s),this.bindings=this.bindings.add(s)):(n=s,s=this.element,a=this.widget()),e.each(n,function(n,o){function h(){return i||r.options.disabled!==!0&&!e(this).hasClass("ui-state-disabled")?("string"==typeof o?r[o]:o).apply(r,arguments):t}"string"!=typeof o&&(h.guid=o.guid=o.guid||h.guid||e.guid++);var l=n.match(/^(\w+)\s*(.*)$/),u=l[1]+r.eventNamespace,c=l[2];c?a.delegate(c,u,h):s.bind(u,h)})},_off:function(e,t){t=(t||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,e.unbind(t).undelegate(t)},_delay:function(e,t){function i(){return("string"==typeof e?s[e]:e).apply(s,arguments)}var s=this;return setTimeout(i,t||0)},_hoverable:function(t){this.hoverable=this.hoverable.add(t),this._on(t,{mouseenter:function(t){e(t.currentTarget).addClass("ui-state-hover")},mouseleave:function(t){e(t.currentTarget).removeClass("ui-state-hover")}})},_focusable:function(t){this.focusable=this.focusable.add(t),this._on(t,{focusin:function(t){e(t.currentTarget).addClass("ui-state-focus")},focusout:function(t){e(t.currentTarget).removeClass("ui-state-focus")}})},_trigger:function(t,i,s){var n,a,r=this.options[t];if(s=s||{},i=e.Event(i),i.type=(t===this.widgetEventPrefix?t:this.widgetEventPrefix+t).toLowerCase(),i.target=this.element[0],a=i.originalEvent)for(n in a)n in i||(i[n]=a[n]);return this.element.trigger(i,s),!(e.isFunction(r)&&r.apply(this.element[0],[i].concat(s))===!1||i.isDefaultPrevented())}},e.each({show:"fadeIn",hide:"fadeOut"},function(t,i){e.Widget.prototype["_"+t]=function(s,n,a){"string"==typeof n&&(n={effect:n});var r,o=n?n===!0||"number"==typeof n?i:n.effect||i:t;n=n||{},"number"==typeof n&&(n={duration:n}),r=!e.isEmptyObject(n),n.complete=a,n.delay&&s.delay(n.delay),r&&e.effects&&e.effects.effect[o]?s[t](n):o!==t&&s[o]?s[o](n.duration,n.easing,a):s.queue(function(i){e(this)[t](),a&&a.call(s[0]),i()})}})})(jQuery);(function(t,e){function i(t,e,i){return[parseFloat(t[0])*(p.test(t[0])?e/100:1),parseFloat(t[1])*(p.test(t[1])?i/100:1)]}function s(e,i){return parseInt(t.css(e,i),10)||0}function n(e){var i=e[0];return 9===i.nodeType?{width:e.width(),height:e.height(),offset:{top:0,left:0}}:t.isWindow(i)?{width:e.width(),height:e.height(),offset:{top:e.scrollTop(),left:e.scrollLeft()}}:i.preventDefault?{width:0,height:0,offset:{top:i.pageY,left:i.pageX}}:{width:e.outerWidth(),height:e.outerHeight(),offset:e.offset()}}t.ui=t.ui||{};var a,o=Math.max,r=Math.abs,h=Math.round,l=/left|center|right/,c=/top|center|bottom/,u=/[\+\-]\d+(\.[\d]+)?%?/,d=/^\w+/,p=/%$/,f=t.fn.position;t.position={scrollbarWidth:function(){if(a!==e)return a;var i,s,n=t("<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),o=n.children()[0];return t("body").append(n),i=o.offsetWidth,n.css("overflow","scroll"),s=o.offsetWidth,i===s&&(s=n[0].clientWidth),n.remove(),a=i-s},getScrollInfo:function(e){var i=e.isWindow?"":e.element.css("overflow-x"),s=e.isWindow?"":e.element.css("overflow-y"),n="scroll"===i||"auto"===i&&e.width<e.element[0].scrollWidth,a="scroll"===s||"auto"===s&&e.height<e.element[0].scrollHeight;return{width:a?t.position.scrollbarWidth():0,height:n?t.position.scrollbarWidth():0}},getWithinInfo:function(e){var i=t(e||window),s=t.isWindow(i[0]);return{element:i,isWindow:s,offset:i.offset()||{left:0,top:0},scrollLeft:i.scrollLeft(),scrollTop:i.scrollTop(),width:s?i.width():i.outerWidth(),height:s?i.height():i.outerHeight()}}},t.fn.position=function(e){if(!e||!e.of)return f.apply(this,arguments);e=t.extend({},e);var a,p,m,g,v,b,_=t(e.of),y=t.position.getWithinInfo(e.within),w=t.position.getScrollInfo(y),x=(e.collision||"flip").split(" "),k={};return b=n(_),_[0].preventDefault&&(e.at="left top"),p=b.width,m=b.height,g=b.offset,v=t.extend({},g),t.each(["my","at"],function(){var t,i,s=(e[this]||"").split(" ");1===s.length&&(s=l.test(s[0])?s.concat(["center"]):c.test(s[0])?["center"].concat(s):["center","center"]),s[0]=l.test(s[0])?s[0]:"center",s[1]=c.test(s[1])?s[1]:"center",t=u.exec(s[0]),i=u.exec(s[1]),k[this]=[t?t[0]:0,i?i[0]:0],e[this]=[d.exec(s[0])[0],d.exec(s[1])[0]]}),1===x.length&&(x[1]=x[0]),"right"===e.at[0]?v.left+=p:"center"===e.at[0]&&(v.left+=p/2),"bottom"===e.at[1]?v.top+=m:"center"===e.at[1]&&(v.top+=m/2),a=i(k.at,p,m),v.left+=a[0],v.top+=a[1],this.each(function(){var n,l,c=t(this),u=c.outerWidth(),d=c.outerHeight(),f=s(this,"marginLeft"),b=s(this,"marginTop"),D=u+f+s(this,"marginRight")+w.width,T=d+b+s(this,"marginBottom")+w.height,C=t.extend({},v),M=i(k.my,c.outerWidth(),c.outerHeight());"right"===e.my[0]?C.left-=u:"center"===e.my[0]&&(C.left-=u/2),"bottom"===e.my[1]?C.top-=d:"center"===e.my[1]&&(C.top-=d/2),C.left+=M[0],C.top+=M[1],t.support.offsetFractions||(C.left=h(C.left),C.top=h(C.top)),n={marginLeft:f,marginTop:b},t.each(["left","top"],function(i,s){t.ui.position[x[i]]&&t.ui.position[x[i]][s](C,{targetWidth:p,targetHeight:m,elemWidth:u,elemHeight:d,collisionPosition:n,collisionWidth:D,collisionHeight:T,offset:[a[0]+M[0],a[1]+M[1]],my:e.my,at:e.at,within:y,elem:c})}),e.using&&(l=function(t){var i=g.left-C.left,s=i+p-u,n=g.top-C.top,a=n+m-d,h={target:{element:_,left:g.left,top:g.top,width:p,height:m},element:{element:c,left:C.left,top:C.top,width:u,height:d},horizontal:0>s?"left":i>0?"right":"center",vertical:0>a?"top":n>0?"bottom":"middle"};u>p&&p>r(i+s)&&(h.horizontal="center"),d>m&&m>r(n+a)&&(h.vertical="middle"),h.important=o(r(i),r(s))>o(r(n),r(a))?"horizontal":"vertical",e.using.call(this,t,h)}),c.offset(t.extend(C,{using:l}))})},t.ui.position={fit:{left:function(t,e){var i,s=e.within,n=s.isWindow?s.scrollLeft:s.offset.left,a=s.width,r=t.left-e.collisionPosition.marginLeft,h=n-r,l=r+e.collisionWidth-a-n;e.collisionWidth>a?h>0&&0>=l?(i=t.left+h+e.collisionWidth-a-n,t.left+=h-i):t.left=l>0&&0>=h?n:h>l?n+a-e.collisionWidth:n:h>0?t.left+=h:l>0?t.left-=l:t.left=o(t.left-r,t.left)},top:function(t,e){var i,s=e.within,n=s.isWindow?s.scrollTop:s.offset.top,a=e.within.height,r=t.top-e.collisionPosition.marginTop,h=n-r,l=r+e.collisionHeight-a-n;e.collisionHeight>a?h>0&&0>=l?(i=t.top+h+e.collisionHeight-a-n,t.top+=h-i):t.top=l>0&&0>=h?n:h>l?n+a-e.collisionHeight:n:h>0?t.top+=h:l>0?t.top-=l:t.top=o(t.top-r,t.top)}},flip:{left:function(t,e){var i,s,n=e.within,a=n.offset.left+n.scrollLeft,o=n.width,h=n.isWindow?n.scrollLeft:n.offset.left,l=t.left-e.collisionPosition.marginLeft,c=l-h,u=l+e.collisionWidth-o-h,d="left"===e.my[0]?-e.elemWidth:"right"===e.my[0]?e.elemWidth:0,p="left"===e.at[0]?e.targetWidth:"right"===e.at[0]?-e.targetWidth:0,f=-2*e.offset[0];0>c?(i=t.left+d+p+f+e.collisionWidth-o-a,(0>i||r(c)>i)&&(t.left+=d+p+f)):u>0&&(s=t.left-e.collisionPosition.marginLeft+d+p+f-h,(s>0||u>r(s))&&(t.left+=d+p+f))},top:function(t,e){var i,s,n=e.within,a=n.offset.top+n.scrollTop,o=n.height,h=n.isWindow?n.scrollTop:n.offset.top,l=t.top-e.collisionPosition.marginTop,c=l-h,u=l+e.collisionHeight-o-h,d="top"===e.my[1],p=d?-e.elemHeight:"bottom"===e.my[1]?e.elemHeight:0,f="top"===e.at[1]?e.targetHeight:"bottom"===e.at[1]?-e.targetHeight:0,m=-2*e.offset[1];0>c?(s=t.top+p+f+m+e.collisionHeight-o-a,t.top+p+f+m>c&&(0>s||r(c)>s)&&(t.top+=p+f+m)):u>0&&(i=t.top-e.collisionPosition.marginTop+p+f+m-h,t.top+p+f+m>u&&(i>0||u>r(i))&&(t.top+=p+f+m))}},flipfit:{left:function(){t.ui.position.flip.left.apply(this,arguments),t.ui.position.fit.left.apply(this,arguments)},top:function(){t.ui.position.flip.top.apply(this,arguments),t.ui.position.fit.top.apply(this,arguments)}}},function(){var e,i,s,n,a,o=document.getElementsByTagName("body")[0],r=document.createElement("div");e=document.createElement(o?"div":"body"),s={visibility:"hidden",width:0,height:0,border:0,margin:0,background:"none"},o&&t.extend(s,{position:"absolute",left:"-1000px",top:"-1000px"});for(a in s)e.style[a]=s[a];e.appendChild(r),i=o||document.documentElement,i.insertBefore(e,i.firstChild),r.style.cssText="position: absolute; left: 10.7432222px;",n=t(r).offset().left,t.support.offsetFractions=n>10&&11>n,e.innerHTML="",i.removeChild(e)}()})(jQuery);(function(t){var e=0;t.widget("ui.autocomplete",{version:"1.10.3",defaultElement:"<input>",options:{appendTo:null,autoFocus:!1,delay:300,minLength:1,position:{my:"left top",at:"left bottom",collision:"none"},source:null,change:null,close:null,focus:null,open:null,response:null,search:null,select:null},pending:0,_create:function(){var e,i,s,n=this.element[0].nodeName.toLowerCase(),a="textarea"===n,o="input"===n;this.isMultiLine=a?!0:o?!1:this.element.prop("isContentEditable"),this.valueMethod=this.element[a||o?"val":"text"],this.isNewMenu=!0,this.element.addClass("ui-autocomplete-input").attr("autocomplete","off"),this._on(this.element,{keydown:function(n){if(this.element.prop("readOnly"))return e=!0,s=!0,i=!0,undefined;e=!1,s=!1,i=!1;var a=t.ui.keyCode;switch(n.keyCode){case a.PAGE_UP:e=!0,this._move("previousPage",n);break;case a.PAGE_DOWN:e=!0,this._move("nextPage",n);break;case a.UP:e=!0,this._keyEvent("previous",n);break;case a.DOWN:e=!0,this._keyEvent("next",n);break;case a.ENTER:case a.NUMPAD_ENTER:this.menu.active&&(e=!0,n.preventDefault(),this.menu.select(n));break;case a.TAB:this.menu.active&&this.menu.select(n);break;case a.ESCAPE:this.menu.element.is(":visible")&&(this._value(this.term),this.close(n),n.preventDefault());break;default:i=!0,this._searchTimeout(n)}},keypress:function(s){if(e)return e=!1,(!this.isMultiLine||this.menu.element.is(":visible"))&&s.preventDefault(),undefined;if(!i){var n=t.ui.keyCode;switch(s.keyCode){case n.PAGE_UP:this._move("previousPage",s);break;case n.PAGE_DOWN:this._move("nextPage",s);break;case n.UP:this._keyEvent("previous",s);break;case n.DOWN:this._keyEvent("next",s)}}},input:function(t){return s?(s=!1,t.preventDefault(),undefined):(this._searchTimeout(t),undefined)},focus:function(){this.selectedItem=null,this.previous=this._value()},blur:function(t){return this.cancelBlur?(delete this.cancelBlur,undefined):(clearTimeout(this.searching),this.close(t),this._change(t),undefined)}}),this._initSource(),this.menu=t("<ul>").addClass("ui-autocomplete ui-front").appendTo(this._appendTo()).menu({role:null}).hide().data("ui-menu"),this._on(this.menu.element,{mousedown:function(e){e.preventDefault(),this.cancelBlur=!0,this._delay(function(){delete this.cancelBlur});var i=this.menu.element[0];t(e.target).closest(".ui-menu-item").length||this._delay(function(){var e=this;this.document.one("mousedown",function(s){s.target===e.element[0]||s.target===i||t.contains(i,s.target)||e.close()})})},menufocus:function(e,i){if(this.isNewMenu&&(this.isNewMenu=!1,e.originalEvent&&/^mouse/.test(e.originalEvent.type)))return this.menu.blur(),this.document.one("mousemove",function(){t(e.target).trigger(e.originalEvent)}),undefined;var s=i.item.data("ui-autocomplete-item");!1!==this._trigger("focus",e,{item:s})?e.originalEvent&&/^key/.test(e.originalEvent.type)&&this._value(s.value):this.liveRegion.text(s.value)},menuselect:function(t,e){var i=e.item.data("ui-autocomplete-item"),s=this.previous;this.element[0]!==this.document[0].activeElement&&(this.element.focus(),this.previous=s,this._delay(function(){this.previous=s,this.selectedItem=i})),!1!==this._trigger("select",t,{item:i})&&this._value(i.value),this.term=this._value(),this.close(t),this.selectedItem=i}}),this.liveRegion=t("<span>",{role:"status","aria-live":"polite"}).addClass("ui-helper-hidden-accessible").insertBefore(this.element),this._on(this.window,{beforeunload:function(){this.element.removeAttr("autocomplete")}})},_destroy:function(){clearTimeout(this.searching),this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete"),this.menu.element.remove(),this.liveRegion.remove()},_setOption:function(t,e){this._super(t,e),"source"===t&&this._initSource(),"appendTo"===t&&this.menu.element.appendTo(this._appendTo()),"disabled"===t&&e&&this.xhr&&this.xhr.abort()},_appendTo:function(){var e=this.options.appendTo;return e&&(e=e.jquery||e.nodeType?t(e):this.document.find(e).eq(0)),e||(e=this.element.closest(".ui-front")),e.length||(e=this.document[0].body),e},_initSource:function(){var e,i,s=this;t.isArray(this.options.source)?(e=this.options.source,this.source=function(i,s){s(t.ui.autocomplete.filter(e,i.term))}):"string"==typeof this.options.source?(i=this.options.source,this.source=function(e,n){s.xhr&&s.xhr.abort(),s.xhr=t.ajax({url:i,data:e,dataType:"json",success:function(t){n(t)},error:function(){n([])}})}):this.source=this.options.source},_searchTimeout:function(t){clearTimeout(this.searching),this.searching=this._delay(function(){this.term!==this._value()&&(this.selectedItem=null,this.search(null,t))},this.options.delay)},search:function(t,e){return t=null!=t?t:this._value(),this.term=this._value(),t.length<this.options.minLength?this.close(e):this._trigger("search",e)!==!1?this._search(t):undefined},_search:function(t){this.pending++,this.element.addClass("ui-autocomplete-loading"),this.cancelSearch=!1,this.source({term:t},this._response())},_response:function(){var t=this,i=++e;return function(s){i===e&&t.__response(s),t.pending--,t.pending||t.element.removeClass("ui-autocomplete-loading")}},__response:function(t){t&&(t=this._normalize(t)),this._trigger("response",null,{content:t}),!this.options.disabled&&t&&t.length&&!this.cancelSearch?(this._suggest(t),this._trigger("open")):this._close()},close:function(t){this.cancelSearch=!0,this._close(t)},_close:function(t){this.menu.element.is(":visible")&&(this.menu.element.hide(),this.menu.blur(),this.isNewMenu=!0,this._trigger("close",t))},_change:function(t){this.previous!==this._value()&&this._trigger("change",t,{item:this.selectedItem})},_normalize:function(e){return e.length&&e[0].label&&e[0].value?e:t.map(e,function(e){return"string"==typeof e?{label:e,value:e}:t.extend({label:e.label||e.value,value:e.value||e.label},e)})},_suggest:function(e){var i=this.menu.element.empty();this._renderMenu(i,e),this.isNewMenu=!0,this.menu.refresh(),i.show(),this._resizeMenu(),i.position(t.extend({of:this.element},this.options.position)),this.options.autoFocus&&this.menu.next()},_resizeMenu:function(){var t=this.menu.element;t.outerWidth(Math.max(t.width("").outerWidth()+1,this.element.outerWidth()))},_renderMenu:function(e,i){var s=this;t.each(i,function(t,i){s._renderItemData(e,i)})},_renderItemData:function(t,e){return this._renderItem(t,e).data("ui-autocomplete-item",e)},_renderItem:function(e,i){return t("<li>").append(t("<a>").text(i.label)).appendTo(e)},_move:function(t,e){return this.menu.element.is(":visible")?this.menu.isFirstItem()&&/^previous/.test(t)||this.menu.isLastItem()&&/^next/.test(t)?(this._value(this.term),this.menu.blur(),undefined):(this.menu[t](e),undefined):(this.search(null,e),undefined)},widget:function(){return this.menu.element},_value:function(){return this.valueMethod.apply(this.element,arguments)},_keyEvent:function(t,e){(!this.isMultiLine||this.menu.element.is(":visible"))&&(this._move(t,e),e.preventDefault())}}),t.extend(t.ui.autocomplete,{escapeRegex:function(t){return t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")},filter:function(e,i){var s=RegExp(t.ui.autocomplete.escapeRegex(i),"i");return t.grep(e,function(t){return s.test(t.label||t.value||t)})}}),t.widget("ui.autocomplete",t.ui.autocomplete,{options:{messages:{noResults:"No search results.",results:function(t){return t+(t>1?" results are":" result is")+" available, use up and down arrow keys to navigate."}}},__response:function(t){var e;this._superApply(arguments),this.options.disabled||this.cancelSearch||(e=t&&t.length?this.options.messages.results(t.length):this.options.messages.noResults,this.liveRegion.text(e))}})})(jQuery);(function(t,e){function i(){this._curInst=null,this._keyEvent=!1,this._disabledInputs=[],this._datepickerShowing=!1,this._inDialog=!1,this._mainDivId="ui-datepicker-div",this._inlineClass="ui-datepicker-inline",this._appendClass="ui-datepicker-append",this._triggerClass="ui-datepicker-trigger",this._dialogClass="ui-datepicker-dialog",this._disableClass="ui-datepicker-disabled",this._unselectableClass="ui-datepicker-unselectable",this._currentClass="ui-datepicker-current-day",this._dayOverClass="ui-datepicker-days-cell-over",this.regional=[],this.regional[""]={closeText:"Done",prevText:"Prev",nextText:"Next",currentText:"Today",monthNames:["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],monthNamesShort:["Янв","Фев","Мар","Апр","Мая","Июн","Июл","Авг","Сен","Окт","Ноя","Дек"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["Su","Mo","Tu","We","Th","Fr","Sa"],weekHeader:"Wk",dateFormat:"mm/dd/yy",firstDay:0,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},this._defaults={showOn:"focus",showAnim:"fadeIn",showOptions:{},defaultDate:null,appendText:"",buttonText:"...",buttonImage:"",buttonImageOnly:!1,hideIfNoPrevNext:!1,navigationAsDateFormat:!1,gotoCurrent:!1,changeMonth:!1,changeYear:!1,yearRange:"c-10:c+10",showOtherMonths:!1,selectOtherMonths:!1,showWeek:!1,calculateWeek:this.iso8601Week,shortYearCutoff:"+10",minDate:null,maxDate:null,duration:"fast",beforeShowDay:null,beforeShow:null,onSelect:null,onChangeMonthYear:null,onClose:null,numberOfMonths:1,showCurrentAtPos:0,stepMonths:1,stepBigMonths:12,altField:"",altFormat:"",constrainInput:!0,showButtonPanel:!1,autoSize:!1,disabled:!1},t.extend(this._defaults,this.regional[""]),this.dpDiv=s(t("<div id='"+this._mainDivId+"' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"))}function s(e){var i="button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";return e.delegate(i,"mouseout",function(){t(this).removeClass("ui-state-hover"),-1!==this.className.indexOf("ui-datepicker-prev")&&t(this).removeClass("ui-datepicker-prev-hover"),-1!==this.className.indexOf("ui-datepicker-next")&&t(this).removeClass("ui-datepicker-next-hover")}).delegate(i,"mouseover",function(){t.datepicker._isDisabledDatepicker(a.inline?e.parent()[0]:a.input[0])||(t(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover"),t(this).addClass("ui-state-hover"),-1!==this.className.indexOf("ui-datepicker-prev")&&t(this).addClass("ui-datepicker-prev-hover"),-1!==this.className.indexOf("ui-datepicker-next")&&t(this).addClass("ui-datepicker-next-hover"))})}function n(e,i){t.extend(e,i);for(var s in i)null==i[s]&&(e[s]=i[s]);return e}t.extend(t.ui,{datepicker:{version:"1.10.3"}});var a,r="datepicker";t.extend(i.prototype,{markerClassName:"hasDatepicker",maxRows:4,_widgetDatepicker:function(){return this.dpDiv},setDefaults:function(t){return n(this._defaults,t||{}),this},_attachDatepicker:function(e,i){var s,n,a;s=e.nodeName.toLowerCase(),n="div"===s||"span"===s,e.id||(this.uuid+=1,e.id="dp"+this.uuid),a=this._newInst(t(e),n),a.settings=t.extend({},i||{}),"input"===s?this._connectDatepicker(e,a):n&&this._inlineDatepicker(e,a)},_newInst:function(e,i){var n=e[0].id.replace(/([^A-Za-z0-9_\-])/g,"\\\\$1");return{id:n,input:e,selectedDay:0,selectedMonth:0,selectedYear:0,drawMonth:0,drawYear:0,inline:i,dpDiv:i?s(t("<div class='"+this._inlineClass+" ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")):this.dpDiv}},_connectDatepicker:function(e,i){var s=t(e);i.append=t([]),i.trigger=t([]),s.hasClass(this.markerClassName)||(this._attachments(s,i),s.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp),this._autoSize(i),t.data(e,r,i),i.settings.disabled&&this._disableDatepicker(e))},_attachments:function(e,i){var s,n,a,r=this._get(i,"appendText"),o=this._get(i,"isRTL");i.append&&i.append.remove(),r&&(i.append=t("<span class='"+this._appendClass+"'>"+r+"</span>"),e[o?"before":"after"](i.append)),e.unbind("focus",this._showDatepicker),i.trigger&&i.trigger.remove(),s=this._get(i,"showOn"),("focus"===s||"both"===s)&&e.focus(this._showDatepicker),("button"===s||"both"===s)&&(n=this._get(i,"buttonText"),a=this._get(i,"buttonImage"),i.trigger=t(this._get(i,"buttonImageOnly")?t("<img/>").addClass(this._triggerClass).attr({src:a,alt:n,title:n}):t("<button type='button'></button>").addClass(this._triggerClass).html(a?t("<img/>").attr({src:a,alt:n,title:n}):n)),e[o?"before":"after"](i.trigger),i.trigger.click(function(){return t.datepicker._datepickerShowing&&t.datepicker._lastInput===e[0]?t.datepicker._hideDatepicker():t.datepicker._datepickerShowing&&t.datepicker._lastInput!==e[0]?(t.datepicker._hideDatepicker(),t.datepicker._showDatepicker(e[0])):t.datepicker._showDatepicker(e[0]),!1}))},_autoSize:function(t){if(this._get(t,"autoSize")&&!t.inline){var e,i,s,n,a=new Date(2009,11,20),r=this._get(t,"dateFormat");r.match(/[DM]/)&&(e=function(t){for(i=0,s=0,n=0;t.length>n;n++)t[n].length>i&&(i=t[n].length,s=n);return s},a.setMonth(e(this._get(t,r.match(/MM/)?"monthNames":"monthNamesShort"))),a.setDate(e(this._get(t,r.match(/DD/)?"dayNames":"dayNamesShort"))+20-a.getDay())),t.input.attr("size",this._formatDate(t,a).length)}},_inlineDatepicker:function(e,i){var s=t(e);s.hasClass(this.markerClassName)||(s.addClass(this.markerClassName).append(i.dpDiv),t.data(e,r,i),this._setDate(i,this._getDefaultDate(i),!0),this._updateDatepicker(i),this._updateAlternate(i),i.settings.disabled&&this._disableDatepicker(e),i.dpDiv.css("display","block"))},_dialogDatepicker:function(e,i,s,a,o){var h,l,c,u,d,p=this._dialogInst;return p||(this.uuid+=1,h="dp"+this.uuid,this._dialogInput=t("<input type='text' id='"+h+"' style='position: absolute; top: -100px; width: 0px;'/>"),this._dialogInput.keydown(this._doKeyDown),t("body").append(this._dialogInput),p=this._dialogInst=this._newInst(this._dialogInput,!1),p.settings={},t.data(this._dialogInput[0],r,p)),n(p.settings,a||{}),i=i&&i.constructor===Date?this._formatDate(p,i):i,this._dialogInput.val(i),this._pos=o?o.length?o:[o.pageX,o.pageY]:null,this._pos||(l=document.documentElement.clientWidth,c=document.documentElement.clientHeight,u=document.documentElement.scrollLeft||document.body.scrollLeft,d=document.documentElement.scrollTop||document.body.scrollTop,this._pos=[l/2-100+u,c/2-150+d]),this._dialogInput.css("left",this._pos[0]+20+"px").css("top",this._pos[1]+"px"),p.settings.onSelect=s,this._inDialog=!0,this.dpDiv.addClass(this._dialogClass),this._showDatepicker(this._dialogInput[0]),t.blockUI&&t.blockUI(this.dpDiv),t.data(this._dialogInput[0],r,p),this},_destroyDatepicker:function(e){var i,s=t(e),n=t.data(e,r);s.hasClass(this.markerClassName)&&(i=e.nodeName.toLowerCase(),t.removeData(e,r),"input"===i?(n.append.remove(),n.trigger.remove(),s.removeClass(this.markerClassName).unbind("focus",this._showDatepicker).unbind("keydown",this._doKeyDown).unbind("keypress",this._doKeyPress).unbind("keyup",this._doKeyUp)):("div"===i||"span"===i)&&s.removeClass(this.markerClassName).empty())},_enableDatepicker:function(e){var i,s,n=t(e),a=t.data(e,r);n.hasClass(this.markerClassName)&&(i=e.nodeName.toLowerCase(),"input"===i?(e.disabled=!1,a.trigger.filter("button").each(function(){this.disabled=!1}).end().filter("img").css({opacity:"1.0",cursor:""})):("div"===i||"span"===i)&&(s=n.children("."+this._inlineClass),s.children().removeClass("ui-state-disabled"),s.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled",!1)),this._disabledInputs=t.map(this._disabledInputs,function(t){return t===e?null:t}))},_disableDatepicker:function(e){var i,s,n=t(e),a=t.data(e,r);n.hasClass(this.markerClassName)&&(i=e.nodeName.toLowerCase(),"input"===i?(e.disabled=!0,a.trigger.filter("button").each(function(){this.disabled=!0}).end().filter("img").css({opacity:"0.5",cursor:"default"})):("div"===i||"span"===i)&&(s=n.children("."+this._inlineClass),s.children().addClass("ui-state-disabled"),s.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled",!0)),this._disabledInputs=t.map(this._disabledInputs,function(t){return t===e?null:t}),this._disabledInputs[this._disabledInputs.length]=e)},_isDisabledDatepicker:function(t){if(!t)return!1;for(var e=0;this._disabledInputs.length>e;e++)if(this._disabledInputs[e]===t)return!0;return!1},_getInst:function(e){try{return t.data(e,r)}catch(i){throw"Missing instance data for this datepicker"}},_optionDatepicker:function(i,s,a){var r,o,h,l,c=this._getInst(i);return 2===arguments.length&&"string"==typeof s?"defaults"===s?t.extend({},t.datepicker._defaults):c?"all"===s?t.extend({},c.settings):this._get(c,s):null:(r=s||{},"string"==typeof s&&(r={},r[s]=a),c&&(this._curInst===c&&this._hideDatepicker(),o=this._getDateDatepicker(i,!0),h=this._getMinMaxDate(c,"min"),l=this._getMinMaxDate(c,"max"),n(c.settings,r),null!==h&&r.dateFormat!==e&&r.minDate===e&&(c.settings.minDate=this._formatDate(c,h)),null!==l&&r.dateFormat!==e&&r.maxDate===e&&(c.settings.maxDate=this._formatDate(c,l)),"disabled"in r&&(r.disabled?this._disableDatepicker(i):this._enableDatepicker(i)),this._attachments(t(i),c),this._autoSize(c),this._setDate(c,o),this._updateAlternate(c),this._updateDatepicker(c)),e)},_changeDatepicker:function(t,e,i){this._optionDatepicker(t,e,i)},_refreshDatepicker:function(t){var e=this._getInst(t);e&&this._updateDatepicker(e)},_setDateDatepicker:function(t,e){var i=this._getInst(t);i&&(this._setDate(i,e),this._updateDatepicker(i),this._updateAlternate(i))},_getDateDatepicker:function(t,e){var i=this._getInst(t);return i&&!i.inline&&this._setDateFromField(i,e),i?this._getDate(i):null},_doKeyDown:function(e){var i,s,n,a=t.datepicker._getInst(e.target),r=!0,o=a.dpDiv.is(".ui-datepicker-rtl");if(a._keyEvent=!0,t.datepicker._datepickerShowing)switch(e.keyCode){case 9:t.datepicker._hideDatepicker(),r=!1;break;case 13:return n=t("td."+t.datepicker._dayOverClass+":not(."+t.datepicker._currentClass+")",a.dpDiv),n[0]&&t.datepicker._selectDay(e.target,a.selectedMonth,a.selectedYear,n[0]),i=t.datepicker._get(a,"onSelect"),i?(s=t.datepicker._formatDate(a),i.apply(a.input?a.input[0]:null,[s,a])):t.datepicker._hideDatepicker(),!1;case 27:t.datepicker._hideDatepicker();break;case 33:t.datepicker._adjustDate(e.target,e.ctrlKey?-t.datepicker._get(a,"stepBigMonths"):-t.datepicker._get(a,"stepMonths"),"M");break;case 34:t.datepicker._adjustDate(e.target,e.ctrlKey?+t.datepicker._get(a,"stepBigMonths"):+t.datepicker._get(a,"stepMonths"),"M");break;case 35:(e.ctrlKey||e.metaKey)&&t.datepicker._clearDate(e.target),r=e.ctrlKey||e.metaKey;break;case 36:(e.ctrlKey||e.metaKey)&&t.datepicker._gotoToday(e.target),r=e.ctrlKey||e.metaKey;break;case 37:(e.ctrlKey||e.metaKey)&&t.datepicker._adjustDate(e.target,o?1:-1,"D"),r=e.ctrlKey||e.metaKey,e.originalEvent.altKey&&t.datepicker._adjustDate(e.target,e.ctrlKey?-t.datepicker._get(a,"stepBigMonths"):-t.datepicker._get(a,"stepMonths"),"M");break;case 38:(e.ctrlKey||e.metaKey)&&t.datepicker._adjustDate(e.target,-7,"D"),r=e.ctrlKey||e.metaKey;break;case 39:(e.ctrlKey||e.metaKey)&&t.datepicker._adjustDate(e.target,o?-1:1,"D"),r=e.ctrlKey||e.metaKey,e.originalEvent.altKey&&t.datepicker._adjustDate(e.target,e.ctrlKey?+t.datepicker._get(a,"stepBigMonths"):+t.datepicker._get(a,"stepMonths"),"M");break;case 40:(e.ctrlKey||e.metaKey)&&t.datepicker._adjustDate(e.target,7,"D"),r=e.ctrlKey||e.metaKey;break;default:r=!1}else 36===e.keyCode&&e.ctrlKey?t.datepicker._showDatepicker(this):r=!1;r&&(e.preventDefault(),e.stopPropagation())},_doKeyPress:function(i){var s,n,a=t.datepicker._getInst(i.target);return t.datepicker._get(a,"constrainInput")?(s=t.datepicker._possibleChars(t.datepicker._get(a,"dateFormat")),n=String.fromCharCode(null==i.charCode?i.keyCode:i.charCode),i.ctrlKey||i.metaKey||" ">n||!s||s.indexOf(n)>-1):e},_doKeyUp:function(e){var i,s=t.datepicker._getInst(e.target);if(s.input.val()!==s.lastVal)try{i=t.datepicker.parseDate(t.datepicker._get(s,"dateFormat"),s.input?s.input.val():null,t.datepicker._getFormatConfig(s)),i&&(t.datepicker._setDateFromField(s),t.datepicker._updateAlternate(s),t.datepicker._updateDatepicker(s))}catch(n){}return!0},_showDatepicker:function(e){if(e=e.target||e,"input"!==e.nodeName.toLowerCase()&&(e=t("input",e.parentNode)[0]),!t.datepicker._isDisabledDatepicker(e)&&t.datepicker._lastInput!==e){var i,s,a,r,o,h,l;i=t.datepicker._getInst(e),t.datepicker._curInst&&t.datepicker._curInst!==i&&(t.datepicker._curInst.dpDiv.stop(!0,!0),i&&t.datepicker._datepickerShowing&&t.datepicker._hideDatepicker(t.datepicker._curInst.input[0])),s=t.datepicker._get(i,"beforeShow"),a=s?s.apply(e,[e,i]):{},a!==!1&&(n(i.settings,a),i.lastVal=null,t.datepicker._lastInput=e,t.datepicker._setDateFromField(i),t.datepicker._inDialog&&(e.value=""),t.datepicker._pos||(t.datepicker._pos=t.datepicker._findPos(e),t.datepicker._pos[1]+=e.offsetHeight),r=!1,t(e).parents().each(function(){return r|="fixed"===t(this).css("position"),!r}),o={left:t.datepicker._pos[0],top:t.datepicker._pos[1]},t.datepicker._pos=null,i.dpDiv.empty(),i.dpDiv.css({position:"absolute",display:"block",top:"-1000px"}),t.datepicker._updateDatepicker(i),o=t.datepicker._checkOffset(i,o,r),i.dpDiv.css({position:t.datepicker._inDialog&&t.blockUI?"static":r?"fixed":"absolute",display:"none",left:o.left+"px",top:o.top+"px"}),i.inline||(h=t.datepicker._get(i,"showAnim"),l=t.datepicker._get(i,"duration"),i.dpDiv.zIndex(t(e).zIndex()+1),t.datepicker._datepickerShowing=!0,t.effects&&t.effects.effect[h]?i.dpDiv.show(h,t.datepicker._get(i,"showOptions"),l):i.dpDiv[h||"show"](h?l:null),t.datepicker._shouldFocusInput(i)&&i.input.focus(),t.datepicker._curInst=i))}},_updateDatepicker:function(e){this.maxRows=4,a=e,e.dpDiv.empty().append(this._generateHTML(e)),this._attachHandlers(e),e.dpDiv.find("."+this._dayOverClass+" a").mouseover();var i,s=this._getNumberOfMonths(e),n=s[1],r=17;e.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width(""),n>1&&e.dpDiv.addClass("ui-datepicker-multi-"+n).css("width",r*n+"em"),e.dpDiv[(1!==s[0]||1!==s[1]?"add":"remove")+"Class"]("ui-datepicker-multi"),e.dpDiv[(this._get(e,"isRTL")?"add":"remove")+"Class"]("ui-datepicker-rtl"),e===t.datepicker._curInst&&t.datepicker._datepickerShowing&&t.datepicker._shouldFocusInput(e)&&e.input.focus(),e.yearshtml&&(i=e.yearshtml,setTimeout(function(){i===e.yearshtml&&e.yearshtml&&e.dpDiv.find("select.ui-datepicker-year:first").replaceWith(e.yearshtml),i=e.yearshtml=null},0))},_shouldFocusInput:function(t){return t.input&&t.input.is(":visible")&&!t.input.is(":disabled")&&!t.input.is(":focus")},_checkOffset:function(e,i,s){var n=e.dpDiv.outerWidth(),a=e.dpDiv.outerHeight(),r=e.input?e.input.outerWidth():0,o=e.input?e.input.outerHeight():0,h=document.documentElement.clientWidth+(s?0:t(document).scrollLeft()),l=document.documentElement.clientHeight+(s?0:t(document).scrollTop());return i.left-=this._get(e,"isRTL")?n-r:0,i.left-=s&&i.left===e.input.offset().left?t(document).scrollLeft():0,i.top-=s&&i.top===e.input.offset().top+o?t(document).scrollTop():0,i.left-=Math.min(i.left,i.left+n>h&&h>n?Math.abs(i.left+n-h):0),i.top-=Math.min(i.top,i.top+a>l&&l>a?Math.abs(a+o):0),i},_findPos:function(e){for(var i,s=this._getInst(e),n=this._get(s,"isRTL");e&&("hidden"===e.type||1!==e.nodeType||t.expr.filters.hidden(e));)e=e[n?"previousSibling":"nextSibling"];return i=t(e).offset(),[i.left,i.top]},_hideDatepicker:function(e){var i,s,n,a,o=this._curInst;!o||e&&o!==t.data(e,r)||this._datepickerShowing&&(i=this._get(o,"showAnim"),s=this._get(o,"duration"),n=function(){t.datepicker._tidyDialog(o)},t.effects&&(t.effects.effect[i]||t.effects[i])?o.dpDiv.hide(i,t.datepicker._get(o,"showOptions"),s,n):o.dpDiv["slideDown"===i?"slideUp":"fadeIn"===i?"fadeOut":"hide"](i?s:null,n),i||n(),this._datepickerShowing=!1,a=this._get(o,"onClose"),a&&a.apply(o.input?o.input[0]:null,[o.input?o.input.val():"",o]),this._lastInput=null,this._inDialog&&(this._dialogInput.css({position:"absolute",left:"0",top:"-100px"}),t.blockUI&&(t.unblockUI(),t("body").append(this.dpDiv))),this._inDialog=!1)},_tidyDialog:function(t){t.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar")},_checkExternalClick:function(e){if(t.datepicker._curInst){var i=t(e.target),s=t.datepicker._getInst(i[0]);(i[0].id!==t.datepicker._mainDivId&&0===i.parents("#"+t.datepicker._mainDivId).length&&!i.hasClass(t.datepicker.markerClassName)&&!i.closest("."+t.datepicker._triggerClass).length&&t.datepicker._datepickerShowing&&(!t.datepicker._inDialog||!t.blockUI)||i.hasClass(t.datepicker.markerClassName)&&t.datepicker._curInst!==s)&&t.datepicker._hideDatepicker()}},_adjustDate:function(e,i,s){var n=t(e),a=this._getInst(n[0]);this._isDisabledDatepicker(n[0])||(this._adjustInstDate(a,i+("M"===s?this._get(a,"showCurrentAtPos"):0),s),this._updateDatepicker(a))},_gotoToday:function(e){var i,s=t(e),n=this._getInst(s[0]);this._get(n,"gotoCurrent")&&n.currentDay?(n.selectedDay=n.currentDay,n.drawMonth=n.selectedMonth=n.currentMonth,n.drawYear=n.selectedYear=n.currentYear):(i=new Date,n.selectedDay=i.getDate(),n.drawMonth=n.selectedMonth=i.getMonth(),n.drawYear=n.selectedYear=i.getFullYear()),this._notifyChange(n),this._adjustDate(s)},_selectMonthYear:function(e,i,s){var n=t(e),a=this._getInst(n[0]);a["selected"+("M"===s?"Month":"Year")]=a["draw"+("M"===s?"Month":"Year")]=parseInt(i.options[i.selectedIndex].value,10),this._notifyChange(a),this._adjustDate(n)},_selectDay:function(e,i,s,n){var a,r=t(e);t(n).hasClass(this._unselectableClass)||this._isDisabledDatepicker(r[0])||(a=this._getInst(r[0]),a.selectedDay=a.currentDay=t("a",n).html(),a.selectedMonth=a.currentMonth=i,a.selectedYear=a.currentYear=s,this._selectDate(e,this._formatDate(a,a.currentDay,a.currentMonth,a.currentYear)))},_clearDate:function(e){var i=t(e);this._selectDate(i,"")},_selectDate:function(e,i){var s,n=t(e),a=this._getInst(n[0]);i=null!=i?i:this._formatDate(a),a.input&&a.input.val(i),this._updateAlternate(a),s=this._get(a,"onSelect"),s?s.apply(a.input?a.input[0]:null,[i,a]):a.input&&a.input.trigger("change"),a.inline?this._updateDatepicker(a):(this._hideDatepicker(),this._lastInput=a.input[0],"object"!=typeof a.input[0]&&a.input.focus(),this._lastInput=null)},_updateAlternate:function(e){var i,s,n,a=this._get(e,"altField");a&&(i=this._get(e,"altFormat")||this._get(e,"dateFormat"),s=this._getDate(e),n=this.formatDate(i,s,this._getFormatConfig(e)),t(a).each(function(){t(this).val(n)}))},noWeekends:function(t){var e=t.getDay();return[e>0&&6>e,""]},iso8601Week:function(t){var e,i=new Date(t.getTime());return i.setDate(i.getDate()+4-(i.getDay()||7)),e=i.getTime(),i.setMonth(0),i.setDate(1),Math.floor(Math.round((e-i)/864e5)/7)+1},parseDate:function(i,s,n){if(null==i||null==s)throw"Invalid arguments";if(s="object"==typeof s?""+s:s+"",""===s)return null;var a,r,o,h,l=0,c=(n?n.shortYearCutoff:null)||this._defaults.shortYearCutoff,u="string"!=typeof c?c:(new Date).getFullYear()%100+parseInt(c,10),d=(n?n.dayNamesShort:null)||this._defaults.dayNamesShort,p=(n?n.dayNames:null)||this._defaults.dayNames,f=(n?n.monthNamesShort:null)||this._defaults.monthNamesShort,m=(n?n.monthNames:null)||this._defaults.monthNames,g=-1,v=-1,_=-1,b=-1,y=!1,x=function(t){var e=i.length>a+1&&i.charAt(a+1)===t;return e&&a++,e},k=function(t){var e=x(t),i="@"===t?14:"!"===t?20:"y"===t&&e?4:"o"===t?3:2,n=RegExp("^\\d{1,"+i+"}"),a=s.substring(l).match(n);if(!a)throw"Missing number at position "+l;return l+=a[0].length,parseInt(a[0],10)},w=function(i,n,a){var r=-1,o=t.map(x(i)?a:n,function(t,e){return[[e,t]]}).sort(function(t,e){return-(t[1].length-e[1].length)});if(t.each(o,function(t,i){var n=i[1];return s.substr(l,n.length).toLowerCase()===n.toLowerCase()?(r=i[0],l+=n.length,!1):e}),-1!==r)return r+1;throw"Unknown name at position "+l},D=function(){if(s.charAt(l)!==i.charAt(a))throw"Unexpected literal at position "+l;l++};for(a=0;i.length>a;a++)if(y)"'"!==i.charAt(a)||x("'")?D():y=!1;else switch(i.charAt(a)){case"d":_=k("d");break;case"D":w("D",d,p);break;case"o":b=k("o");break;case"m":v=k("m");break;case"M":v=w("M",f,m);break;case"y":g=k("y");break;case"@":h=new Date(k("@")),g=h.getFullYear(),v=h.getMonth()+1,_=h.getDate();break;case"!":h=new Date((k("!")-this._ticksTo1970)/1e4),g=h.getFullYear(),v=h.getMonth()+1,_=h.getDate();break;case"'":x("'")?D():y=!0;break;default:D()}if(s.length>l&&(o=s.substr(l),!/^\s+/.test(o)))throw"Extra/unparsed characters found in date: "+o;if(-1===g?g=(new Date).getFullYear():100>g&&(g+=(new Date).getFullYear()-(new Date).getFullYear()%100+(u>=g?0:-100)),b>-1)for(v=1,_=b;;){if(r=this._getDaysInMonth(g,v-1),r>=_)break;v++,_-=r}if(h=this._daylightSavingAdjust(new Date(g,v-1,_)),h.getFullYear()!==g||h.getMonth()+1!==v||h.getDate()!==_)throw"Invalid date";return h},ATOM:"yy-mm-dd",COOKIE:"D, dd M yy",ISO_8601:"yy-mm-dd",RFC_822:"D, d M y",RFC_850:"DD, dd-M-y",RFC_1036:"D, d M y",RFC_1123:"D, d M yy",RFC_2822:"D, d M yy",RSS:"D, d M y",TICKS:"!",TIMESTAMP:"@",W3C:"yy-mm-dd",_ticksTo1970:1e7*60*60*24*(718685+Math.floor(492.5)-Math.floor(19.7)+Math.floor(4.925)),formatDate:function(t,e,i){if(!e)return"";var s,n=(i?i.dayNamesShort:null)||this._defaults.dayNamesShort,a=(i?i.dayNames:null)||this._defaults.dayNames,r=(i?i.monthNamesShort:null)||this._defaults.monthNamesShort,o=(i?i.monthNames:null)||this._defaults.monthNames,h=function(e){var i=t.length>s+1&&t.charAt(s+1)===e;return i&&s++,i},l=function(t,e,i){var s=""+e;if(h(t))for(;i>s.length;)s="0"+s;return s},c=function(t,e,i,s){return h(t)?s[e]:i[e]},u="",d=!1;if(e)for(s=0;t.length>s;s++)if(d)"'"!==t.charAt(s)||h("'")?u+=t.charAt(s):d=!1;else switch(t.charAt(s)){case"d":u+=l("d",e.getDate(),2);break;case"D":u+=c("D",e.getDay(),n,a);break;case"o":u+=l("o",Math.round((new Date(e.getFullYear(),e.getMonth(),e.getDate()).getTime()-new Date(e.getFullYear(),0,0).getTime())/864e5),3);break;case"m":u+=l("m",e.getMonth()+1,2);break;case"M":u+=c("M",e.getMonth(),r,o);break;case"y":u+=h("y")?e.getFullYear():(10>e.getYear()%100?"0":"")+e.getYear()%100;break;case"@":u+=e.getTime();break;case"!":u+=1e4*e.getTime()+this._ticksTo1970;break;case"'":h("'")?u+="'":d=!0;break;default:u+=t.charAt(s)}return u},_possibleChars:function(t){var e,i="",s=!1,n=function(i){var s=t.length>e+1&&t.charAt(e+1)===i;return s&&e++,s};for(e=0;t.length>e;e++)if(s)"'"!==t.charAt(e)||n("'")?i+=t.charAt(e):s=!1;else switch(t.charAt(e)){case"d":case"m":case"y":case"@":i+="0123456789";break;case"D":case"M":return null;case"'":n("'")?i+="'":s=!0;break;default:i+=t.charAt(e)}return i},_get:function(t,i){return t.settings[i]!==e?t.settings[i]:this._defaults[i]},_setDateFromField:function(t,e){if(t.input.val()!==t.lastVal){var i=this._get(t,"dateFormat"),s=t.lastVal=t.input?t.input.val():null,n=this._getDefaultDate(t),a=n,r=this._getFormatConfig(t);try{a=this.parseDate(i,s,r)||n}catch(o){s=e?"":s}t.selectedDay=a.getDate(),t.drawMonth=t.selectedMonth=a.getMonth(),t.drawYear=t.selectedYear=a.getFullYear(),t.currentDay=s?a.getDate():0,t.currentMonth=s?a.getMonth():0,t.currentYear=s?a.getFullYear():0,this._adjustInstDate(t)}},_getDefaultDate:function(t){return this._restrictMinMax(t,this._determineDate(t,this._get(t,"defaultDate"),new Date))},_determineDate:function(e,i,s){var n=function(t){var e=new Date;return e.setDate(e.getDate()+t),e},a=function(i){try{return t.datepicker.parseDate(t.datepicker._get(e,"dateFormat"),i,t.datepicker._getFormatConfig(e))}catch(s){}for(var n=(i.toLowerCase().match(/^c/)?t.datepicker._getDate(e):null)||new Date,a=n.getFullYear(),r=n.getMonth(),o=n.getDate(),h=/([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,l=h.exec(i);l;){switch(l[2]||"d"){case"d":case"D":o+=parseInt(l[1],10);break;case"w":case"W":o+=7*parseInt(l[1],10);break;case"m":case"M":r+=parseInt(l[1],10),o=Math.min(o,t.datepicker._getDaysInMonth(a,r));break;case"y":case"Y":a+=parseInt(l[1],10),o=Math.min(o,t.datepicker._getDaysInMonth(a,r))}l=h.exec(i)}return new Date(a,r,o)},r=null==i||""===i?s:"string"==typeof i?a(i):"number"==typeof i?isNaN(i)?s:n(i):new Date(i.getTime());return r=r&&"Invalid Date"==""+r?s:r,r&&(r.setHours(0),r.setMinutes(0),r.setSeconds(0),r.setMilliseconds(0)),this._daylightSavingAdjust(r)},_daylightSavingAdjust:function(t){return t?(t.setHours(t.getHours()>12?t.getHours()+2:0),t):null},_setDate:function(t,e,i){var s=!e,n=t.selectedMonth,a=t.selectedYear,r=this._restrictMinMax(t,this._determineDate(t,e,new Date));t.selectedDay=t.currentDay=r.getDate(),t.drawMonth=t.selectedMonth=t.currentMonth=r.getMonth(),t.drawYear=t.selectedYear=t.currentYear=r.getFullYear(),n===t.selectedMonth&&a===t.selectedYear||i||this._notifyChange(t),this._adjustInstDate(t),t.input&&t.input.val(s?"":this._formatDate(t))},_getDate:function(t){var e=!t.currentYear||t.input&&""===t.input.val()?null:this._daylightSavingAdjust(new Date(t.currentYear,t.currentMonth,t.currentDay));return e},_attachHandlers:function(e){var i=this._get(e,"stepMonths"),s="#"+e.id.replace(/\\\\/g,"\\");e.dpDiv.find("[data-handler]").map(function(){var e={prev:function(){t.datepicker._adjustDate(s,-i,"M")},next:function(){t.datepicker._adjustDate(s,+i,"M")},hide:function(){t.datepicker._hideDatepicker()},today:function(){t.datepicker._gotoToday(s)},selectDay:function(){return t.datepicker._selectDay(s,+this.getAttribute("data-month"),+this.getAttribute("data-year"),this),!1},selectMonth:function(){return t.datepicker._selectMonthYear(s,this,"M"),!1},selectYear:function(){return t.datepicker._selectMonthYear(s,this,"Y"),!1}};t(this).bind(this.getAttribute("data-event"),e[this.getAttribute("data-handler")])})},_generateHTML:function(t){var e,i,s,n,a,r,o,h,l,c,u,d,p,f,m,g,v,_,b,y,x,k,w,D,T,C,M,S,N,I,P,A,z,H,E,F,O,W,j,R=new Date,L=this._daylightSavingAdjust(new Date(R.getFullYear(),R.getMonth(),R.getDate())),Y=this._get(t,"isRTL"),B=this._get(t,"showButtonPanel"),J=this._get(t,"hideIfNoPrevNext"),K=this._get(t,"navigationAsDateFormat"),Q=this._getNumberOfMonths(t),V=this._get(t,"showCurrentAtPos"),U=this._get(t,"stepMonths"),q=1!==Q[0]||1!==Q[1],X=this._daylightSavingAdjust(t.currentDay?new Date(t.currentYear,t.currentMonth,t.currentDay):new Date(9999,9,9)),G=this._getMinMaxDate(t,"min"),$=this._getMinMaxDate(t,"max"),Z=t.drawMonth-V,te=t.drawYear;if(0>Z&&(Z+=12,te--),$)for(e=this._daylightSavingAdjust(new Date($.getFullYear(),$.getMonth()-Q[0]*Q[1]+1,$.getDate())),e=G&&G>e?G:e;this._daylightSavingAdjust(new Date(te,Z,1))>e;)Z--,0>Z&&(Z=11,te--);for(t.drawMonth=Z,t.drawYear=te,i=this._get(t,"prevText"),i=K?this.formatDate(i,this._daylightSavingAdjust(new Date(te,Z-U,1)),this._getFormatConfig(t)):i,s=this._canAdjustMonth(t,-1,te,Z)?"<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click' title='"+i+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"e":"w")+"'>"+i+"</span></a>":J?"":"<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='"+i+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"e":"w")+"'>"+i+"</span></a>",n=this._get(t,"nextText"),n=K?this.formatDate(n,this._daylightSavingAdjust(new Date(te,Z+U,1)),this._getFormatConfig(t)):n,a=this._canAdjustMonth(t,1,te,Z)?"<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click' title='"+n+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"w":"e")+"'>"+n+"</span></a>":J?"":"<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='"+n+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"w":"e")+"'>"+n+"</span></a>",r=this._get(t,"currentText"),o=this._get(t,"gotoCurrent")&&t.currentDay?X:L,r=K?this.formatDate(r,o,this._getFormatConfig(t)):r,h=t.inline?"":"<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>"+this._get(t,"closeText")+"</button>",l=B?"<div class='ui-datepicker-buttonpane ui-widget-content'>"+(Y?h:"")+(this._isInRange(t,o)?"<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'>"+r+"</button>":"")+(Y?"":h)+"</div>":"",c=parseInt(this._get(t,"firstDay"),10),c=isNaN(c)?0:c,u=this._get(t,"showWeek"),d=this._get(t,"dayNames"),p=this._get(t,"dayNamesMin"),f=this._get(t,"monthNames"),m=this._get(t,"monthNamesShort"),g=this._get(t,"beforeShowDay"),v=this._get(t,"showOtherMonths"),_=this._get(t,"selectOtherMonths"),b=this._getDefaultDate(t),y="",k=0;Q[0]>k;k++){for(w="",this.maxRows=4,D=0;Q[1]>D;D++){if(T=this._daylightSavingAdjust(new Date(te,Z,t.selectedDay)),C=" ui-corner-all",M="",q){if(M+="<div class='ui-datepicker-group",Q[1]>1)switch(D){case 0:M+=" ui-datepicker-group-first",C=" ui-corner-"+(Y?"right":"left");break;case Q[1]-1:M+=" ui-datepicker-group-last",C=" ui-corner-"+(Y?"left":"right");break;default:M+=" ui-datepicker-group-middle",C=""}M+="'>"}for(M+="<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix"+C+"'>"+(/all|left/.test(C)&&0===k?Y?a:s:"")+(/all|right/.test(C)&&0===k?Y?s:a:"")+this._generateMonthYearHeader(t,Z,te,G,$,k>0||D>0,f,m)+"</div><table class='ui-datepicker-calendar'><thead>"+"<tr>",S=u?"<th class='ui-datepicker-week-col'>"+this._get(t,"weekHeader")+"</th>":"",x=0;7>x;x++)N=(x+c)%7,S+="<th"+((x+c+6)%7>=5?" class='ui-datepicker-week-end'":"")+">"+"<span title='"+d[N]+"'>"+p[N]+"</span></th>";for(M+=S+"</tr></thead><tbody>",I=this._getDaysInMonth(te,Z),te===t.selectedYear&&Z===t.selectedMonth&&(t.selectedDay=Math.min(t.selectedDay,I)),P=(this._getFirstDayOfMonth(te,Z)-c+7)%7,A=Math.ceil((P+I)/7),z=q?this.maxRows>A?this.maxRows:A:A,this.maxRows=z,H=this._daylightSavingAdjust(new Date(te,Z,1-P)),E=0;z>E;E++){for(M+="<tr>",F=u?"<td class='ui-datepicker-week-col'>"+this._get(t,"calculateWeek")(H)+"</td>":"",x=0;7>x;x++)O=g?g.apply(t.input?t.input[0]:null,[H]):[!0,""],W=H.getMonth()!==Z,j=W&&!_||!O[0]||G&&G>H||$&&H>$,F+="<td class='"+((x+c+6)%7>=5?" ui-datepicker-week-end":"")+(W?" ui-datepicker-other-month":"")+(H.getTime()===T.getTime()&&Z===t.selectedMonth&&t._keyEvent||b.getTime()===H.getTime()&&b.getTime()===T.getTime()?" "+this._dayOverClass:"")+(j?" "+this._unselectableClass+" ui-state-disabled":"")+(W&&!v?"":" "+O[1]+(H.getTime()===X.getTime()?" "+this._currentClass:"")+(H.getTime()===L.getTime()?" ui-datepicker-today":""))+"'"+(W&&!v||!O[2]?"":" title='"+O[2].replace(/'/g,"&#39;")+"'")+(j?"":" data-handler='selectDay' data-event='click' data-month='"+H.getMonth()+"' data-year='"+H.getFullYear()+"'")+">"+(W&&!v?"&#xa0;":j?"<span class='ui-state-default'>"+H.getDate()+"</span>":"<a class='ui-state-default"+(H.getTime()===L.getTime()?" ui-state-highlight":"")+(H.getTime()===X.getTime()?" ui-state-active":"")+(W?" ui-priority-secondary":"")+"' href='#'>"+H.getDate()+"</a>")+"</td>",H.setDate(H.getDate()+1),H=this._daylightSavingAdjust(H);M+=F+"</tr>"}Z++,Z>11&&(Z=0,te++),M+="</tbody></table>"+(q?"</div>"+(Q[0]>0&&D===Q[1]-1?"<div class='ui-datepicker-row-break'></div>":""):""),w+=M}y+=w}return y+=l,t._keyEvent=!1,y},_generateMonthYearHeader:function(t,e,i,s,n,a,r,o){var h,l,c,u,d,p,f,m,g=this._get(t,"changeMonth"),v=this._get(t,"changeYear"),_=this._get(t,"showMonthAfterYear"),b="<div class='ui-datepicker-title'>",y="";if(a||!g)y+="<span class='ui-datepicker-month'>"+r[e]+"</span>";else{for(h=s&&s.getFullYear()===i,l=n&&n.getFullYear()===i,y+="<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>",c=0;12>c;c++)(!h||c>=s.getMonth())&&(!l||n.getMonth()>=c)&&(y+="<option value='"+c+"'"+(c===e?" selected='selected'":"")+">"+o[c]+"</option>");y+="</select>"}if(_||(b+=y+(!a&&g&&v?"":"&#xa0;")),!t.yearshtml)if(t.yearshtml="",a||!v)b+="<span class='ui-datepicker-year'>"+i+"</span>";else{for(u=this._get(t,"yearRange").split(":"),d=(new Date).getFullYear(),p=function(t){var e=t.match(/c[+\-].*/)?i+parseInt(t.substring(1),10):t.match(/[+\-].*/)?d+parseInt(t,10):parseInt(t,10);
return isNaN(e)?d:e},f=p(u[0]),m=Math.max(f,p(u[1]||"")),f=s?Math.max(f,s.getFullYear()):f,m=n?Math.min(m,n.getFullYear()):m,t.yearshtml+="<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>";m>=f;f++)t.yearshtml+="<option value='"+f+"'"+(f===i?" selected='selected'":"")+">"+f+"</option>";t.yearshtml+="</select>",b+=t.yearshtml,t.yearshtml=null}return b+=this._get(t,"yearSuffix"),_&&(b+=(!a&&g&&v?"":"&#xa0;")+y),b+="</div>"},_adjustInstDate:function(t,e,i){var s=t.drawYear+("Y"===i?e:0),n=t.drawMonth+("M"===i?e:0),a=Math.min(t.selectedDay,this._getDaysInMonth(s,n))+("D"===i?e:0),r=this._restrictMinMax(t,this._daylightSavingAdjust(new Date(s,n,a)));t.selectedDay=r.getDate(),t.drawMonth=t.selectedMonth=r.getMonth(),t.drawYear=t.selectedYear=r.getFullYear(),("M"===i||"Y"===i)&&this._notifyChange(t)},_restrictMinMax:function(t,e){var i=this._getMinMaxDate(t,"min"),s=this._getMinMaxDate(t,"max"),n=i&&i>e?i:e;return s&&n>s?s:n},_notifyChange:function(t){var e=this._get(t,"onChangeMonthYear");e&&e.apply(t.input?t.input[0]:null,[t.selectedYear,t.selectedMonth+1,t])},_getNumberOfMonths:function(t){var e=this._get(t,"numberOfMonths");return null==e?[1,1]:"number"==typeof e?[1,e]:e},_getMinMaxDate:function(t,e){return this._determineDate(t,this._get(t,e+"Date"),null)},_getDaysInMonth:function(t,e){return 32-this._daylightSavingAdjust(new Date(t,e,32)).getDate()},_getFirstDayOfMonth:function(t,e){return new Date(t,e,1).getDay()},_canAdjustMonth:function(t,e,i,s){var n=this._getNumberOfMonths(t),a=this._daylightSavingAdjust(new Date(i,s+(0>e?e:n[0]*n[1]),1));return 0>e&&a.setDate(this._getDaysInMonth(a.getFullYear(),a.getMonth())),this._isInRange(t,a)},_isInRange:function(t,e){var i,s,n=this._getMinMaxDate(t,"min"),a=this._getMinMaxDate(t,"max"),r=null,o=null,h=this._get(t,"yearRange");return h&&(i=h.split(":"),s=(new Date).getFullYear(),r=parseInt(i[0],10),o=parseInt(i[1],10),i[0].match(/[+\-].*/)&&(r+=s),i[1].match(/[+\-].*/)&&(o+=s)),(!n||e.getTime()>=n.getTime())&&(!a||e.getTime()<=a.getTime())&&(!r||e.getFullYear()>=r)&&(!o||o>=e.getFullYear())},_getFormatConfig:function(t){var e=this._get(t,"shortYearCutoff");return e="string"!=typeof e?e:(new Date).getFullYear()%100+parseInt(e,10),{shortYearCutoff:e,dayNamesShort:this._get(t,"dayNamesShort"),dayNames:this._get(t,"dayNames"),monthNamesShort:this._get(t,"monthNamesShort"),monthNames:this._get(t,"monthNames")}},_formatDate:function(t,e,i,s){e||(t.currentDay=t.selectedDay,t.currentMonth=t.selectedMonth,t.currentYear=t.selectedYear);var n=e?"object"==typeof e?e:this._daylightSavingAdjust(new Date(s,i,e)):this._daylightSavingAdjust(new Date(t.currentYear,t.currentMonth,t.currentDay));return this.formatDate(this._get(t,"dateFormat"),n,this._getFormatConfig(t))}}),t.fn.datepicker=function(e){if(!this.length)return this;t.datepicker.initialized||(t(document).mousedown(t.datepicker._checkExternalClick),t.datepicker.initialized=!0),0===t("#"+t.datepicker._mainDivId).length&&t("body").append(t.datepicker.dpDiv);var i=Array.prototype.slice.call(arguments,1);return"string"!=typeof e||"isDisabled"!==e&&"getDate"!==e&&"widget"!==e?"option"===e&&2===arguments.length&&"string"==typeof arguments[1]?t.datepicker["_"+e+"Datepicker"].apply(t.datepicker,[this[0]].concat(i)):this.each(function(){"string"==typeof e?t.datepicker["_"+e+"Datepicker"].apply(t.datepicker,[this].concat(i)):t.datepicker._attachDatepicker(this,e)}):t.datepicker["_"+e+"Datepicker"].apply(t.datepicker,[this[0]].concat(i))},t.datepicker=new i,t.datepicker.initialized=!1,t.datepicker.uuid=(new Date).getTime(),t.datepicker.version="1.10.3"})(jQuery);(function(t){t.widget("ui.menu",{version:"1.10.3",defaultElement:"<ul>",delay:300,options:{icons:{submenu:"ui-icon-carat-1-e"},menus:"ul",position:{my:"left top",at:"right top"},role:"menu",blur:null,focus:null,select:null},_create:function(){this.activeMenu=this.element,this.mouseHandled=!1,this.element.uniqueId().addClass("ui-menu ui-widget ui-widget-content ui-corner-all").toggleClass("ui-menu-icons",!!this.element.find(".ui-icon").length).attr({role:this.options.role,tabIndex:0}).bind("click"+this.eventNamespace,t.proxy(function(t){this.options.disabled&&t.preventDefault()},this)),this.options.disabled&&this.element.addClass("ui-state-disabled").attr("aria-disabled","true"),this._on({"mousedown .ui-menu-item > a":function(t){t.preventDefault()},"click .ui-state-disabled > a":function(t){t.preventDefault()},"click .ui-menu-item:has(a)":function(e){var i=t(e.target).closest(".ui-menu-item");!this.mouseHandled&&i.not(".ui-state-disabled").length&&(this.mouseHandled=!0,this.select(e),i.has(".ui-menu").length?this.expand(e):this.element.is(":focus")||(this.element.trigger("focus",[!0]),this.active&&1===this.active.parents(".ui-menu").length&&clearTimeout(this.timer)))},"mouseenter .ui-menu-item":function(e){var i=t(e.currentTarget);i.siblings().children(".ui-state-active").removeClass("ui-state-active"),this.focus(e,i)},mouseleave:"collapseAll","mouseleave .ui-menu":"collapseAll",focus:function(t,e){var i=this.active||this.element.children(".ui-menu-item").eq(0);e||this.focus(t,i)},blur:function(e){this._delay(function(){t.contains(this.element[0],this.document[0].activeElement)||this.collapseAll(e)})},keydown:"_keydown"}),this.refresh(),this._on(this.document,{click:function(e){t(e.target).closest(".ui-menu").length||this.collapseAll(e),this.mouseHandled=!1}})},_destroy:function(){this.element.removeAttr("aria-activedescendant").find(".ui-menu").addBack().removeClass("ui-menu ui-widget ui-widget-content ui-corner-all ui-menu-icons").removeAttr("role").removeAttr("tabIndex").removeAttr("aria-labelledby").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-disabled").removeUniqueId().show(),this.element.find(".ui-menu-item").removeClass("ui-menu-item").removeAttr("role").removeAttr("aria-disabled").children("a").removeUniqueId().removeClass("ui-corner-all ui-state-hover").removeAttr("tabIndex").removeAttr("role").removeAttr("aria-haspopup").children().each(function(){var e=t(this);e.data("ui-menu-submenu-carat")&&e.remove()}),this.element.find(".ui-menu-divider").removeClass("ui-menu-divider ui-widget-content")},_keydown:function(e){function i(t){return t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}var s,n,a,o,r,h=!0;switch(e.keyCode){case t.ui.keyCode.PAGE_UP:this.previousPage(e);break;case t.ui.keyCode.PAGE_DOWN:this.nextPage(e);break;case t.ui.keyCode.HOME:this._move("first","first",e);break;case t.ui.keyCode.END:this._move("last","last",e);break;case t.ui.keyCode.UP:this.previous(e);break;case t.ui.keyCode.DOWN:this.next(e);break;case t.ui.keyCode.LEFT:this.collapse(e);break;case t.ui.keyCode.RIGHT:this.active&&!this.active.is(".ui-state-disabled")&&this.expand(e);break;case t.ui.keyCode.ENTER:case t.ui.keyCode.SPACE:this._activate(e);break;case t.ui.keyCode.ESCAPE:this.collapse(e);break;default:h=!1,n=this.previousFilter||"",a=String.fromCharCode(e.keyCode),o=!1,clearTimeout(this.filterTimer),a===n?o=!0:a=n+a,r=RegExp("^"+i(a),"i"),s=this.activeMenu.children(".ui-menu-item").filter(function(){return r.test(t(this).children("a").text())}),s=o&&-1!==s.index(this.active.next())?this.active.nextAll(".ui-menu-item"):s,s.length||(a=String.fromCharCode(e.keyCode),r=RegExp("^"+i(a),"i"),s=this.activeMenu.children(".ui-menu-item").filter(function(){return r.test(t(this).children("a").text())})),s.length?(this.focus(e,s),s.length>1?(this.previousFilter=a,this.filterTimer=this._delay(function(){delete this.previousFilter},1e3)):delete this.previousFilter):delete this.previousFilter}h&&e.preventDefault()},_activate:function(t){this.active.is(".ui-state-disabled")||(this.active.children("a[aria-haspopup='true']").length?this.expand(t):this.select(t))},refresh:function(){var e,i=this.options.icons.submenu,s=this.element.find(this.options.menus);s.filter(":not(.ui-menu)").addClass("ui-menu ui-widget ui-widget-content ui-corner-all").hide().attr({role:this.options.role,"aria-hidden":"true","aria-expanded":"false"}).each(function(){var e=t(this),s=e.prev("a"),n=t("<span>").addClass("ui-menu-icon ui-icon "+i).data("ui-menu-submenu-carat",!0);s.attr("aria-haspopup","true").prepend(n),e.attr("aria-labelledby",s.attr("id"))}),e=s.add(this.element),e.children(":not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role","presentation").children("a").uniqueId().addClass("ui-corner-all").attr({tabIndex:-1,role:this._itemRole()}),e.children(":not(.ui-menu-item)").each(function(){var e=t(this);/[^\-\u2014\u2013\s]/.test(e.text())||e.addClass("ui-widget-content ui-menu-divider")}),e.children(".ui-state-disabled").attr("aria-disabled","true"),this.active&&!t.contains(this.element[0],this.active[0])&&this.blur()},_itemRole:function(){return{menu:"menuitem",listbox:"option"}[this.options.role]},_setOption:function(t,e){"icons"===t&&this.element.find(".ui-menu-icon").removeClass(this.options.icons.submenu).addClass(e.submenu),this._super(t,e)},focus:function(t,e){var i,s;this.blur(t,t&&"focus"===t.type),this._scrollIntoView(e),this.active=e.first(),s=this.active.children("a").addClass("ui-state-focus"),this.options.role&&this.element.attr("aria-activedescendant",s.attr("id")),this.active.parent().closest(".ui-menu-item").children("a:first").addClass("ui-state-active"),t&&"keydown"===t.type?this._close():this.timer=this._delay(function(){this._close()},this.delay),i=e.children(".ui-menu"),i.length&&/^mouse/.test(t.type)&&this._startOpening(i),this.activeMenu=e.parent(),this._trigger("focus",t,{item:e})},_scrollIntoView:function(e){var i,s,n,a,o,r;this._hasScroll()&&(i=parseFloat(t.css(this.activeMenu[0],"borderTopWidth"))||0,s=parseFloat(t.css(this.activeMenu[0],"paddingTop"))||0,n=e.offset().top-this.activeMenu.offset().top-i-s,a=this.activeMenu.scrollTop(),o=this.activeMenu.height(),r=e.height(),0>n?this.activeMenu.scrollTop(a+n):n+r>o&&this.activeMenu.scrollTop(a+n-o+r))},blur:function(t,e){e||clearTimeout(this.timer),this.active&&(this.active.children("a").removeClass("ui-state-focus"),this.active=null,this._trigger("blur",t,{item:this.active}))},_startOpening:function(t){clearTimeout(this.timer),"true"===t.attr("aria-hidden")&&(this.timer=this._delay(function(){this._close(),this._open(t)},this.delay))},_open:function(e){var i=t.extend({of:this.active},this.options.position);clearTimeout(this.timer),this.element.find(".ui-menu").not(e.parents(".ui-menu")).hide().attr("aria-hidden","true"),e.show().removeAttr("aria-hidden").attr("aria-expanded","true").position(i)},collapseAll:function(e,i){clearTimeout(this.timer),this.timer=this._delay(function(){var s=i?this.element:t(e&&e.target).closest(this.element.find(".ui-menu"));s.length||(s=this.element),this._close(s),this.blur(e),this.activeMenu=s},this.delay)},_close:function(t){t||(t=this.active?this.active.parent():this.element),t.find(".ui-menu").hide().attr("aria-hidden","true").attr("aria-expanded","false").end().find("a.ui-state-active").removeClass("ui-state-active")},collapse:function(t){var e=this.active&&this.active.parent().closest(".ui-menu-item",this.element);e&&e.length&&(this._close(),this.focus(t,e))},expand:function(t){var e=this.active&&this.active.children(".ui-menu ").children(".ui-menu-item").first();e&&e.length&&(this._open(e.parent()),this._delay(function(){this.focus(t,e)}))},next:function(t){this._move("next","first",t)},previous:function(t){this._move("prev","last",t)},isFirstItem:function(){return this.active&&!this.active.prevAll(".ui-menu-item").length},isLastItem:function(){return this.active&&!this.active.nextAll(".ui-menu-item").length},_move:function(t,e,i){var s;this.active&&(s="first"===t||"last"===t?this.active["first"===t?"prevAll":"nextAll"](".ui-menu-item").eq(-1):this.active[t+"All"](".ui-menu-item").eq(0)),s&&s.length&&this.active||(s=this.activeMenu.children(".ui-menu-item")[e]()),this.focus(i,s)},nextPage:function(e){var i,s,n;return this.active?(this.isLastItem()||(this._hasScroll()?(s=this.active.offset().top,n=this.element.height(),this.active.nextAll(".ui-menu-item").each(function(){return i=t(this),0>i.offset().top-s-n}),this.focus(e,i)):this.focus(e,this.activeMenu.children(".ui-menu-item")[this.active?"last":"first"]())),undefined):(this.next(e),undefined)},previousPage:function(e){var i,s,n;return this.active?(this.isFirstItem()||(this._hasScroll()?(s=this.active.offset().top,n=this.element.height(),this.active.prevAll(".ui-menu-item").each(function(){return i=t(this),i.offset().top-s+n>0}),this.focus(e,i)):this.focus(e,this.activeMenu.children(".ui-menu-item").first())),undefined):(this.next(e),undefined)},_hasScroll:function(){return this.element.outerHeight()<this.element.prop("scrollHeight")},select:function(e){this.active=this.active||t(e.target).closest(".ui-menu-item");var i={item:this.active};this.active.has(".ui-menu").length||this.collapseAll(e,!0),this._trigger("select",e,i)}})})(jQuery);
/*
 * jQuery UI Widget 1.10.3+amd
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/jQuery.widget/
 */

(function( factory )
{
	if( typeof define === "function" && define.amd )
	{
		// Register as an anonymous AMD module:
		define(["jquery"], factory);
	} else
	{
		// Browser globals:
		factory(jQuery);
	}
}(function( $, undefined )
{

	var uuid = 0,
		slice = Array.prototype.slice,
		_cleanData = $.cleanData;
	$.cleanData = function( elems )
	{
		for( var i = 0, elem; (elem = elems[i]) != null; i ++ )
		{
			try
			{
				$(elem).triggerHandler("remove");
				// http://bugs.jquery.com/ticket/8235
			} catch( e )
			{}
		}
		_cleanData(elems);
	};

	$.widget = function( name, base, prototype )
	{
		var fullName, existingConstructor, constructor, basePrototype,
		// proxiedPrototype allows the provided prototype to remain unmodified
		// so that it can be used as a mixin for multiple widgets (#8876)
			proxiedPrototype = {},
			namespace = name.split(".")[ 0 ];

		name = name.split(".")[ 1 ];
		fullName = namespace + "-" + name;

		if( ! prototype )
		{
			prototype = base;
			base = $.Widget;
		}

		// create selector for plugin
		$.expr[ ":" ][ fullName.toLowerCase() ] = function( elem )
		{
			return ! ! $.data(elem, fullName);
		};

		$[ namespace ] = $[ namespace ] || {};
		existingConstructor = $[ namespace ][ name ];
		constructor = $[ namespace ][ name ] = function( options, element )
		{
			// allow instantiation without "new" keyword
			if( ! this._createWidget )
			{
				return new constructor(options, element);
			}

			// allow instantiation without initializing for simple inheritance
			// must use "new" keyword (the code above always passes args)
			if( arguments.length )
			{
				this._createWidget(options, element);
			}
		};
		// extend with the existing constructor to carry over any static properties
		$.extend(constructor, existingConstructor, {
			version:            prototype.version,
			// copy the object used to create the prototype in case we need to
			// redefine the widget later
			_proto:             $.extend({}, prototype),
			// track widgets that inherit from this widget in case this widget is
			// redefined after a widget inherits from it
			_childConstructors: []
		});

		basePrototype = new base();
		// we need to make the options hash a property directly on the new instance
		// otherwise we'll modify the options hash on the prototype that we're
		// inheriting from
		basePrototype.options = $.widget.extend({}, basePrototype.options);
		$.each(prototype, function( prop, value )
		{
			if( ! $.isFunction(value) )
			{
				proxiedPrototype[ prop ] = value;
				return;
			}
			proxiedPrototype[ prop ] = (function()
			{
				var _super = function()
					{
						return base.prototype[ prop ].apply(this, arguments);
					},
					_superApply = function( args )
					{
						return base.prototype[ prop ].apply(this, args);
					};
				return function()
				{
					var __super = this._super,
						__superApply = this._superApply,
						returnValue;

					this._super = _super;
					this._superApply = _superApply;

					returnValue = value.apply(this, arguments);

					this._super = __super;
					this._superApply = __superApply;

					return returnValue;
				};
			})();
		});
		constructor.prototype = $.widget.extend(basePrototype, {
			// TODO: remove support for widgetEventPrefix
			// always use the name + a colon as the prefix, e.g., draggable:start
			// don't prefix for widgets that aren't DOM-based
			widgetEventPrefix: existingConstructor ? basePrototype.widgetEventPrefix : name
		}, proxiedPrototype, {
			constructor:    constructor,
			namespace:      namespace,
			widgetName:     name,
			widgetFullName: fullName
		});

		// If this widget is being redefined then we need to find all widgets that
		// are inheriting from it and redefine all of them so that they inherit from
		// the new version of this widget. We're essentially trying to replace one
		// level in the prototype chain.
		if( existingConstructor )
		{
			$.each(existingConstructor._childConstructors, function( i, child )
			{
				var childPrototype = child.prototype;

				// redefine the child widget using the same prototype that was
				// originally used, but inherit from the new version of the base
				$.widget(childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto);
			});
			// remove the list of existing child constructors from the old constructor
			// so the old child constructors can be garbage collected
			delete existingConstructor._childConstructors;
		} else
		{
			base._childConstructors.push(constructor);
		}

		$.widget.bridge(name, constructor);
	};

	$.widget.extend = function( target )
	{
		var input = slice.call(arguments, 1),
			inputIndex = 0,
			inputLength = input.length,
			key,
			value;
		for( ; inputIndex < inputLength; inputIndex ++ )
		{
			for( key in input[ inputIndex ] )
			{
				value = input[ inputIndex ][ key ];
				if( input[ inputIndex ].hasOwnProperty(key) && value !== undefined )
				{
					// Clone objects
					if( $.isPlainObject(value) )
					{
						target[ key ] = $.isPlainObject(target[ key ]) ?
							$.widget.extend({}, target[ key ], value) :
							// Don't extend strings, arrays, etc. with objects
							$.widget.extend({}, value);
						// Copy everything else by reference
					} else
					{
						target[ key ] = value;
					}
				}
			}
		}
		return target;
	};

	$.widget.bridge = function( name, object )
	{
		var fullName = object.prototype.widgetFullName || name;
		$.fn[ name ] = function( options )
		{
			var isMethodCall = typeof options === "string",
				args = slice.call(arguments, 1),
				returnValue = this;

			// allow multiple hashes to be passed on init
			options = ! isMethodCall && args.length ?
				$.widget.extend.apply(null, [ options ].concat(args)) :
				options;

			if( isMethodCall )
			{
				this.each(function()
				{
					var methodValue,
						instance = $.data(this, fullName);
					if( ! instance )
					{
						return $.error("cannot call methods on " + name + " prior to initialization; " +
							"attempted to call method '" + options + "'");
					}
					if( ! $.isFunction(instance[options]) || options.charAt(0) === "_" )
					{
						return $.error("no such method '" + options + "' for " + name + " widget instance");
					}
					methodValue = instance[ options ].apply(instance, args);
					if( methodValue !== instance && methodValue !== undefined )
					{
						returnValue = methodValue && methodValue.jquery ?
							returnValue.pushStack(methodValue.get()) :
							methodValue;
						return false;
					}
				});
			} else
			{
				this.each(function()
				{
					var instance = $.data(this, fullName);
					if( instance )
					{
						instance.option(options || {})._init();
					} else
					{
						$.data(this, fullName, new object(options, this));
					}
				});
			}

			return returnValue;
		};
	};

	$.Widget = function( /* options, element */ )
	{
	};
	$.Widget._childConstructors = [];

	$.Widget.prototype = {
		widgetName:          "widget",
		widgetEventPrefix:   "",
		defaultElement:      "<div>",
		options:             {
			disabled: false,

			// callbacks
			create:   null
		},
		_createWidget:       function( options, element )
		{
			element = $(element || this.defaultElement || this)[ 0 ];
			this.element = $(element);
			this.uuid = uuid ++;
			this.eventNamespace = "." + this.widgetName + this.uuid;
			this.options = $.widget.extend({},
				this.options,
				this._getCreateOptions(),
				options);

			this.bindings = $();
			this.hoverable = $();
			this.focusable = $();

			if( element !== this )
			{
				$.data(element, this.widgetFullName, this);
				this._on(true, this.element, {
					remove: function( event )
					{
						if( event.target === element )
						{
							this.destroy();
						}
					}
				});
				this.document = $(element.style ?
					// element within the document
					element.ownerDocument :
					// element is window or document
					element.document || element);
				this.window = $(this.document[0].defaultView || this.document[0].parentWindow);
			}

			this._create();
			this._trigger("create", null, this._getCreateEventData());
			this._init();
		},
		_getCreateOptions:   $.noop,
		_getCreateEventData: $.noop,
		_create:             $.noop,
		_init:               $.noop,

		destroy:  function()
		{
			this._destroy();
			// we can probably remove the unbind calls in 2.0
			// all event bindings should go through this._on()
			this.element
				.unbind(this.eventNamespace)
				// 1.9 BC for #7810
				// TODO remove dual storage
				.removeData(this.widgetName)
				.removeData(this.widgetFullName)
				// support: jquery <1.6.3
				// http://bugs.jquery.com/ticket/9413
				.removeData($.camelCase(this.widgetFullName));
			this.widget()
				.unbind(this.eventNamespace)
				.removeAttr("aria-disabled")
				.removeClass(
				this.widgetFullName + "-disabled " +
					"ui-state-disabled");

			// clean up events and states
			this.bindings.unbind(this.eventNamespace);
			this.hoverable.removeClass("ui-state-hover");
			this.focusable.removeClass("ui-state-focus");
		},
		_destroy: $.noop,

		widget: function()
		{
			return this.element;
		},

		option:      function( key, value )
		{
			var options = key,
				parts,
				curOption,
				i;

			if( arguments.length === 0 )
			{
				// don't return a reference to the internal hash
				return $.widget.extend({}, this.options);
			}

			if( typeof key === "string" )
			{
				// handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
				options = {};
				parts = key.split(".");
				key = parts.shift();
				if( parts.length )
				{
					curOption = options[ key ] = $.widget.extend({}, this.options[ key ]);
					for( i = 0; i < parts.length - 1; i ++ )
					{
						curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
						curOption = curOption[ parts[ i ] ];
					}
					key = parts.pop();
					if( value === undefined )
					{
						return curOption[ key ] === undefined ? null : curOption[ key ];
					}
					curOption[ key ] = value;
				} else
				{
					if( value === undefined )
					{
						return this.options[ key ] === undefined ? null : this.options[ key ];
					}
					options[ key ] = value;
				}
			}

			this._setOptions(options);

			return this;
		},
		_setOptions: function( options )
		{
			var key;

			for( key in options )
			{
				this._setOption(key, options[ key ]);
			}

			return this;
		},
		_setOption:  function( key, value )
		{
			this.options[ key ] = value;

			if( key === "disabled" )
			{
				this.widget()
					.toggleClass(this.widgetFullName + "-disabled ui-state-disabled", ! ! value)
					.attr("aria-disabled", value);
				this.hoverable.removeClass("ui-state-hover");
				this.focusable.removeClass("ui-state-focus");
			}

			return this;
		},

		enable:  function()
		{
			return this._setOption("disabled", false);
		},
		disable: function()
		{
			return this._setOption("disabled", true);
		},

		_on: function( suppressDisabledCheck, element, handlers )
		{
			var delegateElement,
				instance = this;

			// no suppressDisabledCheck flag, shuffle arguments
			if( typeof suppressDisabledCheck !== "boolean" )
			{
				handlers = element;
				element = suppressDisabledCheck;
				suppressDisabledCheck = false;
			}

			// no element argument, shuffle and use this.element
			if( ! handlers )
			{
				handlers = element;
				element = this.element;
				delegateElement = this.widget();
			} else
			{
				// accept selectors, DOM elements
				element = delegateElement = $(element);
				this.bindings = this.bindings.add(element);
			}

			$.each(handlers, function( event, handler )
			{
				function handlerProxy()
				{
					// allow widgets to customize the disabled handling
					// - disabled as an array instead of boolean
					// - disabled class as method for disabling individual parts
					if( ! suppressDisabledCheck &&
						( instance.options.disabled === true ||
							$(this).hasClass("ui-state-disabled") ) )
					{
						return;
					}
					return ( typeof handler === "string" ? instance[ handler ] : handler )
						.apply(instance, arguments);
				}

				// copy the guid so direct unbinding works
				if( typeof handler !== "string" )
				{
					handlerProxy.guid = handler.guid =
						handler.guid || handlerProxy.guid || $.guid ++;
				}

				var match = event.match(/^(\w+)\s*(.*)$/),
					eventName = match[1] + instance.eventNamespace,
					selector = match[2];
				if( selector )
				{
					delegateElement.delegate(selector, eventName, handlerProxy);
				} else
				{
					element.bind(eventName, handlerProxy);
				}
			});
		},

		_off: function( element, eventName )
		{
			eventName = (eventName || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace;
			element.unbind(eventName).undelegate(eventName);
		},

		_delay: function( handler, delay )
		{
			function handlerProxy()
			{
				return ( typeof handler === "string" ? instance[ handler ] : handler )
					.apply(instance, arguments);
			}

			var instance = this;
			return setTimeout(handlerProxy, delay || 0);
		},

		_hoverable: function( element )
		{
			this.hoverable = this.hoverable.add(element);
			this._on(element, {
				mouseenter: function( event )
				{
					$(event.currentTarget).addClass("ui-state-hover");
				},
				mouseleave: function( event )
				{
					$(event.currentTarget).removeClass("ui-state-hover");
				}
			});
		},

		_focusable: function( element )
		{
			this.focusable = this.focusable.add(element);
			this._on(element, {
				focusin:  function( event )
				{
					$(event.currentTarget).addClass("ui-state-focus");
				},
				focusout: function( event )
				{
					$(event.currentTarget).removeClass("ui-state-focus");
				}
			});
		},

		_trigger: function( type, event, data )
		{
			var prop, orig,
				callback = this.options[ type ];

			data = data || {};
			event = $.Event(event);
			event.type = ( type === this.widgetEventPrefix ?
				type :
				this.widgetEventPrefix + type ).toLowerCase();
			// the original event may come from any element
			// so we need to reset the target on the new event
			event.target = this.element[ 0 ];

			// copy original event properties over to the new event
			orig = event.originalEvent;
			if( orig )
			{
				for( prop in orig )
				{
					if( ! ( prop in event ) )
					{
						event[ prop ] = orig[ prop ];
					}
				}
			}

			this.element.trigger(event, data);
			return ! ( $.isFunction(callback) &&
				callback.apply(this.element[0], [ event ].concat(data)) === false ||
				event.isDefaultPrevented() );
		}
	};

	$.each({ show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect )
	{
		$.Widget.prototype[ "_" + method ] = function( element, options, callback )
		{
			if( typeof options === "string" )
			{
				options = { effect: options };
			}
			var hasOptions,
				effectName = ! options ?
					method :
					options === true || typeof options === "number" ?
						defaultEffect :
						options.effect || defaultEffect;
			options = options || {};
			if( typeof options === "number" )
			{
				options = { duration: options };
			}
			hasOptions = ! $.isEmptyObject(options);
			options.complete = callback;
			if( options.delay )
			{
				element.delay(options.delay);
			}
			if( hasOptions && $.effects && $.effects.effect[ effectName ] )
			{
				element[ method ](options);
			} else if( effectName !== method && element[ effectName ] )
			{
				element[ effectName ](options.duration, options.easing, callback);
			} else
			{
				element.queue(function( next )
				{
					$(this)[ method ]();
					if( callback )
					{
						callback.call(element[ 0 ]);
					}
					next();
				});
			}
		};
	});

}));

/*
 * jQuery File Upload Plugin 5.32.2
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*jslint nomen: true, unparam: true, regexp: true */
/*global define, window, document, location, File, Blob, FormData */

(function( factory )
{
	'use strict';
	if( typeof define === 'function' && define.amd )
	{
		// Register as an anonymous AMD module:
		define([
			'jquery',
			'jquery.ui.widget'
		], factory);
	} else
	{
		// Browser globals:
		factory(window.jQuery);
	}
}(function( $ )
{
	'use strict';

	// Detect file input support, based on
	// http://viljamis.com/blog/2012/file-upload-support-on-mobile/
	$.support.fileInput = ! (new RegExp(
		// Handle devices which give false positives for the feature detection:
		'(Android (1\\.[0156]|2\\.[01]))' +
			'|(Windows Phone (OS 7|8\\.0))|(XBLWP)|(ZuneWP)|(WPDesktop)' +
			'|(w(eb)?OSBrowser)|(webOS)' +
			'|(Kindle/(1\\.0|2\\.[05]|3\\.0))'
	).test(window.navigator.userAgent) ||
		// Feature detection for all other devices:
		$('<input type="file">').prop('disabled'));

	// The FileReader API is not actually used, but works as feature detection,
	// as e.g. Safari supports XHR file uploads via the FormData API,
	// but not non-multipart XHR file uploads:
	$.support.xhrFileUpload = ! ! (window.XMLHttpRequestUpload && window.FileReader);
	$.support.xhrFormDataFileUpload = ! ! window.FormData;

	// Detect support for Blob slicing (required for chunked uploads):
	$.support.blobSlice = window.Blob && (Blob.prototype.slice ||
		Blob.prototype.webkitSlice || Blob.prototype.mozSlice);

	// The fileupload widget listens for change events on file input fields defined
	// via fileInput setting and paste or drop events of the given dropZone.
	// In addition to the default jQuery Widget methods, the fileupload widget
	// exposes the "add" and "send" methods, to add or directly send files using
	// the fileupload API.
	// By default, files added via file input selection, paste, drag & drop or
	// "add" method are uploaded immediately, but it is possible to override
	// the "add" callback option to queue file uploads.
	$.widget('blueimp.fileupload', {

		options:         {
			// The drop target element(s), by the default the complete document.
			// Set to null to disable drag & drop support:
			dropZone:               $(document),
			// The paste target element(s), by the default the complete document.
			// Set to null to disable paste support:
			pasteZone:              $(document),
			// The file input field(s), that are listened to for change events.
			// If undefined, it is set to the file input fields inside
			// of the widget element on plugin initialization.
			// Set to null to disable the change listener.
			fileInput:              undefined,
			// By default, the file input field is replaced with a clone after
			// each input field change event. This is required for iframe transport
			// queues and allows change events to be fired for the same file
			// selection, but can be disabled by setting the following option to false:
			replaceFileInput:       true,
			// The parameter name for the file form data (the request argument name).
			// If undefined or empty, the name property of the file input field is
			// used, or "files[]" if the file input name property is also empty,
			// can be a string or an array of strings:
			paramName:              undefined,
			// By default, each file of a selection is uploaded using an individual
			// request for XHR type uploads. Set to false to upload file
			// selections in one request each:
			singleFileUploads:      true,
			// To limit the number of files uploaded with one XHR request,
			// set the following option to an integer greater than 0:
			limitMultiFileUploads:  undefined,
			// Set the following option to true to issue all file upload requests
			// in a sequential order:
			sequentialUploads:      false,
			// To limit the number of concurrent uploads,
			// set the following option to an integer greater than 0:
			limitConcurrentUploads: undefined,
			// Set the following option to true to force iframe transport uploads:
			forceIframeTransport:   false,
			// Set the following option to the location of a redirect url on the
			// origin server, for cross-domain iframe transport uploads:
			redirect:               undefined,
			// The parameter name for the redirect url, sent as part of the form
			// data and set to 'redirect' if this option is empty:
			redirectParamName:      undefined,
			// Set the following option to the location of a postMessage window,
			// to enable postMessage transport uploads:
			postMessage:            undefined,
			// By default, XHR file uploads are sent as multipart/form-data.
			// The iframe transport is always using multipart/form-data.
			// Set to false to enable non-multipart XHR uploads:
			multipart:              true,
			// To upload large files in smaller chunks, set the following option
			// to a preferred maximum chunk size. If set to 0, null or undefined,
			// or the browser does not support the required Blob API, files will
			// be uploaded as a whole.
			maxChunkSize:           undefined,
			// When a non-multipart upload or a chunked multipart upload has been
			// aborted, this option can be used to resume the upload by setting
			// it to the size of the already uploaded bytes. This option is most
			// useful when modifying the options object inside of the "add" or
			// "send" callbacks, as the options are cloned for each file upload.
			uploadedBytes:          undefined,
			// By default, failed (abort or error) file uploads are removed from the
			// global progress calculation. Set the following option to false to
			// prevent recalculating the global progress data:
			recalculateProgress:    true,
			// Interval in milliseconds to calculate and trigger progress events:
			progressInterval:       100,
			// Interval in milliseconds to calculate progress bitrate:
			bitrateInterval:        500,
			// By default, uploads are started automatically when adding files:
			autoUpload:             true,

			// Error and info messages:
			messages:               {
				uploadedBytes: 'Uploaded bytes exceed file size'
			},

			// Translation function, gets the message key to be translated
			// and an object with context specific data as arguments:
			i18n:                   function( message, context )
			{
				message = this.messages[message] || message.toString();
				if( context )
				{
					$.each(context, function( key, value )
					{
						message = message.replace('{' + key + '}', value);
					});
				}
				return message;
			},

			// Additional form data to be sent along with the file uploads can be set
			// using this option, which accepts an array of objects with name and
			// value properties, a function returning such an array, a FormData
			// object (for XHR file uploads), or a simple object.
			// The form of the first fileInput is given as parameter to the function:
			formData:               function( form )
			{
				return form.serializeArray();
			},

			// The add callback is invoked as soon as files are added to the fileupload
			// widget (via file input selection, drag & drop, paste or add API call).
			// If the singleFileUploads option is enabled, this callback will be
			// called once for each file in the selection for XHR file uploads, else
			// once for each file selection.
			//
			// The upload starts when the submit method is invoked on the data parameter.
			// The data object contains a files property holding the added files
			// and allows you to override plugin options as well as define ajax settings.
			//
			// Listeners for this callback can also be bound the following way:
			// .bind('fileuploadadd', func);
			//
			// data.submit() returns a Promise object and allows to attach additional
			// handlers using jQuery's Deferred callbacks:
			// data.submit().done(func).fail(func).always(func);
			add:                    function( e, data )
			{
				if( data.autoUpload || (data.autoUpload !== false &&
					$(this).fileupload('option', 'autoUpload')) )
				{
					data.process().done(function()
					{
						data.submit();
					});
				}
			},

			// Other callbacks:

			// Callback for the submit event of each file upload:
			// submit: function (e, data) {}, // .bind('fileuploadsubmit', func);

			// Callback for the start of each file upload request:
			// send: function (e, data) {}, // .bind('fileuploadsend', func);

			// Callback for successful uploads:
			// done: function (e, data) {}, // .bind('fileuploaddone', func);

			// Callback for failed (abort or error) uploads:
			// fail: function (e, data) {}, // .bind('fileuploadfail', func);

			// Callback for completed (success, abort or error) requests:
			// always: function (e, data) {}, // .bind('fileuploadalways', func);

			// Callback for upload progress events:
			// progress: function (e, data) {}, // .bind('fileuploadprogress', func);

			// Callback for global upload progress events:
			// progressall: function (e, data) {}, // .bind('fileuploadprogressall', func);

			// Callback for uploads start, equivalent to the global ajaxStart event:
			// start: function (e) {}, // .bind('fileuploadstart', func);

			// Callback for uploads stop, equivalent to the global ajaxStop event:
			// stop: function (e) {}, // .bind('fileuploadstop', func);

			// Callback for change events of the fileInput(s):
			// change: function (e, data) {}, // .bind('fileuploadchange', func);

			// Callback for paste events to the pasteZone(s):
			// paste: function (e, data) {}, // .bind('fileuploadpaste', func);

			// Callback for drop events of the dropZone(s):
			// drop: function (e, data) {}, // .bind('fileuploaddrop', func);

			// Callback for dragover events of the dropZone(s):
			// dragover: function (e) {}, // .bind('fileuploaddragover', func);

			// Callback for the start of each chunk upload request:
			// chunksend: function (e, data) {}, // .bind('fileuploadchunksend', func);

			// Callback for successful chunk uploads:
			// chunkdone: function (e, data) {}, // .bind('fileuploadchunkdone', func);

			// Callback for failed (abort or error) chunk uploads:
			// chunkfail: function (e, data) {}, // .bind('fileuploadchunkfail', func);

			// Callback for completed (success, abort or error) chunk upload requests:
			// chunkalways: function (e, data) {}, // .bind('fileuploadchunkalways', func);

			// The plugin options are used as settings object for the ajax calls.
			// The following are jQuery ajax settings required for the file uploads:
			processData:            false,
			contentType:            false,
			cache:                  false
		},

		// A list of options that require reinitializing event listeners and/or
		// special initialization code:
		_specialOptions: [
			'fileInput',
			'dropZone',
			'pasteZone',
			'multipart',
			'forceIframeTransport'
		],

		_blobSlice: $.support.blobSlice && function()
		{
			var slice = this.slice || this.webkitSlice || this.mozSlice;
			return slice.apply(this, arguments);
		},

		_BitrateTimer: function()
		{
			this.timestamp = ((Date.now) ? Date.now() : (new Date()).getTime());
			this.loaded = 0;
			this.bitrate = 0;
			this.getBitrate = function( now, loaded, interval )
			{
				var timeDiff = now - this.timestamp;
				if( ! this.bitrate || ! interval || timeDiff > interval )
				{
					this.bitrate = (loaded - this.loaded) * (1000 / timeDiff) * 8;
					this.loaded = loaded;
					this.timestamp = now;
				}
				return this.bitrate;
			};
		},

		_isXHRUpload: function( options )
		{
			return ! options.forceIframeTransport &&
				((! options.multipart && $.support.xhrFileUpload) ||
					$.support.xhrFormDataFileUpload);
		},

		_getFormData: function( options )
		{
			var formData;
			if( typeof options.formData === 'function' )
			{
				return options.formData(options.form);
			}
			if( $.isArray(options.formData) )
			{
				return options.formData;
			}
			if( $.type(options.formData) === 'object' )
			{
				formData = [];
				$.each(options.formData, function( name, value )
				{
					formData.push({name: name, value: value});
				});
				return formData;
			}
			return [];
		},

		_getTotal: function( files )
		{
			var total = 0;
			$.each(files, function( index, file )
			{
				total += file.size || 1;
			});
			return total;
		},

		_initProgressObject: function( obj )
		{
			var progress = {
				loaded:  0,
				total:   0,
				bitrate: 0
			};
			if( obj._progress )
			{
				$.extend(obj._progress, progress);
			} else
			{
				obj._progress = progress;
			}
		},

		_initResponseObject: function( obj )
		{
			var prop;
			if( obj._response )
			{
				for( prop in obj._response )
				{
					if( obj._response.hasOwnProperty(prop) )
					{
						delete obj._response[prop];
					}
				}
			} else
			{
				obj._response = {};
			}
		},

		_onProgress: function( e, data )
		{
			if( e.lengthComputable )
			{
				var now = ((Date.now) ? Date.now() : (new Date()).getTime()),
					loaded;
				if( data._time && data.progressInterval &&
					(now - data._time < data.progressInterval) &&
					e.loaded !== e.total )
				{
					return;
				}
				data._time = now;
				loaded = Math.floor(
					e.loaded / e.total * (data.chunkSize || data._progress.total)
				) + (data.uploadedBytes || 0);
				// Add the difference from the previously loaded state
				// to the global loaded counter:
				this._progress.loaded += (loaded - data._progress.loaded);
				this._progress.bitrate = this._bitrateTimer.getBitrate(
					now,
					this._progress.loaded,
					data.bitrateInterval
				);
				data._progress.loaded = data.loaded = loaded;
				data._progress.bitrate = data.bitrate = data._bitrateTimer.getBitrate(
					now,
					loaded,
					data.bitrateInterval
				);
				// Trigger a custom progress event with a total data property set
				// to the file size(s) of the current upload and a loaded data
				// property calculated accordingly:
				this._trigger('progress', e, data);
				// Trigger a global progress event for all current file uploads,
				// including ajax calls queued for sequential file uploads:
				this._trigger('progressall', e, this._progress);
			}
		},

		_initProgressListener: function( options )
		{
			var that = this,
				xhr = options.xhr ? options.xhr() : $.ajaxSettings.xhr();
			// Accesss to the native XHR object is required to add event listeners
			// for the upload progress event:
			if( xhr.upload )
			{
				$(xhr.upload).bind('progress', function( e )
				{
					var oe = e.originalEvent;
					// Make sure the progress event properties get copied over:
					e.lengthComputable = oe.lengthComputable;
					e.loaded = oe.loaded;
					e.total = oe.total;
					that._onProgress(e, options);
				});
				options.xhr = function()
				{
					return xhr;
				};
			}
		},

		_isInstanceOf: function( type, obj )
		{
			// Cross-frame instanceof check
			return Object.prototype.toString.call(obj) === '[object ' + type + ']';
		},

		_initXHRData: function( options )
		{
			var that = this,
				formData,
				file = options.files[0],
			// Ignore non-multipart setting if not supported:
				multipart = options.multipart || ! $.support.xhrFileUpload,
				paramName = options.paramName[0];
			options.headers = options.headers || {};
			if( options.contentRange )
			{
				options.headers['Content-Range'] = options.contentRange;
			}
			if( ! multipart || options.blob || ! this._isInstanceOf('File', file) )
			{
				options.headers['Content-Disposition'] = 'attachment; filename="' +
					encodeURI(file.name) + '"';
			}
			if( ! multipart )
			{
				options.contentType = file.type;
				options.data = options.blob || file;
			} else if( $.support.xhrFormDataFileUpload )
			{
				if( options.postMessage )
				{
					// window.postMessage does not allow sending FormData
					// objects, so we just add the File/Blob objects to
					// the formData array and let the postMessage window
					// create the FormData object out of this array:
					formData = this._getFormData(options);
					if( options.blob )
					{
						formData.push({
							name:  paramName,
							value: options.blob
						});
					} else
					{
						$.each(options.files, function( index, file )
						{
							formData.push({
								name:  options.paramName[index] || paramName,
								value: file
							});
						});
					}
				} else
				{
					if( that._isInstanceOf('FormData', options.formData) )
					{
						formData = options.formData;
					} else
					{
						formData = new FormData();
						$.each(this._getFormData(options), function( index, field )
						{
							formData.append(field.name, field.value);
						});
					}
					if( options.blob )
					{
						formData.append(paramName, options.blob, file.name);
					} else
					{
						$.each(options.files, function( index, file )
						{
							// This check allows the tests to run with
							// dummy objects:
							if( that._isInstanceOf('File', file) ||
								that._isInstanceOf('Blob', file) )
							{
								formData.append(
									options.paramName[index] || paramName,
									file,
									file.name
								);
							}
						});
					}
				}
				options.data = formData;
			}
			// Blob reference is not needed anymore, free memory:
			options.blob = null;
		},

		_initIframeSettings: function( options )
		{
			var targetHost = $('<a></a>').prop('href', options.url).prop('host');
			// Setting the dataType to iframe enables the iframe transport:
			options.dataType = 'iframe ' + (options.dataType || '');
			// The iframe transport accepts a serialized array as form data:
			options.formData = this._getFormData(options);
			// Add redirect url to form data on cross-domain uploads:
			if( options.redirect && targetHost && targetHost !== location.host )
			{
				options.formData.push({
					name:  options.redirectParamName || 'redirect',
					value: options.redirect
				});
			}
		},

		_initDataSettings: function( options )
		{
			if( this._isXHRUpload(options) )
			{
				if( ! this._chunkedUpload(options, true) )
				{
					if( ! options.data )
					{
						this._initXHRData(options);
					}
					this._initProgressListener(options);
				}
				if( options.postMessage )
				{
					// Setting the dataType to postmessage enables the
					// postMessage transport:
					options.dataType = 'postmessage ' + (options.dataType || '');
				}
			} else
			{
				this._initIframeSettings(options);
			}
		},

		_getParamName: function( options )
		{
			var fileInput = $(options.fileInput),
				paramName = options.paramName;
			if( ! paramName )
			{
				paramName = [];
				fileInput.each(function()
				{
					var input = $(this),
						name = input.prop('name') || 'files[]',
						i = (input.prop('files') || [1]).length;
					while( i )
					{
						paramName.push(name);
						i -= 1;
					}
				});
				if( ! paramName.length )
				{
					paramName = [fileInput.prop('name') || 'files[]'];
				}
			} else if( ! $.isArray(paramName) )
			{
				paramName = [paramName];
			}
			return paramName;
		},

		_initFormSettings: function( options )
		{
			// Retrieve missing options from the input field and the
			// associated form, if available:
			if( ! options.form || ! options.form.length )
			{
				options.form = $(options.fileInput.prop('form'));
				// If the given file input doesn't have an associated form,
				// use the default widget file input's form:
				if( ! options.form.length )
				{
					options.form = $(this.options.fileInput.prop('form'));
				}
			}
			options.paramName = this._getParamName(options);
			if( ! options.url )
			{
				options.url = options.form.prop('action') || location.href;
			}
			// The HTTP request method must be "POST" or "PUT":
			options.type = (options.type || options.form.prop('method') || '')
				.toUpperCase();
			if( options.type !== 'POST' && options.type !== 'PUT' &&
				options.type !== 'PATCH' )
			{
				options.type = 'POST';
			}
			if( ! options.formAcceptCharset )
			{
				options.formAcceptCharset = options.form.attr('accept-charset');
			}
		},

		_getAJAXSettings:       function( data )
		{
			var options = $.extend({}, this.options, data);
			this._initFormSettings(options);
			this._initDataSettings(options);
			return options;
		},

		// jQuery 1.6 doesn't provide .state(),
		// while jQuery 1.8+ removed .isRejected() and .isResolved():
		_getDeferredState:      function( deferred )
		{
			if( deferred.state )
			{
				return deferred.state();
			}
			if( deferred.isResolved() )
			{
				return 'resolved';
			}
			if( deferred.isRejected() )
			{
				return 'rejected';
			}
			return 'pending';
		},

		// Maps jqXHR callbacks to the equivalent
		// methods of the given Promise object:
		_enhancePromise:        function( promise )
		{
			promise.success = promise.done;
			promise.error = promise.fail;
			promise.complete = promise.always;
			return promise;
		},

		// Creates and returns a Promise object enhanced with
		// the jqXHR methods abort, success, error and complete:
		_getXHRPromise:         function( resolveOrReject, context, args )
		{
			var dfd = $.Deferred(),
				promise = dfd.promise();
			context = context || this.options.context || promise;
			if( resolveOrReject === true )
			{
				dfd.resolveWith(context, args);
			} else if( resolveOrReject === false )
			{
				dfd.rejectWith(context, args);
			}
			promise.abort = dfd.promise;
			return this._enhancePromise(promise);
		},

		// Adds convenience methods to the data callback argument:
		_addConvenienceMethods: function( e, data )
		{
			var that = this,
				getPromise = function( data )
				{
					return $.Deferred().resolveWith(that, [data]).promise();
				};
			data.process = function( resolveFunc, rejectFunc )
			{
				if( resolveFunc || rejectFunc )
				{
					data._processQueue = this._processQueue =
						(this._processQueue || getPromise(this))
							.pipe(resolveFunc, rejectFunc);
				}
				return this._processQueue || getPromise(this);
			};
			data.submit = function()
			{
				if( this.state() !== 'pending' )
				{
					data.jqXHR = this.jqXHR =
						(that._trigger('submit', e, this) !== false) &&
							that._onSend(e, this);
				}
				return this.jqXHR || that._getXHRPromise();
			};
			data.abort = function()
			{
				if( this.jqXHR )
				{
					return this.jqXHR.abort();
				}
				return that._getXHRPromise();
			};
			data.state = function()
			{
				if( this.jqXHR )
				{
					return that._getDeferredState(this.jqXHR);
				}
				if( this._processQueue )
				{
					return that._getDeferredState(this._processQueue);
				}
			};
			data.progress = function()
			{
				return this._progress;
			};
			data.response = function()
			{
				return this._response;
			};
		},

		// Parses the Range header from the server response
		// and returns the uploaded bytes:
		_getUploadedBytes:      function( jqXHR )
		{
			var range = jqXHR.getResponseHeader('Range'),
				parts = range && range.split('-'),
				upperBytesPos = parts && parts.length > 1 &&
					parseInt(parts[1], 10);
			return upperBytesPos && upperBytesPos + 1;
		},

		// Uploads a file in multiple, sequential requests
		// by splitting the file up in multiple blob chunks.
		// If the second parameter is true, only tests if the file
		// should be uploaded in chunks, but does not invoke any
		// upload requests:
		_chunkedUpload:         function( options, testOnly )
		{
			options.uploadedBytes = options.uploadedBytes || 0;
			var that = this,
				file = options.files[0],
				fs = file.size,
				ub = options.uploadedBytes,
				mcs = options.maxChunkSize || fs,
				slice = this._blobSlice,
				dfd = $.Deferred(),
				promise = dfd.promise(),
				jqXHR,
				upload;
			if( ! (this._isXHRUpload(options) && slice && (ub || mcs < fs)) ||
				options.data )
			{
				return false;
			}
			if( testOnly )
			{
				return true;
			}
			if( ub >= fs )
			{
				file.error = options.i18n('uploadedBytes');
				return this._getXHRPromise(
					false,
					options.context,
					[null, 'error', file.error]
				);
			}
			// The chunk upload method:
			upload = function()
			{
				// Clone the options object for each chunk upload:
				var o = $.extend({}, options),
					currentLoaded = o._progress.loaded;
				o.blob = slice.call(
					file,
					ub,
					ub + mcs,
					file.type
				);
				// Store the current chunk size, as the blob itself
				// will be dereferenced after data processing:
				o.chunkSize = o.blob.size;
				// Expose the chunk bytes position range:
				o.contentRange = 'bytes ' + ub + '-' +
					(ub + o.chunkSize - 1) + '/' + fs;
				// Process the upload data (the blob and potential form data):
				that._initXHRData(o);
				// Add progress listeners for this chunk upload:
				that._initProgressListener(o);
				jqXHR = ((that._trigger('chunksend', null, o) !== false && $.ajax(o)) ||
					that._getXHRPromise(false, o.context))
					.done(function( result, textStatus, jqXHR )
					{
						ub = that._getUploadedBytes(jqXHR) ||
							(ub + o.chunkSize);
						// Create a progress event if no final progress event
						// with loaded equaling total has been triggered
						// for this chunk:
						if( currentLoaded + o.chunkSize - o._progress.loaded )
						{
							that._onProgress($.Event('progress', {
								lengthComputable: true,
								loaded:           ub - o.uploadedBytes,
								total:            ub - o.uploadedBytes
							}), o);
						}
						options.uploadedBytes = o.uploadedBytes = ub;
						o.result = result;
						o.textStatus = textStatus;
						o.jqXHR = jqXHR;
						that._trigger('chunkdone', null, o);
						that._trigger('chunkalways', null, o);
						if( ub < fs )
						{
							// File upload not yet complete,
							// continue with the next chunk:
							upload();
						} else
						{
							dfd.resolveWith(
								o.context,
								[result, textStatus, jqXHR]
							);
						}
					})
					.fail(function( jqXHR, textStatus, errorThrown )
					{
						o.jqXHR = jqXHR;
						o.textStatus = textStatus;
						o.errorThrown = errorThrown;
						that._trigger('chunkfail', null, o);
						that._trigger('chunkalways', null, o);
						dfd.rejectWith(
							o.context,
							[jqXHR, textStatus, errorThrown]
						);
					});
			};
			this._enhancePromise(promise);
			promise.abort = function()
			{
				return jqXHR.abort();
			};
			upload();
			return promise;
		},

		_beforeSend: function( e, data )
		{
			if( this._active === 0 )
			{
				// the start callback is triggered when an upload starts
				// and no other uploads are currently running,
				// equivalent to the global ajaxStart event:
				this._trigger('start');
				// Set timer for global bitrate progress calculation:
				this._bitrateTimer = new this._BitrateTimer();
				// Reset the global progress values:
				this._progress.loaded = this._progress.total = 0;
				this._progress.bitrate = 0;
			}
			// Make sure the container objects for the .response() and
			// .progress() methods on the data object are available
			// and reset to their initial state:
			this._initResponseObject(data);
			this._initProgressObject(data);
			data._progress.loaded = data.loaded = data.uploadedBytes || 0;
			data._progress.total = data.total = this._getTotal(data.files) || 1;
			data._progress.bitrate = data.bitrate = 0;
			this._active += 1;
			// Initialize the global progress values:
			this._progress.loaded += data.loaded;
			this._progress.total += data.total;
		},

		_onDone: function( result, textStatus, jqXHR, options )
		{
			var total = options._progress.total,
				response = options._response;
			if( options._progress.loaded < total )
			{
				// Create a progress event if no final progress event
				// with loaded equaling total has been triggered:
				this._onProgress($.Event('progress', {
					lengthComputable: true,
					loaded:           total,
					total:            total
				}), options);
			}
			response.result = options.result = result;
			response.textStatus = options.textStatus = textStatus;
			response.jqXHR = options.jqXHR = jqXHR;
			this._trigger('done', null, options);
		},

		_onFail: function( jqXHR, textStatus, errorThrown, options )
		{
			var response = options._response;
			if( options.recalculateProgress )
			{
				// Remove the failed (error or abort) file upload from
				// the global progress calculation:
				this._progress.loaded -= options._progress.loaded;
				this._progress.total -= options._progress.total;
			}
			response.jqXHR = options.jqXHR = jqXHR;
			response.textStatus = options.textStatus = textStatus;
			response.errorThrown = options.errorThrown = errorThrown;
			this._trigger('fail', null, options);
		},

		_onAlways: function( jqXHRorResult, textStatus, jqXHRorError, options )
		{
			// jqXHRorResult, textStatus and jqXHRorError are added to the
			// options object via done and fail callbacks
			this._trigger('always', null, options);
		},

		_onSend: function( e, data )
		{
			if( ! data.submit )
			{
				this._addConvenienceMethods(e, data);
			}
			var that = this,
				jqXHR,
				aborted,
				slot,
				pipe,
				options = that._getAJAXSettings(data),
				send = function()
				{
					that._sending += 1;
					// Set timer for bitrate progress calculation:
					options._bitrateTimer = new that._BitrateTimer();
					jqXHR = jqXHR || (
						((aborted || that._trigger('send', e, options) === false) &&
							that._getXHRPromise(false, options.context, aborted)) ||
							that._chunkedUpload(options) || $.ajax(options)
						).done(function( result, textStatus, jqXHR )
						{
							that._onDone(result, textStatus, jqXHR, options);
						}).fail(function( jqXHR, textStatus, errorThrown )
						{
							that._onFail(jqXHR, textStatus, errorThrown, options);
						}).always(function( jqXHRorResult, textStatus, jqXHRorError )
						{
							that._onAlways(
								jqXHRorResult,
								textStatus,
								jqXHRorError,
								options
							);
							that._sending -= 1;
							that._active -= 1;
							if( options.limitConcurrentUploads &&
								options.limitConcurrentUploads > that._sending )
							{
								// Start the next queued upload,
								// that has not been aborted:
								var nextSlot = that._slots.shift();
								while( nextSlot )
								{
									if( that._getDeferredState(nextSlot) === 'pending' )
									{
										nextSlot.resolve();
										break;
									}
									nextSlot = that._slots.shift();
								}
							}
							if( that._active === 0 )
							{
								// The stop callback is triggered when all uploads have
								// been completed, equivalent to the global ajaxStop event:
								that._trigger('stop');
							}
						});
					return jqXHR;
				};
			this._beforeSend(e, options);
			if( this.options.sequentialUploads ||
				(this.options.limitConcurrentUploads &&
					this.options.limitConcurrentUploads <= this._sending) )
			{
				if( this.options.limitConcurrentUploads > 1 )
				{
					slot = $.Deferred();
					this._slots.push(slot);
					pipe = slot.pipe(send);
				} else
				{
					this._sequence = this._sequence.pipe(send, send);
					pipe = this._sequence;
				}
				// Return the piped Promise object, enhanced with an abort method,
				// which is delegated to the jqXHR object of the current upload,
				// and jqXHR callbacks mapped to the equivalent Promise methods:
				pipe.abort = function()
				{
					aborted = [undefined, 'abort', 'abort'];
					if( ! jqXHR )
					{
						if( slot )
						{
							slot.rejectWith(options.context, aborted);
						}
						return send();
					}
					return jqXHR.abort();
				};
				return this._enhancePromise(pipe);
			}
			return send();
		},

		_onAdd: function( e, data )
		{
			var that = this,
				result = true,
				options = $.extend({}, this.options, data),
				limit = options.limitMultiFileUploads,
				paramName = this._getParamName(options),
				paramNameSet,
				paramNameSlice,
				fileSet,
				i;
			if( ! (options.singleFileUploads || limit) || ! this._isXHRUpload(options) )
			{
				fileSet = [data.files];
				paramNameSet = [paramName];
			} else if( ! options.singleFileUploads && limit )
			{
				fileSet = [];
				paramNameSet = [];
				for( i = 0; i < data.files.length; i += limit )
				{
					fileSet.push(data.files.slice(i, i + limit));
					paramNameSlice = paramName.slice(i, i + limit);
					if( ! paramNameSlice.length )
					{
						paramNameSlice = paramName;
					}
					paramNameSet.push(paramNameSlice);
				}
			} else
			{
				paramNameSet = paramName;
			}
			data.originalFiles = data.files;
			$.each(fileSet || data.files, function( index, element )
			{
				var newData = $.extend({}, data);
				newData.files = fileSet ? element : [element];
				newData.paramName = paramNameSet[index];
				that._initResponseObject(newData);
				that._initProgressObject(newData);
				that._addConvenienceMethods(e, newData);
				result = that._trigger('add', e, newData);
				return result;
			});
			return result;
		},

		_replaceFileInput: function( input )
		{
			var inputClone = input.clone(true);
			$('<form></form>').append(inputClone)[0].reset();
			// Detaching allows to insert the fileInput on another form
			// without loosing the file input value:
			input.after(inputClone).detach();
			// Avoid memory leaks with the detached file input:
			$.cleanData(input.unbind('remove'));
			// Replace the original file input element in the fileInput
			// elements set with the clone, which has been copied including
			// event handlers:
			this.options.fileInput = this.options.fileInput.map(function( i, el )
			{
				if( el === input[0] )
				{
					return inputClone[0];
				}
				return el;
			});
			// If the widget has been initialized on the file input itself,
			// override this.element with the file input clone:
			if( input[0] === this.element[0] )
			{
				this.element = inputClone;
			}
		},

		_handleFileTreeEntry: function( entry, path )
		{
			var that = this,
				dfd = $.Deferred(),
				errorHandler = function( e )
				{
					if( e && ! e.entry )
					{
						e.entry = entry;
					}
					// Since $.when returns immediately if one
					// Deferred is rejected, we use resolve instead.
					// This allows valid files and invalid items
					// to be returned together in one set:
					dfd.resolve([e]);
				},
				dirReader;
			path = path || '';
			if( entry.isFile )
			{
				if( entry._file )
				{
					// Workaround for Chrome bug #149735
					entry._file.relativePath = path;
					dfd.resolve(entry._file);
				} else
				{
					entry.file(function( file )
					{
						file.relativePath = path;
						dfd.resolve(file);
					}, errorHandler);
				}
			} else if( entry.isDirectory )
			{
				dirReader = entry.createReader();
				dirReader.readEntries(function( entries )
				{
					that._handleFileTreeEntries(
						entries,
						path + entry.name + '/'
					).done(function( files )
						{
							dfd.resolve(files);
						}).fail(errorHandler);
				}, errorHandler);
			} else
			{
				// Return an empy list for file system items
				// other than files or directories:
				dfd.resolve([]);
			}
			return dfd.promise();
		},

		_handleFileTreeEntries: function( entries, path )
		{
			var that = this;
			return $.when.apply(
				$,
				$.map(entries, function( entry )
				{
					return that._handleFileTreeEntry(entry, path);
				})
			).pipe(function()
				{
					return Array.prototype.concat.apply(
						[],
						arguments
					);
				});
		},

		_getDroppedFiles: function( dataTransfer )
		{
			dataTransfer = dataTransfer || {};
			var items = dataTransfer.items;
			if( items && items.length && (items[0].webkitGetAsEntry ||
				items[0].getAsEntry) )
			{
				return this._handleFileTreeEntries(
					$.map(items, function( item )
					{
						var entry;
						if( item.webkitGetAsEntry )
						{
							entry = item.webkitGetAsEntry();
							if( entry )
							{
								// Workaround for Chrome bug #149735:
								entry._file = item.getAsFile();
							}
							return entry;
						}
						return item.getAsEntry();
					})
				);
			}
			return $.Deferred().resolve(
				$.makeArray(dataTransfer.files)
			).promise();
		},

		_getSingleFileInputFiles: function( fileInput )
		{
			fileInput = $(fileInput);
			var entries = fileInput.prop('webkitEntries') ||
					fileInput.prop('entries'),
				files,
				value;
			if( entries && entries.length )
			{
				return this._handleFileTreeEntries(entries);
			}
			files = $.makeArray(fileInput.prop('files'));
			if( ! files.length )
			{
				value = fileInput.prop('value');
				if( ! value )
				{
					return $.Deferred().resolve([]).promise();
				}
				// If the files property is not available, the browser does not
				// support the File API and we add a pseudo File object with
				// the input value as name with path information removed:
				files = [
					{name: value.replace(/^.*\\/, '')}
				];
			} else if( files[0].name === undefined && files[0].fileName )
			{
				// File normalization for Safari 4 and Firefox 3:
				$.each(files, function( index, file )
				{
					file.name = file.fileName;
					file.size = file.fileSize;
				});
			}
			return $.Deferred().resolve(files).promise();
		},

		_getFileInputFiles: function( fileInput )
		{
			if( ! (fileInput instanceof $) || fileInput.length === 1 )
			{
				return this._getSingleFileInputFiles(fileInput);
			}
			return $.when.apply(
				$,
				$.map(fileInput, this._getSingleFileInputFiles)
			).pipe(function()
				{
					return Array.prototype.concat.apply(
						[],
						arguments
					);
				});
		},

		_onChange: function( e )
		{
			var that = this,
				data = {
					fileInput: $(e.target),
					form:      $(e.target.form)
				};
			this._getFileInputFiles(data.fileInput).always(function( files )
			{
				data.files = files;
				if( that.options.replaceFileInput )
				{
					that._replaceFileInput(data.fileInput);
				}
				if( that._trigger('change', e, data) !== false )
				{
					that._onAdd(e, data);
				}
			});
		},

		_onPaste: function( e )
		{
			var items = e.originalEvent && e.originalEvent.clipboardData &&
					e.originalEvent.clipboardData.items,
				data = {files: []};
			if( items && items.length )
			{
				$.each(items, function( index, item )
				{
					var file = item.getAsFile && item.getAsFile();
					if( file )
					{
						data.files.push(file);
					}
				});
				if( this._trigger('paste', e, data) === false ||
					this._onAdd(e, data) === false )
				{
					return false;
				}
			}
		},

		_onDrop: function( e )
		{
			e.dataTransfer = e.originalEvent && e.originalEvent.dataTransfer;
			var that = this,
				dataTransfer = e.dataTransfer,
				data = {};
			if( dataTransfer && dataTransfer.files && dataTransfer.files.length )
			{
				e.preventDefault();
				this._getDroppedFiles(dataTransfer).always(function( files )
				{
					data.files = files;
					if( that._trigger('drop', e, data) !== false )
					{
						that._onAdd(e, data);
					}
				});
			}
		},

		_onDragOver: function( e )
		{
			e.dataTransfer = e.originalEvent && e.originalEvent.dataTransfer;
			var dataTransfer = e.dataTransfer;
			if( dataTransfer )
			{
				if( this._trigger('dragover', e) === false )
				{
					return false;
				}
				if( $.inArray('Files', dataTransfer.types) !== - 1 )
				{
					dataTransfer.dropEffect = 'copy';
					e.preventDefault();
				}
			}
		},

		_initEventHandlers: function()
		{
			if( this._isXHRUpload(this.options) )
			{
				this._on(this.options.dropZone, {
					dragover: this._onDragOver,
					drop:     this._onDrop
				});
				this._on(this.options.pasteZone, {
					paste: this._onPaste
				});
			}
			if( $.support.fileInput )
			{
				this._on(this.options.fileInput, {
					change: this._onChange
				});
			}
		},

		_destroyEventHandlers: function()
		{
			this._off(this.options.dropZone, 'dragover drop');
			this._off(this.options.pasteZone, 'paste');
			this._off(this.options.fileInput, 'change');
		},

		_setOption: function( key, value )
		{
			var reinit = $.inArray(key, this._specialOptions) !== - 1;
			if( reinit )
			{
				this._destroyEventHandlers();
			}
			this._super(key, value);
			if( reinit )
			{
				this._initSpecialOptions();
				this._initEventHandlers();
			}
		},

		_initSpecialOptions: function()
		{
			var options = this.options;
			if( options.fileInput === undefined )
			{
				options.fileInput = this.element.is('input[type="file"]') ?
					this.element : this.element.find('input[type="file"]');
			} else if( ! (options.fileInput instanceof $) )
			{
				options.fileInput = $(options.fileInput);
			}
			if( ! (options.dropZone instanceof $) )
			{
				options.dropZone = $(options.dropZone);
			}
			if( ! (options.pasteZone instanceof $) )
			{
				options.pasteZone = $(options.pasteZone);
			}
		},

		_getRegExp: function( str )
		{
			var parts = str.split('/'),
				modifiers = parts.pop();
			parts.shift();
			return new RegExp(parts.join('/'), modifiers);
		},

		_isRegExpOption: function( key, value )
		{
			return key !== 'url' && $.type(value) === 'string' &&
				/^\/.*\/[igm]{0,3}$/.test(value);
		},

		_initDataAttributes: function()
		{
			var that = this,
				options = this.options;
			// Initialize options set via HTML5 data-attributes:
			$.each(
				$(this.element[0].cloneNode(false)).data(),
				function( key, value )
				{
					if( that._isRegExpOption(key, value) )
					{
						value = that._getRegExp(value);
					}
					options[key] = value;
				}
			);
		},

		_create:  function()
		{
			this._initDataAttributes();
			this._initSpecialOptions();
			this._slots = [];
			this._sequence = this._getXHRPromise(true);
			this._sending = this._active = 0;
			this._initProgressObject(this);
			this._initEventHandlers();
		},

		// This method is exposed to the widget API and allows to query
		// the number of active uploads:
		active:   function()
		{
			return this._active;
		},

		// This method is exposed to the widget API and allows to query
		// the widget upload progress.
		// It returns an object with loaded, total and bitrate properties
		// for the running uploads:
		progress: function()
		{
			return this._progress;
		},

		// This method is exposed to the widget API and allows adding files
		// using the fileupload API. The data parameter accepts an object which
		// must have a files property and can contain additional options:
		// .fileupload('add', {files: filesList});
		add:      function( data )
		{
			var that = this;
			if( ! data || this.options.disabled )
			{
				return;
			}
			if( data.fileInput && ! data.files )
			{
				this._getFileInputFiles(data.fileInput).always(function( files )
				{
					data.files = files;
					that._onAdd(null, data);
				});
			} else
			{
				data.files = $.makeArray(data.files);
				this._onAdd(null, data);
			}
		},

		// This method is exposed to the widget API and allows sending files
		// using the fileupload API. The data parameter accepts an object which
		// must have a files or fileInput property and can contain additional options:
		// .fileupload('send', {files: filesList});
		// The method returns a Promise object for the file upload call.
		send:     function( data )
		{
			if( data && ! this.options.disabled )
			{
				if( data.fileInput && ! data.files )
				{
					var that = this,
						dfd = $.Deferred(),
						promise = dfd.promise(),
						jqXHR,
						aborted;
					promise.abort = function()
					{
						aborted = true;
						if( jqXHR )
						{
							return jqXHR.abort();
						}
						dfd.reject(null, 'abort', 'abort');
						return promise;
					};
					this._getFileInputFiles(data.fileInput).always(
						function( files )
						{
							if( aborted )
							{
								return;
							}
							if( ! files.length )
							{
								dfd.reject();
								return;
							}
							data.files = files;
							jqXHR = that._onSend(null, data).then(
								function( result, textStatus, jqXHR )
								{
									dfd.resolve(result, textStatus, jqXHR);
								},
								function( jqXHR, textStatus, errorThrown )
								{
									dfd.reject(jqXHR, textStatus, errorThrown);
								}
							);
						}
					);
					return this._enhancePromise(promise);
				}
				data.files = $.makeArray(data.files);
				if( data.files.length )
				{
					return this._onSend(null, data);
				}
			}
			return this._getXHRPromise(false, data && data.context);
		}

	});

}));

/*
 * jQuery Iframe Transport Plugin 1.7
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*jslint unparam: true, nomen: true */
/*global define, window, document */

(function( factory )
{
	'use strict';
	if( typeof define === 'function' && define.amd )
	{
		// Register as an anonymous AMD module:
		define(['jquery'], factory);
	} else
	{
		// Browser globals:
		factory(window.jQuery);
	}
}(function( $ )
{
	'use strict';

	// Helper variable to create unique names for the transport iframes:
	var counter = 0;

	// The iframe transport accepts three additional options:
	// options.fileInput: a jQuery collection of file input fields
	// options.paramName: the parameter name for the file form data,
	//  overrides the name property of the file input field(s),
	//  can be a string or an array of strings.
	// options.formData: an array of objects with name and value properties,
	//  equivalent to the return data of .serializeArray(), e.g.:
	//  [{name: 'a', value: 1}, {name: 'b', value: 2}]
	$.ajaxTransport('iframe', function( options )
	{
		if( options.async )
		{
			var form,
				iframe,
				addParamChar;
			return {
				send:  function( _, completeCallback )
				{
					form = $('<form style="display:none;"></form>');
					form.attr('accept-charset', options.formAcceptCharset);
					addParamChar = /\?/.test(options.url) ? '&' : '?';
					// XDomainRequest only supports GET and POST:
					if( options.type === 'DELETE' )
					{
						options.url = options.url + addParamChar + '_method=DELETE';
						options.type = 'POST';
					} else if( options.type === 'PUT' )
					{
						options.url = options.url + addParamChar + '_method=PUT';
						options.type = 'POST';
					} else if( options.type === 'PATCH' )
					{
						options.url = options.url + addParamChar + '_method=PATCH';
						options.type = 'POST';
					}
					// javascript:false as initial iframe src
					// prevents warning popups on HTTPS in IE6.
					// IE versions below IE8 cannot set the name property of
					// elements that have already been added to the DOM,
					// so we set the name along with the iframe HTML markup:
					counter += 1;
					iframe = $(
						'<iframe src="javascript:false;" name="iframe-transport-' +
							counter + '"></iframe>'
					).bind('load', function()
						{
							var fileInputClones,
								paramNames = $.isArray(options.paramName) ?
									options.paramName : [options.paramName];
							iframe
								.unbind('load')
								.bind('load', function()
								{
									var response;
									// Wrap in a try/catch block to catch exceptions thrown
									// when trying to access cross-domain iframe contents:
									try
									{
										response = iframe.contents();
										// Google Chrome and Firefox do not throw an
										// exception when calling iframe.contents() on
										// cross-domain requests, so we unify the response:
										if( ! response.length || ! response[0].firstChild )
										{
											throw new Error();
										}
									} catch( e )
									{
										response = undefined;
									}
									// The complete callback returns the
									// iframe content document as response object:
									completeCallback(
										200,
										'success',
										{'iframe': response}
									);
									// Fix for IE endless progress bar activity bug
									// (happens on form submits to iframe targets):
									$('<iframe src="javascript:false;"></iframe>')
										.appendTo(form);
									window.setTimeout(function()
									{
										// Removing the form in a setTimeout call
										// allows Chrome's developer tools to display
										// the response result
										form.remove();
									}, 0);
								});
							form
								.prop('target', iframe.prop('name'))
								.prop('action', options.url)
								.prop('method', options.type);
							if( options.formData )
							{
								$.each(options.formData, function( index, field )
								{
									$('<input type="hidden"/>')
										.prop('name', field.name)
										.val(field.value)
										.appendTo(form);
								});
							}
							if( options.fileInput && options.fileInput.length &&
								options.type === 'POST' )
							{
								fileInputClones = options.fileInput.clone();
								// Insert a clone for each file input field:
								options.fileInput.after(function( index )
								{
									return fileInputClones[index];
								});
								if( options.paramName )
								{
									options.fileInput.each(function( index )
									{
										$(this).prop(
											'name',
											paramNames[index] || options.paramName
										);
									});
								}
								// Appending the file input fields to the hidden form
								// removes them from their original location:
								form
									.append(options.fileInput)
									.prop('enctype', 'multipart/form-data')
									// enctype must be set as encoding for IE:
									.prop('encoding', 'multipart/form-data');
							}
							form.submit();
							// Insert the file input fields at their original location
							// by replacing the clones with the originals:
							if( fileInputClones && fileInputClones.length )
							{
								options.fileInput.each(function( index, input )
								{
									var clone = $(fileInputClones[index]);
									$(input).prop('name', clone.prop('name'));
									clone.replaceWith(input);
								});
							}
						});
					form.append(iframe).appendTo(document.body);
				},
				abort: function()
				{
					if( iframe )
					{
						// javascript:false as iframe src aborts the request
						// and prevents warning popups on HTTPS in IE6.
						// concat is used to avoid the "Script URL" JSLint error:
						iframe
							.unbind('load')
							.prop('src', 'javascript'.concat(':false;'));
					}
					if( form )
					{
						form.remove();
					}
				}
			};
		}
	});

	// The iframe transport returns the iframe content document as response.
	// The following adds converters from iframe to text, json, html, xml
	// and script.
	// Please note that the Content-Type for JSON responses has to be text/plain
	// or text/html, if the browser doesn't include application/json in the
	// Accept header, else IE will show a download dialog.
	// The Content-Type for XML responses on the other hand has to be always
	// application/xml or text/xml, so IE properly parses the XML response.
	// See also
	// https://github.com/blueimp/jQuery-File-Upload/wiki/Setup#content-type-negotiation
	$.ajaxSetup({
		converters: {
			'iframe text':   function( iframe )
			{
				return iframe && $(iframe[0].body).text();
			},
			'iframe json':   function( iframe )
			{
				return iframe && $.parseJSON($(iframe[0].body).text());
			},
			'iframe html':   function( iframe )
			{
				return iframe && $(iframe[0].body).html();
			},
			'iframe xml':    function( iframe )
			{
				var xmlDoc = iframe && iframe[0];
				return xmlDoc && $.isXMLDoc(xmlDoc) ? xmlDoc :
					$.parseXML((xmlDoc.XMLDocument && xmlDoc.XMLDocument.xml) ||
						$(xmlDoc.body).html());
			},
			'iframe script': function( iframe )
			{
				return iframe && $.globalEval($(iframe[0].body).text());
			}
		}
	});

}));

/*!
 * jQuery Cycle Plugin (with Transition Definitions)
 * Examples and documentation at: http://jquery.malsup.com/cycle/
 * Copyright (c) 2007-2013 M. Alsup
 * Version: 3.0.3 (11-JUL-2013)
 * Dual licensed under the MIT and GPL licenses.
 * http://jquery.malsup.com/license.html
 * Requires: jQuery v1.7.1 or later
 */
;(function($, undefined) {
"use strict";

var ver = '3.0.3';

function debug(s) {
	if ($.fn.cycle.debug)
		log(s);
}		
function log() {
	/*global console */
	if (window.console && console.log)
		console.log('[cycle] ' + Array.prototype.join.call(arguments,' '));
}
$.expr[':'].paused = function(el) {
	return el.cyclePause;
};


// the options arg can be...
//   a number  - indicates an immediate transition should occur to the given slide index
//   a string  - 'pause', 'resume', 'toggle', 'next', 'prev', 'stop', 'destroy' or the name of a transition effect (ie, 'fade', 'zoom', etc)
//   an object - properties to control the slideshow
//
// the arg2 arg can be...
//   the name of an fx (only used in conjunction with a numeric value for 'options')
//   the value true (only used in first arg == 'resume') and indicates
//	 that the resume should occur immediately (not wait for next timeout)

$.fn.cycle = function(options, arg2) {
	var o = { s: this.selector, c: this.context };

	// in 1.3+ we can fix mistakes with the ready state
	if (this.length === 0 && options != 'stop') {
		if (!$.isReady && o.s) {
			log('DOM not ready, queuing slideshow');
			$(function() {
				$(o.s,o.c).cycle(options,arg2);
			});
			return this;
		}
		// is your DOM ready?  http://docs.jquery.com/Tutorials:Introducing_$(document).ready()
		log('terminating; zero elements found by selector' + ($.isReady ? '' : ' (DOM not ready)'));
		return this;
	}

	// iterate the matched nodeset
	return this.each(function() {
		var opts = handleArguments(this, options, arg2);
		if (opts === false)
			return;

		opts.updateActivePagerLink = opts.updateActivePagerLink || $.fn.cycle.updateActivePagerLink;
		
		// stop existing slideshow for this container (if there is one)
		if (this.cycleTimeout)
			clearTimeout(this.cycleTimeout);
		this.cycleTimeout = this.cyclePause = 0;
		this.cycleStop = 0; // issue #108

		var $cont = $(this);
		var $slides = opts.slideExpr ? $(opts.slideExpr, this) : $cont.children();
		var els = $slides.get();

		if (els.length < 2) {
			log('terminating; too few slides: ' + els.length);
			return;
		}

		var opts2 = buildOptions($cont, $slides, els, opts, o);
		if (opts2 === false)
			return;

		var startTime = opts2.continuous ? 10 : getTimeout(els[opts2.currSlide], els[opts2.nextSlide], opts2, !opts2.backwards);

		// if it's an auto slideshow, kick it off
		if (startTime) {
			startTime += (opts2.delay || 0);
			if (startTime < 10)
				startTime = 10;
			debug('first timeout: ' + startTime);
			this.cycleTimeout = setTimeout(function(){go(els,opts2,0,!opts.backwards);}, startTime);
		}
	});
};

function triggerPause(cont, byHover, onPager) {
	var opts = $(cont).data('cycle.opts');
	if (!opts)
		return;
	var paused = !!cont.cyclePause;
	if (paused && opts.paused)
		opts.paused(cont, opts, byHover, onPager);
	else if (!paused && opts.resumed)
		opts.resumed(cont, opts, byHover, onPager);
}

// process the args that were passed to the plugin fn
function handleArguments(cont, options, arg2) {
	if (cont.cycleStop === undefined)
		cont.cycleStop = 0;
	if (options === undefined || options === null)
		options = {};
	if (options.constructor == String) {
		switch(options) {
		case 'destroy':
		case 'stop':
			var opts = $(cont).data('cycle.opts');
			if (!opts)
				return false;
			cont.cycleStop++; // callbacks look for change
			if (cont.cycleTimeout)
				clearTimeout(cont.cycleTimeout);
			cont.cycleTimeout = 0;
			if (opts.elements)
				$(opts.elements).stop();
			$(cont).removeData('cycle.opts');
			if (options == 'destroy')
				destroy(cont, opts);
			return false;
		case 'toggle':
			cont.cyclePause = (cont.cyclePause === 1) ? 0 : 1;
			checkInstantResume(cont.cyclePause, arg2, cont);
			triggerPause(cont);
			return false;
		case 'pause':
			cont.cyclePause = 1;
			triggerPause(cont);
			return false;
		case 'resume':
			cont.cyclePause = 0;
			checkInstantResume(false, arg2, cont);
			triggerPause(cont);
			return false;
		case 'prev':
		case 'next':
			opts = $(cont).data('cycle.opts');
			if (!opts) {
				log('options not found, "prev/next" ignored');
				return false;
			}
			if (typeof arg2 == 'string') 
				opts.oneTimeFx = arg2;
			$.fn.cycle[options](opts);
			return false;
		default:
			options = { fx: options };
		}
		return options;
	}
	else if (options.constructor == Number) {
		// go to the requested slide
		var num = options;
		options = $(cont).data('cycle.opts');
		if (!options) {
			log('options not found, can not advance slide');
			return false;
		}
		if (num < 0 || num >= options.elements.length) {
			log('invalid slide index: ' + num);
			return false;
		}
		options.nextSlide = num;
		if (cont.cycleTimeout) {
			clearTimeout(cont.cycleTimeout);
			cont.cycleTimeout = 0;
		}
		if (typeof arg2 == 'string')
			options.oneTimeFx = arg2;
		go(options.elements, options, 1, num >= options.currSlide);
		return false;
	}
	return options;
	
	function checkInstantResume(isPaused, arg2, cont) {
		if (!isPaused && arg2 === true) { // resume now!
			var options = $(cont).data('cycle.opts');
			if (!options) {
				log('options not found, can not resume');
				return false;
			}
			if (cont.cycleTimeout) {
				clearTimeout(cont.cycleTimeout);
				cont.cycleTimeout = 0;
			}
			go(options.elements, options, 1, !options.backwards);
		}
	}
}

function removeFilter(el, opts) {
	if (!$.support.opacity && opts.cleartype && el.style.filter) {
		try { el.style.removeAttribute('filter'); }
		catch(smother) {} // handle old opera versions
	}
}

// unbind event handlers
function destroy(cont, opts) {
	if (opts.next)
		$(opts.next).unbind(opts.prevNextEvent);
	if (opts.prev)
		$(opts.prev).unbind(opts.prevNextEvent);
	
	if (opts.pager || opts.pagerAnchorBuilder)
		$.each(opts.pagerAnchors || [], function() {
			this.unbind().remove();
		});
	opts.pagerAnchors = null;
	$(cont).unbind('mouseenter.cycle mouseleave.cycle');
	if (opts.destroy) // callback
		opts.destroy(opts);
}

// one-time initialization
function buildOptions($cont, $slides, els, options, o) {
	var startingSlideSpecified;
	// support metadata plugin (v1.0 and v2.0)
	var opts = $.extend({}, $.fn.cycle.defaults, options || {}, $.metadata ? $cont.metadata() : $.meta ? $cont.data() : {});
	var meta = $.isFunction($cont.data) ? $cont.data(opts.metaAttr) : null;
	if (meta)
		opts = $.extend(opts, meta);
	if (opts.autostop)
		opts.countdown = opts.autostopCount || els.length;

	var cont = $cont[0];
	$cont.data('cycle.opts', opts);
	opts.$cont = $cont;
	opts.stopCount = cont.cycleStop;
	opts.elements = els;
	opts.before = opts.before ? [opts.before] : [];
	opts.after = opts.after ? [opts.after] : [];

	// push some after callbacks
	if (!$.support.opacity && opts.cleartype)
		opts.after.push(function() { removeFilter(this, opts); });
	if (opts.continuous)
		opts.after.push(function() { go(els,opts,0,!opts.backwards); });

	saveOriginalOpts(opts);

	// clearType corrections
	if (!$.support.opacity && opts.cleartype && !opts.cleartypeNoBg)
		clearTypeFix($slides);

	// container requires non-static position so that slides can be position within
	if ($cont.css('position') == 'static')
		$cont.css('position', 'relative');
	if (opts.width)
		$cont.width(opts.width);
	if (opts.height && opts.height != 'auto')
		$cont.height(opts.height);

	if (opts.startingSlide !== undefined) {
		opts.startingSlide = parseInt(opts.startingSlide,10);
		if (opts.startingSlide >= els.length || opts.startSlide < 0)
			opts.startingSlide = 0; // catch bogus input
		else 
			startingSlideSpecified = true;
	}
	else if (opts.backwards)
		opts.startingSlide = els.length - 1;
	else
		opts.startingSlide = 0;

	// if random, mix up the slide array
	if (opts.random) {
		opts.randomMap = [];
		for (var i = 0; i < els.length; i++)
			opts.randomMap.push(i);
		opts.randomMap.sort(function(a,b) {return Math.random() - 0.5;});
		if (startingSlideSpecified) {
			// try to find the specified starting slide and if found set start slide index in the map accordingly
			for ( var cnt = 0; cnt < els.length; cnt++ ) {
				if ( opts.startingSlide == opts.randomMap[cnt] ) {
					opts.randomIndex = cnt;
				}
			}
		}
		else {
			opts.randomIndex = 1;
			opts.startingSlide = opts.randomMap[1];
		}
	}
	else if (opts.startingSlide >= els.length)
		opts.startingSlide = 0; // catch bogus input
	opts.currSlide = opts.startingSlide || 0;
	var first = opts.startingSlide;

	// set position and zIndex on all the slides
	$slides.css({position: 'absolute', top:0, left:0}).hide().each(function(i) {
		var z;
		if (opts.backwards)
			z = first ? i <= first ? els.length + (i-first) : first-i : els.length-i;
		else
			z = first ? i >= first ? els.length - (i-first) : first-i : els.length-i;
		$(this).css('z-index', z);
	});

	// make sure first slide is visible
	$(els[first]).css('opacity',1).show(); // opacity bit needed to handle restart use case
	removeFilter(els[first], opts);

	// stretch slides
	if (opts.fit) {
		if (!opts.aspect) {
	        if (opts.width)
	            $slides.width(opts.width);
	        if (opts.height && opts.height != 'auto')
	            $slides.height(opts.height);
		} else {
			$slides.each(function(){
				var $slide = $(this);
				var ratio = (opts.aspect === true) ? $slide.width()/$slide.height() : opts.aspect;
				if( opts.width && $slide.width() != opts.width ) {
					$slide.width( opts.width );
					$slide.height( opts.width / ratio );
				}

				if( opts.height && $slide.height() < opts.height ) {
					$slide.height( opts.height );
					$slide.width( opts.height * ratio );
				}
			});
		}
	}

	if (opts.center && ((!opts.fit) || opts.aspect)) {
		$slides.each(function(){
			var $slide = $(this);
			$slide.css({
				"margin-left": opts.width ?
					((opts.width - $slide.width()) / 2) + "px" :
					0,
				"margin-top": opts.height ?
					((opts.height - $slide.height()) / 2) + "px" :
					0
			});
		});
	}

	if (opts.center && !opts.fit && !opts.slideResize) {
		$slides.each(function(){
			var $slide = $(this);
			$slide.css({
				"margin-left": opts.width ? ((opts.width - $slide.width()) / 2) + "px" : 0,
				"margin-top": opts.height ? ((opts.height - $slide.height()) / 2) + "px" : 0
			});
		});
	}
		
	// stretch container
	var reshape = (opts.containerResize || opts.containerResizeHeight) && $cont.innerHeight() < 1;
	if (reshape) { // do this only if container has no size http://tinyurl.com/da2oa9
		var maxw = 0, maxh = 0;
		for(var j=0; j < els.length; j++) {
			var $e = $(els[j]), e = $e[0], w = $e.outerWidth(), h = $e.outerHeight();
			if (!w) w = e.offsetWidth || e.width || $e.attr('width');
			if (!h) h = e.offsetHeight || e.height || $e.attr('height');
			maxw = w > maxw ? w : maxw;
			maxh = h > maxh ? h : maxh;
		}
		if (opts.containerResize && maxw > 0 && maxh > 0)
			$cont.css({width:maxw+'px',height:maxh+'px'});
		if (opts.containerResizeHeight && maxh > 0)
			$cont.css({height:maxh+'px'});
	}

	var pauseFlag = false;  // https://github.com/malsup/cycle/issues/44
	if (opts.pause)
		$cont.bind('mouseenter.cycle', function(){
			pauseFlag = true;
			this.cyclePause++;
			triggerPause(cont, true);
		}).bind('mouseleave.cycle', function(){
				if (pauseFlag)
					this.cyclePause--;
				triggerPause(cont, true);
		});

	if (supportMultiTransitions(opts) === false)
		return false;

	// apparently a lot of people use image slideshows without height/width attributes on the images.
	// Cycle 2.50+ requires the sizing info for every slide; this block tries to deal with that.
	var requeue = false;
	options.requeueAttempts = options.requeueAttempts || 0;
	$slides.each(function() {
		// try to get height/width of each slide
		var $el = $(this);
		this.cycleH = (opts.fit && opts.height) ? opts.height : ($el.height() || this.offsetHeight || this.height || $el.attr('height') || 0);
		this.cycleW = (opts.fit && opts.width) ? opts.width : ($el.width() || this.offsetWidth || this.width || $el.attr('width') || 0);

		if ( $el.is('img') ) {
			var loading = (this.cycleH === 0 && this.cycleW === 0 && !this.complete);
			// don't requeue for images that are still loading but have a valid size
			if (loading) {
				if (o.s && opts.requeueOnImageNotLoaded && ++options.requeueAttempts < 100) { // track retry count so we don't loop forever
					log(options.requeueAttempts,' - img slide not loaded, requeuing slideshow: ', this.src, this.cycleW, this.cycleH);
					setTimeout(function() {$(o.s,o.c).cycle(options);}, opts.requeueTimeout);
					requeue = true;
					return false; // break each loop
				}
				else {
					log('could not determine size of image: '+this.src, this.cycleW, this.cycleH);
				}
			}
		}
		return true;
	});

	if (requeue)
		return false;

	opts.cssBefore = opts.cssBefore || {};
	opts.cssAfter = opts.cssAfter || {};
	opts.cssFirst = opts.cssFirst || {};
	opts.animIn = opts.animIn || {};
	opts.animOut = opts.animOut || {};

	$slides.not(':eq('+first+')').css(opts.cssBefore);
	$($slides[first]).css(opts.cssFirst);

	if (opts.timeout) {
		opts.timeout = parseInt(opts.timeout,10);
		// ensure that timeout and speed settings are sane
		if (opts.speed.constructor == String)
			opts.speed = $.fx.speeds[opts.speed] || parseInt(opts.speed,10);
		if (!opts.sync)
			opts.speed = opts.speed / 2;
		
		var buffer = opts.fx == 'none' ? 0 : opts.fx == 'shuffle' ? 500 : 250;
		while((opts.timeout - opts.speed) < buffer) // sanitize timeout
			opts.timeout += opts.speed;
	}
	if (opts.easing)
		opts.easeIn = opts.easeOut = opts.easing;
	if (!opts.speedIn)
		opts.speedIn = opts.speed;
	if (!opts.speedOut)
		opts.speedOut = opts.speed;

	opts.slideCount = els.length;
	opts.currSlide = opts.lastSlide = first;
	if (opts.random) {
		if (++opts.randomIndex == els.length)
			opts.randomIndex = 0;
		opts.nextSlide = opts.randomMap[opts.randomIndex];
	}
	else if (opts.backwards)
		opts.nextSlide = opts.startingSlide === 0 ? (els.length-1) : opts.startingSlide-1;
	else
		opts.nextSlide = opts.startingSlide >= (els.length-1) ? 0 : opts.startingSlide+1;

	// run transition init fn
	if (!opts.multiFx) {
		var init = $.fn.cycle.transitions[opts.fx];
		if ($.isFunction(init))
			init($cont, $slides, opts);
		else if (opts.fx != 'custom' && !opts.multiFx) {
			log('unknown transition: ' + opts.fx,'; slideshow terminating');
			return false;
		}
	}

	// fire artificial events
	var e0 = $slides[first];
	if (!opts.skipInitializationCallbacks) {
		if (opts.before.length)
			opts.before[0].apply(e0, [e0, e0, opts, true]);
		if (opts.after.length)
			opts.after[0].apply(e0, [e0, e0, opts, true]);
	}
	if (opts.next)
		$(opts.next).bind(opts.prevNextEvent,function(){return advance(opts,1);});
	if (opts.prev)
		$(opts.prev).bind(opts.prevNextEvent,function(){return advance(opts,0);});
	if (opts.pager || opts.pagerAnchorBuilder)
		buildPager(els,opts);

	exposeAddSlide(opts, els);

	return opts;
}

// save off original opts so we can restore after clearing state
function saveOriginalOpts(opts) {
	opts.original = { before: [], after: [] };
	opts.original.cssBefore = $.extend({}, opts.cssBefore);
	opts.original.cssAfter  = $.extend({}, opts.cssAfter);
	opts.original.animIn	= $.extend({}, opts.animIn);
	opts.original.animOut   = $.extend({}, opts.animOut);
	$.each(opts.before, function() { opts.original.before.push(this); });
	$.each(opts.after,  function() { opts.original.after.push(this); });
}

function supportMultiTransitions(opts) {
	var i, tx, txs = $.fn.cycle.transitions;
	// look for multiple effects
	if (opts.fx.indexOf(',') > 0) {
		opts.multiFx = true;
		opts.fxs = opts.fx.replace(/\s*/g,'').split(',');
		// discard any bogus effect names
		for (i=0; i < opts.fxs.length; i++) {
			var fx = opts.fxs[i];
			tx = txs[fx];
			if (!tx || !txs.hasOwnProperty(fx) || !$.isFunction(tx)) {
				log('discarding unknown transition: ',fx);
				opts.fxs.splice(i,1);
				i--;
			}
		}
		// if we have an empty list then we threw everything away!
		if (!opts.fxs.length) {
			log('No valid transitions named; slideshow terminating.');
			return false;
		}
	}
	else if (opts.fx == 'all') {  // auto-gen the list of transitions
		opts.multiFx = true;
		opts.fxs = [];
		for (var p in txs) {
			if (txs.hasOwnProperty(p)) {
				tx = txs[p];
				if (txs.hasOwnProperty(p) && $.isFunction(tx))
					opts.fxs.push(p);
			}
		}
	}
	if (opts.multiFx && opts.randomizeEffects) {
		// munge the fxs array to make effect selection random
		var r1 = Math.floor(Math.random() * 20) + 30;
		for (i = 0; i < r1; i++) {
			var r2 = Math.floor(Math.random() * opts.fxs.length);
			opts.fxs.push(opts.fxs.splice(r2,1)[0]);
		}
		debug('randomized fx sequence: ',opts.fxs);
	}
	return true;
}

// provide a mechanism for adding slides after the slideshow has started
function exposeAddSlide(opts, els) {
	opts.addSlide = function(newSlide, prepend) {
		var $s = $(newSlide), s = $s[0];
		if (!opts.autostopCount)
			opts.countdown++;
		els[prepend?'unshift':'push'](s);
		if (opts.els)
			opts.els[prepend?'unshift':'push'](s); // shuffle needs this
		opts.slideCount = els.length;

		// add the slide to the random map and resort
		if (opts.random) {
			opts.randomMap.push(opts.slideCount-1);
			opts.randomMap.sort(function(a,b) {return Math.random() - 0.5;});
		}

		$s.css('position','absolute');
		$s[prepend?'prependTo':'appendTo'](opts.$cont);

		if (prepend) {
			opts.currSlide++;
			opts.nextSlide++;
		}

		if (!$.support.opacity && opts.cleartype && !opts.cleartypeNoBg)
			clearTypeFix($s);

		if (opts.fit && opts.width)
			$s.width(opts.width);
		if (opts.fit && opts.height && opts.height != 'auto')
			$s.height(opts.height);
		s.cycleH = (opts.fit && opts.height) ? opts.height : $s.height();
		s.cycleW = (opts.fit && opts.width) ? opts.width : $s.width();

		$s.css(opts.cssBefore);

		if (opts.pager || opts.pagerAnchorBuilder)
			$.fn.cycle.createPagerAnchor(els.length-1, s, $(opts.pager), els, opts);

		if ($.isFunction(opts.onAddSlide))
			opts.onAddSlide($s);
		else
			$s.hide(); // default behavior
	};
}

// reset internal state; we do this on every pass in order to support multiple effects
$.fn.cycle.resetState = function(opts, fx) {
	fx = fx || opts.fx;
	opts.before = []; opts.after = [];
	opts.cssBefore = $.extend({}, opts.original.cssBefore);
	opts.cssAfter  = $.extend({}, opts.original.cssAfter);
	opts.animIn	= $.extend({}, opts.original.animIn);
	opts.animOut   = $.extend({}, opts.original.animOut);
	opts.fxFn = null;
	$.each(opts.original.before, function() { opts.before.push(this); });
	$.each(opts.original.after,  function() { opts.after.push(this); });

	// re-init
	var init = $.fn.cycle.transitions[fx];
	if ($.isFunction(init))
		init(opts.$cont, $(opts.elements), opts);
};

// this is the main engine fn, it handles the timeouts, callbacks and slide index mgmt
function go(els, opts, manual, fwd) {
	var p = opts.$cont[0], curr = els[opts.currSlide], next = els[opts.nextSlide];

	// opts.busy is true if we're in the middle of an animation
	if (manual && opts.busy && opts.manualTrump) {
		// let manual transitions requests trump active ones
		debug('manualTrump in go(), stopping active transition');
		$(els).stop(true,true);
		opts.busy = 0;
		clearTimeout(p.cycleTimeout);
	}

	// don't begin another timeout-based transition if there is one active
	if (opts.busy) {
		debug('transition active, ignoring new tx request');
		return;
	}


	// stop cycling if we have an outstanding stop request
	if (p.cycleStop != opts.stopCount || p.cycleTimeout === 0 && !manual)
		return;

	// check to see if we should stop cycling based on autostop options
	if (!manual && !p.cyclePause && !opts.bounce &&
		((opts.autostop && (--opts.countdown <= 0)) ||
		(opts.nowrap && !opts.random && opts.nextSlide < opts.currSlide))) {
		if (opts.end)
			opts.end(opts);
		return;
	}

	// if slideshow is paused, only transition on a manual trigger
	var changed = false;
	if ((manual || !p.cyclePause) && (opts.nextSlide != opts.currSlide)) {
		changed = true;
		var fx = opts.fx;
		// keep trying to get the slide size if we don't have it yet
		curr.cycleH = curr.cycleH || $(curr).height();
		curr.cycleW = curr.cycleW || $(curr).width();
		next.cycleH = next.cycleH || $(next).height();
		next.cycleW = next.cycleW || $(next).width();

		// support multiple transition types
		if (opts.multiFx) {
			if (fwd && (opts.lastFx === undefined || ++opts.lastFx >= opts.fxs.length))
				opts.lastFx = 0;
			else if (!fwd && (opts.lastFx === undefined || --opts.lastFx < 0))
				opts.lastFx = opts.fxs.length - 1;
			fx = opts.fxs[opts.lastFx];
		}

		// one-time fx overrides apply to:  $('div').cycle(3,'zoom');
		if (opts.oneTimeFx) {
			fx = opts.oneTimeFx;
			opts.oneTimeFx = null;
		}

		$.fn.cycle.resetState(opts, fx);

		// run the before callbacks
		if (opts.before.length)
			$.each(opts.before, function(i,o) {
				if (p.cycleStop != opts.stopCount) return;
				o.apply(next, [curr, next, opts, fwd]);
			});

		// stage the after callacks
		var after = function() {
			opts.busy = 0;
			$.each(opts.after, function(i,o) {
				if (p.cycleStop != opts.stopCount) return;
				o.apply(next, [curr, next, opts, fwd]);
			});
			if (!p.cycleStop) {
				// queue next transition
				queueNext();
			}
		};

		debug('tx firing('+fx+'); currSlide: ' + opts.currSlide + '; nextSlide: ' + opts.nextSlide);
		
		// get ready to perform the transition
		opts.busy = 1;
		if (opts.fxFn) // fx function provided?
			opts.fxFn(curr, next, opts, after, fwd, manual && opts.fastOnEvent);
		else if ($.isFunction($.fn.cycle[opts.fx])) // fx plugin ?
			$.fn.cycle[opts.fx](curr, next, opts, after, fwd, manual && opts.fastOnEvent);
		else
			$.fn.cycle.custom(curr, next, opts, after, fwd, manual && opts.fastOnEvent);
	}
	else {
		queueNext();
	}

	if (changed || opts.nextSlide == opts.currSlide) {
		// calculate the next slide
		var roll;
		opts.lastSlide = opts.currSlide;
		if (opts.random) {
			opts.currSlide = opts.nextSlide;
			if (++opts.randomIndex == els.length) {
				opts.randomIndex = 0;
				opts.randomMap.sort(function(a,b) {return Math.random() - 0.5;});
			}
			opts.nextSlide = opts.randomMap[opts.randomIndex];
			if (opts.nextSlide == opts.currSlide)
				opts.nextSlide = (opts.currSlide == opts.slideCount - 1) ? 0 : opts.currSlide + 1;
		}
		else if (opts.backwards) {
			roll = (opts.nextSlide - 1) < 0;
			if (roll && opts.bounce) {
				opts.backwards = !opts.backwards;
				opts.nextSlide = 1;
				opts.currSlide = 0;
			}
			else {
				opts.nextSlide = roll ? (els.length-1) : opts.nextSlide-1;
				opts.currSlide = roll ? 0 : opts.nextSlide+1;
			}
		}
		else { // sequence
			roll = (opts.nextSlide + 1) == els.length;
			if (roll && opts.bounce) {
				opts.backwards = !opts.backwards;
				opts.nextSlide = els.length-2;
				opts.currSlide = els.length-1;
			}
			else {
				opts.nextSlide = roll ? 0 : opts.nextSlide+1;
				opts.currSlide = roll ? els.length-1 : opts.nextSlide-1;
			}
		}
	}
	if (changed && opts.pager)
		opts.updateActivePagerLink(opts.pager, opts.currSlide, opts.activePagerClass);
	
	function queueNext() {
		// stage the next transition
		var ms = 0, timeout = opts.timeout;
		if (opts.timeout && !opts.continuous) {
			ms = getTimeout(els[opts.currSlide], els[opts.nextSlide], opts, fwd);
         if (opts.fx == 'shuffle')
            ms -= opts.speedOut;
      }
		else if (opts.continuous && p.cyclePause) // continuous shows work off an after callback, not this timer logic
			ms = 10;
		if (ms > 0)
			p.cycleTimeout = setTimeout(function(){ go(els, opts, 0, !opts.backwards); }, ms);
	}
}

// invoked after transition
$.fn.cycle.updateActivePagerLink = function(pager, currSlide, clsName) {
   $(pager).each(function() {
       $(this).children().removeClass(clsName).eq(currSlide).addClass(clsName);
   });
};

// calculate timeout value for current transition
function getTimeout(curr, next, opts, fwd) {
	if (opts.timeoutFn) {
		// call user provided calc fn
		var t = opts.timeoutFn.call(curr,curr,next,opts,fwd);
		while (opts.fx != 'none' && (t - opts.speed) < 250) // sanitize timeout
			t += opts.speed;
		debug('calculated timeout: ' + t + '; speed: ' + opts.speed);
		if (t !== false)
			return t;
	}
	return opts.timeout;
}

// expose next/prev function, caller must pass in state
$.fn.cycle.next = function(opts) { advance(opts,1); };
$.fn.cycle.prev = function(opts) { advance(opts,0);};

// advance slide forward or back
function advance(opts, moveForward) {
	var val = moveForward ? 1 : -1;
	var els = opts.elements;
	var p = opts.$cont[0], timeout = p.cycleTimeout;
	if (timeout) {
		clearTimeout(timeout);
		p.cycleTimeout = 0;
	}
	if (opts.random && val < 0) {
		// move back to the previously display slide
		opts.randomIndex--;
		if (--opts.randomIndex == -2)
			opts.randomIndex = els.length-2;
		else if (opts.randomIndex == -1)
			opts.randomIndex = els.length-1;
		opts.nextSlide = opts.randomMap[opts.randomIndex];
	}
	else if (opts.random) {
		opts.nextSlide = opts.randomMap[opts.randomIndex];
	}
	else {
		opts.nextSlide = opts.currSlide + val;
		if (opts.nextSlide < 0) {
			if (opts.nowrap) return false;
			opts.nextSlide = els.length - 1;
		}
		else if (opts.nextSlide >= els.length) {
			if (opts.nowrap) return false;
			opts.nextSlide = 0;
		}
	}

	var cb = opts.onPrevNextEvent || opts.prevNextClick; // prevNextClick is deprecated
	if ($.isFunction(cb))
		cb(val > 0, opts.nextSlide, els[opts.nextSlide]);
	go(els, opts, 1, moveForward);
	return false;
}

function buildPager(els, opts) {
	var $p = $(opts.pager);
	$.each(els, function(i,o) {
		$.fn.cycle.createPagerAnchor(i,o,$p,els,opts);
	});
	opts.updateActivePagerLink(opts.pager, opts.startingSlide, opts.activePagerClass);
}

$.fn.cycle.createPagerAnchor = function(i, el, $p, els, opts) {
	var a;
	if ($.isFunction(opts.pagerAnchorBuilder)) {
		a = opts.pagerAnchorBuilder(i,el);
		debug('pagerAnchorBuilder('+i+', el) returned: ' + a);
	}
	else
		a = '<a href="#">'+(i+1)+'</a>';
		
	if (!a)
		return;
	var $a = $(a);
	// don't reparent if anchor is in the dom
	if ($a.parents('body').length === 0) {
		var arr = [];
		if ($p.length > 1) {
			$p.each(function() {
				var $clone = $a.clone(true);
				$(this).append($clone);
				arr.push($clone[0]);
			});
			$a = $(arr);
		}
		else {
			$a.appendTo($p);
		}
	}

	opts.pagerAnchors =  opts.pagerAnchors || [];
	opts.pagerAnchors.push($a);
	
	var pagerFn = function(e) {
		e.preventDefault();
		opts.nextSlide = i;
		var p = opts.$cont[0], timeout = p.cycleTimeout;
		if (timeout) {
			clearTimeout(timeout);
			p.cycleTimeout = 0;
		}
		var cb = opts.onPagerEvent || opts.pagerClick; // pagerClick is deprecated
		if ($.isFunction(cb))
			cb(opts.nextSlide, els[opts.nextSlide]);
		go(els,opts,1,opts.currSlide < i); // trigger the trans
//		return false; // <== allow bubble
	};
	
	if ( /mouseenter|mouseover/i.test(opts.pagerEvent) ) {
		$a.hover(pagerFn, function(){/* no-op */} );
	}
	else {
		$a.bind(opts.pagerEvent, pagerFn);
	}
	
	if ( ! /^click/.test(opts.pagerEvent) && !opts.allowPagerClickBubble)
		$a.bind('click.cycle', function(){return false;}); // suppress click
	
	var cont = opts.$cont[0];
	var pauseFlag = false; // https://github.com/malsup/cycle/issues/44
	if (opts.pauseOnPagerHover) {
		$a.hover(
			function() { 
				pauseFlag = true;
				cont.cyclePause++; 
				triggerPause(cont,true,true);
			}, function() { 
				if (pauseFlag)
					cont.cyclePause--; 
				triggerPause(cont,true,true);
			} 
		);
	}
};

// helper fn to calculate the number of slides between the current and the next
$.fn.cycle.hopsFromLast = function(opts, fwd) {
	var hops, l = opts.lastSlide, c = opts.currSlide;
	if (fwd)
		hops = c > l ? c - l : opts.slideCount - l;
	else
		hops = c < l ? l - c : l + opts.slideCount - c;
	return hops;
};

// fix clearType problems in ie6 by setting an explicit bg color
// (otherwise text slides look horrible during a fade transition)
function clearTypeFix($slides) {
	debug('applying clearType background-color hack');
	function hex(s) {
		s = parseInt(s,10).toString(16);
		return s.length < 2 ? '0'+s : s;
	}
	function getBg(e) {
		for ( ; e && e.nodeName.toLowerCase() != 'html'; e = e.parentNode) {
			var v = $.css(e,'background-color');
			if (v && v.indexOf('rgb') >= 0 ) {
				var rgb = v.match(/\d+/g);
				return '#'+ hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
			}
			if (v && v != 'transparent')
				return v;
		}
		return '#ffffff';
	}
	$slides.each(function() { $(this).css('background-color', getBg(this)); });
}

// reset common props before the next transition
$.fn.cycle.commonReset = function(curr,next,opts,w,h,rev) {
	$(opts.elements).not(curr).hide();
	if (typeof opts.cssBefore.opacity == 'undefined')
		opts.cssBefore.opacity = 1;
	opts.cssBefore.display = 'block';
	if (opts.slideResize && w !== false && next.cycleW > 0)
		opts.cssBefore.width = next.cycleW;
	if (opts.slideResize && h !== false && next.cycleH > 0)
		opts.cssBefore.height = next.cycleH;
	opts.cssAfter = opts.cssAfter || {};
	opts.cssAfter.display = 'none';
	$(curr).css('zIndex',opts.slideCount + (rev === true ? 1 : 0));
	$(next).css('zIndex',opts.slideCount + (rev === true ? 0 : 1));
};

// the actual fn for effecting a transition
$.fn.cycle.custom = function(curr, next, opts, cb, fwd, speedOverride) {
	var $l = $(curr), $n = $(next);
	var speedIn = opts.speedIn, speedOut = opts.speedOut, easeIn = opts.easeIn, easeOut = opts.easeOut, animInDelay = opts.animInDelay, animOutDelay = opts.animOutDelay;
	$n.css(opts.cssBefore);
	if (speedOverride) {
		if (typeof speedOverride == 'number')
			speedIn = speedOut = speedOverride;
		else
			speedIn = speedOut = 1;
		easeIn = easeOut = null;
	}
	var fn = function() {
		$n.delay(animInDelay).animate(opts.animIn, speedIn, easeIn, function() {
			cb();
		});
	};
	$l.delay(animOutDelay).animate(opts.animOut, speedOut, easeOut, function() {
		$l.css(opts.cssAfter);
		if (!opts.sync) 
			fn();
	});
	if (opts.sync) fn();
};

// transition definitions - only fade is defined here, transition pack defines the rest
$.fn.cycle.transitions = {
	fade: function($cont, $slides, opts) {
		$slides.not(':eq('+opts.currSlide+')').css('opacity',0);
		opts.before.push(function(curr,next,opts) {
			$.fn.cycle.commonReset(curr,next,opts);
			opts.cssBefore.opacity = 0;
		});
		opts.animIn	   = { opacity: 1 };
		opts.animOut   = { opacity: 0 };
		opts.cssBefore = { top: 0, left: 0 };
	}
};

$.fn.cycle.ver = function() { return ver; };

// override these globally if you like (they are all optional)
$.fn.cycle.defaults = {
    activePagerClass: 'activeSlide', // class name used for the active pager link
    after:            null,     // transition callback (scope set to element that was shown):  function(currSlideElement, nextSlideElement, options, forwardFlag)
    allowPagerClickBubble: false, // allows or prevents click event on pager anchors from bubbling
    animIn:           null,     // properties that define how the slide animates in
    animInDelay:      0,        // allows delay before next slide transitions in	
    animOut:          null,     // properties that define how the slide animates out
    animOutDelay:     0,        // allows delay before current slide transitions out
    aspect:           false,    // preserve aspect ratio during fit resizing, cropping if necessary (must be used with fit option)
    autostop:         0,        // true to end slideshow after X transitions (where X == slide count)
    autostopCount:    0,        // number of transitions (optionally used with autostop to define X)
    backwards:        false,    // true to start slideshow at last slide and move backwards through the stack
    before:           null,     // transition callback (scope set to element to be shown):     function(currSlideElement, nextSlideElement, options, forwardFlag)
    center:           null,     // set to true to have cycle add top/left margin to each slide (use with width and height options)
    cleartype:        !$.support.opacity,  // true if clearType corrections should be applied (for IE)
    cleartypeNoBg:    false,    // set to true to disable extra cleartype fixing (leave false to force background color setting on slides)
    containerResize:  1,        // resize container to fit largest slide
    containerResizeHeight:  0,  // resize containers height to fit the largest slide but leave the width dynamic
    continuous:       0,        // true to start next transition immediately after current one completes
    cssAfter:         null,     // properties that defined the state of the slide after transitioning out
    cssBefore:        null,     // properties that define the initial state of the slide before transitioning in
    delay:            0,        // additional delay (in ms) for first transition (hint: can be negative)
    easeIn:           null,     // easing for "in" transition
    easeOut:          null,     // easing for "out" transition
    easing:           null,     // easing method for both in and out transitions
    end:              null,     // callback invoked when the slideshow terminates (use with autostop or nowrap options): function(options)
    fastOnEvent:      0,        // force fast transitions when triggered manually (via pager or prev/next); value == time in ms
    fit:              0,        // force slides to fit container
    fx:               'fade',   // name of transition effect (or comma separated names, ex: 'fade,scrollUp,shuffle')
    fxFn:             null,     // function used to control the transition: function(currSlideElement, nextSlideElement, options, afterCalback, forwardFlag)
    height:           'auto',   // container height (if the 'fit' option is true, the slides will be set to this height as well)
    manualTrump:      true,     // causes manual transition to stop an active transition instead of being ignored
    metaAttr:         'cycle',  // data- attribute that holds the option data for the slideshow
    next:             null,     // element, jQuery object, or jQuery selector string for the element to use as event trigger for next slide
    nowrap:           0,        // true to prevent slideshow from wrapping
    onPagerEvent:     null,     // callback fn for pager events: function(zeroBasedSlideIndex, slideElement)
    onPrevNextEvent:  null,     // callback fn for prev/next events: function(isNext, zeroBasedSlideIndex, slideElement)
    pager:            null,     // element, jQuery object, or jQuery selector string for the element to use as pager container
    pagerAnchorBuilder: null,   // callback fn for building anchor links:  function(index, DOMelement)
    pagerEvent:       'click.cycle', // name of event which drives the pager navigation
    pause:            0,        // true to enable "pause on hover"
    pauseOnPagerHover: 0,       // true to pause when hovering over pager link
    prev:             null,     // element, jQuery object, or jQuery selector string for the element to use as event trigger for previous slide
    prevNextEvent:    'click.cycle',// event which drives the manual transition to the previous or next slide
    random:           0,        // true for random, false for sequence (not applicable to shuffle fx)
    randomizeEffects: 1,        // valid when multiple effects are used; true to make the effect sequence random
    requeueOnImageNotLoaded: true, // requeue the slideshow if any image slides are not yet loaded
    requeueTimeout:   250,      // ms delay for requeue
    rev:              0,        // causes animations to transition in reverse (for effects that support it such as scrollHorz/scrollVert/shuffle)
    shuffle:          null,     // coords for shuffle animation, ex: { top:15, left: 200 }
    skipInitializationCallbacks: false, // set to true to disable the first before/after callback that occurs prior to any transition
    slideExpr:        null,     // expression for selecting slides (if something other than all children is required)
    slideResize:      1,        // force slide width/height to fixed size before every transition
    speed:            1000,     // speed of the transition (any valid fx speed value)
    speedIn:          null,     // speed of the 'in' transition
    speedOut:         null,     // speed of the 'out' transition
    startingSlide:    undefined,// zero-based index of the first slide to be displayed
    sync:             1,        // true if in/out transitions should occur simultaneously
    timeout:          4000,     // milliseconds between slide transitions (0 to disable auto advance)
    timeoutFn:        null,     // callback for determining per-slide timeout value:  function(currSlideElement, nextSlideElement, options, forwardFlag)
    updateActivePagerLink: null,// callback fn invoked to update the active pager link (adds/removes activePagerClass style)
    width:            null      // container width (if the 'fit' option is true, the slides will be set to this width as well)
};

})(jQuery);


/*!
 * jQuery Cycle Plugin Transition Definitions
 * This script is a plugin for the jQuery Cycle Plugin
 * Examples and documentation at: http://malsup.com/jquery/cycle/
 * Copyright (c) 2007-2010 M. Alsup
 * Version:	 2.73
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */
(function($) {
"use strict";

//
// These functions define slide initialization and properties for the named
// transitions. To save file size feel free to remove any of these that you
// don't need.
//
$.fn.cycle.transitions.none = function($cont, $slides, opts) {
	opts.fxFn = function(curr,next,opts,after){
		$(next).show();
		$(curr).hide();
		after();
	};
};

// not a cross-fade, fadeout only fades out the top slide
$.fn.cycle.transitions.fadeout = function($cont, $slides, opts) {
	$slides.not(':eq('+opts.currSlide+')').css({ display: 'block', 'opacity': 1 });
	opts.before.push(function(curr,next,opts,w,h,rev) {
		$(curr).css('zIndex',opts.slideCount + (rev !== true ? 1 : 0));
		$(next).css('zIndex',opts.slideCount + (rev !== true ? 0 : 1));
	});
	opts.animIn.opacity = 1;
	opts.animOut.opacity = 0;
	opts.cssBefore.opacity = 1;
	opts.cssBefore.display = 'block';
	opts.cssAfter.zIndex = 0;
};

// scrollUp/Down/Left/Right
$.fn.cycle.transitions.scrollUp = function($cont, $slides, opts) {
	$cont.css('overflow','hidden');
	opts.before.push($.fn.cycle.commonReset);
	var h = $cont.height();
	opts.cssBefore.top = h;
	opts.cssBefore.left = 0;
	opts.cssFirst.top = 0;
	opts.animIn.top = 0;
	opts.animOut.top = -h;
};
$.fn.cycle.transitions.scrollDown = function($cont, $slides, opts) {
	$cont.css('overflow','hidden');
	opts.before.push($.fn.cycle.commonReset);
	var h = $cont.height();
	opts.cssFirst.top = 0;
	opts.cssBefore.top = -h;
	opts.cssBefore.left = 0;
	opts.animIn.top = 0;
	opts.animOut.top = h;
};
$.fn.cycle.transitions.scrollLeft = function($cont, $slides, opts) {
	$cont.css('overflow','hidden');
	opts.before.push($.fn.cycle.commonReset);
	var w = $cont.width();
	opts.cssFirst.left = 0;
	opts.cssBefore.left = w;
	opts.cssBefore.top = 0;
	opts.animIn.left = 0;
	opts.animOut.left = 0-w;
};
$.fn.cycle.transitions.scrollRight = function($cont, $slides, opts) {
	$cont.css('overflow','hidden');
	opts.before.push($.fn.cycle.commonReset);
	var w = $cont.width();
	opts.cssFirst.left = 0;
	opts.cssBefore.left = -w;
	opts.cssBefore.top = 0;
	opts.animIn.left = 0;
	opts.animOut.left = w;
};
$.fn.cycle.transitions.scrollHorz = function($cont, $slides, opts) {
	$cont.css('overflow','hidden').width();
	opts.before.push(function(curr, next, opts, fwd) {
		if (opts.rev)
			fwd = !fwd;
		$.fn.cycle.commonReset(curr,next,opts);
		opts.cssBefore.left = fwd ? (next.cycleW-1) : (1-next.cycleW);
		opts.animOut.left = fwd ? -curr.cycleW : curr.cycleW;
	});
	opts.cssFirst.left = 0;
	opts.cssBefore.top = 0;
	opts.animIn.left = 0;
	opts.animOut.top = 0;
};
$.fn.cycle.transitions.scrollVert = function($cont, $slides, opts) {
	$cont.css('overflow','hidden');
	opts.before.push(function(curr, next, opts, fwd) {
		if (opts.rev)
			fwd = !fwd;
		$.fn.cycle.commonReset(curr,next,opts);
		opts.cssBefore.top = fwd ? (1-next.cycleH) : (next.cycleH-1);
		opts.animOut.top = fwd ? curr.cycleH : -curr.cycleH;
	});
	opts.cssFirst.top = 0;
	opts.cssBefore.left = 0;
	opts.animIn.top = 0;
	opts.animOut.left = 0;
};

// slideX/slideY
$.fn.cycle.transitions.slideX = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$(opts.elements).not(curr).hide();
		$.fn.cycle.commonReset(curr,next,opts,false,true);
		opts.animIn.width = next.cycleW;
	});
	opts.cssBefore.left = 0;
	opts.cssBefore.top = 0;
	opts.cssBefore.width = 0;
	opts.animIn.width = 'show';
	opts.animOut.width = 0;
};
$.fn.cycle.transitions.slideY = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$(opts.elements).not(curr).hide();
		$.fn.cycle.commonReset(curr,next,opts,true,false);
		opts.animIn.height = next.cycleH;
	});
	opts.cssBefore.left = 0;
	opts.cssBefore.top = 0;
	opts.cssBefore.height = 0;
	opts.animIn.height = 'show';
	opts.animOut.height = 0;
};

// shuffle
$.fn.cycle.transitions.shuffle = function($cont, $slides, opts) {
	var i, w = $cont.css('overflow', 'visible').width();
	$slides.css({left: 0, top: 0});
	opts.before.push(function(curr,next,opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,true,true);
	});
	// only adjust speed once!
	if (!opts.speedAdjusted) {
		opts.speed = opts.speed / 2; // shuffle has 2 transitions
		opts.speedAdjusted = true;
	}
	opts.random = 0;
	opts.shuffle = opts.shuffle || {left:-w, top:15};
	opts.els = [];
	for (i=0; i < $slides.length; i++)
		opts.els.push($slides[i]);

	for (i=0; i < opts.currSlide; i++)
		opts.els.push(opts.els.shift());

	// custom transition fn (hat tip to Benjamin Sterling for this bit of sweetness!)
	opts.fxFn = function(curr, next, opts, cb, fwd) {
		if (opts.rev)
			fwd = !fwd;
		var $el = fwd ? $(curr) : $(next);
		$(next).css(opts.cssBefore);
		var count = opts.slideCount;
		$el.animate(opts.shuffle, opts.speedIn, opts.easeIn, function() {
			var hops = $.fn.cycle.hopsFromLast(opts, fwd);
			for (var k=0; k < hops; k++) {
				if (fwd)
					opts.els.push(opts.els.shift());
				else
					opts.els.unshift(opts.els.pop());
			}
			if (fwd) {
				for (var i=0, len=opts.els.length; i < len; i++)
					$(opts.els[i]).css('z-index', len-i+count);
			}
			else {
				var z = $(curr).css('z-index');
				$el.css('z-index', parseInt(z,10)+1+count);
			}
			$el.animate({left:0, top:0}, opts.speedOut, opts.easeOut, function() {
				$(fwd ? this : curr).hide();
				if (cb) cb();
			});
		});
	};
	$.extend(opts.cssBefore, { display: 'block', opacity: 1, top: 0, left: 0 });
};

// turnUp/Down/Left/Right
$.fn.cycle.transitions.turnUp = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,false);
		opts.cssBefore.top = next.cycleH;
		opts.animIn.height = next.cycleH;
		opts.animOut.width = next.cycleW;
	});
	opts.cssFirst.top = 0;
	opts.cssBefore.left = 0;
	opts.cssBefore.height = 0;
	opts.animIn.top = 0;
	opts.animOut.height = 0;
};
$.fn.cycle.transitions.turnDown = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,false);
		opts.animIn.height = next.cycleH;
		opts.animOut.top   = curr.cycleH;
	});
	opts.cssFirst.top = 0;
	opts.cssBefore.left = 0;
	opts.cssBefore.top = 0;
	opts.cssBefore.height = 0;
	opts.animOut.height = 0;
};
$.fn.cycle.transitions.turnLeft = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,true);
		opts.cssBefore.left = next.cycleW;
		opts.animIn.width = next.cycleW;
	});
	opts.cssBefore.top = 0;
	opts.cssBefore.width = 0;
	opts.animIn.left = 0;
	opts.animOut.width = 0;
};
$.fn.cycle.transitions.turnRight = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,true);
		opts.animIn.width = next.cycleW;
		opts.animOut.left = curr.cycleW;
	});
	$.extend(opts.cssBefore, { top: 0, left: 0, width: 0 });
	opts.animIn.left = 0;
	opts.animOut.width = 0;
};

// zoom
$.fn.cycle.transitions.zoom = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,false,true);
		opts.cssBefore.top = next.cycleH/2;
		opts.cssBefore.left = next.cycleW/2;
		$.extend(opts.animIn, { top: 0, left: 0, width: next.cycleW, height: next.cycleH });
		$.extend(opts.animOut, { width: 0, height: 0, top: curr.cycleH/2, left: curr.cycleW/2 });
	});
	opts.cssFirst.top = 0;
	opts.cssFirst.left = 0;
	opts.cssBefore.width = 0;
	opts.cssBefore.height = 0;
};

// fadeZoom
$.fn.cycle.transitions.fadeZoom = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,false);
		opts.cssBefore.left = next.cycleW/2;
		opts.cssBefore.top = next.cycleH/2;
		$.extend(opts.animIn, { top: 0, left: 0, width: next.cycleW, height: next.cycleH });
	});
	opts.cssBefore.width = 0;
	opts.cssBefore.height = 0;
	opts.animOut.opacity = 0;
};

// blindX
$.fn.cycle.transitions.blindX = function($cont, $slides, opts) {
	var w = $cont.css('overflow','hidden').width();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts);
		opts.animIn.width = next.cycleW;
		opts.animOut.left   = curr.cycleW;
	});
	opts.cssBefore.left = w;
	opts.cssBefore.top = 0;
	opts.animIn.left = 0;
	opts.animOut.left = w;
};
// blindY
$.fn.cycle.transitions.blindY = function($cont, $slides, opts) {
	var h = $cont.css('overflow','hidden').height();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts);
		opts.animIn.height = next.cycleH;
		opts.animOut.top   = curr.cycleH;
	});
	opts.cssBefore.top = h;
	opts.cssBefore.left = 0;
	opts.animIn.top = 0;
	opts.animOut.top = h;
};
// blindZ
$.fn.cycle.transitions.blindZ = function($cont, $slides, opts) {
	var h = $cont.css('overflow','hidden').height();
	var w = $cont.width();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts);
		opts.animIn.height = next.cycleH;
		opts.animOut.top   = curr.cycleH;
	});
	opts.cssBefore.top = h;
	opts.cssBefore.left = w;
	opts.animIn.top = 0;
	opts.animIn.left = 0;
	opts.animOut.top = h;
	opts.animOut.left = w;
};

// growX - grow horizontally from centered 0 width
$.fn.cycle.transitions.growX = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,true);
		opts.cssBefore.left = this.cycleW/2;
		opts.animIn.left = 0;
		opts.animIn.width = this.cycleW;
		opts.animOut.left = 0;
	});
	opts.cssBefore.top = 0;
	opts.cssBefore.width = 0;
};
// growY - grow vertically from centered 0 height
$.fn.cycle.transitions.growY = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,false);
		opts.cssBefore.top = this.cycleH/2;
		opts.animIn.top = 0;
		opts.animIn.height = this.cycleH;
		opts.animOut.top = 0;
	});
	opts.cssBefore.height = 0;
	opts.cssBefore.left = 0;
};

// curtainX - squeeze in both edges horizontally
$.fn.cycle.transitions.curtainX = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,true,true);
		opts.cssBefore.left = next.cycleW/2;
		opts.animIn.left = 0;
		opts.animIn.width = this.cycleW;
		opts.animOut.left = curr.cycleW/2;
		opts.animOut.width = 0;
	});
	opts.cssBefore.top = 0;
	opts.cssBefore.width = 0;
};
// curtainY - squeeze in both edges vertically
$.fn.cycle.transitions.curtainY = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,false,true);
		opts.cssBefore.top = next.cycleH/2;
		opts.animIn.top = 0;
		opts.animIn.height = next.cycleH;
		opts.animOut.top = curr.cycleH/2;
		opts.animOut.height = 0;
	});
	opts.cssBefore.height = 0;
	opts.cssBefore.left = 0;
};

// cover - curr slide covered by next slide
$.fn.cycle.transitions.cover = function($cont, $slides, opts) {
	var d = opts.direction || 'left';
	var w = $cont.css('overflow','hidden').width();
	var h = $cont.height();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts);
		opts.cssAfter.display = '';
		if (d == 'right')
			opts.cssBefore.left = -w;
		else if (d == 'up')
			opts.cssBefore.top = h;
		else if (d == 'down')
			opts.cssBefore.top = -h;
		else
			opts.cssBefore.left = w;
	});
	opts.animIn.left = 0;
	opts.animIn.top = 0;
	opts.cssBefore.top = 0;
	opts.cssBefore.left = 0;
};

// uncover - curr slide moves off next slide
$.fn.cycle.transitions.uncover = function($cont, $slides, opts) {
	var d = opts.direction || 'left';
	var w = $cont.css('overflow','hidden').width();
	var h = $cont.height();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,true,true);
		if (d == 'right')
			opts.animOut.left = w;
		else if (d == 'up')
			opts.animOut.top = -h;
		else if (d == 'down')
			opts.animOut.top = h;
		else
			opts.animOut.left = -w;
	});
	opts.animIn.left = 0;
	opts.animIn.top = 0;
	opts.cssBefore.top = 0;
	opts.cssBefore.left = 0;
};

// toss - move top slide and fade away
$.fn.cycle.transitions.toss = function($cont, $slides, opts) {
	var w = $cont.css('overflow','visible').width();
	var h = $cont.height();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,true,true);
		// provide default toss settings if animOut not provided
		if (!opts.animOut.left && !opts.animOut.top)
			$.extend(opts.animOut, { left: w*2, top: -h/2, opacity: 0 });
		else
			opts.animOut.opacity = 0;
	});
	opts.cssBefore.left = 0;
	opts.cssBefore.top = 0;
	opts.animIn.left = 0;
};

// wipe - clip animation
$.fn.cycle.transitions.wipe = function($cont, $slides, opts) {
	var w = $cont.css('overflow','hidden').width();
	var h = $cont.height();
	opts.cssBefore = opts.cssBefore || {};
	var clip;
	if (opts.clip) {
		if (/l2r/.test(opts.clip))
			clip = 'rect(0px 0px '+h+'px 0px)';
		else if (/r2l/.test(opts.clip))
			clip = 'rect(0px '+w+'px '+h+'px '+w+'px)';
		else if (/t2b/.test(opts.clip))
			clip = 'rect(0px '+w+'px 0px 0px)';
		else if (/b2t/.test(opts.clip))
			clip = 'rect('+h+'px '+w+'px '+h+'px 0px)';
		else if (/zoom/.test(opts.clip)) {
			var top = parseInt(h/2,10);
			var left = parseInt(w/2,10);
			clip = 'rect('+top+'px '+left+'px '+top+'px '+left+'px)';
		}
	}

	opts.cssBefore.clip = opts.cssBefore.clip || clip || 'rect(0px 0px 0px 0px)';

	var d = opts.cssBefore.clip.match(/(\d+)/g);
	var t = parseInt(d[0],10), r = parseInt(d[1],10), b = parseInt(d[2],10), l = parseInt(d[3],10);

	opts.before.push(function(curr, next, opts) {
		if (curr == next) return;
		var $curr = $(curr), $next = $(next);
		$.fn.cycle.commonReset(curr,next,opts,true,true,false);
		opts.cssAfter.display = 'block';

		var step = 1, count = parseInt((opts.speedIn / 13),10) - 1;
		(function f() {
			var tt = t ? t - parseInt(step * (t/count),10) : 0;
			var ll = l ? l - parseInt(step * (l/count),10) : 0;
			var bb = b < h ? b + parseInt(step * ((h-b)/count || 1),10) : h;
			var rr = r < w ? r + parseInt(step * ((w-r)/count || 1),10) : w;
			$next.css({ clip: 'rect('+tt+'px '+rr+'px '+bb+'px '+ll+'px)' });
			(step++ <= count) ? setTimeout(f, 13) : $curr.css('display', 'none');
		})();
	});
	$.extend(opts.cssBefore, { display: 'block', opacity: 1, top: 0, left: 0 });
	opts.animIn	   = { left: 0 };
	opts.animOut   = { left: 0 };
};

})(jQuery);

/**
 * Copyright (c) 2007-2012 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * @author Ariel Flesler
 * @version 1.4.3.1
 */
;(function($){var h=$.scrollTo=function(a,b,c){$(window).scrollTo(a,b,c)};h.defaults={axis:'xy',duration:parseFloat($.fn.jquery)>=1.3?0:1,limit:true};h.window=function(a){return $(window)._scrollable()};$.fn._scrollable=function(){return this.map(function(){var a=this,isWin=!a.nodeName||$.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!isWin)return a;var b=(a.contentWindow||a).document||a.ownerDocument||a;return/webkit/i.test(navigator.userAgent)||b.compatMode=='BackCompat'?b.body:b.documentElement})};$.fn.scrollTo=function(e,f,g){if(typeof f=='object'){g=f;f=0}if(typeof g=='function')g={onAfter:g};if(e=='max')e=9e9;g=$.extend({},h.defaults,g);f=f||g.duration;g.queue=g.queue&&g.axis.length>1;if(g.queue)f/=2;g.offset=both(g.offset);g.over=both(g.over);return this._scrollable().each(function(){if(e==null)return;var d=this,$elem=$(d),targ=e,toff,attr={},win=$elem.is('html,body');switch(typeof targ){case'number':case'string':if(/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(targ)){targ=both(targ);break}targ=$(targ,this);if(!targ.length)return;case'object':if(targ.is||targ.style)toff=(targ=$(targ)).offset()}$.each(g.axis.split(''),function(i,a){var b=a=='x'?'Left':'Top',pos=b.toLowerCase(),key='scroll'+b,old=d[key],max=h.max(d,a);if(toff){attr[key]=toff[pos]+(win?0:old-$elem.offset()[pos]);if(g.margin){attr[key]-=parseInt(targ.css('margin'+b))||0;attr[key]-=parseInt(targ.css('border'+b+'Width'))||0}attr[key]+=g.offset[pos]||0;if(g.over[pos])attr[key]+=targ[a=='x'?'width':'height']()*g.over[pos]}else{var c=targ[pos];attr[key]=c.slice&&c.slice(-1)=='%'?parseFloat(c)/100*max:c}if(g.limit&&/^\d+$/.test(attr[key]))attr[key]=attr[key]<=0?0:Math.min(attr[key],max);if(!i&&g.queue){if(old!=attr[key])animate(g.onAfterFirst);delete attr[key]}});animate(g.onAfter);function animate(a){$elem.animate(attr,f,g.easing,a&&function(){a.call(this,e,g)})}}).end()};h.max=function(a,b){var c=b=='x'?'Width':'Height',scroll='scroll'+c;if(!$(a).is('html,body'))return a[scroll]-$(a)[c.toLowerCase()]();var d='client'+c,html=a.ownerDocument.documentElement,body=a.ownerDocument.body;return Math.max(html[scroll],body[scroll])-Math.min(html[d],body[d])};function both(a){return typeof a=='object'?a:{top:a,left:a}}})(jQuery);
/*!
	Autosize v1.18.4 - 2014-01-11
	Automatically adjust textarea height based on user input.
	(c) 2014 Jack Moore - http://www.jacklmoore.com/autosize
	license: http://www.opensource.org/licenses/mit-license.php
*/
(function ($) {
	var
	defaults = {
		className: 'autosizejs',
		append: '',
		callback: false,
		resizeDelay: 30,
		placeholder: true
	},

	// border:0 is unnecessary, but avoids a bug in Firefox on OSX
	copy = '<textarea tabindex="-1" style="position:absolute; top:-999px; left:0; right:auto; bottom:auto; border:0; padding: 0; -moz-box-sizing:content-box; -webkit-box-sizing:content-box; box-sizing:content-box; word-wrap:break-word; height:0 !important; min-height:0 !important; overflow:hidden; transition:none; -webkit-transition:none; -moz-transition:none;"/>',

	// line-height is conditionally included because IE7/IE8/old Opera do not return the correct value.
	typographyStyles = [
		'fontFamily',
		'fontSize',
		'fontWeight',
		'fontStyle',
		'letterSpacing',
		'textTransform',
		'wordSpacing',
		'textIndent'
	],

	// to keep track which textarea is being mirrored when adjust() is called.
	mirrored,

	// the mirror element, which is used to calculate what size the mirrored element should be.
	mirror = $(copy).data('autosize', true)[0];

	// test that line-height can be accurately copied.
	mirror.style.lineHeight = '99px';
	if ($(mirror).css('lineHeight') === '99px') {
		typographyStyles.push('lineHeight');
	}
	mirror.style.lineHeight = '';

	$.fn.autosize = function (options) {
		if (!this.length) {
			return this;
		}

		options = $.extend({}, defaults, options || {});

		if (mirror.parentNode !== document.body) {
			$(document.body).append(mirror);
		}

		return this.each(function () {
			var
			ta = this,
			$ta = $(ta),
			maxHeight,
			minHeight,
			boxOffset = 0,
			callback = $.isFunction(options.callback),
			originalStyles = {
				height: ta.style.height,
				overflow: ta.style.overflow,
				overflowY: ta.style.overflowY,
				wordWrap: ta.style.wordWrap,
				resize: ta.style.resize
			},
			timeout,
			width = $ta.width();

			if ($ta.data('autosize')) {
				// exit if autosize has already been applied, or if the textarea is the mirror element.
				return;
			}
			$ta.data('autosize', true);

			if ($ta.css('box-sizing') === 'border-box' || $ta.css('-moz-box-sizing') === 'border-box' || $ta.css('-webkit-box-sizing') === 'border-box'){
				boxOffset = $ta.outerHeight() - $ta.height();
			}

			// IE8 and lower return 'auto', which parses to NaN, if no min-height is set.
			minHeight = Math.max(parseInt($ta.css('minHeight'), 10) - boxOffset || 0, $ta.height());

			$ta.css({
				overflow: 'hidden',
				overflowY: 'hidden',
				wordWrap: 'break-word', // horizontal overflow is hidden, so break-word is necessary for handling words longer than the textarea width
				resize: ($ta.css('resize') === 'none' || $ta.css('resize') === 'vertical') ? 'none' : 'horizontal'
			});

			// The mirror width must exactly match the textarea width, so using getBoundingClientRect because it doesn't round the sub-pixel value.
			// window.getComputedStyle, getBoundingClientRect returning a width are unsupported, but also unneeded in IE8 and lower.
			function setWidth() {
				var width;
				var style = window.getComputedStyle ? window.getComputedStyle(ta, null) : false;
				
				if (style) {

					width = ta.getBoundingClientRect().width;

					if (width === 0) {
						width = parseInt(style.width,10);
					}

					$.each(['paddingLeft', 'paddingRight', 'borderLeftWidth', 'borderRightWidth'], function(i,val){
						width -= parseInt(style[val],10);
					});
				} else {
					width = Math.max($ta.width(), 0);
				}

				mirror.style.width = width + 'px';
			}

			function initMirror() {
				var styles = {};

				mirrored = ta;
				mirror.className = options.className;
				maxHeight = parseInt($ta.css('maxHeight'), 10);

				// mirror is a duplicate textarea located off-screen that
				// is automatically updated to contain the same text as the
				// original textarea.  mirror always has a height of 0.
				// This gives a cross-browser supported way getting the actual
				// height of the text, through the scrollTop property.
				$.each(typographyStyles, function(i,val){
					styles[val] = $ta.css(val);
				});
				$(mirror).css(styles);

				setWidth();

				// Chrome-specific fix:
				// When the textarea y-overflow is hidden, Chrome doesn't reflow the text to account for the space
				// made available by removing the scrollbar. This workaround triggers the reflow for Chrome.
				if (window.chrome) {
					var width = ta.style.width;
					ta.style.width = '0px';
					var ignore = ta.offsetWidth;
					ta.style.width = width;
				}
			}

			// Using mainly bare JS in this function because it is going
			// to fire very often while typing, and needs to very efficient.
			function adjust() {
				var height, original;

				if (mirrored !== ta) {
					initMirror();
				} else {
					setWidth();
				}

				if (!ta.value && options.placeholder) {
					// If the textarea is empty, copy the placeholder text into 
					// the mirror control and use that for sizing so that we 
					// don't end up with placeholder getting trimmed.
					mirror.value = ($(ta).attr("placeholder") || '') + options.append;
				} else {
					mirror.value = ta.value + options.append;
				}

				mirror.style.overflowY = ta.style.overflowY;
				original = parseInt(ta.style.height,10);

				// Setting scrollTop to zero is needed in IE8 and lower for the next step to be accurately applied
				mirror.scrollTop = 0;

				mirror.scrollTop = 9e4;

				// Using scrollTop rather than scrollHeight because scrollHeight is non-standard and includes padding.
				height = mirror.scrollTop;

				if (maxHeight && height > maxHeight) {
					ta.style.overflowY = 'scroll';
					height = maxHeight;
				} else {
					ta.style.overflowY = 'hidden';
					if (height < minHeight) {
						height = minHeight;
					}
				}

				height += boxOffset;

				if (original !== height) {
					ta.style.height = height + 'px';
					if (callback) {
						options.callback.call(ta,ta);
					}
				}
			}

			function resize () {
				clearTimeout(timeout);
				timeout = setTimeout(function(){
					var newWidth = $ta.width();

					if (newWidth !== width) {
						width = newWidth;
						adjust();
					}
				}, parseInt(options.resizeDelay,10));
			}

			if ('onpropertychange' in ta) {
				if ('oninput' in ta) {
					// Detects IE9.  IE9 does not fire onpropertychange or oninput for deletions,
					// so binding to onkeyup to catch most of those occasions.  There is no way that I
					// know of to detect something like 'cut' in IE9.
					$ta.on('input.autosize keyup.autosize', adjust);
				} else {
					// IE7 / IE8
					$ta.on('propertychange.autosize', function(){
						if(event.propertyName === 'value'){
							adjust();
						}
					});
				}
			} else {
				// Modern Browsers
				$ta.on('input.autosize', adjust);
			}

			// Set options.resizeDelay to false if using fixed-width textarea elements.
			// Uses a timeout and width check to reduce the amount of times adjust needs to be called after window resize.

			if (options.resizeDelay !== false) {
				$(window).on('resize.autosize', resize);
			}

			// Event for manual triggering if needed.
			// Should only be needed when the value of the textarea is changed through JavaScript rather than user input.
			$ta.on('autosize.resize', adjust);

			// Event for manual triggering that also forces the styles to update as well.
			// Should only be needed if one of typography styles of the textarea change, and the textarea is already the target of the adjust method.
			$ta.on('autosize.resizeIncludeStyle', function() {
				mirrored = null;
				adjust();
			});

			$ta.on('autosize.destroy', function(){
				mirrored = null;
				clearTimeout(timeout);
				$(window).off('resize', resize);
				$ta
					.off('autosize')
					.off('.autosize')
					.css(originalStyles)
					.removeData('autosize');
			});

			// Call adjust in case the textarea already contains text.
			adjust();
		});
	};
}(window.jQuery || window.$)); // jQuery or jQuery-like library, such as Zepto

$(function(){
    /**
     * Refreshable record list
     */
    var blocked = false;
    var $list = $('.record-list-ajax');
    var fadeTimeout = 200;
    var showTimeout = 50;
    var $loader = $('<img src="/upload/landing/adwords/ajax-loader.gif" />').css({
        display: 'block',
        margin: '20px auto'
    });

    if( 1 !== $list.length ) return false;

    var loadRecords = function()
    {
        if( blocked ) return false;

        if( $(window).scrollTop() + $(window).height() * 1.5 < $(document).height() ) return false;

        blocked = true;
        $loader.insertAfter($list);

        $.ajax({
            url: $list.data('ajax-url'),
            data: { offset: $list.find('.record-list-ajax-element').size() },
            dataType: 'html',
            success:  function( data )
            {
                var $elements = $(data).filter('.record-list-ajax-element');
                $loader.remove();


                if( ! $elements.length ) {
                    return $(window).off('scroll.recordsLoad');
                }

                $elements.hide();
                $list.append($elements);
                blocked = false;

                var $aQueue = $({});

                $elements.each(function(i, el){
                    $aQueue.queue('show-block', function(next) {
                        $(el).fadeIn(fadeTimeout, function(){
                            var thLi = $(this),
                                thCommentHeight = thLi.find(".comment_text_inner").height(),
                                btnToggleComment = $("<a href='#' class='toggle_data'><span class='show_more'>Развернуть</span><span class='show_less'>Свернуть</span></a>");

                            if ( thCommentHeight > 130 && thCommentHeight < 360 ){
                                thLi.attr("data-size", "x2").find(".comment_text_outer").after(btnToggleComment);
                            } else if ( thCommentHeight > 360 ) {
                                thLi.attr("data-size", "x3").find(".comment_text_outer").after(btnToggleComment);
                            }
                        });
                        setTimeout(next, showTimeout);
                    });
                });

                $aQueue.dequeue('show-block');
            }
        });
    };

    $(window).on('scroll.recordsLoad', function(){
        loadRecords();
    });

    loadRecords();

});

$(document).ready(function(){
    $('[data-comment=add]').each(function(){
        var $self = $(this),
            $form = $self.find('form');

        $form.on('submit', function(){
			$.ajax({
                url: $form.attr('action'),
                type: $form.attr('method') || 'POST',
                data: $form.serialize(),
                timeout: 15000,
                success: function(response) {
                    var $comment = jQuery(response);
                    $comment.insertBefore($self);
                },
                error: function(response) {
                    alert(response);
                }
            });

            return false;
        });

    });
});
$(document).ready(function(){
    $('.vacancy-top-bg').on('click', function(){
        if($(this).parents('.vacancy-block').hasClass('active')){
            $(this).parents('.vacancy-block').find('.vacancy-block-arrow-text').text('Развернуть');
            $(this).parents('.vacancy-block').removeClass('active');
            return false;
        } else {
            $(this).parents('.vacancy-main-block').find('.vacancy-block').removeClass('active');
            $(this).parents('.vacancy-main-block').find('.vacancy-block .vacancy-block-arrow-text').text('Развернуть');
            $(this).parents('.vacancy-block').addClass('active');
            $(this).parents('.vacancy-block').find('.vacancy-block-arrow-text').text('Свернуть');
            return false;
        }
    });

    $(".slide_to_work_form").on("click", function(){
        var vacancy_id = $(this).data('id');
        if(vacancy_id != undefined) {
            $('select[name=vacancy]').val(vacancy_id);
        }
        $.scrollTo(".b_form_content", 300);
        return false;
    });
});
/*!
 * jCarousel - Riding carousels with jQuery
 *   http://sorgalla.com/jcarousel/
 *
 * Copyright (c) 2006 Jan Sorgalla (http://sorgalla.com)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Built on top of the jQuery library
 *   http://jquery.com
 *
 * Inspired by the "Carousel Component" by Bill Scott
 *   http://billwscott.com/carousel/
 */

(function(a){var b={vertical:!1,rtl:!1,start:1,offset:1,size:null,scroll:3,visible:null,animation:"normal",easing:"swing",auto:0,wrap:null,initCallback:null,setupCallback:null,reloadCallback:null,itemLoadCallback:null,itemFirstInCallback:null,itemFirstOutCallback:null,itemLastInCallback:null,itemLastOutCallback:null,itemVisibleInCallback:null,itemVisibleOutCallback:null,animationStepCallback:null,buttonNextHTML:"<div></div>",buttonPrevHTML:"<div></div>",buttonNextEvent:"click",buttonPrevEvent:"click",buttonNextCallback:null,buttonPrevCallback:null,itemFallbackDimension:null},c=!1;a(window).bind("load.jcarousel",function(){c=!0}),a.jcarousel=function(e,f){this.options=a.extend({},b,f||{}),this.locked=!1,this.autoStopped=!1,this.container=null,this.clip=null,this.list=null,this.buttonNext=null,this.buttonPrev=null,this.buttonNextState=null,this.buttonPrevState=null,f&&void 0!==f.rtl||(this.options.rtl="rtl"==(a(e).attr("dir")||a("html").attr("dir")||"").toLowerCase()),this.wh=this.options.vertical?"height":"width",this.lt=this.options.vertical?"top":this.options.rtl?"right":"left";for(var g="",h=e.className.split(" "),i=0;h.length>i;i++)if(-1!=h[i].indexOf("jcarousel-skin")){a(e).removeClass(h[i]),g=h[i];break}"UL"==e.nodeName.toUpperCase()||"OL"==e.nodeName.toUpperCase()?(this.list=a(e),this.clip=this.list.parents(".jcarousel-clip"),this.container=this.list.parents(".jcarousel-container")):(this.container=a(e),this.list=this.container.find("ul,ol").eq(0),this.clip=this.container.find(".jcarousel-clip")),0===this.clip.size()&&(this.clip=this.list.wrap("<div></div>").parent()),0===this.container.size()&&(this.container=this.clip.wrap("<div></div>").parent()),""!==g&&-1==this.container.parent()[0].className.indexOf("jcarousel-skin")&&this.container.wrap('<div class=" '+g+'"></div>'),this.buttonPrev=a(".jcarousel-prev",this.container),0===this.buttonPrev.size()&&null!==this.options.buttonPrevHTML&&(this.buttonPrev=a(this.options.buttonPrevHTML).appendTo(this.container)),this.buttonPrev.addClass(this.className("jcarousel-prev")),this.buttonNext=a(".jcarousel-next",this.container),0===this.buttonNext.size()&&null!==this.options.buttonNextHTML&&(this.buttonNext=a(this.options.buttonNextHTML).appendTo(this.container)),this.buttonNext.addClass(this.className("jcarousel-next")),this.clip.addClass(this.className("jcarousel-clip")).css({position:"relative"}),this.list.addClass(this.className("jcarousel-list")).css({overflow:"hidden",position:"relative",top:0,margin:0,padding:0}).css(this.options.rtl?"right":"left",0),this.container.addClass(this.className("jcarousel-container")).css({position:"relative"}),!this.options.vertical&&this.options.rtl&&this.container.addClass("jcarousel-direction-rtl").attr("dir","rtl");var j=null!==this.options.visible?Math.ceil(this.clipping()/this.options.visible):null,k=this.list.children("li"),l=this;if(k.size()>0){var m=0,n=this.options.offset;k.each(function(){l.format(this,n++),m+=l.dimension(this,j)}),this.list.css(this.wh,m+100+"px"),f&&void 0!==f.size||(this.options.size=k.size())}this.container.css("display","block"),this.buttonNext.css("display","block"),this.buttonPrev.css("display","block"),this.funcNext=function(){return l.next(),!1},this.funcPrev=function(){return l.prev(),!1},this.funcResize=function(){l.resizeTimer&&clearTimeout(l.resizeTimer),l.resizeTimer=setTimeout(function(){l.reload()},100)},null!==this.options.initCallback&&this.options.initCallback(this,"init"),!c&&d.isSafari()?(this.buttons(!1,!1),a(window).bind("load.jcarousel",function(){l.setup()})):this.setup()};var d=a.jcarousel;d.fn=d.prototype={jcarousel:"0.2.9"},d.fn.extend=d.extend=a.extend,d.fn.extend({setup:function(){if(this.first=null,this.last=null,this.prevFirst=null,this.prevLast=null,this.animating=!1,this.timer=null,this.resizeTimer=null,this.tail=null,this.inTail=!1,!this.locked){this.list.css(this.lt,this.pos(this.options.offset)+"px");var b=this.pos(this.options.start,!0);this.prevFirst=this.prevLast=null,this.animate(b,!1),a(window).unbind("resize.jcarousel",this.funcResize).bind("resize.jcarousel",this.funcResize),null!==this.options.setupCallback&&this.options.setupCallback(this)}},reset:function(){this.list.empty(),this.list.css(this.lt,"0px"),this.list.css(this.wh,"10px"),null!==this.options.initCallback&&this.options.initCallback(this,"reset"),this.setup()},reload:function(){if(null!==this.tail&&this.inTail&&this.list.css(this.lt,d.intval(this.list.css(this.lt))+this.tail),this.tail=null,this.inTail=!1,null!==this.options.reloadCallback&&this.options.reloadCallback(this),null!==this.options.visible){var a=this,b=Math.ceil(this.clipping()/this.options.visible),c=0,e=0;this.list.children("li").each(function(d){c+=a.dimension(this,b),a.first>d+1&&(e=c)}),this.list.css(this.wh,c+"px"),this.list.css(this.lt,-e+"px")}this.scroll(this.first,!1)},lock:function(){this.locked=!0,this.buttons()},unlock:function(){this.locked=!1,this.buttons()},size:function(a){return void 0!==a&&(this.options.size=a,this.locked||this.buttons()),this.options.size},has:function(a,b){void 0!==b&&b||(b=a),null!==this.options.size&&b>this.options.size&&(b=this.options.size);for(var c=a;b>=c;c++){var d=this.get(c);if(!d.length||d.hasClass("jcarousel-item-placeholder"))return!1}return!0},get:function(b){return a(">.jcarousel-item-"+b,this.list)},add:function(b,c){var e=this.get(b),f=0,g=a(c);if(0===e.length){var h,i=d.intval(b);for(e=this.create(b);;)if(h=this.get(--i),0>=i||h.length){0>=i?this.list.prepend(e):h.after(e);break}}else f=this.dimension(e);"LI"==g.get(0).nodeName.toUpperCase()?(e.replaceWith(g),e=g):e.empty().append(c),this.format(e.removeClass(this.className("jcarousel-item-placeholder")),b);var j=null!==this.options.visible?Math.ceil(this.clipping()/this.options.visible):null,k=this.dimension(e,j)-f;return b>0&&this.first>b&&this.list.css(this.lt,d.intval(this.list.css(this.lt))-k+"px"),this.list.css(this.wh,d.intval(this.list.css(this.wh))+k+"px"),e},remove:function(a){var b=this.get(a);if(b.length&&!(a>=this.first&&this.last>=a)){var c=this.dimension(b);this.first>a&&this.list.css(this.lt,d.intval(this.list.css(this.lt))+c+"px"),b.remove(),this.list.css(this.wh,d.intval(this.list.css(this.wh))-c+"px")}},next:function(){null===this.tail||this.inTail?this.scroll("both"!=this.options.wrap&&"last"!=this.options.wrap||null===this.options.size||this.last!=this.options.size?this.first+this.options.scroll:1):this.scrollTail(!1)},prev:function(){null!==this.tail&&this.inTail?this.scrollTail(!0):this.scroll("both"!=this.options.wrap&&"first"!=this.options.wrap||null===this.options.size||1!=this.first?this.first-this.options.scroll:this.options.size)},scrollTail:function(a){if(!this.locked&&!this.animating&&this.tail){this.pauseAuto();var b=d.intval(this.list.css(this.lt));b=a?b+this.tail:b-this.tail,this.inTail=!a,this.prevFirst=this.first,this.prevLast=this.last,this.animate(b)}},scroll:function(a,b){this.locked||this.animating||(this.pauseAuto(),this.animate(this.pos(a),b))},pos:function(a,b){var c=d.intval(this.list.css(this.lt));if(this.locked||this.animating)return c;"circular"!=this.options.wrap&&(a=1>a?1:this.options.size&&a>this.options.size?this.options.size:a);for(var m,e=this.first>a,f="circular"!=this.options.wrap&&1>=this.first?1:this.first,g=e?this.get(f):this.get(this.last),h=e?f:f-1,i=null,j=0,k=!1,l=0;e?--h>=a:a>++h;)i=this.get(h),k=!i.length,0===i.length&&(i=this.create(h).addClass(this.className("jcarousel-item-placeholder")),g[e?"before":"after"](i),null!==this.first&&"circular"==this.options.wrap&&null!==this.options.size&&(0>=h||h>this.options.size)&&(m=this.get(this.index(h)),m.length&&(i=this.add(h,m.clone(!0))))),g=i,l=this.dimension(i),k&&(j+=l),null!==this.first&&("circular"==this.options.wrap||h>=1&&(null===this.options.size||this.options.size>=h))&&(c=e?c+l:c-l);var n=this.clipping(),o=[],p=0,q=0;for(g=this.get(a-1),h=a;++p;){if(i=this.get(h),k=!i.length,0===i.length&&(i=this.create(h).addClass(this.className("jcarousel-item-placeholder")),0===g.length?this.list.prepend(i):g[e?"before":"after"](i),null!==this.first&&"circular"==this.options.wrap&&null!==this.options.size&&(0>=h||h>this.options.size)&&(m=this.get(this.index(h)),m.length&&(i=this.add(h,m.clone(!0))))),g=i,l=this.dimension(i),0===l)throw Error("jCarousel: No width/height set for items. This will cause an infinite loop. Aborting...");if("circular"!=this.options.wrap&&null!==this.options.size&&h>this.options.size?o.push(i):k&&(j+=l),q+=l,q>=n)break;h++}for(var r=0;o.length>r;r++)o[r].remove();j>0&&(this.list.css(this.wh,this.dimension(this.list)+j+"px"),e&&(c-=j,this.list.css(this.lt,d.intval(this.list.css(this.lt))-j+"px")));var s=a+p-1;if("circular"!=this.options.wrap&&this.options.size&&s>this.options.size&&(s=this.options.size),h>s)for(p=0,h=s,q=0;++p&&(i=this.get(h--),i.length)&&(q+=this.dimension(i),!(q>=n)););var t=s-p+1;if("circular"!=this.options.wrap&&1>t&&(t=1),this.inTail&&e&&(c+=this.tail,this.inTail=!1),this.tail=null,"circular"!=this.options.wrap&&s==this.options.size&&s-p+1>=1){var u=d.intval(this.get(s).css(this.options.vertical?"marginBottom":"marginRight"));q-u>n&&(this.tail=q-n-u)}for(b&&a===this.options.size&&this.tail&&(c-=this.tail,this.inTail=!0);a-->t;)c+=this.dimension(this.get(a));return this.prevFirst=this.first,this.prevLast=this.last,this.first=t,this.last=s,c},animate:function(b,c){if(!this.locked&&!this.animating){this.animating=!0;var d=this,e=function(){if(d.animating=!1,0===b&&d.list.css(d.lt,0),!d.autoStopped&&("circular"==d.options.wrap||"both"==d.options.wrap||"last"==d.options.wrap||null===d.options.size||d.last<d.options.size||d.last==d.options.size&&null!==d.tail&&!d.inTail)&&d.startAuto(),d.buttons(),d.notify("onAfterAnimation"),"circular"==d.options.wrap&&null!==d.options.size)for(var a=d.prevFirst;d.prevLast>=a;a++)null===a||a>=d.first&&d.last>=a||!(1>a||a>d.options.size)||d.remove(a)};if(this.notify("onBeforeAnimation"),this.options.animation&&c!==!1){var f=this.options.vertical?{top:b}:this.options.rtl?{right:b}:{left:b},g={duration:this.options.animation,easing:this.options.easing,complete:e};a.isFunction(this.options.animationStepCallback)&&(g.step=this.options.animationStepCallback),this.list.animate(f,g)}else this.list.css(this.lt,b+"px"),e()}},startAuto:function(a){if(void 0!==a&&(this.options.auto=a),0===this.options.auto)return this.stopAuto();if(null===this.timer){this.autoStopped=!1;var b=this;this.timer=window.setTimeout(function(){b.next()},1e3*this.options.auto)}},stopAuto:function(){this.pauseAuto(),this.autoStopped=!0},pauseAuto:function(){null!==this.timer&&(window.clearTimeout(this.timer),this.timer=null)},buttons:function(a,b){null==a&&(a=!this.locked&&0!==this.options.size&&(this.options.wrap&&"first"!=this.options.wrap||null===this.options.size||this.last<this.options.size),this.locked||this.options.wrap&&"first"!=this.options.wrap||null===this.options.size||!(this.last>=this.options.size)||(a=null!==this.tail&&!this.inTail)),null==b&&(b=!this.locked&&0!==this.options.size&&(this.options.wrap&&"last"!=this.options.wrap||this.first>1),this.locked||this.options.wrap&&"last"!=this.options.wrap||null===this.options.size||1!=this.first||(b=null!==this.tail&&this.inTail));var c=this;this.buttonNext.size()>0?(this.buttonNext.unbind(this.options.buttonNextEvent+".jcarousel",this.funcNext),a&&this.buttonNext.bind(this.options.buttonNextEvent+".jcarousel",this.funcNext),this.buttonNext[a?"removeClass":"addClass"](this.className("jcarousel-next-disabled")).attr("disabled",a?!1:!0),null!==this.options.buttonNextCallback&&this.buttonNext.data("jcarouselstate")!=a&&this.buttonNext.each(function(){c.options.buttonNextCallback(c,this,a)}).data("jcarouselstate",a)):null!==this.options.buttonNextCallback&&this.buttonNextState!=a&&this.options.buttonNextCallback(c,null,a),this.buttonPrev.size()>0?(this.buttonPrev.unbind(this.options.buttonPrevEvent+".jcarousel",this.funcPrev),b&&this.buttonPrev.bind(this.options.buttonPrevEvent+".jcarousel",this.funcPrev),this.buttonPrev[b?"removeClass":"addClass"](this.className("jcarousel-prev-disabled")).attr("disabled",b?!1:!0),null!==this.options.buttonPrevCallback&&this.buttonPrev.data("jcarouselstate")!=b&&this.buttonPrev.each(function(){c.options.buttonPrevCallback(c,this,b)}).data("jcarouselstate",b)):null!==this.options.buttonPrevCallback&&this.buttonPrevState!=b&&this.options.buttonPrevCallback(c,null,b),this.buttonNextState=a,this.buttonPrevState=b},notify:function(a){var b=null===this.prevFirst?"init":this.prevFirst<this.first?"next":"prev";this.callback("itemLoadCallback",a,b),this.prevFirst!==this.first&&(this.callback("itemFirstInCallback",a,b,this.first),this.callback("itemFirstOutCallback",a,b,this.prevFirst)),this.prevLast!==this.last&&(this.callback("itemLastInCallback",a,b,this.last),this.callback("itemLastOutCallback",a,b,this.prevLast)),this.callback("itemVisibleInCallback",a,b,this.first,this.last,this.prevFirst,this.prevLast),this.callback("itemVisibleOutCallback",a,b,this.prevFirst,this.prevLast,this.first,this.last)},callback:function(b,c,d,e,f,g,h){if(null!=this.options[b]&&("object"==typeof this.options[b]||"onAfterAnimation"==c)){var i="object"==typeof this.options[b]?this.options[b][c]:this.options[b];if(a.isFunction(i)){var j=this;if(void 0===e)i(j,d,c);else if(void 0===f)this.get(e).each(function(){i(j,this,e,d,c)});else for(var k=function(a){j.get(a).each(function(){i(j,this,a,d,c)})},l=e;f>=l;l++)null===l||l>=g&&h>=l||k(l)}}},create:function(a){return this.format("<li></li>",a)},format:function(b,c){b=a(b);for(var d=b.get(0).className.split(" "),e=0;d.length>e;e++)-1!=d[e].indexOf("jcarousel-")&&b.removeClass(d[e]);return b.addClass(this.className("jcarousel-item")).addClass(this.className("jcarousel-item-"+c)).css({"float":this.options.rtl?"right":"left","list-style":"none"}).attr("jcarouselindex",c),b},className:function(a){return a+" "+a+(this.options.vertical?"-vertical":"-horizontal")},dimension:function(b,c){var e=a(b);if(null==c)return this.options.vertical?e.innerHeight()+d.intval(e.css("margin-top"))+d.intval(e.css("margin-bottom"))+d.intval(e.css("border-top-width"))+d.intval(e.css("border-bottom-width"))||d.intval(this.options.itemFallbackDimension):e.innerWidth()+d.intval(e.css("margin-left"))+d.intval(e.css("margin-right"))+d.intval(e.css("border-left-width"))+d.intval(e.css("border-right-width"))||d.intval(this.options.itemFallbackDimension);var f=this.options.vertical?c-d.intval(e.css("marginTop"))-d.intval(e.css("marginBottom")):c-d.intval(e.css("marginLeft"))-d.intval(e.css("marginRight"));return a(e).css(this.wh,f+"px"),this.dimension(e)},clipping:function(){return this.options.vertical?this.clip[0].offsetHeight-d.intval(this.clip.css("borderTopWidth"))-d.intval(this.clip.css("borderBottomWidth")):this.clip[0].offsetWidth-d.intval(this.clip.css("borderLeftWidth"))-d.intval(this.clip.css("borderRightWidth"))},index:function(a,b){return null==b&&(b=this.options.size),Math.round(((a-1)/b-Math.floor((a-1)/b))*b)+1}}),d.extend({defaults:function(c){return a.extend(b,c||{})},intval:function(a){return a=parseInt(a,10),isNaN(a)?0:a},windowLoaded:function(){c=!0},isSafari:function(){var a=navigator.userAgent.toLowerCase(),b=/(chrome)[ \/]([\w.]+)/.exec(a)||/(webkit)[ \/]([\w.]+)/.exec(a)||[],c=b[1]||"";return"webkit"===c}}),a.fn.jcarousel=function(b){if("string"==typeof b){var c=a(this).data("jcarousel"),e=Array.prototype.slice.call(arguments,1);return c[b].apply(c,e)}return this.each(function(){var c=a(this).data("jcarousel");c?(b&&a.extend(c.options,b),c.reload()):a(this).data("jcarousel",new d(this,b))})}})(jQuery);

function moveCaretToEnd(el)
{
    if (typeof el.selectionStart == "number") {
        el.selectionStart = el.selectionEnd = el.value.length;
    } else if (typeof el.createTextRange != "undefined") {
        el.focus();
        var range = el.createTextRange();
        range.collapse(false);
        range.select();
    }
}

var Comment = function(selector) {
    var $self = $(this),
        selectors = {
            container:          '.comment-container-js',
            reply:              '.reply-js',
            textarea:           '.comment-reply-textarea-js',
            comment:            '.comment-js',
            commentList:        '.comment-list-js',
            commentMainForm:    '.comment-main-form-js',
            commentForm:        '.comment-form-js',
            commentFormCopy:    '.comment-form-copy-js',
            commentCount:       '.comment-count-js',
            commentDelete:      '.comment-delete-js',
            commentRestore:     '.comment-restore-js',
            commentLevel1:      '.comment-level1-js',
            commentLeaf:        '.comment-leaf-js',
            commentMore:        '.comment-more-js',
            commentMoreLoading: '.comment-more-loading-js',
            commentDeleteUser:  '.comment-delete-user-js',
            commentBanUser:     '.comment-ban-user-js',
            commentBlockUser:   '.comment-block-user-js',
            commentSubmit:      '.js-form-submit'
        };

    this.init = function() {
        //Клик на textarea комментария
        $(document).on('focus', selectors.textarea, function() {
            if (!isAuthorized(this)) {
                return showLogin(this);
            }

            $(this).siblings('input').show();
            $(this).siblings('a.send').removeClass('hidden');

            moveCaretToEnd(this);

            // Work around Chrome's little problem
            this.onmouseup = function() {
                // Prevent further mouseup intervention
                moveCaretToEnd(this);
                this.onmouseup = null;
                return false;
            };
        });

        $(document).on('keydown', selectors.textarea, (function (e)
        {
            if (e.ctrlKey && e.keyCode == 13) {
                $(this).parents('form').submit();
                $(e.target).trigger('blur');
            }
        }));

        $(document).on('submit', selectors.commentForm, function() {
            if (!isAuthorized(this)) {
                return showLogin(this);
            }

            var _this = this,
                $form = $(this),
                $commentContainer = findCommentContainer(this),
                $submit = $form.find(selectors.commentSubmit);

            if ($form.find('textarea[name=content]').val() == '') {
                $form.find('div.error_text').empty().append('<p>Вы не ввели комментарий!</p>');
                $form.find('textarea[name=content]').focus();

                return false;
            }

            Bm.ajax($submit, {
                type: 'POST',
                url: $form.attr('action'),
                data: $form.serializeArray(),
                dataType: 'json',
                success: function(result) {
                    $form.find('.error_text.input_error').remove();
                    var errorText = $form.find('.error_text');
                    $(errorText).text('');

                    if (result.success) {
                        changeCommentCount($commentContainer, 1);
                        var $result = $(result.message);
                        if($form.hasClass(selectors.commentFormCopy)) {
                            var $prev = $form.prev();
                            hideForms(_this);
                            var $comments = $prev.nextUntil('.level1', selectors.comment);
                            $result.insertAfter($comments.length ? $comments.last() : $prev);
                        } else {
                            $form.find('textarea').val('');
                            $form.find('textarea').css('height', '');
                            $commentContainer.find(selectors.commentList).prepend($result);
                        }

                        $('.profile-name-container').remove();
                    } else {
                        if (result.error) {
                            if (typeof result.error === 'object') {
                                $.each(result.error, function (i) {
                                    var inputError = $(errorText).clone();
                                    $(inputError).addClass('input_error')
                                    var messArray = $.map(this, function(value) {
                                        return [value];
                                    });
                                    $(inputError).append($('<p>' + messArray.shift() + '</p>'));
                                    $form.find('[name=' + i +']').after(inputError);
                                    $(inputError).show();
                                });
                            } else {
                                $form.find('.error_text').text('Ошибка: ' + result.error).show();
                            }
                        }
                    }
                },
                error: function() {
                    $form.find('.popup_error_text').text('Ошибка загрузки').show();
                }
            });

            return false;
        });

        $(document).on('click', selectors.reply, function(e)
        {
            e.preventDefault();
            if (!isAuthorized(this)) {
                return showLogin(this);
            }
            if($(this).hasClass('reply-on')) {
                return false;
            }

            var $commentContainer = findCommentContainer(this),
                $comment = $(this).parents(selectors.comment),
                container = $(selectors.comment),
                leaf = $(this).parents(selectors.comment).data('leaf');

            hideForms(this);
            $(this).addClass('reply-on');
            var $formParent = $commentContainer.find(selectors.commentMainForm).clone(),
                $form = $formParent.find('form');

            $form.attr('action', $(this).data('url'));
            $form.attr('data-leaf', leaf);
            $form.addClass('level' + $comment.data('level'));
            $form.addClass(selectors.commentFormCopy);
            $form.insertAfter($comment);

            var $textarea = $form.find('textarea');
            $textarea.val($(this).data('replyTo') + ', ');
            $textarea.css('height', 'auto');
            if ($.fn.autosize){
                $textarea.autosize();
            }
            $textarea.focus();
            e.stopPropagation();
        });

        //Показать еще в комментах 2 уровня
        $(document).on('click', selectors.commentLeaf, function(e)
        {
            var leafId = $(this).data('leaf');
            if($(this).hasClass('show-less-js')) {
                $(this).removeClass('show-less-js')
                        .text('еще ответы');
                $('.comment-leaf-showed-js[data-leaf=' + leafId + ']').removeClass('comment-leaf-showed-js').slideToggle(200);
            } else {
                $('[data-leaf=' + leafId + ']:hidden').addClass('comment-leaf-showed-js').slideToggle(200);
                $(this).insertBefore($('.comment-leaf-showed-js[data-leaf=' + leafId + ']').first());
                $(this).addClass('show-less-js')
                        .text('скрыть ответы');
            }
            $(this).toggleClass('up');
        });

        //Показать еще в комментариях 1 уровня
        $(document).on('click', selectors.commentMore, function(e){
            e.preventDefault();

            var $link = $(this),
                $commentContainer = findCommentContainer(this),
                $loading = $commentContainer.find(selectors.commentMoreLoading),
                $loadingIcon = $loading.children('.icon'),
                limit = 10,
                rotate,
                options = {
                    'offset': $commentContainer.find(selectors.comment).last().data('offset')
                };

            if ($link.data('limit')) {
                options['limit'] = $link.data('limit');
                limit = $link.data('limit');
            }

            $.ajax({
                url: $link.attr('data-get-uri'),
                data: options,
                beforeSend: function() {
                    $link.hide();
                    $loading.show();
                    rotate = rotateStart($loadingIcon);
                },
                success: function(result) {
                    var $lol =  $('<div></div>').append(result),
                        count = $(selectors.comment, $lol).size();

                    $commentContainer.find(selectors.commentList).append(result);
                    $loading.hide();
                    rotateStop($loadingIcon, rotate);

                    if (count >= limit) {
                        var remaining = $link.find('span[data-count=true]').text();
                        $link.show().find('span[data-count=true]').text(remaining - limit);
                    }
                }
            });
        });

        $(document).on('click', selectors.commentDelete + ',' + selectors.commentDeleteUser, function()
        {
            if (confirm('Вы подтверждаете это действие?')) {
                var $form = $(this);
                $.ajax({
                    type: 'POST',
                    url: $(this).attr('data-url'),
                    dataType: 'json',
                    success: function( xhr )
                    {
                        if (xhr.ids.length) {
                            $('div.deleted_container').each(function() {
                                var found = false;
                                for (var i in xhr.ids) {
                                    if ($(this).attr('deleted-container-data-id') == xhr.ids[i]) {
                                        found = true;
                                    }
                                }

                                if (found) {
                                    var $commentContainer = findCommentContainer(this);
                                    changeCommentCount($commentContainer, 1);

                                    $(this)
                                        .removeClass('hidden')
                                        .parents(selectors.comment)
                                        .addClass('deleted-comment')
                                        .find(selectors.commentDelete + ', ' + selectors.reply).addClass('hidden');
                                }
                            });
                        }
                    }
                }).error(function() {
                    $form.find('[type=submit]').css('visibility', 'visible');
                    $form.find('.popup_error_text').text('Ошибка загрузки').show();
                });
            }

            return false;
        });

        $(document).on('click', selectors.commentRestore, function()
        {
            var $form = $(this);
            $.ajax({
                type: 'POST',
                url: $(this).attr('data-url'),
                dataType: 'json',
                success: function( xhr )
                {
                    if (xhr.ids.length) {
                        $('div.deleted_container').each(function() {
                            var found = false;
                            for (var i in xhr.ids) {
                                if ($(this).attr('deleted-container-data-id') == xhr.ids[i]) {
                                    found = true;
                                }
                            }

                            if (found) {
                                var $commentContainer = findCommentContainer(this);
                                changeCommentCount($commentContainer, 1);

                                $(this)
                                    .addClass('hidden')
                                    .parents(selectors.comment)
                                    .removeClass('deleted-comment')
                                    .find(selectors.commentDelete + ', ' + selectors.reply).removeClass('hidden');
                            }
                        });
                    }
                },
            }).error(function() {
                $form.find('[type=submit]').css('visibility', 'visible');
                $form.find('.popup_error_text').text('Ошибка загрузки').show();
            });

            return false;
        });

        $(document).on('click', selectors.commentBanUser, function()
        {
            if (confirm('Вы подтверждаете это действие?')) {
                var $form = $(this);
                $.ajax({
                    type: 'POST',
                    url: $(this).attr('data-url'),
                    dataType: 'json',
                    success: function( xhr )
                    {
                        if (xhr.response) {
                            $('div.commentaries_item').each(function() {
                                if ($(this).attr('data-author-id') == xhr.authorId) {
                                    $(this).find('.banned-author-container').removeClass('hidden');
                                    $(this).find(selectors.commentBanUser).addClass('hidden');
                                }
                            });
                        }
                    },
                }).error(function() {
                    $form.find('[type=submit]').css('visibility', 'visible');
                    $form.find('.popup_error_text').text('Ошибка загрузки').show();
                });
            }

            return false;
        });

        $(document).on('click', selectors.commentBlockUser, function()
        {
            if (confirm('Вы подтверждаете это действие?')) {
                var $form = $(this);
                $.ajax({
                    type: 'POST',
                    url: $(this).attr('data-url'),
                    dataType: 'json',
                    success: function( xhr )
                    {
                        if (xhr.response) {
                            $('div.commentaries_item').each(function() {
                                if ($(this).attr('data-author-id') == xhr.authorId) {
                                    $(this).find('.blocked-author-container').removeClass('hidden');
                                    $(this).find(selectors.commentBlockUser).addClass('hidden');
                                }
                            });
                        }
                    },
                }).error(function() {
                    $form.find('[type=submit]').css('visibility', 'visible');
                    $form.find('.popup_error_text').text('Ошибка загрузки').show();
                });
            }

            return false;
        });
    };
    var initializers = {
        reply : function() {
            this.selectors.reply;
        }
    };

    var findCommentContainer = function(object) {
        return $(object).parents(selectors.container);
    };

    var showLogin = function(object) {
        var $commentContainer = findCommentContainer(object),
            successUri = $commentContainer.data('redirectUrl');

        if (Bridge.isMobile) {
            if (!successUri) {
                successUri = $('.popup[data-popup="login"] input[name="success_url"]').val();
            }
            if (!successUri || !successUri.match(/#/)) {
                successUri += '?r='+Math.random() + '#comment';
            } else if (!successUri.match(/#comment/)) {
                var match = successUri.match(/^([^#]*)#(.*)/);
                if (match) {
                    successUri = '?r='+Math.random() + match[0];
                }
            }
            Bm.mobile.popup.show('login');
        } else {
            if (!successUri) {
                successUri = $('#popup_auth [name=success_url]').val();
            }
            if (!successUri.match(/#/)) {
                successUri += '?r='+Math.random() + '#comment';
            } else if (!successUri.match(/#comment/)) {
                var match = successUri.match(/^([^#]*)#(.*)/);
                if (match) {
                    successUri = '?r='+Math.random() + match[0];
                }
            }
            Bm.fancybox.modals.auth.open('<span>Чтобы оставить комментарий, авторизуйтесь или зарегистрируйтесь</span>', successUri);
        }

        $(selectors.textarea).blur();

        return false;
    };

    var isAuthorized = function(object) {
        var $commentContainer = findCommentContainer(object);

        return $commentContainer.attr('data-authorized');
    };

    var hideForms = function(cont) {
        var $commentContainer = findCommentContainer(cont);
        $commentContainer.find('.reply-on').removeClass('reply-on');
        $commentContainer.find(selectors.commentList + ' form').remove();
    };

    var changeCommentCount = function($commentContainer, delta) {
        var count = $commentContainer.data('count'),
            url   = $commentContainer.data('url');

        count = count + delta;
        $commentContainer.data('count', count);
        $('[data-comment-count="' + url + '"]').text(count);

        if (url) {
            var re  = /\/comment\/add\/(\d+)\/(\d+)\/\d+\//;
            var galleryUri = url.replace(re, "/ajax/comments/$1/$2/");

            $('[data-comment-count="' + galleryUri + '"]').text(count);
        }
    }
};

$(document).ready(function()
{
    var c = new Comment('.comment-container-js');
    c.init();
});
$(function() {

    $('form:not(.direct)').each(function() {
        var $form = $(this);
        $form.on('submit', function(e) {
            e.preventDefault();
            if ($form.hasClass('relogin')) {
                $.ajax({
                    url: $form.attr('logout'),
                    type: 'GET',
                    dataType: 'json',
                    xhrFields: {
                        withCredentials: true
                    },
                    headers: {'X-Requested-With': 'XMLHttpRequest'}
                });
            }

            $form.find('input[type=submit]').css('visibility', 'hidden');

            $.ajax({
                type: 'POST',
                url: $form.attr('action'),
                data: $form.serialize(),
                success: function(result) {
                    if (result['redirect']) {
                        segmentType = $form.find("input[name='segment_type']").val();
                        if (segmentType) {
                            dataLayer.push({
                                event: "user_segment_event",
                                user_segment_subscribe: segmentType
                            });
                        }
                        dataLayer.push({
                                'event': 'mixdata',
                                'eventCategory': 'Forms',
                                'eventAction': 'response',
                                'eventContent': 'Регистрация',
                                'eventLabel': 'successful'
                            }
                        );
                        window.location.href = result['redirect'];
                    } else {
                        if ('success_replace' == result['status'] && result['message']) {
                            $form.html(result['message']);
                        }
                        else if ('success' == result['status'] && result['message']) {
                            $form.find('.error_text').html(result['message']).show();
                        } else if ('error' == result['status']) {
                            $form.find('.error_text').html('Ошибка: ' + result['message']).show();
                            dataLayer.push({
                                    'event': 'mixdata',
                                    'eventCategory': 'Forms',
                                    'eventAction': 'response',
                                    'eventContent': 'Регистрация',
                                    'eventLabel': 'unsuccessful',
                                    'errorCode': '1 ' + result['message']
                                }
                            );
                        }
                        $form.find('input[type=submit]').css('visibility', 'visible');
                    }
                },
                dataType: 'json'
            }).error(function() {
                $form.find('input[type=submit]').css('visibility', 'visible');
                $form.find('.error_text').text('Ошибка загрузки').show();
            });

            return false;
        });
    });
});
/**
 * Created by n3b on 26.11.13.
 */

!function(w){

    if( w.imageUploderInitialized ) return;

    var domain = 'f.molodost.bz'; // todo
    var originReg = new RegExp('^.+'+domain.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1") + '$', "g");
    var acceptArr = {
        'images':  'image/jpeg,image/png,image/pjpeg,image/gif',
        'files':  ''
    }

    var receiveMessage = function(event)
    {
        if ( ! event.origin.match(originReg) )
            return;

        var $b = $('#'+ event.data.pid);
        if( ! $b.length ) return;

        var b = $b.get(0);
        if( ! b._frames[event.data.callee] ) return;

        b._frames[event.data.callee].remove();
        delete b._frames[event.data.callee];

        if( ! event.data.status ) return b._onError.call($b, event.data.message, event.data.code);

        b._onSuccess.call($b, event.data.data);
    };

    w.addEventListener("message", receiveMessage, false);

    w.BMUploadTrigger = function($cont, link, resizeType, fileType, onSuccess, onError, onStart, accept)
    {
        var maxFileSize = 5; // todo
        var maxFileSizeFile = 10; // todo
        onStart = onStart || function(){};
        onError = onError || function(){};
        onSuccess = onSuccess || function(){};
        $cont = $($cont);

        if( ! $cont.attr('id') )
            $cont.attr('id', 'bm-media-upload-cont-' + Math.random().toString().substr(2));

        var cont = $cont.get(0);

        if (!cont) {
            console.log('Не могу найти контейнер .js-media-upload-wrapper');
        }

        if( ! cont._frames )
            cont._frames = {};
        cont._onSuccess = onSuccess;
        cont._onError = onError;

        var $form = $cont.next('form');
        if( $form.length ) return $form.children('input').trigger('click');
        $form = $('<form ng-non-bindable class="bm-media-upload-form" method="post" enctype="multipart/form-data" style="display: none;"><input accept="'+acceptArr[accept]+'" type="file" name="file"></form>');
        $form.attr('id', 'bm-media-upload-form-' + Math.random().toString().substr(2));
        $form.insertAfter($cont);

        var $input = $form.children('input:first');

        $input.on('change', function(){

            if (fileType == 2) {
                if( this.files[0].size > maxFileSizeFile * 1024 * 1024 ) {
                    $form.remove();
                    onError.call($cont, 'Максимальный размер файла ' + maxFileSizeFile + 'Мб');
                    return false;
                }
            } else {
                if( this.files[0].size > maxFileSize * 1024 * 1024 ) {
                    $form.remove();
                    onError.call($cont, 'Максимальный размер изображения ' + maxFileSize + 'Мб');
                    return false;
                }
            }

            onStart.call($cont, this.files[0]);

            $.get(link, function(data)
            {
                if( ! data.status )
                {
                    $form.remove();
                    onError.call($cont, 'Системная ошибка. Повторите позже.');
                    return false;
                }

                var $frame = $('<iframe style="display:none" />').attr('id', 'iframe-' + $form.attr('id'));
                $frame.attr('name', $frame.attr('id'));
                $frame.insertAfter($form);
                $form.attr('target', $frame.attr('id'));

                data.link += '&type=' + ( parseInt(resizeType) || 1 );
                data.link += '&filetype=' + ( parseInt(fileType) || 1 );

                $form.attr('action', data.link);

                $form.on('submit', function()
                {
                    $frame.on('load', function(){
                        cont._frames[$frame.attr('id')] = $frame;
                        $frame.get(0).contentWindow.postMessage({callee: $frame.attr('id'), pid: $cont.attr('id')},'*');
                        $form.remove();
                        // todo remove if no message from iframe
                    });
                });
                $form.trigger('submit');
            }, 'json');
        });

        $input.trigger('click');
    }

    w.imageUploderInitialized = 1;

}(window);

/**
 * luckyslider
 *
 * Copyright 2016, sDofeen
 * Free to use and abuse under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */
(function($) {
    $.fn.luckySlider = function(options) {
        return this.each(function(index, item) {
            init($(item), options);
        });

        function init($ls, options) {
            var settings = $.extend({
                    start: 1,
                    nav: true,
                    dots: true,
                    cycle: true,
                    auto: false,
                    timeout: 3000
                }, options),
                active = settings.start,
                items = $ls.children().length;

            $ls.addClass('_ls').children().addClass('_ls__list-item').each(function(index, item) {
                $(item).attr('data-item', Number(index + 1));
            });

            $ls.append('<div class="_ls__wrapper"></div>');
            $ls.find('._ls__wrapper').append('<div class="_ls__list"></div>');
            $ls.find('._ls__list-item').appendTo($ls.find('._ls__list'));

            if (settings.nav) {
                $ls.find('._ls__wrapper').append('<div class="_ls__nav"></div>');

                $ls.find('._ls__nav').append('<a class="_ls__nav-prev" href="javascript:void(0);"></a>');
                $ls.find('._ls__nav').append('<a class="_ls__nav-next" href="javascript:void(0);"></a>');

                $ls.find('._ls__nav ._ls__nav-prev, ._ls__nav ._ls__nav-next').on('click', change);
            }

            if (settings.dots) {
                $ls.append('<div class="_ls__dots"></div>');

                for (var i = 0; i < items; i++) {
                    $ls.find('._ls__dots').append('<a class="_ls__dots-item" data-dot="' + Number(i + 1) + '" href="javascript:void(0);"></a>')
                }

                $ls.find('._ls__dots-item').on('click', change);
            }

            if (settings.auto) {
                setInterval(function() {
                    change($ls.find('._ls__next'));
                }, settings.timeout);
            }

            setActive();

            if (!settings.cycle) {
                checkNav();
            }

            function setActive() {
                $ls.find('._ls__list-item[data-item="' + active + '"]').addClass('_ls-active');

                if (settings.dots) {
                    $ls.find('._ls__dots-item[data-dot="' + active + '"]').addClass('_ls-active');
                }
            }

            function change() {
                if (settings.beforeChange && $.isFunction(settings.beforeChange)) {
                    settings.beforeChange.call();
                }

                var $el = $(this),
                    $items = $ls.find('._ls__list-item'),
                    $dots = $ls.find('._ls__dots-item'),
                    isDot = $el.hasClass('_ls__dots-item'),
                    isPrev = $el.hasClass('_ls__nav-prev');

                if ($el.hasClass('_ls-disabled') || $el.hasClass('_ls-active')) {
                    return false;
                }

                $items.removeClass('_ls-active');
                $dots.removeClass('_ls-active');

                if (isDot) {
                    active = $el.data('dot');
                } else if (isPrev) {
                    if (active === 1) {
                        if (settings.cycle) {
                            active = items;
                        }
                    } else {
                        active--;
                    }
                } else {
                    if (active === items) {
                        if (settings.cycle) {
                            active = 1;
                        }
                    } else {
                        active++;
                    }
                }

                setActive();

                if (!settings.cycle) {
                    checkNav();
                }

                if (settings.afterChange && $.isFunction(settings.afterChange)) {
                    settings.afterChange.call();
                }
            }

            function checkNav() {
                $ls.find('._ls__nav-prev').removeClass('_ls-disabled');
                $ls.find('._ls__nav-next').removeClass('_ls-disabled');

                if (active === 1) {
                    $ls.find('._ls__nav-prev').addClass('_ls-disabled');
                }

                if (active === items) {
                    $ls.find('._ls__nav-next').addClass('_ls-disabled');
                }
            }
        }
    }
})(jQuery);