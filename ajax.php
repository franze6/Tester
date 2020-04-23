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
} elseif ($do == "right_answer") {
    if(!isset($_REQUEST['question_id']) && !isset($_REQUEST['answer_id']))
        return 0;
    echo json_encode($work->setRightAnswer($_REQUEST['question_id'], $_REQUEST['answer_id']));
}  elseif ($do == "get_test") {
    if(!isset($_REQUEST['id']))
        return 0;
    echo json_encode($work->getTestDataById($_REQUEST['id']));
} elseif ($do == "set_question_result") {
    if(!isset($_REQUEST['question_id'], $_REQUEST['answer_id'], $_REQUEST['result_id']))
        return 0;
    echo json_encode($work->setQuestionResult($_REQUEST['question_id'], $_REQUEST['answer_id'], $_REQUEST['result_id']));
} elseif ($do == "get_result") {
    if(!isset($_REQUEST['id']))
        return 0;
    echo json_encode($work->getResultData($_REQUEST['id']));
} elseif ($do == "get_result_list") {
    if(!isset($_REQUEST['type']))
        return 0;
    if($_REQUEST['type'] == "my") 
    echo json_encode($work->getMyResults());
    elseif($_REQUEST['type'] == "other")
    echo json_encode($work->getOtherResults());
}


