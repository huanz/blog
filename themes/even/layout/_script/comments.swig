{% if !is_home() and !is_archive() %}
  {% if theme.disqus_shortname %}
    {% include "_comments/disqus.swig" %}
  {% elseif theme.changyan and theme.changyan.appid and theme.changyan.appkey %}
    {% include "_comments/changyan.swig" %}
  {% elseif theme.livere_datauid %}
    {% include "_comments/livere.swig" %}
  {% elseif theme.valine.appid and theme.valine.appkey %}
    {% include "_comments/valine.swig" %}
  {% endif %}
{% endif %}
