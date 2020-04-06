<div class="container">
    <span>Добро пожаловать, <?= $user_name ?></span>
    <div class="avalible_func">
        <ui>
            <li><a href="?page=create">Создать свой тест</a></li>
            <li><a href="">Посмотреть результаты</a></li>
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