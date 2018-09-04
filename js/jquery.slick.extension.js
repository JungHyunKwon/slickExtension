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
				_isLowIE = _userAgent.indexOf('msie 7.0') > -1 || _userAgent.indexOf('msie 8.0') > -1;

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
			 * @param {object} option {lowIE : boolean, autoArrow : element || jQueryElement, playArrow : element || jQueryElement, pauseArrow : element || jQueryElement, pauseAfterClick : boolean, playText : string, pauseText : string}
			 * @return {jqueryElement}
			 */
			$.fn.slick = function(option) {
				var $thisFirst = this.first(),
					isObject = _getType(option) === 'object',
					isString = typeof option === 'string';

				//요소이면서 매개변수가 객체거나 문자거나 없을때
				if(_isElement($thisFirst) && (isObject || isString || typeof option === 'undefined')) {
					//슬릭을 사용하면서 매개변수가 문자가 아닐때
					if($thisFirst.hasClass('slick-initialized') && !isString) {
						$thisFirst.slick('unslick');
					}

					//슬릭이 함수일때
					if(typeof _slick === 'function') {
						//ie7, ie8 브라우저이면서 객체이면서 option.lowIE가 거짓일때
						if(_isLowIE && isObject && !option.lowIE) {
							delete option.responsive;
						}

						//슬릭적용
						_slick.call($thisFirst, option);
					
						//객체일때
						if(isObject) {
							//자동버튼, 재생버튼, 정지버튼, 이전버튼, 다음버튼 요소정의
							option.autoArrow = $(option.autoArrow);
							option.playArrow = $(option.playArrow);
							option.pauseArrow = $(option.pauseArrow);
							option.prevArrow = $(option.prevArrow);
							option.nextArrow = $(option.nextArrow);
							
							var autuArrowHTML = option.autoArrow.html() || '';

							//문자가 아닐때
							if(typeof option.playText !== 'string') {
								option.playText = '';
							}

							//문자가 아닐때
							if(typeof option.pauseText !== 'string') {
								option.pauseText = '';
							}

							//일시정지 상태일때
							if($thisFirst[0].slick.paused) {
								$thisFirst.slick('slickPause');
								option.autoArrow.addClass('active').text(option.playText);
							}else{
								$thisFirst.slick('slickPlay');
								option.autoArrow.removeClass('active').text(option.pauseText);
							}

							//자동버튼
							option.autoArrow.off('click.slickExtension').on('click.slickExtension', function(event) {
								var $this = $(this);

								//일시정지 상태일때
								if($thisFirst[0].slick.paused) {
									$thisFirst.slick('slickPlay');
									$this.removeClass('active').text(option.pauseText);
								}else{
									$thisFirst.slick('slickPause');
									$this.addClass('active').text(option.playText);
								}

								event.preventDefault();
							});
							
							//재생버튼
							option.playArrow.off('click.slickExtension').on('click.slickExtension', function(event) {
								option.autoArrow.removeClass('active').text(option.pauseText);
								$thisFirst.slick('slickPlay');
								event.preventDefault();
							});
							
							//일시정지 버튼
							option.pauseArrow.off('click.slickExtension').on('click.slickExtension', function(event) {
								option.autoArrow.addClass('active').text(option.playText);
								$thisFirst.slick('slickPause');
								event.preventDefault();
							});
							
							//option.pauseAfterClick가 참일때
							if(option.pauseAfterClick) {
								//이전, 재생버튼
								option.prevArrow.add(option.nextArrow).off('click.slickExtension').on('click.slickExtension', function(event) {
									$thisFirst.slick('slickPause');
									option.autoArrow.addClass('active').text(option.playText);
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
				return $thisFirst;
			};
		}else{
			throw '제이쿼리가 없습니다.';
		}
	})(window.jQuery);
}catch(error) {
	console.error(error);
}