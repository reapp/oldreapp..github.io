(function() {

  var headers = document.querySelectorAll('.page h2, .page h3');
  var navUl = makeList(headers);

  var nav = document.getElementById('nav');
  nav.innerHTML = navUl;


  function makeList(nodes) {
    return '<ul>' + (
      [].map.call(headers, function(header) {
        return (
          '<li class="'+
            header.tagName
          +'"><a href="#' +
          header.getAttribute('id') +
          '">' +
          header.innerHTML +
          '</a></li>'
        );
      }).join('')
    )
    + '</ul>';
  }

})();

var sticky = {
    sticky_after: 0,
    init: function() {
        this.header = document.getElementById('nav');
        this.sticky_after = this.header.getBoundingClientRect().top;
        this.scroll();
        this.events();
    },

    scroll: function() {
        if(window.scrollY > this.sticky_after) {
            this.header.classList.add('fixed');
        }
        else {
            this.header.classList.remove('fixed');
        }
    },

    events: function() {
        window.addEventListener("scroll", this.scroll.bind(this));
    }
};

document.addEventListener("DOMContentLoaded", sticky.init.bind(sticky));