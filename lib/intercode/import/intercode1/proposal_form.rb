class Intercode::Import::Intercode1::ProposalForm
  attr_reader :convention

  def initialize(convention)
    @convention = convention
  end

  def import!
    logger.info "Importing proposal form"

    form = convention.create_event_proposal_form!(title: "Proposal form", convention: convention)
    convention.save!

    proposal_form_sections.each do |section_attributes|
      logger.info "Importing section #{section_attributes[:title]}"
      section = form.form_sections.create!(section_attributes.slice(:title))
      (section_attributes[:section_items] || []).each do |item_attributes|
        logger.info "Importing #{item_attributes[:item_type]} item #{item_attributes[:identifier]}"
        direct_properties = item_attributes.slice(:item_type, :identifier, :admin_description)
        other_properties = item_attributes.except(:item_type, :identifier, :admin_description)
        section.form_items.create!(direct_properties.merge(properties: other_properties))
      end
    end
  end

  private

  def logger
    Intercode::Import::Intercode1.logger
  end

  def friday_date
    starts_at = @convention.starts_at.in_time_zone(@convention.timezone)

    if starts_at.friday?
      starts_at.beginning_of_day.to_date
    elsif starts_at.thursday?
      (starts_at.beginning_of_day + 1.day).to_date
    end
  end

  def proposal_form_sections
    [
      {
        title: 'Game Information',
        section_items: [
          {
            item_type: 'static_text',
            style: 'subhead',
            content: 'This will be shown on the Public description of the game.'
          },
          {
            item_type: 'free_text',
            identifier: 'title',
            caption: 'Event Title',
            lines: 1,
            required: true
          },
          {
            item_type: 'free_text',
            identifier: 'authors',
            caption: 'Author(s)',
            lines: 1,
            required: true
          },
          {
            item_type: 'free_text',
            identifier: 'organization',
            caption: 'Organization',
            lines: 1
          },
          {
            item_type: 'free_text',
            identifier: 'url',
            caption: 'Event or Organization Homepage URL',
            lines: 1
          },
          {
            item_type: 'free_text',
            identifier: 'email',
            caption: 'Email for Event Inquiries',
            lines: 1,
            free_text_type: 'email',
            required: true
          },
          {
            item_type: 'timespan',
            identifier: 'length_seconds',
            caption: 'Event Length',
            required: true
          },
          {
            item_type: 'free_text',
            identifier: 'description',
            admin_description: 'Description',
            lines: 15,
            required: true,
            format: 'markdown',
            caption: <<-MARKDOWN
  **Description** for use on the {{ convention.name }} website. This information will displayed on
  the page users see for the game. The description should be at least a couple of paragraphs, but can
  be as long as you like.

  The game description is used to promote your game and attract players who will enjoy it. Be
  reasonably clear on where and when the game is set, and what the game is about. Let your players
  know what can they expect to be doing during the LARP, and make them excited to play your game!
  (We can offer suggestions if you would like advice on this.)

  **Per NEIL policy, game descriptions must include either a content warning or an explicit statement
  that no content warnings are applicable.** For more information,
  [see the NEIL policies page](http://interactiveliterature.org/NEIL/communityPolicies.html#contentWarningsPolicy).

  Please also include the preferred ages of players for your larp. Examples are "Players must be 18 or
  older", or "players under 16 must check with the GMs before playing", to "children at least [age]
  years old are welcome in this game".

  The description will be displayed in the user's browser. You must use Markdown for formatting.
  [A quick primer on Markdown syntax is available here.](https://en.support.wordpress.com/markdown-quick-reference/)
  MARKDOWN
          },
          {
            item_type: 'free_text',
            identifier: 'short_blurb',
            admin_description: 'Short Blurb',
            lines: 4,
            required: true,
            format: 'markdown',
            caption: <<-MARKDOWN
  A **Short Blurb** (50 words or less) for the game to be used for the List of Events page and the
  convention program. Information in the Short Blurb must also be present in the (full) description!

  The short blurb will be displayed in the user's browser. You must use Markdown for formatting.
  [A quick primer on Markdown syntax is available here.](https://en.support.wordpress.com/markdown-quick-reference/)
  MARKDOWN
          },
          {
            item_type: 'free_text',
            identifier: 'player_communications',
            admin_description: 'Player Communications',
            lines: 4,
            required: true,
            caption: <<-MARKDOWN
  **Player Communications**

  How will you distribute game information to your players? Will you be using a casting form? Will
  character roles be cast and distributed before the convention or on site, or will characters be
  developed as part of the game?
  MARKDOWN
          }
        ]
      },
      {
        title: 'Character Counts',
        section_items: [
          {
            item_type: 'static_text',
            style: 'subhead',
            content: 'This will be shown on the Public description of the game.'
          },
          {
            item_type: 'static_text',
            style: 'normal',
            content: <<-MARKDOWN
  Enter the minimum, preferred and maximum number of characters for your LARP. The character counts
  will be visible to users signing up to your LARP.

  * Minimum -	The minimum number of characters required for your LARP. If there are fewer than the
    minimum number of characters signed up, you should talk with the GM Liaison about lowering the
    minimum number of players or cancelling the LARP.
  * Preferred -	The number of characters that you'd prefer to have in your LARP. If you're not sure,
    make this the same number as the Maximum.
  * Maximum -	The maximum number of players that your LARP can accomodate.

  Each of your characters can be male, female or neutral. A male or female character is one which must
  be a specific gender. A neutral character is one which can be cast as either male or female,
  depending on who signs up for the game. The website will enforce your gender limits, so if only
  female roles are available, any players that signup who have specified that they prefer to play male
  characters will be put on the waitlist. Once you've cast the game, you'll be able to "freeze" the
  gender balance of the game; essentially converting all of your neutral characters to male or female
  to match the preferred character gender of the players who are signed up. This way, if a player
  drops out, the website will pick the first player on the waitlist with a matching preferred
  character gender so you don't have to frantically rewrite the character sheet to match the preferred
  character gender of the new player.
  MARKDOWN
          },
          {
            item_type: 'registration_policy',
            identifier: 'registration_policy',
            admin_description: 'Registration Policy',
            required: true,
          }
        ]
      },
      {
        title: 'Other Game Information',
        section_items: [
          {
            item_type: 'static_text',
            style: 'subhead',
            content: 'This information will only be used by the Proposals Committee.'
          },
          {
            item_type: 'free_text',
            identifier: 'genre',
            admin_description: 'Genre',
            lines: 1,
            caption: 'Genre:',
            required: true,
          },
          {
            item_type: 'multiple_choice',
            identifier: 'ongoing_campaign',
            admin_description: 'Ongoing Campaign',
            style: 'radio_horizontal',
            caption: 'Is this game part of an ongoing campaign?',
            choices: [
              { caption: 'Yes', value: true },
              { caption: 'No', value: false }
            ]
          },
          {
            item_type: 'free_text',
            identifier: 'run_before',
            admin_description: 'Run Before?',
            lines: 1,
            caption: <<-MARKDOWN
  {{ convention.name }} is looking for games that are new and games that have run before, either at a
  convention, or elsewhere. If this game has run before, where was that?
  MARKDOWN
          },
          {
            item_type: 'free_text',
            identifier: 'game_system',
            admin_description: 'Game System',
            lines: 1,
            caption: 'Game System:'
          },
          {
            item_type: 'multiple_choice',
            identifier: 'combat_resolution',
            admin_description: 'Combat Resolution',
            style: 'radio_vertical',
            caption: 'How combat will be resolved:',
            choices: [
              { caption: 'Physical Methods (such as boffer weapons)', value: 'Physical' },
              { caption: 'Non-Physical Methods (cards, dice, etc.)', value: 'NonPhysical' },
              { caption: 'There will be no combat', value: 'NoCombat' },
              { caption: 'Other (describe in Other Details)', value: 'Other' }
            ]
          },
          {
            item_type: 'free_text',
            identifier: 'other_committee_info',
            admin_description: 'Other Info for the Committee',
            lines: 4,
            caption: <<-MARKDOWN
  Please enter any additional background information here, or any other information you wish to tell
  the Proposals Committee. This information will be shown only to the Proposals Committee.
  MARKDOWN
          },
          {
            item_type: 'free_text',
            identifier: 'setup_teardown',
            admin_description: 'Setup/Teardown',
            lines: 4,
            caption: <<-MARKDOWN
  Are there any special setup or teardown requirements for this LARP? For example, do you need extra
  time to set up or tear down a complex set? (Requests for standard furniture will be handled
  separately closer to the convention. Intercon can not provide unusual setup materials for your
  game.)
  MARKDOWN
          }
        ]
      },
      {
        title: 'GM/Author Information',
        section_items: [
          {
            item_type: 'static_text',
            style: 'subhead',
            content: 'This information will only be used by the Proposals Committee.'
          },
          {
            item_type: 'free_text',
            identifier: 'gms',
            admin_description: 'GMs',
            lines: 2,
            caption: <<-MARKDOWN
  **GMs for your game.** Note that the GMs listed here are only for the purpose of evaluating your
  proposal. If your proposal is accepted, you'll be able to select GMs from the users registered for
  {{ convention.name }}.
  MARKDOWN
          },
          {
            item_type: 'free_text',
            identifier: 'other_games',
            admin_description: 'Other LARPs from Team',
            lines: 4,
            caption: 'What other LARPs have you written or run? Where and when were they run?'
          }
        ]
      },
      {
        title: 'Restrictions',
        section_items: [
          {
            item_type: 'static_text',
            style: 'subhead',
            content: 'This information will only be used by the Proposals Committee.'
          },
          {
            item_type: 'static_text',
            style: 'normal',
            content: <<-MARKDOWN
  Intercon R appeals to a diverse group of players of all ages, ethnicities, belief systems, sexual
  orientations, physical capabilities, experience, etc. Authors can write interesting games that might
  not be suitable for all audiences. In order for the con staff to balance these potentially opposing
  requirements, please answer the following questions.

  Note that answering yes to any or all of these questions does not disqualify your proposal.
  MARKDOWN
          },
          {
            item_type: 'free_text',
            identifier: 'offensive',
            admin_description: 'Offensive Elements',
            lines: 4,
            caption: <<-MARKDOWN
  Are there any components of your LARP that might offend or upset some group of attendees? For
  example, adult themes, potentially offensive story arcs, etc. If so, please explain and consider if
  this needs to be mentioned in the game descriptions.
  MARKDOWN
          },
          {
            item_type: 'free_text',
            identifier: 'physical_restrictions',
            admin_description: 'Physical Restrictions',
            lines: 4,
            caption: <<-MARKDOWN
  Are there any physical restrictions imposed by your LARP? For example, live boffer combat, confined
  sets, etc. If so, please explain and consider if this needs to be mentioned in the game
  descriptions.
  MARKDOWN
          },
          {
            item_type: 'free_text',
            identifier: 'age_appropriate',
            admin_description: 'Appropriate for Under 18?',
            lines: 4,
            caption: <<-MARKDOWN
  Is your game appropriate for players under the age of 18? Please discuss any age restrictions here.
  If there are any components of your LARP that might be illegal for attendees under the age of 18
  (props or items that are illegal for a minor to possess, alcohol, etc.) please explain. If your
  game has age restrictions, please be sure to mention this in the game descriptions.
  MARKDOWN
          },
        ]
      },
      {
        title: 'Scheduling Information',
        section_items: [
          {
            item_type: 'static_text',
            style: 'subhead',
            content: 'This information will only be used by the Proposals Committee.'
          },
          {
            item_type: 'static_text',
            style: 'normal',
            content: <<-MARKDOWN
  The con can schedule your game into one (or more) of the time slots available over the weekend. The
  con has to put together a balanced schedule so we can satisfy the most players in the most time
  slots. Your flexibility in scheduling your game is vital.
  MARKDOWN
          },
          {
            item_type: 'timeblock_preference',
            identifier: 'timeblock_preferences',
            admin_description: 'Timeblock Preferences',
            caption: "Please pick your top three preferences for when you'd like to run your game.",
            timeblocks: [
              { label: 'Morning', start: { hour: 9 }, finish: { hour: 13 } },
              { label: 'Afternoon', start: { hour: 14 }, finish: { hour: 18 } },
              { label: 'Evening', start: { hour: 20 }, finish: { hour: 24 } },
              { label: 'After Midnight', start: { hour: 24 }, finish: { hour: 28 } }
            ],
            omit_timeblocks: (
              friday_date ? [{ label: 'Morning', date: friday_date }] : []
            )
          },
          {
            item_type: 'multiple_choice',
            identifier: 'can_play_concurrently',
            admin_description: 'Can Play Concurrently?',
            style: 'radio_horizontal',
            caption: 'Can players play in your LARP and another event at the same time?',
            choices: [
              { caption: 'Yes', value: true },
              { caption: 'No', value: false }
            ]
          },
          {
            item_type: 'multiple_choice',
            identifier: 'multiple_runs',
            admin_description: 'Can Do Multiple Runs?',
            style: 'radio_horizontal',
            caption: 'Are you willing to hold this LARP more than once at this convention?',
            choices: [
              { caption: 'Yes', value: true },
              { caption: 'No', value: false }
            ]
          },
          {
            item_type: 'free_text',
            identifier: 'scheduling_constraints',
            admin_description: 'Scheduling Constraints',
            lines: 4,
            caption: <<-MARKDOWN
  If you are willing to hold the LARP more than once, please discuss your preferences here.

  In addition, if there are scheduling constraints on your LARP (for example, if are you proposing
  another event), or there are times your LARP cannot be scheduled, please discuss them as well.
  MARKDOWN
          },
          {
            item_type: 'free_text',
            identifier: 'space_requirements',
            admin_description: 'Space Requirements',
            lines: 2,
            caption: 'Space Requirements:'
          }
        ]
      }
    ]
  end
end
