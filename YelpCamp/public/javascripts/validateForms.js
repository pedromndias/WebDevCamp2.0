// In this file we create a function to validate our form:

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'

    // Code to display multiple files names for multiple input in a form (Bootstrap):
    bsCustomFileInput.init()

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validated-form')

    // Loop over them and prevent submission
    Array.from(forms) // This makes an array from forms
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()