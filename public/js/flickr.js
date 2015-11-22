'use strict';
// Set up the required imports through Require.JS
// Note no js suffix needed on the paths
requirejs.config({
    paths: {
        ramda: 'js/lib/ramda.min',
        jquery: 'js/lib/jquery-2.1.4'
    }
});

// Use require to load libraries into our function context
require(
    [
        'ramda',
        'jquery'
    ], function (R, $) {
        /**
         * trace function: pass through function that is a log helper
         * args: tag, x
         * @params tag: placeholder tag that goes before the logged output
         * @params x: content of log
         * @returns x
         */
        let trace = R.curry((tag, x) => {
            console.log(tag,':', x);
            return x;
        });

        let impure = {
            getJSON: R.curry((callback, url) => {
                $.getJSON(url, callback);
            }),
            setHtml: R.curry((selector, html) => {
                $(selector).html(html);
            })
        };

        let url = (searchTerm) => {
            return 'https://api.flickr.com/services/feeds/photos_public.gne?tags=' +
                searchTerm + '&format=json&jsoncallback=?';
        };

        let img = (url) => $('<img />', {src: url});

        let mediaUrl = R.compose(R.prop('m'), R.prop('media'));

        let extractAndDisplay = R.compose(img, mediaUrl);

        let getImages = R.compose(R.map(extractAndDisplay), R.prop('items'));

        let renderImageHtml = R.compose(impure.setHtml('#images'), getImages);

        let app = R.compose(impure.getJSON(renderImageHtml), url);

        // code to allow you to type in criteria and pull up content for it
        let search = $('#searchForm');
        search.submit((event) => {
            const userInput = $('#searchText').val();
            app(userInput);
            event.preventDefault();
        });
    }
);
