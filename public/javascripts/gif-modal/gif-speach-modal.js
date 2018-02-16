// Requires:
// ---Bootstrap css and js files;
// ---libgif.min.js;
// ---voice.min.js;

// <script src="./javascripts/libgif.min.js"></script>
// <script src="/javascripts/voice.min.js"></script>
// <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
// <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
// <script src="/javascripts/gif-speach-modal.js"></script>

// Add this button in your html:
// <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#speachModal">
//     Play speach
// </button>

// Fill in the object and add this within a script tag to your html:

// const info = {
//   modalTitle : 'Agile Revolution',
//   voice : 'UK English Male',
//   localArea : 'Barcelona',
//   gifUrl : '/images/manifesto.gif',
//   date : '17 February 2018',
//   address : 'Carrer de Pamplona 96, Barcelona',
//   manifesto : 'We are uncovering better ways of developing\
//         software by doing it and helping others do it.\
//         Through this work we have come to value:\
//         Individuals and interactions over processes and tools.\
//         Working software over comprehensive documentation.\
//         Customer collaboration over contract negotiation.\
//         Responding to change over following a plan.\
//         That is, while there is value in the items on\
//         the right, we value the items on the left more.',
// }

//   const Modal = new SpeachModal(info);
//   Modal.ready();

const createElementFromHTML = function (htmlString) { // Helper function that enables to transform strings into HTML elements
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild;
};

function SpeachModal (speachInfo) {
  const self = this;
  self.modalTitle = speachInfo.modalTitle;
  self.voice = speachInfo.voice;
  self.localArea = speachInfo.localArea;
  self.gifUrl = speachInfo.gifUrl;
  self.gifElement = createElementFromHTML('<img id="gifId" data-animated-src=' + self.gifUrl + ' data-autoplay="0"/>');
  self.gifObject = self.newSuperGif(self.gifElement);
  self.greetings = 'Greetings citizens of ' + self.localArea + '. ';
  self.date = speachInfo.date;
  self.address = speachInfo.address;
  self.manifesto = speachInfo.manifesto + ' ';
  self.invitation = 'Thake the red pill and join our revolution. Battle begins on the ' + self.date + ' at ' + self.address + '.Be ready, be there';
  self.message = self.greetings + self.manifesto + self.invitation;
}

// SpeachModal.prototype.locales = function(language){
//   if(language === 'English'){
//     const voice = 'UK English Male',
//   } else if(language === 'Spanish'){
//     const voice = ''
//   }

// }

SpeachModal.prototype.newSuperGif = function (el) {
  const self = this;
  const newSuperGif = new SuperGif({
    gif: el,
    includeDataURL: true,
    loop_mode: true
  });
  return newSuperGif;
};

SpeachModal.prototype.loadAndPlay = function () {
  const self = this;
  self.gifObject.load(function (err, gif) {
    if (err) { console.log(err); }
    self.gifObject.play();
    responsiveVoice.speak(self.message, self.voice, {onend: self.gifObject.pause});
  });
};

SpeachModal.prototype.cancelAll = function () {
  var self = this;
  responsiveVoice.cancel();
  self.gifObject.pause();
};

SpeachModal.prototype.eventListeners = function () {
  const self = this;
  $('#speachModal').on('shown.bs.modal', function (e) {
    self.loadAndPlay();
  });

  $('#speachModal').on('hide.bs.modal', function (e) {
    self.cancelAll();
  });
};

SpeachModal.prototype.mountModal = function () {
  var self = this;
  const modalHTML = ` <div class="modal fade" id="speachModal" tabindex="-1" role="dialog" aria-labelledby="speachModal" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLongTitle">${self.modalTitle}</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body"> 
                  <div class="box" id='gif-box'>
                       
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div> `;

  const modalElement = createElementFromHTML(modalHTML);
  document.body.appendChild(modalElement);
  const gifBoxElement = document.getElementById('gif-box');
  gifBoxElement.appendChild(self.gifElement);
};

SpeachModal.prototype.ready = function () {
  var self = this;
  self.mountModal();
  self.eventListeners();
};
