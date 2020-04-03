$('.slider-one')
.not('.slick-intialized')
.slick({
    autoplay: true,
    autoplaySpeed: 3000,
    dots: true,
    nextArrow: ".site-slider .slider-btn .next",
    prevArrow: ".site-slider .slider-btn .prev"
});

$('.slider-two')
.not('.slick-intialized')
.slick({
    nextArrow: ".site-slider-two .next",
    prevArrow: ".site-slider-two .prev",
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplaySpeed: 3000
});