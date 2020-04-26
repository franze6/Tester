var current_test = {};
var listeners = {};
var uiStatus = {};
var navBar = {};

$(document).ready(function () {
    navBar.generate();
    navBar.bindPrev(function () {
        window.location = "index.php";
    })
    $('#start_btn').click(function () {
        $.ajax({
            type: "post",
            url: "ajax.php",
            data: "do=new_user&user_name=" + $('#user_name').val(),
            success: (response) => {
                if (response == 1)
                    window.location.href = window.location.href;
            }
        });
    });

    var test_elm = $(".questions_list_test");
    if (test_elm.length == 1) {
        loadQuestionList(test_elm.attr('data-id'));
    }

    var result_elm = $(".result_list");
    if (result_elm.length == 1) {
        //debugger;
        loadResult(result_elm.attr('data-id'));
    }

    var results_tabs = $("#results_tabs");
    if (results_tabs.length == 1) {
        navBar.addElement(results_tabs);
        navBar.hideDone();
        navBar.setHeaderText("Результаты");
        loadResults("my");
        $('#my_results-tab').click(function () {
            loadResults("my");
        });
        $('#other_results-tab').click(function () {
            loadResults("other");
        });
    }

    var home_page = $("#home_page");
    if (home_page.length == 1) {
        navBar.hideDone();
        navBar.hidePrev();
        navBar.setHeaderText("Главная");
    }

    var avalible = $("#avalible_tests");
    if (avalible.length == 1) {
        navBar.hideDone();
        navBar.setHeaderText("Доступные тесты");
        loadAvalibleTests.apply(avalible);
    }

    var create = $("#create_test");
    if(create.length == 1) {
        navBar.setHeaderText("Создание теста");
    }

    $('#next_question').click(function () {
        sendResultQuestion($('.active').attr('data-id'))
    });

    $('#prev_question').click(function () {
        if (current_test.current_question > 0) {
            current_test.current_question--;
            generateQuestionCard();
        }
        else alert("Назад низя!");
    });

    $('#add_question').click(addQuestion);
    $('#test_name').focusout(addTest);
});

function loadAvalibleTests() {
    $.ajax({
        type: "post",
        url: "ajax.php",
        data: "do=get_avalible_tests",
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
            for (key in data) {
                $(this).append($("<a>", { 
                    "class": "ios-list-group-item ios-list-group-item-action", 
                    "href": "?page=test&id=" + data[key].id, 
                    "text": data[key].test_name + " (" + data[key].user_name + ")" })
                    .append($("<i>", {"class":"icon-arrow_forward_ios"})));
            }
        }
    });
}


function addTest() {
    if ($(this).val().length < 1)
        return;
    $.ajax({
        type: "post",
        url: "ajax.php",
        data: "do=new_test&test_name=" + $(this).val() + "&test_id=" + current_test.TestId ? current_test.TestId : "-1",
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
            if (current_test.TestId)
                return;
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
        label = $('<span>', { 'text': 'Введите текст вопроса:' }),
        textarea = $('<textarea>', { 'class': 'question_text form-control' }),
        answers_label = $('<h4>', { 'text': 'Ответы:' }),
        select_menu = $('<select>', { 'class': 'select_menu form-control' }),
        select_label = $('<option>', { 'text': 'Выберите правильный ответ...', 'disabled': '', 'selected': '' }),
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
    if ($(this).val().length < 1)
        return;
    var parent = this.parentElement;
    $.ajax({
        type: "post",
        url: "ajax.php",
        data: "do=new_question&question_name=" + $(this).val() + "&test_id=" + current_test.TestId + "&question_id=" + this.Id ? this.Id : "-1",
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
            if (this.Id)
                return;
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

    var newAElm = $('<div>', { 'class': 'answer' }),
        answer_label = $('<span>', { 'text': 'Введите текст ответа ' + (current_test.questions[this.questionId].answers_count + 1) + ':' }),
        textarea = $('<textarea>', { 'class': 'answer_text form-control' });
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
        data: "do=new_answer&answer_name=" + $(this).val() + "&question_id=" + this.questionId + "&answer_id=" + this.Id ? this.Id : "-1",
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
            current_test.questions[this.questionId].answers[data.result].text = $(this).val();
            if (this.Id)
                return;
            this.Id = data.result;
            if (!current_test.questions[this.questionId].answers)
                current_test.questions[this.questionId].answers = {};
            if (!current_test.questions[this.questionId].answers[this.Id])
                current_test.questions[this.questionId].answers[this.Id] = {};
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
            $('#test_name>h3').text(current_test.test_name + "(" + current_test.user_name + ")");
            generateQuestionCard();
        }
    });
}

function generateQuestionCard() {
    var rootElm = $("#current_question"),
        questionObj = current_test.questions[current_test.current_question],
        question_text = $("<div>").append($("<h4>", { "text": questionObj.text })),
        answers_list = $("<div>", { "class": "list-group answers_list" });
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
        answerElm = $('.answers_list .active'),
        answer_id = '';
    if (answerElm.length == 0) {
        alert("Выберите ответ!");
        uiStatus.free();
        return;
    }
    answer_id = answerElm.attr("data-id");
    if (answer_id) {
        console.error("Не удалось получить id ответа");
    }
    $.ajax({
        type: "post",
        url: "ajax.php",
        data: "do=set_question_result&question_id=" + current_test.questions[current_test.current_question] +
            "&answer_id=" + id + "&result_id=" + result_id,
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
            if (current_test.questions.length > current_test.current_question + 1) {
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

function loadResult(id) {
    $.ajax({
        type: "post",
        url: "ajax.php",
        data: "do=get_result&id=" + id,
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
            var rootElm = $("[data-id=" + id + "]");
            current_test = data.test_data;
            $('#test_name>h3', rootElm).text(current_test.test_name + "(" + current_test.user_name + ")");
            for (key in data.result_data) {
                var res = data.result_data[key];
                rootElm.append(generateResultQuestion(res));
            }
            //debugger;

        }
    });
}

function generateResultQuestion(question) {
    var questionElm = $("<div>", { "class": "question" }),
        questionObj = current_test.questions.find((element) => { return element.id == question.question_id ? element : false }),
        question_text = $("<div>").append($("<h4>", { "text": questionObj.text })),
        answers_list = $("<ul>", { "class": "list-group answers_list" });
    for (key in questionObj.answers) {
        var answer = questionObj.answers[key],
            answerElm = $("<li>", {
                "class": "list-group-item",
                "data-id": answer.id,
                "text": answer.text
            });
        if (questionObj.right_answer == answer.id)
            answerElm.addClass("list-group-item-success");
        else if (question.answer_id == answer.id && questionObj.right_answer != answer.id)
            answerElm.addClass("list-group-item-danger");
        answers_list.append(answerElm);
    }
    questionElm.append(question_text);
    questionElm.append(answers_list);
    return questionElm;
}

function loadResults(type) {
    uiStatus.busy();
    $.ajax({
        type: "post",
        url: "ajax.php",
        data: "do=get_result_list&type=" + type,
        success: (response) => {
            if (response == 0) {
                alert("Ошибка загрузки");
                return;
            }
            var data = JSON.parse(response);
            if (data.isError) {
                alert(data.result);
                return;
            }
            generateResultsList(data, type);
            uiStatus.free();
        }
    });
}

function generateResultsList(data, type) {
    var rootElm = $("<div>", { "class": "list_of_tests ios-list-group" });
    for (key in data) {
        rootElm.append($("<a>", { "class": "ios-list-group-item ios-list-group-item-action", "text": data[key].test_name + '(' + data[key].user_name + '):' + data[key].date, "href": "?page=result&id=" + data[key].id })
            .append($("<i>", { "class": "icon-arrow_forward_ios" })));
    }
    $("#" + type + "_results").empty();
    $("#" + type + "_results").append(rootElm);
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

function displayError(text) {
    var errElm = $("#error_text");
    errElm.text(text);
    errElm.slideDown();
}

function errorHide() {
    var errElm = $("#error_text");
    errElm.text("");
    errElm.slideUp();
}

/* UI Status */

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


/* Navbar */


navBar.generate = function () {
    this.root = $("#navbar");
    var rootElm = $("<ul>", { "class": "nav col-12 p-0" }),
        prev_li = $("<li>", { "class": "nav-item col-3 p-0" }),
        header_li = $("<li>", { "class": "nav-item col-6 nav-header-text" }),
        done_li = $("<li>", { "class": "nav-item col-3 p-0" }),
        prev_a = $("<a>", { "class": "nav-link ios-link", "href": "#", "id": "prev_page" }),
        done_a = $("<a>", { "class": "nav-link ios-link", "href": "#", "id": "done_page", "text": "Готово" });
    prev_a.append($("<span>", { "class": "icon-arrow_back_ios" }));
    prev_a.append($("<label>", { "class": "m-0", "text": "Назад" }));
    prev_li.append(prev_a);
    done_li.append(done_a);
    rootElm.append(prev_li);
    rootElm.append(header_li);
    rootElm.append(done_li);
    this.headerElm = header_li;
    this.doneBtn = done_a;
    this.prevBtn = prev_a;
    this.root.append(rootElm);
};

navBar.addElement = function (elm) {
    this.root.append(elm);
};

navBar.hideDone = function () {
    this.doneBtn.hide();
};

navBar.hidePrev = function () {
    this.prevBtn.hide();
}

navBar.bindPrev = function (func) {
    this.doneBtn.off("click");
    this.prevBtn.click(func);
};

navBar.bindDone = function (func) {
    this.doneBtn.off("click");
    this.doneBtn.click(func);
};

navBar.hide = function () {
    this.root.hide();
};

navBar.setHeaderText = function (text) {
    this.headerElm.text(text);
};

navBar.setDoneText = function (text) {  
    this.doneBtn.text(text);
}