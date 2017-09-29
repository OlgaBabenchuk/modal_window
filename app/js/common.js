$(document).ready(function() {
 
  /*   copying link in browser  */
  $('.socials-link').on('click', function() {
    $(this).after('<input class="dummy" type="text" style="position: absolute">');
    $('.dummy').val(window.location.href);
    $('.dummy').select();
    document.execCommand("Copy");
    $('.dummy').remove();
    $('.popup-alert').show("");
    setTimeout(function() {
      $('.popup-alert').hide("");
    }, 2000);
  });

});


