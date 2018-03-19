{% if page.comments and not is_home() %}
  <div class="comments" id="comments">
    {% if theme.disqus_shortname %}
      <div id="disqus_thread"></div>
    {% elseif theme.changyan and theme.changyan.appid and theme.changyan.appkey %}
      <div id="SOHUCS"></div>
    {% elseif theme.livere_datauid %}
      <div id="lv-container" data-id="city" data-uid="{{ theme.livere_datauid }}"></div>
    {% elseif theme.valine.appid and theme.valine.appkey %}
      <div id="vcomments"></div>
    {% endif %}
  </div>
{% endif %}
