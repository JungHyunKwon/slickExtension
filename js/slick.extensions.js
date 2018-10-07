/**
 * @author JungHyunKwon
 * @version 1.0.0
 */
try {
	'use strict';

	(function($) {
		//제이쿼리가 함수일때
		if(typeof $ === 'function') {
			var _slick = $.fn.slick,
				_isSlick = typeof _slick === 'function',
				_userAgent = navigator.userAgent.toLowerCase(),
				_isLowIE = _userAgent.indexOf('msie 6.0') > -1 || _userAgent.indexOf('msie 7.0') > -1 || _userAgent.indexOf('msie 8.0') > -1;

			/**
			 * @name 요소 또는 제이쿼리 요소 확인
			 * @since 2017-12-06
			 * @param {window || document || element || jQueryElement} element
			 * @return {boolean}
			 */
			function _isElement(element) {
				var result = false;

				/**
				 * @name 요소확인
				 * @since 2017-12-06
				 * @param {window || document || element} element
				 * @return {boolean}
				 */
				function isElement(element) {
					var result = false;
					
					try {
						result = document.documentElement.contains(element);
					}catch(error) {
						//console.error(error);
					}

					//window 또는 document일때
					if(element === window || element === document) {
						result = true;						
					}

					return result;
				}

				/**
				 * @name 제이쿼리 요소확인
				 * @since 2017-12-06
				 * @param {jQueryElement || jQueryObject} element
				 * @return {boolean}
				 */
				function isJQueryElement(element) {
					var result = false;

					//제이쿼리 객체일때
					if(element instanceof $) {
						var elementLength = element.length;
						
						result = [];

						for(var i = 0; i < elementLength; i++) {
							var elementI = element[i];

							if(isElement(elementI)) {
								result.push(elementI);
							}
						}

						var resultLength = result.length;

						//제이쿼리 요소일때
						if(resultLength && elementLength === resultLength) {
							result = true;
						}else{
							result = false;
						}
					}

					return result;
				}
				
				//window 또는 document 또는 요소 또는 제이쿼리 요소일때
				if(isElement(element) || isJQueryElement(element)) {
					result = true;
				}

				return result;
			}

			/**
			 * @name 형태얻기
			 * @since 2017-12-06
			 * @param {*} value
			 * @return {string || undefined}
			 */
			function _getType(value) {
				var result;
				
				//매개변수가 있을때
				if(arguments.length) {
					//null일때
					if(value === null) {
						result = 'null';
					
					//undefined일때
					}else if(value === undefined) {
						result = 'undefined';
					}else{
						result = Object.prototype.toString.call(value).toLowerCase().replace('[object ', '').replace(']', '');
						
						//Invalid Date일때
						if(result === 'date' && isNaN(new Date(value))) {
							result = 'Invalid Date';
						
						//숫자일때
						}else if(result === 'number') {
							//NaN일때
							if(isNaN(value)) {
								result = 'NaN';
							
							//Infinity일때
							}else if(!isFinite(value)) {
								result = value.toString();
							}
							
						//콘솔일때
						}else if(result === 'console') {
							result = 'object';
						
						//요소일때
						}else if(result.indexOf('element') > -1) {
							result = 'element';
						
						//문서일때
						}else if(result.indexOf('document') > -1) {
							result = 'document';
						}
					}
				}

				return result;
			}

			/**
			 * @name slickExtensions
			 * @since 2018-08-02
			 * @param {object} option {lowIE : boolean, autoArrow : element || jQueryElement, playArrow : element || jQueryElement, pauseArrow : element || jQueryElement, pauseOnArrowClick : boolean, pauseOnDotsClick : boolean, pauseOnDirectionKeyPush : boolean, pauseOnSwipe : boolean, playText : string, pauseText : string, current : element || jQueryElement, total : element || jQueryElement, customState : function}
			 * @return {jqueryElement}
			 */
			$.fn.slick = function(option) {
				var $thisFirst = this.first(),
					thisFirst = $thisFirst[0],
					optionType = _getType(option);

				//슬릭이 있으면서 요소이면서 매개변수가 셋팅하거나 메소드거나 아무것도 없을때
				if(_isSlick && _isElement($thisFirst) && (optionType === 'object' || optionType === 'string' || optionType === 'undefined')) {
					//슬릭을 사용하면서 메소드가 아닐때
					if($thisFirst.hasClass('slick-initialized') && optionType !== 'string') {
						$thisFirst.slick('unslick');
					}

					//객체일때
					if(optionType === 'object') {
						option.autoArrow = $(option.autoArrow);
						option.playArrow = $(option.playArrow);
						option.pauseArrow = $(option.pauseArrow);
						option.total = $(option.total);
						option.current = $(option.current);

						//ie6, 7, 8 브라우저를 대응하지 않을때
						if(_isLowIE && !option.lowIE) {
							delete option.responsive;
						}

						//문자가 아닐때
						if(typeof option.playText !== 'string') {
							option.playText = 'play';
						}

						//문자가 아닐때
						if(typeof option.pauseText !== 'string') {
							option.pauseText = 'pause';
						}

						/**
						 * @name 재생
						 * @since 2018-08-02
						 */
						function play() {
							//슬라이드 갯수가 2개 이상일때
							if(slick.$slides.length > 1) {
								$thisFirst.slick('slickPlay');
								option.autoArrow.removeClass('active').text(option.pauseText);
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
							option.autoArrow.addClass('active').text(option.playText);
						}
						
						/**
						 * @name 토글
						 * @since 2018-08-02
						 */
						function toggle() {
							//일시정지 상태일때
							if(slick.paused) {
								play();
							}else{
								pause();
							}
						}
						
						/**
						 * @name 옵션 얻기
						 * @since 2018-08-02
						 */
						function getOptions() {
							return $.extend(slick.breakpointSettings[slick.activeBreakpoint], slick.options) || {};
						}

						//파괴되었을때
						$thisFirst.on('destroy.slickExtensions', function(event, slick) {
							option.autoArrow.add(option.playArrow).add(option.pauseArrow).add(option.$prevArrow).add(option.$nextArrow).off('click.slickExtensions');
							$thisFirst.off('keydown.slickExtensions');
						
						//셋팅되었을때, 슬라이드가 넘어갔을때
						}).on('init.slickExtensions reInit.slickExtensions beforeChange.slickExtensions', function(event, slick, currentSlide, nextSlide) {
							var current = nextSlide,
								total = slick.slideCount;

							//다음 슬라이드가 있을때
							if(current) {
								current++;
							}else{
								//슬라이드 갯수가 있을때
								if(total) {
									current = 1;
								}else{
									current = 0;
								}
							}

							//함수일때
							if(typeof option.customState === 'function') {
								var customState = option.customState({
									current : current,
									total : total
								});

								//객체가 아닐때
								if(_getType(customState) !== 'object') {
									customState = {
										current : current,
										total : total
									};
								}

								current = customState.current || current;
								total = customState.total || total;
							}

							option.current.text(current);
							option.total.text(total);
						}).on('breakpoint.slickExtensions', function(event, slick, breakpoint) {
							//옵션갱신
							options = getOptions();
						}).on('swipe.slickExtensions', function(event, slick, direction) {
							//스와이프 했을때 멈춤여부
							if(options.pauseOnSwipe === true) {
								pause();
							}
						}).on('keydown.slickExtensions', function(event) {
							//방향키를 눌렀을때 멈춤여부
							if(options.pauseOnDirectionKeyPush === true) {
								var tagName = this.tagName.toLowerCase(),
									keyCode = event.keyCode || event.which;
								
								//접근성을 사용하면서 textarea, input, select가 아니면서 ← 또는 →를 눌렀거나 verticalSwiping기능을 사용중이면서 ↑ 또는 ↓를 눌렀을때
								if(options.accessibility === true && (tagName !== 'textarea' && tagName !== 'input' && tagName !== 'select') && ((keyCode === 37 || keyCode === 39) || options.verticalSwiping && (keyCode === 38 || keyCode === 40))) {
									pause();
								}
							}
						});
					}

					//슬릭적용
					_slick.call($thisFirst, option);

					//객체일때
					if(optionType === 'object') {
						var slick = thisFirst.slick,
							options = getOptions();

						option.$prevArrow = slick.$prevArrow || $();
						option.$nextArrow = slick.$nextArrow || $();
						option.$dots = slick.$dots || $();

						//분기 이벤트 발생
						$thisFirst.triggerHandler('breakpoint.slickExtensions');

						//이벤트제거
						option.$prevArrow.off('click.slick');
						option.$nextArrow.off('click.slick');

						//자동재생을 허용했을때
						if(option.autoplay === true) {
							play();
						}else{
							pause();
						}

						//자동버튼
						option.autoArrow.on('click.slickExtensions', function(event) {
							toggle();
							event.preventDefault();
						});
						
						//재생버튼
						option.playArrow.on('click.slickExtensions', function(event) {
							play();
							event.preventDefault();
						});
						
						//일시정지 버튼
						option.pauseArrow.on('click.slickExtensions', function(event) {
							pause();
							event.preventDefault();
						});
						
						//이전 버튼
						option.$prevArrow.on('click.slickExtensions', function(event) {
							$thisFirst.slick('slickPrev');
							event.preventDefault();
						});
						
						//다음 버튼
						option.$nextArrow.on('click.slickExtensions', function(event) {
							$thisFirst.slick('slickNext');
							event.preventDefault();
						});

						//이전, 재생버튼
						option.$prevArrow.add(option.$nextArrow).on('click.slickExtensions', function(event) {
							//네비게이션을 눌렀을때 멈춤여부
							if(options.pauseOnArrowClick === true) {
								pause();
							}
						});

						//도트 아이템
						option.$dots.children('li').on('click.slickExtensions', function(event) {
							//도트를 사용하고 도트를 눌렀을때 멈춤여부
							if(options.dots === true && options.pauseOnDotsClick === true) {
								pause();
							}
						});
					}
				}

				return $thisFirst;
			};
		}else{
			throw '제이쿼리가 없습니다.';
		}
	})(window.jQuery);
}catch(error) {
	console.error(error);
}