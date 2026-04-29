"use client";

import { createElement, useEffect, useMemo, useState } from "react";
import type { PortfolioData } from "@/lib/types";

type Props = {
  data: PortfolioData;
};

const navItems = [
  ["HOME", "home"],
  ["SUMMARY", "about_me_sec"],
  ["SOCIALS", "Social_me_sec"],
  ["ABOUT", "about_me"],
  ["SKILLS", "Skills"],
  ["PROJECTS", "Projects"],
  ["CERTIFICATIONS", "Certifications"],
  ["TESTIMONIALS", "Testimonials"],
  ["CONTACT", "Contact"]
] as const;

function primaryProjectUrl(liveUrl: string, repoUrl: string) {
  return liveUrl || repoUrl || "#";
}

function renderHeroHeadline(headline: string) {
  if (
    headline ===
    "I am a Developer specializing in Python, frontend design, and crafting clean, impactful digital solutions."
  ) {
    return (
      <big>
        <span className="highlight-font">I </span>am a <span className="highlight-font">Developer</span> specializing in{" "}
        <span className="highlight-font">Python</span>, frontend design, and <span className="highlight-font">crafting</span>{" "}
        clean, impactful digital <span className="highlight-font">solutions</span>.
      </big>
    );
  }

  return <big>{headline}</big>;
}

export function PortfolioPage({ data }: Props) {
  const [darkMode, setDarkMode] = useState(() => {
    return typeof window !== "undefined" && window.localStorage.getItem("theme") === "dark";
  });

  const skillsByCategory = useMemo(() => {
    return data.skills.reduce<Record<string, string[]>>((groups, skill) => {
      groups[skill.category] = [...(groups[skill.category] || []), skill.name];
      return groups;
    }, {});
  }, [data.skills]);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    window.localStorage.setItem("theme", darkMode ? "dark" : "light");

    if (darkMode && !document.querySelector('script[data-spline-viewer="true"]')) {
      const script = document.createElement("script");
      script.type = "module";
      script.src = "https://unpkg.com/@splinetool/viewer@1.9.56/build/spline-viewer.js";
      script.dataset.splineViewer = "true";
      document.head.appendChild(script);
    }

    return () => {
      document.body.classList.remove("dark-mode");
    };
  }, [darkMode]);

  useEffect(() => {
    document.querySelectorAll(".animate-on-load").forEach((element) => {
      element.classList.add("is-visible");
    });

    const cursor = document.querySelector<HTMLElement>(".cursor");
    const cursorText = document.querySelector<HTMLElement>(".cursor-text");
    let rafId: number | null = null;
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;

    const animateCursor = () => {
      if (!cursor) {
        return;
      }

      cursorX += (mouseX - cursorX) * 0.1;
      cursorY += (mouseY - cursorY) * 0.1;
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      rafId = window.requestAnimationFrame(animateCursor);
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      if (!rafId) {
        animateCursor();
      }
    };

    if (cursor && !window.matchMedia("(max-width: 768px)").matches) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    }

    const cursorElements = Array.from(document.querySelectorAll<HTMLElement>("[data-cursor-text]"));
    const cursorEnterHandlers = cursorElements.map((element) => {
      const handler = () => {
        cursor?.classList.add("active");
        if (cursorText) {
          cursorText.textContent = element.getAttribute("data-cursor-text") || "";
        }
      };
      element.addEventListener("mouseover", handler, { passive: true });
      return { element, handler };
    });

    const cursorLeaveHandlers = cursorElements.map((element) => {
      const handler = () => {
        cursor?.classList.remove("active");
        if (cursorText) {
          cursorText.textContent = "";
        }
      };
      element.addEventListener("mouseout", handler, { passive: true });
      return { element, handler };
    });

    const navLinks = document.querySelector<HTMLElement>(".nav-links");
    const hamburger = document.querySelector<HTMLElement>(".hamburger");

    const smoothScrollTo = (targetId: string) => {
      const targetElement = document.querySelector(targetId);
      if (!targetElement) {
        return;
      }
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const linkHandlers = Array.from(document.querySelectorAll<HTMLAnchorElement>(".navbar-link")).map((link) => {
      const handler = (event: MouseEvent) => {
        event.preventDefault();
        const targetId = link.getAttribute("href");
        if (!targetId) {
          return;
        }
        navLinks?.classList.remove("active");
        smoothScrollTo(targetId);
        window.history.pushState(null, "", targetId);
      };
      link.addEventListener("click", handler);
      return { link, handler };
    });

    const handlePopState = () => {
      if (window.location.hash) {
        smoothScrollTo(window.location.hash);
      }
    };

    window.addEventListener("popstate", handlePopState);

    if (window.location.hash) {
      window.setTimeout(() => {
        smoothScrollTo(window.location.hash);
      }, 500);
    }

    const updateActiveNavLink = () => {
      let currentSectionId = "";
      const sections = document.querySelectorAll<HTMLElement>(".full-page-section, #Projects, #Certifications");
      const scrollPosition = window.scrollY;

      sections.forEach((section) => {
        if (section.offsetTop <= scrollPosition + window.innerHeight / 2) {
          currentSectionId = section.id;
        }
      });

      document.querySelectorAll(".navbar-link").forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${currentSectionId}`) {
          link.classList.add("active");
        }
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = Number.parseInt(entry.target.getAttribute("data-delay") || "0", 10);
            window.setTimeout(() => {
              entry.target.classList.add("is-visible");
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "50px 0px -50px 0px"
      }
    );

    document.querySelectorAll(".animate-on-scroll").forEach((element) => observer.observe(element));

    const horizontalContainer = document.querySelector<HTMLElement>(".horizontal-scroll-container");
    const scrollContent = document.querySelector<HTMLElement>(".scroll-content");
    const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

    const handleHorizontalScroll = () => {
      if (!horizontalContainer || !scrollContent || isMobile()) {
        if (scrollContent) {
          scrollContent.style.transform = "translateX(0px)";
        }
        return;
      }

      const containerRect = horizontalContainer.getBoundingClientRect();
      const scrollTop = -containerRect.top;
      const scrollableHeight = horizontalContainer.scrollHeight - window.innerHeight;

      if (scrollTop < 0 || scrollTop > scrollableHeight) {
        return;
      }

      const progress = scrollTop / scrollableHeight;
      const maxTranslate = scrollContent.scrollWidth - window.innerWidth;
      scrollContent.style.transform = `translateX(${-maxTranslate * progress}px)`;
    };

    const handleScroll = () => {
      if (scrollTimeout) {
        return;
      }
      scrollTimeout = setTimeout(() => {
        handleHorizontalScroll();
        updateActiveNavLink();
        scrollTimeout = null;
      }, 16);
    };

    const handleResize = () => {
      if (resizeTimeout) {
        return;
      }
      resizeTimeout = setTimeout(() => {
        handleHorizontalScroll();
        resizeTimeout = null;
      }, 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    updateActiveNavLink();
    handleHorizontalScroll();

    const toggleMenu = () => navLinks?.classList.toggle("active");
    const closeMenu = () => navLinks?.classList.remove("active");
    hamburger?.addEventListener("click", toggleMenu);
    navLinks?.addEventListener("click", closeMenu);

    const leftBtn = document.querySelector<HTMLButtonElement>("#Projects .scroll-btn.left");
    const rightBtn = document.querySelector<HTMLButtonElement>("#Projects .scroll-btn.right");

    const updateScrollButtons = () => {
      if (!scrollContent || !leftBtn || !rightBtn) {
        return;
      }
      const maxScrollLeft = scrollContent.scrollWidth - scrollContent.clientWidth;
      leftBtn.classList.toggle("disabled", scrollContent.scrollLeft <= 1);
      rightBtn.classList.toggle("disabled", scrollContent.scrollLeft >= maxScrollLeft - 1);
    };

    const scrollByCard = (direction: number) => {
      if (!scrollContent) {
        return;
      }
      const card = scrollContent.querySelector<HTMLElement>(".project-card");
      const gap = Number.parseInt(getComputedStyle(scrollContent).columnGap || getComputedStyle(scrollContent).gap || "16", 10);
      const delta = (card ? card.clientWidth : window.innerWidth * 0.85) + gap;
      scrollContent.scrollBy({ left: direction * delta, behavior: "smooth" });
      window.setTimeout(updateScrollButtons, 400);
    };

    const leftHandler = () => scrollByCard(-1);
    const rightHandler = () => scrollByCard(1);
    leftBtn?.addEventListener("click", leftHandler);
    rightBtn?.addEventListener("click", rightHandler);
    scrollContent?.addEventListener("scroll", updateScrollButtons, { passive: true });
    updateScrollButtons();

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("popstate", handlePopState);
      observer.disconnect();
      cursorEnterHandlers.forEach(({ element, handler }) => element.removeEventListener("mouseover", handler));
      cursorLeaveHandlers.forEach(({ element, handler }) => element.removeEventListener("mouseout", handler));
      linkHandlers.forEach(({ link, handler }) => link.removeEventListener("click", handler));
      hamburger?.removeEventListener("click", toggleMenu);
      navLinks?.removeEventListener("click", closeMenu);
      leftBtn?.removeEventListener("click", leftHandler);
      rightBtn?.removeEventListener("click", rightHandler);
      scrollContent?.removeEventListener("scroll", updateScrollButtons);
    };
  }, [data.projects.length, data.certifications.length]);

  return (
    <>
      <div className="cursor">
        <span className="cursor-text" />
      </div>

      {data.profile.splineUrl
        ? createElement("spline-viewer", {
            id: "spline-background",
            url: data.profile.splineUrl,
            loading: "lazy"
          })
        : null}

      <div id="navigationbar">
        <span className="nav-name animate-on-load">
          <a href="#home" className="nav-brand-link">
            {data.profile.brandName}
          </a>
        </span>
        <div className="nav-right">
          <div className="nav-links animate-on-load">
            {navItems.map(([label, target]) => (
              <a className="navbar-link" href={`#${target}`} key={target}>
                {label}
              </a>
            ))}
          </div>
          <button
            id="theme-toggle"
            className="animate-on-load"
            data-cursor-text="Theme"
            type="button"
            onClick={() => setDarkMode((value) => !value)}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <svg className="sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.106a.75.75 0 0 1 0 1.06l-1.591 1.592a.75.75 0 0 1-1.06-1.061l1.591-1.591a.75.75 0 0 1 1.06 0ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5h2.25a.75.75 0 0 1 .75.75ZM17.803 17.803a.75.75 0 0 1-1.06 0l-1.591-1.591a.75.75 0 1 1 1.06-1.06l1.591 1.591a.75.75 0 0 1 0 1.06ZM12 21a.75.75 0 0 1-.75-.75v-2.25a.75.75 0 0 1 1.5 0v2.25a.75.75 0 0 1-.75.75ZM5.106 18.894a.75.75 0 0 1 0-1.06l1.591-1.592a.75.75 0 0 1 1.06 1.061l-1.591 1.591a.75.75 0 0 1-1.06 0ZM4.5 12a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5H5.25a.75.75 0 0 1-.75-.75ZM6.106 5.106a.75.75 0 0 1 1.06 0l1.591 1.591a.75.75 0 1 1-1.06 1.06l-1.591-1.591a.75.75 0 0 1 0-1.06Z" />
            </svg>
            <svg className="moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.981A10.503 10.503 0 0 1 18 18a10.5 10.5 0 0 1-10.5-10.5c0-1.61.362-3.14.993-4.522a.75.75 0 0 1 .819-.162Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <div className="hamburger animate-on-load" role="button" tabIndex={0} aria-label="Open menu">
            <div className="bar" />
            <div className="bar" />
            <div className="bar" />
          </div>
        </div>
      </div>

      <div id="header">
        <h1 className="animate-on-load">
          {renderHeroHeadline(data.profile.heroHeadline)}
        </h1>
      </div>

      <main id="main-content">
        <section id="home" className="full-page-section" />

        <section id="about_me_sec" className="full-page-section">
          <div className="content-panel">
            <p id="about_me_sec_para1">
              <b id="about_me_sec_para1_h1" className="animate-on-scroll">
                <big>{data.profile.summaryTitle}</big>
              </b>
              <br />
              <br />
              <span className="animate-on-scroll" data-delay="100">
                {data.profile.summary}
              </span>
            </p>
          </div>
        </section>

        <section id="Social_me_sec" className="full-page-section">
          <div className="social-container">
            {data.socials.map((social, index) => (
              <a
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="social-icon animate-on-scroll"
                data-delay={index * 150}
                data-cursor-text="Click"
                key={social.id}
              >
                {social.iconImageUrl ? <img src={social.iconImageUrl} alt={`${social.label} profile`} /> : null}
                <br />
                {social.label}
              </a>
            ))}
          </div>
        </section>

        <section id="about_me" className="full-page-section content-align-left">
          <div className="content-panel">
            <h2 className="animate-on-scroll">{data.profile.aboutTitle}:</h2>
            <p className="animate-on-scroll" data-delay="100">
              {data.profile.about}
            </p>
            <h2 className="animate-on-scroll" data-delay="200">
              Education:
            </h2>
            <div className="education-list animate-on-scroll" data-delay="300">
              {data.education.map((item) => (
                <p key={item.id}>
                  <big>
                    <b>{item.degree}:</b>
                  </big>
                  <br />
                  {item.institution}
                  {item.location ? `, ${item.location}` : ""} ({item.period})
                  {item.description ? (
                    <>
                      <br />
                      {item.description}
                    </>
                  ) : null}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section id="Skills" className="full-page-section">
          <div className="content-panel">
            <h2 className="animate-on-scroll">Skills:</h2>
            <div className="skills-container">
              {Object.entries(skillsByCategory).map(([category, skills], index) => (
                <div className="skill-card animate-on-scroll" data-delay={index * 120} key={category}>
                  <h3>{category}</h3>
                  <div className="skill-tags">
                    {skills.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="Projects" className="horizontal-scroll-container">
          <div className="sticky-wrapper">
            <button className="scroll-btn left" aria-label="Scroll left" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.75 19.5a.75.75 0 0 1-.53-.22l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.06 12l7.22 7.22a.75.75 0 0 1-.53 1.28Z" />
              </svg>
            </button>
            <button className="scroll-btn right" aria-label="Scroll right" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.25 4.5a.75.75 0 0 1 .53.22l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06L14.94 12 7.72 4.78a.75.75 0 0 1 .53-1.28Z" />
              </svg>
            </button>
            <div className="scroll-content">
              {data.projects.map((project, index) => (
                <div className="project-card animate-on-scroll" data-delay={index * 200} data-cursor-text="View" key={project.id}>
                  {project.imageUrl ? <img src={project.imageUrl} alt={project.imageAlt || project.title} /> : null}
                  <div className="project-info">
                    <h2>{project.title}</h2>
                    <p className="project-description">{project.description}</p>
                    <p className="tech-stack">
                      <b>{project.techStack.join(" | ")}</b>
                    </p>
                  </div>
                  <a
                    href={primaryProjectUrl(project.liveUrl, project.repoUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="project-link"
                    aria-label={`View ${project.title}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="Certifications" className="full-page-section">
          <div className="content-panel">
            <h2 className="animate-on-scroll">Certifications:</h2>
            {data.certifications.length > 0 ? (
              <div className="certifications-container">
                {data.certifications.map((cert, index) => (
                  <article className="certification-card animate-on-scroll" data-delay={index * 150} key={cert.id}>
                    {cert.fileUrl && cert.fileType !== "application/pdf" ? (
                      <img src={cert.fileUrl} alt={`${cert.title} certificate`} />
                    ) : null}
                    <div className="certification-info">
                      <h3>{cert.title}</h3>
                      <p>
                        <b>{cert.issuer}</b>
                        {cert.issueDate ? ` / ${cert.issueDate}` : ""}
                      </p>
                      {cert.skills.length > 0 ? <p className="tech-stack">{cert.skills.join(" | ")}</p> : null}
                      {cert.credentialUrl || cert.fileUrl ? (
                        <a href={cert.credentialUrl || cert.fileUrl} target="_blank" rel="noreferrer" data-cursor-text="View">
                          View Credential
                        </a>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="empty-state animate-on-scroll">Published certifications will appear here after you add them in admin.</p>
            )}
          </div>
        </section>

        <section id="Testimonials" className="full-page-section">
          <div className="content-panel">
            <p id="Testimonials_header" className="animate-on-scroll">
              What People Say About Me
            </p>
            <div className="testimonials-container">
              {data.testimonials.map((testimonial, index) => (
                <div className="testimonial-card animate-on-scroll" data-delay={100 + index * 150} key={testimonial.id}>
                  <p className="testimonial-text">&quot;{testimonial.quote}&quot;</p>
                  <div className="testimonial-author">
                    <div className="author-initials">{testimonial.initials}</div>
                    <div>
                      <span className="author-name">{testimonial.authorName}</span>
                      <br />
                      <span className="author-title">{testimonial.authorTitle}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="Contact" className="full-page-section">
          <div className="content-panel">
            <h2 className="animate-on-scroll">Get In Touch</h2>
            <p className="animate-on-scroll" data-delay="150">
              {data.contact.availabilityText}
            </p>
            <div className="contact-details animate-on-scroll" data-delay="300">
              <div className="contact-item">
                <a href={`mailto:${data.contact.email}`} data-cursor-text="Mail">
                  {data.contact.email}
                </a>
              </div>
              {data.contact.phone ? (
                <div className="contact-item">
                  <a href={`tel:${data.contact.phone.replace(/\s/g, "")}`} data-cursor-text="Call">
                    {data.contact.phone}
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
