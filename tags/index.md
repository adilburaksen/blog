---
layout: layout.njk
title: Tags
permalink: "/tags/index.html"
---

<h2><span class="prompt">$</span> tags</h2>
<p>Browse all tags used in posts:</p>

<ul>
  {% for tag in collections.tagList %}
    <li><a href="/tags/{{ tag | slug }}/">#{{ tag }}</a></li>
  {% endfor %}
</ul>