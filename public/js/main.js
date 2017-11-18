$(document).ready(function(	) {	
	$('.deleteUser').on('click', deleteUser);
});

function deleteUser(	) {
	console.log($(this).data('id'))
	var confirmation = confirm('do you really wanna delete this person?');
	if (confirmation) {
		$.ajax({
			type: 'DELETE',
			url : '/user/delete/'+ $(this).data('id')
		}).done(function(response) {		
		$("#person").load(document.URL + "#person");	
		});

	}
	else{
		return false;
	}
}