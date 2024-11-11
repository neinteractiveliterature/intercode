class UpdateSignupBucketDescriptionPartials < ActiveRecord::Migration[7.2]
  STANDARD_PREVIOUS_USER_SIGNUPS = <<~LIQUID
  {% assign signups = user_con_profile.signups | sort: "starts_at" %}

  {% if signups.size > 0 %}
    <section class="card bg-info text-white my-4">
      <div class="card-header">My Schedule</div>

      <ul class="list-group list-group-flush text-dark">
        {% for signup in signups %}
          <li class="list-group-item d-flex align-items-center">
            <div style="width: 11em">
              {{ signup.starts_at | date: "%a %l:%M%P" }} - {{ signup.ends_at | date: "%l:%M%P" }}
            </div>
            <div class="col">
              <a href="{{ signup.event_url }}">{{ signup.event.title }}</a>
              {% if signup.state != 'confirmed' %}
                [{{ signup.state | capitalize }}]
              {% endif %}
              {% if signup.team_member? %}
                [{{ signup.event.team_member_name }}]
              {% endif %}
            </div>

            <div>
              {% withdraw_user_signup_button signup %}
            </div>
          </li>
        {% endfor %}
      </ul>
    </section>
  {% endif %}
  LIQUID

  SMOKE_AND_MIRRORS_PREVIOUS_USER_SIGNUPS = <<~LIQUID
  {% assign signups = user_con_profile.signups | sort: "starts_at" %}

  {% if signups.size > 0 %}
    <section class="card bg-info text-white my-4">
      <div class="card-header">My Schedule
        <div class="float-end">
            <a class="btn btn-outline-light" target="_blank" href="https://calendar.google.com/calendar/r?cid={{user_con_profile.schedule_calendar_url | url_encode}}" title='Add to Google Calendar' data-bs-toggle="tooltip" data-bs-placement="top"><i class="bi-calendar3" aria-hidden="true"></i></a>
        </div>
      </div>
      <div style='max-height:499px; overflow-y:auto'>
      <ul class="list-group list-group-flush text-dark">
        {% for signup in signups %}
          <li class="list-group-item d-flex align-items-center">
            <div class="col">
              <div class="row">
                <strong>
                  {{ signup.starts_at | date: "%a %l:%M%P" }} - {{ signup.ends_at | date: "%l:%M%P" }}:
                  {{ signup.run.room_names | join: ', ' }}
                </strong>
              </div>
              <div class="d-flex">
                <span>
                  {% if signup.state == 'waitlisted' %}
                    <i class="bi-hourglass-split" aria-hidden="true"></i>
                  {% elsif signup.team_member? %}
                    {% case signup.event.event_category.name %}
                      {% when "Con services" %}
                        <i class="bi-gear-fill" aria-hidden="true"></i>
                      {% when "Volunteer event" %}
                        <i class="bi-gear-fill" aria-hidden="true"></i>
                      {% when "Larp" %}
                        <i class="bi-megaphone-fill" aria-hidden="true"></i>
                      {% when "Moderated discussion" %}
                        <i class="bi-megaphone-fill" aria-hidden="true"></i>
                      {% when "Panel" %}
                        <i class="bi-megaphone-fill" aria-hidden="true"></i>
                      {% when "Presentation" %}
                        <i class="bi-megaphone-fill" aria-hidden="true"></i>
                      {% when "Town hall" %}
                        <i class="bi-megaphone-fill" aria-hidden="true"></i>
                      {% when "Workshop" %}
                        <i class="bi-megaphone-fill" aria-hidden="true"></i>
                      {% when "Party" %}
                        <i class="bi-chat-fill" aria-hidden="true"></i>
                      {% when "Social event" %}
                        <i class="bi-chat-fill" aria-hidden="true"></i>
                      {% when "Meetup" %}
                        <i class="bi-chat-fill" aria-hidden="true"></i>
                      {% else %}
                        <i class="bi-people-fill" aria-hidden="true"></i>
                    {% endcase%}
                  {% elsif signup.bucket.name %}
                    <i class="bi-person-circle" aria-hidden="true"></i>
                  {% endif %}
                </span>
                &nbsp;{{ signup.event.event_category.name | replace: "_", " " | humanize}}:&nbsp;
                <strong>
                  <a href="{{ signup.event_url }}">{{ signup.event.title }} </a>
                </strong>
                {% if signup.state != 'confirmed' %}
                  &nbsp;[{{ signup.state | capitalize }}]
                {% endif %}
                {% if signup.team_member? %}
                  &nbsp;[{{ signup.event.team_member_name }}]
                {% elsif signup.bucket.name %}
                  {% if signup.bucket.name != 'Signups' %}
                    {% if signup.bucket.name != 'Interested' %}
                      &nbsp;[{{ signup.bucket.name }}]
                    {% endif %}
                  {% endif %}
                {% endif %}
              </div>
            </div>

            <div>
              {% withdraw_user_signup_button signup %}
            </div>
          </li>
        {% endfor %}
        </div>
      </ul>
    </section>
  {% endif %}
  LIQUID

  WANDERLUST_PREVIOUS_USER_SIGNUP = <<~LIQUID
  {% assign eventEnd = signup.ends_at | date: '%s' %}
  {% assign eventDiff = eventEnd | minus: nowTimestamp %}

  <li class="list-group-item d-flex align-items-center">
    <div class="flex-grow-1">
      <div>
        <strong>
          {{ signup.starts_at | date: "%a %l:%M%P" }} - {{ signup.ends_at | date: "%l:%M%P" }}:
          {{ signup.run.room_names | join: ', ' }}
        </strong>
        <br>
        <span>
          {% if signup.state == 'waitlisted' %}
            <i class="bi-hourglass-split" aria-hidden="true"></i>
          {% elsif signup.team_member? %}
            {% case signup.event.event_category.name %}
              {% when "Con services" %}
                <i class="bi-gear-fill" aria-hidden="true"></i>
              {% when "Volunteer event" %}
                <i class="bi-gear-fill" aria-hidden="true"></i>
              {% when "Larp" %}
                <i class="bi-megaphone-fill" aria-hidden="true"></i>
              {% when "Moderated discussion" %}
                <i class="bi-megaphone-fill" aria-hidden="true"></i>
              {% when "Panel" %}
                <i class="bi-megaphone-fill" aria-hidden="true"></i>
              {% when "Presentation" %}
                <i class="bi-megaphone-fill" aria-hidden="true"></i>
              {% when "Town hall" %}
                <i class="bi-megaphone-fill" aria-hidden="true"></i>
              {% when "Workshop" %}
                <i class="bi-megaphone-fill" aria-hidden="true"></i>
              {% when "Party" %}
                <i class="bi-chat-fill" aria-hidden="true"></i>
              {% when "Social event" %}
                <i class="bi-chat-fill" aria-hidden="true"></i>
              {% when "Meetup" %}
                <i class="bi-chat-fill" aria-hidden="true"></i>
              {% else %}
                <i class="bi-people-fill" aria-hidden="true"></i>
            {% endcase%}
          {% elsif signup.bucket.name %}
            <i class="bi-person-circle" aria-hidden="true"></i>
          {% endif %}
        </span>
        &nbsp;{{ signup.event.event_category.name | replace: "_", " " | humanize}}:&nbsp;
        <strong>
          <a href="{{ signup.event_url }}">{{ signup.event.title }} </a>
        </strong>
        {% if signup.state != 'confirmed' %}
          &nbsp;[{{ signup.state | capitalize }}]
        {% endif %}
        {% if signup.team_member? %}
          &nbsp;[{{ signup.event.team_member_name }}]
        {% elsif signup.bucket.name %}
          {% if signup.bucket.name != 'Signups' %}
            {% if signup.bucket.name != 'Interested' %}
              &nbsp;[{{ signup.bucket.name }}]
            {% endif %}
          {% endif %}
        {% endif %}
      </div>
    </div>
    <div>
      {% if eventDiff > 0 %}
        {% withdraw_user_signup_button signup "Withdraw" btn-outline-danger btn-sm %}
      {% else %}
      Past Event
      {% endif %}
    </div>
  </li>
  LIQUID

  STANDARD_PREVIOUS_SIGNUP_CONFIRMATION_BODY_TEXT = <<~LIQUID
  {%- assign run = signup.run -%}
  {% if signup.state == "waitlisted"%}Waitlist{% else %}Signup{% endif %} confirmation for {% include 'run_description' %}

  This message is to confirm that you've successfully
  {%- if signup.state == "waitlisted" %} joined the waitlist for
  {%- else %} signed up for
  {%- endif %} {% include 'run_description' %}.

  Your new signup:
  {{ signup.starts_at | date: "%a %l:%M%P" }} - {{ signup.ends_at | date: "%l:%M%P" }}: {{ signup.run.room_names | join: ', ' }}
  {{ signup.event.event_category.name | replace: "_", " " | humanize}}: {{ signup.event.title }}
  {%- if signup.state != 'confirmed' %} [{{ signup.state | capitalize }}]{% endif -%}
  {%- if signup.team_member? %} [{{ signup.event.team_member_name }}]
  {%- elsif signup.bucket.name -%}
    {%- if signup.bucket.name != 'Signups' -%}
      {%- if signup.bucket.name != 'Interested' %} [{{ signup.bucket.name }}]{% endif -%}
    {%- endif -%}
  {%- endif %}
  {{ signup.event_url | absolute_url }}
  LIQUID

  STANDARD_PREVIOUS_SIGNUP_CONFIRMATION_BODY_HTML = <<~LIQUID
  {% assign run = signup.run %}
  <h1>{% if signup.state == "waitlisted"%}Waitlist{% else %}Signup{% endif %} confirmation for {% include 'run_description' %}</h1>

  <p>
    This message is to confirm that you've successfully
    {%- if signup.state == "waitlisted" %} joined the waitlist for
    {%- else %} signed up for
    {%- endif %}
    {% include 'run_description' %}.
  </p>

  <div style="border: 1px black solid; border-radius: 5px;">
    <div style="background-color: black; padding: 10px; color: white; font-weight: bold;">
      Your new signup
    </div>
    <div style="padding: 10px;">
      <strong>
        {{ signup.starts_at | date: "%a %l:%M%P" }} - {{ signup.ends_at | date: "%l:%M%P" }}:
        {{ signup.run.room_names | join: ', ' }}
      </strong>
      <br>
      {{ signup.event.event_category.name | replace: "_", " " | humanize}}:&nbsp;
      <strong>
        <a href="{{ signup.event_url | absolute_url }}">{{ signup.event.title }}</a>
      </strong>
      {% if signup.state != 'confirmed' %}
        &nbsp;[{{ signup.state | capitalize }}]
      {% endif %}
      {% if signup.team_member? %}
        &nbsp;[{{ signup.event.team_member_name }}]
      {% elsif signup.bucket.name %}
        {% if signup.bucket.name != 'Signups' %}
          {% if signup.bucket.name != 'Interested' %}
            &nbsp;[{{ signup.bucket.name }}]
          {% endif %}
        {% endif %}
      {% endif %}
    </div>
  </li>
  LIQUID

  PREVIOUS_CONTENT = {
    "partials" => {
      "standard" => {
        "user_signups" => {
          "content" => STANDARD_PREVIOUS_USER_SIGNUPS
        }
      },
      "smoke_and_mirrors" => {
        "user_signups" => {
          "content" => SMOKE_AND_MIRRORS_PREVIOUS_USER_SIGNUPS
        }
      },
      "wanderlust" => {
        "user_signup" => {
          "content" => WANDERLUST_PREVIOUS_USER_SIGNUP
        }
      }
    },
    "notification_templates" => {
      "standard" => {
        "signups/signup_confirmation" => {
          "body_html" => STANDARD_PREVIOUS_SIGNUP_CONFIRMATION_BODY_HTML,
          "body_text" => STANDARD_PREVIOUS_SIGNUP_CONFIRMATION_BODY_TEXT
        }
      },
      "smoke_and_mirrors" => {
        "signups/signup_confirmation" => {
          "body_html" => STANDARD_PREVIOUS_SIGNUP_CONFIRMATION_BODY_HTML,
          "body_text" => STANDARD_PREVIOUS_SIGNUP_CONFIRMATION_BODY_TEXT
        }
      },
      "wanderlust" => {
        "signups/signup_confirmation" => {
          "body_html" => STANDARD_PREVIOUS_SIGNUP_CONFIRMATION_BODY_HTML,
          "body_text" => STANDARD_PREVIOUS_SIGNUP_CONFIRMATION_BODY_TEXT
        }
      }
    }
  }

  def up
    standard = CmsContentSet.new(name: "standard")
    smoke_and_mirrors = CmsContentSet.new(name: "smoke_and_mirrors")
    wanderlust = CmsContentSet.new(name: "wanderlust")

    Convention.find_each do |convention|
      content_set =
        if convention.name.start_with?("Intercon ")
          if convention.cms_partials.where(name: "user_signup").any?
            wanderlust
          elsif convention.cms_partials.where(name: "badgecheck").any?
            smoke_and_mirrors
          else
            standard
          end
        else
          standard
        end

      cms_partial_identifiers =
        if content_set.name == "wanderlust"
          %w[signup_bucket_description user_signup]
        else
          %w[signup_bucket_description user_signups]
        end

      partial_conflict_policy =
        CmsContentLoaders::ConflictPolicies::Update.new(PREVIOUS_CONTENT.fetch("partials").fetch(content_set.name))
      partial_loader =
        CmsContentLoaders::CmsPartials.new(
          cms_parent: convention,
          content_set:,
          content_identifiers: cms_partial_identifiers,
          conflict_policy: partial_conflict_policy
        )
      partial_loader.call!
      partial_conflict_policy.skipped_items.each { |skipped_item| say "#{convention.name}: #{skipped_item.message}" }

      notification_template_conflict_policy =
        CmsContentLoaders::ConflictPolicies::Update.new(
          PREVIOUS_CONTENT.fetch("notification_templates").fetch(content_set.name)
        )
      notification_template_loader =
        CmsContentLoaders::NotificationTemplates.new(
          cms_parent: convention,
          content_set:,
          content_identifiers: %w[signups/signup_confirmation],
          conflict_policy: notification_template_conflict_policy
        )
      notification_template_loader.call!
      notification_template_conflict_policy.skipped_items.each do |skipped_item|
        say "#{convention.name}: #{skipped_item.message}"
      end
    end
  end

  def down
  end
end
