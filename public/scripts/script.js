$(window).on("scroll", function() { //Navbar scroll color change
    var scrollTop = $(window).scrollTop();
    if (scrollTop >= 80) {
        $('body').addClass('fixed-header');
    } else {
        $('body').removeClass('fixed-header');
    }
});

//Tinymce configuration
document.addEventListener('DOMContentLoaded', function () {
    const contentElement = document.getElementById('content');
    if (contentElement) {
        const content = contentElement.textContent || ''; //For New Posts, content will be empty, but for editing an existing post, there will be content present in tinymce editor
        tinymce.init({
            selector: '#content',
            plugins: 'advlist autolink lists link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste code help wordcount textcolor', toolbar: 'undo redo | formatselect | bold italic underline strikethrough | forecolor backcolor | link image media | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | preview fullscreen | insertdatetime table hr | code',
            menubar: true,
            height: 500,
            content_style: `
                body {
                    background-color: #011627;
                    color: #F5F5F5;
                    line-height: 1.2
                }
                p {
                    margin: 0;
                    padding:0
                }
                h1,h2,h3,h4,h5,h6 {
                    margin: 0;
                    padding: 0;
                }
                .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
                    color: #F5F5F5;
                    content: attr(data-mce-placeholder);
                    position: absolute;
                }
            `,
            setup: function(editor) {
                editor.on('init', function() {
                    editor.setContent(content); //Set content in text editor dynamically
                });
                editor.on('submit', function(event) {
                    //Synchronize TinyMCE content with the textarea
                    document.getElementById('content').value = editor.getContent();
                });
                editor.on('BeforeSetContent', function (e) { //Removing extra spaces created by editor
                    e.content = e.content.replace(/<h1>&nbsp;<\/h1>/g, '').replace(/<h2>&nbsp;<\/h2>/g, '').replace(/<h3>&nbsp;<\/h3>/g, '').replace(/<h4>&nbsp;<\/h4>/g, '').replace(/<h5>&nbsp;<\/h5>/g, '').replace(/<h6>&nbsp;<\/h6>/g, '').replace(/<p>&nbsp;<\/p>/g, '');
                });
                // Override the default behavior of link plugin to always open links in new tabs
                editor.on('ExecCommand', function (e) {
                    if (e.command === 'mceLink') {
                        const anchors = editor.dom.select('a[href]');
                        anchors.forEach(anchor => {
                            editor.dom.setAttrib(anchor, 'target', '_blank');
                        });
                    }
                });
            },
            link_default_target: '_blank',
            images_upload_url: '/upload', //Set the server endpoint for image upload
            automatic_uploads: true,
            images_upload_handler: function(blobInfo, success, failure) {
                const xhr = new XMLHttpRequest();
                xhr.withCredentials = false;
                xhr.open('POST', '/upload');

                xhr.onload = function() {
                    if (xhr.status != 200) {
                        failure(`HTTP Error: ${xhr.status}`);
                        return;
                    }
                    const json = JSON.parse(xhr.responseText);
                    if (!json || typeof json.location !== 'string') {
                        failure('Invalid JSON: ' + xhr.responseText);
                        return;
                    }   
                    success(json.location);
                };

                const formData = new FormData();
                formData.append('file', blobInfo.blob(), blobInfo.filename());
                xhr.send(formData);
            }
        });
    }

    const postContent = document.querySelector('.post-content');
    if (postContent) {
        const links = postContent.querySelectorAll('a');
        links.forEach(link => {
            link.setAttribute('target', '_blank');
        });
    }
});

function showDeletePopup() {
    document.getElementById('delete-popup').style.display = 'flex';
    document.getElementById('screen-overlay').style.display = 'block';
    //document.body.style.overflow = 'hidden'; //Disable scrolling
    }

function hideDeletePopup() { 
    document.getElementById('delete-popup').style.display = 'none';
    document.getElementById('screen-overlay').style.display = 'none';
    //document.body.style.overflow = 'auto'; //Enable scrolling
}

function confirmDeletion() {
    document.getElementById('delete-form').submit();
}

$('#contact-form').on('submit', function(e) {
    e.preventDefault(); //Prevent default form submission

    $.ajax({
        type: 'POST',
        url: '/sendMail',
        data: $(this).serialize(), //Serialize the form data
        success: function(response) {
            //Display the success message
            $('#success-msg').html('<div class="alert alert-success" role="alert">' + response.message + '</div>').fadeIn();

            //Hide the message after a few seconds
            setTimeout(function() {
                $('#success-msg').fadeOut();
            }, 5000);

            //Clear the form fields
            $('#contact-form')[0].reset();
        },
        error: function(xhr, status, error) {
            //Display the error message
            $('#success-msg').html('<div class="alert alert-danger" role="alert">' + xhr.responseJSON.message + '</div>').fadeIn();

            //Hide the message after a few seconds
            setTimeout(function() {
                $('#success-msg').fadeOut();
            }, 5000);
        }
    });
});

//New Post section
$('#image-container').on('click', function(e) {
    //Prevent recursion by only triggering the click on the file input once
    if (e.target !== $('#image')[0]) { //This checks if the event target is the file input itself. If not, it triggers the click event on the file input
        $('#image').trigger('click');
    }

    $('#image').on('change', function() {
        console.log($(this).val());
        const fileName = $(this).val().split('\\').pop();
        $('.file-name').text('Image uploaded: ' + fileName);
    });
});

//Edit Post Section
$('#image-container-2').on('click', function(e) {
    //Prevent recursion by only triggering the click on the file input once
    if (e.target !== $('#new-image')[0]) { //This checks if the event target is the file input itself. If not, it triggers the click event on the file input
        $('#new-image').trigger('click');
    }

    $('#new-image').on('change', function() {
        console.log($(this).val());
        const fileName = $(this).val().split('\\').pop();
        $('.file-name').text('Image uploaded: ' + fileName);
    });
});