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


// function tutorForm() {

    

//         $('#tutorFormEdit').submit((e) => {
//             e.preventDefault()
//             $.ajax({
//                 url: "/tutor/edit-profile",
//                 enctype: 'multipart/form-data',
//                 data: $("tutorFormEdit").serialize(),
//                 method: "post",
//                 processData: false,
//                 contentType: false,
//                 cache: false,
//                 success: function (response) {
//                     alert("Submitted successfully")
//                     location.href = '/tutor/profile'

//                 },
//                 error: function (err) {
//                     alert("Something Error")

//                 }
//             })
//         })
    
// }


