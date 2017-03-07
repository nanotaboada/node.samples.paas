module.exports = {
    create:	function(quantity) {
                var books = new Array();
                for (var i = quantity - 1; i >= 0; i--) {
                    var j = i + 1; // avoids "Lipsum0" values
                    var book = {
                       "isbn": "Isbn" + j,
                        "title": "Title" + j,
				        "author": "Author" + j,
                        "published": new Date(),
                        "publisher": "Publisher" + j,
                        "pages": j,
                        "description": "Description" + j,
                        "instock": true
                    };
                    books.push(book);
                }
                return books;
            },
    limit: 9999 // guards against heavy payloads (+2MB)
};