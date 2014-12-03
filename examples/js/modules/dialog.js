'use strict';

App.modules.dialog = (function() {

    $.subscribe('APP/bootstrap', _init);
    $.subscribe('/dialog/init', _init);

    function _init() {

        _createOverlay('overlay');

        $('*[data-modal-trigger]').each(function() {

            var tid = $(this).attr('data-trigger');

            $(this).data('dialog', new Dialog({

                trigger: this,
                close: '.fjs-close',
                onShow: _show,
                onHide: _hide

            }));
        });
    }

    function _show(args) {

        if (args.overlay) {

            var overlayDiv = $('#overlay');
            overlayDiv.addClass('js-is-active');

            if (!overlayDiv[0].contains(args.modal[0])) {

                args.modal.appendTo(overlayDiv[0]);
            }
        }

        $('body').addClass('js-has-dialog');
    }

    function _hide(args) {

        if (App.views.dialog.length <= 1) {

            var overlayDiv = $('#overlay');
                overlayDiv.removeClass('js-is-active');
                overlayDiv.off('click');
        }

        $('body').removeClass('js-has-dialog');
    }

    function _createOverlay(id) {

        if (!$('#' + id).length) {

            var overlay = document.createElement('div');
            overlay.id = id;
            document.body.appendChild(overlay);

            $(document).on('keydown.hideOverlay', function(e) {

                if (App.views.dialog.length) {

                    if (e.keyCode === 27) {

                        App.views.dialog[0].hide();
                    }
                }
            });
        }
    }

}());
