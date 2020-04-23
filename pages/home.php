<div class="container">
    <span>Добро пожаловать, <?= $user_name ?>!</span>
    <div class="avalible_func">
        <div class="btn-group">
            <a class="btn btn-primary" href="?page=create">Создать тест</a>
            <a class="btn btn-primary" href="?page=results_list">Посмотреть результаты</a>
        </div>
        <ui>

        </ui>
    </div>
    <div class="current_tests">
        <h2>Доступные тесты:</h2>
        <div class="list_of_tests list-group">
            <?php
            foreach ($avalible_tests as $test) {
                $id = $test['id'];
                $name = $test['test_name'];
                $owner = $test['user_name'];
                echo "<a class='list-group-item list-group-item-action' href='?page=test&id=$id'>$name ($owner)</a>";
            }
            ?>
        </div>
    </div>
</div>