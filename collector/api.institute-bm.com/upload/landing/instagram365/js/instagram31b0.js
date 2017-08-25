$(function() {
    // slider
    $('.js-slider').each(function(num, item) {
        var $slider = $(item),
            $list = $slider.find('.list'),
            items = $slider.find('.item').length,
            start = $slider.data('start'),
            $text = $slider.find('.js-slider-text');

        for (var i = 0; i < items; i++) {
            $list.children('.item:eq(' + i + ')').attr('data-item', Number(i + 1));
        }
        $list.children('.item[data-item="' + start + '"]').addClass('active');

        if ($text.length) {
            for (var j = 0; j < items; j++) {
                $text.children('.item:eq(' + j + ')').attr('data-item', Number(j + 1));
            }
            $text.children('.item[data-item="' + start + '"]').addClass('active');
        }
    });
    $(document).on('click', '.js-slider .js-slider-prev, .js-slider .js-slider-next', function() {
        var $slider = $(this).parents('.js-slider'),
            $list = $slider.find('.list'),
            $text = $slider.find('.js-slider-text'),
            current = $list.find('.item.active').data('item'),
            next = $(this).hasClass('js-slider-next'),
            count = $list.find('.item').length;

        $list.find('.item').removeClass('active');

        if (next) {
            if (current > count - 1) {
                current = 1;
            } else {
                current++;
            }
        } else {
            if (current === 1) {
                current = count;
            } else {
                current--;
            }
        }

        $slider.find('.item[data-item="' + current + '"]').addClass('active');

        if ($text.length) {
            $text.find('.item').removeClass('active');
            $text.find('.item[data-item="' + current + '"]').addClass('active');
        }
    });

    // form submit
    $(document).on('click', '.js-choose-submit', function(e) {
        var $form = $('.js-request-form'),
            event = $(this).data('event');

        if (event) {
            if (Bm.user.authorized) {
                e.preventDefault();

                $form.find('input[name="eventChanger"][data-event="' + event + '"]').trigger('click');
                $form.submit();
            } else {
                $form.find('input[name="eventChanger"][data-event="' + event + '"]').trigger('click');
            }
        }
    });
});