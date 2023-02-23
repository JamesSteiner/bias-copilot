// removes all comments from code
function strip_comments(text, out) {
  var lines = text.split('\n');
  var answer = new Array();
  var single_comment_flag = false;
  var multi_comment_flag = false;
  var ending_multi_comment_flag = false;
  for (var line = 0; line < lines.length; ++line){
    for(var i = 0; i < lines[line].length; ++i) {
      if (multi_comment_flag == true) {
        break;
      }
      var temp = new Array();
      if (lines[line][i] == "#") {
        single_comment_flag = true;
        for(var j = 0; j < i; ++j) {
          temp.push(lines[line][j]);
        }
        break;
      }
      else {
        single_comment_flag = false;
      }
    }

    var temp2 = new Array();
    ending_multi_comment_flag = false;
    for(var i = 0; i < lines[line].length-2; ++i) {
     if (lines[line][i] == "\"" && lines[line][i+1] == "\"" && lines[line][i+2] == "\"") {
       if (multi_comment_flag) {
         multi_comment_flag = false;
         ending_multi_comment_flag = true;
         for (var j = i+2; j < lines[line].length-2; ++j) {
          temp2.push(lines[line][j]);
        }
      }
      else {
        multi_comment_flag = true;
        for (var j=0; j<i; ++j) {
          temp2.push(lines[line][j]);
        }
      }
    }
  }
    if (single_comment_flag == false && multi_comment_flag == false && ending_multi_comment_flag == false) {
      temp = lines[line];
      answer.push(temp);
    }
    else {
      if (multi_comment_flag == true || ending_multi_comment_flag == true) {
        answer.push(temp2);
      }
      else {
        answer.push(temp);
      }
    }
  }
  
  var arrayToString = function(array) {
    var str = "";
    array.forEach(function(a) {
      var item = "";
      for(var i = 0; i < a.length; ++i) {
        item = item + a[i];
      }
      str = str ? str + '\n' + item : item;
    });
    return str;
  }
  var str = arrayToString(answer);
  out = str;
}

/*
  var lines = text.split('\n');
  var answer = new Array();
  var single_comment_flag = false;
  var multi_comment_flag = false;
  var ending_multi_comment_flag = false;

  for (var line = 0; line < lines.length; ++line) {
    for (var i = 0; i < lines[line].length; ++i) {
      if (multi_comment_flag == true) {
        break;
      }
      var temp = new Array();
      if (lines[line][i] == "#") {
        single_comment_flag = true;
        for (var j = 0; j < i; ++j) {
          temp.push(lines[line][j]);
        }
        break;
      }
      else {
        single_comment_flag = false;
      }

      var temp2 = new Array();
      ending_multi_comment_flag = false;
      for (var i = 0; i < lines[line].length-2; ++i) {
        if (lines[line][i]=="\"" && lines[line][i+1]=="\"" && lines[line][i+2]=="\""){
          if (multi_comment_flag) {
            multi_comment_flag = false;
            ending_multi_comment_flag = true;
            for (var j = i+2; j < lines[line].length-2; ++j) {
              temp2.push(lines[line][j]);
            }
          }
          else {
            multi_comment_flag = true;
            for (var j = 0; j < i; ++j) {
              temp2.push(lines[line][j]);
            }
          }
        }
      }
      if (single_comment_flag == false && multi_comment_flag == false && ending_multi_comment_flag == false) {
        temp = lines[line];
        answer.push(temp);
      }
      else {
        if (multi_comment_flag == true || ending_multi_comment_flag == true) {
          answer.push(temp2);
        }
        else {
          answer.push(temp);
        }
      }
    }

    var arrayToString = function(array) {
      var str = "";
      array.forEach(function(a) {
        var item = "";
        for (var i = 0; i < a.length; ++i) {
          item = item + a[i];
        }
        str = str ? str + '\n' + item : item;
      });
      return str;
    }
    var str = arrayToString(answer);
    out = str;
}
*/


// this function needs d3js!
function parse_csv(text, out) {
  text = reader.result;
  var parsed = d3.csvParse(text);
  console.log(parsed);
  var n = 10; //number of rows outputted
  for (var i = 0; i < n; ++i) {
    var str = "";
    var rn = Math.floor(Math.random() * (parsed.length));

    var last_key = "";
    for (const [key, value] of Object.entries(parsed[rn])) {
      last_key = key;
    }
    for (const [key, value] of Object.entries(parsed[rn])) {
      str = str + value;
      if (key != last_key) {
        str = str + " | ";
      }
    }
    out = str;
  }
}

// input: code as string, output: array of strings (max 500 tokens each)
function shorten(text, out) {
  var functions = new Array();
  var lines = text.split('\n');

  var start = 0;
  var end = lines.length;

  var sum = 0;

  for (var i = 0; i < lines.length; ++i) {
    sum = sum + lines[i].length;
    if (sum > 499) {
      sum = 0;
      var str = "";
      for (var j = start; j < i; ++j) {
        str = str + lines[j] + '\n';
      }
      start = i;
      functions.push(str);
    }
  }
  var str = "";
  for (var j = start; j < lines.length; ++j) {
    str = str + lines[j] + '\n';
  }
  functions.push(str);
  out = functions;
}
