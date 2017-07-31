<?php
include_once('utility.php');
$db = connectDatabase();


if(isset($_POST["action"]) && $_POST["action"] === "post_letter"){
    postLetter();
} elseif(isset($_POST["action"]) && $_POST["action"] === "start_game"){
    startGame();
} elseif(isset($_POST["action"]) && $_POST["action"] === "verify_letter"){
    isGood();
}

function postLetter(){
    global $db;
    $req=$db->prepare("INSERT INTO mots (mot) VALUES (:mot)");
    $req->bindParam(":mot", $_POST["mot"]);
    $req=$req->execute();
}

function startGame(){
    global $db;
    $req=$db->prepare("SELECT mot FROM mots ORDER BY RAND() LIMIT 1");
    $req->execute();
    $res=$req->fetch(PDO::FETCH_OBJ);
    $_SESSION['secret']=$res->mot;
    echo strlen($_SESSION['secret']);
}

function isGood(){
    if((strpos($_SESSION['secret'],$_POST['try']))!==false){
        $position = [];
        $splitted = str_split($_SESSION['secret']);
        for($i=0; $i<sizeof($splitted); $i++){
            if($splitted[$i] === $_POST['try']){
                array_push($position, $i);
            }
        }
        if(sizeof($position)!==0){
            $o = new stdClass();
            $o->pos=$position;
            $o->letter=$_POST['try'];
            echo json_encode($o);
        } else {
            $o = new stdClass();
            $o->pos=[];
            $o->letter=$_POST['try'];
            echo json_encode($o);
        }
    }else{
        $o = new stdClass();
        $o->pos=[];
        $o->letter=$_POST['try'];
        echo json_encode($o);   
    }
}
?>