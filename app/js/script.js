//прокрутка вгору
function scrollTo(to, duration = 700) {
    const
        element = document.scrollingElement || document.documentElement,
        start = element.scrollTop,
        change = to - start,
        startDate = +new Date(),
        // t = current time
        // b = start value
        // c = change in value
        // d = duration
        easeInOutQuad = function (t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        },
        animateScroll = function () {
            const currentDate = +new Date();
            const currentTime = currentDate - startDate;
            element.scrollTop = parseInt(easeInOutQuad(currentTime, start, change, duration));
            if (currentTime < duration) {
                requestAnimationFrame(animateScroll);
            }
            else {
                element.scrollTop = to;
            }
        };
    animateScroll();
}

document.addEventListener('DOMContentLoaded', function () {
    let btn = document.querySelector('#toTop');
    window.addEventListener('scroll', function () {
        
        if (pageYOffset > 100) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });

    
    btn.onclick = function (click) {
        click.preventDefault();
        scrollTo(0, 400);
    }
});
//прокрутка вгору ^^^^

// change the background of the page according to the value of the checkbox
// const input = document.querySelector('input[type="checkbox"]');
// function handleInput() {
//   const { checked } = this;
//   document.querySelector('body').style.background = checked ? '#151d29' : '#fffff7';
//   document.querySelector('body').style.color = checked ? '#fffff7' : '#002';
// //   document.querySelector('h1').style.color = checked ? '#fffff7' : 'rgba(27, 27, 26, 0.8)';
// //   document.querySelector('p').style.color = checked ? '#fffff7' : '#002';
  
// }
// input.addEventListener('input', handleInput);
var btn = document.getElementById("theme-button");
var link = document.getElementById("theme-link");

btn.addEventListener("click", function () { ChangeTheme(); });

function ChangeTheme()
{
    let lightTheme = "css/style.css";
    let darkTheme = "css/dark.css";

    var currTheme = link.getAttribute("href");
    var theme = "";

    if(currTheme == lightTheme)
    {
   	 currTheme = darkTheme;
   	 theme = "style";
    }
    else
    {    
   	 currTheme = lightTheme;
   	 theme = "dark";
    }

    link.setAttribute("href", currTheme);

    Save(theme);
}

