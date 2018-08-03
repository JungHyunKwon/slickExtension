/**
 * @author JungHyunKwon
 * @version 1.0.0
 */
try {
	'use strict';

	//제이쿼리가 있는지 확인
	if(typeof window.jQuery === 'function') {
		(function($) {
			var _slick = $.fn.slick,
				_userAgent = navigator.userAgent.toLowerCase(),
				_isLowIE = _userAgent.indexOf('msie 7.0') > -1 || _userAgent.indexOf('msie 8.0') > -1;

			/**
			 * @name slickExtension
			 * @since 2018-08-02
			 * @param {object} option {lowIE : boolean, autoArrow : element || jQueryElement, playArrow : element || jQueryElement, pauseArrow : element || jQueryElement, pauseAfterClick : boolean}
			 * @return {jqueryElement}
			 */
			$.fn.slick = function(option) {
				var $thisFirst = this.first(),
					isObject = option instanceof Object,
					isString = typeof option === 'string';

				//매개변수가 객체거나 문자거나 없을때
				if(isObject || isString || typeof option === 'undefined') {
					//슬릭을 사용하면서 매개변수가 문자가 아닐때
					if($thisFirst.hasClass('slick-initialized') && !isString) {
						$thisFirst.slick('unslick');
					}

					//슬릭이 함수일때
					if(typeof _slick === 'function') {
						//ie7, ie8 브라우저이면서 객체이면서 option.lowIE가 false일때
						if(_isLowIE && isObject && option.lowIE === false) {
							delete option.responsive;
						}

						//슬릭적용
						_slick.call($thisFirst, option);
					
						//객체일때
						if(isObject) {
							//자동재생버튼, 재생버튼, 정지버튼, 이전버튼, 다음버튼 정의
							option.autoArrow = $(option.autoArrow);
							option.playArrow = $(option.playArrow);
							option.pauseArrow = $(option.pauseArrow);
							option.prevArrow = $(option.prevArrow);
							option.nextArrow = $(option.nextArrow);

							option.autoArrow.off('click.slickExtension').on('click.slickExtension', function(event) {
								var $this = $(this);
								
								//활성화되어 있을때
								if($this.hasClass('active')) {
									$thisFirst.slick('slickPlay');
								}else{
									$thisFirst.slick('slickPause');
								}
								
								$this.toggleClass('active');
								event.preventDefault();
							});
							
							option.playArrow.off('click.slickExtension').on('click.slickExtension', function(event) {
								option.autoArrow.removeClass('active');
								$thisFirst.slick('slickPlay');
								event.preventDefault();
							});
							
							option.pauseArrow.off('click.slickExtension').on('click.slickExtension', function(event) {
								option.autoArrow.addClass('active');
								$thisFirst.slick('slickPause');
								event.preventDefault();
							});
							
							//option.pauseAfterClick가 true일때
							if(option.pauseAfterClick === true) {								
								option.prevArrow.add(option.nextArrow).off('click.slickExtension').on('click.slickExtension', function(event) {
									$thisFirst.slick('slickPause');
									option.autoArrow.addClass('active');
								});
							}

							//파괴되었을때
							$thisFirst.on('destroy.slickExtension', function(event, slick) {
								option.autoArrow.add(option.playArrow).add(option.pauseArrow).add(option.prevArrow).add(option.nextArrow).off('click.slickExtension');
							});
						}
					}
				}

				//요소 반환
				return this;
			};
		})(jQuery);
	}else{
		throw '제이쿼리가 없습니다.';
	}
}catch(error) {
	console.error(error);
}