---
layout: page
permalink: /research/
title: Research
description: Papers, active topics, and selected projects.
nav: true
nav_order: 2
---

The common thread across my work is structure: how stacking, strain, curvature, defects, and interfaces create electronic behaviour that is not visible from the isolated monolayer.

<div class="research-topics">
  <span>2D materials</span>
  <span>Moiré reconstruction</span>
  <span>Sliding ferroelectrics</span>
  <span>Charge-density modelling</span>
  <span>Machine-learning potentials</span>
</div>

## Selected Work

<div class="research-list">
{% for item in site.data.research %}
  <article class="research-item">
    <button class="research-toggle" type="button" aria-expanded="false" aria-controls="research-{{ forloop.index }}">
      <span class="research-marker">+</span>
      <span>
        <strong>{{ item.title }}</strong>
        <em>{{ item.venue }}{% if item.year %} · {{ item.year }}{% endif %}{% if item.coauthors %} · {{ item.coauthors }}{% endif %}</em>
      </span>
    </button>
    <div class="research-summary">{{ item.summary | markdownify }}</div>
    <div id="research-{{ forloop.index }}" class="research-detail" hidden>
      {{ item.detail | markdownify }}
      {% if item.links %}
        <p class="research-links">
          {% for link in item.links %}
            <a href="{{ link.url }}">{{ link.label }}</a>
          {% endfor %}
        </p>
      {% endif %}
    </div>
  </article>
{% endfor %}
</div>

<p class="complete-publications"><a href="{{ '/publications/' | relative_url }}">Complete publication list</a></p>

<script>
  document.querySelectorAll(".research-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      const detail = document.getElementById(button.getAttribute("aria-controls"));
      if (detail) detail.hidden = expanded;
    });
  });
</script>
