// jQuery Bootstrap Touch Keyboard plugin
// By Matthew Dawkins
(function($) {
    $.fn.keyboard = function(options) {
        // Settings
        var settings = $.extend({
            keyboardLayout: [
                [
                    ['1', '1'],
                    ['2', '2'],
                    ['3', '3'],
                    ['4', '4'],
                    ['5', '5'],
                    ['6', '6'],
                    ['7', '7'],
                    ['8', '8'],
                    ['9', '9'],
                    ['0', '0'],
                    ['del', 'del']
                ],
                [
                    ['q', 'Q'],
                    ['w', 'W'],
                    ['e', 'E'],
                    ['r', 'R'],
                    ['t', 'T'],
                    ['y', 'Y'],
                    ['u', 'U'],
                    ['i', 'I'],
                    ['o', 'O'],
                    ['p', 'P'],
                    ['-', '='],
                    ['_', '+']
                ],
                [
                    ['a', 'A'],
                    ['s', 'S'],
                    ['d', 'D'],
                    ['f', 'F'],
                    ['g', 'G'],
                    ['h', 'H'],
                    ['j', 'J'],
                    ['k', 'K'],
                    ['l', 'L'],
                    ['\'', ':'],
                    ['@', ';'],
                    ['#', '~']
                ],
                [
                    ['z', 'Z'],
                    ['x', 'X'],
                    ['c', 'C'],
                    ['v', 'V'],
                    ['b', 'B'],
                    ['n', 'N'],
                    ['m', 'M'],
                    [',', ','],
                    ['.', '.'],
                    ['?', '!']
                ],
                [
                    ['shift', 'shift'],
                    ['space', 'space'],
                    ['shift', 'shift']
                ]
            ],
            numpadLayout: [
                [
                    ['7'],
                    ['8'],
                    ['9']
                ],
                [
                    ['4'],
                    ['5'],
                    ['6']
                ],
                [
                    ['1'],
                    ['2'],
                    ['3']
                ],
                [
                    ['del'],
                    ['0'],
                    ['.']
                ]
            ],
            telLayout: [
                [
                    ['1'],
                    ['2'],
                    ['3']
                ],
                [
                    ['4'],
                    ['5'],
                    ['6']
                ],
                [
                    ['7'],
                    ['8'],
                    ['9']
                ],
                [
                    ['del'],
                    ['0'],
                    ['.']
                ]
            ],
            layout: false,
            type: false,
            btnTpl: '<button type="button" tabindex="-1">',
            btnClasses: 'btn btn-default',
            btnActiveClasses: 'active btn-primary',
            initCaps: false,
            placement: 'bottom',
            container:'body',
            trigger: 'focus'
        }, options);
        if (!settings.layout) {
            if (($(this).attr('type') === 'tel' && $(this).hasClass('keyboard-numpad')) || settings.type === 'numpad') {
                settings.layout = settings.numpadLayout;
            } else if (($(this).attr('type') === 'tel') || settings.type === 'tel') {
                settings.layout = settings.telLayout;
            } else {
                settings.layout = settings.keyboardLayout;
            }
        }
        // Keep track of shift status
        var keyboardShift = false;

        // Listen for keypresses
        var onKeypress = function(e) {
            $(this).addClass(settings.btnActiveClasses);
            var keyContent = $(this).attr('data-value' + (keyboardShift ? '-alt' : ''));
            var parent = $('[aria-describedby=' + $(this).closest('.popover').attr('id') + ']');
            var currentContent = parent.val();
            switch (keyContent) {
                case 'space':
                    currentContent += ' ';
                    break;
                case 'shift':
                    keyboardShift = !keyboardShift;
                    keyboardShiftify();
                    break;
                case 'del':
                    currentContent = currentContent.substr(0, currentContent.length - 1);
                    break;
                case 'enter':
                    parent.closest('form').submit();
                    break;
                default:
                    currentContent += keyContent;
                    keyboardShift = false;
            }
            parent.val(currentContent);
            keyboardShiftify();
            parent.focus();
        };
        $(document).off('touchstart', '.jqbtk-row .btn');
        $(document).on('touchstart', '.jqbtk-row .btn', onKeypress);

        $(document).off('mousedown', '.jqbtk-row .btn');
        $(document).on('mousedown', '.jqbtk-row .btn',function(e){
            onKeypress.bind(this,e)();
            var parent = $('[aria-describedby=' + $(this).closest('.popover').attr('id') + ']');
            parent.focus();
            e.preventDefault();
        });

        // All those trouble just to prevent clicks on the popover from cancelling the focus
        $(document).off('mouseup', '.jqbtk-row .btn');
        $(document).on('mouseup', '.jqbtk-row .btn',function(e){
            $(this).removeClass(settings.btnActiveClasses);
            var parent = $('[aria-describedby=' + $(this).closest('.popover').attr('id') + ']');
            parent.focus();
        });

        $(document).on('click', '.jqbtk-row .btn',function(e){
            var parent = $('[aria-describedby=' + $(this).closest('.popover').attr('id') + ']');
            parent.focus();
        });
        $(document).on('touchend', '.jqbtk-row .btn', function() {
            $(this).removeClass(settings.btnActiveClasses);
            var parent = $('[aria-describedby=' + $(this).closest('.popover').attr('id') + ']');
            parent.focus();
        });
        $(document).on('touchend', '.jqbtk-row', function(e) {
            e.preventDefault();
            var parent = $('[aria-describedby=' + $(this).closest('.popover').attr('id') + ']');
            parent.focus();

        });
        // Update keys according to shift status
        var keyboardShiftify = function() {
            $('.jqbtk-container .btn').each(function() {
                switch ($(this).attr('data-value')) {
                    case 'shift':
                    case 'del':
                    case 'space':
                    case 'enter':
                        break;
                    default:
                        $(this).text($(this).attr('data-value' + (keyboardShift ? '-alt' : '')));
                }
            });
        };
        var container = this.data('container');
        if(container!=undefined)
        {
          container = '#'+container;
          settings.container = container;
          settings.placement = 'in';
          settings.trigger = 'manual';
          $(container).addClass('keyboard-container');
        }
        // Set up a popover on each of the targeted elements
        return this.each(function() {
            $(this).popover({
                content: function() {
                    // Optionally set initial caps
                    if (settings.initCaps && $(this).val().length === 0) {
                        keyboardShift = true;
                    }
                    // Set up container
                    var content = $('<div class="jqbtk-container" tabIndex="-1">');
                    $.each(settings.layout, function() {
                        var line = this;
                        var lineContent = $('<div class="jqbtk-row">');
                        $.each(line, function() {
                            var btn = $(settings.btnTpl).addClass(settings.btnClasses);
                            btn.attr('data-value', this[0]).attr('data-value-alt', this[1]);
                            switch (this[0]) {
                                case 'shift':
                                    btn.addClass('jqbtk-shift').html('<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-shift" viewBox="0 0 16 16"> <path d="M7.27 2.047a1 1 0 0 1 1.46 0l6.345 6.77c.6.638.146 1.683-.73 1.683H11.5v3a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-3H1.654C.78 10.5.326 9.455.924 8.816zM14.346 9.5 8 2.731 1.654 9.5H4.5a1 1 0 0 1 1 1v3h5v-3a1 1 0 0 1 1-1z"/> </svg>');
                                    break;
                                case 'space':
                                    btn.addClass('jqbtk-space').html('<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-distribute-vertical" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M1 1.5a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 0-1h-13a.5.5 0 0 0-.5.5m0 13a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 0-1h-13a.5.5 0 0 0-.5.5"/> <path d="M2 7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/> </svg>');
                                    break;
                                case 'del':
                                    btn.addClass('jqbtk-del').html('<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/> <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/> </svg>');
                                    break;
                                case 'enter':
                                    btn.addClass('jqbtk-enter').html('Enter');
                                    break;
                                default:
                                    btn.text(btn.attr('data-value' + (keyboardShift ? '-alt' : '')));
                            }
                            lineContent.append(btn);
                        });
                        content.append(lineContent);
                    });
                    return content;
                },
                html: true,
                placement: settings.placement,
                trigger: settings.trigger,
                container:settings.container,
                viewport: settings.container
            });
            if(settings.trigger == 'manual')
            {
              $(this).popover('show');
            }
        });
    };
}(jQuery));
