<?php
$isLogin = false;
$user_name = "";
session_start();
if (isset($_COOKIE['user_name'])) {
    $isLogin = true;
    $user_name = $_COOKIE['user_name'];
}
?>
<!doctype html>
<html lang="en">
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="jquery-ui.css">
    <title>Тут будут ахуенные тесты!</title>
</head>
<body>
<?php if (!$isLogin) { ?>
    <div class="container">
        <span>Введите имя:</span>
        <div id="login_form" class="row">
            <input type="text" name="user_name" id="user_name">
            <input type="button" id="start_btn" value="Начать!">
        </div>
    </div>
    <?php
} else {
    include 'functions.php';
    $work = new Worker();
    $work->db_connect();
    $avalible_tests = $work->getAllTests();
    if(isset($_REQUEST['page'])) {
        switch ($_REQUEST['page']) {
            case "create":
                include 'pages/create.php';
                break;
            case "result":
                break;
        }
    }
    else {
        include 'pages/home.php';
    }

} ?>
<script src="https://code.jquery.com/jquery-3.4.1.min.js" crossorigin="anonymous"></script>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
<script src="main.js"></script>
</body>
</html>
