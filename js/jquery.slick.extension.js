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
			 * @param {object} option {lowIE : boolean, autoArrow : element || jQueryElement, playArrow : element || jQueryElement, pauseArrow : element || jQueryElement, pauseOnArrowClick : boolean, play : string, pause : string, current : element || jQueryElement, total : element || jQueryElement, customState : function}
			 * @return {jqueryElement}
			 */
			$.fn.slick = function(option) {
				var isObject = _getType(option) === 'object',
					isString = typeof option === 'string';

				return this.each(function(index, element) {
					var $element = $(element);

					//요소이면서 매개변수가 객체거나 문자거나 없을때
					if(_isElement($element) && (isObject || isString || typeof option === 'undefined')) {
						//슬릭을 사용하면서 매개변수가 문자가 아닐때
						if($element.hasClass('slick-initialized') && !isString) {
							$element.slick('unslick');
						}

						//슬릭이 함수일때
						if(typeof _slick === 'function') {
							//ie6, 7, 8 브라우저이면서 객체이면서 option.lowIE가 거짓일때
							if(_isLowIE && isObject && !option.lowIE) {
								delete option.responsive;
							}
							
							//객체일때
							if(isObject) {
								option.$total = $(option.total);
								option.$current = $(option.current);

								//셋팅되었을때, 슬라이드가 넘어갔을때
								$element.on('init.slickExtension beforeChange.slickExtension', function(event, slick, currentSlide, nextSlide) {
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
							}

							//슬릭적용
							_slick.call($element, option);

							//객체일때
							if(isObject) {
								//자동버튼, 재생버튼, 정지버튼, 이전버튼, 다음버튼 요소정의
								option.$autoArrow = $(option.autoArrow);
								option.$playArrow = $(option.playArrow);
								option.$pauseArrow = $(option.pauseArrow);
								option.$prevArrow = $(option.prevArrow);
								option.$nextArrow = $(option.nextArrow);

								//문자가 아닐때
								if(typeof option.play !== 'string') {
									option.play = '';
								}

								//문자가 아닐때
								if(typeof option.pause !== 'string') {
									option.pause = '';
								}

								//일시정지 상태일때
								if($element[0].slick.paused) {
									$element.slick('slickPause');
									option.$autoArrow.addClass('active').text(option.play);
								}else{
									$element.slick('slickPlay');
									option.$autoArrow.removeClass('active').text(option.pause);
								}

								//자동버튼
								option.$autoArrow.off('click.slickExtension').on('click.slickExtension', function(event) {
									var $this = $(this);

									//일시정지 상태일때
									if($element[0].slick.paused) {
										$element.slick('slickPlay');
										$this.removeClass('active').text(option.pause);
									}else{
										$element.slick('slickPause');
										$this.addClass('active').text(option.play);
									}

									event.preventDefault();
								});
								
								//재생버튼
								option.$playArrow.off('click.slickExtension').on('click.slickExtension', function(event) {
									option.$autoArrow.removeClass('active').text(option.pause);
									$element.slick('slickPlay');
									event.preventDefault();
								});
								
								//일시정지 버튼
								option.$pauseArrow.off('click.slickExtension').on('click.slickExtension', function(event) {
									option.$autoArrow.addClass('active').text(option.play);
									$element.slick('slickPause');
									event.preventDefault();
								});
								
								//option.pauseOnArrowClick이 참일때
								if(option.pauseOnArrowClick) {
									//이전, 재생버튼
									option.$prevArrow.add(option.$nextArrow).off('click.slickExtension').on('click.slickExtension', function(event) {
										$element.slick('slickPause');
										option.$autoArrow.addClass('active').text(option.play);
									});
								}

								//파괴되었을때
								$element.on('destroy.slickExtension', function(event, slick) {
									option.$autoArrow.add(option.$playArrow).add(option.$pauseArrow).add(option.$prevArrow).add(option.$nextArrow).off('click.slickExtension');
								});
							}
						}
					}
				});
			};
		}else{
			throw '제이쿼리가 없습니다.';
		}
	})(window.jQuery);
}catch(error) {
	console.error(error);
}