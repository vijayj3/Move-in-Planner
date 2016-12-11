function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
    var gApiKey = "XYZ";// Please fill in your registered API key which you can get from the here (https://developers.google.com/maps/documentation/javascript/get-api-key)
    var nyApiKey = "XYZ";// Please fill in your registered API key which you can get from the here (https://developer.nytimes.com/signup)
    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // YOUR CODE GOES HERE!

    var street = $("#street").val();
    var city = $("#city").val();
    var address = street + ',' + city;

    $greeting.text("So, you want to live at " + address + " ?");

    var urlLink = "https://maps.googleapis.com/maps/api/streetview?size=600x400&location=" + address + "&heading=151.78&pitch=-0.76&key=" + gApiKey + "";
    $body.append("<img class = 'bgimg'>");
    $(".bgimg").attr("src", urlLink);

    //NY times ajax request
    var nyurl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    nyurl += '?' + $.param({
        'api-key': nyApiKey,
        'q': address,
        'sort': "newest"
    });

    $.ajax({
        url: nyurl,
        method: 'GET'
    }).done(function(result) {
        console.log(result);
    }).fail(function(err) {
        throw err;
    });

    $.getJSON(nyurl, function(data) {
        $nytHeaderElem.text('New York Times Articles about  ' + address);
        var arrNews = data.response.docs;
        for (var i = 0; i < arrNews.length; i++) {
            $nytElem.append("<li id ='" + arrNews[i] + "'><a href='" + arrNews[i].web_url + "'>" + arrNews[i].headline.main + "</a><p>" + arrNews[i].abstract + "</p></li>");
        };
    }).fail(function(e) {
        $nytHeaderElem.text('New York Times articles could not be found');
    });

    //Wikipedia ajax and json requests
    var wurl = "https://en.wikipedia.org/w/api.php"
    wurl += "?" + $.param({
        'action': 'opensearch',
        'search': city,
        'format': 'json',
        'callback': 'wikiData'
    })

    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text("failed to get wikipedia links");
    }, 8000)

    $.ajax({
        url: wurl,
        method: 'GET',
        dataType: 'jsonp',
        success: wikidata

    });

    function wikidata(data) {
        console.log(data);
        var list = data[1];

        for (var i = 0; i < list.length; i++) {
            var str = list[i];
            var url = "http://en.wikipedia.org/wiki/" + str;
            $wikiElem.append("<li><a href ='" + url + "''>" + str + "</a></li>");
        };
        clearTimeout(wikiRequestTimeout);
    }
    return false;
};

$('#form-container').submit(loadData);
