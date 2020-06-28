let words_list = word_dictionary;
let word_length = 0;
let letters_positions = {};
let impossible_letters = [];
let current_letter = '';
let history = [];


function get_excluded_letters(letters_positions, impossible_letters) {
    let excluded_letters = '';
    Object.keys(letters_positions).map(function (key) {
        if (!excluded_letters.includes(letters_positions[key])) {
            excluded_letters += letters_positions[key];
        }
    });
    for (let i in impossible_letters) {
        if (!excluded_letters.includes(impossible_letters[i])) {
            excluded_letters += impossible_letters[i];
        }
    }
    return excluded_letters;
}

function get_possible_words(words_list, word_length, letters_positions, impossible_letters) {
    let excluded_letters = get_excluded_letters(letters_positions, impossible_letters);

    let regexp = '^';
    for (let i = 0; i < word_length; i++) {
        if (i in letters_positions) {
            regexp += letters_positions[i];
        } else {
            regexp += '[^1' + excluded_letters + ']';
        }
    }
    regexp += '$';
    console.log(regexp);

    return words_list.filter(function (word) {
        return !!word.match(regexp)
    })
}

function get_most_common_letters(words_list, excluded_letters) {
    let letter_counter = {};

    for (let w in words_list) {
        let current_word_letters = [];
        for (let l in words_list[w]) {
            if (!current_word_letters.includes(words_list[w][l])) {
                current_word_letters.push(words_list[w][l])
            }
        }
        current_word_letters.forEach(l => letter_counter[l] = (letter_counter[l] || 0) + 1)
    }

    for (let i in excluded_letters) {
        delete letter_counter[excluded_letters[i]]
    }

    let items = Object.keys(letter_counter).map(function (key) {
        return [key, letter_counter[key]];
    });

    items.sort(function (a, b) {
        return b[1] - a[1];
    });

    return items.slice(0, 7);
}


function restart() {
    words_list = word_dictionary;
    word_length = 0;
    letters_positions = {};
    impossible_letters = [];
    current_letter = '';
    history = [];
}

function update_letter_check_container() {
    let c_words_list = get_possible_words(words_list, word_length, letters_positions, impossible_letters);
    let excluded_letters = get_excluded_letters(letters_positions, impossible_letters);
    let common_letters = get_most_common_letters(c_words_list, excluded_letters);
    console.log(common_letters);
    current_letter = common_letters[0][0];
    $('#current-letter').text(current_letter);
    $('#letter-probabilities').empty();
    for (let i in common_letters) {
        let letter = common_letters[i][0];
        let prob = (common_letters[i][1] / c_words_list.length).toFixed(2);
        $('#letter-probabilities').append("<li>"+ letter +" - " + prob + " (" + common_letters[i][1] + "/" + c_words_list.length + ")</li>")
    }
    let word_examples = c_words_list.splice(0, 7);
    $('#word-examples-list').empty();
    for (let i in word_examples) {
        $('#word-examples-list').append("<li>" + word_examples[i] + "</li>")
    }
    $('#letters-list').text(impossible_letters)
}




function set_value(value) {
    word_length = value;
    $('#word-repr').empty();
    for (let i = 0; i < word_length; i ++) {
        $('#word-repr').append('<div class="letter-place" position=' + i +'><span class="position-hint">' + (i + 1) +'</span><div class="underscore"></div></div>')
    }
    update_letter_check_container();

    $('#word-length-container').fadeOut(200, function () {
            $('#letter-check-container').fadeIn(300)
    });

    $('.letter-place').hover(function () {
        
    }, function () {
        
    }).click(function () {
        let position = parseInt($(this).attr('position'));
        if ($(this).find(".position-hint").length === 1 ) {
            $(this).find('span').addClass('word-letter').removeClass('position-hint');
            $(this).find('span').text(current_letter);
            letters_positions[position] = current_letter;
        } else {
            $(this).find('span').text(position);
            $(this).find('span').removeClass('word-letter').addClass('position-hint');
            delete letters_positions[position];
        }
    });
    
    $('#no-such-letter').click(function () {
        impossible_letters.push(current_letter);
        update_letter_check_container();
    });
    $('#next-letter').click(function () {
        update_letter_check_container();
    })


}




$(document).ready(function () {
    $('.word-length-button').click(function () {
        set_value(parseInt($(this).text()));
    })

});