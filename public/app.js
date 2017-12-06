// Execute JavaScript on page load
$(function() {
    // Intercept form submission and submit the form with ajax
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();
        var pn = $('#phoneNumber').val();
        var delay = parseInt($('#delay').val());
        console.log(delay);
        if (!(/^\d{11}$/.test(pn))) {
          alert('Please enter a valid phone number.');
        } else {
          var phone = '+' + pn;
          setTimeout(callNumber, delay);
        }
    });
    function callNumber() {
      var pn = '+' + $('#phoneNumber').val();
      $.ajax({
          url: '/call',
          method: 'POST',
          dataType: 'json',
          data: {
              phoneNumber: pn
          }
      }).done(function(data) {
          alert(data.message);
          $('#phoneNumber').val('');
          $('#delay').val('0');
      }).fail(function(error) {
          alert(JSON.stringify(error));
      });
    }
});
