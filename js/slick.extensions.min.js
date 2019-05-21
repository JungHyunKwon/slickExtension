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
try{!function(p){if("function"!=typeof p)throw"제이쿼리가 없습니다.";var n=p.fn.slick,o="function"==typeof n,s=navigator.userAgent.toLowerCase(),c=-1<s.indexOf("msie 7.0")||-1<s.indexOf("msie 8.0");p.fn.slick=function(){var s=this,k=s.first(),t=k[0],i=arguments[0];if(o&&t&&i){var e="string"==typeof i,u=t.slick||{};if(e||(u.unslicked&&k.slick("unslick"),(i=p.extend({},i)).autoArrow=p(i.autoArrow),i.playArrow=p(i.playArrow),i.pauseArrow=p(i.pauseArrow),i.total=p(i.total),i.totalText=i.total.text(),i.current=p(i.current),i.currentText=i.current.text(),c&&!i.isRunOnLowIE&&(i._responsive=i.responsive,i.responsive=void 0),arguments[0]=i),!u.unslicked||"unslick"!==i)try{s=n.apply(k,arguments)}catch(s){}if(!e){var d=(u=k.slick("getSlick")).options||{};function f(){u.slideCount>d.slidesToShow?(k.slick("slickPlay"),p(d.autoArrow).addClass("slick-pause").removeClass("slick-play").text(d.pauseText)):x()}function x(){k.slick("slickPause"),p(d.autoArrow).addClass("slick-play").removeClass("slick-pause").text(d.playText)}k.on("destroy.slickExtensions",function(s,t){var i=p(d.total);p(d.autoArrow).removeClass("slick-play slick-pause").add(d.playArrow).add(d.pauseArrow).removeClass("slick-arrow slick-hidden").removeAttr("tabindex aria-disabled").add(u.$prevArrow).add(u.$nextArrow).off("click.slickExtensions"),p(d.current).text(d.currentText).add(i).removeClass("slick-text"),i.text(d.totalText),k.off("afterChange.slickExtensions breakpoint.slickExtensions destroy.slickExtensions reInit.slickExtensions swipe.slickExtensions keydown.slickExtensions")}).on("afterChange.slickExtensions",function(s,t,i){var e=d.customState,n=Math.ceil(u.slideCount/d.slidesToShow)||u.slideCount,o=u.currentSlide+1;if("function"==typeof e){var c=e({current:o,total:n});c||(c={current:o,total:n}),o=c.current||o,n=c.total||n}p(d.current).text(o),p(d.total).text(n)}).on("reInit.slickExtensions breakpoint.slickExtensions",function(s,t){var i=p(u.$prevArrow),e=p(u.$nextArrow),n=p(d.autoArrow),o=p(d.playArrow),c=p(d.pauseArrow),r=n.add(o).add(c),l=i.add(e),a=r.add(l);i.hasClass("slick-hidden")&&r.addClass("slick-hidden").attr({tabindex:-1,"aria-disabled":!0}),a.off("click.slickExtensions"),r.addClass("slick-arrow").off("click.slickExtensions"),n.on("click.slickExtensions",function(s){u.paused?f():x(),s.preventDefault()}),o.on("click.slickExtensions",function(s){f(),s.preventDefault()}),c.on("click.slickExtensions",function(s){x(),s.preventDefault()}),l.css("display","").off("click.slick").on("click.slickExtensions",function(s){!0===d.pauseOnArrowClick&&x()}),p(d.current).add(d.total).addClass("slick-text"),i.on("click.slickExtensions",function(s){k.slick("slickPrev"),s.preventDefault()}),e.on("click.slickExtensions",function(s){k.slick("slickNext"),s.preventDefault()}),!0===d.dots&&p(u.$dots).css("display","").children("li").off("click.slickExtensions").on("click.slickExtensions",function(s){!0===d.dots&&!0===d.pauseOnDotsClick&&x()}),k.triggerHandler("afterChange.slickExtensions")}).on("swipe.slickExtensions",function(s,t,i){!0===d.pauseOnSwipe&&x()}).on("keydown.slickExtensions",function(s){if(!0===d.pauseOnDirectionKeyPush){var t=this.tagName,i=s.which||s.keyCode;!0!==d.accessibility||"TEXTAREA"===t||"INPUT"===t||"SELECT"===t||37!==i&&39!==i||x()}}).triggerHandler("reInit.slickExtensions"),!0===i.autoplay?f():x()}}return s}}(window.jQuery)}catch(s){console.error(s)}