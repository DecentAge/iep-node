$('document').ready(function(){
    var $horz_menu_content = $('.horizontal-menu-content');

	$horz_menu_content.on('mouseenter', '.navigation li',function(){
        var $this = $(this),
        listItem = $this.parent('li');

        if($this.hasClass('has-sub')){
            expand($this);
        }

    });

    $horz_menu_content.on('mouseleave', '.navigation li',function(){
        var $this = $(this),
        listItem = $this.parent('li');

        if($this.hasClass('has-sub') && $this.hasClass('open')){
            collapse($this);
        }
    });

    function collapse($listItem, callback) {
        var $subList = $listItem.children('ul');

        $subList.show().slideUp(200, function() {
            $(this).css('display', '');

            $(this).find('> li').removeClass('is-shown');

            $listItem.removeClass('open');

            if (callback) {
                callback();
            }
        });

    }

    function expand($listItem, callback) {
        var $subList = $listItem.children('ul');
        var $children = $subList.children('li').addClass('is-hidden');

        $listItem.addClass('open');

        $subList.hide().slideDown(200, function() {
            $(this).css('display', '');

            if (callback) {
                callback();
            }
        });

        

        setTimeout(function() {
            $children.addClass('is-shown');
            $children.removeClass('is-hidden');
        }, 0);
    }
});