/* Pet Pals — shared interactions (vanilla JS, no dependencies).
   Each block is a no-op on pages that do not contain its markup. */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------------------------------------------------------------------
     1. Mobile navigation drawer
     --------------------------------------------------------------------- */
  (function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var drawer = document.getElementById("nav-drawer");
    var scrim = document.querySelector(".nav-scrim");
    if (!toggle || !drawer) return;

    var desktop = window.matchMedia("(min-width: 768px)");

    function setOpen(open) {
      root.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      if (open) {
        var first = drawer.querySelector("a");
        if (first) first.focus({ preventScroll: true });
      }
    }

    function isOpen() {
      return root.classList.contains("nav-open");
    }

    toggle.addEventListener("click", function () {
      setOpen(!isOpen());
    });

    if (scrim) {
      scrim.addEventListener("click", function () {
        setOpen(false);
      });
    }

    drawer.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (!isOpen()) return;
      if (event.key === "Escape") {
        setOpen(false);
        toggle.focus();
        return;
      }
      // Keep keyboard focus inside the open drawer (toggle + its links).
      if (event.key === "Tab") {
        var items = [toggle].concat(Array.prototype.slice.call(drawer.querySelectorAll("a")));
        var firstItem = items[0];
        var lastItem = items[items.length - 1];
        if (event.shiftKey && document.activeElement === firstItem) {
          event.preventDefault();
          lastItem.focus();
        } else if (!event.shiftKey && document.activeElement === lastItem) {
          event.preventDefault();
          firstItem.focus();
        }
      }
    });

    var onBreakpoint = function (event) {
      if (event.matches) setOpen(false);
    };
    if (desktop.addEventListener) desktop.addEventListener("change", onBreakpoint);
    else if (desktop.addListener) desktop.addListener(onBreakpoint);
  })();

  /* ---------------------------------------------------------------------
     1b. Image fallback — several photos are hotlinked from third-party
         sites; if one stops resolving, show a branded placeholder instead
         of the browser's broken-image icon.
     --------------------------------------------------------------------- */
  (function initImageFallback() {
    function replace(img) {
      if (!img || img.dataset.fallbackDone || !img.parentNode) return;
      img.dataset.fallbackDone = "true";
      var box = document.createElement("div");
      box.className = "media-fallback";
      box.setAttribute("role", "img");
      box.setAttribute("aria-label", img.alt || "Photo unavailable");
      var paw = document.createElement("span");
      paw.setAttribute("aria-hidden", "true");
      paw.textContent = "🐾";
      var note = document.createElement("small");
      note.textContent = "Photo coming soon";
      box.appendChild(paw);
      box.appendChild(note);
      img.parentNode.replaceChild(box, img);
    }

    document.addEventListener(
      "error",
      function (event) {
        var el = event.target;
        if (el && el.tagName === "IMG" && el.closest("main")) replace(el);
      },
      true
    );

    document.querySelectorAll("main img").forEach(function (img) {
      if (img.complete && img.naturalWidth === 0 && img.currentSrc) replace(img);
    });
  })();

  /* ---------------------------------------------------------------------
     2. Scroll reveal
     --------------------------------------------------------------------- */
  (function initReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    if (!("IntersectionObserver" in window) || reduceMotion.matches) {
      items.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    items.forEach(function (el) {
      observer.observe(el);
    });
  })();

  /* ---------------------------------------------------------------------
     3. Home hero — scroll-driven kinetic side words
     --------------------------------------------------------------------- */
  (function initHero() {
    var heroSection = document.querySelector(".hero");
    if (!heroSection) return;

    var leftWords = heroSection.querySelectorAll(".hero-words--left .hero-word");
    var rightWords = heroSection.querySelectorAll(".hero-words--right .hero-word");
    if (!leftWords.length && !rightWords.length) return;

    var ticking = false;
    var lastProgress = -1;
    var lastScale = -1;

    function getScaleFactor() {
      var w = window.innerWidth;
      if (w < 768) return 0.5;
      if (w < 1024) return 0.75;
      return 1.0;
    }

    function render() {
      ticking = false;
      if (reduceMotion.matches) return;

      var heroRect = heroSection.getBoundingClientRect();
      var maxScroll = heroSection.offsetHeight - window.innerHeight;
      var progress = maxScroll > 0 ? Math.min(Math.max(-heroRect.top / maxScroll, 0), 1) : 1;
      var scaleFactor = getScaleFactor();

      if (progress === lastProgress && scaleFactor === lastScale) return;
      lastProgress = progress;
      lastScale = scaleFactor;

      var opacity = 0.35 + progress * 0.65;
      var i;

      for (i = 0; i < leftWords.length; i++) {
        var leftOffset = -(60 + i * 40) * scaleFactor * (1 - progress);
        leftWords[i].style.transform = "translate3d(" + leftOffset.toFixed(2) + "px,0,0)";
        leftWords[i].style.opacity = opacity.toFixed(3);
      }
      for (i = 0; i < rightWords.length; i++) {
        var rightOffset = +(60 + i * 40) * scaleFactor * (1 - progress);
        rightWords[i].style.transform = "translate3d(" + rightOffset.toFixed(2) + "px,0,0)";
        rightWords[i].style.opacity = opacity.toFixed(3);
      }
    }

    function requestRender() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(render);
    }

    window.addEventListener("scroll", requestRender, { passive: true });
    window.addEventListener("resize", requestRender, { passive: true });
    render();
  })();

  /* ---------------------------------------------------------------------
     4. Pets catalog — category filter, live search & sorting
     --------------------------------------------------------------------- */
  (function initFilter() {
    var pills = document.querySelectorAll(".filter-pill[data-filter]");
    var groups = document.querySelectorAll(".pets-category[data-category]");
    if (!pills.length || !groups.length) return;

    var searchInput = document.getElementById("pet-search");
    var sortSelect = document.getElementById("pet-sort");
    var noPetsBox = document.getElementById("no-pets-found");
    var resetBtn = document.getElementById("reset-filters-btn");
    var status = document.getElementById("filter-status");

    var currentFilter = "all";
    var currentQuery = "";
    var currentSort = "featured";

    var valid = Array.prototype.map.call(pills, function (pill) {
      return pill.dataset.filter;
    });

    // Store original card order for 'featured' reset
    var originalOrder = [];
    groups.forEach(function (group) {
      var grid = group.querySelector(".pets-grid");
      if (grid) {
        var cards = Array.prototype.slice.call(grid.querySelectorAll(".pet-card"));
        originalOrder.push({ group: group, cards: cards });
      }
    });

    function getOriginalCards(group) {
      for (var i = 0; i < originalOrder.length; i++) {
        if (originalOrder[i].group === group) return originalOrder[i].cards;
      }
      return [];
    }

    function apply() {
      var totalShown = 0;
      var q = currentQuery.trim().toLowerCase();

      pills.forEach(function (pill) {
        pill.setAttribute("aria-pressed", String(pill.dataset.filter === currentFilter));
      });

      groups.forEach(function (group) {
        var catMatch = currentFilter === "all" || group.dataset.category === currentFilter;
        var grid = group.querySelector(".pets-grid");
        var cards = grid ? Array.prototype.slice.call(grid.querySelectorAll(".pet-card")) : [];
        var groupShown = 0;

        cards.forEach(function (card) {
          var name = (card.dataset.name || (card.querySelector("h3") ? card.querySelector("h3").textContent : "")).toLowerCase();
          var desc = (card.querySelector(".pet-desc") ? card.querySelector(".pet-desc").textContent : "").toLowerCase();
          var textMatch = !q || name.indexOf(q) !== -1 || desc.indexOf(q) !== -1;

          var showCard = catMatch && textMatch;
          card.hidden = !showCard;
          if (showCard) {
            groupShown++;
            totalShown++;
            card.classList.add("is-visible");
          }
        });

        // Hide entire group if no cards match inside it
        group.hidden = groupShown === 0;
        if (!group.hidden) {
          group.classList.add("is-visible");
        }

        // Sort visible cards if grid exists
        if (grid && groupShown > 0) {
          var sorted = Array.prototype.slice.call(cards);
          if (currentSort === "price-asc") {
            sorted.sort(function (a, b) {
              return (parseInt(a.dataset.price, 10) || 0) - (parseInt(b.dataset.price, 10) || 0);
            });
          } else if (currentSort === "price-desc") {
            sorted.sort(function (a, b) {
              return (parseInt(b.dataset.price, 10) || 0) - (parseInt(a.dataset.price, 10) || 0);
            });
          } else if (currentSort === "name-asc") {
            sorted.sort(function (a, b) {
              return (a.dataset.name || "").localeCompare(b.dataset.name || "");
            });
          } else {
            // Restore featured original order
            var orig = getOriginalCards(group);
            if (orig.length) sorted = orig;
          }

          sorted.forEach(function (card) {
            grid.appendChild(card);
          });
        }
      });

      // Show/hide empty state
      if (noPetsBox) {
        noPetsBox.hidden = totalShown > 0;
      }

      // Accessibility status announcement
      if (status) {
        var active = document.querySelector('.filter-pill[aria-pressed="true"]');
        var label = active ? active.dataset.label || active.textContent.trim() : "Pets";
        var queryMsg = q ? ' matching "' + q + '"' : "";
        status.textContent = "Showing " + totalShown + " " + label.toLowerCase() + queryMsg;
      }
    }

    pills.forEach(function (pill) {
      pill.addEventListener("click", function () {
        currentFilter = pill.dataset.filter;
        apply();
        if (window.history && window.history.replaceState) {
          var hash = currentFilter === "all" ? window.location.pathname + window.location.search : "#" + currentFilter;
          window.history.replaceState(null, "", hash);
        }
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        currentQuery = searchInput.value;
        apply();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", function () {
        currentSort = sortSelect.value;
        apply();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        currentFilter = "all";
        currentQuery = "";
        currentSort = "featured";
        if (searchInput) searchInput.value = "";
        if (sortSelect) sortSelect.value = "featured";
        apply();
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, "", window.location.pathname);
        }
      });
    }

    // Deep links such as pets.html#cats
    function applyFromHash() {
      var wanted = window.location.hash.replace("#", "");
      if (valid.indexOf(wanted) !== -1) {
        currentFilter = wanted;
        apply();
      }
    }

    applyFromHash();
    window.addEventListener("hashchange", applyFromHash);
  })();

  /* ---------------------------------------------------------------------
     5. Contact form — validate, then hand off to the visitor's mail app.
        There is no backend, so nothing is claimed as "sent" here.
     --------------------------------------------------------------------- */
  (function initContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;

    var status = document.getElementById("form-status");
    var recipient = form.getAttribute("data-recipient") || "";

    function fieldGroup(field) {
      return field.closest(".form-group");
    }

    function setError(field, message) {
      var group = fieldGroup(field);
      if (!group) return;
      var slot = group.querySelector(".field-error");
      group.classList.toggle("has-error", Boolean(message));
      field.setAttribute("aria-invalid", message ? "true" : "false");
      if (slot) slot.textContent = message || "";
    }

    function validate(field) {
      if (field.type === "submit") return true;
      var message = "";
      if (field.validity.valueMissing) message = "This field is required.";
      else if (field.validity.typeMismatch && field.type === "email") message = "Enter a valid email address.";
      setError(field, message);
      return !message;
    }

    form.addEventListener(
      "blur",
      function (event) {
        if (event.target.matches("input, select, textarea")) validate(event.target);
      },
      true
    );

    form.addEventListener("input", function (event) {
      var group = fieldGroup(event.target);
      if (group && group.classList.contains("has-error")) validate(event.target);
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var fields = form.querySelectorAll("input:not([type=submit]), select, textarea");
      var firstInvalid = null;
      fields.forEach(function (field) {
        if (!validate(field) && !firstInvalid) firstInvalid = field;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        if (status) {
          status.hidden = false;
          status.textContent = "Please fix the highlighted fields and try again.";
        }
        return;
      }

      var data = new FormData(form);
      var inquiry = form.elements["inquiry-type"];
      var inquiryLabel = inquiry && inquiry.selectedIndex > -1 ? inquiry.options[inquiry.selectedIndex].text : "";
      var body = [
        "Name: " + (data.get("name") || ""),
        "Email: " + (data.get("email") || ""),
        "Phone: " + (data.get("phone") || "-"),
        "Pet type: " + (data.get("pet-type") || "-"),
        "Inquiry type: " + inquiryLabel,
        "",
        String(data.get("message") || "")
      ].join("\n");

      var href =
        "mailto:" +
        recipient +
        "?subject=" +
        encodeURIComponent("Pet Pals enquiry: " + inquiryLabel) +
        "&body=" +
        encodeURIComponent(body);

      if (status) {
        status.hidden = false;
        status.textContent =
          "Opening your email app with this message ready to send. If nothing opens, email us at " + recipient + ".";
      }
      window.location.href = href;
    });
  })();

  /* ---------------------------------------------------------------------
     6. Contact form URL pre-fill — pre-select inquiry type and pet
     --------------------------------------------------------------------- */
  (function initContactPreFill() {
    var form = document.getElementById("contact-form");
    if (!form || !window.location.search) return;

    var params = new URLSearchParams(window.location.search);
    var service = params.get("service") || params.get("inquiry");
    var pet = params.get("pet");

    if (service && form.elements["inquiry-type"]) {
      var select = form.elements["inquiry-type"];
      var serviceMap = {
        grooming: "grooming",
        vet: "vet",
        veterinary: "vet",
        training: "training",
        adoption: "adoption",
        adopt: "adoption",
        general: "general"
      };
      var targetValue = serviceMap[service.toLowerCase()] || service.toLowerCase();
      for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].value.toLowerCase() === targetValue) {
          select.selectedIndex = i;
          break;
        }
      }
    }

    if (pet && form.elements["pet-type"]) {
      form.elements["pet-type"].value = pet;
    }

    if (pet && form.elements["message"] && !form.elements["message"].value) {
      form.elements["message"].value = "Hello! I am interested in adopting / inquiring about the " + pet + ". Please let me know current availability and next steps.";
    }

    // Smoothly focus/scroll into form card if redirected from a specific CTA
    if (service || pet) {
      var formCard = form.closest(".form-card") || form;
      setTimeout(function () {
        formCard.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 250);
    }
  })();
})();
