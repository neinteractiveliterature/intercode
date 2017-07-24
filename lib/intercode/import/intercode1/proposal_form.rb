class Intercode::Import::Intercode1::ProposalForm
  PROPOSAL_FORM_SECTIONS = [
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
          lines: 1
        },
        {
          item_type: 'free_text',
          identifier: 'authors',
          caption: 'Author(s)',
          lines: 1
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
          free_text_type: 'email'
        },
        {
          item_type: 'timespan',
          identifier: 'length_seconds',
          caption: 'Event Length'
        },
        {
          item_type: 'free_text',
          identifier: 'description',
          lines: 15,
          caption: <<-MARKDOWN
**Description** for use on the {{ convention.name }} website. This information will displayed on the page users see for the game. The description should be at least a couple of paragraphs, but can be as long as you like.

The game description is used to promote your game and attract players who will enjoy it. Be reasonably clear on where and when the game is set, and what the game is about. Let your players know what can they expect to be doing during the LARP, and make them excited to play your game! (We can offer suggestions if you would like advice on this.)

**Per NEIL policy, game descriptions must include either a content warning or an explicit statement that no content warnings are applicable.** For more information, [see the NEIL policies page](http://interactiveliterature.org/NEIL/communityPolicies.html#contentWarningsPolicy).

Please also include the preferred ages of players for your larp. Examples are "Players must be 18 or older", or "players under 16 must check with the GMs before playing", to "children at least [age] years old are welcome in this game".

The description will be displayed in the user's browser. You must use Markdown for formatting. [A quick primer on Markdown syntax is available here.](https://en.support.wordpress.com/markdown-quick-reference/)
MARKDOWN
        },
        {
          item_type: 'free_text',
          identifier: 'short_blurb',
          lines: 4,
          caption: <<-MARKDOWN
A **Short Blurb** (50 words or less) for the game to be used for the List of Events page and the convention program. Information in the Short Blurb must also be present in the (full) description!

The short blurb will be displayed in the user's browser. You must use Markdown for formatting. [A quick primer on Markdown syntax is available here.](https://en.support.wordpress.com/markdown-quick-reference/)
MARKDOWN
        },
        {
          item_type: 'free_text',
          identifier: 'player_communications',
          lines: 4,
          caption: <<-MARKDOWN
**Player Communications**

How will you distribute game information to your players? Will you be using a casting form? Will character roles be cast and distributed before the convention or on site, or will characters be developed as part of the game?
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
          lines: 1,
          caption: 'Genre:'
        },
        {
          item_type: 'multiple_choice',
          identifier: 'ongoing_campaign',
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
          lines: 1,
          caption: '{{ convention.name }} is looking for games that are new and games that have run before, either at a convention, or elsewhere. If this game has run before, where was that?'
        },
        {
          item_type: 'free_text',
          identifier: 'game_system',
          lines: 1,
          caption: 'Game System:'
        },
        {
          item_type: 'multiple_choice',
          identifier: 'combat_resolution',
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
          lines: 4,
          caption: 'Please enter any additional background information here, or any other information you wish to tell the Proposals Committee. This information will be shown only to the Proposals Committee.'
        },
        {
          item_type: 'free_text',
          identifier: 'setup_teardown',
          lines: 4,
          caption: 'Are there any special setup or teardown requirements for this LARP? For example, do you need extra time to set up or tear down a complex set? (Requests for standard furniture will be handled separately closer to the convention. Intercon can not provide unusual setup materials for your game.)'
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
          lines: 2,
          caption: <<-MARKDOWN
**GMs for your game.** Note that the GMs listed here are only for the purpose of evaluating your proposal. If your proposal is accepted, you'll be able to select GMs from the users registered for {{ convention.name }}.
MARKDOWN
        },
        {
          item_type: 'free_text',
          identifier: 'other_games',
          lines: 4,
          caption: 'What other LARPs have your written or run? Where and when were they run?'
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
Intercon R appeals to a diverse group of players of all ages, ethnicities, belief systems, sexual orientations, physical capabilities, experience, etc. Authors can write interesting games that might not be suitable for all audiences. In order for the con staff to balance these potentially opposing requirements, please answer the following questions.

Note that answering yes to any or all of these questions does not disqualify your proposal.
MARKDOWN
        },
        {
          item_type: 'free_text',
          identifier: 'offensive',
          lines: 4,
          caption: 'Are there any components of your LARP that might offend or upset some group of attendees? For example, adult themes, potentially offensive story arcs, etc. If so, please explain and consider if this needs to be mentioned in the game descriptions.'
        },
        {
          item_type: 'free_text',
          identifier: 'physical_restrictions',
          lines: 4,
          caption: 'Are there any physical restrictions imposed by your LARP? For example, live boffer combat, confined sets, etc. If so, please explain and consider if this needs to be mentioned in the game descriptions.'
        },
        {
          item_type: 'free_text',
          identifier: 'age_appropriate',
          lines: 4,
          caption: 'Is your game appropriate for players under the age of 18? Please discuss any age restrictions here. If there are any components of your LARP that might be illegal for attendees under the age of 18 (props or items that are illegal for a minor to possess, alcohol, etc.) please explain. If your game has age restrictions, please be sure to mention this in the game descriptions.'
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
          content: 'The con can schedule your game into one (or more) of the time slots available over the weekend. The con has to put together a balanced schedule so we can satisfy the most players in the most time slots. Your flexibility in scheduling your game is vital.'
        },
        {
          item_type: 'timeblock_preference',
          identifier: 'timeblock_preferences',
          caption: "Please pick your top three preferences for when you'd like to run your game.",
          timeblocks: [
            { label: 'Morning', start: { hour: 9 }, finish: { hour: 13 } },
            { label: 'Afternoon', start: { hour: 14 }, finish: { hour: 18 } },
            { label: 'Evening', start: { hour: 20 }, finish: { hour: 24 } },
            { label: 'After Midnight', start: { hour: 24 }, finish: { hour: 28 } }
          ]
        },
        {
          item_type: 'multiple_choice',
          identifier: 'can_play_concurrently',
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
          lines: 4,
          caption: <<-MARKDOWN
If you are willing to hold the LARP more than once, please discuss your preferences here.

In addition, if there are scheduling constraints on your LARP (for example, if are you proposing another event), or there are times your LARP cannot be scheduled, please discuss them as well.
MARKDOWN
        },
        {
          item_type: 'free_text',
          identifier: 'space_requirements',
          lines: 2,
          caption: 'Space Requirements:'
        }
      ]
    }
  ]

  attr_reader :convention

  def initialize(convention)
    @convention = convention
  end

  def import!
    logger.info "Importing proposal form"

    form = convention.forms.create!(title: "Proposal form")

    PROPOSAL_FORM_SECTIONS.each do |section_attributes|
      logger.info "Importing section #{section_attributes[:title]}"
      section = form.form_sections.create!(section_attributes.slice(:title))
      (section_attributes[:section_items] || []).each do |item_attributes|
        logger.info "Importing #{item_attributes[:item_type]} item #{item_attributes[:identifier]}"
        direct_properties = item_attributes.slice(:item_type, :identifier)
        other_properties = item_attributes.except(:item_type, :identifier)
        section.form_items.create!(direct_properties.merge(properties: other_properties))
      end
    end
  end

  private

  def logger
    Intercode::Import::Intercode1.logger
  end
end