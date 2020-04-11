var current_test = {};
var listeners = {};
var uiStatus = {};
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

    var test_elm = $(".questions_list_test");
    if (test_elm.length == 1) {
        loadQuestionList(test_elm.attr('data-id'));
    }

    $('#next_question').click(function () {
        var parent = $(this).parent().parent();
        sendResultQuestion($('.active').attr('data-id'))
    });

    $('#add_question').click(addQuestion);
    $('#test_name').focusout(addTest);
});


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
        textarea = $('<textarea>', {'class': 'question_text form-control'}),
        answers_label = $('<h4>', {'text': 'Ответы:'}),
        select_menu = $('<select>', {'class': 'select_menu form-control'}),
        select_label = $('<option>', {'text': 'Выберите правильный ответ...', 'disabled': '', 'selected': ''}),
        answers = $('<div class="answers_list container">'),
        add_answer = $('<input>', {
            'class': 'add_answer btn btn-primary',
            'type': 'button',
            'value': 'Добавить ответ...'
        });

    select_menu.append(select_label);
    select_menu.append(select_label);
    newQElm.append(label);
    newQElm.append(textarea);
    newQElm.append(answers_label);
    newQElm.append(select_menu);
    newQElm.append(answers);
    newQElm.append(add_answer);

    addListener('addQuestion', function () {
        select_menu.attr('data-id', this.Id);
    });

    $('#questions_list', this.parentElement).append(newQElm);
    add_answer.click(addAnswer);
    select_menu.change(rightAnswerChange);
    textarea.focusout(addQuestionText);
}

function addQuestionText() {
    if (this.Id || $(this).val().length < 1)
        return;
    var parent = this.parentElement;
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
            current_test.questions[data.result].answers_count = 0;
            this.Id = data.result;
            $('.add_answer', parent)['0'].questionId = this.Id;
            fireEvent('addQuestion', this);
            addListener('addAnswer', function () {
                if (this.questionId != data.result)
                    return;
                $('.select_menu', parent).append($('<option>', {
                    'data-id': this.Id,
                    'text': current_test.questions[this.questionId].answers[this.Id].number +
                        '. ' + sliceText(current_test.questions[this.questionId].answers[this.Id].text)
                }));
            })
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
        answer_label = $('<span>', {'text': 'Введите текст ответа ' + (current_test.questions[this.questionId].answers_count + 1) + ':'}),
        textarea = $('<textarea>', {'class': 'answer_text form-control'});
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
            current_test.questions[this.questionId].answers[this.Id].number = ++current_test.questions[this.questionId].answers_count;
            if (current_test.questions[this.questionId].answers_count == 1)
                sendRightAnswer(this.questionId, this.Id);

            fireEvent('addAnswer', this);
        }
    });
}

function rightAnswerChange() {
    var question_id = $(this).attr('data-id'),
        answer_id = $("option:selected", this).attr('data-id');
    if (!current_test.questions[question_id].rightAnswer) {
        current_test.questions[question_id].rightAnswer = undefined;
    }
    current_test.questions[question_id].rightAnswer = answer_id;

    sendRightAnswer(question_id, answer_id);
}

function sendRightAnswer(question_id, answer_id) {
    $.ajax({
        type: "post",
        url: "ajax.php",
        data: "do=right_answer&question_id=" + question_id + "&answer_id=" + answer_id,
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
        }
    });
}

function loadQuestionList(id) {
    $.ajax({
        type: "post",
        url: "ajax.php",
        data: "do=get_test&id=" + id,
        success: (response) => {
            if (response == 0) {
                alert('Ошибка получения списка ответов!');
                return;
            }
            var data = JSON.parse(response);
            if (data.isError) {
                alert(data.result);
                return;
            }
            current_test = data;
            current_test.id = id;
            current_test.current_question = 0;
            generateQuestionCard();
        }
    });
}

function generateQuestionCard() {
    var rootElm = $("#current_question"),
        questionObj = current_test.questions[current_test.current_question],
        question_text = $("<div>", {"class": "row"}).append($("<h2>", {"text": questionObj.text})),
        answers_list = $("<div>", {"class": "list-group answers_list"});
    for (key in questionObj.answers) {
        var answer = questionObj.answers[key],
            answerElm = $("<button>", {
                "type": "button",
                "class": "list-group-item list-group-item-action",
                "data-id": answer.id,
                "text": answer.text
            });
        answers_list.append(answerElm);
        $(answerElm).click(function () {
            var parent = $(this).parent();
            var id = $(this).attr('data-id');
            var selected = parent.children("[data-id=" + id + "]");
            var others = parent.children("[data-id!=" + id + "]");
            selected.toggleClass("active");
            others.removeClass("active");
        });
    }
    rootElm.empty();
    rootElm.append(question_text);
    rootElm.append(answers_list);

    uiStatus.free();
}

function sendResultQuestion(id) {
    uiStatus.busy();
    var result_id = current_test.result_id,
        answer_id = $('.answers_list .list-group-item-action,.active').attr('data-id');
    $.ajax({
        type: "post",
        url: "ajax.php",
        data: "do=set_question_result&question_id=" + id + "&answer_id=" + answer_id + "&result_id=" + result_id,
        success: (response) => {
            if (response == 0) {
                alert('Ошибка получения списка ответов!');
                return;
            }
            var data = JSON.parse(response);
            if (data.isError) {
                alert(data.result);
                return;
            }
            if(current_test.questions.length > current_test.current_question + 1) {
                current_test.current_question++;
                generateQuestionCard();
            }
            else {
                uiStatus.free();
                alert("Тест закончился!");
                window.location = "index.php";
            }
        }
    });
}


function addListener(event_name, callback) {
    if (!listeners[event_name])
        listeners[event_name] = [];

    if (listeners[event_name].indexOf(callback) > 0)
        return;
    listeners[event_name].push(callback);
}

function fireEvent(event_name, scope, arguments) {
    if (!listeners[event_name])
        return;
    for (key in listeners[event_name]) {
        if (scope)
            listeners[event_name][key].apply(scope, arguments);
        else
            listeners[event_name][key].apply(window, arguments);
    }
}

function sliceText(text) {
    var sliced = text.slice(0, 25);
    if (sliced.length < text.length) {
        sliced += '...';
    }
    return sliced;
}

uiStatus.busy = function () {
    var body = $(document.body);
    if (body.hasClass("loaded"))
        body.removeClass("loaded");
};

uiStatus.free = function () {
    var body = $(document.body);
    if (!body.hasClass("loaded")) {
        body.addClass("loaded");
    }
};

