<?php
if(!isset($_REQUEST['do']))
    return;
include 'functions.php';
$work = new Worker();
$do = $_REQUEST['do'];
$work->db_connect();
if($do == "new_user") {
    if (isset($_REQUEST['user_name'])) {
        session_start();
        $work->addUser($_REQUEST['user_name']);
        setcookie('user_name', $_REQUEST['user_name']);
    }
} elseif ($do == "new_test") {
    if(!isset($_REQUEST['test_name']))
        return 0;
    echo json_encode($work->addTest($_REQUEST['test_name'], 1));
} elseif ($do == "new_question") {
    if(!isset($_REQUEST['question_name']) && !isset($_REQUEST['test_id']))
        return 0;
    echo json_encode($work->addQuestion($_REQUEST['question_name'], $_REQUEST['test_id']));
} elseif ($do == "new_answer") {
    if(!isset($_REQUEST['answer_name']) && !isset($_REQUEST['question_id']))
        return 0;
    echo json_encode($work->addAnswer($_REQUEST['answer_name'], $_REQUEST['question_id']));
}