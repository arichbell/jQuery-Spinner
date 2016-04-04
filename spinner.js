/**
 * jQuery Spinner
 *
 * @author abell - 10/28/15
 *
 * General spinner plugin that initializes a spinner based on the options that are passed in.
 * This spinner uses the font-awesome icon library for it's default spinner.  This plugin gives you the option to supply
 * any spinner you want (via custom markup/css).
 * Call $().initializeSpinner() on the element that you want the spinner to be inserted into (or want the spinner to replace).
 * If there is already a spinner initialized on/in the element you are selecting, it will be removed and reinitialized.
 * If the selector contains a reference to more than one DOM object, then only the first will be used to initialize the spinner.
 *
 * Usage:
 * $(selector).initializeSpinner(options)
 *
 * Options that are accepted (as a json object) are:
 *
 * @param {string}  spinnerClass - Classname(s) given to <i> tag to create/style spinner; if none is passed, the default 'fa fa-spinner fa-pulse' is used.
 *
 * @param {string}  spinnerClassSelector - Selector given to <i> tag to locate spinner; if none is passed, the default 'spinner' is used.
 *
 * @param {string}  spinnerTextClassSelector - Selector given to <i> tag to locate spinner text; if none is passed, the default 'spinner-text' is used;
 * spinnerTextClassSelector is not used unless options.textToAdd is used as well.
 *
 * @param {string}  spinnerContainer - Container to wrap all spinner markup in.  This includes customSpinnerMarkup; meaning that if spinnerContainer is present
 * along with customSpinnerMarkup, the spinnerContainer will be the parent.
 *
 * @param {boolean or string} replaceSelector - This options hides an element and shows a spinner in its place, until 'destorySpinner' is called; if true, replace
 * the main selector with a spinner (ie the selector in $(selector)); else pass a string, representing a selector for an element you want to replace with a spinner;
 * Once 'destroySpinner' is called, the spinner will be removed and the replaceSelector will be shown (display: block).  Although, technically the replaceSelector
 * can be anywhere in the DOM, it's best to be sure that the replaceSelector is a child of the main selector ($(selector)).
 *
 * @param {string}  textToAdd - Text to add next to spinner, inside main selector;  if textToAdd is not empty, will be put into a span will a spinnerTextClassSelector.
 * The default spinnerTextClassSelector is 'spinner-text', which is used unless one is passed into the options.
 *
 * @param {string}  customTextMarkup - HTML markup that contains spinner text;  use this option if the text needs to be customized in a particular way.  This option
 * will override textToAdd.  spinnerTextClassSelector will get added to customTextMarkup to allow for easy removal. Make sure customTextMarkup is inside of a wrapper,
 * or container, div/span (ie the length of customTextMarkup === 1).
 *
 * @param {string}  customSpinnerMarkup - HTML markup that contains spinner.  Use this option if the spinner needs to be customized in a particular way.  This option
 * will override defaultSpinnerMarkup if present.  spinnerClassSelector will be added to customSpinnerMarkup to allow for easy removal.  Make sure customTextMarkup is
 * inside of a wrapper, or container, div/span (ie the length of customSpinnerMarkup === 1).  Another option would be to provide a wrapping div in spinnerContainer.
 *
 * @param {boolean} prependText - Should the spinner be prepended by text.  If true, and textToAdd or customTextMarkup is present in the options, it will be put before
 * (prepended) the spinner markup.  By default, the text is appended after the spinner markup.
 *
 * @param {boolean} clearContainer - Should the spinner container be cleared; if true, all markup inside the main selector ($(selector)) will be removed. By default,
 * this is set to false.
 *
 * @param {string}  insertAfter - What element should the spinner markup be inserted after.  If something is passed in this option, all spinner markup (spinner and text)
 * will be insert after the element represent by the selector in insertAfter.
 *
 * @param {integer} adjustContainerHeight - Integer value of height (in pixels) to adjust spinner container. Use this if you want to simple adjust the height of the main
 * selector to accommodate the spinner.
 *
 * @param {integer} adjustContainerWidth - Integer value of width (in pixels) to adjust spinner container. Use this if you want to simple adjust the width of the main
 * selector to accommodate the spinner.
 */
(function($) {
  'use strict';

  /**
   * Spinner default options
   */
  var defaults = {
      prependText: false,
      clearContainer: false,
      spinnerClass: 'fa fa-spinner fa-pulse',
      spinnerClassSelector: 'spinner',
      spinnerTextClassSelector: 'spinner-text'
    };

  /**
   * Spinner constructor
   */
  function Spinner(element, options) {
    this.options = $.extend({}, defaults, options);
    this.element = element;
    this.init();
  }

  /**
   * Private helper function to remove spinner in passed in element
   */
  function removeSpinner($element, options) {
    $element.find('.' + options.spinnerClassSelector).remove();
    $element.find('.' + options.spinnerTextClassSelector).remove();
  }

  /**
   * Set the methods/functions on Spinner.prototype
   */
  Spinner.prototype = {
    init : function () {
      // selector that initializeSpinner was called on
      var $container = this.element,
          // using this reference for object destroy later
          mainSpinnerReference = this,
          $spinnerContainer,
          $spinnerWithTextMarkup,
          defaultSpinnerMarkup = '<i class="' + this.options.spinnerClass + '"></i>',
          // if there was textToAdd, put it in a span with a class selector; or use the customTextMarkup that the client passes in (if present)
          $textMarkup = $( (this.options.textToAdd ? '<span class="' + spinnerTextClassSelector + '">' + this.options.textToAdd + '</span>' : (this.options.customTextMarkup ? this.options.customTextMarkup : '')) ),
          // if there was custom markup passed in, use that; else use the defaultSpinnerMarkup
          $spinnerMarkup = $( (this.options.customSpinnerMarkup ? this.options.customSpinnerMarkup : defaultSpinnerMarkup) );

      // stop initialization if no container has been passed in
      if (!$container) {
        console.log('No container passed in');
        return false;
      }

      // ensure no other spinner or spinner text exists in the container
      removeSpinner($container, this.options);

      // ensure that the spinnerMarkup has "spinner" class for easy selection
      if (!$spinnerMarkup.hasClass(this.options.spinnerClassSelector)) {
        $spinnerMarkup.addClass(this.options.spinnerClassSelector);
      }

      // ensure that the $textMarkup has "spinner-text" class for easy selection
      if ($textMarkup && !$textMarkup.hasClass(this.options.spinnerTextClassSelector)) {
        $textMarkup.addClass(this.options.spinnnerTextSelector);
      }

      // by default, we want to append the text behind the spinner, unless specified in options prependText == true
      if (this.options.prependText && $textMarkup) {
        $spinnerWithTextMarkup = $textMarkup.add($spinnerMarkup);
      } else if ($textMarkup) {
        $spinnerWithTextMarkup = $spinnerMarkup.add($textMarkup);
      }

      // if a custom container was passed in, add to the container's inner HTML; else use variable to hold spinnerMarkup, but not as an HTML entity
      if (this.options.spinnerContainer) {
        $spinnerContainer = $(this.options.spinnerContainer);
        $spinnerContainer.html($spinnerWithTextMarkup);
      } else {
        $spinnerContainer = $spinnerWithTextMarkup;
      }
      
      // if clearContainer == true in options, remove container HTML
      if (this.options.clearContainer) {
        $container.html('');
      }

      // if this.options.replaceSelector is true, replace $container with spinner markup
      if (this.options.replaceSelector) {
        this.options.replaceSelector === true ? $container.after($spinnerContainer).hide() :
          $(this.options.replaceSelector).after($spinnerContainer).hide();
      } else if (this.options.prependMarkup) {
        // prepend if this.options.prependMarkup is true
        $container.prepend($spinnerContainer);
      } else if (this.options.insertAfter && $(this.options.insertAfter).length > 0) {
        // insert spinner content after element specified in insertAfter
        $container.find(this.options.insertAfter).after($spinnerContainer);
      } else {
        // append spinner container to the end
        $container.append($spinnerContainer);
      }

      // adjust the height
      if (this.options.adjustContainerHeight) {
        this.options.originalHeight = $container.height();
        $container.height(this.options.adjustContainerHeight);
      }

      // adjust the width
      if (this.options.adjustContainerWidth) {
        this.options.originalWidth = $container.width();
        $container.width(this.options.adjustContainerWidth);
      }

      /**
       * Attach destroySpinner event to the container
       */
      $container.on( "destroySpinner", function() {
        // this now refers to the DOM element and not Spinner;
        // therefore, using mainSpinnerReference to reference the main Spinner object
        var $this = $(this);

        // remove spinner
        removeSpinner($this, mainSpinnerReference.options);

        // show the main $container if replaceSelector == true or is a selector passed as a string
        if (mainSpinnerReference.options.replaceSelector === true) {
          removeSpinner($container.parent(), mainSpinnerReference.options);
          $container.show();
        } else if(typeof(mainSpinnerReference.options.replaceSelector) === 'string'){
          removeSpinner($(mainSpinnerReference.options.replaceSelector).parent(), mainSpinnerReference.options);
          $(mainSpinnerReference.options.replaceSelector).show();
        }

        // restore the height/width back to original values that were passed in
        if (mainSpinnerReference.options.adjustContainerHeight && mainSpinnerReference.options.originalWidth) {
          $this.css({'width': mainSpinnerReference.options.originalWidth});
        }
        if (mainSpinnerReference.options.adjustContainerWidth && mainSpinnerReference.options.originalHeight) {
          $this.css({'height': mainSpinnerReference.options.originalHeight});
        }
      });
    }
  }

  /**
   * Attach Spinner to jQuery function API
   */
  $.fn.initializeSpinner = function(options) {
    var spinner = new Spinner(this, options);
    /**
     * no need to wrap this in $() since it is already a jQuery object
     * returning it to allow chaining
     */
    return this;
  };
})(jQuery);
