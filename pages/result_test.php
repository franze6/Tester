<?php
if(!isset($_REQUEST['id']))
    header("Location: index.php");
$id = $_REQUEST['id'];
?>
<div data-id="<?=$id?>" class="container result_list">
    <div id="error_text" class="alert alert-danger" role="alert">
    </div>
    <div id="test_name" class="col"><h3 class="justify-content-center"></h3></div>
    <!--<div class="question container">
        <div class="row"><h4>Как дела?</h4></div>
            <ul class="list-group">
                <li class="list-group-item">Dapibus ac facilisis in</li>
                <li class="list-group-item list-group-item-success">Элемент группы списка успешных действий</li>
                <li class="list-group-item list-group-item-danger">Элемент группы списка опасности</li>
                <li class="list-group-item">Dapibus ac facilisis in</li>
            </ul>
    </div>-->
</div>
