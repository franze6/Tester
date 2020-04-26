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
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <link rel="stylesheet" href="style.css">
    <title>Тут будут ахуенные тесты!</title>
</head>
<div id="navbar"></div>

<body class="loaded">
    <div class="preloader">
        <svg class="preloader__image" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path fill="currentColor" d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z">
            </path>
        </svg>
    </div>

    <?php if (!$isLogin) { ?>
        <div class="container">
            <span>Введите имя:</span>
            <div id="login_form" class="row">
                <input type="text" name="user_name" placeholder="Введите имя..." id="user_name">
                <input class="btn btn-primary" type="button" id="start_btn" value="Начать!">
            </div>
        </div>
    <?php
    } else {
        include 'functions.php';
        $work = new Worker();
        $work->db_connect();
        $avalible_tests = $work->getAllTests();
        if (isset($_REQUEST['page'])) {
            switch ($_REQUEST['page']) {
                case "create":
                    include 'pages/create.php';
                    break;
                case "test":
                    include 'pages/test.php';
                    break;
                case "result":
                    include 'pages/result_test.php';
                    break;
                case "results_list":
                    include 'pages/result_list.php';
                    break;
                case "avalible_tests":
                    include 'pages/avalible_tests.php';
                    break;
            }
        } else {
            include 'pages/home.php';
        }
    } ?>
    <script src="https://code.jquery.com/jquery-3.4.1.min.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
    <script src="main.js"></script>
</body>

</html>