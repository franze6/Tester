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
        <ul class="list_of_tests">
            <?php
            foreach ($avalible_tests as $test) {
                $id = $test['id'];
                $name = $test['test_name'];
                $owner = $test['user_name'];
                echo "<li><a data-id='test_$id' href=''>$name ($owner)</a></li>";
            }
            ?>
        </ul>
    </div>
</div>