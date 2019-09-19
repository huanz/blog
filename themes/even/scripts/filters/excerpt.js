var rExcerpt = /<p>&lt;!--\s*more\s*--&gt;<\/p>/i;
hexo.extend.filter.register('after_post_render', function(data) {
	var content = data.content;
	if (!data.excerpt && rExcerpt.test(content)) {
		data.content = content.replace(rExcerpt, function(match, index) {
			data.excerpt = content.substring(0, index).trim();
			data.more = content.substring(index + match.length).trim();

			return '<a id="more"></a>';
		});
	}
});
