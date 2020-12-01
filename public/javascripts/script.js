$('.arrow').on('click touch', function(e) {

    e.preventDefault();

    let arrow = $(this);

    if (!arrow.hasClass('animate')) {
        arrow.addClass('animate');
        setTimeout(() => {
            arrow.removeClass('animate');
        }, 1600);
    }

});

$('.icon').click(function () {
    $('span').toggleClass("cancel");
  });