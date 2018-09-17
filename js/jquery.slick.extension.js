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
						}
					}
				}

				return result;
			}

			/**
			 * @name slickExtension
			 * @since 2018-08-02
			 * @param {object} option {lowIE : boolean, autoArrow : element || jQueryElement, playArrow : element || jQueryElement, pauseArrow : element || jQueryElement, pauseOnArrowClick : boolean, pauseOnDirectionKeyPush : boolean, pauseOnSwipe : boolean, playText : string, pauseText : string, current : element || jQueryElement, total : element || jQueryElement, customState : function}
			 * @return {jqueryElement}
			 */
			$.fn.slick = function(option) {
				var $thisFirst = this.first(),
					optionType = _getType(option);

				//슬릭이 있으면서 요소이면서 매개변수가 셋팅하거나 메소드거나 아무것도 없을때
				if(_isSlick && _isElement($thisFirst) && (optionType === 'object' || optionType === 'string' || optionType === 'undefined')) {
					//슬릭을 사용하면서 메소드가 아닐때
					if($thisFirst.hasClass('slick-initialized') && optionType !== 'string') {
						$thisFirst.slick('unslick');
					}

					//객체일때
					if(optionType === 'object') {
						option.$autoArrow = $(option.autoArrow);
						option.$playArrow = $(option.playArrow);
						option.$pauseArrow = $(option.pauseArrow);
						option.$prevArrow = $(option.prevArrow);
						option.$nextArrow = $(option.nextArrow);
						option.$total = $(option.total);
						option.$current = $(option.current);

						//ie6, 7, 8 브라우저를 대응하지 않을때
						if(_isLowIE && !option.lowIE) {
							delete option.responsive;
						}

						//문자가 아닐때
						if(!option.playText) {
							option.playText = 'play';
						}

						//문자가 아닐때
						if(!option.pauseText) {
							option.pauseText = 'pause';
						}

						/**
						 * @name 일시정지
						 * @since 2018-08-02
						 */
						function play(event) {
							$thisFirst.slick('slickPlay');
							option.$autoArrow.removeClass('active').text(option.pauseText);
						}

						/**
						 * @name 일시정지
						 * @since 2018-08-02
						 */
						function pause(event, slick, direction) {
							$thisFirst.slick('slickPause');
							option.$autoArrow.addClass('active').text(option.playText);
						}

						//파괴되었을때
						$thisFirst.on('destroy.slickExtension', function(event, slick) {
							option.$autoArrow.add(option.$playArrow).add(option.$pauseArrow).add(option.$prevArrow).add(option.$nextArrow).off('click.slickExtension');

							//방향키를 눌렀을때 멈춤여부
							if(option.pauseOnDirectionKeyPush === true) {
								$thisFirst.off('keydown.slickExtension');
							}
						
						//셋팅되었을때, 슬라이드가 넘어갔을때
						}).on('init.slickExtension beforeChange.slickExtension', function(event, slick, currentSlide, nextSlide) {
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

							option.$current.text(current);
							option.$total.text(total);
						});
						
						//스와이프 했을때 멈춤여부
						if(option.pauseOnSwipe === true) {
							$thisFirst.on('swipe.slickExtension', pause);
						}
					}

					//슬릭적용
					_slick.call($thisFirst, option);

					//객체일때
					if(optionType === 'object') {
						//이벤트제거
						option.$prevArrow.off('click.slick');
						option.$nextArrow.off('click.slick');

						//일시정지 상태일때
						if($thisFirst[0].slick.paused) {
							pause();
						}else{
							play();
						}

						//자동버튼
						option.$autoArrow.on('click.slickExtension', function(event) {
							//일시정지 상태일때
							if($thisFirst[0].slick.paused) {
								play.call(this, event);
							}else{
								pause.call(this, event);
							}

							event.preventDefault();
						});
						
						//재생버튼
						option.$playArrow.on('click.slickExtension', function(event) {
							play.call(this, event);
							event.preventDefault();
						});
						
						//일시정지 버튼
						option.$pauseArrow.on('click.slickExtension', function(event) {
							pause.call(this, event);
							event.preventDefault();
						});
						
						//이전 버튼
						option.$prevArrow.on('click.slickExtension', function(event) {
							$thisFirst.slick('slickPrev');
							event.preventDefault();
						});
						
						//다음 버튼
						option.$nextArrow.on('click.slickExtension', function(event) {
							$thisFirst.slick('slickNext');
							event.preventDefault();
						});
							
						//네비게이션을 눌렀을때 멈춤여부
						if(option.pauseOnArrowClick === true) {
							//이전, 재생버튼
							option.$prevArrow.add(option.$nextArrow).on('click.slickExtension', pause);
						}
						
						//방향키를 눌렀을때 멈춤여부
						if(option.pauseOnDirectionKeyPush === true) {
							$thisFirst.on('keydown.slickExtension', function(event) {
								var tagName = this.tagName.toLowerCase(),
									keyCode = event.keyCode || event.which;
								
								//접근성을 사용하면서 textarea, input, select가 아니면서 ← 또는 →를 눌렀을때
								if(option.accessibility === true && (tagName !== 'textarea' && tagName !== 'input' && tagName !== 'select') && (keyCode === 37 || keyCode === 39)) {
									pause.call(this, event);
								}
							});
						}
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