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
        $('#champPool').append('<div class="champIcon" id="' + champions[champion] + '" style="background:url(\'http://ddragon.leagueoflegends.com/cdn/5.6.2/img/champion/' + (champions[champion] != 'Wukong' ? champions[champion] : 'MonkeyKing') + '.png\');background-size:contain;">');
    }
    $('.splashIcon').click(function (e) {
        $('.replace').removeClass('replace');
        $(this).addClass('replace');
        $('.selected').removeClass('selected');
        $('#' + $(this).attr('value')).addClass('selected');
    });
    $('.champIcon').click(function (e) {
        $('#error').text('');
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
            $('.selected').removeClass('selected');
            $(this).addClass('selected');
        }
        $('.splashIcon').each(function (index) {
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
        this.disabled = true;
    });
    $('.champInput').keypress(function (e) {
        var element = $(e.target);
        if ((e.keyCode || e.which) == 13) {
            $('.champIcon').filter(':visible').first().trigger('click');
        }
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
    $('.splashIcon').attr('src', "/img/empty_white.png");
    $('.splashIcon').removeAttr('value');
    $('.replace').removeClass('replace');
    $('#splash1').addClass('replace');
}
function showMatchup(data) {
    if (data.err === "No data found") {
        $('#error').text("Sorry, no data was found for this matchup");
        $('#submit')[0].disabled = false;
    }
    else {
        var champs = [];
        $('.splashIcon').each(function (index) {
            champs.push($(this).attr('value'));
        });
        var winner = data[champs[0]]["head"] > data[champs[1]]["head"] ? champs[0] : champs[1];
        $('.grey').show()
            .css('width', $(document).width())
            .css('height', $(document).height());
        $('<h1>Winnurf!</h1>').appendTo('.grey')
            .css('color', 'white')
            .css('margin-top', $('nav.navbar').height())
            .show('slow');
        $('<div class="overallrow row"></div>').appendTo('.grey');
        $('<div class="leftside col-md-4"></div>').appendTo('.overallrow');
        $('<div class="champ1_stats text-left"></div>').appendTo('.leftside')
            .css('color', 'white')
            .width("70%")
            .css("margin", "auto")
            .css("display", "table");
        $("<h1 class='text-center'>" + champs[0] + "</h1>").appendTo(".champ1_stats");
        $('<div class="champIconGrey text-center"  style="background:url(\'http://ddragon.leagueoflegends.com/cdn/5.6.2/img/champion/' + (champs[0] != 'Wukong' ? champs[0] : 'MonkeyKing') + '.png\');background-size:contain;">').appendTo(".champ1_stats")
            .css("margin", "auto")
            .css("display", "table");
        $("<h4 class='text-center'>Solo Kills vs " + champs[1] + "</h4>").appendTo(".champ1_stats");
        $("<h4 class='text-center'>" + data[champs[0]]["head"] + "</h4>").appendTo(".champ1_stats")
            .css("color", (function () {
            return data[champs[0]]['head'] > data[champs[1]]['head'] ? '#1fff1f' : '#FF1f1f';
        }));
        /*
        $("<h4>Kills = "+data[champs[0]]["kills"]+"</h4>").appendTo(".champ1_stats")
        $("<h4>Deaths = "+data[champs[0]]["deaths"]+"</h4>").appendTo(".champ1_stats")
        $("<h4>Wins = "+data[champs[0]]["wins"]+"</h4>").appendTo(".champ1_stats")
        $("<h4>Total Games = "+data[champs[0]]["matches"]+"</h4>").appendTo(".champ1_stats")
        $("<h4>Win % = "+Math.round(data[champs[0]]["wins"]/data[champs[0]]["matches"]*100)+"%</h4>").appendTo(".champ1_stats")
        $("<h4>1v1 Wins vs "+champs[1]+" = "+data[champs[0]]["head"]+"</h4>").appendTo(".champ1_stats")
        $("<h4>1v1 % vs "+champs[1]+" = "+Math.round(data[champs[0]]["head"]/(data[champs[1]]["head"]+data[champs[0]]["head"])*100)+"%</h4>").appendTo(".champ1_stats")
        */
        $('<div class="image_col col-md-4"><img src="' + splash_url.format(winner) + '"></div>').appendTo($('.overallrow'))
            .fadeIn(400);
        $('<div class="rightside col-md-4"></div>').appendTo('.overallrow');
        $('<div class="champ2_stats text-left"></div>').appendTo('.rightside')
            .css('color', 'white')
            .width("70%")
            .css("margin", "auto")
            .css("display", "table");
        $("<h1 class='text-center'>" + champs[1] + "</h1>").appendTo(".champ2_stats");
        $('<div class="champIconGrey text-center"  style="background:url(\'http://ddragon.leagueoflegends.com/cdn/5.6.2/img/champion/' + (champs[1] != 'Wukong' ? champs[1] : 'MonkeyKing') + '.png\');background-size:contain;">').appendTo(".champ2_stats")
            .css("margin", "auto")
            .css("display", "table");
        $("<h4 class='text-center'>Solo Kills vs " + champs[0] + "</h4>").appendTo(".champ2_stats");
        $("<h4 class='text-center'>" + data[champs[1]]["head"] + "</h4>").appendTo(".champ2_stats")
            .css("color", (function () {
            return data[champs[0]]['head'] > data[champs[1]]['head'] ? '#FF0000' : '#00FF00';
        }));
        /*
        $("<h4 class='text-center'>Solo Kills % vs "+champs[0]+"</h4>").appendTo(".champ2_stats")
        $("<h4 class='text-center'>"+Math.round(data[champs[1]]["head"]/(data[champs[1]]["head"]+data[champs[0]]["head"])*100)+"%</h4><br>").appendTo(".champ2_stats")
            .css("color","red")
        */
        /*$("<h4>Kills = "+data[champs[1]]["kills"]+"</h4>").appendTo(".champ2_stats")
        $("<h4>Deaths = "+data[champs[1]]["deaths"]+"</h4>").appendTo(".champ2_stats")
        $("<h4>Wins = "+data[champs[1]]["wins"]+"</h4>").appendTo(".champ2_stats")
        $("<h4>Total Games = "+data[champs[1]]["matches"]+"</h4>").appendTo(".champ2_stats")
        $("<h4>Win % = "+Math.round(data[champs[1]]["wins"]/data[champs[1]]["matches"]*100)+"%</h4><br>").appendTo(".champ2_stats")
        */
        $('.grey').click(function (e) {
            $(this).fadeOut(400);
            $(this).empty();
            $("#submit")[0].disabled = false;
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
