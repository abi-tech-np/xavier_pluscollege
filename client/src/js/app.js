import "./bootstrap";
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

export function cleanupApp() {
    if (typeof ScrollTrigger !== 'undefined') {
        const instances = ScrollTrigger.getAll();
        console.log('[cleanupApp] Killing instances:', instances.length);
        instances.forEach(t => t.kill());
    }
}

export function refreshApp() {
    if (typeof ScrollTrigger !== 'undefined') {
        console.log('[refreshApp] ScrollTrigger instances:', ScrollTrigger.getAll().length);
        ScrollTrigger.refresh();
    }
}

export function initApp() {
    console.log('[initApp] Creating new ScrollTrigger instances. Before cleanup:', typeof ScrollTrigger !== 'undefined' ? ScrollTrigger.getAll().length : 0);
    cleanupApp(); // Kill old instances before creating new ones

const header = document.querySelector("header");
const logo = header.querySelector(".logo");

const headerTl = gsap.timeline({
    scrollTrigger: {
        trigger: "main",
        start: "top+=500px top+=30%",
        end: "top+=500px top+=30%",
        onEnter: () => animateOnce(),
    },
});

function animateOnce() {
    logo.querySelector("a").style.transform = "translateY(50%) scale(.6)";
    logo.querySelector("a").style.paddingBottom = "0";
}

const headerAnimate = (direction) => {
    if (direction === -1) {
        logo.querySelector("a").style.transform = "translateY(100%) scale(1)";

        if (window.matchMedia("(max-width: 992px)").matches) {
            logo.querySelector("a").style.paddingBottom = "14px";
        } else {
            logo.querySelector("a").style.paddingBottom = "50px";
        }
    } else {
        animateOnce();
    }
};

ScrollTrigger.create({
    trigger: "main",
    start: "top+=500px top+=30%",
    scrub: 0.5,
    onUpdate: (self) => {
        // console.log(self.direction)
        headerAnimate(self.direction);
    },
});

/* Full page menu migrated to React */
// const menu = document.getElementById("hamburger-menu");

// const fullMenu = document.getElementById("full__menu-overlay");

// if (fullMenu) {
//     fullMenu.addEventListener("click", function () {
//         closeNav();
//     });
// }
// if (menu) {
//     menu.addEventListener("click", function () {
//         if (menu.classList.contains("menu-close")) {
//             openNav();
//         } else if (menu.classList.contains("menu-open")) {
//             closeNav();
//         }
//     });
// }

// document.addEventListener("keydown", function (e) {
//     if (e.key === "Escape") {
//         // closeNav();
//     }
// });

// function openNav() {
//     document.getElementById("myNav").style.transform = "translateY(0)";
//     document.querySelector("html").style.overflow = "hidden";
//     document.querySelector(".hamburger-icon").classList.add("hamburger-open");
//     menu.classList.add("menu-open");
//     menu.classList.remove("menu-close");
// }

// function closeNav() {
//     document.getElementById("myNav").style.transform = "translateY(-200%)";
//     document.querySelector("html").style.overflowY = "auto";
//     document
//         .querySelector(".hamburger-icon")
//         .classList.remove("hamburger-open");
//     menu.classList.remove("menu-open");
//     menu.classList.add("menu-close");
// }

if (window.location.pathname === "/") {
    // homepage Animation
    const { innerHeight } = window;
    const tlLetter = gsap.timeline({
        scrollTrigger: {
            trigger: ".animation__section",
            start: "top bottom",
            end: "bottom bottom",
            // markers: true,
            scrub: 1,
            ease: "linear",
        },
    });

    tlLetter.to(".letterI", {
        height: 200,
    });

    const tlLogo = gsap.timeline({
        scrollTrigger: {
            trigger: ".animation__section",
            pin: ".animation__section .logo",
            start: "bottom bottom",
            end: "bottom bottom-=50%",
            // markers: true,
            scrub: 1,
            ease: "linear",
            // snap:true,
        },
    });

    tlLogo.to(".animation__section .logo", {
        scale: 17,
        opacity: 0,
    });

    const aLevel = document.querySelector("#AlevelList");
    const plusTwo = document.querySelector("#plusTwoList");

    if (aLevel && plusTwo) {
        aLevel.addEventListener("click", function () {
            plusTwo.parentElement.classList.remove("active");
            aLevel.parentElement.classList.add("active");
        });
        plusTwo.addEventListener("click", function () {
            aLevel.parentElement.classList.remove("active");
            plusTwo.parentElement.classList.add("active");
        });
    }
}

var alumniSwiper = new Swiper(".alumni__list", {
    slidesPerView: 1,
    spaceBetween: 10,
    // centeredSlides: true,
    initialSlide: 1,
    breakpoints: {
        475: {
            slidesPerView: 3,
            //   centeredSlides: false,
        },
        768: {
            slidesPerView: "auto",
            spaceBetween: 0,
        },
    },
});
var coursePlusTwo = new Swiper("#plustwo", {
    slidesPerView: 1,
    spaceBetween: 10,
    // centeredSlides: true,
    // initialSlide: 2,
    breakpoints: {
        365: {
            slidesPerView: 1.2,
            // centeredSlides: true,
            // initialSlide: 2.5,
        },
        425: {
            slidesPerView: 1.4,
        },
        525: {
            slidesPerView: 1.7,
        },
        691: {
            slidesPerView: 2.5,
        },
        893: {
            slidesPerView: 3,
        },
        1366: {
            slidesPerView: "auto",
            spaceBetween: 10,
            centeredSlides: false,
            initialSlide: 0,
        },
    },
});

var coursePlusTwo = new Swiper("#alevel", {
    slidesPerView: 1,
    spaceBetween: 10,
    // centeredSlides: true,
    // initialSlide: 2,
    breakpoints: {
        365: {
            slidesPerView: 1.2,
            // centeredSlides: true,
            // initialSlide: 2.5,
        },
        425: {
            slidesPerView: 1.4,
        },
        525: {
            slidesPerView: 1.7,
        },
        691: {
            slidesPerView: 2.5,
        },
        893: {
            slidesPerView: 3,
        },
        1366: {
            slidesPerView: "auto",
            spaceBetween: 10,
            centeredSlides: false,
            initialSlide: 0,
        },
    },
});

var testimonial = new Swiper(".testimonial__list", {
    slidesPerView: 1,
    spaceBetween: 30,
    autoplay: {
        delay: 5000,
        disableOnInteraction: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});

function courses() {
    const coursesTitleContainer = document.querySelector(".courses__btns");
    const coursesTitleBtn = document.querySelectorAll(".courses__btns button");
    const coursesDetails = document.querySelectorAll(
        ".courses__list-container .courses__list"
    );
    if (coursesTitleContainer) {
        coursesTitleContainer.addEventListener("click", function (e) {
            const clicked = e.target.closest(".courses__btns button");

            if (!clicked) return;

            coursesTitleBtn.forEach((btn) => btn.classList.remove("active"));
            clicked.classList.add("active");

            coursesDetails.forEach((content) => content.classList.remove("show"));
            // console.log(clicked.dataset.name);
            const targetContent = document.querySelector(`#${clicked.dataset.name}`);
            if (targetContent) targetContent.classList.add("show");
        });
    }
}

if (
    window.location.pathname === "/" ||
    window.location.pathname == "/our-courses"
) {
    courses();
}

// Alumni video play/pause is now handled by React LazyVideo component

// document.addEventListener("DOMContentLoaded", function () {
const compulsoryButton = document.querySelector('[data-name="compulsory"]');
const optionalButton = document.querySelector('[data-name="optional"]');
const compulsorySubjects = document.querySelector(
    '.subject-list[data-name="compulsory"]'
);
const optionalSubjects = document.querySelector(
    '.subject-list[data-name="optional"]'
);
if (compulsoryButton) {
    function toggle(button, subjects) {
        compulsoryButton.classList.toggle(
            "active",
            button === compulsoryButton
        );
        optionalButton.classList.toggle("active", button === optionalButton);
        compulsorySubjects.style.display =
            button === compulsoryButton ? "block" : "none";
        optionalSubjects.style.display =
            button === optionalButton ? "block" : "none";
    }

    toggle(compulsoryButton, compulsorySubjects);

    compulsoryButton.addEventListener("click", function () {
        toggle(compulsoryButton, compulsorySubjects);
    });

    optionalButton.addEventListener("click", function () {
        toggle(optionalButton, optionalSubjects);
    });
}
// });

if (window.location.pathname === "/apply-now" || window.location.pathname === "/contact-us") {
    const toastDiv = document.querySelector(".apply__popup");
    if (toastDiv) {
        // Function to handle mutations
        function handleMutations(mutations) {
            mutations.forEach(function (mutation) {
                if (
                    mutation.type === "attributes" &&
                    mutation.attributeName === "class"
                ) {
                    // Check if the 'open' class is added or removed
                    var isOpen =
                        toastDiv.classList.contains("apply__popup-open");

                    const toastCloseBtn = document.querySelector(
                        ".apply__popup .apply__popup__closebtn"
                    );
                    toastCloseBtn.addEventListener("click", function () {
                        toastDiv.classList.remove("apply__popup-open");
                        document.querySelector("html").style.overflow =
                            "visible";
                    });

                    const btnsDownload = document.querySelectorAll(
                        ".btn__container .btn"
                    );

                    // console.log(btnsDownload);

                    if (isOpen) {
                        document.querySelector("html").style.overflow =
                            "hidden";

                        btnsDownload.forEach((btn) => {
                            btn.addEventListener("click", function () {
                                setTimeout(function () {
                                    // console.log("asdasd")
                                    toastDiv.classList.remove(
                                        "apply__popup-open"
                                    );
                                    document.querySelector(
                                        "html"
                                    ).style.overflow = "visible";
                                }, 500);
                            });
                        });
                    }
                }
            });
        }

        // Create an observer instance
        var observer = new MutationObserver(handleMutations);

        // Configuration of the observer:
        var config = {
            attributes: true,
            attributeFilter: ["class"],
            subtree: true,
        };

        // Start observing the target node for changes to the class attribute
        observer.observe(toastDiv, config);
    }

    
}

// Popup
const popupMenu = document.querySelector(".popup-menu");
const popupMenuCloseBtn = document.querySelectorAll(".popup-menu__closebtn");
const popupMenuOverlay = document.querySelector(".popup-menu__bg-overlay");
if (popupMenu) {
    if (popupMenu.classList.contains("popup-menu-open")) {
        document.querySelector("html").style.overflow = "hidden";
    }

    popupMenuOverlay.addEventListener("click", function () {
        popupMenu.classList.remove("popup-menu-open");
        document.querySelector("html").style.overflowY = "auto";
        // window.localStorage.removeItem('check-popup');
    });

    popupMenuCloseBtn.forEach((closeBtn) =>
        closeBtn.addEventListener("click", function () {
            // console.log(closeBtn.closest('.popup-menu__inner'));
            closeBtn.closest(".popup-menu__inner").remove();
            // closeBtn.classList.remove('popup-menu-open');
            // document.querySelector("html").style.overflow = "auto";
            if (popupMenu.children.length == 1) {
                popupMenu.classList.remove("popup-menu-open");
                document.querySelector("html").style.overflowY = "auto";
            }
        })
    );

    // popupMenuCloseBtn.addEventListener('click', function () {
    //     popupMenu.classList.remove('popup-menu-open');
    //     document.querySelector("html").style.overflow = "auto";
    //     // window.localStorage.removeItem('check-popup');
    // })

    document.addEventListener("keydown", function (e) {
        if (
            e.key === "Escape" &&
            popupMenu.classList.contains("popup-menu-open")
        ) {
            popupMenu.classList.remove("popup-menu-open");
        }
    });
}
} // End initApp
