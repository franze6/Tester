<?php
class Worker
{
    private $connection = null;
    function db_connect()
    {
        if($this->connection != null)
            return;
        $this->connection = new mysqli("localhost", "root", "", "tester");
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

    function addTest($name, $id) {
        if($this->connection == null)
            return 0;
        $result = $this->connection->query("SELECT COUNT(id) as 'count' FROM tests WHERE `name`='$name' AND `owner`='$id'");
        $data['isError'] = false;
        if($result->fetch_assoc()['count'] != "0") {
            $data['isError'] = true;
            $data['result'] = "У вас уже есть тест с таким названием!";
        }
        else {
            $this->connection->query("INSERT INTO tests(`name`, `owner`) VALUES('$name', '$id') ");
            $data['result'] = $this->connection->insert_id;
        }
        return $data;
    }

    function addQuestion($name, $id) {
        if($this->connection == null)
            return 0;
        $result = $this->connection->query("SELECT COUNT(id) as 'count' FROM questions WHERE `text`='$name' AND `test_id`='$id'");
        $data['isError'] = false;
        if($result->fetch_assoc()['count'] != "0") {
            $data['isError'] = true;
            $data['result'] = "У вас уже есть вопрос с таким содержанием!";
        }
        else {
            $this->connection->query("INSERT INTO questions(`text`, `test_id`) VALUES('$name', '$id') ");
            $data['result'] = $this->connection->insert_id;
        }
        return $data;
    }

    function addAnswer($name, $id) {
        if($this->connection == null)
            return 0;
        $result = $this->connection->query("SELECT COUNT(id) as 'count' FROM answers WHERE `text`='$name' AND `question_id`='$id'");
        $data['isError'] = false;
        if(!$result->fetch_assoc()['count'] == "0") {
            $data['isError'] = true;
            $data['result'] = "У вас уже есть ответ с таким содержанием!";
        }
        else {
            $this->connection->query("INSERT INTO answers(`text`, `question_id`) VALUES('$name', '$id') ");
            $data['result'] = $this->connection->insert_id;
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
            return;
        $result_id = $this->createResultRow($id);
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
            $arr['result_id'] = $result_id;
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
}

?>