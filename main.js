(function(){
  /* global VersalPlayerAPI, addClassToElement, removeClassFromElement, ChallengesIframeApi */

  // Declare a gadget class.
  var Gadget = function(options) {
    // versal interface which fires most events
    this.vi = new VersalPlayerAPI();

    // the main DOM element for attaching
    this.el = options.el;
    // the selected word
    this.wordEl = this.el.querySelector('span.adjective');

    // the gadget's configuration, consistent for anyone viewing each instance of this gadget
    this.config = {
      chosenColor: 'green',
      chosenWord: 'green'
    };

    // Internal state of the gadget. Only authors can edit gadgets
    //   - When editing, config can be changed by the author
    this.isEditable = false;

    // State of the gadget, unique to the gadget instance AND each specific learner using the gadget
    this.learnerState = {
      isBold: false
    };

    this.initialize();
  };

  // Need to configure the property sheet after attaching.
  Gadget.prototype.setupPropertySheet = function() {
    // set up a property sheet for word and color selection.
    this.vi.setPropertySheetAttributes({
      chosenColor: { type: 'Color' },
      chosenWord: { type: 'Text' }
    });
  };

  // Initialize: before the gadget is attached to the lesson's DOM.
  Gadget.prototype.initialize = function() {
    // listen to events
    this.vi.on('editableChanged', this.editableChanged.bind(this));
    this.vi.on('attributesChanged', this.attributesChanged.bind(this));
    this.vi.on('learnerStateChanged', this.learnerStateChanged.bind(this));

    this.setupPropertySheet();

    // tell Versal the gadget is ready for events
    this.vi.startListening();

    // add click listener to toggle bold font.
    this.wordEl.onclick = this.toggleBoldWord.bind(this);

    // for assets
    this.vi.on('assetSelected', function(assetData){
      var assetUrl = this.vi.assetUrl(assetData.asset.representations[0].id);

      //change local image
      this.setImagePath({
        url: assetUrl
      });

      //persist
      this.vi.setAttributes({
        chosenImage : {
          url: assetUrl,
          assetObj: assetData
        }
      });
    }.bind(this));

    // add click listener to upload new asset.
    this.el.querySelector('.button-upload-image').onclick = this.requestUpload.bind(this);

    // set gadget height.
    this.vi.setHeight(600);

    //watch body height and adjust gadget height accordingly
    this.vi.watchBodyHeight();
  };

  Gadget.prototype.requestUpload = function() {
    this.vi.requestAsset({
      type: 'image'
    });
  };

  Gadget.prototype.editableChanged = function(jsonData) {
    this.isEditable = jsonData.editable;

    // some elements have class 'authoring-only' and need to be hidden when we are in non-editable mode.
    // use css to hide those elements
    if(this.isEditable) {
      addClassToElement(this.el, 'editable');
    } else {
      removeClassFromElement(this.el, 'editable');
    }
  };


  Gadget.prototype.attributesChanged = function(jsonData) {
    // we expect only the attributes 'chosenColor', 'chosenWord', 'chosenImage'.
    if (jsonData.chosenColor) {
      this.config.chosenColor = jsonData.chosenColor;
      this.wordEl.setAttribute('style', 'color: ' + this.config.chosenColor);
    }
    if (jsonData.chosenWord) {
      this.config.chosenWord = jsonData.chosenWord;
      this.wordEl.innerHTML = this.config.chosenWord;
    }
    if (jsonData.chosenImage) {
      this.config.asset = jsonData.chosenImage;
      this.setImagePath(jsonData.chosenImage);
    }

  };

  Gadget.prototype.learnerStateChanged = function(jsonData) {
    if (jsonData && jsonData.isBold) {
      this.learnerState.isBold = jsonData.isBold;
      this.updateBoldWord();
    }
  };

  Gadget.prototype.setImagePath = function(jsonData) {
    var imageUrl = jsonData.url;
    // now we set the image src attribute to this url.
    this.el.querySelector('.sample-image').setAttribute('src', imageUrl);
  };

  Gadget.prototype.updateBoldWord = function() {
    if (this.learnerState.isBold) {
      addClassToElement(this.el, 'bold');
    } else {
      removeClassFromElement(this.el, 'bold');
    }
  };

  Gadget.prototype.toggleBoldWord = function() {
    this.learnerState.isBold = !this.learnerState.isBold;
    this.vi.setLearnerState({
      isBold: this.learnerState.isBold
    });
    this.updateBoldWord();
  };

  // Challenges API
  var challengesApi = new ChallengesIframeApi(function(response){
    document.querySelector('.response').textContent = (response.scoring.totalScore || 0);
  });

  var challenges = [
    {
      prompt: 'What is the color of the sky?',
      answers: 'blue',
      scoring: 'strict'
    }
  ];

  challengesApi.setChallenges(challenges);

  document.querySelector('.prompt').textContent = challenges[0].prompt;
  document.querySelector('.submit-challenge').addEventListener('click', function(){
    challengesApi.scoreChallenges( [document.querySelector('.my-text-area').value] );
  });

  // Finished with defining the gadget class.

  // Instantiate the gadget, pass the DOM element, start listening to events.
  new Gadget({ el: document.querySelector('body') });
  // This gadget instance will remain active because it has added itself as a listener to the window.

})();
