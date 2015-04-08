'use strict'
var splash_url = "http://ddragon.leagueoflegends.com/cdn/img/champion/loading/{0}_0.jpg"
var champions=['Aatrox', 'Ahri', 'Akali', 'Alistar', 'Amumu', 'Anivia', 'Annie', 'Ashe', 'Azir', 'Bard', 'Blitzcrank', 'Brand', 'Braum', 'Caitlyn', 'Cassiopeia', 'Chogath', 'Corki', 'Darius', 'Diana', 'DrMundo', 'Draven', 'Elise', 'Evelynn', 'Ezreal', 'FiddleSticks', 'Fiora', 'Fizz', 'Galio', 'Gangplank', 'Garen', 'Gnar', 'Gragas', 'Graves', 'Hecarim', 'Heimerdinger', 'Irelia', 'Janna', 'JarvanIV', 'Jax', 'Jayce', 'Jinx', 'Kalista', 'Karma', 'Karthus', 'Kassadin', 'Katarina', 'Kayle', 'Kennen', 'Khazix', 'KogMaw', 'Leblanc', 'LeeSin', 'Leona', 'Lissandra', 'Lucian', 'Lulu', 'Lux', 'Malphite', 'Malzahar', 'Maokai', 'MasterYi', 'MissFortune', 'Mordekaiser', 'Morgana', 'Nami', 'Nasus', 'Nautilus', 'Nidalee', 'Nocturne', 'Nunu', 'Olaf', 'Orianna', 'Pantheon', 'Poppy', 'Quinn', 'Rammus', 'RekSai', 'Renekton', 'Rengar', 'Riven', 'Rumble', 'Ryze', 'Sejuani', 'Shaco', 'Shen', 'Shyvana', 'Singed', 'Sion', 'Sivir', 'Skarner', 'Sona', 'Soraka', 'Swain', 'Syndra', 'Talon', 'Taric', 'Teemo', 'Thresh', 'Tristana', 'Trundle', 'Tryndamere', 'TwistedFate', 'Twitch', 'Udyr', 'Urgot', 'Varus', 'Vayne', 'Veigar', 'Velkoz', 'Vi', 'Viktor', 'Vladimir', 'Volibear', 'Warwick', 'Wukong', 'Xerath', 'XinZhao', 'Yasuo', 'Yorick', 'Zac', 'Zed', 'Ziggs', 'Zilean', 'Zyra'];
var selected = [];
$(document).ready(function () {
    // Gets images into browser cache
    preloadAsync(champions);

    champions = champions.sort();
    // Load champion tiles
    for(var champion in champions) {
        $('#champPool').append('<div class="champIcon" id="' + champions[champion] + '" style="background:url(\'/img/champion/' + champions[champion] + '.png\');background-size:contain;">');
    }
    $('.champIcon').click(function(e) {
        if($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            selected.splice(selected.indexOf($(this).attr('id')));
            setSelection($(this).attr('id'));
        } else if($(".selected").length < 2) {
            $(this).attr('class', 'champIcon selected')
            selected.push($(this).attr('id'));
            setSelection($(this).attr('id'));
        }
    });

    // Setup form submit listener to query website
    $("#main").submit(function(event) {
        event.preventDefault();
        var data = {};
        data.champ1 = $('#champ1').val();
        data.champ2 = $('#champ2').val();
        $.ajax({
            type: "POST",
            url: "/",
            data: data,
            success: showMatchup
        });
    });
    $('.champInput').keyup(function(e) {
        var element = $(e.target);
        filter(element.val());
    });

});

function filter(name) {
    var icon;
    $('.champIcon').each(function() {
        icon = $(this);
        if(icon.attr('id').toLowerCase().indexOf(name.toLowerCase()) == -1) {
            icon.hide(100);
        } else {
            icon.show(100);
        }
    });
}

function setSelection() {
    console.log(selected);
    $.each(selected, function (index) {
        $('#splash' + (index + 1)).attr('src', splash_url.format(this!='Wukong' ? this : 'MonkeyKing'));
    });
    if($('.selected').length <= 1) {
        $('#splash2').attr('src', '/img/empty_white.png');
    }
    if($('.selected').length == 0) {
        console.log('clearing');
        $('#splash1').attr('src', '/img/empty_white.png');
    }
}


function reset() {
    $('.selected').removeClass('selected');
    $('.splash').attr('src', "/img/empty_white.png");
}


function showMatchup(data) {
    console.log(data);
}


// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}
function preloadAsync(array) {
    setTimeout(function () {
        preloadImages(array);
    }, 0);
}
function preloadImages(array) {
    if (!preloadImages.list) {
        preloadImages.list = [];
    }
    var list = preloadImages.list;
    for (var i = 0; i < array.length; i++) {
        var img = new Image();
        img.onload = function() {
            var index = list.indexOf(this);
            if (index !== -1) {
                // remove image from the array once it's loaded
                // for memory consumption reasons
                list.splice(index, 1);
            }
        }
        list.push(img);
        img.src = splash_url.format(array[i]!='Wukong' ? array[i] : 'MonkeyKing');
    }
}
