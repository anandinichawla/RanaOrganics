Stripe.setPublishableKey('pk_test_WzydRuxwMuPeRL1JTG5NSJwg00V5PVlr3C');
// const elements = stripe.elements();

var $form = $('#checkout-form'); 

$form.submit(function(event){
    $form.find('button').prop('disabled',true); 
    $('#charge-errors').addClass('d-none')

    Stripe.card.createToken({
        number: $('#card-number').val(), 
        cvc: $('#cvc').val(),
        exp_month: $('#expiry-month').val(),
        exp_year: $('#expiry-year').val(),
        name: $('#card-name').val()
    },stripeResponseHandler); 
    return false; 
}); 


function stripeResponseHandler(status, response){

    if(response.error){

        $('#charge-errors').text(response.error.message); 
        $('#charge-errors').removeClass('d-none');
        $form.find('button').prop('disabled', false); 
    }
    else{

        var token = response.id; 

        $form.append($('<input type="hidden" name="stripeToken" />').val(token)); 

        //submit the form 
        $form.get(0).submit(); 
    }

}

