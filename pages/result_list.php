<?php

?>
<ul class="nav nav-pills mb-3 p-1" id="results_list" role="tablist">
    <li class="nav-item">
        <a class="nav-link active" id="my_results-tab" data-toggle="pill" href="#my_results" role="tab" aria-controls="my_results" aria-selected="true">Мои результаты</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" id="other_results-tab" data-toggle="pill" href="#other_results" role="tab" aria-controls="other_results" aria-selected="false">Результаты других</a>
    </li>
</ul>
<div class="tab-content" id="pills-tabContent">
    <div class="tab-pane fade show active" id="my_results" role="tabpanel" aria-labelledby="my_results-tab">
    Мое
    </div>
    <div class="tab-pane fade" id="other_results" role="tabpanel" aria-labelledby="other_results-tab">
    Другое
    </div>
</div>