/**
 * @author JungHyunKwon
 * @version 1.0.0
 */
try {
	'use strict';

	(function($) {
		//제이쿼리가 함수일 때
		if(typeof $ === 'function') {
			var _slick = $.fn.slick,
				_hasSlick = typeof _slick === 'function',
				_userAgent = navigator.userAgent.toLowerCase(),
				_isLowIE = _userAgent.indexOf('msie 7.0') > -1 || _userAgent.indexOf('msie 8.0') > -1;

			/**
			 * @name slickExtensions
			 * @since 2018-08-02
			 * @param {
			 *	   isRunOnLowIE : boolean,
			 *	   autoArrow : element || jQueryElement,
			 *	   playArrow : element || jQueryElement,
			 *	   pauseArrow : element || jQueryElement,
			 *	   pauseOnArrowClick : boolean,
			 *	   pauseOnDotsClick : boolean,
			 *	   pauseOnDirectionKeyPush : boolean,
			 *	   pauseOnSwipe : boolean,
			 *	   playText : string,
			 *	   pauseText : string,
			 *	   current : element || jQueryElement,
			 *	   total : element || jQueryElement,
			 *	   customState : function
			 * }
			 * @return {object || jQuery}
			 */
			$.fn.slick = function() {
				var result = this,
					$thisFirst = result.first(),
					thisFirst = $thisFirst[0],
					settings = arguments[0];

				//슬릭이 있으면서 요소가 있으면서 메서드 또는 세팅 요청일 때
				if(_hasSlick && thisFirst && settings) {
					var settingsIsString = typeof settings === 'string';

					//객체일 때
					if(!settingsIsString) {
						var slick = thisFirst.slick;

						//슬릭을 사용 중 일 때
						if(slick) {
							$thisFirst.slick('unslick');
						}

						//객체 생성
						settings = $.extend({}, settings);
						
						//속성 정의
						settings.autoArrow = $(settings.autoArrow);
						settings.playArrow = $(settings.playArrow);
						settings.pauseArrow = $(settings.pauseArrow);
						settings.total = $(settings.total);
						settings.totalText = settings.total.text();
						settings.current = $(settings.current);
						settings.currentText = settings.current.text();

						//ie7, 8 브라우저를 대응하지 않을 때
						if(_isLowIE && !settings.isRunOnLowIE) {
							settings._responsive = settings.responsive;
							settings.responsive = undefined;
						}

						//셋팅 변경
						arguments[0] = settings;
					}

					//슬릭 적용
					try {
						result = _slick.apply($thisFirst, arguments);
					}catch(e) {
						//throw e;
					}

					//객체일 때
					if(!settingsIsString) {
						//슬릭 적용 후 갱신
						slick = $thisFirst.slick('getSlick');

						var slickOptions = slick.options || {};

						/**
						 * @name 재생
						 * @since 2018-08-02
						 */
						function play() {
							//슬라이드 개수가 보이는 갯수 이상일 때
							if(slick.slideCount > slickOptions.slidesToShow) {
								$thisFirst.slick('slickPlay');
								$(slickOptions.autoArrow).addClass('slick-pause').removeClass('slick-play').text(slickOptions.pauseText);
							}else{
								pause();
							}
						}

						/**
						 * @name 일시정지
						 * @since 2018-08-02
						 */
						function pause() {
							$thisFirst.slick('slickPause');
							$(slickOptions.autoArrow).addClass('slick-play').removeClass('slick-pause').text(slickOptions.playText);
						}
						
						/**
						 * @name 토글
						 * @since 2018-08-02
						 */
						function toggle() {
							//일시정지 상태일 때
							if(slick.paused) {
								play();
							}else{
								pause();
							}
						}

						//파괴되었을 때
						$thisFirst.on('destroy.slickExtensions', function(event, slk) {
							var $total = $(slickOptions.total);
							
							$(slickOptions.autoArrow).removeClass('slick-play slick-pause').add(slickOptions.playArrow).add(slickOptions.pauseArrow).removeClass('slick-arrow slick-hidden').removeAttr('tabindex aria-disabled').add(slick.$prevArrow).add(slick.$nextArrow).off('click.slickExtensions');
							$(slickOptions.current).text(slickOptions.currentText).add($total).removeClass('slick-text');
							$total.text(slickOptions.totalText);
							$thisFirst.off('afterChange.slickExtensions breakpoint.slickExtensions destroy.slickExtensions reInit.slickExtensions swipe.slickExtensions keydown.slickExtensions');

						//슬라이드가 넘어갔을 때
						}).on('afterChange.slickExtensions', function(event, slk, currentSlide) {
							var customState = slickOptions.customState,
								total = Math.ceil(slick.slideCount / slickOptions.slidesToShow) || slick.slideCount,
								current = slick.currentSlide + 1;

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

						//셋팅이 변경되었을 때, 분기가 변경되었을 때
						}).on('reInit.slickExtensions breakpoint.slickExtensions', function(event, slk) {
							var $prevArrow = $(slick.$prevArrow),
								$nextArrow = $(slick.$nextArrow),
								$autoArrow = $(slickOptions.autoArrow),
								$playArrow = $(slickOptions.playArrow),
								$pauseArrow = $(slickOptions.pauseArrow),
								$autoAndPlayAndPauseArrow = $autoArrow.add($playArrow).add($pauseArrow),
								$prevAndNextArrow = $prevArrow.add($nextArrow),
								$arrow = $autoAndPlayAndPauseArrow.add($prevAndNextArrow);

							//클래스가 있을 때
							if($prevArrow.hasClass('slick-hidden')) {
								$autoAndPlayAndPauseArrow.addClass('slick-hidden').attr({
									tabindex : -1,
									'aria-disabled' : true,
								})
							}
							
							//초기화
							$arrow.off('click.slickExtensions');
							$autoAndPlayAndPauseArrow.addClass('slick-arrow').off('click.slickExtensions');
							
							//자동 버튼
							$autoArrow.on('click.slickExtensions', function(event) {
								toggle();
								event.preventDefault();
							});
							
							//재생 버튼
							$playArrow.on('click.slickExtensions', function(event) {
								play();
								event.preventDefault();
							});
							
							//일시정지 버튼
							$pauseArrow.on('click.slickExtensions', function(event) {
								pause();
								event.preventDefault();
							});
							
							//이전, 재생 버튼
							$prevAndNextArrow.css('display', '').off('click.slick').on('click.slickExtensions', function(event) {
								//네비게이션을 눌렀을 때 멈춤 여부
								if(slickOptions.pauseOnArrowClick === true) {
									pause();
								}
							});
							
							//현재, 합계 요소 클래스 추가
							$(slickOptions.current).add(slickOptions.total).addClass('slick-text');

							//이전 버튼
							$prevArrow.on('click.slickExtensions', function(event) {
								$thisFirst.slick('slickPrev');
								event.preventDefault();
							});
							
							//다음 버튼
							$nextArrow.on('click.slickExtensions', function(event) {
								$thisFirst.slick('slickNext');
								event.preventDefault();
							});

							//도트 아이템을 사용할 때
							if(slickOptions.dots === true) {
								$(slick.$dots).css('display', '').children('li').off('click.slickExtensions').on('click.slickExtensions', function(event) {
									//도트를 사용하고 도트를 눌렀을 때 멈춤 여부
									if(slickOptions.dots === true && slickOptions.pauseOnDotsClick === true) {
										pause();
									}
								});
							}

							$thisFirst.triggerHandler('afterChange.slickExtensions');
						}).on('swipe.slickExtensions', function(event, slk, direction) {
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
		}else{
			throw '제이쿼리가 없습니다.';
		}
	})(window.jQuery);
}catch(error) {
	console.error(error);
}