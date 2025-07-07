$(function(){

    var config = {    
         sensitivity: 1, // number = sensitivity threshold (must be 1 or higher)    
         interval: 50,  // number = milliseconds for onMouseOver polling interval    
         over: doOpen,   // function = onMouseOver callback (REQUIRED)    
         timeout: 200,   // number = milliseconds delay before onMouseOut    
         out: doClose    // function = onMouseOut callback (REQUIRED)    
    };
    
    function doOpen() {
        $(this).addClass("active");
        $('ul:first', this).css('visibility', 'visible');
        $('ul:first', this).css('z-index', '9999');
    }
 
    function doClose() {
        $(this).removeClass("active");
        $('ul:first',this).css('visibility', 'hidden');
    }

    $("ul.main-nav li.sub").hoverIntent(config);
    
    $("ul.main-nav li ul li:has(ul)").find("a:first").append(" &raquo; ");

});