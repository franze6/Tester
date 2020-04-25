<?php

class Worker
{
    private $connection = null;
    function db_connect()
    {
        require_once "./config.php";
        if($this->connection != null)
            return;
        $this->connection = new mysqli("localhost", $login, $password, $db);
        $this->connection->set_charset("utf8");
    }

    function db_close() {
        if($this->connection == null)
            return;
        mysqli_close($this->connection);
    }

    function getUserIdbyName($name) {
        if($this->connection == null)
            return;
        $result = $this->connection->query("SELECT id FROM users WHERE `name`='$name'");
        return $result->fetch_assoc()['id'];
    }

    function getAllTests() {
        if($this->connection == null)
            return 0;
        $arr = array();
        $result = $this->connection->query("SELECT tests.id, tests.name as 'test_name', users.name as 'user_name' FROM tests INNER JOIN users ON tests.owner = users.id");
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $arr[] = $row;
            }
            $result->free();
        }
        return $arr;
    }

    function addUser($name) {
        if($this->connection == null)
            return;
        $result = $this->connection->query("SELECT COUNT(id) as 'count' FROM users WHERE `name`='$name'");
        if($result->fetch_assoc()['count'] == "0") {
            $this->connection->query("INSERT INTO users(`name`) VALUES('$name') ");
        }

    }

    /*function newSession() {
        if($this->connection == null)
            return;
        $result = $this->connection->query("SELECT COUNT(id) as 'count' FROM users WHERE `name`='$name'");
        if($result->fetch_assoc()['count'] == "0") {
        }
    }*/

    function addTest($name, $test_id) {
        if($this->connection == null)
            return 0;
        $id = $this->getUserIdbyName($_COOKIE["user_name"]);
        $result = $this->connection->query("SELECT COUNT(id) as 'count' FROM tests WHERE `name`='$name' AND `owner`='$id'");
        $data['isError'] = false;
        if($result->fetch_assoc()['count'] != "0") {
            $data['isError'] = true;
            $data['result'] = "У вас уже есть тест с таким названием!";
        }
        else {
            if($test_id != "-1") {
                $this->connection->query("UPDATE `tests` SET `name`='$name', `owner`='$id' WHERE `id`='$test_id'");
                $data['result'] = $test_id;
            }
            else {
                $this->connection->query("INSERT INTO tests(`name`, `owner`) VALUES('$name', '$id') ");
                $data['result'] = $this->connection->insert_id;
            }
        }
        return $data;
    }

    function addQuestion($name, $id, $question_id) {
        if($this->connection == null)
            return 0;
        $result = $this->connection->query("SELECT COUNT(id) as 'count' FROM questions WHERE `text`='$name' AND `test_id`='$id'");
        $data['isError'] = false;
        if($result->fetch_assoc()['count'] != "0") {
            $data['isError'] = true;
            $data['result'] = "У вас уже есть вопрос с таким содержанием!";
        }
        else {
            if($question_id != "-1") {
                $this->connection->query("UPDATE `questions` SET `text`='$name', `test_id`='$id' WHERE `id`='$question_id'");
                $data['result'] = $question_id;
            }
            else {
                $this->connection->query("INSERT INTO questions(`text`, `test_id`) VALUES('$name', '$id') ");
                $data['result'] = $this->connection->insert_id;
            }
        }
        return $data;
    }

    function addAnswer($name, $id, $answer_id) {
        if($this->connection == null)
            return 0;
        $result = $this->connection->query("SELECT COUNT(id) as 'count' FROM answers WHERE `text`='$name' AND `question_id`='$id'");
        $data['isError'] = false;
        if(!$result->fetch_assoc()['count'] == "0") {
            $data['isError'] = true;
            $data['result'] = "У вас уже есть ответ с таким содержанием!";
        }
        else {
            if($answer_id != "-1") {
                $this->connection->query("UPDATE answers SET `text` = '$name', `question_id` = '$id' WHERE `id` = '$answer_id'");
                $data['result'] = $answer_id;
            }
            else {
                $this->connection->query("INSERT INTO answers(`text`, `question_id`) VALUES('$name', '$id') ");
                $data['result'] = $this->connection->insert_id;
            }
        }
        return $data;
    }

    function setRightAnswer($question_id, $answer_id) {
        if($this->connection == null)
            return 0;
        $this->connection->query("UPDATE `questions` SET `right_answer`='$answer_id' WHERE `id`='$question_id'");
        $data['isError'] = false;
        $data['result'] = 1;
        return $data;
    }

    function getTestDataById($id) {
        if($this->connection == null)
            return 0;        
        $test_data = $this->connection->query("SELECT tests.name as 'test_name', users.name as 'user_name' FROM tests INNER JOIN users ON tests.owner = users.id WHERE tests.id='$id'");
        $arr = $test_data->fetch_assoc();
        $result = $this->connection->query("SELECT * FROM `questions` WHERE `test_id`='$id'");
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $question_id = $row['id'];
                $subresult = $this->connection->query("SELECT * FROM `answers` WHERE `question_id`='$question_id'");
                while ($subrow = $subresult->fetch_assoc()) {
                    $row['answers'][] = $subrow;
                }
                $subresult->free();
                $arr['questions'][] = $row;
            }
            $result->free();
            return $arr;
        }
    }

    function createResultRow($test_id) {
        if($this->connection == null)
            return;
        $id = $this->getUserIdbyName($_COOKIE["user_name"]);
        $this->connection->query("INSERT INTO results(`user_id`, `test_id`) VALUES ('$id', '$test_id')");
        return $this->connection->insert_id;
    }

    function setQuestionResult($question_id, $answer_id, $result_id) {
        if($this->connection == null)
            return;
        $this->connection->query("INSERT INTO trace_list(`question_id`, `answer_id`, `result_id`) VALUES ('$question_id', '$answer_id', '$result_id')");
        $data['result'] = $this->connection->insert_id;
        return $data;
    }

    function getResultData($id) {
        if($this->connection == null)
            return;
        $result = $this->connection->query("SELECT question_id, answer_id FROM `trace_list` WHERE `result_id`='$id'");
        $test_id = $this->connection->query("SELECT test_id FROM `results` WHERE `id`='$id'")->fetch_assoc()['test_id'];
        $arr['test_data'] = $this->getTestDataById($test_id);
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $arr['result_data'][]=$row;
            }
            $result->free();
            return $arr;
        }
    }

    function getMyResults() {
        $id = $this->getUserIdbyName($_COOKIE["user_name"]);
        $result = $this->connection->query("SELECT `results`.`id`, `tests`.`name` as 'test_name', `results`.`date`, `users`.`name` as 'user_name' FROM `results` INNER JOIN `tests` ON `tests`.`id` = `results`.`test_id` INNER JOIN `users` ON `tests`.`owner` = `users`.`id` WHERE `results`.`user_id`='$id'");
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $arr[]=$row;
            }
            $result->free();
            return $arr;
        }
        return 0;
    }

    function getOtherResults() {
        $id = $this->getUserIdbyName($_COOKIE["user_name"]);
        $result = $this->connection->query("SELECT `results`.`id`, `tests`.`name` as 'test_name', `results`.`date`, `users`.`name` as 'user_name' FROM `results` INNER JOIN `tests` ON `results`.`test_id` = `tests`.`id` INNER JOIN `users` ON `tests`.`owner` = `users`.`id` WHERE `tests`.`owner` ='$id'");
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $arr[]=$row;
            }
            $result->free();
            return $arr;
        }
        return 0;
    }
}

?>