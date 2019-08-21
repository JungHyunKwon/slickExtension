/**
 * @author JungHyunKwon
 * @version 1.0.0
 */
(function($) {
	'use strict';

	var _slick = $.fn.slick,
		_userAgent = navigator.userAgent.toLowerCase(),
		_isLowIE = _userAgent.indexOf('msie 7.0') > -1 || _userAgent.indexOf('msie 8.0') > -1,
		_$extend = $.extend;

	/**
	 * @name slickExtensions
	 * @since 2018-08-02
	 * @param {object || string} options {
	 *	   isRunOnLowIE : boolean,
	 *	   autoArrow : object,
	 *	   playArrow : object
	 *	   pauseArrow : object,
	 *	   pauseOnArrowClick : boolean,
	 *	   pauseOnDotsClick : boolean,
	 *	   pauseOnDirectionKeyPush : boolean,
	 *	   pauseOnSwipe : boolean,
	 *	   playText : string,
	 *	   pauseText : string,
	 *	   current : object,
	 *	   total : object,
	 *	   customState : function
	 * }
	 * @return {object}
	 */
	$.fn.slick = function() {
		var result = this,
			$firstThis = result.first(),
			firstThis = $firstThis[0],
			settings = arguments[0];

		//요소가 있으면서 메서드 또는 세팅일 때
		if(firstThis && settings) {
			var isString = typeof settings === 'string',
				slick = firstThis.slick || {};

			//문자가 아닐 때
			if(!isString) {
				//슬릭을 사용 중 일 때
				if(slick.unslicked) {
					$firstThis.slick('unslick');
				}

				settings = _$extend({}, settings);

				var $total = $(settings.total),
					$current = $(settings.current);

				settings.autoArrow = $(settings.autoArrow);
				settings.playArrow = $(settings.playArrow);
				settings.pauseArrow = $(settings.pauseArrow);
				settings.total = $total;
				settings.totalText = $total.text();
				settings.current = $current;
				settings.currentText = $current.text();

				//인터넷 익스플로러7, 8 브라우저를 대응하지 않을 때
				if(_isLowIE && !settings.isRunOnLowIE) {
					settings.responsive = undefined;
				}

				arguments[0] = settings;
			}

			//슬릭을 사용하면서 슬릭 해제를 요청하지 않았을 때
			if(!(slick.unslicked && settings === 'unslick')) {
				try {
					result = _slick.apply($firstThis, arguments);
				}catch(e) {
					//console.error(e);
				}
			}

			//문자가 아닐 때
			if(!isString) {
				slick = $firstThis.slick('getSlick');

				var slickOptions = slick.options || {},

					/**
					 * @name 재생
					 * @since 2018-08-02
					 */
					play = function() {
						//슬라이드 개수가 보이는 갯수 이상일 때
						if(slick.slideCount > slickOptions.slidesToShow) {
							$firstThis.slick('slickPlay');
							$(slickOptions.autoArrow).addClass('slick-pause').removeClass('slick-play').text(slickOptions.pauseText);
						}else{
							pause();
						}
					},

					/**
					 * @name 일시정지
					 * @since 2018-08-02
					 */
					pause = function() {
						$firstThis.slick('slickPause');

						$(slickOptions.autoArrow).addClass('slick-play').removeClass('slick-pause').text(slickOptions.playText);
					},

					/**
					 * @name 토글
					 * @since 2018-08-02
					 */
					toggle = function() {
						//일시정지 상태일 때
						if(slick.paused) {
							play();
						}else{
							pause();
						}
					};

				$firstThis.on('destroy.slickExtensions', function(event, slickSettings) {
					var $total = $(slickOptions.total);

					$(slickOptions.autoArrow).removeClass('slick-play slick-pause').add(slickOptions.playArrow).add(slickOptions.pauseArrow).removeClass('slick-arrow slick-hidden').removeAttr('tabindex aria-disabled').add(slick.$prevArrow).add(slick.$nextArrow).off('click.slickExtensions');
					$(slickOptions.current).text(slickOptions.currentText).add($total).removeClass('slick-text');
					$total.text(slickOptions.totalText);
					$firstThis.off('.slickExtensions');
				}).on('afterChange.slickExtensions', function(event, slickSettings, currentSlide) {
					var customState = slickOptions.customState,
						total = slick.slideCount,
						current = (slick.currentSlide || 0) + 1;

					//함수일 때
					if(typeof customState === 'function') {
						var result = customState({
							current : current,
							total : total
						});

						//객체가 아닐 때
						if(!result) {
							result = {
								current : current,
								total : total
							};
						}

						current = result.current || current;
						total = result.total || total;
					}

					$(slickOptions.current).text(current);
					$(slickOptions.total).text(total);
				}).on('reInit.slickExtensions breakpoint.slickExtensions', function(event, slickSettings) {
					var $prevArrow = $(slick.$prevArrow),
						$nextArrow = $(slick.$nextArrow),
						$autoArrow = $(slickOptions.autoArrow),
						$playArrow = $(slickOptions.playArrow),
						$pauseArrow = $(slickOptions.pauseArrow),
						$autoAndPlayAndPauseArrow = $autoArrow.add($playArrow).add($pauseArrow),
						$prevAndNextArrow = $prevArrow.add($nextArrow);

					//화살표를 사용할 때
					if(slickOptions.arrows) {
						$autoAndPlayAndPauseArrow.addClass('slick-arrow').off('click.slickExtensions');

						$autoArrow.on('click.slickExtensions', function(event) {
							toggle();

							event.preventDefault();
						});

						$playArrow.on('click.slickExtensions', function(event) {
							play();

							event.preventDefault();
						});

						$pauseArrow.on('click.slickExtensions', function(event) {
							pause();

							event.preventDefault();
						});

						$prevAndNextArrow.off('click.slickExtensions');

						$prevAndNextArrow.css('display', '').off('click.slick').on('click.slickExtensions', function(event) {
							//네비게이션을 눌렀을 때 멈춤 여부
							if(slickOptions.pauseOnArrowClick === true) {
								pause();
							}
						});

						$(slickOptions.current).add(slickOptions.total).addClass('slick-text');

						$prevArrow.on('click.slickExtensions', function(event) {
							$firstThis.slick('slickPrev');

							event.preventDefault();
						});

						$nextArrow.on('click.slickExtensions', function(event) {
							$firstThis.slick('slickNext');

							event.preventDefault();
						});
					}else{
						$autoAndPlayAndPauseArrow.addClass('slick-hidden').attr({
							tabindex : -1,
							'aria-disabled' : true
						});
					}

					$(slick.$dots).css('display', '').children('li').off('click.slickExtensions').on('click.slickExtensions', function(event) {
						//도트를 사용하고 도트를 눌렀을 때 멈춤 여부
						if(slickOptions.dots === true && slickOptions.pauseOnDotsClick === true) {
							pause();
						}
					});

					$(slick.$slides).off('click.slickExtensions').on('click.slickExtensions', function(event) {
						//포커스 했을 때 선택을 사용할 때
						if(slickOptions.focusOnSelect === true) {
							pause();
						}
					});

					$firstThis.triggerHandler('afterChange.slickExtensions');
				}).on('swipe.slickExtensions', function(event, slickSettings, direction) {
					//스와이프 했을 때 멈춤 여부
					if(slickOptions.pauseOnSwipe === true) {
						pause();
					}
				}).on('keydown.slickExtensions', function(event) {
					//방향키를 눌렀을 때 멈춤 여부
					if(slickOptions.pauseOnDirectionKeyPush === true) {
						var tagName = this.tagName,
							keyCode = event.which || event.keyCode;

						//접근성을 사용하면서 textarea, input, select가 아니면서 ← 또는 →를 눌렀을 때
						if(slickOptions.accessibility === true && (tagName !== 'TEXTAREA' && tagName !== 'INPUT' && tagName !== 'SELECT') && (keyCode === 37 || keyCode === 39)) {
							pause();
						}
					}
				}).triggerHandler('reInit.slickExtensions');

				//자동 재생을 허용했을 때
				if(settings.autoplay === true) {
					play();
				}else{
					pause();
				}
			}
		}

		return result;
	};
})(jQuery);