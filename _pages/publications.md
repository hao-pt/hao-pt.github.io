---
layout: page
permalink: /publications/
title: publications
description: (*) denotes equal contribution
# years: [2026, 2025, 2024, 2023, 2020] # not used
nav: true
nav_order: 2
---

<!-- _pages/publications.md -->

<!-- Bibsearch Feature -->

{% include bib_search.liquid %}

<div class="publications">

{% comment %}
{%- for y in page.years %}
  <h2 class="year">{{y}}</h2>
  {% bibliography -f papers -q @*[year={{y}}]* %}
{% endfor %}
{% endcomment %}

{% bibliography %} 

</div>
