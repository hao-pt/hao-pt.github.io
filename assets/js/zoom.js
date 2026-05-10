// Initialize medium zoom.
$(document).ready(function () {
  medium_zoom = mediumZoom("[data-zoomable]", {
    background: getComputedStyle(document.documentElement).getPropertyValue("--global-bg-color") + "ee", // + 'ee' for trasparency.
  });
});

// Video zoom — custom lightbox for [data-video-zoomable] elements.
$(document).ready(function () {
  var bgColor = function () {
    return getComputedStyle(document.documentElement).getPropertyValue("--global-bg-color").trim() + "ee";
  };

  var $overlay = $(
    '<div id="video-zoom-overlay" style="' +
      "display:none;position:fixed;top:0;left:0;width:100%;height:100%;" +
      "z-index:9999;cursor:zoom-out;align-items:center;justify-content:center;" +
      '">' +
      "</div>"
  );
  var $zoomVideo = $('<video controls autoplay loop muted playsinline style="max-width:90%;max-height:90vh;border-radius:8px;"></video>');
  $overlay.append($zoomVideo);
  $("body").append($overlay);

  $(document).on("click", "[data-video-zoomable]", function () {
    var $src = $(this).find("source");
    var src = $src.length ? $src.attr("src") : $(this).attr("src");
    var type = $src.length ? $src.attr("type") : "video/mp4";

    $zoomVideo.empty().append($("<source>").attr("src", src).attr("type", type));
    $overlay.css({ display: "flex", background: bgColor() });
    $zoomVideo[0].load();
  });

  var closeOverlay = function () {
    $overlay.hide();
    $zoomVideo[0].pause();
    // Restart any preview videos that got paused while the lightbox was open.
    document.querySelectorAll("video.preview").forEach(function (v) {
      if (v.paused) v.play().catch(function () {});
    });
  };

  $overlay.on("click", closeOverlay);
  $(document).on("keydown", function (e) {
    if (e.key === "Escape" && $overlay.is(":visible")) closeOverlay();
  });
});

// PDF zoom — lightbox for [data-pdf-zoomable] elements.
$(document).ready(function () {
  var bgColor = function () {
    return getComputedStyle(document.documentElement).getPropertyValue("--global-bg-color").trim() + "ee";
  };

  var $pdfOverlay = $(
    '<div id="pdf-zoom-overlay" style="' +
      "display:none;position:fixed;top:0;left:0;width:100%;height:100%;" +
      "z-index:9999;cursor:zoom-out;align-items:center;justify-content:center;" +
      '"></div>'
  );
  var $pdfFrame = $('<iframe style="width:90%;height:90vh;border:none;border-radius:8px;background:#fff;"></iframe>');
  $pdfOverlay.append($pdfFrame);
  $("body").append($pdfOverlay);

  $(document).on("click", "[data-pdf-zoomable]", function () {
    var src = $(this).data("pdf-zoomable");
    $pdfFrame.attr("src", src);
    $pdfOverlay.css({ display: "flex", background: bgColor() });
  });

  var closePdfOverlay = function () {
    $pdfOverlay.hide();
    $pdfFrame.attr("src", "");
  };

  $pdfOverlay.on("click", closePdfOverlay);
  $(document).on("keydown", function (e) {
    if (e.key === "Escape" && $pdfOverlay.is(":visible")) closePdfOverlay();
  });
});

// Keep preview videos playing via IntersectionObserver.
document.addEventListener("DOMContentLoaded", function () {
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        var video = entry.target;
        if (entry.isIntersecting) {
          video.play().catch(function () {});
        } else {
          video.pause();
        }
      });
    },
    { threshold: 0 }
  );

  // Observe existing previews and any added later (e.g. after tab switch renders).
  function observePreviews() {
    document.querySelectorAll("video.preview").forEach(function (v) {
      observer.observe(v);
    });
  }

  observePreviews();

  // On tab switch: immediately play videos in the newly visible pane,
  // and pause videos in the pane that just got hidden — don't wait for
  // the IntersectionObserver to notice the display:none change.
  $(document).on("shown.bs.tab", function (e) {
    var paneSelector = $(e.target).attr("href");
    if (paneSelector) {
      $(paneSelector).find("video.preview").each(function () {
        this.play().catch(function () {});
      });
      // Register any newly rendered videos with the observer.
      observePreviews();
    }
  });

  $(document).on("hidden.bs.tab", function (e) {
    var paneSelector = $(e.target).attr("href");
    if (paneSelector) {
      $(paneSelector).find("video.preview").each(function () {
        this.pause();
      });
    }
  });
});
