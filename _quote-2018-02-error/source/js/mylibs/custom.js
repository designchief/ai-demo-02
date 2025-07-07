	
// ------ SHOW/HIDE STUFF FOR DEMO --------

  $('#qeCarHidden1, #qeCarHidden2, #qeHomeHidden1, #qeHomeHidden2, #qeHomeHidden3').hide();

$('#qeCarHidden1-btn').click(function() {
    $('#qeCarHidden1').show();
	$('#qeCarHidden2').hide();
  });
 $('#qeCarHidden2-btn').click(function() {
    $('#qeCarHidden2').show();
	$('#qeCarHidden1').hide();
  }); 

 $('#qeCarHidden2-btn').click(function() {
    $('#qeHomeHidden1').show();
	$('#qeCarHidden1').hide();
  }); 

$('#LSCVTY_S').change(function(){
        $('#' + $(this).val()).show();
    });
	
 $('#typeOfCover').bind('change', function(event) {

	   var i= $('#typeOfCover').val();

		if(i=="") // equal to a selection option
		 {
			 $('#qeHomeHidden1').hide();
			 $('#qeHomeHidden2').hide();
			 $('#qeHomeHidden3').hide();
		 }
		 if(i=="BAC") // equal to a selection option
		 {
			 $('#qeHomeHidden1').show();
			 $('#qeHomeHidden2').show();
			 $('#qeHomeHidden3').hide();
		 }
		 if(i=="CO") // equal to a selection option
		 {
			 $('#qeHomeHidden1').hide();
			 $('#qeHomeHidden2').hide();
			 $('#qeHomeHidden3').show();
		 }
		 if(i=="BO") // equal to a selection option
		 {
			 $('#qeHomeHidden1').show();
			 $('#qeHomeHidden2').hide();
			 $('#qeHomeHidden3').hide();
		 }
	   
});
// ------ JQUERY TOOLS TABS --------

// ------ Added for Thank You Page Mockup 07.16 --------

$('.quick-estimator .tabs').tabs('.quick-estimator .panes > div', {
      /* tabs configuration goes here */
      effect: 'fade'
      });	
	  
	








	

	

	