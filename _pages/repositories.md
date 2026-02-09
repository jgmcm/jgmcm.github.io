---
layout: page
permalink: /code/
title: Code
description: Open-source software and research code.
nav: true
nav_order: 4
---

{% if site.data.repositories.github_users %}

## GitHub users

<div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center">
  {% for user in site.data.repositories.github_users %}
    {% include repository/repo_user.liquid username=user %}
  {% endfor %}
</div>

---

{% if site.repo_trophies.enabled %}
{% for user in site.data.repositories.github_users %}
{% if site.data.repositories.github_users.size > 1 %}

  <h4>{{ user }}</h4>
  {% endif %}
  <div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center">
  {% include repository/repo_trophies.liquid username=user %}
  </div>

---

{% endfor %}
{% endif %}
{% endif %}

{% if site.data.repositories.github_repos.size > 0 %}

## GitHub Repositories

<div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center">
  {% for repo in site.data.repositories.github_repos %}
    {% include repository/repo.liquid repository=repo %}
  {% endfor %}
</div>
{% endif %}

{% if site.data.repositories.github_users %}

## Contributions

{% for user in site.data.repositories.github_users %}
<div class="mt-3 mb-3">
  <a href="https://github.com/{{ user }}">
    <img class="only-light w-100" alt="{{ user }}'s GitHub contributions" src="https://ghchart.rshah.org/{{ user }}" />
    <img class="only-dark w-100" alt="{{ user }}'s GitHub contributions" src="https://ghchart.rshah.org/409ba5/{{ user }}" />
  </a>
</div>
{% endfor %}
{% endif %}
