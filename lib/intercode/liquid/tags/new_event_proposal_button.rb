module Intercode
  module Liquid
    module Tags
      # Renders a "Propose an event" button.  This will automatically render as a
      # "Log in to propose" button if the user is not logged in.  The button text and the button
      # CSS classes can be customized.
      #
      # @liquid_tag_name new_event_proposal_button
      # @example Customizing the button text
      #   {% new_event_proposal_button "Propose, right now!" %}
      # @example Customizing the button text and the CSS class
      #   {% new_event_proposal_button "Propose, or don't" btn-warning %}
      class NewEventProposalButton < RailsPartialRenderer
        attr_reader :button_text, :button_class

        def initialize(tag_name, args, _options)
          super
          return unless args && args =~ /\"([^\"]+)\"(\s+(\w.*))?/

          @button_text = Regexp.last_match(1)
          @button_class = Regexp.last_match(3)
        end

        def partial(_context)
          'event_proposals/new_event_proposal_button'
        end

        def locals(_context)
          {
            button_text: button_text,
            button_class: button_class
          }
        end
      end
    end
  end
end

Liquid::Template.register_tag(
  'new_event_proposal_button',
  Intercode::Liquid::Tags::NewEventProposalButton
)
