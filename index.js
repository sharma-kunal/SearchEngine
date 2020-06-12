window.onload = initAll;

window.onresize = resize;


function resize() {
  var containerHeight = $('.container').height();
  suggestionsHeight = containerHeight-40;
  $('#suggestions').height(suggestionsHeight);
}

function initAll() {
  document.getElementById('tableSearch').value = '';
}

let input = document.getElementById('tableSearch');
let suggestionsBox = document.getElementById('suggestions');
let timeout = null;

input.addEventListener('keyup', function(e) {
  clearTimeout(timeout);
  timeout = setTimeout(function() {
    // call ajax request for searching
    if (input.value == null || input.value == "") {
      document.getElementById('suggestions').innerHTML = "";
      unhideButtons();
    } else {
          search(input.value);
    }
  }, 1000);
})

function search(value) {
  url = "https://kunalsharma01.herokuapp.com/api/movie/?name=" + value;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      suggestionsBox.style.display = "block";
      if (this.status == 200) {
        var jsonData = JSON.parse(xhttp.responseText);
        callbackFunc(jsonData);
        hideButtons();
        handleClick();
      } else {
        // handle error
        error();
      }
    }
  };
  xhttp.open("GET", url, true);
  xhttp.send();
}

function handleClick() {
  $(document).click(function() {
    suggestionsBox.style.display = "none";
    unhideButtons();
  });

  $(".container").click(function(e) {
    e.stopPropagation();
    return false;
  });
}

function error() {
  div = document.getElementById('suggestions');
  div.innerHTML = "<div class='alert alert-danger'><strong>Error!</strong> An error has occured.</div>";
}

function unhideButtons() {
  document.getElementById('buttons').style.display = "block";
}

function hideButtons() {
  document.getElementById('buttons').style.display = "none";
}

function callbackFunc(response) {
  // console.log(typeof response);
  // console.log("Hello");
  // console.log("hello");
  div = document.getElementById('suggestions');
  div.innerHTML = "";
  console.log(response.length);
  if (response.length == 0) {
    div.innerHTML = "<div class='alert alert-danger'><strong>No Result! </strong>No results found</div>";
  }
  for (let prop in response) {
    var name = response[prop]['name'];
    var movie = response[prop]['movie'];
    var year = response[prop]['year'];
    var image = response[prop]['image'];
    var id = response[prop]['id'];
    console.log(id);
    const div2 = document.createElement('div');
    div2.id = prop.toString(2);
    div2.className ='row';
    const img = document.createElement('img');
    img.src = image;
    div2.appendChild(img);
    const p1 = document.createElement('p');
    p1.className = 'movie_name';
    p1.innerText = name;
    p1.id = id;
    div2.appendChild(p1);
    const p2 = document.createElement('p');
    p2.className = 'year';
    p2.innerText = year;
    div2.appendChild(p2);
    const p3 = document.createElement('p');
    p3.className = 'type';
    if (movie) {
      p3.innerText = 'Movie';
    } else {
      p3.innerText = 'Show';
    }

    div2.appendChild(p3);
    // const p4 = document.createElement('p');
    // p4.className = 'id';
    // p4.id = prop.toString(2);
    // p4.innerText = id;
    // div2.appendChild(p4);
    div2.addEventListener("click", function(){
      // console.log(prop.toString(2));
      // var name = document.querySelector("[id="+"\'"+prop.toString(2)+"\'"+"]/p[class='movie_name']");
      var name = document.getElementById(prop.toString(2)).querySelectorAll('p');
      // console.log(name[0].innerHTML);
      // console.log(name[1].innerHTML);
      // input.value = name[0].innerHTML;
      // window.scrollTo(0,0);
      window.location.href = "https://kunalsharma01.herokuapp.com/movie?id=" + name[0].getAttribute('id') + "&year=" + name[1].innerHTML + "&type=" + (name[2].innerHTML).toLowerCase();
    });
    div.appendChild(div2);
  }

}
