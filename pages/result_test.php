<?php
if(!isset($_REQUEST['id']))
    header("Location: index.php");
$id = $_REQUEST['id'];
?>
<div data-id="<?=$id?>" class="container result_list">
    <div id="error_text" class="alert alert-danger" role="alert">
    </div>
    <div id="test_name" class="col"><h3 class="justify-content-center"></h3></div>
</div>
