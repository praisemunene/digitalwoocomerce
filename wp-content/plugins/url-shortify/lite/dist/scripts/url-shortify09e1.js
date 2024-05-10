(function ($) {
	'use strict';

	function validURL(str) {
		var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
			'(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
		return !!pattern.test(str);
	}

	$(document).ready(function () {
		// Copy Short Link
		var elem = '.kc-us-copy-to-clipboard';

		if ($(elem).get(0)) {

			let clipboard_link = new Clipboard(elem);

			clipboard_link.on(
				'success', function (e) {

					let elem = e.trigger;

					$(elem).find('.kc-us-link').select();
					let id = elem.getAttribute('id');

					let copiedTextID = '#copied-text-' + id;

					$(copiedTextID).text('Copied').fadeIn();
					$(copiedTextID).fadeOut('slow');
				}
			);
		}

		// Generate Short Links for Posts & Pages from POSTS & PAGES list
		$(".kc_us_create_short_link").click(function (e) {

			e.preventDefault();

			var post_id = $(this).attr('data-post_id');
			var security = $(this).attr('data-us-security');

			$(this).find('.kc_us_loading').show();

			$.ajax({
				type: "post",
				dataType: "json",
				context: this,
				url: ajaxurl,
				data: {
					action: 'us_handle_request',
					cmd: "create_short_link",
					post_id: post_id,
					security: security
				},
				success: function (response) {
					if (response.status === "success") {
						$(this).parent('.us_short_link').html(response.html);
					} else {
						$(this).find('.kc_us_loading').hide();
					}
				},

				error: function (err) {
					$(this).find('.kc_us_loading').hide();
				}
			});
		});


		/**
		 * Generate Short link from Dashboard Widget
		 *
		 * @since 1.2.5
		 */
		$("#kc-us-dashboard-short-link").click(function (e) {

			e.preventDefault();

			var targetURL = $('#kc-us-target-url').val();
			var slug = $('#kc-us-slug').val();
			var security = $('#kc-us-security').val();
			var domain = $('#kc-us-domain').val();

			if (!validURL(targetURL)) {
				alert('Please Enter Valid Target URL');
				return;
			}

			$(this).find('.kc_us_loading').show();
			$('#kc-us-error-message').hide();
			$('#kc-us-success-message').hide();

			$.ajax({
				type: "post",
				dataType: "json",
				context: this,
				url: ajaxurl,
				data: {
					action: 'us_handle_request',
					cmd: "create_short_link",
					slug: slug,
					url: targetURL,
					security: security,
					domain: domain
				},
				success: function (response) {
					if (response.status === "success") {

						var link = response.link;

						var html = 'Short Link : <span class="kc-flex kc-us-copy-to-clipboard" data-clipboard-text="' + link + '" id="link-25"><input type="text" readonly="true" style="width: 65%;" onclick="this.select();" value="' + link + '" class="kc-us-link"></span>';

						$('#kc-us-success-message').html(html);

						$('#kc-us-success-message').show();
					} else {
						var html = 'Something went wrong while creating short link';
						if (response.message) {
							html = response.message;
						}

						$('#kc-us-error-message').html(html);
						$('#kc-us-error-message').show();
					}

					$('.kc_us_loading').hide();
				},

				error: function (err) {
					var html = 'Something went wrong while creating short link';
					$('#kc-us-error-message').html(html);
					$('#kc-us-error-message').show();

					$('.kc_us_loading').hide();
				}
			});
		});


		/**
		 * Show public facing url shortener
		 *
		 * @since 1.3.10
		 */
		$("#kc-us-submit-btn").click(function (e) {

			e.preventDefault();

			var targetURL = $('#kc-us-target-url').val();
			var security = $('#kc-us-security').val();

			if (!validURL(targetURL)) {
				alert('Please Enter Valid Long URL');
				return;
			}

			$(this).parents('.generate-short-link-form').find('.kc_us_loading').show();

			$.ajax({
				type: "post",
				dataType: "json",
				context: this,
				url: usParams.ajaxurl,
				data: {
					action: 'us_handle_request',
					cmd: "create_short_link",
					url: targetURL,
					security: security
				},
				success: function (response) {
					$(this).parents('.generate-short-link-form').find('.kc_us_loading').hide();

					if (response.status === "success") {
						var link = response.link;
						$('.generated-short-link-form #kc-us-short-url').val(link);
						$('.generate-short-link-form').hide();
						$('.generated-short-link-form').show();
					} else {
						var html = 'Something went wrong while creating short link';
						$('#kc-us-error-msg').text(html);
						$('#kc-us-error-msg').show();
					}
				},

				error: function (err) {
					var html = 'Something went wrong while creating short link';
					$('#kc-us-error-msg').text(html);
					$('#kc-us-error-msg').show();
				}
			});
		});
	});


})(jQuery);
