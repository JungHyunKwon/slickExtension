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
				_isSlick = typeof _slick === 'function',
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
					settings = arguments[0],
					isString = typeof settings === 'string';
				
				//객체일 때
				if(!isString) {
					settings = $.extend({}, settings);
				}

				//슬릭이 있으면서 요소가 있으면서 메서드 또는 세팅 요청일 때
				if(_isSlick && thisFirst) {
					//객체일 때
					if(!isString) {
						var slick = thisFirst.slick,
							slickOptions = {};
						
						//슬릭을 사용 중 일 때
						if(slick) {
							$thisFirst.slick('unslick');
						}

						//요소 정의
						settings.$prevArrow = $(settings.prevArrow);
						settings.$nextArrow = $(settings.nextArrow);
						settings.$autoArrow = $(settings.autoArrow);
						settings.$playArrow = $(settings.playArrow);
						settings.$pauseArrow = $(settings.pauseArrow);
						settings.$total = $(settings.total);
						settings.totalText = settings.$total.text();
						settings.$current = $(settings.current);
						settings.currentText = settings.$current.text();

						//ie6, 7, 8 브라우저를 대응하지 않을 때
						if(_isLowIE && !settings.isRunOnLowIE) {
							settings.responsive = undefined;
						}

						//문자가 아닐 때
						if(typeof settings.playText !== 'string') {
							settings.playText = 'play';
						}

						//문자가 아닐 때
						if(typeof settings.pauseText !== 'string') {
							settings.pauseText = 'pause';
						}

						settings.initialSlide = parseInt(settings.initialSlide, 10) || 0;
						
						settings.slideCount = $thisFirst.children().length;

						//슬라이드 개수 보다 지정 슬라이드 값이 클 때
						if(settings.initialSlide > settings.slideCount) {
							settings.initialSlide = 0;
						}
						
						//셋팅 변경
						arguments[0] = settings;

						/**
						 * @name 재생
						 * @since 2018-08-02
						 */
						function play() {
							//슬라이드 개수가 2개 이상일 때
							if(slick.slideCount > 1) {
								$thisFirst.slick('slickPlay');
								settings.$autoArrow.addClass('pause').removeClass('play').text(settings.pauseText);
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
							settings.$autoArrow.addClass('play').removeClass('pause').text(settings.playText);
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
							return $.extend(slick.options, slick.breakpointSettings[slick.activeBreakpoint]) || {};
						}

						//파괴되었을 때
						$thisFirst.on('destroy.slickExtensions', function(event, _slick) {
							settings.$autoArrow.add(settings.$playArrow).add(settings.$pauseArrow).add(settings.$prevArrow).add(settings.$nextArrow).off('click.slickExtensions');
							settings.$current.text(settings.currentText);
							settings.$total.text(settings.totalText);
							$thisFirst.off('keydown.slickExtensions');

						//셋팅되었을 때, 슬라이드가 넘어갔을 때
						}).on('init.slickExtensions reInit.slickExtensions beforeChange.slickExtensions', function(event, _slick, currentSlide, nextSlide) {
							//슬릭이 없을 때
							if(!_slick) {
								_slick = slick || {
									currentSlide : 0,
									slideCount : settings.slideCount
								};
							}
							
							//현재 슬라이드가 없을 때
							if(currentSlide === undefined) {
								currentSlide = _slick.currentSlide;
							}
							
							//다음 슬라이드가 없을 때
							if(nextSlide === undefined) {
								nextSlide = 0;
							}

							var current = currentSlide + 1,
								total = _slick.slideCount;
							
							//이벤트가 beforeChange일 때
							if(event.type === 'beforeChange') {
								current = nextSlide + 1;
							}

							//함수일 때
							if(typeof settings.customState === 'function') {
								var customState = settings.customState({
									current : current,
									total : total
								});

								//객체가 아닐 때
								if(!customState) {
									customState = {
										current : current,
										total : total
									};
								}

								current = customState.current || current;
								total = customState.total || total;
							}

							settings.$current.text(current);
							settings.$total.text(total);
						}).on('breakpoint.slickExtensions', function(event, _slick, breakpoint) {
							//갱신
							slickOptions = getSlickOptions();
						}).on('swipe.slickExtensions', function(event, _slick, direction) {
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
						slick = thisFirst.slick;

						//분기 이벤트 최초 실행
						$thisFirst.triggerHandler('breakpoint.slickExtensions');

						//도트 기입
						settings.$dots = slick.$dots || $();

						//이벤트 제거
						settings.$prevArrow.off('click.slick');
						settings.$nextArrow.off('click.slick');
						
						//display 초기화
						settings.$dots.css('display', '');
						settings.$prevArrow.css('display', '');
						settings.$nextArrow.css('display', '');

						//자동 재생을 허용했을 때
						if(settings.autoplay === true) {
							play();
						}else{
							pause();
						}

						//자동 버튼
						settings.$autoArrow.on('click.slickExtensions', function(event) {
							toggle();
							event.preventDefault();
						});
						
						//재생 버튼
						settings.$playArrow.on('click.slickExtensions', function(event) {
							play();
							event.preventDefault();
						});
						
						//일시정지 버튼
						settings.$pauseArrow.on('click.slickExtensions', function(event) {
							pause();
							event.preventDefault();
						});
						
						//이전 버튼
						settings.$prevArrow.on('click.slickExtensions', function(event) {
							$thisFirst.slick('slickPrev');
							event.preventDefault();
						});
						
						//다음 버튼
						settings.$nextArrow.on('click.slickExtensions', function(event) {
							$thisFirst.slick('slickNext');
							event.preventDefault();
						});

						//이전, 재생 버튼
						settings.$prevArrow.add(settings.$nextArrow).on('click.slickExtensions', function(event) {
							//네비게이션을 눌렀을 때 멈춤 여부
							if(slickOptions.pauseOnArrowClick === true) {
								pause();
							}
						});

						//도트 아이템
						settings.$dots.children('li').on('click.slickExtensions', function(event) {
							//도트를 사용하고 도트를 눌렀을 때 멈춤 여부
							if(slickOptions.dots === true && slickOptions.pauseOnDotsClick === true) {
								pause();
							}
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