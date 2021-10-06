class UpdateUserSignupsPartialsByContentHash < ActiveRecord::Migration[6.1]
  USER_SIGNUPS_UPDATED_CONTENT_BY_MD5 = {
    # Standard content set version
    '1a6dceeb3dcd78ec6ffd0d3d8856f55b' => <<~LIQUID,
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
    # Spanish version of standard content used by Cyberol
    '6e1adedc16d9462d0b2890ce8fc7804d' => <<~LIQUID,
      {% assign signups = user_con_profile.signups | sort: "starts_at" %}

      {% if signups.size > 0 %}
        <section class="card bg-info text-white my-4">
          <div class="card-header">Actividades a las que estoy inscrito</div>

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
    # Unusual variant on standard content set from HRSFANs, Iron GM, etc
    '7a3b8c51ad2aff3b7fad4c9855b0f76c' => <<~LIQUID,
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
    # Intercon S version
    '2fd7375184afdc0272030922e3fa3cdc' => <<~LIQUID,
      {% assign signups = user_con_profile.signups | sort: "starts_at" %}

      {% if signups.size > 0 %}
        <section class="card bg-info text-white my-4">
          <div class="card-header">My Schedule
            <div class="float-end">
                <a class="btn btn-outline-light" target="_blank" href="https://calendar.google.com/calendar/r?cid={{user_con_profile.schedule_calendar_url | url_encode}}" title='Add to Google Calendar' data-bs-toggle="tooltip" data-bs-placement="top"><i class="fa fa-calendar" aria-hidden="true"></i></a>
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
                        <i class="fa fa-hourglass-half" aria-hidden="true"></i>
                      {% elsif signup.team_member? %}
                        {% case signup.event.event_category.name %}
                          {% when "Con services" %}
                            <i class="fa fa-cog" aria-hidden="true"></i>
                          {% when "Volunteer event" %}
                            <i class="fa fa-cog" aria-hidden="true"></i>
                          {% when "Larp" %}
                            <i class="fa fa-gavel" aria-hidden="true"></i>
                          {% when "Moderated discussion" %}
                            <i class="fa fa-gavel" aria-hidden="true"></i>
                          {% when "Panel" %}
                            <i class="fa fa-gavel" aria-hidden="true"></i>
                          {% when "Presentation" %}
                            <i class="fa fa-gavel" aria-hidden="true"></i>
                          {% when "Town hall" %}
                            <i class="fa fa-gavel" aria-hidden="true"></i>
                          {% when "Workshop" %}
                            <i class="fa fa-gavel" aria-hidden="true"></i>
                          {% when "Party" %}
                            <i class="fa fa-comments" aria-hidden="true"></i>
                          {% when "Social event" %}
                            <i class="fa fa-comments" aria-hidden="true"></i>
                          {% when "Meetup" %}
                            <i class="fa fa-comments" aria-hidden="true"></i>
                          {% else %}
                            <i class="fa fa-users" aria-hidden="true"></i>
                        {% endcase%}
                      {% elsif signup.bucket.name %}
                        <i class="fa fa-user-circle-o" aria-hidden="true"></i>
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
    # Unusual variant of Intercon S version used by SLAW 2019
    '65473fdced0714d692db4a884dde0989' => <<~LIQUID,
      {% assign signups = user_con_profile.signups | sort: "starts_at" %}

      {% if signups.size > 0 %}
        <section class="card bg-info text-white my-4">
          <div class="card-header">My Schedule
            <div class="float-end">
                <a class="btn btn-outline-light" target="_blank" href="https://calendar.google.com/calendar/r?cid={{user_con_profile.schedule_calendar_url | url_encode}}" title='Add to Google Calendar' data-bs-toggle="tooltip" data-bs-placement="top"><i class="fa fa-calendar" aria-hidden="true"></i></a>
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
                        <i class="fa fa-hourglass-half" aria-hidden="true"></i>
                      {% elsif signup.team_member? %}
                        {% case signup.event.event_category.name %}
                          {% when "Con services" %}
                            <i class="fa fa-cog" aria-hidden="true"></i>
                          {% when "Volunteer event" %}
                            <i class="fa fa-cog" aria-hidden="true"></i>
                          {% when "Larp" %}
                            <i class="fa fa-gavel" aria-hidden="true"></i>
                          {% when "Moderated discussion" %}
                            <i class="fa fa-gavel" aria-hidden="true"></i>
                          {% when "Panel" %}
                            <i class="fa fa-gavel" aria-hidden="true"></i>
                          {% when "Presentation" %}
                            <i class="fa fa-gavel" aria-hidden="true"></i>
                          {% when "Town hall" %}
                            <i class="fa fa-gavel" aria-hidden="true"></i>
                          {% when "Workshop" %}
                            <i class="fa fa-gavel" aria-hidden="true"></i>
                          {% when "Party" %}
                            <i class="fa fa-comments" aria-hidden="true"></i>
                          {% when "Social event" %}
                            <i class="fa fa-comments" aria-hidden="true"></i>
                          {% when "Meetup" %}
                            <i class="fa fa-comments" aria-hidden="true"></i>
                          {% else %}
                            <i class="fa fa-users" aria-hidden="true"></i>
                        {% endcase%}
                      {% elsif signup.bucket.name %}
                        <i class="fa fa-user-circle-o" aria-hidden="true"></i>
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
    # NELCO version
    'f1d52bad605d63a8d63e6052082ba232' => <<~LIQUID
      {% assign signups = user_con_profile.signups | sort: "starts_at" %}

      {% if signups.size > 0 %}
        <section class="card bg-info text-white my-4">
          <div class="card-header">My Schedule
            <div class="float-end">
                <a  class="btn btn-outline-light" target="_blank" href="https://calendar.google.com/calendar/r?cid={{user_con_profile.schedule_calendar_url | url_encode}}" title='Add to Google Calendar' data-bs-toggle="tooltip" data-bs-placement="top"><i class="fa fa-calendar" aria-hidden="true"></i></a>
            </div>
            </div>
          <ul class="list-group list-group-flush text-dark">
            {% for signup in signups %}
              <li class="list-group-item d-flex align-items-baseline">
                <div class="col">
                  <div class="d-flex">
                    {{ signup.starts_at | date: "%a %l:%M%P" }} - {{ signup.ends_at | date: "%l:%M%P" }}:
                    {{ signup.run.room_names | join: ', ' }}
                  </div>
                  <div class="d-flex">

                    <a class="font-weight-bold" href="{{ signup.event_url }}">{{ signup.event.title }} </a>
                    {% if signup.state != 'confirmed' %}
                      [{{ signup.state | capitalize }}]
                    {% endif %}
                    {% if signup.team_member? %}
                      [{{ signup.event.team_member_name }}]
                    {% elsif signup.bucket.name %}
                      [{{ signup.bucket.name }}]
                    {% endif %}
                  </div>
                </div>

                <div class="align-middle">
                  <a class="btn btn-sm btn-outline-danger" href="{{ signup.withdraw_url }}" data-method="DELETE" data-confirm="Are you sure you want to withdraw from {{ signup.event.title }}?">Withdraw</a>
                </div>
              </li>
            {% endfor %}
          </ul>
        </section>
      {% endif %}
    LIQUID
  }

  USER_SIGNUP_UPDATED_CONTENT_BY_MD5 = {
    # Intercon T version, also used by Intercon U, Extracon 2021, and Summer Larpin' 2020 and 2021
    '5a6f9e9a4aca4e4908c324985216beea' => <<~LIQUID
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
                <i class="fa fa-hourglass-half" aria-hidden="true"></i>
              {% elsif signup.team_member? %}
                {% case signup.event.event_category.name %}
                  {% when "Con services" %}
                    <i class="fa fa-cog" aria-hidden="true"></i>
                  {% when "Volunteer event" %}
                    <i class="fa fa-cog" aria-hidden="true"></i>
                  {% when "Larp" %}
                    <i class="fa fa-gavel" aria-hidden="true"></i>
                  {% when "Moderated discussion" %}
                    <i class="fa fa-gavel" aria-hidden="true"></i>
                  {% when "Panel" %}
                    <i class="fa fa-gavel" aria-hidden="true"></i>
                  {% when "Presentation" %}
                    <i class="fa fa-gavel" aria-hidden="true"></i>
                  {% when "Town hall" %}
                    <i class="fa fa-gavel" aria-hidden="true"></i>
                  {% when "Workshop" %}
                    <i class="fa fa-gavel" aria-hidden="true"></i>
                  {% when "Party" %}
                    <i class="fa fa-comments" aria-hidden="true"></i>
                  {% when "Social event" %}
                    <i class="fa fa-comments" aria-hidden="true"></i>
                  {% when "Meetup" %}
                    <i class="fa fa-comments" aria-hidden="true"></i>
                  {% else %}
                    <i class="fa fa-users" aria-hidden="true"></i>
                {% endcase%}
              {% elsif signup.bucket.name %}
                <i class="fa fa-user-circle-o" aria-hidden="true"></i>
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
  }

  def up
    USER_SIGNUPS_UPDATED_CONTENT_BY_MD5.each do |md5, updated_content|
      CmsPartial.where('name = ? and md5(content) = ?', 'user_signups', md5).update_all(content: updated_content)
    end

    USER_SIGNUP_UPDATED_CONTENT_BY_MD5.each do |md5, updated_content|
      CmsPartial.where('name = ? and md5(content) = ?', 'user_signup', md5).update_all(content: updated_content)
    end
  end
end
