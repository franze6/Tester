<div id="create_test">
    <div class="p-1"></div>
    <input class="ios-input-text" id="test_name" type="text" placeholder="Название теста">
    <div class="p-2"></div>
    <div class="ios-list-group">
        <div class="ios-button-text"><i class="icon-add_circle"></i>добавить вопрос</div>
    </div>
    <div id="create_test_form" class="ui-widget">
        <form id="new_test" action="ajax.php">
            <h3>Вопросы:</h3>
            <div id="questions_list"></div>
            <input id="add_question" type="button" value="Добавить вопрос..." class="btn btn-primary">
        </form>
    </div>
</div>
