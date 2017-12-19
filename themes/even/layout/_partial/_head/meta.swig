<meta charset="UTF-8"/>
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>

<meta name="referrer" content="always">
<meta name="author" content="{{ config.author }}">

{# Disable transformation #}
<meta http-equiv="Cache-Control" content="no-transform" />
<meta http-equiv="Cache-Control" content="no-siteapp" />

<meta name="theme-color" content="#c05b4d" />
<meta name="msapplication-navbutton-color" content="#c05b4d">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="#c05b4d">
<meta name="format-detection" content="telphone=no, email=no" />
<meta name="msapplication-TileColor" content="#c05b4d">

<meta name="screen-orientation" content="portrait">
<meta name="x5-orientation" content="portrait">
<meta name="apple-touch-fullscreen" content="yes">
<meta name="full-screen" content="yes">
<meta name="x5-fullscreen" content="true">
<meta name="x5-page-mode" content="app">
<meta name="browsermode" content="application">
<meta name="msapplication-config" content="/browserconfig.xml" />
<link rel="manifest" href="/manifest.json">

<meta name="msapplication-TileImage" content="/image/icon/144x144.png">
<link rel="apple-touch-icon" sizes="60x60" href="/image/icon/60x60.png">
<link rel="apple-touch-icon" sizes="72x72" href="/image/icon/72x72.png">
<link rel="apple-touch-icon" sizes="120x120" href="/image/icon/120x120.png">
<link rel="apple-touch-icon" sizes="144x144" href="/image/icon/144x144.png">
<link rel="icon" type="image/png" sizes="192x192"  href="/image/icon/192x192.png">
<link rel="icon" type="image/png" sizes="32x32" href="/image/icon/32x32.png">
<link rel="icon" type="image/png" sizes="96x96" href="/image/icon/96x96.png">
<link rel="icon" type="image/png" sizes="16x16" href="/image/icon/16x16.png">

{# Website description #}
{% if page.description %}
  <meta name="description" content="{{ page.description }}"/>
{% elif page.title %}
  <meta name="description" content="{{ page.title }}"/>
{% elif config.description %}
  <meta name="description" content="{{ config.description }}"/>
{% endif %}

{# Website keywords #}
{% if page.keywords %}
  <meta name="keywords" content="{{ page.keywords }}" />
{% elif config.keywords %}
  <meta name="keywords" content="{{ config.keywords }}" />
{% elif page.tags and page.tags.length %}
  <meta name="keywords" content="{% for tag in page.tags %}{{ tag.name }}, {% endfor %}{{ config.title }}" />
{% endif %}

{% if theme.baidu_verification %}
  <meta name="baidu-site-verification" content="{{ theme.baidu_verification }}" />
{% endif %}

{% if theme.google_verification %}
  <meta name="google-site-verification" content="{{ theme.google_verification }}" />
{% endif %}

