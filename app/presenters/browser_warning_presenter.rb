class BrowserWarningPresenter
  include ActionView::Helpers::OutputSafetyHelper
  include ActionView::Helpers::TagHelper
  include ActionView::Helpers::UrlHelper
  include ActionView::Context

  attr_reader :browser

  def initialize(user_agent)
    @browser = Browser.new(user_agent)
  end

  def supported?
    return true if browser.bot?
    return true if browser.ua.match?(%r{\AIntercodeSSR/(\d+)\.(\d+)\z})

    # cutoff is native URLSearchParams support + async functions + css grid + esmodules
    browser.platform.ios?(">= 12") || browser.chrome?(">= 63") || browser.firefox?(">= 60") ||
      browser.safari?(">= 12") || browser.opera?(">= 50") || browser.edge?(">= 18")
  end

  def render
    tag.div(class: "container", style: "margin-top: 100px;") do
      tag.div(class: "alert alert-warning") do
        tag.h2("Unsupported web browser", class: "mb-4")

        tag.div(class: "d-flex align-items-start") do
          tag.h1(class: "m-0 me-4") { tag.i(class: "bi-exclamation-triangle-fill") }

          tag.div(class: "flex-grow-1") do
            safe_join(
              [
                tag.p(
                  safe_join(
                    ["You’re viewing this web site with ", tag.strong(browser_description), ". ", warning_message]
                  )
                ),
                tag.div(class: "text-end mt-4") do
                  safe_join(
                    [
                      recommendation_html,
                      tag.button(
                        "Don’t show this warning again on this browser",
                        class: "btn btn-secondary",
                        type: "button",
                        onClick: "document.cookie = 'suppressBrowserWarning=true'; window.location.reload();",
                        style: "white-space: normal;"
                      )
                    ]
                  )
                end
              ]
            )
          end
        end
      end
    end
  end

  def browser_description
    return "an unknown web browser" if browser.unknown?

    "#{browser.name} #{browser.version}"
  end

  def warning_message
    if browser.platform.ios? || browser.chrome? || browser.firefox? || browser.safari? || browser.opera? ||
         browser.edge?
      "This version is out of date and might not work correctly with this site."
    else
      "This browser is unsupported on this site."
    end
  end

  def ios_recommendation_html
    # Special case for iOS, since all browser-like things in iOS are actually just WebKit wrappers
    return left_paragraph("To get the latest Safari, update to the latest version of iOS.") if browser.safari?

    left_paragraph <<~WARNING
      #{browser.name} uses the Safari engine, which ships with iOS itself.  To update it, update your device to
      the latest version of iOS.
    WARNING
  end

  def recommendation_html
    return ios_recommendation_html if browser.platform.ios?

    return link_button("https://www.google.com/chrome/", "Download the latest Chrome") if browser.chrome?
    return link_button("https://www.firefox.com/", "Download the latest Firefox") if browser.firefox?

    if browser.safari?
      return(
        left_paragraph(
          safe_join(
            [
              "To get the latest Safari, update to the latest version of macOS.  Or, you can use this site with ",
              "an up-to-date version of ",
              link_to("Google Chrome", "https://www.google.com/chrome/"),
              " or ",
              link_to("Mozilla Firefox", "https://www.firefox.com/"),
              "."
            ]
          )
        )
      )
    end

    return left_paragraph("To get the latest Edge, run Windows Update.") if browser.edge?
    return link_button("https://www.opera.com/", "Download the latest Opera") if browser.opera?

    left_paragraph(
      safe_join(
        [
          "To use this site, we recommend an up-to-date version of ",
          link_to("Google Chrome", "https://www.google.com/chrome/"),
          " or ",
          link_to("Mozilla Firefox", "https://www.firefox.com/"),
          "."
        ]
      )
    )
  end

  private

  def left_paragraph(text)
    tag.p(text, class: "text-start")
  end

  def link_button(url, text)
    link_to(text, url, class: "btn btn-primary me-2")
  end
end
