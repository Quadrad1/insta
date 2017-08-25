$(document).ready(function() {

  $(".nav__btn").click(function(){
    $(".menu__item").slideToggle(300, function(){
      if($(this).css('display') === 'none'){
        $(this).removeAttr('style');
      }
    });
  });
});