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
				_isLowIE = _userAgent.indexOf('msie 6.0') > -1 || _userAgent.indexOf('msie 7.0') > -1 || _userAgent.indexOf('msie 8.0') > -1;

			/**
			 * @name 형태 얻기
			 * @since 2017-12-06
			 * @param {*} value
			 * @return {string || undefined}
			 */
			function _getType(value) {
				var result;
				
				//매개변수가 있을 때
				if(arguments.length) {
					//null일때
					if(value === null) {
						result = 'null';
					
					//undefined일 때
					}else if(value === undefined) {
						result = 'undefined';
					}else{
						result = Object.prototype.toString.call(value).toLowerCase().replace('[object ', '').replace(']', '');
						
						//Invalid Date일 때
						if(result === 'date' && isNaN(new Date(value))) {
							result = 'Invalid Date';
						
						//숫자일 때
						}else if(result === 'number') {
							//NaN일 때
							if(isNaN(value)) {
								result = 'NaN';
							
							//Infinity일 때
							}else if(!isFinite(value)) {
								result = value.toString();
							}
						
						//콘솔일 때
						}else if(result === 'console') {
							result = 'object';
						
						//요소일 때
						}else if(result.indexOf('element') > -1) {
							result = 'element';
						
						//문서일 때
						}else if(result.indexOf('document') > -1) {
							result = 'document';
						}
					}
				}

				return result;
			}

			/**
			 * @name 요소 확인
			 * @since 2017-12-06
			 * @param {object} options element || jQueryElement || {element : element || window || document || jQueryElement || array, isInPage : boolean, isIncludeWindow : boolean, isIncludeDocument : boolean, isMatch : boolean}
			 * @return {boolean}
			 */
			function _isElement(options) {
				var optionsType = _getType(options),
					result = false;

				//요소이거나 배열이거나 객체일 때
				if(optionsType === 'element' || optionsType === 'array' || optionsType === 'object') {
					var element = options.element || options,
						elementType = _getType(element);

					//window 또는 document 또는 요소일 때
					if(elementType === 'window' || elementType === 'document' || elementType === 'element') {
						element = [element];
						elementType = 'array';
					}
					
					//배열 또는 객체일 때
					if(elementType === 'array' || elementType === 'object') {
						var elementLength = element.length;
						
						//요소 갯수가 있을 때
						if(elementLength) {
							var checkedElement = [],
								isIncludeWindow = options.isIncludeWindow === true,
								isIncludeDocument = options.isIncludeDocument === true,
								isInPage = options.isInPage === true,
								html = document.documentElement;

							for(var i = 0; i < elementLength; i++) {
								var elementI = element[i],
									elementIType = _getType(elementI),
									isElementI = elementIType === 'element',
									isElement = false;

								//요소이거나 window이면서 window를 포함시키는 옵션을 허용했거나 document이면서 document를 포함시키는 옵션을 허용했을 때
								if(isElementI || (elementIType === 'window' && isIncludeWindow) || (elementIType === 'document' && isIncludeDocument)) {
									//요소이면서 페이지안에 존재 여부를 허용했을 때
									if(isElementI && isInPage) {
										isElement = html.contains(elementI);
									}else{
										isElement = true;
									}
								}

								//요소일때
								if(isElement) {
									checkedElement.push(elementI);
								}
							}

							var checkedElementLength = checkedElement.length;
							
							//결과가 있을 때
							if(checkedElementLength) {
								//일치를 허용했을 때
								if(options.isMatch === true) {
									//요소갯수와 결과갯수가 같을 때
									if(elementLength === checkedElementLength) {
										result = true;
									}
								}else{
									result = true;
								}
							}
						}
					}
				}

				return result;
			}

			/**
			 * @name 자료형 복사
			 * @since 2017-12-06
			 * @param {*} value
			 * @return {*}
			 */
			function _copyType(value) {
				var valueType = _getType(value),
					result = {};

				//객체일 때
				if(valueType === 'object') {
					for(var i in value) {
						if(value.hasOwnProperty(i)) {
							result[i] = _copyType(value[i]);
						}
					}

				//배열일 때
				}else if(valueType === 'array') {
					result = value.slice();
				}else{
					result = value;
				}

				return result;
			}

			/**
			 * @name slickExtensions
			 * @since 2018-08-02
			 * @param {object} options {lowIE : boolean, autoArrow : element || jQueryElement, playArrow : element || jQueryElement, pauseArrow : element || jQueryElement, pauseOnArrowClick : boolean, pauseOnDotsClick : boolean, pauseOnDirectionKeyPush : boolean, pauseOnSwipe : boolean, playText : string, pauseText : string, current : element || jQueryElement, total : element || jQueryElement, customState : function}
			 * @return {jqueryElement}
			 */
			$.fn.slick = function(options) {
				var result = this,
					$thisFirst = result.first(),
					thisFirst = $thisFirst[0],
					settings = _copyType(options),
					settingsType = _getType(settings),
					isObject = settingsType === 'object',
					isString = settingsType === 'string';

				//슬릭이 있으면서 요소이면서 매개변수가 세팅 요청이거나 메서도 요청일 때
				if(_isSlick && _isElement(thisFirst) && (isObject || isString)) {
					var slick = thisFirst.slick;

					//슬릭을 사용하면서 메서드가 아닐 때
					if(slick && !isString) {
						$thisFirst.slick('unslick');
					}

					//객체일 때
					if(isObject) {
						var slickOptions;
						
						//요소 정의
						settings.$prevArrow = $(settings.prevArrow);
						settings.$nextArrow = $(settings.nextArrow);
						settings.$autoArrow = $(settings.autoArrow);
						settings.$playArrow = $(settings.playArrow);
						settings.$pauseArrow = $(settings.pauseArrow);
						settings.$total = $(settings.total);
						settings.$current = $(settings.current);

						//ie6, 7, 8 브라우저를 대응하지 않을 때
						if(_isLowIE && !settings.lowIE) {
							delete settings.responsive;
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
						
						//슬라이드 개수 보다 지정 슬라이드 값이 클 때
						if(settings.initialSlide > $thisFirst.children().length) {
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
							return $.extend(slick.breakpointSettings[slick.activeBreakpoint], slick.options) || {};
						}

						//파괴되었을 때
						$thisFirst.on('destroy.slickExtensions', function(event, slick) {
							settings.$autoArrow.add(settings.$playArrow).add(settings.$pauseArrow).add(settings.$prevArrow).add(settings.$nextArrow).off('click.slickExtensions');
							settings.$current.add(settings.$total).text('');
							$thisFirst.off('keydown.slickExtensions');

						//셋팅되었을 때, 슬라이드가 넘어갔을 때
						}).on('init.slickExtensions reInit.slickExtensions beforeChange.slickExtensions', function(event, s, currentSlide, nextSlide) {
							//슬릭이 없을 때
							if(!s) {
								s = slick;
							}

							var current = s.currentSlide + 1,
								total = s.slideCount;
							
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
								if(_getType(customState) !== 'object') {
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
						}).on('breakpoint.slickExtensions', function(event, slick, breakpoint) {
							//갱신
							slickOptions = getSlickOptions();
						}).on('swipe.slickExtensions', function(event, slick, direction) {
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
					if(isObject) {
						//슬릭 적용 후 갱신
						slick = thisFirst.slick;

						//분기 이벤트 최초 실행
						$thisFirst.triggerHandler('breakpoint.slickExtensions');

						//도트 기입
						settings.$dots = slick.$dots || $();

						//이벤트 제거
						settings.$prevArrow.off('click.slick');
						settings.$nextArrow.off('click.slick');
						
						//display 속성 제거
						settings.$prevArrow.css('display', '');
						settings.$nextArrow.css('display', '');
						settings.$dots.css('display', '');

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