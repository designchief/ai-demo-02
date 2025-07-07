$(document).ready(function(){
	
// ------ SHOW/HIDE STUFF FOR DEMO --------

// hides the elements as soon as the DOM is ready
  $('#VerifyAddressPop, #PAVerifyAddressPop, #JointOwnerPop, #PostalAddressPop, #AddHVIPop, #AddSPPPop, img.loader-gif, #recalbtn, #your-premium, #your-estimate, #content02').hide();
 // shows the popup box  
  $('#VerifyAddressPopShow').click(function() {
    $('#VerifyAddressPop').slideDown('slow');
  });
  $('#VerifyAddressPopShow').mouseenter(function() {
    $('#VALoader').show();
  });
  $('#VerifyAddressPopShow').mouseleave(function() {
    $('#VALoader').hide();
  });
  
  $('#PAVerifyAddressPopShow').click(function() {
    $('#PAVerifyAddressPop').slideDown('slow');
  });
  $('#PAVerifyAddressPopShow').mouseenter(function() {
    $('#VALoader').show();
  });
  $('#PAVerifyAddressPopShow').mouseleave(function() {
    $('#PAVALoader').hide();
  });
  
  $('#JointlyOwned_Y').click(function() {
    $('#JointOwnerPop').slideDown('slow');
  });
  $('#JointlyOwned_N').click(function() {
    $('#JointOwnerPop').slideUp('slow');
  });
  
  $('#PostalAddress').change(function() {
    $('#PostalAddressPop').slideDown('slow');
  });
  
  $('#HighValItmsTot_Y').click(function() {
    $('#AddHVIPop').slideDown('slow');
  });
  $('#HighValItmsTot_N').click(function() {
    $('#AddHVIPop').slideUp('slow');
  });

  $('#SpecPerPoss').change(function() {
    $('#AddSPPPop').slideDown('slow');
  });
  
  
  $('#BuildAccDam_Y').click(function() {
    $('#next2').hide();
	$('#recalbtn').show();
  });
  $('#BuildAccDam_N').click(function() {
    $('#recalbtn').hide();
	$('#next2').show();
  });

  




// ------ JQUERY TOOLS TABS --------

// load main form tabs

$('.tabsnav').tabs('#wizard div.page', {
      /* tabs configuration goes here */
      effect: 'fade'
      });
	  
  
	  
	
	  
	  
// ------ OVERLAY MESSAGES --------

	$('.overlay-msg[rel]').overlay({
		// custom top position
		top: 'center',
		// some mask tweaks
		mask: {
		color: '#003781',
		loadSpeed: 400,
		opacity: 0.6
		},
		// disable this for modal dialog-type of overlays
		closeOnClick: true
	
	});





// ------ FORM FOCUS --------

$('.formitem').focusin(function(){
    $(this).addClass('formfocus');
});
$('.formitem').focusout(function(){
    $(this).removeClass('formfocus');
});



// ------ Tab page progession --------

  $('#content01-btn').click(function() {
    $('#content02').show();
	$('#content01').hide();
	$('html, body').animate({ scrollTop: 0 }, 'fast');
  });

  $('#next1').click(function() {
    $('#t1').addClass('tabok');  // mockup of tab verification - to be used with form validation - tabok class
	$('html, body').animate({ scrollTop: 0 }, 'fast');
	$('.your-estimate').hide();
	$('.your-premium').slideDown('slow');
  });
  
  $('#next2').click(function() {
    $('#t1,#t2').addClass('tabok');  // mockup of tab verification - to be used with form validation - tabok class
	$('html, body').animate({ scrollTop: 0 }, 'fast');
  });
  
  $('#next3').click(function() {
    $('#t1,#t2,#t3').addClass('tabok');  // mockup of tab verification - to be used with form validation - tabok class
	$('html, body').animate({ scrollTop: 0 }, 'fast');
  });

  $('#next4').click(function() {
	$('html, body').animate({ scrollTop: 0 }, 'fast');
  });



// ------ Invalid field and error massage mockup --------

// mockup of validation fields - to be replaced

  $('.error-mockup').click(function() {
    $('#ConfirmEmail,#ConfirmMobilePhone,#PTBorn').addClass('invalid');
  return false;
  });






// ------ Added for Thank You Page Mockup 07.16 --------

$('.quick-estimator .tabs').tabs('.quick-estimator .panes > div', {
      /* tabs configuration goes here */
      effect: 'fade'
      });	

$('#qe-car-hidden1, #qe-car-hidden2').hide();

	
});

	

	