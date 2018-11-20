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
					var isString = typeof settings === 'string';

					//객체일 때
					if(!isString) {
						//객체 생성
						settings = $.extend({}, settings);

						var slick = thisFirst.slick,
							slickOptions = {},
							jQueryObject = $(),
							$autoArrow = $(settings.autoArrow),
							$playArrow = $(settings.playArrow),
							$pauseArrow = $(settings.pauseArrow),
							$total = $(settings.total),
							$current = $(settings.current),
							totalText = $total.text(),
							currentText = $current.text(),
							playText = settings.playText,
							pauseText = settings.pauseText,
							initialSlide = parseInt(settings.initialSlide, 10) || 0,
							customState = settings.customState,
							customStateIsFunction = typeof customState === 'function';

						//슬릭을 사용 중 일 때
						if(slick) {
							$thisFirst.slick('unslick');
						}

						//ie6, 7, 8 브라우저를 대응하지 않을 때
						if(_isLowIE && !settings.isRunOnLowIE) {
							settings.responsive = undefined;
						}
	
						//문자가 아닐 때
						if(typeof playText !== 'string') {
							playText = 'play';
						}

						//문자가 아닐 때
						if(typeof pauseText !== 'string') {
							pauseText = 'pause';
						}

						//슬라이드 개수 보다 지정 슬라이드 값이 클 때
						if(initialSlide > $thisFirst.children().length) {
							initialSlide = 0;
						}
						
						//초기 슬라이드 값 기입
						settings.initialSlide = initialSlide;

						/**
						 * @name 재생
						 * @since 2018-08-02
						 */
						function play() {
							//슬라이드 개수가 2개 이상일 때
							if(slick.slideCount > 1) {
								$thisFirst.slick('slickPlay');
								$autoArrow.addClass('pause').removeClass('play').text(pauseText);
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
							$autoArrow.addClass('play').removeClass('pause').text(playText);
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
						
						/**
						 * @name 슬릭 옵션 얻기
						 * @since 2018-08-02
						 */
						function getSlickOptions() {
							return $.extend(slick.options, (slick.breakpointSettings || {})[slick.activeBreakpoint]) || {};
						}

						//파괴되었을 때
						$thisFirst.on('destroy.slickExtensions', function(event, slk) {
							var $nextArrow = slick.$nextArrow || jQueryObject,
								$prevArrow = slick.$prevArrow || jQueryObject;

							$autoArrow.add($playArrow).add($pauseArrow).add($prevArrow).add($nextArrow).off('click.slickExtensions');
							$current.text(currentText);
							$total.text(totalText);
							$thisFirst.off('keydown.slickExtensions');

						//셋팅되었을 때, 셋팅이 변경되었을 때
						}).on('init.slickExtensions reInit.slickExtensions', function(event, slk) {
							var $nextArrow = slick.$nextArrow || jQueryObject,
								$prevArrow = slick.$prevArrow || jQueryObject;

							//이전, 재생 버튼
							$prevArrow.add($nextArrow).css('display', '').off('click.slick click.slickExtensions').on('click.slickExtensions', function(event) {
								//네비게이션을 눌렀을 때 멈춤 여부
								if(slickOptions.pauseOnArrowClick === true) {
									pause();
								}
							});

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
								slick.$dots.css('display', '').children('li').off('click.slickExtensions').on('click.slickExtensions', function(event) {
									//도트를 사용하고 도트를 눌렀을 때 멈춤 여부
									if(slickOptions.dots === true && slickOptions.pauseOnDotsClick === true) {
										pause();
									}
								});
							}

						//셋팅되었을 때, 셋팅이 변경되었을 때, 슬라이드가 넘어갔을 때
						}).on('init.slickExtensions reInit.slickExtensions beforeChange.slickExtensions', function(event, slk, currentSlide, nextSlide) {
							//현재 슬라이드가 없을 때
							if(currentSlide === undefined) {
								currentSlide = slick.currentSlide || 0;
							}
							
							//다음 슬라이드가 없을 때
							if(nextSlide === undefined) {
								nextSlide = 0;
							}

							var current = currentSlide + 1,
								total = slick.slideCount || 0;
							
							//이벤트가 beforeChange일 때
							if(event.type === 'beforeChange') {
								current = nextSlide + 1;
							}

							//함수일 때
							if(customStateIsFunction) {
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

							$current.text(current);
							$total.text(total);
						}).on('breakpoint.slickExtensions', function(event, slk, breakpoint) {
							//갱신
							slickOptions = getSlickOptions();
						}).on('swipe.slickExtensions', function(event, slk, direction) {
							//스와이프 했을 때 멈춤 여부
							if(slickOptions.pauseOnSwipe === true) {
								pause();
							}
						}).on('keydown.slickExtensions', function(event) {
							//방향키를 눌렀을 때 멈춤 여부
							if(slickOptions.pauseOnDirectionKeyPush === true) {
								var tagName = this.tagName.toLowerCase(),
									keyCode = event.keyCode || event.which;
								
								//접근성을 사용하면서 textarea, input, select가 아니면서 ← 또는 →를 눌렀거나 verticalSwiping 기능을 사용 중이면서 ↑ 또는 ↓를 눌렀을 때
								if(slickOptions.accessibility === true && (tagName !== 'textarea' && tagName !== 'input' && tagName !== 'select') && ((keyCode === 37 || keyCode === 39) || slickOptions.verticalSwiping && (keyCode === 38 || keyCode === 40))) {
									pause();
								}
							}
						});

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
					if(!isString) {
						//슬릭 적용 후 갱신
						slick = thisFirst.slick || {};

						//분기 이벤트 최초 실행
						$thisFirst.triggerHandler('breakpoint.slickExtensions');

						//자동 재생을 허용했을 때
						if(settings.autoplay === true) {
							play();
						}else{
							pause();
						}

						//자동 버튼
						$autoArrow.off('click.slickExtensions').on('click.slickExtensions', function(event) {
							toggle();
							event.preventDefault();
						});
						
						//재생 버튼
						$playArrow.off('click.slickExtensions').on('click.slickExtensions', function(event) {
							play();
							event.preventDefault();
						});
						
						//일시정지 버튼
						$pauseArrow.off('click.slickExtensions').on('click.slickExtensions', function(event) {
							pause();
							event.preventDefault();
						});
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