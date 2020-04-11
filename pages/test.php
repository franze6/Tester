<?php
if(!isset($_REQUEST['id']))
    header("Location: index.php");
$id = $_REQUEST['id'];
?>
<div data-id="<?=$id?>" class="container questions_list_test">
    <div id="current_question">
        <!--<div class="row"><h2>Как дела?</h2></div>
        <div class="container">
            <div class="list-group answers_list">
                <button type="button" class="list-group-item list-group-item-action" data-id="1">
                    Cras justo odio
                </button>
                <button type="button" class="list-group-item list-group-item-action" data-id="2">Dapibus ac facilisis in</button>
                <button type="button" class="list-group-item list-group-item-action" data-id="3">Morbi leo risus</button>
                <button type="button" class="list-group-item list-group-item-action" data-id="4">Porta ac consectetur ac</button>
                <button type="button" class="list-group-item list-group-item-action" data-id="5">Vestibulum at eros</button>
            </div>
        </div>-->
    </div>
    <div class="row justify-content-between">
        <button id="prev_question" class="btn btn-primary" type="button">Назад</button>
        <button id="next_question" class="btn btn-primary" type="button">Далее</button>
    </div>
</div>


