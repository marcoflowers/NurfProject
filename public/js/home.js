/// <reference path="./typings/jquery/jquery.d.ts"/>
/// <reference path="./typings/jqueryui/jqueryui.d.ts"/>
'use strict';
var splash_url = "http://ddragon.leagueoflegends.com/cdn/img/champion/loading/{0}_0.jpg";
var champions = ['Aatrox', 'Ahri', 'Akali', 'Alistar', 'Amumu', 'Anivia', 'Annie', 'Ashe', 'Azir', 'Bard', 'Blitzcrank', 'Brand', 'Braum', 'Caitlyn', 'Cassiopeia', 'Chogath', 'Corki', 'Darius', 'Diana', 'DrMundo', 'Draven', 'Elise', 'Evelynn', 'Ezreal', 'FiddleSticks', 'Fiora', 'Fizz', 'Galio', 'Gangplank', 'Garen', 'Gnar', 'Gragas', 'Graves', 'Hecarim', 'Heimerdinger', 'Irelia', 'Janna', 'JarvanIV', 'Jax', 'Jayce', 'Jinx', 'Kalista', 'Karma', 'Karthus', 'Kassadin', 'Katarina', 'Kayle', 'Kennen', 'Khazix', 'KogMaw', 'Leblanc', 'LeeSin', 'Leona', 'Lissandra', 'Lucian', 'Lulu', 'Lux', 'Malphite', 'Malzahar', 'Maokai', 'MasterYi', 'MissFortune', 'Mordekaiser', 'Morgana', 'Nami', 'Nasus', 'Nautilus', 'Nidalee', 'Nocturne', 'Nunu', 'Olaf', 'Orianna', 'Pantheon', 'Poppy', 'Quinn', 'Rammus', 'RekSai', 'Renekton', 'Rengar', 'Riven', 'Rumble', 'Ryze', 'Sejuani', 'Shaco', 'Shen', 'Shyvana', 'Singed', 'Sion', 'Sivir', 'Skarner', 'Sona', 'Soraka', 'Swain', 'Syndra', 'Talon', 'Taric', 'Teemo', 'Thresh', 'Tristana', 'Trundle', 'Tryndamere', 'TwistedFate', 'Twitch', 'Udyr', 'Urgot', 'Varus', 'Vayne', 'Veigar', 'Velkoz', 'Vi', 'Viktor', 'Vladimir', 'Volibear', 'Warwick', 'Wukong', 'Xerath', 'XinZhao', 'Yasuo', 'Yorick', 'Zac', 'Zed', 'Ziggs', 'Zilean', 'Zyra'];
String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined'
            ? args[number]
            : match;
    });
};
$(document).ready(function () {
    // Gets images into browser cache
    preloadImages(champions);
    champions = champions.sort();
    // Load champion tiles
    for (var champion in champions) {
        $('#champPool').append('<div class="champIcon" id="' + champions[champion] + '" style="background:url(\'/img/champion/' + champions[champion] + '.png\');background-size:contain;">');
    }
    $('.splashIcon').click(function (e) {
        $('.replace').removeClass('replace');
        $(this).addClass('replace');
    });
    $('.champIcon').click(function (e) {
        var name = $(this).attr('id');
        var selected = [];
        $(".splashIcon").each(function (index) {
            selected.push($(this).attr('value'));
        });
        if (selected.indexOf(name) != -1) {
            return;
        }
        else {
            selected.splice(selected.indexOf($('.replace').attr('value')), 1);
            selected.push(name);
        }
        $('.splashIcon').each(function (index) {
            console.log($(this).attr('value') + " : " + name);
            if ($(this).attr('value') == name) {
                return;
            }
        });
        $(this).attr('data-splash', $('.replace').attr('id'));
        $('.replace').attr('src', splash_url.format($(this).attr('id') != 'Wukong' ? $(this).attr('id') : 'MonkeyKing'));
        $('.replace').attr('value', $(this).attr('id') != 'Wukong' ? $(this).attr('id') : 'MonkeyKing');
    });
    // Listener to submit
    $("#submit").click(function (event) {
        //event.preventDefault();
        var data = {
            champ1: $('#splash1').attr('value'),
            champ2: $('#splash2').attr('value')
        };
        if (data.champ1 != undefined && data.champ2 != undefined) {
            $.ajax({
                type: "POST",
                url: "/",
                data: data,
                success: showMatchup
            });
        }
        else {
            $('#error').text('Please pick both champions');
        }
    });
    $('.champInput').keypress(function (e) {
        var element = $(e.target);
        if ((e.keyCode || e.which) == 13) {
            $('.champIcon').filter(':visible').first().trigger('click');
        }
        //filter(element.val());
    });
    $('.champInput').autocomplete({
        autofocus: true,
        source: champions,
        autoFocus: true,
        select: choose
    });
});
function choose(e, ui) {
    $('.replace').attr('src', splash_url.format(ui.item.value != 'Wukong' ? ui.item.value : 'MonkeyKing'));
    $('.replace').attr('value', ui.item.value != 'Wukong' ? ui.item.value : 'MonkeyKing');
    $(this).val('');
    return false;
}
function filter(name) {
    var icon;
    $('.champIcon').each(function () {
        icon = $(this);
        if (icon.attr('id').toLowerCase().indexOf(name.toLowerCase()) == -1) {
            icon.hide(100);
        }
        else {
            icon.show(100);
        }
    });
}
function reset() {
    $('.selected').removeClass('selected');
    $('.splash').attr('src', "/img/empty_white.png");
    $('.replace').removeClass('replace');
    $('#splash1').addClass('replace');
}
function showMatchup(data) {
    if (data.err === "No data found") {
        $('#error').text("Sorry, no data was found for this matchup");
    }
    else {
        var champs = [];
        $('.splashIcon').each(function (index) {
            champs.push($(this).attr('value'));
        });
        var winner = data[champs[0]] > data[champs[1]] ? champs[0] : champs[1];
        $('.grey').show()
            .css('width', $(document).width())
            .css('height', $(document).height());
        $('<h1>Winnurf!</h1>').appendTo('.grey')
            .css('color', 'white')
            .css('margin-top', $('nav.navbar').height())
            .show('slow');
        $('<img src="' + splash_url.format(winner) + '">').appendTo($('.grey'))
            .fadeIn(400);
        $('.grey').click(function (e) {
            $(this).fadeOut(400);
            $(this).empty();
        });
    }
}
function preloadImages(array) {
    setTimeout(function () {
        var list = [];
        for (var i = 0; i < array.length; i++) {
            var img = new Image();
            img.onload = function () {
                var index = list.indexOf(this);
                if (index !== -1) {
                    // remove image from the array once it's loaded
                    // for memory consumption reasons
                    list.splice(index, 1);
                }
            };
            list.push(img);
            img.src = splash_url.format(array[i] != 'Wukong' ? array[i] : 'MonkeyKing');
        }
    }, 0);
}
