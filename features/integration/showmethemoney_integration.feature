Feature: ShowMeTheMoney Integration
  As a user viewing the ShowMeTheMoney page
  I want all components to work together seamlessly
  So that I have a cohesive and professional experience

  Background:
    Given the ShowMeTheMoney page is loaded
    And all components are initialized

  @smoke @critical @integration
  Scenario: Complete page loads successfully
    Given I navigate to "/showmethemoney"
    Then the page should load within 3 seconds
    And all 10 tabs should be visible
    And the Executive section should be displayed by default
    And no console errors should be present
    And all financial numbers should be accurate

  @smoke @critical @integration
  Scenario: Team tab integration with JARVIS
    Given I am on the Team section
    When I click on an agent card
    Then the agent detail panel should open
    And JARVIS should be accessible via floating button
    When I ask JARVIS about the selected agent
    Then JARVIS should provide relevant information

  @positive @integration @content
  Scenario: Content enhancements are displayed
    Given I am on the Executive section
    Then I should see the investor narrative
    And I should see the TAM/SAM/SOM visualization
    And I should see the competitor comparison matrix
    And all content should match the specification

  @positive @integration @financials
  Scenario: Financial data accuracy across sections
    Given the financial projections show $847K MRR in Month 6
    When I navigate to the Executive section
    Then the same $847K figure should be referenced
    When I ask JARVIS "What's MRR in Month 6?"
    Then JARVIS should respond with $847,000
    And all instances should be consistent

  @positive @integration @navigation
  Scenario: Deep linking works with all sections
    Given I navigate to each section via URL hash
    Then each section should display correctly:
      | Section | URL Hash |
      | Executive | #executive |
      | Team | #team |
      | Pricing | #pricing |
      | Financials | #financials |
      | GTM | #gtm |
      | Expansion | #expansion |
      | Accelerator | #accelerator |
      | Fundraising | #fundraising |
      | Wireframes | #wireframes |
      | Risks | #risks |

  @positive @integration @responsive
  Scenario: Responsive design across breakpoints
    Given I test at different viewport sizes:
      | Width | Height | Device Type |
      | 1920 | 1080 | Desktop |
      | 1366 | 768 | Laptop |
      | 768 | 1024 | Tablet |
      | 375 | 667 | Mobile |
    Then all sections should be usable
    And no content should be cut off
    And navigation should adapt appropriately

  @positive @integration @performance
  Scenario: Page performance metrics
    Given I run a performance audit
    Then the following metrics should meet targets:
      | Metric | Target |
      | First Contentful Paint | < 1.5s |
      | Largest Contentful Paint | < 2.5s |
      | Time to Interactive | < 3.5s |
      | Cumulative Layout Shift | < 0.1 |
      | Total Blocking Time | < 200ms |

  @positive @integration @accessibility
  Scenario: Accessibility compliance
    Given I run an accessibility audit
    Then the page should meet WCAG 2.1 AA standards
    And all images should have alt text
    And all interactive elements should be keyboard accessible
    And color contrast should meet standards
    And screen reader should navigate properly

  @positive @integration @seo
  Scenario: SEO requirements
    Given the page is loaded
    Then the page should have:
      | Element | Requirement |
      | Title | "APEX OS - Financial Projections & Strategy" |
      | Meta Description | Present and under 160 chars |
      | Canonical URL | Present |
      | Open Graph Tags | Present |
      | Structured Data | Present |

  @positive @integration @analytics
  Scenario: Analytics tracking
    Given I interact with the page
    Then the following events should be tracked:
      | Event | Trigger |
      | page_view | Page load |
      | tab_switch | Tab click |
      | jarvis_open | JARVIS button click |
      | jarvis_query | Voice/text query |
      | agent_click | Agent card click |
      | section_scroll | Scroll to section |

  @negative @integration @error-handling
  Scenario: Graceful error handling
    Given a component fails to load
    Then an error boundary should catch it
    And the rest of the page should continue working
    And a user-friendly error message should show
    And the error should be logged

  @negative @integration @network
  Scenario: Network failure handling
    Given the network connection is lost
    When I try to use JARVIS
    Then JARVIS should show offline state
    And previously loaded content should remain visible
    And a retry button should be available

  @security @integration
  Scenario: Security requirements
    Given I inspect the page
    Then there should be no exposed API keys
    And no sensitive data in client-side code
    And all external resources should use HTTPS
    And CSP headers should be present

  @load-testing @integration
  Scenario: Load testing
    Given 100 concurrent users access the page
    Then response time should remain under 2 seconds
    And error rate should be under 1%
    And server CPU should remain under 70%
    And memory usage should be stable

  @cross-browser @integration
  Scenario: Cross-browser compatibility
    Given I test on different browsers:
      | Browser | Version |
      | Chrome | Latest |
      | Firefox | Latest |
      | Safari | Latest |
      | Edge | Latest |
    Then all features should work consistently
    And styling should be consistent
    And performance should be similar

  @integration @data-consistency
  Scenario: Data consistency across components
    Given financial data is displayed in multiple places
    Then all instances should match:
      | Data Point | Value |
      | Year 1 Revenue | $501,000 |
      | Month 12 MRR | $1,420,000 |
      | CAC | $150 |
      | LTV | $1,466 |
      | LTV:CAC Ratio | 9.8:1 |
      | Blended ARPU | $165 |

  @integration @state-management
  Scenario: State management across tabs
    Given I am on the Team section
    And I have an agent detail panel open
    When I switch to Pricing section
    And then back to Team section
    Then the agent detail panel should remember its state
    Or reset gracefully to default view

  @integration @mobile-specific
  Scenario: Mobile-specific features
    Given I am on a mobile device
    Then I should see mobile-optimized navigation
    And touch targets should be at least 44px
    And swipe gestures should work
    And the JARVIS button should not obstruct content
    And agent cards should stack vertically

  @integration @print
  Scenario: Print stylesheet
    Given I try to print the page
    Then a print-optimized version should be available
    And background colors should be removed
    And navigation should be hidden
    And content should reflow for paper
