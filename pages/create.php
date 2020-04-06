<?php
?>
<div class="container">
    <h2>Создание своего теста</h2>
    <div id="create_test_form" class="ui-widget">
        <form id="new_test" action="ajax.php">
            Введите название теста: <input class="form-control" type="text" name="test_name" id="test_name">
            <h3>Вопросы:</h3>
            <div id="questions_list"></div>
            <input id="add_question" type="button" value="Добавить вопрос..." class="btn btn-primary">
        </form>
    </div>
</div>
