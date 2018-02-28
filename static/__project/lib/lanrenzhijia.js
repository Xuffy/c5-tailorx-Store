$(function () {
	
	
	
	
	var now = new Date();
	$('.multiple').pickmeup({
		flat	: true,
		format:"Y-m-d",
		mode	: 'multiple',
		render:function(date){
			if (date < now) {
	            return {disabled : true, class_name : 'date-in-past'};
	        }
		},
		change:function(arr){
			console.info(arr);
		}
	});
	
	
 	function getHoliday(){
 		
 	}
});