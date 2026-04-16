// Mobile Menu Toggle
document.addEventListener("DOMContentLoaded", function () {
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const nav = document.getElementById("nav");
    const header = document.getElementById("header");
    const backToTop = document.getElementById("backToTop");
  
    if (mobileMenuBtn && nav && header) {
      mobileMenuBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        nav.classList.toggle("active");
        header.classList.toggle("active");
  
        mobileMenuBtn.innerHTML = nav.classList.contains("active")
          ? '<i class="fas fa-times"></i>'
          : '<i class="fas fa-bars"></i>';
      });
    }
  
    // Close mobile menu when clicking on a nav link
    document.querySelectorAll("nav ul li a").forEach((link) => {
      link.addEventListener("click", function () {
        if (nav) nav.classList.remove("active");
        if (header) header.classList.remove("active");
        if (mobileMenuBtn) {
          mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
      });
    });
  
    // Close mobile menu when clicking outside
    document.addEventListener("click", function (e) {
      if (
        nav &&
        header &&
        mobileMenuBtn &&
        nav.classList.contains("active") &&
        !nav.contains(e.target) &&
        !mobileMenuBtn.contains(e.target)
      ) {
        nav.classList.remove("active");
        header.classList.remove("active");
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });
  
    // Header scroll effect
    window.addEventListener("scroll", function () {
      if (!header) return;
      if (window.scrollY > 100) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
  
      if (backToTop) {
        if (window.scrollY > 300) {
          backToTop.classList.add("active");
        } else {
          backToTop.classList.remove("active");
        }
      }
    });
  
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
  
        if (href === "#") {
          e.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
          return;
        }
  
        const targetElement = document.querySelector(href);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: "smooth",
          });
        }
      });
    });
  
    // Animation on scroll
    const animateElements = document.querySelectorAll(".animate");
  
    function animateOnScroll() {
      animateElements.forEach((element) => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
  
        if (elementPosition < screenPosition) {
          element.style.opacity = "1";
          element.style.transform = "translateY(0)";
        }
      });
    }
  
    window.addEventListener("scroll", animateOnScroll);
    window.addEventListener("load", animateOnScroll);
  });