let menuElement = document.getElementById("menu");
let miniProfileElement = document.getElementById("mini-profile");
let cardWrapperElement = document.getElementById("card-wrapper");
let links = menuElement.querySelectorAll("a");

// Event listener.
document.addEventListener('DOMContentLoaded', function () {
    let hash = window.location.hash; // Lấy phần ID trong URL khi trang được tải
    // Xử lý sự kiện khi trang được tải và có phần ID trong URL
    if (hash) {
        let element = document.querySelector(`a[href="${hash}"]`);
        let event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(event);
    }
});

links.forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault();
        let href = this.getAttribute('href');
        let selectedElement = document.querySelector(href);

        menuElement.querySelector("a.active").classList.remove("active");
        link.classList.add("active");

        if (window.matchMedia("only screen and (max-width: 760px)").matches) {
            let offset = selectedElement.getBoundingClientRect().top + window.scrollY - miniProfileElement.offsetHeight - menuElement.offsetHeight;
            if (Math.abs(window.scrollY - offset) > 1) { // Sử dụng một ngưỡng nhỏ để kiểm tra
                window.scrollTo({
                    top: offset,
                    behavior: 'smooth'
                });
            }
        } else {
            let currentActive = cardWrapperElement.querySelector("div.card.active");
            currentActive.classList.add("animate__fadeOutUp", "disableScroll");
            currentActive.classList.remove("active", "animate__fadeInUp");

            selectedElement.classList.remove("animate__fadeOutUp");
            selectedElement.classList.add("active", "animate__fadeInUp", "disableScroll");
            selectedElement.addEventListener("animationend", animationendHandler);
        }
        let url = window.location.origin + window.location.pathname + href;
        history.pushState(null, null, url);
    });
});
function animationendHandler(e) {
    e.currentTarget.classList.remove("disableScroll");
}


let i = 0, title = "Software Engineer", renderedTitle = "";
let titleElement = document.querySelector("#title");
let miniProfileTitleElement = miniProfileElement.querySelector(".title");

typingEffect();
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function typingEffect() {
    if (i < title.length) {
        renderedTitle += title.charAt(i);
        miniProfileTitleElement.textContent = renderedTitle;
        titleElement.textContent = renderedTitle;
        i++;
    } else {
        if (titleElement.textContent) {
            let ms = titleElement.textContent.length === title.length ? 2000 : 0;
            await delay(ms);
            renderedTitle = renderedTitle.slice(0, -1);
            titleElement.textContent = renderedTitle;
            miniProfileTitleElement.textContent = renderedTitle;
        } else {
            i = 0;
        }
    }
    setTimeout(typingEffect, 100);
}


// 
let en = {
    about: {
        info: {
            p0: "I am Vũ Văn, a software engineer.",
            p1: "With a deep passion for creating new applications and technologies, I am always ready to face challenges and explore innovative solutions.",
            p2: "By combining expertise with creativity, I aim to contribute to the development of software products that bring real value to the community."
        }
    },
    services: {
        s0: {
            title: "Web Development",
            content: "A comprehensive web development service delivering modern, mobile-responsive websites to amplify your marketing reach."
        },
        s1: {
            title: "System Design",
            content: "System Design Services involve crafting comprehensive and scalable software architectures tailored to meet the specific needs and requirements of businesses, ensuring efficiency, scalability, and security."
        },
        s2: {
            title: "Windows Application Development",
            content: "Windows Application Development Service crafting efficient and user-friendly Windows applications tailored to your specific needs."
        },
        s3: {
            title: "Consultancy and Solution Provision",
            content: "Consultancy and Solution Provision service offers tailored guidance and comprehensive solutions to address specific challenges and enhance business efficiency and effectiveness."
        }
    }
}
let vi = {
    about: {
        info: {
            p0: "Tôi là Vũ Văn, một kỹ sư phần mềm.",
            p1: "Với sự đam mê sâu sắc trong việc tạo ra các ứng dụng và công nghệ mới, tôi luôn sẵn sàng đối mặt với thách thức và khám phá những giải pháp sáng tạo.",
            p2: "Bằng cách kết hợp kiến thức và sáng tạo, tôi mong muốn đóng góp vào việc phát triển các sản phẩm phần mềm mang lại giá trị thực tế cho cộng đồng."
        }
    },
    services: {
        s0: {
            title: "Phát triển website",
            content: "Dịch vụ Phát triển Web toàn diện cung cấp các trang web hiện đại, tương thích với thiết bị di động để mở rộng phạm vi tiếp thị của bạn."
        },
        s1: {
            title: "Thiết kế hệ thống",
            content: "Dịch vụ Thiết kế Hệ thống bao gồm việc tạo ra các kiến ​​trúc phần mềm toàn diện và có thể mở rộng phù hợp để đáp ứng các nhu cầu và yêu cầu cụ thể của doanh nghiệp, đảm bảo hiệu quả, khả năng mở rộng và bảo mật."
        },
        s2: {
            title: "Phát triển ứng dụng Windows",
            content: "Dịch vụ Phát triển Ứng dụng Windows tạo ra các ứng dụng Windows hiệu quả và thân thiện với người dùng phù hợp với nhu cầu cụ thể của bạn."
        },
        s3: {
            title: "Tư vấn và cung cấp giải pháp",
            content: "Dịch vụ Tư vấn và Cung cấp Giải pháp cung cấp hướng dẫn phù hợp và giải pháp toàn diện để giải quyết các thách thức cụ thể và nâng cao hiệu suất và hiệu suất kinh doanh."
        }
    }
}
let langToggles = document.querySelectorAll(".lang-toggle");
langToggles.forEach(langToggle => {
    langToggle.addEventListener("click", function () {
        let lang = langToggle.textContent;
        let content;
        if (lang === "EN") {
            lang = "VI";
            content = vi;
        } else {
            lang = "EN";
            content = en;
        }
        langToggle.textContent = lang;
        let infoP = document.querySelectorAll(".info p");
        for(let i=0; i<infoP.length; i++) {
            infoP[i].textContent = content.about.info["p" + i];
        }
        let services = document.querySelectorAll(".services .child-content");
        for(let i=0; i<services.length; i++) {
            services[i].querySelector(".content-title h3").textContent = content.services["s" + i].title;
            services[i].querySelector(".content-text p").textContent = content.services["s" + i].content;
        }
    });
});


let themeToggles = document.querySelectorAll(".theme-toggle");
themeToggles.forEach(themeToggle => {
    let icon = themeToggle.querySelector("i");
    themeToggle.addEventListener("click", function () {
        let theme = "";
        if (icon.classList.contains("fa-sun")) {
            icon.classList.remove("fa-sun");
            icon.classList.add("fa-moon");
            theme = "dark";
            document.body.classList.add(theme);
        } else {
            icon.classList.remove("fa-moon");
            icon.classList.add("fa-sun");
            document.body.classList.remove("dark");
            theme = "light";
        }
        document.documentElement.setAttribute("data-color-scheme", theme);
    });
});

// Submit message.
let contactForm = document.getElementById("contact-form");
contactForm.addEventListener("submit", function(e) {
    e.preventDefault();
    let name = contactForm.querySelector("[name='name']").value;
    let email = contactForm.querySelector("[name='email']").value;
    let message = contactForm.querySelector("[name='message']").value;

    fetch("https://script.google.com/macros/s/AKfycbx32Wf7-ParIyZJGCYlMCipPro77wOhEDAFplnji0CMQ0RIJ4VGARgzgCwgP0LYFg5mfw/exec", {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            email: email,
            message: message
        })
    }).then(response => {
        console.log("Success:", response);
    }).catch(error => {
        console.error("Error:", error);
    });
});