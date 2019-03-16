
    $(function(){   
           $(window).scroll(function(){
         //セクション２から３の間はこれ
        if ($(window).scrollTop() > $('#about').offset().top &&　$(window).scrollTop() < $('#skill').offset().top){
             $(".about").css("color", "#1f1f1f");
        }//セクション３より進んだらこれ
             else if($(window).scrollTop() > $('#skill').offset().top){
             $("nav ul li").css("color", "#ff0000");
        }else//それ以外（つまりセクション１である場合）はこれ
             $("nav ul li box").css("color", "#1f1f1f");
              });
        }); 