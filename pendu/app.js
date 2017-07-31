window.onload = function start(){
    var clavier = document.querySelector(".clavier");
    var lettres = clavier.querySelectorAll("button");
    var ajout = document.querySelector(".ajout").querySelector("button");
    var begin = document.querySelector(".begin");
    var tirets = document.querySelector(".mot");
    var bucher = document.querySelector("pre");
    var pendu = bucher.querySelectorAll("span");
    var letter_count = 1;
    var bad_count = 1;
    var stopped = null;

    ajout.onclick = function post(){
        var input = document.querySelector("input[name='mot']").value;
        var vinput = input.toLowerCase().replace(/[^A-Za-z]/, "");

        if(vinput.length>=4){
            $.post("api.php", {
                action: "post_letter",
                mot: vinput
            }, function success(){
                input = ""
            })
        }else{
            alert("Veuillez entrer un mot de plus de 4 caractères")
        }
    }

    var begins = function begins(){
        $.post("api.php", {
            action: "start_game"
        }, function success(response){
            tirets.innerHTML="";
            begin.classList.toggle("displayit");
            bucher.classList.toggle("displayit");
            clavier.classList.toggle("displayit");
            for(var i=0; i<response; i++){
                var trait= document.createElement("div");
                trait.className="hint n"+i;
                tirets.appendChild(trait)
            }
        })
    }
    begin.onclick = begins;

    var reset = function reset(){
        begin.classList.toggle("displayit");
        bucher.classList.toggle("displayit");
        clavier.classList.toggle("displayit");
        bad_count=1;
        letter_count=1;
        stopped=null;
        tirets.innerHTML="";
        pendu.forEach(function(item){
            item.classList.add("displayit");
        })
    };

    var stop = function stop(zitzitoune){
        var stopped = window.confirm(zitzitoune==="win"?"Yatta ! \n Nouvelle partie ?":"GAME OVER : Nooooooooooooooooooooooooooo !!! \n Nouvelle partie ?")

        lettres.forEach(function(lettre){
            lettre.classList.remove("displayit");
        });
        if(stopped===true){
            reset();
            begins()
        }else if(stopped===false){
            reset()
        }
    }

    lettres.forEach(function(lettre){
        lettre.onclick = function cbon(){
            $.post("api.php", {
                action: "verify_letter",
                try: this.className
            }, function success(response){
                var res = JSON.parse(response);
                if(res.pos.length){
                    for(var i=0; i<res.pos.length; i++){
                        document.querySelector(".n"+res.pos[i]).innerHTML = res.letter.toUpperCase();
                        letter_count+=1
                    }
                }else{
                    pendu[bad_count-1].classList.toggle("displayit");
                    if(bad_count===pendu.length){
                        stop("lose")
                    }else{
                        bad_count+=1;
                    }
                }
                clavier.querySelector("."+res.letter).classList.add("displayit");
            });
            if(letter_count===document.querySelectorAll(".hint").length){
                stop("win")
            }
        }
    })
}