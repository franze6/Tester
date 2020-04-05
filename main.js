var current_test = {};
$(document).ready(function () {
    $('#start_btn').click(function () {
        $.ajax({
            type: "post",
            url: "ajax.php",
            data: "do=new_user&user_name=" + $('#user_name').val(),
            success: (response) => {
                alert(response);
            }
        });
    });
    $('#add_question').click(addQuestion);
    $('#test_name').focusout(addTest);
});

function addQuestion() {
    if ($('#test_name').val().length < 1) {
        alert('Введите название теста!');
        return;
    }
    if (!current_test.TestId) {
        alert('Обновляем информацио о названии теста!');
        return;
    }
    //$('#add_question').prop('disabled', true);
    var newQElm = $('<div class="container question">'),
        label = $('<span>', {'text': 'Введите текст вопроса:'}),
        textarea = $('<textarea>', {'class': 'question_text'}),
        answers_label = $('<h4>', {'text': 'Ответы:'}),
        answers = $('<div class="answers_list container">'),
        add_answer = $('<input>', {
            'class': 'add_answer ui-button',
            'type': 'button',
            'value': 'Добавить ответ...'
        });

    newQElm.append(label);
    newQElm.append(textarea);
    newQElm.append(answers_label);
    newQElm.append(answers);
    newQElm.append(add_answer);

    $('#questions_list', this.parentElement).append(newQElm);
    add_answer.click(addAnswer);
    textarea.focusout(addQuestionText);
}

function addTest() {
    if ($(this).val().length < 1 || current_test.TestId)
        return;
    $.ajax({
        type: "post",
        url: "ajax.php",
        data: "do=new_test&test_name=" + $(this).val(),
        success: (response) => {
            if (response == 0) {
                alert('Ошибка добавления теста!');
                return;
            }
            var data = JSON.parse(response);
            if (data.isError) {
                alert(data.result);
                return;
            }
            current_test.TestId = data.result;
            current_test.questions = {};
        }
    });
}

function addQuestionText() {
    if (this.Id || $(this).val().length < 1)
        return;
    $.ajax({
        type: "post",
        url: "ajax.php",
        data: "do=new_question&question_name=" + $(this).val() + "&test_id=" + current_test.TestId,
        success: (response) => {
            if (response == 0) {
                alert('Ошибка добавления теста!');
                return;
            }
            var data = JSON.parse(response);
            if (data.isError) {
                alert(data.result);
                return;
            }
            if (!current_test.questions[data.result])
                current_test.questions[data.result] = {};
            current_test.questions[data.result].text = $(this).val();
            this.Id = data.result;
            $('.add_answer', this.parentElement)['0'].questionId = this.Id;
            var select = generateSelect(this.Id);

            $(this.parentElement()).append(select);
        }
    });
}

function addAnswer() {
    if (!current_test.questions[this.questionId].text) {
        alert('Обновляем информацио о тексте вопроса!');
        return;
    }
    if (current_test.questions[this.questionId].text.length < 1) {
        alert('Введите текст вопроса!');
        return;
    }

    var newAElm = $('<div>', {'class': 'answer'}),
        answer_label = $('<span>', {'text': 'Введите текст ответа:'}),
        textarea = $('<textarea>', {'class': 'answer_text'});
    textarea['0'].questionId = this.questionId;
    newAElm.append(answer_label);
    newAElm.append(textarea);
    $('.answers_list', this.parentElement).append(newAElm);

    textarea.focusout(addAnswerText);
}

function addAnswerText() {
    if (this.Id)
        return;
    $.ajax({
        type: "post",
        url: "ajax.php",
        data: "do=new_answer&answer_name=" + $(this).val() + "&question_id=" + this.questionId,
        success: (response) => {
            if (response == 0) {
                alert('Ошибка добавления ответа!');
                return;
            }
            var data = JSON.parse(response);
            if (data.isError) {
                alert(data.result);
                return;
            }
            this.Id = data.result;
            if (!current_test.questions[this.questionId].answers)
                current_test.questions[this.questionId].answers = {};
            if (!current_test.questions[this.questionId].answers[this.Id])
                current_test.questions[this.questionId].answers[this.Id] = {};
            current_test.questions[this.questionId].answers[this.Id].text = $(this).val();
        }
    });
}

function generateSelect(id) {
    var selElm = $('<select>');
    if(current_test.questions[id].answers) {
        for (answer in current_test.questions[id].answers) {
            selElm.append($('<option>', {'value': answer}));
        }
    }
    selElm.selectmenu();
}