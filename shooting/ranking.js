var API_URL = 'http://yuyake0084.sakura.ne.jp/easyscorekeeper/api.php';

$(function() {
	$.ajax( {
		type: 'POST',
		url: 'http://yuyake0084.sakura.ne.jp/wp/wp-content/themes/theme-yuyakezora/game/shooting/log.txt',
		dataType: 'json',
	}).done(function(data) {
		$('.scoreResult_Container').append('<p class="scoreResult_text">あなたのスコアは</p><p class="scoreNum">' + data +'</p><p class="scoreResult_text">です！</p>');
		drawRanking();

		$('.nikeNameSubmit').on('click', function() {
			var score = data;
			// var username = document.userInfo.resultName.value;
			var username = prompt('名前をいれてね！', 'hoge') || '';

			console.log("あなたのスコアは" + data + "です。");
			console.log("あなたの名前は" + username + "です。");

			$.ajax({
				url: API_URL,
				data: {
					score: data,
					u: username
				}
			}).done(function(responseData) {
				console.log("値をランキングに送信しました。");
				drawRanking();
				var e = document.getElementById('submit');
				e.parentNode.removeChild(e);
			}).fail(function() {
				console.log("値を送信できませんでした。");
			});
		});
	}).fail(function(XMLHttpRequest, textStatus, errorThrown) {
		console.log("Fail!");
		console.log(XMLHttpRequest.status);
    	console.log(textStatus);
	});

	function drawRanking() {
		$('#ranking').find('tr.rank').remove();
		$.ajax({
			type: 'GET',
			url: API_URL,
			dataType: 'json',
			json: 'c',
			// data: JSON.parse({m: 'list'})
			data: {
				m: 'list'
			}
		}).done(function(responseData){
			var i;
			for (var i = 0; i < responseData.data.length; i++) {
				var ranker = responseData.data[i];
				var view = createRankingRowView(
				ranker.rank,
				ranker.score,
				ranker.username
			);
			$('#ranking').append(view);
			}
		}).fail(function(XMLHttpRequest, textStatus, errorThrown) {
			console.log("テーブル作れてないよ！");
			console.log(XMLHttpRequest); // XMLHttpRequestオブジェクト
	        console.log(textStatus); // status は、リクエスト結果を表す文字列
	        // console.log(errorThrown); // errorThrown は、例外オブジェクト
		});
	}


	function createRankingRowView(order, score, username){

		var tr = $('<tr>').addClass('rank').css({
			fontSize: 12,
			textAlign: 'center'
		});

		var rank = $('<td>').css({
			padding: '10',
			width: '10%',
			valign: 'center'
		}).text(order);

		var score = $('<td>').css({
			padding: '10',
			width: '25%',
			valign: 'center'
		}).text(score);

		var username = $('<td>').css({
			padding: '10',
			width: '25%',
			valign: 'center'
		}).text(username);

		return tr.append(rank).append(score).append(username);
	}
});