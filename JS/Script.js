//Form wil not submit
$(function(){
	$('#search-form').submit(function(e) {
		e.preventDefault();
	});
})


function search(token, q) {
	// clear the containers we already have in HTML
	$('#results').html('');
	$('#buttons').html('');
	
	// grab the form field input
	if (!q) {
		q = $('#query').val(); // id of the search input field in HTML
	}
	
	// get youtube data
	$.get(
		"https://www.googleapis.com/youtube/v3/search",{ 
			part: 'snippet, id',
			q: q,
			pageToken: token,
			type: 'video',
			key: 'AIzaSyCH0i8znvwIBCWC_nZgFr8rmaUOW6AH1Hs' 
			},
			function(data){ 
				var nextPageToken = data.nextPageToken;
				var prevPageToken = data.prevPageToken;
				
				// log data
				console.log(data); 

				$.each(data.items, function(i, item) {
					// get HTML output; see below for the function
					var output = getOutput(item);
					
					// display results on HTML page
					// output comes from getOutput() below
					$('#results').append(output);
				});

				var buttons = getButtons(prevPageToken, nextPageToken, q);
				// create two buttons in HTML; see below for the function
				// buttons comes from getButtons() below
				$('#buttons').append(buttons);
				
			}
	); 
}


//previous page button
function prevPage() {
	var token = $('#prev-button').data('token');
	var q = $('#prev-button').data('query');
	search(token, q);
}

//next page button
function nextPage() {
	var token = $('#next-button').data('token');
	var q = $('#next-button').data('query');
	search(token, q);
}


// build the output to be displayed in our HTML
function getOutput(item) {
	var videoId = item.id.videoId;
	var title = item.snippet.title;
	var description = item.snippet.description;
	var thumb = item.snippet.thumbnails.medium.url;
	var channelTitle = item.snippet.channelTitle;
	var videoDate = item.snippet.publishedAt;
	
	// build output 
	var output = '<li>' +
	'<div class="list-left">' +
	'<img src="' +thumb+ '">' +
	'</div>' +
	'<div class="list-right">' +
	'<h2><a class="fancybox fancybox.iframe" href="http://www.youtube.com/embed/'+videoId+'">' +title+ '</a></h2>' +
	'<p class="small">By <strong>' +channelTitle+ '</strong> on ' +videoDate+ '</p>' +
	'<p>' +description+ '</p>' +
	'</div>' +
	'</li>' +
	'<div class="clearfloats"></div>' +
	'';
	
	return output;
}


// build the buttons to be displayed in our HTML
function getButtons(prevPageToken, nextPageToken, q) {
	var prevButton = '<button id="prev-button" class="paging-button"' +
	' data-token="' +prevPageToken+ '" data-query="' +q+ '"' +
	' onclick="prevPage();">Prev Page</button>';

	var nextButton = '<button id="next-button" class="paging-button"' +
	' data-token="' +nextPageToken+ '" data-query="' +q+ '"' +
	' onclick="nextPage();">Next Page</button>';

	if(!prevPageToken){
		var buttonOutput = '<div class="button-container">' +
		nextButton + '</div>';
	} else {
		var buttonOutput = '<div class="button-container">' +
		prevButton + ' ' +nextButton+ '</div>';
	}
	
	return buttonOutput;
}
