<?php

$data = array();
$score = $_POST["score"];
$filename = "log.txt";

file_put_contents($filename,$score);

$data = array(
	'score' => $score
);
header('Content-Type: application/json; charset=utf-8');
echo json_encode($data);

// if (isset($_POST['getscore'])) {
// 	$data = array(
// 		'score' => $score
// 	);
// 	header('Content-Type: application/json; charset=utf-8');
// 	echo json_encode($data);
// }

?>