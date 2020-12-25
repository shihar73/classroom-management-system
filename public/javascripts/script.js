$('.arrow').on('click touch', function (e) {

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


$(document).ready(function () {

    $('#tutorFormEdit').validate({

        rules: {
            name: {
                required: true,
                minlength: 3
            },
            subject: {
                required: true,
                minlength: 2
            },
            class: {
                required: true,
                minlength: 2
            },
            house: {
                required: true,
                minlength: 2
            },
            place: {
                required: true,
                minlength: 2
            },
            pin: {
                required: true,
                number: true,
                minlength: 1
            },
            number: {
                required: true,
                number: true,
                minlength: 10
            },
            email: {
                required: true,
                email: true

            }
        }

    })


})


// $("#upload-asgmt").change(function () {
//     var fileExtension = ['pdf', 'PDF'];
//     if ($.inArray($(this).val().split('.').pop().toLowerCase(), fileExtension) == -1) {
//         alert("Only formats are allowed : pdf");
//     }
// });


// $(document).ready(function () {

//     $('#form-asgmt').validate({

//         rules: {
//             topic: {
//                 required: true,
//                 minlength: 3
//             },
//             about: {
//                 required: true,
//                 minlength: 4
//             },
//             doc: {
//                 required: true, 
//                 maxupload: 1,
//             }
//         }

//     })


// })

